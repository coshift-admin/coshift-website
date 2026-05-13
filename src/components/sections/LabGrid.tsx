"use client";

import { useEffect, useRef } from "react";

/**
 * Three small canvas demos. Each one is a self-contained 2D-canvas (not WebGL —
 * the goal is "lab demo prototype quality," and 2D canvases are cheaper and
 * portable). For a future iteration these would each become a discrete
 * <Canvas> with custom shaders.
 *
 * `viewSource` links go to placeholder GitHub paths. <EditMe> — replace with
 * real fork URLs once the lab repo is published.
 */
export function LabGrid({ viewSourceLabel }: { viewSourceLabel: string }) {
  return (
    <section className="grid grid-cols-1 gap-8 py-20 md:grid-cols-2 md:py-28 lg:grid-cols-3">
      <Card
        title="Noise field"
        description="Curl-noise vector field rendered as 4,000 short trails."
        viewSourceLabel={viewSourceLabel}
        viewSourceHref="https://github.com/coshift/lab/tree/main/noise-field"
      >
        <NoiseFieldCanvas />
      </Card>
      <Card
        title="Attractor"
        description="2,000 particles orbit a mouse-driven attractor with damping."
        viewSourceLabel={viewSourceLabel}
        viewSourceHref="https://github.com/coshift/lab/tree/main/attractor"
      >
        <AttractorCanvas />
      </Card>
      <Card
        title="Fluid lite"
        description="Cheap fluid-like dye smear driven by cursor velocity."
        viewSourceLabel={viewSourceLabel}
        viewSourceHref="https://github.com/coshift/lab/tree/main/fluid-lite"
      >
        <FluidCanvas />
      </Card>
    </section>
  );
}

function Card({
  title,
  description,
  viewSourceLabel,
  viewSourceHref,
  children,
}: {
  title: string;
  description: string;
  viewSourceLabel: string;
  viewSourceHref: string;
  children: React.ReactNode;
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-[var(--coshift-haze)]">
      <div className="relative aspect-[4/3] w-full overflow-hidden">{children}</div>
      <div className="flex items-end justify-between gap-4 p-6">
        <div>
          <h3 className="text-lg font-semibold tracking-[-0.01em]">{title}</h3>
          <p className="mt-1 max-w-[40ch] text-sm text-[var(--coshift-bone)]/60">
            {description}
          </p>
        </div>
        <a
          href={viewSourceHref}
          target="_blank"
          rel="noopener noreferrer"
          className="text-mono shrink-0 text-[var(--coshift-cyan)] underline-offset-4 hover:underline"
        >
          {viewSourceLabel} →
        </a>
      </div>
    </article>
  );
}

/* ---------- Demo 1: noise field ---------- */
function NoiseFieldCanvas() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);
    const particles = Array.from({ length: 600 }, () => ({
      x: Math.random() * canvas.clientWidth,
      y: Math.random() * canvas.clientHeight,
    }));
    let t = 0;
    let raf = 0;
    const tick = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.fillStyle = "rgba(5,6,20,0.05)";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "rgba(31,182,240,0.65)";
      particles.forEach((p) => {
        const angle = Math.sin((p.x + t) * 0.005) + Math.cos((p.y + t) * 0.005);
        p.x += Math.cos(angle * Math.PI) * 0.8;
        p.y += Math.sin(angle * Math.PI) * 0.8;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.fillRect(p.x, p.y, 1.2, 1.2);
      });
      t += 1;
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return <canvas ref={ref} className="h-full w-full" aria-hidden />;
}

/* ---------- Demo 2: attractor ---------- */
function AttractorCanvas() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);
    let mx = canvas.clientWidth / 2;
    let my = canvas.clientHeight / 2;
    canvas.addEventListener("pointermove", (e) => {
      const r = canvas.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
    });
    const N = 700;
    const p = Array.from({ length: N }, () => ({
      x: Math.random() * canvas.clientWidth,
      y: Math.random() * canvas.clientHeight,
      vx: 0,
      vy: 0,
    }));
    let raf = 0;
    const tick = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.fillStyle = "rgba(5,6,20,0.18)";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "rgba(77,208,255,0.55)";
      for (let i = 0; i < N; i++) {
        const pt = p[i];
        const dx = mx - pt.x;
        const dy = my - pt.y;
        const d2 = dx * dx + dy * dy + 30;
        const a = 800 / d2;
        pt.vx += (dx / Math.sqrt(d2)) * a;
        pt.vy += (dy / Math.sqrt(d2)) * a;
        pt.vx *= 0.94;
        pt.vy *= 0.94;
        pt.x += pt.vx;
        pt.y += pt.vy;
        ctx.fillRect(pt.x, pt.y, 1.1, 1.1);
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return <canvas ref={ref} className="h-full w-full" aria-hidden />;
}

/* ---------- Demo 3: fluid lite ---------- */
function FluidCanvas() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);
    let px = -1;
    let py = -1;
    canvas.addEventListener("pointermove", (e) => {
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      ctx.lineCap = "round";
      ctx.lineWidth = 26;
      const g = ctx.createLinearGradient(px, py, x, y);
      g.addColorStop(0, "rgba(31,182,240,0.0)");
      g.addColorStop(0.5, "rgba(77,208,255,0.55)");
      g.addColorStop(1, "rgba(31,182,240,0.0)");
      ctx.strokeStyle = g;
      if (px >= 0) {
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
      px = x;
      py = y;
    });
    let raf = 0;
    const tick = () => {
      ctx.fillStyle = "rgba(5,6,20,0.04)";
      ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return <canvas ref={ref} className="h-full w-full" aria-hidden />;
}
