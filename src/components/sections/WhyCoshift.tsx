import { useTranslations } from "next-intl";
import { Code, PlayCircle, ShieldCheck, Users } from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { Reveal } from "@/components/motion/Reveal";
import { CountUp } from "@/components/motion/CountUp";
import { SectionHeader } from "@/components/ui/SectionHeader";

/**
 * Home: why choose Coshift — four differentiators from the brand brief §5,
 * each phrased as what it changes for the owner, plus the facts the founder
 * has cleared (brief §4/§5: 14 clients, 12 sectors, 10 email domains, 3
 * languages). No other numbers: never invent stats (brief §11).
 */
const POINTS: { key: string; icon: Icon }[] = [
  { key: "oneTeam", icon: Users },
  { key: "weRunIt", icon: ShieldCheck },
  { key: "demo", icon: PlayCircle },
  { key: "custom", icon: Code },
];

const FACTS = ["clients", "sectors", "domains", "languages"] as const;

export function WhyCoshift() {
  const t = useTranslations("home.why");

  return (
    <section aria-labelledby="why-title" className="surface-light border-t border-[var(--line)]">
      <div className="container-x mx-auto grid max-w-[1320px] gap-14 py-[var(--section-y)] lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeader id="why-title" eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />
          <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--line)]">
            {FACTS.map((key) => (
              <div key={key} className="flex flex-col gap-2 bg-[var(--card)] p-5">
                <dt className="text-sm leading-snug text-[var(--fg-muted)]">{t(`facts.${key}.label`)}</dt>
                <dd className="tabular order-first text-[2.25rem] font-extrabold leading-none tracking-[-0.03em] text-[var(--fg)]">
                  <CountUp value={t(`facts.${key}.value`)} />
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <ul className="divide-y divide-[var(--line)] border-y border-[var(--line)] lg:col-span-7 lg:self-center">
          {POINTS.map(({ key, icon: Icon }, i) => (
            <Reveal as="li" key={key} delay={i * 0.06} y={12} className="flex gap-5 py-7">
              <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-[#e9faff] text-[#0a85b6]">
                <Icon weight="fill" className="size-[22px]" />
              </span>
              <div>
                <h3 className="text-[1.2rem] font-bold leading-snug tracking-[-0.01em] text-[var(--fg)]">
                  {t(`points.${key}.title`)}
                </h3>
                <p className="mt-1.5 max-w-[56ch] text-pretty leading-[1.6] text-[var(--fg-body)]">
                  {t(`points.${key}.body`)}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
