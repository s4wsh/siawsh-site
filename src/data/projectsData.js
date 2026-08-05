// src/data/projectsData.js

const auraProject = (t = {}) => ({
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
  contextParagraph: "This project originated as a personal challenge to build a commercial-grade 3D and motion design showcase. The primary creative hurdle was clear: How do you demonstrate high-level technical rendering skills for a premium tech product without infringing on existing brand trademarks? The solution was to design an entirely original product from the ground up. Instead of borrowing a brand, AURA was born—a conceptual smart speaker rooted in architectural minimalism, premium physical textures, and immersive acoustic design.",
  moodboardImage: "/projects/aura-smart-speaker/moodboard.jpg",
  engineeringTitle: "Engineering an Identity & Technical Execution",
  engineeringParagraph: "Before drafting a single polygon in 3D space, a comprehensive blueprint was established to define the speaker's form, function, and ergonomic balance. The main body features a rounded rectangular prism with soft vertical curves and an integrated carrying handle carved directly into the top profile. High-fidelity acoustic drivers and passive radiators were modeled to match real-world audio engineering standards. Materiality was prioritized by contrasting tactile acoustic mesh fabric against cold, high-grade aluminum and capacitive, light-responsive glass touch controls.",
  explosionImage: "/projects/aura-smart-speaker/explosion-diagram.jpg",
  competitorParagraph: "By developing a bespoke hardware ecosystem, the project sits comfortably alongside design-forward audio leaders like Bang & Olufsen and Teenage Engineering. It demonstrates a complete end-to-end pipeline—from initial product blueprinting and CAD modeling to industrial texturing and commercial motion lighting.",
  ethosTitle: "The Design Ethos",
  ethosQuote: "AURA was designed at the intersection of minimalist architecture, natural materials, and ambient light—creating a product that feels both technologically advanced and warmly integrated into a living space.",
  ambientRender: "/projects/aura-smart-speaker/ambient-render.jpg",
  macroRender: "/projects/aura-smart-speaker/macro-fabric.jpg",
  otherWorks: [
    { id: "concrete-horizon-villa", title: "Project 02: Architectural Visualization & Spatial Lighting" },
    { id: "abstract-3d-showreel", title: "Project 03: Industrial Product Design & CGI Motion" }
  ],
  year: "2026",
  client: "Studio Concept",
  isVideo: true
});

// Spatial Practice Projects ONLY (Architecture, Furniture, Interior)
export const getSpatialProjects = (t = {}) => [
  {
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
    isVideo: false
  },
  {
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
    isVideo: false
  },
  {
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
    isVideo: false
  },
  {
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
    isVideo: false
  }
];

// Cinematic Practice Projects ONLY
export const getCinematicProjects = (t = {}) => [
  {
    id: "cybernetic-identity",
    title: t.projects?.cyber?.title || "Cybernetic Identity",
    subtitle: "Generative brand design system for autonomous platforms.",
    category: t.projects?.cyber?.category || "Graphic Design",
    span: "bento-span-4",
    imageSrc: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    description: "A dynamic, code-driven typographic identity system that mutates based on real-time network traffic and user interactions.",
    year: "2026",
    client: "Cyber Corp",
    isVideo: false
  },
  {
    id: "abstract-3d-showreel",
    title: t.projects?.showreel?.title || "Abstract 3D Showreel",
    subtitle: "Compilation of motion research and visual simulations.",
    category: t.projects?.showreel?.category || "Motion Graphics",
    span: "bento-span-8",
    imageSrc: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80",
    coverImage: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80",
    previewVideoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    description: "An annual retrospective showcase exploring fluid physics, optical distortion, and photorealistic spatial light.",
    year: "2025",
    client: "Studio Reel",
    isVideo: true
  },
  {
    id: "neonic-kinetic-branding",
    title: t.projects?.neonic?.title || "Neonic Kinetic Branding",
    subtitle: "High-contrast visual language for modern sound design.",
    category: t.projects?.neonic?.category || "Branding",
    span: "bento-span-8",
    imageSrc: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
    coverImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
    description: "Custom neon signages and audio-reactive motion graphics crafted for international electronic music venues.",
    year: "2025",
    client: "Neonic Records",
    isVideo: false
  }
];

// Helper function so detail pages can resolve any project by ID (including AURA)
export const getAllProjects = (t = {}) => {
  const spatial = getSpatialProjects(t);
  const cinematic = getCinematicProjects(t);
  const aura = auraProject(t);

  const map = new Map();
  map.set(aura.id, aura);
  [...spatial, ...cinematic].forEach((p) => map.set(p.id, p));
  
  return Array.from(map.values());
};

const projectsData = getAllProjects();
export default projectsData;