"use client";

import { useTranslations } from "next-intl";

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
      className="border-y border-white/10 bg-[color-mix(in_oklab,var(--coshift-ink)_92%,white)] py-10"
    >
      <div className="text-mono container-x mx-auto mb-6 max-w-[1600px] text-[var(--coshift-bone)]/50">
        {t("kicker")}
      </div>
      <div className="relative overflow-hidden">
        <div className="marquee-track">
          {[...CLIENTS, ...CLIENTS].map((c, i) => (
            <span
              key={`${c}-${i}`}
              className="shrink-0 whitespace-nowrap text-[clamp(1.5rem,3vw,2.5rem)] font-semibold tracking-[-0.02em] text-[var(--coshift-bone)]/40"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
