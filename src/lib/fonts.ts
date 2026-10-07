import { Gabarito, Caveat, Cairo, Lemonada } from "next/font/google";

/**
 * Coshift Design System type (`Coshift Design System/tokens/fonts.css`):
 * two faces per script, one official + one handwritten accent.
 *
 *  Latin  — Gabarito (display, UI, body, data — tabular figures)
 *           Caveat   (handwritten asides, max ~6 words, never UI or numbers)
 *  Arabic — Cairo    (the Gabarito counterpart)
 *           Lemonada (the Caveat counterpart)
 *
 * Self-hosted at build time by next/font — no runtime request to Google.
 * Latin pages use Gabarito/Caveat only — the Arabic faces aren't in those
 * stacks, aren't preloaded, and so are never downloaded there. Arabic text
 * (`[lang="ar"]`, globals.css) uses "Gabarito" by name first, then Cairo: Latin
 * words and figures stay in Gabarito (DS rule), Arabic letters fall through to
 * Cairo. (Cairo can't lead a Latin stack: Google's Cairo also ships Latin
 * glyphs, which would replace Gabarito.)
 */
export const gabarito = Gabarito({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-gabarito",
  weight: ["400", "500", "600", "700", "800"],
});

export const caveat = Caveat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-caveat",
  weight: ["600"],
});

export const cairo = Cairo({
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-cairo",
  weight: ["400", "500", "600", "700", "800"],
  preload: false,
});

export const lemonada = Lemonada({
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-lemonada",
  weight: ["600"],
  preload: false,
});
