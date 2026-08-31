import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { gsap } from "../lib/gsap";
import { nav, resumeLink } from "../data/content";
import ContactButton from "./ContactButton";

const wajahatLogo = "/Wajahat%20Logo.png";
const northEastIcon = "/north_east.svg";

export default function Header() {
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
        className="fixed top-0 z-50 w-full border-b border-line/70 bg-surface-soft/90 backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-[1920px] items-center justify-between gap-10 px-5 py-5 md:px-10 xl:px-[100px]">
          <a href="#top" className="flex shrink-0 items-center gap-2">
            <img src={wajahatLogo} alt="Wajahat Sheikh" className="size-6 rounded-full" />
            <span className="font-geist-mono text-sm text-muted uppercase">
              wajahat sheikh
            </span>
          </a>

          <nav className="hidden items-center gap-[60px] xl:flex">
            {nav.map((item) => (
              <a
                key={item.label}
                href={item.href}
                data-cursor="hover"
                className="group relative font-geist-mono text-xs text-muted uppercase transition-colors hover:text-heading"
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
              className="group flex items-center gap-1 font-geist-mono text-xs text-muted uppercase transition-colors hover:text-heading"
            >
              Resume
              <img
                src={northEastIcon}
                alt=""
                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </nav>

          <div className="hidden shrink-0 xl:block">
            <ContactButton />
          </div>

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="text-heading xl:hidden"
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </header>

      <div
        ref={overlayRef}
        className="fixed inset-0 z-40 hidden flex-col justify-center gap-8 bg-surface-soft px-8 xl:hidden"
        style={{ clipPath: "inset(0 0 100% 0)" }}
      >
        <nav ref={linksRef} className="flex flex-col gap-6">
          {nav.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="font-tiempos text-3xl text-heading"
            >
              {item.label}
            </a>
          ))}
          <a
            href={resumeLink}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 font-tiempos text-3xl text-heading"
          >
            Resume <img src={northEastIcon} alt="" className="size-6" />
          </a>
          <ContactButton className="mt-4 w-fit" onBeforeOpen={() => setMenuOpen(false)} />
        </nav>
      </div>
    </>
  );
}
