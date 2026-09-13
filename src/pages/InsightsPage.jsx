import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { useStudioTheme } from '../context/ThemeContext.jsx';
import { ARTICLES } from '../data/articles.js';

export default function InsightsPage() {
  const { isLight, lang } = useStudioTheme();
  const isFa = lang === 'fa';

  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = isFa ? "مقالات، انیمیشن سه‌بعدی و رندرینگ — استودیو سیاوش" : "Insights & R&D — SIAWSH Studio";
  }, [isFa]);

  const categories = isFa 
    ? [
        { id: 'All', label: 'همه مقالات' },
        { id: 'Spatial Design', label: 'رندرینگ و معماری' },
        { id: '3D Motion', label: 'انیمیشن و مووشن سه‌بعدی' },
        { id: 'R&D', label: 'تحقیق و توسعه (R&D)' }
      ]
    : [
        { id: 'All', label: 'ALL' },
        { id: 'Spatial Design', label: 'SPATIAL DESIGN' },
        { id: '3D Motion', label: '3D MOTION' },
        { id: 'R&D', label: 'R&D' }
      ];

  const filteredArticles = selectedCategory === 'All'
    ? ARTICLES
    : ARTICLES.filter((a) => a.category === selectedCategory);

  return (
    <div 
      dir={isFa ? 'rtl' : 'ltr'}
      className={`min-h-screen transition-colors duration-500 ${isLight ? 'bg-white text-black' : 'bg-black text-white'}`}
      style={{ fontFamily: isFa ? "Vazirmatn, var(--font-sans), system-ui, sans-serif" : "inherit" }}
    >
      <Navbar />
      
      <main className="pt-36 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className={`mb-12 border-b pb-10 ${isLight ? 'border-neutral-200' : 'border-neutral-800/40'}`}>
          <div className="flex items-center gap-2 mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00f0ff] animate-pulse" />
            <span className="text-xs tracking-[0.3em] uppercase opacity-50 font-mono text-[#00f0ff]">
              {isFa ? 'ژورنال تخصصی // رندرینگ، انیمیشن و معماری' : 'TECHNICAL JOURNAL // SIAWSH STUDIO'}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-light tracking-tight">
            {isFa ? 'مقالات تخصصی و نوآوری‌های تکنیکال' : 'Insights & R&D'}
          </h1>
        </div>

        {/* Filter Bar */}
        <div className="flex gap-3 mb-12 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`text-xs uppercase tracking-widest px-5 py-2.5 border rounded-none transition-all duration-300 ${
                selectedCategory === cat.id
                  ? (isLight ? 'border-black bg-black text-white' : 'border-white bg-white text-black')
                  : (isLight ? 'border-neutral-300 hover:border-black text-neutral-700' : 'border-neutral-800 hover:border-white text-neutral-400')
              }`}
              style={{ fontFamily: 'inherit' }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Editorial Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {filteredArticles.map((article) => (
            <Link 
              key={article.slug} 
              to={`/insights/${article.slug}`}
              className={`group flex flex-col justify-between border p-6 md:p-8 rounded-none transition-all duration-500 ${
                isLight 
                  ? 'border-neutral-200 hover:border-black bg-neutral-50/50 hover:bg-neutral-50' 
                  : 'border-neutral-800/40 hover:border-neutral-500 bg-neutral-900/30 hover:bg-neutral-900/60'
              }`}
            >
              <div>
                {/* Media Frame */}
                <div className={`overflow-hidden mb-6 aspect-16/10 rounded-none border ${
                  isLight ? 'border-neutral-200 bg-neutral-100' : 'border-neutral-800/40 bg-neutral-900'
                }`}>
                  <img 
                    src={article.coverImage} 
                    alt={isFa ? article.titleFa || article.title : article.title} 
                    className="w-full h-full object-cover rounded-none transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>

                {/* Article Meta Header */}
                <div className="flex items-center gap-3 text-xs opacity-50 mb-4 tracking-widest uppercase font-mono">
                  <span>{isFa ? article.categoryFa || article.category : article.category}</span>
                  <span>/</span>
                  <span>{isFa ? article.dateFa || article.date : article.date}</span>
                  <span>/</span>
                  <span>{isFa ? article.readTimeFa || article.readTime : article.readTime}</span>
                </div>

                {/* Article Title & Excerpt */}
                <h2 className="text-2xl font-light leading-snug mb-3 group-hover:opacity-70 transition-opacity">
                  {isFa ? article.titleFa || article.title : article.title}
                </h2>
                <p className="text-sm opacity-60 leading-relaxed font-light mb-6">
                  {isFa ? article.excerptFa || article.excerpt : article.excerpt}
                </p>
              </div>

              {/* Action Link Footer */}
              <div className={`pt-6 border-t flex items-center justify-between text-xs uppercase tracking-widest ${
                isLight ? 'border-neutral-200' : 'border-neutral-800/40'
              }`}>
                <span>{isFa ? 'مشاهده و مطالعه مقاله' : 'Read Entry'}</span>
                <span className={`transition-transform duration-300 ${isFa ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}>
                  {isFa ? '←' : '→'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}