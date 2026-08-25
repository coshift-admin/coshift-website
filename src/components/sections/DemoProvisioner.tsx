"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotionPref } from "@/hooks/useReducedMotion";
import { ShiftGlyph } from "@/components/icons/ShiftGlyph";
import { Reveal, RevealWords } from "@/components/motion/Reveal";

/**
 * Dramatises the brand brief's Tier-1 proof (§5.3): "log in to a working demo,
 * not a slide deck." Clicking streams a fake provisioning sequence and lands a
 * mock subdomain in ~2s. It is clearly labelled as an illustration — the real
 * capability is genuine, but this widget is not a live instance (hard rules §11:
 * no overclaiming, no real infra detail).
 */
type Phase = "idle" | "running" | "done";

const SUFFIX = "abcdefghjkmnpqrstuvwxyz23456789";

export function DemoProvisioner() {
  const t = useTranslations("home.demo");
  const reduced = useReducedMotionPref();
  const steps = t.raw("steps") as string[];

  const [phase, setPhase] = useState<Phase>("idle");
  const [shown, setShown] = useState(0);
  const [sub, setSub] = useState("demo-•••••");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const run = useCallback(() => {
    if (phase === "running") return;
    timers.current.forEach(clearTimeout);
    timers.current = [];

    let id = "";
    for (let i = 0; i < 5; i++)
      id += SUFFIX[Math.floor(Math.random() * SUFFIX.length)];
    setSub(`demo-${id}`);

    if (reduced) {
      setShown(steps.length);
      setPhase("done");
      return;
    }

    setPhase("running");
    setShown(0);
    steps.forEach((_, i) => {
      timers.current.push(
        setTimeout(() => {
          setShown(i + 1);
          if (i === steps.length - 1) setPhase("done");
        }, 380 * (i + 1)),
      );
    });
  }, [phase, reduced, steps]);

  return (
    <section
      aria-label="Instant demo"
      className="container-x mx-auto max-w-[1600px] section-y"
    >
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <Reveal>
            <div className="text-mono mb-4 flex items-center gap-3 text-[var(--coshift-bone)]/60">
              <span aria-hidden className="h-px w-8 bg-[var(--coshift-cyan)]" />
              {t("kicker")}
            </div>
            <h2 className="max-w-[16ch] text-[length:var(--fs-h2)] font-bold leading-[1] tracking-[-0.02em]">
              <RevealWords text={t("heading")} />
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-[46ch] text-[length:var(--fs-lead)] text-[var(--coshift-bone)]/70">
              {t("body")}
            </p>
          </Reveal>
        </div>

        {/* Terminal */}
        <div className="overflow-hidden rounded-2xl border border-white/12 bg-[color-mix(in_oklab,var(--coshift-ink)_80%,black)] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.8)]">
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-white/15" />
            <span className="h-3 w-3 rounded-full bg-white/15" />
            <span className="h-3 w-3 rounded-full bg-white/15" />
            <span className="text-mono ml-3 text-[var(--coshift-bone)]/40">
              coshift · instant-demo
            </span>
          </div>

          <div className="text-mono min-h-[220px] px-5 py-5 text-[0.82rem] leading-relaxed">
            <div className="text-[var(--coshift-bone)]/40">
              $ {t("command")}
            </div>
            <ul className="mt-2 space-y-1">
              {steps.map((step, i) => (
                <li
                  key={step}
                  className={
                    "flex items-start gap-2 transition-opacity duration-200 " +
                    (i < shown ? "opacity-100" : "opacity-0")
                  }
                >
                  <span className="text-[var(--coshift-cyan)]">
                    {i === steps.length - 1 && phase === "done" ? "✓" : "›"}
                  </span>
                  <span className="text-[var(--coshift-bone)]/75">{step}</span>
                </li>
              ))}
            </ul>

            <AnimatePresence>
              {phase === "done" && (
                <motion.div
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex flex-wrap items-center gap-3 border-t border-white/10 pt-4"
                >
                  <ShiftGlyph className="h-4 w-auto text-[var(--coshift-cyan)]" />
                  <span className="text-[var(--coshift-bone)]">
                    {sub}
                    <span className="text-[var(--coshift-bone)]/40">
                      .coshift.agency
                    </span>
                  </span>
                  <span className="rounded-full bg-[var(--coshift-cyan)]/15 px-2 py-0.5 text-[var(--coshift-cyan)]">
                    HTTPS
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-wrap items-center gap-4 border-t border-white/10 px-5 py-4">
            <button
              type="button"
              onClick={run}
              disabled={phase === "running"}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--coshift-cyan)] px-5 py-2.5 text-sm font-semibold text-[var(--coshift-ink)] transition-colors hover:bg-[var(--coshift-glow)] disabled:opacity-60"
            >
              {phase === "running"
                ? t("running")
                : phase === "done"
                  ? t("again")
                  : t("cta")}
            </button>
            {phase === "done" && (
              <Link
                href="/contact"
                className="text-mono text-[var(--coshift-cyan)] underline-offset-4 hover:underline"
              >
                {t("realCta")} →
              </Link>
            )}
            <span className="text-mono ml-auto text-[var(--coshift-bone)]/35">
              {t("note")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
