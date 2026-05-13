export type CaseStudy = {
  slug: string;
  title: string;
  titleFr?: string;
  client: string;
  year: number;
  services: string[];
  summary: string;
  summaryFr?: string;
  problem: string;
  problemFr?: string;
  approach: string;
  approachFr?: string;
  result: string;
  resultFr?: string;
  cover: { hue: number; tone: "cyan" | "indigo" | "mixed" };
  gallery?: string[];
};

/**
 * Placeholder case studies. The user is meant to replace these with real
 * engagements as case studies are written up. Until then the cards still
 * render with procedural covers so the page never looks empty.
 *
 * <EditMe> — client names, dates, narratives, gallery images.
 */
export const caseStudies: CaseStudy[] = [
  {
    slug: "atlas-textiles",
    title: "Atlas Textiles — One Odoo, six factories.",
    titleFr: "Atlas Textiles — Un seul Odoo, six usines.",
    client: "Atlas Textiles",
    year: 2025,
    services: ["Odoo ERP", "Custom modules", "Data migration"],
    summary:
      "A 240-employee textile manufacturer running six plants on three different stock systems. We unified them on a single Odoo Enterprise instance in 14 weeks.",
    summaryFr:
      "Un fabricant textile de 240 personnes gérant six usines sur trois systèmes de stock différents. Nous les avons unifiés sur une seule instance Odoo Enterprise en 14 semaines.",
    problem:
      "Stock numbers never agreed across plants; month-end took ten days of spreadsheet reconciliation; production planning ran on whiteboards and WhatsApp.",
    problemFr:
      "Les stocks ne concordaient jamais entre les usines ; la clôture mensuelle prenait dix jours de réconciliation Excel ; la planification de production tournait sur tableaux blancs et WhatsApp.",
    approach:
      "Six-week Discovery: process maps for every workflow that touched stock or production. Then a phased Odoo rollout — Inventory + Manufacturing first, Accounting in wave two — with custom modules for fabric batch traceability and a multi-plant transfer dashboard.",
    approachFr:
      "Six semaines de découverte : cartographie de chaque flux touchant au stock ou à la production. Puis un déploiement Odoo en vagues — Stock + Production d'abord, Comptabilité en vague 2 — avec des modules sur mesure pour la traçabilité des lots de tissu et un tableau de bord de transferts multi-sites.",
    result:
      "Month-end now runs in two days. Stock accuracy went from ~78% to 99.4% across all plants. Eight FTEs reclaimed from manual reporting.",
    resultFr:
      "La clôture mensuelle se boucle en deux jours. La fiabilité du stock est passée de ~78% à 99,4% sur toutes les usines. Huit ETP récupérés du reporting manuel.",
    cover: { hue: 195, tone: "cyan" },
  },
  {
    slug: "neon-coastal-bank",
    title: "Neon Coastal Bank — A customer portal that the bank actually trusts.",
    titleFr: "Neon Coastal Bank — Un portail client en qui la banque a confiance.",
    client: "Neon Coastal Bank",
    year: 2024,
    services: ["Web development", "Design system", "Identity verification"],
    summary:
      "A regional retail bank wanted a customer portal that didn't feel like a defaced 2014 internet banking page. We rebuilt it from scratch on Next.js with a bespoke design system and a compliant KYC flow.",
    summaryFr:
      "Une banque de détail régionale voulait un portail client qui ne ressemble pas à une page d'e-banking 2014 redécorée. Nous l'avons reconstruit de zéro sous Next.js avec un design system sur mesure et un parcours KYC conforme.",
    problem:
      "The legacy portal had 41% session-abandonment on first-time login. Half the support queue was password resets and 'where is my statement.' Mobile usage was 68% of all traffic but the design was desktop-first.",
    problemFr:
      "Le portail historique avait 41% d'abandons à la première connexion. La moitié de la file de support concernait des resets de mot de passe et le 'où est mon relevé'. Le mobile représentait 68% du trafic mais le design était desktop-first.",
    approach:
      "Mobile-first re-architecture, a token-driven design system that the bank's internal team can extend, passkey + step-up auth, and a redesigned statements view with full-text search and filterable tags.",
    approachFr:
      "Refonte mobile-first, un design system piloté par tokens que l'équipe interne de la banque peut étendre, passkeys + step-up auth, et une vue relevés repensée avec recherche plein texte et filtres.",
    result:
      "First-time login completion up to 91%. Statement-related support tickets down 72% in three months. The bank's internal team now ships their own UI work against the design system.",
    resultFr:
      "Finalisation de première connexion à 91%. Tickets de support liés aux relevés réduits de 72% en trois mois. L'équipe interne de la banque livre ses propres écrans sur le design system.",
    cover: { hue: 240, tone: "indigo" },
  },
];

export function findCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}
