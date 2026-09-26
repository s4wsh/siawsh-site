import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import sitemap from 'vite-plugin-sitemap'
import { projectsData } from './src/data/projectsData.js'

// Primary domain — siavashstudio.ir . Keep in sync with SITE_URL inside src/components/SEO.jsx
const HOSTNAME = 'https://siavashstudio.ir'
const dynamicProjectRoutes = projectsData.map((project) => `/work/${project.id}`)

// Static, crawlable routes. Query-param URLs like /work?category=x are NOT
// listed here on purpose — they are indexed via their own canonical tags.
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
      dynamicRoutes: [...staticRoutes, ...dynamicProjectRoutes],
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
            if (id.includes('three')) return 'three-vendor';
            if (id.includes('react')) return 'react-vendor';
            return 'vendor';
          }
        },
      },
    },
  },
})