/**
 * Sitewide filmic grain — a static, non-animated fractal-noise tile at very low
 * opacity, blended over the whole page for a cohesive textured feel. Static (no
 * motion) so it never distracts and needs no reduced-motion branch.
 */
export function GrainOverlay() {
  return <div aria-hidden className="grain-overlay" />;
}
