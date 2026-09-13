import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStudioTheme } from '../context/ThemeContext.jsx';
import { projectsData } from '../data/projectsData.js';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import ShareButtons from '../components/ShareButtons.jsx';
import SEO from '../components/SEO.jsx';

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

  // Target specifically IMG_6722.webm for start-at-8s and loop behavior
  const isTargetWebm = typeof src === 'string' && src.includes('IMG_6722.webm');

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
      // Set start time to 13 seconds only for IMG_6722.webm
      if (isTargetWebm && videoRef.current.currentTime < 13) {
        videoRef.current.currentTime = 13;
      }
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isInView, isTargetWebm]);

  // Handle loop reset for IMG_6722.webm when reaching the end or if reset occurs
  const handleTimeUpdate = () => {
    if (!videoRef.current || !isTargetWebm) return;
    if (videoRef.current.currentTime < 8) {
      videoRef.current.currentTime = 8;
    }
  };

  const handleEnded = () => {
    if (!videoRef.current || !isTargetWebm) return;
    videoRef.current.currentTime = 8;
    videoRef.current.play().catch(() => {});
  };

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
        loop={!isTargetWebm}
        muted
        playsInline
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        className="h-full w-full"
        style={{ 
          objectFit,
          willChange: 'transform',
          transform: 'translateZ(0)'
        }}
      />
      {label && (
        <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-0.5 text-[9px] uppercase tracking-widest text-white z-10">
          {label}
        </div>
      )}
    </div>
  );
}

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLight, setMode, t, lang } = useStudioTheme();

  const isFa = lang === 'fa';
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

  // Scroll Reset on Route Change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

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

  // Localized field selectors with English fallbacks
  const activeTitle = isFa ? (project.titleFa || project.title) : project.title;
  const activeSubtitle = isFa ? (project.subtitleFa || project.subtitle) : project.subtitle;
  const activeTagline = isFa ? (project.taglineFa || project.tagline) : project.tagline;
  
  const activeContextParagraph = isFa ? (project.contextParagraphFa || project.contextParagraph) : project.contextParagraph;
  const activeMainParagraph = isFa ? (project.mainParagraphFa || project.mainParagraph) : project.mainParagraph;
  const activeRecognition = isFa ? (project.recognitionFa || project.recognition) : project.recognition;
  const activeTheySaidTitle = isFa ? (project.theySaidTitleFa || project.theySaidTitle) : project.theySaidTitle;
  const activeTheySaidParagraph = isFa ? (project.theySaidParagraphFa || project.theySaidParagraph) : project.theySaidParagraph;

  const activeMetaTitle = isFa ? (project.metaTitleFa || project.metaTitle) : project.metaTitle;
  const activeMetaDescription = isFa ? (project.metaDescriptionFa || project.metaDescription) : project.metaDescription;

  // Localized Specs Matrix
  const activeSpecs = project.specs ? {
    client: isFa ? (project.specs.clientFa || project.specs.client) : project.specs.client,
    year: project.specs.year,
    location: isFa ? (project.specs.locationFa || project.specs.location) : project.specs.location,
    tools: isFa ? (project.specs.toolsFa || project.specs.tools) : project.specs.tools,
    deliverables: isFa ? (project.specs.deliverablesFa || project.specs.deliverables) : project.specs.deliverables,
  } : null;

  const {
    heroImage,
    heroVideo,
    contextImage,
    contextVideo,
    mainImage,
    mainVideo,
    theySaidImages,
    hasPostHeroVideoGrid,
    postHeroVideoGrid,
    theySaidVideos,
    keywords,
    schemaType,
  } = project;

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': schemaType || 'CreativeWork',
    name: activeTitle,
    description: activeMetaDescription || activeSubtitle,
    image: heroImage,
    author: {
      '@type': 'Organization',
      name: 'Studio Practice',
    },
  };

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

  // Detect if context asset is a video format
  const isContextVideo = contextVideo || (typeof contextImage === 'string' && (contextImage.endsWith('.webm') || contextImage.endsWith('.mp4')));
  const contextMediaSrc = contextVideo || contextImage;

  // Detect if main strategy asset is a video format
  const isMainVideo = mainVideo || (typeof mainImage === 'string' && (mainImage.endsWith('.webm') || mainImage.endsWith('.mp4')));
  const mainMediaSrc = mainVideo || mainImage;

  return (
    <div dir={isFa ? 'rtl' : 'ltr'} className={`min-h-screen transition-colors duration-500 ${isLight ? 'bg-white text-black' : 'bg-black text-white'}`}>
      <SEO 
        title={activeMetaTitle || `${activeTitle} | Studio Practice`}
        description={activeMetaDescription || activeSubtitle || ''}
        keywords={keywords}
        canonical={`https://siawsh.co/work/${id}`}
        schema={schemaData}
      />

      <Navbar />

      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-7xl px-6 md:px-12 space-y-16">
          
          {/* Header Navigation Bar */}
          <div className="flex items-center justify-between border-b pb-6 border-current/10">
            <button 
              onClick={() => navigate(-1)} 
              className="text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity"
            >
              {isFa ? `← ${t.projectDetail.back}` : `← ${t.projectDetail.back}`}
            </button>
            <span className="text-xs uppercase tracking-widest opacity-40">{activeTagline}</span>
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-4 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-light tracking-tight leading-tight">{activeTitle}</h1>
            {activeSubtitle && <p className="text-lg md:text-2xl font-light opacity-70 leading-relaxed">{activeSubtitle}</p>}
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
                <img src={heroImage} alt={activeTitle} className="h-full w-full object-cover" />
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
          {activeSpecs && (
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 p-8 border ${isLight ? 'border-black/10 bg-neutral-50' : 'border-white/10 bg-[#111]'}`}>
              {activeSpecs.client && (
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-widest opacity-40">{t.projectDetail.clientContext}</div>
                  <div className="text-sm md:text-base font-medium mt-1">{activeSpecs.client}</div>
                </div>
              )}
              {activeSpecs.year && (
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-widest opacity-40">{t.projectDetail.year}</div>
                  <div className="text-sm md:text-base font-medium mt-1">{activeSpecs.year}</div>
                </div>
              )}
              {activeSpecs.location && (
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-widest opacity-40">{t.projectDetail.location}</div>
                  <div className="text-sm md:text-base font-medium mt-1">{activeSpecs.location}</div>
                </div>
              )}
              {activeSpecs.tools && (
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-widest opacity-40">{t.projectDetail.tools}</div>
                  <div className="text-sm md:text-base font-medium mt-1">{activeSpecs.tools}</div>
                </div>
              )}
              {activeSpecs.deliverables && (
                <div className="col-span-2 md:col-span-4 border-t pt-4 border-current/10">
                  <div className="text-[10px] font-semibold uppercase tracking-widest opacity-40">{t.projectDetail.deliverables}</div>
                  <div className="text-sm md:text-base font-medium mt-1">{activeSpecs.deliverables}</div>
                </div>
              )}
            </div>
          )}

          {/* 01 / Concept & Context */}
          {activeContextParagraph && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start py-4">
              <div className="md:col-span-4 text-xs uppercase tracking-widest opacity-40">{t.projectDetail.conceptContext}</div>
              <div className={`md:col-span-8 text-lg md:text-xl font-light leading-relaxed border-current/20 ${isFa ? 'border-r-2 pr-6' : 'border-l-2 pl-6'}`}>
                {activeContextParagraph}
              </div>
            </div>
          )}

          {contextMediaSrc && (
            <div className="w-full overflow-hidden border border-current/10">
              {isContextVideo ? (
                <LazyVideo 
                  src={contextMediaSrc} 
                  aspectRatio="16/9" 
                  objectFit="cover" 
                />
              ) : (
                <img src={contextMediaSrc} alt={t.projectDetail.contextAlt} className="w-full object-cover" />
              )}
            </div>
          )}

          {/* 02 / Execution & Strategy */}
          {activeMainParagraph && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start py-4">
              <div className="md:col-span-4 text-xs uppercase tracking-widest opacity-40">{t.projectDetail.executionStrategy}</div>
              <div className="md:col-span-8 text-base md:text-lg leading-relaxed opacity-80">
                {activeMainParagraph}
              </div>
            </div>
          )}

          {mainMediaSrc && (
            <div className="w-full overflow-hidden border border-current/10">
              {isMainVideo ? (
                <LazyVideo 
                  src={mainMediaSrc} 
                  aspectRatio="16/9" 
                  objectFit="cover" 
                />
              ) : (
                <img src={mainMediaSrc} alt={t.projectDetail.mainAlt} className="w-full object-cover" />
              )}
            </div>
          )}

          {/* Recognition Banner */}
          {(activeRecognition || (activeTheySaidParagraph && activeTheySaidTitle)) && (
            <div className={`p-8 md:p-12 border ${isLight ? 'border-black/10 bg-neutral-50' : 'border-white/10 bg-[#111]'} space-y-6`}>
              {activeRecognition && (
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-widest opacity-40 block mb-1">{t.projectDetail.recognition}</span>
                  <span className="text-sm md:text-base font-medium">{activeRecognition}</span>
                </div>
              )}
              {activeTheySaidParagraph && (
                <div className="border-t pt-6 border-current/10 space-y-2">
                  <span className="text-[10px] font-semibold uppercase tracking-widest opacity-40 block">{activeTheySaidTitle || t.projectDetail.directClientQuote}</span>
                  <blockquote className="text-base md:text-xl italic font-light leading-relaxed">
                    "{activeTheySaidParagraph}"
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

          {/* End-of-Page Share Buttons Section */}
          <div className="py-0 my-0 border-t border-b border-current/10 leading-none">
            <ShareButtons title={activeTitle} excerpt={activeSubtitle || activeTagline} isLight={isLight} />
          </div>

          {/* Related Projects */}
          {relatedProjects.length > 0 && (
            <div className="pt-8 space-y-8">
              <div className="text-xs uppercase tracking-widest opacity-40">{t.projectDetail.relatedProjects}</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedProjects.map((rel) => {
                  const relTitle = isFa ? (rel.titleFa || rel.title) : rel.title;
                  const relSubtitle = isFa ? (rel.subtitleFa || rel.subtitle) : rel.subtitle;
                  return (
                    <Link
                      key={rel.id}
                      to={`/work/${rel.id}`}
                      className="group block space-y-3 border border-current/10 p-3 transition-colors hover:border-current/30"
                    >
                      <div className="aspect-video w-full overflow-hidden bg-neutral-900">
                        <img
                          src={rel.heroImage}
                          alt={relTitle}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium group-hover:underline">{relTitle}</h3>
                        <p className="text-[11px] opacity-60 line-clamp-2 mt-1">{relSubtitle}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}