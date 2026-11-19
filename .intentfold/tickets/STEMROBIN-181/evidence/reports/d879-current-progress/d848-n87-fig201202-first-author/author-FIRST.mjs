import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'

const R = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const T = path.join(R, '.intentfold/tickets/STEMROBIN-181')
const D = path.join(T, 'tmp/d848-n87-fig201202-first-author')
const candidate = path.join(T, 'tmp/d837-n87-first-bilingual-text-author/candidate')
const card = 'phy10-c2-s3-n87'
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const load = file => JSON.parse(fs.readFileSync(file, 'utf8'))
function write(name, value) {
  const target = path.resolve(D, name)
  if (!target.startsWith(`${D}/`)) throw new Error('Output escaped bounded directory')
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
  return target
}
function freeze(file) { fs.chmodSync(file, 0o444) }
function native(command, args, name) {
  const result = spawnSync(command, args, {
    cwd: R, encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  })
  const receipt = write(`calls/${name}.json`, {
    command, args, cwd: R, exitCode: result.status,
    stdout: result.stdout, stderr: result.stderr,
  })
  freeze(receipt)
  if (result.status !== 0) throw new Error(`Native stage failed: ${name}; see ${receipt}`)
}

const preparations = [
  path.join(T, 'tmp/d836-source233-consume-n87-prepare/n87-preparation.json'),
  path.join(T, 'tmp/d836-source233-consume-n87-prepare/n87-preauthor-source-requirements.json'),
]
const exactInputs = []
const contexts = []
const authoritativeText = []
for (const locale of ['zh', 'en']) {
  const root = path.join(D, 'context-root', locale)
  const lessonDir = path.join(root, '10p/editions/modern-us-neutral/lessons', card)
  const figureDir = path.join(root, '10p/figures')
  fs.mkdirSync(lessonDir, { recursive: true })
  fs.mkdirSync(figureDir, { recursive: true })
  for (const kind of ['lesson', 'exercises']) {
    const input = path.join(candidate, locale, `${kind}.template.json`)
    const output = path.join(lessonDir, `${kind}.json`)
    fs.copyFileSync(input, output, fs.constants.COPYFILE_EXCL)
    freeze(output)
    if (hash(input) !== hash(output)) throw new Error('Projection bytes differ')
    const data = load(input)
    exactInputs.push({ locale, kind, path: input, sha256: hash(input), projection: output })
    const blocks = kind === 'lesson' ? data.prose : data.exercises
    for (const block of blocks) {
      if (!block.text?.trim()) continue
      authoritativeText.push({
        lesson: card,
        ...(kind === 'exercises' ? { exercise: `${locale}:${block.number}` } : {}),
        text: `[${locale}; ${kind}; source refs ${(block.source_refs || block.pages || []).join(',')}] ${block.text}`,
      })
    }
  }
  for (const id of ['fig-201', 'fig-202']) {
    fs.symlinkSync(path.join(R, 'ssot-resources/soviet10year-textbooks/artifacts/10p/figures', `${id}.png`), path.join(figureDir, `${id}.png`))
    const output = path.join(D, 'context', `${id}.${locale}.native.json`)
    native('python3', [
      '.agents/skills/ld-s10y-image/scripts/build_context.py',
      '--book', '10p', '--edition', 'modern-us-neutral', '--figure', id,
      '--root', root, '--output', output,
    ], `context-${id}-${locale}`)
    freeze(output)
    contexts.push({ figure: id, locale, path: output, sha256: hash(output) })
  }
}
const inventoryFiles = ['fig-201', 'fig-202'].map(id => {
  const file = path.join(D, 'source-inventory', `${id}.FIRST.json`)
  freeze(file)
  return { figure: id, path: file, sha256: hash(file) }
})
const fullContext = write('context/full-bilingual.FIRST.json', {
  schema: 'd848/full-bilingual-context@1', ticket: 'STEMROBIN-181', card,
  rule: 'Exact current full bilingual candidate is authoritative input for figure authoring, not independently approved text.',
  textReview: 'PENDING; no text approval or independent figure review is claimed',
  sourceClosedPreparation: preparations.map(file => ({ path: file, sha256: hash(file), data: load(file) })),
  inputs: exactInputs.map(input => ({ ...input, data: load(input.path) })),
  nativeContexts: contexts, sourceInventories: inventoryFiles, authoritativeText,
  exerciseFigureReferenceFinding: 'All six written tasks in both locales have empty figure_refs and figures. Exercise-width checks are preventive display-contract probes, not newly authored exercise associations.',
})
freeze(fullContext)

const point = (id, at) => ({ id, type: 'point', at, visible: false })
const segment = (id, from, to, extra = {}) => ({ id, type: 'segment', from, to, stroke: 'ink', strokeWidth: 3, ...extra })
const arrow = (id, from, to) => ({ id, type: 'arrow', from, to, stroke: 'ink', strokeWidth: 3 })
const polygon = (id, points, extra = {}) => ({ id, type: 'polygon', points, stroke: 'ink', strokeWidth: 3, fill: 'paper', fillOpacity: 1, ...extra })
const text = (id, at, label) => ({
  id, type: 'text', at, text: label, fontSize: 32, fontWeight: 500,
  labelColor: 'ink', labelPlacement: { position: 'CENTER' },
})
const connects = (id, edge, from, to) => ({ id, type: 'connects', arrow: edge, from, to })
const displacement = (id, from, to, dx, dy) => ({ id, type: 'displacement', from, to, dx, dy })
const relation = (id, type, a, b, c, d) => ({ id, type, a, b, c, ...(d ? { d } : {}) })
const onLine = (id, p, a, b) => ({ id, type: 'pointOnLine', point: p, a, b })

function spec(id, description, objects, assertions, extraMaps = {}) {
  const inventory = load(path.join(D, 'source-inventory', `${id}.FIRST.json`))
  const definitions = new Map(objects.map(obj => [obj.id, obj]))
  const byAssertion = new Map(assertions.map(a => [a.id, a]))
  const groups = inventory.facts.map(fact => {
    const mappedObjects = [...fact.objects, ...(extraMaps[fact.id]?.objects || [])]
    const mappedAssertions = [...fact.assertions, ...(extraMaps[fact.id]?.assertions || [])]
    for (const objectId of mappedObjects) if (!definitions.has(objectId)) throw new Error(`Unrealized source object ${objectId}`)
    for (const assertionId of mappedAssertions) if (!byAssertion.has(assertionId)) throw new Error(`Unrealized source assertion ${assertionId}`)
    // Source pixels have no visible point markers. Only rendered structures belong
    // in the native inventory; hidden construction endpoints remain assertion-addressable.
    return {
      id: fact.id, description: fact.observation,
      objects: mappedObjects.filter(objectId => definitions.get(objectId).visible !== false),
      assertions: mappedAssertions,
    }
  })
  groups.push({
    id: `${id}-modern-additions`,
    description: `NOT source-pixel facts. ${inventory.plannedModernAdditions.join(' ')}`,
    objects: objects.filter(obj => obj.type === 'text' && !groups.some(group => group.objects.includes(obj.id))).map(obj => obj.id),
    assertions: [],
  })
  const result = {
    schema: 'ld-s10y-image/figure-spec@2', id, mode: 'deterministic', description,
    source: { image: inventory.source, authoritativeText, inventory: groups },
    canvas: { width: 640, height: id === 'fig-201' ? 320 : 400, boundingBox: [0, id === 'fig-201' ? 320 : 400, 640, 0], background: 'paper', keepAspectRatio: true },
    display: { layout: 'inline', purpose: 'instructional', minTextPx: 16, widths: [331, 342, 640], maxWidthPx: 640 },
    objects, assertions, layout: { minLabelGap: 8 },
  }
  const output = write(`figures/${id}/FIRST/spec.json`, result)
  freeze(output)
  console.log(`${id} FIRST spec ${hash(output)}`)
}

const left = 85, right = 570, rise = 130
const testY = x => 125 + (x - left) * rise / (right - left)
const o201 = [
  point('reference-left-top', [60, 125]), point('reference-right-top', [600, 125]),
  point('reference-right-bottom', [600, 103]), point('reference-left-bottom', [60, 103]),
  point('test-left-bottom', [85, 125]), point('test-right-bottom', [570, 255]),
  point('test-right-top', [570, 273]), point('test-left-top', [85, 143]),
  point('spacer-left-bottom', [500, 125]), point('spacer-right-bottom', [570, 125]),
  point('spacer-right-top', [570, 255]), point('spacer-left-top', [500, testY(500)]),
  polygon('reference-plate', ['reference-left-top', 'reference-right-top', 'reference-right-bottom', 'reference-left-bottom']),
  segment('reference-top', 'reference-left-top', 'reference-right-top'),
  segment('reference-bottom', 'reference-left-bottom', 'reference-right-bottom'),
  polygon('spacer', ['spacer-left-bottom', 'spacer-right-bottom', 'spacer-right-top', 'spacer-left-top'], { fill: 'accentSoft', fillOpacity: 0.2 }),
  segment('spacer-base', 'spacer-left-bottom', 'spacer-right-bottom'),
  segment('spacer-top', 'spacer-left-top', 'spacer-right-top'),
  ...Array.from({ length: 6 }, (_, i) => segment(`spacer-hatch-${i + 1}`, [504 + i * 10, 132], [514 + i * 10, 156], { strokeWidth: 2 })),
  polygon('test-plate', ['test-left-bottom', 'test-right-bottom', 'test-right-top', 'test-left-top']),
  segment('test-bottom', 'test-left-bottom', 'test-right-bottom'),
  segment('test-top', 'test-left-top', 'test-right-top'),
  text('test-surface-label', [280, 298], 'Test surface'),
  text('air-wedge-label', [390, 162], 'Air wedge'),
  text('reference-plate-label', [300, 60], 'Reference plate'),
]
const a201 = [
  connects('reference-top-connects', 'reference-top', 'reference-left-top', 'reference-right-top'),
  connects('reference-bottom-connects', 'reference-bottom', 'reference-left-bottom', 'reference-right-bottom'),
  relation('reference-parallel', 'parallel', 'reference-left-top', 'reference-right-top', 'reference-left-bottom', 'reference-right-bottom'),
  displacement('reference-left-depth', 'reference-left-bottom', 'reference-left-top', 0, 22),
  displacement('reference-right-depth', 'reference-right-bottom', 'reference-right-top', 0, 22),
  connects('test-bottom-connects', 'test-bottom', 'test-left-bottom', 'test-right-bottom'),
  connects('test-top-connects', 'test-top', 'test-left-top', 'test-right-top'),
  relation('test-parallel', 'parallel', 'test-left-bottom', 'test-right-bottom', 'test-left-top', 'test-right-top'),
  displacement('test-left-depth', 'test-left-bottom', 'test-left-top', 0, 18),
  displacement('test-right-depth', 'test-right-bottom', 'test-right-top', 0, 18),
  displacement('left-contact', 'reference-left-top', 'test-left-bottom', 25, 0),
  displacement('wedge-rise', 'test-left-bottom', 'test-right-bottom', 485, 130),
  connects('spacer-base-connects', 'spacer-base', 'spacer-left-bottom', 'spacer-right-bottom'),
  connects('spacer-top-connects', 'spacer-top', 'spacer-left-top', 'spacer-right-top'),
  onLine('spacer-base-on-reference', 'spacer-left-bottom', 'reference-left-top', 'reference-right-top'),
  onLine('spacer-top-on-test', 'spacer-left-top', 'test-left-bottom', 'test-right-bottom'),
  onLine('spacer-right-on-test', 'spacer-right-top', 'test-left-bottom', 'test-right-bottom'),
  onLine('spacer-right-on-reference', 'spacer-right-bottom', 'reference-left-top', 'reference-right-top'),
  displacement('spacer-bottom-span', 'spacer-left-bottom', 'spacer-right-bottom', 70, 0),
  displacement('spacer-top-span', 'spacer-left-top', 'spacer-right-top', 70, 70 * rise / 485),
  { id: 'spacer-hatch-count', type: 'objectCount', objectType: 'segment', ids: Array.from({ length: 6 }, (_, i) => `spacer-hatch-${i + 1}`), value: 6 },
]
spec('fig-201', 'Surface-inspection apparatus: a tested plate above a reference plane, with an air wedge that widens to a right-hand spacer. Geometry is a nonmetric legibility schematic. No fringes or ray paths are present in the source and none are invented.', o201, a201)

const o202 = [
  point('upper-left', [100, 225]), point('upper-right', [440, 225]),
  point('lower-left', [100, 145]), point('lower-right', [440, 145]),
  point('glass-bottom-left', [100, 40]), point('glass-bottom-right', [440, 40]),
  point('thickness-upper', [65, 225]), point('thickness-lower', [65, 145]),
  point('incident-start', [259, 353]), point('upper-hit', [275, 225]),
  point('lower-hit', [285, 145]), point('return-upper', [301, 225]),
  point('reflected-1-end', [301, 355]), point('reflected-2-end', [327, 355]),
  point('transmitted-end', [285, 60]),
  segment('upper-interface', 'upper-left', 'upper-right'),
  segment('lower-interface', 'lower-left', 'lower-right'),
  segment('glass-left', 'lower-left', 'glass-bottom-left'),
  segment('glass-right', 'upper-right', 'glass-bottom-right'),
  segment('glass-base', 'glass-bottom-left', 'glass-bottom-right'),
  ...Array.from({ length: 8 }, (_, i) => {
    const x = 140 + (i % 4) * 80
    const y = i < 4 ? 107 : 65
    return segment(`glass-hatch-${i + 1}`, [x - 8, y - 9], [x + 2, y + 9], { strokeWidth: 2 })
  }),
  ...Array.from({ length: 8 }, (_, i) => {
    const x = 140 + (i % 4) * 80
    const y = i < 4 ? 107 : 65
    return segment(`glass-pair-${i + 1}`, [x - 2, y - 9], [x + 8, y + 9], { strokeWidth: 2 })
  }),
  segment('thickness-upper-extension', [48, 225], [100, 225], { strokeWidth: 2 }),
  segment('thickness-lower-extension', [48, 145], [100, 145], { strokeWidth: 2 }),
  arrow('film-thickness', 'thickness-upper', 'thickness-lower'),
  arrow('film-thickness-up', 'thickness-lower', 'thickness-upper'),
  text('thickness-label', [30, 185], 'h'),
  arrow('incident-ray', 'incident-start', 'upper-hit'),
  arrow('reflected-1', 'upper-hit', 'reflected-1-end'),
  segment('film-forward', 'upper-hit', 'lower-hit'),
  segment('film-return', 'lower-hit', 'return-upper'),
  arrow('reflected-2', 'return-upper', 'reflected-2-end'),
  arrow('transmitted-ray', 'lower-hit', 'transmitted-end'),
  text('reflected-1-label', [295, 382], '1'),
  text('reflected-2-label', [353, 355], '2'),
  text('air-label', [526, 280], 'n_air'),
  text('film-label', [526, 185], 'n_film'),
  text('glass-label', [526, 85], 'n_glass'),
]
const a202 = [
  connects('upper-interface-connects', 'upper-interface', 'upper-left', 'upper-right'),
  connects('lower-interface-connects', 'lower-interface', 'lower-left', 'lower-right'),
  relation('interfaces-parallel', 'parallel', 'upper-left', 'upper-right', 'lower-left', 'lower-right'),
  displacement('film-left-depth', 'lower-left', 'upper-left', 0, 80),
  displacement('film-right-depth', 'lower-right', 'upper-right', 0, 80),
  connects('glass-left-connects', 'glass-left', 'lower-left', 'glass-bottom-left'),
  connects('glass-right-connects', 'glass-right', 'upper-right', 'glass-bottom-right'),
  connects('glass-base-connects', 'glass-base', 'glass-bottom-left', 'glass-bottom-right'),
  relation('glass-side-parallel', 'parallel', 'lower-left', 'glass-bottom-left', 'upper-right', 'glass-bottom-right'),
  relation('glass-base-parallel', 'parallel', 'glass-bottom-left', 'glass-bottom-right', 'lower-left', 'lower-right'),
  { id: 'glass-hatch-count', type: 'objectCount', objectType: 'segment', ids: Array.from({ length: 8 }, (_, i) => `glass-hatch-${i + 1}`), value: 8 },
  onLine('thickness-upper-aligned', 'thickness-upper', 'upper-left', 'upper-right'),
  onLine('thickness-lower-aligned', 'thickness-lower', 'lower-left', 'lower-right'),
  relation('thickness-equals-film', 'equalDistance', 'thickness-upper', 'thickness-lower', 'upper-left', 'lower-left'),
  relation('thickness-normal', 'perpendicular', 'thickness-upper', 'thickness-lower', 'upper-left', 'upper-right'),
  connects('thickness-down-connects', 'film-thickness', 'thickness-upper', 'thickness-lower'),
  connects('thickness-up-connects', 'film-thickness-up', 'thickness-lower', 'thickness-upper'),
  connects('incident-connects', 'incident-ray', 'incident-start', 'upper-hit'),
  connects('reflected-1-connects', 'reflected-1', 'upper-hit', 'reflected-1-end'),
  displacement('incident-down', 'incident-start', 'upper-hit', 16, -128),
  displacement('reflected-1-up', 'upper-hit', 'reflected-1-end', 26, 130),
  onLine('upper-hit-on-interface', 'upper-hit', 'upper-left', 'upper-right'),
  onLine('lower-hit-on-interface', 'lower-hit', 'lower-left', 'lower-right'),
  onLine('return-upper-on-interface', 'return-upper', 'upper-left', 'upper-right'),
  connects('film-forward-connects', 'film-forward', 'upper-hit', 'lower-hit'),
  connects('film-return-connects', 'film-return', 'lower-hit', 'return-upper'),
  connects('reflected-2-connects', 'reflected-2', 'return-upper', 'reflected-2-end'),
  displacement('film-forward-down', 'upper-hit', 'lower-hit', 10, -80),
  displacement('film-return-up', 'lower-hit', 'return-upper', 16, 80),
  displacement('reflected-2-up', 'return-upper', 'reflected-2-end', 26, 130),
  relation('return-collinear', 'collinear', 'lower-hit', 'return-upper', 'reflected-2-end'),
  relation('reflections-parallel', 'parallel', 'upper-hit', 'reflected-1-end', 'lower-hit', 'reflected-2-end'),
  displacement('reflected-path-order', 'reflected-1-end', 'reflected-2-end', 26, 0),
  relation('same-incident-path', 'collinear', 'incident-start', 'upper-hit', 'lower-hit'),
  connects('transmission-connects', 'transmitted-ray', 'lower-hit', 'transmitted-end'),
  displacement('transmission-down', 'lower-hit', 'transmitted-end', 0, -85),
]
spec('fig-202', 'Thin-film antireflection apparatus showing air, film and glass, film thickness h, upper reflection 1, lower reflection 2 and transmission. Source-style lateral ray separation is nonmetric, not an oblique-incidence claim; normal incidence, 2h, reflection phase and amplitude conditions remain in the bound bilingual prose. No cancellation outcome is encoded.', o202, a202, {
  '202-media-and-interfaces': { objects: Array.from({ length: 8 }, (_, i) => `glass-pair-${i + 1}`) },
  '202-thickness': { objects: ['film-thickness-up', 'thickness-label'], assertions: ['thickness-down-connects', 'thickness-up-connects'] },
  '202-incident-and-reflected-1': { objects: ['reflected-1-label'] },
  '202-film-path-and-reflected-2': { objects: ['reflected-2-label'] },
})
write('author-input-receipt.FIRST.json', {
  schema: 'd848/author-input-receipt@1', ticket: 'STEMROBIN-181', card,
  batch: 'd848', fullContext: { path: fullContext, sha256: hash(fullContext) },
  sourceInventories: inventoryFiles, nativeContexts: contexts, exactInputs,
  frozenBeforeSpec: true,
  noVisibleSourcePoints: 'No point-labelled source groups occur in either PNG. Native inventory maps visible apparatus/rays; every hidden endpoint is exercised by relationship assertions. Hidden points are omitted from native inventory.objects because its validator explicitly rejects invisible mapped objects. No objectCount substitutes for connectivity.',
  noSourceGrid: 'Material hatching is not a source grid; asserted hatch counts are authored regularization, not measurements.',
  usageSoFar: { imageLoads: 2, crops: 0, reopens: 0, paidCalls: 0, specAuthorRounds: { 'fig-201': 1, 'fig-202': 1 } },
})
