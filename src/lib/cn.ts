import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge reads any unknown `text-*` class as a text colour, so it used
 * to drop our `.text-mono` eyebrow class whenever a colour class followed it
 * (e.g. `text-mono text-[var(--eyebrow)]`). Registering `text-mono` in its own
 * group means it only ever conflicts with itself.
 */
const twMerge = extendTailwindMerge<"coshift-eyebrow">({
  extend: {
    classGroups: {
      "coshift-eyebrow": ["text-mono"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
