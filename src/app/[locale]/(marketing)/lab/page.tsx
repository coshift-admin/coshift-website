import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LabGrid } from "@/components/sections/LabGrid";
import { PageHero } from "@/components/ui/PageHero";
import { languageAlternates } from "@/lib/locale";
import { site } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "lab" });
  const base = site.url.replace(/\/$/, "");
  return {
    title: t("heading"),
    description: t("intro"),
    alternates: { canonical: `${base}/${locale}/lab`, languages: languageAlternates("/lab") },
  };
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
    <>
      <PageHero eyebrow={t("kicker")} title={t("heading")} hand={t("hand")} intro={t("intro")} />
      <section className="container-x mx-auto max-w-[1320px] pb-[var(--section-y)]">
        <LabGrid />
      </section>
    </>
  );
}
