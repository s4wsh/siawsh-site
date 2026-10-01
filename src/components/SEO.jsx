import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useStudioTheme } from '../context/ThemeContext.jsx';

/**
 * Central SEO component — powers every page via react-helmet-async.
 * Props:
 *  - title        (string)
 *  - description  (string)
 *  - canonical    (string, absolute URL or path starting with /)
 *  - keywords     (array of strings | string)
 *  - schema       (object | array — JSON-LD structured data)
 *  - image        (string, absolute og:image URL or site path)
 *  - type         ('website' | 'article')
 *  - noindex      (bool — for gateway/utility pages)
 */

const SITE_URL = 'https://www.siavashstudio.ir'; // Primary canonical domain with www
const DEFAULT_OG_IMAGE = `${SITE_URL}/projects/croissanthouse/croissant_house_coffee_cup_and_fresh_croissant.webp`;

// Helper for clean, bulletproof URL joining
const safeUrl = (base, path = '') => {
  if (!path) return base;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
};

// Site-wide Organization schema — rendered on every page for brand entity building
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'SIAWSH Studio | استودیو سیاوش',
  alternateName: ['SIAWSH', 'Siavash Afsari Studio', 'استودیو سیاوش'],
  url: SITE_URL,
  logo: safeUrl(SITE_URL, '/favicon.svg'),
  email: 'info@siavashstudio.ir',
  sameAs: [
    'https://www.instagram.com/siawsh/',
    'https://www.behance.net/siawsh',
    'https://www.linkedin.com/in/siavash-afsari/',
    'https://vimeo.com/siawsh',
  ],
};

export default function SEO({
  title,
  description = '',
  canonical = '',
  keywords = [],
  schema = null,
  image = '',
  type = 'website',
  noindex = false,
}) {
  // Safely extract theme context with fallback
  let isFa = false;
  try {
    const themeContext = useStudioTheme();
    if (themeContext && themeContext.lang) {
      isFa = themeContext.lang === 'fa';
    }
  } catch (e) {
    isFa = false;
  }

  // Format full document title
  const fullTitle =
    title && (title.includes('SIAWSH') || title.includes('سیاوش'))
      ? title
      : title
      ? `${title} | SIAWSH Studio`
      : 'SIAWSH — Spatial Architecture, 3D Motion & Design Studio | استودیو سیاوش';

  // Format Canonical URL
  const canonicalUrl = canonical ? safeUrl(SITE_URL, canonical) : `${SITE_URL}/`;

  // Parse path for dynamic hreflang alternate links
  let cleanPath = '';
  if (canonical) {
    if (canonical.startsWith('http://') || canonical.startsWith('https://')) {
      try {
        cleanPath = new URL(canonical).pathname;
      } catch (e) {
        cleanPath = '';
      }
    } else {
      cleanPath = canonical;
    }
  }

  const basePath = cleanPath.replace(/^\/(fa\/|fa$)/, '/').replace(/\/$/, '') || '/home';
  const enPath = basePath.startsWith('/') ? basePath : `/${basePath}`;
  const faPath = `/fa${enPath === '/' ? '' : enPath}`;

  // Format Open Graph image URL
  const ogImage = image ? safeUrl(SITE_URL, image) : DEFAULT_OG_IMAGE;

  // Format Keywords
  const keywordString = Array.isArray(keywords) ? keywords.join(', ') : keywords;

  // Combine schemas
  const schemas = [organizationSchema, ...(Array.isArray(schema) ? schema : schema ? [schema] : [])];

  const isNoIndex = Boolean(noindex);

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {keywordString && <meta name="keywords" content={keywordString} />}
      
      {/* Robots Directive */}
      <meta
        name="robots"
        content={isNoIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1'}
      />
      
      <link rel="canonical" href={canonicalUrl} />

      {/* Dynamic Route hreflang Alternates */}
      <link rel="alternate" hrefLang="en" href={`${SITE_URL}${enPath}`} />
      <link rel="alternate" hrefLang="fa" href={`${SITE_URL}${faPath}`} />
      <link rel="alternate" hrefLang="x-default" href={`${SITE_URL}${enPath}`} />

      {/* Open Graph */}
      <meta property="og:site_name" content={isFa ? 'استودیو سیاوش | SIAWSH Studio' : 'SIAWSH Studio'} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:locale" content={isFa ? 'fa_IR' : 'en_US'} />
      <meta property="og:locale:alternate" content={isFa ? 'en_US' : 'fa_IR'} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD Structured Data */}
      {schemas.map((s, i) => (
        <script key={`schema-${i}`} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
}