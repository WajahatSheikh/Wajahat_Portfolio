import { useEffect, useRef, useState } from "react";
import { gsap } from "../lib/gsap";
import { timeline, heroRoles } from "../data/content";
import { useContact } from "../context/ContactContext";

const lines = ["I'm Wajahat Sheikh,", "a product designer", "who works with"];

export default function Hero() {
  const { openContact } = useContact();
  const headlineRef = useRef(null);
  const timelineRef = useRef(null);
  const ctaRef = useRef(null);
  const roleRef = useRef(null);
  const isFirstRole = useRef(true);
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });

      tl.fromTo(
        headlineRef.current.querySelectorAll(".hero-line-inner"),
        { yPercent: 110 },
        { yPercent: 0, duration: 1, ease: "power4.out", stagger: 0.12 },
      )
        .fromTo(
          ctaRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
          "-=0.4",
        )
        .fromTo(
          timelineRef.current?.children || [],
          { x: 30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" },
          "-=0.5",
        );
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const el = roleRef.current;
      if (!el) return;
      gsap.to(el, {
        rotateX: 90,
        opacity: 0,
        duration: 0.35,
        ease: "power2.in",
        onComplete: () => {
          setRoleIndex((i) => (i + 1) % heroRoles.length);
        },
      });
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const el = roleRef.current;
    if (!el) return;
    if (isFirstRole.current) {
      isFirstRole.current = false;
      return;
    }
    gsap.fromTo(
      el,
      { rotateX: -90, opacity: 0 },
      { rotateX: 0, opacity: 1, duration: 0.35, ease: "power2.out" },
    );
  }, [roleIndex]);

  return (
    <section id="top" className="relative overflow-hidden pt-36 pb-16 md:pt-44 md:pb-24">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-5 md:flex-row md:items-start md:justify-between md:px-10">
        <div>
          <h1
            ref={headlineRef}
            className="text-4xl leading-[1.1] font-medium tracking-tight text-ink sm:text-5xl md:text-6xl"
          >
            {lines.map((line) => (
              <span key={line} className="hero-line block overflow-hidden">
                <span className="hero-line-inner block">{line}</span>
              </span>
            ))}
            <span
              className="hero-line block overflow-hidden"
              style={{ perspective: 600 }}
            >
              <span
                ref={roleRef}
                className="hero-line-inner block text-accent italic"
                style={{ transformOrigin: "50% 50%" }}
              >
                {heroRoles[roleIndex]}
              </span>
            </span>
          </h1>

          <div ref={ctaRef} className="mt-8">
            <button
              type="button"
              data-cursor="hover"
              onClick={openContact}
              className="rounded-full bg-accent px-6 py-3 text-xs font-semibold tracking-wide text-white uppercase transition-transform duration-300 hover:scale-105 hover:bg-accent-dark"
            >
              Contact Me
            </button>
          </div>
        </div>

        <div
          ref={timelineRef}
          className="grid w-full max-w-xs grid-cols-1 gap-4 text-right md:w-auto md:shrink-0"
        >
          {timeline.map((item) => (
            <div key={item.range} className="grid grid-cols-[auto_1fr] gap-4 border-b border-line pb-3 text-left">
              <span className="text-[11px] whitespace-nowrap text-ink-faint uppercase">{item.range}</span>
              <span className="text-[11px] text-ink-soft uppercase">
                {item.role}
                <br />
                <span className="text-ink-faint">{item.place}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
