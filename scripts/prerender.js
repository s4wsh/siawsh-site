import fs from 'node:fs'
import path from 'node:path'
import express from 'express'
import puppeteer from 'puppeteer'
import { projectsData } from '../src/data/projectsData.js'

const PORT = 4567
const DIST_DIR = path.resolve('dist')

const staticRoutes = ['/', '/work', '/about', '/contact']
const dynamicProjectRoutes = projectsData.map((p) => `/work/${p.id}`)
const routes = [...staticRoutes, ...dynamicProjectRoutes]

async function prerender() {
  console.log('🚀 Starting post-build SSG prerendering...')

  // 1. Start local server serving the built `dist` folder
  const app = express()
  app.use(express.static(DIST_DIR))

  // Express 5 catch-all syntax for SPA fallback
  app.get('/{*splat}', (req, res) => {
    res.sendFile(path.join(DIST_DIR, 'index.html'))
  })

  const server = app.listen(PORT)

  // 2. Launch Puppeteer
  const browser = await puppeteer.launch({ headless: 'new' })
  const page = await browser.newPage()

  for (const route of routes) {
    const url = `http://localhost:${PORT}${route}`
    console.log(`📸 Prerendering: ${route}`)

    await page.goto(url, { waitUntil: 'networkidle0' })

    const html = await page.content()

    // Map route to output path (e.g., /work -> dist/work/index.html)
    const relativePath = route === '/' ? 'index.html' : `${route.slice(1)}/index.html`
    const filePath = path.join(DIST_DIR, relativePath)

    // Ensure directory exists
    fs.mkdirSync(path.dirname(filePath), { recursive: true })
    fs.writeFileSync(filePath, html, 'utf-8')
  }

  await browser.close()
  server.close()
  console.log('✅ All routes successfully prerendered!')
}

prerender().catch((err) => {
  console.error('❌ Prerender failed:', err)
  process.exit(1)
})