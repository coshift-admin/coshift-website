"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import dynamic from "next/dynamic";

const NotFoundScene = dynamic(() => import("@/components/three/NotFoundScene"), {
  ssr: false,
  loading: () => null,
});

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <div className="relative grid min-h-[100svh] place-items-center overflow-hidden">
      <div className="absolute inset-0">
        <NotFoundScene />
      </div>
      <div className="container-x relative z-10 mx-auto max-w-[1600px] text-center">
        <p className="text-mono text-[var(--coshift-cyan)]">404</p>
        <h1 className="mx-auto mt-6 max-w-[20ch] text-[var(--fs-h1)] font-extrabold leading-[0.95] tracking-[-0.02em]">
          {t("headline")}
        </h1>
        <p className="mx-auto mt-6 max-w-[52ch] text-[var(--fs-lead)] text-[var(--coshift-bone)]/70">
          {t("body")}
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-3 rounded-full bg-[var(--coshift-cyan)] px-6 py-3 text-base font-semibold text-[var(--coshift-ink)]"
          >
            {t("ctaHome")} →
          </Link>
          <Link
            href="/work"
            className="inline-flex items-center gap-3 rounded-full border border-white/20 px-6 py-3 text-base"
          >
            {t("ctaWork")}
          </Link>
        </div>
      </div>
    </div>
  );
}
