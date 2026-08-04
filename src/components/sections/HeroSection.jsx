import React from 'react';
import { useStudioTheme } from '../../context/ThemeContext';

export default function HeroSection() {
  const { mode, t } = useStudioTheme();

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
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
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
          {mode === 'spatial' ? t.hero?.badgeSpatial : t.hero?.badgeCinematic}
        </span>
        <h1 className="hero-title">
          {mode === 'spatial' ? t.hero?.titleSpatial : t.hero?.titleCinematic}
        </h1>

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
      </div>
    </header>
  );
}