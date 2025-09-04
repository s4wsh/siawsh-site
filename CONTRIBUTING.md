# Contributing

Short, opinionated guide to keep this codebase consistent.

## Stack
- Next.js App Router + TypeScript + Tailwind CSS
- React Three Fiber (R3F) for 3D, Framer Motion for micro‑interactions
- Path aliases via `@/` (see `tsconfig.json`)

## Naming & Structure
- Components: `src/components/FooBar.tsx`
  - File and component name in PascalCase, default export.
  - Client‑only wrappers use `FooBarClient.tsx` with `"use client"` and `next/dynamic` if needed.
  - Route‑specific components may live beside the route (e.g. `src/app/work/[slug]/Something.tsx`) if not reused.
- Routes (App Router): folders in lower‑kebab‑case.
  - Pages: `page.tsx`, layouts: `layout.tsx`, API: `route.ts`.
  - Dynamic segments: `[slug]`, optional: `[[param]]`, parallel: `@slot`.
  - API endpoints under `src/app/api/<endpoint>/route.ts` (kebab‑case endpoint).
- Aliases: import shared code via `@/components/...`, `@/lib/...`, `@/content/...`.

## UI Rules
- Aesthetic: minimal, future‑modern.
  - Base palette: black/white/neutral. One accent color max per view.
  - Prefer borders, subtle overlays, and light depth over heavy shadows.
  - Rounded radii: `rounded-xl`/`rounded-2xl` for cards and modals.
  - Spacing scale: Tailwind defaults (4/6/8 etc.); avoid magic numbers.
- Motion: subtle and purposeful.
  - Durations ~150–300ms, standard easings; respect reduced motion.
  - Use `framer-motion` for UI transitions; avoid infinite animations.
- Tailwind usage:
  - Prefer existing tokens; avoid arbitrary values unless prototyping.
  - If a pattern repeats, add a token/utility in Tailwind config.
- Accessibility:
  - Maintain contrast for text and borders; visible focus states.
  - Keyboard navigable; alt text for imagery; aria where appropriate.
- Responsiveness:
  - Mobile‑first; test at key breakpoints. Use container widths like `max-w-6xl` for content.

## PR Checklist
- TypeScript passes; no unused exports.
- Imports use `@/` aliases where applicable.
- Names follow the patterns above; UI matches the style rules.
- Screens tested at mobile and desktop; basic a11y checked.

