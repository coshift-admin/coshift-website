export const site = {
  name: "Coshift",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://coshift.agency",
  defaultLocale: "fr" as const,
  address: {
    district: "Lido",
    city: "Alger",
    country: "Algeria",
    countryFr: "Algérie",
    geo: { lat: 36.7441033, lng: 3.1778598 },
    mapsUrl: "https://maps.app.goo.gl/HzoA5EtZRutCmnbX8",
  },
  email: "contact@coshift.agency",
  phone: "+213 560 50 18 45",
  whatsapp: "+213560501845",
  social: {
    linkedin: "https://www.linkedin.com/company/coshift",
    github: "https://github.com/coshift",
    instagram: "https://www.instagram.com/coshift",
  },
  calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL ?? "",
} as const;

export type Site = typeof site;
