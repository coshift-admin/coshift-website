"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Magnetic } from "@/components/motion/Magnetic";
import { ShiftGlyph } from "@/components/icons/ShiftGlyph";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => <HeroPoster />,
});

function HeroPoster() {
  // Static SVG fallback while the WebGL scene initialises or for low-power devices.
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="relative h-[60vmin] w-[60vmin]">
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,var(--coshift-cyan)_0%,transparent_60%)] opacity-30 blur-3xl" />
        <div className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle_at_70%_70%,var(--coshift-indigo)_0%,transparent_70%)] opacity-50 blur-2xl" />
        <ShiftGlyph className="absolute inset-0 m-auto h-2/3 w-auto text-[var(--coshift-cyan)]/70" />
      </div>
    </div>
  );
}

export function Hero() {
  const t = useTranslations("home.hero");
  const ref = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Headline parallax: drift up & fade as the user scrolls past.
  const headlineY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <section
      ref={ref}
      aria-label="Coshift"
      className="relative isolate flex min-h-[100svh] w-full items-center overflow-hidden"
    >
      {/* WebGL scene */}
      <div className="absolute inset-0">
        <HeroScene />
      </div>

      {/* gradient veil so the text stays legible against the 3D */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,var(--coshift-ink)_0%,color-mix(in_oklab,var(--coshift-ink)_72%,transparent)_42%,transparent_68%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,transparent_0%,var(--coshift-ink)_100%)]"
      />

      <motion.div
        style={{ y: headlineY, opacity: headlineOpacity }}
        className="container-x relative z-10 mx-auto max-w-[1600px] pt-28 md:pt-40"
      >
        <div className="text-mono mb-6 flex items-center gap-3 text-[var(--coshift-bone)]/60">
          <span aria-hidden className="inline-block h-px w-8 bg-[var(--coshift-cyan)]" />
          {t("kicker")}
        </div>

        <h1 className="max-w-[18ch] text-[var(--fs-h1)] font-extrabold leading-[0.95] tracking-[-0.02em] text-[var(--coshift-bone)]">
          <span className="block">{t("headlinePre")}</span>
          <span className="mt-2 block">
            {t("headlinePost")}{" "}
            <span className="font-display text-[var(--coshift-cyan)]">
              {t("headlineWord")}
            </span>
          </span>
        </h1>

        <p className="mt-8 max-w-[52ch] text-[var(--fs-lead)] text-[var(--coshift-bone)]/70">
          {t("subhead")}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Magnetic pull={8}>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 rounded-full bg-[var(--coshift-cyan)] px-6 py-3 text-base font-semibold text-[var(--coshift-ink)] transition-colors hover:bg-[var(--coshift-glow)]"
            >
              {t("ctaPrimary")}
              <span
                aria-hidden
                className="transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </Magnetic>
          <Magnetic pull={6}>
            <Link
              href="/work"
              className="inline-flex items-center gap-3 rounded-full border border-white/20 px-6 py-3 text-base text-[var(--coshift-bone)] transition-colors hover:border-[var(--coshift-cyan)] hover:text-[var(--coshift-cyan)]"
            >
              {t("ctaSecondary")}
            </Link>
          </Magnetic>
        </div>
      </motion.div>

      <motion.div
        style={{ opacity: cueOpacity }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2 text-[var(--coshift-bone)]/60">
          <ShiftGlyph
            className="h-5 w-auto animate-pulse text-[var(--coshift-cyan)]"
            style={{ animationDuration: "3s" }}
          />
          <span className="text-mono">{t("scrollCue")}</span>
        </div>
      </motion.div>
    </section>
  );
}
