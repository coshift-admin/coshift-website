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
  /**
   * Optional client testimonial. Leave undefined unless you have the client's
   * ACTUAL words in writing — never invent a quote (brand brief §11). Written
   * attestations exist for AVZ and Formex; paste their real quote here when
   * cleared for public use.
   */
  quote?: string;
  quoteFr?: string;
  quoteAuthor?: string;
  quoteRole?: string;
};

/**
 * REAL, founder-cleared case studies. Every client below is ticked ✅ in the
 * brand brief §4.1 (approved for public use — name + work described).
 *
 * HARD RULES (brand brief §11) applied here:
 *  - No invented numbers, no client business data (order volumes, revenue…).
 *  - No infrastructure detail (server specs, provider names, hostnames).
 *  - Never add a client from §4.2 (prospects) — they are off-limits until signed.
 *
 * <EditMe> — narratives are written from the brief's descriptions; refine tone,
 * add gallery screenshots (blurred / demo data only) once the client OKs their
 * screens. Covers are procedural until real imagery is supplied.
 */
export const caseStudies: CaseStudy[] = [
  {
    slug: "avz",
    title: "Audiovisual Zone — an e-commerce platform and a brand, built as one.",
    titleFr: "Audiovisual Zone — une plateforme e-commerce et une marque, d'un seul tenant.",
    client: "Audiovisual Zone (AVZ)",
    year: 2025,
    services: ["Web & e-commerce", "Custom platform", "Visual identity"],
    summary:
      "A full custom e-commerce platform for an audiovisual-equipment retailer — built from the ground up, with a complete visual identity system and an admin team trained to run it.",
    summaryFr:
      "Une plateforme e-commerce entièrement sur mesure pour un distributeur de matériel audiovisuel — construite de zéro, avec un système d'identité visuelle complet et une équipe admin formée pour la piloter.",
    problem:
      "Off-the-shelf storefronts couldn't handle the catalogue or the way the business actually sells. The brand also had no coherent visual system to build a store around.",
    problemFr:
      "Les solutions e-commerce standard ne géraient ni le catalogue ni la façon dont l'entreprise vend réellement. La marque n'avait pas non plus de système visuel cohérent pour bâtir une boutique.",
    approach:
      "We built a bespoke platform, handled the catalogue import and styled product descriptions, designed a complete visual identity system, and wrote an admin training guide so the team owns the tool day-to-day.",
    approachFr:
      "Nous avons construit une plateforme sur mesure, géré l'import du catalogue et la mise en forme des fiches produits, conçu un système d'identité visuelle complet, et rédigé un guide de formation admin pour que l'équipe maîtrise l'outil au quotidien.",
    result:
      "Live at audiovisual-zone.com — the store, the brand system, and the internal team running it are all in place. A written attestation from the client is on file.",
    resultFr:
      "En ligne sur audiovisual-zone.com — la boutique, le système de marque et l'équipe interne qui la pilote sont tous en place. Une attestation écrite du client est archivée.",
    cover: { hue: 195, tone: "cyan" },
  },
  {
    slug: "renoh",
    title: "Renoh — one ERP, a store, and the custom modules retail needed.",
    titleFr: "Renoh — un ERP, une boutique, et les modules sur mesure que le retail exigeait.",
    client: "Renoh",
    year: 2025,
    services: ["Odoo ERP", "WooCommerce", "Custom modules"],
    summary:
      "An Odoo 18 ERP wired to a WooCommerce store, plus a custom retail dashboard, a loyalty module, and a link-based influencer/affiliate program that standard plugins can't track.",
    summaryFr:
      "Un ERP Odoo 18 relié à une boutique WooCommerce, plus un tableau de bord retail sur mesure, un module de fidélité et un programme d'affiliation/influence par lien que les plugins standards ne savent pas suivre.",
    problem:
      "Retail needed one connected system — stock, store, loyalty and an affiliate program — where off-the-shelf tools left gaps, especially around tracking commissions on a cash-on-delivery flow.",
    problemFr:
      "Le retail avait besoin d'un système connecté — stock, boutique, fidélité et programme d'affiliation — là où les outils standards laissaient des trous, notamment pour suivre les commissions sur un flux de paiement à la livraison.",
    approach:
      "Odoo 18 as the core, WooCommerce as the storefront, and custom code where standard software stops: a retail dashboard, a loyalty module, and an influencer program with automatic link-based commissions. We also built and deployed an AI assistant module on a self-hosted model.",
    approachFr:
      "Odoo 18 en cœur de système, WooCommerce en boutique, et du code sur mesure là où le logiciel standard s'arrête : un tableau de bord retail, un module de fidélité et un programme d'influence à commissions automatiques par lien. Nous avons aussi construit et déployé un module d'assistant IA sur un modèle auto-hébergé.",
    result:
      "Live and running. The affiliate program has been live-tested with automatic 10% commissions. (Honesty note: the AI assistant is built and deployed on a demo database, not yet in day-to-day production.)",
    resultFr:
      "En ligne et opérationnel. Le programme d'affiliation a été testé en conditions réelles avec des commissions automatiques de 10%. (Note d'honnêteté : l'assistant IA est construit et déployé sur une base de démonstration, pas encore en production quotidienne.)",
    cover: { hue: 205, tone: "mixed" },
  },
  {
    slug: "oscar-pro",
    title: "OSCAR PRO — a construction ERP that shows each site's real profit.",
    titleFr: "OSCAR PRO — un ERP chantier qui montre le vrai profit de chaque site.",
    client: "OSCAR PRO",
    year: 2025,
    services: ["Odoo ERP", "Mobile app", "Design system"],
    summary:
      "An Odoo 18 ERP for construction and interior fit-out, a three-space mobile app (client / supervisor / manager), and a full design system — with per-site analytical accounting so nobody overspends a job.",
    summaryFr:
      "Un ERP Odoo 18 pour la construction et l'agencement intérieur, une application mobile à trois espaces (client / superviseur / gérant) et un design system complet — avec une comptabilité analytique par chantier pour ne jamais dépasser le budget d'un site.",
    problem:
      "In fit-out work the owner's real question is simple and hard to answer: is this site making or losing money right now? Standard tools don't tie spend to a specific site in real time.",
    problemFr:
      "Dans l'agencement, la vraie question du dirigeant est simple et difficile : ce chantier gagne-t-il ou perd-il de l'argent en ce moment ? Les outils standards ne rattachent pas la dépense à un site précis en temps réel.",
    approach:
      "Odoo covering CRM, sales, projects, purchasing and finance; a mobile app with three role-based spaces wired into the ERP; and analytical accounting per site — the rule being 'never spend more on a site than the client has paid in.'",
    approachFr:
      "Odoo couvrant CRM, ventes, projets, achats et finance ; une application mobile à trois espaces par rôle reliée à l'ERP ; et une comptabilité analytique par chantier — la règle étant « ne jamais dépenser plus sur un site que ce que le client a versé ».",
    result:
      "Running. The owner sees each site's real position instead of asking three people and reconciling by hand.",
    resultFr:
      "En production. Le dirigeant voit la position réelle de chaque chantier au lieu de demander à trois personnes et de réconcilier à la main.",
    cover: { hue: 235, tone: "indigo" },
  },
  {
    slug: "savoir-glow",
    title: "Savoir — a cash-on-delivery funnel where the ad tracking finally worked.",
    titleFr: "Savoir — un tunnel de paiement à la livraison où le tracking pub a enfin fonctionné.",
    client: "Savoir (Glow)",
    year: 2025,
    services: ["Web & e-commerce", "Integration & automation"],
    summary:
      "An e-commerce build with a custom cash-on-delivery funnel and server-side Meta Conversions API tracking — recovering ad conversions that browser pixels miss on iOS, Brave and ad-blockers.",
    summaryFr:
      "Un e-commerce avec un tunnel de paiement à la livraison sur mesure et un tracking serveur via l'API Conversions de Meta — récupérant les conversions publicitaires que les pixels navigateur ratent sur iOS, Brave et bloqueurs de pub.",
    problem:
      "On a cash-on-delivery model, the browser pixel loses a large share of conversions to iOS privacy, Brave and ad-blockers — so ad spend gets optimised on incomplete data.",
    problemFr:
      "En paiement à la livraison, le pixel navigateur perd une part importante des conversions à cause de la confidentialité iOS, de Brave et des bloqueurs — les budgets pub sont donc optimisés sur des données incomplètes.",
    approach:
      "A custom COD checkout funnel plus server-side Conversions API tracking, so conversions are reported from the server rather than depending on the browser.",
    approachFr:
      "Un tunnel de commande COD sur mesure et un tracking serveur via l'API Conversions, pour que les conversions soient remontées côté serveur plutôt que de dépendre du navigateur.",
    result:
      "Delivered — ad-conversion signal that browser-only tracking was losing is now recovered server-side.",
    resultFr:
      "Livré — le signal de conversion publicitaire que le tracking navigateur perdait est désormais récupéré côté serveur.",
    cover: { hue: 190, tone: "cyan" },
  },
  {
    slug: "fastplast",
    title: "FastPlast — biometric attendance wired straight into Odoo.",
    titleFr: "FastPlast — pointage biométrique branché directement sur Odoo.",
    client: "FastPlast",
    year: 2025,
    services: ["Odoo ERP", "Integration & automation"],
    summary:
      "Odoo Enterprise with a ZKTeco biometric attendance integration — so clock-in data flows into the ERP instead of being re-typed from a separate device.",
    summaryFr:
      "Odoo Enterprise avec une intégration de pointage biométrique ZKTeco — les données de présence alimentent l'ERP au lieu d'être ressaisies depuis un appareil séparé.",
    problem:
      "Attendance lived in a standalone biometric device while payroll lived in the ERP — two systems that didn't talk, and a manual bridge in between.",
    problemFr:
      "La présence vivait dans un terminal biométrique isolé tandis que la paie vivait dans l'ERP — deux systèmes qui ne se parlaient pas, avec un pont manuel entre les deux.",
    approach:
      "We integrated the ZKTeco device with Odoo so attendance feeds the system directly, and set up the deployment environment the client needed to run it.",
    approachFr:
      "Nous avons intégré le terminal ZKTeco à Odoo pour que la présence alimente le système directement, et mis en place l'environnement de déploiement dont le client avait besoin.",
    result:
      "Delivered — attendance flows into Odoo without a manual step in between.",
    resultFr:
      "Livré — la présence alimente Odoo sans étape manuelle intermédiaire.",
    cover: { hue: 225, tone: "indigo" },
  },
  {
    slug: "kompen",
    title: "Kompen — a browser-based 3D product configurator.",
    titleFr: "Kompen — un configurateur produit 3D dans le navigateur.",
    client: "Kompen",
    year: 2025,
    services: ["Web", "3D & visual production"],
    summary:
      "A website with an interactive, browser-based 3D product configurator — the kind of visual proof that makes a product decision on the spot.",
    summaryFr:
      "Un site web avec un configurateur produit 3D interactif dans le navigateur — le genre de preuve visuelle qui fait décider un produit sur-le-champ.",
    problem:
      "Static images can't show a configurable product the way customers actually want to see it — their own combination, from every angle.",
    problemFr:
      "Les images statiques ne montrent pas un produit configurable comme les clients veulent réellement le voir — leur propre combinaison, sous tous les angles.",
    approach:
      "A real-time 3D configurator running in the browser, built into the site so it works with no plugin or download.",
    approachFr:
      "Un configurateur 3D en temps réel dans le navigateur, intégré au site pour fonctionner sans plugin ni téléchargement.",
    result:
      "Delivered — customers configure and view the product live, in 3D, on the site.",
    resultFr:
      "Livré — les clients configurent et visualisent le produit en direct, en 3D, sur le site.",
    cover: { hue: 200, tone: "mixed" },
  },
];

export function findCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}
