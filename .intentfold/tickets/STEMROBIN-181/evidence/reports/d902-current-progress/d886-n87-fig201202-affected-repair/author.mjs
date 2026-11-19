import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const R = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const T = path.join(R, '.intentfold/tickets/STEMROBIN-181')
const D = path.join(T, 'tmp/d886-n87-fig201202-affected-repair')
const A = path.join(T, 'tmp/d848-n87-fig201202-first-author')
const V = path.join(T, 'tmp/d877-n87-fig201202-first-independent-review')
const P = path.join(T, 'tmp/d873-n87-text-affected-review')
const card = 'phy10-c2-s3-n87'
const load = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const info = file => ({ path: file, sha256: hash(file), bytes: fs.statSync(file).size })
function target(name) {
  const file = path.resolve(D, name)
  assert.ok(file.startsWith(`${D}/`))
  fs.mkdirSync(path.dirname(file), { recursive: true })
  return file
}
function write(name, data) {
  const file = target(name)
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' })
  return file
}
function copy(source, name) {
  const file = target(name)
  fs.copyFileSync(source, file, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(file), hash(source))
  return { original: info(source), copy: info(file) }
}
function files(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(dir, entry.name)
    return entry.isDirectory() ? files(file) : entry.isFile() ? [file] : []
  })
}
function diff(before, after, name) {
  const result = spawnSync('diff', ['-u', before, after], { cwd: R, encoding: 'utf8' })
  assert.ok(result.status === 0 || result.status === 1)
  fs.writeFileSync(target(name), result.stdout, { flag: 'wx' })
}
function delta(a, b, pointer = '') {
  if (JSON.stringify(a) === JSON.stringify(b)) return []
  if (a && b && typeof a === 'object' && typeof b === 'object'
      && Array.isArray(a) === Array.isArray(b)) {
    return [...new Set([...Object.keys(a), ...Object.keys(b)])].flatMap(key =>
      delta(a[key], b[key], `${pointer}/${key.replaceAll('~', '~0').replaceAll('/', '~1')}`))
  }
  return [{ pointer, before: a ?? null, after: b ?? null }]
}
function native(command, args, name) {
  const result = spawnSync(command, args, {
    cwd: R, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024,
    env: { ...process.env, TMPDIR: target('runtime-tmp/') },
  })
  write(`calls/${name}.json`, {
    command, args, cwd: R, exitCode: result.status,
    stdout: result.stdout, stderr: result.stderr, error: result.error?.message ?? null,
  })
  console.log(`${name}: exit ${result.status}`)
  assert.equal(result.status, 0, result.stdout || result.stderr)
}

// Snapshot only the named historical inputs; no Git or global ticket accounting.
const protectedRoots = [A, V, P, path.join(T, 'tmp/d858-n87-text-first-repair')]
write('protected-inputs-before.json', protectedRoots.flatMap(root => files(root).map(info)))
const boundInputs = []
for (const [root, name, names] of [
  [A, 'd848', ['author-report.json', 'frozen-artifacts.json', 'source-inventory/fig-202.FIRST.json']],
  [V, 'd877', ['report.json', 'report.md', 'independent-findings-FIRST.json']],
  [P, 'd873', ['report.json', 'input-bindings.json']],
]) {
  for (const file of names) boundInputs.push(copy(path.join(root, file), `inputs/${name}/${file}`))
}
const review = load(path.join(V, 'report.json'))
const textPass = load(path.join(P, 'report.json'))
assert.equal(textPass.verdicts.overall, 'PASS')
assert.equal(review.figures.find(f => f.figure === 'fig-201').substantiveStatus, 'PASS')

const authoritativeText = []
const textBindings = []
for (const locale of ['zh', 'en']) {
  for (const kind of ['lesson', 'exercises']) {
    const entry = textPass.currentCandidates.find(c => c.locale === locale && c.kind === kind)
    assert.equal(hash(entry.path), entry.sha256, `d873 binding drift: ${entry.path}`)
    const binding = copy(entry.path, `inputs/d858/${locale}/${kind}.template.json`)
    textBindings.push({ locale, kind, ...binding, expectedSha256: entry.sha256 })
    const data = load(binding.copy.path)
    for (const block of kind === 'lesson' ? data.prose : data.exercises) {
      if (!block.text?.trim()) continue
      authoritativeText.push({
        lesson: card,
        ...(kind === 'exercises' ? { exercise: `${locale}:${block.number}` } : {}),
        text: `[${locale}; ${kind}; source refs ${(block.source_refs || block.pages || []).join(',')}] ${block.text}`,
      })
    }
  }
}
write('current-authoritative-text.json', {
  schema: 'd886/authoritative-text-binding@1',
  approval: info(path.join(P, 'report.json')), candidates: textBindings, authoritativeText,
  scope: 'Complete bilingual modern prose and six original tasks; no source_text or answer substitution.',
})
write('source-inventory-202-AFFECTED.json', {
  schema: 'd886/affected-author-source-observation@1',
  image: info(path.join(R, 'ssot-resources/soviet10year-textbooks/artifacts/10p/figures/fig-202.png')),
  inspection: { contextImageLoad: 1, batch: 1, originalReopens: 1, crops: 0 },
  pixelFacts: [
    'One schematic, two horizontal interfaces, unhatched middle film, outlined glass below with paired diagonal material hatches; air above.',
    'Left interface extensions and opposing vertical arrows bound film thickness h only.',
    'Right indices identify air, film and glass; no numerical index, angle or scale is printed.',
    'Incident path descends from air to upper interface; outgoing 1 starts there. Film continuation reaches lower interface; 2 returns through upper interface and emerges beside 1.',
    'Downward transmission continues from the same lower interaction and ends inside glass.',
    'Source ray paths are separated and visibly slanted, without an angle value. No named visible interaction points, formula, phase, intensity or cancellation result is drawn.',
  ],
  currentTextModel: 'd858 /prose/8 and /prose/11 explicitly require normal incidence; approved by d873 with its original limits.',
  deliberateModernChange: 'Replace source visual path separation with one genuinely coincident perpendicular path. Preserve graph branches and numbered reflection identities, not a fabricated source angle. English title and explanation visibly declare the convention.',
  originalFactsUnchanged: true,
  priorInventory: info(path.join(A, 'source-inventory/fig-202.FIRST.json')),
})

const originals = new Map()
for (const id of ['fig-201', 'fig-202']) {
  const before = path.join(A, 'figures', id, 'repair-2/spec.json')
  const authorEntry = load(path.join(A, 'author-report.json')).figures.find(f => f.figure === id)
  assert.equal(hash(before), authorEntry.finalCandidate.spec.sha256)
  boundInputs.push(copy(before, `before/${id}/spec.json`))
  for (const ext of ['svg', 'render.json']) {
    const original = path.join(A, 'figures', id, 'repair-2', `${id}.${ext}`)
    assert.equal(hash(original), authorEntry.finalCandidate[ext === 'svg' ? 'svg' : 'render'].sha256)
    boundInputs.push(copy(original, `before/${id}/${id}.${ext}`))
  }
  const spec = load(before)
  assert.equal(hash(path.join(R, spec.source.image.path)), spec.source.image.sha256)
  originals.set(id, spec)
}
boundInputs.push(copy(path.join(R, originals.get('fig-202').source.image.path), 'inputs/source/fig-202.png'))
write('input-bindings.json', { inputs: boundInputs, currentText: textBindings })

for (const id of ['fig-201', 'fig-202']) {
  const rebound = structuredClone(originals.get(id))
  rebound.source.authoritativeText = authoritativeText
  write(`metadata-rebound/${id}.spec.json`, rebound)
  diff(path.join(D, 'before', id, 'spec.json'), path.join(D, 'metadata-rebound', `${id}.spec.json`), `diffs/${id}.metadata.diff`)
}
const spec201 = load(path.join(D, 'metadata-rebound/fig-201.spec.json'))
write('figures/fig-201/spec.json', spec201)
boundInputs.push(copy(path.join(A, 'figures/fig-201/repair-2/fig-201.svg'), 'figures/fig-201/fig-201.svg'))
boundInputs.push(copy(path.join(A, 'figures/fig-201/repair-2/fig-201.render.json'), 'figures/fig-201/prior-render.reused.json'))
assert.deepEqual(
  { ...spec201, source: { ...spec201.source, authoritativeText: null } },
  { ...originals.get('fig-201'), source: { ...originals.get('fig-201').source, authoritativeText: null } },
)
write('figures/fig-201/reuse-receipt.json', {
  status: 'METADATA-ONLY-AUTHOR-PASS; PRIOR-GEOMETRY-PASS-REUSED',
  currentSpec: info(path.join(D, 'figures/fig-201/spec.json')),
  identicalSvg: info(path.join(D, 'figures/fig-201/fig-201.svg')),
  priorRender: info(path.join(D, 'figures/fig-201/prior-render.reused.json')),
  priorIndependentPass: { ...info(path.join(V, 'report.json')), pointer: '/figures/0' },
  onlyChangedField: '/source/authoritativeText',
  objectsAssertionsCanvasDisplayLayoutInventoryByteProjectionUnchanged: true,
  renderCalls: 0, nativeValidationCalls: 0, imageLoads: 0, sourceReadabilityReviewReplay: false,
  limitation: 'Copied historical render remains bound to historical spec. This receipt establishes metadata-only reuse, not a fabricated fresh render or independent approval of the current spec.',
})

const spec = load(path.join(D, 'metadata-rebound/fig-202.spec.json'))
spec.description = 'Thin-film apparatus at normal incidence, with all optical legs truly coincident on one perpendicular line. Distinct numbered upward arrowheads identify upper reflection 1 and lower reflection 2; the lower reflection returns through the film, and transmission continues into glass. Visible English explanation states that all rays share one line. Source separated-path topology is preserved, but its unmeasured slant is not copied into this approved normal-incidence model. No phase, intensity, formula or cancellation outcome is encoded.'
spec.canvas.height = 520
spec.canvas.boundingBox = [0, 460, 640, -60]
const object = id => {
  const result = spec.objects.find(o => o.id === id)
  assert.ok(result, id)
  return result
}
for (const id of ['incident-start', 'upper-hit', 'lower-hit', 'return-upper', 'reflected-1-end', 'reflected-2-end', 'transmitted-end']) {
  object(id).at[0] = 275
}
object('reflected-2-end').at[1] = 305
object('reflected-1-label').at = [330, 355]
object('reflected-2-label').at = [330, 305]
const text = (id, at, value) => ({
  id, type: 'text', at, text: value, fontSize: 32, fontWeight: 500,
  labelColor: 'ink', labelPlacement: { position: 'CENTER' },
})
spec.objects.push(
  text('normal-incidence-label', [320, 420], 'Normal incidence'),
  text('shared-path-label', [320, -25], 'All rays share one line.'),
  text('incident-label', [170, 285], 'Incident'),
)
// The graph retains distinct contributions even where physical paths coincide.
for (const assertion of spec.assertions.filter(a => a.type === 'displacement')) {
  const from = object(assertion.from).at
  const to = object(assertion.to).at
  assertion.dx = to[0] - from[0]
  assertion.dy = to[1] - from[1]
}
spec.assertions.find(a => a.id === 'reflected-path-order').id = 'reflected-shared-line'
for (const group of spec.source.inventory) {
  group.assertions = group.assertions.map(id => id === 'reflected-path-order' ? 'reflected-shared-line' : id)
}
const normals = [
  ['incident', 'incident-start', 'upper-hit', 'upper-left', 'upper-right'],
  ['reflected-1', 'upper-hit', 'reflected-1-end', 'upper-left', 'upper-right'],
  ['film-forward', 'upper-hit', 'lower-hit', 'upper-left', 'upper-right'],
  ['film-return', 'lower-hit', 'return-upper', 'lower-left', 'lower-right'],
  ['reflected-2', 'return-upper', 'reflected-2-end', 'upper-left', 'upper-right'],
  ['transmission', 'lower-hit', 'transmitted-end', 'lower-left', 'lower-right'],
]
spec.assertions.push(...normals.map(([id, a, b, c, d]) => ({
  id: `${id}-normal`, type: 'perpendicular', a, b, c, d,
})), {
  id: 'return-rejoins-upper-hit', type: 'displacement',
  from: 'upper-hit', to: 'return-upper', dx: 0, dy: 0,
}, {
  id: 'film-forward-equals-thickness', type: 'equalDistance',
  a: 'upper-hit', b: 'lower-hit', c: 'thickness-upper', d: 'thickness-lower',
}, {
  id: 'film-return-equals-thickness', type: 'equalDistance',
  a: 'lower-hit', b: 'return-upper', c: 'thickness-upper', d: 'thickness-lower',
})
const additions = spec.source.inventory.find(g => g.id === 'fig-202-modern-additions')
additions.description = 'NOT source-pixel facts. English medium subscripts, Normal incidence, Incident, and All rays share one line. Deliberately collapse the source unmeasured visual separation onto one true perpendicular normal-incidence line, as required by approved d858 text. Different air arrowhead heights and label sides separate identities 1 and 2 without separating the physical paths; these positions are annotation layout, not measured source distances. Preserve both reflection branches, the film forward/return legs, h, and transmission from the same lower interaction. Added perpendicular, coincidence and film-length assertions execute this modern model. Straightened interfaces, enlarged unscaled film, hidden vertices, regularized paired glass hatching and global segment-count diagnostic remain author conventions, not source data. No numerical angle, index, phase, intensity, formula or result is invented.'
additions.objects = ['normal-incidence-label', 'shared-path-label', 'incident-label']
additions.assertions.push(...normals.map(([id]) => `${id}-normal`),
  'return-rejoins-upper-hit', 'film-forward-equals-thickness', 'film-return-equals-thickness')
write('figures/fig-202/spec.json', spec)
diff(path.join(D, 'metadata-rebound/fig-202.spec.json'), path.join(D, 'figures/fig-202/spec.json'), 'diffs/fig-202.geometry-and-visible-explanation.diff')
diff(path.join(D, 'before/fig-202/spec.json'), path.join(D, 'figures/fig-202/spec.json'), 'diffs/fig-202.complete.diff')
write('changed-fields.json', {
  fig201: delta(originals.get('fig-201'), spec201),
  fig202Metadata: delta(originals.get('fig-202'), load(path.join(D, 'metadata-rebound/fig-202.spec.json'))),
  fig202Depiction: delta(load(path.join(D, 'metadata-rebound/fig-202.spec.json')), spec),
})
write('repair-mapping.json', {
  metadataRepairs: ['d877-201-C01', 'd877-202-C01'],
  depictionRepair: 'd877-202-G01',
  sourceOriginalObservationsPreserved: true,
  modernGeometryAssertions: additions.assertions,
  physicalPath: normals.map(([id, from, to]) => ({ id, from, to, x: 275 })),
  unchangedSourceLayersThicknessHatchesAndTransmissionTopology: true,
  visibleExplanation: additions.objects,
  graphBranches: [
    ['incident-ray', 'reflected-1'],
    ['incident-ray', 'film-forward', 'film-return', 'reflected-2'],
    ['incident-ray', 'film-forward', 'transmitted-ray'],
  ],
  interpretation: 'One physical normal line, distinct contributions and arrowhead annotations; no changed lesson model or invented source angle/data.',
})

fs.mkdirSync(target('runtime-tmp'), { recursive: true })
native('python3', ['.agents/skills/ld-s10y-image/scripts/validate_spec.py',
  path.join(D, 'figures/fig-202/spec.json'), '--stage', 'draft', '--json'], 'fig-202-validation-FIRST')
native('node', ['.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
  '--spec', path.join(D, 'figures/fig-202/spec.json'),
  '--svg', path.join(D, 'figures/fig-202/fig-202.svg'),
  '--report', path.join(D, 'figures/fig-202/fig-202.render.json')], 'fig-202-render-FIRST')
assert.equal(load(path.join(D, 'figures/fig-202/fig-202.render.json')).status, 'pass')
console.log('Affected author preparation and single fig202 native render complete; display inspection and freeze remain.')
