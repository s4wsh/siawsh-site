# TASKS (Bite‑Size)

Small, explicit steps for quick iteration. Check items off or copy/paste into issues.

## Quick Wins
- [ ] Remove duplicate wrapper: delete `src/app/work/WorkScene.tsx` (use `@/components/WorkSceneClient`).
- [ ] Fix `.next/types/validator.ts` error: ensure `src/app/[lang]/work/page.tsx` exports a valid component or remove unused file.
- [ ] Link `CONTRIBUTING.md` from `README.md`.
- [ ] Convert hero images to `next/image` where easy wins exist.

## Components
- [ ] Ensure all components default‑export a PascalCase component.
- [ ] Add `Props` types for components missing explicit props.
- [ ] Replace arbitrary Tailwind values with tokens (if possible).
- [ ] Add loading skeletons where content fetch occurs.
- [ ] Extract repeated layout patterns into small components (e.g., Card, SectionHeader).

## WorkScene (3D)
- [ ] Replace placeholder cube with a minimal branded scene (logo/lines).
- [ ] Add orbit controls (subtle, clamp angles) and camera defaults.
- [ ] Add resize handling and DPR caps for performance.
- [ ] Add `prefers-reduced-motion` check to pause heavy animations.
- [ ] Provide prop hooks: `accentColor`, `background`, `intensity`.

## Routes & App Router
- [ ] Keep route folders kebab‑case; verify all follow this.
- [ ] Move route‑specific one‑offs next to route (avoid polluting `components`).
- [ ] Ensure dynamic segments use `[slug]` and types are enforced where read.
- [ ] Add `notFound()` flows for invalid params in all dynamic routes.
- [ ] Audit redirects and canonical links (avoid duplicate content).

## Content
- [ ] Define `CaseStudy` TS interface and enforce in `src/content/cases.ts`.
- [ ] Validate JSON in `src/content/case-studies/*.json` against the interface at build time.
- [ ] Add `summary` optional fields consistently (challenge/objective/solution/how).
- [ ] Add `images[].alt` across all entries; fallback to title.
- [ ] Add `tags` normalization (kebab‑case) and dedupe.

## SEO
- [ ] Ensure per‑page `generateMetadata` includes title/description and open graph.
- [ ] Add structured data via `JsonLd` for case studies (Project/CreativeWork).
- [ ] Verify `opengraph-image.tsx` and `twitter-image.tsx` for case routes.
- [ ] Add language alternates for `app/[lang]/*` pages.
- [ ] Confirm sitemap includes all case studies with lastmod.

## Performance
- [ ] Replace `<img>` with `next/image` where safe.
- [ ] Audit `dynamic()` usages; limit client bundles; prefer server components.
- [ ] Tree‑shake Drei/three imports (named imports; avoid side‑effectful bundles).
- [ ] Add `preload` hints for key fonts/media.
- [ ] Run Lighthouse; create a small perf budget doc (targets for CLS/LCP/TTI).

## Accessibility
- [ ] Ensure focus rings are visible on interactive elements.
- [ ] Add alt text for all decorative/meaningful images.
- [ ] Verify color contrast in light/dark contexts.
- [ ] Respect reduced motion across Animations and R3F.
- [ ] Provide keyboard navigation for menus/overlays.

## UI Guidelines (enforcement)
- [ ] Enforce B/W base + single accent per view.
- [ ] Use subtle borders/overlays instead of heavy shadows.
- [ ] Standardize radii: `rounded-xl`/`rounded-2xl` for cards/containers.
- [ ] Normalize spacing scale; remove magic numbers.

## API & Forms
- [ ] Add input validation for `api/contact` (zod or lightweight schema).
- [ ] Return consistent error shapes `{ ok, error, details }`.
- [ ] Add basic rate‑limit or Turnstile verification check.
- [ ] Add success/failure toasts or inline messages on contact form.

## Case Studies Page(s)
- [ ] Add filters by tag/year (client state only).
- [ ] Add small inline search over titles/excerpts.
- [ ] Add pagination or “Load more” if count grows.
- [ ] Add share buttons (copy link, X) on detail pages.

## Admin
- [ ] Validate admin API payloads and sanitize inputs.
- [ ] Add optimistic UI on admin page for case edits.
- [ ] Persist draft status and publish times; hide drafts from sitemap.

## Analytics
- [ ] Wrap Analytics behind env flag to disable in preview.
- [ ] Track key events: contact submit, video play, scene interaction.
- [ ] Respect Do Not Track and anonymize IP (if applicable).

## Internationalization
- [ ] Ensure `app/[lang]/*` has fallbacks for missing translations.
- [ ] Add language switcher with canonical/alternate links.
- [ ] Mirror sitemap entries per language.

## Testing & CI
- [ ] Add type‑only unit tests for utils/content typing (if test setup exists).
- [ ] Add `tsc --noEmit` check and `next build` to CI.
- [ ] Add a basic ESLint run to CI.
- [ ] Create a simple GitHub Action for PR validation.

## DX & Repo Hygiene
- [ ] Add `.nvmrc` or engines field for Node version consistency.
- [ ] Add Prettier config (optional) and format scripts.
- [ ] Expand `README.md` with setup, scripts, and deploy notes.
- [ ] Document `ENV` variables in `.env.example`.

## Cleanup
- [ ] Remove dead files/components; run `rg` for unused exports.
- [ ] Normalize imports to `@/` aliases.
- [ ] Ensure no console logs shipped in production.
- [ ] Compress large images in `public/`.

---

Tip: CodeX performs best with small, explicit tasks. Prefer: “Add alt text to images in src/app/case-studies/[slug]/page.tsx” over multi‑part asks.
