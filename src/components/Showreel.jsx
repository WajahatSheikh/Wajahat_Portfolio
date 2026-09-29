import { useCallback, useEffect, useRef, useState } from "react";
import { Play, X } from "lucide-react";
import { gsap } from "../lib/gsap";
import { prefersReducedMotion } from "../lib/motion";
import { showreel } from "../data/content";

export default function Showreel() {
  const [playing, setPlaying] = useState(false);
  const [inRange, setInRange] = useState(false);

  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const videoRef = useRef(null);
  const playButtonRef = useRef(null);

  // The looping preview is a 43 MB GIF, so it is not in the initial payload —
  // it is only mounted once the section is within a screen of the viewport.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInRange(true);
          io.disconnect();
        }
      },
      { rootMargin: "800px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const close = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    setPlaying(false);
    // Send focus somewhere sensible rather than letting it fall to <body>.
    requestAnimationFrame(() => playButtonRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!playing) return undefined;
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [playing, close]);

  // Scrolling away mid-playback should stop the audio, not leave it talking
  // from six sections up.
  useEffect(() => {
    const card = cardRef.current;
    if (!card || !playing) return undefined;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) videoRef.current?.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(card);
    return () => io.disconnect();
  }, [playing]);

  // The card settles under the header as it arrives and eases back as the work
  // grid slides over it — the depth cue that makes the two sections read as
  // stacked rather than sequential.
  useEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    if (!section || !card) return undefined;
    if (prefersReducedMotion()) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        card,
        { scale: 0.93, y: 40 },
        {
          scale: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "top 22%",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        },
      );

      gsap.to(card, {
        scale: 0.96,
        opacity: 0.55,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "bottom 78%",
          end: "bottom 22%",
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="showreel"
      ref={sectionRef}
      aria-label="Showreel"
      className="bg-muted relative z-0"
    >
      {/* Full-bleed: the reel runs edge to edge rather than sitting inside the
          1440 shell, so no gutter and no radius. */}
      <div className="pb-10 sm:pb-16 lg:pb-24">
        {/* Extra height below the sticky card is what gives it something to
            travel through while pinned under the header. */}
        <div className="relative pb-[6vh] lg:pb-[14vh]">
          <div
            ref={cardRef}
            className="will-parallax sticky top-[calc(var(--spacing-header)+12px)] origin-top"
          >
            {/* Transparent fill — the artwork carries its own background, and
                an opaque card showed as a dark slab before the GIF decoded. */}
            <div className="relative aspect-video w-full overflow-hidden bg-transparent">
              {playing ? (
                <>
                  <video
                    ref={videoRef}
                    src={showreel.video}
                    className="absolute inset-0 size-full object-cover"
                    controls
                    autoPlay
                    playsInline
                    preload="auto"
                    onEnded={close}
                  />
                  <button
                    type="button"
                    onClick={close}
                    data-cursor="hover"
                    aria-label={showreel.closeLabel}
                    className="glass-card text-ink absolute top-3 right-3 z-20 grid size-10 place-items-center rounded-full transition-transform duration-300 hover:scale-105 active:scale-95 sm:top-4 sm:right-4 sm:size-11"
                  >
                    <X size={18} aria-hidden="true" />
                  </button>
                </>
              ) : (
                <>
                  {inRange && (
                    <img
                      src={showreel.poster}
                      alt=""
                      className="absolute inset-0 size-full object-cover"
                    />
                  )}

                  {/* The play control is the whole surface, and it only
                      materialises on hover so the reel is never covered. */}
                  <button
                    ref={playButtonRef}
                    type="button"
                    onClick={() => setPlaying(true)}
                    data-cursor="hover"
                    aria-label={showreel.playLabel}
                    className="group absolute inset-0 grid cursor-pointer place-items-center focus-visible:outline-offset-[-3px]"
                  >
                    <span className="bg-night/0 group-hover:bg-night/25 group-focus-visible:bg-night/25 absolute inset-0 transition-colors duration-500" />
                    <span className="glass-card text-ink text-label-md flex translate-y-1.5 items-center gap-2.5 rounded-full px-5 py-3 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 group-active:scale-95 sm:px-6 sm:py-3.5 sm:text-label-lg">
                      <Play size={18} className="fill-current" aria-hidden="true" />
                      {showreel.playLabel}
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
