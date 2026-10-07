import Image from "next/image";
import { CaseCover } from "@/components/work/CaseCover";
import { ScrollPan } from "@/components/work/ScrollPan";
import { hostOf, type CaseStudy } from "@/content/work";
import { cn } from "@/lib/cn";

/**
 * The visual for a case study. Live websites show their real screenshot in a
 * slim browser frame (with the site's address, so it reads as "a website we
 * built"); ERP / integration work without a public front keeps the procedural
 * cover. The parent decides the size; this fills it.
 */
export function CaseVisual({
  c,
  alt,
  sizes,
  priority = false,
  className,
}: {
  c: CaseStudy;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  if (!c.image) {
    return (
      <div className={cn("relative h-full w-full overflow-hidden", className)}>
        <CaseCover hue={c.cover.hue} tone={c.cover.tone} />
      </div>
    );
  }

  return (
    <div className={cn("flex h-full w-full flex-col overflow-hidden bg-[#0b0820]", className)}>
      <div
        aria-hidden
        className="flex h-7 shrink-0 items-center gap-1.5 border-b border-white/10 bg-white/[0.04] px-3"
        dir="ltr"
      >
        <span className="size-2 rounded-full bg-white/20" />
        <span className="size-2 rounded-full bg-white/20" />
        <span className="size-2 rounded-full bg-white/20" />
        {c.url && (
          <span className="mx-auto truncate rounded bg-white/[0.06] px-2.5 py-0.5 text-[0.65rem] text-white/60">
            {hostOf(c.url)}
          </span>
        )}
      </div>
      <div className="relative min-h-0 flex-1">
        <ScrollPan>
        <Image
          src={c.image}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover object-top transition-transform duration-700 ease-[var(--ease-ds-out)] group-hover:scale-[1.03]"
        />
        </ScrollPan>
      </div>
    </div>
  );
}
