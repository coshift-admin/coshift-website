import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/contact/ContactForm";
import { CalendlyEmbed } from "@/components/contact/CalendlyEmbed";
import { LocationMap } from "@/components/contact/LocationMap";
import { site } from "@/lib/site";
import { PageHero } from "@/components/ui/PageHero";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return { title: t("heading"), description: t("intro") };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <>
      <PageHero eyebrow={t("kicker")} title={t("heading")} hand={t("hand")} intro={t("intro")} />
      <div className="container-x mx-auto max-w-[1320px]">
      <section className="grid grid-cols-1 gap-16 border-b border-white/10 py-16 md:grid-cols-12 md:gap-x-16 md:py-24">
        <div className="md:col-span-7">
          <ContactForm />
        </div>
        <aside className="md:col-span-5">
          <h2 className="text-mono mb-4 text-[var(--navy-300)]">
            {t("details.heading")}
          </h2>
          <ul className="space-y-3 text-base text-[var(--navy-100)]/85">
            <li>{t("details.address")}</li>
            <li>
              <span className="opacity-60">{t("details.emailLabel")}: </span>
              <a
                dir="ltr"
                href={`mailto:${site.email}`}
                className="text-[var(--coshift-cyan)] hover:underline"
              >
                {site.email}
              </a>
            </li>
            <li>
              <span className="opacity-60">{t("details.phoneLabel")}: </span>
              <a
                dir="ltr"
                href={`tel:${site.phone.replace(/\s+/g, "")}`}
                className="hover:text-[var(--coshift-cyan)]"
              >
                {site.phone}
              </a>
            </li>
            <li>
              <span className="opacity-60">{t("details.whatsappLabel")}: </span>
              <a
                dir="ltr"
                href={`https://wa.me/${site.whatsapp.replace(/\D+/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--coshift-cyan)]"
              >
                {site.whatsapp}
              </a>
            </li>
          </ul>
          <LocationMap />
          <a
            href={site.address.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-mono mt-3 inline-flex items-center gap-2 text-[var(--navy-300)] hover:text-[var(--coshift-cyan)]"
          >
            {site.address.municipality}, {site.address.city} ↗
          </a>
        </aside>
      </section>

      <section className="py-20 md:py-28">
        <h2 className="text-mono mb-6 text-[var(--navy-300)]">
          {t("calendly")}
        </h2>
        <CalendlyEmbed />
      </section>
      </div>
    </>
  );
}
