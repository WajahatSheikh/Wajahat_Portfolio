import { Phone } from "lucide-react";
import { contactCta } from "../data/content";
import { useContact } from "../context/ContactContext";
import { useParallax } from "../lib/motion";
import Reveal from "./Reveal";
import Button from "./ui/Button";

export default function ContactCTA() {
  const { openContact } = useContact();

  // The two blobs drift at different rates, which is what sells the gradient
  // as depth rather than a flat fill.
  const blobA = useParallax({ distance: 90, from: -60, disableBelow: 640 });
  const blobB = useParallax({ distance: -70, from: 50, disableBelow: 640 });

  return (
    <section
      id="contact"
      className="gradient-contact section-y relative isolate overflow-hidden"
    >
      <div
        ref={blobA}
        aria-hidden="true"
        className="will-parallax pointer-events-none absolute -bottom-32 -left-24 size-[340px] rounded-full bg-white/20 blur-3xl sm:size-[520px]"
      />
      <div
        ref={blobB}
        aria-hidden="true"
        className="will-parallax pointer-events-none absolute -top-40 -right-32 size-[380px] rounded-full bg-white/25 blur-3xl sm:size-[600px]"
      />

      <div className="shell">
        <Reveal y={36} className="mx-auto w-full max-w-[686px]">
          <div className="glass-card flex flex-col items-center gap-5 rounded-panel px-6 py-10 text-center sm:gap-6 sm:px-12 sm:py-14 lg:px-20 lg:py-16">
            <p className="text-mono-md font-mono text-brand-strong uppercase">
              {contactCta.eyebrow}
            </p>

            {/* Figma sets this one title in Geist while every other section
                title uses the display face — matched to the rest here. */}
            <h2 className="text-heading-xl font-display text-ink text-balance">
              {contactCta.title}
            </h2>

            <Button
              variant="accent"
              size="lg"
              icon={Phone}
              onClick={openContact}
              magnetic={false}
              className="w-full"
            >
              {contactCta.cta}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
