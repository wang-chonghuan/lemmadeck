import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import { createRequire } from 'node:module'

const R = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), R)
const own = `${R}/.intentfold/tickets/STEMROBIN-181/tmp/d795-n84-fig198-first-author`
const require = createRequire(`${R}/.agents/skills/package.json`)
const { chromium } = require('playwright-core')
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const stem = 'fig-198.repair-1'
const specPath = `${own}/${stem}.spec.json`
const svgPath = `${own}/${stem}.svg`
const renderPath = `${own}/${stem}.render.json`
const spec = read(specPath)
const render = read(renderPath)
assert.equal(render.status, 'pass')
assert.equal(render.spec.sha256, hash(specPath))
assert.equal(render.output.svg.sha256, hash(svgPath))
assert.ok(!fs.existsSync(`${own}/display-results.json`), 'Do not replay completed capture')
const cssPath = `${R}/app/src/styles/app.css`
const executablePath = [chromium.executablePath(), '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome']
  .find(p => fs.existsSync(p))
assert.ok(executablePath, 'Use an existing native Chromium binary')
fs.writeFileSync(`${own}/display.started.json`, `${JSON.stringify({
  cwd: R, executablePath, headless: true, ownedIsolatedBrowser: true,
  productCss: { path: cssPath, sha256: hash(cssPath) },
  specSha256: hash(specPath), svgSha256: hash(svgPath),
  screenshotPlan: 'One 640 px media screenshot; no native rerender or other dependencies opened.',
}, null, 2)}\n`, { flag: 'wx' })
const browser = await chromium.launch({ executablePath, headless: true })
const observations = []
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1 })
  await page.route('**/*', route => route.abort())
  await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>
    ${fs.readFileSync(cssPath, 'utf8')}
    html,body { margin:0; padding:0; font-size:16px; background:var(--sr-white); }
    main { width:700px; margin:24px auto; font-size:16px; }
  </style></head><body><main>
    <figure class="sr-read-fig" data-figure-id="fig-198" data-figure-layout="scroll" data-figure-purpose="instructional">
      <div class="sr-figure-media" data-figure-mode="deterministic" data-figure-purpose="instructional" data-figure-theme="neutral">
        <div class="sr-figure-vector" aria-hidden="true">${fs.readFileSync(svgPath, 'utf8')}</div>
      </div>
    </figure>
  </main></body></html>`)
  await page.evaluate(() => document.fonts.ready)
  for (const viewport of [{ width: 1440, height: 960 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport)
    await page.locator('main').evaluate((node, width) => { node.style.width = `${width}px` }, viewport.width === 390 ? 331 : 700)
    await page.locator('figure').evaluate(node => { node.scrollLeft = 0 })
    const measurement = await page.evaluate(() => {
      const figure = document.querySelector('figure')
      const media = document.querySelector('.sr-figure-media')
      const svg = media.querySelector('svg')
      const labels = [...svg.querySelectorAll('text')].map(node => {
        const m = node.getScreenCTM()
        const box = node.getBoundingClientRect()
        return {
          text: node.textContent,
          px: Number.parseFloat(getComputedStyle(node).fontSize) * Math.hypot(m.a, m.b),
          box: { x: box.x, y: box.y, width: box.width, height: box.height },
        }
      })
      const box = media.getBoundingClientRect()
      const mediaWidth = box.width
      const mediaHeight = box.height
      figure.scrollLeft = figure.scrollWidth
      return {
        viewport: { width: innerWidth, height: innerHeight }, mediaWidth, mediaHeight,
        svgWidth: svg.getBoundingClientRect().width,
        labels, minTextPx: Math.min(...labels.map(l => l.px)),
        clientWidth: figure.clientWidth, scrollWidth: figure.scrollWidth,
        scrollEnd: figure.scrollLeft, expectedScrollEnd: figure.scrollWidth - figure.clientWidth,
      }
    })
    observations.push(measurement)
    assert.ok(Math.abs(measurement.mediaWidth - 640) < 0.1)
    assert.ok(Math.abs(measurement.mediaHeight - 560) < 0.1)
    assert.ok(Math.abs(measurement.svgWidth - 640) < 0.1)
    assert.equal(measurement.labels.length, 10)
    assert.ok(measurement.minTextPx >= spec.display.minTextPx)
    assert.ok(Math.abs(measurement.scrollEnd - measurement.expectedScrollEnd) < 1)
    if (viewport.width === 1440) {
      await page.locator('figure').evaluate(node => { node.scrollLeft = 0 })
      await page.locator('.sr-figure-media').screenshot({
        path: `${own}/fig-198.actual-640.png`, animations: 'disabled',
      })
    } else {
      assert.ok(measurement.expectedScrollEnd > 0)
    }
  }
  fs.writeFileSync(`${own}/display-results.json`, `${JSON.stringify({
    status: 'pass', basis: 'Offline current FigureMedia class/attribute contract with unmodified current app.css, isolated headless Chromium. Not a served lesson, independent review or card approval.',
    observations, productCss: { path: cssPath, sha256: hash(cssPath) },
    spec: { path: specPath, sha256: hash(specPath) },
    svg: { path: svgPath, sha256: hash(svgPath) },
    screenshot: { path: `${own}/fig-198.actual-640.png`, sha256: hash(`${own}/fig-198.actual-640.png`), width: 640, height: 560 },
    screenshotsCreated: 1, nativeRerenders: 0, independentReview: false, approval: 'none',
  }, null, 2)}\n`, { flag: 'wx' })
  console.log(JSON.stringify({
    status: 'pass', measuredMediaWidths: observations.map(o => o.mediaWidth),
    minTextPx: Math.min(...observations.map(o => o.minTextPx)),
    mobileScrollEnd: observations[1].scrollEnd, screenshots: 1,
  }))
} catch (error) {
  fs.writeFileSync(`${own}/display.FIRST-failure.json`, `${JSON.stringify({
    status: 'fail', observations, error: error.message, approval: 'none',
  }, null, 2)}\n`, { flag: 'wx' })
  throw error
} finally {
  await browser.close()
}
