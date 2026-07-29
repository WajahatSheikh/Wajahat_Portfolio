import { useRef } from "react";
import { ArrowUpRight, Play } from "lucide-react";
import { gsap } from "../lib/gsap";
import Reveal from "./Reveal";

export default function ProjectCard({ project, index }) {
  const cardRef = useRef(null);
  const imgRef = useRef(null);

  const handleMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(imgRef.current, {
      rotateX: py * -8,
      rotateY: px * 8,
      scale: 1.03,
      duration: 0.5,
      ease: "power2.out",
      transformPerspective: 800,
    });
  };

  const handleLeave = () => {
    gsap.to(imgRef.current, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.6,
      ease: "power3.out",
    });
  };

  const isGame = project.accent === "game";

  return (
    <Reveal delay={(index % 2) * 0.1} y={50} className="group">
      <div
        ref={cardRef}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        data-cursor="hover"
        className="cursor-pointer"
      >
        <div
          ref={imgRef}
          className={`relative aspect-[4/3] w-full overflow-hidden rounded-2xl ${
            isGame ? `bg-gradient-to-br ${project.gradient}` : "bg-accent"
          }`}
        >
          {isGame && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
              <div className="absolute top-6 left-6 h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm" />
              <div className="absolute right-8 bottom-10 h-16 w-16 rounded-full bg-white/10" />
              <span className="text-2xl font-extrabold tracking-tight text-white drop-shadow-md sm:text-3xl">
                {project.title}
              </span>
              <span className="mt-2 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold tracking-wide text-ink uppercase shadow-lg">
                <Play size={14} fill="currentColor" />
                Play
              </span>
            </div>
          )}

          <div className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 opacity-0 shadow-md transition-all duration-300 group-hover:opacity-100">
            <ArrowUpRight size={18} className="text-ink" />
          </div>
        </div>

        <div className="mt-4">
          <p className="text-[11px] font-medium tracking-widest text-ink-faint uppercase">
            Case Study
          </p>
          <h3 className="mt-1 text-lg font-medium text-ink transition-colors duration-300 group-hover:text-accent">
            {project.title}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1.5 text-[11px] tracking-wide text-ink-faint uppercase"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Reveal>
  );
}
