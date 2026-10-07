import type { ReactNode } from "react";
import { Reveal, RevealWords } from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";

/**
 * Eyebrow + title + optional intro, used at the top of every section so they
 * read as one system. The title uses the word-by-word mask reveal from the
 * manifesto. Colours follow the surface roles (works on dark and light).
 */
export function SectionHeader({
  eyebrow,
  title,
  intro,
  align = "left",
  as: Heading = "h2",
  id,
  size = "lg",
  className,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  as?: "h1" | "h2";
  /** Heading id, for a section's aria-labelledby. */
  id?: string;
  /** `md` for sentence-length titles. */
  size?: "lg" | "md";
  className?: string;
  /** Extra content under the intro (e.g. a link). */
  children?: ReactNode;
}) {
  const centered = align === "center";
  return (
    <header className={cn(centered && "mx-auto text-center", "max-w-[52rem]", className)}>
      {eyebrow && (
        <Reveal>
          <p
            className={cn(
              "text-mono mb-4 flex items-center gap-3 text-[var(--eyebrow)]",
              centered && "justify-center",
            )}
          >
            <span aria-hidden className="h-px w-8 bg-current opacity-60" />
            {eyebrow}
          </p>
        </Reveal>
      )}
      <Heading
        id={id}
        className={cn(
          "text-balance font-extrabold tracking-[-0.025em] text-[var(--fg)]",
          size === "lg"
            ? "text-[length:var(--fs-h2)] leading-[1.05]"
            : "text-[clamp(1.6rem,3vw,2.5rem)] leading-[1.15]",
        )}
      >
        <RevealWords text={title} />
      </Heading>
      {intro && (
        <Reveal delay={0.15}>
          <p
            className={cn(
              "mt-5 max-w-[60ch] text-pretty text-[length:var(--fs-lead)] leading-[1.55] text-[var(--fg-body)]",
              centered && "mx-auto",
            )}
          >
            {intro}
          </p>
        </Reveal>
      )}
      {children}
    </header>
  );
}
