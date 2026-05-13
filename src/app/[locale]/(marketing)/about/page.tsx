import { getTranslations, setRequestLocale } from "next-intl/server";
import { ShiftGlyph } from "@/components/icons/ShiftGlyph";
import { Reveal, RevealWords } from "@/components/motion/Reveal";
import { StaggerList } from "@/components/motion/StaggerList";

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

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  const principles = ["ownership", "craft", "fluency"] as const;

  return (
    <div className="container-x mx-auto max-w-[1600px] pt-32 md:pt-44">
      <header className="border-b border-white/10 pb-20 md:pb-28">
        <Reveal>
          <div className="text-mono mb-6 flex items-center gap-3 text-[var(--coshift-bone)]/60">
            <span aria-hidden className="h-px w-8 bg-[var(--coshift-cyan)]" />
            {t("kicker")}
          </div>
        </Reveal>
        <h1 className="max-w-[20ch] text-[length:var(--fs-h1)] font-extrabold leading-[0.95] tracking-[-0.02em]">
          <RevealWords text={t("heading")} />
        </h1>
        <Reveal delay={0.2}>
          <p className="mt-8 max-w-[60ch] text-[length:var(--fs-lead)] text-[var(--coshift-bone)]/70">
            {t("intro")}
          </p>
        </Reveal>
      </header>

      <section className="grid grid-cols-1 gap-12 py-20 md:grid-cols-12 md:gap-x-16 md:py-32">
        <h2 className="text-[length:var(--fs-h2)] font-bold leading-[1] tracking-[-0.02em] md:col-span-4">
          <RevealWords text={t("principles.heading")} />
        </h2>
        <div className="md:col-span-8">
          <StaggerList className="space-y-12 md:space-y-16" staggerChildren={0.12}>
            {principles.map((key, i) => (
              <li
                key={key}
                className="grid grid-cols-[auto_1fr] items-start gap-6 border-t border-white/10 pt-8 md:gap-8"
              >
                <div className="text-mono pt-1 text-[var(--coshift-cyan)]">
                  0{i + 1}
                </div>
                <div>
                  <h3 className="text-[length:var(--fs-h3)] font-semibold leading-[1.15] tracking-[-0.01em]">
                    {t(`principles.items.${key}.title`)}
                  </h3>
                  <p className="mt-3 max-w-[56ch] text-base text-[var(--coshift-bone)]/70">
                    {t(`principles.items.${key}.body`)}
                  </p>
                </div>
              </li>
            ))}
          </StaggerList>
        </div>
      </section>

      <section className="grid grid-cols-1 items-end gap-10 border-t border-white/10 py-20 md:grid-cols-12 md:py-32">
        <Reveal className="md:col-span-4">
          <ShiftGlyph className="h-20 w-auto text-[var(--coshift-cyan)]" />
        </Reveal>
        <div className="md:col-span-8">
          <h2 className="text-[length:var(--fs-h2)] font-bold leading-[1] tracking-[-0.02em]">
            <RevealWords text={t("location.heading")} />
          </h2>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-[56ch] text-[length:var(--fs-lead)] text-[var(--coshift-bone)]/70">
              {t("location.body")}
            </p>
          </Reveal>
          {/* <EditMe> — team photos placeholder: brief says skip until photos provided.
              Replace with a small editorial portrait grid when the user supplies images. */}
        </div>
      </section>
    </div>
  );
}
