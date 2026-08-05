// src/pages/ProjectDetailPage.jsx

import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStudioTheme } from '../context/ThemeContext';
import { getAllProjects } from '../data/projectsData';
import './Page.css';

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { t } = useStudioTheme();

  const allProjects = getAllProjects(t);
  const project = allProjects.find((p) => p.id === projectId);

  if (!project) {
    return (
      <main className="page-container">
        <div className="page-header">
          <button type="button" className="back-btn" onClick={() => navigate('/')}>
            ← BACK TO STUDIO
          </button>
          <h1 className="page-title">PROJECT NOT FOUND</h1>
        </div>
      </main>
    );
  }

  const isCustomCaseStudy = Boolean(project.contextParagraph || project.engineeringParagraph);

  return (
    <main className="page-container custom-detail-page">
      {/* Header */}
      <div className="page-header">
        <button type="button" className="back-btn" onClick={() => navigate(-1)}>
          ← BACK
        </button>
        {project.projectName && <span className="project-tagline">{project.projectName}</span>}
        <span className="project-category-badge">{project.category}</span>
        <h1 className="page-title">{project.title}</h1>
        {project.headline && <h2 className="page-headline">{project.headline}</h2>}
        {project.subtitle && <p className="page-intro">{project.subtitle}</p>}
      </div>

      {/* Hero Media */}
      <div className="project-hero-media">
        {project.heroVideo ? (
          <video 
            src={project.heroVideo} 
            autoPlay 
            muted 
            loop 
            playsInline
            controls={false}
            className="media-fullbleed"
          />
        ) : project.isVideo && project.previewVideoSrc ? (
          <video 
            src={project.previewVideoSrc} 
            autoPlay 
            muted 
            loop 
            playsInline
            controls={false}
            className="media-fullbleed"
          />
        ) : (
          <img 
            src={project.coverImage || project.imageSrc} 
            alt={project.title} 
            className="media-fullbleed"
          />
        )}
      </div>

      {/* Case Study Content */}
      {isCustomCaseStudy ? (
        <div className="case-study-content">
          {project.contextParagraph && (
            <section className="case-section">
              <h3>Project Context</h3>
              <p>{project.contextParagraph}</p>
            </section>
          )}

          {project.moodboardImage && (
            <figure className="case-media-block">
              <img src={project.moodboardImage} alt="Moodboard and material sketches" />
              <figcaption>Moodboard & Materiality Sketches</figcaption>
            </figure>
          )}

          {project.engineeringParagraph && (
            <section className="case-section">
              <h3>{project.engineeringTitle || "Engineering & Execution"}</h3>
              <p>{project.engineeringParagraph}</p>
            </section>
          )}

          {project.explosionImage && (
            <figure className="case-media-block">
              <img src={project.explosionImage} alt="Internal explosion diagram" />
              <figcaption>Explosion Diagram — Internal Acoustic Architecture</figcaption>
            </figure>
          )}

          {project.competitorParagraph && (
            <section className="case-section">
              <h3>Market Positioning & Technical Pipeline</h3>
              <p>{project.competitorParagraph}</p>
            </section>
          )}

          {project.ethosQuote && (
            <blockquote className="ethos-quote">
              <span className="quote-header">{project.ethosTitle || "The Design Ethos"}</span>
              <p>"{project.ethosQuote}"</p>
            </blockquote>
          )}

          {(project.ambientRender || project.macroRender) && (
            <div className="dual-render-grid">
              {project.ambientRender && (
                <figure className="render-card">
                  <img src={project.ambientRender} alt="In-situ ambient render" />
                  <figcaption>In-situ Ambient Render</figcaption>
                </figure>
              )}
              {project.macroRender && (
                <figure className="render-card">
                  <img src={project.macroRender} alt="Macro fabric texture" />
                  <figcaption>Macro Render — Acoustic Fabric</figcaption>
                </figure>
              )}
            </div>
          )}

          {/* Title changed to OTHER PRACTICE */}
          {project.otherWorks && project.otherWorks.length > 0 && (
            <section className="suggested-works">
              <h3>OTHER PRACTICE</h3>
              <div className="suggested-works-list">
                {project.otherWorks.map((work) => (
                  <Link key={work.id} to={`/project/${work.id}`} className="suggested-work-card">
                    <span>{work.title}</span>
                    <span className="arrow">→</span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        <div className="project-body-grid">
          <div className="project-meta">
            <div>
              <h4>YEAR</h4>
              <p>{project.year || '2026'}</p>
            </div>
            <div>
              <h4>CLIENT</h4>
              <p>{project.client || 'Studio Practice'}</p>
            </div>
          </div>

          <div className="project-description">
            <h3>Overview</h3>
            <p>{project.description || 'Project details coming soon.'}</p>
          </div>
        </div>
      )}
    </main>
  );
}