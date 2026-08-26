import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { useStudioTheme } from '../context/ThemeContext.jsx';
import { ARTICLES } from '../data/articles.js';

export default function InsightDetail() {
  const { slug } = useParams();
  const { isLight } = useStudioTheme();
  const [scrollProgress, setScrollProgress] = useState(0);

  const article = ARTICLES.find((a) => a.slug === slug);

  // Scroll Progress Bar Indicator
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!article) {
    return (
      <div className={`min-h-screen flex flex-col justify-between ${isLight ? 'bg-white text-black' : 'bg-black text-white'}`}>
        <Navbar />
        <div className="text-center pt-40 pb-20">
          <h1 className="text-2xl mb-4">Article Not Found</h1>
          <Link to="/insights" className="text-xs uppercase tracking-widest underline">Back to Insights</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isLight ? 'bg-white text-black' : 'bg-black text-white'}`}>
      {/* Top Reading Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-2px bg-neutral-400 z-1001 transition-all duration-75"
        style={{ width: `${scrollProgress}%` }}
      />

      <Navbar />

      <main className="pt-36 pb-24 px-6 md:px-12 max-w-4xl mx-auto">
        <Link to="/insights" className="text-xs tracking-widest uppercase opacity-50 hover:opacity-100 transition-opacity mb-8 inline-block">
          ← Back to Insights
        </Link>

        {/* Title and Metadata */}
        <div className="mb-12">
          <div className="flex items-center gap-3 text-xs tracking-widest uppercase opacity-50 mb-4">
            <span>{article.category}</span>
            <span>/</span>
            <span>{article.date}</span>
            <span>/</span>
            <span>{article.readTime}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-light leading-tight mb-6">
            {article.title}
          </h1>
        </div>

        {/* Hero Media */}
        <div className="aspect-video overflow-hidden mb-16 bg-neutral-900">
          <img 
            src={article.coverImage} 
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Dynamic Reader Rendering */}
        <article className="max-w-2xl mx-auto font-light leading-relaxed space-y-8">
          {article.content.map((block, index) => {
            if (block.type === 'lead') {
              return (
                <p key={index} className="text-xl leading-relaxed opacity-90 font-normal">
                  {block.text}
                </p>
              );
            }
            if (block.type === 'heading') {
              return (
                <h2 key={index} className="text-2xl font-normal pt-6 border-t border-neutral-800/20">
                  {block.text}
                </h2>
              );
            }
            if (block.type === 'paragraph') {
              return (
                <p key={index} className="opacity-70 leading-relaxed">
                  {block.text}
                </p>
              );
            }
            if (block.type === 'quote') {
              return (
                <blockquote key={index} className="border-l-2 border-neutral-500 pl-6 my-8 italic opacity-85 text-lg">
                  "{block.text}"
                </blockquote>
              );
            }
            return null;
          })}
        </article>
      </main>

      <Footer />
    </div>
  );
}