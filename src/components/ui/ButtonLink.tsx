import type { ReactNode } from "react";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/cn";

/**
 * The site's two button styles (DS: 8px radius, darken on hover, settle 0.5px
 * on press, no bounce). Colours come from the surface roles in globals.css, so
 * the same button works on dark bands and `.surface-light` sections.
 *
 * Internal paths go through the locale-aware Link; anything else (#anchor,
 * mailto:, tel:, https://wa.me/…) renders a plain <a>.
 */
type Variant = "primary" | "secondary";

const BASE =
  "group inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-6 text-base transition-[background-color,border-color,transform] duration-[var(--dur-ds-fast)] ease-[var(--ease-ds)] active:translate-y-[0.5px]";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-[var(--coshift-cyan)] font-bold text-[#170f3c] shadow-[0_12px_32px_-14px_rgba(51,197,243,0.75)] hover:bg-[var(--cyan-500)]",
  secondary:
    "border border-[var(--line-strong)] bg-[var(--card)] font-semibold text-[var(--fg)] hover:border-[var(--fg-muted)] hover:bg-[var(--card-hover)]",
};

export function ButtonLink({
  href,
  variant = "primary",
  arrow = false,
  className,
  children,
}: {
  href: string;
  variant?: Variant;
  /** Trailing → that nudges on hover — for forward actions only. */
  arrow?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const content = (
    <>
      {children}
      {arrow && (
        <span aria-hidden className="arrow-fwd">
          →
        </span>
      )}
    </>
  );
  const classes = cn(BASE, VARIANTS[variant], className);

  if (href.startsWith("/")) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      className={classes}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {content}
    </a>
  );
}
