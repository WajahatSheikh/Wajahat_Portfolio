import { useEffect, useRef } from "react";
import { Phone, ChevronDown } from "lucide-react";
import { gsap } from "../lib/gsap";
import { prefersReducedMotion, useWordReveal } from "../lib/motion";
import { hero } from "../data/content";
import { useContact } from "../context/ContactContext";
import FluidCursor from "./FluidCursor";
import HeroImageTrail from "./HeroImageTrail";
import Button from "./ui/Button";

export default function Hero() {
  const { openContact } = useContact();
  const sectionRef = useRef(null);
  const chipRef = useRef(null);
  const ctaRef = useRef(null);
  const headlineRef = useWordReveal({ delay: 0.15, stagger: 0.04 });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;
    if (prefersReducedMotion()) return undefined;

    const ctx = gsap.context(() => {
      // Entrance: the chip leads, the headline reveals word by word on its
      // own timer, the CTAs land last.
      gsap.from(chipRef.current, {
        y: 18,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
      });
      gsap.from(ctaRef.current.children, {
        y: 20,
        opacity: 0,
        duration: 0.7,
        delay: 0.55,
        stagger: 0.09,
        ease: "power3.out",
      });

      // Parallax: the hero lags the scroll and dims as it leaves, so the work
      // grid below feels like it is sliding over it rather than after it.
      gsap.to([chipRef.current, headlineRef.current, ctaRef.current], {
        y: 110,
        opacity: 0.15,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, [headlineRef]);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="bg-muted relative isolate overflow-hidden pt-header"
    >
      {/* Stacked back to front: fluid, thumbnail trail, then the type. */}
      <FluidCursor />
      <HeroImageTrail containerRef={sectionRef} />

      <div className="relative z-10 shell flex flex-col items-center gap-5 py-14 text-center sm:gap-6 sm:py-20">
        {/* Meta chip — stacks to two rows on narrow phones rather than
            shrinking the type below 12px. */}
        <div
          ref={chipRef}
          className="glass-chip flex flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-full px-4 py-2"
        >
          {hero.meta.map((item, i) => (
            <span key={item} className="flex items-center gap-3">
              {i > 0 && (
                <span aria-hidden="true" className="bg-brand/60 size-1 rounded-full" />
              )}
              <span className="text-label-sm text-ink">{item}</span>
            </span>
          ))}
        </div>

        {/* The measure is set in `ch`, not px, so it scales with the fluid
            font size and holds the same ~3-line shape from laptop up instead
            of only at one breakpoint. Below that the container is narrower
            than 36ch and the line count grows on its own, which is the right
            behaviour — three lines on a phone would need ~9px type.

            text-balance evens the line lengths so the last line is never a
            single orphaned word. */}
        <h1
          ref={headlineRef}
          /* No weight utility — `text-display-xl` carries ExtraBold itself, the
             way every token in this ramp carries its own weight. */
          className="text-display-xl font-display text-ink max-w-[36ch] text-balance"
        >
          {hero.headline.map((part, i) =>
            part.accent ? (
              <span key={i} className="text-accent">
                {part.text}
              </span>
            ) : (
              <span key={i}>{part.text}</span>
            ),
          )}
        </h1>

        <div
          ref={ctaRef}
          className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-6"
        >
          <Button variant="accent" size="md" icon={Phone} onClick={openContact}>
            Contact Me
          </Button>

          <Button
            as="a"
            href="#work"
            variant="glass"
            size="md"
            icon={ChevronDown}
            iconPosition="right"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("work")?.scrollIntoView({
                behavior: prefersReducedMotion() ? "auto" : "smooth",
              });
            }}
          >
            Client Work
          </Button>
        </div>
      </div>
    </section>
  );
}
