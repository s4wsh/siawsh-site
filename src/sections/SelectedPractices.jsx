import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useStudioTheme } from '../context/ThemeContext.jsx';
import { projectsData } from '../data/projectsData.js';
import TunnelGrid from '../components/TunnelGrid.jsx';
import ProjectModal from '../components/ProjectModal.jsx';
import { safeArray } from '../utils/localize.js';

/* Must be identical to the hero surface colors and index.css (--surface-spatial) */
const SURFACE_LIGHT = '#e8edf4'; // blue-gray
const SURFACE_DARK = '#0b0b0d';

const SPATIAL_TAGS = [
  { id: 'all', en: 'All Spatial', fa: 'همه پروژه‌های معماری' },
  { id: 'interior', en: 'Interior Design', fa: 'طراحی داخلی' },
  { id: 'exterior', en: 'Exterior Architecture', fa: 'طراحی نما و معمارانه' },
  { id: 'cabinets', en: 'Cabinets & Joinery', fa: 'کابینت و دکوراسیون' },
  { id: 'furniture', en: 'Custom Furniture Concepts', fa: 'طراحی اختصاصی مبلمان' },
  { id: 'prototypes', en: 'Scale Prototypes & Fabrication', fa: 'ماکت و شیت‌های ساخت' },
  { id: 'murals', en: 'Environmental Art & Murals', fa: 'نقاشی دیواری و هنر محیطی' },
  { id: 'cad-specs', en: 'CAD & Construction Specs', fa: 'نقشه‌های فاز دو و اجرایی' },
];

const CINEMATIC_TAGS = [
  { id: 'all', en: 'All Cinematic', fa: 'همه پروژه‌های سینماتیک' },
  { id: 'cgi-vfx', en: 'CGI & VFX Sequences', fa: 'جلوه‌های ویژه و سی‌جی‌ای' },
  { id: '3d-product', en: '3D Product Animation', fa: 'انیمیشن و رندر محصول ۳بعدی' },
  { id: 'commercial-teasers', en: 'Cinematic Commercial Teasers', fa: 'تیزرهای تبلیغاتی سینماتیک' },
  { id: 'motion-kinetic', en: 'Kinetic Typography & Motion', fa: 'موشن گرافیک و تایپوگرافی حرکتی' },
  { id: 'brand-identity', en: 'Brand Identity & Guidelines', fa: 'هویت بصری و دفترچه برند' },
  { id: 'ui-ux-web', en: 'Web UI/UX & Interactive 3D', fa: 'طراحی وب و مدل‌های تعاملی ۳بعدی' },
  { id: 'color-grading', en: 'Node-Based Color Grading', fa: 'تصحیح رنگ حرفه‌ای' },
];

export default function SelectedPractices() {
  const canvasRef = useRef(null);
  const sectionRef = useRef(null);
  const { mode, isLight, lang, t } = useStudioTheme();
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeSubTag, setActiveSubTag] = useState('all');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.05 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setActiveSubTag('all');
  }, [mode]);

  const currentServiceTags = useMemo(
    () => (mode === 'cinematic' ? CINEMATIC_TAGS : SPATIAL_TAGS),
    [mode]
  );

  const baseModeProjects = useMemo(
    () =>
      (projectsData || []).filter((project) =>
        safeArray(project.categoryType).includes(mode)
      ),
    [mode]
  );

  const filteredProjects = useMemo(() => {
    if (activeSubTag === 'all') return baseModeProjects;
    return baseModeProjects.filter((project) =>
      safeArray(project.tags).includes(activeSubTag)
    );
  }, [baseModeProjects, activeSubTag]);

  // Particle canvas (no background fill: the section owns the solid color)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isVisible) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      canvas.width = parent ? parent.offsetWidth : window.innerWidth;
      canvas.height = parent ? parent.offsetHeight : window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const isMobile = window.innerWidth < 768;
    const numParticles = isMobile ? 60 : 110;
    const particles = Array.from({ length: numParticles }, () => ({
      x: (Math.random() - 0.5) * canvas.width * 2,
      y: (Math.random() - 0.5) * canvas.height * 2,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random(),
      speed: Math.random() * 0.012 + 0.004,
    }));

    let scrollY = window.scrollY;
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    let angle = 0;

    const render = () => {
      if (document.hidden) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      angle += 0.002;
      const cameraX = Math.sin(angle) * (isMobile ? 40 : 120);
      const cameraY = scrollY * 0.35 + Math.cos(angle * 0.8) * 50;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      particles.forEach((particle) => {
        const projectedX = particle.x - cameraX;
        const projectedY = particle.y - cameraY;

        if (projectedX < -centerX * 1.5) particle.x += canvas.width * 2;
        if (projectedX > centerX * 1.5) particle.x -= canvas.width * 2;
        if (projectedY < -centerY * 1.5) particle.y += canvas.height * 2;
        if (projectedY > centerY * 1.5) particle.y -= canvas.height * 2;

        const screenX = centerX + projectedX;
        const screenY = centerY + projectedY;

        particle.alpha += particle.speed;
        if (particle.alpha > 1 || particle.alpha < 0) particle.speed = -particle.speed;

        ctx.beginPath();
        ctx.arc(screenX, screenY, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = isLight
          ? `rgba(180, 150, 100, ${Math.abs(particle.alpha) * 0.35})`
          : `rgba(255, 255, 255, ${Math.abs(particle.alpha) * 0.8})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isLight, isVisible]);

  const numberFmt = new Intl.NumberFormat(lang === 'fa' ? 'fa-IR' : 'en-US');

  return (
    <section
      ref={sectionRef}
      style={{ backgroundColor: isLight ? SURFACE_LIGHT : SURFACE_DARK }}
      className={`relative overflow-hidden pt-10 pb-4 md:pt-14 md:pb-6 transition-colors duration-500 font-['Vazirmatn',sans-serif] ${
        isLight ? 'text-black' : 'text-white'
      }`}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 w-full">
        <div
          className={`flex items-center justify-between border-b pb-6 ${
            isLight ? 'border-black/10' : 'border-white/10'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-normal tracking-normal">
            {t.works.selectedPractices}
          </h2>
          <span
            className={`text-sm md:text-base tracking-wide font-normal ${
              isLight ? 'text-black/60' : 'text-white/60'
            }`}
          >
            {numberFmt.format(filteredProjects.length)}{' '}
            {filteredProjects.length === 1 ? t.works.project : t.works.projects}
          </span>
        </div>

        <div
          className={`mb-10 w-full border-b pb-5 pt-5 ${
            isLight ? 'border-black/10' : 'border-white/10'
          }`}
        >
          <div className="flex flex-wrap items-center gap-x-7 gap-y-4 text-sm md:text-base font-normal tracking-wide">
            {currentServiceTags.map((tag) => {
              const isActive = activeSubTag === tag.id;
              const tagLabel = lang === 'fa' ? tag.fa : tag.en;
              const count =
                tag.id === 'all'
                  ? baseModeProjects.length
                  : baseModeProjects.filter((p) => safeArray(p.tags).includes(tag.id)).length;

              return (
                <button
                  key={tag.id}
                  onClick={() => setActiveSubTag(tag.id)}
                  className={`relative py-1.5 transition-all duration-300 flex items-center gap-2 rounded-none ${
                    isActive
                      ? isLight
                        ? 'text-black font-semibold'
                        : 'text-white font-semibold'
                      : isLight
                      ? 'text-black/50 hover:text-black/90'
                      : 'text-white/50 hover:text-white/90'
                  }`}
                >
                  <span className="leading-relaxed">{tagLabel}</span>
                  <span className="text-[11px] md:text-xs opacity-70 font-normal">
                    ({numberFmt.format(count)})
                  </span>
                  {isActive && (
                    <span
                      className={`absolute bottom-0 left-0 right-0 h-2px transition-all duration-300 ${
                        isLight ? 'bg-black' : 'bg-white'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <TunnelGrid projects={filteredProjects} onSelectProject={setSelectedProject} />

        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          allProjects={projectsData}
          onSelectProject={setSelectedProject}
        />
      </div>
    </section>
  );
}