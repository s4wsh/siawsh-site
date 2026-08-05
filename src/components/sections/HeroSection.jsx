// src/components/sections/HeroSection.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudioTheme } from '../../context/ThemeContext';
import './HeroSection.css';

export default function HeroSection() {
  const { mode, t } = useStudioTheme();
  const navigate = useNavigate();

  return (
    <header className="hero-fullbleed" id="hero">
      <div className="hero-media-wrapper">
        {mode === 'spatial' ? (
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=80"
            alt="Spatial Practice Banner"
            className="hero-media"
          />
        ) : (
          <video
            src="/projects/aura-smart-speaker/hero-loop.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="hero-media"
          />
        )}
      </div>

      <div className="hero-statement-wrapper">
        <span className="mode-badge">
          {mode === 'spatial' ? (t.hero?.badgeSpatial || "SPATIAL PRACTICE") : "FEATURED CINEMATIC SHOWCASE"}
        </span>
        
        <h1 className="hero-title">
          {mode === 'spatial' 
            ? (t.hero?.titleSpatial || "Architectural precision and structural minimalism for physical environments.") 
            : "AURA — Conceptual 3D Design & Motion Showcase"}
        </h1>

        {mode === 'cinematic' ? (
          <div className="hero-cta-group">
            <p className="hero-subtitle-text">
              Combining architectural minimalism, tactile materiality, and 3D motion design.
            </p>
            <button 
              type="button"
              className="hero-cta-btn"
              onClick={() => navigate('/project/aura-smart-speaker')}
            >
              EXPLORE CASE STUDY →
            </button>
          </div>
        ) : (
          <div className="hero-meta-strip">
            <div className="meta-item">
              <span className="meta-label">Location</span>
              <span className="meta-value">Tehran & Remote</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Status</span>
              <span className="meta-value">Available for Commissions</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Disciplines</span>
              <span className="meta-value">Spatial, Motion & Identity</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}