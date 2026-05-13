import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { routing } from "@/i18n/routing";
import { geist, jetbrainsMono, fraunces } from "@/lib/fonts";
import { ReducedMotionProvider } from "@/hooks/useReducedMotion";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Cursor } from "@/components/layout/Cursor";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Preloader } from "@/components/layout/Preloader";
import { KonamiEgg } from "@/components/layout/KonamiEgg";
import { RouteTransition } from "@/components/layout/RouteTransition";
import { StructuredData } from "@/components/seo/StructuredData";
import { site } from "@/lib/site";
import type { Metadata } from "next";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const baseUrl = site.url;
  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: `${t("siteName")} — ${t("siteTagline")}`,
      template: `%s · ${t("siteName")}`,
    },
    description: t("siteTagline"),
    openGraph: {
      type: "website",
      url: `${baseUrl}/${locale}`,
      siteName: t("siteName"),
      title: t("ogDefault"),
      description: t("siteTagline"),
      locale: locale === "fr" ? "fr_FR" : "en_US",
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(t("ogDefault"))}`,
          width: 1200,
          height: 630,
          alt: t("siteName"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("ogDefault"),
      description: t("siteTagline"),
      images: [`/api/og?title=${encodeURIComponent(t("ogDefault"))}`],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        fr: `${baseUrl}/fr`,
        en: `${baseUrl}/en`,
        "x-default": `${baseUrl}/fr`,
      },
    },
    icons: {
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/favicon.ico" },
      ],
      apple: "/apple-touch-icon.png",
    },
    manifest: "/manifest.webmanifest",
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!(routing.locales as readonly string[]).includes(locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${geist.variable} ${jetbrainsMono.variable} ${fraunces.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-[var(--coshift-ink)] text-[var(--coshift-bone)] antialiased">
        <StructuredData locale={locale} />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ReducedMotionProvider>
            <SmoothScroll>
              <Preloader />
              <Cursor />
              <Header />
              <main id="main" className="relative">
                <RouteTransition>{children}</RouteTransition>
              </main>
              <Footer />
              <KonamiEgg />
            </SmoothScroll>
          </ReducedMotionProvider>
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
