"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { CaretDown, List, X } from "@phosphor-icons/react/dist/ssr";
import { LanguageToggle } from "./LanguageToggle";
import { CoshiftWordmark } from "@/components/icons/CoshiftWordmark";
import { SOLUTION_ICONS } from "@/components/icons/solutionIcons";
import { SOLUTION_SLUGS } from "@/lib/solutions";
import { cn } from "@/lib/cn";

/**
 * Navigation is organised by what a business owner needs (Solutions), then
 * proof (Work), how we work (Method) and who we are (About). One action, the
 * free audit, stays visible at all times.
 */
const LINKS = [
  { href: "/work", key: "work" as const },
  { href: "/method", key: "method" as const },
  { href: "/about", key: "about" as const },
];

const isActive = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(href + "/");

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 border-b transition-[background-color,border-color] duration-[var(--dur-ds-slow)]",
        scrolled || mobileOpen
          ? "border-white/10 bg-[color-mix(in_oklab,var(--coshift-ink)_82%,transparent)] backdrop-blur-md"
          : "border-transparent bg-transparent",
      )}
      style={{ zIndex: "var(--z-nav)" }}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded focus:bg-[var(--coshift-cyan)] focus:px-3 focus:py-1.5 focus:text-sm focus:font-semibold focus:text-[#170f3c]"
      >
        {t("skipToContent")}
      </a>

      <div className="container-x mx-auto flex h-20 max-w-[1600px] items-center justify-between gap-6">
        <Link href="/" aria-label={t("home")} className="flex shrink-0 items-center">
          <CoshiftWordmark tone="mono-light" crop className="h-[22px] w-auto md:h-[27px]" />
        </Link>

        <nav aria-label={t("primaryLabel")} className="hidden items-center gap-1 lg:flex">
          <SolutionsMenu pathname={pathname} />
          {LINKS.map(({ href, key }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(pathname, href) ? "page" : undefined}
              className={cn(
                "rounded-lg px-3.5 py-2 text-[0.95rem] font-medium transition-colors duration-[var(--dur-ds-fast)]",
                isActive(pathname, href)
                  ? "text-white"
                  : "text-white/70 hover:bg-white/[0.05] hover:text-white",
              )}
            >
              {t(key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <LanguageToggle className="hidden text-white/70 md:inline-flex" />
          <Link
            href="/contact"
            className="hidden h-11 items-center gap-2 rounded-lg bg-[var(--coshift-cyan)] px-5 text-[0.95rem] font-bold text-[#170f3c] transition-[background-color,transform] duration-[var(--dur-ds-fast)] ease-[var(--ease-ds)] hover:bg-[var(--cyan-500)] active:translate-y-[0.5px] sm:inline-flex"
          >
            {t("primaryCta")}
          </Link>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-lg border border-white/15 text-white lg:hidden"
            aria-label={mobileOpen ? t("menuClose") : t("menuToggle")}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
          </button>
        </div>
      </div>

      {mobileOpen && <MobileNav pathname={pathname} />}
    </header>
  );
}

/* ───────────── Desktop: Solutions dropdown ─────────────
   Opens on hover (with a short close delay so the pointer can travel into the
   panel) and on click; Escape and outside clicks close it. */
function SolutionsMenu({ pathname }: { pathname: string }) {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const active = pathname.startsWith("/solutions");

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const show = () => {
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hide = () => {
    closeTimer.current = window.setTimeout(() => setOpen(false), 140);
  };

  return (
    <div ref={rootRef} className="relative" onPointerEnter={show} onPointerLeave={hide}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        // Pointer: hover already opened it, so a click (or a tap, which also
        // fires pointerenter) must not toggle it shut. Keyboard (detail 0) toggles.
        onClick={(e) => (e.detail === 0 ? setOpen((o) => !o) : show())}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[0.95rem] font-medium transition-colors duration-[var(--dur-ds-fast)]",
          open || active ? "text-white" : "text-white/70 hover:bg-white/[0.05] hover:text-white",
        )}
      >
        {t("solutions")}
        <CaretDown
          weight="bold"
          className={cn(
            "size-3.5 transition-transform duration-[var(--dur-ds-normal)] ease-[var(--ease-ds)]",
            open && "rotate-180",
          )}
        />
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="absolute left-1/2 top-full w-[min(640px,90vw)] -translate-x-1/2 pt-3"
      >
        <div className="overflow-hidden rounded-xl border border-white/10 bg-[var(--coshift-haze)] shadow-[0_24px_56px_-12px_rgba(0,0,0,0.6)]">
          <ul className="grid grid-cols-2 gap-1 p-2">
            {SOLUTION_SLUGS.map((slug, i) => {
              const Icon = SOLUTION_ICONS[slug];
              const href = `/solutions/${slug}`;
              // an odd count leaves the last item (email) on its own row: let it span
              const last = i === SOLUTION_SLUGS.length - 1 && SOLUTION_SLUGS.length % 2 === 1;
              return (
                <li key={slug} className={last ? "col-span-2" : undefined}>
                  <Link
                    href={href}
                    aria-current={pathname === href ? "page" : undefined}
                    className="group flex h-full gap-3 rounded-lg p-3 transition-colors duration-[var(--dur-ds-fast)] hover:bg-white/[0.05]"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[color-mix(in_oklab,var(--coshift-cyan)_14%,transparent)] text-[var(--coshift-cyan)]">
                      <Icon weight="fill" className="size-5" />
                    </span>
                    <span>
                      <span className="block font-semibold text-white">
                        {t(`solutionItems.${slug}.title`)}
                      </span>
                      <span className="mt-0.5 block text-sm leading-snug text-[var(--navy-300)]">
                        {t(`solutionItems.${slug}.desc`)}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link
            href="/contact"
            className="flex items-center justify-between gap-4 border-t border-white/[0.07] bg-white/[0.02] px-5 py-3.5 text-sm transition-colors duration-[var(--dur-ds-fast)] hover:bg-white/[0.05]"
          >
            <span className="text-[var(--navy-100)]">{t("menuHelp")}</span>
            <span className="shrink-0 font-semibold text-[var(--coshift-cyan)]">
              {t("primaryCta")} <span aria-hidden className="arrow-fwd">→</span>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ───────────── Mobile / tablet menu ───────────── */
function MobileNav({ pathname }: { pathname: string }) {
  const t = useTranslations("nav");
  return (
    <nav
      id="mobile-nav"
      aria-label={t("primaryLabel")}
      className="container-x mx-auto max-h-[calc(100svh-5rem)] overflow-y-auto pb-6 lg:hidden"
    >
      <p className="text-mono px-1 pb-2 pt-2 text-[0.66rem] text-[var(--navy-300)]">{t("solutions")}</p>
      <ul className="grid gap-1 sm:grid-cols-2">
        {SOLUTION_SLUGS.map((slug) => {
          const Icon = SOLUTION_ICONS[slug];
          return (
            <li key={slug}>
              <Link
                href={`/solutions/${slug}`}
                className="flex items-center gap-3 rounded-lg p-2.5 hover:bg-white/[0.05]"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[color-mix(in_oklab,var(--coshift-cyan)_14%,transparent)] text-[var(--coshift-cyan)]">
                  <Icon weight="fill" className="size-[18px]" />
                </span>
                <span className="font-semibold text-white">{t(`solutionItems.${slug}.title`)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <ul className="mt-3 border-t border-white/10 pt-3">
        {LINKS.map(({ href, key }) => (
          <li key={href}>
            <Link
              href={href}
              aria-current={isActive(pathname, href) ? "page" : undefined}
              className="block rounded-lg px-2.5 py-3 text-base font-medium text-white/90 hover:bg-white/[0.05]"
            >
              {t(key)}
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href="/contact"
        className="mt-3 flex h-12 items-center justify-center rounded-lg bg-[var(--coshift-cyan)] font-bold text-[#170f3c]"
      >
        {t("primaryCta")} <span aria-hidden className="arrow-fwd">→</span>
      </Link>
      <div className="mt-3 flex items-center border-t border-white/10 pt-3">
        <LanguageToggle className="text-white/70" />
      </div>
    </nav>
  );
}
