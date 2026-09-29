import { useEffect, useRef, useState } from "react";
import { gsap } from "../lib/gsap";
import { prefersReducedMotion } from "../lib/motion";
import { capabilities, sectionCopy } from "../data/content";
import SectionHeader from "./SectionHeader";
import RollingText from "./ui/RollingText";
import Reveal from "./Reveal";

export default function WhatIDo() {
  const sectionRef = useRef(null);
  const listRef = useRef(null);
  const previewRef = useRef(null);
  const shownRef = useRef(false);
  const [active, setActive] = useState(null);

  /**
   * The preview is anchored to the hovered row, not to the pointer.
   *
   * It is parked against the right edge of that row's own column and centred
   * on the row vertically, so it reads as belonging to the item under the
   * cursor while leaving the number and the start of the title visible.
   *
   * Rows are found by data attribute rather than by ref because each one is a
   * `Reveal`, which owns its own ref and does not forward one.
   */
  useEffect(() => {
    const card = previewRef.current;
    const list = listRef.current;
    if (!card || !list) return;
    if (prefersReducedMotion()) return;

    if (active === null) {
      shownRef.current = false;
      gsap.to(card, {
        autoAlpha: 0,
        scale: 0.94,
        duration: 0.25,
        ease: "power3.out",
        overwrite: "auto",
      });
      return;
    }

    const row = list.querySelectorAll("[data-cap-row]")[active];
    if (!row) return;

    // offsetLeft/offsetTop are already relative to the section, which is the
    // card's positioned ancestor — same coordinate space, no conversion.
    const target = {
      x: row.offsetLeft + row.offsetWidth - card.offsetWidth / 2 - 8,
      y: row.offsetTop + row.offsetHeight / 2,
    };

    // First reveal lands in place; moving between rows slides.
    if (shownRef.current) {
      gsap.to(card, { ...target, duration: 0.45, ease: "power3.out", overwrite: "auto" });
    } else {
      gsap.set(card, target);
    }

    shownRef.current = true;
    gsap.to(card, { autoAlpha: 1, scale: 1, duration: 0.35, ease: "power3.out", overwrite: "auto" });
  }, [active]);

  const item = active === null ? null : capabilities[active];

  return (
    <section
      id="capabilities"
      ref={sectionRef}
      onPointerLeave={() => setActive(null)}
      className="bg-muted section-y relative"
    >
      {/* Preview anchored to the hovered row. Black placeholder until
          per-skill artwork lands — set `preview` on the capability to swap it
          in. Hidden below lg, where there is no hover to drive it. */}
      <div
        ref={previewRef}
        aria-hidden="true"
        className="pointer-events-none invisible absolute top-0 left-0 z-20 hidden h-[280px] w-[359px] -translate-x-1/2 -translate-y-1/2 overflow-hidden opacity-0 shadow-[0_24px_60px_-20px_rgba(16,16,24,0.45)] lg:block"
      >
        {item?.preview ? (
          <img src={item.preview} alt="" className="size-full object-cover" />
        ) : (
          <div className="bg-night flex size-full flex-col items-center justify-center gap-3 p-5 text-center">
            <span className="text-mono-sm font-mono text-white/45 uppercase">
              {active === null ? "" : String(active + 1).padStart(2, "0")}
            </span>
            <span className="text-label-md text-white/85">{item?.title}</span>
          </div>
        )}
      </div>

      <div className="shell section-gap flex flex-col">
        <SectionHeader
          title={sectionCopy.capabilities.title}
          intro={sectionCopy.capabilities.intro}
        />

        {/* A real grid rather than a wrapping flex row: grid equalises row
            heights, so the rules across the two columns stay on one line even
            when one description wraps and its neighbour does not. */}
        <ul
          ref={listRef}
          onPointerLeave={() => setActive(null)}
          className="grid grid-cols-1 gap-x-16 lg:grid-cols-2"
        >
          {capabilities.map((cap, i) => (
            <Reveal
              as="li"
              key={cap.title}
              y={24}
              delay={(i % 2) * 0.06}
              data-cap-row=""
              onPointerEnter={() => setActive(i)}
              onFocusCapture={() => setActive(i)}
              className="border-line group relative flex items-start gap-4 border-t py-5 sm:gap-5 sm:py-6"
            >
              {/* Fills from the left on hover — the row reads as one target
                  without a box appearing around it. */}
              <span
                aria-hidden="true"
                className="bg-brand/[0.06] pointer-events-none absolute inset-y-0 -inset-x-4 origin-left scale-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
              />

              <span className="text-mono-sm font-mono text-brand relative w-8 shrink-0 pt-1.5 uppercase transition-colors duration-300 group-hover:text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="relative flex min-w-0 flex-col gap-1.5">
                {/* The roll needs the title on one line; below lg these wrap,
                    and there is no hover to trigger it anyway. */}
                <h3 className="text-heading-sm text-ink">
                  <span className="hidden lg:block">
                    <RollingText text={cap.title} />
                  </span>
                  <span className="lg:hidden">{cap.title}</span>
                </h3>
                <p className="text-body-sm text-ink-soft text-pretty">{cap.description}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
