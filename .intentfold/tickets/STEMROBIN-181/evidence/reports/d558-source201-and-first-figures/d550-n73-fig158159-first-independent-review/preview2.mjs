import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const outputRoot = path.dirname(fileURLToPath(import.meta.url))
const repo = process.cwd()
assert.equal(outputRoot, path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d550-n73-fig158159-first-independent-review'))
const author = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d537-n73-first-modern-figure-author')
const require = createRequire(path.join(repo, 'app/package.json'))
const { chromium } = require('playwright')
const postcss = require('postcss')
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
const bind = file => ({
  path: file,
  sha256: hash(fs.readFileSync(file)),
  mode: (fs.statSync(file).mode & 0o777).toString(8).padStart(4, '0'),
})
const freezeFile = path.join(author, 'author-freeze.json')
const freezeBytes = fs.readFileSync(freezeFile)
assert.equal(hash(freezeBytes), 'deb0f8af88181e13438eb3b4ed243f2cf88e2ff60e945c4a46b28b98b1ffed7e')
const frozen = JSON.parse(freezeBytes)
const cssFile = path.join(repo, 'app/src/styles/app.css')
const css = fs.readFileSync(cssFile, 'utf8')
const selectors = [':root', '.sr-read', '.sr-read-fig', '.sr-figure-media', '.sr-figure-media svg']
const rules = []
postcss.parse(css).walkRules(rule => {
  if (rule.parent.type === 'root' && rule.selectors?.some(selector => selectors.includes(selector))) {
    rules.push(rule.toString())
  }
})
assert.ok(rules.length >= 5, 'Existing product figure/media CSS rules must be present')
const evidencePath = path.join(outputRoot, 'preview2-generation.json')
assert.equal(fs.existsSync(evidencePath), false, 'This first preview generation may not overwrite evidence')
for (const figure of ['fig-158', 'fig-159']) {
  assert.equal(fs.existsSync(path.join(outputRoot, `${figure}.preview2.png`)), false)
}

const browser = await chromium.launch({ headless: true })
const evidence = {
  schema: 'd550/first-browser-mobile-preview2-generation@1',
  date: '2026-11-18',
  method: 'Existing app Playwright; isolated headless Chromium; first element screenshots',
  correctionAuthorizedBeforeGeneration: true,
  resvgGenerated: 0,
  resvgOpened: 0,
  methodCorrectionIsNotFigureRepairOrBudgetReset: true,
  sourceCSS: bind(cssFile),
  authorFreeze: bind(freezeFile),
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
  requestedMediaWidthPx: 342,
  inheritedNativeTextTargetPx: 17,
  inheritedDesktopMediaWidthPx: 495,
  scope: 'Figure-only preview, not a full card, native renderer rerun, validator rerun, or integrated DISPLAY acceptance.',
  sourceSVGBytesModified: false,
  cssVariablesReplaced: false,
  cssVariableResolution: 'Chromium naturally resolves original SVG var() paint values and their fallbacks',
  screenshotsCreated: 0,
  modelImageOpensByThisScript: 0,
  figures: [],
  browserClosed: false,
}
try {
  const context = await browser.newContext({
    viewport: evidence.viewport,
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  })
  await context.route('**/*', route => route.abort())
  const page = await context.newPage()
  for (const figure of ['fig-158', 'fig-159']) {
    const svgFile = path.join(author, figure, 'after', `${figure}.svg`)
    const bytes = fs.readFileSync(svgFile)
    const expected = frozen.files.find(file => file.path === svgFile)
    assert.ok(expected, 'SVG must belong to the author freeze')
    assert.equal(hash(bytes), expected.sha256)
    await page.setContent(`<!doctype html><meta charset="utf-8">
      <style>${rules.join('\n')}
      html { background: white; } body { margin: 0; padding: 24px; }
      main { max-width: 1050px; margin: auto; } * { box-sizing: border-box; }
      </style><main class="sr-read"><figure class="sr-read-fig">
      <div class="sr-figure-media">${bytes.toString('utf8')}</div></figure></main>`)
    await page.evaluate(async () => {
      await document.fonts.ready
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    })
    const metrics = await page.locator('.sr-figure-media').evaluate(media => {
      const svg = media.querySelector('svg')
      const box = svg.getBoundingClientRect()
      const labels = Array.from(svg.querySelectorAll('text'), label => {
        const matrix = label.getScreenCTM()
        const bounds = label.getBoundingClientRect()
        return {
          id: label.dataset.labelId,
          text: label.textContent,
          screenFontPx: Number(label.getAttribute('font-size')) * Math.hypot(matrix.a, matrix.b),
          clipped: bounds.left < box.left - 0.5 || bounds.right > box.right + 0.5 ||
            bounds.top < box.top - 0.5 || bounds.bottom > box.bottom + 0.5,
          computedFill: getComputedStyle(label).fill,
        }
      })
      const visiblePaints = Array.from(svg.querySelectorAll('line,path,ellipse,circle,polygon'))
        .filter(node => !node.closest('defs') && getComputedStyle(node).display !== 'none')
        .map(node => ({
          id: node.id,
          stroke: getComputedStyle(node).stroke,
          fill: getComputedStyle(node).fill,
        }))
      return {
        width: box.width,
        height: box.height,
        mediaWidth: media.getBoundingClientRect().width,
        labels,
        minScreenFontPx: Math.min(...labels.map(label => label.screenFontPx)),
        visiblePaints,
      }
    })
    assert.ok(Math.abs(metrics.width - 342) < 0.01)
    assert.ok(Math.abs(metrics.mediaWidth - 342) < 0.01)
    const screenshot = path.join(outputRoot, `${figure}.preview2.png`)
    await page.locator('.sr-figure-media').screenshot({ path: screenshot, animations: 'disabled' })
    fs.chmodSync(screenshot, 0o444)
    const png = fs.readFileSync(screenshot)
    assert.equal(png.readUInt32BE(16), 342)
    assert.equal(hash(fs.readFileSync(svgFile)), hash(bytes))
    evidence.figures.push({
      figure,
      inputSVG: bind(svgFile),
      screenshot: { ...bind(screenshot), width: png.readUInt32BE(16), height: png.readUInt32BE(20) },
      firstScreenshot: true,
      SVGPreserved: true,
      metrics,
      actualModelOpenPending: true,
    })
    evidence.screenshotsCreated += 1
  }
} finally {
  await browser.close()
  evidence.browserClosed = true
}
assert.equal(hash(fs.readFileSync(cssFile)), hash(Buffer.from(css)))
fs.writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`, { flag: 'wx', mode: 0o444 })
process.stdout.write(`${JSON.stringify({
  evidence: bind(evidencePath),
  screenshots: evidence.figures.map(item => ({
    figure: item.figure,
    ...item.screenshot,
    minScreenFontPx: item.metrics.minScreenFontPx,
    labelClipping: item.metrics.labels.filter(label => label.clipped),
  })),
  browserClosed: evidence.browserClosed,
  resvgGenerated: 0,
  scriptImageOpens: 0,
}, null, 2)}\n`)
