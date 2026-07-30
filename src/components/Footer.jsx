import { contact } from "../data/content";

const planetIcon = "/planet_24dp_000000_FILL0_wght200_GRAD-25_opsz24%201.svg";

export default function Footer() {
  return (
    <footer className="bg-[#121212] px-5 py-16 md:px-10 md:py-24 xl:px-20">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-5">
        <div className="h-px w-full bg-accent" />

        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-5">
            <p className="font-geist-mono text-lg text-accent uppercase">Location</p>
            <div className="flex items-center gap-2">
              <img src={planetIcon} alt="" className="size-6" />
              <p className="font-geist text-sm text-surface-soft">{contact.location}</p>
            </div>
          </div>

          <div className="flex flex-col gap-5 sm:items-end sm:text-right">
            <p className="font-geist-mono text-lg text-accent uppercase">Say Hello To Me</p>
            <div className="flex flex-col gap-5">
              <a
                href={`mailto:${contact.email}`}
                data-cursor="hover"
                className="font-geist text-sm text-surface-soft underline underline-offset-2 transition-colors hover:text-accent"
              >
                {contact.email}
              </a>
              {contact.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="hover"
                  className="font-geist text-sm text-surface-soft transition-colors hover:text-accent"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
