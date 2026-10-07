import type { ReactNode } from "react";
import { Reveal, RevealWords } from "@/components/motion/Reveal";
import { HandNote } from "./HandNote";
import { cn } from "@/lib/cn";

/**
 * Opening band for inner pages: dark DS surface, the one permitted cyan wash,
 * the "shift" line pattern, then eyebrow → H1 (word reveal) → intro → actions.
 * Keeps About, Contact, Work, Method and the solution pages visually related
 * to the home hero.
 *
 * - `hand`: a short handwritten aside under the title (HandNote, pointing up).
 * - `aside`: a visual for the right column on large screens (e.g. the
 *   solution's line drawing); stacks under the text on smaller ones.
 */
export function PageHero({
  eyebrow,
  title,
  intro,
  hand,
  aside,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  hand?: string;
  aside?: ReactNode;
  /** Actions or a reassurance line under the intro. */
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-[var(--coshift-ink)] pb-[clamp(3.5rem,8vw,6.5rem)] pt-[max(8rem,16svh)]">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(55%_70%_at_80%_0%,color-mix(in_oklab,var(--coshift-cyan)_14%,transparent),transparent_70%)]" />
        <div className="pattern-shift absolute inset-0 [mask-image:radial-gradient(70%_90%_at_80%_10%,black_10%,transparent_75%)]" />
      </div>
      <div
        className={cn(
          "container-x relative mx-auto max-w-[1320px]",
          aside && "grid items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16",
        )}
      >
        <div>
          <Reveal>
            <p className="text-mono flex items-center gap-3 text-[var(--cyan-300)]">
              <span aria-hidden className="h-px w-8 bg-current opacity-60" />
              {eyebrow}
            </p>
          </Reveal>
          <h1
            className={cn(
              "mt-5 text-balance font-extrabold tracking-[-0.03em] text-white",
              aside
                ? "max-w-[18ch] text-[length:clamp(2.4rem,4.6vw,4.25rem)]"
                : "max-w-[22ch] text-[length:clamp(2.5rem,6vw,5.25rem)]",
              // after the size: tailwind-merge drops a leading that precedes a font size
              "leading-[1.03]",
            )}
          >
            <RevealWords text={title} />
          </h1>
          {hand && (
            <HandNote arrow="up-start" delay={0.6} className="ms-[10%] mt-2">
              {hand}
            </HandNote>
          )}
          {intro && (
            <Reveal delay={0.15}>
              <p className="mt-6 max-w-[60ch] text-pretty text-[length:var(--fs-lead)] leading-[1.55] text-[var(--navy-100)]/90">
                {intro}
              </p>
            </Reveal>
          )}
          {children && (
            <Reveal delay={0.25}>
              <div className="mt-9">{children}</div>
            </Reveal>
          )}
        </div>
        {aside}
      </div>
    </section>
  );
}
