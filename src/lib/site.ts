// Contact facts confirmed by the founder (2026-08-25): address, phone, email.
// Social handles below still need confirming before launch (brand brief §10).
export const site = {
  name: "Coshift",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://coshift.agency",
  tagline: "Powering Your Next Shift",
  defaultLocale: "fr" as const,
  address: {
    street: "113 Rue Saidi Ahmed, Lot N7 Étage 4",
    municipality: "Bordj El Kiffane",
    city: "Alger",
    postalCode: "16031",
    country: "Algeria",
    countryFr: "Algérie",
    // Exact pin — decoded from the founder-supplied Plus Code P5VH+J4X, Bordj El Kiffan.
    plusCode: "P5VH+J4X Bordj El Kiffan",
    geo: { lat: 36.744112, lng: 3.177859 },
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=P5VH%2BJ4X%20Bordj%20El%20Kiffan",
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
