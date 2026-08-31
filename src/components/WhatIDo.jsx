import { useEffect, useRef, useState } from "react";
import { gsap } from "../lib/gsap";
import { services } from "../data/content";
import ContactButton from "./ContactButton";
import Reveal from "./Reveal";

export default function WhatIDo() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const previewRef = useRef(null);

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) return undefined;

    const preview = previewRef.current;
    const moveX = gsap.quickTo(preview, "x", { duration: 0.5, ease: "power3.out" });
    const moveY = gsap.quickTo(preview, "y", { duration: 0.5, ease: "power3.out" });
    gsap.set(preview, { xPercent: -50, yPercent: -100 });

    const onMove = (e) => {
      moveX(e.clientX);
      moveY(e.clientY - 24);
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const preview = previewRef.current;
    if (!preview) return;
    gsap.to(preview, {
      opacity: hoveredIndex === null ? 0 : 1,
      scale: hoveredIndex === null ? 0.85 : 1,
      duration: 0.4,
      ease: "power3.out",
    });
  }, [hoveredIndex]);

  return (
    <section id="what-i-do" className="bg-surface-soft px-5 py-16 md:px-10 md:py-24 xl:px-[160px]">
      <div className="mx-auto flex max-w-[1920px] flex-col gap-10 lg:flex-row lg:items-start lg:gap-[60px]">
        <div className="flex flex-col gap-10 lg:w-[350px] lg:shrink-0 lg:justify-between xl:w-[560px]">
          <Reveal as="div" className="flex flex-col gap-6">
            <h2 className="font-tiempos text-3xl text-heading md:text-[40px]">What I Do</h2>
            <p className="font-geist text-base leading-relaxed text-muted md:text-xl">
              Seven practices I use to take a product from first sketch to launch — built on
              systems, not one-off screens.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <ContactButton className="w-fit" />
          </Reveal>
        </div>

        <Reveal as="div" stagger className="relative flex flex-1 flex-col border-t border-muted/15">
          {services.map((service, index) => (
            <div
              key={service.number}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              data-cursor="hover"
              className="flex gap-6 border-b border-muted/15 py-6"
            >
              <span className="font-geist-mono text-sm text-accent uppercase">
                {service.number}
              </span>
              <div className="flex flex-1 flex-col gap-1.5">
                <h3 className="font-geist text-xl font-semibold text-heading uppercase">
                  {service.title}
                </h3>
                <p className="font-geist text-sm text-muted">{service.description}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </div>

      <div
        ref={previewRef}
        className="pointer-events-none fixed top-0 left-0 z-40 hidden h-[220px] w-[320px] overflow-hidden rounded-2xl opacity-0 shadow-2xl md:block"
      >
        {hoveredIndex !== null && services[hoveredIndex].preview ? (
          <img
            src={services[hoveredIndex].preview}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-accent" />
        )}
      </div>
    </section>
  );
}
