import React from 'react';
import { useStudioTheme } from '../context/ThemeContext.jsx';

export default function AboutSection() {
  const { t } = useStudioTheme();

  const capabilities = [
    {
      num: "01",
      title: "Spatial & Architectural Modeling",
      desc: "Comprehensive architectural visualization, 3D spatial design, and detailed landscaping layouts."
    },
    {
      num: "02",
      title: "Furniture & Product Design",
      desc: "Custom furniture concepts, industrial design blueprints, and high-fidelity 3D material rendering."
    },
    {
      num: "03",
      title: "Brand Strategy & Systems",
      desc: "Visual identities, comprehensive style guides, logo systems, and creative art direction."
    },
    {
      num: "04",
      title: "3D & Digital Motion",
      desc: "Cinematic render loops, product visualization, and logo animation utilizing Blender, Cinema 4D, and Adobe Creative Suite."
    },
    {
      num: "05",
      title: "UI/UX Design",
      desc: "User-centric web and mobile interfaces engineered in Figma for seamless digital interactions."
    }
  ];

  return (
    <section className="about-section py-20" id="about">
      {/* Standardized alignment wrapper */}
      <div className="mx-auto max-w-7xl px-6 md:px-12 w-full space-y-16">
        
        {/* Main Narrative & Header */}
        <div className="about-grid grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="about-container lg:col-span-5 space-y-3">
            <h2 className="text-3xl md:text-5xl font-light tracking-tight">
              {t.about?.title || "ABOUT SIAWSH"}
            </h2>
            <p className="text-xl md:text-2xl font-normal leading-snug opacity-90">
              Bridging physical space, brand strategy, and digital motion.
            </p>
          </div>

          <div className="lg:col-span-7 space-y-6 text-base md:text-lg leading-relaxed opacity-80">
            <p>
              SIAWSH is a multidisciplinary design studio led by Siavash Afsari, operating at the intersection of spatial design, brand strategy, and digital motion. The studio helps ambitious technology startups, architectural clients, and established brands translate complex ideas into clear, tactile, and high-impact visual systems.
            </p>
            <p>
              Rather than treating architecture, furniture, identity, and interface as separate disciplines, SIAWSH approaches creative work as a unified problem-solving framework. Every project bridges physical environment and digital execution to elevate spatial experiences, strengthen brand perception, and deliver measurable commercial value.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid grid grid-cols-1 sm:grid-cols-2 gap-8 border-y border-white/10 py-8">
          <div className="stat-card">
            <span className="stat-number block text-4xl md:text-5xl font-light mb-1">10+</span>
            <span className="stat-label text-xs uppercase tracking-widest opacity-60">Years of Multidisciplinary Design</span>
          </div>
          <div className="stat-card">
            <span className="stat-number block text-4xl md:text-5xl font-light mb-1">40+</span>
            <span className="stat-label text-xs uppercase tracking-widest opacity-60">Commissions & Projects</span>
          </div>
        </div>

        {/* Core Capabilities */}
        <div className="capabilities-block space-y-8">
          <h3 className="text-xs uppercase tracking-widest opacity-60 font-mono">
            Core Capabilities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((cap) => (
              <div key={cap.num} className="capability-card p-6 border border-white/10 rounded-lg space-y-3">
                <span className="text-xs font-mono opacity-50 block">{cap.num}</span>
                <h4 className="text-lg font-medium">{cap.title}</h4>
                <p className="text-sm opacity-70 leading-relaxed">{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* The Process */}
        <div className="process-block p-8 border border-white/10 rounded-xl space-y-3">
          <h3 className="text-xs uppercase tracking-widest opacity-60 font-mono">
            The Process
          </h3>
          <p className="text-base md:text-lg leading-relaxed opacity-90">
            Design is fundamentally about clarity, form, and function. By maintaining a collaborative and meticulous workflow, SIAWSH ensures that every spatial curve, material render, and pixel aligns directly with key client objectives—moving seamlessly from architectural blueprinting to final digital launch.
          </p>
        </div>

      </div>
    </section>
  );
}