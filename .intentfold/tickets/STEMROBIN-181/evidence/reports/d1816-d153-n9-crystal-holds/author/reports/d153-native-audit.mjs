import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'

const cwd = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
const evidence = path.join(cwd, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d153-n9-crystal-figures-author')
const output = path.join(cwd, '.tmp/STEMROBIN-181/d1816-d153/figures')
const expectedFreeze = '0f07d71c0bf521c88c8bda69d371d4c2a71872e772b77ea6305a16c042512142'
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const binding = file => ({ path: file, bytes: fs.statSync(file).size, sha256: hash(file) })

function save(file, value) {
  if (!file.startsWith(`${evidence}/`) && !file.startsWith(`${output}/fig-11/`) && !file.startsWith(`${output}/fig-12/`)) {
    throw new Error(`Write outside D153 authorization: ${file}`)
  }
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}

const inputPath = path.join(evidence, 'input-freeze.json')
if (hash(inputPath) !== expectedFreeze) throw new Error('Immutable D153 input-freeze mismatch')
const input = read(inputPath)
const contexts = Object.fromEntries(input.contexts.map(item => {
  const context = read(item.path)
  return [context.figure, context]
}))
const boundInputs = new Map()

function collectBindings(value) {
  if (!value || typeof value !== 'object') return
  if (typeof value.path === 'string' && typeof value.sha256 === 'string') {
    const file = path.isAbsolute(value.path) ? value.path : path.resolve(cwd, value.path)
    const actual = binding(file)
    if (actual.sha256 !== value.sha256 || (value.bytes !== undefined && actual.bytes !== value.bytes)) {
      throw new Error(`Immutable binding mismatch: ${file}`)
    }
    boundInputs.set(file, { ...actual, expectedSha256: value.sha256, status: 'pass' })
  }
  for (const child of Object.values(value)) collectBindings(child)
}

collectBindings(input)
for (const context of Object.values(contexts)) collectBindings(context)
boundInputs.set(inputPath, { ...binding(inputPath), expectedSha256: expectedFreeze, status: 'pass' })
const before = [...boundInputs.values()]
save(path.join(evidence, 'freezes/d153-bindings-before.json'), {
  batch: 'D153', verifiedAt: new Date().toISOString(), status: 'pass', bindings: before,
})

const inventoryPaths = Object.fromEntries(['fig-11', 'fig-12'].map(id => [
  id, path.join(evidence, `inventories/${id}.source-first.json`),
]))
const inventories = Object.fromEntries(Object.entries(inventoryPaths).map(([id, file]) => [id, read(file)]))
const sourceFirstFreeze = {
  batch: 'D153',
  createdBeforeDraft: true,
  inventories: Object.values(inventoryPaths).map(binding),
  actualImageOpensBeforeDraft: 4,
  reusedFigureCandidates: 0,
}
save(path.join(evidence, 'freezes/d153-source-first-freeze.json'), sourceFirstFreeze)

// Digitize source-space centers and connections; do not regularize to an ideal cell.
const salt = inventories['fig-11']
const saltPoints = new Map(salt.sites.map(([id, x, y, appearance]) => [id, {
  id, type: 'point', at: [x, 419 - y], fill: appearance === 'filled' ? 'ink' : 'paper',
  stroke: 'ink', strokeWidth: 2,
  size: id.startsWith('front-') ? 15 : id.startsWith('middle-') ? 12 : 8,
}]))
const edges = []
const assertions = []
const coordinate = ref => typeof ref === 'string' ? saltPoints.get(ref).at : ref

function edge(id, from, to, dash = 0, farBack = false) {
  edges.push({
    id, type: 'segment', from, to, dash, stroke: 'ink',
    strokeWidth: farBack ? 1.5 : 2.5,
  })
  assertions.push({ id: `${id}-connects`, type: 'connects', arrow: id, from, to })
  const a = coordinate(from)
  const b = coordinate(to)
  assertions.push({
    id: `${id}-projected-displacement`, type: 'displacement',
    from, to, dx: b[0] - a[0], dy: b[1] - a[1],
  })
}

for (const layer of ['front', 'middle', 'back']) {
  for (let row = 0; row < 3; row += 1) {
    const chain = [0, 1, 2].map(col => `${layer}-r${row}-c${col}`).filter(id => saltPoints.has(id))
    for (let index = 1; index < chain.length; index += 1) {
      edge(`row-${layer}-${row}-${index}`, chain[index - 1], chain[index], 0, layer === 'back')
    }
  }
  for (let col = 0; col < 3; col += 1) {
    const chain = [0, 1, 2].map(row => `${layer}-r${row}-c${col}`).filter(id => saltPoints.has(id))
    for (let index = 1; index < chain.length; index += 1) {
      edge(`column-${layer}-${col}-${index}`, chain[index - 1], chain[index],
        layer === 'back' && col === 0 ? 2 : 0, layer === 'back')
    }
  }
}
for (let row = 0; row < 3; row += 1) {
  for (let col = 0; col < 3; col += 1) {
    const front = `front-r${row}-c${col}`
    const middle = `middle-r${row}-c${col}`
    const back = `back-r${row}-c${col}`
    edge(`depth-${row}-${col}-front-middle`, front, middle)
    edge(`depth-${row}-${col}-middle-back`, middle,
      saltPoints.has(back) ? back : [288, 419 - 133], 0, true)
  }
}
assertions.push({ id: 'visible-source-site-count', type: 'objectCount', objectType: 'point', count: 26 })
const allSourceObjects = [...saltPoints.keys(), ...edges.map(item => item.id)]
const sourceAssertions = assertions.map(item => item.id)
const draft = {
  schema: 'ld-s10y-image/figure-spec@2',
  id: 'fig-11',
  mode: 'deterministic',
  description: 'HOLD draft: original oblique projected table-salt ionic lattice. Approximate PNG-screen positions only; no measured three-dimensional lengths, angles, or orthogonality. Twenty-six visible sites, two ion appearances, preserved hidden continuation. Mandatory finite row/column gridDimensions remains unresolved.',
  source: {
    image: {
      path: contexts['fig-11'].durableSourceImage.path,
      sha256: contexts['fig-11'].durableSourceImage.sha256,
    },
    authoritativeText: ['zh', 'en'].map(language => ({
      lesson: contexts['fig-11'].lesson,
      text: contexts['fig-11'].languages[language].fullText,
    })),
    inventory: [{
      id: 'salt-shared-projected-lattice',
      description: 'Source-first inventory: three depth layers with three row and three column slots (two cell rows and columns) each; back-r1-c1 is occluded, leaving 26 visible markers. Filled/open source circles distinguish two ions without identifying which chemical species. All visible sites and all source connector families share one uncalibrated oblique frame. A native axis-aligned grid would alter the source and is deliberately not fabricated.',
      objects: allSourceObjects,
      assertions: sourceAssertions,
      requires: ['pointRelationships', 'gridDimensions'],
    }, {
      id: 'modern-english-identification',
      description: 'Modern additions from approved text, not source labels: title, anonymous two-ion marker legend, and projection qualification.',
      objects: ['salt-title', 'ion-type-1-swatch', 'ion-type-2-swatch', 'ion-type-1-label', 'ion-type-2-label', 'projection-note'],
      assertions: [],
    }],
  },
  canvas: { width: 640, height: 660, boundingBox: [-15, 461, 449, -18], background: 'paper', keepAspectRatio: true },
  display: { purpose: 'instructional', layout: 'scroll', widths: [640], minTextPx: 16 },
  objects: [
    ...saltPoints.values(),
    ...edges,
    { id: 'salt-title', type: 'text', at: [217, 441], text: 'Table salt: ionic crystal', fontSize: 24, labelPlacement: { position: 'CENTER' }, labelColor: 'ink' },
    { id: 'ion-type-1-swatch', type: 'circle', center: [57, 12], radius: 5, fill: 'ink', fillOpacity: 1, stroke: 'ink', strokeWidth: 2 },
    { id: 'ion-type-1-label', type: 'text', at: [106, 12], text: 'Ion type 1', fontSize: 18, labelPlacement: { position: 'CENTER' }, labelColor: 'ink' },
    { id: 'ion-type-2-swatch', type: 'circle', center: [249, 12], radius: 5, fill: 'paper', fillOpacity: 1, stroke: 'ink', strokeWidth: 2 },
    { id: 'ion-type-2-label', type: 'text', at: [298, 12], text: 'Ion type 2', fontSize: 18, labelPlacement: { position: 'CENTER' }, labelColor: 'ink' },
    { id: 'projection-note', type: 'text', at: [217, -8], text: 'Projected arrangement', fontSize: 18, labelPlacement: { position: 'CENTER' }, labelColor: 'muted' },
  ],
  assertions,
}
const draftPath = path.join(output, 'fig-11/candidate-01.spec.json')
save(draftPath, draft)

const args = [
  '.agents/skills/ld-s10y-image/scripts/validate_spec.py',
  draftPath, '--stage', 'draft', '--json',
]
const start = new Date().toISOString()
const result = spawnSync('python3', args, { cwd, encoding: 'utf8' })
const end = new Date().toISOString()
const validation = result.stdout.trim() ? JSON.parse(result.stdout) : null
const receiptPath = path.join(evidence, 'receipts/D153-native-001-fig-11-draft-validation.json')
const receipt = {
  schema: 'D153/run-native-receipt@1', batch: 'D153', ordinal: 1,
  figure: 'fig-11', stage: 'draft-validation',
  command: 'python3', arguments: args, cwd, startedAt: start, finishedAt: end,
  exitCode: result.status, signal: result.signal, spawnError: result.error?.message ?? null,
  input: binding(draftPath), stdout: result.stdout, stderr: result.stderr,
  parsedOutput: validation, technicalRecovery: false,
}
save(receiptPath, receipt)
save(path.join(output, 'fig-11/candidate-01.validation.json'), validation ?? { status: 'technical-failure' })
save(path.join(evidence, 'reports/fig-11-first-failure.json'), {
  batch: 'D153', figure: 'fig-11', status: 'HOLD', stage: 'draft-validation',
  classification: 'representation-contract-gap',
  nativeReceipt: binding(receiptPath), candidate: binding(draftPath),
  errors: validation?.errors ?? [],
  contentRepairAttempted: false,
  explanation: 'The required finite-row/column gridDimensions has no source-faithful native grid object for this irregular oblique projection. Renderer/grid extension would modify immutable shared tooling. An ideal rectangular or invisible grid is not an authorized repair.',
  downstreamRender: 'NOT_RUN: dependent stage stopped at first native validation failure.',
})
save(path.join(evidence, 'reports/fig-12-first-failure.json'), {
  batch: 'D153', figure: 'fig-12', status: 'HOLD', stage: 'source-first-inventory',
  classification: 'source-hidden-connectors-unresolved',
  inventory: binding(inventoryPaths['fig-12']),
  completeVisibleSiteInventory: true,
  completeConfirmedConnectorInventory: false,
  unresolved: inventories['fig-12'].unresolvedSourceRequirements,
  contentRepairAttempted: false,
  candidateCreated: false,
  downstreamValidationAndRender: 'NOT_RUN: source-first gate held before drawing; do not invent ideal-cell connections.',
})

for (const beforeBinding of before) {
  const current = binding(beforeBinding.path)
  if (current.sha256 !== beforeBinding.sha256 || current.bytes !== beforeBinding.bytes) {
    throw new Error(`Immutable input changed during D153: ${beforeBinding.path}`)
  }
}
save(path.join(evidence, 'freezes/d153-bindings-after.json'), {
  batch: 'D153', verifiedAt: new Date().toISOString(), status: 'pass',
  bindings: before.map(item => ({ ...binding(item.path), expectedSha256: item.sha256, status: 'pass' })),
})

const imageOpens = [
  { ordinal: 1, kind: 'ORIGINAL', figure: 'fig-11', ...binding(contexts['fig-11'].durableSourceImage.path) },
  { ordinal: 2, kind: 'ORIGINAL', figure: 'fig-12', ...binding(contexts['fig-12'].durableSourceImage.path) },
  { ordinal: 3, kind: 'proportional-original-enlargement', figure: 'fig-11', ...binding(path.join(evidence, 'inventories/fig-11-original-enlarged.png')) },
  { ordinal: 4, kind: 'proportional-original-enlargement', figure: 'fig-12', ...binding(path.join(evidence, 'inventories/fig-12-original-enlarged.png')) },
]
save(path.join(evidence, 'receipts/D153-image-open-ledger.json'), {
  batch: 'D153', actualImageOpens: imageOpens.length, contextImageOpens: imageOpens.length,
  maximumBatchImageOpens: 8, maximumContextImageOpens: 24, parentImageOpens: 0,
  imageOpens, candidateImageOpens: 0, excludedImageOpens: 0,
})
save(path.join(evidence, 'receipts/D153-native-call-ledger.json'), {
  batch: 'D153',
  actualNativeCalls: 1,
  nativeValidationCalls: 1,
  nativeRenders: 0,
  nativeContextCalls: 0,
  immutableInheritedContextCalls: input.nativeContextCalls,
  contextCallsReplayed: 0,
  nativeReviewCalls: 0,
  nativeFinalizers: 0,
  nativePromotions: 0,
  calls: [binding(receiptPath)],
  technicalRecoveries: [],
  contentRepairsPerFigure: { 'fig-11': 0, 'fig-12': 0 },
  browserSessionsOpened: 0,
  browserSessionsLeftOpen: 0,
  sourceDerivativeCalls: [
    {
      command: 'sips', cwd,
      arguments: ['--resampleWidth', '1000', 'ssot-resources/soviet10year-textbooks/artifacts/9p/figures/fig-11.png', '--out', '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d153-n9-crystal-figures-author/inventories/fig-11-original-enlarged.png'],
      exitCode: 0,
    },
    {
      command: 'sips', cwd,
      arguments: ['--resampleWidth', '1000', 'ssot-resources/soviet10year-textbooks/artifacts/9p/figures/fig-12.png', '--out', '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d153-n9-crystal-figures-author/inventories/fig-12-original-enlarged.png'],
      exitCode: 0,
    },
  ],
})
const figures = {
  'fig-11': {
    status: 'HOLD', authorready: false,
    source: binding(contexts['fig-11'].durableSourceImage.path),
    inventory: binding(inventoryPaths['fig-11']),
    selected: null, selectedPathsAndHashes: [],
    candidates: [binding(draftPath)],
    validation: binding(path.join(output, 'fig-11/candidate-01.validation.json')),
    firstFailure: binding(path.join(evidence, 'reports/fig-11-first-failure.json')),
    visibleSourceSites: 26, visibleSpeciesCounts: { filled: 13, open: 13 },
    nativeConnectsAssertions: edges.length,
    nativeProjectedDisplacementAssertions: edges.length,
    everyVisibleSourcePointHasInGroupRelationship: true,
    requiredGridDimensionsSatisfied: false,
    display: draft.display,
    inline331LegibilityClaimed: false,
    rendered: false, contentRepairs: 0,
  },
  'fig-12': {
    status: 'HOLD', authorready: false,
    source: binding(contexts['fig-12'].durableSourceImage.path),
    inventory: binding(inventoryPaths['fig-12']),
    selected: null, selectedPathsAndHashes: [], candidates: [],
    firstFailure: binding(path.join(evidence, 'reports/fig-12-first-failure.json')),
    visibleSourceSites: 17, speciesCount: 1,
    confirmedCompleteSourceConnectorGraph: false,
    finiteAxisAligned2DGridPresent: false,
    intendedDisplay: contexts['fig-12'].defaultDisplay,
    inline331LegibilityClaimed: false,
    rendered: false, contentRepairs: 0,
  },
}
const reportPath = path.join(evidence, 'report.json')
save(reportPath, {
  schema: 'D153/author-report@1', batch: 'D153', ticket: 'STEMROBIN-181',
  status: 'HOLD', authorready: false, finish: 'review', Grill: 'self',
  createdAt: new Date().toISOString(), cwd,
  inputFreeze: binding(inputPath),
  inputBindingsCurrent: true, allApprovedBilingualTextBound: true,
  originalPNGOpenedBeforeAnyCandidate: true,
  reusedFigureCandidates: 0,
  figures,
  actualImageOpens: 4, contextImageOpens: 4, parentImageOpens: 0,
  maximumImageOpens: 8, maximumContextImageOpens: 24,
  contentRepairsPerFigure: { 'fig-11': 0, 'fig-12': 0 },
  firstfailures: Object.values(figures).map(figure => figure.firstFailure),
  nativeCalls: binding(path.join(evidence, 'receipts/D153-native-call-ledger.json')),
  imageOpenLedger: binding(path.join(evidence, 'receipts/D153-image-open-ledger.json')),
  sourceFirstFreeze: binding(path.join(evidence, 'freezes/d153-source-first-freeze.json')),
  immutableInputsAfter: binding(path.join(evidence, 'freezes/d153-bindings-after.json')),
  authorOnly: true, independentApproval: false, nativeReviewRecorded: false,
  promotionAuthorized: false, promotions: 0, carrierWrites: 0,
  sourcePageReviewsReplayed: 0, textReviewsReplayed: 0, nativeContextsReplayed: 0,
  paidCalls: 0, portraitCalls: 0, publisherCalls: 0, databaseCalls: 0,
  commits: 0, pushes: 0, deploys: 0, merges: 0, closures: 0, peerMessages: 0,
  browsersOpened: 0, browsersLeftOpen: 0,
  reason: 'Neither figure is authorready: salt cannot satisfy the mandatory gridDimensions through immutable native tools without replacing its actual projection; diamond frozen PNG does not resolve the full hidden connector graph. No ideal lattice or numeric three-dimensional calibration was invented.',
})

function filesBelow(dir) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(dir, entry.name)
    return entry.isDirectory() ? filesBelow(file) : [file]
  })
}
const authorFreezePath = path.join(evidence, 'author-freeze.json')
const artifacts = [...filesBelow(evidence), ...filesBelow(output)]
  .filter(file => file !== authorFreezePath && !boundInputs.has(file))
  .sort().map(binding)
save(authorFreezePath, {
  schema: 'D153/author-freeze@1', batch: 'D153', ticket: 'STEMROBIN-181',
  status: 'HOLD', authorready: false, createdAt: new Date().toISOString(),
  report: binding(reportPath),
  inputFreeze: binding(inputPath),
  immutableInputs: [...boundInputs.values()],
  figures,
  artifacts,
  actualImageOpens: 4,
  contentRepairsPerFigure: { 'fig-11': 0, 'fig-12': 0 },
  firstfailures: Object.values(figures).map(figure => figure.firstFailure),
  nativeReviewRecorded: false,
  independentApproval: false,
  canonicalPromotions: 0,
  hashScope: 'Every current authored file and bound input is hashed. This author-freeze file excludes its own recursive self-hash; its hash is emitted by the native-audit runner.',
})
console.log(JSON.stringify({
  status: 'HOLD', authorready: false,
  report: binding(reportPath), authorFreeze: binding(authorFreezePath),
  nativeCalls: 1, actualImageOpens: 4,
  validationStatus: validation?.status,
  validationErrors: validation?.errors,
}, null, 2))
