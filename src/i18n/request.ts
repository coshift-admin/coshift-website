import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

/** The Lab's experiments — one message file each, merged under `lab.items`. */
const LAB_ITEMS = ["shift", "order", "invoice", "forecast", "inbox", "rtl"] as const;

/**
 * Messages are split by area so pages can be written independently:
 *  - messages/{locale}.json                 → shell, home, about, contact…
 *  - messages/{locale}/solution-pages.json  → `solutionPages` namespace
 *  - messages/{locale}/method.json          → `method` namespace
 *  - messages/{locale}/lab/<item>.json      → `lab.items.<item>`
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale =
    requested && (routing.locales as readonly string[]).includes(requested)
      ? requested
      : routing.defaultLocale;

  const [main, solutionPages, method, ...labItems] = await Promise.all([
    import(`../../messages/${locale}.json`),
    import(`../../messages/${locale}/solution-pages.json`),
    import(`../../messages/${locale}/method.json`),
    ...LAB_ITEMS.map((item) => import(`../../messages/${locale}/lab/${item}.json`)),
  ]);

  return {
    locale,
    messages: {
      ...main.default,
      lab: {
        ...main.default.lab,
        items: Object.fromEntries(LAB_ITEMS.map((item, i) => [item, labItems[i].default])),
      },
      solutionPages: solutionPages.default,
      method: method.default,
    },
  };
});
