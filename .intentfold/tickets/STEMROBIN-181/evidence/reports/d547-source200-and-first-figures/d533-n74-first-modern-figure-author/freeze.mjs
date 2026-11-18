import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const relativeRoot = path.relative(repo, root)
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = relative => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'))
const write = (relative, value) => {
  const file = path.resolve(root, relative)
  assert(file.startsWith(root + path.sep))
  assert(!fs.existsSync(file), `freeze once, preserve ${relative}`)
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n')
}
const binding = read('input-binding.json')
for (const input of [binding.manifest, ...binding.inputs]) {
  assert.equal(hash(path.resolve(repo, input.path)), input.sha256)
}
assert(!fs.existsSync(path.join(root, 'READY.json')), 'batch already closed')
const files = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry =>
  entry.isDirectory() ? files(path.join(directory, entry.name)) : [path.join(directory, entry.name)])
const ref = relative => ({ path: `${relativeRoot}/${relative}`, sha256: hash(path.join(root, relative)) })
const sourceOpens = read('source-actual-opens.json')
const generatedOpens = [160, 161, 162].map((number, index) => ({
  ordinal: index + 5, kind: 'first-generated-PNG', figure: `fig-${number}`,
  version: 'repair1 after first draft was blocked before rendering',
  tool: 'functions.view_image', ...ref(`candidates/fig-${number}/repair1/figure.png`),
  absolutePath: path.join(root, `candidates/fig-${number}/repair1/figure.png`),
  opened: true, crop: false, reopen: false,
}))
write('actual-opens.json', {
  schema: 'd533/actual-image-opens@1', actor: 'fresh bounded one-time author',
  currentContextStartedAtImageCount: 0, contextTotal: 7, batchTotal: 7, batchLimit: 8, contextLimit: 24,
  entries: [...sourceOpens.entries, ...generatedOpens],
  sourcePNGs: 4, firstGeneratedPNGs: 3,
  fig163GeneratedImage: { opened: false, reason: 'Native renderer threw before writing SVG/PNG.' },
  crops: 0, composites: 0, reopens: 0, resets: 0, paidGeneration: 0,
  parentNewImageOpens: 0, parentPermanentImageCount: 24, parentBudgetReset: false,
  independentReviewerImageCountNotTouched: true, imagePayloadReturnedToParent: false,
  note: 'Only these seven functions.view_image calls supplied images to this fresh author context. '
    + 'Native browser renders/PNG files were not otherwise supplied to model context. No ninth image, '
    + 'composite, crop or hidden reopen was used.',
})
write('render-author-observation.json', {
  schema: 'd533/first-generation-author-observation@1',
  authority: 'Author observations only. NOT an independent ld-s10y-image/review@1, no promotion.',
  imagesOpenedOnce: generatedOpens.map(item => ({ path: item.path, sha256: item.sha256 })),
  observations: [
    { figure: 'fig-160', native: 'FAIL', authorObservation: 'The source single-ray two-interface topology, '
      + 'O/A/B and Greek alpha/phi/theta labels, normal lines, dashed continuation and backward projection '
      + 'are visible in the first produced PNG. No blank or black raster. Native O-label collision remains '
      + 'binding even though the author can read the displayed O; never clear it by visual opinion.',
      terminal: 'HOLD', secondRepair: 'forbidden' },
    { figure: 'fig-161', native: 'PASS', authorObservation: 'One lower-right right-angle triangle, '
      + 'two distinct upward inputs with external upward arrowheads, one diagonal-face reflection each, '
      + 'two rightward outputs with arrowheads. No extra ray, no source point-name or angle annotation. '
      + 'The light paths and glass region are visible against paper.',
      independentFIG: 'pending', fullcard: false },
    { figure: 'fig-162', native: 'PASS', authorObservation: 'One apex-right-angle triangle, '
      + 'two upward inputs, two separate rightward internal levels with arrowheads, two downward outputs. '
      + 'Each path has distinct left-leg and right-leg reflections, both before exit through the base. '
      + 'No third beam, no displayed solution labels, no black or blank output.',
      independentFIG: 'pending', fullcard: false },
    { figure: 'fig-163', native: 'ERROR', authorObservation: 'No generated image exists and none was opened. '
      + 'Spec-only author checks are not raster evidence and cannot clear the native failure.',
      terminal: 'HOLD', secondRepair: 'forbidden' },
  ],
  actualAppWidthVisualInspection: 'Not done here. Native reports mechanically test 331,342 and desktop '
    + 'media widths, but headed fullcard DISPLAY and separate visual FIG review remain pending.',
})

const figures = [160, 161, 162, 163].map(number => {
  const first = `candidates/fig-${number}/first`
  const after = `candidates/fig-${number}/repair1`
  const validation = read(`${after}/validation.json`)
  assert.equal(validation.status, 'pass')
  const command = read(`${after}/render.command.json`)
  const renderFile = path.join(root, after, 'render.json')
  const render = fs.existsSync(renderFile) ? read(`${after}/render.json`) : null
  const nativePass = render?.status === 'pass' && command.exitCode === 0
  const outputs = ['figure.svg', 'figure.png'].filter(name => fs.existsSync(path.join(root, after, name)))
    .map(name => ref(`${after}/${name}`))
  assert.equal(read(`${first}/validation.json`).status, 'fail')
  assert.equal(read(`${after}/repair.json`).repairOrdinal, 1)
  const beforeSpec = read(`${first}/spec.json`)
  const afterSpec = read(`${after}/spec.json`)
  const expected = structuredClone(beforeSpec)
  expected.display.widths = [331, ...beforeSpec.display.widths]
  assert.deepEqual(afterSpec, expected, 'one targeted display.widths-only repair')
  if (render) {
    assert.equal(render.spec.sha256, hash(path.join(root, after, 'spec.json')))
    for (const out of Object.values(render.output)) assert.equal(hash(path.resolve(repo, out.path)), out.sha256)
  }
  return {
    figure: `fig-${number}`, stage: nativePass ? 'NATIVE-PASS-INDEPENDENT-FIG-PENDING' : 'HOLD-TERMINAL-NO-SECOND-REPAIR',
    firstDraftValidation: ref(`${first}/validation.json`),
    firstSpec: ref(`${first}/spec.json`), firstRender: 'not attempted: first draft validation FAIL',
    soleRepair: ref(`${after}/repair.json`), candidateSpec: ref(`${after}/spec.json`),
    candidateValidation: ref(`${after}/validation.json`),
    renderCommand: ref(`${after}/render.command.json`),
    ...(render ? { nativeRender: ref(`${after}/render.json`) } : { nativeRender: null }),
    outputs, sourceInventory: ref('rawinventory.json'), authorOptics: ref(`${first}/author-optics.json`),
    nativeValidation: validation.status, nativeRenderStatus: render?.status || 'error',
    independentFIG: 'pending', reviewAt1Written: false, fullcard: false, promoted: false,
    display: afterSpec.display,
    nativeMeasuredText: render?.displayChecks || null,
    reason: number === 160
      ? 'Native O-label collision, score 17.242535036335166; display text sizes pass but collision blocks promotion.'
      : number === 163
        ? 'Native renderer exit 1: Unsupported arrow marker aspect ratio: '
          + 'ld-fig-163_ld-s163-ray-1-exit-directionTriangleEnd1. No SVG, PNG or native render report was emitted.'
        : 'Native spec/render PASS only. A different fresh bounded reviewer must independently adjudicate FIG, '
          + 'then the parent must complete the actual fullcard DISPLAY binding.',
    repairCount: 1, remainingRepairs: 0,
  }
})

write('report.json', {
  schema: 'd533/bounded-modern-figure-author-report@1', ticket: 'STEMROBIN-181',
  card: 'phy10-c2-s2-n74', status: 'AUTHOR-FROZEN-READY-WITH-TERMINAL-HOLDS',
  taskClosedAt: new Date().toISOString(),
  scope: 'One-time short figure-author batch only; not a new/replacement standing A-D worker.',
  inputManifest: binding.manifest,
  authorInventory: ref('rawinventory.json'), actualOpens: ref('actual-opens.json'),
  authorRenderObservations: ref('render-author-observation.json'), inputBinding: ref('input-binding.json'),
  nativePassCandidates: ['fig-161', 'fig-162'], terminalHolds: ['fig-160', 'fig-163'],
  figures,
  preservedVerdicts: { SCI: 'PASS-INHERITED-d491', ZHEN: 'PASS-INHERITED-d491',
    repeatedTextReview: false, RAW160: 'HOLD', RAW161: 'HOLD', RAW162: 'HOLD',
    RAW163: 'PASS-INHERITED-NOT-REVIEWED', SOURCE196Procedural: 'HOLD-PRESERVED' },
  firstFailuresPreserved: 'All four first specs failed only because the native inline maxWidthPx rule additionally '
    + 'requires a 331px check. These failures and exact first-spec bytes remain. All four sole repairs only '
    + 'add 331px; actual media width 342px remains. Then fig-160 failed native collision and fig-163 threw.',
  commands: { directFirstDraftValidatorInvocations: 4, firstRendererInvocations: 0,
    directAffectedDraftValidatorInvocations: 4, affectedRendererInvocations: 4,
    nativeRendererEmbeddedValidatorPreflights: 4, totalNativeValidatorProcesses: 12,
    secondRepairInvocations: 0, determinismRerenderInvocations: 0,
    countNote: 'The four embedded preflights are inherent to the unmodified native renderer, '
      + 'not additional stand-alone validator commands or hidden rechecks.' },
  crossCardDependency: { card: 't13', question: 'Q4', figures: ['fig-161', 'fig-162'],
    solutionReadOrInserted: false, unlocked: false,
    note: 'Source n74 scientific diagrams only; independent FIG/fullcard DISPLAY still pending. '
      + 'Do not populate the written-exercise solution in these diagrams.' },
  gates: { independentFIG: 'pending', headedFullcardDISPLAY: 'pending', fullcard: false,
    lessonEditionNativeFinalize: false, allFourFiguresPassed: false, promotable: false },
  imageBudget: { freshAuthorContextStart: 0, actualOpens: 7, originals: 4, firstGenerated: 3,
    batchMaximum: 8, contextMaximum: 24, parentPermanentCount: 24, parentReset: false,
    reopens: 0, crops: 0, composites: 0, ninthImage: false, reset: false, payloadReturnedToParent: false },
  prohibitedActions: { canonicalEditionWrites: 0, fullLessonFinalization: 0, databaseOperations: 0,
    gitMutations: 0, gitReadOnlyStatusAtEntry: 1, newSubagents: 0, newThreads: 0,
    newWorktrees: 0, newBranches: 0, deploys: 0, paidGeneration: 0,
    handWrittenSVG: 0, SVGOutputEdits: 0, libraryOrRendererEdits: 0, externalTicketWrites: 0 },
  freeze: { allFilesMode: '0444', directoryMode: '0555', hashManifest: 'author-freeze.json',
    readiness: 'READY.json', checksum: 'READY.sha256', noEditsOrRerendersAfterFreeze: true },
  lifecycle: { boundedAuthorWorkComplete: true, furtherAuthorWork: 'none; terminal repair allowance exhausted',
    parentAction: 'Close this one-time author batch/context after consuming textual report and hashes. '
      + 'Do not send image payloads to the permanently exhausted parent/old reviewer.',
    independentNext: 'Only fig-161/162 native-pass candidates may enter a different fresh short independent FIG batch. '
      + 'Fig-160/163 remain terminal HOLD; a new context alone does not reset their sole-repair allowance.' },
})

for (const file of files(root)) fs.chmodSync(file, 0o444)
const frozen = files(root).sort().map(file => {
  assert.equal(fs.statSync(file).mode & 0o777, 0o444)
  return { path: path.relative(root, file), sha256: hash(file), bytes: fs.statSync(file).size, mode: '0444' }
})
write('author-freeze.json', {
  schema: 'd533/author-freeze@1', status: 'READY-WITH-HOLDS', inputManifest: binding.manifest,
  frozenAt: new Date().toISOString(), files: frozen,
  coverage: 'All previously written author files are mode-verified and hash-bound here. READY.json hashes this '
    + 'manifest; READY.sha256 supplies the checksum of READY.json. No self-referential hash is claimed.',
  nativePassCandidates: ['fig-161', 'fig-162'], terminalHolds: ['fig-160', 'fig-163'],
  independentFIG: 'pending', fullcard: false, actualImageOpens: 7,
})
fs.chmodSync(path.join(root, 'author-freeze.json'), 0o444)
write('READY.json', {
  schema: 'd533/author-ready@1', status: 'AUTHOR-FROZEN-READY-WITH-TERMINAL-HOLDS',
  authorFreeze: ref('author-freeze.json'), report: ref('report.json'), actualOpens: ref('actual-opens.json'),
  nativePassCandidates: ['fig-161', 'fig-162'], terminalHolds: ['fig-160', 'fig-163'],
  independentFIG: 'pending', fullcard: false, allFilesMode: '0444',
  readyMeans: 'Author checkpoint files are frozen for textual consumption, not that all four figures passed.',
})
fs.chmodSync(path.join(root, 'READY.json'), 0o444)
const readyHash = hash(path.join(root, 'READY.json'))
fs.writeFileSync(path.join(root, 'READY.sha256'), `${readyHash}  READY.json\n`)
fs.chmodSync(path.join(root, 'READY.sha256'), 0o444)
for (const file of files(root)) assert.equal(fs.statSync(file).mode & 0o777, 0o444)
for (const entry of frozen) assert.equal(hash(path.join(root, entry.path)), entry.sha256)
const freezeDirectories = directory => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) freezeDirectories(path.join(directory, entry.name))
  }
  fs.chmodSync(directory, 0o555)
}
freezeDirectories(root)
console.log(JSON.stringify({
  status: 'FROZEN', files: files(root).length, allFiles0444: true, directories0555: true,
  READY: { path: `${relativeRoot}/READY.json`, sha256: readyHash },
  report: ref('report.json'), actualOpens: 7, nativePass: [161, 162], terminalHolds: [160, 163],
  independentFIG: 'pending', fullcard: false,
}, null, 2))
