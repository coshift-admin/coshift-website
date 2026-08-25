"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Cleared clients only — every entry is ticked ✅ in the brand brief §4.1.
 * Never add a name that isn't cleared, and never a prospect from §4.2.
 *
 * `logo` points to a file in /public/logos. Logos are rendered as uniform
 * white silhouettes (brightness(0) invert(1)) so the strip reads as one system
 * regardless of each source logo's colours. Clients without a usable
 * transparent asset fall back to a styled wordmark — visually consistent.
 * TODO: add an OSCAR PRO logo (currently text) when supplied.
 */
type Client = { name: string; logo?: string; w?: number; h?: number };

const CLIENTS: Client[] = [
  { name: "Audiovisual Zone", logo: "/logos/avz.svg" },
  { name: "Renoh", logo: "/logos/renoh.png" },
  { name: "OSCAR PRO" },
  { name: "FastPlast", logo: "/logos/fastplast.webp" },
  { name: "Formex", logo: "/logos/formex.svg" },
  { name: "Savoir", logo: "/logos/savoir.png" },
  { name: "Broderie Royale", logo: "/logos/broderie-royale.png" },
  { name: "Kompen", logo: "/logos/kompen.png" },
  { name: "ISTA", logo: "/logos/ista.png" },
  { name: "Moustex", logo: "/logos/moustex.svg" },
  { name: "3JoyGames", logo: "/logos/3joygames.png" },
];

export function TrustStrip() {
  const t = useTranslations("home.trust");

  return (
    <section
      aria-label="Trusted by"
      className="group/marquee border-y border-white/10 bg-[color-mix(in_oklab,var(--coshift-ink)_92%,white)] py-10"
    >
      <Reveal>
        <div className="text-mono container-x mx-auto mb-8 max-w-[1600px] text-[var(--coshift-bone)]/50">
          {t("kicker")}
        </div>
      </Reveal>
      <div className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-[linear-gradient(90deg,var(--coshift-ink),transparent)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-[linear-gradient(270deg,var(--coshift-ink),transparent)]"
        />
        <ul className="marquee-track list-none items-center group-hover/marquee:[animation-play-state:paused]">
          {[...CLIENTS, ...CLIENTS].map((c, i) => (
            <li key={`${c.name}-${i}`} className="flex shrink-0 items-center">
              <ClientLogo client={c} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ClientLogo({ client }: { client: Client }) {
  if (client.logo) {
    // Plain <img>: next/image blocks SVG sources and we intentionally apply CSS
    // filters to these tiny decorative marquee logos.
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={client.logo}
        alt={client.name}
        loading="lazy"
        decoding="async"
        className="h-7 w-auto max-w-[180px] object-contain opacity-55 transition-all duration-500 ease-[var(--ease-out-expo)] [filter:brightness(0)_invert(1)] hover:scale-[1.04] hover:opacity-100 md:h-9"
      />
    );
  }
  // Wordmark fallback — same tone/behaviour as the silhouettes.
  return (
    <span className="cursor-default whitespace-nowrap text-[clamp(1.25rem,2.4vw,2rem)] font-semibold tracking-[-0.02em] text-[var(--coshift-bone)]/50 transition-all duration-500 ease-[var(--ease-out-expo)] hover:scale-[1.04] hover:text-[var(--coshift-bone)]">
      {client.name}
    </span>
  );
}
