import { projects } from "../data/content";
import ProjectCard from "./ProjectCard";

export default function ProjectsGrid() {
  return (
    <section id="projects" className="px-5 py-16 md:px-10 md:py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2">
        {projects.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}
