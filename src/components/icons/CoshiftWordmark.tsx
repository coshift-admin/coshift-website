import type { SVGProps } from "react";
import { cn } from "@/lib/cn";

/**
 * Coshift wordmark — traced from `assets/Coshift Logo.svg`. Path data lives
 * once here and is shared by the static wordmark, the animated hero lockup and
 * the mark. (The favicon, src/app/icon.svg, carries a copy of C_PATH/O_PATH.)
 *
 * Tones:
 * - `default`    → cyan "CO" + indigo "SHIFT" (light backgrounds only —
 *                  indigo on ink is ~1.3:1 and disappears)
 * - `reversed`   → cyan "CO" + bone "SHIFT" (brand colours on dark)
 * - `mono-light` → all bone (for dark backgrounds)
 * - `mono-dark`  → all ink (for light backgrounds)
 */
type Tone = "default" | "reversed" | "mono-light" | "mono-dark";

const CYAN_PART: Record<Tone, string> = {
  default: "var(--coshift-cyan)",
  reversed: "var(--coshift-cyan)",
  "mono-light": "var(--coshift-bone)",
  "mono-dark": "var(--coshift-ink)",
};

const INDIGO_PART: Record<Tone, string> = {
  default: "var(--coshift-indigo)",
  reversed: "var(--coshift-bone)",
  "mono-light": "var(--coshift-bone)",
  "mono-dark": "var(--coshift-ink)",
};

/* ---------------- Path data (logo units) ---------------- */
const C_PATH =
  "M75.99,124.13L75.99,124.13c-2.39-2.4-4.29-5.25-5.59-8.38c-0.1-0.25-0.34-0.43-0.6-0.47c-0.27-0.03-0.53,0.07-0.71,0.28L69,115.68c-3.11,3.92-7.85,6.21-12.85,6.22c-4.37,0.12-8.58-1.56-11.65-4.68c-3.17-3.23-4.84-7.64-4.62-12.17c-0.24-4.5,1.42-8.91,4.56-12.14c3.08-3.11,7.32-4.79,11.7-4.66c4.43-0.1,8.66,1.89,11.39,5.38l1.3,1.56c0.18,0.21,0.46,0.31,0.72,0.27c0.27-0.04,0.5-0.22,0.59-0.49c1.24-3.25,3.14-6.2,5.59-8.67c0.28-0.29,0.28-0.75,0-1.05c-4.94-5.62-12.12-8.76-19.59-8.58c-7.57-0.18-14.85,2.79-20.13,8.2c-5.35,5.31-8.27,12.6-8.1,20.13c-0.38,15.27,11.7,27.95,26.96,28.34h0.01h1.22c4.14,0.01,8.23-0.86,12.01-2.55c2.97-1.31,5.68-3.14,7.98-5.43c0.22-0.22,0.28-0.56,0.16-0.84c-0.06-0.16-0.15-0.29-0.28-0.4H75.99z";
const O_PATH =
  "M122.45,84.97c-5.19-5.41-12.41-8.41-19.88-8.29c-7.49-0.13-14.69,2.83-19.91,8.2l-0.16,0.25l-0.21,0.22c-1.49,1.56-2.8,3.3-3.91,5.16c-2.51,4.41-3.79,9.41-3.72,14.49c-0.04,3.85,0.66,7.68,2.11,11.25c0.5,1.22,1.11,2.42,1.78,3.57c1.15,1.89,2.51,3.64,4.06,5.24l0.1,0.09l0.25,0.21c5.07,5.12,11.98,8,19.18,8h0.53c7.48,0.1,14.66-2.88,19.88-8.22c5.3-5.32,8.19-12.58,8.04-20.09c0.12-7.52-2.82-14.78-8.14-20.09V84.97z M86.46,105.03c-0.18-4.48,1.47-8.85,4.57-12.11c2.88-3.02,6.87-4.72,11.05-4.72h0.47c4.29-0.12,8.42,1.59,11.37,4.72c3.16,3.22,4.84,7.61,4.63,12.12c0.21,4.48-1.43,8.85-4.56,12.07v0.07c-2.95,3.14-7.09,4.85-11.4,4.72c-4.32,0.13-8.5-1.58-11.48-4.72C87.98,113.94,86.3,109.55,86.46,105.03";
const S_PATH =
  "M170.53,105.37c-1.79-1.15-3.77-2.07-5.94-2.75c-2.17-0.68-4.33-1.28-6.5-1.8c-2.17-0.52-4.15-1.05-5.94-1.57c-1.79-0.52-3.24-1.22-4.33-2.08c-1.1-0.86-1.64-2-1.64-3.41c0-1.2,0.32-2.26,0.97-3.18c0.65-0.91,1.72-1.66,3.21-2.24c1.49-0.57,3.41-0.86,5.75-0.86c2.34,0,4.73,0.35,7.17,1.06c2.44,0.71,4.88,1.79,7.32,3.26l3.74-9.66c-2.44-1.62-5.26-2.84-8.44-3.65c-3.19-0.81-6.43-1.22-9.71-1.22c-4.93,0-9.03,0.77-12.29,2.32c-3.26,1.54-5.7,3.61-7.32,6.2c-1.62,2.59-2.43,5.46-2.43,8.6c0,2.93,0.56,5.34,1.68,7.22c1.12,1.88,2.58,3.4,4.37,4.55c1.79,1.15,3.77,2.09,5.94,2.83c2.17,0.73,4.33,1.35,6.5,1.84c2.17,0.5,4.15,1.02,5.94,1.57c1.79,0.55,3.24,1.26,4.33,2.12c1.09,0.86,1.64,2.03,1.64,3.49c0,1.15-0.35,2.17-1.05,3.06c-0.7,0.89-1.78,1.58-3.25,2.08c-1.47,0.5-3.4,0.75-5.79,0.75c-3.14,0-6.24-0.54-9.3-1.61c-3.06-1.07-5.72-2.45-7.96-4.12l-4.11,9.58c2.34,1.88,5.43,3.41,9.26,4.59c3.83,1.18,7.84,1.77,12.03,1.77c4.98,0,9.1-0.78,12.37-2.36c3.26-1.57,5.72-3.64,7.36-6.2c1.64-2.56,2.47-5.39,2.47-8.48c0-2.88-0.56-5.26-1.68-7.14C173.78,108.04,172.33,106.52,170.53,105.37";
const H_POINTS =
  "218.87,99.87 195.11,99.87 195.11,78.21 183.01,78.21 183.01,133.15 195.11,133.15 195.11,110.63 218.87,110.63 218.87,133.15 230.98,133.15 230.98,78.21 218.87,78.21";
const F_POINTS =
  "282.79,133.15 294.89,133.15 294.89,113.14 319.1,113.14 319.1,102.93 294.89,102.93 294.89,88.41 322.31,88.41 322.31,78.21 282.79,78.21";
const T_POINTS =
  "326.42,78.21 326.42,88.57 343.16,88.57 343.16,133.15 355.26,133.15 355.26,88.57 372,88.57 372,78.21";
const I_BODY_PATH =
  "M257.19,89.99v10.8c0,0.55-0.45,1.47-0.86,1.84c-1,0.89-3.92,1.46-5.31,1.99c-4.54,1.75-8.12,5.12-9.33,9.94c-0.53,2.13-0.84,6.99-0.84,6.99v11.56l12.19-0.01c0,0-0.02-1.95,0-2.9c0.07-3.71-0.26-8.63,0.39-12.18c0.19-1.07,0.96-1.55,1.9-1.94c2.26-0.95,4.69-1.33,6.98-2.43c7.32-3.52,7.17-9.38,7.19-16.57l-0.02-7.1H257.19z";
const I_DOT = { x: 257.2, y: 77.29, width: 12.3, height: 8.67 } as const;

/** Tight crop around the letterforms (the source file has wide padding). */
const LOCKUP_VIEWBOX = "28 75 345 60";

/**
 * Raw logo geometry (logo units, inside LOCKUP_VIEWBOX) for code that draws the
 * mark itself — e.g. the Lab's particle wordmark. `co` parts are the cyan half.
 */
export const LOGO_GEOMETRY = {
  viewBox: { x: 28, y: 75, width: 345, height: 60 },
  co: { paths: [C_PATH, O_PATH], dot: I_DOT },
  shift: { paths: [S_PATH, I_BODY_PATH], polygons: [H_POINTS, F_POINTS, T_POINTS] },
} as const;

export function CoshiftWordmark({
  tone = "default",
  crop = false,
  ...props
}: SVGProps<SVGSVGElement> & {
  tone?: Tone;
  /** Tight viewBox around the letters (the source file has wide padding). */
  crop?: boolean;
}) {
  const cyan = CYAN_PART[tone];
  const indigo = INDIGO_PART[tone];

  return (
    <svg viewBox={crop ? LOCKUP_VIEWBOX : "0 0 400 210"} role="img" aria-label="Coshift" {...props}>
      <g>
        <path fill={cyan} d={C_PATH} />
        <path fill={cyan} d={O_PATH} />
        <rect fill={cyan} {...I_DOT} />
        <path fill={indigo} d={S_PATH} />
        <polygon fill={indigo} points={H_POINTS} />
        <polygon fill={indigo} points={F_POINTS} />
        <polygon fill={indigo} points={T_POINTS} />
        <path fill={indigo} d={I_BODY_PATH} />
      </g>
    </svg>
  );
}

/**
 * Animated lockup — the wordmark split into its two halves so they can perform
 * the DS "Shift-pass": CO and SHIFT cross in from opposite sides and lock into
 * register, then the i-dot lights cyan. Motion lives in globals.css
 * (`.lockup-*`). `tone="mono"` draws everything in currentColor;
 * `tone="reversed"` keeps CO in brand cyan (for dark backgrounds).
 */
export function CoshiftLockup({
  className,
  tone = "mono",
  ...props
}: SVGProps<SVGSVGElement> & { tone?: "mono" | "reversed" }) {
  return (
    <svg
      viewBox={LOCKUP_VIEWBOX}
      role="img"
      aria-label="Coshift"
      className={cn("lockup", className)}
      {...props}
    >
      <g
        className="lockup-co"
        fill={tone === "reversed" ? "var(--coshift-cyan)" : "currentColor"}
      >
        <path d={C_PATH} />
        <path d={O_PATH} />
      </g>
      <g className="lockup-shift" fill="currentColor">
        <path d={S_PATH} />
        <polygon points={H_POINTS} />
        <path d={I_BODY_PATH} />
        <rect className="lockup-dot" {...I_DOT} />
        <polygon points={F_POINTS} />
        <polygon points={T_POINTS} />
      </g>
    </svg>
  );
}

/** The "CO" alone — the favicon shape, in currentColor. */
export function CoshiftCO(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="28 75 104 60" fill="currentColor" aria-hidden {...props}>
      <path d={C_PATH} />
      <path d={O_PATH} />
    </svg>
  );
}

export function CoshiftMark({
  tone = "default",
  ...props
}: SVGProps<SVGSVGElement> & { tone?: Tone }) {
  const cyan = CYAN_PART[tone];
  const indigo = INDIGO_PART[tone];

  // Just the "i" — the cyan dot + the S-curve body, moved to the origin.
  return (
    <svg viewBox="0 0 30 60" role="img" aria-label="Coshift mark" {...props}>
      <g transform="translate(-239.2, -77.29)">
        <rect fill={cyan} {...I_DOT} />
        <path fill={indigo} d={I_BODY_PATH} />
      </g>
    </svg>
  );
}
