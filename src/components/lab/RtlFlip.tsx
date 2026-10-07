"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { LayoutGroup, MotionConfig, motion, useInView } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, CaretRight, Check, Heart, LockSimple, Truck } from "@phosphor-icons/react/dist/ssr";
import { useReducedMotionPref } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";

/**
 * Lab 06 — "Un écran, trois langues". A small shop product page in a browser
 * frame. Switch FR · EN · عربي and the page turns over: the frame's `dir`
 * flips, and every block (breadcrumb, photo, badges, price, stepper, button,
 * checkout steps) glides to its mirrored place with framer `layout`, arrows
 * turn round, text fades in. The browser chrome stays put — only the page
 * flips, like a real RTL site.
 *
 * Inside the frame, direction comes from the frame's own `dir`: logical
 * classes (start/end, ms/ps, text-start) follow it, and arrows flip from the
 * demo language — never `rtl:` variants or `.arrow-fwd`, which would read the
 * page's <html dir> instead. Reduced motion: the switch is instant.
 */

type Lang = "fr" | "en" | "ar";
const LANGS: Lang[] = ["fr", "en", "ar"];

/*
 * The demo's content is its subject — the same page shown in all three
 * languages on every locale of the site — so it lives here, not in messages.
 * The control's labels are endonyms (each language in its own script).
 * Everything is fictional: no real shop, product or delivery promise.
 */
const DEMO: Record<
  Lang,
  {
    label: string;
    number: string;
    crumbs: [string, string, string];
    stock: string;
    name: string;
    line: string;
    add: string;
    added: string;
    delivery: string;
    steps: [string, string, string];
  }
> = {
  fr: {
    label: "FR",
    number: "fr-DZ",
    crumbs: ["Accueil", "Maison", "Lampes"],
    stock: "En stock",
    name: "Lampe Atlas",
    line: "Lampe de table en laiton, lumière chaude.",
    add: "Ajouter au panier",
    added: "Ajouté",
    delivery: "Livraison dans toute l'Algérie",
    steps: ["Panier", "Livraison", "Paiement"],
  },
  en: {
    label: "EN",
    number: "en-DZ",
    crumbs: ["Home", "Living", "Lamps"],
    stock: "In stock",
    name: "Atlas lamp",
    line: "Brass table lamp, warm light.",
    add: "Add to cart",
    added: "Added",
    delivery: "Delivery anywhere in Algeria",
    steps: ["Cart", "Delivery", "Payment"],
  },
  ar: {
    label: "عربي",
    number: "ar-DZ",
    crumbs: ["الرئيسية", "المنزل", "المصابيح"],
    stock: "متوفّر",
    name: "مصباح أطلس",
    line: "مصباح طاولة من النحاس، بضوء دافئ.",
    add: "أضف إلى السلة",
    added: "تمت الإضافة",
    delivery: "التوصيل إلى كل أنحاء الجزائر",
    steps: ["السلة", "التوصيل", "الدفع"],
  },
};

const PRICE = 4900;
const EASE: [number, number, number, number] = [0.2, 0, 0, 1];

const isLang = (v: string): v is Lang => (LANGS as string[]).includes(v);

export function RtlFlip() {
  const t = useTranslations("lab.items.rtl");
  const pageLocale = useLocale();
  const home: Lang = isLang(pageLocale) ? pageLocale : "fr";
  const [lang, setLang] = useState<Lang>(home);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [touched, setTouched] = useState(false);
  const reduced = useReducedMotionPref();
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  // Autoplay once: flip to Arabic (or away from it), through the third
  // language, then come home to the page's own locale.
  useEffect(() => {
    if (!inView || reduced || touched) return;
    const seq: Lang[] = home === "ar" ? ["fr", "en", "ar"] : ["ar", home === "fr" ? "en" : "fr", home];
    const timers = seq.map((l, i) => window.setTimeout(() => setLang(l), 900 + i * 1600));
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [inView, reduced, touched, home]);

  useEffect(() => {
    if (!added) return;
    const id = window.setTimeout(() => setAdded(false), 1400);
    return () => window.clearTimeout(id);
  }, [added]);

  const choose = (l: Lang) => {
    setTouched(true);
    setLang(l);
  };

  const d = DEMO[lang];
  const rtl = lang === "ar";
  const price = new Intl.NumberFormat(d.number, {
    style: "currency",
    currency: "DZD",
    // both set: older engines throw if only the max drops below DZD's default 2
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(PRICE * qty);

  return (
    <MotionConfig transition={{ duration: reduced ? 0 : 0.75, ease: EASE }}>
      <div
        ref={ref}
        className="relative flex min-h-[600px] w-full flex-col items-center justify-center gap-5 px-4 py-8 sm:min-h-[clamp(480px,46vw,580px)]"
      >
        <div
          aria-hidden
          className="pattern-shift pointer-events-none absolute inset-0 [mask-image:radial-gradient(60%_70%_at_50%_45%,black,transparent)]"
        />

        {/* the switch */}
        <div className="relative flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <div
            role="group"
            aria-label={t("switchLabel")}
            className="flex rounded-xl border border-white/10 bg-white/[0.04] p-1"
          >
            {LANGS.map((l) => (
              <button
                key={l}
                type="button"
                lang={l}
                aria-pressed={lang === l}
                onClick={() => choose(l)}
                className={cn(
                  "relative rounded-lg px-4 py-1.5 text-sm font-semibold leading-6 transition-colors duration-[var(--dur-ds-fast)]",
                  lang === l ? "text-[#170f3c]" : "text-white/70 hover:text-white",
                )}
              >
                {lang === l && (
                  <motion.span
                    layoutId="rtlflip-pill"
                    aria-hidden
                    className="absolute inset-0 rounded-lg bg-[var(--coshift-cyan)]"
                  />
                )}
                <span className="relative">{DEMO[l].label}</span>
              </button>
            ))}
          </div>
          <motion.p
            aria-hidden
            initial={false}
            animate={{ opacity: touched ? 0 : 1 }}
            className="font-hand text-[1.35rem] leading-none text-[var(--warm-300)]"
          >
            {t("hint")}
          </motion.p>
        </div>

        {/* the frame */}
        <LayoutGroup>
          <div
            role="group"
            aria-label={t("frameLabel")}
            className="relative w-full max-w-[760px] overflow-hidden rounded-2xl border border-white/10 bg-[var(--coshift-bone)] leading-[1.5] text-[#170f3c] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)]"
          >
            {/* browser chrome: never flips */}
            <div dir="ltr" className="flex items-center gap-3 border-b border-[#170f3c]/10 bg-white/70 px-4 py-2.5">
              <span aria-hidden className="flex gap-1.5">
                <span className="size-2.5 rounded-full bg-[#170f3c]/15" />
                <span className="size-2.5 rounded-full bg-[#170f3c]/15" />
                <span className="size-2.5 rounded-full bg-[#170f3c]/15" />
              </span>
              <span
                aria-hidden
                className="mx-auto flex h-6 w-[min(60%,260px)] items-center gap-2 rounded-full bg-[#170f3c]/[0.06] px-3"
              >
                <LockSimple weight="fill" className="size-3 text-[#170f3c]/40" />
                <span className="h-1.5 flex-1 rounded-full bg-[#170f3c]/15" />
              </span>
            </div>

            {/* the page: flips with the language */}
            {/* explicit leading: Arabic's taller default would make the frame jump */}
            <div dir={rtl ? "rtl" : "ltr"} lang={lang} className="p-4 leading-[1.55] sm:p-6">
              <motion.ol layout="position" className="flex items-center gap-1.5 text-xs text-[#170f3c]/60">
                {d.crumbs.map((c, i) => (
                  <motion.li key={i} layout="position" className="flex items-center gap-1.5">
                    {i > 0 && <Flip rtl={rtl} icon={<CaretRight weight="bold" className="size-3" />} />}
                    <Fade k={lang} className={i === 2 ? "font-semibold text-[#170f3c]" : undefined}>
                      {c}
                    </Fade>
                  </motion.li>
                ))}
              </motion.ol>

              <div className="mt-4 grid gap-4 sm:grid-cols-[0.95fr_1.05fr] sm:gap-6">
                <motion.div
                  layout="position"
                  className="relative h-[115px] overflow-hidden rounded-xl bg-[linear-gradient(160deg,#fff1e6_0%,#ffd6c8_55%,#ffb9aa_100%)] sm:h-auto sm:min-h-[210px]"
                >
                  <Lamp />
                  <motion.span
                    layout="position"
                    className="absolute start-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-bold text-[#17734a]"
                  >
                    <span aria-hidden className="size-1.5 rounded-full bg-[#1f9d63]" />
                    <Fade k={lang}>{d.stock}</Fade>
                  </motion.span>
                  <motion.span
                    layout="position"
                    aria-hidden
                    className="absolute end-3 top-3 grid size-8 place-items-center rounded-full bg-white/85"
                  >
                    <Heart weight="fill" className="size-4 text-[var(--warm)]" />
                  </motion.span>
                </motion.div>

                <div className="flex flex-col">
                  <motion.p layout="position" className="text-lg font-extrabold sm:text-xl">
                    <Fade k={lang}>{d.name}</Fade>
                  </motion.p>
                  <motion.p layout="position" className="mt-1 text-sm text-[#170f3c]/70 max-sm:hidden">
                    <Fade k={lang}>{d.line}</Fade>
                  </motion.p>
                  <motion.p
                    layout="position"
                    className="mt-3 text-xl font-extrabold [font-variant-numeric:tabular-nums]"
                  >
                    <Fade k={`${lang}-${qty}`}>{price}</Fade>
                  </motion.p>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <motion.div
                      layout="position"
                      className="flex items-center rounded-lg border border-[#170f3c]/15 bg-white"
                    >
                      <button
                        type="button"
                        aria-label={t("decrease")}
                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                        className="grid size-9 place-items-center text-lg font-bold text-[#170f3c]/70 hover:text-[#170f3c]"
                      >
                        −
                      </button>
                      <span className="w-7 text-center text-sm font-bold [font-variant-numeric:tabular-nums]">{qty}</span>
                      <button
                        type="button"
                        aria-label={t("increase")}
                        onClick={() => setQty((q) => Math.min(9, q + 1))}
                        className="grid size-9 place-items-center text-lg font-bold text-[#170f3c]/70 hover:text-[#170f3c]"
                      >
                        +
                      </button>
                    </motion.div>
                    <motion.button
                      layout="position"
                      type="button"
                      onClick={() => setAdded(true)}
                      className="inline-flex items-center gap-2 rounded-lg bg-[var(--coshift-cyan)] px-4 py-2.5 text-sm font-bold text-[#170f3c]"
                    >
                      <Fade k={`${lang}-${added}`}>{added ? d.added : d.add}</Fade>
                      {added ? (
                        <Check weight="bold" aria-hidden className="size-4" />
                      ) : (
                        <Flip rtl={rtl} icon={<ArrowRight weight="bold" className="size-4" />} />
                      )}
                    </motion.button>
                  </div>

                  <motion.p layout="position" className="mt-4 flex items-center gap-2 text-xs text-[#170f3c]/70">
                    <Truck weight="fill" aria-hidden className="size-4 shrink-0 text-[#0a85b6]" />
                    <Fade k={lang}>{d.delivery}</Fade>
                  </motion.p>
                </div>
              </div>

              {/* checkout steps */}
              <ol className="mt-5 flex items-center gap-2 border-t border-[#170f3c]/10 pt-4">
                {d.steps.map((s, i) => (
                  <motion.li
                    key={i}
                    layout="position"
                    className="flex flex-1 items-center gap-2 text-xs font-semibold"
                  >
                    <span
                      className={cn(
                        "grid size-6 shrink-0 place-items-center rounded-full text-[11px]",
                        i === 0 ? "bg-[#170f3c] text-white" : "bg-[#170f3c]/10 text-[#170f3c]/60",
                      )}
                    >
                      {i + 1}
                    </span>
                    <Fade k={lang} className={i === 0 ? undefined : "text-[#170f3c]/60"}>
                      {s}
                    </Fade>
                    {i < 2 && <span aria-hidden className="h-px min-w-3 flex-1 bg-[#170f3c]/15" />}
                  </motion.li>
                ))}
              </ol>
            </div>
          </div>
        </LayoutGroup>

        <p className="sr-only" aria-live="polite">
          {d.label}
        </p>
      </div>
    </MotionConfig>
  );
}

/** Text that fades in whenever its key (the language) changes. */
function Fade({ k, className, children }: { k: string; className?: string; children: ReactNode }) {
  const reduced = useReducedMotionPref();
  return (
    <motion.span
      key={k}
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduced ? 0 : 0.35, delay: reduced ? 0 : 0.25 }}
      className={cn("inline-block", className)}
    >
      {children}
    </motion.span>
  );
}

/** An arrow that turns round with the demo's direction (not the page's). */
function Flip({ rtl, icon }: { rtl: boolean; icon: ReactNode }) {
  return (
    <motion.span aria-hidden initial={false} animate={{ scaleX: rtl ? -1 : 1 }} className="inline-flex">
      {icon}
    </motion.span>
  );
}

/** The product "photo": a brass lamp from plain shapes, glowing. Never mirrored. */
function Lamp() {
  return (
    <div aria-hidden className="absolute inset-0">
      <div className="absolute left-1/2 top-[34%] size-[150px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,247,222,0.95),rgba(255,247,222,0)_65%)]" />
      <div className="absolute left-1/2 top-[20%] h-[27%] w-[34%] max-w-[120px] -translate-x-1/2 bg-[linear-gradient(180deg,#d6a54c,#9a6f24)] [clip-path:polygon(22%_0,78%_0,100%_100%,0_100%)]" />
      <div className="absolute left-1/2 top-[47%] h-[31%] w-[3px] -translate-x-1/2 bg-[#9a6f24]" />
      <div className="absolute bottom-[14%] left-1/2 h-[6%] w-[26%] max-w-[90px] -translate-x-1/2 rounded-full bg-[#9a6f24]" />
      <div className="absolute bottom-[11%] left-1/2 h-[3%] w-[40%] max-w-[140px] -translate-x-1/2 rounded-full bg-[#170f3c]/10 blur-[2px]" />
    </div>
  );
}
