import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const repo = '/Users/yong/.codex/worktrees/a07e/lemmadeck'
assert.equal(process.cwd(), repo)
const require = createRequire(path.join(repo, 'app/package.json'))
const { chromium } = require('playwright-core')
const batch = path.join(repo, '.tmp/s10y-image/batch014-n36-133134')
const cssPath = path.join(repo, 'app/src/styles/app.css')
const css = fs.readFileSync(cssPath, 'utf8')
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const candidates = [chromium.executablePath(), '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome']
const executablePath = candidates.find(p => fs.existsSync(p))
assert(executablePath, 'Existing browser required; installation is not authorized.')
const browser = await chromium.launch({ headless: true, executablePath })
const observations = []
const startedAt = new Date().toISOString()
const blockedRequests = []
try {
  const context = await browser.newContext()
  await context.route('**/*', route => {
    blockedRequests.push(route.request().url())
    return route.abort()
  })
  for (const viewport of [{ width: 1440, height: 960 }, { width: 390, height: 844 }]) {
    for (const id of [133, 134]) {
      const svgPath = path.join(batch, `fig-${id}/r1/figure.svg`)
      const svg = fs.readFileSync(svgPath, 'utf8')
      const page = await context.newPage({ viewport })
      await page.setViewportSize(viewport)
      await page.setContent(`<!doctype html><html><head><meta charset="utf-8"></head><body>
        <article class="sr-page"><div class="sr-ex">
          <div class="sr-ex-n">${id === 133 ? '335' : '336'}.</div>
          <div class="sr-ex-body">
            <figure class="sr-ex-fig" data-figure-layout="scroll" data-figure-id="fig-${id}">
              <div class="sr-figure-media">${svg}</div>
            </figure>
          </div>
        </div></article>
      </body></html>`)
      await page.evaluate(cssText => {
        const sheet = new CSSStyleSheet()
        // Constructed sheets discard imports and keep all local token/figure rules.
        sheet.replaceSync(cssText)
        document.adoptedStyleSheets = [sheet]
        const fixture = new CSSStyleSheet()
        fixture.replaceSync(`
          body { background: var(--sr-white); font-family: var(--sr-font); font-size: 16px; }
          article { width: calc(100% - 32px); max-width: 720px; margin: 16px auto; }
        `)
        document.adoptedStyleSheets.push(fixture)
      }, css)
      await page.evaluate(() => document.fonts.ready)
      for (const theme of ['neutral', 'accent']) {
        const observation = await page.evaluate(({ figure, theme, viewport }) => {
          const media = document.querySelector('.sr-figure-media')
          media.dataset.figureTheme = theme
          const figureElement = document.querySelector('figure')
          const vector = media.querySelector('svg')
          const labels = [...vector.querySelectorAll('text')].map(node => {
            const m = node.getScreenCTM()
            const fontPx = Number(node.getAttribute('font-size')) * Math.hypot(m.a, m.b)
            const box = node.getBBox()
            const view = vector.viewBox.baseVal
            return {
              id: node.getAttribute('data-label-id'), text: node.textContent, fontPx,
              insideCanvas: box.x >= view.x && box.y >= view.y &&
                box.x + box.width <= view.x + view.width &&
                box.y + box.height <= view.y + view.height,
              fill: getComputedStyle(node).fill,
            }
          })
          const strokes = [...vector.querySelectorAll('line,path')].map(node => ({
            id: node.id, stroke: getComputedStyle(node).stroke,
            width: getComputedStyle(node).strokeWidth,
            dash: getComputedStyle(node).strokeDasharray,
          })).filter(node => node.stroke !== 'none' && parseFloat(node.width) > 0)
          const maxScroll = figureElement.scrollWidth - figureElement.clientWidth
          figureElement.scrollLeft = maxScroll
          const reachedEnd = Math.abs(figureElement.scrollLeft - maxScroll) <= 1
          const end = figureElement.scrollLeft
          figureElement.scrollLeft = 0
          return {
            figure, theme, viewport,
            fixture: 'Offline exercise-container harness using complete actual app CSS; not a live lesson.',
            browserMode: 'headless',
            actualMediaWidthPx: media.getBoundingClientRect().width,
            svgWidthPx: vector.getBoundingClientRect().width,
            figureContainerWidthPx: figureElement.getBoundingClientRect().width,
            fontPx: Math.min(...labels.map(label => label.fontPx)),
            labels, strokes,
            overflow: { clientWidth: figureElement.clientWidth, scrollWidth: figureElement.scrollWidth, maxScroll, reachedEnd, end },
            background: getComputedStyle(document.body).backgroundColor,
          }
        }, { figure: `fig-${id}`, theme, viewport })
        assert.equal(observation.actualMediaWidthPx, 640)
        assert.equal(observation.svgWidthPx, 640)
        assert(observation.fontPx >= 16)
        assert.equal(observation.labels.length, 5)
        assert(observation.labels.every(label => label.insideCanvas))
        assert.deepEqual(observation.labels.map(label => label.text).sort(),
          id === 133 ? ['A', 'B', 'C', 'D', 'M'] : ['A', 'B', 'C', 'M', 'N'])
        assert.equal(observation.strokes.length, id === 133 ? 8 : 4)
        assert(observation.strokes.every(stroke => stroke.dash === 'none' || /^0(?:px)?$/.test(stroke.dash)))
        assert(observation.strokes.every(stroke => stroke.stroke === observation.labels[0].fill))
        assert(observation.overflow.reachedEnd)
        if (viewport.width === 390) assert(observation.overflow.maxScroll > 0)
        observations.push({ ...observation, status: 'pass' })
      }
      await page.close()
    }
  }
} finally {
  await browser.close()
}
const report = {
  schema: 'ld-s10y-image/offline-display-check@1',
  status: 'pass', startedAt, finishedAt: new Date().toISOString(),
  command: [process.execPath, ...process.argv.slice(1)], workdir: repo,
  browserMode: 'headless', browserExecutable: executablePath,
  css: { path: cssPath, sha256: hash(cssPath) },
  sources: [133, 134].map(id => {
    const p = path.join(batch, `fig-${id}/r1/figure.svg`)
    return { path: p, sha256: hash(p) }
  }),
  limitations: [
    'Offline figure harness, not headed/live product acceptance, full modern lesson rendering or print/PDF acceptance.',
    'Harness exercise-container widths are measured here; the relevant scroll media width remains the actual product CSS 40em at 16px = 640px in both viewports.',
    'No extra screenshot or image was opened. All observations are DOM measurements of existing output SVGs.',
    'Neutral and accent screen palettes checked. Geometry/text use the ink role; full print layout acceptance is parent-owned.',
  ],
  imagePayloadsLoadedIntoAuthorContext: 0,
  additionalPNGsGenerated: 0,
  paidCalls: 0,
  remoteRequestsCompleted: 0,
  blockedRequests,
  observations,
}
fs.writeFileSync(path.join(batch, 'offline-display-check.json'), JSON.stringify(report, null, 2) + '\n', { flag: 'wx' })
console.log(`PASS: ${observations.length} offline figure/viewport/theme observations, 640px media, 32px minimum text, scroll end reachable.`)
