import { useRef, useEffect } from "react";
import { Clock, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { gsap } from "../lib/gsap";
import { prefersReducedMotion } from "../lib/motion";
import { projectHoverLabel } from "../data/content";
import Reveal from "./Reveal";
import flutterWord from "../assets/projects/flutter-word.png";
import strikeABalance from "../assets/projects/strike-a-balance.png";
import universityOfSharjah from "../assets/projects/university-of-sharjah.jpg";
import whereKidsLearn from "../assets/projects/where-kids-learn-by-playing.webp";
import centralizedAdmission from "../assets/projects/centralized-admission-dashboard.jpg";
import goalyticsLogo from "../assets/projects/goalytics-logo.svg";

const images = {
  "flutter-word": flutterWord,
  "strike-a-balance": strikeABalance,
  "university-of-sharjah": universityOfSharjah,
  "where-kids-learn-by-playing": whereKidsLearn,
  "centralized-admission-dashboard": centralizedAdmission,
};

const MESH_VARIANTS = ["mesh-brand", "mesh-brand-b", "mesh-brand-c"];

export default function ProjectCard({ project, index }) {
  const cardRef = useRef(null);
  const mediaRef = useRef(null);
  const overlayRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return undefined;
    if (prefersReducedMotion()) return undefined;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });

      tl.to(mediaRef.current, { scale: 1.06, duration: 0.7 }, 0)
        .to(overlayRef.current, { autoAlpha: 1, duration: 0.35 }, 0)
        .fromTo(
          overlayRef.current.firstChild,
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4 },
          0.05,
        )
        .to(card, { y: -6, duration: 0.45 }, 0);

      const play = () => tl.play();
      const reverse = () => tl.reverse();

      card.addEventListener("mouseenter", play);
      card.addEventListener("mouseleave", reverse);
      card.addEventListener("focusin", play);
      card.addEventListener("focusout", reverse);

      return () => {
        card.removeEventListener("mouseenter", play);
        card.removeEventListener("mouseleave", reverse);
        card.removeEventListener("focusin", play);
        card.removeEventListener("focusout", reverse);
      };
    }, card);

    return () => ctx.revert();
  }, []);

  const image = images[project.image];

  // Only a project with a written case study is a link. The rest keep the
  // hover treatment but are not clickable — a pointer cursor on a card that
  // goes nowhere is the oldest lie in portfolio design.
  const hasPage = Boolean(project.slug);
  const Wrapper = hasPage ? Link : "article";
  const wrapperProps = hasPage
    ? { to: `/projects/${project.slug}`, "aria-label": `${project.title} — read the case study` }
    : {};

  return (
    <Reveal delay={(index % 2) * 0.08} y={44} className="h-full">
      <Wrapper
        {...wrapperProps}
        ref={cardRef}
        data-cursor="hover"
        className={`group flex h-full flex-col gap-4 sm:gap-5 ${hasPage ? "cursor-pointer" : ""}`}
      >
        <div className="border-line-subtle relative aspect-[704/550] w-full overflow-hidden rounded-card border">
          <div ref={mediaRef} className="will-parallax absolute inset-0 size-full">
            {image ? (
              <img
                src={image}
                alt=""
                loading={index > 3 ? "lazy" : "eager"}
                className="size-full object-cover"
              />
            ) : (
              <div
                /* Rotating the composition and desyncing the drift keeps a
                   grid of placeholders from pulsing as one block. */
                style={{ animationDelay: `${(index % 5) * -3.4}s` }}
                className={`${MESH_VARIANTS[index % MESH_VARIANTS.length]} flex size-full items-center justify-center p-8`}
              >
                {project.featuredBg ? (
                  <img
                    src={goalyticsLogo}
                    alt=""
                    className="w-[45%] max-w-[260px] min-w-[120px]"
                  />
                ) : (
                  <p className="text-heading-md font-display max-w-[16ch] text-center text-white/80">
                    {project.title}
                  </p>
                )}
              </div>
            )}
          </div>

          {project.status && (
            <span className="glass-chip text-label-sm text-ink absolute top-4 left-4 rounded-full px-3 py-1.5">
              {project.status}
            </span>
          )}

          {/* Hover-only status overlay. A clock rather than the old
              arrow-up-right: that arrow reads as "opens elsewhere", which
              contradicts a label saying the case study is not up yet. */}
          <div
            ref={overlayRef}
            aria-hidden="true"
            className="bg-night/35 pointer-events-none invisible absolute inset-0 flex items-center justify-center opacity-0"
          >
            <span className="glass-card text-label-md text-ink inline-flex items-center gap-2 rounded-full px-4 py-2.5">
              {hasPage ? "Read case study" : (project.hoverLabel ?? projectHoverLabel)}
              {hasPage ? <ArrowUpRight size={17} /> : <Clock size={17} />}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {/* No reserved second line. Forcing one aligned the subtitles across
              a row but left a full empty line under every single-line title.
              Without it the title box hugs its text, and the height a stretched
              grid row adds falls below the subtitle, where nothing shows. */}
          <h3
            ref={titleRef}
            className="text-heading-md font-display text-ink transition-colors duration-300 group-hover:text-brand"
          >
            {project.title}
          </h3>
          {/* Uppercased in CSS rather than in the data: the content file stays
              readable, and a screen reader announces the original casing
              instead of spelling out shouted capitals. The extra tracking is
              what keeps all-caps legible at this size. */}
          <p className="text-body-sm text-ink-faint tracking-[0.06em] uppercase">
            {project.subtitle}
          </p>
        </div>
      </Wrapper>
    </Reveal>
  );
}
