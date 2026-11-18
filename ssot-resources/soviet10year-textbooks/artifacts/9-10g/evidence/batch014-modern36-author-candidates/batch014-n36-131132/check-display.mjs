import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { chromium } from '../../../.agents/skills/node_modules/playwright-core/index.mjs'

const cwd = '/Users/yong/.codex/worktrees/a07e/lemmadeck'
assert.equal(process.cwd(), cwd)
const root = path.join(cwd, '.tmp/s10y-image/batch014-n36-131132')
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const cssFile = path.join(cwd, 'app/src/styles/app.css')
const css = fs.readFileSync(cssFile, 'utf8').split('\n').filter(line => !line.startsWith('@import ')).join('\n')
const figures = ['fig-131', 'fig-132'].map(id => {
  const dir = path.join(root, id, 'repair-1')
  return {
    id, svg: fs.readFileSync(path.join(dir, 'figure.svg'), 'utf8'),
    png: `data:image/png;base64,${fs.readFileSync(path.join(dir, 'preview.png')).toString('base64')}`,
    inputs: ['spec.json', 'render.json', 'figure.svg', 'preview.png'].map(name => ({
      path: path.join(dir, name), sha256: hash(path.join(dir, name)),
    })),
  }
})
const blocks = figures.map(({ id, svg }) => {
  const media = `<div class="sr-figure-media" data-figure-theme="neutral">${svg}</div>`
  if (id === 'fig-131') return `<figure class="sr-read-fig" data-figure="${id}" data-figure-layout="scroll">${media}</figure>`
  return `<div class="sr-ex-body"><figure class="sr-ex-fig" data-figure="${id}" data-figure-layout="scroll">${media}</figure></div>`
}).join('\n')
const html = `<!doctype html><meta charset="utf-8"><title>Section 36 Figure Preview</title>
<style>${css}
html,body{height:auto;min-height:100%;overflow:auto;font-size:16px}
main{width:100%;max-width:808px;padding:24px;margin:0 auto;box-sizing:border-box}
</style><body class="sr-page"><main>${blocks}</main></body>`
const htmlPath = path.join(root, 'preview.html')
fs.writeFileSync(htmlPath, html, { flag: 'wx' })
const startedAt = new Date().toISOString()
const browser = await chromium.launch({ headless: false, executablePath: chromium.executablePath() })
const viewports = []
const pixels = []
let networkRequests = 0
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1 })
  await page.route('**/*', route => { networkRequests += 1; return route.abort() })
  await page.setContent(html)
  for (const viewport of [{ width: 1440, height: 960 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport)
    const checks = await page.evaluate(() => [...document.querySelectorAll('[data-figure]')].map(parent => {
      const svg = parent.querySelector('svg')
      const media = parent.querySelector('.sr-figure-media')
      parent.scrollLeft = parent.scrollWidth
      const scrollEndReachable = Math.abs(parent.scrollLeft - Math.max(0, parent.scrollWidth - parent.clientWidth)) <= 1
      const text = [...svg.querySelectorAll('text')].map(n => {
        const m = n.getScreenCTM(), b = n.getBoundingClientRect()
        const f = Number(n.getAttribute('font-size')) * Math.hypot(m.a, m.b)
        return { id: n.dataset.labelId, text: n.textContent, fontPx: f, rect: { x: b.x, y: b.y, width: b.width, height: b.height } }
      })
      const minTextPx = Math.min(...text.map(t => t.fontPx))
      const geometry = [...svg.querySelectorAll('path,line,ellipse,circle,polygon,polyline')]
        .filter(n => !n.closest('defs') && getComputedStyle(n).display !== 'none' && Number.parseFloat(n.getAttribute('stroke-width')) > 0)
      const collisions = []
      for (const label of svg.querySelectorAll('text')) {
        const b = label.getBBox()
        for (const node of geometry) {
          if (!node.getTotalLength || !node.getPointAtLength) continue
          const length = node.getTotalLength()
          if (!Number.isFinite(length) || length <= 0) continue
          const steps = Math.min(1200, Math.max(2, Math.ceil(length / 2)))
          const matrix = node.getCTM()
          let hit = false
          for (let i = 0; i <= steps; i++) {
            const p = node.getPointAtLength(length * i / steps)
            const s = matrix ? new DOMPoint(p.x, p.y).matrixTransform(matrix) : p
            if (s.x >= b.x - 2 && s.x <= b.x + b.width + 2 && s.y >= b.y - 2 && s.y <= b.y + b.height + 2) { hit = true; break }
          }
          if (hit) collisions.push({ label: label.dataset.labelId, geometry: node.id })
        }
      }
      return {
        figure: parent.dataset.figure, mediaWidth: media.getBoundingClientRect().width,
        svgWidth: svg.getBoundingClientRect().width, containerWidth: parent.clientWidth,
        scrollWidth: parent.scrollWidth, scrollLeft: parent.scrollLeft, scrollEndReachable,
        minTextPx, text, allStrokeClearancePx: 2, collisions, geometryCount: geometry.length,
      }
    }))
    for (const check of checks) {
      assert.equal(check.mediaWidth, 640)
      assert.equal(check.svgWidth, 640)
      assert.ok(check.scrollEndReachable)
      assert.ok(check.minTextPx >= 16)
      assert.deepEqual(check.collisions, [])
    }
    viewports.push({ viewport, checks, status: 'pass' })
  }
  for (const { id, png } of figures) {
    const result = await page.evaluate(async dataUri => {
      const image = new Image()
      image.src = dataUri
      await image.decode()
      const canvas = document.createElement('canvas')
      canvas.width = image.width; canvas.height = image.height
      const context = canvas.getContext('2d', { willReadFrequently: true })
      context.drawImage(image, 0, 0)
      const data = context.getImageData(0, 0, canvas.width, canvas.height).data
      let white = 0, dark = 0
      for (let i = 0; i < data.length; i += 4) {
        if (data[i] > 240 && data[i + 1] > 240 && data[i + 2] > 240) white++
        if (data[i] < 160 && data[i + 1] < 160 && data[i + 2] < 160) dark++
      }
      const total = canvas.width * canvas.height
      return { width: canvas.width, height: canvas.height, whiteFraction: white / total, inkFraction: dark / total }
    }, png)
    assert.equal(result.width, 640)
    assert.ok(result.whiteFraction > 0.7)
    assert.ok(result.inkFraction > 0.003 && result.inkFraction < 0.2)
    pixels.push({ figure: id, ...result, status: 'pass', imagePayloadEmitted: false })
  }
} finally { await browser.close() }
const output = path.join(root, 'display-check.json')
fs.writeFileSync(output, `${JSON.stringify({
  schema: 'bounded-headed-offline-display@1', cwd, startedAt, endedAt: new Date().toISOString(),
  status: 'pass', browser: { headed: true, executable: chromium.executablePath() },
  inputs: figures.map(({ id, inputs }) => ({ figure: id, files: inputs })),
  productCss: { path: cssFile, sha256: hash(cssFile) },
  preview: { path: htmlPath, sha256: hash(htmlPath) }, viewports, pixels,
  screenshots: 0, additionalImageContextLoads: 0, networkRequests,
  scope: 'Current product CSS figure wrappers in headed offline desktop/mobile harness, not an assembled lesson or live product acceptance.',
}, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify({ status: 'pass', report: { path: output, sha256: hash(output) },
  viewports: viewports.map(({ viewport, checks }) => ({ viewport, checks: checks.map(({ figure, svgWidth, minTextPx, scrollEndReachable }) => ({ figure, svgWidth, minTextPx, scrollEndReachable })) })),
  pixels, screenshots: 0, networkRequests }, null, 2))
