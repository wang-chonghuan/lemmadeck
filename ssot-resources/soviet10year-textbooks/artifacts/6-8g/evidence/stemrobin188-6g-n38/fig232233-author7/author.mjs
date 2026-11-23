import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'

const cwd = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188'
assert.equal(process.cwd(), cwd)
const root = path.join(cwd, '.intentfold/tickets/STEMROBIN-188/tmp/n38-fig232233-author7')
const durable = 'ssot-resources/soviet10year-textbooks/artifacts/6-8g/editions/modern-us-neutral/figures'
const originals = 'ssot-resources/soviet10year-textbooks/artifacts/6-8g/figures'
const textRoot = '.tmp/ld-s10y-lesson/adapt/6-8g/modern-us-neutral/lessons/geo68-c3-s2-n38'
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const save = (file, value) => fs.writeFileSync(path.join(root, file), `${JSON.stringify(value, null, 2)}\n`)
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'))
const bindings = {
  [`${originals}/fig-232.png`]: 'd27c7f9fc754bc2e9f761a07ff582b3ee7eed84e2baf160319e97d225f544a42',
  [`${originals}/fig-233.png`]: '9a154605af91a9da0d4ffc8425420a6e56331ab74d26f8d28d6697d8e2397a0c',
  [`${textRoot}/lesson.template.json`]: '9f61dabc64e3545533685aa2026402ccc7431ca42e78d791532b7c264bae5d9b',
  [`${textRoot}/exercises.template.json`]: 'ebb0a3a864771163705b9c6f441deedbab5d1e611992e63439da11c328784f60',
  [path.join(root, 'SOURCE-INVENTORY.md')]: 'da139e8141abc5a58dbea39d87fd8863f8d565bdb914c40021501ec0edc3fcb0',
}
for (const [file, expected] of Object.entries(bindings)) assert.equal(hash(file), expected, file)
assert.equal(fs.statSync(path.join(root, 'SOURCE-INVENTORY.md')).mode & 0o777, 0o444)

const lesson = JSON.parse(fs.readFileSync(`${textRoot}/lesson.template.json`, 'utf8'))
const exercises = JSON.parse(fs.readFileSync(`${textRoot}/exercises.template.json`, 'utf8'))
assert.equal(exercises.exercises.filter(ex => ex.figure_refs.some(id => ['fig-232', 'fig-233'].includes(id))).length, 0)
const relevant = lesson.prose.slice(1, 17).filter(item => item.text && !['fig', 'cap'].includes(item.kind))
const base = id => ({
  schema: 'ld-s10y-image/figure-spec@2',
  id, mode: 'deterministic',
  description: id === 'fig-232'
    ? 'Convex polygon interior and exterior angle context; retain hatching, extensions and unresolved source label slots.'
    : 'Triangle with parallel line through C, both extended sides and numbered sectors 1-6; no added equations or angle values.',
  source: {
    image: { path: `${originals}/${id}.png`, sha256: bindings[`${originals}/${id}.png`] },
    authoritativeText: relevant.map(item => ({ lesson: lesson.id, text: item.text })),
    inventory: [],
  },
  canvas: { width: 640, height: id === 'fig-232' ? 520 : 500, boundingBox: [0, id === 'fig-232' ? 520 : 500, 640, 0], background: 'paper', keepAspectRatio: true },
  display: { purpose: 'instructional', layout: 'inline', maxWidthPx: 640, minTextPx: 16, widths: [294, 310, 346, 358, 640] },
  layout: { minLabelGap: 8 },
  objects: [], assertions: [],
})
const position = (spec, id) => spec.objects.find(object => object.id === id).at
const point = (spec, id, at, label, side, offset) => spec.objects.push({
  id, type: 'point', at, visible: false,
  ...(label ? { label, fontSize: 36, labelPlacement: { position: side, ...(offset ? { offset } : {}) } } : {}),
})
const segment = (spec, id, from, to, style = {}) => {
  spec.objects.push({ id, type: 'segment', from, to, stroke: 'ink', strokeWidth: 3.5, ...style })
  spec.assertions.push({ id: `${id}-connects`, type: 'connects', arrow: id, from, to })
}
const displacement = (spec, from, to, id) => {
  const a = position(spec, from), b = position(spec, to)
  spec.assertions.push({ id, type: 'displacement', from, to, dx: b[0] - a[0], dy: b[1] - a[1] })
}
const group = (spec, id, description, objects, assertions, requires = []) =>
  spec.source.inventory.push({ id, description, objects, assertions, ...(requires.length ? { requires } : {}) })
const rayPoint = (center, target, radius) => {
  const dx = target[0] - center[0], dy = target[1] - center[1], len = Math.hypot(dx, dy)
  return [center[0] + radius * dx / len, center[1] + radius * dy / len]
}
const arc = (spec, id, center, from, to, radius) => {
  const at = position(spec, center), a = position(spec, from), b = position(spec, to)
  const start = rayPoint(at, a, radius), end = rayPoint(at, b, radius)
  spec.objects.push({ id, type: 'arc', center, start, end, stroke: 'ink', strokeWidth: 2.8 })
  const ids = []
  for (const [role, p, target] of [['start', start, from], ['end', end, to]]) {
    ids.push(`${id}-${role}-circle`, `${id}-${role}-ray`)
    spec.assertions.push(
      { id: `${id}-${role}-circle`, type: 'pointOnCircle', point: p, center, radius },
      { id: `${id}-${role}-ray`, type: 'pointOnLine', point: p, a: center, b: target },
    )
  }
  return ids
}

function figure232() {
  const spec = base('fig-232')
  const vertices = [
    ['232-A', [215, 85], 'A', 'S'],
    ['232-B', [125, 225], 'B', 'W'],
    ['232-C', [150, 355], '?', 'NW'],
    ['232-D', [325, 410], '?', 'N'],
    ['232-E', [525, 320], '?', 'E'],
    ['232-F', [480, 105], 'F', 'S'],
  ]
  for (const args of vertices) point(spec, ...args)
  const bottomAt = x => [x, 85 + (x - 215) * 20 / 265]
  point(spec, '232-G', bottomAt(45), 'G', 'S')
  point(spec, '232-bottom-right', bottomAt(570))
  point(spec, '232-side-upper-left', [80, 295])
  spec.objects.push({ id: '232-region', type: 'polygon', points: vertices.map(v => v[0]), fillOpacity: 0, opacity: 0 })
  const hatchIds = [], hatchAssertions = []
  // Clip a regularized hatch family to the source-position polygon.
  const polygon = vertices.map(v => v[1])
  for (let i = 0; i < 10; i += 1) {
    const intercept = 25 + i * 30
    const hits = []
    for (let j = 0; j < polygon.length; j += 1) {
      const a = polygon[j], b = polygon[(j + 1) % polygon.length]
      const denominator = b[1] - a[1] - 0.32 * (b[0] - a[0])
      if (Math.abs(denominator) < 1e-9) continue
      const t = (0.32 * a[0] + intercept - a[1]) / denominator
      if (t >= 0 && t <= 1) hits.push([a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])])
    }
    assert.equal(hits.length, 2, `hatch ${i}`)
    hits.sort((a, b) => a[0] - b[0])
    const from = hits[0].map((v, axis) => v * 0.998 + hits[1][axis] * 0.002)
    const to = hits[1].map((v, axis) => v * 0.998 + hits[0][axis] * 0.002)
    const id = `232-hatch-${i + 1}`
    segment(spec, id, from, to, { stroke: 'muted', strokeWidth: 1.6 })
    hatchIds.push(id)
    hatchAssertions.push(`${id}-connects`, `${id}-parallel`, `${id}-from-inside`, `${id}-to-inside`)
    spec.assertions.push(
      { id: `${id}-parallel`, type: 'parallel', a: from, b: to, c: [0, 0], d: [100, 32] },
      { id: `${id}-from-inside`, type: 'inside', point: from, container: '232-region' },
      { id: `${id}-to-inside`, type: 'inside', point: to, container: '232-region' },
    )
  }
  const edgeIds = [], edgeAssertions = []
  for (let i = 0; i < vertices.length; i += 1) {
    const from = vertices[i][0], to = vertices[(i + 1) % vertices.length][0]
    const id = `232-edge-${i + 1}`
    segment(spec, id, from, to)
    displacement(spec, from, to, `${id}-placement`)
    edgeIds.push(id)
    edgeAssertions.push(`${id}-connects`, `${id}-placement`)
  }
  segment(spec, '232-bottom-left-extension', '232-G', '232-A')
  segment(spec, '232-bottom-right-extension', '232-F', '232-bottom-right')
  segment(spec, '232-upper-left-extension', '232-B', '232-side-upper-left')
  spec.assertions.push(
    { id: '232-bottom-collinear', type: 'collinear', a: '232-G', b: '232-A', c: '232-F' },
    { id: '232-bottom-right-collinear', type: 'pointOnLine', point: '232-bottom-right', a: '232-A', b: '232-F' },
    { id: '232-side-collinear', type: 'pointOnLine', point: '232-side-upper-left', a: '232-A', b: '232-B' },
  )
  displacement(spec, '232-A', '232-B', '232-side-AB-placement')
  const arcAssertions = arc(spec, '232-interior-arc', '232-A', '232-F', '232-B', 75)
  group(spec, '232-boundary', 'One convex six-sided boundary. Labels A/B/F derive from prose; other source label slots remain ?. No original code decoded.', [...vertices.map(v => v[0]), ...edgeIds], edgeAssertions, ['pointRelationships'])
  group(spec, '232-extensions', 'Bottom side extends on both sides, and lower-left side continues upward-left; G is the opposite ray of AF.', ['232-G', '232-A', '232-B', '232-F', '232-bottom-left-extension', '232-bottom-right-extension', '232-upper-left-extension'], ['232-bottom-collinear', '232-side-collinear', '232-side-AB-placement', '232-bottom-right-collinear', '232-bottom-left-extension-connects', '232-bottom-right-extension-connects', '232-upper-left-extension-connects'], ['pointRelationships'])
  group(spec, '232-angle', 'Visible interior curved stroke at A. Fine arc-mark role UNKNOWN; no exterior curve invented.', ['232-interior-arc'], arcAssertions)
  group(spec, '232-hatch', 'Repeated rising oblique hatch strokes clipped inside polygon; ten is readable modern regularization, exact scan stroke count UNKNOWN.', hatchIds, hatchAssertions)
  return spec
}

function figure233() {
  const spec = base('fig-233')
  const vertices = [
    ['233-A', [90, 75], 'A', 'SW'],
    ['233-B', [550, 75], 'B', 'SE'],
    ['233-C', [335, 310], 'C', 'SE', [22, 28]],
    ['233-M', [40, 310], 'M', 'N'],
    ['233-N', [600, 310], 'N', 'N'],
    ['233-F', [469.75, 439.25], 'F', 'NE'],
    ['233-H', [244.7, 408.7], '?', 'NW'],
  ]
  for (const args of vertices) point(spec, ...args)
  for (const [id, a, b] of [
    ['233-base', '233-A', '233-B'], ['233-side-left', '233-A', '233-C'],
    ['233-side-right', '233-B', '233-C'], ['233-parallel-left', '233-M', '233-C'],
    ['233-parallel-right', '233-C', '233-N'], ['233-extension-right', '233-C', '233-F'],
    ['233-extension-left', '233-C', '233-H'],
  ]) segment(spec, id, a, b)
  spec.assertions.push(
    { id: '233-ACF-collinear', type: 'collinear', a: '233-A', b: '233-C', c: '233-F' },
    { id: '233-BCH-collinear', type: 'collinear', a: '233-B', b: '233-C', c: '233-H' },
    { id: '233-MCN-collinear', type: 'collinear', a: '233-M', b: '233-C', c: '233-N' },
    { id: '233-AB-MN-parallel', type: 'parallel', a: '233-A', b: '233-B', c: '233-M', d: '233-N' },
  )
  for (const [id] of vertices.slice(1)) displacement(spec, '233-A', id, `${id}-placement`)
  const frameObjects = spec.objects.map(object => object.id)
  group(spec, '233-frame', 'One triangle, one parallel horizontal through C, both sides extended above C; modern roles A/B/C/M/N/F from prose and one unresolved ? label slot.', frameObjects, spec.assertions.map(item => item.id), ['pointRelationships'])
  const sectors = [
    [1, '233-A', '233-B', '233-C', [45], 104],
    [2, '233-C', '233-A', '233-B', [54, 65], 101],
    [3, '233-B', '233-C', '233-A', [40, 51, 62], 105],
    [4, '233-C', '233-N', '233-F', [45], 109],
    [5, '233-C', '233-F', '233-H', [54, 65], 106],
    [6, '233-C', '233-H', '233-M', [40, 51, 62], 106],
  ]
  for (const [n, center, from, to, radii, labelRadius] of sectors) {
    const at = position(spec, center), a = position(spec, from), b = position(spec, to)
    const thetaA = Math.atan2(a[1] - at[1], a[0] - at[0])
    const thetaB = Math.atan2(b[1] - at[1], b[0] - at[0])
    const turn = (thetaB - thetaA + 2 * Math.PI) % (2 * Math.PI)
    assert(turn > 0 && turn < Math.PI)
    const theta = thetaA + turn / 2
    const labelAt = [at[0] + labelRadius * Math.cos(theta), at[1] + labelRadius * Math.sin(theta)]
    const region = `233-sector${n}-region`, label = `233-sector${n}`
    spec.objects.push({ id: region, type: 'polygon', points: [at, rayPoint(at, a, 165), rayPoint(at, b, 165)], fillOpacity: 0, opacity: 0 })
    const arcIds = [], assertionIds = []
    for (let i = 0; i < radii.length; i += 1) {
      const id = `233-sector${n}-arc-${i + 1}`
      arcIds.push(id)
      assertionIds.push(...arc(spec, id, center, from, to, radii[i]))
    }
    spec.objects.push({ id: label, type: 'text', at: labelAt, text: String(n), fontSize: 36, labelPlacement: { position: 'CENTER' } })
    spec.assertions.push({ id: `${label}-inside-sector`, type: 'inside', point: label, container: region, margin: 13 })
    group(spec, `233-sector-${n}`, `Number ${n} and curved strokes in its source-position sector. Arc-mark meaning UNKNOWN${n === 6 ? '; fine multiplicity UNKNOWN, three-stroke candidate provisional' : ''}.`, [label, ...arcIds], [...assertionIds, `${label}-inside-sector`])
  }
  return spec
}

function command(executable, argv, name) {
  const result = spawnSync(executable, argv, { cwd, encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 })
  fs.writeFileSync(path.join(root, `${name}.stdout.txt`), result.stdout || '')
  fs.writeFileSync(path.join(root, `${name}.stderr.txt`), result.stderr || '')
  save(`${name}.execution.json`, {
    cwd, executable, argv, exitCode: result.status, signal: result.signal,
    error: result.error?.message || null,
    streams: {
      stdout: { path: `${name}.stdout.txt`, sha256: hash(path.join(root, `${name}.stdout.txt`)) },
      stderr: { path: `${name}.stderr.txt`, sha256: hash(path.join(root, `${name}.stderr.txt`)) },
    },
  })
  console.log(JSON.stringify({ executable, argv, exitCode: result.status, stdout: result.stdout, stderr: result.stderr }))
  assert.equal(result.status, 0, name)
}

function supplemental(spec) {
  const get = id => spec.objects.find(object => object.id === id)
  const pos = value => typeof value === 'string' ? get(value).at : value
  const checks = []
  const check = (name, condition) => { assert(condition, name); checks.push({ name, status: 'pass' }) }
  check('no hand svg, axes, grids, equations or computed angle values', spec.objects.every(o => !['svgPath', 'axis', 'grid'].includes(o.type)) && spec.objects.filter(o => o.type === 'text').every(o => /^[1-6]$/.test(o.text)))
  check('inline instructional width contract and min text', spec.display.purpose === 'instructional' && spec.display.layout === 'inline' && JSON.stringify(spec.display.widths) === '[294,310,346,358,640]' && spec.objects.filter(o => o.label || o.type === 'text').every(o => o.fontSize * 294 / 640 >= 16))
  if (spec.id === 'fig-232') {
    check('exact authoritative roles plus unresolved slots', ['A', 'B', '?', '?', '?', 'F', 'G'].every((label, i) => get(`232-${['A', 'B', 'C', 'D', 'E', 'F', 'G'][i]}`).label === label))
    const ids = ['A', 'B', 'C', 'D', 'E', 'F'].map(id => `232-${id}`)
    const points = ids.map(id => get(id).at)
    const crosses = points.map((a, i) => {
      const b = points[(i + 1) % 6], c = points[(i + 2) % 6]
      return (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0])
    })
    check('six-sided convex source order', crosses.every(v => v < 0) || crosses.every(v => v > 0))
    const interior = get('232-interior-arc')
    check('arc bounds interior rays AF to AB', interior.center === '232-A' && get('232-A').at[0] < get('232-F').at[0] && interior.start[0] > get('232-A').at[0] && interior.end[0] < get('232-A').at[0])
    check('hatch family is present, not an excluded detail', spec.objects.filter(o => /^232-hatch-\d+$/.test(o.id)).length === 10)
    check('all three source extensions present', ['232-bottom-left-extension', '232-bottom-right-extension', '232-upper-left-extension'].every(id => get(id)?.type === 'segment'))
    check('source extension directions and ordering', get('232-G').at[0] < get('232-A').at[0] && get('232-bottom-right').at[0] > get('232-F').at[0] && get('232-side-upper-left').at[0] < get('232-B').at[0] && get('232-side-upper-left').at[1] > get('232-B').at[1])
  } else {
    check('exact authoritative letter roles and one unresolved slot', ['A', 'B', 'C', 'M', 'N', 'F'].every(id => get(`233-${id}`).label === id) && get('233-H').label === '?')
    const rays = [
      [1, 'A', 'B', 'C', [45]], [2, 'C', 'A', 'B', [54, 65]],
      [3, 'B', 'C', 'A', [40, 51, 62]], [4, 'C', 'N', 'F', [45]],
      [5, 'C', 'F', 'H', [54, 65]], [6, 'C', 'H', 'M', [40, 51, 62]],
    ]
    check('all six numbered labels, once each', spec.objects.filter(o => o.type === 'text').length === 6 && rays.every(([n]) => get(`233-sector${n}`).text === String(n)))
    for (const [n, c, a, b, radii] of rays) {
      const center = pos(`233-${c}`), from = pos(`233-${a}`), to = pos(`233-${b}`)
      const theta = p => Math.atan2(p[1] - center[1], p[0] - center[0])
      const turn = p => (theta(p) - theta(from) + 2 * Math.PI) % (2 * Math.PI)
      check(`sector ${n} label strictly between its required directed rays`, turn(get(`233-sector${n}`).at) > 0 && turn(get(`233-sector${n}`).at) < turn(to))
      check(`sector ${n} arc count preserves provisional source marks`, spec.objects.filter(o => o.type === 'arc' && o.id.startsWith(`233-sector${n}-arc-`)).length === radii.length)
      for (let i = 0; i < radii.length; i += 1) {
        const object = get(`233-sector${n}-arc-${i + 1}`)
        check(`${object.id} center and positive start/end ray orientation`,
          object.center === `233-${c}` &&
          Math.hypot(...object.start.map((v, axis) => v - rayPoint(center, from, radii[i])[axis])) < 1e-7 &&
          Math.hypot(...object.end.map((v, axis) => v - rayPoint(center, to, radii[i])[axis])) < 1e-7)
      }
    }
    check('F and unresolved upper-left endpoint extend beyond C', get('233-F').at[0] > get('233-C').at[0] && get('233-F').at[1] > get('233-C').at[1] && get('233-H').at[0] < get('233-C').at[0] && get('233-H').at[1] > get('233-C').at[1])
    check('upper extension lengths remain unequal', Math.abs(Math.hypot(...get('233-F').at.map((v, i) => v - get('233-C').at[i])) - Math.hypot(...get('233-H').at.map((v, i) => v - get('233-C').at[i]))) > 10)
  }
  return { status: 'pass', approval: 'AUTHOR_ONLY', spec: { path: `${spec.id}.spec.json`, sha256: hash(path.join(root, `${spec.id}.spec.json`)) }, checks }
}

async function previews() {
  const require = createRequire(path.join(cwd, '.agents/skills/package.json'))
  const { chromium } = require('playwright-core')
  const executablePath = [chromium.executablePath(), '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find(file => fs.existsSync(file))
  assert(executablePath, 'existing Chromium executable')
  const browser = await chromium.launch({ executablePath, headless: true })
  try {
    const checks = []
    for (const id of ['fig-232', 'fig-233']) {
      const spec = read(`${id}.spec.json`)
      const svg = fs.readFileSync(path.join(root, `${id}.svg`), 'utf8')
      for (const width of [640, 294, 310, 346, 358]) {
        const height = Math.round(spec.canvas.height * width / spec.canvas.width)
        const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 })
        await page.setContent(`<html><head><style>html,body{margin:0;background:white}svg{display:block;width:${width}px;height:${height}px}</style></head><body>${svg}</body></html>`)
        const result = await page.evaluate(async ({ width, height }) => {
          const svg = document.querySelector('svg'), serialized = new XMLSerializer().serializeToString(svg)
          const image = new Image()
          image.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(serialized)))}`
          await image.decode()
          const canvas = document.createElement('canvas')
          canvas.width = width; canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, width, height)
          ctx.drawImage(image, 0, 0, width, height)
          const pixels = ctx.getImageData(0, 0, width, height).data
          let ink = 0, black = 0
          for (let i = 0; i < pixels.length; i += 4) {
            if (Math.min(pixels[i], pixels[i + 1], pixels[i + 2]) < 230) ink += 1
            if (Math.max(pixels[i], pixels[i + 1], pixels[i + 2]) < 50) black += 1
          }
          return { inkPixels: ink, totalPixels: width * height, blackFraction: black / (width * height), text: [...svg.querySelectorAll('text')].map(node => node.textContent), finalTextPx: [...svg.querySelectorAll('text')].map(node => Number(node.getAttribute('font-size')) * width / 640) }
        }, { width, height })
        assert(result.inkPixels > 300, `${id} ${width}: nonblank`)
        assert(result.blackFraction < 0.2, `${id} ${width}: not black raster`)
        assert(result.finalTextPx.every(px => px >= 16), `${id} ${width}: text size`)
        if (id === 'fig-233') assert(['1', '2', '3', '4', '5', '6'].every(label => result.text.includes(label)))
        const png = `${id}.width-${width}.png`
        await page.screenshot({ path: path.join(root, png), type: 'png' })
        checks.push({ id, width, height, ...result, status: 'pass', png: { path: png, sha256: hash(path.join(root, png)) } })
        await page.close()
      }
    }
    save('PREVIEW-CHECKS.json', { status: 'pass', approval: 'AUTHOR_ONLY', browser: executablePath, method: 'Rasterize unchanged native SVG at every declared CSS width; nonblank/not-black/text checks. Generated files are not context image loads.', checks })
    console.log(JSON.stringify({ status: 'pass', checks: checks.length }))
  } finally {
    await browser.close()
  }
}

const action = process.argv[2]
if (action === 'draft') {
  for (const spec of [figure232(), figure233()]) {
    const file = `${spec.id}.spec.json`
    assert(!fs.existsSync(path.join(root, file)), `${file}: never overwrite a prior attempt`)
    save(file, spec)
    save(`${spec.id}.supplemental.json`, supplemental(spec))
  }
  console.log('DRAFT: two source-inventory-bound FigureSpecs and supplemental author checks')
} else if (action === 'repair-labels') {
  for (const id of ['fig-232', 'fig-233']) {
    for (const suffix of ['spec.json', 'supplemental.json', 'svg', 'full.png']) {
      const file = `${id}.${suffix}`
      if (!fs.existsSync(path.join(root, file))) continue
      const snapshot = `${id}.attempt1.${suffix}`
      assert(!fs.existsSync(path.join(root, snapshot)), snapshot)
      fs.copyFileSync(path.join(root, file), path.join(root, snapshot))
    }
    const spec = read(`${id}.spec.json`)
    for (const object of spec.objects) {
      if (object.label) object.labelPlacement.gap = 40
      if (object.type === 'polygon' && object.opacity === 0) object.strokeWidth = 1
      if (object.id === '233-F') object.labelPlacement = { position: 'E', gap: 40 }
      if (object.id === '233-C') object.labelPlacement = { position: 'E', gap: 85, offset: [0, 20] }
    }
    save(`${id}.spec.json`, spec)
    save(`${id}.supplemental.json`, supplemental(spec))
  }
  console.log('REPAIR: label clearance only; failed figure232 bytes and unrendered figure233 draft retained')
} else if (action === 'repair-sector5') {
  const id = 'fig-233'
  for (const suffix of ['spec.json', 'supplemental.json']) {
    const snapshot = `${id}.attempt1.validation-fail.${suffix}`
    assert(!fs.existsSync(path.join(root, snapshot)), snapshot)
    fs.copyFileSync(path.join(root, `${id}.${suffix}`), path.join(root, snapshot))
  }
  const spec = read(`${id}.spec.json`)
  const label = spec.objects.find(o => o.id === '233-sector5')
  const center = position(spec, '233-C')
  label.at = label.at.map((v, axis) => center[axis] + (v - center[axis]) * 100 / 106)
  save(`${id}.spec.json`, spec)
  save(`${id}.supplemental.json`, supplemental(spec))
  console.log('REPAIR: sector5 label moved 6 canvas px inward; margin assertion unchanged; failure retained')
} else if (action === 'repair-C') {
  const id = 'fig-233'
  for (const suffix of ['spec.json', 'supplemental.json', 'svg', 'full.png']) {
    const snapshot = `${id}.attempt2.${suffix}`
    assert(!fs.existsSync(path.join(root, snapshot)), snapshot)
    fs.copyFileSync(path.join(root, `${id}.${suffix}`), path.join(root, snapshot))
  }
  const spec = read(`${id}.spec.json`)
  spec.objects.find(o => o.id === '233-C').labelPlacement.offset = [0, 45]
  save(`${id}.spec.json`, spec)
  save(`${id}.supplemental.json`, supplemental(spec))
  console.log('REPAIR: C label moved below horizontal stroke; source coordinate and all assertions unchanged; failure retained')
} else if (action === 'complete-extension-assertions') {
  const id = 'fig-232'
  for (const suffix of ['spec.json', 'supplemental.json', 'svg', 'full.png']) {
    const snapshot = `${id}.attempt2.${suffix}`
    assert(!fs.existsSync(path.join(root, snapshot)), snapshot)
    fs.copyFileSync(path.join(root, `${id}.${suffix}`), path.join(root, snapshot))
  }
  const spec = read(`${id}.spec.json`)
  const additions = [
    ['232-A', '232-G', '232-left-extension-direction'],
    ['232-F', '232-bottom-right', '232-right-extension-direction'],
    ['232-B', '232-side-upper-left', '232-upper-left-extension-direction'],
  ]
  for (const [from, to, assertion] of additions) {
    displacement(spec, from, to, assertion)
    spec.source.inventory.find(g => g.id === '232-extensions').assertions.push(assertion)
  }
  save(`${id}.spec.json`, spec)
  save(`${id}.supplemental.json`, supplemental(spec))
  console.log('ASSERTIONS: completed extension direction mapping; no geometry, label or display changes')
} else if (action === 'render') {
  const ids = process.argv[3] ? [process.argv[3]] : ['fig-232', 'fig-233']
  const attempt = process.argv[4] || '1'
  for (const id of ids) {
    assert(['fig-232', 'fig-233'].includes(id))
    const spec = path.join(root, `${id}.spec.json`)
    assert(!fs.existsSync(path.join(root, `${id}.attempt${attempt}.render.execution.json`)), 'never overwrite an execution')
    command('python3', ['.agents/skills/ld-s10y-image/scripts/validate_spec.py', spec, '--stage', 'draft', '--json'], `${id}.attempt${attempt}.validate`)
    command('node', ['.agents/skills/ld-s10y-image/scripts/render_spec.mjs', '--spec', spec, '--svg', path.join(root, `${id}.svg`), '--png', path.join(root, `${id}.full.png`), '--report', path.join(root, `${id}.attempt${attempt}.native-render.json`)], `${id}.attempt${attempt}.render`)
    const report = read(`${id}.attempt${attempt}.native-render.json`)
    assert.equal(report.status, 'pass')
    assert.equal(report.output.svg.sha256, hash(path.join(root, `${id}.svg`)))
    // Rebind destination names only; retain the untouched native report beside it.
    report.spec.path = `${durable}/${id}.spec.json`
    report.output.svg.path = `${durable}/${id}.svg`
    save(`${id}.render.json`, report)
  }
} else if (action === 'preview') {
  await previews()
} else if (action === 'seal') {
  const imageLoads = [
    { load: 1, path: `${originals}/fig-232.png`, kind: 'original', sha256: bindings[`${originals}/fig-232.png`] },
    { load: 2, path: `${originals}/fig-233.png`, kind: 'original', sha256: bindings[`${originals}/fig-233.png`] },
    ...['fig-232.full.png', 'fig-233.full.png', 'fig-232.width-294.png', 'fig-233.width-294.png'].map((file, index) => ({ load: index + 3, path: path.join(root, file), kind: index < 2 ? 'complete full canvas' : 'complete normal width', sha256: hash(path.join(root, file)) })),
  ]
  const files = fs.readdirSync(root).filter(file => !['manifest.json', 'SHA256SUMS'].includes(file)).sort()
  const manifest = {
    schema: 'ld-s10y-image/author-manifest@1',
    ticket: 'STEMROBIN-188', status: 'AUTHOR_ONLY', sourceResolution: 'HOLD_UNRESOLVED_SOURCE',
    independentReview: 'NOT_PERFORMED', canonicalPromotion: false, cwd, ownedroot: root,
    inputBindings: Object.entries(bindings).map(([file, sha256]) => ({ path: path.isAbsolute(file) ? file : path.join(cwd, file), sha256 })),
    sourceInventorySealedBeforeDraft: true,
    unresolved: ['Original alphabet/code/fine glyph/blackbar and arc-mark semantics UNKNOWN.', 'Fig232 three unnamed source label slots and fig233 upper-left label slot are visible ? placeholders.', 'Fig232 exact fine hatch count UNKNOWN; ten strokes are explicit modern regularization.', 'Fig233 sector6 fine arc multiplicity UNKNOWN; three-stroke candidate provisional.'],
    display: { purpose: 'instructional', layout: 'inline', maxWidthPx: 640, widths: [294, 310, 346, 358, 640], minTextPx: 16, measuredMinimum: 16.5375, allWidthsNonblank: true },
    imageUsage: { batch: 1, batchMaximum: 8, contextMaximum: 24, batchLoads: 6, currentContextLoads: 6, reopens: 0, crops: 0, failedPreviewLoads: 0, paidCalls: 0, nativeRasterArtifacts: 15, imageLoads },
    figures: ['fig-232', 'fig-233'].map(id => ({
      id, status: 'AUTHOR_ONLY', nativeValidation: 'pass', nativeRender: 'pass',
      source: `${originals}/${id}.png`,
      files: Object.fromEntries(['spec.json', 'svg', 'render.json', 'full.png', 'width-294.png', 'supplemental.json'].map(suffix => [suffix, { path: path.join(root, `${id}.${suffix}`), sha256: hash(path.join(root, `${id}.${suffix}`)), ...(['spec.json', 'svg', 'render.json'].includes(suffix) ? { eventual: `${durable}/${id}.${suffix}` } : {}) }])),
    })),
    metadataRebinding: 'Only native report spec.path and output.svg.path name eventual durable destinations; untouched native reports retained. No shared/durable output was written. SVG bytes are unmodified native renderer output.',
    commands: files.filter(file => file.endsWith('.execution.json')).map(file => ({ path: path.join(root, file), sha256: hash(path.join(root, file)), ...read(file) })),
    files: files.map(file => ({ path: path.join(root, file), sha256: hash(path.join(root, file)), sealedMode: '0444' })),
  }
  for (const id of ['fig-232', 'fig-233']) {
    const report = read(`${id}.render.json`)
    const native = read(`${id}.attempt3.native-render.json`)
    native.spec.path = `${durable}/${id}.spec.json`
    native.output.svg.path = `${durable}/${id}.svg`
    assert.deepEqual(report, native, 'destination names are the only native metadata changes')
    assert.equal(report.spec.sha256, hash(path.join(root, `${id}.spec.json`)))
    assert.equal(report.output.svg.sha256, hash(path.join(root, `${id}.svg`)))
    assert.equal(report.output.svg.path, `${durable}/${id}.svg`)
    assert.equal(report.status, 'pass')
  }
  assert.equal(hash(path.join(root, 'fig-232.svg')), hash(path.join(root, 'fig-232.attempt2.svg')), 'assertion-only change retains same visual output and preview applicability')
  assert.equal(hash(path.join(root, 'fig-232.full.png')), hash(path.join(root, 'fig-232.attempt2.full.png')), 'assertion-only change retains same full PNG inspection')
  save('manifest.json', manifest)
  const all = [...files, 'manifest.json'].sort()
  fs.writeFileSync(path.join(root, 'SHA256SUMS'), all.map(file => `${hash(path.join(root, file))}  ${file}`).join('\n') + '\n')
  for (const file of [...all, 'SHA256SUMS']) fs.chmodSync(path.join(root, file), 0o444)
  console.log(JSON.stringify({ status: 'AUTHOR_ONLY', root, manifestSha256: hash(path.join(root, 'manifest.json')), recordSha256: hash(path.join(root, 'AUTHOR-RECORD.md')), checksumSha256: hash(path.join(root, 'SHA256SUMS')), sealedFiles: all.length + 1, imageLoads: imageLoads.length }))
} else {
  throw new Error('Unknown bounded author action')
}
