import React from 'react';
import { useStudioTheme } from '../../context/ThemeContext';
import './AboutSection.css';

export default function AboutSection() {
  const { t } = useStudioTheme();

  return (
    <section className="about-section" id="about">
      <div className="about-wrapper">
        {/* Header & Main Narrative */}
        <div className="about-header-block">
          <span className="about-eyebrow">ABOUT SIAWSH</span>
          <h2 className="about-main-title">
            Bridging physical space, brand strategy, and digital motion.
          </h2>
          <div className="about-narrative">
            <p>
              SIAWSH is a multidisciplinary design studio led by Siavash Afsari, operating at the intersection of spatial design, brand strategy, and digital motion. The studio helps ambitious technology startups, architectural clients, and established brands translate complex ideas into clear, tactile, and high-impact visual systems.
            </p>
            <p>
              Rather than treating architecture, furniture, identity, and interface as separate disciplines, SIAWSH approaches creative work as a unified problem-solving framework. Every project bridges physical environment and digital execution to elevate spatial experiences, strengthen brand perception, and deliver measurable commercial value.
            </p>
          </div>
        </div>

        {/* Core Capabilities Grid */}
        <div className="capabilities-block">
          <h3 className="section-subheading">Core Capabilities</h3>
          <div className="capabilities-grid">
            <div className="capability-card">
              <span className="capability-index">01</span>
              <h4>Spatial & Architectural Modeling</h4>
              <p>Comprehensive architectural visualization, 3D spatial design, and detailed landscaping layouts.</p>
            </div>
            <div className="capability-card">
              <span className="capability-index">02</span>
              <h4>Furniture & Product Design</h4>
              <p>Custom furniture concepts, industrial design blueprints, and high-fidelity 3D material rendering.</p>
            </div>
            <div className="capability-card">
              <span className="capability-index">03</span>
              <h4>Brand Strategy & Systems</h4>
              <p>Visual identities, comprehensive style guides, logo systems, and creative art direction.</p>
            </div>
            <div className="capability-card">
              <span className="capability-index">04</span>
              <h4>3D & Digital Motion</h4>
              <p>Cinematic render loops, product visualization, and logo animation utilizing Blender, Cinema 4D, and Adobe Creative Suite.</p>
            </div>
            <div className="capability-card">
              <span className="capability-index">05</span>
              <h4>UI/UX Design</h4>
              <p>User-centric web and mobile interfaces engineered in Figma for seamless digital interactions.</p>
            </div>
          </div>
        </div>

        {/* Process & Philosophy Section */}
        <div className="process-block">
          <h3 className="section-subheading">The Process</h3>
          <p className="process-description">
            Design is fundamentally about clarity, form, and function. By maintaining a collaborative and meticulous workflow, SIAWSH ensures that every spatial curve, material render, and pixel aligns directly with key client objectives—moving seamlessly from architectural blueprinting to final digital launch.
          </p>
        </div>

        {/* Stat Callout Grid */}
        <div className="about-stats-grid">
          <div className="about-stat-card">
            <span className="stat-number">10+</span>
            <span className="stat-label">Years of Multidisciplinary Design</span>
          </div>
          <div className="about-stat-card">
            <span className="stat-number">40+</span>
            <span className="stat-label">Commissions & Projects</span>
          </div>
        </div>
      </div>
    </section>
  );
}