import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const owned = path.dirname(fileURLToPath(import.meta.url))
const bind = p => ({
  path: p,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'),
})
const write = (file, value) => {
  const p = path.join(owned, file)
  assert(!fs.existsSync(p), `Preserve ${p}`)
  fs.writeFileSync(p, `${JSON.stringify(value, null, 2)}\n`)
}
const inputs = JSON.parse(fs.readFileSync(path.join(owned, 'input-bindings.json')))
const check = record => assert.equal(bind(record.path).sha256, record.sha256, `Changed binding: ${record.path}`)
for (const key of ['proseFreeze', 'sourceImage', 'duplicateImage', 'sourceLesson', 'skill', 'routing', 'contract', 'renderer', 'validator']) check(inputs[key])
for (const language of inputs.frozenText) {
  for (const key of ['template', 'figuresTemplate', 'exercisesTemplate', 'readingText']) check(language[key])
}
const specPath = path.join(owned, 'fig-63.spec.json')
const renderPath = path.join(owned, 'repair/fig-63.render.json')
const svgPath = path.join(owned, 'repair/fig-63.svg')
const report = JSON.parse(fs.readFileSync(renderPath))
assert.equal(report.status, 'fail')
assert.equal(report.collisions.length, 2)
assert.equal(report.spec.sha256, bind(specPath).sha256)
assert.equal(report.output.svg.sha256, bind(svgPath).sha256)
const spec = JSON.parse(fs.readFileSync(specPath))
assert.equal(spec.objects.filter(o => o.type === 'segment').length, 26)
assert.equal(spec.objects.filter(o => o.type === 'polygon').length, 4)
assert.equal(spec.objects.filter(o => o.type === 'circle').length, 1)
const reviewPath = path.join(owned, 'fig-63.review.json')
assert(!fs.existsSync(reviewPath))
const reviewArgs = [
  '.agents/skills/ld-s10y-image/scripts/record_review.py',
  '--spec', specPath, '--render', renderPath, '--output', reviewPath,
  '--status', 'fail', '--notes',
  'Author rejection only: after the sole repair, renderer still reports inadequate border clearance for users-220-middle-voltage-number-label and users-220-lower-voltage-number-label. Initial FAIL is preserved. Native-width and mobile scroll measurements pass at 640 px media/16 px text, but do not override collision failure. Original crop and three candidate-width screenshots were inspected; independent source-pixel review, science review, cultural gate, and full-card approval remain unperformed. Do not promote.',
]
const reviewCommand = spawnSync('python3', reviewArgs, {
  encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
})
write('review-command.json', {
  command: 'python3', args: reviewArgs, exitCode: reviewCommand.status,
  stdout: reviewCommand.stdout, stderr: reviewCommand.stderr,
})
assert.equal(reviewCommand.status, 0, reviewCommand.stderr)
const figureTemplate = JSON.parse(fs.readFileSync(inputs.frozenText[0].figuresTemplate.path))
const base = figureTemplate.figures.find(f => f.id === 'fig-63')
const entry = {
  id: base.id, label: base.label, mode: 'deterministic',
  svg: svgPath, render: renderPath, review: reviewPath, spec: specPath,
  changes: ['modernized', 'translation', 'layout'],
  source: structuredClone(base.source),
}
write('proposed-modern-figure-entry.json', {
  schema: 'ld-s10y-image/bounded-proposed-entry@1',
  ticket: 'STEMROBIN-181', card: 'phy10-c1-s4-n35', figure: 'fig-63',
  status: 'rejected-render-failure', promotable: false, entry,
  sourceBinding: inputs.sourceImage,
  boundFiguresTemplates: inputs.frozenText.map(l => ({ language: l.language, ...l.figuresTemplate })),
  note: 'Proposal only. Absolute scratch paths refer to frozen existing candidate files. The source PNG path in entry is the unchanged book-root-relative source contract. No template or canonical asset has been edited. Failed review/render prevent promotion.',
})
const nativePath = path.join(owned, 'native-width/evidence.json')
const native = JSON.parse(fs.readFileSync(nativePath))
assert.equal(native.status, 'pass')
assert.equal(native.renderStatus, 'fail')
check(native.appCss)
check(native.svg)
check(native.render)
check(native.spec)
for (const screenshot of native.screenshots) check(screenshot)
const files = [
  'fig-63.spec.json', 'context.json', 'source-inventory.json', 'input-bindings.json',
  'fig-63.review.json', 'proposed-modern-figure-entry.json', 'author-repair.json',
  'initial/fig-63.spec.json', 'initial/fig-63.svg', 'initial/fig-63.png',
  'initial/fig-63.render.json', 'initial/commands.json',
  'repair/fig-63.spec.json', 'repair/fig-63.svg', 'repair/fig-63.png',
  'repair/fig-63.render.json', 'repair/commands.json',
  'native-width/evidence.json', 'native-width/fixture.html',
  'native-width/desktop-media-640.png', 'native-width/mobile-390-left.png',
  'native-width/mobile-390-right.png', 'review-command.json',
  'author.mjs', 'repair.mjs', 'run-render.mjs', 'check-native-width.mjs', 'freeze.mjs',
].map(p => bind(path.join(owned, p)))
write('figure-freeze.json', {
  schema: 'ld-s10y-image/bounded-author-freeze@1',
  ticket: 'STEMROBIN-181', card: 'phy10-c1-s4-n35', figure: 'fig-63',
  date: '2026-11-17', ownedDirectory: owned,
  status: 'rejected-after-one-author-repair', promotable: false,
  mode: 'deterministic', renderer: report.renderer, purpose: 'instructional',
  validation: 'pass', initialRender: 'fail', finalRender: 'fail',
  finalFailure: report.collisions, repairCount: 1, renderInvocations: 2,
  additionalAuthorRepairsAllowed: 0,
  sourceCounts: { generators: 1, transformerStations: 4, conductorPairs: 13, diagonalBranchPairs: 6, finalUserPairs: 3, voltageAnnotations: 12 },
  voltageMultiplicity: { '11 kV': 1, '110 kV': 1, '35 kV': 3, '6 kV': 3, '220 V': 4 },
  currentBindingsVerified: true, currentBindings: inputs,
  nativeWidth: {
    status: native.status, evidence: bind(nativePath),
    desktop: { viewport: 1440, container: 780, media: 640, minTextPx: 16 },
    mobile: { viewport: 390, container: 362, media: 640, minTextPx: 16, scrollEnd: 278, usersReachable: true },
    surface: native.scope,
  },
  candidate: {
    svg: bind(svgPath), spec: bind(specPath), render: bind(renderPath),
    review: bind(reviewPath), proposal: bind(path.join(owned, 'proposed-modern-figure-entry.json')),
  },
  imageBudget: { imagesOpened: 5, maximum: 8, opened: ['original crop', 'initial render PNG', 'native desktop PNG', 'mobile left PNG', 'mobile right PNG'], parentImagePayload: false },
  independentPixelReview: 'pending', independentScienceReview: false,
  sourceOrCyrillicGateRun: false, fullCardApproval: false,
  templatesModified: false, canonicalFilesModified: false,
  databaseAccess: false, gitOperations: false, appModified: false,
  browserWindowsOpened: false, agentsCreated: false, messagesSent: false,
  frozenFiles: files,
})
console.log(JSON.stringify({
  status: 'rejected-after-one-author-repair',
  freeze: bind(path.join(owned, 'figure-freeze.json')),
  candidateSpec: bind(specPath), candidateSvg: bind(svgPath),
  finalRender: 'fail', nativeWidth: 'pass', imagesOpened: 5,
}, null, 2))
