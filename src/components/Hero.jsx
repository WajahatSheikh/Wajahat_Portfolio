import { Fragment, useEffect, useRef, useState } from "react";
import { gsap } from "../lib/gsap";
import { timeline, heroRoles } from "../data/content";

const lines = ["I'm Wajahat Sheikh, a product", "designer who works with"];

export default function Hero() {
  const headlineRef = useRef(null);
  const timelineRef = useRef(null);
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
      ).fromTo(
        timelineRef.current,
        { x: 30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
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
    <section id="top" className="relative overflow-hidden bg-surface-soft pt-24  md:pt-32 xl:pt-[160px] xl:pb-[0px]">
      <div className="mx-auto flex max-w-[1920px] flex-col gap-12 px-5 md:px-10 lg:flex-row lg:items-center lg:gap-16 xl:gap-[165px] xl:px-[100px]">
        <h1
          ref={headlineRef}
          className="max-w-2xl font-tiempos text-[32px] leading-[1.2] text-heading sm:text-[40px] lg:max-w-[789px] lg:flex-1 lg:text-[52px]"
        >
          {lines.map((line) => (
            <span key={line} className="hero-line block overflow-hidden">
              <span className="hero-line-inner block">{line}</span>
            </span>
          ))}
          <span className="hero-line block overflow-hidden" style={{ perspective: 600 }}>
            <span
              ref={roleRef}
              className="hero-line-inner block text-accent italic"
              style={{ transformOrigin: "50% 50%" }}
            >
              {heroRoles[roleIndex]}
            </span>
          </span>
        </h1>

        <div ref={timelineRef} className="font-geist-mono text-sm lg:shrink-0">
          <div className="flex flex-col gap-4 lg:hidden">
            {timeline.map((item) => (
              <div key={item.range} className="flex flex-col gap-0.5">
                <span className="text-muted">{item.range}</span>
                <span className="font-geist font-medium text-heading">{item.company}</span>
                <span className="font-geist text-muted">{item.role}</span>
              </div>
            ))}
          </div>

          <div className="hidden grid-cols-[auto_auto_auto] gap-x-10 gap-y-2 lg:grid">
            {timeline.map((item) => (
              <Fragment key={item.range}>
                <span className="whitespace-nowrap text-muted">{item.range}</span>
                <span className="whitespace-nowrap font-geist font-medium text-heading">
                  {item.company}
                </span>
                <span className="whitespace-nowrap font-geist text-muted">{item.role}</span>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
