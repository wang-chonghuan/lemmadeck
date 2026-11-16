import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'

const root = process.cwd()
const base = path.join(root, '.tmp/s10y-image/batch007/10c')
const inventoryPath = '.intentfold/tickets/STEMROBIN-184/tmp/ana10-n81-figure-author-source-inventory.md'
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
const inventory = fs.readFileSync(path.join(root, inventoryPath), 'utf8')
assert.equal(sha(inventory), '28d9e880a134042deff90f9a29e516e4a80a32f4975d4bd584254ef74a8f9f89')
const pi = Math.PI
const configs = {
  12: {
    solid: ['sin', 1, 1, pi / 4, -1.98 * pi, 2.90 * pi],
    dashed: ['sin', 1, 1, 0, -2.1 * pi, 3.1 * pi],
    labels: ['y = sin(x + pi/4)', 'y = sin x'],
    xTicks: [[-pi / 4, '-pi/4']], yTicks: [[1, '1'], [-1, '-1']],
    roots: [5, 6], crests: [3, 3], troughs: [2, 2], height: 360,
    summary: 'Solid shifted left pi/4, dashed sin x. Each has three positive crests and two troughs; solid five roots, dashed six. Solid begins above/ends below, inside the longer dashed path with both ends below. Two arrowed formula leaders, no marked curve points.',
    transform: [-pi / 4, 0],
  },
  13: {
    solid: ['sin', 1, 1, -pi / 3, -1.85 * pi, 2.98 * pi],
    dashed: ['sin', 1, 1, 0, -2.1 * pi, 3.1 * pi],
    labels: ['y = sin(x - pi/3)', 'y = sin x'],
    xTicks: [[pi / 3, 'pi/3']], yTicks: [[1, '1'], [-1, '-1']],
    roots: [5, 6], crests: [3, 3], troughs: [2, 2], height: 360,
    summary: 'Solid shifted right pi/3, dashed sin x. Each has three positive crests/two troughs; solid five roots, dashed six. Solid begins below/ends above, dashed both ends below and spans farther. Two separate arrowed formula leaders; no marked intersections.',
    transform: [pi / 3, 0],
  },
  14: {
    solid: ['cos', 4, 1, 0, -2.5 * pi, 2.5 * pi],
    dashed: ['cos', 1, 1, 0, -2.5 * pi, 2.5 * pi],
    labels: ['y = 4 cos x', 'y = cos x'],
    xTicks: [], yTicks: [[4, '4'], [-4, '-4']],
    roots: [6, 6], crests: [3, 3], troughs: [2, 2], height: 560,
    summary: 'Shared six zeros including both finite ends, three crests/two troughs, central crest on y-axis. Solid 4 cos x, dashed cos x. Only +/-4 y numerals; no x numerals, no leaders. SOURCE SCHEMATIC LIMIT: frozen source ink does not establish a metrologically exact 4:1 excursion. This candidate explicitly regularizes to the approved TEXT-defined factor4, not a recovered pixel ratio or registered source erratum.',
    amplitude: 4,
  },
  15: {
    solid: ['cos', 2 / 3, 1, 0, -1.75 * pi, 1.30 * pi],
    dashed: ['cos', 1, 1, 0, -1.75 * pi, 1.30 * pi],
    labels: ['y = (2/3) cos x', 'y = cos x'],
    xTicks: [], yTicks: [[1, '1'], [-1, '-1'], [-2 / 3, '-2/3']],
    roots: [3, 3], crests: [1, 1], troughs: [2, 2], height: 420,
    summary: 'Equal phase, central crest/two troughs, three shared interior roots. Both finite left ends positive and right ends negative. Solid amplitude2/3 below dashed unit amplitude; y1,-1,-2/3 only, no positive2/3 or x numeral. Two unled formula labels.',
    amplitude: 2 / 3,
  },
  16: {
    solid: ['cos', 1, 0.5, 0, -2.10 * pi, 2.10 * pi],
    dashed: ['cos', 1, 1, 0, -2.0 * pi, 2.18 * pi],
    labels: ['y = cos(x/2)', 'y = cos x'],
    xTicks: [[-pi, '-pi'], [pi, 'pi'], [2 * pi, '2pi']], yTicks: [],
    roots: [2, 4], crests: [1, 3], troughs: [2, 2], height: 360,
    summary: 'Broad solid cos(x/2) has two zeros at +/-pi, central crest and outer negative trough regions; dashed cos x has four roots, three positive crest regions/two troughs. At2pi solid negative trough/dashed positive crest. Distinct finite end positions; no y numerals, no leaders.',
    horizontal: 2,
  },
  17: {
    solid: ['cos', 1, 20, 0, -9 * pi / 40, 9 * pi / 40],
    dashed: ['cos', 1, 1, 0, -0.28 * pi, 0.28 * pi],
    labels: ['y = cos 20x', 'y = cos x'],
    xTicks: [[pi / 10, 'pi/10'], [pi / 5, 'pi/5']], yTicks: [[-1, '-1']],
    roots: [10, 0], crests: [5, 1], troughs: [4, 0], height: 560,
    summary: 'Solid ten zeros including both ends, five narrow crests/four troughs. Dashed broad positive-only arch spans farther, no dashed zeros or negative lobes. pi/10 and pi/5 are first/second positive solid maxima to the right; only y-1 numeral, no leaders.',
    horizontal: 1 / 20,
  },
  18: {
    solid: ['cos', 1, 2, 0, -2.04 * pi, 2.04 * pi],
    dashed: ['cos', 1, 1, 0, -2.04 * pi, 2.04 * pi],
    labels: ['y = cos 2x'],
    xTicks: [[pi, 'pi'], [2 * pi, '2pi']], yTicks: [],
    roots: [8, 4], crests: [5, 3], troughs: [4, 2], height: 360,
    summary: 'Solid eight roots/five positive crest regions/four troughs, dashed four roots/three crest regions/two troughs. Both ends positive. pi: solid positive versus dashed negative;2pi both positive. Only solid formula printed. Dashed cos x binding comes from approved example step1, NOT a recovered source graphic label; no added dashed formula.',
    horizontal: 1 / 2,
  },
  19: {
    solid: ['cos', 1, 2, 4, (-2.7 * pi - 4) / 2, (5 * pi - 4) / 2],
    dashed: ['cos', 1, 2, 0, -2.06 * pi, 2.06 * pi],
    labels: ['y = cos(2x + 4)'],
    xTicks: [[-2, '-2']], yTicks: [],
    roots: [8, 8], crests: [4, 5], troughs: [4, 4], height: 360,
    summary: 'Solid eight roots/four crests, negative left start and terminal right trough. Dashed eight roots/five crest regions/four troughs, positive end regions beyond solid. Solid negative and rising at origin. Separate vertical dashed guide from solid crest at x=-2 down to axis. Only solid formula; dashed cos2x identity is approved example step2-derived, not printed.',
    transform: [-2, 0],
  },
  20: {
    solid: ['cos', 3, 2, 4, (-2.5 * pi - 4) / 2, (5.5 * pi - 4) / 2],
    dashed: ['cos', 1, 2, 4, (-2.5 * pi - 4) / 2, (5.5 * pi - 4) / 2],
    labels: ['y = 3 cos(2x + 4)'],
    xTicks: [], yTicks: [[3, '3']],
    roots: [9, 9], crests: [4, 4], troughs: [4, 4], height: 560,
    summary: 'Nine shared zeros including both ends, four crests/four troughs/eight full lobes. Solid3 cos(2x+4), dashed cos(2x+4) is approved step3-derived with NO graphic formula label. Separate horizontal dashed y=3 guide to first right solid crest and vertical dashed guide through left solid/dashed crests to axis. No printed x=-2, no added -3 or unit labels.',
    amplitude: 3,
  },
}

function value(curve, x) {
  const [kind, amplitude, omega, phase] = curve
  return amplitude * Math[kind](omega * x + phase)
}
function special(curve, offset, period) {
  const [, , omega, phase, lo, hi] = curve
  const result = []
  for (let n = -100; n <= 100; n++) {
    const x = (offset + n * period - phase) / omega
    if (x >= lo - 1e-10 && x <= hi + 1e-10) result.push(x)
  }
  return result
}
function facts(curve) {
  const kind = curve[0]
  return {
    roots: special(curve, kind === 'sin' ? 0 : pi / 2, pi),
    crests: special(curve, kind === 'sin' ? pi / 2 : 0, 2 * pi),
    troughs: special(curve, kind === 'sin' ? -pi / 2 : pi, 2 * pi),
    endpoints: [[curve[4], value(curve, curve[4])], [curve[5], value(curve, curve[5])]],
  }
}
function curvePath(curve, box) {
  const [xmin, ymax] = box
  const count = 3200
  const samples = Array.from({ length: count + 1 }, (_, i) => {
    const x = curve[4] + (curve[5] - curve[4]) * i / count
    return [x, value(curve, x)]
  })
  return {
    d: samples.map(([x, y], i) => `${i ? 'L' : 'M'}${(x - xmin).toFixed(9)},${(ymax - y).toFixed(9)}`).join(' '),
    sampleCount: samples.length,
  }
}
function crossings(a, b) {
  const lo = Math.max(a[4], b[4])
  const hi = Math.min(a[5], b[5])
  const roots = []
  const add = x => { if (!roots.some(r => Math.abs(r - x) < 1e-6)) roots.push(x) }
  const f = x => value(a, x) - value(b, x)
  const step = (hi - lo) / 12000
  for (let i = 0; i <= 12000; i++) {
    const x = lo + step * i
    if (Math.abs(f(x)) < 1e-10) add(x)
    if (i && f(x - step) * f(x) < 0) {
      let l = x - step
      let r = x
      for (let k = 0; k < 48; k++) {
        const m = (l + r) / 2
        if (f(l) * f(m) <= 0) r = m
        else l = m
      }
      add((l + r) / 2)
    }
  }
  for (const x of [...facts(a).crests, ...facts(a).troughs, ...facts(a).roots]) {
    if (x >= lo && x <= hi && Math.abs(f(x)) < 1e-10) add(x)
  }
  return roots.sort((x, y) => x - y).map(x => [x, value(a, x)])
}

for (const number of Object.keys(configs).map(Number)) {
  const id = `fig-${number}`
  const directory = path.join(base, id)
  const target = path.join(directory, 'spec.json')
  if (fs.existsSync(target)) throw new Error(`Preserve existing ${target}`)
  const c = configs[number]
  const contextBytes = fs.readFileSync(path.join(directory, 'context.json'))
  const context = JSON.parse(contextBytes)
  assert.equal(sha(fs.readFileSync(path.join(root, context.sourceImage.path))), context.sourceImage.sha256)
  const sourceSection = inventory.split(`## Figure ${number}: Frozen Pixels\n`)[1].split('\n## ')[0]
  const authoritativeText = context.lessons.flatMap(l => [
    { lesson: l.lesson, text: l.title },
    ...l.prose.flatMap(p => p.nearbyText.map(text => ({ lesson: l.lesson, text }))),
    ...l.exercises.map(e => ({ lesson: l.lesson, exercise: e.exercise, text: e.text })),
  ])
  const curveMin = Math.min(c.solid[4], c.dashed[4])
  const curveMax = Math.max(c.solid[5], c.dashed[5])
  const span = curveMax - curveMin
  const amp = c.solid[1] > 1 ? c.solid[1] : 1
  const box = [curveMin - span * 0.14, amp * 1.80, curveMax + span * 0.19, -amp * 1.70]
  const [xmin, ymax, xmax, ymin] = box
  const width = xmax - xmin
  const height = ymax - ymin
  const objects = []
  const assertions = []
  const groups = []
  const addLine = (id, type, from, to, extras = {}) => {
    objects.push({ id, type, from, to, stroke: 'ink', strokeWidth: 1.5, ...extras })
    assertions.push({ id: `${id}-attachment`, type: 'connects', arrow: id, from, to })
  }
  const text = (id, at, content, extras = {}) => {
    objects.push({ id, type: 'text', at, text: content, fontSize: 18, fontWeight: 400,
      labelColor: 'ink', labelPlacement: { position: 'CENTER' }, ...extras })
  }
  const xAxis = [[xmin + 0.04 * width, 0], [xmax - 0.045 * width, 0]]
  const yAxis = [[0, ymin + 0.11 * height], [0, ymax - 0.12 * height]]
  addLine('x-axis', 'arrow', ...xAxis)
  addLine('y-axis', 'arrow', ...yAxis)
  text('x-label', [xmax - 0.022 * width, 0.10 * amp], 'x')
  text('y-label', [0.035 * width, ymax - 0.11 * height], 'y')
  // A visible uncertainty marker is not a recovered source O/0 codepoint.
  text('origin-unknown', [-0.035 * width, -0.22 * amp], '?')
  assertions.push({ id: 'axes-perpendicular', type: 'perpendicular',
    a: xAxis[0], b: xAxis[1], c: yAxis[0], d: yAxis[1] })
  groups.push({ id: 'shared-frame', description: 'One shared ungridded frame with x right arrow, y up arrow; no left/down arrow or invented grid. Original origin oval stays ROUND-GLYPH-UNKNOWN: modern ? is an explicit uncertainty marker, NOT numeral0/LatinO/Cyrillic recovery. Axis tilt regularized, not an asserted metric pixel scale.',
    objects: ['x-axis', 'y-axis', 'x-label', 'y-label', 'origin-unknown'],
    assertions: ['x-axis-attachment', 'y-axis-attachment', 'axes-perpendicular'] })
  const tickObjects = []
  const tickAssertions = []
  for (const [x, label] of c.xTicks) {
    const tickId = `x-tick-${tickObjects.length}`
    addLine(tickId, 'segment', [x, -0.045 * amp], [x, 0.045 * amp])
    text(`${tickId}-value`, [x, -0.24 * amp], label)
    assertions.push({ id: `${tickId}-axis`, type: 'pointOnLine', point: [x, 0], a: xAxis[0], b: xAxis[1] })
    tickObjects.push(tickId, `${tickId}-value`)
    tickAssertions.push(`${tickId}-attachment`, `${tickId}-axis`)
  }
  for (const [y, label] of c.yTicks) {
    const tickId = `y-tick-${tickObjects.length}`
    addLine(tickId, 'segment', [-0.009 * width, y], [0.009 * width, y])
    text(`${tickId}-value`, [-0.042 * width, y], label)
    assertions.push({ id: `${tickId}-axis`, type: 'pointOnLine', point: [0, y], a: yAxis[0], b: yAxis[1] })
    tickObjects.push(tickId, `${tickId}-value`)
    tickAssertions.push(`${tickId}-attachment`, `${tickId}-axis`)
  }
  if (tickObjects.length) groups.push({ id: 'printed-ticks', description: `Only printed tick values preserved: x ${JSON.stringify(c.xTicks.map(t => t[1]))}, y ${JSON.stringify(c.yTicks.map(t => t[1]))}. No endpoint numerals, new scale or extra origin value.`, objects: tickObjects, assertions: tickAssertions })
  const ledger = {
    schema: 'STEMROBIN-184/author-curve-ledger@1', id, role: 'author numerical construction, NOT independent review',
    source: context.sourceImage, inventory: { path: inventoryPath, sha256: sha(inventory) },
    context: { path: path.relative(root, path.join(directory, 'context.json')), sha256: sha(contextBytes) },
    modernSampling: 'Finite numerical endpoints are author-declared to retain frozen lobe counts and endpoint polarities; NOT recovered source bounds. Source formulas are body examples, not solved read-off exercises. No endpoint/criticalpoint markers or new labels are drawn.',
    frozenSummary: c.summary, sourcePixelSection: sourceSection,
    curves: [], intersections: crossings(c.solid, c.dashed), checks: [],
  }
  const relationIDs = []
  for (const [index, role] of ['solid', 'dashed'].entries()) {
    const curve = c[role]
    const f = facts(curve)
    assert.equal(f.roots.length, c.roots[index], `${id} ${role} root inventory`)
    assert.equal(f.crests.length, c.crests[index], `${id} ${role} crest inventory`)
    assert.equal(f.troughs.length, c.troughs[index], `${id} ${role} trough inventory`)
    const sampled = curvePath(curve, box)
    objects.push({ id: `${role}-curve`, type: 'svgPath', d: sampled.d,
      stroke: role === 'solid' ? 'accent' : 'muted', fill: 'paper', fillOpacity: 0,
      strokeWidth: role === 'solid' ? 2.6 : 1.5, ...(role === 'dashed' ? { dash: 2 } : {}) })
    const ids = []
    for (const [kind, coordinates, y] of [['zero', f.roots, 0], ['crest', f.crests, curve[1]], ['trough', f.troughs, -curve[1]]]) {
      coordinates.forEach((x, i) => {
        const assertionId = `${role}-${kind}-${i}`
        const actual = value(curve, x)
        assertions.push({ id: assertionId, type: 'displacement', from: [x, 0], to: [x, actual], dx: 0, dy: y, tolerance: 1e-8 })
        ids.push(assertionId)
      })
    }
    relationIDs.push(...ids)
    ledger.curves.push({ role, formulaTuple: curve, tupleFields: ['sin-or-cos', 'amplitude', 'omega', 'phase', 'finiteLo', 'finiteHi'],
      ...f, sampleCount: sampled.sampleCount, pathSha256: sha(sampled.d),
      check: 'All analytical roots/extrema checked against frozen counts. Separate saved path check decodes every sample and verifies function residual; literal assertions alone are not a path proof.' })
    groups.push({ id: `${role}-path`, description: `${role.toUpperCase()} source path. ${c.summary} All finite sampling endpoints declared as modern choices, not source coordinate recovery. Complete source pixel inventory is frozen at ${inventoryPath}; numerical ledger binds every curve sample to its exact formula. No visible dots at analytical witness positions.`, objects: [`${role}-curve`], assertions: ids })
  }
  ledger.intersections.forEach(([x, y], i) => {
    const id = `shared-curve-crossing-${i}`
    assertions.push({ id, type: 'displacement', from: [x, value(c.solid, x)], to: [x, value(c.dashed, x)], dx: 0, dy: 0, tolerance: 1e-8 })
    relationIDs.push(id)
  })
  if (c.transform) {
    for (const x of facts(c.dashed).crests) {
      const shifted = x + c.transform[0]
      if (shifted < c.solid[4] || shifted > c.solid[5]) continue
      const id = `translation-witness-${relationIDs.length}`
      assertions.push({ id, type: 'displacement', from: [x, value(c.dashed, x)], to: [shifted, value(c.solid, shifted)], dx: c.transform[0], dy: c.transform[1], tolerance: 1e-8 })
      relationIDs.push(id)
    }
  }
  if (c.amplitude || c.horizontal) {
    for (const x of facts(c.dashed).crests.concat(facts(c.dashed).troughs)) {
      const sx = x * (c.horizontal || 1)
      if (sx < c.solid[4] - 1e-8 || sx > c.solid[5] + 1e-8) continue
      const y = value(c.dashed, x)
      const sy = y * (c.amplitude || 1)
      const id = `scaling-witness-${relationIDs.length}`
      assertions.push({ id, type: 'displacement', from: [x, y], to: [sx, value(c.solid, sx)], dx: sx - x, dy: sy - y, tolerance: 1e-8 })
      relationIDs.push(id)
    }
  }
  groups.push({ id: 'paired-curves', description: `Exact appropriate source-text relationship and every analytical crossing over the shared finite interval; no solution-derived coordinate, dot or new query. ${c.summary}`, objects: ['solid-curve', 'dashed-curve'], assertions: relationIDs })
  const labelObjects = []
  const labelAssertions = []
  const formulaY = ymax - 0.065 * height
  c.labels.forEach((label, i) => {
    const role = i === 0 ? 'solid' : 'dashed'
    const at = [xmin + (i === 0 ? 0.69 : 0.29) * width, formulaY]
    text(`${role}-formula`, at, label, { labelColor: role === 'solid' ? 'accent' : 'muted' })
    labelObjects.push(`${role}-formula`)
    if (number === 12 || number === 13) {
      const x = number === 12 ? (i === 0 ? 1.80 * pi : pi / 2 + 0.10) : (i === 0 ? 5 * pi / 6 : 2.10 * pi)
      const end = [x, value(c[role], x)]
      const start = [at[0], formulaY - 0.19 * amp]
      addLine(`${role}-leader`, 'arrow', start, end, { stroke: role === 'solid' ? 'accent' : 'muted', strokeWidth: 1.2 })
      labelObjects.push(`${role}-leader`)
      labelAssertions.push(`${role}-leader-attachment`)
      ledger.checks.push({ type: 'formula-leader', role, arrow: `${role}-leader`, formula: label, endpoint: end, formulaResidual: Math.abs(end[1] - value(c[role], end[0])) })
    }
  })
  groups.push({ id: 'printed-formulas', description: `Exactly ${c.labels.length} printed formulas, with arrowed leaders ONLY in12/13. Plain English mathematical spelling pi replaces printed pi symbol without changing value. Dashed comparison formulas absent from18--20 are NOT newly printed. Unled labels moved into generous top whitespace while retaining path style association.`, objects: labelObjects, assertions: labelAssertions })
  if (number === 19 || number === 20) {
    const top = [number === 19 ? -2 : -2, amp]
    const bottom = [top[0], 0]
    addLine('vertical-crest-guide', 'segment', top, bottom, { dash: 2, stroke: 'muted', strokeWidth: 1.2 })
    const guideIDs = ['vertical-crest-guide']
    const assertionIDs = ['vertical-crest-guide-attachment']
    ledger.checks.push({ type: 'guide-to-solid-crest', guide: 'vertical-crest-guide', top, residual: Math.abs(top[1] - value(c.solid, top[0])) })
    if (number === 20) {
      const end = [pi - 2, 3]
      addLine('horizontal-height-guide', 'segment', [0, 3], end, { dash: 2, stroke: 'muted', strokeWidth: 1.2 })
      guideIDs.push('horizontal-height-guide')
      assertionIDs.push('horizontal-height-guide-attachment')
      ledger.checks.push({ type: 'guide-to-solid-crest', guide: 'horizontal-height-guide', top: end, residual: Math.abs(end[1] - value(c.solid, end[0])) })
    }
    groups.push({ id: 'separate-projection-guides', description: number === 19 ?
      'Original straight dashed vertical guide from solid crest at printed x=-2 to x-axis. Not a third curve or leader arrow.' :
      'Two separate original straight dashed guides: unlabelled vertical through corresponding left crests down to axis; horizontal y=3 to first solid crest right of y-axis. Vertical abscissa derives from approved step sequence; no printed -2 is asserted or added.',
    objects: guideIDs, assertions: assertionIDs })
  }
  const spec = {
    schema: 'ld-s10y-image/figure-spec@2', id, mode: 'deterministic',
    description: `n81 approved instructional body illustration. ${c.summary} One shared coordinate frame. ROUND-GLYPH-UNKNOWN remains unresolved; visible ? explicitly marks this, never O/0 recovery. Numerical finite endpoints are declared modern sampling choices retaining all frozen lobes/end polarities, not reconstructed source domain. No source read-off task or answer annotation. Labels >=16 at actual fixed640 scroll media on desktop/mobile. No headed product acceptance is claimed.`,
    source: { image: { path: context.sourceImage.path, sha256: context.sourceImage.sha256 }, authoritativeText, inventory: groups },
    canvas: { width: 640, height: c.height, boundingBox: box, background: 'paper', keepAspectRatio: false },
    display: { purpose: 'instructional', layout: 'scroll', minTextPx: 16, widths: [640] },
    objects, assertions, layout: { minLabelGap: 4, avoidRegions: [] },
  }
  fs.writeFileSync(target, `${JSON.stringify(spec, null, 2)}\n`, { flag: 'wx' })
  ledger.spec = { path: path.relative(root, target), sha256: sha(fs.readFileSync(target)) }
  fs.writeFileSync(path.join(directory, 'author-curve-ledger.json'), `${JSON.stringify(ledger, null, 2)}\n`, { flag: 'wx' })
  console.log(JSON.stringify({ id, spec: ledger.spec, objects: objects.length, assertions: assertions.length, roots: ledger.curves.map(l => l.roots.length) }))
}
