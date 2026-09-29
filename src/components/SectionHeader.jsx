import Reveal from "./Reveal";

/**
 * The title / intro block every section opens with.
 *
 * Figma alternates centred and left-aligned headers between sections, so
 * alignment is a prop rather than a constant — each section passes what its
 * frame specifies.
 *
 * That alternation only applies from lg up. On a phone the measure is ~342px,
 * and centring a heading and a three-line intro inside it produces two ragged
 * edges and leaves the section reading as if it were indented from its
 * neighbours. Everything is left-aligned below lg so every section starts on
 * the same vertical line.
 */
export default function SectionHeader({ title, intro, align = "left", className = "" }) {
  const centered = align === "center";

  return (
    <Reveal
      stagger={0.09}
      y={28}
      className={`flex flex-col items-start gap-3 text-left sm:gap-4 ${
        centered ? "lg:items-center lg:text-center" : ""
      } ${className}`}
    >
      <h2
        className={`text-display-lg font-display text-ink text-balance ${
          centered ? "lg:max-w-[1100px]" : "max-w-[18ch]"
        }`}
      >
        {title}
      </h2>

      {intro && <p className="text-body-xl text-ink-soft max-w-[760px] text-pretty">{intro}</p>}
    </Reveal>
  );
}
