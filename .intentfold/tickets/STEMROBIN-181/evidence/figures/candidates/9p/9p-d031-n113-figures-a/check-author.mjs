import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const own = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(own, '../../..')
const require = createRequire(path.join(repo, 'app/package.json'))
const { chromium } = require('playwright')
const [id, attempt = 'initial'] = process.argv.slice(2)
assert.ok(['fig-229', 'fig-230'].includes(id))
assert.ok(['initial', 'repair-1'].includes(attempt))
const out = path.join(own, id, attempt)
const candidate = path.join(own, id, 'initial')
fs.mkdirSync(out, { recursive: true })
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: path.resolve(file), sha256: hash(file), bytes: fs.statSync(file).size })
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const write = (name, value) => fs.writeFileSync(path.join(out, name), `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
const specFile = path.join(candidate, 'spec.json'), renderFile = path.join(candidate, 'render.json')
const svgFile = path.join(candidate, `${id}.svg`), geometryFile = path.join(candidate, 'geometry.json')
const spec = read(specFile), render = read(renderFile), geometry = read(geometryFile)
const objects = new Map(spec.objects.map(o => [o.id, o]))
const resolve = value => typeof value === 'string' ? objects.get(value).at : value
const key = value => JSON.stringify(resolve(value))
const cross = (a, b) => a[0] * b[1] - a[1] * b[0]
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]]
const onInterior = (p, a, b) => Math.abs(cross(sub(p, a), sub(b, a))) < 1e-6 &&
  sub(p, a)[0] * sub(p, b)[0] + sub(p, a)[1] * sub(p, b)[1] < -1e-6
const segments = geometry.wires.map(name => ({ id: name, a: resolve(objects.get(name).from), b: resolve(objects.get(name).to) }))
const roots = new Map(), adjacency = new Map(), edgeChecks = []
const root = value => {
  if (!roots.has(value)) roots.set(value, value)
  if (roots.get(value) !== value) roots.set(value, root(roots.get(value)))
  return roots.get(value)
}
try {
  assert.equal(render.status, 'pass')
  assert.equal(render.spec.sha256, hash(specFile))
  assert.equal(render.output.svg.sha256, hash(svgFile))
  assert.equal(spec.canvas.width, 640)
  assert.deepEqual(spec.display, { purpose: 'instructional', layout: 'scroll', minTextPx: 16, widths: [640] })
  assert.ok(spec.objects.filter(o => o.type === 'text').every(o => o.fontSize === 32 && /^[ -~]+$/.test(o.text)))
  assert.deepEqual(spec.objects.filter(o => o.type === 'text').map(o => o.text), geometry.expectedLabels)
  for (const edge of segments) {
    const o = objects.get(edge.id)
    const native = spec.assertions.find(a => a.type === 'connects' && a.arrow === edge.id)
    assert.ok(native, edge.id)
    assert.deepEqual(native.from, o.from)
    assert.deepEqual(native.to, o.to)
    assert.equal(o.type, 'segment')
    assert.equal(o.stroke, 'ink')
    assert.equal(o.dash || 0, 0)
    const a = key(o.from), b = key(o.to)
    assert.notEqual(a, b)
    roots.set(root(a), root(b))
    for (const [from, to] of [[a, b], [b, a]]) {
      if (!adjacency.has(from)) adjacency.set(from, new Set())
      adjacency.get(from).add(to)
    }
    edgeChecks.push({ id: edge.id, from: edge.a, to: edge.b, native: native.id, status: 'pass' })
  }
  const components = new Set([...roots.keys()].map(root))
  assert.equal(components.size, 3)
  assert.equal(segments.length - roots.size + components.size, 0)
  assert.ok([...adjacency.values()].every(a => a.size <= 2), 'Unexpected branch junction')
  for (const [a, b] of geometry.topology.componentPairs) assert.notEqual(root(key(a)), root(key(b)), `Component short: ${a}/${b}`)
  for (const [a, b] of geometry.topology.sequenceConnections) assert.equal(root(key(a)), root(key(b)), `Missing series connection: ${a}/${b}`)
  for (let i = 0; i < segments.length; i++) for (let j = i + 1; j < segments.length; j++) {
    const a = segments[i], b = segments[j]
    assert.ok(!onInterior(a.a, b.a, b.b) && !onInterior(a.b, b.a, b.b) &&
      !onInterior(b.a, a.a, a.b) && !onInterior(b.b, a.a, a.b), `Unsplit wire contact: ${a.id}/${b.id}`)
    const v = sub(a.b, a.a), w = sub(b.b, b.a), denominator = cross(v, w)
    if (Math.abs(denominator) < 1e-6) continue
    const t = cross(sub(b.a, a.a), w) / denominator
    const u = cross(sub(b.a, a.a), v) / denominator
    assert.ok(!(t > 1e-6 && t < 1 - 1e-6 && u > 1e-6 && u < 1 - 1e-6), `Unexpected wire crossing: ${a.id}/${b.id}`)
  }
  for (const [a, b] of geometry.topology.componentPairs) roots.set(root(key(a)), root(key(b)))
  assert.equal(new Set([...roots.keys()].map(root)).size, 1)
  assert.equal(segments.length + 3 - roots.size + 1, 1, 'Components complete exactly one series cycle')
  assert.equal(spec.objects.filter(o => o.type === 'arrow').length, 0)
  const info = geometry.specifics
  assert.equal(info.longPlates.length, info.visibleCellPairs)
  for (const [i, name] of info.longPlates.entries()) {
    const long = objects.get(name), short = objects.get(info.shortPlates[i])
    const a = resolve(long.from), b = resolve(long.to), c = resolve(short.from), d = resolve(short.to)
    assert.equal(a[0], b[0]); assert.equal(c[0], d[0])
    assert.ok(Math.abs(b[1] - a[1]) > Math.abs(d[1] - c[1]))
    assert.equal(Math.sign(a[0] - c[0]), info.plateOrientation === 'long-right' ? 1 : -1)
  }
  if (id === 'fig-229') {
    assert.equal(spec.mode, 'hybrid')
    assert.equal(render.output.artwork.sha256, hash(path.join(candidate, `${id}.artwork.png`)))
    assert.equal(render.imageFits.length, 1)
    assert.equal(render.imageFits[0].status, 'pass')
    assert.ok(info.burnerFitBoxScreen.y - info.thermistorBottomScreenY >= info.minimumBurnerSeparationPx)
    assert.ok(!geometry.wires.some(name => name.includes('burner')))
    const meta = read(spec.assets[0].metadata)
    assert.equal(meta.model, 'gpt-image-2')
    assert.equal(meta.request.n, 1)
    assert.equal(meta.references[0].sha256, spec.source.image.sha256)
    assert.equal(hash(meta.output.path), meta.output.sha256)
  } else {
    assert.equal(spec.mode, 'deterministic')
    assert.equal(spec.assets.length, 0)
    assert.equal(spec.objects.filter(o => o.type === 'image').length, 0)
    const a = resolve('needle-pivot'), b = resolve('needle-tip')
    assert.ok(b[0] < a[0] && b[1] > a[1], 'Low-side upper-left needle')
    assert.ok(Math.abs(Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI - 118) < 1e-6)
    assert.equal(spec.objects.filter(o => o.id.startsWith('dial-tick-')).length, 17)
    assert.equal(resolve('ammeter-right')[0] - resolve('ammeter-left')[0], 40)
    assert.ok(geometry.expectedLabels.every(t => !/\d/.test(t)), 'Do not fabricate scale readings')
  }
  write('author-assertions.json', {
    status: 'pass', scope: 'Author-only executable geometry checks; not independent FIG approval.',
    spec: bind(specFile), geometry: bind(geometryFile), edgeChecks,
    externalComponents: 3, externalCycleRank: 0, fullSeriesComponents: 1, fullSeriesCycleRank: 1,
    noShorts: true, noBranches: true, noUnintendedCrossings: true, currentOrLightArrows: 0,
    sourceCellOrientation: info.plateOrientation, sourceVisibleCellPairs: info.visibleCellPairs,
    specifics: info, modernAdditions: geometry.modernAdditions, unknownPixels: geometry.unknownPixels,
  })
} catch (error) {
  write('author-assertions.json', {
    status: 'fail', scope: 'Author-only executable checks', failure: error.message,
    stack: error.stack, spec: bind(specFile), geometry: bind(geometryFile), edgeChecks,
  })
  throw error
}

const helper = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/figure-preview.mjs')
const helperBinding = bind(helper)
const previewCommands = []
for (const [source, prefix] of [
  [svgFile, `${id}.overlay-normal`],
  [path.join(candidate, `${id}.native.png`), `${id}.normal-preview`],
]) {
  const args = [helper, source, path.join(out, prefix), '640']
  const result = spawnSync(process.execPath, args, { cwd: repo, encoding: 'utf8', timeout: 120000 })
  previewCommands.push({ command: [process.execPath, ...args], exitCode: result.status, stdout: result.stdout, stderr: result.stderr })
  assert.equal(result.status, 0, result.stdout + result.stderr)
}
write('preview-helper-command.json', { helper: helperBinding, commands: previewCommands })
const normalPath = path.join(out, `${id}.normal-preview-640.png`)
for (const source of [normalPath, path.join(candidate, `${id}.native.png`)]) {
  const b = fs.readFileSync(source)
  assert.equal(b.readUInt32BE(16), 640)
  assert.equal(b.readUInt32BE(20), spec.canvas.height)
}
const nativeHelper = path.join(repo, '.claude/skills/ld-s10y-lesson/tools/render_lesson.js')
const nativeBinding = bind(nativeHelper)
const cssMatch = fs.readFileSync(nativeHelper, 'utf8').match(/const CSS = `([\s\S]*?)`;/)
assert.ok(cssMatch)
const css = cssMatch[1].replace('${katexCss()}', '')
assert.match(css, /width:40em;max-width:none/)
const svg = fs.readFileSync(svgFile, 'utf8')
const artwork = id === 'fig-229'
  ? `<img alt="" class="artwork-layer" src="data:image/png;base64,${fs.readFileSync(path.join(candidate, `${id}.artwork.png`)).toString('base64')}">`
  : ''
const html = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}
.figure-media{position:relative}.artwork-layer{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;z-index:0}.figure-media>svg{position:relative;z-index:1}
</style><div class="sheet"><figure class="fig" id="${id}" data-figure-layout="scroll" data-figure-purpose="instructional"><div class="figure-media" data-figure-mode="${spec.mode}" data-figure-theme="neutral">${artwork}${svg}</div></figure></div>`
fs.writeFileSync(path.join(out, 'native-css-preview.html'), html, { flag: 'wx' })
const browser = await chromium.launch({ headless: false })
const measurements = []
try {
  for (const viewport of [{ width: 1440, height: 960 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport, deviceScaleFactor: 1 })
    try {
      const page = await context.newPage(), errors = []
      page.on('pageerror', e => errors.push(e.message))
      await page.setContent(html)
      await page.evaluate(() => document.fonts.ready)
      const metrics = await page.locator('svg').evaluate(async (svg, height) => {
        const rect = svg.getBoundingClientRect(), host = svg.closest('figure')
        const labels = [...svg.querySelectorAll('text')].map(text => {
          const matrix = text.getScreenCTM(), box = text.getBoundingClientRect()
          return { text: text.textContent,
            actualTextPx: Number.parseFloat(text.getAttribute('font-size')) * Math.hypot(matrix.a, matrix.b),
            box: { x: box.x - rect.x, y: box.y - rect.y, width: box.width, height: box.height } }
        })
        const overlaps = []
        labels.forEach((a, i) => labels.slice(i + 1).forEach(b => {
          if (Math.min(a.box.x + a.box.width, b.box.x + b.box.width) > Math.max(a.box.x, b.box.x) + 0.1 &&
            Math.min(a.box.y + a.box.height, b.box.y + b.box.height) > Math.max(a.box.y, b.box.y) + 0.1) overlaps.push([a.text, b.text])
        }))
        const outsideLabels = labels.filter(l => l.box.x < 0 || l.box.y < 0 || l.box.x + l.box.width > rect.width || l.box.y + l.box.height > rect.height)
        const maxScroll = host.scrollWidth - host.clientWidth
        host.scrollLeft = host.scrollWidth
        const reachedScrollEnd = Math.abs(host.scrollLeft - maxScroll) <= 1
        const layer = svg.parentElement.querySelector('.artwork-layer')
        if (layer) await layer.decode()
        const lr = layer?.getBoundingClientRect()
        const scrolledSvgRect = svg.getBoundingClientRect()
        const layerMetrics = layer ? {
          xOffset: lr.x - scrolledSvgRect.x, yOffset: lr.y - scrolledSvgRect.y, width: lr.width, height: lr.height,
          naturalWidth: layer.naturalWidth, naturalHeight: layer.naturalHeight,
        } : null
        const canvas = document.createElement('canvas')
        canvas.width = 640; canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = 'white'; ctx.fillRect(0, 0, 640, height)
        if (layer) ctx.drawImage(layer, 0, 0, 640, height)
        const image = new Image()
        image.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(new XMLSerializer().serializeToString(svg))))}`
        await image.decode(); ctx.drawImage(image, 0, 0, 640, height)
        const pixels = ctx.getImageData(0, 0, 640, height).data
        let darkPixels = 0, borderPixels = 0
        for (let y = 0; y < height; y++) for (let x = 0; x < 640; x++) {
          const i = (y * 640 + x) * 4
          if (pixels[i] < 190 && pixels[i + 1] < 190 && pixels[i + 2] < 190) {
            darkPixels++
            if (x < 2 || y < 2 || x >= 638 || y >= height - 2) borderPixels++
          }
        }
        return { actualMediaWidth: rect.width, actualMediaHeight: rect.height,
          containerWidth: host.clientWidth, maxScroll, reachedScrollEnd,
          minTextPx: Math.min(...labels.map(l => l.actualTextPx)),
          labels, overlaps, outsideLabels, layerMetrics, darkPixels, borderPixels }
      }, spec.canvas.height)
      const failures = []
      if (metrics.actualMediaWidth !== 640 || metrics.actualMediaHeight !== 520) failures.push('Wrong actual media dimensions')
      if (viewport.width === 390 && metrics.containerWidth !== 358) failures.push('Wrong actual mobile figure container')
      if (metrics.minTextPx !== 32) failures.push('Actual transformed label size is not 32px')
      if (metrics.overlaps.length || metrics.outsideLabels.length) failures.push('Label overlap or clipping')
      if (!metrics.reachedScrollEnd) failures.push('Unreachable horizontal scroll end')
      if (metrics.darkPixels < 500 || metrics.darkPixels > 640 * 520 * 0.25 || metrics.borderPixels) failures.push('Blank, black or clipped output')
      if (id === 'fig-229' && (!metrics.layerMetrics || metrics.layerMetrics.xOffset !== 0 || metrics.layerMetrics.yOffset !== 0 ||
        metrics.layerMetrics.width !== 640 || metrics.layerMetrics.height !== 520)) failures.push('Hybrid layer misalignment')
      if (errors.length) failures.push('Browser page errors')
      measurements.push({ viewport, status: failures.length ? 'fail' : 'pass', failures, metrics, pageErrors: errors })
    } finally { await context.close() }
  }
} finally { await browser.close() }
assert.equal(hash(helper), helperBinding.sha256, 'Preview helper changed during measurement')
assert.equal(hash(nativeHelper), nativeBinding.sha256, 'Native CSS helper changed during measurement')
const status = measurements.every(m => m.status === 'pass') ? 'pass' : 'fail'
write('width-preview-report.json', {
  status, scope: 'Headed author candidate preview using existing native lesson CSS; not running-app/card acceptance or independent FIG approval.',
  method: 'Existing normal-width helper at 640px. Headed Chromium at 1440x960 and 390x844 measures actual fixed media, native figure container, screen-transformed label sizes and scroll-end reachability. Hybrid layers remain separate and aligned.',
  nativeHelper: nativeBinding, previewHelper: helperBinding,
  spec: bind(specFile), render: bind(renderFile), svg: bind(svgFile),
  html: bind(path.join(out, 'native-css-preview.html')), normal640PNG: bind(normalPath),
  nativePNG: bind(path.join(candidate, `${id}.native.png`)),
  overlayNormal640PNG: bind(path.join(out, `${id}.overlay-normal-640.png`)),
  ...(id === 'fig-229' ? { artworkLayer: bind(path.join(candidate, `${id}.artwork.png`)) } : {}),
  measurementRepair: attempt === 'repair-1' ? {
    count: 1, figureSpecChanges: 0, artworkChanges: 0, nativeRerenders: 0,
    cause: 'Initial checker compared the artwork after horizontal scrolling with a stale SVG rectangle from before scrolling.',
    correction: 'Compare both layers in the same post-scroll coordinate frame.',
    preservedInitialFailure: bind(path.join(candidate, 'width-preview-report.json')),
    preservedInitialChecker: bind(path.join(candidate, 'check-author-before-measurement-repair.mjs')),
  } : null,
  nativeAndNormalDimensionsEqual: true, normalPNGAlsoFullResolution: true,
  allBrowsersClosed: true, measurements,
})
console.log(JSON.stringify({ id, attempt, status, measurements: measurements.map(m => ({
  viewport: m.viewport.width, media: m.metrics.actualMediaWidth,
  container: m.metrics.containerWidth, minTextPx: m.metrics.minTextPx,
  scrollEnd: m.metrics.reachedScrollEnd, failures: m.failures,
})) }, null, 2))
process.exitCode = status === 'pass' ? 0 : 2
