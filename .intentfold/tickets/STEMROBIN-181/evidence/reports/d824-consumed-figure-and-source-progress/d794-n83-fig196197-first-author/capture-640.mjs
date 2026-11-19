import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import { createRequire } from 'node:module'

const R = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const O = `${R}/.intentfold/tickets/STEMROBIN-181/tmp/d794-n83-fig196197-first-author`
assert.equal(process.cwd(), R)
const [id, revision] = process.argv.slice(2)
assert.ok(['fig-196', 'fig-197'].includes(id))
assert.ok(/^(initial|repair-[1-9][0-9]*)$/.test(revision))
const dir = `${O}/${id}/${revision}`
const reportPath = `${dir}/display-640.json`
assert.ok(!fs.existsSync(reportPath), 'Do not replay a completed capture')
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const specPath = `${dir}/spec.json`
const svgPath = `${dir}/${id}.svg`
const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'))
const render = JSON.parse(fs.readFileSync(`${dir}/render.json`, 'utf8'))
assert.equal(render.status, 'pass')
assert.equal(render.spec.sha256, hash(specPath))
assert.equal(render.output.svg.sha256, hash(svgPath))
const require = createRequire(`${R}/.agents/skills/package.json`)
const { chromium } = require('playwright-core')
const executablePath = [chromium.executablePath(), '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find(p => fs.existsSync(p))
assert.ok(executablePath)
const cssPath = `${R}/app/src/styles/app.css`
const css = fs.readFileSync(cssPath, 'utf8')
const svg = fs.readFileSync(svgPath, 'utf8')
const browser = await chromium.launch({ executablePath, headless: true })
const observations = []
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1 })
  await page.route('**/*', route => route.abort())
  await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${css}
    html,body { margin:0; padding:0; font-size:16px; background:#fff; }
    main { width:700px; margin:24px auto; font-size:16px; }
  </style></head><body><main>
    <figure class="sr-read-fig" data-figure-id="${id}" data-figure-layout="scroll" data-figure-purpose="instructional">
      <div class="sr-figure-media" data-figure-mode="deterministic" data-figure-purpose="instructional" data-figure-theme="neutral">
        <div class="sr-figure-vector" aria-hidden="true">${svg}</div>
      </div>
    </figure>
  </main></body></html>`)
  await page.evaluate(() => document.fonts.ready)
  for (const viewport of [{ width: 1440, height: 960 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport)
    await page.locator('main').evaluate((element, width) => { element.style.width = `${width}px` }, viewport.width === 390 ? 331 : 700)
    const measurement = await page.evaluate(() => {
      const figure = document.querySelector('figure')
      const media = figure.querySelector('.sr-figure-media')
      const svg = media.querySelector('svg')
      const rect = media.getBoundingClientRect()
      const labels = [...svg.querySelectorAll('text')].map(node => {
        const matrix = node.getScreenCTM()
        const box = node.getBoundingClientRect()
        return {
          text: node.textContent,
          px: parseFloat(getComputedStyle(node).fontSize) * Math.hypot(matrix.a, matrix.b),
          relativeBox: { x: box.x - rect.x, y: box.y - rect.y, width: box.width, height: box.height },
        }
      })
      figure.scrollLeft = figure.scrollWidth
      return {
        viewport: { width: innerWidth, height: innerHeight },
        mediaWidth: rect.width, mediaHeight: rect.height,
        svgWidth: svg.getBoundingClientRect().width,
        minTextPx: Math.min(...labels.map(label => label.px)),
        labels, clientWidth: figure.clientWidth, scrollWidth: figure.scrollWidth,
        scrollEnd: figure.scrollLeft, expectedScrollEnd: figure.scrollWidth - figure.clientWidth,
        resolvedArrowheads: svg.querySelectorAll('[data-arrowhead-for]').length,
      }
    })
    assert.ok(Math.abs(measurement.mediaWidth - 640) < 0.1)
    assert.ok(Math.abs(measurement.svgWidth - 640) < 0.1)
    assert.ok(measurement.minTextPx >= 16)
    assert.equal(measurement.labels.length, render.labels)
    assert.ok(Math.abs(measurement.scrollEnd - measurement.expectedScrollEnd) < 1)
    if (viewport.width === 390) assert.ok(measurement.expectedScrollEnd > 0)
    for (const label of measurement.labels) {
      const box = label.relativeBox
      assert.ok(box.x >= -0.1 && box.y >= -0.1)
      assert.ok(box.x + box.width <= measurement.mediaWidth + 0.1)
      assert.ok(box.y + box.height <= measurement.mediaHeight + 0.1)
    }
    observations.push(measurement)
    if (viewport.width === 1440) {
      await page.locator('.sr-figure-media').screenshot({ path: `${dir}/${id}.actual-640.png`, animations: 'disabled' })
    }
  }
  fs.writeFileSync(reportPath, `${JSON.stringify({
    schema: 'd794/actual-media-display@1', status: 'pass', figure: id, revision,
    basis: 'Offline current figure-media DOM and unmodified product app.css, headless existing Chromium, DPR 1. This is not a live full-lesson acceptance run or independent visual review.',
    productCss: { path: 'app/src/styles/app.css', sha256: hash(cssPath) },
    specSha256: hash(specPath), svgSha256: hash(svgPath), observations,
    screenshot: { path: `${dir}/${id}.actual-640.png`, sha256: hash(`${dir}/${id}.actual-640.png`) },
    screenshotsProduced: 1, candidateImageOpens: 'Recorded separately only when loaded into author context.',
    approval: 'none',
  }, null, 2)}\n`, { flag: 'wx' })
  console.log(`${id} 640px, ${observations[0].minTextPx}px text, reachable mobile scroll`)
} catch (error) {
  fs.writeFileSync(`${dir}/display-640.FIRST-failure.json`, `${JSON.stringify({
    status: 'fail', observations, error: error.stack,
  }, null, 2)}\n`, { flag: 'wx' })
  console.error(error)
  process.exitCode = 1
} finally {
  await browser.close()
}
