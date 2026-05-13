import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { caseStudies } from "@/content/work";

const STATIC = [
  "",
  "/work",
  "/services/odoo",
  "/services/web",
  "/about",
  "/lab",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ["fr", "en"];
  const base = site.url.replace(/\/$/, "");
  const entries: MetadataRoute.Sitemap = [];

  for (const path of STATIC) {
    for (const locale of locales) {
      entries.push({
        url: `${base}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.7,
      });
    }
  }

  for (const c of caseStudies) {
    for (const locale of locales) {
      entries.push({
        url: `${base}/${locale}/work/${c.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
