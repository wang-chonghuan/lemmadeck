import fs from 'node:fs'
import path from 'node:path'
import { W, A, F, T, editions, id, load, hash, save } from './receipt.mjs'

const target = path.join(A, 'author-freeze.json')
if (fs.existsSync(target)) throw new Error('Author already frozen; stop')
const artifact = p => ({ path: p, sha256: hash(p) })
const textInventory = load(path.join(A, 'text-inventories.json'))
const figureInventory = load(path.join(A, 'figure-inventories-final.json'))
const primary = load(path.join(A, 'primary-reading.json'))
for (const reference of primary.references) {
  if (reference.httpStatus !== 200 || !reference.passages.length ||
      hash(reference.stdout.path) !== reference.stdout.sha256) {
    throw new Error('Primary reading evidence drifted')
  }
}
for (const candidate of figureInventory.figures) {
  for (const key of ['spec', 'svg', 'render']) {
    if (hash(candidate[key].path) !== candidate[key].sha256) throw new Error('Figure drift')
  }
  if (fs.existsSync(candidate.spec.path.replace('.spec.json', '.review.json'))) {
    throw new Error('Unexpected independent review file')
  }
}
for (const lesson of textInventory.lessons) {
  if (hash(lesson.template.path) !== lesson.template.sha256) throw new Error('Text drift')
}
const imagePaths = [
  ['source', path.join(W, 'ssot-resources/soviet10year-textbooks/artifacts/10p/figures/fig-34.png')],
  ['source', path.join(W, 'ssot-resources/soviet10year-textbooks/artifacts/10p/figures/fig-35.png')],
  ['specific-failure', path.join(F, 'previews/fig-35-full-final.png')],
  ['full-final', path.join(F, 'previews/fig-34-full-final.png')],
  ['full-final', path.join(F, 'previews/fig-35-full-repaired.png')],
  ['mobile-final', path.join(F, 'previews/fig-34-331.png')],
  ['mobile-final', path.join(F, 'previews/fig-35-331.png')],
]
save(path.join(A, 'image-ledger.json'), {
  schema: 'STEMROBIN-181/actual-author-image-usage@1',
  role: 'author', countingRule: 'Every image loaded into this author context, including any reopen.',
  batches: [{ id: 'n22-author-1', planned: 6, actual: 7, limit: 8 }],
  entries: imagePaths.map(([kind, p], index) => ({
    ordinal: index + 1, kind, ...artifact(p), loadCount: 1, reopened: false,
  })),
  contextTotal: 7, contextLimit: 24, sourcePageOpens: 0,
  sourceFigureOpens: 2, sourceFigureReopens: 0, contactSheets: 0,
  specificFindingExtraLoads: 1, remainingInBatch: 1,
  waitingOrSmallerImagesUsedToResetCount: false,
})
const receiptFiles = fs.readdirSync(path.join(A, 'receipts'))
  .filter(n => n.endsWith('.json')).sort()
const receipts = receiptFiles.map(n => ({
  ...artifact(path.join(A, 'receipts', n)),
  data: load(path.join(A, 'receipts', n)),
}))
const nativeRenderCalls = receipts.filter(r =>
  r.data.command?.some(v => v.endsWith('/render_spec.mjs')))
const currentReports = [
  path.join(F, 'native/fig-34.context-final.render.json'),
  path.join(F, 'native/fig-35.label-repair.render.json'),
]
const nativeRenders = currentReports.map(p => {
  const report = load(p)
  if (report.status !== 'pass' || report.collisions.length ||
      report.displayChecks.some(t => t.status !== 'pass' || t.measuredMinPx < 16)) {
    throw new Error('Current native render not mechanically valid')
  }
  return { ...artifact(p), status: report.status, displayChecks: report.displayChecks }
})
const usage = {
  schema: 'STEMROBIN-181/author-actual-usage@1',
  role: 'author', completeCoursesAdded: 0, sourceReassembly: 0, prepareCalls: 0,
  sourceReviews: 0, independentReviews: 0, selfApprovalFiles: 0,
  adaptationsFinalized: 0, offlineLessonRenders: 0, promotions: 0,
  publishers: 0, databaseCalls: 0, appCalls: 0, gitCalls: 0, worktreeCalls: 0,
  sharedIndexWrites: 0, sharedMeterReadsOrWrites: 0, otherChatMessages: 0,
  cloudCalls: 0, paidCalls: 0, generatedArtworkCalls: 0,
  packageInstalls: 0, dependencyManifestChanges: 0,
  ownScratchRuntimeDependencyLinks: 1, copiedUnmodifiedNativeToolFiles: 3,
  primaryPageReads: 2, nativeRenderAttempts: nativeRenderCalls.length,
  nativeRendererLaunches: nativeRenderCalls.filter(r => r.data.exitCode !== 1).length,
  nativeRenderPassReceipts: nativeRenderCalls.filter(r => r.data.exitCode === 0).length,
  nativeRenderFailedWithValidOutput: 1,
  nativeRenderStartupFailuresBeforeImage: 1,
  textValidatorWholeCandidateCalls: 1,
  textValidatorLocalizedRRepairCalls: 1,
  nativeBareSubscriptAliasAttempts: 0,
  nativeHeldBareSubscriptRechecks: 0,
  contentTextRevisionRounds: 2,
  figureSpecOptionalFieldRepairRounds: 1,
  figureVisualCompositionRepairRounds: 1,
  affectedFigure34ContextRefreshRenders: 1,
  sourcePageOpens: 0, imageContextLoads: 7,
  failuresPreserved: receipts.filter(r => r.data.exitCode !== 0).map(r => r.path),
  countersNotReset: true,
  externallyMeteredTokensOrCost: 'Not queried or invented; shared meter is outside author scope.',
}
if (nativeRenderCalls.length !== 5) throw new Error('Unexpected native render ledger count')
save(path.join(A, 'actual-usage.json'), usage)
save(path.join(A, 'author-observations.json'), {
  schema: 'STEMROBIN-181/author-observations@1',
  role: 'author, not independent reviewer',
  status: 'AUTHORED-FROZEN-INDEPENDENT-REVIEW-PENDING',
  text: 'Complete bilingual prose, exact source math/data/references, no new questions; ideal-ohmic assumptions and resistance/RMS terminology are explicitly distinguished. Primary causal/approximation qualifications are grounded in actual retained university passages.',
  figures: [
    { id: 'fig-34', observation: 'Original resistor, connected upper/lower wires, separated slashed terminals and amplitude voltage label retained; no source/switch/ground icon or guessed value added.' },
    { id: 'fig-35', observation: 'Single shared frame, origin/time and u_R/i_R labels, two same-phase thin/thick solid curves, three shared zero crossings, aligned extrema and original qualitative right truncations retained. Native top-label repair inspected at full and 331 px.' },
  ],
  labelLanguage: 'English/math only; source amplitude subscript visual Latin m alias in Figure 34 is explicitly declared and does not modify lesson math.',
  finalPreviewMediaChecks: load(path.join(A, 'native-binding-and-previews.json')).previews,
  productAcceptanceClaimed: false,
})
const lessonTemplates = editions.map(name => ({
  edition: name,
  lesson: artifact(path.join(T, name, 'lessons', id, 'lesson.template.json')),
  exercises: artifact(path.join(T, name, 'lessons', id, 'exercises.template.json')),
  figures: artifact(path.join(T, name, 'lessons', id, 'figures.template.json')),
}))
const holds = [{
  id: 'N22-BARE-CYRILLIC-AMPLITUDE-REPRESENTATION',
  classification: 'native tool/representation contract, not a scientific/source-content HOLD',
  status: 'unresolved',
  affectedEditions: editions,
  affectedBlocks: ['lesson.prose[4]', 'lesson.prose[5]', 'lesson.prose[9]'],
  exactRetainedEquations: [
    '$u=U_м\\cos\\omega t$',
    '$i=\\frac{u}{R}=\\frac{U_м\\cos\\omega t}{R}=I_м\\cos\\omega t$',
    '$I_м=\\frac{U_м}{R}$',
  ],
  receipt: artifact(path.join(A, 'receipts/text-validate-readonly.json')),
  relevantStdout: artifact(path.join(A, 'receipts/text-validate-readonly.stdout.txt')),
  nativeContract: {
    path: path.join(W, '.claude/skills/ld-s10y-lesson/tools/edition.py'),
    sha256: hash(path.join(W, '.claude/skills/ld-s10y-lesson/tools/edition.py')),
    mathSignature: 'Aliases upright \\mathrm{м} and \\mathrm{н}, not bare _м.',
    validateText: 'Unconditionally searches modern text for the Cyrillic range and rejects these three blocks.',
  },
  prohibitedWorkaroundsNotUsed: [
    'No raw source math substitution or source reassembly.',
    'No invented erratum or bare subscript conversion in authored lesson equations.',
    'No validator weakening, parent/shared skill edit, or repeat attempt on held blocks.',
  ],
  unaffectedFrozenStages: [
    'Complete authored ZH/EN text and current exact-math inventories.',
    'Both source-pixel figure inventories, final deterministic specifications/SVGs, native mechanical reports and full/mobile previews.',
    'Actual primary reading passages and failure/runtime/usage receipts.',
  ],
  dependencyBlocked: 'Parent adaptation finalization and offline lesson rendering must wait for authorized resolution of this representation contract and required independent approvals.',
}]
function filesBelow(root) {
  return fs.readdirSync(root, { withFileTypes: true }).flatMap(entry => {
    const p = path.join(root, entry.name)
    if (entry.isSymbolicLink()) return []
    if (entry.isDirectory()) return filesBelow(p)
    return entry.isFile() && p !== target ? [artifact(p)] : []
  })
}
const evidence = filesBelow(A)
const figureArtifacts = filesBelow(F)
save(target, {
  schema: 'STEMROBIN-181/first-modern-author-freeze@1',
  ticket: 'STEMROBIN-181', batch: 'D057', authorAssignment: 'D1816 D057 n22',
  book: '10p', lesson: id, role: 'FIRST MODERN AUTHOR ONLY',
  status: 'AUTHOR-FROZEN-REPRESENTATION-HOLD-INDEPENDENT-REVIEW-PENDING',
  frozenAt: new Date().toISOString(), freezeCount: 1,
  execution: { cwd: W, command: ['node', path.join(A, 'freeze.mjs')] },
  authority: {
    commentId: '830251c5-4c6f-48af-9bae-6e3a22118c80',
    readLiveByParentThisContext: 'As supplied by the direct human instruction; no author backend reread.',
    finish: 'review', grill: 'self', noOtherLessonHoldInherited: true,
  },
  ownership: [
    A,
    ...editions.map(n => path.join(T, n, 'lessons', id)),
    F,
  ],
  sourceReuse: artifact(path.join(W, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d057-n22-source-reuse/bindings.json')),
  sourceBoundary: textInventory.boundary,
  lessonTemplates,
  originalPNGs: imagePaths.filter(([kind]) => kind === 'source').map(([, p]) => artifact(p)),
  figureCandidates: figureInventory.figures,
  currentNativeRenders: nativeRenders,
  previews: imagePaths.filter(([kind]) => kind === 'full-final' || kind === 'mobile-final')
    .map(([kind, p]) => ({ kind, ...artifact(p) })),
  primaryReading: artifact(path.join(A, 'primary-reading.json')),
  textInventories: artifact(path.join(A, 'text-inventories.json')),
  pixelInventories: artifact(path.join(F, 'pixel-inventory.json')),
  finalFigureInventories: artifact(path.join(A, 'figure-inventories-final.json')),
  bilingualContext: artifact(path.join(F, 'bilingual-context-final.json')),
  nativePathBindingReceipt: artifact(path.join(A, 'native-binding-and-previews.json')),
  authorGrill: artifact(path.join(A, 'grill.md')),
  authorObservations: artifact(path.join(A, 'author-observations.json')),
  imageLedger: artifact(path.join(A, 'image-ledger.json')),
  actualUsage: artifact(path.join(A, 'actual-usage.json')),
  usage, holds,
  next: {
    owner: 'parent',
    stage: 'FIRST INDEPENDENT REVIEW',
    instruction: 'Use a fresh independent context to read both complete authored templates, retained primary passages, source PNG inventories and the hash-bound final full/331 px figure previews. No existing n22 modern PASS is claimed. Preserve the native representation HOLD until an authorized owner resolves it; then parent handles reviews, finalization, offline lesson rendering and commit.',
    independentReviewFiles: [], adaptationFinalized: false,
    promoted: false, committed: false, published: false,
  },
  evidenceFiles: evidence,
  figureArtifactFiles: figureArtifacts,
})
console.log(JSON.stringify({
  freeze: target, sha256: hash(target), status: 'AUTHOR-FROZEN',
  templates: lessonTemplates.length, figures: figureInventory.figures.length,
  imageLoads: 7, paidCalls: 0, unresolvedHolds: holds.map(h => h.id),
  next: 'FIRST INDEPENDENT REVIEW BY PARENT',
}, null, 2))
