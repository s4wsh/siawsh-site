// src/data/articles.js
const modules = import.meta.glob('./articles/*.js', { eager: true });

export const articles = Object.values(modules)
  .map((mod) => mod.default || Object.values(mod)[0])
  .filter((article) => article && (article.slug || article.title || article.titleFa)); // فیلتر کردن فایل‌ها و مقادیر خالی

// Alias export to resolve import mismatches across components
export const ARTICLES = articles;

export const getArticleBySlug = (slug) => {
  return articles.find((article) => article.slug === slug);
};

export default articles;