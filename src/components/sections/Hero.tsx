"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ShiftBoard } from "./ShiftBoard";
import { ClientLogos } from "./ClientLogos";
import { HandNote } from "@/components/ui/HandNote";
import { HandMark } from "@/components/ui/HandMark";

/**
 * Home hero — "We power your next shift."
 *
 * Left: who it's for, the slogan, what we do in plain words, one clear next
 * step. Right: the ShiftBoard, which shows what "your next shift" means —
 * scattered tools → one connected system — and lets the visitor flip it.
 * Foot: client logos as immediate proof.
 *
 * Entrance is CSS (first paint, not hydration), offset by --intro-delay while
 * the first-visit preloader is up. Loops pause while the hero is off-screen.
 */

const WORD_STAGGER = 70;
const T_HEADLINE = 120;

const delay = (ms: number): CSSProperties => ({
  animationDelay: `calc(var(--intro-delay) + ${ms}ms)`,
});

function HeroWords({ text, start }: { text: string; start: number }) {
  return text.split(" ").map((word, i) => (
    <span key={i}>
      {i > 0 && " "}
      <span className="hero-word">
        <span style={delay(start + i * WORD_STAGGER)}>{word}</span>
      </span>
    </span>
  ));
}

export function Hero() {
  const t = useTranslations("home.hero");
  const sectionRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const lead = t("headlineLead");
  const leadWords = lead.split(" ").length;

  return (
    <section
      ref={sectionRef}
      aria-label={t("ariaLabel")}
      data-hero-paused={!inView}
      className="relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden bg-[var(--coshift-ink)]"
    >
      {/* Backdrop: the one gradient the DS allows + the "shift" line pattern. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_72%_10%,color-mix(in_oklab,var(--coshift-cyan)_15%,transparent),transparent_70%)]" />
        <div className="pattern-shift absolute inset-0 [mask-image:radial-gradient(80%_80%_at_65%_35%,black_15%,transparent_80%)]" />
      </div>

      <div className="container-x relative z-10 mx-auto grid w-full max-w-[1320px] flex-1 items-center gap-10 pb-10 pt-[max(6.5rem,13svh)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:gap-14">
        <div>
          <p
            className="hero-fade text-mono flex items-center gap-3 text-[0.72rem] text-[var(--cyan-300)]"
            style={delay(0)}
          >
            <span aria-hidden className="h-px w-8 shrink-0 bg-current opacity-60" />
            {t("audience")}
          </p>

          <h1 className="mt-5 text-[length:clamp(2.6rem,min(5.4vw,10.5svh),5.5rem)] font-extrabold leading-[1.02] tracking-[-0.03em] text-white">
            <HeroWords text={lead} start={T_HEADLINE} />{" "}
            {/* the brand word gets the coral pen once the headline has landed */}
            <HandMark delay={1.3} afterIntro>
              <span className="text-[var(--coshift-cyan)]">
                <HeroWords text={t("headlineAccent")} start={T_HEADLINE + leadWords * WORD_STAGGER} />
              </span>
            </HandMark>
          </h1>

          <p
            className="hero-fade mt-6 max-w-[46ch] text-pretty text-[length:var(--fs-lead)] leading-[1.55] text-[var(--navy-100)]/90"
            style={delay(450)}
          >
            {t("subhead")}
          </p>

          <div
            className="hero-fade mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center"
            style={delay(600)}
          >
            <ButtonLink href="/contact" arrow>
              {t("ctaPrimary")}
            </ButtonLink>
            <ButtonLink href="/work" variant="secondary">
              {t("ctaSecondary")}
            </ButtonLink>
          </div>

          <p className="hero-fade text-mono mt-5 text-[0.66rem] text-[var(--navy-300)]" style={delay(750)}>
            {t("note")}
          </p>
        </div>

        <div className="hero-fade relative pt-12" style={delay(350)}>
          {/* handwritten hint: the board is interactive — point at the switch */}
          <HandNote arrow="down-end" delay={1.4} className="absolute end-[92px] top-0 z-10">
            {t("board.hint")}
          </HandNote>
          <ShiftBoard />
        </div>
      </div>

      <div className="hero-fade relative z-10 border-t border-white/[0.07]" style={delay(900)}>
        <ClientLogos label={t("trustLabel")} />
      </div>
    </section>
  );
}
