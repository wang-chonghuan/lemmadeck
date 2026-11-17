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
assert.ok(['fig-235', 'fig-236', 'fig-237'].includes(id))
assert.ok(['initial', 'repair-1'].includes(attempt))
const out = path.join(own, id, attempt)
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: path.resolve(file), sha256: hash(file) })
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const write = (name, value) => fs.writeFileSync(path.join(out, name), `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
const specFile = path.join(out, 'spec.json')
const renderFile = path.join(out, 'render.json')
const svgFile = path.join(out, `${id}.svg`)
const geometryFile = path.join(out, 'geometry.json')
const spec = read(specFile), render = read(renderFile), geometry = read(geometryFile)
const objects = new Map(spec.objects.map(item => [item.id, item]))
const resolve = value => typeof value === 'string' ? objects.get(value).at : value
const key = value => JSON.stringify(resolve(value))
const cross = (a, b) => a[0] * b[1] - a[1] * b[0]
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]]
const equal = (a, b) => Math.hypot(...sub(a, b)) < 1e-6
const onInterior = (p, a, b) => Math.abs(cross(sub(p, a), sub(b, a))) < 1e-6 &&
  sub(p, a)[0] * sub(p, b)[0] + sub(p, a)[1] * sub(p, b)[1] < -1e-6
const segments = geometry.wires.map(name => ({ id: name, a: resolve(objects.get(name).from), b: resolve(objects.get(name).to) }))
const roots = new Map(), adjacency = new Map()
const root = value => {
  if (!roots.has(value)) roots.set(value, value)
  if (roots.get(value) !== value) roots.set(value, root(roots.get(value)))
  return roots.get(value)
}
const crossings = [], edgeChecks = [], arrowChecks = []
try {
  assert.equal(render.status, 'pass')
  assert.equal(render.spec.sha256, hash(specFile))
  assert.equal(render.output.svg.sha256, hash(svgFile))
  assert.deepEqual(spec.display, { purpose: 'instructional', layout: 'scroll', minTextPx: 16, widths: [640] })
  assert.equal(spec.canvas.width, 640)
  assert.ok(spec.objects.filter(item => item.type === 'text').every(item => item.fontSize === 32 && /^[ -~]+$/.test(item.text)))
  assert.deepEqual(spec.objects.filter(item => item.type === 'text').map(item => item.text), geometry.expectedLabels)
  for (const name of [...geometry.wires, ...geometry.references, ...geometry.currents, ...geometry.masks]) {
    const object = objects.get(name)
    const assertion = spec.assertions.find(item => item.type === 'connects' && item.arrow === name)
    assert.ok(assertion, `Native connects missing: ${name}`)
    assert.deepEqual(assertion.from, object.from)
    assert.deepEqual(assertion.to, object.to)
    if (geometry.wires.includes(name)) {
      assert.equal(object.type, 'segment')
      assert.equal(object.stroke, 'ink')
      assert.equal(object.dash || 0, 0)
      const from = key(object.from), to = key(object.to)
      assert.notEqual(from, to)
      roots.set(root(from), root(to))
      for (const [a, b] of [[from, to], [to, from]]) {
        if (!adjacency.has(a)) adjacency.set(a, new Set())
        adjacency.get(a).add(b)
      }
      edgeChecks.push({ id: name, from: resolve(object.from), to: resolve(object.to), nativeAssertion: assertion.id, status: 'pass' })
    }
  }
  const components = [...new Set([...roots.keys()].map(root))]
  assert.equal(components.length, geometry.topology.externalComponents)
  assert.equal(segments.length - roots.size + components.length, geometry.topology.externalCycleRank)
  for (const [a, b, connected] of geometry.topology.terminalPairs) assert.equal(root(key(a)) === root(key(b)), connected, `${a}/${b}`)
  for (const [a, b] of geometry.topology.isolatedCircuitPairs || []) assert.notEqual(root(key(a)), root(key(b)))
  const junctions = [...adjacency].filter(([, edges]) => edges.size > 2).map(([at]) => at)
  assert.deepEqual(junctions.sort(), geometry.topology.expectedJunctions.map(key).sort())
  for (let i = 0; i < segments.length; i++) for (let j = i + 1; j < segments.length; j++) {
    const a = segments[i], b = segments[j]
    assert.ok(!onInterior(a.a, b.a, b.b) && !onInterior(a.b, b.a, b.b) &&
      !onInterior(b.a, a.a, a.b) && !onInterior(b.b, a.a, a.b), `Unsplit endpoint/interior contact: ${a.id}/${b.id}`)
    const v = sub(a.b, a.a), w = sub(b.b, b.a), denominator = cross(v, w)
    if (Math.abs(denominator) < 1e-6) continue
    const t = cross(sub(b.a, a.a), w) / denominator
    const u = cross(sub(b.a, a.a), v) / denominator
    if (t > 1e-6 && t < 1 - 1e-6 && u > 1e-6 && u < 1 - 1e-6) {
      const allowed = geometry.topology.permittedInsulatedCrossings
      assert.ok(allowed && allowed.first.includes(a.id) && allowed.second.includes(b.id), `Undeclared crossing ${a.id}/${b.id}`)
      const maskName = b.id.replace('pair-b-wire-', allowed.masksPrefix)
      const mask = objects.get(maskName)
      assert.ok(mask && mask.stroke === 'paper' && mask.strokeWidth > objects.get(a.id).strokeWidth + 4)
      assert.deepEqual(mask.from, objects.get(b.id).from)
      assert.deepEqual(mask.to, objects.get(b.id).to)
      const at = [a.a[0] + t * v[0], a.a[1] + t * v[1]]
      assert.ok(!adjacency.has(JSON.stringify(at)), 'Insulated crossover is not a graph vertex')
      crossings.push({ first: a.id, second: b.id, at, mask: maskName, conductiveJunction: false, status: 'pass' })
    }
  }
  assert.equal(crossings.length, geometry.topology.permittedInsulatedCrossings?.count || 0)
  for (const name of geometry.references) {
    assert.equal(objects.get(name).dash, 2)
    assert.equal(objects.get(name).stroke, 'muted')
    assert.ok(!geometry.wires.includes(name))
  }
  assert.equal(geometry.references.length, id === 'fig-235' ? 2 : 0)
  for (const fact of geometry.currentFacts) {
    const object = objects.get(fact.id), a = resolve(object.from), b = resolve(object.to)
    assert.equal(object.type, 'arrow')
    assert.equal(a[0], b[0])
    assert.equal(Math.sign(b[1] - a[1]), fact.direction === 'up' ? 1 : -1)
    assert.ok(segments.some(edge => (equal(a, edge.a) || equal(a, edge.b) || onInterior(a, edge.a, edge.b)) &&
      (equal(b, edge.a) || equal(b, edge.b) || onInterior(b, edge.a, edge.b))), `Arrow is not on one real wire: ${fact.id}`)
    arrowChecks.push({ ...fact, from: a, to: b, onActualWire: true, status: 'pass' })
  }
  assert.equal(geometry.currents.length, ({ 'fig-235': 2, 'fig-236': 1, 'fig-237': 4 })[id])
  assert.equal(geometry.currentFacts.filter(item => item.origin === 'source').length, id === 'fig-236' ? 0 : 2)
  if (id === 'fig-235') {
    assert.ok(arrowChecks.every(item => item.direction === 'up'))
    assert.ok(resolve('left-upper')[0] < 400 && 440 < resolve('right-upper')[0])
    assert.ok(40 < resolve('right-upper')[0] - resolve('left-upper')[0])
  }
  if (id === 'fig-236') {
    assert.equal(arrowChecks[0].id, 'right-current')
    const [a, b] = geometry.topology.switchGap.map(resolve)
    assert.ok(Math.hypot(...sub(a, b)) > 40, 'Open switch has a real visible gap')
  }
  if (id === 'fig-237') {
    const pair = arrowChecks.filter(item => /^pair-[ab]-current$/.test(item.id))
    assert.equal(pair.length, 2)
    assert.equal(pair[0].to[1] - pair[0].from[1], -(pair[1].to[1] - pair[1].from[1]))
    for (const member of ['a', 'b']) {
      const list = geometry.topology.distinctPairMembers[member]
      for (let i = 1; i < list.length; i++) assert.ok(equal(resolve(objects.get(list[i - 1]).to), resolve(objects.get(list[i]).from)))
      assert.equal(list.length, 8)
    }
    assert.ok(!equal(resolve('pair-a-lower'), resolve('pair-b-lower')))
  }
  write('author-assertions.json', {
    status: 'pass', scope: 'Author-only executable checks, not independent FIG approval.',
    spec: bind(specFile), geometry: bind(geometryFile),
    method: 'Physical-wire endpoint graph, exact native connects, non-junction crossing audit, arrow-on-segment and current-direction checks. Supply interiors are components, never wire shorts; reference traces and current/mask overlays are excluded from conductive topology.',
    topology: geometry.topology, externalComponents: components.length,
    cycleRank: segments.length - roots.size + components.length,
    edgeChecks, arrowChecks, insulatedCrossings: crossings,
    sourceReferenceCount: geometry.references.length,
    parallelAssertions: spec.assertions.filter(item => item.type === 'parallel'),
    additions: geometry.additions, unknownPixels: geometry.unknownPixels,
  })
} catch (error) {
  write('author-assertions.json', {
    status: 'fail', scope: 'Author-only executable checks.',
    failure: error.message, stack: error.stack, spec: bind(specFile), geometry: bind(geometryFile),
    edgeChecks, arrowChecks, insulatedCrossings: crossings,
  })
  console.error(error.message)
  process.exit(2)
}

const previewHelper = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/figure-preview.mjs')
const previewPrefix = path.join(out, `${id}.normal-preview`)
const preview = spawnSync(process.execPath, [previewHelper, svgFile, previewPrefix, '640'], {
  cwd: repo, encoding: 'utf8', env: { ...process.env, PWDEBUG: '', PLAYWRIGHT_HTML_OPEN: 'never' },
})
write('preview-helper-command.json', {
  helper: bind(previewHelper), command: [process.execPath, previewHelper, svgFile, previewPrefix, '640'],
  exitCode: preview.status, stdout: preview.stdout, stderr: preview.stderr,
})
assert.equal(preview.status, 0, preview.stdout + preview.stderr)
const previewPath = `${previewPrefix}-640.png`
const header = fs.readFileSync(previewPath).subarray(0, 24)
assert.equal(header.readUInt32BE(16), 640)
assert.equal(header.readUInt32BE(20), spec.canvas.height)
const nativeHelper = path.join(repo, '.claude/skills/ld-s10y-lesson/tools/render_lesson.js')
const cssMatch = fs.readFileSync(nativeHelper, 'utf8').match(/const CSS = `([\s\S]*?)`;/)
assert.ok(cssMatch, 'Existing native CSS must resolve')
const css = cssMatch[1].replace('${katexCss()}', '')
assert.match(css, /width:40em;max-width:none/)
const html = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}</style><div class="sheet"><figure class="fig" id="${id}" data-figure-layout="scroll" data-figure-purpose="instructional"><div class="figure-media" data-figure-mode="deterministic" data-figure-theme="neutral">${fs.readFileSync(svgFile, 'utf8')}</div></figure></div>`
fs.writeFileSync(path.join(out, 'native-css-preview.html'), html, { flag: 'wx' })
const browser = await chromium.launch({ headless: false })
const measurements = []
try {
  for (const viewport of [{ width: 1440, height: 960 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport, deviceScaleFactor: 1 })
    try {
      const page = await context.newPage(), pageErrors = []
      page.on('pageerror', error => pageErrors.push(error.message))
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
        const outsideLabels = labels.filter(label => label.box.x < 0 || label.box.y < 0 || label.box.x + label.box.width > rect.width || label.box.y + label.box.height > rect.height)
        const arrows = [...svg.querySelectorAll('[data-arrowhead-for]')].map(head => {
          const line = document.getElementById(head.getAttribute('data-arrowhead-for'))
          return { id: line.id, explicitHead: head.children.length > 0,
            from: [line.x1.baseVal.value, line.y1.baseVal.value], to: [line.x2.baseVal.value, line.y2.baseVal.value] }
        })
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
        return { actualMediaWidth: rect.width, actualMediaHeight: rect.height,
          containerWidth: host.clientWidth, maxScroll, reachedScrollEnd,
          labels, minTextPx: Math.min(...labels.map(label => label.actualTextPx)),
          overlaps, outsideLabels, arrows, darkPixels, borderPixels }
      }, spec.canvas.height)
      const failures = []
      if (Math.abs(metrics.actualMediaWidth - 640) > 0.01) failures.push('Actual fixed media width is not 640')
      if (viewport.width === 390 && metrics.containerWidth !== 358) failures.push('Actual mobile container width is not 358')
      if (metrics.minTextPx !== 32) failures.push('Actual label font is not 32 px')
      if (!metrics.reachedScrollEnd) failures.push('Scroll end is unreachable')
      if (metrics.overlaps.length || metrics.outsideLabels.length) failures.push('Label overlap/clipping')
      if (metrics.darkPixels < 300 || metrics.darkPixels > 640 * spec.canvas.height * 0.25 || metrics.borderPixels) failures.push('Blank/black/clipped raster')
      if (metrics.arrows.length !== geometry.currents.length || metrics.arrows.some(item => !item.explicitHead)) failures.push('Missing current arrowheads')
      for (const current of arrowChecks) {
        const arrow = metrics.arrows.find(item => item.id.endsWith(`_ld-${current.id}`))
        if (!arrow || Math.sign(arrow.to[1] - arrow.from[1]) !== (current.direction === 'down' ? 1 : -1)) failures.push(`Rendered arrow direction: ${current.id}`)
      }
      if (pageErrors.length) failures.push('Browser page error')
      measurements.push({ viewport, status: failures.length ? 'fail' : 'pass', failures, metrics, pageErrors })
    } finally { await context.close() }
  }
} finally { await browser.close() }
const status = measurements.every(item => item.status === 'pass') ? 'pass' : 'fail'
write('width-preview-report.json', {
  status, scope: 'Headed author artifact preview, not a running-app acceptance or independent FIG approval.',
  method: 'Unchanged figure-preview helper produces one 640 px normal PNG. Existing native lesson CSS measures fixed scroll media at 640 px with 358 px actual mobile container; both headed desktop/mobile viewports test screen-transform text size and scroll-end reachability.',
  nativeHelper: bind(nativeHelper), previewHelper: bind(previewHelper),
  html: bind(path.join(out, 'native-css-preview.html')),
  normal640PNG: bind(previewPath), nativePNG: bind(path.join(out, `${id}.native.png`)),
  spec: bind(specFile), svg: bind(svgFile), render: bind(renderFile),
  normalPNGAlsoFullResolution: true, nativeAndNormalDimensionsEqual: true,
  allBrowsersClosed: true, measurements,
})
console.log(JSON.stringify({ id, attempt, status, measurements: measurements.map(item => ({
  viewport: item.viewport.width, media: item.metrics.actualMediaWidth,
  container: item.metrics.containerWidth, minTextPx: item.metrics.minTextPx,
  scrollEnd: item.metrics.reachedScrollEnd, failures: item.failures,
})) }, null, 2))
process.exitCode = status === 'pass' ? 0 : 2
