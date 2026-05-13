import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Accordion } from "@/components/ui/Accordion";
import { ShiftGlyph } from "@/components/icons/ShiftGlyph";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services.odoo" });
  return { title: t("heading"), description: t("intro") };
}

type FaqItem = { q: string; a: string };

export default async function OdooPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services.odoo");
  const items = t.raw("deliverables.items") as string[];
  const modules = t.raw("modules.items") as string[];
  const faq = t.raw("faq.items") as FaqItem[];

  return (
    <div className="container-x mx-auto max-w-[1600px] pt-32 md:pt-44">
      <header className="border-b border-white/10 pb-20 md:pb-28">
        <div className="text-mono mb-6 flex items-center gap-3 text-[var(--coshift-bone)]/60">
          <ShiftGlyph className="h-3 w-auto text-[var(--coshift-cyan)]" />
          {t("kicker")}
        </div>
        <h1 className="max-w-[20ch] text-[length:var(--fs-h1)] font-extrabold leading-[0.95] tracking-[-0.02em]">
          {t("heading")}
        </h1>
        <p className="mt-8 max-w-[60ch] text-[length:var(--fs-lead)] text-[var(--coshift-bone)]/70">
          {t("intro")}
        </p>
      </header>

      <section className="grid grid-cols-1 gap-12 py-20 md:grid-cols-12 md:gap-x-16 md:py-32">
        <h2 className="text-[length:var(--fs-h2)] font-bold leading-[1] tracking-[-0.02em] md:col-span-4">
          {t("deliverables.heading")}
        </h2>
        <ul className="md:col-span-8 md:divide-y md:divide-white/10">
          {items.map((it, i) => (
            <li
              key={i}
              className="grid grid-cols-[auto_1fr] items-start gap-6 border-t border-white/10 py-5 md:gap-8 md:border-t-0 md:py-6"
            >
              <div className="text-mono pt-1 text-[var(--coshift-cyan)]">
                0{i + 1}
              </div>
              <p className="text-[length:var(--fs-lead)] leading-snug text-[var(--coshift-bone)]/80">
                {it}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid grid-cols-1 gap-12 border-t border-white/10 py-20 md:grid-cols-12 md:gap-x-16 md:py-32">
        <h2 className="text-[length:var(--fs-h2)] font-bold leading-[1] tracking-[-0.02em] md:col-span-4">
          {t("modules.heading")}
        </h2>
        <ul className="flex flex-wrap gap-2 md:col-span-8">
          {modules.map((m) => (
            <li
              key={m}
              className="rounded-full border border-white/15 px-4 py-2 text-sm text-[var(--coshift-bone)]/80 transition-colors hover:border-[var(--coshift-cyan)] hover:text-[var(--coshift-cyan)]"
            >
              {m}
            </li>
          ))}
        </ul>
      </section>

      <section className="grid grid-cols-1 gap-12 border-t border-white/10 py-20 md:grid-cols-12 md:gap-x-16 md:py-32">
        <h2 className="text-[length:var(--fs-h2)] font-bold leading-[1] tracking-[-0.02em] md:col-span-4">
          {t("faq.heading")}
        </h2>
        <div className="md:col-span-8">
          <Accordion items={faq} />
        </div>
      </section>

      <section className="border-t border-white/10 py-20 md:py-32">
        <Link
          href="/contact"
          className="inline-flex items-center gap-3 rounded-full bg-[var(--coshift-cyan)] px-6 py-3 text-base font-semibold text-[var(--coshift-ink)] hover:bg-[var(--coshift-glow)]"
        >
          {/* uses the home CTA copy — same call to action */}
          {await getTranslations("home.cta").then((tr) => tr("primary"))} →
        </Link>
      </section>
    </div>
  );
}
