import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const root = process.cwd()
const require = createRequire(path.join(root, 'app/package.json'))
const { chromium } = require('playwright')
const dir = '.tmp/s10y-image/9-10g/fig-11'
const hash = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex')
const specBytes = fs.readFileSync(`${dir}/fig-11.spec.json`)
const spec = JSON.parse(specBytes)
const svg = fs.readFileSync(`${dir}/fig-11.svg`, 'utf8')
const renderBytes = fs.readFileSync(`${dir}/fig-11.render.json`)
const render = JSON.parse(renderBytes)
assert.equal(render.status, 'pass')
assert.equal(render.spec.sha256, hash(specBytes))
assert.equal(render.output.svg.sha256, hash(svg))
const css = fs.readFileSync('app/src/styles/app.css', 'utf8')
const candidates = [
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH, process.env.CHROME_PATH,
  chromium.executablePath(), '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean)
const executablePath = candidates.find((candidate) => fs.existsSync(candidate))
assert(executablePath, 'Existing Chromium required; no install or visible fallback')
const evidence = {
  schema: 'ticket-scratch/current-css-figure-display@1',
  figure: 'fig-11', specSha256: hash(specBytes), svgSha256: hash(svg), renderSha256: hash(renderBytes),
  css: { path: 'app/src/styles/app.css', sha256: hash(css) },
  surface: 'Current sr-read/sr-read-fig/sr-figure-media/sr-figure-vector CSS and exact FigureMedia width/maxWidth contract; offline figure projection, not published app acceptance.',
  launch: { headless: true, executablePath, persistentProfile: false, cdp: false },
  cases: [],
}
const browser = await chromium.launch({ executablePath, headless: true })
try {
  const context = await browser.newContext({ deviceScaleFactor: 1 })
  await context.route('**/*', (route) => route.abort())
  const page = await context.newPage()
  for (const width of spec.display.widths) {
    const viewport = width === 640 ? { width: 1440, height: 960 }
      : width === 346 ? { width: 390, height: 844 } : { width: 284, height: 640 }
    await page.setViewportSize(viewport)
    const html = `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style>
      <style>body{margin:0;background:white}.preview-width{width:${width}px;margin:0 auto}</style>
      </head><body><main class="preview-width"><div class="sr-read">
      <div class="sr-read-fig" data-figure-layout="inline"><div class="sr-figure-media"
      data-figure-mode="deterministic" data-figure-purpose="instructional" data-figure-theme="neutral"
      style="width:${spec.display.maxWidthPx}px;max-width:100%">
      <div class="sr-figure-vector" aria-hidden="true">${svg}</div>
      </div></div></div></main></body></html>`
    const htmlPath = `${dir}/fig-11.display-${width}.html`
    const pngPath = `${dir}/fig-11.display-${width}.png`
    assert(!fs.existsSync(htmlPath) && !fs.existsSync(pngPath), 'Preserve prior preview evidence')
    fs.writeFileSync(htmlPath, html)
    await page.setContent(html, { waitUntil: 'load' })
    await page.evaluate(() => document.fonts.ready)
    const metrics = await page.evaluate(() => {
      const media = document.querySelector('.sr-figure-media')
      const svg = media.querySelector('svg')
      const rect = svg.getBoundingClientRect()
      const labels = [...svg.querySelectorAll('text')].map((node) => {
        const ctm = node.getScreenCTM(), box = node.getBBox()
        const corners = [[box.x, box.y], [box.x + box.width, box.y],
          [box.x, box.y + box.height], [box.x + box.width, box.y + box.height]]
          .map(([x, y]) => new DOMPoint(x, y).matrixTransform(ctm))
        return {
          id: node.getAttribute('data-label-id'), text: node.textContent,
          px: parseFloat(getComputedStyle(node).fontSize) * Math.hypot(ctm.a, ctm.b),
          clipped: corners.some((p) => p.x < rect.left - .01 || p.x > rect.right + .01 ||
            p.y < rect.top - .01 || p.y > rect.bottom + .01),
          fill: getComputedStyle(node).fill,
        }
      })
      return {
        mediaWidth: media.getBoundingClientRect().width, svgWidth: rect.width, svgHeight: rect.height,
        labels, minTextPx: Math.min(...labels.map((item) => item.px)),
        horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
      }
    })
    const bytes = await page.locator('.sr-figure-media').screenshot({ path: pngPath })
    const darkPixels = await page.evaluate(async (base64) => {
      const bytes = Uint8Array.from(atob(base64), (value) => value.charCodeAt(0))
      const image = await createImageBitmap(new Blob([bytes], { type: 'image/png' }))
      const canvas = document.createElement('canvas')
      canvas.width = image.width
      canvas.height = image.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(image, 0, 0)
      const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)
      let dark = 0
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] > 0 && data[i] < 150 && data[i + 1] < 150 && data[i + 2] < 150) dark += 1
      }
      image.close()
      return dark
    }, bytes.toString('base64'))
    const failures = []
    if (Math.abs(metrics.mediaWidth - width) >= .01 || Math.abs(metrics.svgWidth - width) >= .01) failures.push('actual media width')
    if (metrics.labels.length !== 9 || metrics.minTextPx < 16) failures.push('label count/size')
    if (metrics.labels.some((label) => label.clipped || label.fill === 'none')) failures.push('label clipping/color')
    if (metrics.horizontalOverflow) failures.push('horizontal overflow')
    if (darkPixels <= 100) failures.push('blank pixels')
    evidence.cases.push({
      width, viewport, ...metrics, darkPixels, failures,
      html: htmlPath, htmlSha256: hash(html),
      screenshot: pngPath, screenshotSha256: hash(bytes),
      status: failures.length ? 'fail' : 'pass',
    })
    console.log(`fig-11 actual media ${width}: ${metrics.minTextPx.toFixed(4)}px; ${darkPixels} dark pixels; ${failures.length ? 'FAIL' : 'PASS'}`)
  }
  evidence.status = evidence.cases.every((item) => item.status === 'pass') ? 'pass' : 'fail'
  const output = `${dir}/display-evidence.json`
  assert(!fs.existsSync(output), 'Preserve existing display evidence')
  fs.writeFileSync(output, JSON.stringify(evidence, null, 2) + '\n')
  assert.equal(evidence.status, 'pass', 'Current-CSS display gate')
} finally {
  await browser.close()
}
