# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A single-page React portfolio site for Wajahat Sheikh (Sr. Product Designer), built with Vite. No backend, no router, no test suite — one scrolling page assembled from section components.

The current visual system is a port of the 2026 Figma redesign
(`TnDXe5Nc5osRrFU0L75Wmx`, frame `217:251`). When adding UI, match that system
rather than inventing new colours, sizes or radii.

## Commands

```bash
npm run dev       # start Vite dev server with HMR
npm run build     # production build to dist/
npm run preview   # preview the production build locally
npm run lint      # run oxlint
```

There is no test runner configured in this repo.

## Architecture

- **Single-page composition**: [src/App.jsx](src/App.jsx) renders an ordered stack of sections inside `ContactProvider` — `Hero`, `MediaBand`, `ProjectsGrid`, `WhatIDo`, `Experience`, `TechStack`, `AboutMe`, `Testimonials`, `ContactCTA`, `Footer`. No routing; navigation is anchor scrolling to section ids.
  - **Section surfaces come from the Figma frame, sampled rather than guessed:** the whole page is one continuous `bg-muted` (#eeeef2) field and **Tech Stack is the only band that breaks to `bg-canvas`**. Contact is the gradient, Footer is `bg-night`. A new section defaults to `bg-muted`.
  - `nav` in content.js **must stay in the same order as App.jsx** — anchor links that run backwards against page order feel broken.
- **Content/component separation**: all copy lives in [src/data/content.js](src/data/content.js). Components import from there rather than hardcoding text. When asked to change site copy, edit this file, not the component JSX. Derived values (the case-study count, capability numbers) are computed from array length/index so they cannot drift.
- **Global contact modal state**: [src/context/ContactContext.jsx](src/context/ContactContext.jsx) exposes `useContact()` (`isOpen`, `openContact`, `closeContact`). Any component triggers the modal via `openContact()` without prop drilling; the modal lives once at the bottom of `App.jsx`.

## Design system

Tokens are defined in `@theme` in [src/index.css](src/index.css) — there is no `tailwind.config.js`. Use the utilities, never raw hex or px.

- **Colour**: `ink` / `ink-soft` / `ink-faint` (text), `brand` / `brand-strong` / `brand-subtle`, `accent` / `accent-strong` / `accent-subtle`, `canvas` / `muted` / `night` / `night-soft` (surfaces), `line-subtle` / `line` / `line-strong` (borders), `glass-clear` / `glass-regular` / `glass-thick` / `glass-stroke`.
  - **`accent-strong` (#d94e00), not `accent`, for any fill carrying white text.** The Figma orange #f75c03 is 2.9:1 against white and fails WCAG AA.
- **Type**: a semantic ramp — `text-display-xl`, `text-display-lg`, `text-heading-xl|lg|md|sm`, `text-body-xl|lg|md|sm`, `text-label-lg|md|sm`, `text-mono-md|sm`. Each carries its own line-height, tracking and weight, so `text-heading-md` alone is the whole style. All sizes are `clamp()`-fluid and **tracking is in `em`, not px** — Figma's px tracking collapses at phone sizes.
- **Families**: `font-sans` (Geist), `font-mono` (Geist Mono), `font-display` (Open Sauce Sans) for section titles, the hero and the footer wordmark. Open Sauce Sans is self-hosted from `public/fonts/OpenSauceSans` — despite the name it is **not** on Google Fonts. Only weights 600 and 700 ship, because every display/heading token asks for 600.
- **Radius**: `rounded-card` (20px) for covers and cards, `rounded-panel` (28px) for large panels, `rounded-full` for controls.
- **Layout**: `.shell` is the page container — content caps at 1440 and the side gutter runs from a **24px floor** up to 60px. `.section-y` is the vertical rhythm, reaching the **140px** design value at 1440. `.section-gap` is the header-to-body gap. Use these three rather than per-section padding, or the rhythm drifts.
- **Glass**: `.glass-chip`, `.glass-pill`, `.glass-card` bundle fill + blur + inner shadows, with opaque `@supports` fallbacks.

## Components

- **[src/components/ui/Button.jsx](src/components/ui/Button.jsx)** is the only CTA. Variants `accent` / `brand` / `glass` / `outline`, sizes `md` (44px) / `lg` (56px). It bundles the hover lift, active press, cursor-tracked wash, shine sweep, icon nudge and magnetic pull. **Never hand-roll a button** — pass `magnetic={false}` for full-width or in-sheet CTAs.
- **[src/components/SectionHeader.jsx](src/components/SectionHeader.jsx)** is the eyebrow/title/intro block every section opens with. `align` is a prop because Figma alternates centred and left-aligned headers.
- **[src/components/Reveal.jsx](src/components/Reveal.jsx)** is the standard scroll-in-view wrapper (`as`, `delay`, `y`, `duration`, `start`, `stagger`). `stagger` animates the wrapped element's direct children. Use it rather than writing per-section ScrollTrigger boilerplate.
- **Icons**: `lucide-react`.

## Animation

- **All GSAP goes through [src/lib/gsap.js](src/lib/gsap.js)** — always `import { gsap } from "../lib/gsap"`, never `from "gsap"` directly. Animations run inside `gsap.context()` scoped to a ref and are cleaned up with `ctx.revert()` in the `useEffect` return.
- **[src/lib/motion.js](src/lib/motion.js)** holds the shared motion helpers: `prefersReducedMotion()`, `useParallax()` (scrubbed, auto-disabled below a width), `useWordReveal()` (headline entrance, restores original markup on cleanup), `useScrollTriggerRefresh()` (re-measures once fonts and images settle — without it every trigger fires early).
- **[src/lib/ctaGlow.js](src/lib/ctaGlow.js)** writes `--mx`/`--my` on pointermove; `.cta-glow` and `.card-glow` in index.css read them. Spread `{...ctaGlow}` onto anything using either class.
- **Every motion path must check `prefersReducedMotion()` and bail**, not just shorten. Bailing before a `fromTo` also avoids leaving elements stuck at `opacity: 0`.

## Linting

oxlint is configured in [.oxlintrc.json](.oxlintrc.json) with the `react` and `oxc` plugins; `react/rules-of-hooks` is an error. Run `npm run lint` before considering frontend changes done.

## Media assets

The showreel in [src/components/Showreel.jsx](src/components/Showreel.jsx) runs full-bleed: the GIF loops as the idle preview, clicking swaps in the MP4 with controls, and the close button or Escape returns to the loop. The GIF is only mounted once the section is within 800px of the viewport.

**Both files are far too large to ship as they are** — `public/videos/yms.gif` is 43 MB and `yms video v2.mp4` is 34 MB. A GIF must download in full before its first frame paints, so the idle state currently blocks on 43 MB. Transcoding that GIF to a muted looping MP4/WebM typically lands under 2 MB and looks identical, and the reel itself wants a compressed 1080p pass. There is no ffmpeg on this machine, so neither has been done.

## Known content gaps

- 4 of the 8 case studies have no cover artwork — they fall back to one of three brand mesh placeholders. Real covers go in `src/assets/projects/` and get wired through the `image` key in content.js.

- `resumeLink` in content.js is still `#`.
