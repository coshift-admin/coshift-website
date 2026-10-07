/**
 * Client logo marquee — immediate proof at the foot of the hero.
 *
 * Cleared clients only: every entry is ticked ✅ in the brand brief §4.1.
 * Never add a name that isn't cleared, and never a prospect from §4.2.
 *
 * `logo` points to /public/logos. Logos render as uniform white silhouettes
 * (brightness(0) invert(1)) so the strip reads as one system whatever each
 * source's colours; clients without a usable transparent asset fall back to a
 * styled wordmark. OSCAR PRO is deliberately absent (founder's request,
 * 2026-10-07) — do not re-add it.
 * The marquee pauses while the hero is off-screen (globals.css).
 */
type Client = { name: string; logo?: string };

const CLIENTS: Client[] = [
  { name: "Audiovisual Zone", logo: "/logos/avz.svg" },
  { name: "Renoh", logo: "/logos/renoh.png" },
  { name: "FastPlast", logo: "/logos/fastplast.webp" },
  { name: "Formex", logo: "/logos/formex.svg" },
  { name: "Savoir", logo: "/logos/savoir.png" },
  { name: "Broderie Royale", logo: "/logos/broderie-royale.png" },
  { name: "Kompen", logo: "/logos/kompen.png" },
  { name: "ISTA", logo: "/logos/ista.png" },
  { name: "Moustex", logo: "/logos/moustex.svg" },
  { name: "3JoyGames", logo: "/logos/3joygames.png" },
  { name: "Profit Zone", logo: "/logos/profit-zone.png" },
];

export function ClientLogos({ label }: { label: string }) {
  return (
    <div className="container-x group/marquee mx-auto flex max-w-[1600px] flex-col gap-3 py-5 md:flex-row md:items-center md:gap-8">
      <p className="text-mono shrink-0 text-[0.66rem] text-[var(--navy-300)]">{label}</p>
      {/* Logos aren't text: keep the marquee LTR in every locale so the loop stays seamless. */}
      <div dir="ltr" className="relative min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
        <ul className="marquee-track list-none items-center group-hover/marquee:[animation-play-state:paused]">
          {[...CLIENTS, ...CLIENTS].map((c, i) => (
            <li
              key={`${c.name}-${i}`}
              className="flex shrink-0 items-center"
              aria-hidden={i >= CLIENTS.length || undefined}
            >
              <ClientLogo client={c} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ClientLogo({ client }: { client: Client }) {
  if (client.logo) {
    // Plain <img>: next/image blocks SVG sources and these tiny decorative
    // logos get a CSS filter anyway.
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={client.logo}
        alt={client.name}
        loading="lazy"
        decoding="async"
        className="h-6 w-auto max-w-[140px] object-contain opacity-50 transition-opacity duration-[var(--dur-ds-normal)] [filter:brightness(0)_invert(1)] hover:opacity-100 md:h-7"
      />
    );
  }
  return (
    <span className="cursor-default whitespace-nowrap text-lg font-bold tracking-[-0.02em] text-white/50 transition-opacity duration-[var(--dur-ds-normal)] hover:text-white">
      {client.name}
    </span>
  );
}
