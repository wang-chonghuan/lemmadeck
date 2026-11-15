import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from '../../../app/node_modules/playwright/index.mjs'

const directory = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(directory, '../../..')
const specPath = path.join(directory, 'spec.json')
const svgPath = path.join(directory, 'fig-02.svg')
const reportPath = path.join(directory, 'fig-02.render.json')
const cssPath = path.join(root, 'app/src/styles/app.css')
const componentPath = path.join(root, 'app/src/routes/_app/card.$id.tsx')
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
const evidence = file => ({
  path: path.relative(root, file),
  sha256: sha(fs.readFileSync(file)),
})
const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'))
const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'))
const math = JSON.parse(fs.readFileSync(path.join(directory, 'author-math.json'), 'utf8'))
const svg = fs.readFileSync(svgPath, 'utf8')
const css = fs.readFileSync(cssPath, 'utf8')
assert.equal(report.status, 'pass')
assert.equal(evidence(specPath).sha256, report.spec.sha256)
assert.equal(evidence(svgPath).sha256, report.output.svg.sha256)
assert.equal(math.spec.sha256, report.spec.sha256)
assert.equal(spec.display.maxWidthPx, 640)
assert.deepEqual(spec.display.widths, [640, 346, 240])
assert.ok(!process.env.PWDEBUG, 'debug must be unset')
assert.equal(process.env.PLAYWRIGHT_HTML_OPEN, 'never')

const removedImports = css.split('\n').filter(line => line.startsWith('@import '))
const offlineCss = css.split('\n').filter(line => !line.startsWith('@import ')).join('\n')
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>${offlineCss}</style></head><body>
<div class="sr-page sr-app">
  <main class="sr-detail">
    <div class="sr-d-scroll">
      <article class="sr-deck">
        <div class="sr-read">
          <div class="sr-read-fig" data-figure-layout="${spec.display.layout}">
            <div class="sr-figure-media" data-figure-mode="deterministic"
              data-figure-purpose="instructional" data-figure-theme="neutral"
              style="width:${spec.display.maxWidthPx}px;max-width:100%">
              <div class="sr-figure-vector">${svg}</div>
            </div>
          </div>
        </div>
      </article>
    </div>
  </main>
</div></body></html>`
const htmlPath = path.join(directory, 'fig-02.current-css.html')
fs.writeFileSync(htmlPath, html)

const executablePath = chromium.executablePath()
assert.ok(fs.existsSync(executablePath), 'use already installed app Playwright browser')
const browser = await chromium.launch({ executablePath, headless: true })
const blockedRequests = []
const errors = []
const cases = [
  { id: 'desktop-640', viewport: { width: 1440, height: 960 }, expectedWidth: 640 },
  { id: 'mobile-390', viewport: { width: 390, height: 844 }, expectedWidth: 346 },
  { id: 'media-240', viewport: { width: 284, height: 640 }, expectedWidth: 240 },
]
const measurements = []
try {
  for (const item of cases) {
    const context = await browser.newContext({
      viewport: item.viewport,
      deviceScaleFactor: 1,
      serviceWorkers: 'block',
    })
    try {
      await context.route('**/*', async route => {
        blockedRequests.push(route.request().url())
        await route.abort()
      })
      const page = await context.newPage()
      page.on('pageerror', error => errors.push(String(error)))
      await page.setContent(html)
      await page.evaluate(() => document.fonts.ready)
      const measured = await page.evaluate(({ curveD, minText, boundingBox, canvas }) => {
        const diagram = document.querySelector('.sr-figure-media svg')
        const media = document.querySelector('.sr-figure-media')
        const frame = diagram.getBoundingClientRect()
        const describe = element => {
          const rect = element.getBoundingClientRect()
          const computed = getComputedStyle(element)
          return {
            width: rect.width,
            height: rect.height,
            x: rect.x,
            y: rect.y,
            fontSize: computed.fontSize,
            paddingLeft: computed.paddingLeft,
            paddingRight: computed.paddingRight,
            maxWidth: computed.maxWidth,
          }
        }
        const labels = [...diagram.querySelectorAll('text')].map(text => {
          const ctm = text.getScreenCTM()
          const box = text.getBoundingClientRect()
          const font = Number(text.getAttribute('font-size'))
          return {
            text: text.textContent,
            finalFontPx: font * Math.hypot(ctm.a, ctm.b),
            fullyInside: box.left >= frame.left && box.right <= frame.right &&
              box.top >= frame.top && box.bottom <= frame.bottom,
          }
        })
        const curve = diagram.querySelector('[id$="-raw-path-layer"] path')
        const ctm = curve.getScreenCTM()
        const scale = frame.width / canvas.width
        const expectedScaleX = canvas.width / (boundingBox[2] - boundingBox[0]) * scale
        const expectedScaleY = canvas.height / (boundingBox[1] - boundingBox[3]) * scale
        const transformMatches = Math.abs(ctm.a - expectedScaleX) < 1e-9 &&
          Math.abs(ctm.d - expectedScaleY) < 1e-9 &&
          Math.abs(ctm.b) < 1e-9 && Math.abs(ctm.c) < 1e-9
        return {
          media: describe(media),
          scroll: describe(document.querySelector('.sr-d-scroll')),
          deck: describe(document.querySelector('.sr-deck')),
          read: describe(document.querySelector('.sr-read')),
          svg: describe(diagram),
          labels,
          sinePathMatches: curve.getAttribute('d') === curveD,
          equalScalePathTransform: transformMatches,
          noDocumentOverflow: document.documentElement.scrollWidth <= innerWidth,
          resolvedCurveStroke: getComputedStyle(curve).stroke,
          result: labels.every(label => label.finalFontPx >= minText && label.fullyInside) &&
            transformMatches && curve.getAttribute('d') === curveD,
        }
      }, {
        curveD: spec.objects.find(object => object.id === 'sine-curve').d,
        minText: spec.display.minTextPx,
        boundingBox: spec.canvas.boundingBox,
        canvas: spec.canvas,
      })
      assert.equal(measured.media.width, item.expectedWidth, `${item.id} actual media width`)
      assert.equal(measured.svg.width, item.expectedWidth)
      assert.deepEqual(measured.labels.map(label => label.text), ['x', 'y', '0'])
      if (!measured.result) {
        const failurePath = path.join(directory, 'fig-02.display-first-failure.json')
        const failurePreview = path.join(directory, 'fig-02.display-first-failure.png')
        await page.screenshot({ path: failurePreview, animations: 'disabled' })
        fs.writeFileSync(failurePath, `${JSON.stringify({ ...item, ...measured }, null, 2)}\n`)
      }
      assert.ok(measured.result, JSON.stringify(measured))
      assert.ok(measured.noDocumentOverflow)
      assert.equal(measured.resolvedCurveStroke, 'rgb(21, 32, 31)')
      const preview = path.join(directory, `fig-02.${item.id}.preview.png`)
      const pagePreview = path.join(directory, `fig-02.${item.id}.page.png`)
      await page.locator('.sr-figure-media').screenshot({ path: preview, animations: 'disabled' })
      await page.screenshot({ path: pagePreview, animations: 'disabled' })
      measurements.push({
        ...item,
        ...measured,
        preview: evidence(preview),
        pagePreview: evidence(pagePreview),
      })
    } finally {
      await context.close()
    }
  }
} finally {
  await browser.close()
}
assert.deepEqual(errors, [])
assert.deepEqual(blockedRequests, [])
assert.equal(evidence(specPath).sha256, report.spec.sha256, 'spec remained unchanged')
assert.equal(evidence(svgPath).sha256, report.output.svg.sha256, 'SVG remained unchanged')
const displayEvidence = {
  schema: '10c-fig02-author-display@1',
  role: 'author-check-only-not-independent-approval',
  surface: 'Offline current app CSS and current FigureMedia/CardProse container markup; not a running app route, database, or service.',
  launch: {
    dependency: 'app/node_modules/playwright',
    executablePath,
    headless: true,
    persistentProfile: false,
    cdp: false,
    PWDEBUG: 'unset',
    PLAYWRIGHT_HTML_OPEN: 'never',
    allTaskContextsAndBrowserClosed: true,
  },
  css: evidence(cssPath),
  component: evidence(componentPath),
  html: evidence(htmlPath),
  omittedImports: removedImports,
  omissionReason: 'Offline harness omits external font/package imports; current literal app CSS rules/tokens and actual markup are retained. Figure text is renderer-owned Arial and media uses an explicit pixel maximum, so omitted web fonts do not affect these label/width measurements.',
  spec: evidence(specPath),
  svg: evidence(svgPath),
  render: evidence(reportPath),
  math: evidence(path.join(directory, 'author-math.json')),
  measurements,
  blockedRequests,
  pageErrors: errors,
  result: 'author-display-checks-complete',
}
fs.writeFileSync(path.join(directory, 'fig-02.display.json'), `${JSON.stringify(displayEvidence, null, 2)}\n`)
console.log(JSON.stringify({
  role: displayEvidence.role,
  measurements: measurements.map(item => ({
    id: item.id,
    viewport: item.viewport,
    mediaWidth: item.media.width,
    minimumFontPx: Math.min(...item.labels.map(label => label.finalFontPx)),
    result: item.result,
  })),
  browserClosed: true,
  requests: blockedRequests.length,
}, null, 2))
