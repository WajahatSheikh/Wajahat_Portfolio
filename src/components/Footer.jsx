import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowUp, Download } from "lucide-react";
import { gsap } from "../lib/gsap";
import { ctaGlow } from "../lib/ctaGlow";
import { prefersReducedMotion } from "../lib/motion";
import { footer, resumeLink } from "../data/content";
import Button from "./ui/Button";
import RollingText from "./ui/RollingText";

/** Live clock in the timezone the work happens in. */
function LocalTime() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: footer.timeZone,
      }).format(new Date());

    setTime(format());
    // Ticking on the minute rather than the second: a seconds counter in a
    // footer is movement without information.
    const id = window.setInterval(() => setTime(format()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  // Rendered empty on the server pass / first paint so the layout never jumps.
  return <span className="tabular-nums">{time ?? "--:--"}</span>;
}

function FooterLink({ href, label }) {
  const external = href.startsWith("http");

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      data-cursor="hover"
      aria-label={label}
      /* 44px minimum on touch — at the desktop `py-1` these were 32px tall and
         sat a few pixels apart, which is a poor thumb target. Tightened back up
         from lg, where the pointer is precise and the column would otherwise
         sprawl. */
      className="group text-label-lg text-night-soft hover:text-white inline-flex min-h-11 items-center gap-1.5 py-1 transition-colors duration-300 lg:min-h-0"
    >
      <RollingText text={label} />
      <ArrowUpRight
        size={15}
        aria-hidden="true"
        className="shrink-0 -translate-x-1 opacity-0 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:opacity-100"
      />
    </a>
  );
}

export default function Footer() {
  const rootRef = useRef(null);
  const wordmarkRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const wordmark = wordmarkRef.current;
    if (!root || !wordmark) return undefined;
    if (prefersReducedMotion()) return undefined;

    const ctx = gsap.context(() => {
      // The wordmark rises out of the bottom edge as the footer scrolls in,
      // so the last thing on the page resolves rather than just appearing.
      gsap.fromTo(
        wordmark,
        { yPercent: 38, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top bottom",
            end: "bottom bottom",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    /* Not using the .card-glow utility here: it forces `position: relative` on
       every direct child so card content clears its glow, which silently
       overrode the absolute positioning on the wash below and dropped a 420px
       block into the footer's flow. The glow is written out explicitly instead. */
    <footer
      ref={rootRef}
      {...ctaGlow}
      className="bg-night relative isolate overflow-hidden pt-16 sm:pt-20 lg:pt-28"
    >
      {/* Brand wash anchored to the base, so the dark plate has depth instead
          of reading as a flat black bar. */}
      <div
        aria-hidden="true"
        className="bg-brand/22 pointer-events-none absolute -bottom-52 left-1/2 z-0 h-[420px] w-[min(1100px,120vw)] -translate-x-1/2 rounded-[50%] blur-[120px]"
      />

      {/* Cursor-tracked highlight, reading the same --mx/--my that ctaGlow
          writes. Brighter than the card version because it sits on near-black. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(460px circle at var(--mx, 50%) var(--my, 30%), rgba(122,106,255,0.16), rgba(122,106,255,0) 70%)",
        }}
      />

      <div className="shell relative z-10 flex flex-col gap-10 sm:gap-12">
        {/* Top: closing statement + resume */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="flex flex-col gap-4">
            <span className="text-mono-sm font-mono text-night-soft inline-flex items-center gap-2.5 uppercase">
              <span className="relative grid size-2 place-items-center">
                <span className="absolute size-2 animate-ping rounded-full bg-emerald-400/60" />
                <span className="size-2 rounded-full bg-emerald-400" />
              </span>
              {footer.availability}
            </span>

            {/* The measure sits on the heading, not the wrapper: `ch` resolves
                against the element's own font-size, so a 20ch cap on the 16px
                parent was really ~160px and broke this into three lines. At
                19ch of its own 32px type it balances onto two. */}
            <p className="text-heading-lg font-display max-w-[19ch] text-white text-balance">
              {footer.statement}
            </p>
            <p className="text-body-sm max-w-[40ch] text-white/45">{footer.tagline}</p>
          </div>

          <Button
            as="a"
            href={resumeLink}
            target="_blank"
            rel="noreferrer"
            variant="brand"
            size="lg"
            icon={Download}
            className="self-start lg:self-end"
          >
            Download Resume
          </Button>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 border-t border-white/10 pt-8 sm:gap-x-10 sm:pt-10 lg:grid-cols-3">
          {footer.columns.map((col) => (
            <nav
              key={col.title}
              aria-label={col.title}
              /* The contact column carries a full email address, and the
                 rolling label cannot wrap — in a half-width mobile column it
                 would run past the gutter. It takes the full row instead. */
              className={`flex flex-col gap-3 ${col.wide ? "col-span-2 sm:col-span-1" : ""}`}
            >
              <p className="text-mono-sm font-mono text-white/35 uppercase">{col.title}</p>
              <div className="flex flex-col items-start gap-1">
                {col.links.map((link) => (
                  <FooterLink key={link.label} {...link} />
                ))}
              </div>
            </nav>
          ))}

          <div className="col-span-2 flex flex-col gap-3 lg:col-span-1">
            <p className="text-mono-sm font-mono text-white/35 uppercase">Based in</p>
            <p className="text-label-lg text-night-soft">
              {footer.locationLabel} &middot; <LocalTime /> local
            </p>
          </div>
        </div>

        {/* Bottom bar — copyright and back-to-top share a line rather than each
            taking a block of their own. */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
          <p className="text-mono-sm font-mono text-white/30 uppercase">{footer.copyright}</p>

          <a
            href="#top"
            data-cursor="hover"
            className="group text-label-md text-night-soft hover:text-white inline-flex min-h-11 items-center gap-2 transition-colors duration-300 lg:min-h-0"
          >
            {footer.backToTop}
            <span className="grid size-8 place-items-center rounded-full border border-white/15 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5 group-hover:border-white/40">
              <ArrowUp size={15} aria-hidden="true" />
            </span>
          </a>
        </div>
      </div>

      {/* Oversized wordmark, clipped by the footer's own bottom edge. Purely
          typographic furniture, so it is hidden from assistive tech — the name
          is already in the copyright line above. */}
      {/* The shell is the query container, so .wordmark-fit can size the name
          against its content width — gutters excluded — and span the full
          measure at every breakpoint. Only the upper part sits above the
          footer's bottom edge; the rest is clipped, which is what makes it
          furniture rather than a heading. */}
      <div
        ref={wordmarkRef}
        aria-hidden="true"
        className="shell relative z-10 mt-8 [container-type:inline-size] sm:mt-10"
      >
        <span className="wordmark-fit font-display block translate-y-[26%] leading-[0.78] font-semibold tracking-[-0.05em] whitespace-nowrap text-white/[0.06] select-none">
          {footer.wordmark}
        </span>
      </div>
    </footer>
  );
}
