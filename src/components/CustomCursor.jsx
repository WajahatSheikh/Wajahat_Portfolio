import { useEffect, useRef } from "react";
import { gsap } from "../lib/gsap";
import { prefersReducedMotion } from "../lib/motion";

export default function CustomCursor() {
  const layerRef = useRef(null);
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return undefined;
    if (prefersReducedMotion()) return undefined;

    const layer = layerRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!layer || !dot || !ring) return undefined;

    const moveDot = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3.out" });
    const moveDotY = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3.out" });
    const moveRing = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const moveRingY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });

    // Visibility is a class on the layer rather than a GSAP tween on the two
    // dots: the layer starts opacity-0 in CSS, so there is no window between
    // first paint and the first tween where a stray ring sits at 0,0.
    const onMove = (e) => {
      layer.dataset.active = "true";
      moveDot(e.clientX);
      moveDotY(e.clientY);
      moveRing(e.clientX);
      moveRingY(e.clientY);
    };

    // Delegated, so controls that mount later — every section behind a
    // ScrollTrigger — are covered without re-running this effect per render.
    const onOver = (e) => {
      if (!e.target.closest?.('[data-cursor="hover"]')) return;
      gsap.to(ring, { scale: 2.4, opacity: 0.5, duration: 0.3, ease: "power2.out" });
      gsap.to(dot, { scale: 0, duration: 0.3 });
    };
    const onOut = (e) => {
      if (!e.target.closest?.('[data-cursor="hover"]')) return;
      gsap.to(ring, { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" });
      gsap.to(dot, { scale: 1, duration: 0.3 });
    };

    // The pointer leaving the window should take the cursor with it, or it
    // freezes mid-page until the next move.
    const onLeaveWindow = () => {
      layer.dataset.active = "false";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseout", onOut, { passive: true });
    document.addEventListener("mouseleave", onLeaveWindow);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.removeEventListener("mouseleave", onLeaveWindow);
      gsap.killTweensOf([dot, ring]);
    };
  }, []);

  return (
    <div
      ref={layerRef}
      data-active="false"
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-100 hidden opacity-0 transition-opacity duration-300 data-[active=true]:opacity-100 md:block"
    >
      <div ref={ringRef} className="border-ink/30 fixed top-0 left-0 size-8 rounded-full border" />
      <div ref={dotRef} className="bg-accent fixed top-0 left-0 size-1.5 rounded-full" />
    </div>
  );
}
