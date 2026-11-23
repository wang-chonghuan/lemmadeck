import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const root = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188'
assert.equal(process.cwd(), root)
const own = path.join(root, '.intentfold/tickets/STEMROBIN-188/tmp/n33-fig209210-author7')
const read = name => JSON.parse(fs.readFileSync(path.join(own, name), 'utf8'))
const bind = file => ({
  path: path.isAbsolute(file) ? file : path.join(own, file),
  sha256: crypto.createHash('sha256').update(fs.readFileSync(path.isAbsolute(file) ? file : path.join(own, file))).digest('hex'),
})
const execution = read('execution.json')
const math = read('math-basis.json')
const surfaces = read('display-evidence.json')
assert.equal(execution.commands.length, 9)
assert.equal(execution.failures.length, 4)
assert.equal(execution.totalScreenshotFilesProduced, 6)
assert.equal(surfaces.length, 4)
const figures = ['fig-209', 'fig-210'].map(id => {
  const spec = read(`${id}.spec.json`)
  const render = read(`${id}.render.json`)
  const specBinding = bind(`${id}.spec.json`)
  const svgBinding = bind(`${id}.svg`)
  assert.equal(spec.source.image.sha256, bind(spec.source.image.path).sha256, 'Raw source must be unchanged')
  assert.equal(render.spec.sha256, specBinding.sha256)
  assert.equal(render.output.svg.sha256, svgBinding.sha256)
  const display = surfaces.filter(item => item.figure === id)
  for (const item of display) {
    assert.equal(item.input.sha256, svgBinding.sha256)
    assert.equal(item.screenshot.sha256, bind(item.screenshot.path).sha256)
    assert.ok(item.measurements.labels.every(label => label.px >= 16 && label.insideMedia))
  }
  return {
    id, status: 'AUTHOR_CANDIDATE_ONLY',
    source: bind(spec.source.image.path),
    spec: specBinding, svg: svgBinding, renderReport: bind(`${id}.render.json`),
    sourceInventory: spec.source.inventory,
    mathBasis: { file: bind('math-basis.json'), coordinates: math[id.replace('-', '')], scalarFacts: math.scalarFacts[id.replace('-', '')] },
    unknowns: math.unknowns.filter(item => item.figure === id),
    assertions: spec.assertions,
    displayContract: spec.display,
    displayEvidence: display.map(item => ({
      surface: item.surface, viewport: item.viewport, actualMediaWidthPx: item.measurements.media.width,
      actualMediaHeightPx: item.measurements.media.height,
      measuredMinimumTextPx: Math.min(...item.measurements.labels.map(label => label.px)),
      screenshot: item.screenshot,
      inspection: 'Author viewed this final candidate once; no independent review or approval.',
    })),
    revisions: execution.contentRevisions[id],
    rendererAttempts: execution.commands.filter(item => item.argv.includes(path.join(own, `${id}.svg`))).length,
    promotion: 'NOT_AUTHORIZED',
  }
})
const snapshots = [
  'fig-209.r0.spec.json', 'fig-210.r0.spec.json',
  'execution.first-failure.json', 'execution.first-display-failure.json',
  'fig-210.r1.spec.json', 'fig-210.r1.svg', 'fig-210.r1.render.json',
  'fig-210.r2.spec.json', 'fig-210.r2.svg', 'fig-210.r2.render.json',
  'fig-210.r2.desktop.png', 'fig-210.r2.mobile.png', 'display-evidence.r2.json',
].map(bind)
const loadedImages = [
  { order: 1, kind: 'original', file: figures[0].source, observation: 'a vertical, c horizontal, b oblique; M below c at a-b; upper-left square corner at a-c; all outer ends unlabelled.' },
  { order: 2, kind: 'original', file: figures[1].source, observation: 'a1/a2 crossed by b; both solid-to-dashed continuations reach and pass N; alpha single arc and beta two nested strokes.' },
  { order: 3, kind: 'final-desktop', file: bind('fig-209.desktop.png'), observation: 'M below c; lines continue below M; square corner and a/b/c/M labels distinct.' },
  { order: 4, kind: 'superseded-desktop', file: bind('fig-210.r2.desktop.png'), observation: 'Author visual failure: short native dash=2 reads too near-dotted compared with source long dashes.' },
  { order: 5, kind: 'final-mobile', file: bind('fig-209.mobile.png'), observation: '358px media; labels and square corner visible, M below c, no author-observed overlap.' },
  { order: 6, kind: 'final-desktop', file: bind('fig-210.desktop.png'), observation: 'Long native dash=4; both dashed lines visibly meet at N and extend beyond; alpha/beta arcs on the interior side; N above-left.' },
  { order: 7, kind: 'final-mobile', file: bind('fig-210.mobile.png'), observation: '358px media; a1/a2 subscripts, alpha/beta and N remain distinct; two beta arcs visible; dashed continuations remain long strokes.' },
]
const manifest = {
  schema: 'stemrobin188/n33-figure-author-manifest@1',
  createdAt: new Date().toISOString(),
  status: 'AUTHOR_CANDIDATES_AWAITING_INDEPENDENT_REVIEW',
  ticket: 'STEMROBIN-188', lesson: 'geo68-c3-s1-n33',
  cwd: root, ownedDirectory: own, scope: ['fig-209', 'fig-210'],
  authoritativeProvisionalText: math.sourceText,
  relevantTextSourceRefs: math.relevantSourceRefs,
  textApproval: math.approval,
  notationProposal: 'Unrelated A/B-P/Q label proposal was not applied; complete supplied fig209 paragraph retained verbatim.',
  figures,
  additions: math.additions,
  nativeValidatorLimit: math.nativeValidatorLimit,
  displayEvidence: bind('display-evidence.json'),
  execution: bind('execution.json'),
  firstFailuresAndSnapshots: snapshots,
  snapshotPathPolicy: 'Native historical reports retain their original mutable output paths. The r0/r1/r2 snapshot bindings above locate preserved bytes by revision and hash; historical report hashes are not presented as current output hashes.',
  failures: execution.failures.map(item => ({
    stage: item.stage || (item.argv?.some(value => value.endsWith('render_spec.mjs')) ? 'native-render' : 'native-draft-validator'),
    figure: item.figure || (item.argv?.some(value => value.includes('fig-210')) ? 'fig-210' : item.argv?.some(value => value.includes('fig-209')) ? 'fig-209' : null),
    exitCode: item.exitCode ?? null,
    diagnosis: item.message || item.stderr || item.stdout,
  })),
  failureRecovery: [
    'Initial draft: missing native-required <=352px and 331px display checks. Preserved r0 specs and first failure; display-only r1 adds 331px.',
    'Fig210 first render: N label stroke collision. Preserved r1 spec/SVG/report; r2 moves only label gap from 20px to 32px.',
    'Initial screenshot stage: Number("3px") produced NaN and false zero-stroke assertion. Preserved execution.first-display-failure.json; parseFloat fixes evidence code without changing figures.',
    'Fig210 r2 desktop author observation: dash=2 looked near-dotted. Preserved r2 spec/SVG/report and both screenshots; r3 uses native dash=4 and only fig210 is rerendered/rescreenshot.',
  ],
  counts: {
    imageLoadsThisBatch: 7, imageLoadsThisWorkerContext: 7,
    batchLimit: 8, contextLimit: 24, batchRemaining: 1, contextRemaining: 17,
    originalsIndependentlyInspected: 2, originalReopens: 0, crops: 0,
    screenshotLoads: 5, screenshotFilesProduced: 6, currentFinalScreenshots: 4,
    unviewedSupersededScreenshots: ['fig-210.r2.mobile.png'],
    parentReportedPriorOriginalLoads: 4,
    parentImagesLoadedInThisWorker: 0,
    reportedParentPlusWorkerLoads: 11,
    scopeOfContextCount: '7 actual loads in this worker. The caller reported 4 prior originals in its separate history; those were not inherited or reopened here. Waiting or returning text did not reset counts.',
    explicitNativeCommands: 9, explicitDraftValidatorCalls: 5,
    nativeRendererCalls: 4, rendererInternalDraftValidatorCalls: 4,
    failedNativeCommands: 2, failedEvidenceStages: 1, authorVisualFailures: 1,
    totalFailuresPreserved: 4, paidCalls: 0, externalNetworkRequestsInitiated: 0,
    revisionCounts: execution.contentRevisions,
    geometryRevisions: { 'fig-209': 0, 'fig-210': 0 },
  },
  loadedImages,
  review: {
    independentReviewPerformed: false,
    reviewAt1Created: false,
    finalApprovalClaimed: false,
    authorInspectionOnly: true,
  },
  preservation: {
    rawSourcesUnmodified: true, changesOutsideOwnedDirectory: false,
    canonicalPromotion: false, lessonAssembly: false, sourceFinalizer: false,
    reindex: false, bookChanges: false, answersOrChoicesOrInteractions: false,
    testsOrEnvironmentOrDatabaseChanges: false, gitOperations: false,
    dependenciesChanged: false, subagentsCreated: false, messagesSent: false,
    unrelatedFiguresInspected: false,
  },
  rendererContract: [
    'SKILL.md', 'references/routing.md', 'references/figure-spec.md', 'references/quality-gate.md',
    'assets/figure-spec.schema.json', 'scripts/validate_spec.py', 'scripts/render_spec.mjs',
  ].map(file => bind(path.join(root, '.agents/skills/ld-s10y-image', file))),
  lessonRecoveryContract: bind(path.join(root, '.claude/skills/ld-s10y-lesson/references/production-resume.md')),
  authorScript: bind('author.mjs'),
}
const output = path.join(own, 'manifest.json')
assert.ok(!fs.existsSync(output), 'Do not overwrite a completed author checkpoint')
fs.writeFileSync(output, `${JSON.stringify(manifest, null, 2)}\n`)
console.log(JSON.stringify({
  manifest: bind(output),
  candidates: figures.map(item => ({ id: item.id, spec: item.spec, svg: item.svg, renderReport: item.renderReport, revisions: item.revisions })),
  actualImageLoads: loadedImages.length, failures: manifest.counts.totalFailuresPreserved,
  finalReview: 'NOT_PERFORMED',
}, null, 2))
