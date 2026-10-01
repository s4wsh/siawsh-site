import React, { useEffect } from 'react';
import './ArticlePage.css';
import { articleKitchenRedesignCaseStudy as article } from './articleKitchenRedesignCaseStudy';

const isFa = (str) => /[\u0600-\u06FF]/.test(str);

export default function ArticlePage({ lang = 'fa' }) {
  const fa = lang === 'fa';

  // Set document direction + SEO meta tags dynamically
  useEffect(() => {
    document.documentElement.dir = fa ? 'rtl' : 'ltr';
    document.documentElement.lang = fa ? 'fa' : 'en';
    document.title = fa ? article.metaTitleFa : article.metaTitle;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', fa ? article.metaDescriptionFa : article.metaDescription);
    const kw = document.querySelector('meta[name="keywords"]') || document.createElement('meta');
    kw.setAttribute('name', 'keywords');
    kw.setAttribute('content', article.keywords.join(', '));
    if (!kw.parentNode) document.head.appendChild(kw);
  }, [fa]);

  return (
    <article
      className="article-page"
      dir={fa ? 'rtl' : 'ltr'}
      lang={fa ? 'fa' : 'en'}
      itemScope
      itemType="https://schema.org/Article"
    >
      {/* ---------- HERO ---------- */}
      <header className="article-hero">
        <div className="article-hero__inner">
          <button type="button" className="article-back" onClick={() => window.history.back()}>
            <span className="article-back__arrow" aria-hidden="true">{fa ? '←' : '→'}</span>
            {fa ? 'بازگشت به مقالات' : 'Back to Articles'}
          </button>

          <div className="article-meta-line">
            <span>{fa ? article.categoryFa : article.category}</span>
            <span className="article-meta-line__dot">/</span>
            <span>{fa ? article.dateFa : article.date}</span>
            <span className="article-meta-line__dot">/</span>
            <span>{fa ? article.readTimeFa : article.readTime}</span>
          </div>

          <h1 className="article-title" itemProp="headline">
            {fa ? article.titleFa : article.title}
          </h1>

          <div className="article-author" itemProp="author" itemScope itemType="https://schema.org/Organization">
            <meta itemProp="name" content={fa ? article.author.nameFa : article.author.name} />
            <p className="article-author__name">{fa ? article.author.nameFa : article.author.name}</p>
            <p className="article-author__role">{fa ? article.author.roleFa : article.author.role}</p>
          </div>
        </div>
      </header>

      <div className="article-divider" role="separator" />

      {/* ---------- COVER ---------- */}
      <div className="article-cover">
        <img
          src={article.coverImage}
          alt={fa ? article.titleFa : article.title}
          width="1200"
          height="675"
          loading="eager"
          fetchpriority="high"
        />
      </div>

      {/* ---------- BODY ---------- */}
      <div className="article-body">
        {article.content.map((block, i) => {
          switch (block.type) {
            case 'lead':
              return (
                <p key={i} className="article-lead">
                  {fa ? block.textFa : block.text}
                </p>
              );
            case 'paragraph':
              return <p key={i} className="article-p">{fa ? block.textFa : block.text}</p>;
            case 'heading':
              return (
                <h2 key={i} className="article-h2">
                  {/* accent line: logical property -> right in RTL, left in LTR */}
                  <span className="article-h2__line" aria-hidden="true" />
                  {fa ? block.textFa : block.text}
                </h2>
              );
            case 'image':
              return (
                <figure key={i} className="article-figure">
                  <img
                    src={block.url}
                    alt={fa ? block.altFa : block.alt}
                    width={block.width}
                    height={block.height}
                    loading="lazy"
                    decoding="async"
                  />
                  <figcaption className="article-figcaption">
                    {fa ? block.captionFa : block.caption}
                  </figcaption>
                </figure>
              );
            case 'table': {
              const headers = fa ? block.headersFa : block.headers;
              const rows = fa ? block.rowsFa : block.rows;
              return (
                <div key={i} className="article-table-wrap">
                  <table className="article-table">
                    <thead>
                      <tr>{headers.map((h, j) => <th key={j} scope="col">{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {rows.map((row, r) => (
                        <tr key={r}>{row.map((cell, c) => <td key={c}>{cell}</td>)}</tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            }
            default:
              return null;
          }
        })}
      </div>
    </article>
  );
}