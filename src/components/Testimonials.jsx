import { MoreHorizontal } from "lucide-react";
import { testimonials } from "../data/content";
import Reveal from "./Reveal";

function TestimonialCard({ t, className = "" }) {
  return (
    <div
      className={`flex shrink-0 flex-col gap-3 rounded-xl bg-white p-5 shadow-[0_1px_2px_rgba(12,12,13,0.1),0_1px_2px_rgba(12,12,13,0.05)] ${className}`}
    >
      <img
        src={`/Testimonials/${t.avatar}.png`}
        alt={t.name}
        className="size-10 rounded-full object-cover"
      />
      <div className="flex flex-col gap-2">
        <div>
          <p className="font-geist text-xl font-medium text-heading capitalize">{t.name}</p>
          <p className="font-geist text-sm text-heading">{t.title}</p>
        </div>
        <p className="font-geist text-sm leading-relaxed text-muted">{t.quote}</p>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-surface-soft py-16 sm:px-5 md:px-10 md:py-24 xl:px-[160px]">
      <div className="mx-auto max-w-[1920px]">
        <Reveal className="max-w-2xl px-5 sm:px-0">
          <h2 className="font-tiempos text-3xl text-heading md:text-[40px]">
            Clients, Colleagues &amp; Founders
          </h2>
          <p className="mt-4 font-geist text-base leading-relaxed text-muted md:text-xl">
            Collaboration doesn&apos;t stop once the project is complete. Here are some
            incredible individuals I&apos;ve partnered with — and I would gladly team up with
            them again.
          </p>
        </Reveal>

        {/* Mobile: manual swipe/scroll row */}
        <div className="mt-12 flex flex-col items-center gap-5 sm:hidden">
          <div className="no-scrollbar flex w-full snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-1">
            {testimonials.map((t) => (
              <TestimonialCard key={t.name} t={t} className="w-[85vw] max-w-[366px] snap-start" />
            ))}
          </div>
          <MoreHorizontal size={24} className="text-accent" aria-hidden="true" />
        </div>

        {/* Tablet & up: masonry columns */}
        <div className="mt-12 hidden columns-1 gap-6 px-5 sm:block sm:columns-2 md:px-0 lg:columns-3">
          {testimonials.map((t, index) => (
            <Reveal key={t.name} delay={(index % 3) * 0.08} y={30} className="mb-6 block break-inside-avoid">
              <TestimonialCard t={t} className="w-full" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
