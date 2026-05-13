# COSHIFT — Agency Website Master Brief

> **How to use this file**
> 1. Create an empty project directory: `mkdir coshift-site && cd coshift-site`
> 2. Save this file inside it as `BRIEF.md`
> 3. Place your logo PNG at `./assets/coshift-logo.png` (and SVG if you have one at `./assets/coshift-logo.svg`)
> 4. Launch Claude Code in that folder and send it this exact message as your first prompt:
>    > "Read `BRIEF.md` end-to-end before doing anything. Create a `CLAUDE.md` summarising the project state, the build phases, and the decisions you've locked in. Then execute all six phases end-to-end without stopping for approval. Make every design and implementation decision yourself — do not ask me questions mid-build. When all phases are complete, produce a single comprehensive handoff report covering what was built, what TODOs/`<EditMe>` tokens remain, the deployment URL, and how to run/edit/deploy."

---

## 1. Identity

**Company:** Coshift
**What we do:** Odoo ERP implementation + premium web development for ambitious B2B clients.
**Origin region:** Algeria (M'Sila) — serving the Maghreb and Francophone Africa, with English presence for international leads.
**Brand voice:** Confident, technical, calm. We are not "playful" or "quirky." We sound like people who have shipped real systems for real businesses. We never use emoji. We never use phrases like "unleash," "elevate," "revolutionize," "supercharge," or "game-changer."

**Competitive bar (the level we want to hit):**
- activetheory.net
- lusion.co
- unseen.studio
- resn.co.nz
- exo.cat

We are not copying these studios. We are setting the same craft standard for a B2B ERP+web agency, which almost no one does. That contrast (premium creative agency aesthetic applied to an ERP studio) **is** the differentiator. Lean into it.

---

## 2. The Creative Concept — "The Shift"

The entire site is built around one metaphor: **business transformation rendered as visual transformation.**

Every interactive element should feel like something is *shifting* — morphing, snapping into new alignment, reorganising chaos into order. This is not decorative; it's the literal message of the brand.

**Concrete manifestations:**

- **The "i" glyph from the logo** has a stylised shift-like vertical zigzag where the dot should be. Extract this shape as an SVG and use it as a *recurring motif* throughout the site — as section dividers, loading indicators, list bullets, in the cursor, and as the seed of the hero's 3D scene.
- **The hero centerpiece** is a slowly-rotating 3D form built from extruded copies of the shift glyph, materialised as liquid chrome. As the user scrolls, it morphs through three states representing the three stages of a Coshift engagement: *chaos → structure → flow*.
- **Section transitions** feel like one composition shifting into the next, not separate pages stacked. Use pinning + scroll-driven scene swaps (GSAP ScrollTrigger).
- **Page-to-page navigation** uses the View Transitions API for fluid morphs.

---

## 3. Visual Language

### Color palette
```
--coshift-cyan:     #1FB6F0   /* logo cyan — energy, action */
--coshift-indigo:   #1A1B5C   /* logo indigo — depth, trust */
--coshift-ink:      #050614   /* near-black background */
--coshift-bone:     #F4F2EC   /* warm off-white for light sections */
--coshift-haze:     #0B0D2A   /* mid-tone for cards on dark bg */
--coshift-glow:     #4DD0FF   /* cyan highlight, brighter than logo */
```
The default page is **dark** (`--coshift-ink`). Light sections are rare and used as a "reveal" device — one light section in the middle of the page (the "philosophy" section) acts as a palette-cleanser before returning to dark.

### Typography
- **Display + headings:** `Geist` (variable, weights 400/600/800). Self-host via `next/font/local`.
- **Body:** `Geist` (same family, weight 400).
- **Monospace accents** (for technical details, version numbers, code-feel labels): `JetBrains Mono`.
- **One display moment:** for the single largest headline on the home page hero, use `Fraunces` at weight 900, optical size variable axis maxed, italic. This gives ONE editorial-magazine moment in an otherwise technical-sans site. Used exactly once.

### Cursor
- Custom cursor: a 12px ring with a 2px stroke in `--coshift-cyan`, mix-blend-mode `difference`.
- On interactive elements: expands to 48px, fills with cyan, inverts text color underneath.
- Magnetic pull on primary CTAs (max 12px displacement, eased).
- Hidden on touch devices (`pointer: coarse`).

### Motion principles
- Default easing: `cubic-bezier(0.22, 1, 0.36, 1)` (out-expo feel — fast start, soft landing).
- Default duration: `600ms` for entrance, `300ms` for hover.
- Everything respects `prefers-reduced-motion`. Build a `useReducedMotion` hook and gate all major animations.
- Smooth scroll: Lenis with `lerp: 0.1`. Disabled on touch / reduced-motion.

---

## 4. Tech Stack (locked)

```json
{
  "framework": "Next.js 15 (App Router, RSC, TypeScript strict)",
  "styling": "Tailwind CSS v4 + CSS custom properties for tokens",
  "i18n": "next-intl (FR default, EN secondary, route-based: /fr, /en)",
  "animation": {
    "general": "Framer Motion (motion/react)",
    "scroll": "GSAP + ScrollTrigger + ScrollSmoother (or Lenis as fallback)",
    "3d": "React Three Fiber + @react-three/drei + @react-three/postprocessing",
    "shaders": "GLSL via raw-loader or inline template strings"
  },
  "ui_primitives": "shadcn/ui (only as base for Dialog, Sheet, Tooltip, Toast)",
  "forms": "react-hook-form + zod",
  "icons": "lucide-react (sparingly — prefer custom SVG)",
  "fonts": "next/font/local (Geist, JetBrains Mono, Fraunces variable)",
  "analytics": "Vercel Analytics + Vercel Speed Insights",
  "deployment": "Vercel",
  "node": "20.x",
  "package_manager": "pnpm"
}
```

Do **not** add: Bootstrap, Material UI, Chakra, jQuery, Lottie (we author motion in code), AOS, or any "animation library" that's just CSS class triggers.

---

## 5. Information Architecture

```
/                      Home (single long-form, ~7 sections)
/fr  /en               Locale roots (default redirect /fr)
/work                  Case studies index
/work/[slug]           Individual case study (long-form, horizontal-scroll narrative)
/services/odoo         Odoo ERP service page
/services/web          Web development service page
/about                 Studio story, principles, founder note
/lab                   Experimental WebGL playground (3–4 demos)
/contact               Form + Calendly embed + map
/404                   Custom 3D-interactive 404
```

### Home page sections (in order)

1. **Hero** — full-viewport 3D scene + headline + CTA + scroll cue
2. **Manifesto strip** — single sentence in giant Fraunces italic, light background (the one light section)
3. **Services** — two cards (Odoo / Web), each opening into a mini-3D scene on hover
4. **Process** — horizontal-scroll timeline of 4 phases (Diagnose → Design → Build → Shift)
5. **Selected work** — 3 case study previews with WebGL-distorted hover thumbnails
6. **Numbers** — animated counters (years, clients, modules shipped, hours saved)
7. **Trust strip** — client logos in a slow horizontal marquee, monochrome
8. **CTA + footer** — large "Plan your shift" CTA, contact info, language toggle, social

---

## 6. Copy Direction & Bilingual Strings

Write all UI strings in **both FR and EN** from day one. Store them in `messages/fr.json` and `messages/en.json` per next-intl convention.

### Hero
- **EN headline:** "Your business doesn't need more software. It needs a shift."
- **FR headline:** "Votre entreprise n'a pas besoin de plus de logiciels. Elle a besoin d'un shift."
- **EN subhead:** "An Odoo ERP and web development studio for companies that are done with patchwork tools and templated websites."
- **FR sous-titre:** "Studio Odoo ERP et développement web pour les entreprises qui en ont assez des outils bricolés et des sites web sous template."
- **CTA primary:** "Plan your shift" / "Planifier votre shift"
- **CTA secondary:** "See our work" / "Voir nos réalisations"

### Manifesto
- **EN:** *"We don't sell software. We rebuild how work flows."*
- **FR:** *"Nous ne vendons pas de logiciels. Nous reconstruisons la façon dont le travail circule."*

### Services
- **Odoo ERP** — "One system to run the whole business. We implement, customise, and own the result."
- **FR:** "Un seul système pour piloter toute l'entreprise. Nous implémentons, personnalisons, et assumons le résultat."
- **Web Development** — "Sites and platforms that look like they were built for one company — because they were."
- **FR:** "Des sites et plateformes qui semblent faits sur mesure — parce qu'ils le sont."

### Process (4 steps)
1. **Diagnose / Diagnostiquer** — "We map the actual workflow before we touch a single tool." / "Nous cartographions le flux de travail réel avant de toucher au moindre outil."
2. **Design / Concevoir** — "Architecture, data model, interface — designed together." / "Architecture, modèle de données, interface — conçus ensemble."
3. **Build / Construire** — "We build it. Not a freelancer pool. Us." / "Nous le construisons. Pas un pool de freelances. Nous."
4. **Shift / Basculer** — "Migration, training, handover. The shift lands." / "Migration, formation, transfert. Le shift est complet."

### Numbers (placeholders the user must confirm)
- `[X]` years in business
- `[X]` Odoo implementations delivered
- `[X]` websites & platforms shipped
- `[X]k` hours of manual work eliminated for clients

Leave these as `<EditMe>` tokens in the code with comments so the user can fill them in. Do **not** invent numbers.

### Footer / metadata
- **Tagline (under logo in footer):** "An ERP & web studio out of Algeria, working worldwide."
- **FR:** "Studio ERP & web basé en Algérie, au service du monde."
- **Legal:** "© 2026 Coshift. All rights reserved." / "Tous droits réservés."

---

## 7. Build Plan — Six Phases (autonomous, end-to-end)

Execute all six phases in sequence without stopping. At the end of each phase, log progress in `CLAUDE.md` with a short summary (what was built, files added, key decisions made) and run a quick sanity check (TypeScript compiles, dev server boots, no console errors), then move directly to the next phase. Make every judgment call yourself — do not ask the user questions mid-build. Collect all ambiguities, missing assets, and items the user must fill in for the final handoff report.

### Phase 1 — Foundation
- `pnpm create next-app@latest` with TypeScript, Tailwind v4, ESLint, App Router, src dir, alias `@/*`
- Configure `next.config.ts` for image optimization, View Transitions, instrumentation hook
- Install full dependency set (see Section 4)
- Set up `next-intl` with `/fr` and `/en` route segments, middleware, locale detection
- Set up CSS tokens (`globals.css`): all colors, font variables, motion variables
- Configure `next/font/local` for Geist, JetBrains Mono, Fraunces (download fonts to `public/fonts/`)
- Create `CLAUDE.md` documenting decisions, phase status, file conventions
- Create folder structure:
  ```
  src/
    app/[locale]/
      (marketing)/
        page.tsx              # home
        work/
        services/
        about/
        lab/
        contact/
      layout.tsx
      not-found.tsx
    components/
      ui/                     # shadcn primitives
      layout/                 # Header, Footer, Nav
      sections/               # Hero, Services, Process, etc.
      three/                  # R3F scenes & primitives
      motion/                 # reusable motion components
    hooks/
    lib/
    content/                  # case studies, services as TS files
    shaders/                  # GLSL files
  messages/
    en.json
    fr.json
  public/
    fonts/
    logos/
  ```
- Build the global Header: logo (left), nav (center), language toggle + CTA (right), with magnetic interactions on items and a custom underline animation
- Build the global Footer
- Build the custom cursor component (mounted in root layout, hidden on touch devices)
- Implement Lenis smooth scroll wrapper
- Build the `<ReducedMotion>` context provider and `useReducedMotion()` hook

**Deliverable check:** dev server runs, both `/fr` and `/en` routes work with empty page bodies but full chrome (header, footer, cursor, smooth scroll), language toggle works, no console errors.

### Phase 2 — Hero (the make-or-break moment)
This is the section the entire site is judged on. Spend 30–40% of total project time here.

- Build the R3F scene `<HeroScene />`:
  - Camera: 35mm FOV, slight orbit on mouse parallax
  - The "shift glyph" extracted as SVG → converted to extruded 3D geometry via `THREE.ShapeGeometry` + `ExtrudeGeometry`. Refer to the logo image at `./assets/coshift-logo.png` to recreate the glyph shape — it's the dot of the "i" letter, a stylised vertical zigzag/shift symbol.
  - Material: `MeshPhysicalMaterial` with `metalness: 1, roughness: 0.15, clearcoat: 1, transmission: 0.05`, environment map (use `@react-three/drei` `<Environment preset="studio" />` or `"city"`)
  - Lighting: 3-point lighting with one rim light in `--coshift-cyan`
  - Post-processing: subtle `Bloom`, `ChromaticAberration` (very low), `Vignette`, `Noise` overlay
  - Multiple instances of the glyph (5–9) arranged in a slow constellation, each rotating on different axes
  - Mouse-driven parallax: scene tilts ~3° toward cursor
  - On scroll (first 100vh of page), the constellation slowly contracts inward and aligns, representing chaos → structure
- Overlay HTML:
  - The Fraunces-italic headline word "shift" is the ONE editorial moment. Position it overlapping the 3D scene at z=above-canvas. The rest of the headline uses Geist Black.
  - Subhead in Geist Regular, max-width ~52ch
  - Two CTAs side by side (primary filled cyan, secondary outlined)
  - A subtle scroll-cue at bottom: animated shift glyph + "scroll" / "défiler"
- Performance:
  - Lazy-mount the canvas (don't SSR it; use `dynamic` with `ssr: false`)
  - Provide a poster fallback image while the scene initialises
  - Detect low-power devices via `navigator.hardwareConcurrency < 4 || navigator.deviceMemory < 4` → swap to a static 2D SVG version with light animation
  - Pause rendering when canvas is off-screen (`useFrame` gated by `IntersectionObserver`)

**Deliverable check:** hero feels alive without being distracting. Loads under 2s on desktop, gracefully degrades. Tested in Safari/Chrome/Firefox.

### Phase 3 — Mid-page sections
- **Manifesto strip:** scroll-pinned, light cream background, single Fraunces-italic sentence at 12vw size, kinetic reveal (letters mask up with stagger as section enters viewport). On exit, the section morphs back to dark via a clip-path reveal of the next section.
- **Services:** 2 cards side-by-side on desktop, stacked on mobile. Each card has an idle state (clean typography + small ambient 3D motif in corner) and a hover state (the card expands, the ambient 3D motif takes over and renders a more elaborate scene representing that service — for Odoo: a network of connected nodes; for Web: a wireframe morphing into a high-fidelity site). Magnetic cursor pull.
- **Process:** horizontal-scroll inside a vertically-pinned section. Four large numbered steps slide horizontally as the user scrolls vertically. Each step has its own micro-animation. Number transitions use a "slot-machine" digit-roll effect.
- **Selected work:** 3 case study tiles. Each tile's thumbnail is a `<canvas>` running a custom GLSL shader that distorts the image on cursor proximity (RGB-split + flow-field warp). Tile titles render with a "shift-in" mask animation on hover.

### Phase 4 — Remaining sections + inner pages
- **Numbers section:** Big animated counters using `motion`'s `useMotionValue` + spring. Each counter has the shift glyph as a separator. Trigger on viewport entry.
- **Trust strip:** Slow infinite marquee of client logos, monochrome white, slight opacity. Use placeholder logos as inline SVG until user provides real ones. Mark with `<!-- TODO: replace with real client logos -->`.
- **CTA + Footer**
- **About page:** Founder note, principles (3 short statements), studio location, the same shift motif used as section dividers
- **Services pages:** `/services/odoo` and `/services/web` — long-form, each with its own hero variation, deliverables list, tech stack we use, FAQ accordion (custom-built, not shadcn default — animated with content height + smooth easing)
- **Work index + case study template:** Case studies as MDX files in `src/content/work/*.mdx` with frontmatter (title, client, year, services, cover image, summary, problem, approach, result, gallery). Build a renderer that lays out a case study as a horizontal-scroll narrative on desktop, vertical on mobile. Include 2 placeholder case studies the user can edit.
- **Lab page:** 3 small interactive WebGL demos (e.g., "noise field," "particle attractor," "fluid sim lite"). These prove technical capability. Each demo has a "fork on github" or "view source" link (placeholder).
- **404 page:** A 3D scene where the user can drag a floating coshift cube around with physics. Headline: "You took a wrong shift." / "Vous avez pris le mauvais shift."
- **Contact page:** Custom-styled form (Name / Company / Email / Project type checkboxes / Budget range / Message), react-hook-form + zod validation, submission posts to `/api/contact` route handler that sends an email via `resend.com` (leave the API key as `process.env.RESEND_API_KEY` with a `.env.example`). Calendly inline embed below the form. Below that: address, email, phone, WhatsApp link.

### Phase 5 — Polish, i18n completion, perf, a11y, SEO
- **i18n audit:** every visible string sourced from messages files. No hardcoded text. Language toggle preserves current route.
- **Loading screen:** a brief preloader on first visit only (stored in `sessionStorage`). The Coshift wordmark "assembles" from scattered glyph pieces over ~1.2s, then dissolves into the hero.
- **View Transitions API:** implement smooth page-to-page transitions using Next.js View Transitions support.
- **Performance budget:**
  - LCP < 2.5s on Fast 3G simulated
  - CLS < 0.05
  - INP < 200ms
  - JS bundle for homepage route < 250KB gzipped (excluding the 3D scene which loads after LCP)
  - Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95, Best Practices = 100, SEO = 100
- **Accessibility:**
  - All interactive elements keyboard-navigable
  - Focus rings visible (custom-styled in cyan, never removed)
  - Skip-to-content link
  - All 3D scenes have an accessible static fallback
  - Cursor effects never the only indicator of interactivity
  - Color contrast WCAG AA minimum
  - Reduced motion fully respected — major animations replaced by fades/instant transitions
- **SEO:**
  - `generateMetadata` per route with locale-aware title/description
  - OG image: generate a dynamic OG image at `/api/og` using `@vercel/og` with the Coshift wordmark + page title
  - `sitemap.ts` and `robots.ts` in app root
  - Hreflang tags via next-intl
  - JSON-LD: `Organization`, `LocalBusiness` (Algeria, M'Sila), `Service` per service page
- **Easter egg:** Konami code triggers a 3-second matrix-rain takeover with Coshift hex codes rendered in JetBrains Mono. Tracks an event to analytics.

### Phase 6 — Deploy
- Create a `README.md` with: project summary, dev commands, deploy commands, env vars list, content editing guide (how to add a case study, how to change a number, how to swap a logo)
- Initialise git, first commit
- Push to a new GitHub repo (instruct user to create one; provide the exact commands)
- Deploy to Vercel via CLI, capture deployment URL
- Configure custom domain (placeholder instructions for the user since they own the registrar)
- Enable Vercel Analytics + Speed Insights
- Set up environment variables in Vercel: `RESEND_API_KEY`, `CONTACT_EMAIL_TO`, `NEXT_PUBLIC_CALENDLY_URL`

---

## 8. Quality Bars (definition of done)

A section is "done" only if **all** of these are true:
- ✅ Looks correct on 360px, 768px, 1280px, 1920px viewports
- ✅ Animations respect `prefers-reduced-motion`
- ✅ Keyboard-navigable with visible focus states
- ✅ Both FR and EN content render correctly with no overflow on the longer language
- ✅ No console errors or React warnings
- ✅ Type-checked (no `any`, no `// @ts-ignore` without a comment explaining)
- ✅ Lighthouse score on that page meets targets
- ✅ Works in Safari (the WebGL-heavy hero especially — Safari is the canary)

---

## 9. Anti-patterns (do not do)

- ❌ Generic stock photos of "business people shaking hands." Use abstract visuals, custom illustrations, code-generated patterns, or nothing.
- ❌ Bootstrap-style cards with shadow + rounded corners + icon-top. We have a stronger design language than that.
- ❌ Inventing client names, testimonials, or numbers. Use `<EditMe />` placeholders and TODO comments.
- ❌ Emoji anywhere in UI or content.
- ❌ AI-cliché copy: "unleash," "elevate," "revolutionize," "supercharge," "harness," "leverage," "game-changer," "next-level," "cutting-edge."
- ❌ Animations that move continuously and distract from reading. Motion is purposeful — entry, transition, hover. Idle = still.
- ❌ Loading spinners. Use shimmer placeholders or skeleton UIs.
- ❌ Modal popups on first visit (newsletter, cookies overlay). One non-intrusive cookie banner if required by law, minimal.
- ❌ Heavy carousels on mobile with autoplay.
- ❌ Footer with 8 link columns. We have 3 columns max.

---

## 10. Assets the user is providing

Currently at the start of the project:
- `./assets/coshift-logo.png` — the wordmark (cyan "CO" + indigo "SHIFT" with a stylised shift glyph as the i-dot)

What you should do about missing assets:
- **SVG logo:** trace the PNG to an inline SVG component (`<CoshiftWordmark />`) so it scales crisply. Also create `<CoshiftMark />` (just the "i" shift glyph, isolated) for use as the favicon, the cursor, section dividers, and the 3D extrusion source.
- **Favicon set:** generate from the mark — `favicon.ico`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `manifest.json`.
- **OG image:** generate dynamically via `@vercel/og`.
- **Case study images:** if no real ones provided, generate procedural cover images (gradient mesh + noise + the shift glyph) using `<canvas>` or static SVG so the cards look intentional rather than empty.
- **Client logos:** placeholder SVGs labelled `<!-- TODO: replace -->`.
- **Team photos:** skip the team section entirely until the user provides photos. Replace with a founder note (text only) on the About page.

---

## 11. After-build deliverables for the user

This is the **single, comprehensive report** delivered after all six phases finish. The user has not seen the build in progress — this report is their first review point, so be thorough.

Produce:
1. The live Vercel URL
2. The GitHub repo URL
3. A summary of what was built, phase by phase, with screenshots or short descriptions of each major section
4. A complete list of every `<EditMe />` token still in the codebase, where to find it, and what to put there
5. A complete list of every `TODO` comment left in the code, with file paths
6. A `CONTENT_GUIDE.md` explaining in plain language how to:
   - Change the numbers in the stats section
   - Add a new case study (MDX file)
   - Swap a client logo
   - Update contact info
   - Change copy in either language
   - Add a new locale
7. Any assumptions made during the build the user may want to override (color shade choices, copy variations, image placeholders)
8. Known issues or rough edges you'd address with more time
9. Deployment notes (env vars used, custom domain setup steps)

---

## 12. Final notes to Claude Code

- **Be opinionated.** Where this brief is silent, choose the option that best serves the maximalist creative direction. Don't ask the user about font sizes or spacing scales — decide.
- **Ship vertical slices.** Don't build all the static layout first and then layer animation on. Build each section *with* its motion in place so the feel is correct from the start.
- **Test in Safari every phase.** WebGL + scroll behaviour breaks in Safari in ways it doesn't in Chrome. Catch it early.
- **Run end-to-end.** Do not pause between phases or ask the user questions during the build. Log progress to `CLAUDE.md` at each phase boundary and continue immediately to the next. Save every open question, asset gap, and content-fill request for the final handoff report. When in doubt, decide — the user is evaluating the finished site, not the in-flight process.
- **Document decisions in `CLAUDE.md`** as you go. When in doubt about what was decided, that file is the source of truth.

Now begin. Read this brief one more time before starting Phase 1.
