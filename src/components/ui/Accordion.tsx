"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";

export function Accordion({
  items,
}: {
  items: { q: string; a: string }[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <ul className="divide-y divide-white/10 border-y border-white/10">
      {items.map((item, i) => (
        <AccordionItem
          key={i}
          q={item.q}
          a={item.a}
          open={openIndex === i}
          onToggle={() => setOpenIndex((cur) => (cur === i ? null : i))}
        />
      ))}
    </ul>
  );
}

function AccordionItem({
  q,
  a,
  open,
  onToggle,
}: {
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="group flex w-full items-start justify-between gap-6 py-7 text-left"
      >
        <span
          className={cn(
            "text-[length:var(--fs-h3)] font-semibold leading-[1.15] tracking-[-0.01em] transition-colors",
            open
              ? "text-[var(--coshift-cyan)]"
              : "text-[var(--coshift-bone)] group-hover:text-[var(--coshift-cyan)]",
          )}
        >
          {q}
        </span>
        <Glyph open={open} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: 0.3 },
            }}
            style={{ overflow: "hidden" }}
          >
            <p className="max-w-[60ch] pb-7 pr-12 text-base text-[var(--coshift-bone)]/70">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

function Glyph({ open }: { open: boolean }) {
  return (
    <span
      className={cn(
        "mt-2 flex h-6 w-6 shrink-0 items-center justify-center transition-transform duration-300",
        open ? "rotate-45" : "rotate-0",
      )}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5">
        <line
          x1="12"
          y1="3"
          x2="12"
          y2="21"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <line
          x1="3"
          y1="12"
          x2="21"
          y2="12"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    </span>
  );
}
