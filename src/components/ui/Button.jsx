import { useRef, useEffect } from "react";
import { gsap } from "../../lib/gsap";
import { ctaGlow } from "../../lib/ctaGlow";
import { prefersReducedMotion } from "../../lib/motion";

// Figma ships two control heights (44 and 56) and three fills. Everything
// else about a CTA — radius, icon gap, gloss — is constant, so it lives here
// once instead of being re-typed per section.
const SIZES = {
  md: "h-11 gap-2 px-5 text-label-md",
  lg: "h-14 gap-2 px-5 text-label-lg",
};

const ICON_SIZE = { md: 20, lg: 24 };

const VARIANTS = {
  // White on #f75c03 is 2.9:1 and fails AA, so text-bearing accent fills use
  // the darkened --color-accent-strong. The Figma orange stays the brand
  // colour everywhere it is not carrying 14px white text.
  accent:
    "bg-accent-strong text-white border border-accent-strong shadow-[inset_0_-2px_2px_2px_rgba(255,255,255,0.25)]",
  brand:
    "bg-brand text-white border border-brand shadow-[inset_0_-2px_2px_2px_rgba(255,255,255,0.25)]",
  glass:
    "glass-chip text-ink shadow-[inset_0_-2px_2px_2px_rgba(255,255,255,0.25)]",
  outline:
    "bg-transparent text-ink border border-line hover:border-ink/40",
};

export default function Button({
  as = "button",
  variant = "accent",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  children,
  className = "",
  magnetic = true,
  ...rest
}) {
  const ref = useRef(null);
  const iconRef = useRef(null);

  // Magnetic pull. GSAP writes `transform`, while the hover lift in
  // `.cta-glow` writes the standalone `translate` property — different
  // properties, so the two compose instead of fighting.
  useEffect(() => {
    const el = ref.current;
    if (!el || !magnetic) return undefined;
    if (prefersReducedMotion()) return undefined;
    if (window.matchMedia("(pointer: coarse)").matches) return undefined;

    const moveX = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
    const moveY = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      moveX((e.clientX - (rect.left + rect.width / 2)) * 0.22);
      moveY((e.clientY - (rect.top + rect.height / 2)) * 0.32);
    };
    const onLeave = () => {
      moveX(0);
      moveY(0);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      gsap.killTweensOf(el);
    };
  }, [magnetic]);

  // The icon leans in the direction it points — a chevron drops, everything
  // else drifts along the reading direction.
  const handleEnter = () => {
    if (!iconRef.current || prefersReducedMotion()) return;
    gsap.to(iconRef.current, {
      x: iconPosition === "right" ? 3 : -2,
      duration: 0.35,
      ease: "power3.out",
    });
  };
  const handleLeave = () => {
    if (!iconRef.current) return;
    gsap.to(iconRef.current, { x: 0, duration: 0.4, ease: "power3.out" });
  };

  const Tag = as;
  const iconNode = Icon ? (
    <span ref={iconRef} className="inline-flex shrink-0">
      <Icon size={ICON_SIZE[size]} strokeWidth={2} aria-hidden="true" />
    </span>
  ) : null;

  return (
    <Tag
      ref={ref}
      data-cursor="hover"
      className={`cta-glow inline-flex items-center justify-center rounded-full font-medium whitespace-nowrap ${SIZES[size]} ${VARIANTS[variant]} ${className}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      {...ctaGlow}
      {...rest}
    >
      {iconPosition === "left" && iconNode}
      <span>{children}</span>
      {iconPosition === "right" && iconNode}
    </Tag>
  );
}
