/**
 * Text that rolls letter by letter when an ancestor marked `group` is hovered
 * or focused: the resting set lifts out while an identical set rises into its
 * place, staggered left to right.
 *
 * Both copies are aria-hidden — put the real name on the interactive ancestor
 * (`aria-label`), or a screen reader announces the text twice.
 *
 * The stagger is capped because a long label at a fixed per-letter delay keeps
 * animating well after the pointer has moved on.
 */
export default function RollingText({ text, step = 16, maxStagger = 260 }) {
  const letters = [...text];
  const perLetter = Math.min(step, maxStagger / Math.max(letters.length, 1));

  const row = (rising) =>
    letters.map((ch, i) => (
      <span
        key={`${rising ? "in" : "out"}-${i}`}
        className={`inline-block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          rising
            ? "translate-y-full group-hover:translate-y-0 group-focus-visible:translate-y-0"
            : "group-hover:-translate-y-full group-focus-visible:-translate-y-full"
        }`}
        style={{ transitionDelay: `${i * perLetter}ms` }}
      >
        {ch === " " ? " " : ch}
      </span>
    ));

  return (
    <span aria-hidden="true" className="relative block overflow-hidden">
      <span className="flex flex-nowrap">{row(false)}</span>
      <span className="absolute inset-0 flex flex-nowrap">{row(true)}</span>
    </span>
  );
}
