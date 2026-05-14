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
  // `standalone` produces a self-contained .next/standalone folder that runs
  // with just `node server.js` — no node_modules needed at deploy time. This
  // is what we copy to the OVH VPS (Vercel builds know to honor it too).
  output: "standalone",
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
