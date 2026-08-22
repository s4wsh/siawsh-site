import React from 'react';
import { useStudioTheme } from '../../context/ThemeContext';
import { getSpatialProjects, getCinematicProjects } from '../../data/projectsData';

export default function WorkSection({ onSelectProject }) {
  const { mode, t } = useStudioTheme();

  // Load project list dynamically using the new data helper functions
  const currentProjects = mode === 'spatial' ? getSpatialProjects(t) : getCinematicProjects(t);

  return (
    <section className="portfolio-section" id="work">
      <div className="section-header">
        <h2>{t.works.title}</h2>
        <span className="project-count">
          {currentProjects.length} {t.works.projects}
        </span>
      </div>

      <div className="portfolio-bento-grid">
        {currentProjects.map((project, index) => (
          <div
            key={project.title || index}
            className={`bento-card ${project.span}`}
            onClick={() => onSelectProject(project)}
          >
            {project.isVideo ? (
              <video
                src={project.previewVideoSrc}
                autoPlay
                muted
                loop
                playsInline
                className="bento-media"
              />
            ) : (
              <img
                src={project.imageSrc}
                alt={project.title}
                className="bento-media"
              />
            )}
            <div className="bento-info">
              <h3>{project.title}</h3>
              <span>{project.category}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
