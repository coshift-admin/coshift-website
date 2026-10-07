import { useTranslations } from "next-intl";
import { StaggerList } from "@/components/motion/StaggerList";
import { SectionHeader } from "@/components/ui/SectionHeader";

/**
 * Sector-coverage band (About). Breadth is itself an asset (brand brief §4.3)
 * — the list covers delivered *and* proposed work, so the copy says "sectors
 * we know", never "we built X for a pharma distributor" (a prospect).
 */
export function Sectors() {
  const t = useTranslations("about.sectors");
  const items = t.raw("items") as string[];

  return (
    <section aria-labelledby="sectors-title" className="container-x mx-auto max-w-[1320px] py-[var(--section-y)]">
      <SectionHeader id="sectors-title" size="md" eyebrow={t("kicker")} title={t("heading")} className="max-w-[44rem]" />
      <StaggerList as="ul" className="mt-10 flex flex-wrap gap-2.5" staggerChildren={0.04}>
        {items.map((s) => (
          <li
            key={s}
            className="rounded-lg border border-white/12 px-4 py-2 text-sm text-[var(--navy-100)]/80"
          >
            {s}
          </li>
        ))}
      </StaggerList>
    </section>
  );
}
