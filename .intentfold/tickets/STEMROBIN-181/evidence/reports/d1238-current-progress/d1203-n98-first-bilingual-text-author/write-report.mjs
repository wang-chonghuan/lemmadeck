import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const owned = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d1203-n98-first-bilingual-text-author')
const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = (file) => ({ path: file, sha256: hash(file), bytes: fs.statSync(file).size })
const load = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const inventoryPath = path.join(owned, 'source-inventory.json')
const freezePath = path.join(owned, 'FIRST-candidate-freeze.json')
const inventory = load(inventoryPath)
const freeze = load(freezePath)
const native = path.join(owned, 'native')
const checkReceiptPath = path.join(native, 'text-contract-FIRST.receipt.json')
const checkReceipt = load(checkReceiptPath)
const checkPath = checkReceipt.stdout.path
const check = load(checkPath)
assert.equal(checkReceipt.exitCode, 0, 'A failed TEXT check is not ready for independent approval')
assert.equal(check.status, 'pass')
assert.deepEqual(check.errors, [])
assert.equal(check.freezeSHA256, hash(freezePath))
assert.equal(check.sourceInventorySHA256, hash(inventoryPath))
assert.equal(checkReceipt.freeze.sha256, hash(freezePath))
for (const input of freeze.inputs) assert.equal(hash(input.path), input.sha256, input.path)
for (const candidate of freeze.candidates) {
  assert.equal(hash(candidate.current.path), candidate.current.sha256)
  assert.equal(hash(candidate.FIRST.path), candidate.FIRST.sha256)
  assert.equal(candidate.current.sha256, candidate.FIRST.sha256)
}
const receiptPaths = fs.readdirSync(native).filter((name) => name.endsWith('.receipt.json'))
  .map((name) => path.join(native, name))
const commands = receiptPaths.map((file) => ({ receipt: bind(file), ...load(file) }))
const finishedAt = new Date().toISOString()
const usage = {
  schema: 'stemrobin/text-author-usage@1',
  ticket: 'STEMROBIN-181', batch: 'D037', card: inventory.card,
  role: 'FIRST bilingual modern TEXT AUTHOR only', cwd: repo, ownershipRoot: owned, finishedAt,
  authoringRounds: 1, firstFrozenCandidates: 4, preFreezeContentCopyeditingPasses: 0,
  postFreezeContentRevisions: 0, semanticReviewRepairRounds: 0,
  nativeLayoutAuthoringInvocations: commands.filter((command) => command.argv.some((arg) => arg.endsWith('/normalize-layout.py'))).length,
  proseFlowDerivationInvocations: commands.filter((command) => command.argv.some((arg) => arg.endsWith('/prose_flow.mjs'))).length,
  scopedNativeTextValidationInvocations: commands.filter((command) => command.argv.some((arg) => arg.endsWith('/text-check.py'))).length,
  scopedNativeTextValidationFailures: commands.filter((command) =>
    command.argv.some((arg) => arg.endsWith('/text-check.py')) && command.exitCode !== 0).length,
  nativeTextCheck: bind(checkReceiptPath),
  imageContext: { actual: 0, sourceImages: 0, previews: 0, reason: 'Source image already approved/consumed; text-only author scope' },
  openedImages: 0, authoredOrPromotedFigures: 0, externalNetworkCalls: 0,
  externalModelCalls: 0, paidCalls: 0, paidCostUSD: 0,
  sourceTranscriptionCalls: 0, assembleReplays: 0, adaptPrepareReplays: 0,
  adaptFinalizeCalls: 0, fullNativeFinalizations: 0, lessonRenderCalls: 0,
  databaseCalls: 0, publishCalls: 0, gitCommands: 0, gitMutations: 0,
  chatCalls: 0, globalMeterCallsOrEdits: 0, toolOrSkillEdits: 0,
  newWorktrees: 0, serversStarted: 0, dependencyInstalls: 0,
  wholeProjectChecks: 0, intentFoldSetupOrUpdateCalls: 0, activeExecSessions: 0,
  tokens: null, tokenAccounting: 'Runtime token totals not exposed; no fabricated usage.',
  sourceInventory: bind(inventoryPath), FIRSTFreeze: bind(freezePath),
  currentCandidateHashes: freeze.candidates.map((candidate) => ({
    locale: candidate.locale, kind: candidate.kind, sha256: candidate.current.sha256,
  })),
  completeCard: false, semanticReview: 'pending',
}
const usagePath = path.join(owned, 'usage.json')
fs.writeFileSync(usagePath, JSON.stringify(usage, null, 2) + '\n', { flag: 'wx', mode: 0o444 })
fs.chmodSync(usagePath, 0o444)
const report = {
  schema: 'stemrobin/first-bilingual-text-author-report@1',
  ticket: 'STEMROBIN-181', batch: 'D037', book: '10p', card: inventory.card,
  edition: 'modern-us-neutral', role: 'FIRST bilingual modern TEXT AUTHOR only',
  status: 'FIRST-TEXT-CANDIDATES-FROZEN-NATIVE-TEXT-PASS-INDEPENDENT-APPROVAL-PENDING',
  cwd: repo, ownershipRoot: owned, finishedAt,
  root: path.join(owned, 'root'), work: path.join(owned, 'work'),
  writableRawAndSeedWork: bind(path.join(owned, 'work/seed-authoring.json')),
  inheritedSourceApproval: 'Approved source requirements hash supplied by the direct user; source image approved/consumed. Neither re-approved by this author.',
  sourceRequirements: bind(inventory.approvedSourceRequirements.path),
  preparation: bind(inventory.preparation.path),
  sourceInventory: bind(inventoryPath),
  sourceInventoryFrozenBeforeSeeds: true,
  sourceBoundary: inventory.boundary,
  excluded: 'p0264#5 and later n99 content; neighboring page blocks are provenance only, never candidate prose/questions.',
  sourceCounts: inventory.sourceCounts,
  rawLesson: bind(path.join(owned, 'root/10p/lessons', inventory.card, 'lesson.json')),
  rawExercises: bind(path.join(owned, 'root/10p/lessons', inventory.card, 'exercises.json')),
  FIRSTFreeze: bind(freezePath), candidates: freeze.candidates,
  sourceAndContractBindings: freeze.inputs,
  counts: check.locales.map((locale) => ({
    locale: locale.locale, proseBlocks: locale.proseBlocks, textBlocks: locale.textBlocks,
    finalTextParagraphs: locale.flow.paragraphs.length,
    exercises: locale.exercises, exactMathTokenCount: locale.mathTokenCount,
    sourceFigureIds: locale.figures,
    sectionBreaks: locale.flow.boundaries.length, resolvedBreaks: locale.flow.resolvedBreaks,
    question5SourceRefs: locale.question5SourceRefs,
    question6To8SourceRefs: locale.question6To8SourceRefs,
  })),
  preserved: [
    'All literal source_text snapshots, source.path/source.sha256/source.data, prose order, source_refs, printed identities and original figure/caption blocks.',
    'Collinear frame assumptions: coincident X/X_1 and parallel Y/Y_1, Z/Z_1; v_1, v and v_2 retain their source roles.',
    'All 35 math tokens in exact source order per locale, including equation (8.6), both classical small-speed conditions, invariant c, speed bounds and limiting substitution.',
    'Source equations (8.1)/(8.2), their imaginary-value consequence for v>c, and maximum possible interaction-transmission speed.',
    'All eight original questions, complete Q5 with p0264#1 and Q6-Q8, original numbers/groups/pages, with no tasks, choices, answers or solutions invented.',
    'Figure 226 body reference and caption; no figure bytes generated, promoted or visually rechecked.',
  ],
  authorClarificationsForPendingSemanticReview: [
    'Classical addition is a low-speed approximation requiring BOTH v<<c and v_1<<c.',
    'The source substitution v_1=v=c is explicitly a formal limiting case, not an assertion of a realizable light-speed inertial frame.',
    'English body/caption prose is localized; printed_title, figure metadata labels, group identities and all provenance remain literal source identities.',
  ],
  sectionBreakDerivation: {
    result: bind(path.join(owned, 'work/section-boundary-derivation.json')),
    method: 'Actual native prose_flow adjacent before/after anchors, copied without hand-counted integer indices.',
    outputs: ['zh', 'en'].map((locale) => bind(path.join(native, `${locale}-prose-flow-derive.stdout.txt`))),
  },
  nativeTextCheck: {
    status: check.status, receipt: bind(checkReceiptPath), result: bind(checkPath),
    exitCode: checkReceipt.exitCode, freezeBoundBeforeExecution: checkReceipt.freeze,
    nativeAPIs: check.nativeAPIs, errors: check.errors,
    katexCheckedTokens: check.katex.length, katexWarnings: check.katexWarnings,
    adaptedFrom: check.adaptedFrom,
    adaptation: 'Own-scoped invocation of d1090 native APIs; replace zero-question assertions with complete eight-question/source inventory checks.',
  },
  actualScopedCommands: commands,
  usage: bind(usagePath),
  ownershipNote: 'All created files and bytecode/write destinations are below ownershipRoot. Sole cwd honored. No Git/status, DB, paid, network, chat, global-meter, shared-tool or skill edits.',
  imageContext: { actual: 0, status: 'approved/consumed; no images opened' },
  semanticReview: 'pending', independentModernReview: false,
  fullNativeFinalization: false, completeCard: false,
  readyForIndependentTextSemanticReview: true,
  pending: ['Independent bilingual text semantic approval', 'Any separately authorized later figure/finalize/render/publication stages'],
}
const reportPath = path.join(owned, 'report.json')
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n', { flag: 'wx', mode: 0o444 })
fs.chmodSync(reportPath, 0o444)
for (const file of fs.readdirSync(native)) fs.chmodSync(path.join(native, file), 0o444)
console.log(JSON.stringify({
  status: report.status, report: bind(reportPath), usage: bind(usagePath),
  sourceInventory: bind(inventoryPath), FIRSTFreeze: bind(freezePath),
  nativeTextReceipt: bind(checkReceiptPath), candidates: freeze.candidates,
}, null, 2))
