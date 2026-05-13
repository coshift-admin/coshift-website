"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { type ReactNode } from "react";
import { useReducedMotionPref } from "@/hooks/useReducedMotion";

/**
 * Page-to-page transition. Replays a short fade+lift whenever the pathname
 * changes. We key the inner motion.div by pathname so AnimatePresence sees
 * the swap and runs exit + enter cleanly.
 *
 * NOTE on alternatives:
 *  - React 19 ships an experimental <ViewTransition> component, but it's
 *    not stable yet and behaves inconsistently with App Router's RSC trees.
 *  - The View Transitions API DOM call (`document.startViewTransition`)
 *    doesn't trigger on Next's client-side navigations without a wrapper.
 *  This pattern stays simple, requires no external packages, and gracefully
 *  degrades to instant nav under `prefers-reduced-motion`.
 */
export function RouteTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotionPref();

  if (reduced) return <>{children}</>;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
        transition={{
          duration: 0.45,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
