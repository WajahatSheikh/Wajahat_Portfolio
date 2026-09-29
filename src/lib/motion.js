import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "./gsap";

/** Read once per call rather than cached — the OS setting can change mid-session. */
export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Scroll-linked parallax on a single element.
 *
 * Returns a ref to attach. The element travels `distance` px against the
 * scroll across its own scroll span, scrubbed rather than tweened so it
 * tracks Lenis exactly instead of easing behind it.
 *
 * `disableBelow` skips the effect on small screens: on a phone the viewport
 * is most of the section, so the travel reads as jitter rather than depth —
 * and it is the device least able to afford the repaints.
 */
export function useParallax({
  distance = 80,
  from = 0,
  disableBelow = 768,
  scaleFrom = null,
  scaleTo = null,
  start = "top bottom",
  end = "bottom top",
  trigger = null,
} = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (prefersReducedMotion()) return undefined;
    if (window.innerWidth < disableBelow) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: from, ...(scaleFrom ? { scale: scaleFrom } : {}) },
        {
          y: -distance,
          ...(scaleTo ? { scale: scaleTo } : {}),
          ease: "none",
          scrollTrigger: {
            trigger: trigger?.current ?? el,
            start,
            end,
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [distance, from, disableBelow, scaleFrom, scaleTo, start, end, trigger]);

  return ref;
}

/**
 * Word-by-word entrance for a headline.
 *
 * Splits on spaces into inline-block spans so each word can be transformed
 * without the line boxes reflowing, then restores the original markup on
 * cleanup so React never sees the mutated DOM.
 */
export function useWordReveal({ delay = 0, stagger = 0.045 } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (prefersReducedMotion()) return undefined;

    const original = el.innerHTML;

    // Wrap the words of every text node, leaving element children (the accent
    // <span>) in place so their colour survives.
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    textNodes.forEach((node) => {
      const parts = node.textContent.split(/(\s+)/);
      const frag = document.createDocumentFragment();
      parts.forEach((part) => {
        if (!part.trim()) {
          frag.appendChild(document.createTextNode(part));
          return;
        }
        const span = document.createElement("span");
        span.textContent = part;
        span.style.display = "inline-block";
        span.style.willChange = "transform, opacity, filter";
        span.dataset.word = "";
        frag.appendChild(span);
      });
      node.parentNode.replaceChild(frag, node);
    });

    const words = el.querySelectorAll("[data-word]");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { yPercent: 105, opacity: 0, filter: "blur(6px)" },
        {
          yPercent: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.9,
          delay,
          stagger,
          ease: "power3.out",
          onComplete: () => gsap.set(words, { clearProps: "willChange,filter" }),
        },
      );
    }, el);

    return () => {
      ctx.revert();
      el.innerHTML = original;
    };
  }, [delay, stagger]);

  return ref;
}

/**
 * Refresh ScrollTrigger once fonts and images have settled.
 *
 * Every trigger on this page is positioned off element geometry, and the
 * covers are unsized until they decode — without this the start/end pixels
 * are computed against a shorter page and every section fires early.
 */
export function useScrollTriggerRefresh() {
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();

    if (document.fonts?.ready) document.fonts.ready.then(refresh);
    window.addEventListener("load", refresh);

    const t = window.setTimeout(refresh, 600);

    return () => {
      window.removeEventListener("load", refresh);
      window.clearTimeout(t);
    };
  }, []);
}
