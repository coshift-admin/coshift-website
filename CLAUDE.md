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
| 7. Brand realignment | ✅ done | Rebuilt against `Coshift_Brand_Identity_Brief.md`; typecheck + build clean |
| 8. Refresh — founder's 6-point list | ✅ done (review pending) | 1 perf · 2 preloader · 3 IA + copy · 4 DS rollout · 5 client references · 6 portfolio — plus Arabic locale and online-payment service |

### Phase 8 log — founder's refresh list (2026-10-06 → 07)
Founder supplied a design system (`Coshift Design System/` — its `readme.md` is the reference)
and a six-point list. Decisions:
- **Slogan:** "We power your next shift." (FR « Nous propulsons votre prochain shift. ») — hero H1,
  footer signature, meta. "Everything under control." from the DS is NOT used as the tagline.
- **Hero (3rd iteration):** the founder rejected the 3D glyphs and then the "control room" strip
  (coordinates, clock, live-ops KPIs) as hard to understand. Current hero = slogan + plain subhead +
  free-audit CTA on the left, and `ShiftBoard` on the right: an interactive Avant/Après switch —
  five everyday tools (stock on Excel, orders on WhatsApp, a separate website, hand-made invoices,
  @gmail) scattered around "Vous", which snap into one system around the Coshift hub. Autoplays once
  (visible countdown), then the visitor drives it. Client logos sit at the hero's foot. Never use
  invented KPIs (DS + brief §11), even if a reference image shows them.
- **IA (approved):** nav by need — Solutions (ERP & gestion · Sites & e-commerce · Apps & intégrations
  · Email pro & hébergement, routes `/solutions/[slug]`, slugs in `src/lib/solutions.ts`) ·
  Réalisations · Méthode (`/method`) · À propos · CTA "Diagnostic gratuit". Lab moved to the footer.
  Old `/services/odoo|web` 308-redirect to `/solutions/erp|web`. Home = Hero → Manifesto (kept, the
  founder loves its reveal) → Solutions (light) → Réalisations → Process (kept, loved) → Pourquoi
  Coshift (light) → FAQ objections (light) → CTA band.
- **Primary CTA everywhere:** « Réserver un diagnostic gratuit » / "Book a free audit" (30 min, sans
  engagement) — from the brief's §9 offers. Secondary: WhatsApp.
- **Copy:** rewritten for SME owners (plain words, pains from brief §7, objections from §8). FR in
  `messages/fr.json`; solution/method pages in `messages/{fr,en}/solution-pages.json` and
  `method.json` (merged in `src/i18n/request.ts`) so pages can be edited independently.
- **DS rollout:** fonts = Gabarito + Caveat (Latin), Cairo + Lemonada (Arabic, `[lang="ar"]` stack
  "Gabarito", Cairo — Latin runs stay Gabarito; Arabic faces never load on FR/EN pages). Colours =
  DS navy-950 base, cyan for actions/status only, **Coral `#FF6B54` warm accent** (founder's pick)
  for personality only (Caveat asides, "start here" badges). Light sections use `.surface-light`
  + surface roles (`--fg`, `--fg-body`, `--line`, `--card`, `--eyebrow`) so components work on both.
  Buttons `ButtonLink` (8px radius, no bounce). Icons = Phosphor Fill (`@phosphor-icons/react/dist/ssr`).
  Grain overlay, magnetic header items, footer glyph and the R3F hero removed (DS: no textures).
  Preloader = DS Shift-pass logo animation, pure CSS, first visit only.
- **Shared UI:** `ui/PageHero`, `ui/SectionHeader` (word reveal; `size="md"` for sentence titles),
  `ui/CtaBand`, `ui/ButtonLink`, surface-aware `ui/Accordion`.
- **Fixes found on the way:** `StaggerList` wrapped children in `display:contents` divs (invalid
  `<ul><div><li>` and the animation never played) → now CSS on direct children; tailwind-merge was
  stripping `.text-mono` when combined with a colour class → registered as its own group in `cn.ts`;
  perf loops (cursor, magnetic, case covers) sleep when idle; a visitor-visible dev note on /work removed.
- **Still to confirm with the founder:** the free 30-min audit offer; « indépendants, pas revendeurs »
  (ERP page); « formation et guide d'administration » as a standard web deliverable; whether clients
  own their custom code (would strengthen the Apps FAQ).

### Phase 8 log, continued (2026-10-07) — founder answers, portfolio, Arabic
- **Slogan FR** is « Nous alimentons votre prochain shift. » (founder disliked « propulsons »);
  AR « نحن نُحرّك تحوّلكم القادم. ». The free 30-min diagnostic stays a CTA, never a catalogue item.
  Never mention who owns client code. Keep « indépendants, pas revendeurs » and the admin guide.
- **OSCAR PRO removed from every reference** (logos, case studies, examples) at the founder's request.
- **Profit Zone** added as a reference (logo → white knock-out silhouette in `public/logos`) and a case.
  Scope is ONLY the online-payment integration + a landing page — we did not build their website or
  platform and don't host it (founder, 2026-10-07). No screenshot/live link for it.
- **New service: online payment** — CIB / Edahabia, Visa, Mastercard (web page deliverable + FAQ,
  apps page example, home + menu copy). Evidence: Profit Zone (payment-gateway integration).
- **Portfolio (`/work`)**: live sites with real screenshots (`public/work/*.jpg`, captured
  2026-10-07) in a browser frame + "visit" links — AVZ, Formex, Kompen (= groupe-ourahmoune.com),
  Broderie Royale, ISTA (sarlista.com) — then ERP/integration work (Profit Zone, Renoh, FastPlast,
  Savoir). `src/content/work/index.ts` is now trilingual (`tr(value, locale)`), `kind: site|system`.
  Project years removed (never sourced). Attestations de bonne exécution exist for AVZ/Formex but are
  NOT cleared to publish — copy only says "available on request".
- **Arabic locale `/ar`** (RTL): `dir` on <html> via `src/lib/locale.ts`, 3-way language switcher,
  `messages/ar.json` + `messages/ar/*.json` (key parity checked), Cairo/Lemonada via the
  `[lang="ar"]` stack, arrows mirror via `.arrow-fwd/.arrow-back`, logical start/end classes,
  horizontal-scroll tracks (Process, CaseNarrative) reverse in RTL, logo marquee and phone numbers
  forced LTR, OG image text stays English for /ar (renderer has no Arabic font). Arabic typography
  rule: a space between و/ب/ل and a following Latin word (« Excel و WhatsApp »).
- **Savoir Glow** is a live site too (savoirglow.com, screenshot 2026-10-07) → 6 live sites in /work.
- **Process (pinned horizontal scroll)** was cropped on laptop-height screens (fixed 520px cards +
  2-line heading). Now every part scales with `svh`, and windows under 640px tall get the stacked
  layout instead (`md:[@media(min-height:640px)]:…`).
- **More motion + the hand font (founder, 2026-10-07):** "use the wavy font" and "more animations like
  Quatre phases". Added `SolutionArt` — scroll-driven line art on the 4 home Solutions cards, same
  technique as ProcessCardArt (erp: modules lock into one window · web: shop wired to stock · apps:
  connectors plug together · email: envelope skips spam, lands in inbox). `HandNote` (Caveat /
  Lemonada, coral, self-drawing arrow, mirrors in RTL) used once per section: hero hint at the board
  switch, manifesto (waits for the scroll reveal), work, CTA. `CountUp` on the Why facts,
  `ScrollPan` on site screenshots. Keep hand notes sparing — one per section max.
- **Dev-server note:** on this machine the dev server leaks memory (~1 GB+) and its render workers
  crash ("Jest worker … child process exceptions") when free RAM drops; restart it — never kill
  node processes by pattern (other projects run here).
- **Hand pen, used more (founder liked the coral Caveat):** `HandNote` now "writes" itself (clip
  wipe in the pen direction, then the arrow draws); `HandMark` scribbles a coral underline under the
  brand word "shift." (home hero, after the preloader; footer slogan). Every inner page hero gets one
  short note via `PageHero hand=` (keys `*.hand` / `hero.hand`); copy stays factual (no promises
  that contradict "réponse sous 2 jours ouvrés").
- **Solution page heroes** show their `SolutionArt` drawing in a right-hand panel (`PageHero aside=`),
  with `autoplay` (plays once when in view; the home cards stay scroll-driven). `--art-muted`
  recolours the grey details for the dark panel. Header logo enlarged (cropped viewBox, 22/27px).
- **Gotcha:** `cn()` (tailwind-merge) drops a `leading-*` that comes *before* a font-size class →
  put `leading-*` after the size.
- **New services (founder, 2026-10-07: "add them all, organised, no jargon, no filler").** Placed by
  where an owner would look, not as a list:
  - **5th solution `/solutions/automation` — « Automatisation & IA »**: WhatsApp order confirmation,
    reminders + alerts, the Monday report, the AI assistant in the ERP, a customer assistant (site +
    WhatsApp, hands over to a person), supplier invoices read into the ERP. Its own block « Vous gardez
    la main » answers the AI objection (your rules · a person takes over · you approve). Proof =
    FastPlast, Renoh, Savoir (work that already removes manual steps). Drawing: order → WhatsApp
    question → client confirms → truck leaves.
  - **ERP page**: + owner dashboard on the phone (evidence: Renoh retail dashboard), + till & hardware
    (POS is in the brief), + « Votre Odoo actuel, remis d'aplomb » (rescue; the FAQ now explains how).
  - **Sites page**: + delivery companies (Yalidine, ZR Express…). **Apps page**: the dashboard card
    moved to ERP, replaced by WhatsApp for field teams (answers an existing pain); the AI FAQ now
    points to the new page.
  - **AI assistant is delivered (founder, 2026-10-07)** — for a client in Odoo: analysis, invoice
    scanning, forecasting. This supersedes the brief's "demo database only" rule. The client
    ("Master Trade") is NOT in brief §4.1, so it stays unnamed ("Déjà livré" tags on the AI and
    invoice-scanning cards) until the founder clears the name. Self-hosting is offered as an option
    ("we can run it on our own infrastructure"), not claimed for that client. The Renoh case no longer
    mentions its demo-only AI module (the visitor-facing "honesty note" is gone). ERP module chips
    gained « Assistant IA ».
  - Home grid is 3 + 2 on desktop (automation + email wide); the menu's 5th item spans its row.
  - **Bug fixed:** the Solutions menu opened on hover and the click then closed it (touch too) → a
    pointer click now only opens; keyboard still toggles.
- **Footer (founder: "minimalist"):** slogan + HandMark → contact line + social icons → one row with
  wordmark, page links and © · location. No CTA (every page ends with CtaBand), no solutions list.
- **Lab rebuilt (founder: "creative, wow"):** the 3 generic canvases and their dead GitHub links are
  gone. Six playable experiments in `src/components/lab/`, each acting out a real offer and linking
  to it: ShiftParticles (dots → the real wordmark), OrderRipple (one order updates stock, invoice,
  WhatsApp, delivery and accounting; low-stock reorder), InvoiceScan (AI reading → draft to check),
  ForecastSketch (draw sales, Holt forecast with an 80% band), InboxTest (SPF/DKIM/DMARC → inbox
  or spam), RtlFlip (one shop screen flips FR/EN/AR). Copy in `messages/{locale}/lab/<key>.json`,
  merged as `lab.items` in request.ts. Loops gated by `useVisible`; all respect reduced motion.
- **Dev-server gotcha:** after editing `messages/{locale}.json` the dev server can keep serving the old
  copy (MISSING_MESSAGE for new keys) → restart it.
- **Bug fixed:** StaggerList used an intersection *ratio*, so lists taller than the screen never
  revealed (the portfolio stayed blank) → now triggers on the list's top edge (rootMargin).

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

