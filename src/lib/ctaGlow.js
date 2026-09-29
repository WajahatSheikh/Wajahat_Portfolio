// Drives the cursor-tracked highlight in the `.cta-glow` utility.
//
// Writing two custom properties is the whole of it — the gradient that reads
// them lives in index.css, so the look can be retuned without touching this,
// and a control opts in with `{...ctaGlow}`.
//
// The rect is read per move rather than cached on enter: Lenis can scroll the
// page while the cursor sits still on a button, and a cached viewport-relative
// rect would be stale the moment it did. One rect read on a small element, at
// the rate the browser coalesces pointermove to, is not worth the staleness.
export const ctaGlow = {
  onPointerMove: (event) => {
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    el.style.setProperty("--mx", `${((event.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty("--my", `${((event.clientY - rect.top) / rect.height) * 100}%`);
  },
};
