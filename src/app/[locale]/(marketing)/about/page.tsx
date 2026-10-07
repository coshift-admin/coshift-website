import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerList } from "@/components/motion/StaggerList";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CtaBand } from "@/components/ui/CtaBand";
import { Sectors } from "@/components/sections/Sectors";
import { site } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("heading"),
    description: t("intro"),
  };
}

const PRINCIPLES = ["scope", "ownership", "engineering"] as const;

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const tCta = await getTranslations("home.cta");

  return (
    <>
      <PageHero eyebrow={t("kicker")} title={t("heading")} hand={t("hand")} intro={t("intro")} />

      <section aria-labelledby="principles-title" className="surface-light">
        <div className="container-x mx-auto grid max-w-[1320px] gap-12 py-[var(--section-y)] lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionHeader id="principles-title" title={t("principles.heading")} />
          </div>
          <StaggerList
            as="ol"
            className="divide-y divide-[var(--line)] border-y border-[var(--line)] lg:col-span-8"
            staggerChildren={0.1}
          >
            {PRINCIPLES.map((key, i) => (
              <li key={key} className="grid grid-cols-[auto_1fr] gap-6 py-8 md:gap-8">
                <span className="text-mono pt-1.5 text-[var(--eyebrow)]">0{i + 1}</span>
                <div>
                  <h3 className="text-[clamp(1.3rem,2vw,1.6rem)] font-bold leading-[1.2] tracking-[-0.02em] text-[var(--fg)]">
                    {t(`principles.items.${key}.title`)}
                  </h3>
                  <p className="mt-3 max-w-[60ch] text-pretty leading-[1.65] text-[var(--fg-body)]">
                    {t(`principles.items.${key}.body`)}
                  </p>
                </div>
              </li>
            ))}
          </StaggerList>
        </div>
      </section>

      <Sectors />

      <section aria-labelledby="location-title" className="border-t border-white/10">
        <div className="container-x mx-auto grid max-w-[1320px] gap-10 py-[var(--section-y)] lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeader id="location-title" title={t("location.heading")} intro={t("location.body")} />
          </div>
          <Reveal className="lg:col-span-7 lg:self-end" delay={0.1}>
            <address className="not-italic text-[var(--navy-100)]/85">
              <p className="text-mono text-[var(--cyan-300)]">Coshift</p>
              <p className="mt-3 text-lg leading-relaxed">
                {site.address.street}
                <br />
                {site.address.municipality}, {site.address.city} {site.address.postalCode}
              </p>
              <a
                href={site.address.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 font-semibold text-[var(--cyan-300)] transition-colors duration-[var(--dur-ds-fast)] hover:text-white"
              >
                Google Maps <span aria-hidden>↗</span>
              </a>
            </address>
            {/* <EditMe> — team photos: brief says skip until the founder supplies them. */}
          </Reveal>
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
