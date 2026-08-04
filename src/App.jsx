import React, { useState, Component } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider, useStudioTheme } from './ThemeContext';
import Navbar from './Navbar';
import ContactForm from './ContactForm';
import Footer from './Footer';
import Modal from './Modal';
import useSmoothScroll from './useSmoothScroll';
import './index.css';

// Safety Guard for Analytics
class AnalyticsBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    console.warn("Analytics blocked or failed to load:", error);
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

function MainContent() {
  const { mode, t } = useStudioTheme();
  const [selectedProject, setSelectedProject] = useState(null);
  useSmoothScroll();

  const spatialProjects = [
    {
      title: t.projects?.nordic?.title || "Nordic Pavilion",
      category: t.projects?.nordic?.category || "Architecture",
      span: "bento-span-8",
      imageSrc: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      isVideo: false
    },
    {
      title: t.projects?.lounge?.title || "Minimal Lounge Chair",
      category: t.projects?.lounge?.category || "Furniture Design",
      span: "bento-span-4",
      imageSrc: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80",
      isVideo: false
    },
    {
      title: t.projects?.villa?.title || "Concrete Horizon Villa",
      category: t.projects?.villa?.category || "Architecture",
      span: "bento-span-4",
      imageSrc: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      isVideo: false
    },
    {
      title: t.projects?.monolith?.title || "Monolith Interior Studio",
      category: t.projects?.monolith?.category || "Interior Space",
      span: "bento-span-8",
      imageSrc: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      isVideo: false
    }
  ];

  const cinematicProjects = [
    {
      title: t.projects?.cyber?.title || "Cybernetic Identity",
      category: t.projects?.cyber?.category || "Graphic Design",
      span: "bento-span-4",
      imageSrc: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      isVideo: false
    },
    {
      title: t.projects?.showreel?.title || "Abstract 3D Showreel",
      category: t.projects?.showreel?.category || "Motion Graphics",
      span: "bento-span-8",
      imageSrc: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80",
      previewVideoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      isVideo: true
    },
    {
      title: t.projects?.neonic?.title || "Neonic Kinetic Branding",
      category: t.projects?.neonic?.category || "Branding",
      span: "bento-span-8",
      imageSrc: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
      isVideo: false
    },
    {
      title: t.projects?.kinetic?.title || "Spatial Dynamics",
      category: t.projects?.kinetic?.category || "Visual Direction",
      span: "bento-span-4",
      imageSrc: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80",
      isVideo: false
    }
  ];

  const currentProjects = mode === 'spatial' ? spatialProjects : cinematicProjects;

  return (
    <>
      {/* Editorial Full-Bleed Modern Hero Section */}
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
              <span className="meta-value">Berlin & Remote</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Status</span>
              <span className="meta-value">Available Q3/Q4</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Disciplines</span>
              <span className="meta-value">Spatial & Kinetic</span>
            </div>
          </div>
        </div>
      </header>

      <div className="app-container">
        {/* Bento Grid Portfolio Section */}
        <section className="portfolio-section" id="work">
          <div className="section-header">
            <h2>{t.works?.title || "Selected Works"}</h2>
            <span className="project-count">
              {currentProjects.length} {t.works?.projectsCount || "Projects"}
            </span>
          </div>

          <div className="portfolio-bento-grid">
            {currentProjects.map((project, index) => (
              <div
                key={index}
                className={`bento-card ${project.span}`}
                onClick={() => setSelectedProject(project)}
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

        {/* Modern About & Metrics Section */}
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
                <span className="stat-label">Global Commissions Completed</span>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section with Interactive Option Buttons */}
        <ContactForm />

        {/* Modal Lightbox */}
        <Modal project={selectedProject} onClose={() => setSelectedProject(null)} />
      </div>

      {/* Global Footer */}
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Navbar />
      <MainContent />
      <AnalyticsBoundary>
        <Analytics />
      </AnalyticsBoundary>
    </ThemeProvider>
  );
}