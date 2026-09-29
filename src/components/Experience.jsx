import { experience, sectionCopy } from "../data/content";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";

export default function Experience() {
  return (
    <section id="experience" className="bg-muted section-y">
      <div className="shell section-gap flex flex-col">
        <SectionHeader
          title={sectionCopy.experience.title}
          intro={sectionCopy.experience.intro}
        />

        <ol className="flex flex-col">
          {experience.map((job, i) => (
            <Reveal
              as="li"
              key={`${job.company}-${job.range}`}
              y={24}
              delay={i * 0.05}
              className="border-line group relative grid grid-cols-1 gap-2 border-t py-6 sm:py-8 lg:grid-cols-[220px_330px_1fr] lg:gap-12"
            >
              <span
                aria-hidden="true"
                className="bg-brand/[0.05] pointer-events-none absolute inset-y-0 -inset-x-4 origin-left scale-x-0 rounded-lg transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
              />

              <p className="text-mono-md font-mono text-ink-faint relative uppercase transition-colors duration-300 group-hover:text-brand">
                {job.range}
              </p>

              <div className="relative flex flex-col gap-1">
                <h3 className="text-heading-sm text-ink">{job.company}</h3>
                <p className="text-body-sm text-ink-faint">
                  {job.role} &middot; {job.location}
                </p>
              </div>

              <p className="text-body-md text-ink-soft relative text-pretty">
                {job.description}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
