import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { gsap } from "../lib/gsap";
import { nav, resumeLink } from "../data/content";
import { useContact } from "../context/ContactContext";

export default function Header() {
  const { openContact } = useContact();
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const overlayRef = useRef(null);
  const linksRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        y: -40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.1,
      });
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    if (menuOpen) {
      document.body.style.overflow = "hidden";
      gsap.set(overlay, { display: "flex" });
      gsap.fromTo(
        overlay,
        { clipPath: "inset(0 0 100% 0)" },
        { clipPath: "inset(0 0 0% 0)", duration: 0.5, ease: "power3.inOut" },
      );
      gsap.fromTo(
        linksRef.current.children,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, delay: 0.2, ease: "power3.out" },
      );
    } else {
      document.body.style.overflow = "";
      gsap.to(overlay, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.4,
        ease: "power3.inOut",
        onComplete: () => gsap.set(overlay, { display: "none" }),
      });
    }
  }, [menuOpen]);

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 z-50 w-full border-b border-line/80 bg-surface/85 backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10">
          <a href="#top" className="flex items-center gap-2 text-sm font-semibold tracking-wide">
            <span className="h-2 w-2 rounded-full bg-accent" />
            WAJAHAT SHEIKH
          </a>

          <nav className="hidden items-center gap-8 lg:flex">
            {nav.map((item) => (
              <a
                key={item.label}
                href={item.href}
                data-cursor="hover"
                className="group relative text-xs font-medium tracking-wide text-ink-soft uppercase transition-colors hover:text-ink"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
            <a
              href={resumeLink}
              target="_blank"
              rel="noreferrer"
              data-cursor="hover"
              className="group flex items-center gap-1 text-xs font-medium tracking-wide text-ink-soft uppercase transition-colors hover:text-ink"
            >
              Resume
              <ArrowUpRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </nav>

          <button
            type="button"
            data-cursor="hover"
            onClick={openContact}
            className="hidden rounded-full bg-accent px-5 py-2.5 text-xs font-semibold tracking-wide text-white uppercase transition-transform duration-300 hover:scale-105 hover:bg-accent-dark lg:inline-block"
          >
            Contact Me
          </button>

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="text-ink lg:hidden"
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </header>

      <div
        ref={overlayRef}
        className="fixed inset-0 z-40 hidden flex-col justify-center gap-8 bg-surface px-8 lg:hidden"
        style={{ clipPath: "inset(0 0 100% 0)" }}
      >
        <nav ref={linksRef} className="flex flex-col gap-6">
          {nav.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="text-3xl font-medium text-ink"
            >
              {item.label}
            </a>
          ))}
          <a
            href={resumeLink}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-3xl font-medium text-ink"
          >
            Resume <ArrowUpRight size={26} />
          </a>
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              openContact();
            }}
            className="mt-4 w-fit rounded-full bg-accent px-6 py-3 text-sm font-semibold tracking-wide text-white uppercase"
          >
            Contact Me
          </button>
        </nav>
      </div>
    </>
  );
}
