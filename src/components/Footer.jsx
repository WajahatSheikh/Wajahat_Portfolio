import { ArrowUp, Briefcase, Camera, Globe, MapPin } from "lucide-react";
import { contact } from "../data/content";
import { useContact } from "../context/ContactContext";
import Reveal from "./Reveal";

const socialIcons = {
  LinkedIn: Briefcase,
  Instagram: Camera,
  Behance: Globe,
};

export default function Footer() {
  const { openContact } = useContact();

  return (
    <footer className="bg-night px-5 pt-16 pb-8 text-night-soft md:px-10 md:pt-24">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-2xl">
          <h2 className="text-3xl leading-tight font-medium text-white md:text-5xl">
            Got an idea worth building? Let&apos;s make it real.
          </h2>
          <button
            type="button"
            data-cursor="hover"
            onClick={openContact}
            className="mt-8 rounded-full bg-accent px-6 py-3 text-xs font-semibold tracking-wide text-white uppercase transition-transform duration-300 hover:scale-105 hover:bg-accent-dark"
          >
            Contact Me
          </button>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-10 border-t border-white/10 pt-10 sm:grid-cols-3">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-semibold tracking-widest text-white/40 uppercase">
              <MapPin size={14} /> Location
            </p>
            <p className="mt-3 text-sm text-white/70">{contact.location}</p>
          </div>

          <div>
            <p className="text-[11px] font-semibold tracking-widest text-white/40 uppercase">
              Say Hello To Me
            </p>
            <a
              href={`mailto:${contact.email}`}
              className="mt-3 block text-sm text-white/70 transition-colors hover:text-accent"
            >
              {contact.email}
            </a>
            <a
              href={`https://wa.me/${contact.whatsapp.replace(/[^\d]/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="mt-1 block text-sm text-white/70 transition-colors hover:text-accent"
            >
              {contact.whatsapp}
            </a>
          </div>

          <div>
            <p className="text-[11px] font-semibold tracking-widest text-white/40 uppercase">
              Elsewhere
            </p>
            <div className="mt-3 flex gap-3">
              {contact.socials.map((s) => {
                const Icon = socialIcons[s.label] || Globe;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    data-cursor="hover"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:text-accent"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row">
          <p>© {new Date().getFullYear()} Wajahat Sheikh. All rights reserved.</p>
          <a
            href="#top"
            data-cursor="hover"
            className="flex items-center gap-1 transition-colors hover:text-accent"
          >
            Back to top <ArrowUp size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
}
