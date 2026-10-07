import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/routing";
import { caseStudies, hostOf, tr } from "@/content/work";
import { CaseVisual } from "@/components/work/CaseVisual";
import { StaggerList } from "@/components/motion/StaggerList";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CtaBand } from "@/components/ui/CtaBand";
import { languageAlternates } from "@/lib/locale";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "work" });
  return {
    title: t("heading"),
    description: t("intro"),
    alternates: { languages: languageAlternates("/work") },
  };
}

/**
 * Portfolio: live websites first (real screenshots, a link to visit each), then
 * the ERP / integration / custom work that runs behind the scenes.
 */
export default async function WorkIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("work");
  const tCta = await getTranslations("home.cta");

  const sites = caseStudies.filter((c) => c.kind === "site");
  const systems = caseStudies.filter((c) => c.kind === "system");

  return (
    <>
      <PageHero eyebrow={t("kicker")} title={t("heading")} hand={t("hand")} intro={t("intro")} />

      <section aria-labelledby="sites-title" className="container-x mx-auto max-w-[1320px] pb-[var(--section-y)]">
        <SectionHeader id="sites-title" size="md" title={t("sites.title")} intro={t("sites.intro")} />
        <StaggerList as="ul" className="mt-10 grid grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-2" staggerChildren={0.1}>
          {sites.map((c) => (
            <li key={c.slug} className="flex flex-col">
              <Link href={`/work/${c.slug}`} className="group block" aria-label={`${c.client} — ${t("labels.caseLink")}`}>
                <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10">
                  <CaseVisual c={c} alt={c.client} sizes="(min-width: 768px) 46vw, 92vw" />
                </div>
              </Link>
              <p className="text-mono mt-5 text-[var(--cyan-300)]">{c.client}</p>
              <h2 className="mt-2 text-pretty text-[clamp(1.25rem,1.8vw,1.5rem)] font-bold leading-snug tracking-[-0.015em] text-white">
                <Link href={`/work/${c.slug}`} className="transition-colors duration-[var(--dur-ds-fast)] hover:text-[var(--cyan-300)]">
                  {tr(c.title, locale)}
                </Link>
              </h2>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {c.services.map((s) => (
                  <li key={s.en} className="rounded-md border border-white/12 px-2.5 py-1 text-xs text-[var(--navy-100)]/75">
                    {tr(s, locale)}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.95rem] font-semibold">
                <Link href={`/work/${c.slug}`} className="group inline-flex items-center gap-1.5 text-white hover:text-[var(--cyan-300)]">
                  {t("labels.caseLink")} <span aria-hidden className="arrow-fwd">→</span>
                </Link>
                {c.url && (
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[var(--cyan-300)] hover:text-white"
                  >
                    {t("labels.visit")}
                    <span className="sr-only"> ({hostOf(c.url)})</span>
                    <ArrowSquareOut weight="bold" aria-hidden className="size-4" />
                  </a>
                )}
              </div>
            </li>
          ))}
        </StaggerList>
      </section>

      <section aria-labelledby="systems-title" className="surface-light">
        <div className="container-x mx-auto max-w-[1320px] py-[var(--section-y)]">
          <SectionHeader id="systems-title" size="md" title={t("systems.title")} intro={t("systems.intro")} />
          <StaggerList as="ul" className="mt-10 divide-y divide-[var(--line)] border-y border-[var(--line)]" staggerChildren={0.08}>
            {systems.map((c) => (
              <li key={c.slug}>
                <Link href={`/work/${c.slug}`} className="group grid gap-4 py-8 md:grid-cols-12 md:gap-8">
                  <p className="text-mono text-[var(--eyebrow)] md:col-span-3 md:pt-1.5">{c.client}</p>
                  <div className="md:col-span-8">
                    <h2 className="text-pretty text-[clamp(1.2rem,1.7vw,1.45rem)] font-bold leading-snug tracking-[-0.015em] text-[var(--fg)] transition-colors duration-[var(--dur-ds-fast)] group-hover:text-[#0c6a92]">
                      {tr(c.title, locale)}
                    </h2>
                    <p className="mt-2 max-w-[70ch] text-pretty leading-[1.6] text-[var(--fg-body)]">
                      {tr(c.summary, locale)}
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {c.services.map((s) => (
                        <li key={s.en} className="rounded-md border border-[var(--line)] bg-[var(--card)] px-2.5 py-1 text-xs text-[var(--fg-muted)]">
                          {tr(s, locale)}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <span aria-hidden className="arrow-fwd hidden self-center justify-self-end text-xl text-[#0c6a92] md:col-span-1 md:block">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </StaggerList>
        </div>
      </section>

      <CtaBand
        title={tCta("title")}
        body={tCta("body")}
        primary={{ label: tCta("primary"), href: "/contact" }}
        note={tCta("note")}
      />
    </>
  );
}
