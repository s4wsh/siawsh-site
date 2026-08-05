// src/components/common/ProjectCard.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProjectCard({ project, onSelectProject }) {
  const navigate = useNavigate();

  const handleClick = () => {
    // Priority 1: Navigate to dynamic route if ID exists
    if (project.id) {
      navigate(`/project/${project.id}`);
    } 
    // Priority 2: Trigger modal fallback
    else if (onSelectProject) {
      onSelectProject(project);
    }
  };

  // Resolve correct image/video source
  const mediaSrc = project.coverImage || project.imageSrc || project.image;

  return (
    <div 
      className={`project-card ${project.span || ''}`}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="card-media">
        {project.isVideo && project.heroVideo ? (
          <video 
            src={project.heroVideo} 
            autoPlay 
            muted 
            loop 
            playsInline 
            className="card-video"
          />
        ) : (
          <img src={mediaSrc} alt={project.title} className="card-image" />
        )}
      </div>
      <div className="card-info">
        <h3 className="card-title">{project.title}</h3>
        <span className="card-category">{project.category}</span>
      </div>
    </div>
  );
}