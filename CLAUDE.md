# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A single-page React portfolio site for Wajahat Sheikh (product/creative designer), built with Vite. No backend, no router, no test suite — one scrolling page assembled from section components.

## Commands

```bash
npm run dev       # start Vite dev server with HMR
npm run build     # production build to dist/
npm run preview   # preview the production build locally
npm run lint      # run oxlint
```

There is no test runner configured in this repo.

## Architecture

- **Single-page composition**: [src/App.jsx](src/App.jsx) renders one page as an ordered stack of section components (`Hero`, `ProjectsGrid`, `AboutMe`, `WhatIDo`, `TechStack`, `Testimonials`, `Footer`) wrapped in `ContactProvider`. There is no routing — navigation is anchor-link scrolling to section ids (see `nav` in content.js).
- **Content/component separation**: all copy, project lists, testimonials, tech stack, nav links, and contact info live in [src/data/content.js](src/data/content.js) as exported arrays/objects. Components import from there rather than hardcoding text. When asked to change site copy, edit this file, not the component JSX.
- **Global contact modal state**: [src/context/ContactContext.jsx](src/context/ContactContext.jsx) exposes `useContact()` (`isOpen`, `openContact`, `closeContact`). Any component can trigger the contact modal via `openContact()` (e.g. header CTA buttons) without prop drilling; the modal itself lives once at the bottom of `App.jsx`.
- **GSAP for all animation**: [src/lib/gsap.js](src/lib/gsap.js) is the single place `gsap` and `ScrollTrigger` are imported/registered from — always import gsap via `../lib/gsap`, never `import gsap from "gsap"` directly in a component. Animations run inside `gsap.context()` scoped to a ref, cleaned up with `ctx.revert()` in the `useEffect` return.
- **[src/components/Reveal.jsx](src/components/Reveal.jsx)** is the standard scroll-in-view wrapper: wrap section content in `<Reveal>` (props: `as`, `delay`, `y`, `duration`, `start`, `stagger`) rather than writing bespoke ScrollTrigger boilerplate per section. `stagger` animates the wrapped element's direct children individually.
- **Custom cursor**: [src/components/CustomCursor.jsx](src/components/CustomCursor.jsx) replaces the native cursor; interactive elements opt in via `data-cursor="hover"`.
- **Styling**: Tailwind CSS v4 via the `@tailwindcss/vite` plugin (no `tailwind.config.js` — theme is defined inline in [src/index.css](src/index.css) using `@theme`). Custom design tokens (`ink`, `ink-soft`, `ink-faint`, `accent`, `accent-dark`, `surface`, `surface-alt`, `line`, `night`, `night-soft`) are Tailwind color utilities — use `bg-accent`, `text-ink-soft`, etc. rather than raw hex values.
- **Icons**: `lucide-react`.

## Linting

oxlint is configured in [.oxlintrc.json](.oxlintrc.json) with the `react` and `oxc` plugins; `react/rules-of-hooks` is an error. Run `npm run lint` before considering frontend changes done.
