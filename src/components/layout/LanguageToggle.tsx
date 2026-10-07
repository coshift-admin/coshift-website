"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";
import { routing, usePathname, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/cn";

/** Each language is named in its own language and script. */
const LABELS: Record<string, { short: string; name: string }> = {
  fr: { short: "FR", name: "Français" },
  en: { short: "EN", name: "English" },
  ar: { short: "عربي", name: "العربية" },
};

export function LanguageToggle({ className }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const go = (next: string) => {
    if (next === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: next as (typeof routing.locales)[number] });
    });
  };

  return (
    <div
      role="group"
      aria-label="Language / Langue / اللغة"
      dir="ltr"
      className={cn("inline-flex items-center gap-0.5 text-sm", isPending && "opacity-60", className)}
    >
      {routing.locales.map((l) => {
        const active = l === locale;
        return (
          <button
            key={l}
            type="button"
            lang={l}
            onClick={() => go(l)}
            disabled={isPending}
            aria-current={active ? "true" : undefined}
            aria-label={LABELS[l].name}
            className={cn(
              "rounded-md px-2 py-1.5 font-semibold transition-colors duration-[var(--dur-ds-fast)]",
              l === "ar" ? "text-[0.85rem]" : "text-mono text-[0.72rem]",
              active ? "bg-white/10 text-white" : "text-white/55 hover:text-white",
            )}
          >
            {LABELS[l].short}
          </button>
        );
      })}
    </div>
  );
}
