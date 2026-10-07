import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import { caseStudies, findCaseStudy, hostOf, tr } from "@/content/work";
import { CaseVisual } from "@/components/work/CaseVisual";
import { CaseNarrative, type Panel } from "@/components/work/CaseNarrative";
import { Testimonial } from "@/components/work/Testimonial";
import { Reveal, RevealWords } from "@/components/motion/Reveal";
import { CtaBand } from "@/components/ui/CtaBand";
import { languageAlternates } from "@/lib/locale";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => caseStudies.map((c) => ({ locale, slug: c.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug, locale } = await params;
  const c = findCaseStudy(slug);
  if (!c) return {};
  return {
    title: tr(c.title, locale),
    description: tr(c.summary, locale),
    alternates: { languages: languageAlternates(`/work/${slug}`) },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("work.labels");
  const tCta = await getTranslations("home.cta");
  const c = findCaseStudy(slug);
  if (!c) notFound();

  const idx = caseStudies.findIndex((x) => x.slug === c.slug);
  const next = caseStudies[(idx + 1) % caseStudies.length];

  return (
    <article>
      <header className="relative isolate overflow-hidden bg-[var(--coshift-ink)] pt-[max(8rem,16svh)]">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(55%_70%_at_80%_0%,color-mix(in_oklab,var(--coshift-cyan)_14%,transparent),transparent_70%)]" />
          <div className="pattern-shift absolute inset-0 [mask-image:radial-gradient(70%_90%_at_80%_10%,black_10%,transparent_75%)]" />
        </div>
        <div className="container-x relative mx-auto max-w-[1320px]">
          <Link
            href="/work"
            className="group text-mono inline-flex items-center gap-2 text-[var(--navy-300)] hover:text-[var(--cyan-300)]"
          >
            <span aria-hidden className="arrow-back">←</span> {t("back")}
          </Link>
          <p className="text-mono mt-8 text-[var(--cyan-300)]">{c.client}</p>
          <h1 className="mt-4 max-w-[26ch] text-balance text-[length:clamp(2.1rem,4.6vw,4rem)] font-extrabold leading-[1.08] tracking-[-0.025em] text-white">
            <RevealWords text={tr(c.title, locale)} />
          </h1>
          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <dl className="flex flex-wrap gap-1.5">
                <dt className="sr-only">{t("services")}</dt>
                {c.services.map((s) => (
                  <dd key={s.en} className="rounded-md border border-white/12 px-2.5 py-1 text-sm text-[var(--navy-100)]/80">
                    {tr(s, locale)}
                  </dd>
                ))}
              </dl>
              {c.url && (
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center gap-2 rounded-lg bg-[var(--coshift-cyan)] px-5 font-bold text-[#170f3c] transition-colors duration-[var(--dur-ds-fast)] hover:bg-[var(--cyan-500)]"
                >
                  {t("visit")} <span dir="ltr" className="font-medium opacity-70">{hostOf(c.url)}</span>
                  <ArrowSquareOut weight="bold" aria-hidden className="size-4" />
                </a>
              )}
            </div>
          </Reveal>
          <Reveal delay={0.25}>
            <div className="relative mt-12 aspect-[16/8] overflow-hidden rounded-t-xl border border-b-0 border-white/10 md:mt-16">
              <CaseVisual c={c} alt={c.client} sizes="(min-width: 1320px) 1240px, 94vw" priority />
            </div>
          </Reveal>
        </div>
      </header>

      <CaseNarrative
        panels={
          [
            { label: t("summary"), body: tr(c.summary, locale), lead: true },
            { label: t("problem"), body: tr(c.problem, locale) },
            { label: t("approach"), body: tr(c.approach, locale) },
            { label: t("result"), body: tr(c.result, locale), lead: true },
          ] satisfies Panel[]
        }
      />

      <Testimonial
        quote={c.quote ? tr(c.quote, locale) : undefined}
        author={c.quoteAuthor}
        role={c.quoteRole ? tr(c.quoteRole, locale) : undefined}
      />

      {next && next.slug !== c.slug && (
        <Link href={`/work/${next.slug}`} className="group relative block border-t border-white/10 py-16 md:py-24">
          <div className="container-x mx-auto max-w-[1320px]">
            <p className="text-mono text-[var(--navy-300)]">
              {t("next")} <span aria-hidden className="arrow-fwd">→</span>
            </p>
            <p className="mt-4 max-w-[30ch] text-pretty text-[clamp(1.6rem,3.2vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.02em] text-white transition-colors duration-[var(--dur-ds-fast)] group-hover:text-[var(--cyan-300)]">
              {tr(next.title, locale)}
            </p>
          </div>
        </Link>
      )}

      <CtaBand
        title={tCta("title")}
        body={tCta("body")}
        primary={{ label: tCta("primary"), href: "/contact" }}
        note={tCta("note")}
      />
    </article>
  );
}
