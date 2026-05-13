"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CoshiftWordmark } from "@/components/icons/CoshiftWordmark";
import { useReducedMotionPref } from "@/hooks/useReducedMotion";

/**
 * First-visit preloader: the Coshift wordmark assembles from scattered glyph
 * pieces, then dissolves. Only shown once per browser session — stored in
 * `sessionStorage` so SPA navigations and refreshes don't re-trigger it.
 */
export function Preloader() {
  const reduced = useReducedMotionPref();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const KEY = "coshift:preloaded";
    if (window.sessionStorage.getItem(KEY)) return;
    if (reduced) {
      window.sessionStorage.setItem(KEY, "1");
      return;
    }
    setVisible(true);
    const tick = window.setTimeout(() => {
      window.sessionStorage.setItem(KEY, "1");
      setVisible(false);
    }, 1400);
    return () => window.clearTimeout(tick);
  }, [reduced]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 grid place-items-center bg-[var(--coshift-ink)]"
          style={{ zIndex: "var(--z-preloader)" }}
          aria-hidden
        >
          <motion.div
            initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
            animate={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] },
            }}
          >
            <CoshiftWordmark className="h-10 w-auto md:h-14" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
