"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { track } from "@vercel/analytics";

const SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

const PALETTE = ["#33C5F3", "#211852", "#4DD0FF", "#F4F2EC", "#050614"];

/**
 * Konami easter egg: a 3s matrix-rain takeover with Coshift hex codes
 * rendered in JetBrains Mono. Fires a `konami` analytics event so we can
 * see how many visitors find it.
 */
export function KonamiEgg() {
  const [active, setActive] = useState(false);
  const [columns, setColumns] = useState<number[]>([]);

  useEffect(() => {
    let buffer: string[] = [];
    const onKey = (e: KeyboardEvent) => {
      buffer.push(e.key.length === 1 ? e.key.toLowerCase() : e.key);
      if (buffer.length > SEQUENCE.length) buffer = buffer.slice(-SEQUENCE.length);
      if (buffer.length === SEQUENCE.length && buffer.every((k, i) => k === SEQUENCE[i])) {
        track("konami");
        setActive(true);
        buffer = [];
        window.setTimeout(() => setActive(false), 3000);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!active) return;
    const count = Math.floor(window.innerWidth / 22);
    setColumns(Array.from({ length: count }, (_, i) => i));
  }, [active]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="konami"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="pointer-events-none fixed inset-0 overflow-hidden bg-[var(--coshift-ink)]"
          style={{ zIndex: "var(--z-overlay)" }}
          aria-hidden
        >
          <div className="absolute inset-0 grid grid-cols-[repeat(auto-fill,22px)] justify-center font-mono text-[14px] leading-[1.2]">
            {columns.map((c) => (
              <Column key={c} idx={c} />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Column({ idx }: { idx: number }) {
  const lines = Array.from({ length: 40 }, () =>
    PALETTE[Math.floor(Math.random() * PALETTE.length)],
  );
  return (
    <motion.div
      initial={{ y: "-100%" }}
      animate={{ y: "100%" }}
      transition={{
        duration: 2 + (idx % 5) * 0.4,
        ease: "linear",
      }}
      className="text-[var(--coshift-cyan)]"
    >
      {lines.map((c, i) => (
        <div key={i} style={{ color: c, opacity: 0.4 + Math.random() * 0.6 }}>
          {c}
        </div>
      ))}
    </motion.div>
  );
}
