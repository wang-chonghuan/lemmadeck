import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import { G, W, bind, read, sha, write } from './author.mjs'

const stage = `${G}/repair`
const spec = read(`${stage}/fig-72.spec.json`)
const report = read(`${stage}/fig-72.render.json`)
assert.equal(report.status, 'pass')
assert.equal(report.spec.sha256, sha(`${stage}/fig-72.spec.json`))
assert.equal(report.output.svg.sha256, sha(`${stage}/fig-72.svg`))
const definitions = new Map(spec.objects.map(item => [item.id, item]))
const at = id => definitions.get(id).at
const geometry = read(`${G}/geometry-definition.json`)
const source = read(`${G}/source-inventory.json`)
const inputs = read(`${G}/inputs/input-bindings.json`)
for (const record of inputs.contexts) {
  assert.equal(sha(record.original.path), record.original.sha256)
  assert.equal(sha(record.frozen.path), record.original.sha256)
}
for (const record of inputs.contracts) assert.equal(sha(record.path), record.sha256)
assert.equal(sha(inputs.source.path), inputs.source.sha256)
const assertions = new Map(spec.assertions.map(item => [item.id, item]))
const edges = spec.objects.filter(item => ['segment', 'arrow'].includes(item.type))
for (const edge of edges) {
  const connection = assertions.get(`${edge.id}-connects`)
  assert.equal(connection.type, 'connects')
  assert.equal(connection.arrow, edge.id)
  assert.equal(connection.from, edge.from)
  assert.equal(connection.to, edge.to)
}
assert.equal(geometry.nativeDefinitions.length, source.counts.curveDefiningAnchors)
for (const curve of source.curves) {
  assert.deepEqual(geometry.nativeDefinitions.filter(item => item.curve === curve.id)
    .map(item => item.sourceAnchor).sort(), curve.definingAnchors.map(item => item.id).sort())
}
const { period: L, amplitude: A, rightShift: D, sharedPlottedInterval: [start, end] } = geometry.schematic
const [earlier, later] = geometry.waves
const near = (a, b) => assert(Math.abs(a - b) < 1e-8, `${a} != ${b}`)
for (const wave of geometry.waves) {
  assert.equal(at(wave.sequence[0])[0], start)
  assert.equal(at(wave.sequence.at(-1))[0], end)
  assert.equal(wave.edges.length, wave.sequence.length - 1)
  for (let index = 0; index < wave.sequence.length; index += 1) {
    const coordinates = at(wave.sequence[index])
    near(coordinates[1], A * Math.sin(2 * Math.PI * (coordinates[0] - wave.shift) / L))
    if (index) assert(coordinates[0] > at(wave.sequence[index - 1])[0])
    if (index < wave.edges.length) {
      assert.equal(definitions.get(wave.edges[index]).from, wave.sequence[index])
      assert.equal(definitions.get(wave.edges[index]).to, wave.sequence[index + 1])
    }
  }
  const crests = wave.landmarkIds.filter(id => id.includes('-crest-'))
  const troughs = wave.landmarkIds.filter(id => id.includes('-trough-'))
  assert.equal(crests.length, 3)
  assert.equal(troughs.length, 2)
  crests.forEach(id => near(at(id)[1], A))
  troughs.forEach(id => near(at(id)[1], -A))
  near(at(crests[1])[0] - at(crests[0])[0], L)
  near(at(crests[2])[0] - at(crests[1])[0], L)
}
assert.equal(earlier.sequence[0], 'source-o')
assert.deepEqual(at('source-o'), [0, 0])
assert(at(earlier.sequence[1])[1] > 0)
assert(at(later.sequence[0])[1] < 0)
assert(geometry.translated.length > 240)
for (const pair of geometry.translated) {
  near(at(pair.later)[0] - at(pair.earlier)[0], D)
  near(at(pair.later)[1], at(pair.earlier)[1])
  assert.equal(assertions.get(pair.assertion).dx, D)
  assert.equal(assertions.get(pair.assertion).dy, 0)
}
const expectedCommonSamples = Object.keys(earlier.qIds).filter(q => later.qIds[q]).length
assert.equal(geometry.translated.length, expectedCommonSamples)
assert.equal(earlier.intersectionIds.length, 5)
assert.equal(later.intersectionIds.length, 5)
for (let index = 0; index < 5; index += 1) {
  const a = at(earlier.intersectionIds[index])
  const b = at(later.intersectionIds[index])
  near(a[0], b[0])
  near(a[1], b[1])
  assert(a[1] * (index % 2 ? -1 : 1) > 0)
}
for (const id of ['source-wavelength-span', 'source-shift-span']) {
  assert.equal(assertions.get(id).dy, 0)
  assert.equal(assertions.get(id).dx, id.includes('wavelength') ? L : D)
}
assert.equal(assertions.get('source-v-direction-right').dy, 0)
assert(assertions.get('source-v-direction-right').dx > 0)
assert(assertions.get('source-t-leader-up-right').dx > 0)
assert(assertions.get('source-t-leader-up-right').dy > 0)
assert(assertions.get('source-later-leader-up-left').dx < 0)
assert(assertions.get('source-later-leader-up-left').dy > 0)
assert(earlier.sequence.includes(definitions.get('source-t-leader').to))
assert(later.sequence.includes(definitions.get('source-later-leader').to))
const labels = spec.objects.filter(item => item.type === 'text').map(item => item.text)
assert.deepEqual(labels, ['x', 's', 'O', '\u03bb', '\u0394s = v\u00b7\u0394t', 'v', 't', 't + \u0394t'])
assert(!labels.some(text => /[0-9\u0400-\u04ff\u4e00-\u9fff]/.test(text)))
assert(!spec.objects.some(item => ['axis', 'grid', 'svgPath', 'image'].includes(item.type)))
assert(geometry.waves.every(wave => wave.edges.every(id => definitions.get(id).dash === 0)))
assert.equal(spec.objects.filter(item => item.type === 'arrow').length, 10)
const gates = {
  sourceHashDimensionsAndFullFrozenText: 'pass',
  everySourceDefiningCoordinateRecordedBeforeInterpolation: 'pass',
  nativeConnectionsAndContinuousWaveChains: 'pass',
  earlierCurveThroughORising: 'pass',
  laterCurveBelowOAtOrigin: 'pass',
  equalAmplitudeAndPeriod: 'pass',
  exactRightwardPhaseTranslationEveryCommonSample: 'pass',
  fiveAlternatingCurveIntersections: 'pass',
  sourceCurveDistinctionBothSolidCorrectLeaders: 'pass',
  wavelengthNearestSamePhaseCrests: 'pass',
  shiftSpanCorrespondingThirdCrests: 'pass',
  rightwardVelocityAndVectorAccent: 'pass',
  finiteSourceEndpointsNoExtension: 'pass',
  literalGlyphsNoNumericScaleOrAnswers: 'pass',
}
write(`${G}/receipts/mathematical-gates.json`, {
  status: 'pass', classification: 'Executable author mathematical gates, not independent scientific review.',
  spec: bind(`${stage}/fig-72.spec.json`), sourceInventory: bind(`${G}/source-inventory.json`),
  geometryDefinition: bind(`${G}/geometry-definition.json`), gates,
  nativeConnections: edges.length,
  nativeAssertions: spec.assertions.length,
  nativeSourceGroups: spec.source.inventory.length,
  sourceDefiningAnchors: geometry.nativeDefinitions.length,
  nativeCurveVertices: geometry.waves.map(wave => ({ curve: wave.role, vertices: wave.sequence.length, segments: wave.edges.length })),
  phaseTranslatedCommonSamples: geometry.translated.length,
  sourceCurveIntersections: 5,
  caveat: 'Uncalibrated regularization, not measured amplitude, wavelength, shift, or a numerical phase/time answer. SCI pending.',
})

const require = createRequire(`${W}/.agents/skills/package.json`)
const { chromium } = require('playwright-core')
const executablePath = [chromium.executablePath(),
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find(file => fs.existsSync(file))
assert(executablePath)
const svg = fs.readFileSync(`${stage}/fig-72.svg`, 'utf8')
const browser = await chromium.launch({ executablePath, headless: false })
const previews = []
try {
  for (const viewport of [{ width: 1440, height: 960 }, { width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewport, deviceScaleFactor: 1 })
    const pageErrors = []
    const requests = []
    page.on('pageerror', error => pageErrors.push(String(error)))
    page.on('request', request => {
      if (/^https?:/.test(request.url())) requests.push(request.url())
    })
    await page.setContent(`<!doctype html><meta charset="utf-8"><style>
      :root{--ld-figure-ink:#15201f;--ld-figure-muted:#4c5a58;
      --ld-figure-accent:#15201f;--ld-figure-accent-soft:#8a9795;
      --ld-figure-grid:#e3eae9;--ld-figure-paper:#ffffff}
      html,body{margin:0;background:white}body{padding:24px 37px}
      .figure-scroll{width:min(640px,100%);overflow-x:auto}
      .figure-media{width:640px;min-width:640px}
      .figure-media>svg{display:block;width:640px;height:auto}
      </style><div class="figure-scroll" data-testid="figure-scroll"><div class="figure-media">${svg}</div></div>`)
    await page.evaluate(() => document.fonts.ready)
    const observed = await page.locator('.figure-scroll').evaluate(host => {
      const svg = host.querySelector('svg')
      const rect = svg.getBoundingClientRect()
      const text = [...svg.querySelectorAll('text')].map(node => {
        const matrix = node.getScreenCTM()
        const box = node.getBoundingClientRect()
        return { text: node.textContent,
          fontPx: Number.parseFloat(getComputedStyle(node).fontSize) * Math.hypot(matrix.a, matrix.b),
          inside: box.left >= rect.left && box.right <= rect.right
            && box.top >= rect.top && box.bottom <= rect.bottom }
      })
      return { containerWidth: host.clientWidth, scrollWidth: host.scrollWidth,
        mediaWidth: rect.width, mediaHeight: rect.height, text,
        minTextPx: Math.min(...text.map(item => item.fontPx)),
        foreignObjects: svg.querySelectorAll('foreignObject').length }
    })
    assert.equal(observed.mediaWidth, 640)
    assert.equal(observed.mediaHeight, 360)
    assert.equal(observed.minTextPx, 20)
    assert(observed.text.every(item => item.inside && item.fontPx >= 16))
    assert.deepEqual(observed.text.map(item => item.text), labels)
    assert.equal(observed.foreignObjects, 0)
    const expectedContainerWidth = viewport.width === 390 ? 316 : 640
    assert.equal(observed.containerWidth, expectedContainerWidth)
    assert.equal(observed.scrollWidth, 640)
    const screenshot = `${G}/previews/${viewport.width === 390 ? 'mobile-start-390' : 'media-640'}.png`
    fs.mkdirSync(`${G}/previews`, { recursive: true })
    assert(!fs.existsSync(screenshot))
    if (viewport.width === 390) await page.screenshot({ path: screenshot })
    else await page.locator('.figure-media').screenshot({ path: screenshot })
    let scrollEnd = null
    let endScreenshot = null
    if (viewport.width === 390) {
      scrollEnd = await page.locator('.figure-scroll').evaluate(host => {
        host.scrollLeft = host.scrollWidth
        return { scrollLeft: host.scrollLeft, maxScrollLeft: host.scrollWidth - host.clientWidth }
      })
      assert.equal(scrollEnd.scrollLeft, 324)
      assert.equal(scrollEnd.scrollLeft, scrollEnd.maxScrollLeft)
      endScreenshot = `${G}/previews/mobile-end-390.png`
      assert(!fs.existsSync(endScreenshot))
      await page.screenshot({ path: endScreenshot })
    }
    assert.equal(pageErrors.length, 0)
    assert.equal(requests.length, 0)
    previews.push({ viewport, observed, scrollEnd, screenshot: bind(screenshot),
      endScreenshot: endScreenshot ? bind(endScreenshot) : null, pageErrors, networkRequests: requests })
    await page.close()
  }
} finally {
  await browser.close()
}
write(`${G}/receipts/actual-media-preview.json`, {
  status: 'pass', browser: { headed: true, executablePath },
  surface: 'Isolated native SVG, fixed 640px scroll media, 640px desktop container / 316px mobile container. Not the full card or app.',
  svg: bind(`${stage}/fig-72.svg`), declaredDisplay: spec.display, previews,
  actualMediaWidth: 640, minActualTextPx: 20, mobileScrollEndReachable: true,
  nativeRenderStatus: report.status, nativeCollisions: report.collisions,
  SCI: 'pending', independentReview: 'pending', fullCardAcceptance: 'not performed',
})
console.log(JSON.stringify({ status: 'author-math-and-actual-media-pass',
  gates, previews: previews.flatMap(item => [item.screenshot, item.endScreenshot].filter(Boolean)) }))
