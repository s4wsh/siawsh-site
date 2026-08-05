// src/pages/SpatialPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudioTheme } from '../context/ThemeContext';
import { getSpatialProjects } from '../data/projectsData';
import ProjectCard from '../components/common/ProjectCard';
import './Page.css';

export default function SpatialPage() {
  const navigate = useNavigate();
  const { t } = useStudioTheme();
  const spatialProjects = getSpatialProjects(t);

  return (
    <main className="page-container">
      <div className="page-header">
        <button type="button" className="back-btn" onClick={() => navigate('/')}>
          ← BACK TO STUDIO
        </button>
        <h1 className="page-title">SPATIAL PRACTICE</h1>
        <p className="page-intro">
          Architectural forms, physical environments, and material structural explorations.
        </p>
      </div>

      <section className="projects-grid">
        {spatialProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </section>
    </main>
  );
}