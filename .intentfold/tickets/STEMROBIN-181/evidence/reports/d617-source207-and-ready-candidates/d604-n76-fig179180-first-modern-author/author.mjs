import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const own = path.dirname(fileURLToPath(import.meta.url))
const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp')
const tools = path.join(repo, '.agents/skills/ld-s10y-image/scripts')
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const write = (name, data) => {
  const target = path.join(own, name)
  assert(!fs.existsSync(target), `Refusing overwrite: ${target}`)
  fs.writeFileSync(target, JSON.stringify(data, null, 2) + '\n')
}
const pin = file => ({
  path: path.resolve(file), sha256: hash(file), bytes: fs.statSync(file).size,
  mode: (fs.statSync(file).mode & 0o777).toString(8).padStart(4, '0'),
})
const near = (a, b) => assert(Math.abs(a - b) < 1e-9, `${a} != ${b}`)
const command = process.argv[2]

function base(n, zh, en) {
  return {
    schema: 'ld-s10y-image/figure-spec@2', id: `fig-${n}`, mode: 'deterministic',
    description: n === 179
      ? 'Three special thin-lens paraxial rays from A meet at the real inverted image A_1; preserve AB, C, O, D, both F labels, and A_1 B_1.'
      : 'An on-axis source inside the focal distance forms virtual S_1. Secondary P-O-C-Q is parallel to SB; C lies on the outgoing focal plane through current F. Dashed backward extension is construction only.',
    source: {
      image: {
        path: path.join(repo, `ssot-resources/soviet10year-textbooks/artifacts/10p/figures/fig-${n}.png`),
        sha256: hash(path.join(repo, `ssot-resources/soviet10year-textbooks/artifacts/10p/figures/fig-${n}.png`)),
      },
      authoritativeText: [en, zh].map(doc => ({
        lesson: doc.card_id,
        text: doc.prose.filter(b => b.text).map(b => b.text).join('\n\n'),
      })),
      inventory: [],
    },
    canvas: {
      width: 640, height: 520, background: 'paper', keepAspectRatio: true,
      boundingBox: n === 179 ? [-2.15, 1.5, 3.75, -1.8] : [-1.75, 1.9, 1.95, -1.25],
    },
    display: {purpose: 'instructional', layout: 'inline', maxWidthPx: 640, minTextPx: 16, widths: [331, 342, 640]},
    objects: [], assertions: [], layout: {minLabelGap: 4},
  }
}

function builder(spec) {
  const pt = (id, at, label, position, offset = [0, 0], extra = {}) => {
    spec.objects.push({
      id, type: 'point', at, visible: true, size: 2, stroke: 'ink', fill: 'paper',
      strokeWidth: 2, ...(label ? {label, fontSize: 32, fontWeight: 500,
        labelPlacement: {position, gap: 26, offset}} : {}), ...extra,
    })
  }
  const relation = (id, type, data) => {
    spec.assertions.push({id, type, ...data, tolerance: 1e-8})
    return id
  }
  const edge = (id, from, to, extra = {}) => {
    spec.objects.push({id, type: 'segment', from, to, stroke: 'ink', strokeWidth: 4, ...extra})
    return relation(`${id}-connects`, 'connects', {arrow: id, from, to})
  }
  const arrow = (id, from, to, extra = {}) => {
    spec.objects.push({id, type: 'arrow', from, to, stroke: 'ink', strokeWidth: 4, ...extra})
    return relation(`${id}-connects`, 'connects', {arrow: id, from, to})
  }
  const col = (id, a, b, c) => relation(id, 'collinear', {a, b, c})
  const par = (id, a, b, c, d) => relation(id, 'parallel', {a, b, c, d})
  const perp = (id, a, b, c, d) => relation(id, 'perpendicular', {a, b, c, d})
  const group = (id, description, points, objects, assertions) => spec.source.inventory.push({
    id, description, objects: [...points, ...objects], assertions,
    ...(points.length >= 2 ? {requires: ['pointRelationships']} : {}),
  })
  return {pt, relation, edge, arrow, col, par, perp, group}
}

function figure179(zh, en) {
  const spec = base(179, zh, en)
  const {pt, relation, edge, arrow, col, par, perp, group} = builder(spec)
  // A separate normalized paraxial example, not measurements from the scan.
  const f = 1, u = 1.55, h = 0.55, v = f * u / (u - f), imageH = -v * h / u
  const A = [-u, h], D = [0, imageH], I = [v, imageH]
  const p = {A, B: [-u, 0], C: [0, h], O: [0, 0], D,
    'F-left': [-f, 0], 'F-right': [f, 0], B1: [v, 0], A1: I}
  pt('A', A, 'A', 'NW')
  pt('B', p.B, 'B', 'SW')
  pt('C', p.C, 'C', 'NE', [0, -8])
  pt('O', p.O, 'O', 'NE')
  pt('D', D, 'D', 'SW')
  pt('F-left', p['F-left'], 'F', 'N', [0, -3])
  pt('F-right', p['F-right'], 'F', 'N', [0, -3])
  pt('B1', p.B1, 'B\u2081', 'NE')
  pt('A1', I, 'A\u2081', 'S', [-3, 5])
  const outX = 3.48
  const centerOut = [outX, -h * outX / u]
  const focusOut = [outX, h * (1 - outX / f)]
  const axes = [
    edge('principal-axis', [-1.98, 0], [3.48, 0], {stroke: 'muted', strokeWidth: 3.5}),
    edge('lens-line', [0, -1.62], [0, 1.36], {strokeWidth: 4.5}),
    arrow('lens-up', [0, 1.10], [0, 1.36], {strokeWidth: 4.5}),
    arrow('lens-down', [0, -1.36], [0, -1.62], {strokeWidth: 4.5}),
    col('axis-B-Fleft-O', 'B', 'F-left', 'O'),
    col('axis-O-Fright-B1', 'O', 'F-right', 'B1'),
    col('lens-C-O-D', 'C', 'O', 'D'),
    perp('lens-perpendicular-axis', 'C', 'D', 'B', 'B1'),
    relation('opposite-equal-foci', 'equalDistance', {a: 'O', b: 'F-left', c: 'O', d: 'F-right'}),
  ]
  group('shared-frame', 'One horizontal principal axis, one vertical converging thin lens with two outward arrowheads and opposite F foci.', ['B', 'F-left', 'O', 'F-right', 'B1', 'C', 'D'],
    ['principal-axis', 'lens-line', 'lens-up', 'lens-down'], axes)
  group('object-and-image', 'Upward AB at left; larger downward A_1 B_1 at right, preserving subscripts and real inverted orientation.',
    ['A', 'B', 'A1', 'B1'], ['object-up', 'image-down'],
    [arrow('object-up', 'B', 'A', {strokeWidth: 5}), arrow('image-down', 'B1', 'A1', {strokeWidth: 5}),
      par('object-image-vertical', 'A', 'B', 'A1', 'B1'),
      relation('object-up-sign', 'displacement', {from: 'B', to: 'A', dx: 0, dy: h}),
      relation('image-down-sign', 'displacement', {from: 'B1', to: 'A1', dx: 0, dy: imageH})])
  group('parallel-ray', 'Solid AC parallel to principal axis, then solid C-F-right-A_1; rightward incident and down-right outgoing arrowheads.',
    ['A', 'C', 'F-right', 'A1', 'B', 'B1'], ['parallel-incident', 'parallel-refracted', 'parallel-in-arrow', 'parallel-out-arrow'],
    [edge('parallel-incident', 'A', 'C'), edge('parallel-refracted', 'C', focusOut),
      arrow('parallel-in-arrow', [-0.94, h], [-0.64, h]),
      arrow('parallel-out-arrow', [3.18, h * (1 - 3.18 / f)], focusOut),
      par('AC-parallel-axis', 'A', 'C', 'B', 'B1'),
      col('C-Fright-A1', 'C', 'F-right', 'A1'),
      col('axis-B-Fright-B1', 'B', 'F-right', 'B1'),
      relation('focus-out-line', 'pointOnLine', {point: 'A1', a: 'C', b: focusOut})])
  group('center-ray', 'Solid A-O-A_1 with no bend at O; two down-right arrowheads, before O and beyond A_1.',
    ['A', 'O', 'A1'], ['center-ray-line', 'center-in-arrow', 'center-out-arrow'],
    [edge('center-ray-line', 'A', centerOut),
      arrow('center-in-arrow', [-0.97, h * 0.97 / u], [-0.70, h * 0.70 / u]),
      arrow('center-out-arrow', [3.18, -h * 3.18 / u], centerOut),
      col('A-O-A1', 'A', 'O', 'A1'),
      relation('center-out-line', 'pointOnLine', {point: 'O', a: 'A', b: centerOut})])
  group('focus-ray', 'Solid A-F-left-D then solid D-A_1 parallel to principal axis; down-right incident and rightward outgoing arrowheads.',
    ['A', 'F-left', 'D', 'A1', 'B', 'B1'], ['focus-incident', 'focus-refracted', 'focus-in-arrow', 'focus-out-arrow'],
    [edge('focus-incident', 'A', 'D'), edge('focus-refracted', 'D', [3.48, imageH]),
      arrow('focus-in-arrow', [-0.78, h + (imageH - h) * ((u - 0.78) / u)],
        [-0.56, h + (imageH - h) * ((u - 0.56) / u)]),
      arrow('focus-out-arrow', [3.18, imageH], [3.48, imageH]),
      col('A-Fleft-D', 'A', 'F-left', 'D'),
      par('D-A1-parallel-axis', 'D', 'A1', 'B', 'B1'),
      col('axis-B-Fleft-B1', 'B', 'F-left', 'B1')])
  near(1 / f, 1 / u + 1 / v)
  near(imageH, -h / (u / f - 1))
  return {spec, model: {
    units: 'modern normalized addition, not source measurements', f, u, v, objectHeight: h, imageHeight: imageH,
    thinLensEquation: '1/f = 1/u + 1/v', magnification: -v / u, physicalChecksExecuted: true,
    sourceOrientation: 'object upright at left, real image inverted at right',
    expectedArrowheads: 10, expectedLabels: ['A', 'B', 'C', 'O', 'D', 'F', 'F', 'B\u2081', 'A\u2081'],
    dashedGroups: [], unresolvedSourceInstructionalRelations: [],
  }}
}

function figure180(zh, en) {
  const spec = base(180, zh, en)
  const {pt, relation, edge, arrow, col, par, perp, group} = builder(spec)
  const f = 1, u = 0.55, b = 0.55, slopeIn = b / u, c = f * slopeIn
  const slopeOut = (c - b) / f, virtualX = -b / slopeOut
  pt('S1', [virtualX, 0], 'S\u2081', 'SW')
  pt('S', [-u, 0], 'S', 'SW', [0, 6], {size: 5, face: 'x', fill: 'ink'})
  pt('B', [0, b], 'B', 'E', [0, 22])
  pt('O', [0, 0], 'O', 'SE')
  pt('F', [f, 0], 'F', 'SW')
  pt('C', [f, c], 'C', 'SE')
  pt('P', [-0.92, -0.92 * slopeIn], 'P', 'SW', [0, -3])
  pt('Q', [1.24, 1.24 * slopeIn], 'Q', 'N', [0, -7])
  const axisObjects = ['principal-axis', 'principal-right-arrow', 'lens-line', 'lens-up', 'lens-down', 'source-mark']
  const axisAssertions = [
    edge('principal-axis', [-1.53, 0], [1.66, 0], {stroke: 'muted', strokeWidth: 3.5}),
    arrow('principal-right-arrow', [1.46, 0], [1.66, 0], {stroke: 'muted', strokeWidth: 3.5}),
    edge('lens-line', [0, -0.94], [0, 1.13], {strokeWidth: 4.5}),
    arrow('lens-up', [0, 0.94], [0, 1.13], {strokeWidth: 4.5}),
    arrow('lens-down', [0, -0.74], [0, -0.94], {strokeWidth: 4.5}),
    edge('source-mark', [-u, -0.045], [-u, 0.045], {strokeWidth: 3}),
    col('axis-S1-S-O', 'S1', 'S', 'O'), col('axis-S-O-F', 'S', 'O', 'F'),
    perp('lens-perpendicular-axis', 'O', 'B', 'S', 'F'),
    relation('source-inside-focus', 'distance', {a: 'S', b: 'O', value: u}),
    relation('image-side-focus-distance', 'distance', {a: 'O', b: 'F', value: f}),
    relation('virtual-image-left-of-source', 'displacement', {from: 'S', to: 'S1', dx: virtualX + u, dy: 0}),
  ]
  group('shared-frame', 'Common horizontal principal axis with S_1, S, O, F; source mark at S; B above O on outward-arrow thin lens.',
    ['S1', 'S', 'O', 'F', 'B'], axisObjects, axisAssertions)
  group('incident-and-secondary-axis', 'Solid incident S-B ends at B; P-O-C-Q is the secondary axis parallel to SB, with one up-right construction arrowhead. No B-Q auxiliary ray exists.',
    ['S', 'B', 'P', 'O', 'C', 'Q'], ['incident-SB', 'secondary-PQ', 'secondary-direction'],
    [edge('incident-SB', 'S', 'B'),
      edge('secondary-PQ', 'P', 'Q', {stroke: 'muted', strokeWidth: 3.5}),
      arrow('secondary-direction', [0.55, 0.55 * slopeIn], [0.74, 0.74 * slopeIn], {stroke: 'muted', strokeWidth: 3.5}),
      par('SB-parallel-PQ', 'S', 'B', 'P', 'Q'),
      col('P-O-C', 'P', 'O', 'C'), col('O-C-Q', 'O', 'C', 'Q')])
  const out = [1.57, b + slopeOut * 1.57]
  group('refracted-and-backward-construction', 'Solid outgoing B-C, arrow up-right beyond C; dashed B-S_1 backward construction with down-left construction arrow, not actual backward propagation.',
    ['B', 'C', 'S1', 'S', 'O'], ['refracted-BC', 'outgoing-direction', 'backward-BS1', 'backward-construction-arrow'],
    [edge('refracted-BC', 'B', out),
      arrow('outgoing-direction', [1.36, b + slopeOut * 1.36], out),
      edge('backward-BS1', 'B', 'S1', {dash: 2, stroke: 'muted', strokeWidth: 3.5}),
      arrow('backward-construction-arrow', [-0.99, b - 0.99 * slopeOut], [-1.18, b - 1.18 * slopeOut],
        {dash: 2, stroke: 'muted', strokeWidth: 3.5}),
      col('S1-B-C', 'S1', 'B', 'C'),
      col('axis-virtual-S1-S-O', 'S1', 'S', 'O'),
      relation('outgoing-C-on-line', 'pointOnLine', {point: 'C', a: 'B', b: out})])
  group('current-image-side-focal-plane', 'Vertical dashed focal plane through current right F, perpendicular to principal axis; C is its shared intersection with secondary PQ and outgoing BC.',
    ['F', 'C', 'O', 'S', 'P', 'Q', 'B'], ['focal-plane'],
    [edge('focal-plane', [f, -1.01], [f, 1.44], {dash: 2, stroke: 'muted', strokeWidth: 3.5}),
      perp('FC-perpendicular-principal', 'F', 'C', 'S', 'O'),
      col('axis-S-O-F-current', 'S', 'O', 'F'),
      col('focal-C-on-PQ', 'P', 'C', 'Q'),
      relation('C-on-focal-plane', 'pointOnLine', {point: 'C', a: [f, -1.01], b: [f, 1.44]}),
      relation('B-above-O', 'displacement', {from: 'O', to: 'B', dx: 0, dy: b})])
  near(1 / f, 1 / u + 1 / virtualX)
  assert(u > 0 && u < f && virtualX < -u)
  near(slopeIn - b / f, slopeOut)
  return {spec, model: {
    units: 'modern normalized addition, not source measurements', f, u, BHeight: b,
    CHeight: c, incidentSlope: slopeIn, outgoingSlope: slopeOut, virtualImageX: virtualX,
    physicalChecksExecuted: true, thinLensEquation: '1/f = 1/u + 1/v (v negative)',
    focalPlaneX: f, currentImageSideFocusX: f, backwardExtensionActualRay: false,
    expectedArrowheads: 6, expectedLabels: ['S\u2081', 'S', 'B', 'O', 'F', 'C', 'P', 'Q'],
    dashedGroups: ['focal-plane', 'backward-BS1', 'backward-construction-arrow'],
    rejectedErroneousInitialGroup: 'B-Q auxiliary incident continuation; preserved in first-fail.json',
    unresolvedSourceInstructionalRelations: [],
  }}
}

if (command === 'build') {
  const manifestPath = path.join(tmp, 'd593-n76-first-figure-contexts/manifest.json')
  const reviewPath = path.join(tmp, 'd598-n76-r08-first-affected-text-review/report.json')
  assert.equal(hash(manifestPath), '21fcaf1f3ce9382d9490953471e5b12ea88baad39aa18011c0da43d9a4c10f4a')
  assert.equal(hash(reviewPath), '4a5e5bfdee7093f900968599a2363a571c6f1e66700d0fd03bac195d03e33526')
  const manifest = read(manifestPath)
  const zhPath = path.join(tmp, 'd597-n76-r08-first-text-repair/candidate/zh/lesson.template.json')
  const enPath = path.join(tmp, 'd597-n76-r08-first-text-repair/candidate/en/lesson.template.json')
  assert.equal(hash(zhPath), manifest.fullZH.sha256)
  assert.equal(hash(enPath), manifest.fullEN.sha256)
  const zh = read(zhPath), en = read(enPath)
  const inputs = [manifestPath, reviewPath, zhPath, enPath,
    path.join(tmp, 'd585-n76-first-independent-text-review/report.json'),
    path.join(own, 'fig179.source-inventory.json'), path.join(own, 'fig180.source-inventory.json')]
  for (const n of [179, 180]) {
    const context = manifest.contexts.find(c => c.figure === `fig-${n}`)
    const contextPath = path.join(repo, context.context.path)
    assert.equal(hash(contextPath), context.context.sha256)
    assert.equal(hash(path.join(repo, context.originalImage.path)), context.originalImage.sha256)
    inputs.push(contextPath, path.join(repo, context.originalImage.path))
    const result = n === 179 ? figure179(zh, en) : figure180(zh, en)
    const ids = new Set(result.spec.source.inventory.flatMap(g => g.objects))
    assert(result.spec.objects.every(o => ids.has(o.id)))
    write(`fig-${n}.spec.json`, result.spec)
    write(`fig-${n}.physical-geometry.json`, result.model)
  }
  write('input-pins.json', {
    status: 'EXPECTED-INPUT-BINDINGS-PASS-NO-TEXT-RE-REVIEW',
    files: inputs.map(pin), SCI: 'PASS-INHERITED', ZHEN: 'PASS-INHERITED',
    historical_d585_HOLD_retained: true, parentImageCount: 24, oldImageCount: 24,
    parentImageOpens: 0, contextImageCountBefore: 0,
    inventorySealedBeforeContext: true, correctedInventoryErrorRetained: true,
  })
  console.log('Two FIRST FigureSpecs authored; all source/context/current-text pins match.')
} else if (command === 'render') {
  const n = Number(process.argv[3])
  assert([179, 180].includes(n))
  const reportPath = path.join(own, `fig-${n}.render.json`)
  assert(!fs.existsSync(reportPath), 'Refusing repeated native render')
  const invocation = spawnSync(process.execPath, [path.join(tools, 'render_spec.mjs'),
    '--spec', path.join(own, `fig-${n}.spec.json`),
    '--svg', path.join(own, `fig-${n}.svg`), '--report', reportPath],
  {cwd: repo, encoding: 'utf8'})
  write(`fig-${n}.native-invocation.json`, {
    command: [process.execPath, 'render_spec.mjs', '--spec', path.join(own, `fig-${n}.spec.json`),
      '--svg', path.join(own, `fig-${n}.svg`), '--report', reportPath],
    nativeValidatorInvocations: 1, nativeRendererInvocations: 1,
    status: invocation.status, stdout: invocation.stdout, stderr: invocation.stderr,
    independentFIGPassClaimed: false, independentDISPLAYPassClaimed: false,
  })
  console.log(invocation.stdout)
  console.error(invocation.stderr)
  process.exitCode = invocation.status ?? 1
} else {
  throw new Error('Expected build or render <179|180>')
}
