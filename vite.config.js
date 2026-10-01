import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import sitemap from 'vite-plugin-sitemap'
import fs from 'node:fs'
import path from 'node:path'
import { projectsData } from './src/data/projectsData.js'

// Primary canonical domain — matching Vercel target
const HOSTNAME = 'https://www.siavashstudio.ir'

// Dynamic routes for portfolio projects
const dynamicProjectRoutes = (projectsData || []).map((project) => `/work/${project.id}`)

// Read article slugs directly from file system to avoid importing Vite runtime macros in Node.js
const articlesDir = path.resolve(process.cwd(), 'src/data/articles')
let dynamicArticleRoutes = []

try {
  if (fs.existsSync(articlesDir)) {
    const files = fs.readdirSync(articlesDir)
    dynamicArticleRoutes = files
      .filter((file) => file.endsWith('.js') && file !== 'index.js')
      .map((file) => `/insights/${file.replace(/\.js$/, '')}`)
  }
} catch (e) {
  console.warn('Could not read articles directory for sitemap generation:', e)
}

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