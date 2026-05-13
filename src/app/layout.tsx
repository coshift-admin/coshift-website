import type { ReactNode } from "react";
import "./globals.css";

/**
 * Root layout — minimal. The locale layout under [locale] wraps the actual app.
 * This file exists because Next requires it; we keep it bare so locale-specific
 * `<html lang>` and providers live where they belong.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
