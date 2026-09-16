import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import sitemap from 'vite-plugin-sitemap'
import { projectsData } from './src/data/projectsData.js'

const HOSTNAME = 'https://siavashstudio.ir'
const dynamicProjectRoutes = projectsData.map((project) => `/work/${project.id}`)

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    sitemap({
      hostname: HOSTNAME,
      dynamicRoutes: dynamicProjectRoutes,
      generateRobotsTxt: true,
    }),
  ],
  build: {
    target: 'esnext',
    minify: 'oxc',
    cssMinify: true,
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