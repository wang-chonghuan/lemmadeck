import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const W = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const G = path.dirname(fileURLToPath(import.meta.url))
const stage = `${G}/initial`
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: sha(file) })
function write(file, data) {
  assert(path.resolve(file).startsWith(`${G}/`))
  assert(!fs.existsSync(file), `Retain evidence: ${file}`)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`)
}
const spec = read(`${stage}/fig-302.spec.json`)
const report = read(`${stage}/fig-302.render.json`)
assert.equal(report.status, 'pass')
assert.equal(report.spec.sha256, sha(`${stage}/fig-302.spec.json`))
assert.equal(report.output.svg.sha256, sha(`${stage}/fig-302.svg`))
assert.equal(report.spec.path, 'fig-302.spec.json')
assert.equal(report.output.svg.path, 'fig-302.svg')
const definitions = new Map(spec.objects.map(object => [object.id, object]))
const at = id => definitions.get(id).at
const geometry = read(`${G}/context/geometry-definition.json`)
const relations = spec.assertions.filter(item => item.type === 'connects')
const drawing = spec.objects.filter(object => ['segment', 'arrow'].includes(object.type))
assert(drawing.every(object => relations.some(item => item.arrow === object.id
  && item.from === object.from && item.to === object.to)))
assert(!spec.objects.some(object => ['svgPath', 'grid', 'image', 'measure'].includes(object.type)))
const symmetry = spec.assertions.find(item => item.id === 'loop-every-defining-vertex-central-symmetry')
const definingLoopVertices = new Set([...geometry.upper, ...geometry.lower])
const symmetryVertices = new Set(symmetry.pairs.flatMap(pair => [pair.a, pair.b]))
assert.deepEqual(symmetryVertices, definingLoopVertices)
for (const pair of symmetry.pairs) {
  assert(Math.abs(at(pair.a)[0] + at(pair.b)[0]) < 1e-8)
  assert(Math.abs(at(pair.a)[1] + at(pair.b)[1]) < 1e-8)
}
for (const [sequence, sign] of [[geometry.upper, -1], [geometry.lower, 1], [geometry.initial, 1]]) {
  for (let index = 1; index < sequence.length; index += 1) {
    assert(sign * (at(sequence[index])[0] - at(sequence[index - 1])[0]) > 0)
    assert(sign * (at(sequence[index])[1] - at(sequence[index - 1])[1]) >= 0)
  }
}
assert.equal(geometry.initial[0], 'source-o')
assert.equal(geometry.initial.at(-1), 'source-a')
assert.equal(geometry.upper[0], geometry.lower.at(-1))
assert.equal(geometry.upper.at(-1), geometry.lower[0])
assert(at('source-b')[1] > 0 && at('source-b-prime')[1] < 0)
assert(at('source-c')[0] < 0 && at('source-c-prime')[0] > 0)
assert.equal(at('source-b')[0], 0)
assert.equal(at('source-b-prime')[0], 0)
assert.equal(at('source-c')[1], 0)
assert.equal(at('source-c-prime')[1], 0)
const arrowSigns = [
  ['source-upper-leftward-arrow', -1, -1],
  ['source-left-downward-arrow', -1, -1],
  ['source-lower-rightward-arrow', 1, 1],
  ['source-right-upward-arrow', 1, 1],
  ['source-initial-upward-rightward-arrow', 1, 1],
]
for (const [id, xSign, ySign] of arrowSigns) {
  const object = definitions.get(id)
  assert((at(object.to)[0] - at(object.from)[0]) * xSign > 0)
  assert((at(object.to)[1] - at(object.from)[1]) * ySign > 0)
}
const labels = spec.objects.filter(object => object.type === 'text')
assert.deepEqual(labels.map(object => object.text),
  ['I', 'B', '0', 'o', 'a', 'a\u2032', 'b', 'b\u2032', 'c', 'c\u2032'])
const authoritativeText = ['zh', 'en'].flatMap(language => {
  const lesson = read(`${G}/context/${language}/lesson.template.json`)
  return [{ lesson: 'phy9-c2-s7-n134', text: lesson.printed_title },
    ...lesson.prose.filter(item => item.text?.trim())
      .map(item => ({ lesson: 'phy9-c2-s7-n134', text: item.text }))]
})
assert.deepEqual(spec.source.authoritativeText, authoritativeText)
write(`${G}/receipts/geometry-coverage.json`, {
  status: 'pass', spec: bind(`${stage}/fig-302.spec.json`),
  allNativeEdgesAndArrowsHaveConnects: true,
  semanticEdgeCount: drawing.length,
  everyLoopVertexCoveredByCentralSymmetry: true,
  loopVertexCount: definingLoopVertices.size,
  symmetryPairCount: symmetry.pairs.length,
  sharedOriginAndAxisCrossings: true,
  positiveNegativeRemanenceAndCoerciveSigns: true,
  closedDirectedLoop: ['a', 'b', 'c', 'a-prime', 'b-prime', 'c-prime', 'a'],
  initialBranch: ['o', 'a'],
  sourceArrowDirections: arrowSigns.map(item => item[0]),
  nativeVectorSymbols: labels.map(object => object.text),
  noOpaquePathsOrMeasuredScale: true,
  completeCurrentBilingualTextBound: true,
  caveat: 'Checks enforce the inspected source relationships in an uncalibrated schematic, not a measured material law.',
})

const require = createRequire(`${W}/.agents/skills/package.json`)
const { chromium } = require('playwright-core')
const executablePath = [chromium.executablePath(),
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find(file => fs.existsSync(file))
assert(executablePath)
const svg = fs.readFileSync(`${stage}/fig-302.svg`, 'utf8')
const browser = await chromium.launch({ executablePath, headless: false })
const observations = []
try {
  for (const [width, viewport] of [
    [316, { width: 348, height: 600 }],
    [640, { width: 1440, height: 900 }],
  ]) {
    const page = await browser.newPage({ viewport, deviceScaleFactor: 1 })
    const pageErrors = []
    const networkRequests = []
    page.on('pageerror', error => pageErrors.push(String(error)))
    page.on('request', request => {
      if (/^https?:/.test(request.url())) networkRequests.push(request.url())
    })
    await page.setContent(`<!doctype html><meta charset="utf-8"><style>
      :root{--ld-figure-ink:#15201f;--ld-figure-muted:#4c5a58;
        --ld-figure-accent:#15201f;--ld-figure-accent-soft:#8a9795;
        --ld-figure-grid:#e3eae9;--ld-figure-paper:#ffffff}
      html,body{margin:0;background:white}body{padding:16px}
      .figure-media{width:100%;max-width:640px}
      .figure-media>svg{display:block;width:100%;height:auto}
      </style><div class="figure-media">${svg}</div>`)
    await page.evaluate(() => document.fonts.ready)
    const observed = await page.locator('.figure-media').evaluate(host => {
      const svg = host.querySelector('svg')
      const rect = svg.getBoundingClientRect()
      const texts = [...svg.querySelectorAll('text')].map(node => {
        const matrix = node.getScreenCTM()
        const box = node.getBoundingClientRect()
        return {
          id: node.getAttribute('data-label-id'), text: node.textContent,
          fontPx: Number.parseFloat(getComputedStyle(node).fontSize) * Math.hypot(matrix.a, matrix.b),
          x: box.x, y: box.y, width: box.width, height: box.height,
          inside: box.left >= rect.left && box.right <= rect.right
            && box.top >= rect.top && box.bottom <= rect.bottom,
        }
      })
      const geometry = [...svg.querySelectorAll('path,polygon,line,polyline,circle')]
        .filter(node => !node.closest('defs') && getComputedStyle(node).display !== 'none')
      return {
        mediaWidth: host.getBoundingClientRect().width, svgWidth: rect.width, height: rect.height,
        texts, minTextPx: Math.min(...texts.map(item => item.fontPx)),
        forbiddenText: texts.some(item => /[\u0400-\u04ff\u4e00-\u9fff]/.test(item.text)),
        foreignObjects: svg.querySelectorAll('foreignObject').length,
        geometryCount: geometry.length,
        horizontalOverflow: host.scrollWidth > host.clientWidth,
      }
    })
    assert(Math.abs(observed.mediaWidth - width) < 0.01)
    assert(Math.abs(observed.svgWidth - width) < 0.01)
    assert.equal(observed.height / width, 0.75)
    assert.equal(observed.texts.length, 10)
    assert(observed.texts.every(text => text.fontPx >= 16 && text.inside))
    assert(!observed.forbiddenText && !observed.horizontalOverflow && !observed.foreignObjects)
    assert(observed.geometryCount > 100)
    const base = observed.texts.find(text => text.text === 'B')
    const zero = observed.texts.find(text => text.text === '0')
    assert(zero.x > base.x && zero.y > base.y)
    assert.equal(pageErrors.length, 0)
    assert.equal(networkRequests.length, 0)
    const screenshot = `${G}/screenshots/inline-${width}.png`
    fs.mkdirSync(path.dirname(screenshot), { recursive: true })
    assert(!fs.existsSync(screenshot))
    await page.locator('.figure-media').screenshot({ path: screenshot, animations: 'disabled' })
    observations.push({ width, viewport, observed, screenshot: bind(screenshot),
      pageErrors, networkRequests })
    await page.close()
  }
} finally {
  await browser.close()
}
assert.equal(sha(`${stage}/fig-302.svg`), report.output.svg.sha256)
write(`${G}/receipts/actual-display-widths.json`, {
  status: 'pass', browser: { headed: true, executablePath },
  surface: 'Isolated unchanged native SVG at inline media widths; no app or canonical lesson was opened.',
  mediaWidthContract: '348px viewport minus 16px side padding yields actual 316px media; 1440px viewport uses the 640px inline maximum.',
  spec: bind(`${stage}/fig-302.spec.json`), svg: bind(`${stage}/fig-302.svg`),
  observations, sourceImageReopened: false, nativeRenderInvocations: 1,
})
console.log(JSON.stringify({ status: 'geometry-and-actual-display-pass',
  screenshots: observations.map(item => item.screenshot.path) }))
