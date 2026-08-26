if (typeof globalThis.sessionStorage === 'undefined') {
  globalThis.sessionStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
  }
}

if (typeof globalThis.localStorage === 'undefined') {
  globalThis.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
  }
}

import fs from 'node:fs'
import path from 'node:path'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { HelmetProvider } from 'react-helmet-async'
import { projectsData } from '../src/data/projectsData.js'
import App from '../src/App.jsx'

const DIST_DIR = path.resolve('dist')
const INDEX_HTML_PATH = path.join(DIST_DIR, 'index.html')

const staticRoutes = ['/', '/work', '/about', '/contact']
const dynamicProjectRoutes = projectsData.map((p) => `/work/${p.id}`)
const routes = [...staticRoutes, ...dynamicProjectRoutes]

async function prerender() {
  console.log('🚀 Starting native React SSG prerendering...')

  if (!fs.existsSync(INDEX_HTML_PATH)) {
    throw new Error('dist/index.html not found. Run vite build first.')
  }

  const template = fs.readFileSync(INDEX_HTML_PATH, 'utf-8')

  for (const route of routes) {
    console.log(`📄 Prerendering route: ${route}`)

    const helmetContext = {}

    // Render App component to static markup using StaticRouter from 'react-router'
    const appHtml = renderToString(
      React.createElement(
        HelmetProvider,
        { context: helmetContext },
        React.createElement(
          StaticRouter,
          { location: route },
          React.createElement(App)
        )
      )
    )

    const { helmet } = helmetContext

    // Inject rendered React HTML and dynamic Helmet head tags into index.html template
    let html = template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)

    if (helmet) {
      const headTags = [
        helmet.title?.toString(),
        helmet.meta?.toString(),
        helmet.link?.toString(),
      ]
        .filter(Boolean)
        .join('\n')

      html = html.replace('</head>', `${headTags}\n</head>`)
    }

    // Determine target output path
    const relativePath = route === '/' ? 'index.html' : `${route.slice(1)}/index.html`
    const filePath = path.join(DIST_DIR, relativePath)

    fs.mkdirSync(path.dirname(filePath), { recursive: true })
    fs.writeFileSync(filePath, html, 'utf-8')
  }

  console.log('✅ All routes successfully prerendered!')
}

prerender().catch((err) => {
  console.error('❌ Prerender failed:', err)
  process.exit(1)
})