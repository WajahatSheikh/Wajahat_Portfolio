import { techStack } from "../data/content";
import Reveal from "./Reveal";

export default function TechStack() {
  return (
    <section id="tech-stack" className="bg-surface-alt px-5 py-16 md:px-10 md:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-medium text-ink md:text-3xl">Tech Stack</h2>
          <p className="mt-3 text-sm text-ink-soft">
            These are the tools in my daily rotation, from first sketch to shipped product. Each
            one earns its place by removing friction somewhere in the process.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {techStack.map((tool, index) => (
            <Reveal
              key={tool.name}
              delay={(index % 4) * 0.06}
              y={30}
              className="group flex flex-col gap-3 rounded-2xl border border-line bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-ink/5"
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
                style={{ backgroundColor: tool.color }}
              >
                {tool.name.charAt(0)}
              </span>
              <span className="text-sm font-semibold text-ink">{tool.name}</span>
              <span className="text-xs leading-relaxed text-ink-faint">{tool.description}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
