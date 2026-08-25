import { site } from "@/lib/site";

export function LocationMap() {
  const { lat, lng } = site.address.geo;
  const pad = 0.005;
  const bbox = `${lng - pad},${lat - pad},${lng + pad},${lat + pad}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
  const fullUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;

  return (
    <div className="mt-8 aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-[var(--coshift-haze)]">
      <iframe
        title={`Map — ${site.address.municipality}, ${site.address.city}`}
        src={src}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full w-full"
        // Dark-mode filter for OSM raster tiles so the map blends with the dark site
        style={{ filter: "invert(0.92) hue-rotate(180deg) brightness(0.95) contrast(0.95)", border: 0 }}
      />
      <a
        href={fullUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="sr-only"
      >
        View larger map on OpenStreetMap
      </a>
    </div>
  );
}
