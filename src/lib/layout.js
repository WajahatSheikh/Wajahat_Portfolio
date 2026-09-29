/**
 * Height of the fixed header, read from the `--spacing-header` design token.
 *
 * Read rather than repeated: the bar, the hero's top padding, the anchor
 * offset and every sticky element derive from that one token, and a second
 * copy of the number in JS is what silently drifts when the design changes.
 */
export function headerHeight() {
  if (typeof document === "undefined") return 120;
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--spacing-header");
  return Number.parseFloat(raw) || 120;
}
