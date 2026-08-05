// src/App.jsx

import React, { useState, Component } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from './context/ThemeContext';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Loader from './components/common/Loader';

// Pages
import Home from './pages/Home';
import SpatialPage from './pages/SpatialPage';
import CinematicPage from './pages/CinematicPage';
import ProjectDetailPage from './pages/ProjectDetailPage';

// Hooks & Styles
import useSmoothScroll from './hooks/useSmoothScroll';
import './index.css';

class AnalyticsBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.warn('Analytics blocked or failed to load:', error);
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

function MainAppShell() {
  const [loading, setLoading] = useState(true);

  // Initialize Lenis smooth scrolling engine
  useSmoothScroll();

  return (
    <>
      {/* Fullscreen Initial Loader */}
      {loading && <Loader onFinish={() => setLoading(false)} />}

      {/* App Layout Container */}
      <div
        style={{
          opacity: loading ? 0 : 1,
          transition: 'opacity 0.8s ease-in-out',
          pointerEvents: loading ? 'none' : 'auto',
        }}
      >
        <Navbar />

        <Routes>
          {/* Landing Route */}
          <Route path="/" element={<Home />} />

          {/* Practice Routes */}
          <Route path="/spatial" element={<SpatialPage />} />
          <Route path="/cinematic" element={<CinematicPage />} />

          {/* Standalone Project Detail Page */}
          <Route path="/project/:projectId" element={<ProjectDetailPage />} />
        </Routes>

        <Footer />
      </div>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <MainAppShell />
        <AnalyticsBoundary>
          <Analytics />
        </AnalyticsBoundary>
      </Router>
    </ThemeProvider>
  );
}