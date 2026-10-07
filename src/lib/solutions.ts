/**
 * The five solutions — the site's information architecture is organised by
 * what a business owner needs, not by technology. Single source of truth for
 * slugs (routes: /solutions/[slug]) and which case studies prove each one.
 * Copy lives in messages: `nav.solutionItems.<slug>` (menu), `home.solutions`
 * (home cards) and the `solutionPages` namespace (the pages themselves).
 */
export const SOLUTION_SLUGS = ["erp", "web", "apps", "automation", "email"] as const;
export type SolutionSlug = (typeof SOLUTION_SLUGS)[number];

/** Case-study slugs (src/content/work) shown as proof on each solution page. */
export const SOLUTION_CASES: Record<SolutionSlug, string[]> = {
  erp: ["broderie-royale", "renoh", "fastplast"],
  web: ["avz", "formex", "kompen"],
  apps: ["profit-zone", "fastplast", "renoh"],
  // work that already removes manual steps: attendance → payroll, auto-commission, ad tracking
  automation: ["fastplast", "renoh", "savoir-glow"],
  email: [],
};

export function isSolutionSlug(value: string): value is SolutionSlug {
  return (SOLUTION_SLUGS as readonly string[]).includes(value);
}
