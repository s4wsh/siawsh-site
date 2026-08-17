import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import sitemap from 'vite-plugin-sitemap'
import { projectsData } from './src/data/projectsData.js'

// Automatically extract project IDs to construct routes (/work/project-id)
const dynamicRoutes = projectsData.map((project) => `/work/${project.id}`)

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    sitemap({
      hostname: 'https://siawsh.co',
      dynamicRoutes,
      robots: [
        {
          userAgent: '*',
          allow: '/',
        },
      ],
    }),
  ],
})