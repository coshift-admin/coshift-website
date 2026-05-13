import { getTranslations, setRequestLocale } from "next-intl/server";
import { LabGrid } from "@/components/sections/LabGrid";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "lab" });
  return { title: t("heading"), description: t("intro") };
}

export default async function LabPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("lab");

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
      <LabGrid viewSourceLabel={t("viewSource")} />
    </div>
  );
}
