import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const owned = path.dirname(fileURLToPath(import.meta.url))
const workspace = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const skill = path.join(workspace, '.agents/skills/ld-s10y-image')
const hash = filename => crypto.createHash('sha256').update(fs.readFileSync(filename)).digest('hex')
const bind = filename => ({ path: path.resolve(filename), sha256: hash(filename) })
const read = filename => JSON.parse(fs.readFileSync(filename, 'utf8'))
const write = (relative, value) => {
  const filename = path.resolve(owned, relative)
  assert(filename.startsWith(`${owned}/`))
  fs.mkdirSync(path.dirname(filename), { recursive: true })
  fs.writeFileSync(filename, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
  return bind(filename)
}
const check = binding => assert.equal(hash(binding.path), binding.sha256, `Changed frozen binding: ${binding.path}`)
assert(!fs.existsSync(path.join(owned, 'author-freeze.json')), 'No overwrite of author freeze.')
const inputs = read(path.join(owned, 'input-bindings.json'))
for (const binding of [
  ...Object.values(inputs.authoritative), inputs.sourceInventory, ...inputs.sources, ...inputs.tools,
]) check(binding)
const sourceInventory = read(inputs.sourceInventory.path)
const opened = [...read(path.join(owned, 'image-ledger.initial.json')).opened]
const figures = []

for (const id of ['fig-66', 'fig-67']) {
  const dir = path.join(owned, id, 'repair-1')
  const specPath = path.join(dir, `${id}.spec.json`)
  const svgPath = path.join(dir, `${id}.svg`)
  const renderPath = path.join(dir, `${id}.render.json`)
  const spec = read(specPath)
  const render = read(renderPath)
  const initial = path.join(owned, id, 'initial')
  const initialSpecPath = path.join(initial, `${id}.spec.json`)
  const diagnosis = read(path.join(owned, id, 'diagnosis.json'))
  check(diagnosis.initialSpec)
  check(diagnosis.initial)
  check(diagnosis.validation)
  assert.equal(read(path.join(initial, 'attempt.json')).status, 'fail')
  assert.equal(read(path.join(dir, 'attempt.json')).status, 'pass')
  assert.equal(render.status, 'pass')
  assert.deepEqual(render.collisions, [])
  assert.equal(render.labels, 2)
  assert.equal(render.spec.sha256, hash(specPath))
  for (const output of Object.values(render.output)) check(output)
  assert.deepEqual(spec.display, {
    layout: 'inline', purpose: 'instructional', maxWidthPx: 640,
    minTextPx: 16, widths: [640, 358, 331, 310],
  })
  assert.deepEqual(render.displayChecks.map(item => item.width), spec.display.widths)
  assert(render.displayChecks.every(item =>
    item.status === 'pass' && item.measuredMinPx >= 16 && !item.failures.length))
  const original = read(initialSpecPath)
  const reverse = structuredClone(spec)
  for (const assertion of reverse.assertions) {
    if (assertion.type !== 'objectCount') continue
    assertion.value = assertion.count
    delete assertion.count
  }
  assert.deepEqual(reverse, original, 'Sole repair altered more than the count field.')
  const source = sourceInventory.figures.find(item => item.id === id)
  assert.deepEqual(spec.source.image, source.source)
  assert(spec.source.image.path.startsWith('ssot-resources/'))
  assert(!spec.source.image.path.includes('/tmp/'))
  check({ ...spec.source.image, path: path.join(workspace, spec.source.image.path) })

  const textBindings = []
  for (const language of ['zh', 'en']) {
    const lesson = read(inputs.authoritative[language].path)
    const expectedText = `Language: ${language}\n${lesson.printed_title}\n${lesson.prose.map(block =>
      block.kind === 'fig' ? `[${block.id}]` : block.text).join('\n\n')}`
    assert(spec.source.authoritativeText.some(item => item.lesson === lesson.id && item.text === expectedText))
    const figureBlocks = lesson.prose.map((block, index) => ({ block, index }))
      .filter(item => item.block.kind === 'fig' && item.block.id === id)
    assert.equal(figureBlocks.length, 1)
    const figureBlock = figureBlocks[0]
    const caption = lesson.prose[figureBlock.index + 1]
    assert.equal(caption.kind, 'cap')
    assert.equal(caption.text, language === 'en'
      ? `Figure ${id.slice(4)}` : `\u56fe ${id.slice(4)}`)
    const referencedProse = lesson.prose.map((block, index) => ({ block, index }))
      .filter(item => item.block.kind === 'p' &&
        (language === 'en'
          ? item.block.text.includes(`Figure ${id.slice(4)}`)
          : item.block.text.includes(`\u56fe${id.slice(4)}`)))
    assert.equal(referencedProse.length, 1)
    textBindings.push({
      language, template: inputs.authoritative[language],
      figurePointer: `/prose/${figureBlock.index}`,
      sourceRefs: figureBlock.block.source_refs,
      captionPointer: `/prose/${figureBlock.index + 1}`,
      captionText: caption.text,
      referencePointer: `/prose/${referencedProse[0].index}/text`,
      completeAuthoritativeTextInSpec: true,
    })
  }
  assert.deepEqual(spec.objects.filter(item => item.type === 'text').map(item => item.text),
    ['Particle motion', 'Wave propagation'])
  assert(spec.objects.filter(item => item.type === 'point').length === 0)
  const arrows = spec.objects.filter(item => item.type === 'arrow')
  assert.equal(arrows.length, 3)
  for (const arrow of arrows) {
    assert(spec.assertions.some(item => item.type === 'connects' && item.arrow === arrow.id))
  }
  if (id === 'fig-66') {
    const segments = spec.objects.filter(item => item.type === 'segment')
    assert.equal(segments.length, 80)
    const vertices = [segments[0].from, ...segments.map(item => item.to)]
    assert.equal(vertices.filter(item => Math.abs(item[1] - 150) < 1e-6).length, 3)
    assert.equal(vertices.filter(item => Math.abs(item[1] - 250) < 1e-6).length, 1)
    assert.equal(vertices.filter(item => Math.abs(item[1] - 50) < 1e-6).length, 1)
    assert.deepEqual(vertices[20], [361, 250])
    assert.deepEqual(vertices.at(-1), arrows[0].from)
    assert(arrows[0].to[0] < arrows[0].from[0])
    assert(arrows[1].to[1] > arrows[1].from[1])
    assert(arrows[2].to[1] < arrows[2].from[1])
    assert(spec.assertions.some(item => item.id === 'f66-perpendicular' && item.type === 'perpendicular'))
  } else {
    assert.equal(spec.objects.filter(item => item.type === 'segment').length, 0)
    assert(arrows[0].to[0] > arrows[0].from[0])
    assert(arrows[1].to[0] < arrows[1].from[0])
    assert(arrows[2].to[0] > arrows[2].from[0])
    assert(arrows.every(item => item.from[1] === 150 && item.to[1] === 150))
    assert(spec.assertions.some(item => item.id === 'f67-parallel' && item.type === 'parallel'))
  }

  const snapshots = read(path.join(dir, 'snapshots.json'))
  for (const snapshot of snapshots.snapshots) check(snapshot)
  check(snapshots.svg)
  const visualPaths = [
    path.join(dir, `${id}.png`),
    path.join(dir, 'snapshots', `${id}-310.png`),
  ]
  for (const [index, filename] of visualPaths.entries()) {
    const bytes = fs.readFileSync(filename)
    assert.equal(bytes.readUInt32BE(16), index === 0 ? 640 : 310)
    opened.push({
      sequence: opened.length + 1, ...bind(filename),
      role: index === 0 ? 'repair-native-desktop-640' : 'repair-raster-mobile-310',
      tool: 'functions.view_image', firsthandObserved: true,
      purpose: 'author source-fidelity/readability observation only',
    })
  }
  const observations = id === 'fig-66' ? [
    'The native 640px candidate and 310px raster were both actually opened. Both show one leftward propagation head and no rightward propagation head.',
    'The waveform rises from the baseline into one crest, crosses once internally into one trough, and returns to the same baseline at the right tail. The vertical two-ended motion arrow passes through the crest and baseline intersection.',
    'The upper vibration head meets the crest; the lower head is below the baseline. The perpendicular relationship is clear at both inspected sizes.',
    'Both English labels remain complete, visible and separated from strokes. No point dots, grid, numerical values, units, extra subparts, cultural symbols, answers or added explanatory artwork appear.',
  ] : [
    'The native 640px candidate and 310px raster were both actually opened. Both show one rightward propagation head and a shorter left/right two-ended vibration arrow on the left part of the same baseline.',
    'The two directions remain visibly parallel and collinear; no vertical arrow, waveform, spring, compression array or visible particle marker was added.',
    'The English Particle motion label is above the short left-side arrow and Wave propagation is above the right part of the line; both are readable and complete at 310px.',
    'No point dots, grid, numerical values, units, extra subparts, cultural symbols, answers or added explanatory artwork appear. Blank canvas margin comes from the existing minimum-height contract, not a new instructional feature.',
  ]
  const authorReview = write(`${id}/author-review.json`, {
    schema: 'ld-s10y-image/author-visual-review@1',
    figure: id, status: 'pass', reviewerRole: 'author-not-independent',
    source: bind(path.join(workspace, spec.source.image.path)),
    sourceInventory: inputs.sourceInventory,
    spec: bind(specPath), render: bind(renderPath), svg: bind(svgPath),
    inspectedImages: visualPaths.map(bind),
    observations, sourceFactGroupsCompared: source.facts.map(item => item.id),
    completeBilingualContext: textBindings,
    assertionAndDisplayChecks: 'pass',
    minimumMeasuredLabelPx: Math.min(...render.displayChecks.map(item => item.measuredMinPx)),
    canonicalPromotion: false, wholeCardApproval: false,
    independentReview: 'pending',
  })
  const reviewPath = path.join(dir, `${id}.review.json`)
  assert(!fs.existsSync(reviewPath))
  const args = [
    path.join(skill, 'scripts/record_review.py'),
    '--spec', specPath, '--render', renderPath, '--output', reviewPath,
    '--status', 'pass', '--notes',
    `AUTHOR PASS ONLY. Original canonical PNG opened firsthand before FigureSpec; compared with complete current repaired ZH/EN lesson text and native 640px plus mobile 310px candidate. Source relationships and English labels preserved; all native declared-width checks pass. One objectCount field repair, no geometry changes; initial schema failures preserved. Independent review remains PENDING. Offline unpromoted candidate, not whole-card or publication approval. Detailed author evidence: ${authorReview.path} SHA256 ${authorReview.sha256}.`,
  ]
  const result = spawnSync('python3', args, {
    cwd: workspace, encoding: 'utf8',
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  })
  const receipt = write(`${id}/review-command.json`, {
    executable: 'python3', args, cwd: workspace, exitCode: result.status,
    stdout: result.stdout ?? '', stderr: result.stderr ?? '',
    error: result.error?.message ?? null,
  })
  assert.equal(result.status, 0, 'Native author-review recording failed.')
  figures.push({
    id, status: 'AUTHOR-PASS-INDEPENDENT-PENDING',
    mode: 'deterministic', purpose: 'instructional',
    initialStatus: 'fail', initialFailures: diagnosis.failures,
    targetedRepairs: 1, currentFailures: [],
    source: bind(path.join(workspace, spec.source.image.path)),
    spec: bind(specPath), render: bind(renderPath), svg: bind(svgPath),
    review: bind(reviewPath), authorReview, reviewCommand: receipt,
    nativePng: bind(visualPaths[0]), snapshots: bind(path.join(dir, 'snapshots.json')),
    bilingualReferences: textBindings, display: spec.display,
    independentReview: 'pending', canonicalPromotion: false, wholeCardApproval: false,
  })
}

assert.equal(opened.length, 6)
write('image-ledger.json', {
  schema: 'ld-s10y-image/bounded-image-ledger@1',
  maximum: 8, imagesOpenedIntoModelContext: opened.length, opened,
  imagePayloadsInFinalResponse: false,
  snapshotRasterizationCreatesNoModelImageOpens: true,
  initialSchemaFailuresHadNoRenderImages: true,
  furtherRepairsAllowed: 0,
})
write('candidate-contracts.json', {
  schema: 'ld-s10y-image/offline-author-candidates@1',
  ticket: 'STEMROBIN-181', book: '10p', lesson: 'phy10-c1-s5-n37',
  figures: figures.map(figure => ({
    id: figure.id, mode: figure.mode,
    svg: figure.svg, render: figure.render, review: figure.review, spec: figure.spec,
    languagePolicy: 'Shared English-label instructional SVG for zh and en.',
    bilingualReferences: figure.bilingualReferences,
    display: figure.display, independentReview: 'pending',
  })),
  candidateMetadataOnly: true, canonicalPromotion: false, wholeCardApproval: false,
})
for (const binding of [
  ...Object.values(inputs.authoritative), inputs.sourceInventory, ...inputs.sources, ...inputs.tools,
]) check(binding)
const files = directory => fs.readdirSync(directory, { withFileTypes: true })
  .flatMap(entry => {
    const filename = path.join(directory, entry.name)
    assert(!entry.isSymbolicLink(), 'Do not bind mutable scratch symlinks.')
    return entry.isDirectory() ? files(filename) : [filename]
  })
const outputs = files(owned).sort().map(bind)
const freeze = write('author-freeze.json', {
  schema: 'ld-s10y-image/immutable-author-freeze@1',
  ticket: 'STEMROBIN-181', book: '10p', lesson: 'phy10-c1-s5-n37',
  status: 'AUTHOR-PASS-INDEPENDENT-PENDING',
  scope: 'Only concrete modern author candidates for original fig-66 and fig-67.',
  inputs: inputs.authoritative, sourceInventory: inputs.sourceInventory, sources: inputs.sources,
  rendererAndContractBindings: inputs.tools,
  figures, allOwnedOutputs: outputs,
  repairPolicy: {
    batchRepairRounds: 1,
    cause: 'Initial author objectCount used value, not count.',
    onlyChangedFields: 'objectCount.value -> objectCount.count; counts unchanged.',
    allInitialFailuresPreserved: true,
    secondAttemptPassedBothFigures: true,
    additionalRepairsAllowed: 0,
  },
  imageLedger: bind(path.join(owned, 'image-ledger.json')),
  imagesOpened: 6, maximumImages: 8,
  inheritedGates: {
    SOURCE: 'PASS-consumed-not-replayed',
    RAW: 'PASS-consumed-not-replayed',
    affectedSCIAndZHEN: 'PASS-affected-only-consumed-not-replayed',
  },
  noScratchSourceDependency: true,
  candidateMetadataMayNameUnpromotedOwnedFiles: true,
  wholeCardApproval: false, independentReview: 'pending', canonicalPromotion: false,
  prohibitedOperationsPerformed: {
    setupOrUpdate: 0, grill: 0, backend: 0, database: 0, git: 0,
    appServerOrAppBrowser: 0, charterEdits: 0, dependencyEdits: 0,
    canonicalEdits: 0, svgHandEdits: 0, sourceReaudits: 0,
  },
  immutablePolicy: 'Created exclusively, content-hash bound, chmod 0444; never overwrite. Hash is returned separately because a file cannot hash itself.',
})
for (const binding of outputs) check(binding)
for (const filename of [...outputs.map(item => item.path), freeze.path]) fs.chmodSync(filename, 0o444)
assert.equal(fs.statSync(freeze.path).mode & 0o222, 0)
console.log(JSON.stringify({
  status: 'AUTHOR-PASS-INDEPENDENT-PENDING', freeze,
  imagesOpened: 6, immutableOutputCount: outputs.length,
  figures: figures.map(item => ({
    id: item.id, status: item.status, initialFailures: item.initialFailures,
    currentFailures: item.currentFailures, svg: item.svg,
  })),
}, null, 2))
