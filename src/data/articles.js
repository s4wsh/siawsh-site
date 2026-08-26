export const ARTICLES = [
  {
    slug: 'future-of-spatial-design',
    title: 'The Shift Toward Spatial Architecture in Real-Time Engines',
    date: 'AUG 2026',
    category: 'Spatial Design',
    readTime: '5 min read',
    excerpt: 'Exploring how real-time Ray Tracing and Neural Rendering redefine architectural pre-visualization.',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    
    // SEO & OpenGraph Metadata
    metaTitle: 'Spatial Architecture & Real-Time Engines | SIAWSH Insights',
    metaDescription: 'An in-depth analysis of hardware-accelerated ray tracing, WebGPU shader targets, and real-time spatial computing workflows.',
    keywords: ['Spatial Design', 'Real-Time Rendering', 'WebGPU', 'Architectural Visualization', 'Ray Tracing'],
    
    // Author Profile
    author: {
      name: 'SIAWSH Studio',
      role: 'Spatial Computing R&D',
      avatar: '/favicon.svg',
    },

    // Structured Article Content
    content: [
      {
        type: 'lead',
        text: 'Real-time rendering engines have transitioned from niche gaming frameworks into foundational assets for high-end architectural visualization and spatial interaction.'
      },
      {
        type: 'heading',
        text: '01. Elimination of Frame Latency'
      },
      {
        type: 'paragraph',
        text: 'With hardware-accelerated ray tracing and real-time global illumination, design decisions no longer require hours of waiting for frame renders. Iteration cycles happen in milliseconds.'
      },
      {
        type: 'quote',
        text: 'Spatial computing isn\'t just about display hardware—it\'s about building real-time environments that react dynamically to user intent.'
      },
      {
        type: 'heading',
        text: '02. WebGPU & Browser-Native Shader Performance'
      },
      {
        type: 'paragraph',
        text: 'By compiling shaders directly to WebGPU targets, web applications can present high-fidelity spatial models straight inside modern browsers without pixel-streaming overhead.'
      }
    ]
  },
  {
    slug: 'cinematic-lighting-in-webgl',
    title: 'Cinematic Lighting Techniques for Web Browser Environments',
    date: 'JUL 2026',
    category: '3D Motion',
    readTime: '8 min read',
    excerpt: 'How to optimize shadow cascades and post-processing bloom without dropping frame rates on mobile devices.',
    coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    
    // SEO & OpenGraph Metadata
    metaTitle: 'Cinematic Lighting in WebGL & WebGPU | SIAWSH Insights',
    metaDescription: 'Techniques for optimizing shadow cascades, bloom post-processing, and specular accuracy while maintaining 60 FPS in browser environments.',
    keywords: ['WebGL', 'Cinematic Lighting', '3D Motion', 'Shadow Cascades', 'GPU Optimization'],
    
    // Author Profile
    author: {
      name: 'SIAWSH Studio',
      role: '3D Motion & Visual Engineering',
      avatar: '/favicon.svg',
    },

    // Structured Article Content
    content: [
      {
        type: 'lead',
        text: 'Creating cinematic atmospheres on the web demands balancing GPU memory budgets with rich lighting effects.'
      },
      {
        type: 'heading',
        text: '01. Shadow Cascades & Performance'
      },
      {
        type: 'paragraph',
        text: 'By restricting shadow cascades to key dynamic focal points, we maintain 60 FPS while preserving specular reflection accuracy.'
      }
    ]
  }
];