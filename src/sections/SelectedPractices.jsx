import React, { useState, useEffect, useRef } from 'react';
import { useStudioTheme } from '../context/ThemeContext.jsx';
import { projectsData } from '../data/projectsData.js';
import TunnelGrid from '../components/TunnelGrid.jsx';
import ProjectModal from '../components/ProjectModal.jsx';

export default function SelectedPractices() {
  const canvasRef = useRef(null);
  const { mode, isLight, lang, t } = useStudioTheme();
  const [selectedProject, setSelectedProject] = useState(null);

  // Filter projects by current practice (spatial or cinematic)
  const filteredProjects = projectsData.filter(project =>
    project.categoryType?.includes(mode)
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particles/Stars setup
    const numParticles = window.innerWidth < 768 ? 80 : 140;
    const particles = Array.from({ length: numParticles }, () => ({
      x: (Math.random() - 0.5) * canvas.width * 2,
      y: (Math.random() - 0.5) * canvas.height * 2,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random(),
      speed: Math.random() * 0.012 + 0.004,
    }));

    // Scroll positioning synced for camera motion
    let scrollY = window.scrollY;
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      angle += 0.002;
      const cameraX = Math.sin(angle) * (window.innerWidth < 768 ? 40 : 120);
      const cameraY = scrollY * 0.35 + Math.cos(angle * 0.8) * 50;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Smooth atmospheric gradient fading to transparent at top and bottom boundaries
      if (isLight) {
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, 'rgba(226, 232, 240, 0)');     // 100% transparent top edge
        gradient.addColorStop(0.15, 'rgba(226, 232, 240, 0.8)'); // Smooth fade-in
        gradient.addColorStop(0.5, '#f1f5f9');                  // Middle atmospheric tone
        gradient.addColorStop(0.85, 'rgba(248, 250, 252, 0.8)');// Smooth fade-out
        gradient.addColorStop(1, 'rgba(248, 250, 252, 0)');     // 100% transparent bottom edge
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Render floating particles
      particles.forEach((particle) => {
        let projectedX = particle.x - cameraX;
        let projectedY = particle.y - cameraY;

        if (projectedX < -centerX * 1.5) particle.x += canvas.width * 2;
        if (projectedX > centerX * 1.5) particle.x -= canvas.width * 2;
        if (projectedY < -centerY * 1.5) particle.y += canvas.height * 2;
        if (projectedY > centerY * 1.5) particle.y -= canvas.height * 2;

        const screenX = centerX + projectedX;
        const screenY = centerY + projectedY;

        particle.alpha += particle.speed;
        if (particle.alpha > 1 || particle.alpha < 0) {
          particle.speed = -particle.speed;
        }

        ctx.beginPath();
        ctx.arc(screenX, screenY, particle.radius, 0, Math.PI * 2);

        if (isLight) {
          ctx.fillStyle = `rgba(180, 150, 100, ${Math.abs(particle.alpha) * 0.35})`;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(particle.alpha) * 0.8})`;
        }
        
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
  }, [isLight]);

  return (
    <section className={`relative overflow-hidden pt-8 pb-2 md:pt-10 md:pb-3 transition-colors duration-500 ${
      isLight ? 'bg-transparent text-black' : 'bg-black text-white'
    }`}>
      {/* Background Canvas Effect */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
      />

      {/* Standardized max-width container wrapper */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 w-full">
        {/* Section Header */}
        <div className={`flex items-center justify-between border-b pb-6 ${
          isLight ? 'border-black/10' : 'border-white/10'
        }`}>
          <h2 className="text-3xl font-light tracking-tight">{t.works.selectedPractices}</h2>
          <span className={`text-xs tracking-widest uppercase ${
            isLight ? 'text-black/50' : 'text-white/50'
          }`}>
            {new Intl.NumberFormat(lang === 'fa' ? 'fa-IR' : 'en-US').format(filteredProjects.length)} {filteredProjects.length === 1 ? t.works.project : t.works.projects}
          </span>
        </div>

        {/* Dynamic Cards Grid */}
        <TunnelGrid projects={filteredProjects} onSelectProject={setSelectedProject} />

        {/* Detail Modal */}
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