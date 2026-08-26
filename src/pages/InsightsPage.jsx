import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { useStudioTheme } from '../context/ThemeContext.jsx';
import { ARTICLES } from '../data/articles.js';

export default function InsightsPage() {
  const { isLight } = useStudioTheme();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Spatial Design', '3D Motion', 'R&D'];

  const filteredArticles = selectedCategory === 'All'
    ? ARTICLES
    : ARTICLES.filter((a) => a.category === selectedCategory);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isLight ? 'bg-white text-black' : 'bg-black text-white'}`}>
      <Navbar />
      
      <main className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-16 border-b border-neutral-800/20 pb-12">
          <p className="text-xs tracking-[0.3em] uppercase opacity-50 mb-3">Technical Journal</p>
          <h1 className="text-4xl md:text-6xl font-light tracking-tight">Insights & R&D</h1>
        </div>

        {/* Filter Bar */}
        <div className="flex gap-4 mb-12 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs uppercase tracking-widest px-4 py-2 border transition-all ${
                selectedCategory === cat
                  ? (isLight ? 'border-black bg-black text-white' : 'border-white bg-white text-black')
                  : 'border-neutral-700/40 opacity-60 hover:opacity-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {filteredArticles.map((article) => (
            <Link 
              key={article.slug} 
              to={`/insights/${article.slug}`}
              className="group cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="overflow-hidden mb-6 aspect-16/10 bg-neutral-900">
                  <img 
                    src={article.coverImage} 
                    alt={article.title} 
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
                <div className="flex items-center gap-3 text-xs opacity-50 mb-3 tracking-widest uppercase">
                  <span>{article.category}</span>
                  <span>•</span>
                  <span>{article.date}</span>
                  <span>•</span>
                  <span>{article.readTime}</span>
                </div>
                <h2 className="text-2xl font-normal leading-snug mb-3 group-hover:opacity-70 transition-opacity">
                  {article.title}
                </h2>
                <p className="text-sm opacity-60 leading-relaxed font-light">
                  {article.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}