import { ArrowRight, CheckCircle, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/routing";
import { caseStudies, tr } from "@/content/work";
import { CaseVisual } from "@/components/work/CaseVisual";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerList } from "@/components/motion/StaggerList";
import { Accordion } from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/cn";
import { SolutionIcon } from "./SolutionIcon";

/**
 * Section building blocks for the solution and method pages. Every block uses
 * the surface roles (--fg, --line, --card…), so it reads correctly on a dark
 * band or inside `.surface-light`; the page decides the rhythm.
 */

/** `tag`: optional proof marker, e.g. "Déjà livré" when a client already has it. */
type IconItem = { icon: string; title: string; body: string; tag?: string };
type Step = { title: string; body: string };
type FaqItem = { q: string; a: string };

const SECTION = "container-x mx-auto max-w-[1320px] section-y";

/* ───────────── "Vous vous reconnaissez ?" ───────────── */
export function PainsSection({
  eyebrow,
  title,
  pains,
}: {
  eyebrow: string;
  title: string;
  pains: string[];
}) {
  return (
    <section className="surface-light">
      <div className={cn(SECTION, "grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16")}>
        <SectionHeader eyebrow={eyebrow} title={title} className="lg:col-span-5" />
        <StaggerList as="div" className="lg:col-span-7" staggerChildren={0.08}>
          {pains.map((pain) => (
            <div
              key={pain}
              className="flex gap-4 border-b border-[var(--line)] py-5 first:border-t md:py-6"
            >
              <WarningCircle
                weight="fill"
                aria-hidden
                className="mt-1 h-5 w-5 shrink-0 text-[var(--fg-muted)]"
              />
              <p className="text-[clamp(1.0625rem,1.5vw,1.3125rem)] font-medium leading-[1.4] text-[var(--fg)]">
                {pain}
              </p>
            </div>
          ))}
        </StaggerList>
      </div>
    </section>
  );
}

/* ───────────── Icon card grid (deliverables, after-launch…) ───────────── */
export function IconCardGrid({ items }: { items: IconItem[] }) {
  return (
    <StaggerList
      as="div"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      staggerChildren={0.06}
    >
      {items.map((item) => (
        <article
          key={item.title}
          className="rounded-xl border border-[var(--line)] bg-[var(--card)] p-6 shadow-[0_1px_2px_rgba(13,8,38,0.06),0_1px_3px_rgba(13,8,38,0.08)]"
        >
          <div className="flex items-start justify-between gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-[color-mix(in_oklab,var(--coshift-cyan)_14%,transparent)] text-[var(--eyebrow)]">
              <SolutionIcon name={item.icon} className="h-[22px] w-[22px]" />
            </span>
            {item.tag && (
              // status green, darkened for small text on the light surface (tags live there)
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[color-mix(in_oklab,var(--status-live)_12%,transparent)] px-2.5 py-1 text-xs font-semibold text-[color-mix(in_oklab,var(--status-live)_78%,black)]">
                <span aria-hidden className="size-1.5 rounded-full bg-[var(--status-live)]" />
                {item.tag}
              </span>
            )}
          </div>
          <h3 className="mt-5 text-lg font-bold leading-snug tracking-[-0.01em] text-[var(--fg)]">
            {item.title}
          </h3>
          <p className="mt-2 text-[0.975rem] leading-[1.6] text-[var(--fg-body)]">{item.body}</p>
        </article>
      ))}
    </StaggerList>
  );
}

export function DeliverablesSection({
  eyebrow,
  title,
  intro,
  items,
  modules,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  items: IconItem[];
  /** ERP only: the module chips + the Odoo/ERPNext note. */
  modules?: { label: string; items: string[]; note: string };
  /** Dark band instead of the light surface (used on the method page). */
  dark?: boolean;
}) {
  return (
    <section className={dark ? "bg-[var(--coshift-ink)]" : "surface-light border-t border-[var(--line)]"}>
      <div className={SECTION}>
        <SectionHeader eyebrow={eyebrow} title={title} intro={intro} className="mb-12 md:mb-16" />
        <IconCardGrid items={items} />
        {modules && (
          <Reveal className="mt-14">
            <p className="text-mono mb-4 text-[var(--eyebrow)]">{modules.label}</p>
            <ul className="flex flex-wrap gap-2">
              {modules.items.map((m) => (
                <li
                  key={m}
                  className="rounded-lg border border-[var(--line)] bg-[var(--card)] px-3.5 py-2 text-[0.95rem] font-medium text-[var(--fg)]"
                >
                  {m}
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-[70ch] text-[0.975rem] leading-[1.6] text-[var(--fg-muted)]">
              {modules.note}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}

/* ───────────── Web: "Inclus dans chaque site" ───────────── */
export function IncludedSection({
  eyebrow,
  title,
  intro,
  items,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  items: IconItem[];
}) {
  return (
    <section className="bg-[var(--coshift-ink)]">
      <div className={SECTION}>
        <SectionHeader eyebrow={eyebrow} title={title} intro={intro} className="mb-12 md:mb-16" />
        <StaggerList
          as="div"
          className="grid grid-cols-1 gap-x-10 sm:grid-cols-2 lg:grid-cols-3"
          staggerChildren={0.06}
        >
          {items.map((item) => (
            <div key={item.title} className="flex gap-4 border-t border-[var(--line)] py-6">
              <SolutionIcon
                name={item.icon}
                className="mt-0.5 h-6 w-6 shrink-0 text-[var(--coshift-cyan)]"
              />
              <div>
                <h3 className="text-[1.0625rem] font-bold text-[var(--fg)]">{item.title}</h3>
                <p className="mt-1.5 text-[0.95rem] leading-[1.6] text-[var(--fg-body)]">
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </StaggerList>
      </div>
    </section>
  );
}

/* ───────────── Apps: "Le problème → Ce qu'on a construit" ───────────── */
export function ExamplesSection({
  eyebrow,
  title,
  intro,
  problemLabel,
  builtLabel,
  items,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  problemLabel: string;
  builtLabel: string;
  items: { client: string; problem: string; built: string }[];
}) {
  return (
    <section className="bg-[var(--coshift-ink)]">
      <div className={SECTION}>
        <SectionHeader eyebrow={eyebrow} title={title} intro={intro} className="mb-12 md:mb-16" />
        <StaggerList
          as="div"
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
          staggerChildren={0.06}
        >
          {items.map((item) => (
            <article
              key={item.client}
              className="flex flex-col rounded-xl border border-[var(--line)] bg-[var(--card)] p-6"
            >
              <p className="text-[1.0625rem] font-bold text-[var(--fg)]">{item.client}</p>
              <p className="text-mono mt-5 text-[var(--fg-muted)]">{problemLabel}</p>
              <p className="mt-1.5 text-[0.95rem] leading-[1.6] text-[var(--fg-body)]">
                {item.problem}
              </p>
              <ArrowRight
                weight="bold"
                aria-hidden
                className="my-4 h-4 w-4 rotate-90 text-[var(--coshift-cyan)]"
              />
              <p className="text-mono text-[var(--eyebrow)]">{builtLabel}</p>
              <p className="mt-1.5 text-[0.975rem] font-medium leading-[1.55] text-[var(--fg)]">
                {item.built}
              </p>
            </article>
          ))}
        </StaggerList>
      </div>
    </section>
  );
}

/* ───────────── Email: the offer card ───────────── */
export function EmailOfferSection({
  eyebrow,
  title,
  figure,
  figureLabel,
  listTitle,
  items,
  pricingNote,
}: {
  eyebrow: string;
  title: string;
  figure: string;
  figureLabel: string;
  listTitle: string;
  items: string[];
  pricingNote: string;
}) {
  return (
    <section className="bg-[var(--coshift-ink)]">
      <div className={SECTION}>
        <SectionHeader eyebrow={eyebrow} title={title} className="mb-12 md:mb-16" />
        <Reveal>
          <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--card)] md:grid-cols-2">
            <div className="flex flex-col justify-center gap-4 border-b border-[var(--line)] p-8 md:border-b-0 md:border-r md:p-12">
              <p className="tabular text-[clamp(3.5rem,8vw,6rem)] font-extrabold leading-none tracking-[-0.03em] text-[var(--coshift-cyan)]">
                {figure}
              </p>
              <p className="max-w-[32ch] text-[length:var(--fs-lead)] leading-[1.45] text-[var(--fg)]">
                {figureLabel}
              </p>
            </div>
            <div className="p-8 md:p-12">
              <p className="text-mono text-[var(--eyebrow)]">{listTitle}</p>
              <ul className="mt-5 space-y-4">
                {items.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle
                      weight="fill"
                      aria-hidden
                      className="mt-0.5 h-5 w-5 shrink-0 text-[var(--coshift-cyan)]"
                    />
                    <span className="text-[1.0625rem] leading-[1.5] text-[var(--fg)]">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 border-t border-[var(--line)] pt-5 text-[0.9rem] text-[var(--fg-muted)]">
                {pricingNote}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────── Proof: related case studies (or a fact) ───────────── */
export function ProofSection({
  eyebrow,
  title,
  locale,
  caseSlugs,
  linkLabel,
  allLabel,
  fact,
}: {
  eyebrow: string;
  title: string;
  locale: string;
  caseSlugs: string[];
  linkLabel: string;
  allLabel: string;
  /** Shown instead of case cards when a solution has no case study yet. */
  fact?: { figure: string; label: string };
}) {
  const cases = caseSlugs
    .map((slug) => caseStudies.find((c) => c.slug === slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <section className="border-t border-[var(--line)] bg-[var(--coshift-ink)]">
      <div className={SECTION}>
        <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
          <SectionHeader eyebrow={eyebrow} title={title} />
          <Reveal className="shrink-0">
            <ButtonLink href="/work" variant="secondary" arrow>
              {allLabel}
            </ButtonLink>
          </Reveal>
        </div>

        {cases.length > 0 ? (
          <StaggerList
            as="div"
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            staggerChildren={0.1}
          >
            {cases.map((c) => (
              <Link
                key={c.slug}
                href={`/work/${c.slug}`}
                className="group flex flex-col rounded-xl border border-[var(--line)] bg-[var(--card)] p-3 transition-[border-color,transform] duration-[var(--dur-ds-normal)] ease-[var(--ease-ds)] hover:-translate-y-px hover:border-[var(--line-strong)]"
              >
                <div className="relative aspect-video overflow-hidden rounded-lg">
                  <CaseVisual c={c} alt={c.client} sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw" />
                </div>
                <div className="flex grow flex-col px-3 pb-3 pt-5">
                  <p className="text-mono text-[var(--eyebrow)]">{c.client}</p>
                  <h3 className="mt-2 text-[1.1875rem] font-bold leading-[1.3] tracking-[-0.01em] text-[var(--fg)]">
                    {tr(c.title, locale)}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-[0.95rem] leading-[1.6] text-[var(--fg-body)]">
                    {tr(c.summary, locale)}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[0.95rem] font-semibold text-[var(--coshift-cyan)]">
                    {linkLabel}
                    <ArrowRight
                      weight="bold"
                      aria-hidden
                      className="arrow-fwd h-4 w-4"
                    />
                  </span>
                </div>
              </Link>
            ))}
          </StaggerList>
        ) : (
          fact && (
            <Reveal>
              <div className="flex flex-col gap-4 border-t border-[var(--line)] pt-10 md:flex-row md:items-end md:gap-10">
                <p className="tabular text-[clamp(4.5rem,11vw,8.5rem)] font-extrabold leading-[0.85] tracking-[-0.04em] text-[var(--coshift-cyan)]">
                  {fact.figure}
                </p>
                <p className="max-w-[30ch] pb-2 text-[length:var(--fs-lead)] leading-[1.45] text-[var(--fg)]">
                  {fact.label}
                </p>
              </div>
            </Reveal>
          )
        )}
      </div>
    </section>
  );
}

/* ───────────── Steps (a real sequence → numbered) ───────────── */
export function StepsSection({
  eyebrow,
  title,
  intro,
  steps,
  link,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  steps: Step[];
  link?: { label: string; href: string };
}) {
  return (
    <section className="surface-light">
      <div className={SECTION}>
        <SectionHeader eyebrow={eyebrow} title={title} intro={intro} className="mb-12 md:mb-16" />
        <StaggerList as="div" className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6" staggerChildren={0.1}>
          {steps.map((step, i) => (
            <div key={step.title} className="relative border-t-2 border-[var(--line)] pt-6">
              <span
                aria-hidden
                className="absolute -top-[2px] start-0 h-[2px] w-12 bg-[var(--coshift-cyan)]"
              />
              <p className="text-mono tabular text-[var(--eyebrow)]">0{i + 1}</p>
              <h3 className="mt-3 text-[1.3125rem] font-bold leading-snug tracking-[-0.01em] text-[var(--fg)]">
                {step.title}
              </h3>
              <p className="mt-2.5 max-w-[42ch] text-[1rem] leading-[1.6] text-[var(--fg-body)]">
                {step.body}
              </p>
            </div>
          ))}
        </StaggerList>
        {link && (
          <Reveal className="mt-12">
            <Link
              href={link.href}
              className="group inline-flex items-center gap-2 text-base font-semibold text-[var(--eyebrow)] underline-offset-4 hover:underline"
            >
              {link.label}
              <ArrowRight
                weight="bold"
                aria-hidden
                className="arrow-fwd h-4 w-4"
              />
            </Link>
          </Reveal>
        )}
      </div>
    </section>
  );
}

/* ───────────── FAQ ───────────── */
export function FaqSection({
  eyebrow,
  title,
  items,
}: {
  eyebrow: string;
  title: string;
  items: FaqItem[];
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <section className="surface-light border-t border-[var(--line)]">
      <div className={cn(SECTION, "grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16")}>
        <SectionHeader eyebrow={eyebrow} title={title} className="lg:col-span-4" />
        <div className="lg:col-span-8">
          <Accordion items={items} />
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
