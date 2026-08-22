import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStudioTheme } from '../context/ThemeContext.jsx';
import { projectsData } from '../data/projectsData.js';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

/**
 * Performance-Optimized Lazy Video Component
 * Only initializes playback and GPU decoding when scrolled into view.
 * Automatically pauses playback when out of view to eliminate scroll lag.
 */
function LazyVideo({ 
  src, 
  className = "", 
  aspectRatio = "16/9", 
  objectFit = "cover", 
  label = null 
}) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin: '200px 0px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isInView) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isInView]);

  // Convert "16/9" string to inline style if needed
  const styleAspectRatio = aspectRatio.includes('/') ? aspectRatio.replace('/', ' / ') : aspectRatio;

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full overflow-hidden bg-neutral-900 border border-current/10 ${className}`}
      style={{ aspectRatio: styleAspectRatio }}
    >
      <video
        ref={videoRef}
        src={src}
        loop
        muted
        playsInline
        preload="metadata"
        className="h-full w-full"
        style={{ 
          objectFit,
          willChange: 'transform',
          transform: 'translateZ(0)'
        }}
      />
      {label && (
        <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm px-3 py-1 text-[10px] uppercase tracking-widest text-white z-10">
          {label}
        </div>
      )}
    </div>
  );
}

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLight, setMode, t } = useStudioTheme();

  const project = projectsData.find((p) => p.id === id);

  useEffect(() => {
    if (project?.categoryType?.includes('cinematic')) {
      setMode('cinematic');
    } else if (project?.categoryType?.includes('spatial')) {
      setMode('spatial');
    }
  }, [project, setMode]);

  // Filter related projects based on shared categories
  const relatedProjects = useMemo(() => {
    if (!project || !project.categoryType) return [];
    return projectsData
      .filter(
        (p) =>
          p.id !== project.id &&
          p.categoryType?.some((cat) => project.categoryType.includes(cat))
      )
      .slice(0, 3);
  }, [project]);

  // Dynamic SEO Metadata & Scroll Reset
  useEffect(() => {
    window.scrollTo(0, 0);

    if (project) {
      document.title = project.metaTitle || `${project.title} | Studio Practice`;

      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.name = 'description';
        document.head.appendChild(metaDescription);
      }
      metaDescription.content = project.metaDescription || project.subtitle || '';

      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.name = 'keywords';
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.content = project.keywords ? project.keywords.join(', ') : '';

      const schemaData = {
        '@context': 'https://schema.org',
        '@type': project.schemaType || 'CreativeWork',
        name: project.title,
        description: project.metaDescription || project.subtitle,
        image: project.heroImage,
        author: {
          '@type': 'Organization',
          name: 'Studio Practice',
        },
      };

      let scriptTag = document.getElementById('json-ld-schema');
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'json-ld-schema';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.text = JSON.stringify(schemaData);
    }
  }, [id, project]);

  if (!project) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${isLight ? 'bg-white text-black' : 'bg-black text-white'}`}>
        <h1 className="text-3xl font-light mb-4">{t.projectDetail.notFound}</h1>
        <button onClick={() => navigate('/')} className="text-xs uppercase tracking-widest border-b pb-1">
          ← {t.projectDetail.backToPortfolio}
        </button>
      </div>
    );
  }

  const {
    title,
    subtitle,
    tagline,
    heroImage,
    heroVideo,
    specs,
    contextParagraph,
    contextImage,
    mainParagraph,
    mainImage,
    recognition,
    theySaidTitle,
    theySaidParagraph,
    theySaidImages,
    hasPostHeroVideoGrid,
    postHeroVideoGrid,
    theySaidVideos,
  } = project;

  const heroVideoSrc = heroVideo || null;

  const filteredPostHeroVideos = useMemo(() => {
    if (!postHeroVideoGrid || !postHeroVideoGrid.videos) return [];
    return postHeroVideoGrid.videos.filter((vid) => vid.src && vid.src !== heroVideoSrc);
  }, [postHeroVideoGrid, heroVideoSrc]);

  const usedVideoSrcs = useMemo(() => {
    const set = new Set();
    if (heroVideoSrc) set.add(heroVideoSrc);
    filteredPostHeroVideos.forEach((vid) => {
      if (vid.src) set.add(vid.src);
    });
    return set;
  }, [heroVideoSrc, filteredPostHeroVideos]);

  const filteredTheySaidVideos = useMemo(() => {
    if (!theySaidVideos) return [];
    return theySaidVideos.filter((vid) => {
      const src = typeof vid === 'string' ? vid : vid?.src;
      return src && !usedVideoSrcs.has(src);
    });
  }, [theySaidVideos, usedVideoSrcs]);

  // Calculate total gallery assets count
  const totalGalleryItems = (theySaidImages?.length || 0) + filteredTheySaidVideos.length;

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isLight ? 'bg-white text-black' : 'bg-black text-white'}`}>
      <Navbar />

      <main className="pt-20 pb-20">
        <div className="mx-auto max-w-7xl px-6 md:px-12 space-y-16">
          
          {/* Header Navigation Bar */}
          <div className="flex items-center justify-between border-b pb-6 border-current/10">
            <button 
              onClick={() => navigate(-1)} 
              className="text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity"
            >
              ← {t.projectDetail.back}
            </button>
            <span className="text-xs uppercase tracking-widest opacity-40">{tagline}</span>
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-4 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-light tracking-tight leading-tight">{title}</h1>
            {subtitle && <p className="text-lg md:text-2xl font-light opacity-70 leading-relaxed">{subtitle}</p>}
          </div>

          {/* Hero Media Container */}
          {(heroVideo || heroImage) && (
            <div className="w-full overflow-hidden bg-neutral-900 border border-current/10" style={{ aspectRatio: '16 / 9' }}>
              {heroVideo ? (
                <LazyVideo 
                  src={heroVideo} 
                  aspectRatio="16/9" 
                  objectFit="cover" 
                />
              ) : (
                <img src={heroImage} alt={title} className="h-full w-full object-cover" />
              )}
            </div>
          )}

          {/* Post-Hero Dual Video Frame Section */}
          {hasPostHeroVideoGrid && filteredPostHeroVideos.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredPostHeroVideos.map((vid) => (
                <LazyVideo
                  key={vid.id || vid.src}
                  src={vid.src}
                  aspectRatio={vid.aspectRatio || postHeroVideoGrid?.aspectRatio || "16/9"}
                  objectFit={vid.objectFit || postHeroVideoGrid?.objectFit || "cover"}
                  label={vid.label}
                />
              ))}
            </div>
          )}

          {/* Technical Specs Matrix */}
          {specs && (
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 p-8 border ${isLight ? 'border-black/10 bg-neutral-50' : 'border-white/10 bg-[#111]'}`}>
              {specs.client && (
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-widest opacity-40">{t.projectDetail.clientContext}</div>
                  <div className="text-xs md:text-sm font-medium mt-1">{specs.client}</div>
                </div>
              )}
              {specs.year && (
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-widest opacity-40">{t.projectDetail.year}</div>
                  <div className="text-xs md:text-sm font-medium mt-1">{specs.year}</div>
                </div>
              )}
              {specs.location && (
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-widest opacity-40">{t.projectDetail.location}</div>
                  <div className="text-xs md:text-sm font-medium mt-1">{specs.location}</div>
                </div>
              )}
              {specs.tools && (
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-widest opacity-40">{t.projectDetail.tools}</div>
                  <div className="text-xs md:text-sm font-medium mt-1">{specs.tools}</div>
                </div>
              )}
              {specs.deliverables && (
                <div className="col-span-2 md:col-span-4 border-t pt-4 border-current/10">
                  <div className="text-[10px] font-semibold uppercase tracking-widest opacity-40">{t.projectDetail.deliverables}</div>
                  <div className="text-xs md:text-sm font-medium mt-1">{specs.deliverables}</div>
                </div>
              )}
            </div>
          )}

          {/* 01 / Concept & Context */}
          {contextParagraph && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start py-4">
              <div className="md:col-span-4 text-xs uppercase tracking-widest opacity-40">{t.projectDetail.conceptContext}</div>
              <div className="md:col-span-8 text-base md:text-xl font-light leading-relaxed border-l-2 pl-6 border-current/20">
                {contextParagraph}
              </div>
            </div>
          )}

          {contextImage && (
            <div className="w-full overflow-hidden border border-current/10">
              <img src={contextImage} alt={t.projectDetail.contextAlt} className="w-full object-cover" />
            </div>
          )}

          {/* 02 / Execution & Strategy */}
          {mainParagraph && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start py-4">
              <div className="md:col-span-4 text-xs uppercase tracking-widest opacity-40">{t.projectDetail.executionStrategy}</div>
              <div className="md:col-span-8 text-base leading-relaxed opacity-80">
                {mainParagraph}
              </div>
            </div>
          )}

          {mainImage && (
            <div className="w-full overflow-hidden border border-current/10">
              <img src={mainImage} alt={t.projectDetail.mainAlt} className="w-full object-cover" />
            </div>
          )}

          {/* Recognition Banner */}
          {(recognition || (theySaidParagraph && theySaidTitle)) && (
            <div className={`p-8 md:p-12 border ${isLight ? 'border-black/10 bg-neutral-50' : 'border-white/10 bg-[#111]'} space-y-6`}>
              {recognition && (
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-widest opacity-40 block mb-1">{t.projectDetail.recognition}</span>
                  <span className="text-sm md:text-base font-medium">{recognition}</span>
                </div>
              )}
              {theySaidParagraph && (
                <div className="border-t pt-6 border-current/10 space-y-2">
                  <span className="text-[10px] font-semibold uppercase tracking-widest opacity-40 block">{theySaidTitle || t.projectDetail.directClientQuote}</span>
                  <blockquote className="text-base md:text-xl italic font-light leading-relaxed">
                    "{theySaidParagraph}"
                  </blockquote>
                </div>
              )}
            </div>
          )}

          {/* Gallery Grid */}
          {totalGalleryItems > 0 && (
            <div className="space-y-8 pt-8">
              <div className="text-xs uppercase tracking-widest opacity-40">{t.projectDetail.visualGallery}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {theySaidImages?.map((img, idx) => (
                  <div key={idx} className="w-full overflow-hidden border border-current/10">
                    <img src={img} alt={t.projectDetail.galleryItemAlt.replace('{number}', idx + 1)} className="w-full object-cover" />
                  </div>
                ))}
                {filteredTheySaidVideos?.map((vid, idx) => {
                  const src = typeof vid === 'string' ? vid : vid?.src;
                  return (
                    <LazyVideo
                      key={idx}
                      src={src}
                      aspectRatio="16/9"
                      objectFit="cover"
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Related Projects */}
          {relatedProjects.length > 0 && (
            <div className="border-t pt-16 border-current/10 space-y-8">
              <div className="text-xs uppercase tracking-widest opacity-40">{t.projectDetail.relatedProjects}</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedProjects.map((rel) => (
                  <Link
                    key={rel.id}
                    to={`/work/${rel.id}`}
                    className="group block space-y-4 border border-current/10 p-4 transition-colors hover:border-current/30"
                  >
                    <div className="aspect-video w-full overflow-hidden bg-neutral-900">
                      <img
                        src={rel.heroImage}
                        alt={rel.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium group-hover:underline">{rel.title}</h3>
                      <p className="text-xs opacity-60 line-clamp-2 mt-1">{rel.subtitle}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
