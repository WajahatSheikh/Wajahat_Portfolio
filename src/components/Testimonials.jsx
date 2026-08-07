import { testimonials } from "../data/content";
import Reveal from "./Reveal";

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-surface-soft px-5 py-16 md:px-10 md:py-24 xl:px-[160px]">
      <div className="mx-auto max-w-[1920px]">
        <Reveal className="max-w-2xl">
          <h2 className="font-tiempos text-3xl text-heading md:text-[40px]">
            Clients, Colleagues &amp; Founders
          </h2>
          <p className="mt-4 font-geist text-base leading-relaxed text-muted md:text-xl">
            Collaboration doesn&apos;t stop once the project is complete. Here are some
            incredible individuals I&apos;ve partnered with — and I would gladly team up with
            them again.
          </p>
        </Reveal>

        <div className="mt-12 columns-1 gap-6 sm:columns-2 lg:columns-3">
          {testimonials.map((t, index) => (
            <Reveal
              key={t.name}
              delay={(index % 3) * 0.08}
              y={30}
              className="mb-6 flex break-inside-avoid flex-col gap-3 rounded-xl bg-white p-5 shadow-[0_1px_2px_rgba(12,12,13,0.1),0_1px_2px_rgba(12,12,13,0.05)]"
            >
              <img
                src={`/Testimonials/${t.avatar}.png`}
                alt={t.name}
                className="size-10 rounded-full object-cover"
              />
              <div className="flex flex-col gap-2">
                <div>
                  <p className="font-geist text-xl font-medium text-heading capitalize">
                    {t.name}
                  </p>
                  <p className="font-geist text-sm text-heading">{t.title}</p>
                </div>
                <p className="font-geist text-sm leading-relaxed text-muted">{t.quote}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
