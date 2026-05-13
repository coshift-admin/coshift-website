import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import createMDX from "@next/mdx";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
const withMDX = createMDX({
  extension: /\.mdx?$/,
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  pageExtensions: ["ts", "tsx", "mdx"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: [
      "framer-motion",
      "lucide-react",
      "@react-three/drei",
    ],
  },
  // Three.js / drei often ship as ESM with side-effects; Next 15 handles this,
  // but transpile them explicitly so dev-mode HMR is reliable.
  transpilePackages: ["three", "@react-three/drei", "@react-three/fiber"],
};

export default withNextIntl(withMDX(nextConfig));
