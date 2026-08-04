// src/data/projectsData.js

export const getSpatialProjects = (t) => [
  {
    title: t.projects?.nordic?.title || "Nordic Pavilion",
    category: t.projects?.nordic?.category || "Architecture",
    span: "bento-span-8",
    imageSrc: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    isVideo: false
  },
  {
    title: t.projects?.lounge?.title || "Minimal Lounge Chair",
    category: t.projects?.lounge?.category || "Furniture Design",
    span: "bento-span-4",
    imageSrc: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80",
    isVideo: false
  },
  {
    title: t.projects?.villa?.title || "Concrete Horizon Villa",
    category: t.projects?.villa?.category || "Architecture",
    span: "bento-span-4",
    imageSrc: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    isVideo: false
  },
  {
    title: t.projects?.monolith?.title || "Monolith Interior Studio",
    category: t.projects?.monolith?.category || "Interior Space",
    span: "bento-span-8",
    imageSrc: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    isVideo: false
  }
];

export const getCinematicProjects = (t) => [
  {
    title: t.projects?.cyber?.title || "Cybernetic Identity",
    category: t.projects?.cyber?.category || "Graphic Design",
    span: "bento-span-4",
    imageSrc: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    isVideo: false
  },
  {
    title: t.projects?.showreel?.title || "Abstract 3D Showreel",
    category: t.projects?.showreel?.category || "Motion Graphics",
    span: "bento-span-8",
    imageSrc: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80",
    previewVideoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    isVideo: true
  },
  {
    title: t.projects?.neonic?.title || "Neonic Kinetic Branding",
    category: t.projects?.neonic?.category || "Branding",
    span: "bento-span-8",
    imageSrc: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
    isVideo: false
  },
  {
    title: t.projects?.kinetic?.title || "Spatial Dynamics",
    category: t.projects?.kinetic?.category || "Visual Direction",
    span: "bento-span-4",
    imageSrc: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80",
    isVideo: false
  }
];