import { useRef } from "react";
import { gsap } from "../lib/gsap";
import Reveal from "./Reveal";
import flutterWord from "../assets/projects/flutter-word.png";
import strikeABalance from "../assets/projects/strike-a-balance.png";
import arcfix from "../assets/projects/arcfix.png";
import goalyticsLogo from "../assets/projects/goalytics-logo.svg";

const images = {
  "flutter-word": flutterWord,
  "strike-a-balance": strikeABalance,
  arcfix,
};

const viewIcon = "/remove_red_eye.svg";
const hourglassIcon = "/hourglass_bottom.svg";

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

  const image = images[project.image];
  const isComingSoon = project.tags.includes("progressing") && !project.featuredBg;
  const hoverLabel = project.featuredBg
    ? "View Overview"
    : isComingSoon
      ? "Publish Coming Soon"
      : "Review Case Study";
  const hoverIcon = isComingSoon ? hourglassIcon : viewIcon;

  return (
    <Reveal delay={(index % 2) * 0.1} y={50} className="group">
      <div
        ref={cardRef}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        data-cursor="hover"
        className="cursor-pointer"
      >
        <div className="relative aspect-[766/549] w-full overflow-hidden">
          <div
            ref={imgRef}
            className={`h-full w-full ${image ? "" : project.featuredBg ? "mesh-gradient" : "bg-accent"}`}
          >
            {image && (
              <img
                src={image}
                alt={project.title}
                className="h-full w-full object-cover"
              />
            )}
            {project.featuredBg && (
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <img
                  src={goalyticsLogo}
                  alt={project.title}
                  className="w-[45%] max-w-[280px] min-w-[140px]"
                />
              </div>
            )}
          </div>

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5">
              <img src={hoverIcon} alt="" className="size-4" />
              <span className="font-geist-mono text-[13px] leading-normal font-semibold whitespace-nowrap text-[#501e06] capitalize">
                {hoverLabel}
              </span>
            </span>
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-1.5">
          <p className="font-geist-mono text-sm text-muted uppercase">Case Study</p>
          <h3 className="font-geist text-2xl leading-8 font-semibold text-heading transition-colors duration-300 group-hover:text-accent">
            {project.title}
          </h3>
          <div className="flex flex-wrap items-center gap-1.5">
            {project.tags.map((tag, i) => (
              <span key={tag} className="flex items-center gap-1.5">
                {i > 0 && <span className="size-1.5 rotate-45 bg-[#bc460c]" />}
                {tag === "progressing" && (
                  <img src={hourglassIcon} alt="" className="size-3.5" />
                )}
                <span className="font-geist-mono text-sm text-accent uppercase">{tag}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </Reveal>
  );
}
