"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/Reveal";

// <!-- TODO: replace with real client logos -->
// Placeholder client names rendered as a simple wordmark each. The visual
// uniformity matters more than logo fidelity at this stage.
const CLIENTS = [
  "Atlas Textiles",
  "Neon Coastal Bank",
  "Maghreb Logistics",
  "Hadar Foods",
  "Sahara Cement",
  "Sirocco Studio",
  "Karim & Fils",
  "Berkane Mining",
  "Riviera Hotels",
  "Vivo Tools",
];

export function TrustStrip() {
  const t = useTranslations("home.trust");

  return (
    <section
      aria-label="Trusted by"
      className="group/marquee border-y border-white/10 bg-[color-mix(in_oklab,var(--coshift-ink)_92%,white)] py-10"
    >
      <Reveal>
        <div className="text-mono container-x mx-auto mb-6 max-w-[1600px] text-[var(--coshift-bone)]/50">
          {t("kicker")}
        </div>
      </Reveal>
      <div className="relative overflow-hidden">
        {/* fade-out edges so logos appear/disappear instead of cutting */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-[linear-gradient(90deg,var(--coshift-ink),transparent)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-[linear-gradient(270deg,var(--coshift-ink),transparent)]"
        />
        <div className="marquee-track group-hover/marquee:[animation-play-state:paused]">
          {[...CLIENTS, ...CLIENTS].map((c, i) => (
            <span
              key={`${c}-${i}`}
              className="shrink-0 cursor-default whitespace-nowrap text-[clamp(1.5rem,3vw,2.5rem)] font-semibold tracking-[-0.02em] text-[var(--coshift-bone)]/40 transition-all duration-300 hover:scale-[1.04] hover:text-[var(--coshift-cyan)]"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
