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
assert.ok(['fig-231', 'fig-232'].includes(id))
assert.ok(['initial', 'repair-1'].includes(attempt))
const out = path.join(own, id, attempt)
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: path.resolve(file), sha256: hash(file), bytes: fs.statSync(file).size })
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const write = (name, value) => fs.writeFileSync(path.join(out, name), `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
const specFile = path.join(out, 'spec.json'), renderFile = path.join(out, 'render.json')
const svgFile = path.join(out, `${id}.svg`), geometryFile = path.join(out, 'geometry.json')
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
  assert.equal(spec.mode, 'deterministic')
  assert.deepEqual(spec.assets, [])
  assert.deepEqual(spec.display, { purpose: 'instructional', layout: 'scroll', minTextPx: 16, widths: [640] })
  assert.ok(spec.objects.filter(o => o.type === 'text').every(o => o.fontSize === 32 && /^[ -~]+$/.test(o.text)))
  assert.deepEqual(spec.objects.filter(o => o.type === 'text').map(o => o.text), geometry.expectedLabels)
  assert.ok(geometry.expectedLabels.every(t => !/\d|=/.test(t)), 'No invented numeric data or solution equations')
  const context = read(geometry.completeContext.path)
  const full = [
    ...context.chineseCompleteLesson.prose.filter(b => b.text.trim()).map(b => ({ lesson: context.card, language: 'zh', text: b.text })),
    ...context.englishCompleteLesson.prose.filter(b => b.text.trim()).map(b => ({ lesson: context.card, language: 'en', text: b.text })),
  ]
  if (id === 'fig-232') full.push(
    { lesson: context.card, exercise: '2', language: 'zh', text: context.chineseCompleteExercises.exercises[1].text },
    { lesson: context.card, exercise: '2', language: 'en', text: context.englishCompleteExercises.exercises[1].text },
  )
  assert.deepEqual(spec.source.authoritativeText, full, 'Complete authoritative text and exercise ordering')
  for (const edge of segments) {
    const o = objects.get(edge.id)
    const native = spec.assertions.find(a => a.type === 'connects' && a.arrow === edge.id)
    assert.ok(native)
    assert.deepEqual(native.from, o.from)
    assert.deepEqual(native.to, o.to)
    assert.equal(o.type, 'segment')
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
  assert.ok([...adjacency.values()].every(a => a.size <= 2), 'No unexpected branch junction')
  for (const [a, b] of geometry.topology.componentPairs) assert.notEqual(root(key(a)), root(key(b)), 'No component short')
  for (const [a, b] of geometry.topology.sequenceConnections) assert.equal(root(key(a)), root(key(b)), 'Source series connection')
  for (let i = 0; i < segments.length; i++) for (let j = i + 1; j < segments.length; j++) {
    const a = segments[i], b = segments[j]
    assert.ok(!onInterior(a.a, b.a, b.b) && !onInterior(a.b, b.a, b.b) &&
      !onInterior(b.a, a.a, a.b) && !onInterior(b.b, a.a, a.b), `No unsplit wire contact: ${a.id}/${b.id}`)
    const v = sub(a.b, a.a), w = sub(b.b, b.a), denominator = cross(v, w)
    if (Math.abs(denominator) < 1e-6) continue
    const t = cross(sub(b.a, a.a), w) / denominator, u = cross(sub(b.a, a.a), v) / denominator
    assert.ok(!(t > 1e-6 && t < 1 - 1e-6 && u > 1e-6 && u < 1 - 1e-6), 'No wire crossings')
  }
  for (const [a, b] of geometry.topology.componentPairs) roots.set(root(key(a)), root(key(b)))
  assert.equal(new Set([...roots.keys()].map(root)).size, 1)
  assert.equal(segments.length + 3 - roots.size + 1, 1, 'Exactly one complete series cycle')
  const info = geometry.specifics
  assert.equal(info.longPlates.length, info.visibleCellPairs)
  for (const [i, name] of info.longPlates.entries()) {
    const long = objects.get(name), short = objects.get(info.shortPlates[i])
    const a = resolve(long.from), b = resolve(long.to), c = resolve(short.from), d = resolve(short.to)
    assert.equal(a[0], b[0]); assert.equal(c[0], d[0])
    assert.ok(Math.abs(b[1] - a[1]) > Math.abs(d[1] - c[1]))
    assert.equal(Math.sign(a[0] - c[0]), info.plateOrientation === 'long-right' ? 1 : -1)
  }
  if (id === 'fig-231') {
    const a = resolve('needle-pivot'), b = resolve('needle-tip')
    const angle = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI
    assert.ok(b[0] < a[0] && b[1] > a[1] && angle > 90 && angle < 100)
    assert.ok(Math.abs(angle - 94) < 1e-6)
    assert.ok(angle < info.baselineStyleNeedleAngleDegrees, 'Larger deflection than low-side FIG230')
    assert.equal(spec.objects.filter(o => o.id.startsWith('dial-tick-')).length, 17)
    assert.equal(spec.objects.filter(o => o.type === 'arrow').length, 5)
    for (let i = 1; i <= 5; i++) {
      const a = resolve(`light-${i}-start`), b = resolve(`light-${i}-end`)
      assert.ok(b[0] > a[0] && b[1] > a[1], 'Light goes up-right')
      const xAtBottom = b[0] + (spec.canvas.height - 445 - b[1]) * (b[0] - a[0]) / (b[1] - a[1])
      assert.ok(xAtBottom >= 265 && xAtBottom <= 435, 'Each incident ray aims at the semiconductor')
      assert.ok(!geometry.wires.includes(`incident-light-${i}`))
    }
  } else {
    assert.equal(spec.objects.filter(o => o.type === 'arrow').length, 0)
    assert.deepEqual(geometry.expectedLabels, ['C', 'R', '...', 'E'])
    assert.deepEqual(context.applicableExercises, ['2'])
    const a = resolve('capacitor-left'), b = resolve('capacitor-right')
    assert.ok(a[0] < b[0] && a[1] === b[1], 'Separate capacitor terminals')
    const aPlate = objects.get('capacitor-left-plate'), bPlate = objects.get('capacitor-right-plate')
    assert.equal(resolve(aPlate.from)[1], resolve(bPlate.from)[1])
    assert.equal(resolve(aPlate.to)[1], resolve(bPlate.to)[1])
    assert.ok(resolve('resistor-top')[1] > resolve('resistor-bottom')[1], 'Vertical resistor')
  }
  write('author-assertions.json', {
    status: 'pass', scope: 'Figure-author-only source topology, apparatus and context checks, not SCI replay.',
    spec: bind(specFile), geometry: bind(geometryFile), edgeChecks,
    topology: { branches: 0, wireCrossings: 0, componentShorts: 0, completeSeriesCycles: 1 },
    completeAuthoritativeText: true, noAnswerAnnotations: true,
  })
} catch (error) {
  write('author-assertions.json', { status: 'fail', failure: error.message, stack: error.stack, spec: bind(specFile), geometry: bind(geometryFile), edgeChecks })
  throw error
}

const helper = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/figure-preview.mjs')
const helperBinding = bind(helper)
const prefix = path.join(out, `${id}.normal-preview`)
const preview = spawnSync(process.execPath, [helper, svgFile, prefix, '640'], { cwd: repo, encoding: 'utf8', timeout: 120000 })
write('preview-helper-command.json', {
  helper: helperBinding, exitCode: preview.status, stdout: preview.stdout, stderr: preview.stderr,
  command: [process.execPath, helper, svgFile, prefix, '640'],
})
assert.equal(preview.status, 0, preview.stdout + preview.stderr)
const normalPath = `${prefix}-640.png`, nativePath = path.join(out, `${id}.native.png`)
for (const file of [normalPath, nativePath]) {
  const bytes = fs.readFileSync(file)
  assert.equal(bytes.readUInt32BE(16), 640)
  assert.equal(bytes.readUInt32BE(20), spec.canvas.height)
}
const nativeHelper = path.join(repo, '.claude/skills/ld-s10y-lesson/tools/render_lesson.js')
const nativeBinding = bind(nativeHelper)
const cssMatch = fs.readFileSync(nativeHelper, 'utf8').match(/const CSS = `([\s\S]*?)`;/)
assert.ok(cssMatch)
const css = cssMatch[1].replace('${katexCss()}', '')
assert.match(css, /width:40em;max-width:none/)
assert.match(css, /li.ex\{display:grid;grid-template-columns:3.2em 1fr/)
const svg = fs.readFileSync(svgFile, 'utf8')
const figure = container => `<figure class="fig" id="${id}-${container}" data-testid="${container}-figure" data-figure-layout="scroll" data-figure-purpose="instructional"><div class="figure-media" data-figure-mode="deterministic" data-figure-theme="neutral">${svg}</div></figure>`
const html = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}</style><div class="sheet">
${figure('prose')}<ol class="ex"><li class="ex"><div class="no">2.</div><div class="body">${figure('exercise')}</div></li></ol></div>`
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
      const measured = []
      for (const container of ['prose', 'exercise']) {
        const host = page.getByTestId(`${container}-figure`)
        const metrics = await host.locator('svg').evaluate(async (svg, height) => {
          const rect = svg.getBoundingClientRect(), host = svg.closest('figure')
          const labels = [...svg.querySelectorAll('text')].map(text => {
            const matrix = text.getScreenCTM(), box = text.getBoundingClientRect()
            return {
              text: text.textContent,
              actualTextPx: Number.parseFloat(text.getAttribute('font-size')) * Math.hypot(matrix.a, matrix.b),
              box: { x: box.x - rect.x, y: box.y - rect.y, width: box.width, height: box.height },
            }
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
          const canvas = document.createElement('canvas')
          canvas.width = 640; canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx.fillStyle = 'white'; ctx.fillRect(0, 0, 640, height)
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
          return {
            actualMediaWidth: rect.width, actualMediaHeight: rect.height,
            containerWidth: host.getBoundingClientRect().width, containerClientWidth: host.clientWidth,
            exerciseBodyWidth: host.closest('.body')?.getBoundingClientRect().width ?? null,
            maxScroll, reachedScrollEnd, minTextPx: Math.min(...labels.map(l => l.actualTextPx)),
            labels, overlaps, outsideLabels, darkPixels, borderPixels,
          }
        }, spec.canvas.height)
        const failures = []
        if (metrics.actualMediaWidth !== 640 || metrics.actualMediaHeight !== spec.canvas.height) failures.push('Wrong fixed media dimensions')
        if (metrics.minTextPx < 16 || Math.abs(metrics.minTextPx - 32) > 0.01) failures.push('Transformed text is not 32px')
        if (metrics.overlaps.length || metrics.outsideLabels.length) failures.push('Label overlap or clipping')
        if (!metrics.reachedScrollEnd) failures.push('Unreachable scroll end')
        if (metrics.darkPixels < 500 || metrics.darkPixels > 640 * spec.canvas.height * 0.25 || metrics.borderPixels) failures.push('Blank, black or border-clipped output')
        if (errors.length) failures.push('Browser page errors')
        const report = { viewport, container, status: failures.length ? 'fail' : 'pass', failures, metrics, pageErrors: errors }
        measured.push(report)
        measurements.push(report)
        if (viewport.width === 390 && container === (id === 'fig-232' ? 'exercise' : 'prose')) {
          await host.evaluate(el => { el.scrollLeft = 0 })
          await host.screenshot({ path: path.join(out, `${id}.mobile-container.png`) })
        }
      }
      assert.ok(measured[1].metrics.containerWidth < measured[0].metrics.containerWidth, 'Actually measured exercise container must be narrower than prose')
      assert.ok(Math.abs(measured[1].metrics.containerWidth - measured[1].metrics.exerciseBodyWidth) < 0.01)
    } finally { await context.close() }
  }
} finally { await browser.close() }
assert.equal(hash(helper), helperBinding.sha256)
assert.equal(hash(nativeHelper), nativeBinding.sha256)
const status = measurements.every(m => m.status === 'pass') ? 'pass' : 'fail'
write('width-preview-report.json', {
  status, scope: 'Headed author candidate preview using unchanged native lesson/exercise CSS, not full-card or running-product acceptance and not independent FIG approval.',
  method: 'Measure SVG and actual prose/exercise figure containers separately at 1440x960 and 390x844, including transformed labels, scroll-end reachability and raster pixels.',
  nativeHelper: nativeBinding, previewHelper: helperBinding,
  spec: bind(specFile), render: bind(renderFile), svg: bind(svgFile),
  html: bind(path.join(out, 'native-css-preview.html')),
  normal640PNG: bind(normalPath), nativePNG: bind(nativePath),
  mobileContainerPNG: bind(path.join(out, `${id}.mobile-container.png`)),
  dimensions: { width: 640, height: spec.canvas.height, normalPNGAlsoFullResolution: true },
  allBrowsersClosed: true, measurements,
})
console.log(JSON.stringify({
  id, attempt, status, measurements: measurements.map(m => ({
    viewport: m.viewport.width, container: m.container, media: m.metrics.actualMediaWidth,
    containerWidth: m.metrics.containerWidth, minTextPx: m.metrics.minTextPx, scrollEnd: m.metrics.reachedScrollEnd, failures: m.failures,
  })),
}, null, 2))
process.exitCode = status === 'pass' ? 0 : 2
