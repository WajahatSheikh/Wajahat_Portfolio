import { services } from "../data/content";
import ContactButton from "./ContactButton";
import Reveal from "./Reveal";

export default function WhatIDo() {
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

        <Reveal as="div" stagger className="flex flex-1 flex-col border-t border-muted/15">
          {services.map((service) => (
            <div
              key={service.number}
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
    </section>
  );
}
