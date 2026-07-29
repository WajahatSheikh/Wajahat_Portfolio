import { Quote } from "lucide-react";
import { testimonials } from "../data/content";
import Reveal from "./Reveal";

function initials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="px-5 py-16 md:px-10 md:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-xl">
          <h2 className="text-2xl font-medium text-ink md:text-3xl">
            Clients, Colleagues &amp; Founders
          </h2>
          <p className="mt-3 text-sm text-ink-soft">
            Collaboration doesn&apos;t stop once the project is complete. Here are some
            incredible individuals I&apos;ve partnered with — and I would gladly team up with
            them again.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, index) => (
            <Reveal
              key={t.name}
              delay={(index % 3) * 0.08}
              y={30}
              className="flex flex-col gap-4 rounded-2xl border border-line p-6 transition-shadow duration-300 hover:shadow-lg hover:shadow-ink/5"
            >
              <Quote size={22} className="text-accent" />
              <p className="text-sm leading-relaxed text-ink-soft">{t.quote}</p>
              <div className="mt-auto flex items-center gap-3 pt-2">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-semibold text-accent">
                  {initials(t.name)}
                </span>
                <div>
                  <p className="text-sm font-medium text-ink">{t.name}</p>
                  <p className="text-xs text-ink-faint">{t.title}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
