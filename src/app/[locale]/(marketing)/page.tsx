import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { ManifestoStrip } from "@/components/sections/ManifestoStrip";
import { Solutions } from "@/components/sections/Solutions";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { Process } from "@/components/sections/Process";
import { WhyCoshift } from "@/components/sections/WhyCoshift";
import { Faq } from "@/components/sections/Faq";
import { CtaBand } from "@/components/ui/CtaBand";
import { site } from "@/lib/site";

/**
 * Home, in the order an owner decides: what changes (hero) → our stance
 * (manifesto) → what we do (solutions) → proof (work) → how it goes
 * (process) → why us → objections (FAQ) → next step.
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home.cta");

  return (
    <>
      <Hero />
      <ManifestoStrip />
      <Solutions />
      <SelectedWork />
      <Process />
      <WhyCoshift />
      <Faq />
      <CtaBand
        title={t("title")}
        body={t("body")}
        primary={{ label: t("primary"), href: "/contact" }}
        secondary={{
          label: t("secondary"),
          href: `https://wa.me/${site.whatsapp.replace(/\D+/g, "")}`,
        }}
        note={t("note")}
        hand={t("hand")}
      />
    </>
  );
}
