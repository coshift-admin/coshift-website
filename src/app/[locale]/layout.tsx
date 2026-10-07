import type { ReactNode } from "react";
import { dirOf, languageAlternates, ogLocale } from "@/lib/locale";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { routing } from "@/i18n/routing";
import { gabarito, caveat, cairo, lemonada } from "@/lib/fonts";
import { ReducedMotionProvider } from "@/hooks/useReducedMotion";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Cursor } from "@/components/layout/Cursor";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Preloader } from "@/components/layout/Preloader";
import { PRELOADER_GATE } from "@/components/layout/preloaderGate";
import { KonamiEgg } from "@/components/layout/KonamiEgg";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
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
  // The OG image renderer's default font has no Arabic glyphs, so the share
  // image keeps the English line for /ar (title/description stay Arabic).
  const ogTitle =
    locale === "ar"
      ? (await getTranslations({ locale: "en", namespace: "meta" }))("ogDefault")
      : t("ogDefault");
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
      locale: ogLocale(locale),
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(ogTitle)}`,
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
      images: [`/api/og?title=${encodeURIComponent(ogTitle)}`],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: languageAlternates(""),
    },
    // Icons come from the file conventions src/app/icon.svg (theme-adaptive
    // "CO") and src/app/apple-icon.tsx.
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
      dir={dirOf(locale)}
      className={`${gabarito.variable} ${caveat.variable} ${cairo.variable} ${lemonada.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-[var(--coshift-ink)] text-[var(--coshift-bone)] antialiased">
        {/* Must run before the preloader is parsed — see PRELOADER_GATE. */}
        <script dangerouslySetInnerHTML={{ __html: PRELOADER_GATE }} />
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
              <WhatsAppFab />
            </SmoothScroll>
          </ReducedMotionProvider>
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
