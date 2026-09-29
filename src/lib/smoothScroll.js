import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap";

export function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    /**
     * The single anchor handler for the whole page.
     *
     * Lenis owns the scroll position, so anything calling window.scrollTo in
     * parallel just fights it — every in-page link routes through here, and
     * the offset comes from the header token rather than a hardcoded number
     * that goes stale the moment the bar is resized.
     */
    const handleAnchorClick = (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute("href");
      if (id.length <= 1) return;
      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();

      // The first section starts at the top of the document; offsetting it
      // would aim above zero and leave the hero clipped under the bar.
      if (target === document.body.firstElementChild || id === "#top") {
        lenis.scrollTo(0);
        return;
      }

      // No offset here: Lenis honours the target's `scroll-margin-top`, which
      // index.css already derives from the header token. Passing an offset as
      // well applied the clearance twice and parked every section a full bar
      // and a bit too low.
      lenis.scrollTo(target);
    };
    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);
}
