import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStudioTheme } from '../context/ThemeContext.jsx';

export default function AboutSection({ teaser = false }) {
  const { t, activeCategory, currentCategory, mode, isLight } = useStudioTheme();
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  // Determine active discipline mode (fallback to 'spatial')
  const category = activeCategory || currentCategory || mode || 'spatial';
  const isCinematic = category === 'cinematic' || category === 'motion';

  // Capabilities List
  const capabilities = [
    {
      number: "01",
      title: "Spatial & Architectural Visualization",
      description: "High-fidelity architectural rendering, 3D spatial modeling, environment design, and landscape layouts.",
      deliverables: "Bespoke Spatial Layouts, 3D Renders, CAD Blueprint Consultation"
    },
    {
      number: "02",
      title: "Custom Furniture & Industrial Design",
      description: "Bespoke furniture conceptualization, industrial design blueprints, tactile material exploration, and 3D CAD visualization.",
      deliverables: "Custom Furniture Concepts, Physical Mockups, Material Spec Sheets"
    },
    {
      number: "03",
      title: "Brand Strategy & Kinetic Systems",
      description: "Comprehensive visual identity systems, brand architecture, kinetic logo motion, and strategic creative art direction.",
      deliverables: "Brand Guidelines, Logo Motion Systems, Design Systems"
    },
    {
      number: "04",
      title: "3D Motion Graphics & Video Post-Production",
      description: "Cinematic CGI render loops, photorealistic product animations, professional color grading, and motion sequences created with Blender, DaVinci Resolve, and After Effects.",
      deliverables: "3D Product Animation, Color Graded CGI Loops, Kinetic Typography"
    },
    {
      number: "05",
      title: "Digital UI/UX & Web Architecture",
      description: "User-centric web interfaces and interactive 3D showcases engineered in Figma and built for modern web deployment.",
      deliverables: "Web Application UI, Interactive 3D Web Models, Prototypes"
    }
  ];

  // Tooling Ecosystem List
  const toolsList = [
    "Blender",
    "Adobe After Effects",
    "DaVinci Resolve",
    "Generative AI Tools",
    "Figma",
    "Photoshop",
    "Illustrator",
    "Adobe Audition",
    "React",
    "Tailwind CSS",
    "Vercel"
  ];

  // Cinematic / Motion Process Workflow Steps for SEO & Clarity
  const cinematicProcessSteps = [
    {
      step: "01",
      title: "Concept, Sketching & Storyboarding",
      description: "Initial visual exploration, hand-drawn wireframe sketches, dynamic storyboarding, and pacing blueprints to define movement and creative direction."
    },
    {
      step: "02",
      title: "3D Blockout & Animatic Draft",
      description: "Low-fidelity 3D modeling in Blender, keyframe animation timing, camera path blockouts, and rapid prototype animatics for early client validation."
    },
    {
      step: "03",
      title: "Texturing, Lighting & Simulation",
      description: "Physically-based material setup, lighting environments, cloth or particle dynamics simulations, and high-fidelity render testing."
    },
    {
      step: "04",
      title: "Color Grading, Sound & Delivery",
      description: "Final CGI rendering, node-based color grading in DaVinci Resolve, sound design pass in Adobe Audition, and optimized digital export."
    }
  ];

  // Cursor movement tracking for card sheen overlay
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.min(Math.max(((e.clientX - rect.left) / rect.width) * 100, 0), 100);
    const y = Math.min(Math.max(((e.clientY - rect.top) / rect.height) * 100, 0), 100);
    setMousePos({ x, y });
  };

  const angle = Math.atan2(mousePos.y - 50, mousePos.x - 50) * (180 / Math.PI) + 90;
  const sheenColor = isLight
    ? `linear-gradient(${angle}deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.05) ${mousePos.x}%, rgba(0,0,0,0) 100%)`
    : `linear-gradient(${angle}deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.08) ${mousePos.x}%, rgba(255,255,255,0) 100%)`;

  // Homepage Teaser Card
  if (teaser) {
    return (
      <section className="about-teaser-section py-20" id="about">
        <div className="mx-auto max-w-7xl px-6 md:px-12 w-full">
          <div
            onMouseMove={handleMouseMove}
            className={`group relative p-8 md:p-12 border rounded-none backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-8 transition-all duration-500 overflow-hidden ${
              isLight
                ? 'border-black/10 bg-black/2 hover:border-black/30'
                : 'border-white/10 bg-white/2 hover:border-white/20'
            }`}
          >
            <div
              className="pointer-events-none absolute inset-0 rounded-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"
              style={{ background: sheenColor }}
            />

            <div className="space-y-4 max-w-3xl relative z-10">
              <span className={`text-xs font-mono uppercase tracking-widest ${isLight ? 'opacity-50' : 'opacity-60'}`}>
                About SIAWSH
              </span>
              <h2 className="text-2xl md:text-4xl font-light tracking-tight leading-snug">
                Bridging physical space, brand strategy, and digital motion.
              </h2>
              <p className={`text-base md:text-lg line-clamp-2 ${isLight ? 'opacity-70' : 'opacity-75'}`}>
                SIAWSH is a multidisciplinary design studio led by Siavash Afsari, operating at the intersection of spatial design, brand strategy, and digital motion.
              </p>
            </div>

            <div className="shrink-0 relative z-10">
              <Link
                to="/about"
                className={`inline-flex items-center justify-center px-6 py-3 border rounded-none text-xs tracking-wider uppercase transition-all duration-300 ${
                  isLight
                    ? 'border-black/20 text-black hover:bg-black hover:text-white'
                    : 'border-white/20 text-white hover:bg-white hover:text-black'
                }`}
              >
                Read Full Profile →
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Full About Page View
  return (
    <article className="about-section py-16 md:py-24" id="about">
      <div className="mx-auto max-w-7xl px-6 md:px-12 w-full space-y-20">
        
        {/* Hero Header */}
        <header className="about-grid grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest opacity-50 block">
              Multidisciplinary Studio
            </span>
            <h1 className="text-3xl md:text-5xl font-light tracking-tight leading-tight">
              About SIAWSH
            </h1>
            <p className="text-xl md:text-2xl font-normal leading-snug opacity-90">
              Bridging physical space, brand strategy, and digital motion.
            </p>
          </div>

          <div className="lg:col-span-7 space-y-6 text-base md:text-lg leading-relaxed opacity-80">
            <p>
              SIAWSH is a multidisciplinary design studio led by Siavash Afsari, operating at the intersection of spatial design, brand strategy, and digital motion. The studio helps ambitious technology startups, architectural clients, and established brands translate complex ideas into clear, tactile, and high-impact visual systems.
            </p>
            <p>
              Specializing in 3D motion design, CGI product animation, custom furniture concepts, and kinetic typography that elevates visual storytelling across physical and digital mediums.
            </p>
          </div>
        </header>

        {/* Studio Stats */}
        <section aria-label="Studio Achievements" className="stats-grid grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className={`p-8 border rounded-none space-y-2 ${isLight ? 'border-black/10 bg-black/1' : 'border-white/10 bg-white/2'}`}>
            <span className="stat-number block text-4xl md:text-5xl font-light text-[#00f0ff]">
              10+
            </span>
            <span className="stat-label text-xs uppercase tracking-widest opacity-60 block">
              Years of Multidisciplinary Design Practice
            </span>
          </div>

          <div className={`p-8 border rounded-none space-y-2 ${isLight ? 'border-black/10 bg-black/1' : 'border-white/10 bg-white/2'}`}>
            <span className="stat-number block text-4xl md:text-5xl font-light text-[#00f0ff]">
              40+
            </span>
            <span className="stat-label text-xs uppercase tracking-widest opacity-60 block">
              Commissions & Global Projects Delivered
            </span>
          </div>
        </section>

        {/* Core Capabilities */}
        <section className="capabilities-block space-y-8" aria-label="Core Capabilities">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6 border-white/10">
            <h2 className="text-2xl md:text-3xl font-light tracking-tight">
              Core Capabilities
            </h2>
            <span className="text-xs font-mono opacity-50 uppercase tracking-widest">
              Services & Deliverables
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {capabilities.map((cap) => (
              <article 
                key={cap.number} 
                className={`p-8 border rounded-none space-y-4 flex flex-col justify-between transition-all duration-300 ${
                  isLight 
                    ? 'border-black/10 bg-black/1 hover:border-black/30' 
                    : 'border-white/10 bg-white/2 hover:border-white/20'
                }`}
              >
                <div className="space-y-3">
                  <span className="text-xs font-mono opacity-40 block">{cap.number}</span>
                  <h3 className="text-xl font-medium tracking-tight">{cap.title}</h3>
                  <p className="text-sm opacity-75 leading-relaxed">{cap.description}</p>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <span className="text-[11px] font-mono uppercase tracking-wider opacity-40 block mb-1">Deliverables</span>
                  <p className="text-xs opacity-60 font-mono">{cap.deliverables}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Tooling & Software Pipeline */}
        <section className={`p-8 md:p-10 border rounded-none space-y-6 ${isLight ? 'border-black/10 bg-black/1' : 'border-white/10 bg-white/2'}`}>
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest opacity-50 block">Production Pipeline</span>
            <h2 className="text-xl md:text-2xl font-light tracking-tight">Tooling & Software Ecosystem</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {toolsList.map((tool) => (
              <span 
                key={tool} 
                className={`px-4 py-2 text-xs font-mono border rounded-none transition-colors duration-200 ${
                  isLight 
                    ? 'border-black/15 bg-black/5 text-black hover:border-black/40' 
                    : 'border-white/15 bg-white/5 text-white hover:border-white/40'
                }`}
              >
                {tool}
              </span>
            ))}
          </div>
        </section>

        {/* Dynamic Methodology & Process Block */}
        {isCinematic ? (
          /* Motion / Cinematic Process Breakdown */
          <section className={`p-8 md:p-10 border rounded-none space-y-8 ${isLight ? 'border-black/10 bg-black/1' : 'border-white/10 bg-white/2'}`}>
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest opacity-50 block">
                Motion Pipeline
              </span>
              <h2 className="text-xl md:text-2xl font-light tracking-tight">
                Cinematic Motion Process: Sketching to Final Render
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {cinematicProcessSteps.map((step) => (
                <div 
                  key={step.step}
                  className={`p-6 border rounded-none space-y-3 ${
                    isLight ? 'border-black/10 bg-black/5' : 'border-white/10 bg-white/5'
                  }`}
                >
                  <span className="text-xs font-mono text-[#00f0ff] block font-bold">{step.step}</span>
                  <h3 className="text-base font-medium tracking-tight">{step.title}</h3>
                  <p className="text-xs opacity-70 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </section>
        ) : (
          /* Spatial Design Process Card */
          <section className={`p-8 md:p-10 border rounded-none space-y-4 ${isLight ? 'border-black/10 bg-black/1' : 'border-white/10 bg-white/2'}`}>
            <span className="text-xs font-mono uppercase tracking-widest opacity-50 block">
              Architectural Methodology
            </span>
            <h2 className="text-xl md:text-2xl font-light tracking-tight">
              Spatial Design Philosophy & Process
            </h2>
            <p className="text-base md:text-lg leading-relaxed opacity-80 max-w-4xl">
              Every spatial project begins with environmental research, site structural experimentation, and 3D CAD modeling. By maintaining control over early blueprint layouts, material selections, and custom furniture concepts, SIAWSH delivers cohesive spatial environments engineered for real-world impact.
            </p>
          </section>
        )}

      </div>
    </article>
  );
}