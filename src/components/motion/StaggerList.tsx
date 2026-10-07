"use client";

import { createElement, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useReducedMotionPref } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";

/**
 * StaggerList — fade + lift each direct child in sequence when the list
 * enters the viewport. Use for deliverables, principles, chips, card grids.
 *
 * No wrapper elements: children stay direct children (valid <ul>/<li>), and the
 * motion is a CSS transition on them (`.stagger` in globals.css), indexed by
 * :nth-child. Items are only hidden once JS has armed the list, so content
 * never stays invisible without JS, and reduced motion skips it entirely.
 */
export function StaggerList({
  children,
  as = "ul",
  className,
  staggerChildren = 0.08,
  y = 20,
  duration = 0.6,
  amount = 0.2,
  initialDelay = 0,
}: {
  children: ReactNode;
  as?: "ul" | "ol" | "div";
  className?: string;
  staggerChildren?: number;
  y?: number;
  duration?: number;
  amount?: number;
  initialDelay?: number;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotionPref();
  const [state, setState] = useState<"idle" | "armed" | "in">("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) {
      setState("idle");
      return;
    }
    setState("armed");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("in");
          io.disconnect();
        }
      },
      // Trigger when the list's top edge is `amount` of the way up the
      // viewport — NOT when `amount` of the list is visible, which a list
      // taller than the screen could never reach (it would stay hidden).
      { threshold: 0, rootMargin: `0px 0px -${Math.round(amount * 100)}% 0px` },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced, amount]);

  const style = {
    "--stagger": `${staggerChildren}s`,
    "--stagger-y": `${y}px`,
    "--stagger-dur": `${duration}s`,
    "--stagger-delay": `${initialDelay}s`,
  } as CSSProperties;

  return createElement(
    as,
    { ref, className: cn("stagger", className), "data-stagger": state, style },
    children,
  );
}
