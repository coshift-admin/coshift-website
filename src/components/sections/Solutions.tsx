import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SolutionArt } from "./SolutionArt";
import { SOLUTION_SLUGS } from "@/lib/solutions";

/**
 * Home: the five solutions, framed by the owner's need rather than the
 * technology. Each card opens with a scroll-driven drawing (SolutionArt).
 * Light DS surface for reading. Each card is one big link to its solution
 * page. Layout: three "build" cards, then two wider ones — automation and
 * email, which carries the coral "easiest place to start" badge (the cheapest,
 * lowest-risk first step, brief §9).
 */
const SPAN = ["lg:col-span-2", "lg:col-span-2", "lg:col-span-2", "lg:col-span-3", "md:col-span-2 lg:col-span-3"];
export function Solutions() {
  const t = useTranslations("home.solutions");

  return (
    <section id="solutions" aria-labelledby="solutions-title" className="surface-light scroll-mt-20">
      <div className="container-x mx-auto max-w-[1320px] py-[var(--section-y)]">
        <SectionHeader id="solutions-title" eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />

        <ul className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2 lg:grid-cols-6">
          {SOLUTION_SLUGS.map((slug, i) => {
            return (
              <Reveal as="li" key={slug} delay={i * 0.06} y={16} className={SPAN[i]}>
                <Link
                  href={`/solutions/${slug}`}
                  className="group flex h-full flex-col rounded-xl border border-[var(--line)] bg-[var(--card)] p-6 shadow-[0_1px_2px_rgba(13,8,38,0.06),0_1px_3px_rgba(13,8,38,0.08)] transition-[transform,box-shadow,border-color] duration-[var(--dur-ds-normal)] ease-[var(--ease-ds)] hover:-translate-y-px hover:border-[var(--line-strong)] hover:shadow-[0_2px_4px_rgba(13,8,38,0.06),0_4px_12px_rgba(13,8,38,0.08)] md:p-8"
                >
                  {/* scroll-driven illustration — the same language as "Quatre phases" */}
                  <div className="relative h-[clamp(150px,15vw,200px)] overflow-hidden rounded-lg border border-[var(--line)] bg-[#f3f7fb] px-2 text-[#0a85b6]">
                    <SolutionArt variant={slug} />
                    {slug === "email" && (
                      <span className="absolute start-3 top-3 rounded-full border border-[var(--warm-100)] bg-[var(--warm-50)] px-3 py-1 text-xs font-semibold text-[var(--warm-700)]">
                        {t("startHere")}
                      </span>
                    )}
                  </div>
                  <p className="text-mono mt-6 text-[var(--fg-muted)]">{t(`items.${slug}.name`)}</p>
                  <h3 className="mt-2 text-balance text-[clamp(1.35rem,2vw,1.65rem)] font-bold leading-[1.2] tracking-[-0.02em] text-[var(--fg)]">
                    {t(`items.${slug}.title`)}
                  </h3>
                  <p className="mt-3 text-pretty leading-[1.6] text-[var(--fg-body)]">
                    {t(`items.${slug}.body`)}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-7 font-semibold text-[#0c6a92]">
                    {t(`items.${slug}.link`)}
                    <span aria-hidden className="arrow-fwd">
                      →
                    </span>
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
