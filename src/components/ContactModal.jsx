import { useEffect, useRef, useState } from "react";
import { Check, Copy, Mail, MessageCircle, X } from "lucide-react";
import { gsap } from "../lib/gsap";
import { prefersReducedMotion } from "../lib/motion";
import { contact } from "../data/content";
import { useContact } from "../context/ContactContext";

function CopyRow({ icon: Icon, iconBg, label, value }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — ignore silently
    }
  };

  return (
    /* The whole row is the copy target, not just the trailing icon — a 44px
       button floating at the far edge of a wide row is a small target for a
       thumb and gives no feedback that the row itself is interactive. */
    <button
      type="button"
      aria-label={`Copy ${label}: ${value}`}
      data-cursor="hover"
      onClick={handleCopy}
      className="group border-line-subtle bg-canvas hover:border-brand/30 flex w-full items-center gap-3.5 rounded-card border p-3 text-left transition-colors duration-300 sm:gap-4 sm:p-3.5"
    >
      <span
        aria-hidden="true"
        className="grid size-10 shrink-0 place-items-center rounded-xl text-white sm:size-11"
        style={{ backgroundColor: iconBg }}
      >
        <Icon size={20} />
      </span>

      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-mono-sm font-mono text-ink-faint uppercase">{label}</span>
        <span className="text-label-md text-ink truncate">{value}</span>
      </span>

      <span
        aria-hidden="true"
        className={`grid size-9 shrink-0 place-items-center rounded-lg transition-colors duration-200 ${
          copied ? "text-emerald-600" : "text-ink-faint group-hover:bg-brand-subtle group-hover:text-brand"
        }`}
      >
        {copied ? <Check size={17} /> : <Copy size={17} />}
      </span>

      {/* Announced politely so a screen reader confirms the copy without
          stealing focus from the row. */}
      <span aria-live="polite" className="sr-only">
        {copied ? `${label} copied` : ""}
      </span>
    </button>
  );
}

export default function ContactModal() {
  const { isOpen, closeContact } = useContact();
  const backdropRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const onKey = (e) => {
      if (e.key === "Escape") closeContact();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    gsap.set(backdropRef.current, { display: "flex" });

    if (prefersReducedMotion()) {
      gsap.set([backdropRef.current, modalRef.current], { opacity: 1, y: 0, scale: 1 });
    } else {
      gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, y: 16, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "power3.out" },
      );
    }

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeContact]);

  const handleClose = () => {
    gsap.to(modalRef.current, { opacity: 0, y: 12, scale: 0.96, duration: 0.2, ease: "power2.in" });
    gsap.to(backdropRef.current, {
      opacity: 0,
      duration: 0.2,
      delay: 0.05,
      onComplete: () => {
        gsap.set(backdropRef.current, { display: "none" });
        closeContact();
      },
    });
  };

  return (
    <div
      ref={backdropRef}
      onClick={(e) => e.target === backdropRef.current && handleClose()}
      /* Centred on a phone rather than pinned near the top: at 390px the sheet
         is most of the screen, and a top-anchored dialog leaves a large dead
         band underneath it. */
      className="bg-night/45 fixed inset-0 z-90 hidden items-center justify-center overflow-y-auto p-5 backdrop-blur-sm sm:items-start sm:pt-28"
      style={{ display: "none" }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
        className="glass-card rounded-panel flex w-full max-w-[420px] flex-col gap-5 p-5 sm:gap-6 sm:p-6"
      >
        <div className="flex w-full items-start justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <p className="text-mono-md font-mono text-brand uppercase">Let&apos;s talk</p>
            <h3 id="contact-modal-title" className="text-heading-md font-display text-ink">
              Get in Touch
            </h3>
            <p className="text-body-sm text-ink-soft">I usually reply within a day.</p>
          </div>

          {/* Pulled into the padding so the icon's optical edge lines up with
              the panel's inner edge, and sized to a 40px target. */}
          <button
            type="button"
            aria-label="Close"
            data-cursor="hover"
            onClick={handleClose}
            className="text-ink-faint hover:bg-canvas hover:text-ink -mt-1 -mr-1 grid size-10 shrink-0 place-items-center rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex w-full flex-col gap-2.5">
          <CopyRow icon={Mail} iconBg="#4737ff" label="Email" value={contact.email} />
          <CopyRow icon={MessageCircle} iconBg="#25D366" label="WhatsApp" value={contact.whatsapp} />
        </div>
      </div>
    </div>
  );
}
