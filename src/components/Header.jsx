import { useEffect, useRef, useState, useCallback } from "react";
import { Download, Menu, X } from "lucide-react";
import { gsap } from "../lib/gsap";
import { prefersReducedMotion } from "../lib/motion";
import { headerHeight } from "../lib/layout";
import { nav, resumeLink } from "../data/content";
import Button from "./ui/Button";
import RollingText from "./ui/RollingText";

const SECTION_IDS = nav.map((item) => item.href.slice(1));

export default function Header() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const listRef = useRef(null);
  const itemRefs = useRef([]);
  const indicatorRef = useRef(null);
  const lastScrollY = useRef(0);
  const menuOpenRef = useRef(false);

  useEffect(() => {
    menuOpenRef.current = menuOpen;
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  /**
   * Slide the pill behind whichever item is being pointed at, falling back to
   * the section currently in view. Position is read from layout rather than
   * stored, so it survives a font swap or a resize reflowing the labels.
   */
  const moveIndicator = useCallback((index, animate = true) => {
    const el = itemRefs.current[index];
    const indicator = indicatorRef.current;
    if (!el || !indicator) return;

    const target = {
      x: el.offsetLeft,
      width: el.offsetWidth,
      autoAlpha: 1,
    };

    if (animate && !prefersReducedMotion()) {
      gsap.to(indicator, { ...target, duration: 0.42, ease: "power3.out" });
    } else {
      gsap.set(indicator, target);
    }
  }, []);

  // Park the pill on the active item on mount and whenever the active
  // section, the hovered item, or the viewport width changes.
  useEffect(() => {
    const index = hoverIndex ?? activeIndex;
    moveIndicator(index, true);

    const onResize = () => moveIndicator(hoverIndex ?? activeIndex, false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [hoverIndex, activeIndex, moveIndicator]);

  // Fonts land after first paint and change every label width under the pill.
  useEffect(() => {
    if (!document.fonts?.ready) return;
    document.fonts.ready.then(() => moveIndicator(activeIndex, false));
  }, [activeIndex, moveIndicator]);

  // Scroll-spy + hide-on-scroll-down.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const h = headerHeight();
      setScrolled(y > 8);

      if (!menuOpenRef.current) {
        if (y < h) setHidden(false);
        else if (y > lastScrollY.current + 10) setHidden(true);
        else if (y < lastScrollY.current - 5) setHidden(false);
      }
      lastScrollY.current = y;

      let current = 0;
      SECTION_IDS.forEach((id, i) => {
        const el = document.getElementById(id);
        if (!el) return;
        if (el.getBoundingClientRect().top <= h + 24) current = i;
      });
      setActiveIndex(current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The links stay plain anchors — the Lenis handler in smoothScroll.js does
  // the scrolling for the whole page. This only dismisses the mobile sheet.
  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        hidden && !menuOpen ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      {/* Figma gives the nav a solid #eeeef2 fill, which works while it sits on
          the hero but leaves a hard grey band once the white sections scroll
          under it. This fades the same surface in only after the hero, as
          translucent glass, so the bar belongs to whatever is behind it. */}
      <div
        aria-hidden="true"
        className={`bg-muted/72 border-line-subtle absolute inset-0 -z-10 border-b backdrop-blur-xl transition-opacity duration-400 ease-out ${
          scrolled || menuOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        className={`shell flex items-center justify-between gap-4 transition-[height] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          scrolled ? "h-header-compact" : "h-header"
        }`}
      >
        <a
          href="#top"
          data-cursor="hover"
          aria-label="Wajahat Sheikh — home"
          className="group relative shrink-0"
        >
          <span className="glass-pill flex size-11 items-center justify-center overflow-hidden rounded-full transition-transform duration-400 ease-out group-hover:scale-105">
            <img
              src="/Wajahat%20Logo.png"
              alt=""
              className="size-full object-cover"
              width="44"
              height="44"
            />
          </span>
        </a>

        <div className="flex items-center gap-4 lg:gap-10">
          {/* Desktop pill nav */}
          <nav aria-label="Primary" className="hidden lg:block">
            <ul
              ref={listRef}
              onMouseLeave={() => setHoverIndex(null)}
              className="glass-pill relative flex items-center gap-1 rounded-full p-1.5"
            >
              {/* Sliding background — the one element that actually moves. */}
              <span
                ref={indicatorRef}
                aria-hidden="true"
                className="pointer-events-none absolute top-1.5 bottom-1.5 left-0 rounded-full bg-white opacity-0 shadow-[0_1px_2px_rgba(16,16,24,0.10)]"
              />

              {nav.map((item, i) => (
                <li key={item.href} ref={(el) => (itemRefs.current[i] = el)}>
                  <a
                    href={item.href}
                    data-cursor="hover"
                    onMouseEnter={() => setHoverIndex(i)}
                    onFocus={() => setHoverIndex(i)}
                    onClick={closeMenu}
                    aria-current={activeIndex === i ? "true" : undefined}
                    aria-label={item.label}
                    className={`group relative z-10 block rounded-full px-4 py-2 text-label-sm whitespace-nowrap transition-colors duration-300 ${
                      activeIndex === i || hoverIndex === i ? "text-ink" : "text-ink-soft"
                    }`}
                  >
                    <RollingText text={item.label} />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <Button
            as="a"
            href={resumeLink}
            target="_blank"
            rel="noreferrer"
            variant="brand"
            size="md"
            icon={Download}
            className="hidden sm:inline-flex"
          >
            <span className="hidden md:inline">Download Resume</span>
            <span className="md:hidden">Resume</span>
          </Button>

          <button
            type="button"
            data-cursor="hover"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="glass-pill flex size-11 items-center justify-center rounded-full text-ink lg:hidden"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile / tablet sheet */}
      <div
        id="mobile-menu"
        className={`shell overflow-hidden transition-[max-height,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden ${
          menuOpen ? "max-h-[70vh] opacity-100" : "pointer-events-none max-h-0 opacity-0"
        }`}
      >
        <nav
          aria-label="Mobile"
          className="glass-pill mt-2 flex flex-col gap-1 rounded-panel p-3"
        >
          {nav.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              className={`rounded-full px-4 py-3 text-label-lg transition-colors ${
                activeIndex === i ? "bg-white text-ink" : "text-ink-soft hover:bg-white/60"
              }`}
            >
              {item.label}
            </a>
          ))}

          <Button
            as="a"
            href={resumeLink}
            target="_blank"
            rel="noreferrer"
            variant="brand"
            size="md"
            icon={Download}
            magnetic={false}
            className="mt-2 w-full sm:hidden"
          >
            Download Resume
          </Button>
        </nav>
      </div>
    </header>
  );
}
