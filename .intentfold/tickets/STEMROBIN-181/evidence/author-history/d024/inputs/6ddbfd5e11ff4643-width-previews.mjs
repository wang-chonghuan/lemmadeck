import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const own = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(own, '../../..')
const require = createRequire(path.join(repo, '.agents/skills/package.json'))
const { chromium } = require('playwright-core')
const id = process.argv[2]
const attempt = id === 'fig-174' ? 'repair-1' : 'initial'
assert.ok(['fig-173', 'fig-174', 'fig-175', 'fig-176'].includes(id))
const out = path.join(own, id, attempt)
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: path.relative(repo, file), sha256: hash(file) })
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const specFile = path.join(out, 'spec.json')
const renderFile = path.join(out, 'render.json')
const svgFile = path.join(out, `${id}.svg`)
const spec = read(specFile)
const report = read(renderFile)
const geometry = read(path.join(own, id, 'geometry.json'))
assert.ok(!fs.existsSync(path.join(out, 'width-previews.json')), 'No successful preview gate replay')
assert.equal(report.status, 'pass')
assert.equal(report.spec.sha256, hash(specFile))
assert.equal(report.output.svg.sha256, hash(svgFile))
const objects = new Map(spec.objects.map(object => [object.id, object]))
const resolve = value => typeof value === 'string' ? objects.get(value).at : value
const key = value => JSON.stringify(resolve(value))
const parents = new Map()
const root = value => {
  if (!parents.has(value)) parents.set(value, value)
  if (parents.get(value) !== value) parents.set(value, root(parents.get(value)))
  return parents.get(value)
}
const join = (a, b) => parents.set(root(a), root(b))
const wireAssertions = []
for (const wireId of geometry.wires) {
  const wire = objects.get(wireId)
  assert.equal(wire.type, 'segment')
  assert.equal(wire.stroke, 'ink')
  assert.equal(wire.dash || 0, 0)
  assert.ok(spec.assertions.some(item => item.type === 'connects' && item.arrow === wireId))
  join(key(wire.from), key(wire.to))
  wireAssertions.push({ id: wireId, from: resolve(wire.from), to: resolve(wire.to), status: 'pass' })
}
const components = geometry.components.map(component => {
  const [from, to] = component.pins.map(key)
  assert.notEqual(root(from), root(to), `Wire short across ${component.id}`)
  assert.ok(geometry.wires.some(wire => [key(objects.get(wire).from), key(objects.get(wire).to)].includes(from)), `Missing left pin wire: ${component.id}`)
  assert.ok(geometry.wires.some(wire => [key(objects.get(wire).from), key(objects.get(wire).to)].includes(to)), `Missing right pin wire: ${component.id}`)
  const symbol = objects.get(component.id)
  if (component.kind === 'meter') {
    assert.equal(symbol.type, 'circle')
    assert.deepEqual(component.pins, [[symbol.center[0] - symbol.radius, symbol.center[1]], [symbol.center[0] + symbol.radius, symbol.center[1]]])
  } else {
    assert.equal(symbol.type, 'polygon')
    const left = Math.min(...symbol.points.map(point => point[0]))
    const right = Math.max(...symbol.points.map(point => point[0]))
    const middle = (Math.min(...symbol.points.map(point => point[1])) + Math.max(...symbol.points.map(point => point[1]))) / 2
    assert.deepEqual(component.pins, [[left, middle], [right, middle]])
  }
  return { ...component, nets: [root(from), root(to)], wireBypass: false }
})
const nets = [...new Set([...parents.keys()].map(root))]
const topology = id === 'fig-173' || id === 'fig-175' ? 'series' : 'parallel'
assert.equal(nets.length, topology === 'series' ? 3 : 2)
assert.equal(components.length, 2)
if (topology === 'series') {
  assert.equal(components[0].nets[1], components[1].nets[0])
  assert.notEqual(components[0].nets[0], components[1].nets[1])
} else {
  assert.deepEqual(components[0].nets, components[1].nets)
}
for (const current of geometry.currents) {
  const arrow = objects.get(current.id)
  const from = resolve(arrow.from), to = resolve(arrow.to)
  assert.equal(arrow.type, 'arrow')
  assert.ok(from[0] < to[0] && from[1] === to[1])
  assert.ok(!geometry.wires.includes(current.id))
}
for (const scope of geometry.scopes) {
  assert.equal(scope.conductive, false)
  assert.equal(scope.heads.length, 2)
  const left = objects.get(scope.heads[0]), right = objects.get(scope.heads[1])
  assert.deepEqual(left.from, right.from)
  assert.deepEqual(left.to, scope.from)
  assert.deepEqual(right.to, scope.to)
  assert.ok(left.to[0] < left.from[0] && right.to[0] > right.from[0])
  for (const arrow of [left, right]) {
    assert.equal(arrow.stroke, 'muted')
    assert.equal(arrow.dash, 2)
    assert.ok(!geometry.wires.includes(arrow.id))
  }
  const [leftNode, rightNode] = scope.nodes.map(node => objects.get(node).at)
  if (id === 'fig-173') {
    assert.equal(scope.from[0], leftNode[0])
    assert.equal(scope.to[0], rightNode[0])
    for (const node of scope.nodes) {
      const x = objects.get(node).at[0]
      assert.ok(spec.objects.some(object => object.id.startsWith('scope-leader-') && object.from[0] === x && object.to[0] === x && object.from[1] === leftNode[1] - 18 && object.to[1] === scope.from[1]))
    }
  } else {
    assert.equal(scope.from[0] - leftNode[0], 18)
    assert.equal(rightNode[0] - scope.to[0], 18)
    assert.equal(scope.from[1], leftNode[1])
    assert.equal(scope.to[1], rightNode[1])
  }
}
const expectedLabels = spec.objects.filter(object => object.type === 'text').map(object => object.text)
const expectedArrowheads = geometry.currents.length + geometry.scopes.length * 2
const expectedNodeCounts = { 'fig-173': 3, 'fig-174': 2, 'fig-175': 0, 'fig-176': 2 }
assert.equal(geometry.nodes.length, expectedNodeCounts[id])
assert.deepEqual(spec.display.widths, [640, 331, 342])
const source = read(path.join(own, 'source-inventory.json')).figures[id]
assert.equal(geometry.currents.length, source.annotations.currents.length)
assert.equal(geometry.scopes.length, source.annotations.voltageScopes.length)
const topologyAssertions = {
  status: 'pass', method: 'Wire endpoint union/find plus component pin geometry. Voltage/current annotation objects excluded from conductive graph. No bypass; series net order or common parallel nodes asserted.',
  topology, nets, components, wires: wireAssertions, sourceFacts: source,
  nodeCount: geometry.nodes.length, currents: geometry.currents, nonconductiveScopes: geometry.scopes,
  spec: bind(specFile), geometry: bind(path.join(own, id, 'geometry.json')),
}
fs.writeFileSync(path.join(out, 'author-assertions.json'), `${JSON.stringify(topologyAssertions, null, 2)}\n`, { flag: 'wx' })
const executablePath = [process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH, process.env.CHROME_PATH, chromium.executablePath(), '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].filter(Boolean).find(file => fs.existsSync(file))
assert.ok(executablePath)
delete process.env.PWDEBUG
const browser = await chromium.launch({ executablePath, headless: true })
const checks = []
try {
  for (const width of spec.display.widths) {
    const context = await browser.newContext({ viewport: { width, height: Math.ceil(width * spec.canvas.height / spec.canvas.width) }, deviceScaleFactor: 1 })
    try {
      const page = await context.newPage()
      const errors = []
      page.on('pageerror', error => errors.push(error.message))
      await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:white}svg{display:block;width:${width}px;height:auto}</style></head><body>${fs.readFileSync(svgFile, 'utf8')}</body></html>`)
      const metrics = await page.locator('svg').evaluate(async (svg, components) => {
        const rect = svg.getBoundingClientRect()
        const labels = [...svg.querySelectorAll('text')].map(node => {
          const matrix = node.getScreenCTM(), box = node.getBoundingClientRect()
          return { text: node.textContent, actualFontPx: Number(node.getAttribute('font-size')) * Math.hypot(matrix.a, matrix.b),
            box: { x: box.x, y: box.y, width: box.width, height: box.height } }
        })
        const overlaps = []
        labels.forEach((a, index) => labels.slice(index + 1).forEach(b => {
          if (Math.min(a.box.x + a.box.width, b.box.x + b.box.width) > Math.max(a.box.x, b.box.x) + 0.1 &&
            Math.min(a.box.y + a.box.height, b.box.y + b.box.height) > Math.max(a.box.y, b.box.y) + 0.1) overlaps.push([a.text, b.text])
        }))
        const visible = [...svg.querySelectorAll('line,path,polygon,ellipse,circle,rect,text')]
          .filter(node => !node.closest('defs') && getComputedStyle(node).visibility !== 'hidden' && getComputedStyle(node).display !== 'none')
        const outside = visible.filter(node => {
          const box = node.getBoundingClientRect()
          return box.left < -0.5 || box.top < -0.5 || box.right > rect.width + 0.5 || box.bottom > rect.height + 0.5
        }).map(node => node.id || node.getAttribute('data-label-id'))
        const nonsemantic = visible.flatMap(node => ['stroke', 'fill'].map(name => ({ id: node.id, name, value: node.getAttribute(name) })))
          .filter(item => item.value && !['none', 'transparent'].includes(item.value) && !item.value.startsWith('var(--ld-figure-'))
        const heads = [...svg.querySelectorAll('[data-arrowhead-for]')].map(node => ({ line: node.getAttribute('data-arrowhead-for'), explicit: node.children.length > 0 }))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(rect.width); canvas.height = Math.ceil(rect.height)
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = 'white'; ctx.fillRect(0, 0, canvas.width, canvas.height)
        const image = new Image()
        image.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(new XMLSerializer().serializeToString(svg))))}`
        await image.decode()
        ctx.drawImage(image, 0, 0, canvas.width, rect.height)
        const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data
        const dark = (x, y) => { const i = (y * canvas.width + x) * 4; return pixels[i] < 190 && pixels[i + 1] < 190 && pixels[i + 2] < 190 }
        let darkPixels = 0, borderDarkPixels = 0
        for (let y = 0; y < canvas.height; y++) for (let x = 0; x < canvas.width; x++) if (dark(x, y)) {
          darkPixels++; if (x < 2 || y < 2 || x >= canvas.width - 2 || y >= canvas.height - 2) borderDarkPixels++
        }
        const componentPixels = components.map(component => {
          const symbol = document.getElementById(`ld-${component.id}`)
          const group = symbol?.querySelector('ellipse,path,polygon') || symbol
          const box = group?.getBoundingClientRect()
          if (!box) return { id: component.id, present: false, darkPixels: 0 }
          let count = 0
          for (let y = Math.max(0, Math.floor(box.top)); y < Math.min(canvas.height, Math.ceil(box.bottom)); y++)
            for (let x = Math.max(0, Math.floor(box.left)); x < Math.min(canvas.width, Math.ceil(box.right)); x++) if (dark(x, y)) count++
          return { id: component.id, present: true, darkPixels: count }
        })
        return { mediaWidth: rect.width, mediaHeight: rect.height, labels, overlaps, outside, nonsemantic, heads, darkPixels, borderDarkPixels, componentPixels, totalPixels: canvas.width * canvas.height }
      }, geometry.components)
      const preview = path.join(out, `width-${width}.png`)
      assert.ok(!fs.existsSync(preview))
      await page.locator('svg').screenshot({ path: preview, animations: 'disabled' })
      const failures = []
      if (Math.abs(metrics.mediaWidth - width) > 0.01) failures.push('Incorrect actual media width')
      if (JSON.stringify(metrics.labels.map(label => label.text).sort()) !== JSON.stringify(expectedLabels.slice().sort())) failures.push('Missing/extra label')
      if (metrics.labels.some(label => label.actualFontPx < 16)) failures.push('Actual glyph size below 16px')
      if (metrics.overlaps.length) failures.push('Label overlap')
      if (metrics.outside.length) failures.push('Out-of-canvas geometry')
      if (metrics.nonsemantic.length) failures.push('Nonsemantic paint')
      if (metrics.heads.length !== expectedArrowheads || metrics.heads.some(head => !head.explicit)) failures.push('Missing/extra arrowhead')
      if (metrics.darkPixels < 300 || metrics.darkPixels > metrics.totalPixels * 0.25) failures.push('Blank/black raster')
      if (metrics.borderDarkPixels !== 0) failures.push('Clipped raster border')
      if (metrics.componentPixels.some(component => !component.present || component.darkPixels < 20)) failures.push('Missing component raster')
      if (errors.length) failures.push('Browser error')
      const header = fs.readFileSync(preview).subarray(0, 24)
      checks.push({ widthPx: width, status: failures.length ? 'fail' : 'pass', failures, preview: bind(preview),
        dimensionsPx: [header.readUInt32BE(16), header.readUInt32BE(20)], metrics, errors })
    } finally { await context.close() }
  }
} finally { await browser.close() }
const status = checks.every(check => check.status === 'pass') ? 'pass' : 'fail'
fs.writeFileSync(path.join(out, 'width-previews.json'), `${JSON.stringify({
  schema: 'ld-s10y-image/author-width-previews@1', figure: id, attempt, status,
  method: 'Exact final native SVG at 640/331/342 actual CSS pixels, deviceScaleFactor=1. Glyph transforms, explicit arrowheads, overlaps, semantic paints, component pixels, nonblank raster and borders measured once. This is author evidence only, not acceptance or independent review.',
  browserPolicy: { headless: true, persistentProfile: false, CDP: false, systemInput: false, allContextsAndBrowserClosed: true },
  browser: { executablePath, packageVersion: require('playwright-core/package.json').version },
  tool: bind(fileURLToPath(import.meta.url)), spec: bind(specFile), render: bind(renderFile), svg: bind(svgFile),
  authorAssertions: bind(path.join(out, 'author-assertions.json')), checks,
}, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify({ figure: id, status, checks: checks.map(check => ({ width: check.widthPx, status: check.status, failures: check.failures, minTextPx: Math.min(...check.metrics.labels.map(label => label.actualFontPx)), componentPixels: check.metrics.componentPixels })) }))
process.exitCode = status === 'pass' ? 0 : 2
