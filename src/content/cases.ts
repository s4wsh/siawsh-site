// src/content/cases.ts

// --- Image captions: professional + skimmable ---
export type ProCaption = {
  what: string;  // what the image shows
  why: string;   // why it matters (design/strategy)
  how?: string;  // how it was achieved (process/technique)
};

export type CaseImage = {
  src: string;   // path under /public
  alt: string;
  caption?: string; // simple fallback
  pro?: ProCaption; // ✅ preferred
  width?: number;
  height?: number;
};

export type CaseSection = {
  heading?: string;
  paragraphs?: string[];
};

export type CaseVideo = {
  mp4?: string;   // remote or local
  webm?: string;  // local preferred
  poster?: string;
};

// --- Executive summary block (optional fields safe to omit) ---
export type CaseSummary = {
  challenge?: string;      // the problem/context
  objective?: string;      // goal/success criteria
  solution?: string;       // one-line solution statement
  how?: string[];          // 3–6 bullets describing approach
  impact?: string[];       // outcomes/validation bullets
  role?: string[];         // your responsibilities
  tools?: string[];        // toolchain (optional)
  timeline?: string;       // duration (optional)
};

export type CaseStudy = {
  slug: string;
  title: string;
  year?: string | number;
  tags?: string[];
  cover?: string;           // hero thumb
  excerpt?: string;
  date?: string | number | Date;
  lastModified?: string | number | Date;
  intro?: string;
  summary?: CaseSummary;    // ✅ new
  sections?: CaseSection[];
  images?: CaseImage[];
  video?: CaseVideo;
};

// ====== AURA (filled using your filenames) ======
export const CASES: CaseStudy[] = [
  {
    slug: "aura-speaker",
    title: "AURA — Engineering a Brand from Blueprint to Broadcast",
    year: 2025,
    tags: ["Branding", "Product", "3D", "Motion"],
    cover: "/cases/aura-speaker/stylish.png",
    excerpt: "Concept-to-launch pipeline: identity, believable 3D product, and broadcast motion.",
    intro:
      "AURA is a proof-of-capability brand built end-to-end—identity, industrial design language, photoreal 3D, and motion film.",
    summary: {
      challenge:
        "Show premium, commercial-grade craft without leaning on an existing client brand.",
      objective:
        "Demonstrate a credible launch system: strategy → product form language → visuals that sell the story.",
      solution:
        "Create a fictional but believable brand and design a hero product, then direct it to camera with a launch film and stills.",
      how: [
        "Blueprint → define brand pillars, audience, and visual tone.",
        "Framework → block-outs to lock proportions and usability.",
        "Finish → materials, lighting, and motion that feel tactile and real.",
        "Narrative → sequence shots to communicate value quickly.",
      ],
      impact: [
        "A reusable, end-to-end playbook for product/brand launches.",
        "Portfolio piece that reads as real—passes the ‘would you buy it?’ test.",
      ],
      role: ["Creative Direction", "Brand", "3D Modeling", "Lighting/Render", "Edit/Motion"],
      // tools and timeline are optional; add later if you want:
      // tools: ["Blender / C4D", "Octane/Redshift", "After Effects", "Photoshop"],
      // timeline: "2–3 weeks (nights/weekends)",
    },
    images: [
      {
        src: "/cases/aura-speaker/stylish.png",
        alt: "AURA hero angle",
        pro: {
          what: "Hero angle establishes the object’s stance and proportion.",
          why: "First read must land the premium positioning and silhouette.",
          how: "Key light + soft rim; shallow DOF to pull attention to the UI ring.",
        },
      },
      {
        src: "/cases/aura-speaker/zoomed.png",
        alt: "Top glass & ring UI close",
        pro: {
          what: "Close-up of the glass top, ring UI, and micro-bevel transitions.",
          why: "Sells craftsmanship—micro geometry is where products feel expensive.",
          how: "Tight bevels, controlled reflections, and minimal roughness variation.",
        },
      },
      {
        src: "/cases/aura-speaker/Aura - Material.png",
        alt: "Material board",
        pro: {
          what: "Material palette: anodized aluminum, glass, acoustic fabric.",
          why: "Defines tactile language and constrains finish choices.",
          how: "Material swatches calibrated against lighting scenarios used in shots.",
        },
      },
      {
        src: "/cases/aura-speaker/Aura - blueprint.png",
        alt: "Exploded blueprint",
        pro: {
          what: "Exploded diagram showing driver, mesh, enclosure, and assembly.",
          why: "Communicates engineering plausibility—not just a pretty render.",
          how: "Modeled key components and generated exploded views from the same rig.",
        },
      },
      {
        src: "/cases/aura-speaker/model 1.png",
        alt: "Early block-out",
        pro: {
          what: "Early CAD block-out to lock scale and ergonomics.",
          why: "Cheap iterations here prevent expensive fixes later.",
          how: "Simple primitives with live bevels; iterated under neutral lighting.",
        },
      },
      {
        src: "/cases/aura-speaker/stylish 2.png",
        alt: "Front portrait",
        pro: {
          what: "Front portrait emphasizing the ‘calm tech’ face.",
          why: "Brand reads as composed, not aggressive—aligned to target audience.",
          how: "High-key frontal key + subtle bounce; noise-free speculars.",
        },
      },
      {
        src: "/cases/aura-speaker/stylish 3.png",
        alt: "Mesh detail",
        pro: {
          what: "Perforated mesh and edge softness study.",
          why: "Edge quality separates concept art from believable product.",
          how: "Procedural perforation pattern; chamfer strategy tuned per radius.",
        },
      },
      {
        src: "/cases/aura-speaker/stylish 4.png",
        alt: "Angle study",
        pro: {
          what: "Angle study showing continuity from face to body.",
          why: "Checks the form language reads consistently at multiple views.",
          how: "Three-point setup with rim priority; minimal post.",
        },
      },
    ],
    video: {
      webm: "/media/hero/hero-loop.webm",
      mp4: "https://firebasestorage.googleapis.com/v0/b/siawsh-site.firebasestorage.app/o/final%20-%20aura%20speeaker-%20logo%20motion.mp4?alt=media&token=8074a25b-6a1c-4201-9c94-01e0060cf82f",
      poster: "/media/hero/hero-poster.jpg",
    },
    date: "2025-07-21",
    lastModified: "2025-09-01",
  },

  // Keep others below (example placeholder):
  {
    slug: "signal-brand",
    title: "Signal Brand System",
    year: 2023,
    tags: ["Graphic", "Motion"],
    cover: "/cases/signal-brand/cover.jpg",
    excerpt: "A crisp identity with motion as a first-class citizen.",
    intro: "A grid-first identity that scales from tiny UI to large signage.",
    sections: [
      {
        heading: "System",
        paragraphs: [
          "Typography, spacing, and color tokens defined in code.",
          "Motion patterns codified as reusable rules.",
        ],
      },
    ],
    images: [
      { src: "/cases/signal-brand/01.jpg", alt: "Logo grid" },
      { src: "/cases/signal-brand/02.jpg", alt: "Motion frames" },
    ],
    date: "2023-11-01",
  },
];
