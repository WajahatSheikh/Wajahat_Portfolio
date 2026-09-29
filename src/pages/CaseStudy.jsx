import { useEffect, useRef, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, Phone } from "lucide-react";
import { getCaseStudy } from "../data/caseStudies";
import { useContact } from "../context/ContactContext";
import { prefersReducedMotion } from "../lib/motion";
import Reveal from "../components/Reveal";
import Footer from "../components/Footer";
import Button from "../components/ui/Button";

/** Big, unmissable return control — the only way back out of this page. */
function BackButton({ className = "" }) {
  return (
    <Link
      to="/#work"
      data-cursor="hover"
      aria-label="Back to all work"
      className={`group text-label-md text-ink-soft hover:text-ink inline-flex items-center gap-3 transition-colors duration-300 ${className}`}
    >
      <span className="glass-chip grid size-12 place-items-center rounded-full transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-x-1">
        <ArrowLeft size={22} aria-hidden="true" />
      </span>
      Back
    </Link>
  );
}

/**
 * Section index for the desktop sidebar. Tracks whichever heading last crossed
 * the top band of the viewport, so the highlight matches what is on screen
 * rather than whatever intersected most recently.
 */
function SectionNav({ sections, active }) {
  return (
    // No gap between items: their left borders butt together into one
    // continuous rail, so the active brand segment reads as a position along
    // a track rather than a stray mark floating beside the word.
    <nav aria-label="Sections" className="flex flex-col">
      {sections.map((s) => {
        const isActive = active === s.id;

        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            data-cursor="hover"
            aria-current={isActive ? "true" : undefined}
            className={`group text-label-md flex min-h-11 items-center rounded-r-lg border-l-2 pr-3 pl-5 transition-[color,background-color,border-color] duration-300 ${
              isActive
                ? "border-brand text-ink bg-brand/[0.05]"
                : "border-line text-ink-faint hover:border-line-strong hover:text-ink hover:bg-ink/[0.03]"
            }`}
          >
            {/* The nudge lives on the text, not on padding — animating padding
                would reflow the rail on every hover. */}
            <span
              className={`transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isActive ? "translate-x-0.5" : "group-hover:translate-x-1"
              }`}
            >
              {s.label}
            </span>
          </a>
        );
      })}
    </nav>
  );
}

/**
 * The same index below lg, where there is no room for a sidebar and the page
 * runs past 6000px. A sticky scroller keeps it reachable from anywhere, and
 * the active pill is pulled into view so the current section is never off to
 * the side of a strip the reader cannot see all of.
 */
function MobileSectionNav({ sections, active }) {
  const scrollerRef = useRef(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || !active) return;
    const pill = scroller.querySelector(`[data-pill="${active}"]`);
    if (!pill) return;

    // scrollTo on the strip, not scrollIntoView on the pill — the latter
    // would drag the whole page along with it.
    scroller.scrollTo({
      left: pill.offsetLeft - scroller.clientWidth / 2 + pill.offsetWidth / 2,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, [active]);

  return (
    <div className="border-line-subtle bg-muted/85 sticky top-0 z-30 -mx-[var(--shell-pad)] border-b backdrop-blur-lg lg:hidden">
      <nav
        ref={scrollerRef}
        aria-label="Sections"
        className="no-scrollbar flex gap-2 overflow-x-auto px-[var(--shell-pad)] py-3"
      >
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            data-pill={s.id}
            aria-current={active === s.id ? "true" : undefined}
            className={`text-label-sm flex min-h-10 shrink-0 items-center rounded-full px-4 whitespace-nowrap transition-[color,background-color,border-color,transform] duration-300 active:scale-95 ${
              active === s.id
                ? "bg-ink border-ink border text-white"
                : "bg-canvas text-ink-soft border-line hover:border-ink/30 hover:text-ink border"
            }`}
          >
            {s.label}
          </a>
        ))}
      </nav>
    </div>
  );
}

/** Placeholder frame until real artwork lands, so the rhythm is honest. */
function Media({ media }) {
  if (media?.src) {
    return (
      <figure className="flex flex-col gap-3">
        <img
          src={media.src}
          alt={media.alt ?? ""}
          className="border-line-subtle w-full rounded-card border"
        />
        {media.caption && (
          <figcaption className="text-body-sm text-ink-faint">{media.caption}</figcaption>
        )}
      </figure>
    );
  }

  return (
    <div
      aria-hidden="true"
      className="border-line bg-canvas/60 text-mono-sm font-mono text-ink-faint grid aspect-[16/9] w-full place-items-center rounded-card border border-dashed uppercase"
    >
      Image placeholder
    </div>
  );
}

export default function CaseStudy() {
  const { slug } = useParams();
  const study = getCaseStudy(slug);
  const { openContact } = useContact();
  const [active, setActive] = useState(study?.sections[0]?.id ?? null);
  const sectionRefs = useRef({});

  useEffect(() => {
    if (!study) return undefined;

    const onScroll = () => {
      let current = study.sections[0]?.id ?? null;
      study.sections.forEach((s) => {
        const el = sectionRefs.current[s.id];
        if (!el) return;
        if (el.getBoundingClientRect().top <= 200) current = s.id;
      });
      setActive(current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [study]);

  // An unknown slug is a dead URL, not an empty page.
  if (!study) return <Navigate to="/" replace />;

  const reveal = (props) =>
    prefersReducedMotion() ? { ...props, y: 0, duration: 0 } : props;

  return (
    <>
      <main className="bg-muted min-h-screen pt-10 sm:pt-14">
        <div className="shell">
          {/* Back scrolls away with the page; the index below it stays put. */}
          <div className="pb-6 lg:hidden">
            <BackButton />
          </div>
          <MobileSectionNav sections={study.sections} active={active} />

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-16 xl:grid-cols-[220px_minmax(0,1fr)] xl:gap-24">
            <aside className="hidden lg:block">
              <div className="sticky top-12 flex flex-col gap-8">
                <BackButton />
                <SectionNav sections={study.sections} active={active} />
              </div>
            </aside>

            <article className="flex min-w-0 max-w-[860px] flex-col gap-14 pt-8 sm:gap-20 lg:pt-0">
              <header className="flex flex-col gap-6">
                <p className="text-mono-md font-mono text-brand uppercase">{study.eyebrow}</p>
                <h1 className="text-display-lg font-display text-ink max-w-[18ch] text-balance">
                  {study.title}
                </h1>
                <p className="text-body-xl text-ink-soft max-w-[60ch] text-pretty">
                  {study.summary}
                </p>
              </header>

              <Media media={study.hero} />

              {/* Role / timeline / team / skills, the way the reference sets
                  them: one row of labelled columns under the hero. */}
              <dl className="border-line grid grid-cols-2 gap-x-8 gap-y-8 border-y py-8 sm:grid-cols-4">
                {study.meta.map((m) => (
                  <div key={m.label} className="flex flex-col gap-2">
                    <dt className="text-mono-sm font-mono text-ink-faint uppercase">{m.label}</dt>
                    <dd className="text-body-sm text-ink">{m.value}</dd>
                  </div>
                ))}
              </dl>

              {study.sections.map((s) => (
                <section
                  key={s.id}
                  id={s.id}
                  ref={(el) => (sectionRefs.current[s.id] = el)}
                  className="flex scroll-mt-[84px] flex-col gap-6 lg:scroll-mt-12"
                >
                  <Reveal {...reveal({ y: 24 })} className="flex flex-col gap-4">
                    <p className="text-mono-sm font-mono text-brand uppercase">{s.label}</p>
                    <h2 className="text-heading-xl font-display text-ink max-w-[24ch] text-balance">
                      {s.statement}
                    </h2>
                  </Reveal>

                  {s.body?.map((para, i) => (
                    <p key={i} className="text-body-lg text-ink-soft max-w-[68ch] text-pretty">
                      {para}
                    </p>
                  ))}

                  {s.points && (
                    <div className="mt-2 flex flex-col gap-8">
                      {s.points.map((pt) => (
                        <div key={pt.title} className="border-line flex flex-col gap-2 border-t pt-6">
                          <h3 className="text-heading-sm text-ink">{pt.title}</h3>
                          <p className="text-body-md text-ink-soft max-w-[68ch] text-pretty">
                            {pt.body}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {s.media !== undefined && <Media media={s.media} />}
                </section>
              ))}

              {/* Closing action, so the page ends somewhere other than a dead
                  stop at the last paragraph. */}
              <div className="border-line flex flex-col items-start gap-6 border-t pt-10 pb-16 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-heading-sm text-ink max-w-[28ch] text-balance">
                  Want the walkthrough, including the parts that did not work?
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <Button variant="accent" size="md" icon={Phone} onClick={openContact}>
                    Contact Me
                  </Button>
                  <BackButton />
                </div>
              </div>
            </article>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
