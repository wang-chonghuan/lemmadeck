import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const R = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const T = path.join(R, '.intentfold/tickets/STEMROBIN-181')
const D = path.join(T, 'tmp/d886-n87-fig201202-affected-repair')
const C = path.join(D, 'figures/fig-202/targeted-label-recovery')
const load = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const info = file => ({ path: file, sha256: hash(file), bytes: fs.statSync(file).size })
function write(name, data) {
  const file = path.resolve(D, name)
  assert.ok(file.startsWith(`${D}/`))
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' })
  return file
}
function diff(before, after, name) {
  const result = spawnSync('diff', ['-u', before, after], { cwd: R, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 })
  assert.ok(result.status === 0 || result.status === 1)
  fs.writeFileSync(path.join(D, name), result.stdout, { flag: 'wx' })
}
function files(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(dir, entry.name)
    if (file === path.join(D, 'runtime-tmp')) return []
    return entry.isDirectory() ? files(file) : entry.isFile() ? [file] : []
  })
}
const protectedBefore = load(path.join(D, 'protected-inputs-before.json'))
const drift = protectedBefore.flatMap(entry => !fs.existsSync(entry.path) ? [{ ...entry, reason: 'missing' }]
  : hash(entry.path) !== entry.sha256 ? [{ ...entry, currentSha256: hash(entry.path) }] : [])
write('input-preservation.json', {
  checked: protectedBefore.length, drift, status: drift.length ? 'hold' : 'pass',
  scope: 'Every pre-existing regular file in named d848, d877, d858 and d873 input trees; untouched by this author. No source-history edits, resets or deletion.',
})
assert.deepEqual(drift, [])
const context = load(path.join(D, 'current-authoritative-text.json'))
for (const binding of context.candidates) assert.equal(hash(binding.original.path), binding.expectedSha256)
const original201 = load(path.join(D, 'before/fig-201/spec.json'))
const current201 = load(path.join(D, 'figures/fig-201/spec.json'))
const current202 = load(path.join(C, 'spec.json'))
assert.deepEqual(current201.source.authoritativeText, context.authoritativeText)
assert.deepEqual(current202.source.authoritativeText, context.authoritativeText)
assert.deepEqual(
  { ...current201, source: { ...current201.source, authoritativeText: null } },
  { ...original201, source: { ...original201.source, authoritativeText: null } },
)
assert.equal(hash(path.join(D, 'before/fig-201/fig-201.svg')), hash(path.join(D, 'figures/fig-201/fig-201.svg')))
const first202 = load(path.join(D, 'figures/fig-202/spec.json'))
const expectedRecovery = structuredClone(first202)
expectedRecovery.objects.find(o => o.id === 'reflected-2-label').at = [330, 285]
assert.deepEqual(current202, expectedRecovery)
const render = load(path.join(C, 'fig-202.render.json'))
assert.equal(render.status, 'pass')
assert.equal(hash(path.join(C, 'spec.json')), render.spec.sha256)
assert.equal(hash(path.join(C, 'fig-202.svg')), render.output.svg.sha256)
const display = load(path.join(D, 'display/report-FIRST.json'))
assert.equal(display.status, 'pass')
assert.deepEqual(display.measurements.map(m => m.width), [331, 342, 640])
assert.equal(display.screenshots.length, 3)

const rendererFiles = [
  '.agents/skills/ld-s10y-image/SKILL.md',
  '.agents/skills/ld-s10y-image/references/figure-spec.md',
  '.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
  '.agents/skills/ld-s10y-image/scripts/validate_spec.py',
  '.agents/skills/ld-s10y-image/scripts/materialize_arrowheads.mjs',
  '.agents/skills/ld-s10y-image/assets/figure-spec.schema.json',
  '.agents/skills/node_modules/jsxgraph/distrib/jsxgraphcore.js',
  '.agents/skills/node_modules/jsxgraph/distrib/jsxgraph.css',
  '.agents/skills/node_modules/jsxgraph/package.json',
  '.claude/skills/ld-s10y-lesson/tools/check_product.mjs',
  'app/src/styles/app.css',
]
const rendererBindings = rendererFiles.map(relative => info(path.join(R, relative)))
for (const relative of rendererFiles.filter(p => !p.includes('/node_modules/'))) {
  const destination = path.join(D, 'inputs/toolchain', relative)
  fs.mkdirSync(path.dirname(destination), { recursive: true })
  fs.copyFileSync(path.join(R, relative), destination, fs.constants.COPYFILE_EXCL)
}
write('renderer-input-bindings.json', {
  existingRenderer: true, bindings: rendererBindings,
  jsxgraph: '1.13.1', noDependenciesChanged: true,
  onlyAuthoredOutputsInside: D,
})
diff(path.join(D, 'before/fig-201/spec.json'), path.join(D, 'figures/fig-201/spec.json'), 'diffs/fig-201.final-spec.diff')
diff(path.join(D, 'before/fig-201/fig-201.svg'), path.join(D, 'figures/fig-201/fig-201.svg'), 'diffs/fig-201.svg.diff')
diff(path.join(D, 'before/fig-202/spec.json'), path.join(C, 'spec.json'), 'diffs/fig-202.final-spec.diff')
diff(path.join(D, 'before/fig-202/fig-202.svg'), path.join(C, 'fig-202.svg'), 'diffs/fig-202.final-svg.diff')
diff(path.join(D, 'before/fig-202/fig-202.render.json'), path.join(C, 'fig-202.render.json'), 'diffs/fig-202.final-render.diff')
write('author-pixel-observations.json', {
  status: 'SCOPED-AUTHOR-OBSERVATION-PASS-NOT-INDEPENDENT',
  inspectedOnce: [
    { original: true, ...info(path.join(R, current202.source.image.path)) },
    ...display.screenshots,
  ],
  observations: [
    'At all three widths, Normal incidence and All rays share one line. are visibly part of the SVG, not only metadata.',
    'Incident and returning optical strokes are vertical on the same x coordinate against horizontal interfaces. Distinct upward arrowheads and labels 1 and 2 preserve the two returning contributions without apparent lateral path separation.',
    'The middle film remains bounded by two interfaces; h is only their separation. Correctly ordered English air/film/glass indices and source-style paired glass hatches remain readable.',
    'Transmission proceeds down the shared line from the lower film interaction and ends inside glass. No additional source angle, numerical data, phase marker, intensity, formula or cancellation result appears.',
    'No clipping, label collision, blank/black rendering, or visible non-English lettering was observed in the affected author screenshots.',
  ],
  limit: 'Author reading only, not a self-independent review, source-history rewrite, promotion receipt or full-card acceptance.',
})
const usage = {
  schema: 'd886/bounded-author-usage@1',
  batch: 'd886', ticket: 'STEMROBIN-181', writeRoot: D,
  images: {
    batches: 1, original202ContextLoads: 1, original202Reopens: 1,
    original201Loads: 0, screenshotCaptures: 3, screenshotContextLoads: 3,
    screenshotExtraReopens: 0, crops: 0, nativeRendererPngs: 0,
    contextImageLoads: 4, uniqueAuthorPixelSurfaces: 4,
    conservativeCapturePlusContextCharges: 7,
    batchLimit: 8, contextLimit: 24,
    note: 'Same three saved PNGs reused for computational nonblank checks; no hidden screenshot helper, extra captures, failed-render image or native preview was opened.',
  },
  calls: {
    fig201Render: 0, fig201StandaloneValidation: 0, fig201ReviewReplay: 0,
    fig202StandaloneValidation: 1,
    fig202RenderInitial: 1, fig202RenderTargetedGenuineFailureRecovery: 1,
    rendererIntrinsicValidations: 2,
    passingRenderReplay: 0, displayScript: 1, displayWidthChecks: 3,
    recordReview: 0, selfIndependentReview: 0,
  },
  paid: { imageGeneration: 0, modelApiCalls: 0, costUsd: 0 },
  canonical: 0, index: 0, meter: 0, git: 0, db: 0,
  publisher: 0, deploy: 0, otherChats: 0,
}
write('usage.json', usage)
const output201 = {
  spec: info(path.join(D, 'figures/fig-201/spec.json')),
  svg: info(path.join(D, 'figures/fig-201/fig-201.svg')),
  priorRenderExactCopy: info(path.join(D, 'figures/fig-201/prior-render.reused.json')),
  reuse: info(path.join(D, 'figures/fig-201/reuse-receipt.json')),
}
const output202 = {
  spec: info(path.join(C, 'spec.json')), svg: info(path.join(C, 'fig-202.svg')),
  render: info(path.join(C, 'fig-202.render.json')),
}
write('current-outputs.json', {
  status: 'SCOPED-AFFECTED-AUTHOR-PASS; INDEPENDENT-REVIEW-AND-PROMOTION-HOLD',
  figures: { 'fig-201': output201, 'fig-202': output202 },
  warning: 'figures/fig-202/spec.json and its adjacent SVG/render are immutable FIRST failed label-layout outputs. The final current candidate is targeted-label-recovery/, selected here explicitly. Do not publish the FIRST failed output.',
})
const report = {
  schema: 'd886/bounded-first-affected-figure-author@1',
  batch: 'd886', ticket: 'STEMROBIN-181', card: 'phy10-c2-s3-n87',
  soleRoot: R, onlyWriteRoot: D, frozenAt: new Date().toISOString(),
  status: 'SCOPED-AFFECTED-AUTHOR-PASS',
  independentApproval: false, promotionApproved: false, fullCardApproved: false,
  authority: {
    currentBilingualText: info(path.join(D, 'current-authoritative-text.json')),
    d873Pass: info(path.join(T, 'tmp/d873-n87-text-affected-review/report.json')),
    d877FirstFindings: info(path.join(T, 'tmp/d877-n87-fig201202-first-independent-review/independent-findings-FIRST.json')),
  },
  figures: [
    { figure: 'fig-201', authorStatus: 'METADATA-ONLY-PASS',
      onlySpecFieldChanged: '/source/authoritativeText', affectedFinding: 'd877-201-C01',
      svgGeometryAssertionsIdentical: true, priorSubstantivePassReused: true,
      geometryRenderReadabilitySourceReviewReplay: false, outputs: output201 },
    { figure: 'fig-202', authorStatus: 'AFFECTED-AUTHOR-PASS',
      affectedFindings: ['d877-202-C01', 'd877-202-G01'],
      metadataAndDepictionDiffsSeparate: true,
      normalIncidenceGeometry: 'All six optical legs perpendicular; return meets the upper interaction exactly; film forward and return distances equal h; source graph branches preserved.',
      visibleExplanation: ['Normal incidence', 'All rays share one line.'],
      sourceFactsVersusModernAdditions: info(path.join(D, 'repair-mapping.json')),
      nativeStatus: render.status, outputs: output202,
      widths: display.measurements.map(m => ({ width: m.width, minTextPx: Math.min(...m.labels.map(l => l.px)), status: m.status })),
    },
  ],
  genuineTargetedFailure: {
    firstStatus: 'fail', category: '1/2 label-box collision',
    preserved: [
      info(path.join(D, 'figures/fig-202/spec.json')),
      info(path.join(D, 'figures/fig-202/fig-202.svg')),
      info(path.join(D, 'figures/fig-202/fig-202.render.json')),
      info(path.join(D, 'calls/fig-202-render-FIRST.json')),
    ],
    recovery: info(path.join(D, 'calls/fig-202-targeted-label-recovery.json')),
    onlyRecoveryEdit: 'reflected-2-label.at: [330,305] -> [330,285]',
    passReplay: false,
  },
  display: info(path.join(D, 'display/report-FIRST.json')),
  observations: info(path.join(D, 'author-pixel-observations.json')),
  exactDiffs: fs.readdirSync(path.join(D, 'diffs')).sort().map(name => info(path.join(D, 'diffs', name))),
  inputsUnchanged: info(path.join(D, 'input-preservation.json')),
  usage: info(path.join(D, 'usage.json')),
  nextOwner: 'Separate independent affected review of exact current outputs; no review receipt created here.',
  residualLimits: [
    'd873 text PASS is reused with its scope, not re-reviewed or expanded.',
    'The two reflected contributions have coincident physical strokes; distinct labels and arrowhead heights are authored identity annotations, not source metric data.',
    'Standalone headed product-class display evidence only; no offline whole-lesson, live route, theme sweep, runtime exercise, grading or publication acceptance.',
    'fig201 historical render is retained unchanged and explicitly reused, not falsely rebound to the new spec.',
    'All d848/d877 FIRST histories and d858/d873 inputs preserved; no canonical/index/meter/Git/DB/publisher/deploy/other-chat action.',
  ],
  stop: 'Bounded first affected author repair frozen. Stop; no self-independent review, promotion or downstream operation.',
}
write('report.json', report)
const markdown = `# d886 Affected Figure Author\n\nStatus: **SCOPED-AFFECTED-AUTHOR-PASS**. Independent review and promotion remain **HOLD**.\n\n- Fig201: only \`source.authoritativeText\` rebound to complete bilingual d858 candidates hash-approved by d873. SVG, objects, geometry, assertions, inventory, display and layout identical. d877 substantive PASS reused; no new render, validator, original or readability image.\n- Fig202: same approved text rebind is separate from depiction repair. All optical legs now share a true perpendicular line. Visible “Normal incidence” and “All rays share one line.” explain the geometry; both numbered reflected contributions and the source transmission branch remain. Three layers, h and material hatching preserved. No answer formula, phase, intensity, result, source angle or numerical datum added.\n- FIRST native render genuinely failed on the 1/2 label-box collision. It is preserved. One targeted recovery moved only label 2 down 20 canvas pixels; the recovery render passed. No PASS replay.\n- Headed standalone product-class screenshots inspected once at 331/342/640 px; minimum labels 16.55/17.1/32 px. This is author evidence, not an independent or whole-card approval.\n\n## Current Outputs\n\nFinal fig202 lives at \`figures/fig-202/targeted-label-recovery/\`; the adjacent initial outputs are frozen FAIL history. \`current-outputs.json\` selects exact final paths/hashes. Fig201's copied historical render retains its old spec binding; \`reuse-receipt.json\` records honest metadata-only reuse.\n\nExact metadata, depiction, recovery, final-spec, SVG and render diffs are under \`diffs/\`. Bound inputs and toolchain copies are under \`inputs/\`.\n\n## Usage And Stop\n\nOne batch; four context image loads (original202 + three screenshots), seven conservative capture-plus-context charges, limits 8/24. Zero fig201 images and zero crop/reopen beyond the specified original202 read. One standalone fig202 validation; two renderer invocations (FIRST genuine failure + targeted recovery), each including its mandatory internal validation. No generation, paid API, independent review, canonical/index/meter, Git, DB, publisher, deploy or other-chat action.\n\nAll ${protectedBefore.length} protected pre-existing input files retained their hashes. Stop at this frozen author output; separate independent affected review is still needed.\n`
fs.writeFileSync(path.join(D, 'report.md'), markdown, { flag: 'wx' })
const manifestFiles = files(D).sort()
write('frozen-artifacts.json', {
  schema: 'd886/author-freeze@1', status: report.status, root: D,
  files: manifestFiles.map(info),
  note: 'Manifest excludes itself, SHA256SUMS and transient browser profile directory; no product content modified.',
})
const frozenFiles = files(D).sort()
fs.writeFileSync(path.join(D, 'SHA256SUMS'),
  `${frozenFiles.map(file => `${hash(file)}  ${path.relative(D, file)}`).join('\n')}\n`, { flag: 'wx' })
for (const file of files(D)) fs.chmodSync(file, 0o444)
console.log(JSON.stringify({
  status: report.status, report: info(path.join(D, 'report.json')),
  manifest: info(path.join(D, 'frozen-artifacts.json')),
  sha256sums: info(path.join(D, 'SHA256SUMS')),
  figures: { 'fig-201': output201, 'fig-202': output202 },
  protectedInputs: protectedBefore.length, drift: drift.length, usage: usage.images,
}, null, 2))
