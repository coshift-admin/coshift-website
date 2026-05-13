import { Geist, JetBrains_Mono, Fraunces } from "next/font/google";

export const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono-jetbrains",
  weight: ["400", "500"],
});

export const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  style: ["italic"],
  // When `axes` is set, weight must be omitted (the variable axis covers it).
  axes: ["opsz", "SOFT", "WONK"],
});
