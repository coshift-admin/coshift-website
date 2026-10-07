import { useTranslations } from "next-intl";
import { Accordion } from "@/components/ui/Accordion";
import { SectionHeader } from "@/components/ui/SectionHeader";

/**
 * Home: the questions an owner asks before committing — the objections from
 * the brand brief §8 plus "how does it start / what happens after launch".
 */
export function Faq() {
  const t = useTranslations("home.faq");
  const items = t.raw("items") as { q: string; a: string }[];

  return (
    <section aria-labelledby="faq-title" className="surface-light border-t border-[var(--line)]">
      <div className="container-x mx-auto grid max-w-[1320px] gap-10 py-[var(--section-y)] lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <SectionHeader id="faq-title" eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />
        </div>
        <div className="lg:col-span-8">
          <Accordion items={items} />
        </div>
      </div>
    </section>
  );
}
