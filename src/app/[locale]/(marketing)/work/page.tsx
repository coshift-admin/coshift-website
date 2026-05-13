import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { caseStudies } from "@/content/work";
import { CaseCover } from "@/components/work/CaseCover";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "work" });
  return { title: t("heading"), description: t("intro") };
}

export default async function WorkIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("work");
  const isFr = locale === "fr";

  return (
    <div className="container-x mx-auto max-w-[1600px] pt-32 md:pt-44">
      <header className="border-b border-white/10 pb-20 md:pb-28">
        <div className="text-mono mb-6 flex items-center gap-3 text-[var(--coshift-bone)]/60">
          <span aria-hidden className="h-px w-8 bg-[var(--coshift-cyan)]" />
          {t("kicker")}
        </div>
        <h1 className="max-w-[20ch] text-[var(--fs-h1)] font-extrabold leading-[0.95] tracking-[-0.02em]">
          {t("heading")}
        </h1>
        <p className="mt-8 max-w-[60ch] text-[var(--fs-lead)] text-[var(--coshift-bone)]/70">
          {t("intro")}
        </p>
      </header>

      <ul className="divide-y divide-white/10">
        {caseStudies.map((c, i) => (
          <li key={c.slug}>
            <Link
              href={`/work/${c.slug}`}
              className="group grid grid-cols-1 items-center gap-8 py-10 md:grid-cols-12 md:gap-12 md:py-16"
            >
              <div className="md:col-span-1 text-mono text-[var(--coshift-cyan)]">
                0{i + 1}
              </div>
              <div className="md:col-span-5">
                <h2 className="text-[clamp(1.75rem,3.5vw,3rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-[var(--coshift-bone)] transition-colors group-hover:text-[var(--coshift-cyan)]">
                  {isFr ? c.titleFr ?? c.title : c.title}
                </h2>
                <p className="mt-3 text-sm text-[var(--coshift-bone)]/60">
                  {c.year} · {c.services.join(" · ")}
                </p>
              </div>
              <p className="md:col-span-4 text-base text-[var(--coshift-bone)]/70">
                {isFr ? c.summaryFr ?? c.summary : c.summary}
              </p>
              <div className="md:col-span-2 relative aspect-[5/3] overflow-hidden rounded-xl border border-white/10">
                <CaseCover hue={c.cover.hue} tone={c.cover.tone} />
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <p className="text-mono py-12 text-[var(--coshift-bone)]/40">
        {/* TODO: replace with real engagements as new case studies are published */}
        Two placeholder studies seeded for layout — edit in
        <code className="mx-1 text-[var(--coshift-cyan)]">
          src/content/work/index.ts
        </code>
      </p>
    </div>
  );
}
