import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import { createRequire } from 'node:module'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const owner = `${repo}/.intentfold/tickets/STEMROBIN-181/tmp/d743-n82-fig195-first-author`
const require = createRequire(`${repo}/.agents/skills/package.json`)
const { chromium } = require('playwright-core')
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const reportPath = `${owner}/display-640.json`
assert.ok(!fs.existsSync(reportPath), 'Do not replay completed media capture')
const spec = JSON.parse(fs.readFileSync(`${owner}/fig-195.spec.json`, 'utf8'))
const render = JSON.parse(fs.readFileSync(`${owner}/fig-195.render.json`, 'utf8'))
const bindings = JSON.parse(fs.readFileSync(`${owner}/bindings.json`, 'utf8'))
assert.equal(render.status, 'pass')
assert.equal(bindings.status, 'pass')
assert.equal(render.output.svg.sha256, hash(`${owner}/fig-195.svg`))
const svg = fs.readFileSync(`${owner}/fig-195.svg`, 'utf8')
const cssPath = `${repo}/app/src/styles/app.css`
const css = fs.readFileSync(cssPath, 'utf8')
const executablePath = [chromium.executablePath(), '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find(file => fs.existsSync(file))
assert.ok(executablePath, 'Use existing Chromium only')
const browser = await chromium.launch({ executablePath, headless: true })
const observations = []
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1 })
  await page.route('**/*', route => route.abort())
  await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${css}
    html,body { margin:0; padding:0; font-size:16px; background:#fff; }
    main { width:700px; margin:24px auto; font-size:16px; }
  </style></head><body><main>
    <figure class="sr-read-fig" data-figure-id="fig-195" data-figure-layout="scroll" data-figure-purpose="instructional">
      <div class="sr-figure-media" data-figure-mode="deterministic" data-figure-purpose="instructional" data-figure-theme="neutral">
        <div class="sr-figure-vector" aria-hidden="true">${svg}</div>
      </div>
    </figure>
  </main></body></html>`)
  await page.evaluate(() => document.fonts.ready)
  for (const viewport of [{ width: 1440, height: 960 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport)
    await page.locator('main').evaluate((element, width) => { element.style.width = `${width}px` }, viewport.width === 390 ? 331 : 700)
    const result = await page.evaluate(() => {
      const figure = document.querySelector('figure')
      const media = document.querySelector('.sr-figure-media')
      const svg = media.querySelector('svg')
      const labels = [...svg.querySelectorAll('text')].map(node => {
        const matrix = node.getScreenCTM()
        const box = node.getBoundingClientRect()
        return { text: node.textContent, px: Number.parseFloat(getComputedStyle(node).fontSize) * Math.hypot(matrix.a, matrix.b), box: { x: box.x, y: box.y, width: box.width, height: box.height } }
      })
      const mediaBox = media.getBoundingClientRect()
      figure.scrollLeft = figure.scrollWidth
      return {
        viewport: { width: innerWidth, height: innerHeight },
        mediaWidth: mediaBox.width, mediaHeight: mediaBox.height,
        minTextPx: Math.min(...labels.map(item => item.px)),
        labels, clientWidth: figure.clientWidth, scrollWidth: figure.scrollWidth,
        scrollEnd: figure.scrollLeft, expectedScrollEnd: figure.scrollWidth - figure.clientWidth,
        svgWidth: svg.getBoundingClientRect().width,
      }
    })
    assert.ok(Math.abs(result.mediaWidth - 640) < 0.1)
    assert.ok(Math.abs(result.svgWidth - 640) < 0.1)
    assert.ok(result.minTextPx >= spec.display.minTextPx)
    assert.equal(result.labels.length, 12)
    assert.ok(Math.abs(result.scrollEnd - result.expectedScrollEnd) < 1)
    observations.push(result)
    if (viewport.width === 1440) {
      await page.locator('.sr-figure-media').screenshot({ path: `${owner}/fig-195.actual-640.png`, animations: 'disabled' })
    } else {
      assert.ok(result.expectedScrollEnd > 0)
    }
  }
  fs.writeFileSync(reportPath, `${JSON.stringify({
    schema: 'd743/actual-media-display@1', status: 'pass',
    basis: 'Offline current FigureMedia DOM structure with unmodified current app.css; not a live served lesson or independent review.',
    browser: 'existing playwright-core Chromium, headless, DPR 1',
    productCss: { path: cssPath, sha256: hash(cssPath) },
    specSha256: hash(`${owner}/fig-195.spec.json`),
    svgSha256: hash(`${owner}/fig-195.svg`),
    screenshot: { path: `${owner}/fig-195.actual-640.png`, sha256: hash(`${owner}/fig-195.actual-640.png`), width: 640, height: 600 },
    observations, screenshotCount: 1, approval: 'none',
  }, null, 2)}\n`)
  console.log(`PASS: actual media 640px; minimum text ${Math.min(...observations.map(item => item.minTextPx))}px; mobile scroll end reachable`)
} catch (error) {
  fs.writeFileSync(`${owner}/display-640.first-fail.json`, `${JSON.stringify({ status: 'fail', observations, error: error.message }, null, 2)}\n`, { flag: 'wx' })
  console.error(error)
  process.exitCode = 1
} finally {
  await browser.close()
}
