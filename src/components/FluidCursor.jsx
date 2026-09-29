import { useEffect, useRef } from "react";
import { createFluidCursor } from "../lib/fluidCursor";
import { prefersReducedMotion } from "../lib/motion";

/**
 * The pointer-driven fluid layer behind the hero.
 *
 * Scoped to one section rather than the page, matching the reference: the
 * simulation is a full-viewport GPU pass every frame, and there is no reason
 * to keep paying for it behind eleven screens of content. The solver stops
 * itself when the canvas leaves the viewport.
 */
export default function FluidCursor({ className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    // Nothing to drive it without a fine pointer, and the whole effect is
    // decoration — both are hard skips rather than degraded versions.
    if (prefersReducedMotion()) return undefined;
    if (window.matchMedia("(pointer: coarse)").matches) return undefined;

    const destroy = createFluidCursor(canvas);
    return destroy;
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 size-full ${className}`}
    />
  );
}
