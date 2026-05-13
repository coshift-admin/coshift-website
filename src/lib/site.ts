export const site = {
  name: "Coshift",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://coshift.com",
  defaultLocale: "fr" as const,
  // <EditMe> — final business address & contact
  address: {
    city: "M'Sila",
    country: "Algeria",
  },
  email: "hello@coshift.com",
  phone: "+213 000 000 000",
  whatsapp: "+213000000000",
  social: {
    linkedin: "https://www.linkedin.com/company/coshift",
    github: "https://github.com/coshift",
    instagram: "https://www.instagram.com/coshift",
  },
  calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL ?? "",
} as const;

export type Site = typeof site;
