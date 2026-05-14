import { site } from "@/lib/site";

/**
 * Single inline JSON-LD blob for the whole site. The Organization +
 * LocalBusiness schemas live here; per-service pages get their own
 * <ServiceSchema /> additions when useful.
 */
export function StructuredData({ locale }: { locale: string }) {
  const json = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${site.url}#org`,
        name: site.name,
        url: site.url,
        email: site.email,
        sameAs: [site.social.linkedin, site.social.github, site.social.instagram],
        address: {
          "@type": "PostalAddress",
          streetAddress: site.address.district,
          addressLocality: site.address.city,
          addressCountry: "DZ",
        },
      },
      {
        "@type": "LocalBusiness",
        "@id": `${site.url}#local`,
        name: site.name,
        url: site.url,
        email: site.email,
        telephone: site.phone,
        address: {
          "@type": "PostalAddress",
          streetAddress: site.address.district,
          addressLocality: site.address.city,
          addressCountry: "DZ",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: site.address.geo.lat,
          longitude: site.address.geo.lng,
        },
        priceRange: "$$$",
      },
      {
        "@type": "Service",
        name: "Odoo ERP implementation",
        provider: { "@id": `${site.url}#org` },
        areaServed: ["DZ", "FR", "MA", "TN", "AE"],
        url: `${site.url}/${locale}/services/odoo`,
      },
      {
        "@type": "Service",
        name: "Web development",
        provider: { "@id": `${site.url}#org` },
        areaServed: ["DZ", "FR", "MA", "TN", "AE"],
        url: `${site.url}/${locale}/services/web`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
