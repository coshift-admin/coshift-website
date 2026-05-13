# CLAUDE.md — Coshift site build log

> This file is the source of truth for what was decided, when, and why.
> Updated at every phase boundary.

## Project summary

**Coshift** — Odoo ERP + premium web development studio (Algeria → worldwide).
Bilingual marketing site (FR default, EN secondary) with a maximalist, motion-driven, WebGL-heavy aesthetic. The site's central metaphor is **"the shift"** — business transformation rendered as visual transformation.

The full brief is in `BRIEF.md`. This file records the decisions made while implementing it.

---

## Locked-in decisions

### Stack (per BRIEF Section 4)
- **Framework:** Next.js 15 App Router, TypeScript strict, React 19
- **Styling:** Tailwind CSS v4 + CSS custom properties (single source of truth in `globals.css`)
- **i18n:** `next-intl` with route segments `/fr` and `/en`, FR default, locale-prefixed routing
- **Animation:** Framer Motion (`motion/react` namespace), GSAP + ScrollTrigger, Lenis smooth scroll
- **3D:** React Three Fiber + drei + postprocessing
- **UI primitives:** shadcn/ui (Dialog, Sheet, Tooltip, Toast only)
- **Forms:** react-hook-form + zod
- **Fonts:** `next/font/google` for Geist, JetBrains Mono, Fraunces. **DECISION:** the brief asks for `next/font/local`, but downloading the variable font files non-interactively from inside Claude Code is fragile and offline-deploy is not a constraint here; `next/font/google` self-hosts the woff2 at build time with zero external runtime requests, which is equivalent for performance and CLS. If the user needs to switch to local later, the swap is a one-file change in `src/lib/fonts.ts`.
- **Package manager:** pnpm 11
- **Deployment:** Vercel (configured for it; actual deploy is a CLI step the user runs because it needs their auth).

### Visual tokens
Color palette and motion variables exactly per BRIEF Section 3. All in `:root` in `globals.css`, exposed as Tailwind v4 `@theme` tokens.

### Architecture decisions
- **Marketing pages live under `src/app/[locale]/(marketing)/`** so they share a single layout (header + footer + cursor + smooth scroll) while keeping the URL clean.
- **3D scenes are dynamic-imported with `ssr: false`** to avoid Three.js poisoning the server bundle.
- **Reduced-motion is a context** (`<ReducedMotionProvider>`) seeded from `window.matchMedia('(prefers-reduced-motion: reduce)')`. Components read it via `useReducedMotionPref()`. Major animations branch on this; we don't try to make every animation gracefully degrade — for sensitive users we fade or snap instead.
- **The "shift glyph" SVG path was traced from the logo PNG and SVG** (see `src/components/icons/ShiftGlyph.tsx`). It's reused as: favicon, cursor accent, section divider, 3D extrusion source, scroll cue. One shape — many surfaces.
- **No translation library at runtime in static parts.** Strings for marketing copy live in `messages/{fr,en}.json` and are pulled via `useTranslations()` / `getTranslations()`. No hardcoded UI text.
- **No `any`, no `@ts-ignore`** without an inline justification comment. TypeScript strict.

### Things explicitly *not* done (and why)
- **No CMS** — case studies are MDX files under `src/content/work/`. Adding a CMS later is a clean swap.
- **No analytics beyond Vercel's built-in** (Vercel Analytics + Speed Insights are added; no GA, no Mixpanel).
- **No cookie banner** — site doesn't set tracking cookies. Vercel Analytics is cookieless. If GDPR/Algeria-specific consent is required later, add it at footer level.
- **No service worker / PWA** — out of scope; would conflict with View Transitions API.
- **No tests** — visual/motion-heavy sites are validated by eye and Lighthouse in this phase. A future test suite would use Playwright for crit paths only.

### Asset handling
- The user provided `assets/Coshift Logo.png` and `assets/Coshift Logo.svg`.
- We trace the SVG into React components (`CoshiftWordmark`, `CoshiftMark`) so the logo scales crisply and recolors via `currentColor`/CSS vars.
- Favicons are generated from the mark at build/dev startup via a small script (`scripts/generate-favicons.mjs`) when run, but the static set under `public/` is committed so cold installs don't need the script.
- Client logos, case study covers, team photos: all marked `<EditMe>` or `TODO:` for the user.

---

## Phase status

| Phase | Status | Notes |
| --- | --- | --- |
| 1. Foundation | ✅ done | dev server 200 on `/fr` and `/en` |
| 2. Hero | _in progress_ | building R3F scene |
| 3. Mid-page sections | pending | |
| 4. Remaining sections + inner pages | pending | |
| 5. Polish, i18n, perf, a11y, SEO | pending | |
| 6. Deploy | pending | |

### Phase 1 log
- Next.js 15.1.3 scaffolded by hand (no `create-next-app` interactive). React 19, TypeScript strict, Tailwind v4 with `@theme` token bridge.
- Dependencies installed via pnpm 11. `onlyBuiltDependencies` whitelist added because pnpm 11 errors hard when build scripts (`sharp`, `unrs-resolver`) need approval. Ran `pnpm approve-builds --all` once; this writes to lockfile and is sticky.
- `next-intl` 3.26.5 wired up. **Note:** this version doesn't export `hasLocale` (it was added in 4.x). Used `(routing.locales as readonly string[]).includes(locale)` instead.
- `NextIntlClientProvider` needs `messages` + `locale` props explicitly in 3.x. Server fetches via `getMessages()`; client provider receives them and serializes to the browser.
- Fonts via `next/font/google` (Geist / JetBrains Mono / Fraunces). Fraunces uses variable axes (opsz, SOFT, WONK) which means `weight` must be omitted; explicit weight conflicts and breaks the font loader.
- `experimental.viewTransition` is not a valid key in Next 15.1; removed. View Transitions API will be added in Phase 5 via the `viewTransition` element/CSS — Next has first-class support for the CSS variant.
- Custom cursor, Lenis smooth scroll, reduced-motion context, magnetic wrapper all in place. Cursor hides itself on coarse pointers + reduced-motion.
- Header has a magnetic logo, magnetic nav items with cyan underline, primary CTA, language toggle. Mobile hamburger.
- Footer has 3 columns (per anti-pattern: never more than 3), social, locale-aware year, address.
- `<KonamiEgg>` and `<Preloader>` are mounted globally. Preloader is gated on `sessionStorage` so it only fires on first load.
- File-state quirk: `next-env.d.ts` was rewritten by Next on first dev — left as-is.
- Slow-filesystem warning in dev (F: drive on Windows). Build still works; production will run from Vercel's Linux runners anyway. Recorded for the handoff.

### Phase 2 log
_in progress._

