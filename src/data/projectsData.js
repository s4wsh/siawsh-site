// src/data/projectsData.js

// -------------------------------------------------------------
// STANDALONE PROJECT OBJECTS (Individual Cards & Hero Projects)
// -------------------------------------------------------------

// Hero Project: AURA Smart Speaker
export const auraProject = (t = {}) => ({
  id: "aura-smart-speaker",
  projectName: "AURA Smart Speaker",
  title: t.projects?.aura?.title || "AURA — Conceptual 3D Design & Motion Showcase",
  subtitle: "Combining architectural minimalism, tactile materiality, and 3D motion design to showcase high-end product visualization without trademark constraints.",
  headline: "Crafting a Next-Generation Smart Speaker Identity",
  category: "Industrial & Motion Design",
  span: "bento-span-8",
  imageSrc: "/projects/aura-smart-speaker/ambient-render.jpg",
  coverImage: "/projects/aura-smart-speaker/ambient-render.jpg",
  heroVideo: "/projects/aura-smart-speaker/hero-loop.mp4",
  year: "2026",
  client: "Studio Concept",
  isVideo: true,
  loop: true,
  autoPlay: true,
  muted: true,

  contextParagraph: "This project originated as a personal challenge to build a commercial-grade 3D and motion design showcase. The primary creative hurdle was clear: How do you demonstrate high-level technical rendering skills for a premium tech product without infringing on existing brand trademarks? The solution was to design an entirely original product from the ground up. Instead of borrowing a brand, AURA was born—a conceptual smart speaker rooted in architectural minimalism, premium physical textures, and immersive acoustic design.",
  contextImage: "/projects/aura-smart-speaker/moodboard.jpg",
  moodboardImage: "/projects/aura-smart-speaker/moodboard.jpg",

  engineeringTitle: "Engineering an Identity & Technical Execution",
  engineeringParagraph: "Before drafting a single polygon in 3D space, a comprehensive blueprint was established to define the speaker's form, function, and ergonomic balance. The main body features a rounded rectangular prism with soft vertical curves and an integrated carrying handle carved directly into the top profile. High-fidelity acoustic drivers and passive radiators were modeled to match real-world audio engineering standards. Materiality was prioritized by contrasting tactile acoustic mesh fabric against cold, high-grade aluminum and capacitive, light-responsive glass touch controls.",
  alignmentImage: "/projects/aura-smart-speaker/explosion-diagram.jpg",
  explosionImage: "/projects/aura-smart-speaker/explosion-diagram.jpg",

  competitorParagraph: "By developing a bespoke hardware ecosystem, the project sits comfortably alongside design-forward audio leaders like Bang & Olufsen and Teenage Engineering. It demonstrates a complete end-to-end pipeline—from initial product blueprinting and CAD modeling to industrial texturing and commercial motion lighting.",
  ethosTitle: "The Design Ethos",
  ethosQuote: "AURA was designed at the intersection of minimalist architecture, natural materials, and ambient light—creating a product that feels both technologically advanced and warmly integrated into a living space.",
  ambientRender: "/projects/aura-smart-speaker/ambient-render.jpg",
  macroRender: "/projects/aura-smart-speaker/macro-fabric.jpg",

  galleryImages: [
    {
      src: "/projects/aura-smart-speaker/ambient-render.jpg",
      caption: "Ambient studio render demonstrating material contrast and integrated light strip."
    },
    {
      src: "/projects/aura-smart-speaker/macro-fabric.jpg",
      caption: "Macro view of acoustic mesh texturing and aluminum handle edge detail."
    }
  ],

  otherWorks: [
    { id: "flick-delivery", title: "Project 01: Flick Delivery — Brand Identity & Motion Graphics" },
    { id: "luckys-custom-homes", title: "Project 02: Lucky’s Custom Homes — Visual Identity & Brand System" }
  ]
});

// Cinematic Card Project 01: Flick Delivery
export const flickDeliveryProject = (t = {}) => ({
  id: "flick-delivery",
  projectName: "Flick Delivery",
  title: t.projects?.flick?.title || "Flick Delivery — Brand Identity, Motion Graphics & Visual System",
  headline: "Building a Dynamic Identity for Next-Gen Local Logistics",
  subtitle: "Combining eco-friendly logistics, energetic motion design, and a high-speed mark to launch Northern Cyprus’s leading delivery platform.",
  category: "Brand Identity & Motion",
  span: "bento-span-8",
  imageSrc: "/projects/flickdelivery/drop_box.webp",
  coverImage: "/projects/flickdelivery/drop_box.webp",
  heroVideo: "/projects/flickdelivery/flick_delivery.mp4",
  previewVideoSrc: "/projects/flickdelivery/flick_delivery.mp4",
  year: "2026",
  client: "Flick Delivery",
  location: "Northern Cyprus",
  disciplines: ["Brand Identity", "Motion Graphics", "Visual System"],
  isVideo: true,
  loop: true,
  autoPlay: true,
  muted: true,

  // Context & Research Overview
  contextParagraph: "Flick Delivery launched in Northern Cyprus to revolutionize last-mile logistics for local businesses through speed, simplicity, and eco-friendly practices. The primary challenge was crafting a brand identity that felt fast and modern while signaling sustainability—starting with bicycle deliveries to reduce urban environmental impact. SIAWSH was commissioned to build a complete visual system and explainer video that bridges digital usability with physical, on-the-ground presence.",
  contextImage: "/projects/flickdelivery/drop_box.webp",
  moodboardImage: "/projects/flickdelivery/drop_box.webp",

  // Logo Architecture & Motion Strategy
  strategyTitle: "Logo Architecture & Motion Strategy",
  engineeringTitle: "Logo Architecture & Motion Strategy",
  strategyParagraph: "Local businesses were struggling to compete with massive delivery apps, while customers wanted quick, eco-friendly options. They needed a brand that felt fast, reliable, and approachable. SIAWSH solved this by designing a logo that merges an 'F' with a forward arrow—symbolizing speed without feeling corporate. Built on a grid, it scales cleanly from phone screens to courier bikes. To bring it all together, SIAWSH created a quick motion explainer video that breaks down the delivery process into simple, engaging visual steps, showing merchants and buyers just how easy local shipping can be.",
  engineeringParagraph: "Local businesses were struggling to compete with massive delivery apps, while customers wanted quick, eco-friendly options. They needed a brand that felt fast, reliable, and approachable. SIAWSH solved this by designing a logo that merges an 'F' with a forward arrow—symbolizing speed without feeling corporate. Built on a grid, it scales cleanly from phone screens to courier bikes. To bring it all together, SIAWSH created a quick motion explainer video that breaks down the delivery process into simple, engaging visual steps, showing merchants and buyers just how easy local shipping can be.",
  alignmentImage: "/projects/flickdelivery/hands_to_hands.webp",
  explosionImage: "/projects/flickdelivery/hands_to_hands.webp",

  // Recognition & Market Standing
  competitorParagraph: "While traditional logistics brands rely on heavy, corporate iconography, Flick Delivery establishes an agile, eco-conscious identity. By combining vibrant green chevron accents with natural kraft packaging, the brand stands out in the Northern Cyprus market as a modern, community-focused platform.",

  // Quote Section
  ethosTitle: "Empowering Local Commerce",
  ethosQuote: "Flick Delivery provides fast, simple, efficient, and eco-friendly solutions for local businesses, empowering them to connect with customers through a modern, reliable platform.",
  quoteSource: "Flick Delivery Team",

  // Gallery
  galleryImages: [
    {
      src: "/projects/flickdelivery/all_orders.webp",
      caption: "Fleet tracking interface and branded eco-friendly delivery packaging."
    },
    {
      src: "/projects/flickdelivery/hands_to_hands.webp",
      caption: "Direct merchant-to-customer parcel handoff visual."
    }
  ],

  otherWorks: [
    { id: "luckys-custom-homes", title: "Project 01: Lucky’s Custom Homes — Visual Identity" },
    { id: "aura-smart-speaker", title: "Project 02: AURA — Conceptual 3D Design & Motion Showcase" }
  ]
});

// Cinematic Card Project 02: Lucky’s Custom Homes
export const luckysCustomHomesProject = (t = {}) => ({
  id: "luckys-custom-homes",
  projectName: "Lucky’s Custom Homes",
  title: t.projects?.luckys?.title || "Lucky’s Custom Homes — Visual Identity & Brand System Design",
  headline: "Grounding Regional Heritage in Minimalist Identity",
  subtitle: "A modern brand identity for a southern New Mexico custom home builder, balancing regional warm desert tones with an agile combination mark.",
  category: "Visual Identity & Brand System",
  span: "bento-span-8",
  imageSrc: "/projects/luckys-custom-homes/hero-dusk.jpg",
  coverImage: "/projects/luckys-custom-homes/hero-dusk.jpg",
  heroImage: "/projects/luckys-custom-homes/hero-dusk.jpg",
  year: "2026",
  client: "Lucky’s Custom Homes",
  location: "Southern New Mexico, USA",
  disciplines: ["Brand Identity", "Visual System", "Collateral Design"],
  isVideo: false,

  contextParagraph: "Market research into Lucky’s Custom Homes—a custom home builder based in southern New Mexico—revealed that connecting with local homeowners requires a deep resonance with the Desert Southwest’s natural environment. While key local competitors like Veloz Homes lean heavily into high-end luxury and Palo Verde prioritizes ultra-simplicity, Lucky’s needed an identity that built immediate trust without sacrificing design sophistication. The challenge was to anchor the 'Lucky' name in a refined visual mark while drawing directly from the region's organic landscape.",
  contextImage: "/projects/luckys-custom-homes/market-research-overview.jpg",
  moodboardImage: "/projects/luckys-custom-homes/market-research-overview.jpg",

  strategyTitle: "Strategy, Typography & System Execution",
  engineeringTitle: "Strategy, Typography & System Execution",
  strategyParagraph: "To balance regional authenticity with visual clarity, SIAWSH engineered a minimalist combination mark featuring a stylized single-line shamrock paired with structured typography. Built using geometric precision and optical alignment, the emblem scales effortlessly across digital channels, heavy construction equipment, and print collateral. The typographic foundation relies on Montserrat (Bold & Regular) to maintain a modern, clean, and structural feel. The color palette translates the warmth of the Southwest directly into the identity using terracotta (#E2725B), desert beige (#F5E6CC), vibrant sage green (#4CAF50), and deep charcoal (#333333) for high-contrast readability.",
  engineeringParagraph: "To balance regional authenticity with visual clarity, SIAWSH engineered a minimalist combination mark featuring a stylized single-line shamrock paired with structured typography. Built using geometric precision and optical alignment, the emblem scales effortlessly across digital channels, heavy construction equipment, and print collateral. The typographic foundation relies on Montserrat (Bold & Regular) to maintain a modern, clean, and structural feel. The color palette translates the warmth of the Southwest directly into the identity using terracotta (#E2725B), desert beige (#F5E6CC), vibrant sage green (#4CAF50), and deep charcoal (#333333) for high-contrast readability.",
  alignmentImage: "/projects/luckys-custom-homes/alignment-grid-breakdown.jpg",
  explosionImage: "/projects/luckys-custom-homes/alignment-grid-breakdown.jpg",

  competitorParagraph: "Positioned strategically between high-end luxury residential builders and mass-market contractors, the new identity gives Lucky’s Custom Homes a distinct, memorable presence in the New Mexico market. By pairing an approachable shamrock motif with grounded desert tones, the brand establishes an authentic visual identity that fosters immediate client trust.",

  ethosTitle: "Shaping Your Future",
  ethosQuote: "The desert southwest’s earthy tones—terracotta, beige, and muted green—connect deeply with local homeowners. This combination mark provides a professional, warm, and regionally distinct identity that sets us apart from local competition.",
  quoteSource: "Southwest Design Guide",

  galleryImages: [
    {
      src: "/projects/luckys-custom-homes/style-guide.jpg",
      caption: "Style guide sheet illustrating color palette hex codes, typography hierarchy, icon-only mark, and full wordmark with tagline."
    },
    {
      src: "/projects/luckys-custom-homes/business-cards-mockup.jpg",
      caption: "Physical collateral mockup showing tactile business cards featuring the dark charcoal mark and terracotta desert wave pattern."
    }
  ],

  otherWorks: [
    { id: "flick-delivery", title: "Project 01: Flick Delivery — Brand Identity & Motion" },
    { id: "aura-smart-speaker", title: "Project 02: AURA — Conceptual 3D Design & Motion Showcase" }
  ]
});

// Spatial Card Project 01: Nordic Pavilion
export const nordicPavilionProject = (t = {}) => ({
  id: "nordic-pavilion",
  title: t.projects?.nordic?.title || "Nordic Pavilion",
  subtitle: "A study in minimal timber frameworks and ambient daylighting.",
  category: t.projects?.nordic?.category || "Architecture",
  span: "bento-span-8",
  imageSrc: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  description: "An exploration of sustainable Scandinavian timber structure designed to seamlessly harmonize with raw forest topography.",
  year: "2025",
  client: "Nordic Cultural Foundation",
  isVideo: false,
  otherWorks: [
    { id: "flick-delivery", title: "Project 01: Flick Delivery" },
    { id: "luckys-custom-homes", title: "Project 02: Lucky’s Custom Homes" }
  ]
});

// Spatial Card Project 02: Minimal Lounge Chair
export const minimalLoungeChairProject = (t = {}) => ({
  id: "minimal-lounge-chair",
  title: t.projects?.lounge?.title || "Minimal Lounge Chair",
  subtitle: "Ergonomic object exploration with raw tactile materials.",
  category: t.projects?.lounge?.category || "Furniture Design",
  span: "bento-span-4",
  imageSrc: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80",
  coverImage: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80",
  description: "Precision-milled aluminum frame meets vegetable-tanned leather for a timeless interior statement.",
  year: "2025",
  client: "Studio Edition",
  isVideo: false,
  otherWorks: [
    { id: "flick-delivery", title: "Project 01: Flick Delivery" }
  ]
});

// Spatial Card Project 03: Concrete Horizon Villa
export const concreteVillaProject = (t = {}) => ({
  id: "concrete-horizon-villa",
  title: t.projects?.villa?.title || "Concrete Horizon Villa",
  subtitle: "Monolithic concrete architecture embedded into coastal cliffs.",
  category: t.projects?.villa?.category || "Architecture",
  span: "bento-span-4",
  imageSrc: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
  coverImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
  description: "Form-finished board-formed concrete cantilevered over ocean waters, framing horizon views through floor-to-ceiling glass.",
  year: "2026",
  client: "Private Client",
  isVideo: false,
  otherWorks: [
    { id: "aura-smart-speaker", title: "Project 01: AURA Smart Speaker" }
  ]
});

// Spatial Card Project 04: Monolith Interior Studio
export const monolithStudioProject = (t = {}) => ({
  id: "monolith-interior-studio",
  title: t.projects?.monolith?.title || "Monolith Interior Studio",
  subtitle: "Subterranean workspace focused on light discipline.",
  category: t.projects?.monolith?.category || "Interior Space",
  span: "bento-span-8",
  imageSrc: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
  coverImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
  description: "A dark, atmospheric creative office utilizing recessed indirect lighting strips and acoustic micro-perforated steel panels.",
  year: "2024",
  client: "Monolith Labs",
  isVideo: false,
  otherWorks: [
    { id: "luckys-custom-homes", title: "Project 01: Lucky’s Custom Homes" }
  ]
});

// -------------------------------------------------------------
// SEPARATE PRACTICE GETTERS
// -------------------------------------------------------------

/**
 * Returns cards exclusively for Spatial practice grid
 */
export const getSpatialProjects = (t = {}) => [
  nordicPavilionProject(t),
  minimalLoungeChairProject(t),
  concreteVillaProject(t),
  monolithStudioProject(t)
];

/**
 * Returns cards exclusively for Cinematic practice grid (Only active production projects)
 */
export const getCinematicProjects = (t = {}) => [
  flickDeliveryProject(t),
  luckysCustomHomesProject(t)
];

// -------------------------------------------------------------
// GLOBAL RESOLVER
// -------------------------------------------------------------

/**
 * Resolves any project by ID (including Hero and all active practice cards)
 */
export const getAllProjects = (t = {}) => {
  const map = new Map();
  
  // Register Hero
  const aura = auraProject(t);
  map.set(aura.id, aura);

  // Register Spatial & Cinematic Cards
  [...getSpatialProjects(t), ...getCinematicProjects(t)].forEach((p) => map.set(p.id, p));

  return Array.from(map.values());
};

const projectsData = getAllProjects();
export default projectsData;