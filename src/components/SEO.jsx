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

// Site-wide Organization schema — rendered on every page for brand entity building
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'SIAWSH Studio | استودیو سیاوش',
  alternateName: ['SIAWSH', 'Siavash Afsari Studio', 'استودیو سیاوش'],
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.svg`,
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
  canonical,
  keywords = [],
  schema = null,
  image,
  type = 'website',
  noindex = false,
}) {
  const { lang } = useStudioTheme();
  const isFa = lang === 'fa';

  // Append brand suffix when the caller didn't include it
  const fullTitle =
    title && (title.includes('SIAWSH') || title.includes('سیاوش'))
      ? title
      : title
      ? `${title} | SIAWSH Studio`
      : 'SIAWSH — Spatial Architecture, 3D Motion & Design Studio | استودیو سیاوش';

  // Format Canonical URL
  const canonicalPath = canonical ? (canonical.startsWith('http') ? new URL(canonical).pathname : canonical) : '';
  const canonicalUrl = canonical
    ? (canonical.startsWith('http') ? canonical : `${SITE_URL}${canonical.startsWith('/') ? '' : '/'}${canonical}`)
    : `${SITE_URL}/`;

  // Dynamic hreflang generation based on current route path
  const basePath = canonicalPath.replace(/^\/(fa\/|fa$)/, '/').replace(/\/$/, '') || '/home';
  const enPath = basePath.startsWith('/') ? basePath : `/${basePath}`;
  const faPath = `/fa${enPath === '/' ? '' : enPath}`;

  const ogImage = image
    ? (image.startsWith('http') ? image : `${SITE_URL}${image.startsWith('/') ? '' : '/'}${image}`)
    : DEFAULT_OG_IMAGE;

  const keywordString = Array.isArray(keywords) ? keywords.join(', ') : keywords;

  const schemas = [organizationSchema, ...(Array.isArray(schema) ? schema : schema ? [schema] : [])];

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {keywordString && <meta name="keywords" content={keywordString} />}
      <meta
        name="robots"
        content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1'}
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