import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const out = path.dirname(fileURLToPath(import.meta.url))
assert.equal(process.cwd(), repo)
const read = name => JSON.parse(fs.readFileSync(path.join(out, name), 'utf8'))
const digest = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const ref = file => ({
  path: file, sha256: digest(file), bytes: fs.statSync(file).size,
})
const outputRef = name => ref(path.join(out, name))
const context = read('context.json')
const render = read('fig-227.render.json')
const geometry = read('geometry-check.json')
const surface = read('svg-surface-check.json')
const determinism = read('determinism.json')
for (const stage of [render, geometry, surface, determinism]) assert.equal(stage.status, 'pass')
assert.equal(render.spec.sha256, outputRef('fig-227.spec.json').sha256)
assert.equal(render.output.svg.sha256, outputRef('fig-227.svg').sha256)
assert.equal(geometry.spec.sha256, render.spec.sha256)
const finalTemplateBindings = context.templates.map(item => ({
  ...item, currentSha256AtReport: digest(item.path),
  unchangedSinceContextBuild: digest(item.path) === item.sha256,
}))
const correctedStillCurrent = finalTemplateBindings.filter(item => item.version === 'corrected-current')
  .every(item => item.unchangedSinceContextBuild)
const inventory = read('source.inventory.json')
assert.equal(outputRef('source.inventory.json').sha256, context.inventoryFreeze.sha256)
assert.equal(digest(context.sourceImage.path), context.sourceImage.sha256)
const images = [
  { ordinal: 1, role: 'canonical-source-FIRST', ...context.sourceImage },
  { ordinal: 2, role: 'author-full-resolution-inspection', ...outputRef('fig-227.full.png') },
  { ordinal: 3, role: 'author-normal-640px-inspection', ...outputRef('fig-227.640.png') },
]
const usage = {
  schema: 'stemrobin/bounded-figure-author-usage@1',
  ticket: 'STEMROBIN-181', batch: 'D037', role: 'FIRST fig227 author',
  imagesLoaded: 3, maximumWholeBatch: 8, imageReopens: 0, images,
  parentImagesReturned: 0, paidCalls: 0, dbCalls: 0,
  publisherCalls: 0, deployments: 0, outgoingChatMessages: 0,
  independentReviewCalls: 0, promotions: 0,
  dependenciesAddedOrChanged: 0,
  candidateCount: 1, contentRepairCount: 0, svgRenderCount: 2,
  secondRenderPurpose: 'Determinism only; not another candidate or review.',
}
fs.writeFileSync(path.join(out, 'usage.json'), `${JSON.stringify(usage, null, 2)}\n`)
const artifacts = [
  'source.inventory.json', 'inventory-freeze.json', 'context.json',
  'context.zh.native.json', 'context.en.native.json',
  'fig-227.spec.json', 'fig-227.svg', 'fig-227.render.json',
  'fig-227.full.png', 'fig-227.640.png',
  'fig-227.repeat.svg', 'fig-227.repeat.render.json',
  'curve-construction.json', 'geometry-check.json',
  'determinism.json', 'svg-surface-check.json', 'usage.json',
  'author.mjs', 'verify-svg.mjs', 'seal-report.mjs',
].map(outputRef)
const commands = fs.readdirSync(path.join(out, 'commands')).sort()
  .map(name => outputRef(`commands/${name}`))
const dependencies = [
  '.agents/skills/ld-s10y-image/SKILL.md',
  '.agents/skills/ld-s10y-image/references/routing.md',
  '.agents/skills/ld-s10y-image/references/figure-spec.md',
  '.agents/skills/ld-s10y-image/references/quality-gate.md',
  '.agents/skills/ld-s10y-image/scripts/build_context.py',
  '.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
  '.agents/skills/ld-s10y-image/scripts/validate_spec.py',
  '.agents/skills/ld-s10y-image/scripts/materialize_arrowheads.mjs',
  '.agents/skills/node_modules/jsxgraph/package.json',
  '.agents/skills/node_modules/jsxgraph/distrib/jsxgraphcore.js',
  '.agents/skills/node_modules/playwright-core/package.json',
  'app/src/styles/app.css',
].map(name => ref(path.join(repo, name)))
const report = {
  schema: 'stemrobin/first-figure-author-report@1',
  ticket: 'STEMROBIN-181', batch: 'D037', lesson: 'phy10-c2-s4-n99',
  figure: 'fig-227', role: 'FIRST deterministic modern author',
  status: 'author-complete-render-pass',
  sealedAt: new Date().toISOString(),
  cwd: repo, branch: 'codex/STEMROBIN-181-textbooks',
  exclusiveWriteScope: out,
  source: context.sourceImage,
  inventory: outputRef('source.inventory.json'),
  frozenBeforeDrawing: read('inventory-freeze.json'),
  binding: {
    correctedCurrentStableBeforeContextBuild: context.correctedCurrentStableBeforeContextBuild,
    correctedCurrentStillUnchangedAtReport: correctedStillCurrent,
    authorFIRSTAlsoBound: true,
    templates: finalTemplateBindings,
    graphDefinitionChecks: context.definitionChecks,
    numericalErrataAffectFigureDefinition: false,
    canonicalErrata: context.canonicalErrata,
  },
  authorObservations: [
    'Source PNG was the first loaded image. Full inventory was frozen before writing a FigureSpec or SVG.',
    'Full-resolution and 640px output inspected by this author: one shared orthogonal frame, both axis arrows and O, all eight mass labels, all nine interior speed ticks, 0.5c and c preserved; no clipping or label overlap observed.',
    'The source solid vertical stroke at c is retained as a thin muted boundary, distinct from the solid data curve. There is no plotted curve value at or beyond c.',
    'The curve follows equation (8.9), not the imprecise hand-drawn interpolation; it starts exactly at m_0 and rises sharply before c. Its unmarked cutoff just above 8m_0 is not a finite maximum.',
    'The title names m as relativistic mass; the lower note names m_0 as invariant rest mass. These and the domain note are explicit modern clarity additions, not source pixel facts.',
    'The two corrected accelerator examples do not appear as graph points. FIRST and corrected-current graph-defining prose and figure entries are identical in each language.',
  ],
  checks: {
    draftSpecValidation: 'pass',
    renderedSpecValidationIncludingSourceHash: 'pass',
    nativeRender: { status: render.status, objects: render.objects, labels: render.labels, collisions: render.collisions, displayChecks: render.displayChecks },
    pathAndScaleChecks: {
      status: geometry.status, vertexCount: geometry.vertexCount,
      maxEquationError: geometry.maxEquationError,
      maxInverseError: geometry.maxInverseError,
      maxSagittaPx: geometry.maxSagittaPx,
      exactLeftEndpoint: geometry.exactLeftEndpoint,
      cutoff: geometry.unlabeledUpperTruncation,
    },
    actualRenderedSvgAndCssSurface: { status: surface.status, checks: surface.checks, headless: true },
    byteIdenticalRegeneration: determinism,
  },
  clarityAdditions: inventory.clarityAdditionsDistinctFromSource,
  regularization: inventory.modernRegularization,
  outputContract: {
    mode: 'deterministic',
    spec: outputRef('fig-227.spec.json'),
    svg: outputRef('fig-227.svg'),
    render: outputRef('fig-227.render.json'),
    review: null,
    reviewStatus: 'independent review pending; this report is author evidence only',
    stagedOnly: true,
  },
  gatesNotClaimed: {
    independentScientificVisualReview: 'not performed or approved',
    reviewAt1PassRecord: 'not created',
    figurePromotion: 'not performed',
    lessonManifestChanges: 'not performed',
    completeCard: false,
    fullOfflineLessonRender: 'not performed; only isolated author SVG surface was tested',
    headedProductAcceptance: 'not performed',
    dbPublisherDeploy: 'not performed',
  },
  usage, artifacts, commands, dependencies,
  nextAuthorizedStage: 'A separately delegated bounded reviewer must inspect canonical source FIRST and these exact hashes. This author report does not authorize promotion.',
}
const reportPath = path.join(out, 'report.json')
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`)
fs.writeFileSync(path.join(out, 'report.sha256'), `${digest(reportPath)}  report.json\n`)
const summary = `# FIRST Fig227 Author

Author complete; native render pass. Independent review and promotion remain pending.

- Source inventory was frozen before drawing; original PNG SHA-256: \`${context.sourceImage.sha256}\`.
- Spec SHA-256: \`${outputRef('fig-227.spec.json').sha256}\`.
- SVG SHA-256: \`${outputRef('fig-227.svg').sha256}\`.
- Render SHA-256: \`${outputRef('fig-227.render.json').sha256}\`.
- Inventory SHA-256: \`${outputRef('source.inventory.json').sha256}\`.
- JSON author report SHA-256: \`${digest(reportPath)}\`.
- Corrected zh/en templates were stable before context build and are ${correctedStillCurrent ? 'unchanged' : 'changed'} at report. Immutable author FIRST is also bound. Graph definitions are unchanged by the two source266 errata.
- Curve, source scale/ticks and solid c-boundary preserved. Relativistic-mass/rest-mass and domain notes are additions; no accelerator points were added.
- 37 objects, 16 labels, no collisions. Minimum text at 640px: 17.6px. Actual rendered path checked against equation (8.9); repeat SVG is byte-identical.
- Isolated offline SVG surface uses current product figure CSS and reaches the mobile scroll end. This is not full lesson or headed app acceptance.
- Images loaded: 3/8, no reopens; parent image payloads: 0. Paid calls, outgoing chats, DB, publisher, deploy, independent review and promotion: 0.

All authored files are inside this delegated directory. Exact hashes, commands, dependency bindings and pending gates are recorded in report.json. No existing changes were reverted.
`
fs.writeFileSync(path.join(out, 'report.md'), summary)
console.log(JSON.stringify({
  report: ref(reportPath),
  spec: outputRef('fig-227.spec.json'),
  svg: outputRef('fig-227.svg'),
  render: outputRef('fig-227.render.json'),
  correctedStillCurrent, imagesLoaded: usage.imagesLoaded,
  status: report.status, independentReview: 'pending', promoted: false,
}, null, 2))
