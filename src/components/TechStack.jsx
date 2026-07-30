import { techStack } from "../data/content";
import Reveal from "./Reveal";

export default function TechStack() {
  return (
    <section
      id="tech-stack"
      className="bg-surface-soft px-5 py-16 md:px-10 md:py-24 xl:px-[160px] xl:py-[100px]"
    >
      <div className="mx-auto flex max-w-[1920px] flex-col items-center gap-10 xl:gap-[60px]">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-tiempos text-3xl text-heading md:text-[40px]">Tech Stack</h2>
          <p className="mt-4 font-geist text-base leading-relaxed text-muted md:text-xl">
            These are the tools in my daily rotation, from first sketch to shipped product. Each
            one earns its place by removing friction somewhere in the process.
          </p>
        </Reveal>

        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {techStack.map((tool, index) => (
            <Reveal
              key={tool.name}
              delay={(index % 3) * 0.08}
              y={30}
              className="flex flex-col gap-3 rounded-xl bg-white p-5 shadow-[0_1px_2px_rgba(12,12,13,0.1),0_1px_2px_rgba(12,12,13,0.05)]"
            >
              {tool.icon ? (
                <img
                  src={`/Tech Stack Icons/${tool.icon}.png`}
                  alt={tool.name}
                  className="size-[60px] rounded-lg object-cover"
                />
              ) : (
                <span className="flex size-[60px] items-center justify-center rounded-lg bg-heading">
                  <span className="font-geist text-lg font-semibold text-white">
                    {tool.name.charAt(0)}
                  </span>
                </span>
              )}
              <div className="flex flex-col gap-2">
                <h3 className="font-geist text-xl font-semibold text-heading capitalize">
                  {tool.name}
                </h3>
                <p className="font-geist text-sm leading-relaxed text-muted">{tool.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
