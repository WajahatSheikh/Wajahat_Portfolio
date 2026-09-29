import { useRef } from "react";
import { aboutParagraphs, badges, quickFacts, sectionCopy } from "../data/content";
import { useParallax } from "../lib/motion";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";

import gessAward from "../assets/badges/gess-award.png";
import pda from "../assets/badges/pda.png";
import nationalInnovation from "../assets/badges/national-innovation.png";
import nextBillion from "../assets/badges/next-billion.png";
import pasha from "../assets/badges/pasha.png";

const badgeImages = {
  "gess-award": gessAward,
  pda,
  "national-innovation": nationalInnovation,
  "next-billion": nextBillion,
  pasha,
};

export default function AboutMe() {
  const portraitFrame = useRef(null);
  const portraitRef = useParallax({
    distance: 50,
    from: -50,
    scaleFrom: 1.12,
    scaleTo: 1.12,
    trigger: portraitFrame,
    disableBelow: 1024,
  });

  return (
    <section id="about" className="bg-muted section-y">
      <div className="shell section-gap flex flex-col">
        <SectionHeader title={sectionCopy.about.title} />

        {/* Stacks below lg — at tablet width a second column would squeeze the
            body copy under a comfortable measure. The portrait then runs full
            width with a wider crop instead of towering over the text. */}
        <div className="grid grid-cols-1 gap-10 sm:gap-12 lg:grid-cols-[1fr_420px] lg:gap-16 xl:grid-cols-[1fr_560px] xl:gap-20">
          <div className="flex flex-col gap-8 sm:gap-10">
            <Reveal stagger={0.08} y={26} className="flex flex-col gap-5">
              {aboutParagraphs.map((paragraph, i) => (
                <p key={i} className="text-body-lg text-ink-soft text-pretty">
                  {paragraph.map((chunk, j) =>
                    chunk.bold ? (
                      <strong key={j} className="text-ink font-semibold">
                        {chunk.text}
                      </strong>
                    ) : (
                      <span key={j}>{chunk.text}</span>
                    ),
                  )}
                </p>
              ))}
            </Reveal>

            {/* A five-column grid rather than a wrapping flex row. The source
                badges are 362-370px wide over a constant 320 height, so `w-auto`
                gave every one a slightly different width — enough to break the
                rhythm and, at narrow widths, to wrap the fifth onto its own
                line. Equal cells plus object-contain keeps them on one row at
                every breakpoint and optically centred within it.

                mt-auto pins the strip to the bottom of the column so it lines
                up with the base of the portrait alongside. */}
            <Reveal
              stagger={0.06}
              y={20}
              /* Capped at the Figma size: 120px tall, which at the 37:32 source
                 ratio is 138.75px wide, so 5 cells plus four 16px gaps come to
                 758px. Wider than that and they would scale past the design;
                 narrower and they shrink together rather than wrapping. */
              /* No items-end: fractional grid columns give each badge a
                 sub-pixel different height, and bottom-aligning them then put
                 all five on slightly different baselines. Default stretch
                 makes every cell the row height, so they share one. */
              className="grid max-w-[758px] grid-cols-5 gap-3 sm:gap-4 lg:mt-auto"
            >
              {badges.map((badge) => (
                <img
                  key={badge.file}
                  src={badgeImages[badge.file]}
                  alt={badge.name}
                  title={badge.name}
                  loading="lazy"
                  className="aspect-[37/32] w-full object-contain transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-105"
                />
              ))}
            </Reveal>
          </div>

          {/* The Figma frame is named "Quick facts" but only ever held a
              photo. The facts are laid over it so the name is honest. */}
          <Reveal y={36} className="lg:sticky lg:top-[calc(var(--spacing-header)+24px)]">
            <div
              ref={portraitFrame}
              /* Portrait crop on a phone, a wide landscape crop while the
                 layout is stacked, then the Figma ratio once it sits in its
                 own column. */
              className="border-line-subtle elevation-200 relative aspect-[4/5] w-full overflow-hidden rounded-panel border sm:aspect-[16/10] lg:aspect-[560/624]"
            >
              <img
                ref={portraitRef}
                src="/Profile%20Picture.png"
                alt="Wajahat Sheikh"
                loading="lazy"
                className="will-parallax absolute inset-0 size-full object-cover object-top"
              />

              <div className="gradient-portrait pointer-events-none absolute inset-0" />

              <dl className="glass-card absolute inset-x-3 bottom-3 grid grid-cols-2 gap-x-4 gap-y-2.5 rounded-card p-4 sm:inset-x-4 sm:bottom-4 sm:p-5">
                {quickFacts.map((fact, i) => (
                  <div
                    key={fact.label}
                    /* An odd count leaves a hole in the last row — the final
                       fact spans it instead. */
                    className={`flex flex-col gap-0.5 ${
                      i === quickFacts.length - 1 && quickFacts.length % 2 ? "col-span-2" : ""
                    }`}
                  >
                    <dt className="text-mono-sm font-mono text-brand uppercase">
                      {fact.label}
                    </dt>
                    <dd className="text-label-md text-ink">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
