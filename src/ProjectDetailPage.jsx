import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import projectsData from '../data/projectsData';
import './Page.css';

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  // Find the exact project matching the URL parameter
  const project = projectsData.find((p) => p.id === projectId);

  if (!project) {
    return (
      <main className="page-container">
        <h2>Project Not Found</h2>
        <button type="button" className="back-btn" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
      </main>
    );
  }

  return (
    <main className="page-container">
      <div className="page-header">
        <button type="button" className="back-btn" onClick={() => navigate(-1)}>
          ← BACK
        </button>
        <span className="project-category-badge">{project.category}</span>
        <h1 className="page-title">{project.title}</h1>
        <p className="page-intro">{project.subtitle}</p>
      </div>

      <div className="project-hero-media">
        <img src={project.coverImage} alt={project.title} />
      </div>

      <div className="project-body-grid">
        <div className="project-meta">
          <div>
            <h4>YEAR</h4>
            <p>{project.year}</p>
          </div>
          <div>
            <h4>CLIENT</h4>
            <p>{project.client}</p>
          </div>
          <div>
            <h4>SERVICES</h4>
            <p>{project.services?.join(', ')}</p>
          </div>
        </div>

        <div className="project-description">
          <h3>Overview</h3>
          <p>{project.description}</p>
        </div>
      </div>
    </main>
  );
}