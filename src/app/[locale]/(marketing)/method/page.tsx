import type { Metadata } from "next";
import { languageAlternates } from "@/lib/locale";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { site } from "@/lib/site";
import { Process } from "@/components/sections/Process";
import { CtaBand } from "@/components/ui/CtaBand";
import { PageHero } from "@/components/ui/PageHero";
import { HeroActions } from "@/components/solutions/HeroActions";
import { DeliverablesSection, FaqSection, StepsSection } from "@/components/solutions/Sections";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "method.meta" });
  const base = site.url.replace(/\/$/, "");
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `${base}/${locale}/method`,
      languages: languageAlternates("/method"),
    },
  };
}

/**
 * How a project runs: the four phases (the home page's Process section,
 * reused as-is — it carries the "Four phases. No surprises." heading), how it
 * starts before anything is signed, and what continues after launch.
 */
export default async function MethodPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "method" });

  const primary = { label: t("cta.primary"), href: "/contact" };
  const secondary = { label: t("cta.secondary"), href: "/work" };

  return (
    <>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        hand={t("hero.hand")}
        intro={t("hero.sub")}
      >
        <HeroActions primary={primary} note={t("cta.note")} />
      </PageHero>

      <Process />

      <StepsSection
        eyebrow={t("start.eyebrow")}
        title={t("start.title")}
        intro={t("start.intro")}
        steps={t.raw("start.steps") as { title: string; body: string }[]}
      />

      <DeliverablesSection
        dark
        eyebrow={t("after.eyebrow")}
        title={t("after.title")}
        intro={t("after.intro")}
        items={t.raw("after.items") as { icon: string; title: string; body: string }[]}
      />

      <FaqSection
        eyebrow={t("faq.eyebrow")}
        title={t("faq.title")}
        items={t.raw("faq.items") as { q: string; a: string }[]}
      />

      <CtaBand
        title={t("cta.title")}
        body={t("cta.body")}
        primary={primary}
        secondary={secondary}
        note={t("cta.note")}
      />
    </>
  );
}
