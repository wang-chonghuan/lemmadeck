import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const R = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), R)
const O = `${R}/.intentfold/tickets/STEMROBIN-181/tmp/d794-n83-fig196197-first-author`
const T = `${R}/.intentfold/tickets/STEMROBIN-181/tmp`
const card = 'phy10-c2-s3-n83'
const canonical = 'ssot-resources/soviet10year-textbooks/artifacts/10p/figures'
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const write = (p, value) => {
  assert.ok(path.resolve(p).startsWith(`${O}/`))
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}
assert.ok(!fs.existsSync(`${O}/input-binding.json`), 'Do not replay authoring')
const inputs = {
  requirements: `${T}/d747-source225226-consume-prepare83/preauthor-source-requirements.json`,
  raw: `${T}/d747-source225226-consume-prepare83/root/10p/lessons/${card}/lesson.json`,
  en: `${T}/d769-n83-citation-label-affected-repair/candidates/en/${card}/lesson.template.json`,
  zh: `${T}/d769-n83-citation-label-affected-repair/candidates/zh/${card}/lesson.template.json`,
  observation: `${O}/source-inventory.json`,
  buildContext: `${R}/.agents/skills/ld-s10y-image/scripts/build_context.py`,
  validator: `${R}/.agents/skills/ld-s10y-image/scripts/validate_spec.py`,
  renderer: `${R}/.agents/skills/ld-s10y-image/scripts/render_spec.mjs`,
}
const requirements = read(inputs.requirements)
assert.equal(requirements.status, 'SOURCE-CLOSED-PREAUTHOR-FROZEN')
assert.deepEqual(requirements.figureIds, ['fig-196', 'fig-197'])
const raw = read(inputs.raw)
const editions = Object.fromEntries(['en', 'zh'].map(locale => [locale, read(inputs[locale])]))
const observed = read(inputs.observation)
for (const edition of Object.values(editions)) {
  assert.equal(edition.card_id, card)
  assert.equal(edition.exercise_count, 3)
  assert.equal(edition.source.sha256, hash(inputs.raw))
  assert.deepEqual(edition.prose.map(p => p.source_refs), raw.prose.map(p => p.source_refs))
}
const bindings = Object.fromEntries(Object.entries(inputs).map(([name, p]) => [name, {
  path: path.relative(R, p), sha256: hash(p),
}]))
for (const id of requirements.figureIds) bindings[id] = {
  path: `${canonical}/${id}.png`, sha256: hash(`${R}/${canonical}/${id}.png`),
}
write(`${O}/input-binding.json`, { ticket: 'STEMROBIN-181/181-3', card, bindings })

const contexts = {}
for (const locale of ['en', 'zh']) {
  const root = `${O}/context-root/${locale}`
  const lessonDir = `${root}/10p/editions/modern-us-neutral/lessons/${card}`
  const figuresDir = `${root}/10p/figures`
  fs.mkdirSync(figuresDir, { recursive: true })
  write(`${lessonDir}/lesson.json`, editions[locale])
  write(`${lessonDir}/exercises.json`, {
    exercises: [],
    contextOnly: 'Prose-figure batch: no exercise figure references or written-answer content is added. All edition prose remains authoritative and complete.',
  })
  for (const id of requirements.figureIds) {
    fs.symlinkSync(`${R}/${canonical}/${id}.png`, `${figuresDir}/${id}.png`)
    const output = `${O}/contexts/${id}.${locale}.native.json`
    const args = [
      inputs.buildContext, '--book', '10p', '--edition', 'modern-us-neutral',
      '--figure', id, '--root', root, '--output', output,
    ]
    const result = spawnSync('python3', args, {
      cwd: R, encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
    })
    write(`${O}/commands/${id}.${locale}.build-context.json`, {
      command: 'python3', args, cwd: R, exitCode: result.status,
      stdout: result.stdout, stderr: result.stderr,
    })
    assert.equal(result.status, 0, `Stop this context at its first native failure: ${result.stderr}`)
    const native = read(output)
    const complete = {
      ...native,
      locale,
      sourceImage: { ...native.sourceImage, ...bindings[id] },
      lessons: native.lessons.map(lesson => ({
        ...lesson,
        completeEditionProse: editions[locale].prose,
        authoritativeLesson: bindings[locale],
        rawLesson: bindings.raw,
        exerciseContextScope: 'No numbered figure is referenced by an exercise in this batch. The three written questions remain out of scope.',
      })),
      relocation: 'All final input paths are repository-relative, including the durable canonical source PNG. Native temporary-root receipts are historical only.',
      excludedFigureAssets: ['Color Plate I', 'Color Plate II'],
    }
    write(`${O}/contexts/${id}.${locale}.complete.json`, complete)
    contexts[`${id}.${locale}`] = complete
  }
}
const authoritativeText = ['en', 'zh'].flatMap(locale => editions[locale].prose
  .filter(p => p.text?.trim())
  .map(p => ({ lesson: `${card}:${locale}`, text: p.text })))
write(`${O}/authoritative-text.json`, {
  card, rules: 'Complete approved bilingual prose retained verbatim; references to external colour plates are text only, not source-image ownership or objects in these numbered figures.',
  authoritativeText, inputBindings: bindings,
})

function drawing(id, width, height) {
  const objects = []
  const assertions = []
  const inventory = []
  const positions = {}
  const point = (name, at) => {
    positions[name] = at
    objects.push({ id: name, type: 'point', at, size: 0.3, strokeWidth: 0.5, stroke: 'ink', fill: 'ink' })
    return name
  }
  const relation = (name, type, fields) => {
    assertions.push({ id: name, type, ...fields })
    return name
  }
  const edge = (name, from, to, options = {}) => {
    objects.push({ id: name, type: 'segment', from, to, stroke: 'ink', strokeWidth: 2.4, ...options })
    relation(`${name}-connects`, 'connects', { arrow: name, from, to })
    return name
  }
  const text = (name, at, value, fontSize = 18) => {
    objects.push({ id: name, type: 'text', at, text: value, fontSize, fontWeight: 500, labelPlacement: { position: 'CENTER' } })
    return name
  }
  const displacement = (name, from, to) => relation(name, 'displacement', {
    from, to, dx: positions[to][0] - positions[from][0], dy: positions[to][1] - positions[from][1],
  })
  const group = (name, description, ids, rels, relational = false) => {
    inventory.push({
      id: name, description, objects: ids, assertions: rels,
      ...(relational ? { requires: ['pointRelationships'] } : {}),
    })
  }
  const directional = (name, from, to, start = 0.55, end = 0.65) => {
    const a = positions[from]
    const b = positions[to]
    const at = t => [a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])]
    objects.push({ id: name, type: 'arrow', from: at(start), to: at(end), stroke: 'ink', strokeWidth: 2.4 })
    relation(`${name}-connects`, 'connects', { arrow: name, from: at(start), to: at(end) })
    relation(`${name}-start-on-ray`, 'pointOnLine', { point: at(start), a: from, b: to })
    relation(`${name}-end-on-ray`, 'pointOnLine', { point: at(end), a: from, b: to })
    return name
  }
  const polygon = (name, vertices, fillOpacity = 0.05, stroke = 'ink', strokeWidth = 2.4) => {
    objects.push({ id: name, type: 'polygon', points: vertices, fill: 'accentSoft', fillOpacity, stroke, strokeWidth })
    return name
  }
  const observation = name => observed.figures.find(f => f.id === id).inventory.find(g => g.id === name).description
  const spec = () => ({
    schema: 'ld-s10y-image/figure-spec@2', id, mode: 'deterministic',
    description: id === 'fig-196'
      ? 'Schematic Newton round-hole experiment: narrow sunlight enters a dark room through the left shutter, traverses one glass prism and forms partially overlapping circular colour images on the opposite wall. Seven named representative samples describe the continuous spectrum, not seven discrete wavelengths; no measured optical values are inferred.'
      : 'Schematic improved slit experiment: slit, biconvex lens, one apex-up prism and screen, solid red/violet bundles with common image contacts, and dashed no-prism continuations to the original white image. Coordinates express source topology/order, not measured optical data or a numerical Snell-law construction.',
    source: { image: bindings[id], authoritativeText, inventory },
    canvas: { width, height, boundingBox: [0, height, width, 0], background: 'paper', keepAspectRatio: true },
    display: { purpose: 'instructional', layout: 'scroll', minTextPx: 16, widths: [640] },
    layout: { minLabelGap: 2 },
    objects, assertions,
  })
  return { objects, assertions, positions, point, edge, text, relation, displacement, group, directional, polygon, observation, spec }
}

{
  const d = drawing('fig-196', 640, 460)
  const { point, edge, text, relation, displacement, group, polygon, observation } = d
  const windowTop = point('window-top', [48, 325])
  const windowBottom = point('window-bottom', [48, 215])
  const hole = point('round-hole', [68, 280])
  polygon('window-shutter', [[48, 325], [88, 340], [88, 218], [48, 200]], 0.07, 'muted', 2)
  d.objects.push({ id: 'hole-rim', type: 'circle', center: hole, radius: 5, stroke: 'ink', strokeWidth: 2, fill: 'paper', fillOpacity: 1 })
  const entry = point('prism-entry', [232, 242 - 58 * 17 / 35])
  const incident = edge('white-incident-beam', hole, entry, { strokeWidth: 5 })
  const prismLeft = point('prism-left', [215, 242])
  const prismRight = point('prism-right', [285, 242])
  const prismBottom = point('prism-bottom', [250, 184])
  const prism = polygon('glass-prism', [prismLeft, prismRight, prismBottom], 0.08)
  relation('entry-on-left-prism-face', 'pointOnLine', { point: entry, a: prismLeft, b: prismBottom })
  displacement('window-before-prism', hole, entry)
  edge('prism-support', [250, 184], [250, 132], { stroke: 'muted', strokeWidth: 3 })
  edge('support-top', [203, 130], [297, 130], { stroke: 'muted', strokeWidth: 3 })
  edge('support-left-leg', [216, 130], [205, 98], { stroke: 'muted', strokeWidth: 2 })
  edge('support-right-leg', [283, 130], [295, 98], { stroke: 'muted', strokeWidth: 2 })
  const wallTop = point('receiving-wall-top', [480, 390])
  const wallBottom = point('receiving-wall-bottom', [480, 201])
  polygon('receiving-wall', [[449, 390], [505, 415], [505, 180], [449, 205]], 0.035, 'muted', 1.8)
  edge('room-upper-left', [40, 365], [360, 390], { stroke: 'grid', strokeWidth: 2 })
  edge('room-upper-right', [360, 390], [449, 390], { stroke: 'grid', strokeWidth: 2 })
  edge('room-floor', [40, 75], [449, 95], { stroke: 'grid', strokeWidth: 2 })
  text('round-hole-label', [83, 371], 'Round hole')
  text('white-light-label', [162, 296], 'White light')
  text('prism-label', [254, 165], 'Prism')
  text('wall-label', [475, 434], 'Wall')
  group('196-room', observation('196-room'), [
    'window-shutter', windowTop, windowBottom, 'receiving-wall', wallTop, wallBottom,
    'room-upper-left', 'room-upper-right', 'room-floor', 'prism-support', 'support-top', 'support-left-leg', 'support-right-leg',
  ], [
    displacement('window-upright', windowBottom, windowTop),
    displacement('wall-upright', wallBottom, wallTop),
    'prism-support-connects', 'support-top-connects', 'support-left-leg-connects', 'support-right-leg-connects',
  ], true)
  group('196-round-hole-and-incident-beam', observation('196-round-hole-and-incident-beam'), [
    hole, entry, 'hole-rim', incident, 'round-hole-label', 'white-light-label',
  ], ['white-incident-beam-connects', 'window-before-prism'], true)
  const colours = ['Violet', 'Indigo', 'Blue', 'Green', 'Yellow', 'Orange-yellow', 'Red']
  const circleIds = []
  const rayIds = []
  const contacts = []
  const exits = []
  const spectrumAssertions = []
  colours.forEach((colour, index) => {
    const y = 225 - index
    const x = 250 + (y - 184) * 35 / 58
    const exit = point(`prism-exit-${index + 1}`, [x, y])
    const contact = point(`wall-contact-${index + 1}`, [480, 362 - index * 22])
    const inner = edge(`internal-component-${index + 1}`, entry, exit, { strokeWidth: 1.2 })
    const ray = edge(`emergent-component-${index + 1}`, exit, contact, { strokeWidth: 1.8 })
    const circle = `round-image-${index + 1}`
    d.objects.push({ id: circle, type: 'circle', center: contact, radius: 15, stroke: 'muted', strokeWidth: 1.8, fill: 'paper', fillOpacity: 0 })
    const label = text(`colour-name-${index + 1}`, [556, 362 - index * 22], colour)
    relation(`exit-${index + 1}-on-face`, 'pointOnLine', { point: exit, a: prismBottom, b: prismRight })
    relation(`contact-${index + 1}-on-wall`, 'pointOnLine', { point: contact, a: wallBottom, b: wallTop })
    relation(`contact-${index + 1}-inside-wall`, 'inside', { point: contact, container: 'receiving-wall' })
    circleIds.push(circle)
    contacts.push(contact)
    exits.push(exit)
    rayIds.push(inner, ray, label)
    spectrumAssertions.push(
      `${inner}-connects`, `${ray}-connects`, `exit-${index + 1}-on-face`,
      `contact-${index + 1}-on-wall`, `contact-${index + 1}-inside-wall`,
    )
    if (index > 0) {
      const previous = contacts[index - 1]
      spectrumAssertions.push(displacement(`ordered-round-images-${index}`, previous, contact))
      spectrumAssertions.push(relation(`overlapping-round-image-spacing-${index}`, 'distance', { a: previous, b: contact, value: 22 }))
    }
  })
  relation('seven-representative-round-images', 'objectCount', { objectType: 'circle', count: 8 })
  group('196-prism', observation('196-prism'), [prismLeft, prismRight, prismBottom, entry, prism, 'prism-label', ...exits], [
    'entry-on-left-prism-face',
    displacement('prism-top-face-order', prismLeft, prismRight),
    displacement('prism-left-to-bottom', prismLeft, prismBottom),
    ...exits.map((_, i) => `exit-${i + 1}-on-face`),
    ...exits.map((_, i) => `internal-component-${i + 1}-connects`),
  ], true)
  group('196-spread-and-overlapping-patches', observation('196-spread-and-overlapping-patches'), [
    entry, prismRight, prismBottom, wallBottom, wallTop, ...exits, ...contacts, ...circleIds, ...rayIds,
  ], ['wall-upright', ...spectrumAssertions, 'seven-representative-round-images'], true)
  write(`${O}/fig-196/initial/spec.json`, d.spec())
}

{
  const d = drawing('fig-197', 640, 400)
  const { point, edge, text, relation, displacement, group, directional, polygon, observation } = d
  const slit = point('slit', [65, 220])
  const lensTop = point('lens-top', [170, 300])
  const lensBottom = point('lens-bottom', [170, 130])
  const white = point('white-image', [525, 220])
  const screenTop = point('screen-top', [525, 320])
  const screenBottom = point('screen-bottom', [525, 65])
  edge('slit-barrier-top', [65, 320], [65, 227], { strokeWidth: 6 })
  edge('slit-barrier-bottom', [65, 213], [65, 80], { strokeWidth: 6 })
  edge('receiving-screen', screenBottom, screenTop, { strokeWidth: 4 })
  d.objects.push(
    { id: 'lens-left', type: 'arc', center: [315, 215], start: lensTop, end: lensBottom, stroke: 'ink', strokeWidth: 2.5 },
    { id: 'lens-right', type: 'arc', center: [25, 215], start: lensBottom, end: lensTop, stroke: 'ink', strokeWidth: 2.5 },
  )
  const apex = point('prism-apex', [300, 310])
  const left = point('prism-base-left', [218, 125])
  const right = point('prism-base-right', [380, 125])
  polygon('glass-prism', [left, right, apex], 0.07)
  text('slit-label', [65, 356], 'Slit')
  text('lens-label', [170, 356], 'Lens')
  text('screen-label', [525, 356], 'Screen')
  text('prism-label', [300, 62], 'Prism')
  text('white-image-label', [544, 260], 'White image')
  const upper = edge('upper-slit-ray', slit, lensTop)
  const lower = edge('lower-slit-ray', slit, lensBottom)
  edge('central-reference', slit, white, { stroke: 'muted', strokeWidth: 1.8 })
  directional('upper-incident-arrow', slit, lensTop)
  directional('lower-incident-arrow', slit, lensBottom)
  edge('upper-no-prism-reference', lensTop, white, { dash: 2, stroke: 'muted', strokeWidth: 1.8 })
  edge('lower-no-prism-reference', lensBottom, white, { dash: 2, stroke: 'muted', strokeWidth: 1.8 })
  relation('lens-left-top-radius', 'pointOnCircle', { point: lensTop, center: [315, 215], radius: Math.hypot(145, 85) })
  relation('lens-left-bottom-radius', 'pointOnCircle', { point: lensBottom, center: [315, 215], radius: Math.hypot(145, 85) })
  relation('lens-right-top-radius', 'pointOnCircle', { point: lensTop, center: [25, 215], radius: Math.hypot(145, 85) })
  relation('lens-right-bottom-radius', 'pointOnCircle', { point: lensBottom, center: [25, 215], radius: Math.hypot(145, 85) })
  // Intersect the converging lens ray with the prism's left face.
  const intersect = (a, b, c, e) => {
    const cross = (u, v) => u[0] * v[1] - u[1] * v[0]
    const ab = [b[0] - a[0], b[1] - a[1]]
    const ce = [e[0] - c[0], e[1] - c[1]]
    const ca = [c[0] - a[0], c[1] - a[1]]
    const t = cross(ca, ce) / cross(ab, ce)
    return [a[0] + t * ab[0], a[1] + t * ab[1]]
  }
  const entryUpper = point('upper-prism-entry', intersect(d.positions[lensTop], d.positions[white], d.positions[left], d.positions[apex]))
  const entryLower = point('lower-prism-entry', intersect(d.positions[lensBottom], d.positions[white], d.positions[left], d.positions[apex]))
  edge('upper-lens-to-prism', lensTop, entryUpper)
  edge('lower-lens-to-prism', lensBottom, entryLower)
  for (const [name, lens, entry] of [['upper', lensTop, entryUpper], ['lower', lensBottom, entryLower]]) {
    relation(`${name}-entry-on-lens-reference`, 'collinear', { a: lens, b: entry, c: white })
    relation(`${name}-entry-on-prism-face`, 'pointOnLine', { point: entry, a: left, b: apex })
  }
  const red = point('red-image', [525, 145])
  const violet = point('violet-image', [525, 92])
  const colourObjects = [red, violet, entryUpper, entryLower, apex, left, right, white]
  const colourAssertions = []
  for (const [route, entry, baseY, delta] of [
    ['upper', entryUpper, 264, 14],
    ['lower', entryLower, 143, 9],
  ]) {
    for (const [colour, screen, y] of [['red', red, baseY], ['violet', violet, baseY - delta]]) {
      const x = 380 - (y - 125) * 80 / 185
      const exit = point(`${route}-${colour}-exit`, [x, y])
      const inside = edge(`${route}-${colour}-internal`, entry, exit, { strokeWidth: 1.8 })
      const output = edge(`${route}-${colour}-emergent`, exit, screen)
      const arrow = directional(`${route}-${colour}-arrow`, exit, screen, 0.48, 0.63)
      relation(`${route}-${colour}-exit-on-face`, 'pointOnLine', { point: exit, a: apex, b: right })
      relation(`${route}-${colour}-exit-inside-prism`, 'inside', { point: exit, container: 'glass-prism' })
      colourObjects.push(exit, inside, output, arrow)
      colourAssertions.push(
        `${inside}-connects`, `${output}-connects`, `${arrow}-connects`,
        `${arrow}-start-on-ray`, `${arrow}-end-on-ray`,
        `${route}-${colour}-exit-on-face`, `${route}-${colour}-exit-inside-prism`,
      )
    }
  }
  text('red-label', [567, 145], 'Red')
  text('violet-label', [571, 92], 'Violet')
  relation('white-on-screen', 'pointOnLine', { point: white, a: screenBottom, b: screenTop })
  relation('red-on-screen', 'pointOnLine', { point: red, a: screenBottom, b: screenTop })
  relation('violet-on-screen', 'pointOnLine', { point: violet, a: screenBottom, b: screenTop })
  displacement('white-above-red', red, white)
  displacement('red-above-violet', violet, red)
  const lensChecks = ['lens-left-top-radius', 'lens-left-bottom-radius', 'lens-right-top-radius', 'lens-right-bottom-radius']
  group('197-slit-lens-screen', observation('197-slit-lens-screen'), [
    slit, lensTop, lensBottom, apex, left, right, screenTop, screenBottom,
    'slit-barrier-top', 'slit-barrier-bottom', 'lens-left', 'lens-right', 'glass-prism', 'receiving-screen',
    'slit-label', 'lens-label', 'prism-label', 'screen-label',
  ], [
    ...lensChecks, 'receiving-screen-connects',
    displacement('slit-before-lens', slit, lensBottom),
    displacement('lens-before-prism', lensBottom, left),
    displacement('prism-base-order', left, right),
    displacement('prism-before-screen', right, screenBottom),
    displacement('prism-apex-location', left, apex),
    displacement('screen-upright', screenBottom, screenTop),
    displacement('lens-upright', lensBottom, lensTop),
  ], true)
  group('197-incident-rays', observation('197-incident-rays'), [
    slit, lensTop, lensBottom, white, entryUpper, entryLower, upper, lower, 'central-reference',
    'upper-incident-arrow', 'lower-incident-arrow', 'upper-lens-to-prism', 'lower-lens-to-prism',
  ], [
    'upper-slit-ray-connects', 'lower-slit-ray-connects', 'central-reference-connects',
    'upper-lens-to-prism-connects', 'lower-lens-to-prism-connects',
    'upper-incident-arrow-connects', 'lower-incident-arrow-connects',
    'upper-entry-on-lens-reference', 'lower-entry-on-lens-reference',
  ], true)
  group('197-dashed-undispersed-image', observation('197-dashed-undispersed-image'), [
    lensTop, lensBottom, white, entryUpper, entryLower, screenBottom, screenTop,
    'upper-no-prism-reference', 'lower-no-prism-reference', 'central-reference', 'white-image-label',
  ], [
    'upper-no-prism-reference-connects', 'lower-no-prism-reference-connects',
    'upper-entry-on-lens-reference', 'lower-entry-on-lens-reference', 'white-on-screen',
    'screen-upright', 'lens-upright',
  ], true)
  group('197-prism-and-solid-output', observation('197-prism-and-solid-output'), [
    ...colourObjects, screenBottom, screenTop, lensTop, lensBottom,
    'glass-prism', 'upper-lens-to-prism', 'lower-lens-to-prism',
  ], [
    ...colourAssertions, 'upper-entry-on-prism-face', 'lower-entry-on-prism-face',
    'upper-entry-on-lens-reference', 'lower-entry-on-lens-reference',
    'white-above-red', 'red-above-violet', 'red-on-screen', 'violet-on-screen',
    'white-on-screen', 'prism-base-order', 'prism-apex-location', 'screen-upright',
    'upper-lens-to-prism-connects', 'lower-lens-to-prism-connects',
  ], true)
  group('197-source-colour-labels', observation('197-source-colour-labels'), [
    red, violet, white, screenBottom, screenTop, 'red-label', 'violet-label',
  ], ['red-on-screen', 'violet-on-screen', 'white-on-screen', 'white-above-red', 'red-above-violet', 'screen-upright'], true)
  write(`${O}/fig-197/initial/spec.json`, d.spec())
}
write(`${O}/inventory-mapping.json`, {
  observation: { path: path.relative(R, inputs.observation), sha256: hash(inputs.observation) },
  mappings: requirements.figureIds.map(id => ({ figure: id, groups: read(`${O}/${id}/initial/spec.json`).source.inventory })),
  modernAdditions: {
    common: ['Small unlabelled construction/contact dots, clean sans-serif English labels and semantic colour roles.', 'All internal layout coordinates are schematic and not source measured values. No invented numerical data is displayed.'],
    'fig-196': ['Perspective room clutter simplified to the left window, room outline, prism support and opposite wall.', 'Seven circles are named representative samples from complete approved prose; the monochrome source does not encode their pigments. Circle spacing/radii explicitly make the partly overlapping images inspectable.'],
    'fig-197': ['Slit, Lens, Prism, Screen and White image identify existing apparatus and dashed reference, rather than introduce new experiments.', 'Source prism hatching regularized to a light semantic-role fill. Red/Violet translate the two source colour words.'],
  },
  nativeStatus: 'Pending', independentReview: false, approval: 'none',
})
console.log(JSON.stringify({
  status: 'FIRST-SPECS-AUTHORED-NATIVE-PENDING',
  figures: requirements.figureIds.map(id => ({
    id, path: `${O}/${id}/initial/spec.json`, sha256: hash(`${O}/${id}/initial/spec.json`),
    objects: read(`${O}/${id}/initial/spec.json`).objects.length,
    assertions: read(`${O}/${id}/initial/spec.json`).assertions.length,
  })),
  contexts: Object.keys(contexts), authoritativeTextBlocks: authoritativeText.length,
}, null, 2))
