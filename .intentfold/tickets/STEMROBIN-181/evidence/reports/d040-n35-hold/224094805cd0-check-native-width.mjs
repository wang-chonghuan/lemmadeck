import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const owned = path.dirname(fileURLToPath(import.meta.url))
const repo = process.cwd()
const require = createRequire(path.join(repo, 'app/package.json'))
const { chromium } = require('playwright')
const bind = p => ({
  path: p,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'),
})
const specPath = path.join(owned, 'fig-63.spec.json')
const spec = JSON.parse(fs.readFileSync(specPath))
const attempt = fs.existsSync(path.join(owned, 'repair')) ? 'repair' : 'initial'
const renderPath = path.join(owned, attempt, 'fig-63.render.json')
const render = JSON.parse(fs.readFileSync(renderPath))
assert(['pass', 'fail'].includes(render.status))
assert.equal(bind(specPath).sha256, render.spec.sha256)
const svgPath = path.join(owned, attempt, 'fig-63.svg')
assert.equal(bind(svgPath).sha256, render.output.svg.sha256)
const evidence = path.join(owned, 'native-width')
assert(!fs.existsSync(evidence), 'Preserve prior native-width evidence')
fs.mkdirSync(evidence)
const cssPath = path.join(repo, 'app/src/styles/app.css')
const css = fs.readFileSync(cssPath, 'utf8')
const svg = fs.readFileSync(svgPath, 'utf8')
const fixture = `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Figure 63</title><style>${css}</style>
<style>html,body{height:auto;overflow:auto;font:16px Arial,Helvetica,sans-serif}</style>
</head><body class="sr-page"><main class="sr-card-reader">
<figure class="sr-read-fig" id="fig-63" aria-label="Figure 63"
data-figure-layout="scroll" data-figure-purpose="instructional">
<div class="sr-figure-media" data-figure-mode="deterministic"
data-figure-theme="neutral">${svg}</div></figure></main></body></html>`
fs.writeFileSync(path.join(evidence, 'fixture.html'), fixture)
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
    || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
})
const widths = []
const screenshots = []
const errors = []
let pixelEvidence
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1 })
  await page.route('**/*', route => route.abort())
  page.on('pageerror', error => errors.push(error.message))
  await page.setContent(fixture)
  await page.evaluate(() => document.fonts.ready)
  const inspect = async name => {
    const observation = await page.evaluate(() => {
      const figure = document.getElementById('fig-63')
      const media = figure.querySelector('.sr-figure-media')
      const svg = media.querySelector('svg')
      const svgRect = svg.getBoundingClientRect()
      const labels = [...svg.querySelectorAll('text[data-label-id]')].map(node => {
        const matrix = node.getScreenCTM()
        const r = node.getBoundingClientRect()
        return {
          id: node.dataset.labelId, text: node.textContent,
          px: parseFloat(node.getAttribute('font-size')) * Math.hypot(matrix.a, matrix.b),
          inSvg: r.left >= svgRect.left - 0.1 && r.right <= svgRect.right + 0.1
            && r.top >= svgRect.top - 0.1 && r.bottom <= svgRect.bottom + 0.1,
        }
      })
      return {
        viewportWidthPx: innerWidth, mediaWidthPx: media.getBoundingClientRect().width,
        svgWidthPx: svgRect.width, containerWidthPx: figure.getBoundingClientRect().width,
        minTextPx: Math.min(...labels.map(l => l.px)), labels,
        scrollWidthPx: figure.scrollWidth, clientWidthPx: figure.clientWidth,
        bodyScrollWidthPx: document.documentElement.scrollWidth,
      }
    })
    assert.equal(observation.mediaWidthPx, 640)
    assert.equal(observation.svgWidthPx, 640)
    assert(observation.minTextPx >= 16 - 0.01)
    assert.equal(observation.labels.length, render.labels)
    assert(observation.labels.every(l => l.inSvg))
    const expected = new Map(spec.objects.filter(o => o.type === 'text').map(o => [`${o.id}-label`, o.text]))
    for (const label of observation.labels) assert.equal(label.text, expected.get(label.id))
    widths.push({ name, ...observation, status: 'pass' })
  }
  await inspect('desktop-product-css')
  const desktop = path.join(evidence, 'desktop-media-640.png')
  await page.locator('.sr-figure-media').screenshot({ path: desktop })
  screenshots.push(bind(desktop))
  pixelEvidence = await page.evaluate(async () => {
    const svg = document.querySelector('.sr-figure-media svg').cloneNode(true)
    const canvas = document.createElement('canvas')
    canvas.width = 640
    canvas.height = 610
    const context = canvas.getContext('2d')
    context.fillStyle = '#fff'
    context.fillRect(0, 0, 640, 610)
    const image = new Image()
    image.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(svg))
    await image.decode()
    context.drawImage(image, 0, 0)
    const pixels = context.getImageData(0, 0, 640, 610).data
    let dark = 0
    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i] < 150 && pixels[i + 1] < 150 && pixels[i + 2] < 150 && pixels[i + 3] > 200) dark++
    }
    return { width: 640, height: 610, darkPixels: dark, darkFraction: dark / (640 * 610) }
  })
  assert(pixelEvidence.darkFraction > 0.005 && pixelEvidence.darkFraction < 0.4, 'Blank/black SVG raster')
  await page.setViewportSize({ width: 390, height: 844 })
  await inspect('mobile-product-css')
  const mobile = widths.at(-1)
  assert(mobile.containerWidthPx < mobile.mediaWidthPx)
  assert(mobile.bodyScrollWidthPx <= 390, 'Media must scroll inside its figure')
  const left = path.join(evidence, 'mobile-390-left.png')
  await page.locator('#fig-63').screenshot({ path: left })
  screenshots.push(bind(left))
  const end = await page.locator('#fig-63').evaluate(figure => {
    figure.scrollLeft = figure.scrollWidth
    const r = figure.getBoundingClientRect()
    const label = figure.querySelector('[data-label-id="users-name-label"]').getBoundingClientRect()
    return {
      scrollLeft: figure.scrollLeft, maxScrollLeft: figure.scrollWidth - figure.clientWidth,
      usersLabelFullyVisible: label.left >= r.left && label.right <= r.right,
    }
  })
  assert.equal(end.scrollLeft, end.maxScrollLeft)
  assert(end.usersLabelFullyVisible, 'The final user group must be reachable')
  mobile.scrollEnd = end
  const right = path.join(evidence, 'mobile-390-right.png')
  await page.locator('#fig-63').screenshot({ path: right })
  screenshots.push(bind(right))
  assert.deepEqual(errors, [])
} finally {
  await browser.close()
}
const report = {
  schema: 'ld-s10y-image/bounded-native-width@1', status: 'pass',
  renderStatus: render.status, unresolvedRenderCollisions: render.collisions,
  scope: 'Native-width and scroll evidence only for the frozen candidate, including a rejected candidate. Read-only figure fragment under actual product CSS; not live headed app/card acceptance, collision approval, or independent pixel review.',
  headlessReason: 'User forbids browser windows, app changes, and database access.',
  appCss: bind(cssPath), fixture: bind(path.join(evidence, 'fixture.html')),
  spec: bind(specPath), render: bind(renderPath), svg: bind(svgPath),
  widths, pixelEvidence, screenshots, errors,
  generatedScreenshots: screenshots.length, imagesOpenedByThisScript: 0,
}
fs.writeFileSync(path.join(evidence, 'evidence.json'), `${JSON.stringify(report, null, 2)}\n`)
console.log(JSON.stringify({
  status: report.status, widths: widths.map(w => ({
    name: w.name, viewport: w.viewportWidthPx, container: w.containerWidthPx,
    media: w.mediaWidthPx, minTextPx: w.minTextPx, scrollEnd: w.scrollEnd,
  })), pixelEvidence,
}, null, 2))
