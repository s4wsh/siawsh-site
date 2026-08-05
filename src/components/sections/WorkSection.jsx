// src/components/sections/WorkSection.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudioTheme } from '../../context/ThemeContext';
import { getSpatialProjects, getCinematicProjects } from '../../data/projectsData';

export default function WorkSection() {
  const { mode, t } = useStudioTheme();
  const navigate = useNavigate();

  const currentProjects = mode === 'spatial' ? getSpatialProjects(t) : getCinematicProjects(t);

  return (
    <section className="portfolio-section" id="work">
      <div className="section-header">
        <h2>Selected Practice</h2>
        <span className="project-count">
          {currentProjects.length} Projects
        </span>
      </div>

      <div className="portfolio-bento-grid">
        {currentProjects.map((project, index) => {
          const isVideoMedia = project.isVideo || Boolean(project.heroVideo);
          const videoSrc = project.heroVideo || project.previewVideoSrc;
          const imageSrc = project.coverImage || project.imageSrc;

          return (
            <div
              key={project.id || index}
              className={`bento-card ${project.span || ''}`}
              onClick={() => navigate(`/project/${project.id}`)}
              style={{ cursor: 'pointer' }}
            >
              {isVideoMedia && videoSrc ? (
                <video
                  src={videoSrc}
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls={false}
                  className="bento-media"
                />
              ) : (
                <img
                  src={imageSrc}
                  alt={project.title}
                  className="bento-media"
                />
              )}
              <div className="bento-info">
                <h3>{project.title}</h3>
                <span>{project.category}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}