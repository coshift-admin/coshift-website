"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { useReducedMotionPref } from "@/hooks/useReducedMotion";
import { ShiftGlyph } from "@/components/icons/ShiftGlyph";
import { useRef, useState } from "react";

export function Services() {
  const t = useTranslations("home.services");

  return (
    <section
      aria-label="Services"
      className="container-x mx-auto max-w-[1600px] section-y"
    >
      <header className="mb-12 flex items-end justify-between gap-6 md:mb-20">
        <div>
          <div className="text-mono mb-4 flex items-center gap-3 text-[var(--coshift-bone)]/60">
            <span aria-hidden className="h-px w-8 bg-[var(--coshift-cyan)]" />
            {t("kicker")}
          </div>
          <h2 className="max-w-[20ch] text-[var(--fs-h2)] font-bold leading-[1] tracking-[-0.02em]">
            {t("heading")}
          </h2>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ServiceCard
          tag={t("odoo.tag")}
          title={t("odoo.title")}
          body={t("odoo.body")}
          cta={t("odoo.cta")}
          href="/services/odoo"
          variant="odoo"
        />
        <ServiceCard
          tag={t("web.tag")}
          title={t("web.title")}
          body={t("web.body")}
          cta={t("web.cta")}
          href="/services/web"
          variant="web"
        />
      </div>
    </section>
  );
}

function ServiceCard({
  tag,
  title,
  body,
  cta,
  href,
  variant,
}: {
  tag: string;
  title: string;
  body: string;
  cta: string;
  href: "/services/odoo" | "/services/web";
  variant: "odoo" | "web";
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [hover, setHover] = useState(false);
  const reduced = useReducedMotionPref();

  return (
    <motion.div
      ref={ref}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[var(--coshift-haze)] p-8 md:p-12"
      whileHover={reduced ? undefined : { y: -4 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* ambient corner motif */}
      <div className="pointer-events-none absolute right-6 top-6 opacity-50 transition-opacity duration-500 group-hover:opacity-100">
        {variant === "odoo" ? (
          <NetworkMotif hover={hover} />
        ) : (
          <WireframeMotif hover={hover} />
        )}
      </div>

      <div className="text-mono text-[var(--coshift-cyan)]">{tag}</div>

      <h3 className="mt-6 max-w-[18ch] text-[var(--fs-h3)] font-semibold leading-[1.1] tracking-[-0.01em]">
        {title}
      </h3>

      <p className="mt-5 max-w-[44ch] text-base text-[var(--coshift-bone)]/70">
        {body}
      </p>

      <Link
        href={href}
        className="mt-10 inline-flex items-center gap-2 text-base text-[var(--coshift-bone)] transition-colors hover:text-[var(--coshift-cyan)]"
      >
        <span className="border-b border-white/30 pb-0.5 transition-colors group-hover:border-[var(--coshift-cyan)]">
          {cta}
        </span>
        <span
          aria-hidden
          className="transition-transform duration-300 group-hover:translate-x-1"
        >
          →
        </span>
      </Link>
    </motion.div>
  );
}

function NetworkMotif({ hover }: { hover: boolean }) {
  // Mini "network of nodes" — animated SVG that pulses on hover.
  const nodes = [
    [10, 10],
    [60, 16],
    [110, 8],
    [22, 50],
    [70, 56],
    [115, 48],
    [40, 92],
    [90, 96],
  ];
  return (
    <svg width="140" height="120" viewBox="0 0 140 120" aria-hidden>
      <g
        stroke="var(--coshift-cyan)"
        strokeWidth="1"
        opacity={hover ? 0.85 : 0.4}
        style={{ transition: "opacity 400ms" }}
      >
        {nodes.map(([x1, y1], i) =>
          nodes.slice(i + 1).map(([x2, y2], j) => {
            const d = Math.hypot(x1 - x2, y1 - y2);
            if (d > 60) return null;
            return (
              <line
                key={`${i}-${j}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
              />
            );
          }),
        )}
      </g>
      {nodes.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={hover ? 3 : 2}
          fill="var(--coshift-cyan)"
          style={{ transition: "r 400ms" }}
        />
      ))}
    </svg>
  );
}

function WireframeMotif({ hover }: { hover: boolean }) {
  // Wireframe morphing into a "rendered page" mock.
  return (
    <svg width="140" height="120" viewBox="0 0 140 120" aria-hidden>
      <rect
        x="6"
        y="6"
        width="128"
        height="108"
        rx="6"
        stroke="var(--coshift-cyan)"
        strokeWidth="1"
        fill={hover ? "rgba(31,182,240,0.07)" : "transparent"}
        style={{ transition: "fill 400ms" }}
      />
      <rect x="14" y="14" width="40" height="6" rx="1" fill="var(--coshift-cyan)" opacity="0.6" />
      <rect x="14" y="26" width="100" height="4" rx="1" fill="var(--coshift-cyan)" opacity={hover ? 0.5 : 0.25} style={{ transition: "opacity 400ms" }} />
      <rect x="14" y="34" width="80" height="4" rx="1" fill="var(--coshift-cyan)" opacity={hover ? 0.4 : 0.2} style={{ transition: "opacity 400ms" }} />
      <rect x="14" y="50" width="56" height="40" rx="2" fill={hover ? "var(--coshift-cyan)" : "transparent"} stroke="var(--coshift-cyan)" style={{ transition: "fill 400ms" }} opacity={hover ? 0.25 : 0.5} />
      <rect x="78" y="50" width="44" height="40" rx="2" stroke="var(--coshift-cyan)" opacity="0.5" />
      <rect x="14" y="98" width="108" height="4" rx="1" fill="var(--coshift-cyan)" opacity="0.3" />
    </svg>
  );
}
