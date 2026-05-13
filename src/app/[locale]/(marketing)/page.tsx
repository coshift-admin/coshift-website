import { Hero } from "@/components/sections/Hero";
import { ManifestoStrip } from "@/components/sections/ManifestoStrip";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { Numbers } from "@/components/sections/Numbers";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { CtaBlock } from "@/components/sections/CtaBlock";
import { setRequestLocale } from "next-intl/server";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <ManifestoStrip />
      <Services />
      <Process />
      <SelectedWork />
      <Numbers />
      <TrustStrip />
      <CtaBlock />
    </>
  );
}
