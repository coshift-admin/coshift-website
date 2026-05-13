# Coshift — Marketing site

A bilingual (FR / EN), motion-driven, WebGL-heavy marketing site for **Coshift** — an Odoo ERP + premium web development studio.

The whole site is built around one metaphor: **business transformation rendered as visual transformation**.

> The brief that produced this codebase is `BRIEF.md`. Decisions made during the build are in `CLAUDE.md`. Content-editing instructions are in `CONTENT_GUIDE.md`.

---

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 15 App Router · React 19 · TypeScript strict |
| Styling | Tailwind v4 (`@theme` token bridge) + CSS custom properties |
| i18n | `next-intl` — `/fr` (default) and `/en` |
| Animation | Framer Motion + Lenis (smooth scroll) + GSAP utilities |
| 3D | React Three Fiber 9 · drei 10 · postprocessing 3 |
| Forms | react-hook-form + zod |
| Email | Resend (contact form) |
| Analytics | Vercel Analytics + Speed Insights |
| Hosting | Vercel (recommended) |
| Package manager | pnpm 11 |

---

## Local development

Requirements: **Node 20+**, **pnpm 11+**.

```bash
pnpm install
pnpm dev          # http://localhost:3000  (auto-fallback to :3001)
```

Other scripts:

```bash
pnpm build        # production build
pnpm start        # boot the production build
pnpm typecheck    # tsc --noEmit
pnpm lint         # next lint
```

The first install will prompt about `sharp` and `unrs-resolver` build scripts. Run `pnpm approve-builds --all` once if you see the warning.

---

## Environment variables

Copy `.env.example` to `.env.local` and fill in:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx          # contact form delivery
CONTACT_EMAIL_TO=hello@coshift.com          # where briefs land
NEXT_PUBLIC_CALENDLY_URL=                   # Calendly inline embed (optional)
NEXT_PUBLIC_SITE_URL=https://coshift.com    # canonical URL, OG, sitemap
```

When `RESEND_API_KEY` is missing, the `/api/contact` route logs the brief to the server console and returns success — useful for local dev.

---

## Deploying to Vercel

```bash
pnpm i -g vercel
vercel login
vercel link                                    # connect / create project
vercel env add RESEND_API_KEY production
vercel env add CONTACT_EMAIL_TO production
vercel env add NEXT_PUBLIC_CALENDLY_URL production
vercel env add NEXT_PUBLIC_SITE_URL production
vercel --prod                                  # ship
```

Once the project is linked, every `git push` triggers a preview deployment; Vercel also handles Analytics and Speed Insights — they're wired into `src/app/[locale]/layout.tsx`.

### Custom domain

1. Vercel dashboard → project → **Settings → Domains** → add `coshift.com`.
2. Update the DNS at your registrar:
   - `@` → `76.76.21.21` (A) or `cname.vercel-dns.com` (CNAME)
   - `www` → `cname.vercel-dns.com`
3. Wait for the cert (usually under 60s) and check the domain is `Verified`.

---

## Project layout

```
src/
  app/
    [locale]/
      (marketing)/             # marketing routes — share Header/Footer/Cursor
        page.tsx               # home
        about/page.tsx
        work/page.tsx
        work/[slug]/page.tsx
        services/odoo/page.tsx
        services/web/page.tsx
        lab/page.tsx
        contact/page.tsx
      layout.tsx               # locale layout — fonts, providers, html lang
      not-found.tsx
    api/
      contact/route.ts         # Resend email handoff
      og/route.tsx             # dynamic OG image (@vercel/og)
    sitemap.ts                 # generated XML sitemap
    robots.ts                  # generated robots.txt
    globals.css                # design tokens + base styles
  components/
    icons/                     # CoshiftWordmark, CoshiftMark, ShiftGlyph
    layout/                    # Header, Footer, Cursor, SmoothScroll, etc.
    motion/                    # Magnetic, view transitions helpers
    sections/                  # Hero, ManifestoStrip, Services, Process, …
    three/                     # HeroScene, NotFoundScene
    ui/                        # Accordion, primitives
    work/                      # Case study cover canvas
    contact/                   # Form, Calendly embed
    seo/                       # JSON-LD
  content/
    work/index.ts              # case study data — edit here
  hooks/
    useReducedMotion.tsx
  i18n/
    routing.ts                 # locales, default, navigation primitives
    request.ts                 # message loader
  lib/
    fonts.ts                   # next/font/google (Geist, JetBrains, Fraunces)
    cn.ts                      # className combinator
    site.ts                    # business contact info — edit here
messages/
  en.json
  fr.json
public/
  favicon.svg, manifest.webmanifest
```

---

## What's editable, at a glance

- **All UI copy** → `messages/en.json` + `messages/fr.json`.
- **Contact info, social links** → `src/lib/site.ts`.
- **Case studies** → `src/content/work/index.ts`.
- **Headline numbers** → `src/components/sections/Numbers.tsx` (`ITEMS` array).
- **Client logos** → `src/components/sections/TrustStrip.tsx` (`CLIENTS` array).
- **Hero composition** → `src/components/three/HeroScene.tsx`.

See `CONTENT_GUIDE.md` for plain-language step-by-step.

---

## Anti-patterns (from BRIEF — keep, don't drift)

- No stock photos of "business people shaking hands."
- No emojis in UI or content.
- No buzzword copy ("unleash / elevate / supercharge / next-level …").
- No idle ambient motion. Motion is purposeful: entry, transition, hover. Idle = still.
- Footer has 3 columns max.
- Cookie banner / modal popups: not on first visit.

---

## License

© Coshift. All rights reserved.
