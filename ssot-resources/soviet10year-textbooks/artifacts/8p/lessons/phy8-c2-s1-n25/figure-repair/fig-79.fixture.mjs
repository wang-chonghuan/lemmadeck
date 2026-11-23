import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import { createRequire } from 'node:module'

const root = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180'
assert.equal(process.cwd(), root)
const require = createRequire(`${root}/app/package.json`)
const { chromium } = require('playwright')
const owner = 'ssot-resources/soviet10year-textbooks/artifacts/8p/lessons/phy8-c2-s1-n25/figure-repair'
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const recordPath = `${owner}/fig-79.display.json`
assert.equal(fs.existsSync(recordPath), false, 'Preserve any prior fixture result')
const spec = read(`${owner}/fig-79.spec.json`)
const render = read(`${owner}/fig-79.render.json`)
assert.equal(render.status, 'pass')
assert.equal(hash(`${owner}/fig-79.svg`), render.output.svg.sha256)
assert.equal(hash(`${owner}/fig-79.spec.json`), render.spec.sha256)
const svg = fs.readFileSync(`${owner}/fig-79.svg`, 'utf8')
const appCss = fs.readFileSync('app/src/styles/app.css', 'utf8')
// Reuse actual figure/token/print CSS, with remote/build-time imports omitted.
const css = appCss.replace(/@import[^;]+;/g, '')
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>FIG79 author fixture</title>
<style>${css}</style>
<style>
html,body{margin:0;height:auto;min-height:100%;overflow:auto}
body{font-family:var(--sr-font);font-size:16px;color:var(--sr-ink);background:var(--sr-white)}
.fixture-sheet{width:640px;max-width:calc(100% - 32px);margin:24px auto;font-size:16px}
.fixture-sheet h1{font-size:20px;font-weight:600;line-height:1.4;margin:0}
.fixture-sheet figure{width:100%;max-width:100%;font-size:16px}
.fixture-sheet figcaption{font-size:16px;line-height:1.5;margin-top:12px;color:var(--sr-ink-soft)}
.fixture-sheet *{letter-spacing:0}
@media print{.fixture-sheet{width:640px;max-width:640px;margin:24px auto}}
</style></head><body>
<main class="fixture-sheet">
<h1>Figure 79</h1>
<figure class="sr-read-fig" data-figure-layout="scroll" data-testid="fig-79">
<div class="sr-figure-media" data-figure-theme="neutral"><div class="sr-figure-vector">${svg}</div></div>
</figure></main></body></html>`
fs.writeFileSync(`${owner}/fig-79.fixture.html`, html, { flag: 'wx' })
const record = {
  status: 'headless-author-display-running-not-independent-review',
  cwd: root,
  spec: { path: `${owner}/fig-79.spec.json`, sha256: hash(`${owner}/fig-79.spec.json`) },
  output: { path: `${owner}/fig-79.svg`, sha256: hash(`${owner}/fig-79.svg`) },
  renderer: { path: `${owner}/fig-79.render.json`, sha256: hash(`${owner}/fig-79.render.json`) },
  appCss: { path: 'app/src/styles/app.css', sha256: hash('app/src/styles/app.css') },
  fixture: { path: `${owner}/fig-79.fixture.html`, sha256: hash(`${owner}/fig-79.fixture.html`) },
  browser: { headless: true, ephemeralProfile: true, realUserProfile: false, CDP: false },
  actualImageOpensBeforeInspection: 0,
  screenshotsAreNotYetVisualReview: true,
  cases: [],
  errors: [],
  remoteRequests: [],
}
const save = () => fs.writeFileSync(recordPath, JSON.stringify(record, null, 2) + '\n')
save()
const browser = await chromium.launch({ executablePath: chromium.executablePath(), headless: true })
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1 })
  await context.route('**/*', route => {
    record.remoteRequests.push(route.request().url())
    return route.abort()
  })
  const page = await context.newPage()
  page.on('pageerror', error => record.errors.push(error.message))
  const cases = [
    { id: 'desktop-neutral', viewport: { width: 1440, height: 960 }, theme: 'neutral', end: false, print: false },
    { id: 'mobile-left', viewport: { width: 390, height: 844 }, theme: 'neutral', end: false, print: false },
    { id: 'mobile-right', viewport: { width: 390, height: 844 }, theme: 'neutral', end: true, print: false },
    { id: 'desktop-accent', viewport: { width: 1440, height: 960 }, theme: 'accent', end: false, print: false },
    { id: 'desktop-print', viewport: { width: 1440, height: 960 }, theme: 'neutral', end: false, print: true },
  ]
  for (const item of cases) {
    await page.setViewportSize(item.viewport)
    await page.emulateMedia({ media: item.print ? 'print' : 'screen' })
    await page.setContent(html, { waitUntil: 'load' })
    await page.evaluate(item => {
      document.querySelector('.sr-figure-media').dataset.figureTheme = item.theme
      document.querySelector('main').classList.toggle('sr-print-lesson', item.print)
      const figure = document.querySelector('figure')
      figure.scrollLeft = item.end ? figure.scrollWidth : 0
    }, item)
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => resolve())))
    const result = await page.evaluate(({ item, spec }) => {
      const svg = document.querySelector('.sr-figure-vector svg')
      const figure = document.querySelector('figure')
      const media = document.querySelector('.sr-figure-media')
      const rect = element => {
        const value = element.getBoundingClientRect()
        return { x: value.x, y: value.y, width: value.width, height: value.height,
          right: value.right, bottom: value.bottom }
      }
      const svgRect = rect(svg)
      const text = [...svg.querySelectorAll('text')].map(node => {
        const matrix = node.getScreenCTM()
        return {
          id: node.dataset.labelId, text: node.textContent,
          measuredTextPx: Number.parseFloat(node.getAttribute('font-size')) * Math.hypot(matrix.a, matrix.b),
          rect: rect(node), fill: getComputedStyle(node).fill,
        }
      })
      const visibleGeometry = [...svg.querySelectorAll(
        'line,path,polygon,polyline,circle,ellipse,rect,g[data-arrowhead-for]',
      )].filter(node => {
        if (node.closest('defs') || node.closest('[display="none"]')) return false
        if (getComputedStyle(node).display === 'none') return false
        const box = node.getBoundingClientRect()
        return box.width > 0 || box.height > 0
      })
      const clipped = visibleGeometry.map(node => ({ id: node.id || node.dataset.arrowheadFor || node.tagName, rect: rect(node) }))
        .filter(node => node.rect.x < svgRect.x - 0.1 ||
          node.rect.y < svgRect.y - 0.1 || node.rect.right > svgRect.right + 0.1 ||
          node.rect.bottom > svgRect.bottom + 0.1)
      const raw = [...svg.querySelectorAll('#ld-fig-79-raw-path-layer > path')]
      const expectedPaths = spec.objects.filter(object => object.type === 'svgPath')
      const pathBindings = raw.map((node, index) => ({
        object: expectedPaths[index]?.id, matches: node.getAttribute('d') === expectedPaths[index]?.d,
      }))
      const arrows = [...svg.querySelectorAll('g[data-arrowhead-for]')].map(node => ({
        id: node.dataset.arrowheadFor, rect: rect(node),
      }))
      const labelsInsideCanvas = text.every(label => label.rect.x >= svgRect.x &&
        label.rect.y >= svgRect.y && label.rect.right <= svgRect.right &&
        label.rect.bottom <= svgRect.bottom)
      const overlap = []
      for (let i = 0; i < text.length; i++) {
        for (let j = i + 1; j < text.length; j++) {
          const a = text[i].rect, b = text[j].rect
          if (a.x < b.right && b.x < a.right && a.y < b.bottom && b.y < a.bottom) overlap.push([text[i].id, text[j].id])
        }
      }
      const curve = raw[0]
      const curveEnd = curve.getPointAtLength(curve.getTotalLength())
      const rotation = svg.querySelector('[id$="_ld-source-rotation-arrowhead"]')
      const continuousRotation = Math.hypot(curveEnd.x - rotation.x1.baseVal.value,
        curveEnd.y - rotation.y1.baseVal.value) < 0.001
      const rod = svg.querySelector('[id$="_ld-source-horizontal-rod"]')
      const shaft = svg.querySelector('[id$="_ld-source-central-shaft"]')
      const rodScreen = rect(rod)
      const shaftScreen = rect(shaft)
      const dimension = id => {
        const node = svg.querySelector(`[id$="_ld-${id}"]`)
        return Math.hypot(node.x2.baseVal.value - node.x1.baseVal.value,
          node.y2.baseVal.value - node.y1.baseVal.value)
      }
      return {
        id: item.id, viewport: item.viewport, theme: item.print ? 'print' : item.theme,
        actualMediaWidthPx: rect(media).width, svgRect, text,
        minMeasuredTextPx: Math.min(...text.map(label => label.measuredTextPx)),
        labelsInsideCanvas, overlap, clipped,
        pathBindings, rawPathCount: raw.length, arrowheads: arrows,
        continuousRotation,
        qualitativeRightArmLonger: dimension('source-r1-dimension') > dimension('source-r2-dimension'),
        scroll: { clientWidth: figure.clientWidth, scrollWidth: figure.scrollWidth,
          left: figure.scrollLeft, maximum: figure.scrollWidth - figure.clientWidth,
          reachedEnd: Math.abs(figure.scrollLeft - (figure.scrollWidth - figure.clientWidth)) < 1 },
        documentWidth: document.documentElement.scrollWidth,
        rightRodEndpointVisible: rodScreen.right <= rect(figure).right + 0.1,
        bottomShaftEndpointInsideViewport: shaftScreen.bottom <= window.innerHeight,
        canvasBottomInsideViewport: svgRect.bottom <= window.innerHeight,
        semanticPalette: {
          ink: getComputedStyle(media).getPropertyValue('--ld-figure-ink').trim(),
          muted: getComputedStyle(media).getPropertyValue('--ld-figure-muted').trim(),
          paper: getComputedStyle(media).getPropertyValue('--ld-figure-paper').trim(),
        },
      }
    }, { item, spec })
    record.cases.push(result)
    save()
    assert.equal(result.actualMediaWidthPx, 640)
    assert.equal(result.svgRect.width, 640)
    assert.equal(result.svgRect.height, 400)
    assert.deepEqual(result.text.map(label => label.text), ['Steel', 'Aluminum', 'r\u2082', 'r\u2081'])
    assert(result.minMeasuredTextPx >= 18)
    assert(result.labelsInsideCanvas)
    assert.equal(result.overlap.length, 0)
    assert.equal(result.clipped.length, 0)
    assert.equal(result.rawPathCount, 7)
    assert(result.pathBindings.every(binding => binding.matches))
    assert.equal(result.arrowheads.length, 5)
    assert(result.arrowheads.every(head => head.rect.width > 0 && head.rect.height > 0))
    assert(result.continuousRotation)
    assert(result.qualitativeRightArmLonger)
    assert.equal(result.documentWidth, item.viewport.width)
    assert(result.bottomShaftEndpointInsideViewport && result.canvasBottomInsideViewport)
    if (item.end) assert(result.scroll.reachedEnd && result.rightRodEndpointVisible)
    const screenshot = `${owner}/fig-79.${item.id}.png`
    assert.equal(fs.existsSync(screenshot), false)
    await page.screenshot({ path: screenshot, fullPage: false, animations: 'disabled' })
    result.screenshot = { path: screenshot, sha256: hash(screenshot) }
    result.status = 'author-display-mechanical-pass'
    save()
    console.log(`${item.id}: 640px media, ${result.minMeasuredTextPx}px labels, complete bounds; scroll ${result.scroll.left}/${result.scroll.maximum}`)
  }
  assert.equal(record.errors.length, 0)
  assert.equal(record.remoteRequests.length, 0)
  record.status = 'headless-author-display-mechanical-pass-visual-inspection-pending'
  save()
} catch (error) {
  record.status = 'headless-author-display-fail'
  record.error = error.stack
  save()
  throw error
} finally {
  await browser.close()
}
