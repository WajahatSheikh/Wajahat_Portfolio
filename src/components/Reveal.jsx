import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap";

export default function Reveal({
  as: Tag = "div",
  children,
  className = "",
  delay = 0,
  y = 40,
  duration = 0.9,
  start = "top 85%",
  stagger,
  ...rest
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const targets = stagger ? el.children : el;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { y, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration,
          delay,
          ease: "power3.out",
          stagger: stagger || 0,
          scrollTrigger: {
            trigger: el,
            start,
          },
        },
      );
    }, el);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [delay, y, duration, start, stagger]);

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
