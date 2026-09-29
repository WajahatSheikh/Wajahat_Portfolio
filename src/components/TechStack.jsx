import { useEffect, useRef } from "react";
import { gsap } from "../lib/gsap";
import { ctaGlow } from "../lib/ctaGlow";
import { prefersReducedMotion } from "../lib/motion";
import { techStack, sectionCopy } from "../data/content";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";
import SwipeDeck from "./ui/SwipeDeck";

function ToolCard({ tool, className = "" }) {
  const cardRef = useRef(null);
  const iconRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return undefined;
    if (prefersReducedMotion()) return undefined;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });

      tl.to(card, { y: -6, duration: 0.4 }, 0).to(
        iconRef.current,
        { scale: 1.08, rotate: -4, duration: 0.5 },
        0,
      );

      const play = () => tl.play();
      const reverse = () => tl.reverse();

      card.addEventListener("mouseenter", play);
      card.addEventListener("mouseleave", reverse);
      card.addEventListener("focusin", play);
      card.addEventListener("focusout", reverse);

      return () => {
        card.removeEventListener("mouseenter", play);
        card.removeEventListener("mouseleave", reverse);
        card.removeEventListener("focusin", play);
        card.removeEventListener("focusout", reverse);
      };
    }, card);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={cardRef}
      data-cursor="hover"
      {...ctaGlow}
      /* This is the one white section in the design, so the cards separate on
         border weight rather than fill — the same trick the Figma tool pills
         use. border-line, not border-line-subtle, or they vanish. */
      className={`card-glow bg-canvas border-line hover:border-brand/30 group flex h-full flex-col gap-4 rounded-card border p-5 transition-[border-color,box-shadow] duration-400 hover:shadow-[0_12px_32px_-12px_rgba(16,16,24,0.14)] sm:p-6 ${className}`}
    >
      <span
        ref={iconRef}
        className="bg-brand-subtle border-line-subtle flex size-12 shrink-0 items-center justify-center rounded-2xl border sm:size-14"
      >
        <img
          src={`/Tech%20Stack%20Icons/${tool.icon}.png`}
          alt=""
          loading="lazy"
          width="28"
          height="28"
          className="size-7 object-contain"
        />
      </span>

      <div className="flex flex-col gap-1.5">
        <h3 className="text-heading-sm text-ink transition-colors duration-300 group-hover:text-brand">
          {tool.name}
        </h3>
        <p className="text-body-sm text-ink-soft text-pretty">{tool.description}</p>
      </div>
    </div>
  );
}

export default function TechStack() {
  return (
    <section id="tech-stack" className="bg-canvas section-y">
      <div className="shell section-gap flex flex-col">
        <SectionHeader
          title={sectionCopy.techStack.title}
          intro={sectionCopy.techStack.intro}
          align="center"
          className="mx-auto"
        />

        {/* Phone: one swipeable row. Stacked, twelve cards ran to nearly 3000px
            of scroll before the next section — as a deck it is one screen. */}
        <SwipeDeck
          items={techStack}
          getKey={(tool) => tool.name}
          label="Tools"
          className="sm:hidden"
          renderItem={(tool) => <ToolCard tool={tool} className="h-full" />}
        />

        {/* sm and up: 2 / 3 / 4 columns. Twelve tools divide evenly into all
            three, so no breakpoint leaves a stranded card on the last row. */}
        <Reveal
          as="ul"
          stagger={0.05}
          y={30}
          className="hidden gap-4 sm:grid sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4"
        >
          {techStack.map((tool) => (
            <li key={tool.name} className="h-full">
              <ToolCard tool={tool} className="h-full" />
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
