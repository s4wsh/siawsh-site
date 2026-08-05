// src/pages/CinematicPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudioTheme } from '../context/ThemeContext';
import { getCinematicProjects } from '../data/projectsData';
import ProjectCard from '../components/common/ProjectCard';
import './Page.css';

export default function CinematicPage() {
  const navigate = useNavigate();
  const { t } = useStudioTheme();
  const cinematicProjects = getCinematicProjects(t);

  return (
    <main className="page-container">
      <div className="page-header">
        <button type="button" className="back-btn" onClick={() => navigate('/')}>
          ← BACK TO STUDIO
        </button>
        <h1 className="page-title">CINEMATIC PRACTICE</h1>
        <p className="page-intro">
          Motion direction, narrative visual design, and high-contrast cinematography.
        </p>
      </div>

      <section className="projects-grid">
        {cinematicProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </section>
    </main>
  );
}