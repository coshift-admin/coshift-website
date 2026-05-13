import type { SVGProps } from "react";

/**
 * The Coshift "shift" glyph — extracted from the dot of the "i" in the wordmark.
 * A vertical zigzag/S-curve. Used as: favicon, cursor accent, section divider,
 * 3D extrusion source, scroll cue, bullet, loading indicator.
 *
 * Path is traced from `assets/Coshift Logo.svg` (the path with d starting `M257.19,89.99…`)
 * but re-centered to a 64x96 viewBox with a clean 2D path for both flat and extrusion use.
 */
export function ShiftGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 96"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      {/* The top cyan square (the i-dot) */}
      <rect x="14" y="0" width="36" height="20" rx="0.5" />
      {/* The S-curve body of the glyph */}
      <path d="M14 26
               H 50
               C 50 26, 50 38, 42 42
               C 36 45, 28 47, 22 52
               C 14 58, 14 70, 22 74
               C 28 77, 36 79, 42 82
               C 50 86, 50 96, 50 96
               H 14
               C 14 96, 14 86, 22 82
               C 28 79, 36 77, 42 74
               C 50 70, 50 58, 42 52
               C 36 47, 28 45, 22 42
               C 14 38, 14 26, 14 26 Z" />
    </svg>
  );
}

/**
 * Path-only version — for places (SVG filters, R3F extrusion) where you only
 * want the d-attribute, not the full <svg>.
 */
export const SHIFT_GLYPH_PATH = `M14 26
H 50
C 50 26, 50 38, 42 42
C 36 45, 28 47, 22 52
C 14 58, 14 70, 22 74
C 28 77, 36 79, 42 82
C 50 86, 50 96, 50 96
H 14
C 14 96, 14 86, 22 82
C 28 79, 36 77, 42 74
C 50 70, 50 58, 42 52
C 36 47, 28 45, 22 42
C 14 38, 14 26, 14 26 Z`;

export const SHIFT_GLYPH_DOT_RECT = { x: 14, y: 0, w: 36, h: 20 } as const;
