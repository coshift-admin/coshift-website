import { EnvelopeSimple, PlugsConnected, Robot, Stack, Storefront } from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import type { SolutionSlug } from "@/lib/solutions";

/** One icon per solution (Phosphor, use with weight="fill") — menu, home cards, footer. */
export const SOLUTION_ICONS: Record<SolutionSlug, Icon> = {
  erp: Stack,
  web: Storefront,
  apps: PlugsConnected,
  automation: Robot,
  email: EnvelopeSimple,
};
