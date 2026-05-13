# Content guide — how to edit the Coshift site

This guide is for **non-developers** who need to update copy, numbers, case studies, contact info, or logos. Every change here is a small edit to a single file. None of them require a build step beyond the normal deploy.

> Most files referenced here open cleanly in **VS Code**, **Sublime Text**, or any plain-text editor. Save the file, commit, push — Vercel redeploys automatically.

---

## 1. Change a piece of UI copy (any text the user reads)

All visible strings live in **two files**:

- `messages/en.json` — English
- `messages/fr.json` — French (default language)

The two files mirror each other key-for-key. To change a phrase:

1. Find the key. Search for a snippet of the current text — every phrase appears under a nested path like `home.hero.subhead` or `services.odoo.heading`.
2. Edit the value (the part after the colon).
3. Update **both files** so EN and FR stay in sync.

> If you only have French text, leave the English the same and add `// TODO: translate` as a separate todo somewhere — never invent a translation.

---

## 2. Change the stats in the "By the numbers" section

Open `src/components/sections/Numbers.tsx`.

Near the top you'll see:

```ts
const ITEMS = [
  { key: "years", value: 7, suffix: "" },
  { key: "implementations", value: 24, suffix: "" },
  { key: "websites", value: 38, suffix: "" },
  { key: "hours", value: 120, suffix: "k+" },
];
```

- Change `value` to your real number.
- The `suffix` adds text after the number (e.g. `"k+"` for "120k+").
- The `key` matches a string in `messages/{en,fr}.json` → `home.numbers.items.<key>`. If you want a different label, edit those JSON files instead.

---

## 3. Add a new case study

Case studies live in `src/content/work/index.ts`. Each entry follows this shape:

```ts
{
  slug: "atlas-textiles",                 // becomes /work/atlas-textiles in the URL
  title: "Atlas Textiles — One Odoo…",
  titleFr: "Atlas Textiles — Un seul Odoo…",
  client: "Atlas Textiles",
  year: 2025,
  services: ["Odoo ERP", "Custom modules"],
  summary:   "English summary.",
  summaryFr: "Résumé en français.",
  problem:   "English problem statement.",
  problemFr: "Énoncé du problème en français.",
  approach:  "English approach.",
  approachFr:"Approche en français.",
  result:    "English result.",
  resultFr:  "Résultat en français.",
  cover: { hue: 195, tone: "cyan" },     // procedural cover — pick a hue + tone
},
```

To add a study:

1. Copy an existing entry inside the `caseStudies` array.
2. Change every field.
3. Pick a `slug` that contains only lowercase letters, numbers, and hyphens (e.g. `riviera-hotels-portal`).
4. Pick a cover: `tone` is `"cyan"`, `"indigo"`, or `"mixed"`; `hue` is a number from `0` to `360` (HSL hue) controlling the colour temperature of the gradient.

The case study page, the work index, and the home page's "Selected work" tiles will all pick it up automatically.

---

## 4. Swap or add a client logo (Trust strip)

Until real logos are provided, the trust strip is a **wordmark marquee** — each client's name in big monochrome type, scrolling horizontally.

Open `src/components/sections/TrustStrip.tsx` and edit the `CLIENTS` array:

```ts
const CLIENTS = [
  "Atlas Textiles",
  "Neon Coastal Bank",
  // …
];
```

**To use actual logo images later:**

1. Drop SVG files into `public/logos/` (e.g. `public/logos/atlas-textiles.svg`).
2. Replace the strings in `CLIENTS` with `<img src="/logos/atlas-textiles.svg" />` entries inside the `marquee-track` div.
3. Style with `className="h-8 w-auto opacity-50 grayscale"` so logos sit at a uniform height.

---

## 5. Update contact info, social links, address

`src/lib/site.ts` is the single source of truth for:

- Email
- Phone
- WhatsApp number
- City + country
- LinkedIn / GitHub / Instagram URLs
- Calendly URL (also via `NEXT_PUBLIC_CALENDLY_URL` env var)
- Public site URL (also via `NEXT_PUBLIC_SITE_URL` env var)

Edit the value, save, deploy. Footer, contact page, and structured data all read from this file.

---

## 6. Change the hero headline word that's in italic display type

The home hero has *one* editorial moment — the italic word "shift" at the end of the headline.

- Word itself → `messages/{en,fr}.json` → `home.hero.headlineWord`
- The styling lives in `src/components/sections/Hero.tsx` — look for `<span className="font-display text-[var(--coshift-cyan)]">`. The `font-display` class is the Fraunces-italic moment defined in `src/app/globals.css`.

---

## 7. Replace the hero 3D scene with a static fallback (no WebGL)

If you want to ship a static-only version (for example for a temporary low-bandwidth rollout):

Open `src/components/sections/Hero.tsx` and replace:

```tsx
const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => <HeroPoster />,
});
```

with:

```tsx
const HeroScene = HeroPoster;
```

The `<HeroPoster />` component renders the SVG fallback that's already shipped for low-power devices.

---

## 8. Add a new locale (e.g. Arabic)

1. Open `src/i18n/routing.ts` and add the code to `locales`:
   ```ts
   locales: ["fr", "en", "ar"],
   ```
2. Create `messages/ar.json` by copying `messages/fr.json` and translating every value.
3. (Optional, only for right-to-left languages) Update the locale layout (`src/app/[locale]/layout.tsx`) to set `dir="rtl"` on `<html>` for `ar`.
4. Add the locale to `src/lib/site.ts` if you want it in default redirects.
5. Update `src/app/sitemap.ts` — the `locales` array there is the source for hreflang.

---

## 9. Change a number in a service page (deliverables, modules, FAQ)

Service pages are driven entirely by `messages/{en,fr}.json`:

- `services.odoo.deliverables.items` — bullet list under "What you get"
- `services.odoo.modules.items` — module chips
- `services.odoo.faq.items` — FAQ Q/A pairs (each `{ q, a }`)
- Same structure under `services.web`.

Add/remove array entries in both languages and the page updates on next deploy.

---

## 10. Change the studio principles on the About page

`messages/{en,fr}.json` → `about.principles.items`. Three keys: `ownership`, `craft`, `fluency`. Add a fourth key the same way:

1. Add it to JSON under each locale.
2. Open `src/app/[locale]/(marketing)/about/page.tsx` and extend the `principles` array:
   ```ts
   const principles = ["ownership", "craft", "fluency", "newKey"] as const;
   ```

---

## 11. Where the `<EditMe>` and `TODO:` markers live

These are the placeholders that signal "user must replace this." Search the repo for `EditMe` or `TODO:` to find them:

- `src/components/sections/Numbers.tsx` — stats placeholders
- `src/components/sections/TrustStrip.tsx` — `<!-- TODO: replace with real client logos -->`
- `src/content/work/index.ts` — `<EditMe>` for the two placeholder case studies
- `src/lib/site.ts` — `<EditMe>` for business address / contact
- `src/app/[locale]/(marketing)/about/page.tsx` — team-photos placeholder
- `src/components/contact/CalendlyEmbed.tsx` — env-var prompt
- `src/components/sections/LabGrid.tsx` — `<EditMe>` for view-source URLs

---

## 12. Local preview workflow

```bash
pnpm dev
# open http://localhost:3000 (or :3001 if 3000 is taken)
```

Edit any file → save → the page reloads.

For final review, run `pnpm build && pnpm start` and check the production-mode page sizes / Lighthouse scores.
