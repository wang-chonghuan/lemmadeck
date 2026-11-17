import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const work = path.dirname(fileURLToPath(import.meta.url))
const require = createRequire(path.join(root, '.agents/skills/package.json'))
const { chromium } = require('playwright-core')
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const binding = p => ({ path: p, sha256: hash(p) })
const context = read(path.join(work, 'context.zh-en.json'))
const layout = read(path.join(work, 'layout-decisions.json'))
const science = read(path.join(work, 'science-gate.json'))
for (const b of [science.effectiveSCI, science.correctedFreeze, science.chinese, science.english]) assert.equal(hash(b.path), b.sha256)
assert.equal(read(science.effectiveSCI.path).status, 'PASS')
const expectedLabels = {
  'fig-224': ['n', 'p'],
  'fig-225': ['n', 'p', 'A', 'V', '-', '+'],
  'fig-226': ['I', 'V', '0', 'a', 'I', 'V', '0', 'b', '-V', 'I', 'V', '0', 'c', '-V'],
}
const report = {
  schema: 'ld-s10y-image/bounded-author-output-check@1',
  status: 'pass',
  independentReview: false,
  scope: 'Author-only exact SVG structural assertions and browser media measurements. Not headed product/offline-lesson acceptance or promotion.',
  fullContext: binding(path.join(work, 'context.zh-en.json')),
  layout: binding(path.join(work, 'layout-decisions.json')),
  effectiveSCI: science.effectiveSCI,
  figures: [],
}
const browser = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
})
try {
  for (const id of ['fig-224', 'fig-225', 'fig-226']) {
    const directory = path.join(work, id, 'initial')
    const spec = read(path.join(directory, 'spec.json'))
    const native = read(path.join(directory, `${id}.render.json`))
    assert.equal(native.status, 'pass')
    assert.equal(hash(path.join(directory, 'spec.json')), native.spec.sha256)
    assert.equal(hash(path.join(directory, `${id}.svg`)), native.output.svg.sha256)
    assert.deepEqual(spec.source.authoritativeText, [
      { lesson: context.lesson, text: context.currentChinese.printedTitle },
      ...context.currentChinese.prose.filter(b => b.text?.trim()).map(b => ({ lesson: context.lesson, text: b.text })),
    ])
    assert.deepEqual(spec.objects.filter(o => o.type === 'text').map(o => o.text), expectedLabels[id])
    assert(spec.objects.every(o => !o.stroke || o.stroke === 'ink'))
    assert(spec.objects.every(o => !o.fill || ['ink', 'paper'].includes(o.fill)))
    assert.equal(spec.objects.filter(o => o.type === 'grid' || o.type === 'axis').length, 0)
    const semanticEdges = spec.objects.filter(o => o.type === 'segment' || o.type === 'arrow')
    for (const edge of semanticEdges) {
      const assertion = spec.assertions.find(a => a.type === 'connects' && a.arrow === edge.id)
      assert(assertion, `Missing connects: ${id}/${edge.id}`)
      assert.deepEqual(assertion.from, edge.from)
      assert.deepEqual(assertion.to, edge.to)
    }
    const semantic = { edgeAssertions: semanticEdges.length, labels: expectedLabels[id], sourceAndContextHashesCurrent: true }
    if (id === 'fig-225') {
      assert.deepEqual(spec.objects.filter(o => o.type === 'point' && o.visible !== false).map(o => o.id),
        ['left-junction', 'right-junction', 'lower-right-junction'])
      assert.deepEqual(spec.objects.filter(o => o.type === 'circle').map(o => o.id),
        ['ammeter-circle', 'voltmeter-circle', 'negative-terminal-circle', 'positive-terminal-circle'])
      assert.deepEqual(spec.objects.filter(o => o.type === 'polygon').map(o => o.id), ['sample-frame', 'resistor-frame'])
      assert.equal(layout.circuitWires.length, 17)
      for (const expected of layout.circuitWires) {
        const actual = spec.objects.find(o => o.id === expected.id)
        assert.equal(actual.from, expected.from)
        assert.equal(actual.to, expected.to)
        assert.equal(actual.type, expected.arrow ? 'arrow' : 'segment')
      }
      const wiper = spec.objects.find(o => o.id === 'wiper-arrow')
      assert.deepEqual(layout.circuitNodes[wiper.to], [300, 265])
      assert(layout.circuitNodes[wiper.from][1] > layout.circuitNodes[wiper.to][1])
      const fixedWireGraph = new Map()
      for (const w of layout.circuitWires) {
        for (const [from, to] of [[w.from, w.to], [w.to, w.from]]) {
          if (!fixedWireGraph.has(from)) fixedWireGraph.set(from, new Set())
          fixedWireGraph.get(from).add(to)
        }
      }
      const reachable = start => {
        const seen = new Set([start])
        const pending = [start]
        while (pending.length) for (const next of fixedWireGraph.get(pending.pop()) || []) if (!seen.has(next)) {
          seen.add(next)
          pending.push(next)
        }
        return seen
      }
      assert(reachable('sample-left-contact').has('wiper-contact'))
      assert(!reachable('sample-left-contact').has('resistor-left-contact'))
      assert(reachable('sample-right-contact').has('ammeter-top-contact'))
      assert(reachable('ammeter-bottom-contact').has('resistor-right-contact'))
      assert(reachable('ammeter-bottom-contact').has('positive-terminal-contact'))
      assert(reachable('resistor-left-contact').has('negative-terminal-contact'))
      assert(!reachable('negative-terminal-contact').has('positive-terminal-contact'))
      semantic.circuit = {
        visibleJunctions: 3,
        meters: 2,
        hollowTerminals: 2,
        semanticWiresAndWiper: 17,
        downwardWiperContactsResistorTop: true,
        sampleLeftReachesWiperNotFixedLeftLead: true,
        seriesMeterAndRightTrunkTopology: true,
        signedTerminalsNotWireJoined: true,
        batteryPlatesAdded: false,
        regionChargeSignsAdded: false,
        nativeObjectCountsCountAllConstructionPointsAndAllCircles: true,
        specificSourceCountsVerifiedSeparatelyHere: true,
      }
    }
    if (id === 'fig-226') {
      const curves = spec.objects.filter(o => o.type === 'svgPath')
      assert.equal(curves.length, 4)
      for (const expected of layout.graphCurves) {
        const curve = curves.find(o => o.id === expected.id)
        assert.equal(curve.d, expected.d)
        assert.equal(curve.dash, 0)
        const coordinates = curve.d.match(/-?\d+(?:\.\d+)?/g).map(Number)
        assert.equal(coordinates.length, 8)
        assert.deepEqual(coordinates.slice(0, 2), expected.start)
        assert.deepEqual(coordinates.slice(-2), expected.end)
        for (let i = 0; i < coordinates.length; i += 2) {
          assert(coordinates[i] >= 0 && coordinates[i] <= spec.canvas.width)
          assert(coordinates[i + 1] >= 0 && coordinates[i + 1] <= spec.canvas.height)
        }
      }
      assert.deepEqual(layout.graphCurves[2].end, layout.graphCurves[3].start)
      semantic.graphs = {
        horizontalPanels: 3,
        currentAndVoltageArrows: 6,
        finiteSolidBranches: 4,
        sharedOriginJoinInPanelC: true,
        reverseBranchOnlyInPanelB: true,
        forwardBranchOnlyInPanelA: true,
        ticksGridDataDotsOrMeasurementValuesAdded: false,
        reverseBreakdownExtensionAdded: false,
        zeroIsModernOriginConventionNotLiteralSourceCertification: true,
        smoothingIsModernQualitativeRegularization: true,
      }
    }
    const svg = fs.readFileSync(path.join(directory, `${id}.svg`), 'utf8')
    const page = await browser.newPage()
    const measurements = []
    const widths = spec.display.widths
    for (const mediaWidth of widths) {
      const viewportWidth = spec.display.layout === 'scroll' ? 342 : mediaWidth
      await page.setViewportSize({ width: viewportWidth, height: 1000 })
      await page.setContent(`<!doctype html><style>
        :root{--ld-figure-ink:#111111;--ld-figure-paper:#ffffff}
        html,body{margin:0;padding:0;background:white}
        #host{width:${viewportWidth}px;overflow-x:auto}
        #host svg{display:block;width:${mediaWidth}px;height:auto;max-width:none}
      </style><div id="host">${svg}</div>`)
      const measured = await page.evaluate(() => {
        const host = document.getElementById('host')
        const svg = host.querySelector('svg')
        const labels = [...svg.querySelectorAll('text')].map(node => {
          const matrix = node.getScreenCTM()
          const rect = node.getBoundingClientRect()
          return { text: node.textContent, px: parseFloat(node.getAttribute('font-size')) * Math.hypot(matrix.a, matrix.b), box: { x: rect.x, y: rect.y, width: rect.width, height: rect.height } }
        })
        host.scrollLeft = host.scrollWidth
        const maxScroll = host.scrollWidth - host.clientWidth
        const reachedEnd = Math.abs(host.scrollLeft - maxScroll) < 1
        host.scrollLeft = 0
        const canvas = document.createElement('canvas')
        canvas.width = 160
        canvas.height = Math.round(svg.getBoundingClientRect().height / svg.getBoundingClientRect().width * 160)
        return { actualMediaWidth: svg.getBoundingClientRect().width, viewportWidth: innerWidth, labels, minTextPx: Math.min(...labels.map(l => l.px)), maxScroll, reachedEnd }
      })
      assert.equal(measured.actualMediaWidth, mediaWidth)
      assert.equal(measured.labels.length, expectedLabels[id].length)
      assert(measured.minTextPx >= 16)
      assert(measured.reachedEnd)
      if (spec.display.layout === 'scroll') assert(measured.maxScroll > 0)
      measurements.push({ width: mediaWidth, ...measured, status: 'pass' })
      if (id === 'fig-226' && mediaWidth === 640) {
        await page.setViewportSize({ width: 640, height: 280 })
        await page.locator('#host').evaluate(el => { el.style.width = '640px' })
        await page.screenshot({ path: path.join(directory, 'fig-226.at640.preview.png'), animations: 'disabled' })
      }
    }
    const pixels = await page.evaluate(async () => {
      const svg = document.querySelector('svg')
      const data = new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml' })
      const image = new Image()
      const url = URL.createObjectURL(data)
      try {
        await new Promise((resolve, reject) => { image.onload = resolve; image.onerror = reject; image.src = url })
        const canvas = document.createElement('canvas')
        canvas.width = 640
        canvas.height = Math.round(Number(svg.getAttribute('height')) / Number(svg.getAttribute('width')) * 640)
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
        const rgba = ctx.getImageData(0, 0, canvas.width, canvas.height).data
        let dark = 0
        for (let i = 0; i < rgba.length; i += 4) if (rgba[i] + rgba[i + 1] + rgba[i + 2] < 600) dark++
        return { width: canvas.width, height: canvas.height, darkPixels: dark, totalPixels: canvas.width * canvas.height }
      } finally { URL.revokeObjectURL(url) }
    })
    assert(pixels.darkPixels > 100)
    assert(pixels.darkPixels / pixels.totalPixels < 0.3)
    report.figures.push({
      id,
      spec: binding(path.join(directory, 'spec.json')),
      svg: binding(path.join(directory, `${id}.svg`)),
      render: binding(path.join(directory, `${id}.render.json`)),
      semantic,
      actualMediaMeasurements: measurements,
      nonblankCanvasPixelCheck: { ...pixels, status: 'pass' },
    })
    await page.close()
  }
} catch (error) {
  report.status = 'fail'
  report.failure = error.stack
  process.exitCode = 1
} finally {
  await browser.close()
  fs.writeFileSync(path.join(work, 'author-output-check.json'), JSON.stringify(report, null, 2) + '\n', { flag: 'wx' })
}
console.log(JSON.stringify(report, null, 2))
