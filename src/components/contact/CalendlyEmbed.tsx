"use client";

import { useEffect, useRef } from "react";
import { site } from "@/lib/site";

/**
 * Calendly inline embed. When the URL is unset (most local dev) we show a
 * styled placeholder so the layout doesn't shift. The real script-tag widget
 * is loaded lazily on first viewport entry.
 */
export function CalendlyEmbed() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!site.calendlyUrl) return;
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        const w = window as Window & { Calendly?: { initInlineWidget: (opts: { url: string; parentElement: HTMLElement }) => void } };
        if (w.Calendly) {
          w.Calendly.initInlineWidget({
            url: site.calendlyUrl,
            parentElement: node,
          });
          observer.disconnect();
          return;
        }
        const script = document.createElement("script");
        script.src = "https://assets.calendly.com/assets/external/widget.js";
        script.async = true;
        script.onload = () => {
          (window as Window & { Calendly?: { initInlineWidget: (opts: { url: string; parentElement: HTMLElement }) => void } }).Calendly?.initInlineWidget({
            url: site.calendlyUrl,
            parentElement: node,
          });
        };
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://assets.calendly.com/assets/external/widget.css";
        document.head.appendChild(link);
        document.body.appendChild(script);
        observer.disconnect();
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  if (!site.calendlyUrl) {
    return (
      <div className="grid min-h-[420px] place-items-center rounded-2xl border border-dashed border-white/15 bg-[var(--coshift-haze)] p-10 text-center">
        <div>
          <p className="text-mono text-[var(--coshift-bone)]/60">
            {/* <EditMe> — set NEXT_PUBLIC_CALENDLY_URL to embed the booking widget here */}
            Calendly embed disabled — set NEXT_PUBLIC_CALENDLY_URL in
            <code className="mx-1 text-[var(--coshift-cyan)]">.env.local</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="min-h-[640px] overflow-hidden rounded-2xl border border-white/10"
      style={{ background: "var(--coshift-haze)" }}
    />
  );
}
