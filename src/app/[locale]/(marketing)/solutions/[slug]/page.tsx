import type { Metadata } from "next";
import { languageAlternates } from "@/lib/locale";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { site } from "@/lib/site";
import {
  SOLUTION_CASES,
  SOLUTION_SLUGS,
  isSolutionSlug,
  type SolutionSlug,
} from "@/lib/solutions";
import { DemoProvisioner } from "@/components/sections/DemoProvisioner";
import { SolutionArt } from "@/components/sections/SolutionArt";
import { CtaBand } from "@/components/ui/CtaBand";
import { PageHero } from "@/components/ui/PageHero";
import { HeroActions } from "@/components/solutions/HeroActions";
import {
  DeliverablesSection,
  EmailOfferSection,
  ExamplesSection,
  FaqSection,
  IncludedSection,
  PainsSection,
  ProofSection,
  StepsSection,
} from "@/components/solutions/Sections";

type Params = { locale: string; slug: string };
type IconItem = { icon: string; title: string; body: string; tag?: string };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    SOLUTION_SLUGS.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isSolutionSlug(slug)) return {};
  const t = await getTranslations({ locale, namespace: `solutionPages.${slug}.meta` });
  const base = site.url.replace(/\/$/, "");
  const path = `/solutions/${slug}`;
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `${base}/${locale}${path}`,
      languages: languageAlternates(path),
    },
  };
}

export default async function SolutionPage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  if (!isSolutionSlug(slug)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "solutionPages" });
  const common = (key: string) => t(`common.${key}`);
  const page = (key: string) => t(`${slug}.${key}`);

  const primary = { label: common("ctaPrimary"), href: "/contact" };
  const secondary = { label: common("ctaSecondary"), href: "/work" };

  return (
    <>
      <PageHero
        eyebrow={page("name")}
        title={page("title")}
        intro={page("sub")}
        hand={page("hand")}
        aside={<HeroArt slug={slug} />}
      >
        <HeroActions
          aside={slug === "email" ? <StartHereBadge text={page("badge")} /> : undefined}
          primary={primary}
          secondary={secondary}
          note={common("note")}
        />
      </PageHero>

      <PainsSection
        eyebrow={common("painsEyebrow")}
        title={common("painsTitle")}
        pains={t.raw(`${slug}.pains`) as string[]}
      />

      <DeliverablesSection
        eyebrow={common("deliverablesEyebrow")}
        title={common("deliverablesTitle")}
        items={t.raw(`${slug}.deliverables`) as IconItem[]}
        modules={
          slug === "erp"
            ? (t.raw("erp.modules") as { label: string; items: string[]; note: string })
            : undefined
        }
      />

      <SpecificBlock slug={slug} t={t} />

      <ProofSection
        eyebrow={common("proofEyebrow")}
        title={common("proofTitle")}
        locale={locale}
        caseSlugs={SOLUTION_CASES[slug]}
        linkLabel={common("proofLink")}
        allLabel={common("allWork")}
        fact={
          slug === "email"
            ? (t.raw("email.proofFact") as { figure: string; label: string })
            : undefined
        }
      />

      <StepsSection
        eyebrow={common("stepsEyebrow")}
        title={common("stepsTitle")}
        steps={t.raw("common.steps") as { title: string; body: string }[]}
        link={{ label: common("methodLink"), href: "/method" }}
      />

      <FaqSection
        eyebrow={common("faqEyebrow")}
        title={common("faqTitle")}
        items={t.raw(`${slug}.faq`) as { q: string; a: string }[]}
      />

      <CtaBand
        title={page("ctaTitle")}
        body={page("ctaBody")}
        primary={primary}
        secondary={secondary}
        note={common("note")}
      />
    </>
  );
}

/** The solution's line drawing, played once at the top of its page. */
function HeroArt({ slug }: { slug: SolutionSlug }) {
  return (
    <div className="mx-auto w-full max-w-[560px] rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-[var(--cyan-300)] [--art-muted:rgb(255_255_255/0.22)] sm:p-6">
      <div className="aspect-[2/1]">
        <SolutionArt variant={slug} autoplay delay={0.7} />
      </div>
    </div>
  );
}

/** Email is the easiest way in — a coral "start here" badge says so. */
function StartHereBadge({ text }: { text: string }) {
  return (
    <p className="inline-flex items-center rounded-full border border-[color-mix(in_oklab,var(--warm)_45%,transparent)] bg-[color-mix(in_oklab,var(--warm)_12%,transparent)] px-3.5 py-1.5 text-[0.85rem] font-semibold text-[var(--warm-300)]">
      {text}
    </p>
  );
}

/** The one block that differs per solution. */
function SpecificBlock({
  slug,
  t,
}: {
  slug: SolutionSlug;
  t: Awaited<ReturnType<typeof getTranslations>>;
}) {
  switch (slug) {
    case "erp":
      // Tier-1 proof: "log in to a working demo, not a slide deck".
      return (
        <div className="border-t border-[var(--line)] bg-[var(--coshift-ink)]">
          <DemoProvisioner />
        </div>
      );
    case "web":
      return (
        <IncludedSection
          eyebrow={t("web.included.eyebrow")}
          title={t("web.included.title")}
          intro={t("web.included.intro")}
          items={t.raw("web.included.items") as IconItem[]}
        />
      );
    case "automation":
      // the owner's first worry about automation and AI: "who's in charge?"
      return (
        <IncludedSection
          eyebrow={t("automation.control.eyebrow")}
          title={t("automation.control.title")}
          intro={t("automation.control.intro")}
          items={t.raw("automation.control.items") as IconItem[]}
        />
      );
    case "apps":
      return (
        <ExamplesSection
          eyebrow={t("apps.examples.eyebrow")}
          title={t("apps.examples.title")}
          intro={t("apps.examples.intro")}
          problemLabel={t("apps.examples.problemLabel")}
          builtLabel={t("apps.examples.builtLabel")}
          items={
            t.raw("apps.examples.items") as { client: string; problem: string; built: string }[]
          }
        />
      );
    case "email":
      return (
        <EmailOfferSection
          eyebrow={t("email.offer.eyebrow")}
          title={t("email.offer.title")}
          figure={t("email.offer.figure")}
          figureLabel={t("email.offer.figureLabel")}
          listTitle={t("email.offer.listTitle")}
          items={t.raw("email.offer.items") as string[]}
          pricingNote={t("email.offer.pricingNote")}
        />
      );
  }
}
