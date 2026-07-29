import { useEffect, useRef } from "react";
import { Award } from "lucide-react";
import { gsap } from "../lib/gsap";
import { aboutParagraphs, badges } from "../data/content";
import Reveal from "./Reveal";

export default function AboutMe() {
  const badgesRef = useRef(null);

  useEffect(() => {
    const el = badgesRef.current;
    if (!el) return undefined;
    const icons = el.querySelectorAll(".badge-icon");

    const floaters = Array.from(icons).map((icon, i) =>
      gsap.to(icon, {
        y: -8,
        duration: 1.8 + (i % 3) * 0.3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: i * 0.15,
      }),
    );

    return () => floaters.forEach((tween) => tween.kill());
  }, []);

  return (
    <section id="about" className="px-5 py-16 md:px-10 md:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="text-[11px] font-semibold tracking-widest text-accent uppercase">
            About Me
          </p>
        </Reveal>

        <div className="mt-6 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
          <Reveal as="div" stagger className="space-y-5">
            {aboutParagraphs.map((p) => (
              <p key={p.slice(0, 20)} className="text-sm leading-relaxed text-ink-soft md:text-[15px]">
                {p}
              </p>
            ))}
          </Reveal>

          <Reveal delay={0.15} className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-accent md:aspect-auto md:h-full" />
        </div>

        <div
          ref={badgesRef}
          className="mt-14 grid grid-cols-4 gap-6 border-t border-line pt-10 md:grid-cols-8"
        >
          {badges.map((badge) => (
            <div key={badge} className="badge-icon flex flex-col items-center gap-2 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-alt text-ink-soft">
                <Award size={20} />
              </span>
              <span className="text-[10px] leading-tight text-ink-faint uppercase">{badge}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
