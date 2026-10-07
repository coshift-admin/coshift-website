import { Reveal, RevealWords } from "@/components/motion/Reveal";
import { ButtonLink } from "./ButtonLink";
import { HandNote } from "./HandNote";

/**
 * Closing call-to-action band (DS "dark navy band" + shift pattern). Shared by
 * the home page, solution pages and the method page so every page ends on the
 * same next step.
 */
export function CtaBand({
  title,
  body,
  primary,
  secondary,
  note,
  hand,
}: {
  title: string;
  body?: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  /** Small reassurance line under the buttons, e.g. "30 min · no commitment". */
  note?: string;
  /** Short handwritten aside pointing up at the primary button (≤ 6 words). */
  hand?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden border-t border-[var(--line)] bg-[var(--coshift-haze)]">
      <div
        aria-hidden
        className="pattern-shift pointer-events-none absolute inset-0 [mask-image:radial-gradient(70%_80%_at_50%_100%,black,transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_70%_at_50%_120%,color-mix(in_oklab,var(--coshift-cyan)_16%,transparent),transparent_70%)]"
      />
      <div className="container-x relative mx-auto max-w-[1320px] py-[clamp(4.5rem,10vw,8rem)] text-center">
        <h2 className="mx-auto max-w-[20ch] text-balance text-[length:var(--fs-h2)] font-extrabold leading-[1.05] tracking-[-0.025em] text-white">
          <RevealWords text={title} />
        </h2>
        {body && (
          <Reveal delay={0.15}>
            <p className="mx-auto mt-5 max-w-[56ch] text-pretty text-[length:var(--fs-lead)] text-[var(--navy-100)]/90">
              {body}
            </p>
          </Reveal>
        )}
        <Reveal delay={0.25}>
          <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <ButtonLink href={primary.href} arrow>
              {primary.label}
            </ButtonLink>
            {secondary && (
              <ButtonLink href={secondary.href} variant="secondary">
                {secondary.label}
              </ButtonLink>
            )}
          </div>
          {hand && (
            <HandNote arrow="up-start" delay={0.3} className="mt-3">
              {hand}
            </HandNote>
          )}
          {note && <p className="text-mono mt-5 text-[var(--navy-300)]">{note}</p>}
        </Reveal>
      </div>
    </section>
  );
}
