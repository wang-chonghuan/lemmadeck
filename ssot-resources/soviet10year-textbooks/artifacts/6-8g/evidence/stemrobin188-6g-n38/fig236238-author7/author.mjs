import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'

const cwd = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188'
assert.equal(process.cwd(), cwd)
const root = path.join(cwd, '.intentfold/tickets/STEMROBIN-188/tmp/n38-fig236238-author7')
const durable = 'ssot-resources/soviet10year-textbooks/artifacts/6-8g/editions/modern-us-neutral/figures'
const textRoot = '.tmp/ld-s10y-lesson/adapt/6-8g/modern-us-neutral/lessons/geo68-c3-s2-n38'
const skill = '.agents/skills/ld-s10y-image'
const widths = [294, 310, 346, 358, 640]
const ids = [236, 237, 238]
const digest = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const load = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const save = (name, value) => fs.writeFileSync(path.join(root, name), JSON.stringify(value, null, 2) + '\n')
const sourceHashes = {
  236: 'ef2a1413c532803c95104ac9f72d40a948da09d0ca374ae83ed1dd68a7cdfcef',
  237: '35cc2da5d1bfb1e6128d655314555f555dc4e807b4e27e744115922ac49afbfe',
  238: '5144e3c7d6b7db54d0ea08d95963e67eb890c310a3b2a342878406ecf5013bfc',
}
const lesson = load(path.join(cwd, textRoot, 'lesson.template.json'))
const exercises = load(path.join(cwd, textRoot, 'exercises.template.json'))
assert.equal(digest(path.join(cwd, textRoot, 'lesson.template.json')), '9f61dabc64e3545533685aa2026402ccc7431ca42e78d791532b7c264bae5d9b')
assert.equal(digest(path.join(cwd, textRoot, 'exercises.template.json')), 'ebb0a3a864771163705b9c6f441deedbab5d1e611992e63439da11c328784f60')
assert.equal(fs.statSync(path.join(root, 'SOURCE-INVENTORY.md')).mode & 0o777, 0o444)
for (const id of ids) {
  assert.equal(digest(path.join(cwd, `ssot-resources/soviet10year-textbooks/artifacts/6-8g/figures/fig-${id}.png`)), sourceHashes[id])
}
const authoritativeText = [
  ...lesson.prose.filter(item => item.text?.trim()).map(item => ({ lesson: lesson.id, text: item.text })),
  ...exercises.exercises.map(item => ({ lesson: lesson.id, exercise: item.number, text: item.text })),
]
const original499 = exercises.source.data.exercises.find(item => item.number === '499').text
const modern499 = exercises.exercises.find(item => item.number === '499').text
assert.equal(modern499.replace(/\s/g, ''), original499.replace(/\s/g, ''))
const base = (id, height, boundingBox, description) => ({
  schema: 'ld-s10y-image/figure-spec@2',
  id: `fig-${id}`,
  mode: 'deterministic',
  description,
  source: {
    image: { path: `ssot-resources/soviet10year-textbooks/artifacts/6-8g/figures/fig-${id}.png`, sha256: sourceHashes[id] },
    authoritativeText,
    inventory: [],
  },
  canvas: { width: 640, height, boundingBox, background: 'paper', keepAspectRatio: true },
  display: { purpose: 'instructional', layout: 'inline', widths, minTextPx: 16, maxWidthPx: 640 },
  layout: { minLabelGap: 5 },
  objects: [],
  assertions: [],
})
function segment(spec, id, from, to, strokeWidth = 3.5) {
  spec.objects.push({ id, type: 'segment', from, to, stroke: 'ink', strokeWidth })
  spec.assertions.push({ id: `${id}-incidence`, type: 'connects', arrow: id, from, to })
}
function labelled(spec, id, at, label, position) {
  spec.objects.push({
    id, type: 'point', at, label, visible: false,
    fontSize: 38, fontWeight: 500, labelColor: 'ink',
    labelPlacement: { position, gap: 15 },
  })
}
const extend = (vertex, other, factor) => vertex.map((value, i) => value + factor * (value - other[i]))
const along = (center, toward, radius) => {
  const vector = toward.map((value, i) => value - center[i])
  const length = Math.hypot(...vector)
  return center.map((value, i) => value + radius * vector[i] / length)
}
function arc(spec, id, center, towardStart, towardEnd, radius) {
  const start = along(center, towardStart, radius)
  const end = along(center, towardEnd, radius)
  spec.objects.push({ id, type: 'arc', center, start, end, stroke: 'ink', strokeWidth: 2.5 })
  for (const [role, point, toward] of [['start', start, towardStart], ['end', end, towardEnd]]) {
    spec.assertions.push({ id: `${id}-${role}-radius`, type: 'pointOnCircle', point, center, radius })
    spec.assertions.push({ id: `${id}-${role}-ray`, type: 'pointOnLine', point, a: center, b: toward })
  }
}

function draft236() {
  const spec = base(236, 640, [0, 10, 10, 0],
    'One convex pentagon with all six source side continuations and five exterior-angle sites (six curved strokes). No labelled vertices or numerical angle values; metric layout is modern regularization, not a source given.')
  const v = [[1.8, 6.5], [6.7, 8], [8.75, 6.65], [6.9, 2.5], [3.4, 2.5]]
  const sides = ['side12', 'side23', 'side34', 'side45', 'side51']
  sides.forEach((id, i) => segment(spec, id, v[i], v[(i + 1) % 5]))
  const extensions = [
    ['continuation1', 0, 1, extend(v[0], v[1], 0.22)],
    ['continuation2', 1, 2, extend(v[1], v[2], 0.8)],
    ['continuation3', 2, 3, extend(v[2], v[3], 0.36)],
    ['continuation4r', 3, 4, [9.25, 2.5]],
    ['continuation4l', 4, 3, [1.5, 2.5]],
    ['continuation5', 4, 0, extend(v[4], v[0], 0.43)],
  ]
  for (const [id, vertex, other, end] of extensions) {
    segment(spec, id, v[vertex], end)
    spec.assertions.push({ id: `${id}-collinear`, type: 'collinear', a: v[other], b: v[vertex], c: end })
    spec.source.inventory.push({
      id: `source-${id}`,
      description: `Sealed inventory ${id}: visible finite side continuation; its endpoint is an unlabelled coordinate literal, not a new source point. Exact collinearity regularizes source print.`,
      objects: [id, ...sides.filter((_, i) => i === vertex || (i + 1) % 5 === vertex)],
      assertions: [`${id}-incidence`, `${id}-collinear`],
    })
  }
  arc(spec, 'exterior1', v[0], extensions[0][3], v[4], 0.7)
  arc(spec, 'exterior2', v[1], extensions[1][3], v[0], 0.62)
  arc(spec, 'exterior3a', v[2], extensions[2][3], v[1], 0.7)
  arc(spec, 'exterior3b', v[2], extensions[2][3], v[1], 0.87)
  arc(spec, 'exterior4', v[3], extensions[3][3], v[2], 0.82)
  arc(spec, 'exterior5', v[4], extensions[5][3], v[3], 0.8)
  spec.source.inventory.push({
    id: 'source-pentagon',
    description: 'One unlabelled five-vertex convex boundary v1-v2-v3-v4-v5-v1. All junction positions are realized by visible sides and connects assertions with coordinate literals; no printed dot or letter warrants a new visible point. No internal strokes. Original alphabet/code/fine glyph/blackbar roles UNKNOWN.',
    objects: sides,
    assertions: sides.map(id => `${id}-incidence`),
  })
  for (const id of ['exterior1', 'exterior2', 'exterior3a', 'exterior3b', 'exterior4', 'exterior5']) {
    spec.source.inventory.push({
      id: `source-${id}`,
      description: `${id}: source curved stroke at the inventoried exterior site, including the nested pair at v3. Fine mark or equality/arrow interpretation UNKNOWN; only curved-stroke geometry is asserted.`,
      objects: [id],
      assertions: ['start-radius', 'start-ray', 'end-radius', 'end-ray'].map(suffix => `${id}-${suffix}`),
    })
  }
  return spec
}

function draft237() {
  const spec = base(237, 480, [0, 7.5, 10, 0],
    'The source nonconvex pentagon A-B-C-D-E with inward vertex D and exactly its internal strokes B-D and A-D, giving triangles B-C-D, A-B-D and A-D-E. English labels are edition roles; original alphabet/code/fine glyph/blackbar identity UNKNOWN. Coordinates regularize the print, not measured givens.')
  for (const [id, at, label, position] of [
    ['a', [1.35, 1.05], 'A', 'SW'],
    ['b', [1.4, 4.9], 'B', 'W'],
    ['c', [7.2, 6.6], 'C', 'NE'],
    ['d', [6.45, 4.55], 'D', 'NE'],
    ['e', [9.1, 2.05], 'E', 'SE'],
  ]) labelled(spec, id, at, label, position)
  for (const [id, from, to] of [
    ['side-ab', 'a', 'b'], ['side-bc', 'b', 'c'], ['side-cd', 'c', 'd'],
    ['side-de', 'd', 'e'], ['side-ea', 'e', 'a'],
    ['diagonal-bd', 'b', 'd'], ['diagonal-ad', 'a', 'd'],
  ]) segment(spec, id, from, to, id.startsWith('diagonal') ? 2.5 : 3.5)
  spec.source.inventory.push({
    id: 'source-nonconvex-three-triangles',
    description: 'One nonconvex pentagon with five source label positions mapped to edition roles a,b,c,d,e (no original Unicode claim), boundary AB BC CD DE EA and both internal source strokes BD AD. D is inward; the three triangles BCD, ABD, ADE are preserved. Fine marks near A and elsewhere UNKNOWN; no added arcs, dots, values, labels or auxiliary strokes.',
    objects: spec.objects.map(item => item.id),
    assertions: spec.assertions.map(item => item.id),
    requires: ['pointRelationships'],
  })
  return spec
}

function draft238() {
  const spec = base(238, 420, [0, 6.5625, 10, 0],
    'Exercise499 given MN parallel KL in one shared frame, upper junction A, lower junction C, bent path A-B-C with B to the right between the lines. Seven English edition role labels, original glyph/code/blackbar identity UNKNOWN. Source incidence only: no solution auxiliary line through B, new angle marks, hidden answer or solved values.')
  for (const [id, at, label, position] of [
    ['m', [0.8, 5.25], 'M', 'N'],
    ['a', [3.4, 5.25], 'A', 'N'],
    ['n', [9.2, 5.25], 'N', 'N'],
    ['k', [0.8, 1.5], 'K', 'S'],
    ['c', [2.1, 1.5], 'C', 'S'],
    ['l', [9.2, 1.5], 'L', 'S'],
    ['b', [5.5, 3.45], 'B', 'E'],
  ]) labelled(spec, id, at, label, position)
  for (const [id, from, to] of [
    ['upper-ma', 'm', 'a'], ['upper-an', 'a', 'n'],
    ['lower-kc', 'k', 'c'], ['lower-cl', 'c', 'l'],
    ['bend-ab', 'a', 'b'], ['bend-bc', 'b', 'c'],
  ]) segment(spec, id, from, to)
  spec.assertions.push(
    { id: 'upper-incidence', type: 'collinear', a: 'm', b: 'a', c: 'n' },
    { id: 'lower-incidence', type: 'collinear', a: 'k', b: 'c', c: 'l' },
    { id: 'given-parallel', type: 'parallel', a: 'm', b: 'n', c: 'k', d: 'l' },
  )
  spec.source.inventory.push({
    id: 'source-seven-roles-and-rays',
    description: 'All seven original label positions mapped to edition M,A,N,K,C,L,B roles; original alphabet/code/Unicode/fine glyph/blackbar roles UNKNOWN. Upper M-A-N and lower K-C-L orders, both sides of each junction, parallel frame, and the rightward A-B-C elbow are retained. AN right, AB down-right, CB up-right, CL right. No line through B parallel to the frame, angle arc, point dot, numeric given or proof auxiliary.',
    objects: spec.objects.map(item => item.id),
    assertions: spec.assertions.map(item => item.id),
    requires: ['pointRelationships'],
  })
  return spec
}

const executionsPath = path.join(root, 'executions.json')
function command(stage, executable, argv) {
  const result = spawnSync(executable, argv, { cwd, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 })
  const executions = fs.existsSync(executionsPath) ? load(executionsPath) : []
  const index = executions.length + 1
  const stdout = `command-${index}.stdout.txt`
  const stderr = `command-${index}.stderr.txt`
  fs.writeFileSync(path.join(root, stdout), result.stdout || '')
  fs.writeFileSync(path.join(root, stderr), result.stderr || '')
  executions.push({
    stage, cwd, command: executable, argv, exitCode: result.status,
    signal: result.signal, error: result.error?.message || null,
    streams: { stdout: { path: stdout, sha256: digest(path.join(root, stdout)) }, stderr: { path: stderr, sha256: digest(path.join(root, stderr)) } },
  })
  save('executions.json', executions)
  console.log(`${stage}: exit ${result.status}`)
  if (result.stdout) process.stdout.write(result.stdout)
  if (result.stderr) process.stderr.write(result.stderr)
  return result.status === 0
}

function normalizeReport(id) {
  const nativeName = `fig-${id}.native.render.json`
  const report = load(path.join(root, nativeName))
  assert.equal(report.status, 'pass')
  assert.equal(report.output.svg.sha256, digest(path.join(root, `fig-${id}.svg`)))
  report.output.svg.path = `${durable}/fig-${id}.svg`
  report.spec.path = `${durable}/fig-${id}.spec.json`
  save(`fig-${id}.render.json`, report)
}

function topology() {
  const results = []
  const spec236 = load(path.join(root, 'fig-236.spec.json'))
  assert.equal(spec236.objects.filter(item => item.type === 'segment').length, 11)
  assert.equal(spec236.objects.filter(item => item.type === 'arc').length, 6)
  assert(spec236.objects.some(item => item.id === 'continuation4l'))
  assert.equal(spec236.objects.filter(item => item.type === 'point' || item.type === 'text').length, 0)
  results.push({ figure: 'fig-236', segments: 11, continuations: 6, arcStrokes: 6, labels: 0, status: 'pass' })
  const spec237 = load(path.join(root, 'fig-237.spec.json'))
  const points = Object.fromEntries(spec237.objects.filter(item => item.type === 'point').map(item => [item.id, item.at]))
  const cross = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const signedArea = names => names.reduce((sum, name, i) => {
    const a = points[name]
    const b = points[names[(i + 1) % names.length]]
    return sum + a[0] * b[1] - b[0] * a[1]
  }, 0) / 2
  const polygon = ['a', 'b', 'c', 'd', 'e']
  const turns = polygon.map((id, i) => cross(points[polygon[(i + 4) % 5]], points[id], points[polygon[(i + 1) % 5]]))
  assert(turns[3] > 0 && turns.filter(value => value > 0).length === 1)
  const triangles = [['b', 'c', 'd'], ['a', 'b', 'd'], ['a', 'd', 'e']]
  const areas = triangles.map(signedArea)
  assert(areas.every(value => value < 0))
  assert(Math.abs(areas.reduce((sum, value) => sum + value, 0) - signedArea(polygon)) < 1e-9)
  // The two diagonals bound separate half-planes for each adjacent triangle.
  assert(cross(points.a, points.d, points.b) * cross(points.a, points.d, points.e) < 0)
  assert(cross(points.b, points.d, points.c) * cross(points.b, points.d, points.a) < 0)
  assert.equal(spec237.objects.filter(item => item.type === 'segment').length, 7)
  assert.deepEqual(spec237.objects.filter(item => item.type === 'point').map(item => item.label), ['A', 'B', 'C', 'D', 'E'])
  results.push({ figure: 'fig-237', reflexVertex: 'D', triangles, signedArea: signedArea(polygon), triangleAreas: areas, nonoverlappingPartition: true, status: 'pass' })
  const spec238 = load(path.join(root, 'fig-238.spec.json'))
  const p = Object.fromEntries(spec238.objects.filter(item => item.type === 'point').map(item => [item.id, item.at]))
  assert(p.m[0] < p.a[0] && p.a[0] < p.n[0])
  assert(p.k[0] < p.c[0] && p.c[0] < p.l[0])
  assert(p.a[1] > p.b[1] && p.b[1] > p.c[1])
  assert(p.b[0] > p.a[0] && p.b[0] > p.c[0])
  assert.deepEqual(spec238.objects.filter(item => item.type === 'point').map(item => item.label), ['M', 'A', 'N', 'K', 'C', 'L', 'B'])
  assert.deepEqual(spec238.objects.filter(item => item.type !== 'point').map(item => item.id), ['upper-ma', 'upper-an', 'lower-kc', 'lower-cl', 'bend-ab', 'bend-bc'])
  results.push({ figure: 'fig-238', sevenRoles: true, upperRole: 'A', rays: ['AN right', 'AB down-right', 'CB up-right', 'CL right'], addedSolutionLine: false, status: 'pass' })
  save('author-topology.json', { authority: 'AUTHOR_ONLY executable topology checks, not independent review', results })
}

async function previews() {
  const { chromium } = await import(pathToFileURL(path.join(cwd, '.agents/skills/node_modules/playwright-core/index.mjs')).href)
  const executablePath = [
    chromium.executablePath(),
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ].find(file => fs.existsSync(file))
  assert(executablePath, 'Installed Chromium required; no install or fallback artwork')
  const browser = await chromium.launch({ executablePath, headless: true })
  const reports = []
  try {
    for (const id of ids) {
      const spec = load(path.join(root, `fig-${id}.spec.json`))
      const svg = fs.readFileSync(path.join(root, `fig-${id}.svg`), 'utf8')
      const page = await browser.newPage({ viewport: { width: 1060, height: 1000 }, deviceScaleFactor: 1 })
      const errors = []
      page.on('pageerror', error => errors.push(error.message))
      const media = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
      await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>
        *{box-sizing:border-box}body{margin:0;padding:20px;background:#f3f4f5;color:#171b1f;font:14px Arial}
        h1{font-size:18px;font-weight:500;margin:0 0 12px}
        main{display:grid;grid-template-columns:660px 360px;gap:12px}
        figure{margin:0;padding:10px;background:white}figcaption{margin-bottom:6px;color:#48505a}
        .normal{grid-column:2}.native{grid-column:1;grid-row:1/6;align-self:start}
        img{display:block;height:auto;max-width:none}svg{display:block}
      </style></head><body><h1>Figure ${id} | complete native and normal inline previews</h1><main>
        <figure class="native"><figcaption>Native 640 x ${spec.canvas.height}; also normal 640 px</figcaption>${svg}</figure>
        ${widths.filter(width => width !== 640).map(width => `<figure class="normal"><figcaption>Inline ${width} px</figcaption><img width="${width}" src="${media}" alt="Complete Figure ${id} at ${width} pixels"></figure>`).join('')}
      </main></body></html>`)
      await page.locator('img').evaluateAll(async images => { await Promise.all(images.map(image => image.decode())) })
      const checks = await page.evaluate(({ widths, minTextPx }) => {
        const svg = document.querySelector('svg')
        const native = svg.getBoundingClientRect()
        const samples = widths.map(width => {
          const host = document.createElement('div')
          host.style.width = `${width}px`
          host.style.position = 'absolute'
          host.style.left = '-10000px'
          const candidate = svg.cloneNode(true)
          candidate.setAttribute('width', String(width))
          candidate.removeAttribute('height')
          candidate.style.width = `${width}px`
          candidate.style.height = 'auto'
          host.append(candidate)
          document.body.append(host)
          const rect = candidate.getBoundingClientRect()
          const labels = [...candidate.querySelectorAll('text')].map(text => {
            const fontSize = parseFloat(text.getAttribute('font-size'))
            const matrix = text.getScreenCTM()
            return { text: text.textContent, px: fontSize * Math.hypot(matrix.a, matrix.b) }
          })
          host.remove()
          return { width, actualWidth: rect.width, labels, status: labels.every(label => label.px + 0.01 >= minTextPx) && Math.abs(rect.width - width) < 0.1 ? 'pass' : 'fail' }
        })
        return { native: { width: native.width, height: native.height }, samples }
      }, { widths, minTextPx: spec.display.minTextPx })
      assert.equal(errors.length, 0)
      assert(checks.samples.every(item => item.status === 'pass'))
      assert.equal(checks.native.width, 640)
      assert.equal(checks.native.height, spec.canvas.height)
      await page.screenshot({ path: path.join(root, `fig-${id}.complete-preview.png`), fullPage: true })
      await page.close()
      reports.push({ figure: `fig-${id}`, ...checks, pageErrors: errors, preview: `fig-${id}.complete-preview.png`, status: 'pass' })
    }
  } finally {
    await browser.close()
  }
  save('author-display.json', { authority: 'AUTHOR_ONLY offline transform and whole-figure preview evidence; not product acceptance or independent review', headed: false, reports })
}

const stage = process.argv[2]
if (stage === 'draft') {
  for (const spec of [draft236(), draft237(), draft238()]) {
    const name = `${spec.id}.spec.json`
    assert(!fs.existsSync(path.join(root, name)), `Existing ${name} must not be overwritten as a new draft`)
    save(name, spec)
  }
  save('text-binding.json', {
    lesson: { path: `${textRoot}/lesson.template.json`, sha256: digest(path.join(cwd, textRoot, 'lesson.template.json')) },
    exercises: { path: `${textRoot}/exercises.template.json`, sha256: digest(path.join(cwd, textRoot, 'exercises.template.json')) },
    original499, modern499, comparison: 'literal text equal after whitespace normalization only; no figure/answer approval',
    inventory: { path: 'SOURCE-INVENTORY.md', sha256: digest(path.join(root, 'SOURCE-INVENTORY.md')), mode: '0444' },
    additions: 'English edition roles, typographic offsets, finite metric regularization and stroke styling only. No original Unicode claim; no answer-derived construction.',
  })
  console.log('Three first drafts saved after inventory seal.')
} else if (stage === 'validate') {
  let pass = true
  for (const id of ids) {
    pass = command(`fig-${id}-native-validator`, 'python3', [
      `${skill}/scripts/validate_spec.py`, `${path.relative(cwd, root)}/fig-${id}.spec.json`, '--stage', 'rendered', '--json',
    ]) && pass
  }
  if (!pass) process.exitCode = 2
} else if (stage === 'render') {
  let pass = true
  const selected = process.argv[3] ? process.argv[3].split(',').map(Number) : ids
  assert(selected.every(id => ids.includes(id)))
  for (const id of selected) {
    const prefix = `${path.relative(cwd, root)}/fig-${id}`
    const ok = command(`fig-${id}-native-JSXGraph-render`, 'node', [
      `${skill}/scripts/render_spec.mjs`, '--spec', `${prefix}.spec.json`,
      '--svg', `${prefix}.svg`, '--report', `${prefix}.native.render.json`, '--png', `${prefix}.native.png`,
    ])
    if (ok) normalizeReport(id)
    pass = ok && pass
  }
  if (!pass) process.exitCode = 2
} else if (stage === 'topology') {
  topology()
  console.log('Author source-incidence and nonconvex partition checks completed.')
} else if (stage === 'previews') {
  await previews()
  console.log('Three complete native/normal preview sheets and author display evidence saved.')
} else if (stage === 'preserve-failures') {
  const directory = path.join(root, 'first-failure')
  assert(!fs.existsSync(directory), 'First failure must remain immutable')
  fs.mkdirSync(directory)
  const snapshots = []
  for (const id of [237, 238]) {
    for (const suffix of ['spec.json', 'native.render.json', 'svg', 'native.png']) {
      const name = `fig-${id}.${suffix}`
      fs.copyFileSync(path.join(root, name), path.join(directory, name))
      snapshots.push({ path: `first-failure/${name}`, sha256: digest(path.join(directory, name)) })
    }
  }
  save('revisions.json', {
    snapshots,
    revisions: [
      { figure: 'fig-237', cause: 'Native label collision at D', change: 'D label placement gap 15 -> 36; no geometry or label identity change', contentRevisions: 1 },
      { figure: 'fig-238', cause: 'Native label collisions at M,A,N,K,C,L', change: 'Six horizontal-frame label placement gaps 15 -> 36; no ray or label identity change', contentRevisions: 1 },
    ],
  })
  console.log('First failed specs, native reports, SVGs and PNGs retained before revisions.')
} else if (stage === 'manifest') {
  const acquisitionCommands = [
    ['pwd', 0],
    ['cat /Users/yong/work/lemmadeck-ws/lemmadeck/.agents/skills/ld-s10y-image/SKILL.md', 0],
    ['cat .intentfold/readme.md .intentfold/charter/engineering.md .intentfold/charter/operations.md', 0],
    ["rg --files -g '*production-resume*' -g '*routing*' -g '*spec*' -g '*gate*' .agents/skills/ld-s10y-image .claude/skills/ld-s10y-lesson .intentfold/tickets/STEMROBIN-188", 0],
    ['cat .agents/skills/ld-s10y-image/SKILL.md .agents/skills/ld-s10y-image/references/routing.md .agents/skills/ld-s10y-image/references/figure-spec.md .agents/skills/ld-s10y-image/references/quality-gate.md .claude/skills/ld-s10y-lesson/references/production-resume.md', 0],
    [`cat ${textRoot}/lesson.template.json ${textRoot}/exercises.template.json`, 0],
    ['ls -ld .intentfold/tickets/STEMROBIN-188/tmp/n38-fig236238-author7', 1],
    ['cat /Users/yong/.agents/skills/intentfold/SKILL.md .intentfold/project.json .intentfold/tickets/STEMROBIN-188/ticket.json', 0],
    [`shasum -a 256 ssot-resources/soviet10year-textbooks/artifacts/6-8g/figures/fig-236.png ssot-resources/soviet10year-textbooks/artifacts/6-8g/figures/fig-237.png ssot-resources/soviet10year-textbooks/artifacts/6-8g/figures/fig-238.png ${textRoot}/lesson.template.json ${textRoot}/exercises.template.json`, 0],
    [`jq '{id,title,prose:[.prose[]|{kind,id,text}],figure_editions}' ${textRoot}/lesson.template.json`, 0],
    [`jq '{lesson,exercises:[.exercises[]|{number,text,figure_refs}]}' ${textRoot}/exercises.template.json`, 0],
    ['cat .agents/skills/ld-s10y-image/references/figure-spec.md', 0],
    ["sed -n '1,230p' .agents/skills/ld-s10y-image/scripts/render_spec.mjs", 0],
    ['cat .agents/skills/ld-s10y-image/assets/figure-spec.schema.json', 0],
    ["rg -n 'screenshot|report|writeFile|mkdir|output|fontSize|arc|pointRelationships|connects|polygon' .agents/skills/ld-s10y-image/scripts/render_spec.mjs .agents/skills/ld-s10y-image/scripts/validate_spec.py", 0],
    ["stat -f '%Sp %N' .intentfold/tickets/STEMROBIN-188/tmp/n38-fig236238-author7/SOURCE-INVENTORY.md", 0],
    ["sed -n '230,390p' .agents/skills/ld-s10y-image/scripts/render_spec.mjs", 0],
    ["sed -n '925,1045p' .agents/skills/ld-s10y-image/scripts/render_spec.mjs", 0],
    ["sed -n '500,560p' .agents/skills/ld-s10y-image/scripts/validate_spec.py", 0],
    ["sed -n '700,752p' .agents/skills/ld-s10y-image/scripts/validate_spec.py", 0],
    ["sed -n '817,905p' .agents/skills/ld-s10y-image/scripts/validate_spec.py", 0],
    ["sed -n '916,1002p' .agents/skills/ld-s10y-image/scripts/validate_spec.py", 0],
    ["sed -n '780,877p' .agents/skills/ld-s10y-image/scripts/render_spec.mjs", 0],
    ["sed -n '670,790p' .agents/skills/ld-s10y-image/scripts/render_spec.mjs", 0],
  ].map(([command, exitCode]) => ({ cwd, command, exitCode }))
  const wrapperCommands = [
    ['draft', 0], ['validate', 0], ['render', 2], ['topology', 0],
    ['preserve-failures', 0], ['render 237,238', 0], ['previews', 0],
  ].map(([suffix, exitCode]) => ({
    cwd, command: `node .intentfold/tickets/STEMROBIN-188/tmp/n38-fig236238-author7/author.mjs ${suffix}`, exitCode,
  }))
  const figures = ids.map(id => {
    const report = load(path.join(root, `fig-${id}.render.json`))
    assert.equal(report.status, 'pass')
    assert.equal(report.output.svg.path, `${durable}/fig-${id}.svg`)
    assert.equal(report.output.svg.sha256, digest(path.join(root, `fig-${id}.svg`)))
    assert.equal(report.spec.sha256, digest(path.join(root, `fig-${id}.spec.json`)))
    return {
      id: `fig-${id}`, mode: 'deterministic', status: 'AUTHOR_ONLY_READY_FOR_REVIEW',
      source: { path: `ssot-resources/soviet10year-textbooks/artifacts/6-8g/figures/fig-${id}.png`, sha256: sourceHashes[id] },
      candidate: Object.fromEntries(['spec.json', 'svg', 'render.json', 'native.render.json', 'native.png', 'complete-preview.png'].map(suffix => {
        const name = `fig-${id}.${suffix}`
        return [suffix, { actualPath: path.join(root, name), sha256: digest(path.join(root, name)), ...(suffix === 'spec.json' || suffix === 'svg' || suffix === 'render.json' ? { eventualPath: `${durable}/${name}` } : {}) }]
      })),
      display: report.displayChecks,
      contentRevisions: id === 236 ? 0 : 1,
      independentReview: 'NOT_PERFORMED',
      canonicalPromotion: false,
    }
  })
  const dependencies = [
    `${skill}/SKILL.md`,
    `${skill}/references/routing.md`,
    `${skill}/references/figure-spec.md`,
    `${skill}/references/quality-gate.md`,
    `${skill}/assets/figure-spec.schema.json`,
    `${skill}/scripts/validate_spec.py`,
    `${skill}/scripts/render_spec.mjs`,
    `${skill}/scripts/materialize_arrowheads.mjs`,
    '.claude/skills/ld-s10y-lesson/references/production-resume.md',
  ].map(file => ({ path: file, sha256: digest(path.join(cwd, file)), role: 'existing read-only installed contract or native renderer dependency; no freshness/install' }))
  const artifacts = []
  const collect = directory => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name)
      if (entry.isDirectory()) collect(file)
      else if (entry.name !== 'manifest.json') artifacts.push({ path: path.relative(root, file), sha256: digest(file), bytes: fs.statSync(file).size })
    }
  }
  collect(root)
  save('manifest.json', {
    schema: 'STEMROBIN-188/author-only-manifest@1', date: '2026-11-23',
    ticket: 'STEMROBIN-188', lesson: lesson.id, cwd, ownedRoot: root,
    authority: 'ACTIVE offline finish=review; bounded author only',
    status: 'AUTHOR_ONLY_READY_FOR_REVIEW',
    sourceInventory: { path: 'SOURCE-INVENTORY.md', sha256: digest(path.join(root, 'SOURCE-INVENTORY.md')), sealedBeforeDraft: true, mode: '0444' },
    authorRecord: { path: 'AUTHOR-RECORD.md', sha256: digest(path.join(root, 'AUTHOR-RECORD.md')), finalMode: '0444' },
    text: load(path.join(root, 'text-binding.json')),
    dependencies, figures, artifacts,
    acquisitionCommands,
    wrapperCommands,
    nativeExecutions: load(executionsPath),
    inventorySealCommand: { cwd, command: 'chmod 0444 .intentfold/tickets/STEMROBIN-188/tmp/n38-fig236238-author7/SOURCE-INVENTORY.md', exitCode: 0 },
    manualEdits: { tool: 'apply_patch', allObservedExits: 0, files: ['SOURCE-INVENTORY.md', 'author.mjs', 'fig-237.spec.json', 'fig-238.spec.json', 'AUTHOR-RECORD.md'], details: 'Initial author script, failure-preservation/affected-render stages, exact seven gap edits, final record and manifest stage. No generated SVG edits.' },
    finalization: { command: 'node .intentfold/tickets/STEMROBIN-188/tmp/n38-fig236238-author7/author.mjs manifest', cwd, result: 'manifest emitted and evidence chmod0444; process exit reported in caller tool result' },
    usage: { imageLoads: 6, batchLimit: 8, contextLimit: 24, reserveLoadsUsed: 0, imageResets: 0, crops: 0, originalReopens: 0, paidCalls: 0, paidCost: 0, explicitValidatorCalls: 3, implicitRendererValidatorCalls: 5, nativeRenderCalls: 5, figureRevisions: 2, independentReviewCalls: 0, canonicalWrites: 0, dbCalls: 0 },
    imageLoads: [
      ...ids.map((id, i) => ({ load: i + 1, tool: 'view_image', path: path.join(cwd, `ssot-resources/soviet10year-textbooks/artifacts/6-8g/figures/fig-${id}.png`), kind: 'whole original', times: 1 })),
      ...ids.map((id, i) => ({ load: i + 4, tool: 'view_image', path: path.join(root, `fig-${id}.complete-preview.png`), kind: 'whole complete native/normal final preview sheet', times: 1 })),
    ],
    unknowns: 'Original alphabet/script/code points/Unicode/fine glyph/blackbar semantic roles remain UNKNOWN. English letters map edition roles only. No answer key consulted.',
    failures: 'Initial ls exit1 (owned root absent; created through source-inventory apply_patch). First native render237/238 exit2 label collisions; exact outputs retained first-failure/ and native streams. First236 pass not repeated.',
    reportNormalization: 'Only final spec.path/output.svg.path changed using structured JSON, to future durable names; unmodified native reports retained. Output hash/status/geometry unchanged.',
    forbiddenActionsPerformed: [],
    independentReview: 'NOT_PERFORMED', canonicalPromotion: false,
  })
  for (const name of ['SOURCE-INVENTORY.md', 'AUTHOR-RECORD.md', 'manifest.json']) {
    fs.chmodSync(path.join(root, name), 0o444)
    assert.equal(fs.statSync(path.join(root, name)).mode & 0o777, 0o444)
  }
  console.log('AUTHOR_ONLY manifest saved; inventory, AUTHOR-RECORD and manifest sealed0444.')
} else {
  throw new Error('Choose draft, validate, render, topology, previews, preserve-failures or manifest.')
}
