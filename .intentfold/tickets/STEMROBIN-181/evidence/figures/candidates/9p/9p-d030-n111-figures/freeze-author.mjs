import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const work = path.dirname(fileURLToPath(import.meta.url))
const output = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d030-n111-figures-author-freeze.json')
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const binding = p => ({ path: path.resolve(p), sha256: hash(p), bytes: fs.statSync(p).size })
const writeNew = (p, value) => fs.writeFileSync(p, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
const inventory = read(path.join(work, 'source-inventory.json'))
const context = read(path.join(work, 'context.zh-en.json'))
const gate = read(path.join(work, 'science-gate.json'))
const checks = read(path.join(work, 'author-output-check.json'))
assert.equal(gate.status, 'PASS')
assert.equal(checks.status, 'pass')
for (const key of ['effectiveSCI', 'correctedFreeze', 'chinese', 'english']) assert.equal(hash(gate[key].path), gate[key].sha256)
const effectiveSCI = read(gate.effectiveSCI.path)
assert.equal(effectiveSCI.status, 'PASS')
assert.equal(effectiveSCI.effectiveLessonTextSCIApproval, true)
assert.equal(hash(gate.correctedFreeze.path), '56306a85023d20902e0283cd0b2716878ebee0b7a2188b0363ce08f2a86b5555')
for (const source of inventory.sourceCropEvidence) assert.equal(hash(path.join(root, source.path)), source.sha256)

writeNew(path.join(work, 'context.zh.json'), {
  schema: 'ld-s10y-image/full-language-context@1',
  language: 'zh',
  lesson: context.lesson,
  exerciseCount: 0,
  tasks: [],
  source: context.currentChinese.input,
  correctedFreeze: context.correctionFreeze,
  effectiveSCI: context.effectiveScience,
  ...context.currentChinese,
})
writeNew(path.join(work, 'context.en.json'), {
  schema: 'ld-s10y-image/full-language-context@1',
  language: 'en',
  lesson: context.lesson,
  exerciseCount: 0,
  tasks: [],
  rule: 'Complete corrected English context retained independently from the authoritative Chinese text array in each FigureSpec.',
  source: context.english.input,
  correctedFreeze: context.correctionFreeze,
  effectiveSCI: context.effectiveScience,
  ...context.english,
})

const observations = {
  'fig-224': [
    'Author observed the complete four-sided rectangle, full central divider, n on the left and p on the right; both labels are inside their regions.',
    'No charge signs, arrows, wires, carrier marks or additional structures appear.',
    'Readable simple inline composition; actual310/331/342/640px label sizes are separately measured, not inferred from canvas width.',
  ],
  'fig-225': [
    'Author observed the complete divided sample, both circular meters, all three filled junctions and all seventeen source wire/wiper segments.',
    'The left sample branch goes to the downward wiper touching the resistor top, not to the fixed left resistor terminal. The right branch contains the ammeter and reaches the right middle/lower junctions and positive supply terminal.',
    'Both bottom terminals are hollow and separate, with minus on the left and plus on the right. There is no line across their gap and no invented battery-plate symbol.',
    'No net-charge signs on either semiconductor region; n/p and A identities are modern prose/circuit-based notation, not source homograph certification.',
  ],
  'fig-226': [
    'Author inspected all three panels at actual640px media width: six axis arrowheads, finite forward curve in a, finite reverse curve in b, and two continuous-origin joined branches in c are visible.',
    'All source I-form/V-form axis meanings, the two minus signs and three subparts remain; modern a/b/c follow the corrected prose notation.',
    'The three modern0 labels are conventional coordinate-origin notation. Literal oval source glyph identity remains unresolved.',
    'Curves remain solid and finite. Smoothness is modern qualitative regularization only; no ticks, grid, measured I/U/V values, data dots or reverse-breakdown extension are introduced.',
  ],
}
const figures = inventory.figures.map(source => {
  const directory = path.join(work, source.id, 'initial')
  const specPath = path.join(directory, 'spec.json')
  const renderPath = path.join(directory, `${source.id}.render.json`)
  const svgPath = path.join(directory, `${source.id}.svg`)
  const spec = read(specPath)
  const render = read(renderPath)
  const command = read(path.join(directory, 'native-command.json'))
  const validation = JSON.parse(fs.readFileSync(path.join(directory, 'validate.stdout.txt'), 'utf8'))
  assert.equal(hash(path.join(root, source.image.path)), source.image.sha256)
  assert.equal(hash(specPath), render.spec.sha256)
  assert.equal(hash(svgPath), render.output.svg.sha256)
  assert.equal(render.status, 'pass')
  assert.equal(command.status, 'pass')
  assert.equal(validation.status, 'pass')
  assert.deepEqual(spec.source.authoritativeText, [
    { lesson: context.lesson, text: context.currentChinese.printedTitle },
    ...context.currentChinese.prose.filter(b => b.text?.trim()).map(b => ({ lesson: context.lesson, text: b.text })),
  ])
  const browserCheck = checks.figures.find(f => f.id === source.id)
  assert(browserCheck)
  assert.equal(hash(specPath), browserCheck.spec.sha256)
  assert.equal(hash(svgPath), browserCheck.svg.sha256)
  assert.equal(hash(renderPath), browserCheck.render.sha256)
  const previewPath = path.join(directory, source.id === 'fig-226' ? 'fig-226.at640.preview.png' : `${source.id}.preview.png`)
  return {
    id: source.id,
    mode: 'deterministic',
    renderer: render.renderer,
    authorState: 'FROZEN_INITIAL_NO_AUTHOR_DEFECT_OBSERVED',
    source: binding(path.join(root, source.image.path)),
    sourceInventoryPointer: `/figures/${inventory.figures.indexOf(source)}`,
    sourceCropApproval: {
      inheritedExternalOnly: true,
      report: binding(path.join(root, inventory.sourceCropEvidence[source.id === 'fig-226' ? 1 : 0].path)),
      pointer: source.id === 'fig-224' ? '/figures/1' : source.id === 'fig-225' ? '/figures/2' : '/figures/1',
      status: 'pass',
      doesNotCertifyScriptIdentityOrModernFigure: true,
    },
    initial: {
      spec: binding(specPath),
      render: binding(renderPath),
      svg: binding(svgPath),
      nativePreview: binding(path.join(directory, `${source.id}.preview.png`)),
      commandReceipt: binding(path.join(directory, 'native-command.json')),
      validationStdout: binding(path.join(directory, 'validate.stdout.txt')),
      validationStderr: binding(path.join(directory, 'validate.stderr.txt')),
      renderStdout: binding(path.join(directory, 'render.stdout.txt')),
      renderStderr: binding(path.join(directory, 'render.stderr.txt')),
    },
    selectedFrozenOutput: {
      spec: binding(specPath),
      render: binding(renderPath),
      svg: binding(svgPath),
      frozenByHashWithoutRewritingNativeEvidence: true,
      nativeMetadataStillNamesOwnedScratchOutputs: true,
      promotableMetadata: false,
    },
    repairs: { used: 0, maximum: 1, output: null, proseScopeCorrectionConsumedRepair: false },
    nativeValidationStatus: validation.status,
    nativeRenderStatus: render.status,
    nativeRenderInvocations: 1,
    explicitNativeValidateInvocations: 1,
    nativeRendererInternalValidateInvocations: 1,
    actualMediaChecks: browserCheck.actualMediaMeasurements.map(m => ({
      width: m.width,
      measuredMediaWidth: m.actualMediaWidth,
      hostWidth: m.viewportWidth,
      measuredMinimumTextPx: m.minTextPx,
      allLabelsMeasured: m.labels.length,
      status: m.status,
      horizontalScrollMaximum: m.maxScroll,
      horizontalScrollEndReached: m.reachedEnd,
    })),
    pixelCheck: browserCheck.nonblankCanvasPixelCheck,
    authorSemanticCheck: browserCheck.semantic,
    authorVisualObservation: {
      inspectedPreview: binding(previewPath),
      opens: 1,
      reopens: 0,
      notes: observations[source.id],
      independentApproval: false,
    },
    notationAndModernRegularization: source.modernDecisions,
    independentFigureReview: 'NOT_PERFORMED_PARENT_OWNED',
    failedBlockers: [],
  }
})

const report = {
  schema: 'ld-s10y-image/bounded-author-freeze@1',
  ticket: 'STEMROBIN-181',
  book: '9p',
  lesson: context.lesson,
  date: '2026-11-16',
  workspace: root,
  status: 'AUTHOR_FROZEN_FOR_INDEPENDENT_REVIEW',
  scope: 'Author only: figures224/225/226; exact corrected complete bilingual lesson context; zero tasks. No independent figure approval, promotion, shared-book changes or product acceptance.',
  failedBlockers: [],
  inputs: {
    currentChinese: binding(gate.chinese.path),
    english: binding(gate.english.path),
    correctedProseFreeze: binding(gate.correctedFreeze.path),
    effectiveScienceReview: binding(gate.effectiveSCI.path),
    scienceScope: 'External effective SCI PASS for corrected bilingual lesson prose only. Read and hashes verified before initial validation/render and again before freeze.',
    sourceInventory: binding(path.join(work, 'source-inventory.json')),
    contextChinese: binding(path.join(work, 'context.zh.json')),
    contextEnglish: binding(path.join(work, 'context.en.json')),
    contextBilingual: binding(path.join(work, 'context.zh-en.json')),
    layoutDecisions: binding(path.join(work, 'layout-decisions.json')),
    scienceGate: binding(path.join(work, 'science-gate.json')),
    authorOutputCheck: binding(path.join(work, 'author-output-check.json')),
  },
  contextCompleteness: {
    exerciseCount: 0,
    tasks: [],
    chineseFullProseRows: context.currentChinese.prose.length,
    englishFullProseRows: context.english.prose.length,
    authoritativeTextPerSpec: 'Printed Chinese title plus every nonempty corrected current Chinese prose/caption text, in original order; no excerpt or faithful-source substitution.',
    englishSeparatelyRetained: true,
    reverseNonBreakdownQualifierPresentInBothLanguages: true,
    oldAuthorContextWork: 'No old-context spec or render was written; parent retains former input bytes under d030-n111-prose-correction/before/. Original image observations remained valid across the prose-only change.',
    correctionFreezeSha256: '56306a85023d20902e0283cd0b2716878ebee0b7a2188b0363ce08f2a86b5555',
  },
  figures,
  imageAccounting: {
    freshBoundedContext: true,
    originalPngOpens: 3,
    outputPreviewOpens: 3,
    totalImagesLoadedIntoContext: 6,
    reopens: 0,
    detailOrAdditionalCropOpens: 0,
    maximumInBatch: 8,
    hardMaximum: 24,
    native226CanvasPreviewWrittenButNotOpened: true,
    preview226OpenedAtActual640px: true,
    moreImageInspectionAuthorizedOrNeededForAuthor: false,
    displayTool: 'functions.view_image',
    detail: 'original',
  },
  execution: {
    nativeRenderInvocations: 3,
    explicitNativeValidateInvocations: 3,
    nativeRendererInternalValidateInvocations: 3,
    repairs: 0,
    nativeScriptsUnmodified: true,
    manualSvgEdits: 0,
    oldCandidatesTestsAnswersConsulted: false,
    artifactBrowserCheck: 'Isolated headless Chromium, inline exact generated SVGs, actual media-width screen transforms, scroll-end assertions and nonblank pixel checks. No app server or product acceptance claims.',
    durablePromotionInvocations: 0,
    reviewRecordInvocations: 0,
  },
  ownership: {
    onlyWrittenRoots: [work, output],
    sourceOrCropWrites: 0,
    sharedBookOrManifestWrites: 0,
    meterOrIndexWrites: 0,
    databaseAccess: false,
    gitCommands: 0,
    dependencyWritesOrInstalls: 0,
    appWrites: 0,
    appRunsOrBuilds: 0,
    sharedReportEdits: 0,
    independentReviewOrPromotion: false,
    otherChangesPreserved: true,
  },
  remaining: [
    'Parent performs one independent modern figure review on these exact source/spec/render/SVG/context hashes.',
    'Parent owns promotion and any final edition/offline product verification. Native scratch render metadata is not a durable promoted output contract.',
  ],
  authorApprovalMeaning: 'No author observation in this report is independent approval. External SOURCE crop and effective text SCI approvals are referenced only within their existing limited scopes.',
}
writeNew(output, report)
console.log(JSON.stringify({ report: output, sha256: hash(output), figures: figures.map(f => ({ id: f.id, ...f.selectedFrozenOutput })) }, null, 2))
