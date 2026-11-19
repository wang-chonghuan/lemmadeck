import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), root)
const out = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d1226-n97-fig223225-first-independent-review')
const author = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d1214-n97-fig223225-first-author')
const req = createRequire(path.join(root, 'app/package.json'))
const { chromium } = req('playwright')
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
const bind = file => ({ path: file, sha256: hash(fs.readFileSync(file)), bytes: fs.statSync(file).size })
assert.equal(bind(path.join(author, 'report.json')).sha256, 'fcc1d3855fb3c5da5248131074df2b9812e011861b77237a4f3369dd7ed3f24c')

const cssPath = path.join(root, 'app/src/styles/app.css')
const css = fs.readFileSync(cssPath, 'utf8')
const rule = selector => {
  const start = css.indexOf(selector)
  assert(start >= 0)
  return css.slice(start, css.indexOf('}', start) + 1)
}
const tokenStart = css.lastIndexOf(':root {', css.indexOf('--sr-white:'))
const tokens = css.slice(tokenStart, css.indexOf('}', tokenStart) + 1)
const productRules = [
  tokens,
  rule('.sr-figure-media {'),
  rule('.sr-figure-media[data-figure-theme="accent"] {'),
  rule('.sr-figure-media svg,'),
  rule('.sr-read-fig[data-figure-layout="scroll"],'),
  rule('.sr-read-fig[data-figure-layout="scroll"] .sr-figure-media,'),
].join('\n')
fs.writeFileSync(path.join(out, 'product-css-excerpt.css'), productRules)
const inputs = [bind(cssPath), bind(path.join(author, 'report.json'))]
const records = []
const browser = await chromium.launch({ headless: false })
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1 })
  await context.route('**/*', route => route.abort())
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', e => errors.push(String(e)))
  for (const id of ['fig-223', 'fig-224', 'fig-225']) {
    const base = path.join(author, 'figures', id, `${id}.repair1`)
    const spec = JSON.parse(fs.readFileSync(`${base}.spec.json`, 'utf8'))
    const receipt = JSON.parse(fs.readFileSync(`${base}.render.json`, 'utf8'))
    const svg = fs.readFileSync(`${base}.svg`, 'utf8')
    inputs.push(bind(`${base}.spec.json`), bind(`${base}.svg`), bind(`${base}.render.json`))
    assert.equal(hash(svg), receipt.output.svg.sha256)
    assert.equal(bind(`${base}.spec.json`).sha256, receipt.spec.sha256)
    const html = `<!doctype html><html><head><meta charset="utf-8"><style>
${productRules}
html,body{margin:0;background:#fff;font-size:16px}
main{width:calc(100% - 32px);max-width:900px;margin:16px auto}
</style></head><body><main><figure class="sr-read-fig" data-figure-layout="scroll" style="margin:0">
<span class="sr-figure-media">${svg}</span></figure></main></body></html>`
    fs.writeFileSync(path.join(out, `${id}.browser-surface.html`), html)
    await page.setViewportSize({ width: 1440, height: 960 })
    await page.setContent(html, { waitUntil: 'load' })
    await page.evaluate(() => document.fonts.ready)
    assert.equal(await page.locator('svg').count(), 1)
    const inspect = () => page.evaluate(({ spec, receipt }) => {
      const svg = document.querySelector('svg')
      const svgRect = svg.getBoundingClientRect()
      const media = document.querySelector('.sr-figure-media')
      const rect = r => ({ x: r.x, y: r.y, width: r.width, height: r.height })
      const inflate = (r, n) => ({ x: r.x - n, y: r.y - n, width: r.width + 2 * n, height: r.height + 2 * n })
      const overlap = (a, b) => Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x)) *
        Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y))
      const minGap = spec.layout?.minLabelGap ?? 4
      const screen = at => ({
        x: (at[0] - spec.canvas.boundingBox[0]) * spec.canvas.width / (spec.canvas.boundingBox[2] - spec.canvas.boundingBox[0]),
        y: (spec.canvas.boundingBox[1] - at[1]) * spec.canvas.height / (spec.canvas.boundingBox[1] - spec.canvas.boundingBox[3]),
      })
      const objectNode = id => [...svg.querySelectorAll('[id]')].find(n => n.id.endsWith(`_ld-${id}`))
      const state = n => {
        const s = getComputedStyle(n)
        return { id: n.id, tag: n.tagName, bbox: rect(n.getBBox()), visibility: s.visibility, display: s.display,
          opacity: s.opacity, stroke: s.stroke, fill: s.fill, strokeWidth: s.strokeWidth }
      }
      const points = spec.objects.filter(o => o.type === 'point').map(o => {
        const p = screen(o.at)
        const radius = (o.size || 4) + 5
        const n = objectNode(o.id)
        return { id: o.id, declaredVisible: o.visible !== false, anchor: p, nativeAvoidRect: {
          x: p.x - radius, y: p.y - radius, width: radius * 2, height: radius * 2,
        }, node: n ? state(n) : null }
      })
      const labels = [...svg.querySelectorAll('text')].map(n => {
        const bbox = rect(n.getBBox())
        const s = getComputedStyle(n)
        const matrix = n.getScreenCTM()
        return { id: n.getAttribute('data-label-id'), text: n.textContent, bbox, padded: inflate(bbox, minGap),
          fontSize: s.fontSize, transformedFontPx: parseFloat(s.fontSize) * Math.hypot(matrix.a, matrix.b),
          fill: s.fill, node: n }
      })
      const geometry = [...svg.querySelectorAll('line,path,polygon,polyline,circle,ellipse,rect')]
        .filter(n => !n.closest('defs'))
      const strokeIntersects = (n, r) => {
        if (typeof n.getTotalLength !== 'function') return false
        let length
        try { length = n.getTotalLength() } catch { return false }
        if (!Number.isFinite(length) || length <= 0) return false
        const matrix = n.getCTM()
        const samples = Math.min(500, Math.max(2, Math.ceil(length / 4)))
        for (let i = 0; i <= samples; i++) {
          const p = n.getPointAtLength(length * i / samples)
          const q = matrix ? new DOMPoint(p.x, p.y).matrixTransform(matrix) : p
          if (q.x >= r.x && q.x <= r.x + r.width && q.y >= r.y && q.y <= r.y + r.height) return true
        }
        return false
      }
      const collisions = receipt.collisions.map(c => {
        const index = labels.findIndex(l => l.id === c.id)
        const label = labels[index]
        const pointContributions = points.filter(p => p.declaredVisible)
          .map(p => ({ id: p.id, area: overlap(label.padded, p.nativeAvoidRect), avoid: p.nativeAvoidRect,
            actualNode: p.node, actualUnpaddedBBoxOverlap: p.node ? overlap(label.bbox, p.node.bbox) : null }))
          .filter(p => p.area > 0)
        const priorLabelContributions = labels.slice(0, index)
          .map(l => ({ id: l.id, text: l.text, area: overlap(label.padded, l.padded),
            unpaddedArea: overlap(label.bbox, l.bbox), bbox: l.bbox, padded: l.padded }))
          .filter(l => l.area > 0)
        const inside = overlap(label.padded, { x: 0, y: 0, width: spec.canvas.width, height: spec.canvas.height })
        const outside = label.padded.width * label.padded.height - inside
        const nativeGeometryHits = geometry.filter(n => n.getAttribute('display') !== 'none' &&
          n.getAttribute('stroke') !== 'none' && parseFloat(n.getAttribute('stroke-width') || '0') > 2.5 &&
          strokeIntersects(n, label.padded)).map(state)
        const visibleStrokeHits = geometry.filter(n => {
          const s = getComputedStyle(n)
          return s.display !== 'none' && s.visibility === 'visible' && s.stroke !== 'none' &&
            parseFloat(s.strokeWidth) > 0 && parseFloat(s.opacity) > 0 && strokeIntersects(n, label.bbox)
        }).map(state)
        return { ...c, actualLabel: { ...label, node: undefined }, pointContributions, priorLabelContributions,
          outsidePaddedArea: outside, nativeGeometryHits, visibleStrokeHits,
          reconstructedNativeScore: pointContributions.reduce((s, p) => s + p.area, 0) +
            priorLabelContributions.reduce((s, l) => s + l.area, 0) + outside * 100 + (nativeGeometryHits.length ? 10000 : 0) }
      })
      const labelPairs = []
      for (let i = 0; i < labels.length; i++) for (let j = 0; j < i; j++) {
        const area = overlap(labels[i].bbox, labels[j].bbox)
        if (area > 0) labelPairs.push({ ids: [labels[j].id, labels[i].id], area })
      }
      const container = document.querySelector('figure')
      container.scrollLeft = container.scrollWidth
      const scroll = { clientWidth: container.clientWidth, scrollWidth: container.scrollWidth,
        reachedScrollLeft: container.scrollLeft, expectedEnd: container.scrollWidth - container.clientWidth }
      container.scrollLeft = 0
      return { mediaWidth: media.getBoundingClientRect().width, svgRect: rect(svgRect),
        viewBox: svg.getAttribute('viewBox'), minTransformedTextPx: Math.min(...labels.map(l => l.transformedFontPx)),
        labels: labels.map(l => ({ ...l, node: undefined })), labelPairs, collisions, points,
        visibleGeometry: geometry.filter(n => getComputedStyle(n).visibility === 'visible' &&
          getComputedStyle(n).display !== 'none').map(state),
        hiddenGeometry: geometry.filter(n => getComputedStyle(n).visibility !== 'visible' ||
          getComputedStyle(n).display === 'none').map(state),
        roles: Object.fromEntries(['ink','muted','accent','accent-soft','grid','paper']
          .map(k => [k, getComputedStyle(media).getPropertyValue(`--ld-figure-${k}`).trim()])), scroll }
    }, { spec, receipt })
    const desktop = await inspect()
    assert.equal(desktop.mediaWidth, 640)
    assert(desktop.minTransformedTextPx >= 16)
    const screenshot = path.join(out, `${id}.actual-svg-640.png`)
    await page.locator('svg').screenshot({ path: screenshot })
    await page.setViewportSize({ width: 390, height: 844 })
    const mobile = await inspect()
    assert.equal(mobile.mediaWidth, 640)
    assert(mobile.minTransformedTextPx >= 16)
    assert.equal(mobile.scroll.reachedScrollLeft, mobile.scroll.expectedEnd)
    records.push({ id, nativeStatusUnchanged: receipt.status, inputSvg: bind(`${base}.svg`),
      desktop, mobile, screenshot: bind(screenshot) })
    console.log(JSON.stringify({ id, width: desktop.mediaWidth, minTextPx: desktop.minTransformedTextPx,
      labelPairs: desktop.labelPairs, collisions: desktop.collisions.map(c => ({
        id: c.id, nativeScore: c.score, reconstructedScore: c.reconstructedNativeScore,
        points: c.pointContributions.map(p => ({ id: p.id, area: p.area, visibility: p.actualNode?.visibility,
          actualUnpaddedBBoxOverlap: p.actualUnpaddedBBoxOverlap })),
        labels: c.priorLabelContributions, outside: c.outsidePaddedArea,
        visibleStrokeHits: c.visibleStrokeHits.map(n => n.id),
      })), mobileScroll: mobile.scroll }))
  }
  assert.deepEqual(errors, [])
  await context.close()
} finally {
  await browser.close()
}
for (const input of inputs) assert.equal(bind(input.path).sha256, input.sha256)
fs.writeFileSync(path.join(out, 'browser-evidence.json'), JSON.stringify({
  schema: 'bounded-unchanged-svg-browser-inspection@1', cwd: root, completedAt: new Date().toISOString(),
  headed: true, playwrightModule: req.resolve('playwright'), executable: chromium.executablePath(),
  viewports: [{ width: 1440, height: 960 }, { width: 390, height: 844 }],
  networkBlocked: true, svgBytesUnchanged: true, nativeRenderReplay: false, appStarted: false,
  screenshotFilesCreated: 3, screenshotImagesOpenedByScript: 0, productCssSource: bind(cssPath),
  productCssExcerpt: bind(path.join(out, 'product-css-excerpt.css')), inputBindings: inputs, records,
}, null, 2) + '\n')
