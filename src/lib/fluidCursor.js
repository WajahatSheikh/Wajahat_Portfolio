/**
 * Cursor-driven fluid simulation (Stam's stable fluids, GPU).
 *
 * Reference: bleibtgleich.dev, where a one-viewport WebGL canvas sits behind
 * the hero and the pointer pushes soft dye trails around. Same structure here:
 * the canvas is scoped to the hero, not the page, and the header floats over it.
 *
 * Each frame runs: advect velocity -> compute curl -> apply vorticity ->
 * compute divergence -> Jacobi-solve pressure -> subtract gradient -> advect
 * dye. Pointer movement injects a velocity impulse and a dye blob ("splat").
 *
 * Deliberately trimmed against the well-known reference implementation: no
 * bloom and no sunray passes. Both are the expensive half of that shader set
 * and neither reads on a pale surface like this hero.
 */

const DEFAULTS = {
  SIM_RESOLUTION: 128,
  DYE_RESOLUTION: 1024,
  DENSITY_DISSIPATION: 3.2,
  VELOCITY_DISSIPATION: 2.0,
  PRESSURE: 0.8,
  PRESSURE_ITERATIONS: 20,
  CURL: 24,
  SPLAT_RADIUS: 0.2,
  SPLAT_FORCE: 6000,
  // Brand-tinted rather than the reference's grey, and low-intensity so the
  // hero type stays the loudest thing on the screen. Swap this array to
  // restyle the whole effect.
  PALETTE: [
    [0.28, 0.22, 1.0], // brand indigo  #4737ff
    [0.67, 0.65, 1.0], // brand violet  #aca5ff
    [0.21, 0.16, 0.75], // brand strong #3529bf
    [0.97, 0.36, 0.01], // accent       #f75c03 (rare, adds warmth)
  ],
  ACCENT_CHANCE: 0.12,
  INTENSITY: 0.16,
  SEED_SPLATS: 6,
};

/* ── GL plumbing ───────────────────────────────────────────────────────── */

function getContext(canvas) {
  const params = {
    alpha: true,
    depth: false,
    stencil: false,
    antialias: false,
    preserveDrawingBuffer: false,
    powerPreference: "low-power",
  };

  let gl = canvas.getContext("webgl2", params);
  const isWebGL2 = !!gl;
  if (!gl) gl = canvas.getContext("webgl", params) || canvas.getContext("experimental-webgl", params);
  if (!gl) return null;

  let halfFloat;
  let supportLinearFiltering;
  if (isWebGL2) {
    gl.getExtension("EXT_color_buffer_float");
    supportLinearFiltering = gl.getExtension("OES_texture_float_linear");
  } else {
    halfFloat = gl.getExtension("OES_texture_half_float");
    supportLinearFiltering = gl.getExtension("OES_texture_half_float_linear");
  }

  const halfFloatTexType = isWebGL2 ? gl.HALF_FLOAT : halfFloat?.HALF_FLOAT_OES;
  if (!halfFloatTexType) return null;

  const supported = (internalFormat, format) => {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, halfFloatTexType, null);

    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;

    gl.deleteTexture(texture);
    gl.deleteFramebuffer(fbo);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return ok;
  };

  let formatRGBA;
  let formatRG;
  let formatR;

  if (isWebGL2) {
    formatRGBA = supported(gl.RGBA16F, gl.RGBA) ? { internalFormat: gl.RGBA16F, format: gl.RGBA } : null;
    formatRG = supported(gl.RG16F, gl.RG) ? { internalFormat: gl.RG16F, format: gl.RG } : formatRGBA;
    formatR = supported(gl.R16F, gl.RED) ? { internalFormat: gl.R16F, format: gl.RED } : formatRGBA;
  } else {
    formatRGBA = { internalFormat: gl.RGBA, format: gl.RGBA };
    formatRG = formatRGBA;
    formatR = formatRGBA;
  }

  if (!formatRGBA) return null;

  return { gl, halfFloatTexType, formatRGBA, formatRG, formatR, supportLinearFiltering: !!supportLinearFiltering };
}

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    // A driver that rejects a shader is not recoverable — the caller bails and
    // the hero simply renders without the effect.
    throw new Error(gl.getShaderInfoLog(shader) ?? "shader compile failed");
  }
  return shader;
}

function makeProgram(gl, vert, frag) {
  const program = gl.createProgram();
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) ?? "program link failed");
  }

  const uniforms = {};
  const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < count; i++) {
    const name = gl.getActiveUniform(program, i).name;
    uniforms[name] = gl.getUniformLocation(program, name);
  }
  return { program, uniforms };
}

/* ── Shaders ───────────────────────────────────────────────────────────── */

const BASE_VERT = `
  precision highp float;
  attribute vec2 aPosition;
  varying vec2 vUv, vL, vR, vT, vB;
  uniform vec2 texelSize;
  void main () {
    vUv = aPosition * 0.5 + 0.5;
    vL = vUv - vec2(texelSize.x, 0.0);
    vR = vUv + vec2(texelSize.x, 0.0);
    vT = vUv + vec2(0.0, texelSize.y);
    vB = vUv - vec2(0.0, texelSize.y);
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const COPY_FRAG = `
  precision mediump float;
  precision mediump sampler2D;
  varying highp vec2 vUv;
  uniform sampler2D uTexture;
  void main () { gl_FragColor = texture2D(uTexture, vUv); }
`;

const CLEAR_FRAG = `
  precision mediump float;
  precision mediump sampler2D;
  varying highp vec2 vUv;
  uniform sampler2D uTexture;
  uniform float value;
  void main () { gl_FragColor = value * texture2D(uTexture, vUv); }
`;

// Alpha is driven by the dye's own strength so the canvas can sit transparent
// over the hero's fill instead of painting its own background.
const DISPLAY_FRAG = `
  precision highp float;
  precision highp sampler2D;
  varying vec2 vUv;
  uniform sampler2D uTexture;
  void main () {
    vec3 c = texture2D(uTexture, vUv).rgb;
    float a = clamp(max(c.r, max(c.g, c.b)), 0.0, 1.0);
    gl_FragColor = vec4(c, a);
  }
`;

const SPLAT_FRAG = `
  precision highp float;
  precision highp sampler2D;
  varying vec2 vUv;
  uniform sampler2D uTarget;
  uniform float aspectRatio;
  uniform vec3 color;
  uniform vec2 point;
  uniform float radius;
  void main () {
    vec2 p = vUv - point.xy;
    p.x *= aspectRatio;
    vec3 splat = exp(-dot(p, p) / radius) * color;
    vec3 base = texture2D(uTarget, vUv).xyz;
    gl_FragColor = vec4(base + splat, 1.0);
  }
`;

const ADVECTION_FRAG = `
  precision highp float;
  precision highp sampler2D;
  varying vec2 vUv;
  uniform sampler2D uVelocity;
  uniform sampler2D uSource;
  uniform vec2 texelSize;
  uniform vec2 dyeTexelSize;
  uniform float dt;
  uniform float dissipation;

  vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
    vec2 st = uv / tsize - 0.5;
    vec2 iuv = floor(st);
    vec2 fuv = fract(st);
    vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
    vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
    vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
    vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
    return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
  }

  void main () {
  #ifdef MANUAL_FILTERING
    vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
    vec4 result = bilerp(uSource, coord, dyeTexelSize);
  #else
    vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
    vec4 result = texture2D(uSource, coord);
  #endif
    float decay = 1.0 + dissipation * dt;
    gl_FragColor = result / decay;
  }
`;

const DIVERGENCE_FRAG = `
  precision mediump float;
  precision mediump sampler2D;
  varying highp vec2 vUv, vL, vR, vT, vB;
  uniform sampler2D uVelocity;
  void main () {
    float L = texture2D(uVelocity, vL).x;
    float R = texture2D(uVelocity, vR).x;
    float T = texture2D(uVelocity, vT).y;
    float B = texture2D(uVelocity, vB).y;
    vec2 C = texture2D(uVelocity, vUv).xy;
    if (vL.x < 0.0) { L = -C.x; }
    if (vR.x > 1.0) { R = -C.x; }
    if (vT.y > 1.0) { T = -C.y; }
    if (vB.y < 0.0) { B = -C.y; }
    gl_FragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
  }
`;

const CURL_FRAG = `
  precision mediump float;
  precision mediump sampler2D;
  varying highp vec2 vUv, vL, vR, vT, vB;
  uniform sampler2D uVelocity;
  void main () {
    float L = texture2D(uVelocity, vL).y;
    float R = texture2D(uVelocity, vR).y;
    float T = texture2D(uVelocity, vT).x;
    float B = texture2D(uVelocity, vB).x;
    gl_FragColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
  }
`;

const VORTICITY_FRAG = `
  precision highp float;
  precision highp sampler2D;
  varying vec2 vUv, vL, vR, vT, vB;
  uniform sampler2D uVelocity;
  uniform sampler2D uCurl;
  uniform float curl;
  uniform float dt;
  void main () {
    float L = texture2D(uCurl, vL).x;
    float R = texture2D(uCurl, vR).x;
    float T = texture2D(uCurl, vT).x;
    float B = texture2D(uCurl, vB).x;
    float C = texture2D(uCurl, vUv).x;
    vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
    force /= length(force) + 0.0001;
    force *= curl * C;
    force.y *= -1.0;
    vec2 velocity = texture2D(uVelocity, vUv).xy + force * dt;
    velocity = min(max(velocity, -1000.0), 1000.0);
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`;

const PRESSURE_FRAG = `
  precision mediump float;
  precision mediump sampler2D;
  varying highp vec2 vUv, vL, vR, vT, vB;
  uniform sampler2D uPressure;
  uniform sampler2D uDivergence;
  void main () {
    float L = texture2D(uPressure, vL).x;
    float R = texture2D(uPressure, vR).x;
    float T = texture2D(uPressure, vT).x;
    float B = texture2D(uPressure, vB).x;
    float divergence = texture2D(uDivergence, vUv).x;
    gl_FragColor = vec4((L + R + B + T - divergence) * 0.25, 0.0, 0.0, 1.0);
  }
`;

const GRADIENT_FRAG = `
  precision mediump float;
  precision mediump sampler2D;
  varying highp vec2 vUv, vL, vR, vT, vB;
  uniform sampler2D uPressure;
  uniform sampler2D uVelocity;
  void main () {
    float L = texture2D(uPressure, vL).x;
    float R = texture2D(uPressure, vR).x;
    float T = texture2D(uPressure, vT).x;
    float B = texture2D(uPressure, vB).x;
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    velocity.xy -= vec2(R - L, T - B);
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`;

/* ── Public entry ──────────────────────────────────────────────────────── */

export function createFluidCursor(canvas, options = {}) {
  const config = { ...DEFAULTS, ...options };
  const ctx = getContext(canvas);
  if (!ctx) return () => {};

  const { gl, halfFloatTexType, formatRGBA, formatRG, formatR, supportLinearFiltering } = ctx;
  const filtering = supportLinearFiltering ? gl.LINEAR : gl.NEAREST;

  let programs;
  try {
    const vert = compile(gl, gl.VERTEX_SHADER, BASE_VERT);
    const frag = (src) => compile(gl, gl.FRAGMENT_SHADER, src);
    programs = {
      copy: makeProgram(gl, vert, frag(COPY_FRAG)),
      clear: makeProgram(gl, vert, frag(CLEAR_FRAG)),
      splat: makeProgram(gl, vert, frag(SPLAT_FRAG)),
      advection: makeProgram(
        gl,
        vert,
        frag(supportLinearFiltering ? ADVECTION_FRAG : `#define MANUAL_FILTERING\n${ADVECTION_FRAG}`),
      ),
      divergence: makeProgram(gl, vert, frag(DIVERGENCE_FRAG)),
      curl: makeProgram(gl, vert, frag(CURL_FRAG)),
      vorticity: makeProgram(gl, vert, frag(VORTICITY_FRAG)),
      pressure: makeProgram(gl, vert, frag(PRESSURE_FRAG)),
      gradient: makeProgram(gl, vert, frag(GRADIENT_FRAG)),
      display: makeProgram(gl, vert, frag(DISPLAY_FRAG)),
    };
  } catch {
    return () => {};
  }

  // Fullscreen triangle pair, reused by every pass.
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
  const elements = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elements);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);

  const blit = (target) => {
    if (target == null) {
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    } else {
      gl.viewport(0, 0, target.width, target.height);
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
    }
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  };

  // Tracked so teardown can delete them individually. Cleanup must NOT use
  // WEBGL_lose_context: getContext() hands back the *same* context object for
  // a given canvas, so a lost one poisons the element permanently — and under
  // StrictMode the immediate remount would then find a dead context, fail to
  // compile, and silently render nothing.
  const textures = [];
  const framebuffers = [];

  const createFBO = (w, h, internalFormat, format, type, param) => {
    gl.activeTexture(gl.TEXTURE0);
    const texture = gl.createTexture();
    textures.push(texture);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);

    const fbo = gl.createFramebuffer();
    framebuffers.push(fbo);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.viewport(0, 0, w, h);
    gl.clear(gl.COLOR_BUFFER_BIT);

    return {
      texture,
      fbo,
      width: w,
      height: h,
      texelSizeX: 1 / w,
      texelSizeY: 1 / h,
      attach(id) {
        gl.activeTexture(gl.TEXTURE0 + id);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        return id;
      },
    };
  };

  const createDoubleFBO = (w, h, internalFormat, format, type, param) => ({
    read: createFBO(w, h, internalFormat, format, type, param),
    write: createFBO(w, h, internalFormat, format, type, param),
    swap() {
      const t = this.read;
      this.read = this.write;
      this.write = t;
    },
  });

  const getResolution = (resolution) => {
    let aspect = gl.drawingBufferWidth / gl.drawingBufferHeight;
    if (aspect < 1) aspect = 1 / aspect;
    const min = Math.round(resolution);
    const max = Math.round(resolution * aspect);
    return gl.drawingBufferWidth > gl.drawingBufferHeight
      ? { width: max, height: min }
      : { width: min, height: max };
  };

  let dye;
  let velocity;
  let divergence;
  let curlFBO;
  let pressure;

  const initFramebuffers = () => {
    const simRes = getResolution(config.SIM_RESOLUTION);
    const dyeRes = getResolution(config.DYE_RESOLUTION);

    dye = createDoubleFBO(dyeRes.width, dyeRes.height, formatRGBA.internalFormat, formatRGBA.format, halfFloatTexType, filtering);
    velocity = createDoubleFBO(simRes.width, simRes.height, formatRG.internalFormat, formatRG.format, halfFloatTexType, filtering);
    divergence = createFBO(simRes.width, simRes.height, formatR.internalFormat, formatR.format, halfFloatTexType, gl.NEAREST);
    curlFBO = createFBO(simRes.width, simRes.height, formatR.internalFormat, formatR.format, halfFloatTexType, gl.NEAREST);
    pressure = createDoubleFBO(simRes.width, simRes.height, formatR.internalFormat, formatR.format, halfFloatTexType, gl.NEAREST);
  };

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.floor(canvas.clientWidth * dpr);
    const h = Math.floor(canvas.clientHeight * dpr);
    if (w === 0 || h === 0) return false;
    if (canvas.width === w && canvas.height === h) return false;
    canvas.width = w;
    canvas.height = h;
    return true;
  };

  resize();
  initFramebuffers();

  /* ── Pointer ─────────────────────────────────────────────────────────── */

  const pointer = { x: 0, y: 0, dx: 0, dy: 0, down: false, moved: false, color: [0, 0, 0] };

  const pickColor = () => {
    const useAccent = Math.random() < config.ACCENT_CHANCE;
    const pool = useAccent
      ? [config.PALETTE[config.PALETTE.length - 1]]
      : config.PALETTE.slice(0, -1);
    const c = pool[Math.floor(Math.random() * pool.length)];
    return [c[0] * config.INTENSITY, c[1] * config.INTENSITY, c[2] * config.INTENSITY];
  };

  pointer.color = pickColor();

  let seeded = false;

  const onPointerMove = (e) => {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const x = (e.clientX - rect.left) / rect.width;
    const y = 1 - (e.clientY - rect.top) / rect.height;
    const inside = x >= 0 && x <= 1 && y >= 0 && y <= 1;

    // Aspect-corrected, so a horizontal flick and a vertical one covering the
    // same screen distance push the same amount of fluid.
    pointer.dx = (x - pointer.x) * 5 * (rect.width / rect.height);
    pointer.dy = (y - pointer.y) * 5;
    pointer.x = x;
    pointer.y = y;

    // The first sample, and any re-entry after the pointer has been outside,
    // would otherwise produce a delta measured from a stale position and fire
    // one enormous splat.
    if (!seeded || !inside) {
      seeded = inside;
      pointer.moved = false;
      return;
    }

    pointer.moved = pointer.dx !== 0 || pointer.dy !== 0;
  };

  const onPointerDown = () => {
    pointer.color = pickColor();
  };

  // Listening on window rather than the canvas: the header, hero type and CTAs
  // all sit above it, and pointer events on those must still stir the fluid.
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("pointerdown", onPointerDown, { passive: true });

  /* ── Passes ──────────────────────────────────────────────────────────── */

  const bindProgram = ({ program }) => gl.useProgram(program);

  const splat = (x, y, dx, dy, color) => {
    bindProgram(programs.splat);
    gl.uniform1i(programs.splat.uniforms.uTarget, velocity.read.attach(0));
    gl.uniform1f(programs.splat.uniforms.aspectRatio, canvas.width / canvas.height);
    gl.uniform2f(programs.splat.uniforms.point, x, y);
    gl.uniform3f(programs.splat.uniforms.color, dx, dy, 0);
    gl.uniform1f(
      programs.splat.uniforms.radius,
      (config.SPLAT_RADIUS / 100) * (canvas.width / canvas.height > 1 ? canvas.width / canvas.height : 1),
    );
    blit(velocity.write);
    velocity.swap();

    gl.uniform1i(programs.splat.uniforms.uTarget, dye.read.attach(0));
    gl.uniform3f(programs.splat.uniforms.color, color[0], color[1], color[2]);
    blit(dye.write);
    dye.swap();
  };

  const step = (dt) => {
    gl.disable(gl.BLEND);

    bindProgram(programs.curl);
    gl.uniform2f(programs.curl.uniforms.texelSize, velocity.read.texelSizeX, velocity.read.texelSizeY);
    gl.uniform1i(programs.curl.uniforms.uVelocity, velocity.read.attach(0));
    blit(curlFBO);

    bindProgram(programs.vorticity);
    gl.uniform2f(programs.vorticity.uniforms.texelSize, velocity.read.texelSizeX, velocity.read.texelSizeY);
    gl.uniform1i(programs.vorticity.uniforms.uVelocity, velocity.read.attach(0));
    gl.uniform1i(programs.vorticity.uniforms.uCurl, curlFBO.attach(1));
    gl.uniform1f(programs.vorticity.uniforms.curl, config.CURL);
    gl.uniform1f(programs.vorticity.uniforms.dt, dt);
    blit(velocity.write);
    velocity.swap();

    bindProgram(programs.divergence);
    gl.uniform2f(programs.divergence.uniforms.texelSize, velocity.read.texelSizeX, velocity.read.texelSizeY);
    gl.uniform1i(programs.divergence.uniforms.uVelocity, velocity.read.attach(0));
    blit(divergence);

    bindProgram(programs.clear);
    gl.uniform1i(programs.clear.uniforms.uTexture, pressure.read.attach(0));
    gl.uniform1f(programs.clear.uniforms.value, config.PRESSURE);
    blit(pressure.write);
    pressure.swap();

    bindProgram(programs.pressure);
    gl.uniform2f(programs.pressure.uniforms.texelSize, velocity.read.texelSizeX, velocity.read.texelSizeY);
    gl.uniform1i(programs.pressure.uniforms.uDivergence, divergence.attach(0));
    for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
      gl.uniform1i(programs.pressure.uniforms.uPressure, pressure.read.attach(1));
      blit(pressure.write);
      pressure.swap();
    }

    bindProgram(programs.gradient);
    gl.uniform2f(programs.gradient.uniforms.texelSize, velocity.read.texelSizeX, velocity.read.texelSizeY);
    gl.uniform1i(programs.gradient.uniforms.uPressure, pressure.read.attach(0));
    gl.uniform1i(programs.gradient.uniforms.uVelocity, velocity.read.attach(1));
    blit(velocity.write);
    velocity.swap();

    bindProgram(programs.advection);
    gl.uniform2f(programs.advection.uniforms.texelSize, velocity.read.texelSizeX, velocity.read.texelSizeY);
    if (!supportLinearFiltering) {
      gl.uniform2f(programs.advection.uniforms.dyeTexelSize, velocity.read.texelSizeX, velocity.read.texelSizeY);
    }
    const velocityId = velocity.read.attach(0);
    gl.uniform1i(programs.advection.uniforms.uVelocity, velocityId);
    gl.uniform1i(programs.advection.uniforms.uSource, velocityId);
    gl.uniform1f(programs.advection.uniforms.dt, dt);
    gl.uniform1f(programs.advection.uniforms.dissipation, config.VELOCITY_DISSIPATION);
    blit(velocity.write);
    velocity.swap();

    if (!supportLinearFiltering) {
      gl.uniform2f(programs.advection.uniforms.dyeTexelSize, dye.read.texelSizeX, dye.read.texelSizeY);
    }
    gl.uniform1i(programs.advection.uniforms.uVelocity, velocity.read.attach(0));
    gl.uniform1i(programs.advection.uniforms.uSource, dye.read.attach(1));
    gl.uniform1f(programs.advection.uniforms.dissipation, config.DENSITY_DISSIPATION);
    blit(dye.write);
    dye.swap();
  };

  const render = () => {
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    bindProgram(programs.display);
    gl.uniform1i(programs.display.uniforms.uTexture, dye.read.attach(0));
    blit(null);
  };

  /* ── Loop ────────────────────────────────────────────────────────────── */

  // A few splats at rest, so the hero carries some drift before the visitor
  // has moved the pointer at all.
  for (let i = 0; i < config.SEED_SPLATS; i++) {
    const c = pickColor();
    splat(
      Math.random(),
      Math.random(),
      1000 * (Math.random() - 0.5),
      1000 * (Math.random() - 0.5),
      [c[0] * 6, c[1] * 6, c[2] * 6],
    );
  }

  let last = performance.now();
  let raf = 0;
  let running = true;

  const frame = () => {
    if (!running) return;

    const now = performance.now();
    // Clamped so a backgrounded tab or a long GC pause cannot hand the solver
    // a huge dt and blow the simulation up on the next frame.
    const dt = Math.min((now - last) / 1000, 0.0166);
    last = now;

    if (resize()) initFramebuffers();

    if (pointer.moved) {
      pointer.moved = false;
      splat(pointer.x, pointer.y, pointer.dx * config.SPLAT_FORCE, pointer.dy * config.SPLAT_FORCE, pointer.color);
    }

    step(dt);
    render();
    raf = requestAnimationFrame(frame);
  };

  raf = requestAnimationFrame(frame);

  // Stop entirely when the hero is scrolled away or the tab is hidden — this
  // is a full-screen GPU pass and there is no reason to pay for it unseen.
  const setRunning = (next) => {
    if (next === running) return;
    running = next;
    if (running) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    } else {
      cancelAnimationFrame(raf);
    }
  };

  const observer = new IntersectionObserver(
    ([entry]) => setRunning(entry.isIntersecting && !document.hidden),
    { threshold: 0 },
  );
  observer.observe(canvas);

  const onVisibility = () => setRunning(!document.hidden);
  document.addEventListener("visibilitychange", onVisibility);

  return () => {
    running = false;
    cancelAnimationFrame(raf);
    observer.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerdown", onPointerDown);

    framebuffers.forEach((f) => gl.deleteFramebuffer(f));
    textures.forEach((t) => gl.deleteTexture(t));
    Object.values(programs).forEach(({ program }) => gl.deleteProgram(program));
    gl.deleteBuffer(buffer);
    gl.deleteBuffer(elements);
  };
}
