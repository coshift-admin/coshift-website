// Contact facts confirmed by the founder (2026-08-25): address, phone, email.
// Social handles below still need confirming before launch (brand brief §10).
export const site = {
  name: "Coshift",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://coshift.agency",
  tagline: "Powering Your Next Shift",
  defaultLocale: "fr" as const,
  address: {
    district: "Lido",
    municipality: "Mohammadia",
    city: "Alger",
    country: "Algeria",
    countryFr: "Algérie",
    geo: { lat: 36.7441033, lng: 3.1778598 },
    mapsUrl: "https://maps.app.goo.gl/HzoA5EtZRutCmnbX8",
  },
  email: "contact@coshift.agency",
  phone: "+213 560 50 18 45",
  whatsapp: "+213560501845",
  // 🔴 CONFIRM handles before launch (brand brief §10): reserve @coshift or
  // @coshiftagency consistently across platforms, then update these URLs.
  // Channel priority per brief: LinkedIn > Facebook > Instagram > YouTube.
  social: {
    linkedin: "https://www.linkedin.com/company/coshift",
    facebook: "https://www.facebook.com/coshift",
    instagram: "https://www.instagram.com/coshift",
  },
  calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL ?? "",
} as const;

export type Site = typeof site;
