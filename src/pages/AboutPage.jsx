import React, { useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import AboutSection from '../sections/AboutSection.jsx';
import ContactForm from '../components/ContactForm.jsx';
import { useStudioTheme } from '../context/ThemeContext.jsx';

export default function AboutPage() {
  const { isLight } = useStudioTheme();

  // Inject Structured Data (Schema.org JSON-LD) for Search Engine Crawlers
  useEffect(() => {
    document.title = "About SIAWSH | Multidisciplinary 3D Motion, Spatial Design & Brand Strategy Studio";

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "SIAWSH Studio",
      "url": "https://siawsh.co",
      "logo": "https://siawsh.co/logo.png",
      "description": "Multidisciplinary design studio led by Siavash Afsari, specializing in 3D motion graphics, architectural spatial design, kinetic branding, and custom furniture.",
      "founder": {
        "@type": "Person",
        "name": "Siavash Afsari",
        "alternateName": "Siawsh",
        "jobTitle": "Multidisciplinary Designer & 3D Motion Director"
      },
      "knowsAbout": [
        "3D Motion Graphics",
        "Spatial Design",
        "Architectural Visualization",
        "Brand Strategy",
        "Custom Furniture Design",
        "Kinetic Branding",
        "UI/UX Design"
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'siawsh-seo-schema';
    script.text = JSON.stringify(schemaData);

    const existingScript = document.getElementById('siawsh-seo-schema');
    if (existingScript) {
      existingScript.remove();
    }
    document.head.appendChild(script);

    return () => {
      const addedScript = document.getElementById('siawsh-seo-schema');
      if (addedScript) addedScript.remove();
    };
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isLight ? 'bg-white text-black' : 'bg-black text-white'}`}>
      <Navbar />
      <main className="pt-0">
        <AboutSection teaser={false} />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}