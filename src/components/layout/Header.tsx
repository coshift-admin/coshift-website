"use client";

import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Magnetic } from "@/components/motion/Magnetic";
import { LanguageToggle } from "./LanguageToggle";
import { CoshiftWordmark } from "@/components/icons/CoshiftWordmark";
import { cn } from "@/lib/cn";
import { Menu, X } from "lucide-react";

const NAV = [
  { href: "/work", key: "work" as const },
  { href: "/services/odoo", key: "servicesOdoo" as const },
  { href: "/services/web", key: "servicesWeb" as const },
  { href: "/about", key: "about" as const },
  { href: "/lab", key: "lab" as const },
];

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 transition-[background,backdrop-filter,border-color] duration-300",
        "border-b",
        scrolled
          ? "bg-[color-mix(in_oklab,var(--coshift-ink)_72%,transparent)] backdrop-blur-md border-white/10"
          : "bg-transparent border-transparent",
      )}
      style={{ zIndex: "var(--z-nav)" }}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded focus:bg-[var(--coshift-cyan)] focus:px-3 focus:py-1.5 focus:text-[var(--coshift-ink)] focus:text-sm focus:font-semibold"
      >
        {t("skipToContent")}
      </a>

      <div className="container-x mx-auto flex h-20 max-w-[1600px] items-center justify-between md:h-24">
        <Link
          href="/"
          aria-label="Coshift home"
          className="flex items-center"
        >
          <Magnetic pull={6}>
            <CoshiftWordmark
              tone="mono-light"
              className="h-8 w-auto md:h-10"
            />
          </Magnetic>
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-2 md:flex"
        >
          {NAV.map(({ href, key }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "group relative px-4 py-2.5 text-base transition-colors",
                  active
                    ? "text-[var(--coshift-bone)]"
                    : "text-[var(--coshift-bone)]/70 hover:text-[var(--coshift-bone)]",
                )}
              >
                <Magnetic pull={4}>
                  <span className="relative">
                    {t(key)}
                    <span
                      className={cn(
                        "absolute -bottom-1 left-0 right-0 h-px origin-left scale-x-0 bg-[var(--coshift-cyan)] transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:scale-x-100",
                        active && "scale-x-100",
                      )}
                    />
                  </span>
                </Magnetic>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 md:gap-5">
          <LanguageToggle className="hidden text-sm md:inline-flex" />
          <Magnetic pull={6} className="hidden md:inline-block">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--coshift-cyan)] px-5 py-2.5 text-base font-semibold text-[var(--coshift-ink)] transition-[transform,background] duration-300 hover:bg-[var(--coshift-glow)]"
            >
              {t("primaryCta")}
              <span aria-hidden>→</span>
            </Link>
          </Magnetic>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-[var(--coshift-bone)] md:hidden"
            aria-label={open ? t("menuClose") : t("menuToggle")}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden">
          <nav
            aria-label="Primary mobile"
            className="container-x mx-auto flex flex-col gap-1 pb-6 pt-2"
          >
            {NAV.map(({ href, key }) => (
              <Link
                key={href}
                href={href}
                className="rounded-md px-2 py-3 text-base text-[var(--coshift-bone)]/90 hover:bg-white/5"
              >
                {t(key)}
              </Link>
            ))}
            <Link
              href="/contact"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--coshift-cyan)] px-4 py-3 text-sm font-semibold text-[var(--coshift-ink)]"
            >
              {t("primaryCta")} →
            </Link>
            <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-3">
              <LanguageToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
