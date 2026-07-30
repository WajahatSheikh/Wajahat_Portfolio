import { useEffect, useRef, useState } from "react";
import { Check, Copy, Mail, MessageCircle, X } from "lucide-react";
import { gsap } from "../lib/gsap";
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
    <div className="flex w-full items-center gap-3">
      <span
        className="flex shrink-0 items-center justify-center rounded-lg p-2 text-white"
        style={{ backgroundColor: iconBg }}
      >
        <Icon size={24} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-geist-mono text-xs text-muted uppercase">{label}</p>
        <p className="truncate font-geist text-[15px] text-heading">{value}</p>
      </div>
      <button
        type="button"
        aria-label={`Copy ${label}`}
        data-cursor="hover"
        onClick={handleCopy}
        className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted transition-colors hover:text-accent"
      >
        {copied ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
      </button>
    </div>
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
    gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    gsap.fromTo(
      modalRef.current,
      { opacity: 0, y: 16, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "power3.out" },
    );

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
      className="fixed inset-0 z-[90] hidden items-start justify-center bg-heading/20 px-5 pt-28"
      style={{ display: "none" }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label="Get in touch"
        className="flex w-full max-w-[380px] flex-col gap-4 rounded-2xl bg-white p-5 shadow-[0_4px_12px_rgba(12,12,13,0.1),0_1px_4px_rgba(12,12,13,0.05)]"
      >
        <div className="flex w-full items-center justify-between">
          <h3 className="font-geist text-lg leading-6 font-semibold text-heading">Get in Touch</h3>
          <button
            type="button"
            aria-label="Close"
            data-cursor="hover"
            onClick={handleClose}
            className="text-muted transition-colors hover:text-heading"
          >
            <X size={20} />
          </button>
        </div>

        <p className="font-geist text-sm leading-[22px] text-muted">
          I usually reply within a day.
        </p>

        <div className="h-px w-full bg-muted/15" />

        <div className="flex w-full flex-col gap-4">
          <CopyRow icon={Mail} iconBg="#f77332" label="Email" value={contact.email} />
          <CopyRow icon={MessageCircle} iconBg="#25D366" label="WhatsApp" value={contact.whatsapp} />
        </div>
      </div>
    </div>
  );
}
