import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const R = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), R)
const own = `${R}/.intentfold/tickets/STEMROBIN-181/tmp/d795-n84-fig198-first-author`
const tmp = `${R}/.intentfold/tickets/STEMROBIN-181/tmp`
const card = 'phy10-c2-s3-n84'
const image = `${R}/ssot-resources/soviet10year-textbooks/artifacts/10p/figures/fig-198.png`
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const write = (name, value) => {
  const target = path.resolve(own, name)
  assert.ok(target.startsWith(`${own}/`))
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}
assert.ok(!fs.existsSync(`${own}/fig-198.first.spec.json`), 'Do not replay completed authoring')
const inputs = {
  requirements: `${tmp}/d758-source227228-consume-prepare84-85/n84-preauthor-source-requirements.json`,
  rawLesson: `${tmp}/d758-source227228-consume-prepare84-85/root/10p/lessons/${card}/lesson.json`,
  zh: `${tmp}/d788-n84-history-label-affected-repair/candidates/zh/lesson.template.json`,
  en: `${tmp}/d788-n84-history-label-affected-repair/candidates/en/lesson.template.json`,
  observation: `${own}/source-observation.json`,
  sourceImage: image,
  contextTool: `${R}/.agents/skills/ld-s10y-image/scripts/build_context.py`,
  validator: `${R}/.agents/skills/ld-s10y-image/scripts/validate_spec.py`,
  renderer: `${R}/.agents/skills/ld-s10y-image/scripts/render_spec.mjs`,
  routing: `${R}/.agents/skills/ld-s10y-image/references/routing.md`,
  contract: `${R}/.agents/skills/ld-s10y-image/references/figure-spec.md`,
  priorAuthor743: `${tmp}/d743-n82-fig195-first-author/author.mjs`,
  priorNative707: `${tmp}/d707-n80-fig188189-first-author/native-once.mjs`,
}
const requirements = read(inputs.requirements)
const raw = read(inputs.rawLesson)
assert.equal(requirements.status, 'SOURCE-CLOSED-PREAUTHOR-FROZEN')
assert.equal(requirements.card, card)
assert.equal(raw.card_id, card)
assert.equal(raw.exercise_count, 0)
assert.ok(read(inputs.observation).openedBeforeDrawing)
const sourceImage = { path: image, sha256: hash(image) }
write('input-bindings.json', {
  ticket: 'STEMROBIN-181/181-3', card, figure: 'fig-198',
  files: Object.fromEntries(Object.entries(inputs).map(([id, p]) => [id, { path: p, sha256: hash(p) }])),
  sourceImage, allowedWriteRoot: own, approval: 'none',
})

const editions = {}
const contexts = {}
for (const locale of ['zh', 'en']) {
  const lesson = read(inputs[locale])
  assert.equal(lesson.card_id, card)
  assert.equal(lesson.exercise_count, 0)
  assert.deepEqual(lesson.source.data, raw)
  editions[locale] = lesson
  const root = `${own}/context-inputs/${locale}`
  write(`context-inputs/${locale}/10p/editions/modern-us-neutral/lessons/${card}/lesson.json`, lesson)
  write(`context-inputs/${locale}/10p/editions/modern-us-neutral/lessons/${card}/exercises.json`, {
    id: card, card_id: card, exercises: [],
  })
  const link = `${root}/10p/figures/fig-198.png`
  fs.mkdirSync(path.dirname(link), { recursive: true })
  fs.symlinkSync(image, link)
  const output = `${own}/context.${locale}.native.json`
  const args = [inputs.contextTool, '--book', '10p', '--edition', 'modern-us-neutral',
    '--figure', 'fig-198', '--root', root, '--output', output]
  const result = spawnSync('python3', args, { cwd: R, encoding: 'utf8', timeout: 30000 })
  write(`context.${locale}.receipt.json`, {
    executable: 'python3', args, cwd: R, exitCode: result.status,
    stdout: result.stdout, stderr: result.stderr, error: result.error?.message ?? null,
  })
  assert.equal(result.status, 0, 'Stop at failed native context build')
  const native = read(output)
  assert.equal(native.sourceImage.sha256, sourceImage.sha256)
  assert.equal(fs.realpathSync(native.sourceImage.path), image)
  assert.equal(native.lessons.length, 1)
  assert.equal(native.lessons[0].lesson, card)
  contexts[locale] = {
    native: { path: output, sha256: hash(output) },
    sourceImage,
    completeProse: lesson.prose.filter(p => typeof p.text === 'string' && p.text.trim())
      .map(p => ({ source_refs: p.source_refs, kind: p.kind, text: p.text })),
  }
}
const authoritativeText = ['zh', 'en'].flatMap(locale => contexts[locale].completeProse.map(p => ({
  lesson: `${card}:${locale}`, text: p.text,
})))
write('context.bilingual.json', {
  schema: 'd795/current-bilingual-figure-context@1', card, figure: 'fig-198',
  sourceImage, contexts, authoritativeText,
  note: 'Existing native context contract used against owned locale staging roots. Source symlinks resolve to the durable canonical PNG; FigureSpec uses that canonical absolute path. Complete current prose is retained, not only the native nearby subset. No text or asset approval is issued.',
})

const objects = []
const assertions = []
const coordinates = {}
const point = (id, at) => {
  coordinates[id] = at
  objects.push({ id, type: 'point', at, size: 1, strokeWidth: 1, stroke: 'ink', fill: 'ink' })
  return id
}
const edge = (id, from, to, type = 'segment', stroke = 'ink', strokeWidth = 2.4) => {
  objects.push({ id, type, from, to, stroke, strokeWidth })
  assertions.push({ id: `${id}-connects`, type: 'connects', arrow: id, from, to })
  return id
}
const relation = (id, type, data) => assertions.push({ id, type, ...data })
const displacement = (id, from, to) => {
  const a = coordinates[from]
  const b = coordinates[to]
  relation(id, 'displacement', { from, to, dx: b[0] - a[0], dy: b[1] - a[1] })
}
const label = (id, at, text, fontSize = 20) => objects.push({
  id, type: 'text', at, text, fontSize, fontWeight: 500,
  labelPlacement: { position: 'CENTER' }, labelColor: 'ink',
})
point('outer-left', [40, 205])
point('outer-right', [600, 205])
point('inner-left', [40, 125])
point('inner-right', [600, 125])
point('incident-start', [97, 397])
point('outer-entry', [225, 205])
point('inner-reflection', [257, 125])
point('outer-exit', [289, 205])
point('eye-entry-1', [353, 397])
point('eye-entry-2', [417, 397])

objects.push({
  id: 'film-region', type: 'polygon',
  points: ['outer-left', 'outer-right', 'inner-right', 'inner-left'],
  fill: 'accentSoft', fillOpacity: 0.55, stroke: 'muted', strokeWidth: 1,
})
edge('outer-interface', 'outer-left', 'outer-right', 'segment', 'ink', 2.6)
edge('inner-interface', 'inner-left', 'inner-right', 'segment', 'ink', 2.6)
const hatches = []
for (const [index, x] of [54, 82, 110, 138, 166, 372, 400, 428, 456, 484, 512, 540, 568].entries()) {
  hatches.push(edge(`film-hatch-${index + 1}`, [x, 129], [x + 24, 201], 'segment', 'grid', 1.2))
}
for (const id of ['outer-entry', 'outer-exit']) {
  relation(`${id}-on-outer`, 'pointOnLine', { point: id, a: 'outer-left', b: 'outer-right' })
}
relation('inner-reflection-on-inner', 'pointOnLine', { point: 'inner-reflection', a: 'inner-left', b: 'inner-right' })
relation('parallel-film-interfaces', 'parallel', {
  a: 'outer-left', b: 'outer-right', c: 'inner-left', d: 'inner-right',
})
relation('equal-film-side-thickness', 'equalDistance', {
  a: 'outer-left', b: 'inner-left', c: 'outer-right', d: 'inner-right',
})
displacement('left-film-downward', 'outer-left', 'inner-left')
displacement('right-film-downward', 'outer-right', 'inner-right')
displacement('outer-entry-before-exit', 'outer-entry', 'outer-exit')
displacement('entry-to-inner-reflection', 'outer-entry', 'inner-reflection')
displacement('inner-reflection-to-exit', 'inner-reflection', 'outer-exit')

// Wiggles identify waves, not optical phase; all path pieces have checked endpoints.
const wave = (id, from, to) => {
  const a = coordinates[from]
  const b = coordinates[to]
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const length = Math.hypot(dx, dy)
  const cut = 1 - 25 / length
  const pieces = []
  let previous = from
  const steps = 48
  for (let i = 1; i <= steps; i++) {
    const t = cut * i / steps
    const offset = 3.5 * Math.sin(10 * Math.PI * i / steps) * Math.sin(Math.PI * i / steps)
    const next = [a[0] + dx * t - dy / length * offset, a[1] + dy * t + dx / length * offset]
    pieces.push(edge(`${id}-piece-${i}`, previous, next))
    previous = next
  }
  pieces.push(edge(`${id}-direction`, previous, to, 'arrow', 'ink', 2.4))
  displacement(`${id}-source-endpoint-order`, from, to)
  return pieces
}
const incident = wave('incident-wave', 'incident-start', 'outer-entry')
const wave1 = wave('wave-1', 'outer-entry', 'eye-entry-1')
edge('wave-2-down', 'outer-entry', 'inner-reflection', 'arrow', 'accent', 3)
edge('wave-2-return', 'inner-reflection', 'outer-exit', 'arrow', 'accent', 3)
const wave2 = wave('wave-2', 'outer-exit', 'eye-entry-2')
relation('internal-reflection-symmetric-inclinations', 'equalDistance', {
  a: 'outer-entry', b: 'inner-reflection', c: 'inner-reflection', d: 'outer-exit',
})
relation('outgoing-waves-parallel', 'parallel', {
  a: 'outer-entry', b: 'eye-entry-1', c: 'outer-exit', d: 'eye-entry-2',
})
displacement('distinct-eye-entries', 'eye-entry-1', 'eye-entry-2')
relation('outside-reflection-inclinations', 'equalDistance', {
  a: 'incident-start', b: 'outer-entry', c: 'outer-entry', d: 'eye-entry-1',
})

objects.push({
  id: 'eye-outline', type: 'svgPath',
  d: 'M 330 145 Q 387 107 462 144 Q 420 198 330 145 Z',
  fill: 'paper', fillOpacity: 0, stroke: 'ink', strokeWidth: 2.6,
})
objects.push({
  id: 'eye-iris', type: 'circle', center: [394, 412], radius: 16,
  fill: 'muted', fillOpacity: 0.18, stroke: 'ink', strokeWidth: 2,
})
const lashes = [
  [[342, 422], [336, 435]], [[361, 431], [357, 446]],
  [[382, 436], [382, 450]], [[405, 437], [409, 450]],
  [[428, 431], [435, 444]], [[450, 422], [460, 432]],
].map(([from, to], i) => edge(`eye-lash-${i + 1}`, from, to, 'segment', 'ink', 1.7))

label('incident-label', [89, 297], 'Incident light')
label('wave-1-label', [232, 335], 'Wave 1', 22)
label('wave-2-label', [391, 281], 'Wave 2', 22)
label('eye-label', [516, 415], 'Eye')
label('air-label', [65, 488], 'Air')
label('film-label', [490, 164], 'Oil film')
label('water-label', [490, 78], 'Water')
label('outer-surface-label', [492, 235], 'Outer surface')
label('inner-surface-label', [492, 102], 'Inner surface')
label('schematic-note', [320, 30], 'Schematic paths; not a phase or distance scale.', 18)

const byAssertionPrefix = prefix => assertions.filter(a => a.id.startsWith(prefix)).map(a => a.id)
const group = (id, description, mappedObjects, mappedAssertions, relational = true) => ({
  id, description, objects: mappedObjects, assertions: mappedAssertions,
  ...(relational ? { requires: ['pointRelationships'] } : {}),
})
const inventory = [
  group('source-film', 'Original single thin hatched band with distinct outer and inner boundaries. Flat parallel boundaries and locally cleared light hatching are modern regularization, not a source grid or a measured thickness.',
    ['outer-left', 'outer-right', 'inner-left', 'inner-right', 'film-region', 'outer-interface', 'inner-interface', ...hatches],
    ['outer-interface-connects', 'inner-interface-connects', 'parallel-film-interfaces',
      'equal-film-side-thickness', 'left-film-downward', 'right-film-downward', ...byAssertionPrefix('film-hatch-')]),
  group('source-incident', 'Unnumbered incoming wavy path from upper left to the same outer-surface junction that starts wave 1. Direction arrow is a modern addition.',
    ['incident-start', 'outer-entry', ...incident],
    [...byAssertionPrefix('incident-wave-')]),
  group('source-wave-1', 'Original left outgoing wavy path numbered 1, reflected at the outer surface and directed toward the eye; no phase or wavelength scale.',
    ['outer-entry', 'eye-entry-1', ...wave1, 'wave-1-label'],
    [...byAssertionPrefix('wave-1-')]),
  group('source-wave-2', 'Original right outgoing wavy path numbered 2. The internal scan detail is partly obscured by hatch; complete authoritative prose supplies entry refraction, inner reflection and exit refraction. The modern enlarged V exposes this topology without inventing refractive indices or interference conditions.',
    ['outer-entry', 'inner-reflection', 'outer-exit', 'eye-entry-2', 'outer-left', 'outer-right', 'inner-left', 'inner-right',
      'wave-2-down', 'wave-2-return', ...wave2, 'wave-2-label'],
    ['outer-entry-on-outer', 'outer-exit-on-outer', 'inner-reflection-on-inner',
      'outer-interface-connects', 'inner-interface-connects', 'entry-to-inner-reflection',
      'inner-reflection-to-exit', 'outer-entry-before-exit', 'internal-reflection-symmetric-inclinations',
      ...byAssertionPrefix('wave-2-')]),
  group('source-eye-and-outgoing-direction', 'Original one eye in the upper-right region, approached by both distinct outgoing paths. No shared focused point or retinal claim is inferred. Schematic parallel output and exact layout coordinates are modern regularization.',
    ['outer-entry', 'outer-exit', 'eye-entry-1', 'eye-entry-2', 'eye-outline', 'eye-iris', ...lashes],
    ['outgoing-waves-parallel', 'distinct-eye-entries', ...byAssertionPrefix('eye-lash-')]),
  group('source-reflection-branch', 'The incident wave and wave 1 share the outer entry point; wave 2 branches there and returns to a separate exit after inner reflection. Exact inclinations regularize an unmeasured scan.',
    ['incident-start', 'outer-entry', 'inner-reflection', 'outer-exit', 'eye-entry-1'],
    ['outside-reflection-inclinations', 'entry-to-inner-reflection', 'inner-reflection-to-exit', 'outer-entry-before-exit']),
  group('modern-additions-and-limits', 'Original printed labels are only 1 and 2. English medium/surface/eye/incident labels, direction arrows, tiny junction dots and schematic note are modern additions. No printed n, angle, thickness, wavelength, total phase, bright/dark rule or point letters are invented.',
    ['incident-label', 'wave-1-label', 'wave-2-label', 'eye-label', 'air-label', 'film-label', 'water-label', 'outer-surface-label', 'inner-surface-label', 'schematic-note'],
    [], false),
]
const spec = {
  schema: 'ld-s10y-image/figure-spec@2', id: 'fig-198', mode: 'deterministic',
  description: 'Thin oil-film interference path schematic: wave 1 reflects at the outer interface; wave 2 refracts into the film, reflects at its inner interface and emerges toward the eye. Numbered waves and the two-surface film are retained. Layout and drawn wiggles are not optical phase, wavelength or physical distance measurements. Total-phase and reflection conditions belong to the current complete bilingual text, not a geometric bright/dark claim in this image.',
  source: { image: sourceImage, authoritativeText, inventory },
  canvas: { width: 640, height: 560, boundingBox: [0, 560, 640, 0], background: 'paper', keepAspectRatio: true },
  display: { purpose: 'instructional', layout: 'scroll', minTextPx: 16, widths: [640] },
  objects, assertions, layout: { minLabelGap: 3 },
}
write('fig-198.first.spec.json', spec)
write('inventory-mapping.json', {
  sourceObservation: { path: inputs.observation, sha256: hash(inputs.observation) },
  sourceImage, mappedGroups: inventory,
  modernAdditionsAndLimits: read(inputs.observation).modernAdditionsAndLimits,
  assertionCount: assertions.length, objectCount: objects.length,
  independentReview: false, approval: 'none',
})
write('author-freeze.json', {
  status: 'FIRST-AUTHOR-FROZEN-NATIVE-PENDING', ticket: 'STEMROBIN-181/181-3', card,
  spec: { path: `${own}/fig-198.first.spec.json`, sha256: hash(`${own}/fig-198.first.spec.json`) },
  authoritativeTextBlocks: authoritativeText.length,
  imageOpens: 1, paidCalls: 0, paidUSD: 0, authorRepairs: 0,
  independentReview: false, wholeCardApproved: false, promoted: false,
})
console.log(JSON.stringify({ spec: `${own}/fig-198.first.spec.json`, objects: objects.length, assertions: assertions.length, completeBilingualTextBlocks: authoritativeText.length, nativeContextBuilds: 2 }))
