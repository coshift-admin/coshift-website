"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * True while the element is on screen AND the tab is visible. Gate every
 * requestAnimationFrame loop on it so off-screen demos cost nothing.
 */
export function useVisible(ref: RefObject<Element | null>, rootMargin = "0px"): boolean {
  const [onScreen, setOnScreen] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);

  useEffect(() => {
    const update = () => setPageVisible(document.visibilityState === "visible");
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  return onScreen && pageVisible;
}
