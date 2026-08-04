// src/App.jsx
import React, { useState, Component } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import Modal from './components/Modal';
import HeroSection from './components/sections/HeroSection';
import WorkSection from './components/sections/WorkSection';
import AboutSection from './components/sections/AboutSection';
import Loader from './components/Loader';
import useSmoothScroll from './hooks/useSmoothScroll';
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
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  useSmoothScroll();

  return (
    <>
      {/* Fullscreen Animated Black Loader */}
      {loading && <Loader onFinish={() => setLoading(false)} />}

      {/* Main Website Structure with Smooth Fade-In Reveal */}
      <div
        style={{
          opacity: loading ? 0 : 1,
          transition: 'opacity 0.8s ease-in-out',
          pointerEvents: loading ? 'none' : 'auto',
        }}
      >
        <Navbar />
        <HeroSection />

        <div className="app-container">
          <WorkSection onSelectProject={setSelectedProject} />
          <AboutSection />
          <ContactForm />
          <Modal project={selectedProject} onClose={() => setSelectedProject(null)} />
        </div>

        <Footer />
      </div>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainContent />
      <AnalyticsBoundary>
        <Analytics />
      </AnalyticsBoundary>
    </ThemeProvider>
  );
}