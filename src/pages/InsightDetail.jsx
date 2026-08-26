import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import ShareButtons from '../components/ShareButtons.jsx';
import { useStudioTheme } from '../context/ThemeContext.jsx';
import { ARTICLES } from '../data/articles.js';

export default function InsightDetail() {
  const { slug } = useParams();
  const { isLight } = useStudioTheme();
  const [scrollProgress, setScrollProgress] = useState(0);

  const articleIndex = ARTICLES.findIndex((a) => a.slug === slug);
  const article = ARTICLES[articleIndex];
  const nextArticle = ARTICLES[(articleIndex + 1) % ARTICLES.length];

  // Scroll Progress Bar & Scroll Top Reset
  useEffect(() => {
    window.scrollTo(0, 0);

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [slug]);

  // Dynamic SEO Title & JSON-LD Schema
  useEffect(() => {
    if (article) {
      document.title = article.metaTitle || `${article.title} | SIAWSH Studio`;

      const schemaData = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: article.title,
        description: article.excerpt,
        image: [article.coverImage],
        datePublished: article.date,
        author: {
          "@type": "Organization",
          name: article.author?.name || "SIAWSH Studio",
        },
        publisher: {
          "@type": "Organization",
          name: "SIAWSH Studio",
          logo: {
            "@type": "ImageObject",
            url: "https://www.siawsh.co/favicon.svg"
          }
        }
      };

      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = "article-json-ld";
      script.innerHTML = JSON.stringify(schemaData);
      document.head.appendChild(script);

      return () => {
        const existingScript = document.getElementById("article-json-ld");
        if (existingScript) {
          document.head.removeChild(existingScript);
        }
      };
    }
  }, [article]);

  if (!article) {
    return (
      <div className={`min-h-screen flex flex-col justify-between ${isLight ? 'bg-white text-black' : 'bg-black text-white'}`}>
        <Navbar />
        <div className="text-center pt-40 pb-20">
          <h1 className="text-2xl mb-4 font-light">Article Not Found</h1>
          <Link to="/insights" className="text-xs uppercase tracking-widest underline font-mono">Back to Insights</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isLight ? 'bg-white text-black' : 'bg-black text-white'}`}>
      {/* Reading Progress Line */}
      <div 
        className={`fixed top-0 left-0 h-0.5 z-1001 transition-all duration-75 ${isLight ? 'bg-black' : 'bg-white'}`}
        style={{ width: `${scrollProgress}%` }}
      />

      <Navbar />

      <main className="pt-36 pb-24 px-6 md:px-12 max-w-4xl mx-auto">
        <Link to="/insights" className="text-xs tracking-widest uppercase opacity-50 hover:opacity-100 transition-opacity mb-8 inline-block font-mono">
          ← Back to Insights
        </Link>

        {/* Title and Metadata Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 text-xs tracking-widest uppercase opacity-50 mb-4 font-mono">
            <span>{article.category}</span>
            <span>/</span>
            <span>{article.date}</span>
            <span>/</span>
            <span>{article.readTime}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-light leading-tight mb-8">
            {article.title}
          </h1>

          {article.author && (
            <div className={`flex items-center gap-4 pt-6 border-t ${isLight ? 'border-neutral-200' : 'border-neutral-800/20'}`}>
              <div className={`w-10 h-10 rounded-none border flex items-center justify-center p-2 shrink-0 ${
                isLight 
                  ? 'border-neutral-300 bg-neutral-50' 
                  : 'border-neutral-800 bg-neutral-900/50'
              }`}>
                <img 
                  src="/favicon.svg" 
                  alt={article.author.name}
                  className="w-full h-full object-contain" 
                />
              </div>
              <div className="flex flex-col font-mono">
                <span className="text-xs font-semibold tracking-wider uppercase">
                  {article.author.name}
                </span>
                <span className="text-[10px] uppercase tracking-widest opacity-50 mt-0.5">
                  {article.author.role}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Hero Media */}
        <div className="aspect-video overflow-hidden mb-16 bg-neutral-900 rounded-none border border-neutral-800/20">
          <img 
            src={article.coverImage} 
            alt={article.title}
            className="w-full h-full object-cover rounded-none"
          />
        </div>

        {/* Reader Rendering Engine */}
        <article className="max-w-2xl mx-auto font-light leading-relaxed space-y-8">
          {article.content.map((block, index) => {
            if (block.type === 'lead') {
              return (
                <p key={index} className="text-xl leading-relaxed opacity-90 font-light">
                  {block.text}
                </p>
              );
            }
            if (block.type === 'heading') {
              return (
                <h2 key={index} className="text-2xl font-light pt-6 border-t border-neutral-800/20 tracking-tight">
                  {block.text}
                </h2>
              );
            }
            if (block.type === 'paragraph') {
              return (
                <p key={index} className="opacity-70 leading-relaxed font-light">
                  {block.text}
                </p>
              );
            }
            if (block.type === 'quote') {
              return (
                <blockquote key={index} className="border-l border-neutral-500 pl-6 my-8 italic opacity-85 text-lg font-light">
                  "{block.text}"
                </blockquote>
              );
            }
            if (block.type === 'code') {
              return (
                <div key={index} className="my-8 rounded-none bg-neutral-900 text-neutral-100 p-5 font-mono text-xs border border-neutral-800 overflow-x-auto">
                  <div className="text-[10px] uppercase text-neutral-500 mb-2 border-b border-neutral-800 pb-1">
                    {block.language || 'Code'}
                  </div>
                  <pre>
                    <code>{block.text}</code>
                  </pre>
                </div>
              );
            }
            return null;
          })}
        </article>

        {/* Sharing Bar */}
        <div className="max-w-2xl mx-auto">
          <ShareButtons title={article.title} excerpt={article.excerpt} isLight={isLight} />
        </div>

        {/* Up Next Frame */}
        {nextArticle && (
          <div className="max-w-2xl mx-auto mt-16 pt-8 border-t border-neutral-800/20">
            <span className="text-xs uppercase tracking-widest opacity-50 block mb-4 font-mono">UP NEXT</span>
            <Link 
              to={`/insights/${nextArticle.slug}`}
              className={`group block p-8 rounded-none border transition-colors ${
                isLight 
                  ? 'border-neutral-300 hover:border-black' 
                  : 'border-neutral-700/40 hover:border-white'
              }`}
            >
              <span className="text-xs uppercase tracking-widest opacity-50 block mb-3 font-mono">{nextArticle.category}</span>
              <h3 className="text-xl md:text-2xl font-light tracking-tight group-hover:opacity-70 transition-opacity">
                {nextArticle.title} →
              </h3>
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}