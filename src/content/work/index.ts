/**
 * Portfolio — REAL, founder-cleared work only.
 *
 * Clearance: every client is ticked ✅ in the brand brief §4.1, and the five
 * live websites below were supplied by the founder on 2026-10-07 (Profit Zone
 * added as a reference the same day). OSCAR PRO
 * was removed from all references at the founder's request — do not re-add.
 *
 * HARD RULES (brand brief §11):
 *  - No invented numbers, dates or client business data. (Project years were
 *    dropped for that reason — the brief never stated them.)
 *  - No infrastructure detail (server specs, provider names, hostnames).
 *  - Never a prospect from §4.2.
 *  - Quotes only with the client's written OK. "Attestations de bonne
 *    exécution" exist for AVZ and Formex, but the documents themselves are not
 *    cleared for publication — we only say they're available on request.
 *
 * Screenshots in /public/work are captures of the live sites (2026-10-07).
 * Swap in official visuals whenever the founder supplies them.
 */

export type Locale = "fr" | "en" | "ar";
export type L10n = Record<Locale, string>;

export type CaseStudy = {
  slug: string;
  client: string;
  /** "site": a public website we built (shown with screenshot + live link);
   *  "system": ERP / integration / custom work without a public front. */
  kind: "site" | "system";
  url?: string;
  image?: string;
  services: L10n[];
  title: L10n;
  summary: L10n;
  problem: L10n;
  approach: L10n;
  result: L10n;
  /** Procedural cover for cases without a screenshot. */
  cover: { hue: number; tone: "cyan" | "indigo" | "mixed" };
  quote?: L10n;
  quoteAuthor?: string;
  quoteRole?: L10n;
};

const S = {
  web: { en: "Website", fr: "Site web", ar: "الموقع الإلكتروني" },
  ecommerce: { en: "E-commerce", fr: "E-commerce", ar: "التجارة الإلكترونية" },
  identity: { en: "Visual identity", fr: "Identité visuelle", ar: "الهوية البصرية" },
  platform: { en: "Custom platform", fr: "Plateforme sur mesure", ar: "منصة مخصّصة" },
  threeD: { en: "3D visuals", fr: "Visuels 3D", ar: "عروض ثلاثية الأبعاد" },
  configurator: { en: "3D configurator", fr: "Configurateur 3D", ar: "أداة تخصيص ثلاثية الأبعاد" },
  trilingual: { en: "FR · AR · EN", fr: "FR · AR · EN", ar: "FR · AR · EN" },
  odoo: { en: "Odoo ERP", fr: "ERP Odoo", ar: "نظام Odoo" },
  custom: { en: "Custom modules", fr: "Modules sur mesure", ar: "وحدات مخصّصة" },
  integration: { en: "Integration", fr: "Intégration", ar: "الربط" },
  woo: { en: "WooCommerce", fr: "WooCommerce", ar: "WooCommerce" },
  payment: { en: "Online payment", fr: "Paiement en ligne", ar: "الدفع الإلكتروني" },
  landing: { en: "Landing page", fr: "Page d'atterrissage", ar: "صفحة هبوط" },
} satisfies Record<string, L10n>;

export const caseStudies: CaseStudy[] = [
  {
    slug: "avz",
    client: "Audiovisual Zone (AVZ)",
    kind: "site",
    url: "https://audiovisual-zone.com",
    image: "/work/avz.jpg",
    services: [S.ecommerce, S.platform, S.identity],
    title: {
      en: "Audiovisual Zone — an e-commerce platform and a brand, built as one.",
      fr: "Audiovisual Zone — une plateforme e-commerce et une marque, d'un seul tenant.",
      ar: "Audiovisual Zone — منصة تجارة إلكترونية وهوية بصرية، صُمّمتا معًا.",
    },
    summary: {
      en: "A fully custom e-commerce platform for an audiovisual-equipment retailer — built from the ground up, with a complete visual identity system and an admin team trained to run it.",
      fr: "Une plateforme e-commerce entièrement sur mesure pour un distributeur de matériel audiovisuel — construite de zéro, avec un système d'identité visuelle complet et une équipe admin formée pour la piloter.",
      ar: "منصة تجارة إلكترونية مصمّمة بالكامل حسب الطلب لموزّع معدات سمعية بصرية، بُنيت من الصفر، مع نظام هوية بصرية كامل وفريق إداري مُكوَّن لتسييرها.",
    },
    problem: {
      en: "Off-the-shelf storefronts couldn't handle the catalogue or the way the business actually sells. The brand also had no coherent visual system to build a store around.",
      fr: "Les solutions e-commerce standard ne géraient ni le catalogue ni la façon dont l'entreprise vend réellement. La marque n'avait pas non plus de système visuel cohérent pour bâtir une boutique.",
      ar: "لم تكن حلول التجارة الإلكترونية الجاهزة قادرة على استيعاب الكتالوج ولا طريقة البيع الفعلية للمؤسسة، ولم تكن للعلامة هوية بصرية متماسكة يُبنى عليها المتجر.",
    },
    approach: {
      en: "We built a bespoke platform, handled the catalogue import and styled product descriptions, designed a complete visual identity system, and wrote an admin training guide so the team owns the tool day-to-day.",
      fr: "Nous avons construit une plateforme sur mesure, géré l'import du catalogue et la mise en forme des fiches produits, conçu un système d'identité visuelle complet, et rédigé un guide de formation admin pour que l'équipe maîtrise l'outil au quotidien.",
      ar: "بنينا منصة مخصّصة، وتكفّلنا باستيراد الكتالوج وتنسيق بطاقات المنتجات، وصمّمنا نظام هوية بصرية كاملًا، وأعددنا دليل تكوين للإدارة حتى يتحكّم الفريق في الأداة يوميًا.",
    },
    result: {
      en: "Live at audiovisual-zone.com — the store, the brand system and the team running it are all in place. Certificate of satisfactory completion available on request.",
      fr: "En ligne sur audiovisual-zone.com — la boutique, le système de marque et l'équipe qui la pilote sont en place. Attestation de bonne exécution disponible sur demande.",
      ar: "المنصة متاحة على audiovisual-zone.com — المتجر والهوية البصرية والفريق الذي يسيّره، كلّها جاهزة. شهادة حسن التنفيذ متاحة عند الطلب.",
    },
    cover: { hue: 195, tone: "cyan" },
  },
  {
    slug: "formex",
    client: "Formex",
    kind: "site",
    url: "https://formex.industries",
    image: "/work/formex.jpg",
    services: [S.web, S.threeD],
    title: {
      en: "Formex — an industrial website where the products show themselves in 3D.",
      fr: "Formex — un site industriel où les produits se montrent en 3D.",
      ar: "Formex — موقع صناعي تُعرض فيه المنتجات بتقنية ثلاثية الأبعاد.",
    },
    summary: {
      en: "The website of an Algerian maker of industrial and urban equipment — traffic cones, road barriers, foldable trolleys — with 3D product visuals and animations built from the design files.",
      fr: "Le site d'un fabricant algérien d'équipements industriels et urbains — cônes, barrières routières, chariots pliants — avec des visuels produits en 3D et des animations réalisés à partir des fichiers de conception.",
      ar: "موقع مصنّع جزائري لمعدّات صناعية وحضرية — أقماع المرور والحواجز والعربات القابلة للطيّ — مع عروض ومؤثرات ثلاثية الأبعاد للمنتجات أُنجزت انطلاقًا من ملفات التصميم.",
    },
    problem: {
      en: "Technical products such as modular road barriers are hard to show with ordinary photos.",
      fr: "Des produits techniques, comme les barrières routières modulaires, sont difficiles à montrer avec de simples photos.",
      ar: "يصعب عرض منتجات تقنية، مثل الحواجز المرورية المعيارية، بصور عادية.",
    },
    approach: {
      en: "We turned the CAD files into 3D models and animations, then built a fast bilingual website around them to show each product clearly.",
      fr: "Nous avons transformé les fichiers CAO en modèles 3D et en animations, puis construit autour un site bilingue et rapide pour montrer chaque produit clairement.",
      ar: "حوّلنا ملفات التصميم إلى نماذج ومؤثرات ثلاثية الأبعاد، ثم بنينا حولها موقعًا سريعًا بلغتين لعرض كل منتج بوضوح.",
    },
    result: {
      en: "Delivered — live at formex.industries. Certificate of satisfactory completion available on request.",
      fr: "Livré — en ligne sur formex.industries. Attestation de bonne exécution disponible sur demande.",
      ar: "تم التسليم — الموقع متاح على formex.industries. شهادة حسن التنفيذ متاحة عند الطلب.",
    },
    cover: { hue: 22, tone: "mixed" },
  },
  {
    slug: "kompen",
    client: "Kompen (Groupe Ourahmoune)",
    kind: "site",
    url: "https://groupe-ourahmoune.com",
    image: "/work/kompen.jpg",
    services: [S.web, S.configurator, S.trilingual],
    title: {
      en: "Kompen — design your window in 3D, right on the website.",
      fr: "Kompen — votre fenêtre dessinée en 3D, directement sur le site.",
      ar: "Kompen — صمّموا نافذتكم بتقنية ثلاثية الأبعاد على الموقع مباشرة.",
    },
    summary: {
      en: "A trilingual website (French, Arabic, English) for an Algerian maker of PVC windows and doors, with a browser-based 3D configurator to compose a window to measure.",
      fr: "Le site trilingue (français, arabe, anglais) d'un fabricant algérien de fenêtres et portes PVC, avec un configurateur 3D pour composer sa fenêtre sur mesure, dans le navigateur.",
      ar: "موقع بثلاث لغات (الفرنسية والعربية والإنجليزية) لمصنّع جزائري للنوافذ والأبواب من PVC، مع أداة تخصيص ثلاثية الأبعاد تتيح تصميم النافذة حسب المقاس داخل المتصفح.",
    },
    problem: {
      en: "Static images can't show a configurable product the way customers want to see it — their own combination, from every angle.",
      fr: "Les images statiques ne montrent pas un produit configurable comme les clients veulent le voir — leur propre combinaison, sous tous les angles.",
      ar: "لا تُظهر الصور الثابتة منتجًا قابلًا للتخصيص كما يريد العميل رؤيته: بتركيبته الخاصة ومن كل الزوايا.",
    },
    approach: {
      en: "A real-time 3D configurator running in the browser, built into the site so it works with no plugin or download.",
      fr: "Un configurateur 3D en temps réel dans le navigateur, intégré au site pour fonctionner sans plugin ni téléchargement.",
      ar: "أداة تخصيص ثلاثية الأبعاد تعمل في الوقت الحقيقي داخل المتصفح، مدمجة في الموقع دون أي إضافة أو تحميل.",
    },
    result: {
      en: "Delivered — live: customers compose and view their window in 3D on the site.",
      fr: "Livré — en ligne : les clients composent et visualisent leur fenêtre en 3D sur le site.",
      ar: "تم التسليم — الموقع متاح، ويصمّم العملاء نوافذهم ويشاهدونها بتقنية ثلاثية الأبعاد.",
    },
    cover: { hue: 160, tone: "mixed" },
  },
  {
    slug: "broderie-royale",
    client: "Broderie Royale",
    kind: "site",
    url: "https://broderieroyale.com",
    image: "/work/broderie-royale.jpg",
    services: [S.odoo, S.custom, S.web],
    title: {
      en: "Broderie Royale — an Odoo ERP and a trilingual website for a house of flags and embroidery.",
      fr: "Broderie Royale — un ERP Odoo et un site trilingue pour une maison de drapeaux et de broderie.",
      ar: "Broderie Royale — نظام Odoo وموقع بثلاث لغات لمؤسسة الأعلام والتطريز.",
    },
    summary: {
      en: "For a flag, badge and embroidery house founded in 1986: an Odoo ERP with custom development, a full data migration — clients, suppliers, employees, products — and a trilingual website with an online shop.",
      fr: "Pour une maison de drapeaux, d'écussons et de broderie fondée en 1986 : un ERP Odoo avec développements sur mesure, la reprise complète des données — clients, fournisseurs, employés, produits — et un site trilingue avec boutique en ligne.",
      ar: "لمؤسسة متخصّصة في الأعلام والشارات والتطريز تأسّست سنة 1986: نظام ERP على Odoo مع تطويرات مخصّصة، ونقل كامل للبيانات — العملاء والموردون والموظفون والمنتجات — وموقع بثلاث لغات مع متجر إلكتروني.",
    },
    problem: {
      en: "Moving a long-established business onto one modern system without losing any of its data — and giving the brand a website that matches its craft.",
      fr: "Faire passer une maison établie de longue date sur un système moderne sans perdre aucune donnée — et donner à la marque un site à la hauteur de son savoir-faire.",
      ar: "نقل مؤسسة عريقة إلى نظام حديث واحد دون فقدان أي بيانات، ومنح العلامة موقعًا يليق بحرفيّتها.",
    },
    approach: {
      en: "Odoo configured and extended with custom development, every record migrated, and a website in Arabic, French and English with an online store.",
      fr: "Odoo configuré et complété par des développements sur mesure, toutes les données reprises, et un site en arabe, en français et en anglais avec boutique en ligne.",
      ar: "إعداد Odoo وإثراؤه بتطويرات مخصّصة، ونقل كل البيانات، وموقع بالعربية والفرنسية والإنجليزية مع متجر إلكتروني.",
    },
    result: {
      en: "Live at broderieroyale.com; the ERP work continues as an ongoing project.",
      fr: "En ligne sur broderieroyale.com ; le chantier ERP se poursuit.",
      ar: "الموقع متاح على broderieroyale.com، ويتواصل العمل على نظام ERP.",
    },
    cover: { hue: 40, tone: "indigo" },
  },
  {
    slug: "ista",
    client: "ISTA",
    kind: "site",
    url: "https://sarlista.com",
    image: "/work/ista.jpg",
    services: [S.web, S.odoo, S.trilingual],
    title: {
      en: "ISTA — fifty years of textile craft, one clear website.",
      fr: "ISTA — cinquante ans de savoir-faire textile, un site à la hauteur.",
      ar: "ISTA — خمسون عامًا من حرفة النسيج، وموقع في المستوى.",
    },
    summary: {
      en: "A trilingual Next.js website (Arabic, French, English) for an Algiers textile company founded in 1973 — knitting, dyeing, printing — with a quote request and a client area, plus Odoo for the back office.",
      fr: "Le site Next.js trilingue (arabe, français, anglais) d'une entreprise textile algéroise fondée en 1973 — tricotage, teinture, impression — avec demande de devis et espace client, et Odoo pour la gestion.",
      ar: "موقع Next.js بثلاث لغات (العربية والفرنسية والإنجليزية) لمؤسسة نسيج عاصمية تأسّست سنة 1973 — الحياكة والصباغة والطباعة — مع طلب عرض سعر وفضاء خاص بالعملاء، و Odoo للتسيير.",
    },
    problem: {
      en: "Half a century of know-how across several trades needed to be explained simply, in the three languages its customers use.",
      fr: "Un demi-siècle de savoir-faire, sur plusieurs métiers, à expliquer simplement dans les trois langues de ses clients.",
      ar: "نصف قرن من الخبرة في عدّة حِرف، كان لا بدّ من شرحها ببساطة وباللغات الثلاث التي يستعملها العملاء.",
    },
    approach: {
      en: "A fast site organised by trade — knitting, dyeing, printing — with Arabic as a first-class language, a quote request and a client area.",
      fr: "Un site rapide organisé par métier — tricotage, teinture, impression — avec l'arabe comme langue à part entière, une demande de devis et un espace client.",
      ar: "موقع سريع منظّم حسب الحرفة — الحياكة والصباغة والطباعة — تحظى فيه العربية بمكانتها الكاملة، مع طلب عرض سعر وفضاء للعملاء.",
    },
    result: {
      en: "Live at sarlista.com.",
      fr: "En ligne sur sarlista.com.",
      ar: "الموقع متاح على sarlista.com.",
    },
    cover: { hue: 25, tone: "mixed" },
  },
  {
    slug: "savoir-glow",
    client: "Savoir (Glow)",
    kind: "site",
    url: "https://savoirglow.com",
    image: "/work/savoir-glow.jpg",
    services: [S.ecommerce, S.integration],
    title: {
      en: "Savoir — a cash-on-delivery funnel where the ad tracking finally worked.",
      fr: "Savoir — un tunnel de paiement à la livraison où le tracking pub a enfin fonctionné.",
      ar: "Savoir — مسار طلب بالدفع عند الاستلام يعمل فيه تتبّع الإعلانات أخيرًا.",
    },
    summary: {
      en: "The online store of an Algerian derma-cosmetics brand, with a custom cash-on-delivery funnel and server-side Meta Conversions API tracking — recovering ad conversions that browser pixels miss on iOS, Brave and ad-blockers.",
      fr: "La boutique en ligne d'une marque algérienne de dermo-cosmétique, avec un tunnel de paiement à la livraison sur mesure et un tracking serveur via l'API Conversions de Meta — récupérant les conversions publicitaires que les pixels navigateur ratent sur iOS, Brave et bloqueurs de pub.",
      ar: "المتجر الإلكتروني لعلامة جزائرية لمستحضرات العناية الجلدية، بمسار طلب مخصّص للدفع عند الاستلام وتتبّع من جهة الخادم عبر Conversions API من Meta، يستعيد التحويلات الإعلانية التي تفوّتها أدوات التتبّع في المتصفح على iOS و Brave ومانعات الإعلانات.",
    },
    problem: {
      en: "On a cash-on-delivery model, the browser pixel loses a large share of conversions to iOS privacy, Brave and ad-blockers — so ad spend gets optimised on incomplete data.",
      fr: "En paiement à la livraison, le pixel navigateur perd une part importante des conversions à cause de la confidentialité iOS, de Brave et des bloqueurs — les budgets pub sont donc optimisés sur des données incomplètes.",
      ar: "مع الدفع عند الاستلام، يفقد التتبّع عبر المتصفح جزءًا كبيرًا من التحويلات بسبب خصوصية iOS و Brave ومانعات الإعلانات، فتُوجَّه ميزانيات الإعلان بناءً على بيانات ناقصة.",
    },
    approach: {
      en: "A custom COD checkout funnel plus server-side Conversions API tracking, so conversions are reported from the server rather than depending on the browser.",
      fr: "Un tunnel de commande COD sur mesure et un tracking serveur via l'API Conversions, pour que les conversions soient remontées côté serveur plutôt que de dépendre du navigateur.",
      ar: "مسار طلب مخصّص للدفع عند الاستلام مع تتبّع من جهة الخادم عبر Conversions API، حتى تُسجَّل التحويلات من الخادم دون الاعتماد على المتصفح.",
    },
    result: {
      en: "Delivered — live at savoirglow.com; the ad-conversion signal that browser-only tracking was losing is now recovered server-side.",
      fr: "Livré — en ligne sur savoirglow.com ; le signal de conversion publicitaire que le tracking navigateur perdait est désormais récupéré côté serveur.",
      ar: "تم التسليم — المتجر متاح على savoirglow.com، وصار التحويل الإعلاني الذي كان يضيع في المتصفح يُستعاد من جهة الخادم.",
    },
    cover: { hue: 190, tone: "cyan" },
  },
  {
    slug: "profit-zone",
    client: "Profit Zone",
    kind: "system",
    // Scope confirmed by the founder (2026-10-07): payment integration + landing
    // page only. We did NOT build their website/platform and don't host it.
    services: [S.payment, S.landing],
    title: {
      en: "Profit Zone — online payment integration and a landing page.",
      fr: "Profit Zone — l'intégration du paiement en ligne et une page d'atterrissage.",
      ar: "Profit Zone — دمج الدفع الإلكتروني وصفحة هبوط.",
    },
    summary: {
      en: "For an e-learning company: an Algerian online-payment gateway integration and a React landing page.",
      fr: "Pour une entreprise d'e-learning : l'intégration d'une passerelle de paiement en ligne algérienne et une page d'atterrissage en React.",
      ar: "لمؤسسة تعليم إلكتروني: دمج بوابة دفع إلكتروني جزائرية وصفحة هبوط مبنية بـ React.",
    },
    problem: {
      en: "Selling courses online in Algeria means taking payment online from Algerian customers.",
      fr: "Vendre des formations en ligne en Algérie, c'est encaisser en ligne auprès de clients algériens.",
      ar: "بيع الدورات عبر الإنترنت في الجزائر يعني تحصيل المدفوعات إلكترونيًا من عملاء جزائريين.",
    },
    approach: {
      en: "We wired the payment gateway's API into the purchase flow and built a React landing page to present the offer.",
      fr: "Nous avons branché l'API de la passerelle de paiement sur le parcours d'achat et construit une page d'atterrissage React pour présenter l'offre.",
      ar: "ربطنا واجهة بوابة الدفع بمسار الشراء، وبنينا صفحة هبوط بـ React لتقديم العرض.",
    },
    result: {
      en: "Live — customers pay online.",
      fr: "En service — les clients paient en ligne.",
      ar: "في الخدمة — يدفع العملاء إلكترونيًا.",
    },
    cover: { hue: 95, tone: "mixed" },
  },
  {
    slug: "renoh",
    client: "Renoh",
    kind: "system",
    services: [S.odoo, S.woo, S.custom],
    title: {
      en: "Renoh — one ERP, a store, and the custom modules retail needed.",
      fr: "Renoh — un ERP, une boutique, et les modules sur mesure que le retail exigeait.",
      ar: "Renoh — نظام ERP ومتجر، والوحدات المخصّصة التي احتاجها البيع بالتجزئة.",
    },
    summary: {
      en: "An Odoo 18 ERP wired to a WooCommerce store, plus a custom retail dashboard, a loyalty module, and a link-based influencer/affiliate program that standard plugins can't track.",
      fr: "Un ERP Odoo 18 relié à une boutique WooCommerce, plus un tableau de bord retail sur mesure, un module de fidélité et un programme d'affiliation/influence par lien que les plugins standards ne savent pas suivre.",
      ar: "نظام Odoo 18 مربوط بمتجر WooCommerce، مع لوحة متابعة مخصّصة للبيع بالتجزئة، ووحدة للولاء، وبرنامج للتسويق بالعمولة عبر الروابط لا تستطيع الإضافات الجاهزة تتبّعه.",
    },
    problem: {
      en: "Retail needed one connected system — stock, store, loyalty and an affiliate program — where off-the-shelf tools left gaps, especially around tracking commissions on a cash-on-delivery flow.",
      fr: "Le retail avait besoin d'un système connecté — stock, boutique, fidélité et programme d'affiliation — là où les outils standards laissaient des trous, notamment pour suivre les commissions sur un flux de paiement à la livraison.",
      ar: "احتاج نشاط التجزئة إلى نظام واحد متصل — المخزون والمتجر والولاء وبرنامج العمولة — حيث تركت الأدوات الجاهزة ثغرات، خاصة في تتبّع العمولات مع الدفع عند الاستلام.",
    },
    approach: {
      en: "Odoo 18 as the core, WooCommerce as the storefront, and custom code where standard software stops: a retail dashboard, a loyalty module, and an influencer program with automatic link-based commissions.",
      fr: "Odoo 18 en cœur de système, WooCommerce en boutique, et du code sur mesure là où le logiciel standard s'arrête : un tableau de bord retail, un module de fidélité et un programme d'influence à commissions automatiques par lien.",
      ar: "Odoo 18 في قلب النظام، و WooCommerce للمتجر، وبرمجة مخصّصة حيث يتوقف البرنامج القياسي: لوحة متابعة، ووحدة ولاء، وبرنامج مؤثرين بعمولات تلقائية عبر الروابط.",
    },
    result: {
      en: "Live and running. The affiliate program has been live-tested with automatic 10% commissions.",
      fr: "En ligne et opérationnel. Le programme d'affiliation a été testé en conditions réelles avec des commissions automatiques de 10 %.",
      ar: "يعمل حاليًا. جُرّب برنامج العمولة في ظروف حقيقية بعمولة تلقائية قدرها 10%.",
    },
    cover: { hue: 205, tone: "mixed" },
  },
  {
    slug: "fastplast",
    client: "FastPlast",
    kind: "system",
    services: [S.odoo, S.integration],
    title: {
      en: "FastPlast — biometric attendance wired straight into Odoo.",
      fr: "FastPlast — pointage biométrique branché directement sur Odoo.",
      ar: "FastPlast — جهاز البصمة مربوط مباشرة بـ Odoo.",
    },
    summary: {
      en: "Odoo Enterprise with a ZKTeco biometric attendance integration — so clock-in data flows into the ERP instead of being re-typed from a separate device.",
      fr: "Odoo Enterprise avec une intégration de pointage biométrique ZKTeco — les données de présence alimentent l'ERP au lieu d'être ressaisies depuis un appareil séparé.",
      ar: "Odoo Enterprise مع ربط جهاز البصمة ZKTeco لتسجيل الحضور، فتصل بيانات الحضور إلى النظام بدل إعادة إدخالها من جهاز منفصل.",
    },
    problem: {
      en: "Attendance lived in a standalone biometric device while payroll lived in the ERP — two systems that didn't talk, and a manual bridge in between.",
      fr: "La présence vivait dans un terminal biométrique isolé tandis que la paie vivait dans l'ERP — deux systèmes qui ne se parlaient pas, avec un pont manuel entre les deux.",
      ar: "كان الحضور يُسجَّل في جهاز بصمة معزول بينما تُدار الأجور في نظام ERP — نظامان لا يتواصلان، وبينهما جسر يدوي.",
    },
    approach: {
      en: "We integrated the ZKTeco device with Odoo so attendance feeds the system directly, and set up the deployment environment the client needed to run it.",
      fr: "Nous avons intégré le terminal ZKTeco à Odoo pour que la présence alimente le système directement, et mis en place l'environnement de déploiement dont le client avait besoin.",
      ar: "ربطنا جهاز ZKTeco بـ Odoo لتصل بيانات الحضور مباشرة إلى النظام، وجهّزنا بيئة التشغيل التي احتاجها العميل.",
    },
    result: {
      en: "Delivered — attendance flows into Odoo without a manual step in between.",
      fr: "Livré — la présence alimente Odoo sans étape manuelle intermédiaire.",
      ar: "تم التسليم — تصل بيانات الحضور إلى Odoo دون أي خطوة يدوية.",
    },
    cover: { hue: 225, tone: "indigo" },
  },
];

export function findCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}

/** Pick a localized string, falling back to English for unknown locales. */
export function tr(value: L10n, locale: string): string {
  return value[(locale as Locale) in value ? (locale as Locale) : "en"];
}

/** Display host for a live site URL ("https://x.com" → "x.com"). */
export function hostOf(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}
