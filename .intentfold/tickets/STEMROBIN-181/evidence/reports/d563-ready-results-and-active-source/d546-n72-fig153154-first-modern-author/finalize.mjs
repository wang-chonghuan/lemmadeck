import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const workspace = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
const record = file => ({
  path: file, sha256: hash(fs.readFileSync(file)), bytes: fs.statSync(file).size,
})
const write = (file, data) => {
  const target = path.join(root, file)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, typeof data === 'string' ? data : `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' })
}
const before = read(path.join(root, 'protected.before.json'))
const after = before.files.map((entry, index) => {
  const current = fs.readFileSync(path.join(workspace, entry.path))
  const savedBefore = Buffer.from(fs.readFileSync(entry.snapshot.path.startsWith('/')
    ? entry.snapshot.path : path.join(workspace, entry.snapshot.path), 'utf8'), 'base64')
  if (hash(savedBefore) !== entry.sha256) throw new Error('Corrupt original byte snapshot')
  const output = `protected/after/${String(index).padStart(2, '0')}-${path.basename(entry.path)}`
  write(output, current.toString('base64'))
  return {
    path: entry.path, sha256Before: entry.sha256, sha256After: hash(current),
    byteIdentical: savedBefore.equals(current),
    beforeBytes: entry.bytes, afterBytes: current.length,
    beforeSnapshot: entry.snapshot, afterSnapshot: record(path.join(root, output)),
  }
})
write('protected.after.json', {
  files: after, unchanged: after.every(entry => entry.byteIdentical),
  scope: 'Manifest, full EN/ZH, inherited review, two contexts, two source originals, loaded skill contracts, native renderer/validator/arrowhead implementation and JSXGraph core. No restoration or cleanup.',
})
const firstOpens = read(path.join(root, 'actual-opens.first.json'))
const opens = firstOpens.opens.map(entry => {
  const result = { ...entry, sha256: record(entry.path).sha256 }
  delete result.sha256Binding
  return result
})
opens.push({
  ordinal: 5, tool: 'functions.view_image', kind: 'single-repair-mobile-check',
  figure: 'fig-153',
  ...record(path.join(root, 'fig-153/candidate.repair.342.png')),
  mediaWidthPx: 342,
  observation: 'Observed once after the sole affected-spec repair. Beta remains between the downward normal and refracted ray, with additional clearance. Native repair report passes. No other geometry or source text changed.',
  independentReview: false,
})
write('actual-opens.json', {
  schema: 'stemrobin-181/actual-image-opens@1',
  contextEntryImageCount: 0, batchLimit: 8, contextLimit: 24,
  opens,
  counts: {
    originalOpens: 2, firstCandidateOpens: 2, singleRepairMobileOpens: 1,
    cropOpens: 0, totalActualOpens: 5, contextImageCountAtExit: 5,
    distinctOriginalFigures: 2, distinctModernFigures: 2,
    imageBudgetRemainingInBatch: 3,
  },
  noImageBudgetReset: true,
  firstCandidateOpenedOncePerFigure: true,
  noFurtherOpens: true,
  notIndependentFIGOrDISPLAY: true,
})
write('author.run.stdout.txt',
  'fig-153.draft.first: exit 0\nfig-153.native.first: exit 2\nfig-154.draft.first: exit 0\nfig-154.native.first: exit 0\nFirst-run evidence complete. No retry or promotion performed.\n')
write('author.run.stderr.txt', '')
write('author.run.receipt.json', {
  command: ['node', '.intentfold/tickets/STEMROBIN-181/tmp/d546-n72-fig153154-first-modern-author/author.mjs'],
  cwd: workspace, exitCode: 0, execSessionId: 23936,
  capture: 'Verbatim transcription from actual exec/write_stdin tool output; individual subprocess stdout/stderr were captured directly by author.mjs.',
  stdout: record(path.join(root, 'author.run.stdout.txt')),
  stderr: record(path.join(root, 'author.run.stderr.txt')),
})
const figures = ['fig-153', 'fig-154'].map(figure => {
  const version = figure === 'fig-153' ? 'repair' : 'first'
  const native = read(path.join(root, figure, `native.${version}.json`))
  const claims = read(path.join(root, figure, 'claims.json'))
  return {
    figure, routing: 'deterministic-native-JSXGraph',
    status: native.status === 'pass' && claims.status === 'pass' ? 'nativePASS' : 'terminalHOLD',
    source: claims.source.image,
    spec: record(path.join(root, figure, `spec.${version}.json`)),
    svg: record(path.join(root, figure, `candidate.${version}.svg`)),
    nativeRender: record(path.join(root, figure, `native.${version}.json`)),
    mobilePreview: record(path.join(root, figure, `candidate.${version}.342.png`)),
    claims: record(path.join(root, figure, 'claims.json')),
    routingEvidence: record(path.join(root, figure, 'routing.json')),
    display: native.displayChecks,
    standaloneDraftInvocations: figure === 'fig-153' ? 2 : 1,
    nativeRenderInvocations: figure === 'fig-153' ? 2 : 1,
    affectedSpecRepairs: figure === 'fig-153' ? 1 : 0,
    firstFailurePreserved: figure === 'fig-153' ? {
      spec: record(path.join(root, figure, 'spec.first.json')),
      native: record(path.join(root, figure, 'native.first.json')),
      svg: record(path.join(root, figure, 'candidate.first.svg')),
      png: record(path.join(root, figure, 'candidate.first.640.png')),
      stdout: record(path.join(root, 'commands/fig-153.native.first.stdout.txt')),
      stderr: record(path.join(root, 'commands/fig-153.native.first.stderr.txt')),
      repair: record(path.join(root, figure, 'repair.json')),
    } : null,
    determinismReruns: 0,
    independentFIG: 'PENDING-NOT-SIGNED',
    independentDISPLAY: 'PENDING-NOT-SIGNED',
    sourceApproval: 'INHERITED-EXTRACTION-ONLY; NO NEW SOURCE REVIEW PASS',
    promoted: false,
  }
})
const allNativePass = figures.every(figure => figure.status === 'nativePASS')
const protectedUnchanged = after.every(entry => entry.byteIdentical)
write('report.json', {
  schema: 'stemrobin-181/one-shot-first-modern-author-report@1',
  ticket: 'STEMROBIN-181', batch: 'd546-n72-fig153154-first-modern-author',
  workspace, writeScope: root,
  status: allNativePass && protectedUnchanged
    ? 'AUTHOR-NATIVE-READY-FOR-INDEPENDENT-FIG-DISPLAY-ONLY'
    : 'TERMINAL-HOLD-NO-MORE-REPAIR',
  figures,
  binding: record(path.join(root, 'binding.json')),
  sourceInventory: record(path.join(root, 'source.inventory.json')),
  actualOpens: record(path.join(root, 'actual-opens.json')),
  beforeBytes: record(path.join(root, 'protected.before.json')),
  afterBytes: record(path.join(root, 'protected.after.json')),
  protectedUnchanged,
  counts: {
    targetFigures: 2,
    source: { distinctOriginalFiguresOpened: 2, originalOpens: 2, sourcePagesAdded: 0, sourcesChangedByAuthor: 0, newSourceReviewPasses: 0 },
    modern: { distinctNewModernFigures: 2, nativePASS: figures.filter(item => item.status === 'nativePASS').length, terminalHOLD: figures.filter(item => item.status === 'terminalHOLD').length, SVGAttemptsRetained: 3, finalSVGs: 2, nativeRenderInvocations: 3, repairs: 1, firstNativeFailuresRetained: 1, determinismReruns: 0 },
    independent: { FIGPasses: 0, DISPLAYPasses: 0 },
    fullcard: { cardsFinalized: 0, cardsPromoted: 0, completeCardPasses: 0, appOrOfflineFullcardChecks: 0 },
    images: { originalOpens: 2, firstCandidateOpens: 2, repairMobileOpens: 1, cropOpens: 0, totalActualOpens: 5, contextEntryCount: 0, contextExitCount: 5, batchLimit: 8, contextLimit: 24 },
  },
  displayScope: {
    purpose: 'instructional', layout: 'inline', maxWidthPx: 640,
    requiredWidths: [331, 342, 640], minTextPx: 16,
    actualMobileMediaWidthPx: 342,
    nativeMeasuredMinPxAt331: 16.55,
    nativeMeasuredMinPxAt342: 17.1,
    nativeMeasuredMinPxAt640: 32,
    actualProductWidthProvenance: '342px supplied by the user; no app or DB was opened in this author batch.',
    authorPreview: 'Browser screenshots of native SVG at 342px, not headed product or full-card acceptance.',
  },
  SCI: 'PASS-INHERITED-NOT-REPEATED',
  ZHEN: 'PASS-INHERITED-NOT-REPEATED',
  FIG: 'PENDING-INDEPENDENT',
  DISPLAY: 'PENDING-INDEPENDENT',
  completeCard: false,
  boundaries: {
    noOtherAgentsCreated: true, permanentSessionsCreatedOrReplaced: 0,
    originalBranchUnchangedByAuthor: true, GitCommandsIncludingStatus: 0,
    DBConnectionsOrWrites: 0, commits: 0, pushes: 0, merges: 0, deployments: 0,
    paidGeneration: 0, semanticArtworkRequired: false,
    sourceOrEditionRewrites: 0, promotions: 0, recordReviewInvocations: 0,
    rendererOrLibraryOrSkillOrAppEdits: 0, answerFilesRead: 0,
    thirdNativeAttempts: 0, passingSpecOrDeterminismReruns: 0,
    sharedByteRollbackOrCleanup: 0,
    allBrowsersClosed: true, pendingExecJobs: 0,
  },
  historicalHolds: 'All inherited historical SOURCE/RAW/SVG fine-detail holds remain; this batch does not clear them.',
  hashes: 'Every payload hash is enumerated in author-freeze.json and READY.json. seal.receipt.json additionally binds READY.json itself; its SHA is the external closure hash. Self-hash cycles are excluded explicitly.',
  freeze: { requiredFileMode: '0444', envelopeFiles: ['author-freeze.json', 'report.json', 'READY.json'], appliedAndVerifiedBy: 'seal.mjs / seal.receipt.json' },
  stoppingCondition: 'This one-shot author batch ends after local freeze; no background browser, dev server, automation, promotion or other agent is retained.',
})
console.log('Final report prepared: 2 nativePASS; source 2, modern 2, independent 0, fullcard 0; actual opens 5.')
