import React, { useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import ContactForm from '../components/ContactForm.jsx';
import { useStudioTheme } from '../context/ThemeContext.jsx';

export default function ContactPage() {
  const { isLight } = useStudioTheme();

  // JSON-LD Structured Data Schema for LocalBusiness & Organization
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    'name': 'SIAWSH Studio',
    'url': typeof window !== 'undefined' ? window.location.origin : 'https://siawsh.com',
    'logo': 'https://siawsh.com/favicon.svg',
    'image': 'https://siawsh.com/favicon.svg',
    'description': 'Spatial Architecture, 3D Motion & Design Studio specializing in real-time WebGL/WebGPU experiences.',
    'address': {
      '@type': 'PostalAddress',
      'addressCountry': 'US',
    },
    'sameAs': [
      'https://x.com',
      'https://linkedin.com',
      'https://instagram.com'
    ],
    'priceRange': '$$$$',
    'openingHours': 'Mo-Fr 09:00-18:00'
  };

  useEffect(() => {
    document.title = "Contact — SIAWSH Studio | Spatial Architecture & 3D Motion";
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isLight ? 'bg-white text-black' : 'bg-black text-white'}`}>
      {/* Inject JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <Navbar />

      <main className="pt-32 pb-16">
        {/* Dedicated Page Header */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12">
          <p className="text-xs tracking-[0.3em] uppercase opacity-50 mb-3">Initiate Collaboration</p>
          <h1 className="text-4xl md:text-6xl font-light tracking-tight">Let's build together</h1>
        </div>

        {/* Existing Interactive Contact Form */}
        <ContactForm />
      </main>

      <Footer />
    </div>
  );
}