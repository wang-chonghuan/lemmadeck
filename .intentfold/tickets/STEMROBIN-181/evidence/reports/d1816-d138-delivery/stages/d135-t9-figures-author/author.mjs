import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'

const root = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
const own = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d135-t9-figures-author')
assert.equal(process.cwd(), root)
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const hash = p => ({
  path: path.resolve(p), bytes: fs.statSync(p).size,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'),
})
const save = (p, data) => {
  assert.ok(path.resolve(p).startsWith(`${own}/`))
  assert.ok(!p.endsWith('.input-context.json') && !p.endsWith('/input-freeze.json'))
  assert.ok(!fs.existsSync(p), `refusing overwrite: ${p}`)
  fs.writeFileSync(p, `${JSON.stringify(data, null, 2)}\n`)
}
const instructions = [
  '.claude/skills/ld-s10y-lesson/references/production-resume.md',
  '.agents/skills/ld-s10y-image/SKILL.md',
  '.agents/skills/ld-s10y-image/references/routing.md',
  '.agents/skills/ld-s10y-image/references/figure-spec.md',
  '.agents/skills/ld-s10y-image/references/quality-gate.md',
]
const validator = path.join(root, '.agents/skills/ld-s10y-image/scripts/validate_spec.py')
const renderer = path.join(root, '.agents/skills/ld-s10y-image/scripts/render_spec.mjs')
const sourceObservations = read(path.join(own, 'source-observations.json'))
assert.equal(sourceObservations.actualImageOpensAtRecord, 2)
const frozenInputs = read(path.join(own, 'input-freeze.json'))
for (const binding of frozenInputs.contexts) assert.deepEqual(hash(binding.path), binding)
const contexts = Object.fromEntries(['fig-24', 'fig-30'].map(id => [
  id, read(path.join(own, `${id}.input-context.json`)),
]))
for (const ctx of Object.values(contexts)) {
  for (const b of [ctx.currentIsolatedSourceImage, ctx.byteIdenticalDurableSourceImage,
    ...Object.values(ctx.nativeContexts),
    ...Object.values(ctx.draftTextBindings).flatMap(x => [x.exercises, x.lesson]),
    ctx.sourceExercises]) assert.deepEqual(hash(b.path), b)
}

const supplementalPath = path.join(root,
  'ssot-resources/soviet10year-textbooks/artifacts/9p/lessons/phy9-c1-s2-n17/lesson.json')
const original = read(supplementalPath)
const paragraphs = original.prose.flatMap((p, index) =>
  p.kind === 'p' && p.text.includes('图 $24$')
    ? [{ jsonPointer: `/prose/${index}`, ...p }] : [])
assert.equal(paragraphs.length, 2)
const supplemental = {
  schema: 'd135/permitted-source-context@1',
  binding: hash(supplementalPath),
  authorization: 'Direct human addition: only the two original prose paragraphs mentioning Figure 24.',
  paragraphs,
  exclusions: ['exercises', 'answers', 'solved examples', 'modern figures'],
  sourceInventoryUnchanged: hash(path.join(own, 'source-observations.json')),
  sourceApprovalImplied: false,
}

const font = (size = 22) => ({ fontSize: size, fontWeight: 500 })
function makeFigure(id, canvas, screenTransform) {
  const ctx = contexts[id]
  const objects = [], assertions = []
  const points = {}
  const user = ([x, y]) => {
    const [sx, sy] = screenTransform([x, y])
    return [sx, canvas.height - sy]
  }
  const pt = (name, source, label, placement) => {
    const at = user(source)
    points[name] = source
    objects.push({
      id: name, type: 'point', at, size: 1.1, strokeWidth: 0.6,
      stroke: 'ink', fill: 'ink',
      ...(label ? { label, ...font(id === 'fig-30' ? 28 : 22),
        labelPlacement: { position: placement || 'NE', gap: 16 } } : {}),
    })
    return name
  }
  const text = (name, at, label) => objects.push({
    id: name, type: 'text', at: user(at), text: label,
    ...font(id === 'fig-30' ? 28 : 22),
    labelPlacement: { position: 'CENTER' },
  })
  const displacement = (name, a, b) => {
    const [ax, ay] = user(points[a]), [bx, by] = user(points[b])
    assertions.push({ id: name, type: 'displacement', from: a, to: b,
      dx: bx - ax, dy: by - ay, tolerance: 0.000001 })
  }
  const edge = (name, from, to, kind = 'segment', dash = 0, width = 2.4) => {
    objects.push({ id: name, type: kind, from, to, stroke: 'ink', strokeWidth: width, dash })
    assertions.push({ id: `${name}-connects`, type: 'connects', arrow: name, from, to })
  }
  const groups = []
  const group = (name, description, names, relations) => groups.push({
    id: name, description, objects: names, assertions: relations,
    ...(names.filter(n => points[n]).length >= 2 ? { requires: ['pointRelationships'] } : {}),
  })
  const q = Object.fromEntries(['zh', 'en'].map(lang => {
    const native = read(ctx.nativeContexts[lang].path)
    return [lang, native.lessons[0].exercises.find(e => e.exercise === '2').text]
  }))
  const authoritative = ['zh', 'en'].map(lang => ({
    lesson: ctx.lesson, exercise: '2', text: q[lang],
  }))
  authoritative.push({
    lesson: ctx.lesson,
    text: `Input context and full bilingual T9 text locators: ${path.join(own, `${id}.input-context.json`)}#/fullText/zh; #/fullText/en; #/fullText/originalZh. Native locators: ${ctx.nativeContexts.zh.path}#/lessons/0/exercises/0; ${ctx.nativeContexts.en.path}#/lessons/0/exercises/0. Draft lesson/exercise source locators and hashes: ${JSON.stringify(ctx.draftTextBindings)}. Primary original image: ${ctx.currentIsolatedSourceImage.path}. Original T9 exercises binding: ${JSON.stringify(ctx.sourceExercises)}. These are unfinalized draft carriers, not course approvals. Parent caption localization is bound only, not re-reviewed.`,
  })
  if (id === 'fig-24') for (const p of paragraphs) authoritative.push({
    lesson: 'phy9-c1-s2-n17',
    text: `${supplementalPath}#${p.jsonPointer}; printed_page=${p.printed_page}; source_refs=${p.source_refs.join(',')}\n${p.text}`,
  })
  return {
    pt, text, edge, displacement, group, points, user, objects, assertions, groups,
    spec: {
      schema: 'ld-s10y-image/figure-spec@2', id, mode: 'deterministic',
      description: id === 'fig-24'
        ? 'Shared p-V process graph: preserve constant-p1 1-to-1-prime, isothermal T2 1-prime-to-2, both complete source curve extents and dashed projections; no answer annotations or numerical scale.'
        : 'Shared V-T graph preserving all three directed straight processes and the dashed origin ray; no answer annotations or numerical scale.',
      source: {
        image: { path: ctx.currentIsolatedSourceImage.path, sha256: ctx.currentIsolatedSourceImage.sha256 },
        authoritativeText: authoritative, inventory: groups,
      },
      canvas: { ...canvas, boundingBox: [0, canvas.height, canvas.width, 0],
        background: 'paper', keepAspectRatio: true },
      display: { purpose: 'instructional', layout: 'scroll', widths: [640], minTextPx: 16 },
      objects, assertions, layout: { minLabelGap: 3 },
    },
  }
}

function figure24() {
  const f = makeFigure('fig-24', { width: 640, height: 576 }, ([x, y]) => [x + 7, y + 6])
  const { pt, text, edge, displacement, group, objects, assertions } = f
  // Plot-space products fix only the isothermal geometry, not physical units.
  const K = (314 - 42) * (514 - 208)
  const y1 = 514 - K / (479 - 42)
  const curveY = x => 514 - K / (x - 42)
  pt('origin', [42, 514])
  pt('pressure-axis-end', [42, 16])
  pt('volume-axis-end', [610, 514])
  pt('pressure-1', [42, y1])
  pt('pressure-2', [42, 208])
  pt('volume-1', [187, 514])
  pt('volume-2', [314, 514])
  pt('volume-prime', [479, 514])
  pt('state-1', [187, y1], '1', 'SW')
  pt('state-1-prime', [479, y1], "1'", 'NE')
  pt('state-2', [314, 208], '2', 'NE')
  pt('lower-start', [108, 65])
  pt('lower-at-volume-2', [314, 416])
  pt('lower-at-volume-prime', [479, 455])
  pt('lower-end', [573, 462])
  pt('upper-start', [227, 62])
  pt('upper-end', [573, 362])
  pt('horizontal-arrow-start', [246, y1])
  pt('horizontal-arrow-end', [273, y1])
  pt('curve-arrow-start', [392, curveY(392)])
  pt('curve-arrow-end', [377, curveY(377)])
  edge('pressure-axis', 'origin', 'pressure-axis-end', 'arrow')
  edge('volume-axis', 'origin', 'volume-axis-end')
  edge('pressure-1-guide', 'pressure-1', 'state-1', 'segment', 2, 1.5)
  edge('pressure-2-guide', 'pressure-2', 'state-2', 'segment', 2, 1.5)
  for (const [v, s] of [['volume-1', 'state-1'], ['volume-2', 'state-2'], ['volume-prime', 'state-1-prime']])
    edge(`${v}-guide`, v, s, 'segment', 2, 1.5)
  edge('process-1-to-1-prime', 'state-1', 'state-1-prime')
  edge('horizontal-process-arrow', 'horizontal-arrow-start', 'horizontal-arrow-end', 'arrow')
  edge('isothermal-process-arrow', 'curve-arrow-start', 'curve-arrow-end', 'arrow')
  text('pressure-label', [24, 27], 'p')
  text('volume-label', [591, 539], 'V')
  text('origin-label', [27, 537], '0')
  text('pressure-1-label', [23, y1], 'p1')
  text('pressure-2-label', [23, 208], 'p2')
  text('volume-1-label', [187, 538], 'V1')
  text('volume-2-label', [314, 538], 'V2')
  text('volume-prime-label', [479, 538], "V'")
  const lower = [
    ['M', [108, 65]],
    ['C', [115, 189], [144, 278], [187, y1]],
    ['C', [225, 381], [269, 405], [314, 416]],
    ['C', [365, 435], [431, 450], [479, 455]],
    ['C', [511, 459], [544, 461], [573, 462]],
  ]
  const upper = [
    ['M', [227, 62]],
    ['C', [246, 123], [282, 177], [314, 208]],
  ]
  const isothermalCubicIndices = []
  const pieces = 16
  const derivative = x => K / ((x - 42) ** 2)
  for (let n = 0; n < pieces; n++) {
    const a = 314 + (479 - 314) * n / pieces
    const b = 314 + (479 - 314) * (n + 1) / pieces
    const h = (b - a) / 3
    isothermalCubicIndices.push(upper.length)
    upper.push(['C', [a + h, curveY(a) + derivative(a) * h],
      [b - h, curveY(b) - derivative(b) * h], [b, curveY(b)]])
  }
  upper.push(['C', [510, y1 + derivative(479) * 31], [543, 351], [573, 362]])
  const d = commands => commands.map(([op, ...values]) =>
    op + values.map(p => {
      const [x, y] = f.user(p)
      return `${x},${576 - y}`
    }).join(' ')).join(' ')
  objects.push({ id: 'lower-curve', type: 'svgPath', d: d(lower), stroke: 'ink', strokeWidth: 2.8 })
  objects.push({ id: 'upper-curve', type: 'svgPath', d: d(upper), stroke: 'ink', strokeWidth: 2.8 })
  for (const [a, b] of [
    ['origin', 'pressure-axis-end'], ['origin', 'volume-axis-end'],
    ['origin', 'pressure-1'], ['origin', 'pressure-2'],
    ['origin', 'volume-1'], ['origin', 'volume-2'], ['origin', 'volume-prime'],
    ['state-1', 'state-1-prime'], ['state-2', 'state-1-prime'],
    ['lower-start', 'state-1'], ['state-1', 'lower-at-volume-2'],
    ['lower-at-volume-2', 'lower-at-volume-prime'], ['lower-at-volume-prime', 'lower-end'],
    ['upper-start', 'state-2'], ['state-1-prime', 'upper-end'],
    ['horizontal-arrow-start', 'horizontal-arrow-end'],
    ['curve-arrow-start', 'curve-arrow-end'],
  ]) displacement(`${a}-to-${b}-placement`, a, b)
  assertions.push({ id: 'axes-perpendicular', type: 'perpendicular', a: 'origin',
    b: 'pressure-axis-end', c: 'origin', d: 'volume-axis-end' })
  assertions.push({ id: 'constant-pressure-parallel', type: 'parallel', a: 'state-1',
    b: 'state-1-prime', c: 'origin', d: 'volume-axis-end' })
  group('shared-source-frame',
    'Source facts: one p-V frame, origin, two axis ends, five labelled projections, states 1/1-prime/2, both complete solid curves and two process arrows. Approximate scan coordinates, no physical scale. Every point is covered by a mapped executable relation wholly in this group. Modern clean-up, fonts, cubic tracing and tiny join dots are separate additions in source-observations.json; original p1 join is regularized 2.54 source pixels downward within thick ink to fit the source-described isothermal process.',
    objects.map(o => o.id), assertions.map(a => a.id))
  f.curveChecks = { K, originSource: [42, 514], isothermalCubicIndices,
    lowerCommands: lower, upperCommands: upper,
    sourceEndpoints: { lower: [[108, 65], [573, 462]], upper: [[227, 62], [573, 362]] } }
  return f
}

function figure30() {
  const f = makeFigure('fig-30', { width: 640, height: 704 }, ([x, y]) => [x * 1.5 + 32, y * 1.5 + 22])
  const { pt, text, edge, displacement, group, objects, assertions } = f
  const x1 = 42 + (251 - 42) * (374 - 288) / (374 - 72)
  pt('origin', [42, 374])
  pt('volume-axis-end', [42, 2])
  pt('temperature-axis-end', [377, 374])
  pt('state-1', [x1, 288], '1', 'NW')
  pt('state-2', [251, 72], '2', 'NE')
  pt('state-3', [251, 288], '3', 'SE')
  const onRay = t => [x1 + (251 - x1) * t, 288 + (72 - 288) * t]
  pt('diagonal-arrow-start', onRay(0.41))
  pt('diagonal-arrow-end', onRay(0.57))
  pt('vertical-arrow-start', [251, 166])
  pt('vertical-arrow-end', [251, 192])
  pt('horizontal-arrow-start', [196, 288])
  pt('horizontal-arrow-end', [167, 288])
  edge('volume-axis', 'origin', 'volume-axis-end', 'arrow', 0, 3)
  edge('temperature-axis', 'origin', 'temperature-axis-end', 'arrow', 0, 3)
  edge('origin-extension', 'origin', 'state-1', 'segment', 2, 2.4)
  edge('process-1-to-2', 'state-1', 'state-2', 'segment', 0, 3)
  edge('process-2-to-3', 'state-2', 'state-3', 'segment', 0, 3)
  edge('process-3-to-1', 'state-3', 'state-1', 'segment', 0, 3)
  edge('diagonal-process-arrow', 'diagonal-arrow-start', 'diagonal-arrow-end', 'arrow', 0, 3)
  edge('vertical-process-arrow', 'vertical-arrow-start', 'vertical-arrow-end', 'arrow', 0, 3)
  edge('horizontal-process-arrow', 'horizontal-arrow-start', 'horizontal-arrow-end', 'arrow', 0, 3)
  text('volume-label', [18, 17], 'V')
  text('temperature-label', [367, 399], 'T')
  text('origin-label', [24, 387], '0')
  for (const [a, b] of [
    ['origin', 'volume-axis-end'], ['origin', 'temperature-axis-end'],
    ['origin', 'state-1'], ['state-1', 'state-2'], ['state-2', 'state-3'], ['state-3', 'state-1'],
    ['diagonal-arrow-start', 'diagonal-arrow-end'],
    ['vertical-arrow-start', 'vertical-arrow-end'],
    ['horizontal-arrow-start', 'horizontal-arrow-end'],
  ]) displacement(`${a}-to-${b}-placement`, a, b)
  assertions.push({ id: 'dashed-extension-same-ray', type: 'collinear',
    a: 'origin', b: 'state-1', c: 'state-2', tolerance: 0.000001 })
  assertions.push({ id: 'axes-perpendicular', type: 'perpendicular',
    a: 'origin', b: 'volume-axis-end', c: 'origin', d: 'temperature-axis-end' })
  assertions.push({ id: 'process-2-to-3-vertical', type: 'parallel',
    a: 'state-2', b: 'state-3', c: 'origin', d: 'volume-axis-end' })
  assertions.push({ id: 'process-3-to-1-horizontal', type: 'parallel',
    a: 'state-3', b: 'state-1', c: 'origin', d: 'temperature-axis-end' })
  for (const p of ['diagonal-arrow-start', 'diagonal-arrow-end'])
    assertions.push({ id: `${p}-on-process`, type: 'pointOnLine',
      point: p, a: 'state-1', b: 'state-2', tolerance: 0.000001 })
  group('shared-source-frame',
    'Source facts: one V-T frame, origin, states 1/2/3, all three straight solid process edges with up-right/down/left directions and dashed origin-to-1 extension on the same ray. No ticks, numerical scales, primes or curves. Every source and direction point maps to a relation wholly inside this group. Uniform enlargement, straightening inside the scan ink and clean labels are modern additions, not new data.',
    objects.map(o => o.id), assertions.map(a => a.id))
  f.sourcePlacement = { x1, inkRangeX: [96, 107] }
  return f
}

function run(name, command, args, env = {}) {
  const result = spawnSync(command, args, {
    cwd: root, encoding: 'utf8', env: { ...process.env, ...env },
    maxBuffer: 12 * 1024 * 1024,
  })
  const receipt = {
    schema: 'd135/command-receipt@1', name, cwd: root, command, args,
    exitCode: result.status, signal: result.signal, error: result.error?.message || null,
    stdout: result.stdout || '', stderr: result.stderr || '',
    executionRecoveryResetsUsage: false,
  }
  const receiptPath = path.join(own, `${name}.receipt.json`)
  save(receiptPath, receipt)
  console.log(JSON.stringify({ name, exitCode: receipt.exitCode, receipt: hash(receiptPath) }))
  return receipt
}

function parseCurve(d) {
  const tokens = d.match(/[MC]|[-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/gi)
  const commands = []
  while (tokens.length) {
    const op = tokens.shift()
    assert.ok(op === 'M' || op === 'C')
    const n = op === 'M' ? 2 : 6
    const values = tokens.splice(0, n).map(Number)
    assert.equal(values.length, n)
    assert.ok(values.every(Number.isFinite))
    commands.push([op, ...Array.from({ length: n / 2 }, (_, i) => values.slice(i * 2, i * 2 + 2))])
  }
  return commands
}
const cubic = (p0, p1, p2, p3, t) => [0, 1].map(i =>
  (1 - t) ** 3 * p0[i] + 3 * (1 - t) ** 2 * t * p1[i] +
  3 * (1 - t) * t ** 2 * p2[i] + t ** 3 * p3[i])

function geometryAudit(f, spec, candidate) {
  const checks = []
  const byId = new Map(spec.objects.map(o => [o.id, o]))
  const point = id => byId.get(id).at
  const check = (id, fn) => { fn(); checks.push({ id, status: 'pass' }) }
  const near = (a, b, tolerance = 0.00001) => assert.ok(Math.abs(a - b) <= tolerance, `${a} != ${b}`)
  const screen = id => [point(id)[0], spec.canvas.height - point(id)[1]]
  check('inventory-covers-every-point-within-group', () => {
    for (const g of spec.source.inventory) {
      const points = new Set(g.objects.filter(id => byId.get(id).type === 'point'))
      const covered = new Set()
      for (const a of spec.assertions.filter(a => g.assertions.includes(a.id))) {
        const references = ['a', 'b', 'c', 'd', 'from', 'to', 'point']
          .map(k => a[k]).filter(id => byId.get(id)?.type === 'point')
        if (new Set(references).size >= 2 && references.every(id => points.has(id)))
          references.forEach(id => covered.add(id))
      }
      assert.deepEqual([...points].filter(id => !covered.has(id)), [])
    }
  })
  check('all-solid-dashed-semantics-and-finite-edges', () => {
    const dashed = spec.id === 'fig-24'
      ? ['pressure-1-guide', 'pressure-2-guide', 'volume-1-guide', 'volume-2-guide', 'volume-prime-guide']
      : ['origin-extension']
    for (const o of spec.objects) {
      if (['arrow', 'segment', 'svgPath'].includes(o.type))
        assert.equal(o.dash || 0, dashed.includes(o.id) ? 2 : 0)
      assert.notEqual(o.type, 'line')
    }
  })
  check('visible-label-associations-no-extra-labels', () => {
    const expected = sourceObservations.figures[spec.id].sourceFacts.allVisibleLabels.slice().sort()
    const actual = spec.objects.flatMap(o => o.label ? [o.label] : o.text ? [o.text] : []).sort()
    assert.deepEqual(actual, expected)
    const stateLabels = spec.id === 'fig-24'
      ? { 'state-1': '1', 'state-1-prime': "1'", 'state-2': '2' }
      : { 'state-1': '1', 'state-2': '2', 'state-3': '3' }
    for (const [id, label] of Object.entries(stateLabels)) assert.equal(byId.get(id).label, label)
  })
  if (spec.id === 'fig-24') {
    const paths = Object.fromEntries(['lower', 'upper'].map(name =>
      [name, parseCurve(byId.get(`${name}-curve`).d)]))
    check('both-source-curve-endpoints-retained', () => {
      for (const name of ['lower', 'upper']) {
        const commands = paths[name]
        const ends = [commands[0][1], commands.at(-1).at(-1)]
        for (let i = 0; i < 2; i++) {
          const source = f.curveChecks.sourceEndpoints[name][i]
          near(ends[i][0], source[0] + 7)
          near(ends[i][1], source[1] + 6)
        }
      }
    })
    check('source-states-and-crossings-are-actual-curve-joins', () => {
      const joins = (name) => paths[name].map(c => c.at(-1))
      for (const [name, ids] of [
        ['lower', ['state-1', 'lower-at-volume-2', 'lower-at-volume-prime']],
        ['upper', ['state-2', 'state-1-prime']],
      ]) for (const id of ids) {
        const p = screen(id)
        assert.ok(joins(name).some(q => Math.hypot(q[0] - p[0], q[1] - p[1]) < 0.00001))
      }
    })
    check('source-described-isothermal-process-pV-constant', () => {
      const o = screen('origin')
      const s = screen('state-2')
      const product = (s[0] - o[0]) * (o[1] - s[1])
      const commands = paths.upper
      let maxProductError = 0
      for (const i of f.curveChecks.isothermalCubicIndices) {
        const start = commands[i - 1].at(-1)
        const [, c1, c2, end] = commands[i]
        for (let n = 0; n <= 32; n++) {
          const p = cubic(start, c1, c2, end, n / 32)
          maxProductError = Math.max(maxProductError,
            Math.abs((p[0] - o[0]) * (o[1] - p[1]) - product) / product)
        }
      }
      assert.ok(maxProductError < 0.000001, String(maxProductError))
      checks.push({ id: 'isothermal-interpolation-relative-error', value: maxProductError, limit: 0.000001, status: 'pass' })
    })
    check('curves-monotone-unclipped-and-unextended', () => {
      for (const commands of Object.values(paths)) {
        let previous = commands[0][1]
        for (let i = 1; i < commands.length; i++) {
          const [, c1, c2, end] = commands[i]
          const start = commands[i - 1].at(-1)
          for (let n = 1; n <= 40; n++) {
            const p = cubic(start, c1, c2, end, n / 40)
            assert.ok(p[0] > previous[0] && p[1] >= previous[1])
            assert.ok(p[0] >= 0 && p[0] <= 640 && p[1] >= 0 && p[1] <= 576)
            previous = p
          }
        }
      }
    })
    check('constant-p1-and-projection-label-coordinates', () => {
      for (const id of ['state-1', 'state-1-prime', 'pressure-1']) near(point(id)[1], point('state-1')[1])
      for (const [a, b] of [['state-1', 'volume-1'], ['state-2', 'volume-2'], ['state-1-prime', 'volume-prime']])
        near(point(a)[0], point(b)[0])
      near(point('state-2')[1], point('pressure-2')[1])
      assert.ok(point('state-1')[0] < point('state-2')[0] && point('state-2')[0] < point('state-1-prime')[0])
    })
    check('process-directions-right-and-up-left', () => {
      assert.ok(point('horizontal-arrow-end')[0] > point('horizontal-arrow-start')[0])
      assert.ok(point('curve-arrow-end')[0] < point('curve-arrow-start')[0])
      assert.ok(point('curve-arrow-end')[1] > point('curve-arrow-start')[1])
      for (const id of ['curve-arrow-start', 'curve-arrow-end']) {
        const p = screen(id), o = screen('origin')
        near((p[0] - o[0]) * (o[1] - p[1]), f.curveChecks.K)
      }
    })
  } else {
    check('state-1-regularization-inside-source-ink', () => {
      const sourceX = (point('state-1')[0] - 32) / 1.5
      assert.ok(sourceX >= 96 && sourceX <= 107)
    })
    check('V-T-axes-not-replaced', () => {
      assert.equal(byId.get('volume-label').text, 'V')
      assert.equal(byId.get('temperature-label').text, 'T')
      assert.ok(point('volume-axis-end')[1] > point('origin')[1])
      assert.ok(point('temperature-axis-end')[0] > point('origin')[0])
    })
    check('three-directed-processes-up-right-down-left', () => {
      const directions = [
        ['diagonal-arrow-start', 'diagonal-arrow-end', 1, 1],
        ['vertical-arrow-start', 'vertical-arrow-end', 0, -1],
        ['horizontal-arrow-start', 'horizontal-arrow-end', -1, 0],
      ]
      for (const [a, b, dx, dy] of directions) {
        assert.equal(Math.sign(point(b)[0] - point(a)[0]), dx)
        assert.equal(Math.sign(point(b)[1] - point(a)[1]), dy)
      }
    })
  }
  return { schema: 'd135/executable-geometry@1', figure: spec.id, status: 'pass',
    checks, spec: hash(path.join(own, `${spec.id}.${candidate}.spec.json`)) }
}

const mode = process.argv[2]
if (mode === 'build') {
  save(path.join(own, 'supplemental-source-context.json'), supplemental)
  save(path.join(own, 'input-binding.json'), {
    schema: 'd135/input-binding@1', cwd: root,
    instructions: instructions.map(p => hash(path.join(root, p))),
    inputFreeze: hash(path.join(own, 'input-freeze.json')),
    inputs: frozenInputs.contexts,
    sources: Object.values(contexts).flatMap(c => [c.currentIsolatedSourceImage, c.byteIdenticalDurableSourceImage]),
    nativeContexts: Object.values(contexts).flatMap(c => Object.values(c.nativeContexts)),
    nativeTooling: [validator, renderer,
      path.join(root, '.agents/skills/ld-s10y-image/assets/figure-spec.schema.json'),
      path.join(root, '.agents/skills/ld-s10y-image/scripts/materialize_arrowheads.mjs')].map(hash),
    sourceObservations: hash(path.join(own, 'source-observations.json')),
    supplemental: hash(path.join(own, 'supplemental-source-context.json')),
    offline: true, independentApproval: false, promotionAuthorized: false,
  })
  for (const f of [figure24(), figure30()]) {
    const id = f.spec.id
    save(path.join(own, `${id}.first.spec.json`), f.spec)
    save(path.join(own, `${id}.first.provenance.json`), {
      schema: 'd135/figure-author-provenance@1', figure: id, selectedCandidate: 'first',
      input: hash(path.join(own, `${id}.input-context.json`)),
      source: contexts[id].currentIsolatedSourceImage,
      inputBinding: hash(path.join(own, 'input-binding.json')),
      observations: hash(path.join(own, 'source-observations.json')),
      sourceFacts: sourceObservations.figures[id].sourceFacts,
      modernAdditions: sourceObservations.figures[id].modernAdditions,
      ...(id === 'fig-24' ? { supplemental: hash(path.join(own, 'supplemental-source-context.json')),
        exactProcessGeometry: f.curveChecks,
        regularization: 'State 1 and 1-prime y=323.5389 vs observed 321, a 2.54-pixel shift within scanned horizontal ink; no changed volume ticks or curve ends.' }
        : { sourcePlacement: f.sourcePlacement }),
      independentApproval: false, promotionAuthorized: false,
    })
    console.log(JSON.stringify({ figure: id, spec: hash(path.join(own, `${id}.first.spec.json`)) }))
  }
} else if (mode === 'native') {
  for (const id of ['fig-24', 'fig-30']) {
    const specPath = path.join(own, `${id}.first.spec.json`)
    const validation = run(`${id}.first.validate`, 'python3',
      [validator, specPath, '--stage', 'rendered', '--json'], { PYTHONDONTWRITEBYTECODE: '1' })
    if (validation.exitCode !== 0) continue
    const result = run(`${id}.first.render`, 'node',
      [renderer, '--spec', specPath, '--svg', path.join(own, `${id}.first.svg`),
        '--report', path.join(own, `${id}.first.render.json`)],
      { PYTHONDONTWRITEBYTECODE: '1' })
    console.log(JSON.stringify({ figure: id, nativeStatus: result.exitCode === 0 ? 'pass' : 'fail' }))
  }
} else if (mode === 'repair') {
  const id = 'fig-24'
  const firstPath = path.join(own, `${id}.first.spec.json`)
  const spec = read(firstPath)
  const failure = read(path.join(own, `${id}.first.render.json`))
  assert.equal(failure.status, 'fail')
  assert.deepEqual(failure.collisions.map(c => c.text), ['p1', 'p2'])
  const changes = []
  for (const id of ['pressure-1-label', 'pressure-2-label']) {
    const obj = spec.objects.find(o => o.id === id)
    const before = obj.at.slice()
    obj.at[0] -= 4
    changes.push({ object: id, field: 'at', before, after: obj.at.slice() })
  }
  const repaired = path.join(own, `${id}.repair1.spec.json`)
  save(repaired, spec)
  save(path.join(own, `${id}.repair1.provenance.json`), {
    schema: 'd135/figure-author-provenance@1', figure: id, selectedCandidate: 'repair1',
    firstProvenance: hash(path.join(own, `${id}.first.provenance.json`)),
    firstFailure: hash(path.join(own, `${id}.first.render.json`)),
    firstFailureReceipt: hash(path.join(own, `${id}.first.render.receipt.json`)),
    firstSpec: hash(firstPath), repairedSpec: hash(repaired),
    contentRepairCount: 1, contentRepairLimit: 1,
    diagnosis: 'Two pressure-label boxes overlap the native point exclusion footprints at the pressure projection anchors.',
    changes, geometryChanged: false, noFurtherContentRepairAuthorized: true,
    independentApproval: false, promotionAuthorized: false,
  })
  const validation = run(`${id}.repair1.validate`, 'python3',
    [validator, repaired, '--stage', 'rendered', '--json'], { PYTHONDONTWRITEBYTECODE: '1' })
  if (validation.exitCode === 0) run(`${id}.repair1.render`, 'node',
    [renderer, '--spec', repaired, '--svg', path.join(own, `${id}.repair1.svg`),
      '--report', path.join(own, `${id}.repair1.render.json`)],
    { PYTHONDONTWRITEBYTECODE: '1' })
} else if (mode === 'preview') {
  const require = createRequire(path.join(root, '.claude/skills/ld-s10y-lesson/package.json'))
  const { Resvg } = require('@resvg/resvg-js')
  for (const f of [figure24(), figure30()]) {
    const id = f.spec.id
    const candidate = id === 'fig-24' ? 'repair1' : 'first'
    const spec = read(path.join(own, `${id}.${candidate}.spec.json`))
    assert.equal(read(path.join(own, `${id}.${candidate}.render.json`)).status, 'pass')
    const geometry = geometryAudit(f, spec, candidate)
    save(path.join(own, `${id}.${candidate}.geometry.json`), geometry)
    const svgPath = path.join(own, `${id}.${candidate}.svg`)
    const svg = fs.readFileSync(svgPath, 'utf8')
    // Resolve semantic CSS variables only for the disposable neutral preview.
    const colors = {
      ink: '#202020', muted: '#585858', accent: '#202020',
      'accent-soft': '#a0a0a0', grid: '#dedede', paper: '#ffffff',
    }
    const neutralSvg = svg.replace(/var\(--ld-figure-([a-z-]+),\s*#[0-9a-f]+\)/gi,
      (_, role) => { assert.ok(colors[role]); return colors[role] })
    assert.ok(!neutralSvg.includes('var('))
    const resvg = new Resvg(neutralSvg, {
      background: '#ffffff', fitTo: { mode: 'width', value: 640 },
      font: { loadSystemFonts: true, defaultFontFamily: 'Arial' },
    })
    const raster = resvg.render()
    const pixels = raster.pixels
    let nonWhite = 0, dark = 0
    let minX = 640, minY = raster.height, maxX = -1, maxY = -1
    for (let i = 0; i < pixels.length; i += 4) {
      const [r, g, b, a] = pixels.subarray(i, i + 4)
      assert.equal(a, 255)
      if (Math.min(r, g, b) < 240) {
        nonWhite++
        const x = (i / 4) % raster.width, y = Math.floor(i / 4 / raster.width)
        minX = Math.min(minX, x); maxX = Math.max(maxX, x)
        minY = Math.min(minY, y); maxY = Math.max(maxY, y)
      }
      if (Math.max(r, g, b) < 100) dark++
    }
    assert.equal(raster.width, 640)
    assert.equal(raster.height, spec.canvas.height)
    assert.ok(nonWhite > 1500 && nonWhite < raster.width * raster.height * 0.15)
    assert.ok(dark > 1000 && minX > 0 && minY > 0 && maxX < 639 && maxY < raster.height - 1)
    const previewPath = path.join(own, `${id}.${candidate}.preview-640.png`)
    assert.ok(!fs.existsSync(previewPath))
    fs.writeFileSync(previewPath, raster.asPng())
    save(path.join(own, `${id}.${candidate}.preview-receipt.json`), {
      schema: 'd135/resvg-preview@1', status: 'pass', figure: id,
      cwd: root, actualCommand: ['node', path.join(own, 'author.mjs'), 'preview'],
      renderer: { package: '@resvg/resvg-js', module: require.resolve('@resvg/resvg-js'),
        packageBinding: hash(require.resolve('@resvg/resvg-js/package.json')),
        version: require('@resvg/resvg-js/package.json').version },
      nativeSvg: hash(svgPath), spec: hash(path.join(own, `${id}.${candidate}.spec.json`)),
      preview: hash(previewPath), width: raster.width, height: raster.height,
      neutralPalette: colors, nonWhitePixels: nonWhite, darkPixels: dark,
      actualContentBounds: [minX, minY, maxX, maxY],
      independentVisualReview: 'pending', independentApproval: false,
    })
    console.log(JSON.stringify({ figure: id, geometry: geometry.status, preview: hash(previewPath) }))
  }
} else {
  throw new Error('use build, native, repair or preview')
}
