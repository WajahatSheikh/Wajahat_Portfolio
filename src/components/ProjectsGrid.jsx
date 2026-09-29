import { projects, sectionCopy } from "../data/content";
import SectionHeader from "./SectionHeader";
import ProjectCard from "./ProjectCard";

export default function ProjectsGrid() {
  const count = String(projects.length).padStart(2, "0");

  return (
    /* Sits above the showreel so the sticky card scrolls underneath it. */
    <section id="work" className="bg-muted section-y relative z-10">
      <div className="shell section-gap flex flex-col">
        <SectionHeader
          title={sectionCopy.work.title.replace("{count}", count)}
          intro={sectionCopy.work.intro}
          align="center"
          className="mx-auto"
        />

        {/* One column on a phone, two from md (768) up — so both iPad
            orientations and every desktop width show two per row. Gaps step up
            with the breakpoints rather than staying fixed, or the 24px phone
            gutter ends up matching the gap between cards. */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:gap-x-8 sm:gap-y-12 md:grid-cols-2 lg:gap-y-14">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
