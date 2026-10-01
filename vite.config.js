import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import sitemap from 'vite-plugin-sitemap'
import { projectsData } from './src/data/projectsData.js'
import { articles } from './src/data/articles.js'

// Primary canonical domain — matching Vercel target
const HOSTNAME = 'https://www.siavashstudio.ir'

// Dynamic routes for portfolio projects & case studies / articles
const dynamicProjectRoutes = (projectsData || []).map((project) => `/work/${project.id}`)
const dynamicArticleRoutes = (articles || [])
  .filter((article) => article && article.slug)
  .map((article) => `/insights/${article.slug}`)

// Static crawlable routes
const staticRoutes = [
  '/',
  '/home',
  '/work',
  '/about',
  '/insights',
  '/contact',
  '/fa/home',
  '/fa/work',
  '/fa/about',
  '/fa/insights',
  '/fa/contact',
]

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    sitemap({
      hostname: HOSTNAME,
      dynamicRoutes: [...staticRoutes, ...dynamicProjectRoutes, ...dynamicArticleRoutes],
      generateRobotsTxt: true,
      robots: [
        { userAgent: '*', allow: '/', disallow: ['/gateway', '/fa/gateway'] },
      ],
    }),
  ],
  build: {
    target: 'esnext',
    minify: 'oxc',
    cssMinify: true,
    cssCodeSplit: true,
    oxc: {
      minify: {
        drop: ['console', 'debugger'],
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three') || id.includes('@react-three')) return 'three-vendor';
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) return 'react-vendor';
            return 'vendor';
          }
        },
      },
    },
  },
})