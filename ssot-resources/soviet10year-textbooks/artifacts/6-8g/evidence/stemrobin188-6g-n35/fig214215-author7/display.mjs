import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const cwd = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188'
assert.equal(process.cwd(), cwd)
const owned = path.dirname(fileURLToPath(import.meta.url))
const require = createRequire(path.join(cwd, '.agents/skills/package.json'))
const { chromium } = require('playwright-core')
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
const hashFile = filename => hash(fs.readFileSync(filename))
const write = (name, value) => fs.writeFileSync(path.join(owned, name), `${JSON.stringify(value, null, 2)}\n`)
const manifest = JSON.parse(fs.readFileSync(path.join(owned, 'manifest.json'), 'utf8'))
assert.equal(manifest.figures.length, 2)
for (const figure of manifest.figures) {
  assert.equal(hashFile(figure.spec.path), figure.spec.sha256)
  assert.equal(hashFile(figure.svg.path), figure.svg.sha256)
  assert.equal(hashFile(figure.render.path), figure.render.sha256)
}
const css = `
:root{--ink:#1b1b1b;--sub:#6b6b6b;--rule:#e3e3e3}
*{box-sizing:border-box}body{margin:0;background:#fff;color:var(--ink);font-family:Arial,Helvetica,sans-serif}
.batch{width:640px;max-width:100%;margin:0 auto;padding:10px 0}
h1{font-size:20px;font-weight:600;margin:0 0 10px;text-align:center}
.fig{margin:0 0 14px;text-align:center;max-width:100%}
.figcap{font-size:16px;font-weight:400;color:var(--sub);margin:0 0 4px}
.figure-media{--ld-figure-ink:var(--ink);--ld-figure-muted:var(--sub);--ld-figure-accent:var(--ink);--ld-figure-accent-soft:var(--sub);--ld-figure-grid:var(--rule);--ld-figure-paper:#fff;display:block;margin:0 auto;width:400px;max-width:100%;font-size:16px}
.figure-media svg{display:block;width:100%;max-width:100%;height:auto}
@media(max-width:400px){body{padding:0 16px}}
`
const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Directions</title><style>${css}</style></head><body><main class="batch"><h1>Directions</h1>${manifest.figures.map(figure => `
<figure class="fig" id="${figure.id}" aria-label="Figure ${figure.id.slice(4)}" data-figure-layout="inline" data-figure-purpose="instructional">
<figcaption class="figcap">Figure ${figure.id.slice(4)}</figcaption>
<div class="figure-media" data-figure-mode="deterministic" data-figure-theme="neutral" style="width:400px;max-width:100%">${fs.readFileSync(figure.svg.path, 'utf8')}</div></figure>`).join('')}</main></body></html>`
fs.writeFileSync(path.join(owned, 'display.html'), html)
const report = {
  schema: 'n35-offline-media-display@1', status: 'running', cwd,
  headed: true, offline: true, networkRequests: [],
  surface: 'Compact headed offline media surface using existing render_lesson.js figure-media width/max-width/SVG sizing and neutral semantic roles. No full-lesson acceptance claim.',
  root: manifest.root, html: { path: path.join(owned, 'display.html'), sha256: hash(html) },
  bindings: manifest.figures.map(({ id, spec, svg, render }) => ({ id, spec, svg, render })),
  views: [], nativeSvgImageLoads: 0, screenshotsGenerated: 0,
  browserClosed: false, firstFailures: [],
}
const browser = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: false,
})
manifest.images.headedDisplayBrowsers += 1
try {
  const context = await browser.newContext()
  await context.route('**/*', async route => {
    const url = route.request().url()
    report.networkRequests.push(url)
    await route.abort()
  })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  for (const [name, viewport, expectedMediaWidth, screenshot] of [
    ['desktop', { width: 640, height: 1120 }, 400, 'desktop.png'],
    ['mobile', { width: 390, height: 1050 }, 358, 'mobile.png'],
    ['narrow-product', { width: 363, height: 1050 }, 331, null],
  ]) {
    await page.setViewportSize(viewport)
    await page.setContent(html)
    await page.evaluate(() => document.fonts.ready)
    const measurements = await page.evaluate(async () => {
      const result = []
      for (const figure of document.querySelectorAll('.fig')) {
        const media = figure.querySelector('.figure-media')
        const svg = media.querySelector('svg')
        const box = media.getBoundingClientRect()
        const labels = [...svg.querySelectorAll('text[data-label-id]')].map(node => {
          const rect = node.getBoundingClientRect()
          const ctm = node.getScreenCTM()
          const effectivePx = parseFloat(node.getAttribute('font-size')) * Math.hypot(ctm.c, ctm.d)
          return { id: node.getAttribute('data-label-id'), text: node.textContent, effectivePx,
            bounds: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
            inside: rect.x >= box.x && rect.right <= box.right + 0.1
              && rect.y >= box.y && rect.bottom <= box.bottom + 0.1 }
        })
        const svgCopy = svg.cloneNode(true)
        const palette = {
          '--ld-figure-ink': '#1b1b1b', '--ld-figure-muted': '#6b6b6b',
          '--ld-figure-accent': '#1b1b1b', '--ld-figure-accent-soft': '#6b6b6b',
          '--ld-figure-grid': '#e3e3e3', '--ld-figure-paper': '#ffffff',
        }
        for (const [role, color] of Object.entries(palette)) svgCopy.style.setProperty(role, color)
        const image = new Image()
        image.src = `data:image/svg+xml;base64,${btoa(new XMLSerializer().serializeToString(svgCopy))}`
        await image.decode()
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(box.width)
        canvas.height = Math.round(box.height)
        const drawing = canvas.getContext('2d')
        drawing.fillStyle = '#fff'
        drawing.fillRect(0, 0, canvas.width, canvas.height)
        drawing.drawImage(image, 0, 0, canvas.width, canvas.height)
        const pixels = drawing.getImageData(0, 0, canvas.width, canvas.height).data
        let inkPixels = 0
        for (let index = 0; index < pixels.length; index += 4) {
          if (pixels[index] < 230 && pixels[index + 1] < 230 && pixels[index + 2] < 230) inkPixels += 1
        }
        result.push({
          id: figure.id, mediaWidth: box.width, mediaHeight: box.height,
          labels, minTextPx: Math.min(...labels.map(label => label.effectivePx)),
          inkPixels, pixelTotal: canvas.width * canvas.height,
          renderedGeometry: svg.querySelectorAll('path,line,ellipse,circle,polygon').length,
        })
      }
      return { containerWidth: document.querySelector('.batch').getBoundingClientRect().width,
        documentOverflow: document.documentElement.scrollWidth > innerWidth,
        figures: result }
    })
    report.nativeSvgImageLoads += measurements.figures.length
    assert.equal(measurements.figures.length, 2)
    assert.equal(measurements.documentOverflow, false)
    for (const figure of measurements.figures) {
      const input = manifest.figures.find(item => item.id === figure.id)
      assert.equal(figure.mediaWidth, expectedMediaWidth)
      assert.equal(figure.labels.length, input.labels)
      assert.ok(figure.minTextPx >= 16)
      assert.ok(figure.labels.every(label => label.inside))
      assert.ok(figure.inkPixels > 500 && figure.inkPixels / figure.pixelTotal < 0.1)
      assert.ok(figure.renderedGeometry > 0)
    }
    assert.deepEqual(errors, [])
    assert.deepEqual(report.networkRequests, [])
    const view = { name, viewport, expectedMediaWidth, status: 'pass', ...measurements }
    if (screenshot) {
      const screenshotPath = path.join(owned, screenshot)
      await page.screenshot({ path: screenshotPath, fullPage: true })
      report.screenshotsGenerated += 1
      view.screenshot = { path: screenshotPath, sha256: hashFile(screenshotPath), crop: false }
    }
    report.views.push(view)
    write('display.report.json', report)
  }
  report.status = 'pass'
} catch (error) {
  report.status = 'fail'
  report.firstFailures.push({ message: error.message, stack: error.stack })
  throw error
} finally {
  await browser.close()
  report.browserClosed = true
  manifest.images.closedBrowsers += 1
  manifest.images.nativeSvgDisplayInstances += report.views.length * 2
  manifest.images.nativeSvgImageLoads = report.nativeSvgImageLoads
  manifest.images.screenshotsGenerated = report.screenshotsGenerated
  manifest.display = { path: path.join(owned, 'display.report.json'), status: report.status }
  manifest.status = report.status === 'pass' ? 'display-pass-awaiting-author-inspection' : 'display-failed'
  write('display.report.json', report)
  manifest.display.sha256 = hashFile(path.join(owned, 'display.report.json'))
  write('manifest.json', manifest)
}
console.log(JSON.stringify({
  status: report.status, headed: report.headed, browserClosed: report.browserClosed,
  views: report.views.map(view => ({ name: view.name, containerWidth: view.containerWidth,
    figures: view.figures.map(({ id, mediaWidth, minTextPx, inkPixels }) => ({ id, mediaWidth, minTextPx, inkPixels })) })),
}, null, 2))
