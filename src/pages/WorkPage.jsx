import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStudioTheme } from '../context/ThemeContext.jsx';
import { projectsData } from '../data/projectsData.js';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import './WorkPage.css';

function SmoothFloatCard({ project, isLight, index }) {
  const animationDelay = `${(index % 2) * 0.75}s`;

  return (
    <Link
      to={`/work/${project.id}`}
      className={`group relative block rounded-none transition-all duration-700 ease-out overflow-hidden border active:scale-[0.99] hover:shadow-2xl ${
        isLight
          ? 'bg-neutral-50 border-neutral-300 text-black hover:shadow-black/10'
          : 'bg-black border-neutral-800 text-white hover:shadow-white/5'
      }`}
      style={{
        animation: 'ultraSmoothFloat 6s ease-in-out infinite alternate',
        animationDelay: animationDelay,
      }}
    >
      {/* Media Wrapper */}
      <div className={`media-wrapper aspect-16/10 w-full overflow-hidden relative border-b ${
        isLight ? 'bg-neutral-100 border-neutral-300' : 'bg-neutral-950 border-neutral-800'
      }`}>
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
      <div className="card-info p-5 md:p-6 flex items-start justify-between gap-6 min-h-110px">
        <div className="w-1/2 md:w-[58%]">
          <h3 className={`text-base md:text-lg font-bold tracking-tight leading-snug transition-colors ${
            isLight ? 'text-black group-hover:text-neutral-600' : 'text-white group-hover:text-neutral-300'
          }`}>
            {project.title}
          </h3>
        </div>

        <div className="w-1/2 md:w-[42%] text-right">
          <p className={`text-[10px] md:text-[11px] font-mono uppercase tracking-wider leading-relaxed ${
            isLight ? 'text-neutral-600' : 'text-neutral-400'
          }`}>
            {project.subtitle || project.specs?.deliverables || 'SELECTED PRACTICE'}
          </p>
        </div>
      </div>
    </Link>
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

      <main className="work-container pt-28 md:pt-36 pb-20 md:pb-28 px-6 md:px-12 max-w-7xl mx-auto">
        <header className="work-header mb-10 md:mb-14">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
            {lang === 'fa' ? 'آرشیو پروژه ها' : 'Selected Works'}
          </h1>
          <p className={`max-w-xl text-sm md:text-base leading-relaxed ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
            {lang === 'fa'
              ? 'مجموعه پروژه‌های طراحی فضایی، موشن گرافیک سه‌بعدی و برندینگ.'
              : 'A curated index of spatial architecture, kinetic branding, and 3D motion design.'}
          </p>

          <div className={`filter-bar flex flex-nowrap sm:flex-wrap gap-2 md:gap-3 mt-6 md:mt-8 border-b pb-5 overflow-x-auto no-scrollbar ${
            isLight ? 'border-neutral-200' : 'border-neutral-800'
          }`}>
            {filterCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveFilter(cat.id)}
                className={`filter-pill whitespace-nowrap text-[11px] md:text-xs uppercase tracking-widest px-4 md:px-5 py-2 rounded-none transition-all duration-300 border ${
                  activeFilter === cat.id
                    ? isLight
                      ? 'bg-black text-white font-bold border-black'
                      : 'bg-white text-black font-bold border-white'
                    : isLight
                      ? 'bg-white hover:bg-neutral-100 text-neutral-600 border-neutral-300'
                      : 'bg-black hover:bg-neutral-900 text-neutral-400 border-neutral-800'
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