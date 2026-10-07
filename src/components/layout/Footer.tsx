import { getTranslations } from "next-intl/server";
import { FacebookLogo, InstagramLogo, LinkedinLogo } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/routing";
import { CoshiftWordmark } from "@/components/icons/CoshiftWordmark";
import { HandMark } from "@/components/ui/HandMark";
import { site } from "@/lib/site";

/**
 * Minimal footer: the signature, then how to reach us + socials, then one
 * line with the wordmark, the pages and the legal mention. No CTA here — every
 * page already ends with the CtaBand — and no solutions list: the header menu
 * has them.
 */
const PAGES = [
  { href: "/work", key: "work" as const },
  { href: "/method", key: "method" as const },
  { href: "/about", key: "about" as const },
  { href: "/lab", key: "lab" as const },
  { href: "/contact", key: "contact" as const },
];

const SOCIAL = [
  { href: site.social.linkedin, label: "LinkedIn", Icon: LinkedinLogo },
  { href: site.social.facebook, label: "Facebook", Icon: FacebookLogo },
  { href: site.social.instagram, label: "Instagram", Icon: InstagramLogo },
];

const LINK = "transition-colors duration-[var(--dur-ds-fast)] hover:text-[var(--coshift-cyan)]";

export async function Footer() {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[var(--coshift-ink)]">
      <div className="container-x mx-auto max-w-[1320px] pb-8 pt-16 md:pt-24">
        <p className="max-w-[16ch] text-[clamp(2.1rem,5vw,4rem)] font-extrabold leading-[1.02] tracking-[-0.03em] text-white">
          {t("sloganLead")}{" "}
          <HandMark delay={0.4}>
            <span className="text-[var(--coshift-cyan)]">{t("sloganAccent")}</span>
          </HandMark>
        </p>

        {/* how to reach us · socials */}
        <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex flex-wrap gap-x-7 gap-y-2 text-[var(--navy-100)]/85">
            <li>
              <a dir="ltr" className={LINK} href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </li>
            <li>
              <a dir="ltr" className={`tabular ${LINK}`} href={`tel:${site.phone.replace(/\s+/g, "")}`}>
                {site.phone}
              </a>
            </li>
            <li>
              <a
                className={LINK}
                href={`https://wa.me/${site.whatsapp.replace(/\D+/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </li>
          </ul>
          <ul aria-label={t("social")} className="flex gap-2">
            {SOCIAL.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid size-10 place-items-center rounded-lg border border-white/10 text-[var(--navy-100)] transition-colors duration-[var(--dur-ds-fast)] hover:border-white/25 hover:text-[var(--coshift-cyan)]"
                >
                  <Icon weight="fill" className="size-[18px]" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* wordmark · pages · legal */}
        <div className="mt-12 flex flex-col gap-6 border-t border-white/10 pt-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:gap-10">
            <Link href="/" aria-label={tNav("home")} className="shrink-0 self-start md:self-auto">
              <CoshiftWordmark tone="mono-light" crop className="h-[18px] w-auto" />
            </Link>
            <nav aria-label="Coshift">
              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[0.95rem] text-[var(--navy-100)]/85">
                {PAGES.map(({ href, key }) => (
                  <li key={href}>
                    <Link className={LINK} href={href}>
                      {tNav(key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <p className="text-sm text-[var(--navy-300)]">
            {t("legal", { year })} ·{" "}
            <a className={LINK} href={site.address.mapsUrl} target="_blank" rel="noopener noreferrer">
              {t("location")}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
