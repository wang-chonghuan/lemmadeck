import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'

const root = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188'
assert.equal(process.cwd(), root)
const repairDashes = process.argv.includes('--repair-dashes')
const own = path.join(root, '.intentfold/tickets/STEMROBIN-188/tmp/n33-fig209210-author7')
const templatePath = path.join(root, '.intentfold/tickets/STEMROBIN-188/tmp/n33-text-author7/lesson.template.json')
const sourceDir = path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-n33/preparation7/artifacts/6-8g/figures')
const skill = path.join(root, '.agents/skills/ld-s10y-image')
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: hash(file) })
const writeJson = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
const template = JSON.parse(fs.readFileSync(templatePath, 'utf8'))
assert.equal(template.prose.length, 20)
const text209 = template.prose.find(item => item.source_refs?.includes('p0156#1')).text
const text210 = template.prose.find(item => item.source_refs?.includes('p0156#6')).text
const segment = (id, from, to, dash = 0, strokeWidth = 3) =>
  ({ id, type: 'segment', from, to, dash, stroke: 'ink', strokeWidth })
const text = (id, at, value) => ({
  id, type: 'text', at, text: value, fontSize: 32, fontWeight: 500,
  labelPlacement: { position: 'CENTER' },
})
const named = (id, at, label, position, gap = 20) => ({
  id, type: 'point', at, label, visible: false, fontSize: 32, fontWeight: 500,
  labelPlacement: { position, gap },
})
const incidence = (id, point, a, b) => ({ id, type: 'pointOnLine', point, a, b })
const connected = object => ({
  id: `${object.id}-endpoints`, type: 'connects', arrow: object.id,
  from: object.from, to: object.to,
})
const common = (id, height, sourceText) => ({
  schema: 'ld-s10y-image/figure-spec@2',
  id,
  mode: 'deterministic',
  source: {
    image: bind(path.join(sourceDir, `${id}.png`)),
    authoritativeText: [{ lesson: template.id, text: sourceText }],
    inventory: [],
  },
  canvas: { width: 640, height, boundingBox: [0, height / 64, 10, 0], background: 'paper', keepAspectRatio: true },
  display: { purpose: 'instructional', layout: 'inline', maxWidthPx: 640, widths: [640, 358, 331], minTextPx: 16 },
  layout: { minLabelGap: 4 },
  objects: [],
  assertions: [],
})

const f209 = common('fig-209', 800, text209)
f209.description = 'Illustration of the stated equivalent parallel postulate: a is perpendicular to c; oblique b intersects c and meets a at M below c.'
const aTop = [1.9, 11.7], aBottom = [1.9, 0.75]
const cLeft = [0.65, 8.3], cRight = [9.3, 8.3]
const m = [1.9, 1.9], bBottom = [1.25, 0.9], bTop = [8.4, 11.9]
const ac = [1.9, 8.3], bc = [6.06, 8.3]
const rightCorner = [1.54, 8.66]
f209.objects = [
  segment('a-solid', aBottom, aTop),
  segment('b-solid', bBottom, bTop),
  segment('c-solid', cLeft, cRight),
  segment('ac-right-angle-vertical', [1.54, 8.3], rightCorner, 0, 2),
  segment('ac-right-angle-horizontal', rightCorner, [1.9, 8.66], 0, 2),
  named('M', m, 'M', 'SE'),
  text('a-line-name', [2.45, 11.48], 'a'),
  text('b-line-name', [8.97, 11.42], 'b'),
  text('c-line-name', [9.22, 7.77], 'c'),
]
f209.assertions = [
  ...f209.objects.filter(item => item.type === 'segment').map(connected),
  { id: 'a-perpendicular-c', type: 'perpendicular', a: aBottom, b: aTop, c: cLeft, d: cRight },
  incidence('M-on-a', 'M', aBottom, aTop),
  incidence('M-on-b', 'M', bBottom, bTop),
  incidence('ac-on-a', ac, aBottom, aTop),
  incidence('ac-on-c', ac, cLeft, cRight),
  incidence('bc-on-b', bc, bBottom, bTop),
  incidence('bc-on-c', bc, cLeft, cRight),
  { id: 'M-ac-a-collinear', type: 'collinear', a: 'M', b: ac, c: aTop },
  { id: 'M-bc-b-collinear', type: 'collinear', a: 'M', b: bc, c: bTop },
  incidence('right-angle-foot-on-c', [1.54, 8.3], cLeft, cRight),
  incidence('right-angle-foot-on-a', [1.9, 8.66], aBottom, aTop),
  { id: 'right-angle-marker-perpendicular', type: 'perpendicular', a: [1.54, 8.3], b: rightCorner, c: rightCorner, d: [1.9, 8.66] },
]
f209.source.inventory = [
  {
    id: 'source-three-lines-and-unlabelled-ends',
    description: 'One subfigure. Solid a is near vertical and solid c horizontal. Solid oblique b rises from lower left to upper right. All three have two visible unlabelled ends without arrows. The scan has local crossing dropouts, not repeated dashed patterns. a-c and b-c are unlabelled junctions above M. Coordinate literals represent unlabelled ends/junctions; they are not invented named or dotted points.',
    objects: ['a-solid', 'b-solid', 'c-solid'],
    assertions: ['a-solid-endpoints', 'b-solid-endpoints', 'c-solid-endpoints', 'a-perpendicular-c', 'ac-on-a', 'ac-on-c', 'bc-on-b', 'bc-on-c'],
  },
  {
    id: 'source-M-and-incidences',
    description: 'M is the only named point, on both a and b, below c, with a and b continuing below it. M is printed to the lower right. The tiny junction raster mark is ambiguous (UNKNOWN whether an independent point marker); no filled dot or additional condition is introduced. Every incidence and collinearity uses explicit endpoints/junction literals. There is only one mapped named point, so the native two-mapped-point pointRelationships category is inapplicable.',
    objects: ['M', 'a-solid', 'b-solid', 'c-solid'],
    assertions: ['M-on-a', 'M-on-b', 'M-ac-a-collinear', 'M-bc-b-collinear'],
  },
  {
    id: 'source-right-angle-and-line-names',
    description: 'A square-corner right-angle mark lies in the upper-left quadrant of a-c. Labels a and b lie right of the upper line ends; c lies below the right end. No numerical value, grid, axis, or second subfigure is visible.',
    objects: ['ac-right-angle-vertical', 'ac-right-angle-horizontal', 'a-line-name', 'b-line-name', 'c-line-name'],
    assertions: ['ac-right-angle-vertical-endpoints', 'ac-right-angle-horizontal-endpoints', 'right-angle-foot-on-c', 'right-angle-foot-on-a', 'right-angle-marker-perpendicular'],
  },
]

const f210 = common('fig-210', 400, text210)
f210.description = 'Illustration of the quoted Euclidean parallel postulate: transversal b crosses a1 and a2, the same-side interior angles alpha and beta total less than two right angles, and the dashed continuations intersect at N on that side.'
const n = [7.6, 4.3325], a1Left = [0.55, 1.05], a2Left = [0.35, 4.55]
const slope1 = (n[1] - a1Left[1]) / (n[0] - a1Left[0])
const onA1 = x => [x, a1Left[1] + slope1 * (x - a1Left[0])]
const onA2 = x => [x, a2Left[1] - 0.03 * (x - a2Left[0])]
const a1End = onA1(9.15), a2End = onA2(9.65)
const a1Transition = onA1(5.0), a2Transition = onA2(5.0)
const bLow = [2.16, 0.5], bHigh = [2.24, 5.75]
const bSlopeX = (bHigh[0] - bLow[0]) / (bHigh[1] - bLow[1])
const bIntersection = (left, slope) => {
  const y = (left[1] + slope * (bLow[0] - left[0] - bSlopeX * bLow[1])) / (1 - slope * bSlopeX)
  return [bLow[0] + bSlopeX * (y - bLow[1]), y]
}
const lower = bIntersection(a1Left, slope1), upper = bIntersection(a2Left, -0.03)
const rayPoint = (center, toward, radius) => {
  const dx = toward[0] - center[0], dy = toward[1] - center[1], length = Math.hypot(dx, dy)
  return [center[0] + dx * radius / length, center[1] + dy * radius / length]
}
const arc = (id, center, first, last, radius) => ({
  id, type: 'arc', center, start: rayPoint(center, first, radius), end: rayPoint(center, last, radius),
  stroke: 'ink', strokeWidth: 2,
})
f210.objects = [
  segment('b-solid', bLow, bHigh),
  segment('a1-solid', a1Left, a1Transition),
  segment('a1-dashed-to-N', a1Transition, 'N', repairDashes ? 4 : 2),
  segment('a1-dashed-beyond-N', 'N', a1End, repairDashes ? 4 : 2),
  segment('a2-solid', a2Left, a2Transition),
  segment('a2-dashed-to-N', a2Transition, 'N', repairDashes ? 4 : 2),
  segment('a2-dashed-beyond-N', 'N', a2End, repairDashes ? 4 : 2),
  arc('alpha-single-arc', upper, bLow, a2End, 0.68),
  arc('beta-inner-arc', lower, a1End, bHigh, 0.53),
  arc('beta-outer-arc', lower, a1End, bHigh, 0.70),
  named('N', n, 'N', 'NW', 32),
  text('a1-line-name', [0.53, 1.66], 'a\u2081'),
  text('a2-line-name', [0.52, 4.03], 'a\u2082'),
  text('b-line-name', [2.71, 5.58], 'b'),
  text('alpha-name', [3.36, 3.94], '\u03b1'),
  text('beta-name', [2.95, 2.82], '\u03b2'),
]
f210.assertions = [
  ...f210.objects.filter(item => item.type === 'segment').map(connected),
  incidence('lower-on-b', lower, bLow, bHigh),
  incidence('upper-on-b', upper, bLow, bHigh),
  incidence('lower-on-a1', lower, a1Left, a1End),
  incidence('upper-on-a2', upper, a2Left, a2End),
  incidence('N-on-a1', 'N', a1Left, a1End),
  incidence('N-on-a2', 'N', a2Left, a2End),
  { id: 'a1-solid-dashed-N-collinear', type: 'collinear', a: a1Left, b: a1Transition, c: 'N' },
  { id: 'a2-solid-dashed-N-collinear', type: 'collinear', a: a2Left, b: a2Transition, c: 'N' },
  { id: 'b-intersections-collinear', type: 'collinear', a: bLow, b: lower, c: upper },
]
for (const object of f210.objects.filter(item => item.type === 'arc')) {
  const aLine = object.id.startsWith('alpha') ? [a2Left, a2End] : [a1Left, a1End]
  const startLine = object.id.startsWith('alpha') ? [bLow, bHigh] : aLine
  const endLine = object.id.startsWith('alpha') ? aLine : [bLow, bHigh]
  const radius = Math.hypot(object.start[0] - object.center[0], object.start[1] - object.center[1])
  f210.assertions.push(
    incidence(`${object.id}-start-on-ray`, object.start, ...startLine),
    incidence(`${object.id}-end-on-ray`, object.end, ...endLine),
    { id: `${object.id}-start-radius`, type: 'distance', a: object.center, b: object.start, value: radius },
    { id: `${object.id}-end-radius`, type: 'distance', a: object.center, b: object.end, value: radius },
  )
}
f210.source.inventory = [
  {
    id: 'source-lines-endpoints-and-crossings',
    description: 'One subfigure. a1 rises left-to-right; a2 is almost horizontal, slightly descending. Near-vertical b crosses a2 above a1 and extends beyond both crossings. All six outer ends are unlabelled, without arrows. The two b crossings are unlabelled and not marked as new points. Their incidences are coordinate-literal assertions. No perpendicular or parallel relation is supplied or added.',
    objects: ['b-solid', 'a1-solid', 'a2-solid', 'a1-dashed-beyond-N', 'a2-dashed-beyond-N'],
    assertions: ['b-solid-endpoints', 'a1-solid-endpoints', 'a2-solid-endpoints', 'a1-dashed-beyond-N-endpoints', 'a2-dashed-beyond-N-endpoints', 'lower-on-b', 'upper-on-b', 'lower-on-a1', 'upper-on-a2', 'b-intersections-collinear'],
  },
  {
    id: 'source-solid-dashed-N-continuations',
    description: 'Both a1 and a2 are solid from their left ends through b; farther right they turn into repeated dashes before reaching their common intersection N, and both continue dashed beyond N. N is printed above-left, with no separate large dot. N is the only named point. Hidden unlabelled construction points are not claimed as visible inventory. Each continuation is split at N only to keep the dashed incidence visibly connected, not to change the line pattern or assert a new Euclidean condition.',
    objects: ['N', 'a1-solid', 'a1-dashed-to-N', 'a1-dashed-beyond-N', 'a2-solid', 'a2-dashed-to-N', 'a2-dashed-beyond-N'],
    assertions: ['N-on-a1', 'N-on-a2', 'a1-solid-dashed-N-collinear', 'a2-solid-dashed-N-collinear', 'a1-dashed-to-N-endpoints', 'a2-dashed-to-N-endpoints', 'a1-dashed-beyond-N-endpoints', 'a2-dashed-beyond-N-endpoints'],
  },
  {
    id: 'source-angle-marks-and-labels',
    description: 'Visible line labels are a1 at left above the lower line, a2 at left below the upper line, and b right of the upper end of the transversal. Alpha has one arc at the upper b crossing, to the right of b and below a2. Beta has two nested arc strokes at the lower b crossing, to the right of b and above a1. Alpha and beta are the same-side interior angles facing N. No numbers, equality ticks, grids, or square right-angle mark are visible. The prose supplies the angle-sum-less-than-two-right-angles hypothesis, not numerical angle values.',
    objects: ['alpha-single-arc', 'beta-inner-arc', 'beta-outer-arc', 'a1-line-name', 'a2-line-name', 'b-line-name', 'alpha-name', 'beta-name'],
    assertions: f210.assertions.filter(item => /arc-/.test(item.id)).map(item => item.id),
  },
]

const angle = (center, first, last) => {
  const u = [first[0] - center[0], first[1] - center[1]]
  const v = [last[0] - center[0], last[1] - center[1]]
  return Math.atan2(u[0] * v[1] - u[1] * v[0], u[0] * v[0] + u[1] * v[1])
}
const alpha = angle(upper, bLow, a2End), beta = angle(lower, a1End, bHigh)
const scalarFacts = {
  fig209: {
    M_below_c: m[1] < ac[1],
    b_not_perpendicular_c: Math.abs((bTop[0] - bBottom[0]) * (cRight[0] - cLeft[0])) > 0,
    b_c_crossing_above_M: bc[1] > m[1],
  },
  fig210: {
    alpha_radians: alpha, beta_radians: beta,
    alpha_plus_beta_radians: alpha + beta,
    angle_sum_less_than_two_right_angles: alpha > 0 && beta > 0 && alpha + beta < Math.PI,
    N_right_of_transversal: n[0] > Math.max(lower[0], upper[0]),
    b_crossings_ordered: upper[1] > lower[1],
    N_beyond_both_solid_to_dashed_transitions: n[0] > a1Transition[0] && n[0] > a2Transition[0],
    both_dashed_ends_beyond_N: a1End[0] > n[0] && a2End[0] > n[0],
    no_perpendicular_or_parallel_assertion: !f210.assertions.some(item => ['perpendicular', 'parallel'].includes(item.type)),
  },
}
for (const [name, value] of Object.entries(scalarFacts.fig209)) assert.equal(value, true, name)
for (const [name, value] of Object.entries(scalarFacts.fig210)) {
  if (typeof value === 'boolean') assert.equal(value, true, name)
}

const executionPath = path.join(own, 'execution.json')
const previousExecution = fs.existsSync(executionPath)
  ? JSON.parse(fs.readFileSync(executionPath, 'utf8'))
  : null
if (repairDashes) {
  assert.equal(previousExecution?.commands.length, 7)
  assert.equal(previousExecution?.failures.length, 3)
  assert.ok(previousExecution.finishedAt)
  for (const suffix of ['spec.json', 'svg', 'render.json', 'desktop.png', 'mobile.png']) {
    assert.ok(fs.existsSync(path.join(own, `fig-210.r2.${suffix}`)))
  }
  previousExecution.failures.push({
    stage: 'author-visual', figure: 'fig-210', revision: 2,
    source: bind(path.join(sourceDir, 'fig-210.png')),
    screenshot: bind(path.join(own, 'fig-210.r2.desktop.png')),
    message: 'Native dash=2 produces short near-dotted strokes; source shows long dashed continuations. Repair only dash style to native dash=4.',
  })
}
if (previousExecution) {
  assert.ok([5, 7].includes(previousExecution.commands.length))
  assert.ok([2, 3, 4].includes(previousExecution.failures.length))
  assert.ok(fs.existsSync(path.join(own, 'execution.first-failure.json')))
  assert.ok(fs.existsSync(path.join(own, 'fig-209.r0.spec.json')))
  assert.ok(fs.existsSync(path.join(own, 'fig-210.r0.spec.json')))
  assert.ok(fs.existsSync(path.join(own, 'fig-210.r1.spec.json')))
  assert.ok(fs.existsSync(path.join(own, 'fig-210.r1.svg')))
  assert.ok(fs.existsSync(path.join(own, 'fig-210.r1.render.json')))
}
for (const spec of [f209, f210]) writeJson(path.join(own, `${spec.id}.spec.json`), spec)
const execution = {
  cwd: root, scope: ['fig-209', 'fig-210'], authorOnly: true,
  startedAt: previousExecution?.startedAt || new Date().toISOString(),
  commands: previousExecution?.commands || [], failures: previousExecution?.failures || [],
  contentRevisions: { 'fig-209': previousExecution ? 1 : 0, 'fig-210': repairDashes ? 3 : previousExecution ? 2 : 0 },
  revisionReason: previousExecution ? 'r1 both figures: add native-required 331px automatic check. r2 fig210 only: N gap 20px to 32px. r3 fig210 only when --repair-dashes: native dash=2 to dash=4 after author visual finding. Geometry unchanged; fig209 rendering and screenshots are reused.' : null,
}
writeJson(path.join(own, 'math-basis.json'), {
  sourceText: bind(templatePath), relevantSourceRefs: ['p0155#7', 'p0156#1', 'p0156#6'],
  approval: 'Provisional modern-text candidate supplied by caller; not approved here.',
  fig209: { aTop, aBottom, cLeft, cRight, M: m, bBottom, bTop, ac, bc },
  fig210: { a1Left, a2Left, a1End, a2End, a1Transition, a2Transition, bLow, bHigh, lower, upper, N: n },
  scalarFacts,
  additions: [
    'Clean deterministic straight strokes and generous margins replace scan wobble, stains, and local raster dropouts.',
    'Coordinates, slopes, arc radii, transition positions, line lengths, and label placements are illustrative modern layout, not source-measured numerical givens.',
    'No extra visible named point, coordinate label, numerical angle, parallel tick, or perpendicular mark is introduced.',
    'Caption and prose remain outside the SVG; source caption rows are not part of these isolated original PNGs.',
  ],
  unknowns: [
    { figure: 'fig-209', fact: 'Whether the tiny mark at M is a deliberate point-marker glyph rather than raster junction noise', status: 'UNKNOWN', treatment: 'Preserve M incidence and label; no filled dot is invented.' },
    { figure: 'fig-210', fact: 'Any special semantic role of the double beta arc beyond the visible two-stroke angle marking', status: 'UNKNOWN', treatment: 'Preserve both strokes; assert no equality or angle value.' },
  ],
  nativeValidatorLimit: 'pointRelationships requires at least two mapped visible point objects. Each source has one named point. Unlabelled intersections and ends are instead fully mapped through segment objects and coordinate-literal connects/pointOnLine/collinear assertions; no dots or names are invented to satisfy that category. Angle inequality and ordering, not natively supported assertion kinds, are executable scalar facts here.',
})
const run = argv => {
  const startedAt = new Date().toISOString()
  const result = spawnSync(argv[0], argv.slice(1), { cwd: root, encoding: 'utf8' })
  const receipt = { argv, startedAt, finishedAt: new Date().toISOString(), exitCode: result.status, stdout: result.stdout, stderr: result.stderr }
  execution.commands.push(receipt)
  if (result.status !== 0) execution.failures.push(receipt)
  writeJson(executionPath, execution)
  assert.equal(result.status, 0, result.stderr || result.stdout)
}
for (const spec of [f209, f210]) {
  if (previousExecution && (spec.id === 'fig-209' || (previousExecution.commands.length === 7 && !repairDashes))) {
    const report = JSON.parse(fs.readFileSync(path.join(own, `${spec.id}.render.json`), 'utf8'))
    assert.equal(report.status, 'pass')
    assert.equal(report.spec.sha256, hash(path.join(own, `${spec.id}.spec.json`)))
    assert.equal(report.output.svg.sha256, hash(path.join(own, `${spec.id}.svg`)))
    continue
  }
  run(['python3', path.join(skill, 'scripts/validate_spec.py'), path.join(own, `${spec.id}.spec.json`), '--stage', 'draft', '--json'])
  run(['node', path.join(skill, 'scripts/render_spec.mjs'), '--spec', path.join(own, `${spec.id}.spec.json`), '--svg', path.join(own, `${spec.id}.svg`), '--report', path.join(own, `${spec.id}.render.json`)])
}

const requireApp = createRequire(path.join(root, 'app/package.json'))
const { chromium } = requireApp('playwright')
const browser = await chromium.launch({ headless: false })
const surfaces = repairDashes
  ? JSON.parse(fs.readFileSync(path.join(own, 'display-evidence.json'), 'utf8')).filter(item => item.figure === 'fig-209')
  : []
try {
  for (const [name, viewport, mediaWidth] of [
    ['desktop', { width: 1440, height: 960 }, 640],
    ['mobile', { width: 390, height: 844 }, 358],
  ]) {
    const page = await browser.newPage({ viewport, deviceScaleFactor: 1 })
    await page.route('**/*', route => route.abort())
    for (const spec of [f209, f210]) {
      if (repairDashes && spec.id === 'fig-209') continue
      const svgPath = path.join(own, `${spec.id}.svg`)
      const pngPath = path.join(own, `${spec.id}.${name}.png`)
      await page.setContent(`<!doctype html><meta charset="utf-8"><style>
        html,body{margin:0;background:white}
        body{padding:16px;box-sizing:border-box}
        main{max-width:640px;margin:0 auto}
        svg{display:block;width:100%;height:auto}
      </style><main>${fs.readFileSync(svgPath, 'utf8')}</main>`)
      await page.evaluate(() => document.fonts.ready)
      const measurements = await page.locator('svg').evaluate(svg => {
        const media = svg.getBoundingClientRect()
        const labels = [...svg.querySelectorAll('text')].map(node => {
          const matrix = node.getScreenCTM()
          const rect = node.getBoundingClientRect()
          return {
            id: node.getAttribute('data-label-id'), text: node.textContent,
            px: Number(node.getAttribute('font-size')) * Math.hypot(matrix.a, matrix.b),
            rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
            insideMedia: rect.left >= media.left && rect.right <= media.right && rect.top >= media.top && rect.bottom <= media.bottom,
          }
        })
        const strokes = [...svg.querySelectorAll('path,line')].filter(node => node.getAttribute('display') !== 'none' && Number.parseFloat(node.getAttribute('stroke-width')) > 0)
        return { media: { width: media.width, height: media.height }, labels, strokeCount: strokes.length }
      })
      assert.ok(Math.abs(measurements.media.width - mediaWidth) < 0.01)
      assert.ok(measurements.labels.length > 0 && measurements.strokeCount > 0)
      assert.ok(measurements.labels.every(item => item.px >= 16 && item.insideMedia))
      await page.locator('svg').screenshot({ path: pngPath, animations: 'disabled' })
      surfaces.push({
        figure: spec.id, surface: name, viewport, mediaWidth, measurements,
        input: bind(svgPath), screenshot: bind(pngPath),
        kind: 'Offline headed native-SVG media evidence at the caller-specified actual CSS widths; not product acceptance or independent review.',
      })
      writeJson(path.join(own, 'display-evidence.json'), surfaces)
    }
    await page.close()
  }
} catch (error) {
  execution.failures.push({ stage: 'bounded-display', message: error.message })
  writeJson(executionPath, execution)
  throw error
} finally {
  await browser.close()
}
execution.finishedAt = new Date().toISOString()
execution.displayScreenshots = surfaces.length
execution.totalScreenshotFilesProduced = repairDashes ? 6 : surfaces.length
writeJson(executionPath, execution)
console.log(JSON.stringify({
  candidateOnly: true, outputDirectory: own, scalarFacts,
  nativeCommands: execution.commands.length, failures: execution.failures.length,
  screenshotsProduced: surfaces.length,
  screenshotsNotYetVisuallyInspected: true,
}, null, 2))
