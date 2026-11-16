import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const own = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(own, '../../..')
const require = createRequire(path.join(repo, 'app/package.json'))
const { chromium } = require('playwright')
delete process.env.PWDEBUG
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: path.relative(repo, file), sha256: hash(file) })
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const write = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
const target = process.argv[2] || 'both'
const attempt = process.argv[3] || 'initial'
assert.ok(['both', 'fig-153', 'fig-154'].includes(target))
assert.ok(['initial', 'repair'].includes(attempt))
const figures = target === 'both' ? ['fig-153', 'fig-154'] : [target]
const sourceExpectedLabels = {
  'fig-153': {
    'cap1-label': 'C\u2081', 'cap2-label': 'C\u2082',
    'cap1-positive-charge': '+|q\u2081|', 'cap1-negative-charge': '-|q\u2081|',
    'cap2-positive-charge': '+|q\u2082|', 'cap2-negative-charge': '-|q\u2082|',
  },
  'fig-154': {
    'cap1-label': 'C\u2081', 'cap2-label': 'C\u2082',
    'cap1-positive-charge': '+|q|', 'cap1-negative-charge': '-|q|',
    'cap2-positive-charge': '+|q|', 'cap2-negative-charge': '-|q|',
    'potential-u1': 'U\u2081', 'potential-u2': 'U\u2082', 'potential-u3': 'U\u2083',
  },
}
const sourceExpectedComponents = {
  'fig-153': [
    ['cap1-positive-contact', 'cap2-positive-contact', 'positive-junction', 'positive-outer-terminal'],
    ['cap1-negative-contact', 'cap2-negative-contact', 'negative-junction', 'negative-outer-terminal'],
  ],
  'fig-154': [
    ['cap1-positive-contact', 'left-outer-terminal'],
    ['cap1-negative-contact', 'cap2-positive-contact'],
    ['cap2-negative-contact', 'right-outer-terminal'],
  ],
}
function circuitChecks(figure, spec) {
  const objectMap = new Map(spec.objects.map(object => [object.id, object]))
  const pointMap = new Map(spec.objects.filter(object => object.type === 'point').map(object => [object.id, object.at]))
  const segments = spec.objects.filter(object => object.type === 'segment')
  const nativeConnections = spec.assertions.filter(item => item.type === 'connects')
  const parent = new Map([...pointMap.keys()].map(id => [id, id]))
  const root = id => {
    assert.ok(parent.has(id), `Missing graph endpoint ${id}`)
    if (parent.get(id) !== id) parent.set(id, root(parent.get(id)))
    return parent.get(id)
  }
  const checks = []
  for (const segment of segments) {
    const connection = nativeConnections.find(item => item.arrow === segment.id)
    assert.ok(connection, `Missing native connects for ${segment.id}`)
    assert.equal(connection.from, segment.from)
    assert.equal(connection.to, segment.to)
    assert.ok(pointMap.has(segment.from) && pointMap.has(segment.to))
    parent.set(root(segment.to), root(segment.from))
    checks.push({ id: `${segment.id}-connects-executed`, status: 'pass' })
  }
  assert.equal(nativeConnections.length, segments.length)
  const components = new Map()
  for (const id of pointMap.keys()) {
    const component = root(id)
    if (!components.has(component)) components.set(component, [])
    components.get(component).push(id)
  }
  const expectedComponents = sourceExpectedComponents[figure]
  assert.equal(components.size, expectedComponents.length)
  const roots = expectedComponents.map(component => {
    const first = root(component[0])
    assert.ok(component.every(id => root(id) === first))
    return first
  })
  assert.equal(new Set(roots).size, expectedComponents.length)
  for (const [index, members] of expectedComponents.entries()) {
    checks.push({
      id: figure === 'fig-153' ? `parallel-${index === 0 ? 'positive' : 'negative'}-component`
        : ['series-left-outer-component', 'series-intermediate-component', 'series-right-outer-component'][index],
      members, status: 'pass',
    })
  }
  const plates = segments.filter(item => /-plate$/.test(item.id))
  assert.equal(plates.length, 8)
  for (const cap of ['cap1', 'cap2']) {
    assert.notEqual(root(`${cap}-positive-contact`), root(`${cap}-negative-contact`))
    const positive = pointMap.get(`${cap}-positive-contact`)
    const negative = pointMap.get(`${cap}-negative-contact`)
    assert.ok(negative[0] - positive[0] >= 26)
    assert.equal(positive[1], negative[1])
    for (const polarity of ['positive', 'negative']) {
      const members = ['top', 'contact', 'bottom'].map(location => `${cap}-${polarity}-${location}`)
      assert.ok(members.every(id => root(id) === root(members[0])))
    }
    checks.push({ id: `${cap}-no-plate-short`, status: 'pass' })
  }
  const actualLabels = Object.fromEntries(spec.objects.filter(item => item.type === 'text').map(item => [item.id, item.text]))
  assert.deepEqual(actualLabels, sourceExpectedLabels[figure])
  for (const [id, expected] of Object.entries(sourceExpectedLabels[figure])) {
    checks.push({ id: `${id}-exact`, expected, status: 'pass' })
  }
  const visibleJunctions = spec.objects.filter(item => item.type === 'point' && item.visible !== false).map(item => item.id).sort()
  assert.deepEqual(visibleJunctions, figure === 'fig-153' ? ['negative-junction', 'positive-junction'] : [])
  assert.ok(spec.objects.every(item => ['point', 'segment', 'text'].includes(item.type)))
  if (figure === 'fig-154') {
    const middle = objectMap.get('intermediate-wire')
    assert.equal(middle.from, 'cap1-negative-contact')
    assert.equal(middle.to, 'cap2-positive-contact')
    const intermediate = components.get(root(middle.from))
    assert.equal(intermediate.length, 6)
    const touchingEdges = segments.filter(edge => intermediate.includes(edge.from) || intermediate.includes(edge.to))
    assert.equal(touchingEdges.length, 5)
    assert.deepEqual(touchingEdges.filter(edge => !/-plate$/.test(edge.id)).map(edge => edge.id), ['intermediate-wire'])
    checks.push({ id: 'series-no-intermediate-branch', status: 'pass', intermediateMembers: intermediate, intermediateEdges: touchingEdges.map(edge => edge.id) })
    checks.push({ id: 'series-three-conductors', status: 'pass' })
  } else {
    assert.equal(segments.filter(edge => !/-plate$/.test(edge.id)).length, 10)
  }
  return {
    schema: 'ld-s10y-image/author-circuit-checks@1',
    figure, status: 'pass',
    scope: 'Executable source-inventory label and conductor graph checks, not independent science or image review.',
    conductors: [...components.values()].map(members => members.sort()),
    plates: 4, splitPlateSegments: plates.length,
    visibleJunctions, exactLabels: actualLabels, checks,
    initialNeutralInterpretation: figure === 'fig-154'
      ? 'The intermediate component has no branch. Printed +/-|q| is contextual charged-state information conditional on initially neutral intermediate group and no leakage, as stated in the unchanged full modern lesson. No new charge equation or voltage equality is shown.'
      : 'Positive and negative shared nodes are separate; q_1/q_2 remain distinct rather than equalized.',
  }
}

const executablePath = [
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH, process.env.CHROME_PATH, chromium.executablePath(),
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean).find(file => fs.existsSync(file))
assert.ok(executablePath)
const browser = await chromium.launch({ executablePath, headless: true })
const summary = []
try {
  for (const figure of figures) {
    const out = path.join(own, figure, attempt)
    const specFile = path.join(out, 'spec.json')
    const renderFile = path.join(out, 'render.json')
    const svgFile = path.join(out, `${figure}.svg`)
    const spec = read(specFile)
    const render = read(renderFile)
    assert.equal(render.status, 'pass')
    assert.equal(render.spec.sha256, hash(specFile))
    assert.equal(render.output.svg.sha256, hash(svgFile))
    assert.deepEqual(spec.display, { purpose: 'instructional', layout: 'inline', maxWidthPx: 640, widths: [640, 331, 342], minTextPx: 16 })
    const circuit = circuitChecks(figure, spec)
    write(path.join(out, 'circuit-checks.json'), { ...circuit, spec: bind(specFile), sourceInventory: bind(path.join(own, 'source-inventory.json')) })
    const checks = []
    const errors = []
    try {
      for (const width of spec.display.widths) {
        const context = await browser.newContext({
          viewport: { width, height: Math.ceil(width * spec.canvas.height / spec.canvas.width) },
          deviceScaleFactor: 1,
        })
        try {
          const page = await context.newPage()
          const pageErrors = []
          page.on('pageerror', error => pageErrors.push(error.message))
          await page.setContent(`<!doctype html><html><head><meta charset="utf-8">
            <style>html,body{margin:0;background:white}svg{display:block;width:${width}px;height:auto}</style>
            </head><body>${fs.readFileSync(svgFile, 'utf8')}</body></html>`)
          const metrics = await page.locator('svg').evaluate(async (svg, { width, figure }) => {
            const rect = svg.getBoundingClientRect()
            const labels = [...svg.querySelectorAll('text')].map(node => {
              const matrix = node.getScreenCTM()
              const scale = Math.hypot(matrix.a, matrix.b)
              const box = node.getBoundingClientRect()
              return {
                id: node.getAttribute('data-label-id'), text: node.textContent,
                fontPx: Number.parseFloat(node.getAttribute('font-size')) * scale,
                box: { left: box.left, top: box.top, right: box.right, bottom: box.bottom },
              }
            })
            const visible = [...svg.querySelectorAll('line,path,polygon,ellipse,circle,rect,text')]
              .filter(node => !node.closest('defs') && getComputedStyle(node).visibility !== 'hidden' && getComputedStyle(node).display !== 'none')
            const painted = visible.filter(node => {
              const style = getComputedStyle(node)
              return style.stroke !== 'none' || style.fill !== 'none'
            })
            const outside = painted.filter(node => {
              const box = node.getBoundingClientRect()
              return box.left < -0.5 || box.top < -0.5 || box.right > rect.width + 0.5 || box.bottom > rect.height + 0.5
            }).map(node => node.id || node.getAttribute('data-label-id'))
            const overlaps = []
            for (let i = 0; i < labels.length; i++) {
              for (let j = i + 1; j < labels.length; j++) {
                const a = labels[i].box
                const b = labels[j].box
                if (Math.min(a.right, b.right) > Math.max(a.left, b.left)
                  && Math.min(a.bottom, b.bottom) > Math.max(a.top, b.top)) overlaps.push([labels[i].id, labels[j].id])
              }
            }
            const nonsemanticPaints = painted.flatMap(node => ['stroke', 'fill'].map(name => ({ id: node.id, name, value: node.getAttribute(name) })))
              .filter(item => item.value && !['none', 'transparent'].includes(item.value) && !item.value.startsWith('var(--ld-figure-'))
            const canvas = document.createElement('canvas')
            canvas.width = width
            canvas.height = Math.ceil(rect.height)
            const ctx = canvas.getContext('2d')
            ctx.fillStyle = 'white'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            const image = new Image()
            image.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(new XMLSerializer().serializeToString(svg))))}`
            await image.decode()
            ctx.drawImage(image, 0, 0, width, rect.height)
            const rgba = ctx.getImageData(0, 0, canvas.width, canvas.height).data
            const dark = (x, y) => {
              const offset = (y * canvas.width + x) * 4
              return rgba[offset] < 180 && rgba[offset + 1] < 180 && rgba[offset + 2] < 180
            }
            let darkPixels = 0
            let borderDarkPixels = 0
            for (let y = 0; y < canvas.height; y++) {
              for (let x = 0; x < canvas.width; x++) {
                if (!dark(x, y)) continue
                darkPixels++
                if (x < 2 || y < 2 || x >= canvas.width - 2 || y >= canvas.height - 2) borderDarkPixels++
              }
            }
            const regions = figure === 'fig-153' ? {
              upperCapacitor: [299, 125, 341, 225], lowerCapacitor: [299, 405, 341, 505],
              leftConductor: [112, 171, 128, 459], rightConductor: [512, 171, 528, 459],
              leftTerminalLead: [22, 310, 118, 320], rightTerminalLead: [522, 310, 618, 320],
            } : {
              firstCapacitor: [139, 85, 179, 185], secondCapacitor: [461, 85, 501, 185],
              leftTerminalLead: [22, 131, 145, 139], intermediateWire: [174, 131, 466, 139],
              rightTerminalLead: [495, 131, 618, 139],
            }
            const regionPixels = {}
            const scale = width / 640
            for (const [name, [left, top, right, bottom]] of Object.entries(regions)) {
              let count = 0
              for (let y = Math.floor(top * scale); y < Math.ceil(bottom * scale); y++) {
                for (let x = Math.floor(left * scale); x < Math.ceil(right * scale); x++) if (dark(x, y)) count++
              }
              regionPixels[name] = count
            }
            return { media: { width: rect.width, height: rect.height }, labels, visibleGeometry: painted.length, outside, overlaps, nonsemanticPaints, darkPixels, borderDarkPixels, regionPixels }
          }, { width, figure })
          assert.ok(Math.abs(metrics.media.width - width) < 0.01)
          assert.equal(metrics.labels.length, Object.keys(sourceExpectedLabels[figure]).length)
          assert.deepEqual(Object.fromEntries(metrics.labels.map(label => [label.id.replace(/-label$/, ''), label.text])), sourceExpectedLabels[figure])
          assert.ok(metrics.labels.every(label => label.fontPx >= 16))
          assert.deepEqual(metrics.outside, [])
          assert.deepEqual(metrics.overlaps, [])
          assert.deepEqual(metrics.nonsemanticPaints, [])
          assert.ok(metrics.darkPixels > 750)
          assert.ok(metrics.darkPixels < width * Math.ceil(metrics.media.height) * 0.3)
          assert.equal(metrics.borderDarkPixels, 0)
          assert.ok(Object.values(metrics.regionPixels).every(count => count > 30))
          assert.deepEqual(pageErrors, [])
          const previewFile = path.join(out, `width-${width}.png`)
          assert.ok(!fs.existsSync(previewFile))
          await page.locator('svg').screenshot({ path: previewFile, animations: 'disabled' })
          const header = fs.readFileSync(previewFile).subarray(0, 24)
          assert.equal(header.readUInt32BE(16), width)
          checks.push({
            widthPx: width, status: 'pass', preview: bind(previewFile),
            dimensionsPx: [header.readUInt32BE(16), header.readUInt32BE(20)], metrics, errors: pageErrors,
          })
        } finally {
          await context.close()
        }
      }
    } catch (error) {
      errors.push(error.message)
      throw error
    } finally {
      write(path.join(out, 'width-previews.json'), {
        schema: 'ld-s10y-image/author-width-previews@1',
        figure, attempt, status: errors.length ? 'fail' : 'pass',
        method: 'One isolated headless Playwright invocation; native SVG CSS media widths 640/331/342, live SVG screen text transforms and canvas raster region/border checks. No HTML auto-open, persistent profile, CDP, foreground interaction or system input. PWDEBUG unset. All contexts/pages/browser closed by finally. Not independent image approval or headed product acceptance.',
        executablePath, PWDEBUG: 'unset',
        spec: bind(specFile), render: bind(renderFile), svg: bind(svgFile),
        sourceInventory: bind(path.join(own, 'source-inventory.json')),
        circuitChecks: bind(path.join(out, 'circuit-checks.json')),
        checks, errors,
      })
    }
    summary.push({ figure, attempt, status: 'pass', previews: checks.map(check => ({ widthPx: check.widthPx, ...check.preview, minTextPx: Math.min(...check.metrics.labels.map(label => label.fontPx)) })) })
  }
} finally {
  await browser.close()
}
console.log(JSON.stringify({ status: 'mechanical-preview-pass-not-independent-review', figures: summary }, null, 2))
