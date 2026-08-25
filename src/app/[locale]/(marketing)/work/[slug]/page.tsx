import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { caseStudies, findCaseStudy } from "@/content/work";
import { CaseCover } from "@/components/work/CaseCover";
import { CaseNarrative, type Panel } from "@/components/work/CaseNarrative";
import { Testimonial } from "@/components/work/Testimonial";
import { RevealWords } from "@/components/motion/Reveal";

export async function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug, locale } = await params;
  const c = findCaseStudy(slug);
  if (!c) return {};
  const title = locale === "fr" && c.titleFr ? c.titleFr : c.title;
  const description = locale === "fr" && c.summaryFr ? c.summaryFr : c.summary;
  return { title, description };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("work.labels");
  const c = findCaseStudy(slug);
  if (!c) notFound();
  const isFr = locale === "fr";
  const pick = <T,>(en: T, fr?: T) => (isFr && fr !== undefined ? fr : en);

  return (
    <article>
      <header className="relative isolate overflow-hidden">
        <div className="absolute inset-0">
          <CaseCover hue={c.cover.hue} tone={c.cover.tone} />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,transparent_55%,var(--coshift-ink)_100%)]" />
        <div className="container-x relative z-10 mx-auto max-w-[1600px] pb-24 pt-44 md:pb-40 md:pt-56">
          <Link
            href="/work"
            className="text-mono inline-flex items-center gap-2 text-[var(--coshift-bone)]/70 hover:text-[var(--coshift-cyan)]"
          >
            ← {t("client")} index
          </Link>
          <h1 className="mt-8 max-w-[24ch] text-[length:var(--fs-h1)] font-extrabold leading-[0.95] tracking-[-0.02em]">
            <RevealWords text={pick(c.title, c.titleFr)} />
          </h1>
          <dl className="text-mono mt-10 grid grid-cols-2 gap-x-8 gap-y-5 text-[var(--coshift-bone)]/70 sm:grid-cols-4">
            <div>
              <dt className="opacity-60">{t("client")}</dt>
              <dd className="mt-1 text-[var(--coshift-bone)]">{c.client}</dd>
            </div>
            <div>
              <dt className="opacity-60">{t("year")}</dt>
              <dd className="mt-1 text-[var(--coshift-bone)]">{c.year}</dd>
            </div>
            <div className="col-span-2">
              <dt className="opacity-60">{t("services")}</dt>
              <dd className="mt-1 text-[var(--coshift-bone)]">
                {c.services.join(" · ")}
              </dd>
            </div>
          </dl>
        </div>
      </header>

      <CaseNarrative
        panels={
          [
            { label: t("summary"), body: pick(c.summary, c.summaryFr), lead: true },
            { label: t("problem"), body: pick(c.problem, c.problemFr) },
            { label: t("approach"), body: pick(c.approach, c.approachFr) },
            { label: t("result"), body: pick(c.result, c.resultFr), lead: true },
          ] satisfies Panel[]
        }
      />

      <Testimonial
        quote={pick(c.quote, c.quoteFr)}
        author={c.quoteAuthor}
        role={c.quoteRole}
      />

      <NextCase currentSlug={c.slug} locale={locale} />
    </article>
  );
}

function NextCase({
  currentSlug,
  locale,
}: {
  currentSlug: string;
  locale: string;
}) {
  const idx = caseStudies.findIndex((c) => c.slug === currentSlug);
  const next = caseStudies[(idx + 1) % caseStudies.length];
  if (!next) return null;
  const isFr = locale === "fr";
  return (
    <Link
      href={`/work/${next.slug}`}
      className="group relative block border-t border-white/10 py-20 md:py-28"
    >
      <div className="container-x mx-auto max-w-[1600px]">
        <div className="text-mono text-[var(--coshift-bone)]/60">
          Next case
        </div>
        <h3 className="mt-4 max-w-[28ch] text-[length:var(--fs-h2)] font-bold leading-[1.05] tracking-[-0.02em] transition-colors group-hover:text-[var(--coshift-cyan)]">
          {isFr ? next.titleFr ?? next.title : next.title}
        </h3>
      </div>
    </Link>
  );
}
