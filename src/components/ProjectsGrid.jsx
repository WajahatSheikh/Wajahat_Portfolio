import { projects } from "../data/content";
import ProjectCard from "./ProjectCard";

export default function ProjectsGrid() {
  return (
    <section id="projects" className="bg-surface-soft px-5 py-16 md:px-10 md:py-24 xl:px-[100px]">
      <div className="mx-auto grid max-w-[1920px] grid-cols-1 gap-5 sm:grid-cols-2">
        {projects.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}
