import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const root = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
assert.equal(process.cwd(), root)
const out = path.dirname(new URL(import.meta.url).pathname)
const require = createRequire(path.join(root, '.agents/skills/package.json'))
const { chromium } = require('playwright-core')
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const svgFile = path.join(out, 'fig-g10-02.candidate.svg')
const oldFile = path.join(root, '.intentfold/tickets/STEMROBIN-188/tmp/n42-image-author/fig-g10-02.label-repair.svg')
const screenshot = path.join(out, 'fig-g10-02.candidate.width-300.png')
assert.ok(!fs.existsSync(screenshot))
const browser = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
})
try {
  const page = await browser.newPage({ viewport: { width: 300, height: 250 }, deviceScaleFactor: 1 })
  const svg = fs.readFileSync(svgFile, 'utf8')
  // Same white, unframed presentation as display-n42-current.mjs, fig02 only.
  await page.setContent(`<style>body{margin:0;display:flex;align-items:start}svg{display:block;width:300px;height:auto;flex:none}</style>${svg}`)
  await page.evaluate(() => document.fonts.ready)
  const measurements = await page.locator('svg').evaluate((svg, oldSvg) => {
    const labels = [...svg.querySelectorAll('text')].map(text => ({
      id: text.getAttribute('data-label-id'),
      text: text.textContent,
      fontPx: Number(text.getAttribute('font-size')),
      actualPx: Number(text.getAttribute('font-size')) * Math.hypot(text.getScreenCTM().a, text.getScreenCTM().b),
      x: Number(text.getAttribute('x')), y: Number(text.getAttribute('y')),
    }))
    const prefix = 'ld-fig-g10-02_ld-'
    const edge = svg.querySelector(`[id="${prefix}box-xy-x"]`)
    const mark = svg.querySelector(`[id="${prefix}vector-mark-box-k-label"]`)
    const head = svg.querySelector(`[data-arrowhead-for="${prefix}vector-mark-box-k-label"]`)
    const headPath = head.querySelector('path')
    const toCanvas = (node, x, y) => {
      const p = svg.createSVGPoint()
      p.x = x
      p.y = y
      const q = p.matrixTransform(node.getScreenCTM()).matrixTransform(svg.getScreenCTM().inverse())
      return [q.x, q.y]
    }
    const triangle = [[0, 0], [10, 5], [0, 10]].map(([x, y]) => toCanvas(headPath, x, y))
    const width = Number(edge.getAttribute('stroke-width'))
    const edgeY = Number(edge.getAttribute('y1'))
    const arrowTop = Math.min(...triangle.map(p => p[1]), Number(mark.getAttribute('y1')) - Number(mark.getAttribute('stroke-width')) / 2)
    const clearance = arrowTop - (edgeY + width / 2)
    const old = new DOMParser().parseFromString(oldSvg, 'image/svg+xml')
    const changed = []
    const compared = []
    const key = node => node.id ? `id:${node.id}` :
      node.hasAttribute('data-arrowhead-for') ? `head:${node.getAttribute('data-arrowhead-for')}` :
      node.hasAttribute('data-label-id') ? `label:${node.getAttribute('data-label-id')}` : null
    const index = new Map([...old.querySelectorAll('[id],[data-arrowhead-for],[data-label-id]')].map(node => [key(node), node]))
    for (const node of svg.querySelectorAll('[id],[data-arrowhead-for],[data-label-id]')) {
      if (node.tagName.toLowerCase() === 'svg' || node.tagName.toLowerCase() === 'defs') continue
      const k = key(node)
      const previous = index.get(k)
      if (!previous) throw new Error(`Missing old SVG node ${k}`)
      const attributes = n => [...n.attributes].map(a => [a.name, a.value]).sort()
      if (JSON.stringify(attributes(node)) !== JSON.stringify(attributes(previous))) changed.push(k)
      compared.push(k)
    }
    return {
      width: svg.getBoundingClientRect().width, height: svg.getBoundingClientRect().height,
      labels, unchangedGeometryAndOtherLabelCheck: { comparedNodes: compared.length, changed },
      collision: {
        method: 'Actual exported filled arrowhead transformed to canvas coordinates. Its complete footprint clears the entire continuous hidden-edge stroke envelope, stronger than testing only its individual dashes.',
        arrowheadPath: headPath.getAttribute('d'),
        arrowheadTransform: head.getAttribute('transform'),
        arrowheadTriangleCanvas: triangle,
        notationShaft: { x1: Number(mark.getAttribute('x1')), y1: Number(mark.getAttribute('y1')), x2: Number(mark.getAttribute('x2')), y2: Number(mark.getAttribute('y2')), strokeWidth: Number(mark.getAttribute('stroke-width')) },
        hiddenEdge: { x1: Number(edge.getAttribute('x1')), y1: edgeY, x2: Number(edge.getAttribute('x2')), y2: Number(edge.getAttribute('y2')), strokeWidth: width, dashArray: edge.getAttribute('stroke-dasharray'), cap: edge.getAttribute('stroke-linecap') },
        arrowFootprintTopCanvas: arrowTop,
        hiddenEdgeStrokeBottomCanvas: edgeY + width / 2,
        clearanceCanvasPx: clearance,
        clearanceAt300Px: clearance * 300 / 480,
        positiveFilledIntersection: clearance <= 0,
      },
    }
  }, fs.readFileSync(oldFile, 'utf8'))
  await page.screenshot({ path: screenshot, animations: 'disabled' })
  fs.writeFileSync(path.join(out, 'display-measurements.json'), `${JSON.stringify({
    cwd: root, figure: 'fig-g10-02', headed: false,
    limitation: 'Offline author screenshot, not independent review or live-product acceptance.',
    style: 'Existing approved width300 presentation reused exactly; fig01 omitted and not rerendered.',
    rendererCalls: 0, newScreenshots: 1, priorSvgParsedAsXmlOnly: true,
    candidate: { path: svgFile, sha256: hash(svgFile) },
    screenshot: { path: screenshot, sha256: hash(screenshot) },
    measurements,
  }, null, 2)}\n`, { flag: 'wx' })
  assert.equal(measurements.width, 300)
  assert.equal(measurements.height, 250)
  assert.ok(measurements.labels.every(label => label.fontPx === 28 && label.actualPx === 17.5))
  assert.equal(measurements.collision.arrowheadPath, 'M 0,0 L 10,5 L 0,10 z')
  assert.equal(measurements.collision.hiddenEdge.y1, 217)
  assert.equal(measurements.collision.hiddenEdge.y2, 217)
  assert.equal(measurements.collision.hiddenEdge.dashArray, '5,5')
  assert.ok(measurements.collision.clearanceCanvasPx > 15)
  assert.equal(measurements.collision.positiveFilledIntersection, false)
  assert.deepEqual(measurements.unchangedGeometryAndOtherLabelCheck.changed.sort(), [
    'head:ld-fig-g10-02_ld-vector-mark-box-k-label',
    'id:ld-fig-g10-02_ld-vector-mark-box-k-label',
    'label:box-k-label',
  ].sort())
  console.log(JSON.stringify({ status: 'author-measurement-pass-only', ...measurements }))
} finally {
  await browser.close()
}
