"use client";

import { usePathname, useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { useTransition } from "react";
import { cn } from "@/lib/cn";

export function LanguageToggle({ className }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const other = locale === "fr" ? "en" : "fr";

  const onClick = () => {
    startTransition(() => {
      router.replace(pathname, { locale: other });
    });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isPending}
      className={cn(
        "text-mono inline-flex items-center gap-1.5 px-2 py-1.5 transition-colors",
        "hover:text-[var(--coshift-cyan)] disabled:opacity-50",
        className,
      )}
      aria-label={`Switch language to ${other.toUpperCase()}`}
    >
      <span className="opacity-70">{locale.toUpperCase()}</span>
      <span aria-hidden>/</span>
      <span>{other.toUpperCase()}</span>
    </button>
  );
}
