"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const ReducedMotionContext = createContext<boolean>(false);

/**
 * Provider that reads `(prefers-reduced-motion: reduce)` once on mount and
 * subscribes to changes. Components that gate animations call
 * `useReducedMotionPref()` to read the flag.
 *
 * Why a context (not just a hook): we want a single matchMedia listener for
 * the whole tree, not N copies, and we want SSR to render with the safe
 * default (false → animations on) so the markup is identical on client/server
 * until hydration upgrades it.
 */
export function ReducedMotionProvider({ children }: { children: ReactNode }) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return (
    <ReducedMotionContext.Provider value={reduced}>
      {children}
    </ReducedMotionContext.Provider>
  );
}

export function useReducedMotionPref(): boolean {
  return useContext(ReducedMotionContext);
}
