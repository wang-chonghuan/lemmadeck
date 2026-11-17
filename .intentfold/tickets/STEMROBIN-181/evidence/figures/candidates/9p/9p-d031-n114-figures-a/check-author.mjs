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
assert.ok(['fig-233', 'fig-234'].includes(id))
assert.ok(['initial', 'repair-1'].includes(attempt))
const out = path.join(own, id, attempt)
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: path.resolve(file), sha256: hash(file) })
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const write = (name, value) => fs.writeFileSync(path.join(out, name), `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
const specFile = path.join(out, 'spec.json')
const renderFile = path.join(out, 'render.json')
const svgFile = path.join(out, `${id}.svg`)
const spec = read(specFile), render = read(renderFile), geometry = read(path.join(out, 'geometry.json'))
assert.equal(render.status, 'pass')
assert.equal(render.spec.sha256, hash(specFile))
assert.equal(render.output.svg.sha256, hash(svgFile))
assert.deepEqual(spec.display, { purpose: 'instructional', layout: 'scroll', minTextPx: 16, widths: [640] })
const objects = new Map(spec.objects.map(object => [object.id, object]))
const resolve = value => typeof value === 'string' ? objects.get(value).at : value
const key = value => JSON.stringify(resolve(value))
const roots = new Map(), edges = new Map()
const root = value => {
  if (!roots.has(value)) roots.set(value, value)
  if (roots.get(value) !== value) roots.set(value, root(roots.get(value)))
  return roots.get(value)
}
const join = (from, to) => roots.set(root(from), root(to))
const wireChecks = []
for (const name of geometry.wires) {
  const wire = objects.get(name)
  assert.equal(wire.type, 'segment')
  assert.equal(wire.stroke, 'ink')
  assert.equal(wire.dash || 0, 0)
  const check = spec.assertions.find(item => item.type === 'connects' && item.arrow === name)
  assert.ok(check)
  assert.deepEqual(check.from, wire.from)
  assert.deepEqual(check.to, wire.to)
  const from = key(wire.from), to = key(wire.to)
  assert.notEqual(from, to)
  join(from, to)
  for (const [a, b] of [[from, to], [to, from]]) {
    if (!edges.has(a)) edges.set(a, new Set())
    edges.get(a).add(b)
  }
  wireChecks.push({ id: name, from: resolve(wire.from), to: resolve(wire.to), assertion: check.id, status: 'pass' })
}
const leftPin = key('source-left-terminal'), rightPin = key('source-right-terminal')
const nets = [...new Set([...roots.keys()].map(root))]
assert.equal(nets.length, id === 'fig-233' ? 2 : 1)
assert.equal(root(leftPin) === root(rightPin), id === 'fig-234')
assert.equal(root(key('left-upper-joint')), root(leftPin))
assert.equal(root(key('right-upper-joint')), root(rightPin))
assert.equal(edges.get(leftPin).size, 1)
assert.equal(edges.get(rightPin).size, 1)
assert.equal([...edges.values()].filter(neighbors => neighbors.size === 1).length, id === 'fig-233' ? 4 : 2)
assert.ok([...edges.values()].every(neighbors => neighbors.size <= 2), 'No added branch')
assert.equal(geometry.wires.length, id === 'fig-233' ? 10 : 17)
assert.equal(geometry.references.length, id === 'fig-233' ? 0 : 2)
for (const reference of geometry.references) {
  const line = objects.get(reference)
  assert.equal(line.dash, 2)
  assert.equal(line.stroke, 'muted')
  assert.ok(!geometry.wires.includes(reference))
  assert.ok(spec.assertions.some(item => item.type === 'connects' && item.arrow === reference))
}
assert.equal(geometry.currents.length, id === 'fig-233' ? 0 : 2)
const arrowChecks = geometry.currents.map(name => {
  const arrow = objects.get(name), from = resolve(arrow.from), to = resolve(arrow.to)
  assert.equal(arrow.type, 'arrow')
  assert.equal(from[0], to[0])
  assert.equal(Math.sign(to[1] - from[1]), name === 'left-current' ? -1 : 1)
  for (const suffix of ['connects', 'direction', 'on-facing-wire']) {
    assert.ok(spec.assertions.some(item => item.id === `${name}-${suffix}`))
  }
  assert.ok(!geometry.wires.includes(name), 'Current annotation must not create an extra circuit branch')
  return { id: name, from, to, direction: name === 'left-current' ? 'down' : 'up', onActualWire: true, status: 'pass' }
})
if (id === 'fig-234') {
  for (const side of ['left', 'right']) {
    const top = resolve(`${side}-central-top`), bottom = resolve(`${side}-central-bottom`)
    assert.equal(top[0], bottom[0])
    assert.equal(top[1], 560)
    assert.equal(bottom[1], 320)
  }
  assert.equal(resolve('right-central-top')[0] - resolve('left-central-top')[0], 220)
  assert.equal(resolve('right-upper-joint')[0] - resolve('left-upper-joint')[0], 120)
  assert.ok(resolve('left-central-top')[0] < resolve('left-upper-joint')[0])
  assert.ok(resolve('right-central-top')[0] > resolve('right-upper-joint')[0])
}
assert.equal(spec.objects.filter(object => object.type === 'polygon').length, 1)
assert.equal(spec.objects.filter(object => object.type === 'arrow').length, geometry.currents.length)
assert.equal(spec.objects.filter(object => object.type === 'image').length, 0)
assert.deepEqual(spec.objects.filter(object => object.type === 'text').map(object => object.text), geometry.expectedLabels)
assert.ok(geometry.expectedLabels.every(label => /^[ -~]+$/.test(label)))
write('author-assertions.json', {
  status: 'pass', scope: 'Executable author checks, not independent approval',
  method: 'Undirected physical-wire endpoint graph. Source box is the supply component, not a wire short. Current-arrow and dashed-reference overlays are excluded. All wire edges have native connects assertions.',
  topology: geometry.expectedTopology, externalWireComponents: nets.length,
  branches: 0, supplyAddedWireBypass: false, wireChecks, arrowChecks,
  referenceState: { count: geometry.references.length, electricallyConductive: false },
  relationships: id === 'fig-233'
    ? ['Two straight vertical parallel wires', 'Separate free upper ends', 'No current arrows']
    : ['Left current down; right current up', 'Parallel facing central sections only', 'Outward displacement from dashed initial positions', 'One upper connecting wire closes the external path'],
  spec: bind(specFile), geometry: bind(path.join(out, 'geometry.json')),
})

const helper = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/figure-preview.mjs')
assert.equal(hash(helper), hash(path.join(own, 'inputs/figure-preview.mjs')))
const previewPrefix = path.join(out, `${id}.normal-preview`)
const preview = spawnSync(process.execPath, [helper, svgFile, previewPrefix, '640'], {
  cwd: repo, encoding: 'utf8', env: { ...process.env, PWDEBUG: '', PLAYWRIGHT_HTML_OPEN: 'never' },
})
write('preview-helper-command.json', {
  helper: bind(helper), command: [process.execPath, helper, svgFile, previewPrefix, '640'],
  exitCode: preview.status, stdout: preview.stdout, stderr: preview.stderr,
})
assert.equal(preview.status, 0, preview.stdout + preview.stderr)
const previewPath = `${previewPrefix}-640.png`
const header = fs.readFileSync(previewPath).subarray(0, 24)
assert.equal(header.readUInt32BE(16), 640)
assert.equal(header.readUInt32BE(20), 760)

const nativePreviewHelper = path.join(repo, '.claude/skills/ld-s10y-lesson/tools/render_lesson.js')
assert.equal(hash(nativePreviewHelper), hash(path.join(own, 'inputs/render_lesson.js')))
const helperText = fs.readFileSync(nativePreviewHelper, 'utf8')
const match = helperText.match(/const CSS = `([\s\S]*?)`;/)
assert.ok(match, 'Existing native preview CSS must resolve')
const css = match[1].replace('${katexCss()}', '')
assert.match(css, /width:40em;max-width:none/)
const html = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}</style><div class="sheet"><figure class="fig" id="${id}" data-figure-layout="scroll" data-figure-purpose="instructional"><div class="figure-media" data-figure-mode="deterministic" data-figure-theme="neutral">${fs.readFileSync(svgFile, 'utf8')}</div></figure></div>`
fs.writeFileSync(path.join(out, 'native-css-preview.html'), html, { flag: 'wx' })
const browser = await chromium.launch({ headless: false })
const measurements = []
try {
  for (const viewport of [{ width: 1440, height: 960 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport, deviceScaleFactor: 1 })
    try {
      const page = await context.newPage()
      const pageErrors = []
      page.on('pageerror', error => pageErrors.push(error.message))
      await page.setContent(html)
      await page.evaluate(() => document.fonts.ready)
      const metrics = await page.locator('svg').evaluate(async svg => {
        const rect = svg.getBoundingClientRect()
        const host = svg.closest('figure')
        const labels = [...svg.querySelectorAll('text')].map(text => {
          const matrix = text.getScreenCTM(), box = text.getBoundingClientRect()
          return { text: text.textContent,
            actualTextPx: Number.parseFloat(text.getAttribute('font-size')) * Math.hypot(matrix.a, matrix.b),
            box: { x: box.x - rect.x, y: box.y - rect.y, width: box.width, height: box.height },
          }
        })
        const overlaps = []
        labels.forEach((a, i) => labels.slice(i + 1).forEach(b => {
          if (Math.min(a.box.x + a.box.width, b.box.x + b.box.width) > Math.max(a.box.x, b.box.x) + 0.1 &&
            Math.min(a.box.y + a.box.height, b.box.y + b.box.height) > Math.max(a.box.y, b.box.y) + 0.1) overlaps.push([a.text, b.text])
        }))
        const outsideLabels = labels.filter(label => label.box.x < 0 || label.box.y < 0 || label.box.x + label.box.width > rect.width || label.box.y + label.box.height > rect.height)
        const arrows = [...svg.querySelectorAll('[data-arrowhead-for]')].map(head => {
          const line = document.getElementById(head.getAttribute('data-arrowhead-for'))
          return { id: line.id, explicitHead: head.children.length > 0,
            from: [line.x1.baseVal.value, line.y1.baseVal.value],
            to: [line.x2.baseVal.value, line.y2.baseVal.value] }
        })
        const maxScroll = host.scrollWidth - host.clientWidth
        host.scrollLeft = host.scrollWidth
        const scrollEnd = Math.abs(host.scrollLeft - maxScroll) <= 1
        const canvas = document.createElement('canvas')
        canvas.width = 640
        canvas.height = 760
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, 640, 760)
        const image = new Image()
        image.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(new XMLSerializer().serializeToString(svg))))}`
        await image.decode()
        ctx.drawImage(image, 0, 0, 640, 760)
        const pixels = ctx.getImageData(0, 0, 640, 760).data
        let darkPixels = 0, borderPixels = 0
        for (let y = 0; y < 760; y++) for (let x = 0; x < 640; x++) {
          const i = (y * 640 + x) * 4
          if (pixels[i] < 190 && pixels[i + 1] < 190 && pixels[i + 2] < 190) {
            darkPixels++
            if (x < 2 || y < 2 || x >= 638 || y >= 758) borderPixels++
          }
        }
        return { actualMediaWidth: rect.width, actualMediaHeight: rect.height,
          containerWidth: host.clientWidth, maxScroll, reachedScrollEnd: scrollEnd,
          labels, minTextPx: Math.min(...labels.map(label => label.actualTextPx)),
          overlaps, outsideLabels, arrows, darkPixels, borderPixels }
      })
      const failures = []
      if (Math.abs(metrics.actualMediaWidth - 640) > 0.01) failures.push('Actual media width is not640')
      if (viewport.width === 390 && metrics.containerWidth !== 358) failures.push('Actual mobile scroll container is not358')
      if (metrics.minTextPx < 16) failures.push('Label below16 actual media pixels')
      if (!metrics.reachedScrollEnd) failures.push('Scroll end unreachable')
      if (metrics.overlaps.length || metrics.outsideLabels.length) failures.push('Label overlap/clipping')
      if (metrics.darkPixels < 300 || metrics.darkPixels > 640 * 760 * 0.25 || metrics.borderPixels) failures.push('Blank/black/clipped raster')
      if (metrics.arrows.length !== geometry.currents.length || metrics.arrows.some(arrow => !arrow.explicitHead)) failures.push('Arrow count or head mismatch')
      for (const current of arrowChecks) {
        const arrow = metrics.arrows.find(item => item.id.endsWith(`_ld-${current.id}`))
        if (!arrow || Math.sign(arrow.to[1] - arrow.from[1]) !== (current.direction === 'down' ? 1 : -1)) failures.push(`Wrong rendered arrow direction:${current.id}`)
      }
      if (pageErrors.length) failures.push('Browser page error')
      measurements.push({ viewport, status: failures.length ? 'fail' : 'pass', failures, metrics, pageErrors })
    } finally { await context.close() }
  }
} finally { await browser.close() }
const status = measurements.every(measurement => measurement.status === 'pass') ? 'pass' : 'fail'
write('width-preview-report.json', {
  status, scope: 'Headed artifact preview and author evidence only, not running-app acceptance or independent review',
  method: 'Existing figure-preview.mjs produces normal640 PNG; unchanged native render_lesson.js CSS supplies fixed-scroll media and container layout. Unmodified native SVG screen transforms, current arrow directions and raster checks measured at desktop1440x960 and mobile390x844.',
  nativePreviewHelper: bind(nativePreviewHelper), rasterPreviewHelper: bind(helper),
  previewHTML: bind(path.join(out, 'native-css-preview.html')),
  normal640PNG: bind(previewPath), nativePNG: bind(path.join(out, `${id}.native.png`)),
  svg: bind(svgFile), spec: bind(specFile), render: bind(renderFile),
  allBrowsersClosed: true, measurements,
})
console.log(JSON.stringify({ id, attempt, status, measurements: measurements.map(item => ({
  viewport: item.viewport.width, width: item.metrics.actualMediaWidth,
  container: item.metrics.containerWidth, minTextPx: item.metrics.minTextPx,
  status: item.status, failures: item.failures,
})) }, null, 2))
process.exitCode = status === 'pass' ? 0 : 2
