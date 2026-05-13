import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/contact/ContactForm";
import { CalendlyEmbed } from "@/components/contact/CalendlyEmbed";
import { site } from "@/lib/site";

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
    <div className="container-x mx-auto max-w-[1600px] pt-32 md:pt-44">
      <header className="border-b border-white/10 pb-20 md:pb-28">
        <div className="text-mono mb-6 flex items-center gap-3 text-[var(--coshift-bone)]/60">
          <span aria-hidden className="h-px w-8 bg-[var(--coshift-cyan)]" />
          {t("kicker")}
        </div>
        <h1 className="max-w-[20ch] text-[length:var(--fs-h1)] font-extrabold leading-[0.95] tracking-[-0.02em]">
          {t("heading")}
        </h1>
        <p className="mt-8 max-w-[60ch] text-[length:var(--fs-lead)] text-[var(--coshift-bone)]/70">
          {t("intro")}
        </p>
      </header>

      <section className="grid grid-cols-1 gap-16 border-b border-white/10 py-20 md:grid-cols-12 md:gap-x-16 md:py-28">
        <div className="md:col-span-7">
          <ContactForm />
        </div>
        <aside className="md:col-span-5">
          <h2 className="text-mono mb-4 text-[var(--coshift-bone)]/60">
            {t("details.heading")}
          </h2>
          <ul className="space-y-3 text-base text-[var(--coshift-bone)]/85">
            <li>{t("details.address")}</li>
            <li>
              <span className="opacity-60">{t("details.emailLabel")}: </span>
              <a
                href={`mailto:${site.email}`}
                className="text-[var(--coshift-cyan)] hover:underline"
              >
                {site.email}
              </a>
            </li>
            <li>
              <span className="opacity-60">{t("details.phoneLabel")}: </span>
              <a
                href={`tel:${site.phone.replace(/\s+/g, "")}`}
                className="hover:text-[var(--coshift-cyan)]"
              >
                {site.phone}
              </a>
            </li>
            <li>
              <span className="opacity-60">{t("details.whatsappLabel")}: </span>
              <a
                href={`https://wa.me/${site.whatsapp.replace(/\D+/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--coshift-cyan)]"
              >
                {site.whatsapp}
              </a>
            </li>
          </ul>
          {/* Simple map placeholder — opens Google Maps in a new tab.
              Replace with an embedded vector map when the studio is ready to publish exact address. */}
          <a
            href="https://www.google.com/maps/place/M'Sila"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 block aspect-[4/3] overflow-hidden rounded-2xl border border-white/10"
          >
            <div className="grid h-full place-items-center bg-[radial-gradient(ellipse_at_50%_50%,rgba(31,182,240,0.18),transparent_55%)]">
              <span className="text-mono text-[var(--coshift-bone)]/60">
                M'Sila ↗
              </span>
            </div>
          </a>
        </aside>
      </section>

      <section className="py-20 md:py-28">
        <h2 className="text-mono mb-6 text-[var(--coshift-bone)]/60">
          {t("calendly")}
        </h2>
        <CalendlyEmbed />
      </section>
    </div>
  );
}
