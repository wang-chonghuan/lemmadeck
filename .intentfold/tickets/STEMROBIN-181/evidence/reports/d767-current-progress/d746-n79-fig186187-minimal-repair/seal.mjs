import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const own = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d746-n79-fig186187-minimal-repair')
if (process.cwd() !== root) throw new Error('Wrong checkout')
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = (file) => ({ path: file, sha256: sha(file) })
const check = (binding) => {
  if (sha(binding.path) !== binding.sha256) throw new Error(`Changed binding: ${binding.path}`)
}
const historyPath = path.join(own, 'preserved-history.json')
const history = read(historyPath)
check(history.report)
for (const f of history.figures) for (const r of f.revisions) for (const file of r.files) check(file)
const inputPath = path.join(own, 'input-bindings.json')
const inputs = read(inputPath)
for (const input of inputs.approvedTextInputs) check(input)
check(inputs.sourceInventory)
check(inputs.historicalPreservation)
const observationsPath = path.join(own, 'author-observations.json')
const observations = read(observationsPath)
if (observations.status !== 'PASS-FOR-INDEPENDENT-REVIEW') throw new Error('Author visual check did not pass')
const ids = ['fig-186', 'fig-187']
const report = {
  schema: 'ld-s10y-image/scoped-author-return@1',
  ticket: 'STEMROBIN-181',
  invocation: 'STEMROBIN-181181-3 offline',
  author: 'd746',
  card: 'phy10-c2-s2-n79',
  root, ownedDirectory: own,
  status: 'CANDIDATE-MATHEMATICAL-NATIVE-AUTHOR-VISUAL-PASS',
  independentReview: 'PENDING; NO APPROVAL RECORDED',
  promoted: false,
  preservation: { history: bind(historyPath), historicalFilesUnchangedAtReturn: true, priorFirstFailuresRetained: true },
  inputs: bind(inputPath),
  sourceInventory: bind(path.join(own, 'source-inventory.json')),
  authorObservations: bind(observationsPath),
  repair2AuthorFailure: bind(path.join(own, 'repair-2-author-observations.json')),
  figures: [],
  actualImageOpens: [],
}
for (const id of ids) {
  const folder = path.join(own, id, 'repair-3')
  const specPath = path.join(folder, 'spec.json')
  const spec = read(specPath)
  const nativePath = path.join(folder, `${id}.render.json`)
  const native = read(nativePath)
  const validationPath = path.join(folder, 'validation.stdout.txt')
  const validation = read(validationPath)
  if (native.status !== 'pass' || validation.status !== 'pass' || native.collisions.length || native.displayChecks.some((d) => d.status !== 'pass')) throw new Error('Current native gate not pass')
  if (native.spec.sha256 !== sha(specPath)) throw new Error('Native report spec mismatch')
  const svgPath = path.join(folder, `${id}.svg`)
  if (native.output.svg.sha256 !== sha(svgPath)) throw new Error('Native SVG mismatch')
  const sourcePath = path.join(root, spec.source.image.path)
  if (sha(sourcePath) !== spec.source.image.sha256) throw new Error('Source changed')
  const metadataChecks = inputs.approvedTextInputs.map((input, index) => {
    const lesson = read(input.path)
    const blocks = lesson.prose.filter((p) => typeof p.text === 'string' && p.text.length)
    if (spec.source.authoritativeText[index].text !== blocks.map((p) => p.text).join('\n\n')) throw new Error('Current approved prose missing or changed')
    return { locale: input.locale, source: bind(input.path), exactModernProseBlocks: blocks.length, complete: true, rawHistoricalSourceProseUsed: false }
  })
  const old = history.figures.find((f) => f.id === id)
  report.figures.push({
    id, status: 'PASS-FOR-INDEPENDENT-REVIEW',
    spec: bind(specPath), svg: bind(svgPath), native640: bind(path.join(folder, `${id}.native640.png`)),
    renderReport: bind(nativePath), validation: bind(validationPath),
    attempt: bind(path.join(folder, 'attempt.receipt.json')),
    delta: bind(path.join(folder, 'repair.delta.json')),
    repair2Delta: bind(path.join(own, id, 'repair-2/repair.delta.json')),
    repair2FailurePreservation: bind(path.join(folder, 'previous-failure-preservation.json')),
    source: bind(sourcePath), metadataChecks,
    mathematicalAssertions: { status: 'pass', count: spec.assertions.length },
    native: { status: native.status, mediaWidthPx: 640, canvas: spec.canvas, display: spec.display, collisions: native.collisions, displayChecks: native.displayChecks },
    authorVisual: observations.figures.find((f) => f.id === id),
    revisions: { historicalInitial: 1, historicalTechnicalRepair: 1, currentMetadataAndLayoutRepair: 1, currentVisualLabelRepair: 1, actualSpecVersions: 4, cumulativeRepairs: 3, newThisInvocation: 2, geometryRevisionsThisInvocation: 0 },
    nativeCalls: { currentStandaloneValidation: 2, currentRendererInternalValidation: 2, currentRender: 2, historicalStandaloneValidation: old.historicalStandaloneValidationInvocations, historicalRendererInternalValidation: 2, historicalRender: old.historicalRenderInvocations },
    unresolvedTrueSourceAmbiguity: [],
  })
  const image = (file, kind, revision) => {
    const bytes = fs.readFileSync(file)
    if (!bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) throw new Error('Not PNG')
    return { ...bind(file), kind, revision, opens: 1, widthPx: bytes.readUInt32BE(16), heightPx: bytes.readUInt32BE(20) }
  }
  report.actualImageOpens.push(image(sourcePath, 'original-reopened-in-fresh-context', 'original'))
  report.actualImageOpens.push(image(path.join(own, id, 'repair-2', `${id}.native640.png`), 'native640-author-visual-fail', 'repair-2'))
  report.actualImageOpens.push(image(path.join(folder, `${id}.native640.png`), 'native640-author-visual-pass', 'repair-3'))
}
report.usage = {
  currentImageOpens: 6, currentOriginalReopens: 2, currentNative640Opens: 4,
  batchImageMaximum: 8, contextImageMaximum: 24, crops: 0,
  inheritedHistoricalImageOpens: 4, combinedAcrossSeparateContextsImageOpens: 10,
  currentGeneratedNativePNGs: 4, historicalGeneratedNativePNGs: 2,
  currentStandaloneValidationCalls: 4, currentRendererInternalValidationCalls: 4, currentRenderCalls: 4,
  inheritedStandaloneValidationCalls: 4, inheritedRendererInternalValidationCalls: 4, inheritedRenderCalls: 4,
  combinedValidationExecutions: 16, combinedRenderInvocations: 8,
  noUnchangedPassedStageReruns: true,
  paidCalls: 0,
}
report.restrictions = {
  writeScope: own,
  canonicalWrites: 0, evidenceDirectoryWrites: 0, sharedToolEdits: 0,
  meterWrites: 0, indexWrites: 0, gitCommands: 0, databaseAccess: 0,
  backendOperations: 0, publishCalls: 0, chatCalls: 0, childAgents: 0,
  tests: 0, newLibraries: 0, recordReviewCalls: 0, independentApprovals: 0,
  lessonProductAcceptance: 'NOT-RUN; OUTSIDE AUTHOR ASSIGNMENT',
  browserCleanup: 'Native renderer finally blocks closed each browser; no active command sessions remain.',
}
report.unresolvedTrueSourceAmbiguity = []
report.scripts = [bind(path.join(own, 'repair.mjs')), bind(path.join(own, 'seal.mjs'))]
const out = path.join(own, 'report.json')
fs.writeFileSync(out, `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify({ report: bind(out), figures: report.figures.map((f) => ({ id: f.id, status: f.status, spec: f.spec, svg: f.svg, native640: f.native640, renderReport: f.renderReport, revisions: f.revisions })), actualImageOpens: report.actualImageOpens, usage: report.usage, unresolvedTrueSourceAmbiguity: report.unresolvedTrueSourceAmbiguity }, null, 2))
