import { aboutParagraphs, badges } from "../data/content";
import Reveal from "./Reveal";
import gessAward from "../assets/badges/gess-award.png";
import pda from "../assets/badges/pda.png";
import nationalInnovation from "../assets/badges/national-innovation.png";
import nextBillion from "../assets/badges/next-billion.png";
import pasha from "../assets/badges/pasha.png";

const badgeImages = {
  "gess-award": gessAward,
  pda,
  "national-innovation": nationalInnovation,
  "next-billion": nextBillion,
  pasha,
};

export default function AboutMe() {
  return (
    <section id="about" className="bg-surface-soft px-5 py-16 md:px-10 md:py-24 xl:px-[160px]">
      <div className="mx-auto flex max-w-[1920px] flex-col gap-10 lg:flex-row lg:items-start lg:gap-[60px]">
        <div className="flex flex-1 flex-col gap-6">
          <Reveal as="h2" className="font-tiempos text-3xl text-heading md:text-[40px]">
            About Me
          </Reveal>

          <Reveal as="div" stagger className="flex flex-col gap-5">
            {aboutParagraphs.map((paragraph, i) => (
              <p key={i} className="font-geist text-base leading-relaxed text-heading md:text-xl">
                {paragraph.map((segment, j) => (
                  <span key={j} className={segment.bold ? "font-semibold" : undefined}>
                    {segment.text}
                  </span>
                ))}
              </p>
            ))}
          </Reveal>

          <Reveal delay={0.15} className="flex items-center py-2">
            {badges.map((badge) => (
              <img
                key={badge.file}
                src={badgeImages[badge.file]}
                alt={badge.name}
                className="h-24 min-w-0 flex-1 object-cover shadow-[0_4px_4px_rgba(0,0,0,0.25)] sm:h-32 lg:h-[152px]"
              />
            ))}
          </Reveal>
        </div>

        <Reveal
          delay={0.2}
          className="aspect-[4/3] w-full p-5 lg:aspect-auto lg:w-[655px] lg:shrink-0 lg:self-stretch"
        >
          <div className="h-full w-full bg-accent" />
        </Reveal>
      </div>
    </section>
  );
}
