import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap";
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

const profilePicture = "/Profile%20Picture.png";

export default function AboutMe() {
  const frameRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const frame = frameRef.current;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        frame,
        { clipPath: "inset(0 0 100% 0)" },
        {
          clipPath: "inset(0 0 0% 0)",
          duration: 1.1,
          ease: "power4.inOut",
          scrollTrigger: { trigger: frame, start: "top 80%" },
        },
      );
      gsap.fromTo(
        imgRef.current,
        { scale: 1.25 },
        {
          scale: 1,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: { trigger: frame, start: "top 80%" },
        },
      );
    });
    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((st) => st.trigger === frame && st.kill());
    };
  }, []);

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
                className="h-24 min-w-0 flex-1 object-contain sm:h-32 lg:h-[152px]"
              />
            ))}
          </Reveal>
        </div>

        <div className="aspect-[4/3] w-full p-5 lg:aspect-auto lg:w-[655px] lg:shrink-0 lg:self-stretch">
          <div ref={frameRef} className="h-full w-full overflow-hidden">
            <img
              ref={imgRef}
              src={profilePicture}
              alt="Wajahat Sheikh"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
