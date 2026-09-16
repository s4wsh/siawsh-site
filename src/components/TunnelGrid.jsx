import React, { memo } from 'react';
import ProjectCard from './ProjectCard.jsx';

// Inline GPU-accelerated CSS styles defined outside component render loop
const FLOAT_STYLES = `
  @keyframes floatUp {
    0%, 100% {
      transform: translate3d(0, 0px, 0);
    }
    50% {
      transform: translate3d(0, -16px, 0);
    }
  }

  .animate-float-even {
    animation: floatUp 12s ease-in-out infinite;
    will-change: transform;
    backface-visibility: hidden;
  }

  .animate-float-odd {
    animation: floatUp 14s ease-in-out infinite 2s;
    will-change: transform;
    backface-visibility: hidden;
  }
`;

function TunnelGrid({ projects, onSelectProject }) {
  if (!projects || projects.length === 0) return null;

  return (
    <div className="relative w-full py-12">
      {/* Dynamic Keyframes for smooth subtle card floating */}
      <style>{FLOAT_STYLES}</style>

      {/* True 2-Column Masonry preserving equal vertical margins between cards */}
      <div className="columns-1 gap-8 md:columns-2">
        {projects.map((project, index) => {
          const isOdd = index % 2 === 1;
          const floatClass = isOdd ? 'animate-float-odd' : 'animate-float-even';

          return (
            <div 
              key={`${project.id}-${index}`} 
              className={`mb-8 break-inside-avoid transition-all duration-700 ${floatClass}`}
            >
              <ProjectCard project={project} onClick={onSelectProject} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default memo(TunnelGrid);