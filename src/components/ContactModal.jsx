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
    <div className="flex items-center gap-4 py-4">
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white"
        style={{ backgroundColor: iconBg }}
      >
        <Icon size={20} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold tracking-widest text-ink-faint uppercase">
          {label}
        </p>
        <p className="truncate text-sm font-medium text-ink">{value}</p>
      </div>
      <button
        type="button"
        aria-label={`Copy ${label}`}
        data-cursor="hover"
        onClick={handleCopy}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line text-ink-soft transition-colors hover:border-accent hover:text-accent"
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
      { opacity: 0, y: 24, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power3.out" },
    );

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeContact]);

  const handleClose = () => {
    gsap.to(modalRef.current, { opacity: 0, y: 16, scale: 0.96, duration: 0.25, ease: "power2.in" });
    gsap.to(backdropRef.current, {
      opacity: 0,
      duration: 0.25,
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
      className="fixed inset-0 z-[90] hidden items-center justify-center bg-ink/40 px-5 backdrop-blur-sm"
      style={{ display: "none" }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label="Get in touch"
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-ink">Get in Touch</h3>
          <button
            type="button"
            aria-label="Close"
            data-cursor="hover"
            onClick={handleClose}
            className="text-ink-faint transition-colors hover:text-ink"
          >
            <X size={20} />
          </button>
        </div>
        <p className="mt-1 text-sm text-ink-soft">I usually reply within a day.</p>

        <div className="mt-4 divide-y divide-line border-t border-line">
          <CopyRow icon={Mail} iconBg="#ea5a2b" label="Email" value={contact.email} />
          <CopyRow icon={MessageCircle} iconBg="#25D366" label="WhatsApp" value={contact.whatsapp} />
        </div>
      </div>
    </div>
  );
}
