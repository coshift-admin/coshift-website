import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { CoshiftWordmark } from "@/components/icons/CoshiftWordmark";
import { ShiftGlyph } from "@/components/icons/ShiftGlyph";
import { site } from "@/lib/site";
import { FooterBgGlyph } from "./FooterBgGlyph";

export async function Footer() {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[var(--coshift-ink)]">
      <FooterBgGlyph />
      <div className="container-x relative z-10 mx-auto max-w-[1600px] py-16 md:py-24">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link href="/" aria-label="Coshift home">
              <CoshiftWordmark tone="mono-light" className="h-8 w-auto" />
            </Link>
            <p className="mt-6 max-w-sm text-balance text-base text-[var(--coshift-bone)]/70">
              {t("tagline")}
            </p>
            <div className="mt-8 flex items-center gap-3">
              <ShiftGlyph className="h-6 w-auto text-[var(--coshift-cyan)]" />
              <span className="text-mono text-[var(--coshift-bone)]/60">
                {site.address.district}, {site.address.municipality}, {site.address.city} — {site.address.country}
              </span>
            </div>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-mono text-[var(--coshift-bone)]/60">
              {t("navLabel")}
            </h3>
            <ul className="mt-4 space-y-2 text-base">
              <li>
                <Link className="hover:text-[var(--coshift-cyan)]" href="/work">
                  {tNav("work")}
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-[var(--coshift-cyan)]"
                  href="/services/odoo"
                >
                  {tNav("servicesOdoo")}
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-[var(--coshift-cyan)]"
                  href="/services/web"
                >
                  {tNav("servicesWeb")}
                </Link>
              </li>
              <li>
                <Link className="hover:text-[var(--coshift-cyan)]" href="/about">
                  {tNav("about")}
                </Link>
              </li>
              <li>
                <Link className="hover:text-[var(--coshift-cyan)]" href="/lab">
                  {tNav("lab")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="text-mono text-[var(--coshift-bone)]/60">
              {t("contactLabel")}
            </h3>
            <ul className="mt-4 space-y-2 text-base">
              <li>
                <a
                  className="hover:text-[var(--coshift-cyan)]"
                  href={`mailto:${site.email}`}
                >
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  className="hover:text-[var(--coshift-cyan)]"
                  href={`tel:${site.phone.replace(/\s+/g, "")}`}
                >
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  className="hover:text-[var(--coshift-cyan)]"
                  href={`https://wa.me/${site.whatsapp.replace(/\D+/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
            <h3 className="text-mono mt-8 text-[var(--coshift-bone)]/60">
              {t("social")}
            </h3>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-base">
              <li>
                <a
                  className="hover:text-[var(--coshift-cyan)]"
                  href={site.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  className="hover:text-[var(--coshift-cyan)]"
                  href={site.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  className="hover:text-[var(--coshift-cyan)]"
                  href={site.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-[var(--coshift-bone)]/50 md:flex-row md:items-center md:justify-between">
          <p>{t("legal", { year })}</p>
          <p className="text-mono">v0.1.0 — built with shifts</p>
        </div>
      </div>
    </footer>
  );
}
