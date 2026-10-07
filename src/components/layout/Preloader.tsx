"use client";

import { useEffect, useState } from "react";
import { CoshiftLockup } from "@/components/icons/CoshiftWordmark";

/**
 * First-visit preloader: the wordmark performs the DS "Shift-pass" (CO and
 * SHIFT cross in and lock into register, the i-dot lights cyan), then the
 * curtain lifts.
 *
 * Server-rendered and driven entirely by CSS (`.preloader`, `.lockup-*` in
 * globals.css), so it covers the very first paint instead of popping in after
 * hydration. Skipped for repeat visits in the session (PRELOADER_GATE) and for
 * reduced motion; the hero offsets its entrance by --intro-delay meanwhile.
 * The component only unmounts itself once the CSS exit has finished.
 */
export function Preloader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setDone(true), 2200);
    return () => window.clearTimeout(id);
  }, []);

  if (done) return null;

  return (
    <div className="preloader" aria-hidden>
      {/* `reversed`: cyan CO + white SHIFT, legible on the dark curtain. */}
      <CoshiftLockup tone="reversed" className="h-auto w-[min(62vw,340px)] text-white" />
    </div>
  );
}
