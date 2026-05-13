import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { caseStudies, findCaseStudy } from "@/content/work";
import { CaseCover } from "@/components/work/CaseCover";
import { ShiftGlyph } from "@/components/icons/ShiftGlyph";

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
          <h1 className="mt-8 max-w-[24ch] text-[var(--fs-h1)] font-extrabold leading-[0.95] tracking-[-0.02em]">
            {pick(c.title, c.titleFr)}
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

      <div className="container-x mx-auto grid max-w-[1600px] grid-cols-1 gap-y-16 py-20 md:grid-cols-12 md:gap-x-16 md:py-32">
        <Section heading={t("summary")} className="md:col-span-12">
          <p className="max-w-[60ch] text-[var(--fs-lead)] text-[var(--coshift-bone)]/80">
            {pick(c.summary, c.summaryFr)}
          </p>
        </Section>
        <Section heading={t("problem")} className="md:col-span-6">
          <p className="text-base text-[var(--coshift-bone)]/75">
            {pick(c.problem, c.problemFr)}
          </p>
        </Section>
        <Section heading={t("approach")} className="md:col-span-6">
          <p className="text-base text-[var(--coshift-bone)]/75">
            {pick(c.approach, c.approachFr)}
          </p>
        </Section>
        <Section heading={t("result")} className="md:col-span-12">
          <p className="max-w-[60ch] text-[var(--fs-lead)] text-[var(--coshift-bone)]/85">
            {pick(c.result, c.resultFr)}
          </p>
        </Section>
      </div>

      <NextCase currentSlug={c.slug} locale={locale} />
    </article>
  );
}

function Section({
  heading,
  className,
  children,
}: {
  heading: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={className}>
      <div className="text-mono mb-4 flex items-center gap-3 text-[var(--coshift-bone)]/60">
        <ShiftGlyph className="h-3 w-auto text-[var(--coshift-cyan)]" />
        {heading}
      </div>
      {children}
    </section>
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
        <h3 className="mt-4 max-w-[28ch] text-[var(--fs-h2)] font-bold leading-[1.05] tracking-[-0.02em] transition-colors group-hover:text-[var(--coshift-cyan)]">
          {isFr ? next.titleFr ?? next.title : next.title}
        </h3>
      </div>
    </Link>
  );
}
