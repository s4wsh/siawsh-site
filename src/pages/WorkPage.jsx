import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStudioTheme } from '../context/ThemeContext.jsx';
import { projectsData } from '../data/projectsData.js';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import ShareButtons from '../components/ShareButtons.jsx';
import './WorkPage.css';

function SmoothFloatCard({ project, isLight, index }) {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const animationDelay = `${(index % 2) * 0.75}s`;

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

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`group relative block rounded-none backdrop-blur-sm border transition-all duration-500 overflow-hidden ${
        isLight
          ? 'border-black/10 bg-black/2 hover:border-black/30 text-black'
          : 'border-white/10 bg-white/2 hover:border-white/20 text-white'
      }`}
      style={{
        animation: 'ultraSmoothFloat 6s ease-in-out infinite alternate',
        animationDelay: animationDelay,
      }}
    >
      {/* Dynamic Cursor Sheen Overlay */}
      <div
        className="pointer-events-none absolute inset-0 rounded-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out z-10"
        style={{ background: sheenColor }}
      />

      {/* Main Link Wrapper */}
      <Link to={`/work/${project.id}`} className="block active:scale-[0.99] transition-transform duration-300">
        {/* Media Wrapper - Standardized to aspect-video (16:9) */}
        <div
          className={`media-wrapper aspect-video w-full overflow-hidden relative border-b ${
            isLight ? 'border-black/10 bg-black/5' : 'border-white/10 bg-white/5'
          }`}
        >
          {project.cardVideo ? (
            <video
              src={project.cardVideo}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <img
              src={project.heroImage}
              alt={project.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}
        </div>

        {/* Card Info */}
        <div className="card-info p-6 flex items-start justify-between gap-4 min-h-25 relative z-20">
          <div className="w-1/2 md:w-[58%]">
            <h3
              className={`text-base md:text-xl font-light tracking-tight leading-snug transition-colors ${
                isLight ? 'text-black group-hover:opacity-75' : 'text-white group-hover:opacity-75'
              }`}
            >
              {project.title}
            </h3>
          </div>

          <div className="w-1/2 md:w-[42%] text-right">
            <p
              className={`text-[10px] md:text-[11px] font-mono uppercase tracking-widest leading-relaxed ${
                isLight ? 'text-black/50' : 'text-white/50'
              }`}
            >
              {project.subtitle || project.specs?.deliverables || 'SELECTED PRACTICE'}
            </p>
          </div>
        </div>
      </Link>

      {/* Embedded Share Action Bar per Card - Ultra-compact button height spacing */}
      <div className="px-6 py-1.5 relative z-30 border-t border-current/10">
        <ShareButtons
          title={project.title}
          excerpt={project.subtitle || project.tagline}
          isLight={isLight}
        />
      </div>
    </div>
  );
}

export default function WorkPage() {
  const { isLight, lang } = useStudioTheme();
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    document.title = "Selected Works — SIAWSH Studio";
  }, []);

  const filterCategories = [
    { id: 'all', labelEn: 'All Works', labelFa: 'همه آثار' },
    { id: 'spatial', labelEn: 'Spatial Design', labelFa: 'طراحی فضایی' },
    { id: 'cinematic', labelEn: '3D Motion', labelFa: 'موشن سه‌بعدی' },
    { id: 'branding', labelEn: 'Kinetic Branding', labelFa: 'برندینگ حرکتی' },
  ];

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') return projectsData;
    return projectsData.filter((project) =>
      project.categoryType?.includes(activeFilter)
    );
  }, [activeFilter]);

  return (
    <div className={`work-page-wrapper relative min-h-screen transition-colors duration-500 ${isLight ? 'bg-white text-black' : 'bg-black text-white'}`}>
      <style>{`
        @keyframes ultraSmoothFloat {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
          100% {
            transform: translateY(0px);
          }
        }
      `}</style>

      <Navbar />

      <main className="work-container pt-32 md:pt-40 pb-16 md:pb-24 px-6 md:px-12 max-w-7xl mx-auto">
        <header className="work-header mb-12 md:mb-16">
          <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-4">
            {lang === 'fa' ? 'آرشیو پروژه ها' : 'Selected Works'}
          </h1>
          <p className={`max-w-xl text-sm md:text-base leading-relaxed ${isLight ? 'text-black/70' : 'text-white/70'}`}>
            {lang === 'fa'
              ? 'مجموعه پروژه‌های طراحی فضایی، موشن گرافیک سه‌بعدی و برندینگ.'
              : 'A curated index of spatial architecture, kinetic branding, and 3D motion design.'}
          </p>

          <div className={`filter-bar flex flex-nowrap sm:flex-wrap gap-2 md:gap-3 mt-6 md:mt-8 border-b pb-4 overflow-x-auto no-scrollbar ${
            isLight ? 'border-black/10' : 'border-white/10'
          }`}>
            {filterCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveFilter(cat.id)}
                className={`filter-pill whitespace-nowrap text-xs md:text-xs uppercase tracking-widest px-4 md:px-5 py-2 rounded-none transition-all duration-300 border ${
                  activeFilter === cat.id
                    ? isLight
                      ? 'bg-black text-white font-medium border-black'
                      : 'bg-white text-black font-medium border-white'
                    : isLight
                      ? 'bg-black/2 hover:bg-black/5 text-black/70 border-black/10'
                      : 'bg-white/2 hover:bg-white/5 text-white/70 border-white/10'
                }`}
              >
                {lang === 'fa' ? cat.labelFa : cat.labelEn}
              </button>
            ))}
          </div>
        </header>

        <section className="work-grid grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {filteredProjects.map((project, index) => (
            <SmoothFloatCard key={project.id} project={project} isLight={isLight} index={index} />
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}