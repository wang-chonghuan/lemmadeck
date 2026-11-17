import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const own = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(own, '../../..')
const ticket = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp')
const finalPath = path.join(ticket, 'd031-n114-figures-a-author-freeze.json')
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: path.resolve(file), sha256: hash(file) })
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const write = (file, value) => {
  assert.ok(file.startsWith(`${own}/`) || file === finalPath)
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}
assert.ok(!fs.existsSync(finalPath), 'Final freeze is immutable')
const preparation = read(path.join(own, 'preparation.json'))
for (const [name, expected] of [
  ['proseFreeze', '200785cc8ef4675b8bc3f233202c5d6c2837781ba28b281757fd287548ed679e'],
  ['independentSCI', '75456eabec7b4a666cd5e00db5b2c7f8791b902f96190f4a5f026cb19e0151b8'],
]) assert.equal(hash(preparation.bindings[name].path), expected)
for (const name of ['chinese', 'english']) {
  assert.equal(hash(preparation.bindings[name].path), preparation.bindings[name].sha256)
}
for (const snapshot of preparation.snapshots) {
  assert.equal(hash(snapshot.snapshot.path), snapshot.snapshot.sha256)
  assert.equal(hash(snapshot.original.path), snapshot.original.sha256)
}
const observations = {
  schema: 'ld-s10y-image/author-pixel-observations@1',
  status: 'pass',
  role: 'figure-author-only',
  independentApproval: false,
  sourcePixelInspection: 'Each durable original was opened once independently; no prior crop inventory or modern FigureSpec supplied the source facts.',
  inspectedNormal640Outputs: [
    {
      figure: 'fig-233', sourceImageOpenSequence: 1, normalOutputOpenSequence: 3,
      source: bind(path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/9p/figures/fig-233.png')),
      output: bind(path.join(own, 'fig-233/repair-1/fig-233.normal-preview-640.png')),
      observations: [
        'Two straight upright wires have clearly separated upper free ends and separate lower leads to the supply.',
        'No current or force arrows are shown. Open circuit and No steady current match the complete authoritative text without claiming absence of electric fields or every possible transient.',
        'Clean generic power-supply rectangle is recognizably a schematic substitution; no degraded source glyph identity, polarity sign, calibration or apparatus control is reproduced.',
        'All three English labels fit, with no overlap or clipping; the native normal640 output is nonblank and readable.',
      ],
    },
    {
      figure: 'fig-234', sourceImageOpenSequence: 2, normalOutputOpenSequence: 4,
      source: bind(path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/9p/figures/fig-234.png')),
      output: bind(path.join(own, 'fig-234/repair-1/fig-234.normal-preview-640.png')),
      observations: [
        'The short upper rectangular wire connects the upper ends; separate lower leads return to the two supply terminals.',
        'The left current arrow points down and the right arrow points up, agreeing with source pixels and the opposite-current prose.',
        'Dashed initial straight positions remain inside the solid outward-displaced wires. Exact vertical facing central sections are visibly parallel; diagonal shoulders make no whole-wire parallelism claim.',
        'Both current arrowheads are prominent; no horizontal force arrow, extra conducting branch, new numeric given or answer-bearing apparatus is added.',
        'All five English labels fit and remain distinct from the geometry; the native normal640 output is nonblank and readable.',
      ],
    },
  ],
  imageAccounting: {
    batchCount: 1, plannedOpens: 4, actualOpens: 4,
    sourceOpens: 2, generatedNormal640Opens: 2, reopens: 0, crops: 0,
    maxBatch: 8, maxContext: 24, sourceOnlyOnePerCall: true,
    uninspectedCapturedPNGsDoNotCountAsOpens: true,
  },
}
write(path.join(own, 'author-pixel-observations.json'), observations)
const recorder = path.join(repo, '.agents/skills/ld-s10y-image/scripts/record_review.py')
const figures = []
for (const id of ['fig-233', 'fig-234']) {
  const out = path.join(own, id, 'repair-1')
  const specFile = path.join(out, 'spec.json')
  const renderFile = path.join(out, 'render.json')
  const widthFile = path.join(out, 'width-preview-report.json')
  const assertionFile = path.join(out, 'author-assertions.json')
  const spec = read(specFile), render = read(renderFile), widths = read(widthFile), assertions = read(assertionFile)
  assert.equal(render.status, 'pass')
  assert.equal(widths.status, 'pass')
  assert.equal(assertions.status, 'pass')
  assert.equal(render.spec.sha256, hash(specFile))
  assert.equal(hash(spec.source.image.path), spec.source.image.sha256)
  const repair = read(path.join(out, 'repair-history.json'))
  assert.equal(repair.repairNumber, 1)
  assert.equal(repair.remainingRepairs, 0)
  assert.equal(hash(repair.initialSpec.path), repair.initialSpec.sha256)
  assert.equal(hash(repair.initialFailure.path), repair.initialFailure.sha256)
  const notes = [
    'AUTHOR SELF-REVIEW ONLY; not independent FIG approval and not permission to promote.',
    'Compared one durable original open with all frozen Chinese and English prose and one normal640 generated output open.',
    id === 'fig-233'
      ? 'Preserves two straight parallel vertical wires, separated upper free ends, separate lower source leads, no current arrows and open-circuit/no-steady-current condition.'
      : 'Preserves top closure, opposite current arrows(left down/right up), outward-displaced solid wires and dashed initial positions; only exact facing central sections are declared parallel.',
    'Degraded power-box glyph identities remain unresolved; labelled generic power supply, regularized routes and English labels are declared modern additions, not source glyph facts.',
    'Native spec/render, all conductive-edge assertions, physical-wire graph and headed native-preview CSS measurements pass. Fixed media640px in mobile358px scroll container; all labels32px and scroll end reachable.',
    'Exactly one targeted repair used; initial failures retained. No answer, source/edition/manifest/app/dependency/DB/charter/shared-output/Git changes.',
  ].join(' ')
  const reviewFile = path.join(out, 'author-review.json')
  const args = [recorder, '--spec', specFile, '--render', renderFile,
    '--output', reviewFile, '--status', 'pass', '--notes', notes]
  const result = spawnSync('python3', args, {
    cwd: repo, encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  })
  write(path.join(own, 'commands', `${id}-record-author-review.json`), {
    command: ['python3', ...args], exitCode: result.status,
    stdout: result.stdout, stderr: result.stderr,
  })
  assert.equal(result.status, 0, result.stdout + result.stderr)
  const review = read(reviewFile)
  assert.equal(review.status, 'pass')
  assert.equal(review.spec.sha256, hash(specFile))
  assert.equal(review.render.sha256, hash(renderFile))
  const assetsFile = path.join(out, 'assets.final.json')
  write(assetsFile, {
    schema: 'ld-s10y-image/author-assets@1', mode: 'deterministic',
    artworkAssets: [], generationCalls: 0,
    sourcePNG: spec.source.image,
    svg: bind(path.join(out, `${id}.svg`)),
    nativePNG: bind(path.join(out, `${id}.native.png`)),
    normal640PNG: bind(path.join(out, `${id}.normal-preview-640.png`)),
    candidateContract: { spec: bind(specFile), render: bind(renderFile), review: bind(reviewFile) },
    status: 'author-pass-not-promoted', independentApproval: false,
    initialAssetsNote: 'Initial draft assets.json declared attempt-local preview paths. This final asset record binds only existing final files; native PNG remains nonpublishable preview evidence.',
  })
  const initialDir = path.join(own, id, 'initial')
  figures.push({
    id, status: 'AUTHOR_PASS_PENDING_INDEPENDENT_FIG_REVIEW',
    mode: 'deterministic', purpose: 'instructional',
    sourcePNG: spec.source.image,
    fullAuthoritativeText: bind(path.join(own, 'inputs/full-authoritative-text.json')),
    sourceInventory: bind(path.join(own, 'source-inventory.json')),
    nativeContext: bind(path.join(out, 'context.native.json')),
    completeContext: bind(path.join(out, 'context.complete.json')),
    assets: bind(assetsFile),
    spec: bind(specFile),
    svg: bind(path.join(out, `${id}.svg`)),
    render: bind(renderFile),
    authorReview: bind(reviewFile),
    nativePNG: bind(path.join(out, `${id}.native.png`)),
    normal640PNG: bind(path.join(out, `${id}.normal-preview-640.png`)),
    authorAssertions: bind(assertionFile),
    geometryAndAdditions: bind(path.join(out, 'geometry.json')),
    widthEvidence: bind(widthFile),
    authorPixelObservations: bind(path.join(own, 'author-pixel-observations.json')),
    nativeSpecValidation: {
      draft: bind(path.join(own, 'commands', `${id}-repair-1-validate-draft.json`)),
      rendered: bind(path.join(own, 'commands', `${id}-repair-1-validate-rendered.json`)),
      status: 'pass',
    },
    display: {
      contract: spec.display, fixedMediaWidthPx: 640, actualMobileContainerWidthPx: 358,
      everyLabelMinimumActualMobilePx: 32, headedDesktop: [1440, 960], headedMobile: [390, 844],
      actualMediaWidths: widths.measurements.map(item => ({
        viewport: item.viewport, mediaWidthPx: item.metrics.actualMediaWidth,
        containerWidthPx: item.metrics.containerWidth, minTextPx: item.metrics.minTextPx,
        scrollEndReachable: item.metrics.reachedScrollEnd, status: item.status,
      })),
      status: 'pass-native-css-artifact-preview-not-running-app-acceptance',
    },
    gateStatuses: { draftValidation: 'pass', renderedValidation: 'pass', render: 'pass',
      connectivityAndArrows: 'pass', widths: 'pass', authorVisual: 'pass',
      independentFIG: 'pending', promotion: 'not-performed' },
    repairHistory: bind(path.join(out, 'repair-history.json')),
    repairCount: 1, remainingRepairs: 0,
    initialFailureRetained: {
      spec: bind(path.join(initialDir, 'spec.json')),
      diagnostic: repair.initialFailure,
      ...(fs.existsSync(path.join(initialDir, `${id}.svg`)) ? {
        svg: bind(path.join(initialDir, `${id}.svg`)),
        nativePNG: bind(path.join(initialDir, `${id}.native.png`)),
        render: bind(path.join(initialDir, 'render.json')),
      } : { renderNotAttemptedBecauseDraftInvalid: true }),
    },
    unknownSourcePixels: read(path.join(own, 'source-inventory.json')).figures.find(item => item.id === id).unknownPixels,
    answerBearingApparatusChanges: false, independentApproval: false,
  })
}
const walk = directory => fs.readdirSync(directory, { withFileTypes: true })
  .flatMap(entry => entry.isDirectory() ? walk(path.join(directory, entry.name)) : [path.join(directory, entry.name)])
const nativeCommands = walk(path.join(own, 'commands')).sort().map(bind)
const payload = {
  schema: 'ld-s10y-image/bounded-author-freeze@1',
  ticket: 'STEMROBIN-181', batch: 'D031', lesson: 'phy9-c2-s5-n114',
  scope: ['fig-233', 'fig-234'], status: 'AUTHOR_PASS_PENDING_INDEPENDENT_FIG_REVIEW',
  ownedRoot: own, freezePath: finalPath,
  completeContextRule: 'Existing native build_context ran on a private root with the exact authoritative English lesson and zero exercises; the full Chinese and English prose is explicitly appended to each context and FigureSpec. No standard shared modern context was available.',
  contextAndProseBindings: preparation.bindings,
  independentSCIStatus: 'PASS-text-only-not-FIG-approval',
  sourceInventory: bind(path.join(own, 'source-inventory.json')),
  fullAuthoritativeText: bind(path.join(own, 'inputs/full-authoritative-text.json')),
  preparation: bind(path.join(own, 'preparation.json')),
  sourceAndToolSnapshots: preparation.snapshots,
  authorPixelObservations: bind(path.join(own, 'author-pixel-observations.json')),
  figures, commands: nativeCommands,
  authoringHelpers: ['author.mjs', 'run-native.mjs', 'repair-once.mjs', 'check-author.mjs', 'freeze-author.mjs']
    .map(file => bind(path.join(own, file))),
  counts: { figures: 2, deterministic: 2, generated: 0, hybrid: 0,
    authorPass: 2, hold: 0, repairs: 2, independentApprovals: 0, promoted: 0 },
  imageAccounting: observations.imageAccounting,
  gateAuthority: {
    authorReviewOnly: true, independentFIGReviewRequired: true,
    nativePNGPreviewOnly: true, promotionPermission: false, modernManifestEdited: false,
    finalOutputContractWhenApproved: 'deterministic SVG + render + independent review + spec; no flattened/native preview PNG promotion',
    fullLessonOfflineAcceptance: 'not-performed-by-this-bounded-figure-author',
  },
  execution: {
    newIntentFoldSetup: 0, sourceWrites: 0, authoritativeProseWrites: 0,
    modernManifestWrites: 0, applicationWrites: 0, dependencyWrites: 0,
    databaseOperations: 0, charterWrites: 0, sharedOutputWrites: 0,
    gitWrites: 0, imageGenerationCalls: 0, publicBrowserOpens: 0,
    headedArtifactPreviews: 4, allBrowsersClosed: true,
    writesLimitedTo: [own, finalPath],
  },
  limitations: [
    'This is a hash-bound author freeze, not fresh independent FIG approval.',
    'Degraded power-box details remain unknown; no guessed glyph identity is claimed.',
    'Native artifact preview CSS and actual media measurements are evidence for sizing, not running-product acceptance.',
    'Both figures consumed the single targeted repair allowance; any further defect is HOLD for parent disposition, with no additional repair in this invocation.',
  ],
  frozenFiles: walk(own).sort().map(bind),
}
write(path.join(own, 'author-freeze.json'), payload)
write(finalPath, payload)
assert.equal(hash(path.join(own, 'author-freeze.json')), hash(finalPath))
const verifyBindings = value => {
  if (!value || typeof value !== 'object') return
  if (typeof value.path === 'string' && typeof value.sha256 === 'string') {
    assert.equal(hash(value.path), value.sha256, `Stale hash binding:${value.path}`)
  }
  Object.values(value).forEach(item => {
    if (Array.isArray(item)) item.forEach(verifyBindings)
    else if (item && typeof item === 'object') verifyBindings(item)
  })
}
verifyBindings(payload)
console.log(JSON.stringify({ counts: payload.counts, imageOpens: payload.imageAccounting.actualOpens,
  freeze: bind(finalPath), recursivelyVerifiedAllPathHashBindings: true }, null, 2))
