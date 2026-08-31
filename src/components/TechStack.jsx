import { useEffect, useRef } from "react";
import { gsap } from "../lib/gsap";
import { techStack } from "../data/content";
import Reveal from "./Reveal";

const SPEED_PX_PER_SEC = 55;

function TechCard({ tool, className = "" }) {
  return (
    <div
      className={`flex shrink-0 flex-col gap-3 rounded-xl bg-white p-5 shadow-[0_1px_2px_rgba(12,12,13,0.1),0_1px_2px_rgba(12,12,13,0.05)] ${className}`}
    >
      {tool.icon ? (
        <img
          src={`/Tech Stack Icons/${tool.icon}.png`}
          alt={tool.name}
          className="size-10 rounded-lg object-cover sm:size-[60px]"
        />
      ) : (
        <span className="flex size-10 items-center justify-center rounded-lg bg-heading sm:size-[60px]">
          <span className="font-geist text-base font-semibold text-white sm:text-lg">
            {tool.name.charAt(0)}
          </span>
        </span>
      )}
      <div className="flex flex-col gap-2">
        <h3 className="font-geist text-base font-semibold text-heading uppercase sm:text-xl sm:capitalize sm:normal-case">
          {tool.name}
        </h3>
        <p className="font-geist text-sm leading-relaxed text-muted">{tool.description}</p>
      </div>
    </div>
  );
}

export default function TechStack() {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return undefined;

    const distance = track.scrollWidth / 2;
    const tween = gsap.to(track, {
      xPercent: -50,
      duration: distance / SPEED_PX_PER_SEC,
      ease: "none",
      repeat: -1,
    });

    const pause = () => tween.pause();
    const resume = () => tween.play();
    track.addEventListener("touchstart", pause, { passive: true });
    track.addEventListener("touchend", resume, { passive: true });
    track.addEventListener("mouseenter", pause);
    track.addEventListener("mouseleave", resume);

    return () => {
      tween.kill();
      track.removeEventListener("touchstart", pause);
      track.removeEventListener("touchend", resume);
      track.removeEventListener("mouseenter", pause);
      track.removeEventListener("mouseleave", resume);
    };
  }, []);

  return (
    <section
      id="tech-stack"
      className="bg-surface-soft py-16 sm:px-5 md:px-10 md:py-24 xl:px-[160px] xl:py-[100px]"
    >
      <div className="mx-auto flex max-w-[1920px] flex-col items-center gap-10 xl:gap-[60px]">
        <Reveal className="mx-auto max-w-2xl px-5 text-center sm:px-0">
          <h2 className="font-tiempos text-3xl text-heading md:text-[40px]">Tech Stack</h2>
          <p className="mt-4 font-geist text-base leading-relaxed text-muted md:text-xl">
            These are the tools in my daily rotation, from first sketch to shipped product. Each
            one earns its place by removing friction somewhere in the process.
          </p>
        </Reveal>

        {/* Mobile: auto-scrolling horizontal marquee */}
        <div className="w-full overflow-hidden py-3 sm:hidden">
          <div ref={trackRef} className="flex w-max gap-4">
            {[...techStack, ...techStack].map((tool, index) => (
              <TechCard key={`${tool.name}-${index}`} tool={tool} className="w-[280px]" />
            ))}
          </div>
        </div>

        {/* Tablet & up: static responsive grid */}
        <div className="hidden w-full grid-cols-1 gap-6 px-5 sm:grid sm:grid-cols-2 md:px-0 lg:grid-cols-3">
          {techStack.map((tool, index) => (
            <Reveal key={tool.name} delay={(index % 3) * 0.08} y={30}>
              <TechCard tool={tool} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
