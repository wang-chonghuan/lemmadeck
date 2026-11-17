import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

export const W = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
export const G = path.dirname(fileURLToPath(import.meta.url))
export const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
export const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
export const bind = file => ({ path: file, sha256: sha(file) })
export function destination(file) {
  assert(path.resolve(file).startsWith(`${G}/`), `Outside ownership: ${file}`)
  assert(!fs.existsSync(file), `Retain existing evidence: ${file}`)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  return file
}
export function write(file, value) {
  fs.writeFileSync(destination(file), `${JSON.stringify(value, null, 2)}\n`)
}
export function command(name, executable, args, cwd = G) {
  const result = spawnSync(executable, args, { cwd, encoding: 'utf8', timeout: 120000,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' } })
  write(`${G}/receipts/${name}.json`, {
    executable, args, cwd, exitCode: result.status, signal: result.signal,
    stdout: result.stdout, stderr: result.stderr, error: result.error?.message ?? null,
  })
  return result
}

function author() {
  const inventory = read(`${G}/source-inventory.json`)
  assert.equal(sha(inventory.source.path), inventory.source.sha256)
  const png = fs.readFileSync(inventory.source.path)
  assert.equal(png.readUInt32BE(16), inventory.source.width)
  assert.equal(png.readUInt32BE(20), inventory.source.height)
  const contextRoot = `${W}/.intentfold/tickets/STEMROBIN-181/tmp/d044-10p-n39-author/frozen`
  const inputs = []
  const authoritativeText = []
  for (const language of ['zh', 'en']) {
    for (const name of ['prose.md', 'lesson.template.json', 'figures.template.json', 'exercises.template.json']) {
      const original = `${contextRoot}/${language}/${name}`
      const frozen = `${G}/inputs/${language}/${name}`
      const binding = bind(original)
      fs.copyFileSync(original, destination(frozen))
      assert.equal(sha(frozen), binding.sha256)
      inputs.push({ language, original: binding, frozen: bind(frozen) })
    }
    authoritativeText.push({
      lesson: 'phy10-c1-s5-n39',
      text: fs.readFileSync(`${G}/inputs/${language}/prose.md`, 'utf8'),
    })
    const lesson = read(`${G}/inputs/${language}/lesson.template.json`)
    const figures = read(`${G}/inputs/${language}/figures.template.json`)
    const exercises = read(`${G}/inputs/${language}/exercises.template.json`)
    assert.equal(lesson.id, 'phy10-c1-s5-n39')
    assert.equal(figures.figures.find(item => item.id === 'fig-72').source.png.sha256, inventory.source.sha256)
    assert(exercises.exercises.every(item => !(item.figure_refs ?? []).includes('fig-72')))
    authoritativeText.push(...exercises.exercises.map(item => ({
      lesson: lesson.id, exercise: item.number, text: item.text,
    })))
  }
  const contracts = ['SKILL.md', 'references/figure-spec.md', 'references/routing.md',
    'references/quality-gate.md', 'assets/figure-spec.schema.json',
    'scripts/validate_spec.py', 'scripts/render_spec.mjs', 'scripts/materialize_arrowheads.mjs']
    .map(name => bind(`${W}/.agents/skills/ld-s10y-image/${name}`))
  write(`${G}/inputs/input-bindings.json`, {
    source: inventory.source, contexts: inputs, contracts,
    sourceInventoryBeforeSpec: bind(`${G}/source-inventory.json`),
    sourceDetail: bind(`${G}/inputs/source-delta-detail.png`),
    authoritativeText: 'Complete frozen current ZH and EN prose.md verbatim, plus every current exercise text; all six frozen templates copied without edits.',
    semanticReview: 'SCI pending; exact current context authoring only, no semantic approval inferred.',
    productAcceptance: 'Not performed or claimed. No app, DB, ticket backend, Git or shared tools were written.',
  })

  const objects = []
  const assertions = []
  const points = new Map()
  const round = value => Number(value.toFixed(9))
  const at = id => points.get(id)
  function point(id, coordinates, sourceDefining = false) {
    const value = coordinates.map(round)
    if (points.has(id)) {
      assert.deepEqual(at(id), value)
      return id
    }
    points.set(id, value)
    objects.push({ id, type: 'point', at: value, visible: sourceDefining,
      size: 0.1, strokeWidth: 0.1, stroke: 'ink', fill: 'ink' })
    return id
  }
  function edge(id, from, to, type = 'segment', strokeWidth = 2.5) {
    objects.push({ id, type, from, to, stroke: 'ink', strokeWidth, dash: 0 })
    assertions.push({ id: `${id}-connects`, type: 'connects', arrow: id, from, to })
    return id
  }
  function displacement(id, from, to) {
    assertions.push({ id, type: 'displacement', from, to,
      dx: round(at(to)[0] - at(from)[0]), dy: round(at(to)[1] - at(from)[1]) })
    return id
  }
  function label(id, text, coordinates) {
    objects.push({ id, type: 'text', text, at: coordinates, fontSize: 20,
      fontWeight: 400, labelColor: 'ink', labelPlacement: { position: 'CENTER' } })
    return id
  }
  const framePoints = [
    point('source-o', [0, 0], true),
    point('source-axis-s-start', [-30, 0], true),
    point('source-axis-s-end', [970, 0], true),
    point('source-axis-x-start', [0, -118], true),
    point('source-axis-x-end', [0, 165], true),
  ]
  const frameEdges = [
    edge('source-axis-s', framePoints[1], framePoints[2], 'arrow', 2),
    edge('source-axis-x', framePoints[3], framePoints[4], 'arrow', 2),
  ]
  assertions.push({ id: 'source-axes-perpendicular', type: 'perpendicular',
    a: framePoints[1], b: framePoints[2], c: framePoints[3], d: framePoints[4] })
  const frameRelations = [
    displacement('source-o-s-axis-left', 'source-o', framePoints[1]),
    displacement('source-o-s-axis-right', 'source-o', framePoints[2]),
    displacement('source-o-x-axis-bottom', 'source-o', framePoints[3]),
    displacement('source-o-x-axis-top', 'source-o', framePoints[4]),
  ]
  const frameLabels = [
    label('source-x-symbol', 'x', [-38, 173]),
    label('source-s-symbol', 's', [971, -31]),
    label('source-o-symbol', 'O', [-31, -27]),
  ]
  const { period: L, amplitude: A, rightShift: D, sharedPlottedInterval: [start, end] } = inventory.regularization
  const sine = q => round(A * Math.sin(2 * Math.PI * q / L))
  const intersections = Array.from({ length: 5 }, (_, index) => D / 2 + L / 4 + index * L / 2)
  const knots = new Set([-D, 0, end - D, end, 575, 370 - D])
  for (let index = -18; index <= 262; index += 1) {
    const q = index * L / 100
    if (q >= -D && q <= end) knots.add(q)
  }
  for (let index = 0; index <= 10; index += 1) knots.add(index * L / 4)
  for (const x of intersections) { knots.add(x); knots.add(x - D) }
  const sorted = [...knots].sort((a, b) => a - b)
  const qKey = q => String(q).replaceAll('-', 'minus-').replaceAll('.', '-')
  const nativeDefinitions = []
  const waves = []
  for (const [role, shift] of [['t', 0], ['later', D]]) {
    const sourceCurve = inventory.curves.find(curve => curve.id === `source-wave-${role}`)
    const sourceNames = role === 't'
      ? new Map([[0, 'start-origin'], [L / 4, 'crest-1'], [L / 2, 'zero-1'],
        [3 * L / 4, 'trough-1'], [L, 'zero-2'], [5 * L / 4, 'crest-2'],
        [3 * L / 2, 'zero-3'], [7 * L / 4, 'trough-2'], [2 * L, 'zero-4'],
        [9 * L / 4, 'crest-3'], [5 * L / 2, 'zero-5'], [end, 'end']])
      : new Map([[-D, 'start'], [0, 'zero-0'], [L / 4, 'crest-1'],
        [L / 2, 'zero-1'], [3 * L / 4, 'trough-1'], [L, 'zero-2'],
        [5 * L / 4, 'crest-2'], [3 * L / 2, 'zero-3'], [7 * L / 4, 'trough-2'],
        [2 * L, 'zero-4'], [9 * L / 4, 'crest-3'], [end - D, 'end']])
    const sequence = []
    const landmarkIds = []
    const intersectionIds = []
    const qIds = {}
    for (const q of sorted.filter(q => q + shift >= start && q + shift <= end)) {
      const name = sourceNames.get(q)
      const intersectionIndex = intersections.indexOf(q + shift)
      const id = role === 't' && q === 0 ? 'source-o'
        : name ? `source-wave-${role}-${name}`
          : intersectionIndex >= 0 ? `source-wave-${role}-intersection-${intersectionIndex + 1}`
            : `wave-${role}-sample-${qKey(q)}`
      point(id, [q + shift, sine(q)], Boolean(name || intersectionIndex >= 0))
      sequence.push(id)
      qIds[q] = id
      if (name) {
        landmarkIds.push(id)
        nativeDefinitions.push({ curve: sourceCurve.id, sourceAnchor: name,
          sourcePixel: sourceCurve.definingAnchors.find(item => item.id === name).pixel,
          point: id, renderAt: at(id), basis: 'Explicit regularized defining anchor before interpolation.' })
      }
      if (intersectionIndex >= 0) intersectionIds[intersectionIndex] = id
    }
    assert.equal(landmarkIds.length, 12)
    const edges = sequence.slice(1).map((id, index) =>
      edge(`source-wave-${role}-edge-${index}`, sequence[index], id, 'segment', 2.6))
    const relations = landmarkIds.slice(1).map((id, index) =>
      displacement(`source-wave-${role}-defining-relation-${index}`, landmarkIds[index], id))
    waves.push({ role, shift, sequence, landmarkIds, intersectionIds, qIds, edges, relations })
  }
  const [earlier, later] = waves
  const translated = []
  for (const [q, id] of Object.entries(earlier.qIds)) {
    if (later.qIds[q]) {
      const relation = displacement(`phase-shift-${qKey(Number(q))}`, id, later.qIds[q])
      assert.equal(assertions.at(-1).dx, D)
      assert.equal(assertions.at(-1).dy, 0)
      translated.push({ q: Number(q), earlier: id, later: later.qIds[q], assertion: relation })
    }
  }
  const intersectionRelations = intersections.map((s, index) => {
    const a = earlier.intersectionIds[index]
    const b = later.intersectionIds[index]
    assert(Math.abs(at(a)[1] - at(b)[1]) < 1e-8)
    return displacement(`source-intersection-${index + 1}-coincides`, a, b)
  })
  const wavelengthCrests = ['source-wave-t-crest-1', 'source-wave-t-crest-2']
  const shiftCrests = ['source-wave-t-crest-3', 'source-wave-later-crest-3']
  function dimension(id, crests, y) {
    const endpoints = crests.map((crest, index) =>
      point(`${id}-endpoint-${index}`, [at(crest)[0], y], true))
    const tops = crests.map((crest, index) =>
      point(`${id}-guide-top-${index}`, [at(crest)[0], y + 20], true))
    const middle = point(`${id}-middle`, [(at(endpoints[0])[0] + at(endpoints[1])[0]) / 2, y], true)
    const edges = [
      ...crests.map((crest, index) => edge(`${id}-guide-${index}`, crest, tops[index], 'segment', 1.7)),
      ...endpoints.map((endpoint, index) => edge(`${id}-arrow-${index}`, middle, endpoint, 'arrow', 1.7)),
    ]
    const relations = [
      displacement(`${id}-span`, crests[0], crests[1]),
      ...crests.map((crest, index) => displacement(`${id}-crest-to-endpoint-${index}`, crest, endpoints[index])),
      ...crests.map((crest, index) => displacement(`${id}-crest-to-guide-top-${index}`, crest, tops[index])),
      displacement(`${id}-middle-to-left`, middle, endpoints[0]),
      displacement(`${id}-middle-to-right`, middle, endpoints[1]),
    ]
    return { points: [...crests, ...endpoints, ...tops, middle], edges, relations }
  }
  const wavelength = dimension('source-wavelength', wavelengthCrests, 131)
  const shift = dimension('source-shift', shiftCrests, 112)
  const wavelengthLabel = label('source-wavelength-symbol', '\u03bb', [262.5, 163])
  const shiftLabel = label('source-shift-formula', '\u0394s = v\u00b7\u0394t', [817.5, 164])
  const velocityPoints = [
    point('source-v-start', [574, 132], true), point('source-v-end', [653, 132], true),
    point('source-v-accent-start', [604, 187], true), point('source-v-accent-end', [633, 187], true),
  ]
  const velocityEdges = [
    edge('source-v-direction', velocityPoints[0], velocityPoints[1], 'arrow', 2),
    edge('source-v-vector-accent', velocityPoints[2], velocityPoints[3], 'arrow', 1.4),
  ]
  const velocityRelations = [
    displacement('source-v-direction-right', velocityPoints[0], velocityPoints[1]),
    displacement('source-v-accent-right', velocityPoints[2], velocityPoints[3]),
  ]
  const velocityLabel = label('source-v-symbol', 'v', [613.5, 165])
  const laterTip = later.qIds[370 - D]
  const earlierTip = earlier.qIds[575]
  const leaderPoints = [
    point('source-t-leader-start', [525, -124], true),
    point('source-later-leader-start', [408, -122], true),
    earlierTip, laterTip,
  ]
  for (const id of [earlierTip, laterTip]) objects.find(object => object.id === id).visible = true
  const leaderEdges = [
    edge('source-t-leader', leaderPoints[0], earlierTip, 'arrow', 1.8),
    edge('source-later-leader', leaderPoints[1], laterTip, 'arrow', 1.8),
  ]
  const leaderRelations = [
    displacement('source-t-leader-up-right', leaderPoints[0], earlierTip),
    displacement('source-later-leader-up-left', leaderPoints[1], laterTip),
  ]
  const timeLabels = [
    label('source-t-symbol', 't', [516, -150]),
    label('source-later-symbol', 't + \u0394t', [378, -150]),
  ]
  assertions.push({ id: 'source-label-count', type: 'objectCount', objectType: 'text', count: 8 })
  assertions.push({ id: 'source-arrowhead-count', type: 'objectCount', objectType: 'arrow', count: 10 })
  const connects = edges => edges.map(id => `${id}-connects`)
  const groups = [
    { id: 'source-shared-frame', description: 'Original pixels: one x-displacement / s-position frame with upward and rightward axis arrows, capital O, no ticks or numeric scale. Scan skew and the short axis scan gap are rectified additions, not new source data.',
      objects: [...framePoints, ...frameEdges, ...frameLabels],
      assertions: [...connects(frameEdges), ...frameRelations, 'source-axes-perpendicular', 'source-label-count', 'source-arrowhead-count'], requires: ['pointRelationships'] },
    ...waves.map(wave => ({
      id: `source-wave-${wave.role}`, description: `Original ${wave.role === 't' ? 'earlier t' : 'later t + Delta t'} solid curve: 12 observed defining anchors, three crests, two troughs and finite shared interval. ${wave.role === 't' ? 'Rises through O.' : 'Rises from below O at s=0 and is the same wave translated right.'} Source anchors are inventoried before interpolation; sampled sine coordinates are uncalibrated regularization.`,
      objects: [...wave.landmarkIds, ...wave.edges],
      assertions: [...wave.relations, ...connects(wave.edges)], requires: ['pointRelationships'],
    })),
    { id: 'source-five-curve-intersections', description: 'Five original inter-curve crossings, with positive/negative/positive/negative/positive displacement signs, in the same frame. Equality and both branches are explicit native points, not unchecked opaque paths.',
      objects: [...earlier.intersectionIds, ...later.intersectionIds],
      assertions: intersectionRelations, requires: ['pointRelationships'] },
    { id: 'source-wavelength-span', description: 'Original lambda span with two outward arrowheads and two vertical guides joins the first two earlier crests. The regularized nearest same-phase crest separation is one schematic wavelength; no number is drawn.',
      objects: [...wavelength.points, ...wavelength.edges, wavelengthLabel],
      assertions: [...wavelength.relations, ...connects(wavelength.edges)], requires: ['pointRelationships'] },
    { id: 'source-right-shift-span', description: 'Original Delta s = v middle-dot Delta t annotation with two outward arrowheads and vertical guides joins the third earlier and later crests. Shift is rightward; symbolic only. Actual translation assertions are in the spec and additional mathematical gate.',
      objects: [...shift.points, ...shift.edges, shiftLabel],
      assertions: [...shift.relations, ...connects(shift.edges)], requires: ['pointRelationships'] },
    { id: 'source-velocity-and-vector-accent', description: 'Original rightward propagation arrow under v and separate small rightward vector-accent arrow above v. Preserve both, with no new numeric velocity.',
      objects: [...velocityPoints, ...velocityEdges, velocityLabel],
      assertions: [...velocityRelations, ...connects(velocityEdges)], requires: ['pointRelationships'] },
    { id: 'source-curve-identification', description: 'Original t leader points up/right onto the earlier descending branch; t + Delta t leader points up/left onto the later ascending branch. Both literal labels remain distinct and correctly attached.',
      objects: [...leaderPoints, ...leaderEdges, ...timeLabels],
      assertions: [...leaderRelations, ...connects(leaderEdges)], requires: ['pointRelationships'] },
  ]
  const spec = {
    schema: 'ld-s10y-image/figure-spec@2', id: 'fig-72', mode: 'deterministic',
    description: 'Compare the two source solid waveforms at t and t + Delta t in one displacement x versus position s frame: earlier curve through capital O, later curve translated right, wavelength span, rightward vector velocity v, and Delta s = v middle-dot Delta t. Native JSXGraph segments and arrows, literal mathematical glyphs, no numbered scale, units, phase-fraction answers or new measured data. SCI and independent review are pending.',
    source: { image: bind(inventory.source.path), authoritativeText, inventory: groups },
    canvas: { width: 640, height: 360, boundingBox: [-65, 205, 995, -185],
      keepAspectRatio: false, background: 'paper' },
    display: { purpose: 'instructional', layout: 'scroll', widths: [640], minTextPx: 16 },
    layout: { minLabelGap: 3 },
    objects, assertions,
  }
  write(`${G}/geometry-definition.json`, {
    sourceInventory: bind(`${G}/source-inventory.json`),
    schematic: inventory.regularization, nativeDefinitions, intersections,
    waves, translated, sourceGroups: groups.length,
    phaseShiftStatus: 'Exact same sampled base coordinates translated right; each common sample has native displacement(dx=60,dy=0). No displayed value or measured phase fraction.',
    labelIds: [...frameLabels, wavelengthLabel, shiftLabel, velocityLabel, ...timeLabels],
    arrowIds: objects.filter(object => object.type === 'arrow').map(object => object.id),
  })
  write(`${G}/initial/fig-72.spec.json`, spec)
  const draft = command('initial-validation', 'python3', [
    `${W}/.agents/skills/ld-s10y-image/scripts/validate_spec.py`,
    'fig-72.spec.json', '--stage', 'draft', '--json',
  ], `${G}/initial`)
  assert.equal(draft.status, 0, draft.stdout + draft.stderr)
  const render = command('initial-render', 'node', [
    `${W}/.agents/skills/ld-s10y-image/scripts/render_spec.mjs`,
    '--spec', 'fig-72.spec.json', '--svg', 'fig-72.svg', '--report', 'fig-72.render.json',
    '--png', 'fig-72.full.png',
  ], `${G}/initial`)
  console.log(JSON.stringify({ renderExitCode: render.status,
    stdout: render.stdout, stderr: render.stderr, objects: objects.length, assertions: assertions.length }))
}
if (process.argv[1] === fileURLToPath(import.meta.url)) author()
