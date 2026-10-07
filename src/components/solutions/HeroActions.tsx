import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";

/**
 * What goes under the intro in the shared `ui/PageHero` on solution and method
 * pages: an optional aside (coral badge or Caveat note), the two actions and
 * the reassurance line.
 */
export function HeroActions({
  aside,
  primary,
  secondary,
  note,
}: {
  aside?: ReactNode;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  note?: string;
}) {
  return (
    <>
      {aside && <div className="mb-8">{aside}</div>}
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <ButtonLink href={primary.href} arrow>
          {primary.label}
        </ButtonLink>
        {secondary && (
          <ButtonLink href={secondary.href} variant="secondary">
            {secondary.label}
          </ButtonLink>
        )}
      </div>
      {note && <p className="text-mono mt-5 text-[var(--navy-300)]">{note}</p>}
    </>
  );
}
