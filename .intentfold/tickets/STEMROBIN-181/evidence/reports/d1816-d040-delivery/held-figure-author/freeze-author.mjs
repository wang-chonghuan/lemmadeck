import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const out = path.dirname(fileURLToPath(import.meta.url))
const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = (relative) => JSON.parse(fs.readFileSync(path.join(out, relative), 'utf8'))
const binding = (relative) => {
  const absolute = path.join(out, relative)
  return { path: absolute, sha256: hash(absolute), size: fs.statSync(absolute).size }
}
const snapshot = read('inputs/manifest.json')
const inputIntegrity = snapshot.bindings.map((item) => ({
  source: item.source, snapshot: item.snapshot,
  snapshotSha256: hash(item.snapshot), expectedSha256: item.sha256,
  sourceSha256AtFreeze: hash(item.source),
  snapshotUnchanged: hash(item.snapshot) === item.sha256,
  sourceUnchangedAtFreeze: hash(item.source) === item.sha256,
}))
if (inputIntegrity.some((item) => !item.snapshotUnchanged)) throw new Error('snapshot changed')
const stages = [
  ['fig-245', 'first-candidates'],
  ['fig-245', 'repair-candidate'],
  ['fig-246', 'first-candidates'],
]
const executions = stages.map(([figure, stage]) => {
  const folder = `${stage}/${figure}`
  const bytes = read(`${folder}/candidate.bytes.json`)
  for (const item of bytes.bindings) {
    if (hash(item.file) !== item.sha256) throw new Error(`candidate bytes changed: ${item.file}`)
  }
  const validation = read(`${folder}/validate.receipt.json`)
  const render = read(`${folder}/render.receipt.json`)
  const reportPath = path.join(out, folder, `${figure}.render.json`)
  const report = fs.existsSync(reportPath) ? JSON.parse(fs.readFileSync(reportPath, 'utf8')) : null
  if (report) {
    if (report.spec.sha256 !== hash(path.join(out, folder, 'spec.json'))) throw new Error('report spec hash mismatch')
    const output = path.join(out, folder, `${figure}.svg`)
    if (report.output.svg.sha256 !== hash(output)) throw new Error('report svg hash mismatch')
  }
  return {
    figure, stage,
    draftValidation: { status: validation.status, exitCode: validation.exitCode },
    nativeRender: { status: render.status, exitCode: render.exitCode },
    reportStatus: report?.status || 'not-produced',
    displayChecks: report?.displayChecks || [],
    collisions: report?.collisions || [],
    spec: binding(`${folder}/spec.json`),
    svg: report ? binding(`${folder}/${figure}.svg`) : null,
    renderReport: report ? binding(`${folder}/${figure}.render.json`) : null,
    preview: report ? binding(`${folder}/${figure}.preview.png`) : null,
    failure: !report
      ? 'Native arrow marker aspect-ratio failure before output serialization; no first SVG, PNG or native render report exists.'
      : report.status === 'fail'
        ? 'Number/name label clearance failure for Source, Condenser, Aperture and Lens.'
        : null,
    preservedBytes: binding(`${folder}/candidate.bytes.json`),
  }
})

const imageLedger = [
  [1, 'fig-245', 'original', '.tmp/STEMROBIN-181/d1816/root/10p/figures/fig-245.png',
    '78045bb1b56b2f9c6a9338abc9b6ec216fc70847a91e80bea8a1ace137a1bd42'],
  [2, 'fig-246', 'original', '.tmp/STEMROBIN-181/d1816/root/10p/figures/fig-246.png',
    'a03663c12dde85e35ff54309d2ce07bcbd53e40e29cb117e3a44e16e029a8f4c'],
  [3, 'fig-246', 'generated preview', 'first-candidates/fig-246/fig-246.preview.png'],
  [4, 'fig-245', 'generated repaired preview', 'repair-candidate/fig-245/fig-245.preview.png'],
].map(([ordinal, figure, kind, relative, expected]) => {
  const file = kind === 'original'
    ? path.join('/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck', relative)
    : path.join(out, relative)
  return { ordinal, figure, kind, path: file, sha256: expected || hash(file), opens: 1 }
})
const observations = {
  schema: 'bounded-figure-author/author-preview-observations@1',
  role: 'Author observations only. NOT independent mathematical, visual or cultural review; no review schema or approval.',
  actualImageOpens: 4,
  ledger: imageLedger,
  figures: {
    'fig-245': {
      authorStatus: 'HOLD',
      observed: [
        'All eight numbered symbols and continuous folded optical chain are present.',
        'English labels and both imaging-dependency captions are visible.',
        'The shared axle/coil drawing is explicitly text-supported, not an identification of the unknown dark source assembly.',
        'Native label clearance fails for four stacked number/name pairs despite all text measuring 18px at 640px.',
        'The native arc renders nearly a full circle rather than the intended small opposed-motion arc; this is an unresolved author visual defect, not source hardware.',
      ],
      unresolved: ['Native four-label clearance failure', 'Overlarge rotation arc', 'Source fine aperture and tiny assembly identity remain unknown'],
      repairBudgetExhausted: true,
    },
    'fig-246': {
      authorStatus: 'HOLD',
      observed: [
        'Two source regions, six neutral picture thumbnails, perforations, adjacent soundtrack and circular detail remain visible.',
        'Source, three lens symbols, narrow slit and phototube remain on the optical chain.',
        'Two phototube connections lead to amplifier; the raised cross-region route branches to both speakers around the screen.',
        'Native report passes with no reported collisions and 18px minimum text at 640px.',
        'Descending circuit wires visibly cross the Phototube label. Native collision report does not catch this; mechanical pass is NOT a visual pass.',
      ],
      unresolved: ['Phototube label/wire overlap; requires parent-authorized fresh bounded follow-up'],
      repairsApplied: 0,
    },
  },
  reopens: 0, cropsOpened: 0, imagePayloadsReturnedInFinal: 0,
}
fs.writeFileSync(path.join(out, 'author-observations.json'), `${JSON.stringify(observations, null, 2)}\n`, { flag: 'wx' })

function collect(folder) {
  return fs.readdirSync(folder, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name)).flatMap((entry) => {
    const absolute = path.join(folder, entry.name)
    if (entry.isSymbolicLink()) throw new Error(`unexpected symlink in author directory: ${absolute}`)
    return entry.isDirectory() ? collect(absolute) : [absolute]
  })
}
const files = collect(out).map((file) => {
  fs.chmodSync(file, 0o444)
  return { path: file, sha256: hash(file), size: fs.statSync(file).size, mode: '0444' }
})
const freeze = {
  schema: 'bounded-figure-author/author-freeze@1',
  ticket: 'STEMROBIN-181', batch: 'D040', lesson: 'phy10-c2-s6-n118',
  scope: ['fig-245', 'fig-246'],
  activeRoot: '/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck',
  writeRoot: out, createdAt: new Date().toISOString(), final: true, finalMode: '0444',
  role: 'Fresh bounded native deterministic FigureSpec author, cap1+cap2 ONLY',
  completionStatus: 'BOUNDED_AUTHOR_FREEZE_WITH_HOLDS',
  promotable: false,
  cap1: 'Both first candidates authored from independent source inventory and snapshotted current edition templates.',
  cap2: 'Both first candidates attempted, one smallest native-marker spec repair attempted for fig-245; retained all available first-candidate bytes and failure evidence.',
  independentReview: 'NOT_PERFORMED',
  reviewRecorded: false, approvalRecorded: false,
  figurePromotion: false, nativeLessonFinalize: false,
  noPublisherNoDatabase: true, noGitOperations: true, noEnvReadOrWrite: true,
  noPaidArtworkOrModelCalls: true, noNewBranchOrWorktree: true,
  noServerOrPermanentWorkerStarted: true, handwrittenOutputSVG: false,
  renderer: 'Unmodified project .agents/skills/ld-s10y-image/scripts/render_spec.mjs (JSXGraph); no substitute renderer.',
  displayContract: {
    purpose: 'instructional', layout: 'scroll', fixedMediaWidthPx: 640,
    declaredWidths: [640], minTextPx: 16,
    actualNativeReportMinimumPx: { 'fig-245-repair': 18, 'fig-246-first': 18 },
    inlineMobileSizingClaimed: false, productSurfaceOrScrollEndAcceptanceClaimed: false,
  },
  inputs: binding('inputs/manifest.json'), inputIntegrity,
  firstCandidateBytesAllUnchanged: true,
  sourceInventories: binding('source-inventory-first.json'),
  authorDecisions: binding('author-decisions.json'),
  authorObservations: binding('author-observations.json'),
  executions,
  repair: { maximum: 1, used: 1, receipt: binding('repair-receipt.json'), furtherRepairAuthorized: false },
  imageBudget: {
    contextLimit: 8, actualImageOpens: 4, originalOpens: 2, generatedPreviewOpens: 2,
    originalEachOpenedExactlyOnce: true, reopens: 0, cropsOpened: 0,
    unusedOpens: 4, stoppingReason: 'One repair budget exhausted; no further repairs or reopens.',
    ledger: imageLedger, finalImagePayloads: 0,
  },
  unresolved: [
    { figure: 'fig-245', kind: 'source-uncertainty', detail: 'Exact fine aperture profile and tiny dark assembly identity remain unknown. Neither ideal triangle nor unseen poles is claimed as a source fact.' },
    { figure: 'fig-245', kind: 'native-gate-failure', detail: 'First render failed before outputs on short arrow marker aspect ratio. Repaired render produced SVG/PNG but failed four stacked number/name label clearances.' },
    { figure: 'fig-245', kind: 'author-visual-hold', detail: 'Native arc is nearly a full rotation circle rather than the intended small rotational-motion indication.' },
    { figure: 'fig-246', kind: 'author-visual-hold', detail: 'Native pass misses descending wires crossing the Phototube label. Candidate must not be treated as visually passed.' },
  ],
  parentHandoff: {
    textualOnly: true,
    integrationPerformed: false,
    mustNotPromoteHeldCandidates: true,
    noIndependentReviewOrApprovalInferred: true,
    sourceProseAndRawPASSAreInputsNotModernApproval: true,
    authorScratchMetadataNeedsDurableRebindingBeforeAnyFuturePromotion: true,
  },
  files,
}
const target = path.join(out, 'author-freeze.json')
fs.writeFileSync(target, `${JSON.stringify(freeze, null, 2)}\n`, { flag: 'wx' })
fs.chmodSync(target, 0o444)
for (const file of [...files.map((item) => item.path), target]) {
  if ((fs.statSync(file).mode & 0o777) !== 0o444) throw new Error('nonimmutable author file')
}
console.log(JSON.stringify({
  status: freeze.completionStatus, freeze: target, sha256: hash(target),
  mode: '0444', boundFiles: files.length, imageOpens: 4,
  actualExecutions: executions.map(({ figure, stage, draftValidation, nativeRender, reportStatus }) =>
    ({ figure, stage, validation: draftValidation.status, render: nativeRender.status, reportStatus })),
  promotion: false, independentReview: false, unresolvedHolds: freeze.unresolved.length,
}, null, 2))
