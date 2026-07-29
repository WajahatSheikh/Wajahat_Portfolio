import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { gsap } from "../lib/gsap";
import { services } from "../data/content";
import { useContact } from "../context/ContactContext";
import Reveal from "./Reveal";

export default function WhatIDo() {
  const { openContact } = useContact();
  const [active, setActive] = useState(0);
  const panelRefs = useRef([]);

  const toggle = (index) => {
    const isOpening = active !== index;
    const prevPanel = panelRefs.current[active];
    const nextPanel = panelRefs.current[index];

    if (prevPanel && prevPanel !== nextPanel) {
      gsap.to(prevPanel, { height: 0, opacity: 0, duration: 0.4, ease: "power2.inOut" });
    }

    if (isOpening && nextPanel) {
      gsap.set(nextPanel, { height: "auto", opacity: 1 });
      gsap.from(nextPanel, { height: 0, opacity: 0, duration: 0.45, ease: "power2.inOut" });
    }

    setActive(isOpening ? index : active);
  };

  return (
    <section id="what-i-do" className="px-5 py-16 md:px-10 md:py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 md:grid-cols-[minmax(0,280px)_1fr] md:gap-16">
        <Reveal>
          <p className="text-[11px] font-semibold tracking-widest text-accent uppercase">
            What I Do
          </p>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">
            Seven practices I use to take a product from first sketch to launch — built on
            systems, not one-off screens.
          </p>
          <button
            type="button"
            data-cursor="hover"
            onClick={openContact}
            className="mt-6 rounded-full bg-accent px-6 py-3 text-xs font-semibold tracking-wide text-white uppercase transition-transform duration-300 hover:scale-105 hover:bg-accent-dark"
          >
            Contact Me
          </button>
        </Reveal>

        <Reveal as="div" stagger delay={0.1} className="divide-y divide-line border-t border-line">
          {services.map((service, index) => {
            const isOpen = active === index;
            return (
              <div key={service.number}>
                <button
                  type="button"
                  data-cursor="hover"
                  onClick={() => toggle(index)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="flex items-baseline gap-4">
                    <span className="text-xs font-semibold text-accent">{service.number}</span>
                    <span
                      className={`text-lg font-medium transition-colors duration-300 md:text-xl ${
                        isOpen ? "text-ink" : "text-ink-soft"
                      }`}
                    >
                      {service.title}
                    </span>
                  </span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-ink-faint transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-accent" : ""
                    }`}
                  />
                </button>
                <div
                  ref={(el) => {
                    panelRefs.current[index] = el;
                  }}
                  style={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                  className="overflow-hidden"
                >
                  <p className="pb-6 pl-0 text-sm leading-relaxed text-ink-soft md:pl-[52px]">
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
