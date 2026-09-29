import { Quote } from "lucide-react";
import { testimonials, sectionCopy } from "../data/content";
import { ctaGlow } from "../lib/ctaGlow";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";

function TestimonialCard({ t, className = "" }) {
  return (
    <figure
      {...ctaGlow}
      data-cursor="hover"
      className={`card-glow bg-canvas border-line-subtle hover:border-brand/25 group flex flex-col gap-4 rounded-card border p-5 transition-[border-color,box-shadow,transform] duration-400 hover:-translate-y-1.5 hover:shadow-[0_12px_32px_-12px_rgba(16,16,24,0.14)] sm:p-6 ${className}`}
    >
      <Quote
        size={22}
        aria-hidden="true"
        className="text-brand/25 group-hover:text-brand/50 shrink-0 transition-colors duration-400"
      />

      <blockquote className="text-body-sm text-ink-soft text-pretty">{t.quote}</blockquote>

      <figcaption className="border-line-subtle mt-auto flex items-center gap-3 border-t pt-4">
        <img
          src={`/Testimonials/${encodeURIComponent(t.avatar)}.png`}
          alt=""
          loading="lazy"
          width="44"
          height="44"
          className="border-line-subtle size-11 shrink-0 rounded-full border object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="min-w-0">
          <p className="text-heading-sm text-ink truncate">{t.name}</p>
          <p className="text-body-sm text-ink-faint truncate">{t.title}</p>
        </div>
      </figcaption>
    </figure>
  );
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-muted section-y">
      <div className="shell section-gap flex flex-col">
        <SectionHeader
          title={sectionCopy.testimonials.title}
          intro={sectionCopy.testimonials.intro}
          align="center"
          className="mx-auto"
        />

        {/* Phone: a snap carousel, so nine long quotes do not turn into a
            two-screen scroll before the contact CTA. */}
        <div className="-mx-[var(--shell-pad)] sm:hidden">
          <ul className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--shell-pad)] pb-2">
            {testimonials.map((t) => (
              <li key={t.name} className="w-[82vw] max-w-[340px] shrink-0 snap-start">
                <TestimonialCard t={t} className="h-full" />
              </li>
            ))}
          </ul>
          <p className="text-mono-sm font-mono text-ink-faint mt-4 text-center uppercase">
            Swipe
          </p>
        </div>

        {/* Tablet and up: masonry columns, so cards of very different quote
            lengths pack without a ragged row of whitespace. */}
        <div className="hidden gap-5 sm:block sm:columns-2 lg:columns-3">
          {testimonials.map((t, i) => (
            <Reveal
              key={t.name}
              delay={(i % 3) * 0.07}
              y={28}
              className="mb-5 block break-inside-avoid"
            >
              <TestimonialCard t={t} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
