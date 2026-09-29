import { useEffect, useRef, useState } from "react";
import { gsap } from "../lib/gsap";
import { prefersReducedMotion } from "../lib/motion";
import { heroTrail } from "../data/content";

const SPAWN_DISTANCE = 165; // px of travel between thumbnails
const MAX_ALIVE = 4;
// The headline sits over these, so they never reach full strength — at 1.0 the
// brighter game covers turned the hero into noise.
const PEAK_OPACITY = 0.6;

/**
 * Project thumbnails that trail the cursor across the hero.
 *
 * A fixed pool of <img> elements is recycled rather than mounting and
 * unmounting nodes per move — at this spawn rate React reconciliation would be
 * the bottleneck, and recycled nodes keep their decoded bitmaps.
 */
export default function HeroImageTrail({ containerRef }) {
  const [armed, setArmed] = useState(false);
  const poolRef = useRef([]);
  const stateRef = useRef({ last: null, index: 0, alive: [] });

  // The eight thumbnails are ~3 MB together, so they are not part of the
  // initial payload: they load on idle, and only where the effect can run.
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    if (window.matchMedia("(pointer: coarse)").matches) return undefined;

    const idle = window.requestIdleCallback ?? ((fn) => window.setTimeout(fn, 1200));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const handle = idle(() => setArmed(true));
    return () => cancel(handle);
  }, []);

  useEffect(() => {
    if (!armed) return undefined;
    const container = containerRef?.current;
    if (!container) return undefined;

    const state = stateRef.current;
    // Captured now so cleanup kills the same nodes this effect animated.
    const pool = poolRef.current;

    const spawn = (x, y) => {
      const el = pool[state.index % pool.length];
      state.index += 1;
      if (!el) return;

      // Retire the oldest if the trail is at capacity, so the hero never
      // disappears behind a wall of mockups.
      state.alive.push(el);
      while (state.alive.length > MAX_ALIVE) {
        const old = state.alive.shift();
        gsap.to(old, { opacity: 0, scale: 0.92, duration: 0.35, ease: "power2.out" });
      }

      gsap.killTweensOf(el);
      gsap.set(el, {
        left: x,
        top: y,
        xPercent: -50,
        yPercent: -50,
        rotate: gsap.utils.random(-7, 7),
        zIndex: state.index,
      });

      gsap
        .timeline()
        .fromTo(
          el,
          { opacity: 0, scale: 0.82, y: 18 },
          { opacity: PEAK_OPACITY, scale: 1, y: 0, duration: 0.5, ease: "power3.out" },
        )
        .to(el, { opacity: 0, scale: 0.94, y: -26, duration: 0.75, ease: "power2.in" }, ">0.35");
    };

    const onMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;

      if (!state.last) {
        state.last = { x, y };
        return;
      }

      const dist = Math.hypot(x - state.last.x, y - state.last.y);
      if (dist < SPAWN_DISTANCE) return;

      state.last = { x, y };
      spawn(x, y);
    };

    const onLeave = () => {
      state.last = null;
    };

    container.addEventListener("pointermove", onMove, { passive: true });
    container.addEventListener("pointerleave", onLeave, { passive: true });

    return () => {
      container.removeEventListener("pointermove", onMove);
      container.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(pool);
    };
  }, [armed, containerRef]);

  if (!armed) return null;

  return (
    /* `isolate` is load-bearing: each thumbnail gets an incrementing z-index so
       newer ones stack over older ones, and without a stacking context here
       those values compete with the hero copy's z-10 and eventually cover it. */
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 isolate overflow-hidden"
    >
      {heroTrail.map((src, i) => (
        <img
          key={src}
          ref={(el) => (poolRef.current[i] = el)}
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          className="border-line-subtle absolute w-[clamp(170px,17vw,300px)] rounded-card border object-cover opacity-0 shadow-[0_18px_44px_-18px_rgba(16,16,24,0.35)]"
        />
      ))}
    </div>
  );
}
