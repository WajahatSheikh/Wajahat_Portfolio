import { useCallback, useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../../lib/motion";

/**
 * Horizontal snap carousel with dot indicators, for turning a long vertical
 * stack of cards into one swipeable row on small screens.
 *
 * The active index is derived from scroll position by finding the child
 * nearest the scroller's centre, rather than dividing scrollLeft by an assumed
 * card width — that keeps it correct regardless of gap, padding or a partially
 * visible last card.
 */
export default function SwipeDeck({ items, renderItem, getKey, label, className = "" }) {
  const scrollerRef = useRef(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return undefined;

    let frame = 0;
    const measure = () => {
      frame = 0;
      const kids = [...el.children];
      if (!kids.length) return;

      const mid = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      let bestDistance = Infinity;

      kids.forEach((kid, i) => {
        const centre = kid.offsetLeft + kid.offsetWidth / 2;
        const distance = Math.abs(centre - mid);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = i;
        }
      });

      setActive(best);
    };

    // Scroll fires far faster than paint; coalescing to one measurement per
    // frame keeps the dots in step without thrashing layout.
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    measure();

    return () => {
      el.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items]);

  const goTo = useCallback((index) => {
    const el = scrollerRef.current;
    const kids = el ? [...el.children] : [];
    const target = kids[index];
    if (!el || !target) return;

    // Offsets are measured against the first card so the scroller's leading
    // padding does not push every card a gutter to the left.
    el.scrollTo({
      left: target.offsetLeft - kids[0].offsetLeft,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, []);

  return (
    <div className={className}>
      <ul
        ref={scrollerRef}
        aria-label={label}
        className="no-scrollbar -mx-[var(--shell-pad)] flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--shell-pad)] pb-2"
      >
        {items.map((item, i) => (
          <li
            key={getKey(item)}
            className="w-[82vw] max-w-[340px] shrink-0 snap-start"
            aria-current={i === active ? "true" : undefined}
          >
            {renderItem(item, i)}
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center justify-center gap-1">
        {items.map((item, i) => (
          <button
            key={getKey(item)}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to ${getKey(item)}`}
            aria-current={i === active ? "true" : undefined}
            /* The visible dot is small, but the button around it is a full
               44px tall so it is still a real target. */
            className="grid min-h-11 flex-1 max-w-8 place-items-center"
          >
            <span
              className={`block h-1.5 rounded-full transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                i === active ? "bg-brand w-5" : "bg-line w-1.5"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Position announced to screen readers, which cannot see the dots. */}
      <p aria-live="polite" className="text-mono-sm font-mono text-ink-faint text-center uppercase">
        {String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
      </p>
    </div>
  );
}
