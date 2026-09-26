import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useStudioTheme } from '../context/ThemeContext.jsx';
import { projectsData } from '../data/projectsData.js';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import SEO from '../components/SEO.jsx';
import { getLocalizedString, pickLocalized, safeArray } from '../utils/localize.js';
import './WorkPage.css';

/* ============================================================
   FILTER TAXONOMY — canonical, mirrors projectsData tags.
   Primary = categoryType level (big segmented tabs)
   Secondary = tag level (chips with live counts)
   Each filter carries its own SEO title/description (localized)
   so every filtered view is a unique, indexable landing page.
============================================================ */
const PRIMARY_FILTERS = [
  { id: 'all',       en: 'All Works',  fa: 'همه پروژه‌ها' },
  { id: 'spatial',   en: 'Spatial',    fa: 'معماری و فضا' },
  { id: 'cinematic', en: 'Cinematic',  fa: 'موشن و سینماتیک' },
];

const TAG_FILTERS = [
  { id: 'interior',           en: 'Interior Design',      fa: 'طراحی داخلی' },
  { id: 'exterior',           en: 'Exterior & Facades',   fa: 'طراحی نما' },
  { id: 'furniture',          en: 'Custom Furniture',     fa: 'مبلمان سفارشی' },
  { id: 'murals',             en: 'Murals & Wall Art',    fa: 'نقاشی دیواری' },
  { id: '3d-product',         en: '3D Product Render',    fa: 'رندر محصول سه‌بعدی' },
  { id: 'cgi-vfx',            en: 'CGI & VFX',            fa: 'جلوه‌های ویژه CGI' },
  { id: 'commercial-teasers', en: 'Commercial Teasers',   fa: 'تیزر تبلیغاتی' },
  { id: 'motion-kinetic',     en: 'Motion Graphics',      fa: 'موشن گرافیک' },
  { id: 'brand-identity',     en: 'Brand Identity',       fa: 'هویت بصری' },
  { id: 'ui-ux-web',          en: 'Web UI/UX',            fa: 'طراحی وب' },
];

const FILTER_SEO = {
  all: {
    en: { title: 'Selected Works — SIAWSH Studio', desc: 'A curated index of spatial architecture, murals, kinetic branding, 3D motion graphics, and experimental design case studies.' },
    fa: { title: 'نمونه‌کارها — استودیو سیاوش', desc: 'مجموعه نمونه‌کارهای طراحی معماری، دیوارنگاری، هویت بصری و موشن گرافیک سه‌بعدی.' },
  },
  spatial: {
    en: { title: 'Spatial Design Portfolio — Architecture, Interior & Furniture | SIAWSH', desc: '3D architectural visualization, interior design, custom cabinetry and furniture concepts. Browse spatial design case studies by SIAWSH Studio.' },
    fa: { title: 'نمونه‌کارهای طراحی معماری و فضای داخلی | استودیو سیاوش', desc: 'رندر معماری سه‌بعدی، طراحی داخلی، طراحی کابینت و دکوراسیون و مبلمان سفارشی — مجموعه پروژه‌های معماری استودیو سیاوش.' },
  },
  cinematic: {
    en: { title: '3D Motion & CGI Portfolio — Teasers, Product Animation | SIAWSH', desc: '3D CGI product animation, cinematic commercial teasers, kinetic typography and brand identity systems. Browse cinematic case studies by SIAWSH Studio.' },
    fa: { title: 'نمونه‌کارهای موشن گرافیک سه‌بعدی و CGI | استودیو سیاوش', desc: 'انیمیشن سه‌بعدی محصول، تیزرهای تبلیغاتی سینماتیک، موشن گرافیک و هویت بصری پویا — پروژه‌های بخش سینماتیک استودیو سیاوش.' },
  },
  interior: {
    en: { title: 'Interior Design Projects — 3D Interior Rendering | SIAWSH Studio', desc: 'Interior design case studies: residential and commercial interiors, signage integration and 3D interior rendering.' },
    fa: { title: 'نمونه‌کارهای طراحی داخلی ۳ بعدی | استودیو سیاوش', desc: 'طراحی داخلی فضاهای مسکونی و تجاری، اجرای تابلو و رندر داخلی سه‌بعدی — پروژه‌های معماری داخلی استودیو سیاوش.' },
  },
  exterior: {
    en: { title: 'Exterior & Facade Projects — Architectural Visual Identity | SIAWSH', desc: 'Facade 3D modeling, exterior architecture branding and storefront design case studies.' },
    fa: { title: 'نمونه‌کارهای طراحی نما و معماری بیرونی | استودیو سیاوش', desc: 'طراحی نما مدرن، برندینگ معماری بیرونی و ویترین فروشگاه — پروژه‌های نمای ساختمان استودیو سیاوش.' },
  },
  furniture: {
    en: { title: 'Custom Furniture Design & 3D Product Rendering | SIAWSH Studio', desc: 'Custom furniture concepts, joinery, wood/brass/stone material strategy and photorealistic product renders.' },
    fa: { title: 'نمونه‌کارهای طراحی اختصاصی مبلمان | استودیو سیاوش', desc: 'طراحی مبلمان سفارشی، طراحی کابینت و دکوراسیون و رندر سه‌بعدی مبلمان با متریال چوب، برنج و سنگ.' },
  },
  murals: {
    en: { title: 'Hand-Painted Murals & Environmental Wall Art | SIAWSH Studio', desc: 'Custom hand-painted murals for hotels, restaurants and commercial lounges — large-scale environmental art case studies.' },
    fa: { title: 'نمونه‌کارهای نقاشی دیواری سفارشی | استودیو سیاوش', desc: 'نقاشی دیواری سفارشی برای هتل، رستوران و فضاهای تجاری — هنر محیطی دست‌نقش در مقیاس بزرگ.' },
  },
  '3d-product': {
    en: { title: '3D Product Rendering & Animation — Photorealistic CGI | SIAWSH', desc: 'Photorealistic 3D product renders and CGI product animation in Blender and Cinema 4D for hardware, packaging and retail.' },
    fa: { title: 'نمونه‌کارهای رندر و انیمیشن سه بعدی محصول | استودیو سیاوش', desc: 'رندر فتورئال و انیمیشن سه‌بعدی محصول در بلندر و سینما فوردی برای سخت‌افزار، بسته‌بندی و خرده‌فروشی.' },
  },
  'cgi-vfx': {
    en: { title: 'CGI & VFX Sequences — Cinematic 3D Commercials | SIAWSH Studio', desc: 'CGI and VFX production: cinematic lighting, looped 3D motion and studio-grade rendering for luxury brands.' },
    fa: { title: 'نمونه‌کارهای جلوه‌های ویژه CGI و سینماتیک | استودیو سیاوش', desc: 'تولید جلوه‌های ویژه و CGI، نورپردازی سینمایی و موشن سه‌بعدی تکرارشونده برای برندهای لوکس.' },
  },
  'commercial-teasers': {
    en: { title: 'Commercial Video Teasers — 3D Ad Production | SIAWSH Studio', desc: 'High-converting commercial video teasers: vertical 9:16 ads, product CGI and custom SFX for social campaigns.' },
    fa: { title: 'نمونه‌کارهای تیزر تبلیغاتی سینماتیک | استودیو سیاوش', desc: 'تیزرهای تبلیغاتی پرتبدیل: تیزر عمودی ۹:۱۶، CGI محصول و طراحی صوتی اختصاصی برای کمپین‌های اجتماعی.' },
  },
  'motion-kinetic': {
    en: { title: 'Kinetic Typography & Motion Graphics | SIAWSH Studio', desc: 'Kinetic typography, motion graphics explainers and animated brand systems for B2B SaaS and product launches.' },
    fa: { title: 'نمونه‌کارهای موشن گرافیک و تایپوگرافی حرکتی | استودیو سیاوش', desc: 'تایپوگرافی حرکتی، موشن گرافیک تبلیغاتی و سیستم‌های برند پویا برای پلتفرم‌ها و معرفی محصول.' },
  },
  'brand-identity': {
    en: { title: 'Brand Identity Systems — Logo, Guidelines & Packaging | SIAWSH', desc: 'Complete brand identity systems: logo marks, style guides, packaging design and spatial branding applications.' },
    fa: { title: 'نمونه‌کارهای طراحی هویت بصری | استودیو سیاوش', desc: 'طراحی هویت بصری جامع: لوگو، دفترچه برند، بسته‌بندی و برندینگ محیطی و فضایی.' },
  },
  'ui-ux-web': {
    en: { title: 'Web UI/UX & Interactive Design | SIAWSH Studio', desc: 'SaaS landing pages, product UI/UX design and interactive web experiences designed in Figma.' },
    fa: { title: 'نمونه‌کارهای طراحی وب و رابط کاربری | استودیو سیاوش', desc: 'طراحی سایت تعاملی، لندینگ SaaS و رابط کاربری محصول در فیگما.' },
  },
};

/* ---------- Card ---------- */
function SmoothFloatCard({ project, isLight, index }) {
  const { lang } = useStudioTheme();
  const isFa = lang === 'fa';
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [copied, setCopied] = useState(false);
  const animationDelay = `${(index % 2) * 0.75}s`;

  const title =
    pickLocalized(project, 'title', lang) ||
    getLocalizedString(project.title, lang) ||
    '';

  const description =
    pickLocalized(project, 'subtitle', lang) ||
    pickLocalized(project, 'shortDesc', lang) ||
    pickLocalized(project, 'contextParagraph', lang) ||
    pickLocalized(project.specs || {}, 'deliverables', lang) ||
    pickLocalized(project, 'tagline', lang) ||
    '';

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.min(Math.max(((e.clientX - rect.left) / rect.width) * 100, 0), 100);
    const y = Math.min(Math.max(((e.clientY - rect.top) / rect.height) * 100, 0), 100);
    setMousePos({ x, y });
  };

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const shareUrl = `${window.location.origin}/work/${project.id}`;

    if (navigator.share) {
      try {
        await navigator.share({ title, text: description, url: shareUrl });
        return;
      } catch (err) {
        if (err.name !== 'AbortError') console.error('Share failed:', err);
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const angle = Math.atan2(mousePos.y - 50, mousePos.x - 50) * (180 / Math.PI) + 90;
  const sheenColor = isLight
    ? `linear-gradient(${angle}deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.05) ${mousePos.x}%, rgba(0,0,0,0) 100%)`
    : `linear-gradient(${angle}deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.08) ${mousePos.x}%, rgba(255,255,255,0) 100%)`;

  return (
    <article
      onMouseMove={handleMouseMove}
      dir={isFa ? 'rtl' : 'ltr'}
      className={`group relative flex flex-col justify-between h-full rounded-none backdrop-blur-sm border transition-all duration-500 overflow-hidden ${
        isLight
          ? 'border-black/10 bg-black/2 hover:border-black/30 text-black'
          : 'border-white/10 bg-white/2 hover:border-white/20 text-white'
      }`}
      style={{
        animation: 'ultraSmoothFloat 6s ease-in-out infinite alternate',
        animationDelay: animationDelay,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out z-10"
        style={{ background: sheenColor }}
      />

      <Link to={`/work/${project.id}`} className="flex-1 flex flex-col active:scale-[0.99] transition-transform duration-300">
        <div
          className={`media-wrapper aspect-video w-full overflow-hidden relative border-b ${
            isLight ? 'border-black/10 bg-black/5' : 'border-white/10 bg-white/5'
          }`}
        >
          {project.cardVideo ? (
            <video
              src={project.cardVideo}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <img
              src={project.heroImage}
              alt={title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}
        </div>

        <div className="card-info p-6 flex-1 flex flex-col justify-between gap-3 relative z-20">
          <div>
            <h3
              className={`text-lg md:text-xl font-light tracking-tight leading-snug transition-colors ${
                isFa ? "font-['Vazirmatn',sans-serif]" : "font-sans"
              } ${isLight ? 'text-black group-hover:opacity-75' : 'text-white group-hover:opacity-75'}`}
            >
              {title}
            </h3>

            {description && (
              <p
                className={`mt-2 text-xs md:text-sm leading-relaxed line-clamp-3 ${
                  isFa
                    ? "font-['Vazirmatn',sans-serif] opacity-80"
                    : "font-sans opacity-70"
                } ${isLight ? 'text-black/70' : 'text-white/70'}`}
              >
                {description}
              </p>
            )}

            {/* Clickable service chips — internal linking for SEO + quick filtering */}
            {safeArray(project.tags).length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {safeArray(project.tags).slice(0, 3).map((tagId) => {
                  const meta = TAG_FILTERS.find((t) => t.id === tagId);
                  if (!meta) return null;
                  return (
                    <Link
                      key={tagId}
                      to={`/work?category=${tagId}`}
                      onClick={(e) => e.stopPropagation()}
                      className={`text-[10px] uppercase tracking-widest px-2 py-0.5 border transition-colors ${
                        isLight
                          ? 'border-black/15 text-black/60 hover:bg-black hover:text-white hover:border-black'
                          : 'border-white/15 text-white/60 hover:bg-white hover:text-black hover:border-white'
                      }`}
                    >
                      {isFa ? meta.fa : meta.en}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Link>

      <div className={`h-12 px-6 relative z-30 border-t flex ${isFa ? 'justify-start' : 'justify-end'} items-center ${
        isLight ? 'border-black/10' : 'border-white/10'
      }`}>
        <button
          type="button"
          onClick={handleShare}
          aria-label={isFa ? 'اشتراک‌گذاری پروژه' : 'Share project'}
          className={`p-2 rounded-none backdrop-blur-md transition-all duration-300 border ${
            isLight
              ? 'bg-black/2 hover:bg-black/5 text-black border-black/10 hover:border-black/30'
              : 'bg-white/2 hover:bg-white/5 text-white border-white/10 hover:border-white/30'
          }`}
        >
          {copied ? (
            <span className={`text-[10px] uppercase tracking-widest px-1 ${
              isFa ? "font-['Vazirmatn',sans-serif]" : "font-mono"
            }`}>
              {isFa ? 'کپی شد' : 'Copied'}
            </span>
          ) : (
            <svg className="w-3.5 h-3.5 opacity-70 hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="1.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          )}
        </button>
      </div>
    </article>
  );
}

/* ---------- Page ---------- */
export default function WorkPage() {
  const { isLight, lang, t } = useStudioTheme();
  const isFa = lang === 'fa';
  const [searchParams, setSearchParams] = useSearchParams();

  const activeFilter = searchParams.get('category') || 'all';
  const isPrimaryFilter = PRIMARY_FILTERS.some((f) => f.id === activeFilter);

  const setFilter = (categoryId) => {
    if (categoryId === 'all') {
      setSearchParams({}, { replace: false });
    } else {
      setSearchParams({ category: categoryId }, { replace: false });
    }
  };

  const countFor = (id) => {
    if (id === 'all') return projectsData.length;
    if (id === 'spatial' || id === 'cinematic') {
      return projectsData.filter((p) => p.categoryType?.includes(id)).length;
    }
    return projectsData.filter((p) => safeArray(p.tags).includes(id)).length;
  };

  const filteredProjects = useMemo(() => {
    let result;
    if (activeFilter === 'all') {
      result = [...projectsData];
    } else if (isPrimaryFilter) {
      result = projectsData.filter((p) => p.categoryType?.includes(activeFilter));
    } else {
      result = projectsData.filter((p) => safeArray(p.tags).includes(activeFilter));
    }

    const priorityCategory = activeFilter === 'all' ? 'spatial' : activeFilter;
    return result.sort((a, b) => {
      const aIsPriority = a.categoryType?.includes(priorityCategory) || safeArray(a.tags).includes(priorityCategory);
      const bIsPriority = b.categoryType?.includes(priorityCategory) || safeArray(b.tags).includes(priorityCategory);
      if (aIsPriority && !bIsPriority) return -1;
      if (!aIsPriority && bIsPriority) return 1;
      return 0;
    });
  }, [activeFilter, isPrimaryFilter]);

  const fmt = (n) => new Intl.NumberFormat(isFa ? 'fa-IR' : 'en-US').format(n);

  /* -------- Dynamic per-filter SEO -------- */
  const seo = FILTER_SEO[activeFilter] || FILTER_SEO.all;
  const seoLang = isFa ? seo.fa : seo.en;
  const activeLabel = isPrimaryFilter
    ? (PRIMARY_FILTERS.find((f) => f.id === activeFilter) || PRIMARY_FILTERS[0])
    : (TAG_FILTERS.find((f) => f.id === activeFilter) || null);
  const activeLabelStr = activeLabel ? (isFa ? activeLabel.fa : activeLabel.en) : '';

  /* -------- Structured Data: ItemList of visible projects -------- */
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: seoLang.title,
    numberOfItems: filteredProjects.length,
    itemListElement: filteredProjects.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://siawsh.co/work/${p.id}`,
      name: pickLocalized(p, 'title', lang) || getLocalizedString(p.title, lang),
      image: p.heroImage ? `https://siawsh.co${p.heroImage}` : undefined,
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: isFa ? 'خانه' : 'Home', item: 'https://siawsh.co/' },
      { '@type': 'ListItem', position: 2, name: isFa ? 'نمونه‌کارها' : 'Works', item: 'https://siawsh.co/work' },
      ...(activeLabelStr
        ? [{ '@type': 'ListItem', position: 3, name: activeLabelStr, item: `https://siawsh.co/work?category=${activeFilter}` }]
        : []),
    ],
  };

  return (
    <div dir={isFa ? 'rtl' : 'ltr'} className={`work-page-wrapper relative min-h-screen transition-colors duration-500 ${isLight ? 'bg-white text-black' : 'bg-black text-white'}`}>
      <SEO
        title={seoLang.title}
        description={seoLang.desc}
        keywords={isFa
          ? ['نمونه‌کار طراحی معماری', 'رندر معماری', 'طراحی هویت بصری', 'موشن گرافیک سه بعدی', 'نقاشی دیواری سفارشی', 'طراحی داخلی ۳ بعدی']
          : ['design portfolio', '3d architectural visualization', '3d cgi product animation', 'brand identity system', 'hand-painted mural art', 'commercial video teaser']}
        canonical={activeFilter === 'all' ? 'https://siawsh.co/work' : `https://siawsh.co/work?category=${activeFilter}`}
        schema={itemListSchema}
      />
      {/* Second structured-data block for breadcrumbs */}
      <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>

      <style>{`
        @keyframes ultraSmoothFloat {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        @keyframes filterFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .work-card-enter { animation: filterFadeIn .45s ease-out both; }
      `}</style>

      <Navbar />

      <main className="work-container pt-32 md:pt-40 pb-16 md:pb-24 px-6 md:px-12 max-w-7xl mx-auto">
        {/* ---------- Header + Breadcrumb + Result Count ---------- */}
        <header className="work-header mb-10 md:mb-14">
          <nav aria-label="Breadcrumb" className={`text-[11px] uppercase tracking-widest mb-5 ${isLight ? 'text-black/40' : 'text-white/40'}`}>
            <Link to="/" className="hover:opacity-100 opacity-70 transition-opacity">{isFa ? 'خانه' : 'Home'}</Link>
            <span className="mx-2 opacity-50">/</span>
            <span className="opacity-90">{isFa ? 'نمونه‌کارها' : 'Works'}</span>
            {activeLabelStr && (
              <>
                <span className="mx-2 opacity-50">/</span>
                <span className={isLight ? 'text-black/80' : 'text-white/80'}>{activeLabelStr}</span>
              </>
            )}
          </nav>

          <div className="flex items-end justify-between gap-4 border-b pb-6">
            <div>
              <h1 className={`text-4xl md:text-6xl font-light tracking-tight ${
                isFa ? "font-['Vazirmatn',sans-serif]" : "font-sans"
              }`}>
                {activeFilter === 'all'
                  ? (isFa ? 'نمونه‌کارها و پروژه‌ها' : 'Selected Works')
                  : activeLabelStr}
              </h1>
              <p className={`mt-4 max-w-xl text-sm md:text-base leading-relaxed ${
                isFa ? "font-['Vazirmatn',sans-serif]" : "font-sans"
              } ${isLight ? 'text-black/70' : 'text-white/70'}`}>
                {seoLang.desc}
              </p>
            </div>
            <span className={`hidden sm:block text-sm md:text-base tracking-wide whitespace-nowrap pb-1 ${
              isLight ? 'text-black/60' : 'text-white/60'
            }`}>
              {fmt(filteredProjects.length)} {isFa ? 'پروژه' : (filteredProjects.length === 1 ? 'Project' : 'Projects')}
            </span>
          </div>
        </header>

        {/* ---------- Two-Level Filter System ---------- */}
        <div className="mb-12 space-y-5">
          {/* Level 1 — Primary practice tabs (segmented control) */}
          <div
            role="tablist"
            aria-label={isFa ? 'بخش‌های اصلی' : 'Primary practices'}
            className={`inline-flex rounded-none border ${isLight ? 'border-black/15 bg-black/2' : 'border-white/15 bg-white/2'}`}
          >
            {PRIMARY_FILTERS.map((f) => {
              const isActive = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  role="tab"
                  aria-selected={isActive}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  className={`relative px-5 md:px-7 py-2.5 text-xs md:text-sm uppercase tracking-widest transition-all duration-300 ${
                    isFa ? "font-['Vazirmatn',sans-serif]" : "font-sans"
                  } ${
                    isActive
                      ? isLight
                        ? 'bg-black text-white'
                        : 'bg-white text-black'
                      : isLight
                        ? 'text-black/55 hover:text-black'
                        : 'text-white/55 hover:text-white'
                  }`}
                >
                  {isFa ? f.fa : f.en}
                  <sup className={`ms-1.5 text-[10px] ${isActive ? 'opacity-70' : 'opacity-50'}`}>{fmt(countFor(f.id))}</sup>
                </button>
              );
            })}
          </div>

          {/* Level 2 — Service tag chips */}
          <div className="flex flex-wrap items-center gap-2">
            {TAG_FILTERS.map((f) => {
              const isActive = activeFilter === f.id;
              const count = countFor(f.id);
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={isActive}
                  disabled={count === 0}
                  onClick={() => setFilter(f.id)}
                  className={`group/chip flex items-center gap-1.5 rounded-none border px-3.5 py-1.5 text-[11px] md:text-xs tracking-wide transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed ${
                    isFa ? "font-['Vazirmatn',sans-serif]" : "font-sans"
                  } ${
                    isActive
                      ? isLight
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-black border-white'
                      : isLight
                        ? 'border-black/15 text-black/65 hover:border-black/50 hover:text-black hover:bg-black/5'
                        : 'border-white/15 text-white/65 hover:border-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{isFa ? f.fa : f.en}</span>
                  <span className={`text-[10px] tabular-nums ${isActive ? 'opacity-70' : 'opacity-45 group-hover/chip:opacity-70'}`}>
                    {fmt(count)}
                  </span>
                </button>
              );
            })}

            {/* Clear filter */}
            {activeFilter !== 'all' && (
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`ms-2 flex items-center gap-1.5 text-[11px] md:text-xs tracking-wide underline-offset-4 hover:underline transition-opacity ${
                  isLight ? 'text-black/50 hover:text-black' : 'text-white/50 hover:text-white'
                } ${isFa ? "font-['Vazirmatn',sans-serif]" : "font-sans"}`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                {isFa ? 'حذف فیلتر' : 'Clear filter'}
              </button>
            )}
          </div>
        </div>

        {/* ---------- Grid ---------- */}
        {filteredProjects.length > 0 ? (
          <section
            className="work-grid grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch"
            aria-live="polite"
          >
            {filteredProjects.map((project, index) => (
              <div key={`${activeFilter}-${project.id}`} className="work-card-enter">
                <SmoothFloatCard project={project} isLight={isLight} index={index} />
              </div>
            ))}
          </section>
        ) : (
          <div className={`py-24 text-center border ${isLight ? 'border-black/10' : 'border-white/10'}`}>
            <p className={`text-lg ${isFa ? "font-['Vazirmatn',sans-serif]" : "font-sans"} opacity-70`}>
              {isFa ? 'پروژه‌ای با این فیلتر یافت نشد.' : 'No projects match this filter yet.'}
            </p>
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`mt-6 text-xs uppercase tracking-widest border-b pb-1 transition-opacity hover:opacity-70 ${
                isLight ? 'text-black' : 'text-white'
              } ${isFa ? "font-['Vazirmatn',sans-serif]" : "font-sans"}`}
            >
              {isFa ? 'نمایش همه پروژه‌ها' : 'View all works'}
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}