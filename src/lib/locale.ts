import { routing } from "@/i18n/routing";
import { site } from "@/lib/site";

/** Text direction per locale — Arabic is the only right-to-left one. */
export function dirOf(locale: string): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}

/** Open Graph locale codes. */
export function ogLocale(locale: string): string {
  return locale === "ar" ? "ar_DZ" : locale === "en" ? "en_US" : "fr_FR";
}

/**
 * hreflang alternates for a path ("" for the home page, "/method", …):
 * one entry per locale, plus x-default → French.
 */
export function languageAlternates(path: string): Record<string, string> {
  const base = site.url.replace(/\/$/, "");
  const entries = Object.fromEntries(
    routing.locales.map((l) => [l, `${base}/${l}${path}`]),
  );
  return { ...entries, "x-default": `${base}/${routing.defaultLocale}${path}` };
}
