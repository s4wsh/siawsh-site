import React from 'react';
import { useStudioTheme } from '../../context/ThemeContext';

export default function AboutSection() {
  const { t } = useStudioTheme();

  return (
    <section className="about-section" id="about">
      <div className="about-grid">
        <div className="about-container">
          <h2>{t.about?.title || "About SIAWSH"}</h2>
          <p>{t.about?.desc}</p>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-number">10+</span>
            <span className="stat-label">Years of Multidisciplinary Design</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">40+</span>
            <span className="stat-label">Commissions & Projects</span>
          </div>
        </div>
      </div>
    </section>
  );
}