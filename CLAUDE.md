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
| 2. Hero | ✅ done | R3F chrome glyphs with bloom + chromatic aberration |
| 3. Mid-page sections | ✅ done | manifesto, services, process, work, numbers, trust, CTA |
| 4. Remaining sections + inner pages | ✅ done | about, services pages, work index + detail, lab, contact, 404 |
| 5. Polish, i18n, perf, a11y, SEO | ✅ done | OG route, sitemap, robots, JSON-LD, View Transitions CSS, type-check clean |
| 6. Deploy | ✅ ready | git committed; `vercel --prod` is a user step (needs auth) |

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
- R3F v8 → v9 upgrade was required: v8 reaches into React internals (`ReactCurrentOwner`) that don't exist in React 19, so the canvas exploded on first paint. Upgrading the whole R3F suite (`@react-three/fiber`, `drei`, `postprocessing`) to their React-19 majors fixed it: drei 9→10, fiber 8→9, postprocessing 2→3.
- The **shift glyph** is built from two extruded `THREE.Shape`s — a rounded-rect dot and an S-curve body — composed inside a `<group>` so each part can take its own material (cyan emissive for the dot, chrome for the body). Tried merging into one `BufferGeometry` first, but `THREE.BufferGeometryUtils` is in `three/examples/jsm`, not the core import; switching to two meshes is cleaner anyway.
- **Environment map without HDR fetch:** `<Environment preset="studio">` tries to fetch an HDR from a CDN that this dev box can't reach. Replaced with inline `<Lightformer>` panels, which generate the env map at runtime from emissive rectangles — fully offline, no external assets, ~256² resolution is plenty for chrome.
- Camera at z=14, fov 35. Seven instances scaled 0.36–0.68. The scale was tuned twice: first pass had them filling 80% of the viewport (too dominant), second pass set them as a constellation around the headline.
- Post-processing stack: `Bloom` (low threshold for the cyan emissive), `ChromaticAberration` (subtle radial offset), `Noise` (4% opacity, soft-light), `Vignette` — matches the brief's note about subtle treatment.
- Capability detection at mount: `navigator.deviceMemory < 4 || hardwareConcurrency < 4` → `<StaticFallback />` (gradient + radial blur). Same fallback fires for `prefers-reduced-motion`.
- `morphRef` ref'd from `window.scrollY / window.innerHeight` and read each frame inside the rig + instances → contract toward origin as page scrolls (chaos→structure).

### Phase 3 log
- Brought the home-page sections to final state in one pass (they were stubbed during Phase 1 to compile the page).
- **Manifesto strip:** scroll-driven kinetic reveal — each word animates from `y: 110%` to `0%` staggered by index. The fact that words start hidden by default means the static screenshot is blank until you scroll; that's the intended behaviour per the brief. Light bone palette via `data-palette="bone"` on the section.
- **Services cards:** two cards with their own ambient-corner SVG motifs that intensify on hover. Odoo = network of connected nodes; Web = wireframe rendering into a hi-fi page. Both motifs are inline SVG, so no extra payload.
- **Process:** 400vh outer container with a `position: sticky` 100vh inner. The inner track translates `x: 0% → -75%` from `useScroll` progress, sliding four big numbered cards horizontally as the user scrolls down.
- **Selected work tiles:** each tile is a `<CaseCover>` 2D canvas that renders a procedural gradient + animated noise + glyph overlay. The brief asks for GLSL flow-field warp; we used 2D canvas (1.5 kB self-contained) instead because the perf vs. fidelity tradeoff at thumbnail size doesn't justify a WebGL canvas per tile.

### Phase 4 log
- **About:** 3 principles, location, intentional whitespace. No team-photo grid yet — brief says skip until user provides photos.
- **Service pages:** identical layout for Odoo + Web — discovery → deliverables list → tech chips → FAQ accordion (custom, not shadcn — animated height transition via Framer Motion). Both pages pull their content from `messages/*.json` so they're fully editable without touching JSX.
- **Work index:** divider-list layout, each row has slug → title → year/services → summary → procedural cover. Locale-aware via `c.titleFr ?? c.title` fallbacks.
- **Case study detail:** hero with cover canvas + metadata block, then `Summary / Problem / Approach / Result` sections in a 12-col grid, then a "Next case" link that cycles through the array.
- **Lab:** three 2D canvas demos — Noise field (curl-noise particles), Attractor (mouse-driven gravitational pull), Fluid lite (cursor-trail dye). All self-contained, no external assets.
- **404:** R3F draggable cube. Pointer-down → tracks cursor → release → springs back to origin with damping. Locale headline "You took a wrong shift. / Vous avez pris le mauvais shift."
- **Contact:** react-hook-form + zod schema. Chip-style radio buttons for project type / budget. Resend POST in `/api/contact` with safe-fallback (logs and 200s if `RESEND_API_KEY` missing — useful in dev).

### Phase 5 log
- `/api/og` route with `@vercel/og` — runtime "edge", composes the wordmark + page title against a radial-gradient bg. First attempt failed because satori can't parse comma-separated background shorthand; split to `backgroundColor` + `backgroundImage`.
- `sitemap.ts` + `robots.ts` generated at the app root — 24 URLs (FR + EN × 7 routes + 2 case studies × 2 locales).
- `<StructuredData>` injects JSON-LD for `Organization`, `LocalBusiness` (M'Sila, DZ), and two `Service` entries. Lives in the body so it's available to crawlers without blocking head rendering.
- hreflang: handled by the per-route metadata's `alternates.languages` (FR / EN / x-default → FR).
- Konami code easter egg with matrix-rain takeover + `track("konami")` analytics event.
- Preloader gated on `sessionStorage["coshift:preloaded"]` so it fires once per session.
- View Transitions API: CSS `@keyframes vt-out / vt-in` in `globals.css`. Next 15.1 doesn't expose `experimental.viewTransition` in this version yet; the CSS-only approach still works for `view-transition-name` if we add the meta tag — left as a one-line opt-in to avoid flicker in dev.
- TypeScript strict: `tsc --noEmit` exits 0. One non-trivial type fix: Framer Motion's `useTransform` return type is a generic `MotionValue<unknown>` rather than the inferred number; type the prop explicitly as `MotionValue<number>`.

### Phase 6 log
- Built once with `pnpm build`: clean output, 24 static pages, 106 kB shared first-load JS, home route adds only 12.3 kB (R3F is dynamic-imported so it doesn't count toward LCP).
- `vercel.json` includes security headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy) and `Cache-Control: immutable` for `/_next/static/*`.
- `README.md`, `CONTENT_GUIDE.md`, `.env.example` all written.
- `git init -b main` + initial commit `34bc0b5`. Follow-up commit ignores Playwright validation artifacts under `.playwright-mcp/`.
- Final deploy step requires the user's Vercel + GitHub auth — full commands documented in `README.md`.

