import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'

const cwd = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
const own = path.join(cwd, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d135-t9-figures-author')
assert.equal(process.cwd(), cwd)
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const bind = p => ({
  path: path.resolve(p), bytes: fs.statSync(p).size,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'),
})
const write = (name, value) => {
  const p = path.join(own, name)
  assert.ok(!fs.existsSync(p))
  fs.writeFileSync(p, `${JSON.stringify(value, null, 2)}\n`)
  return bind(p)
}
const bindings = read(path.join(own, 'input-binding.json'))
const supplemental = read(path.join(own, 'supplemental-source-context.json'))
const inputFreeze = read(path.join(own, 'input-freeze.json'))
const images = read(path.join(own, 'image-ledger.json'))
assert.equal(images.actualImageOpens, 4)
assert.equal(images.events.length, 4)
assert.ok(images.actualImageOpens <= 8 && images.contextImageOpens <= 24)
for (const b of [bindings.inputFreeze, ...bindings.instructions, ...bindings.inputs,
  ...bindings.sources, ...bindings.nativeContexts, ...bindings.nativeTooling,
  bindings.sourceObservations, bindings.supplemental, supplemental.binding])
  assert.deepEqual(bind(b.path), b)
for (const b of inputFreeze.contexts) assert.deepEqual(bind(b.path), b)

const counts = {
  actualImageOpens: 4, contextImageOpens: 4, maximumImageOpens: 8,
  maximumContextImageOpens: 24, contentRepairs: 1,
  contentRepairsPerFigure: { 'fig-24': 1, 'fig-30': 0 },
  nativeValidationCalls: 3, nativeRenderCalls: 3,
  nativeRenderPasses: 2, nativeRenderFailures: 1,
  resvgPreviews: 2, executionRecoveries: 0,
  sourcePageApprovals: 0, sourceCountsAdded: 0, completeCoursesAdded: 0,
  canonicalPromotions: 0, publisherCalls: 0, deployCalls: 0, databaseCalls: 0,
  modelCalls: 0, otherAgentCalls: 0, chatCalls: 0,
}
const figures = []
for (const [figure, selectedCandidate] of [['fig-24', 'repair1'], ['fig-30', 'first']]) {
  const b = suffix => bind(path.join(own, `${figure}.${selectedCandidate}.${suffix}`))
  const spec = read(b('spec.json').path)
  const render = read(b('render.json').path)
  const geometry = read(b('geometry.json').path)
  const preview = read(b('preview-receipt.json').path)
  const validateReceipt = read(b('validate.receipt.json').path)
  const renderReceipt = read(b('render.receipt.json').path)
  assert.equal(render.status, 'pass')
  assert.equal(geometry.status, 'pass')
  assert.equal(preview.status, 'pass')
  assert.equal(validateReceipt.exitCode, 0)
  assert.equal(renderReceipt.exitCode, 0)
  assert.deepEqual(render.collisions, [])
  assert.deepEqual(spec.display, { purpose: 'instructional', layout: 'scroll', widths: [640], minTextPx: 16 })
  assert.equal(render.spec.sha256, b('spec.json').sha256)
  assert.equal(render.output.svg.sha256, b('svg').sha256)
  assert.equal(geometry.spec.sha256, b('spec.json').sha256)
  assert.deepEqual(preview.nativeSvg, b('svg'))
  assert.deepEqual(preview.preview, b('preview-640.png'))
  assert.deepEqual(preview.spec, b('spec.json'))
  assert.ok(render.displayChecks[0].measuredMinPx >= 16)
  figures.push({
    figure, selectedCandidate,
    source: bind(spec.source.image.path),
    inputContext: bind(path.join(own, `${figure}.input-context.json`)),
    spec: b('spec.json'), svg: b('svg'), nativeRender: b('render.json'),
    preview: b('preview-640.png'), previewReceipt: b('preview-receipt.json'),
    provenance: b('provenance.json'), executableGeometry: b('geometry.json'),
    nativeValidationReceipt: b('validate.receipt.json'),
    nativeRenderReceipt: b('render.receipt.json'),
    measuredMinTextPxAt640: render.displayChecks[0].measuredMinPx,
    contentRepairCount: selectedCandidate === 'repair1' ? 1 : 0,
    authorVerdict: 'PASS_NATIVE_AND_ACTUAL_NEUTRAL_PREVIEW',
    independentReview: 'PENDING', independentApproval: false, promotionAuthorized: false,
  })
}
const commands = [
  {
    command: 'node', args: ['.intentfold/tickets/STEMROBIN-181/tmp/d1816-d135-t9-figures-author/author.mjs', 'build'],
    cwd, exitCode: 0, observedBy: 'functions.exec_command',
    outputSummary: 'Wrote first specs and provenance after verifying supplied hashes. Figure 24 first spec SHA256 5ada927b962c04e0aa2e0c942cdbc594b41d823a45ccf5d8882be270ee7f441f; Figure 30 first spec SHA256 70ff5e69e6dc3d73cb003135c022419ee71f07564052bfe3be07080f1d9a1468.',
  },
  {
    command: 'node', args: ['.intentfold/tickets/STEMROBIN-181/tmp/d1816-d135-t9-figures-author/author.mjs', 'native'],
    cwd, exitCode: 0, observedBy: 'functions.exec_command and functions.write_stdin',
    outputSummary: 'Wrapper finished; native child statuses are authoritative: fig-24 first render exit 2, fig-30 first render exit 0; both first validation exits 0.',
  },
  ...['repair', 'preview'].map(stage => ({
    entryPoint: { command: 'node', args: ['.intentfold/tickets/STEMROBIN-181/tmp/d1816-d135-t9-figures-author/execute.mjs', stage], cwd },
    ...read(path.join(own, `${stage}.command.receipt.json`)),
    receipt: bind(path.join(own, `${stage}.command.receipt.json`)),
  })),
]
const nativeReceipts = fs.readdirSync(own).filter(n => /\.(validate|render)\.receipt\.json$/.test(n))
for (const name of nativeReceipts) {
  const receipt = read(path.join(own, name))
  assert.equal(receipt.cwd, cwd)
  commands.push({ ...receipt, receipt: bind(path.join(own, name)) })
}
const commandBinding = write('commands.json', {
  schema: 'd135/actual-author-commands@1', cwd,
  offline: true, actual: commands,
  currentFinalizationInvocation: {
    command: process.execPath, args: process.argv.slice(1), cwd,
    statusAtReceipt: 'executing; final exit and returned freeze SHA256 are tool-output evidence',
  },
  preflight: {
    sourceReads: 'Required instruction files, schema and native script contracts, supplied input JSON and native contexts; original images opened before source-observations.json was saved.',
    permittedSupplementalRead: {
      command: 'node',
      args: ['-e', "const fs=require('node:fs');const p='ssot-resources/soviet10year-textbooks/artifacts/9p/lessons/phy9-c1-s2-n17/lesson.json';const j=JSON.parse(fs.readFileSync(p,'utf8'));console.log(JSON.stringify(Object.fromEntries(Object.entries(j).map(([k,v])=>[k,Array.isArray(v)?{type:'array',length:v.length}:typeof v])),null,2)); if(j.prose) console.log(JSON.stringify(j.prose.filter(x=>JSON.stringify(x).includes('图 '+String.fromCharCode(36)+'24'+String.fromCharCode(36))),null,2))"],
      cwd, exitCode: 0, projection: bindings.supplemental,
      note: 'Only matching two original prose paragraphs were projected; no exercises, answers, solved examples or modern figures read.',
    },
    dependencyResolution: 'Installed resvg resolved from .claude/skills/ld-s10y-lesson, not .agents/skills; no dependencies installed or changed.',
    failedPathInventory: {
      command: 'rg',
      args: ['--files', '-g', '*resvg*', '-g', '*pngjs*', '-g', '*package.json',
        '.claude/skills/ld-s10y-lesson/node_modules', 'node_modules',
        '/Users/yong/.codex/workspace-dependencies', '/Users/yong/.codex/dependencies'],
      cwd, exitCode: 2,
      stdoutSummary: 'Located installed @resvg/resvg-js and native darwin-arm64 package under existing lesson node_modules.',
      stderr: 'rg: node_modules: No such file or directory (os error 2)\nrg: /Users/yong/.codex/workspace-dependencies: No such file or directory (os error 2)\nrg: /Users/yong/.codex/dependencies: No such file or directory (os error 2)\n',
      classification: 'Nonexistent optional lookup directories, not content failure; no retry, render or image usage reset.',
    },
  },
})
const report = write('report.json', {
  schema: 'd135/first-modern-figure-author-report@1', batch: 'D135',
  book: '9p', lesson: 'phy9-c1-s3-t9',
  status: 'AUTHOR_COMPLETE_INDEPENDENT_REVIEW_PENDING',
  verdict: 'Both selected deterministic candidates pass existing native validation/render, executable source geometry and actual complete neutral 640px author preview. Figure 24 selected repair1 changes only two pressure label x anchors; Figure 30 selects first. No approval or promotion.',
  figures, counts,
  sourceObservations: bind(path.join(own, 'source-observations.json')),
  authorVisualObservations: bind(path.join(own, 'author-visual-observations.json')),
  imageLedger: bind(path.join(own, 'image-ledger.json')),
  inputBinding: bind(path.join(own, 'input-binding.json')),
  supplementalSourceContext: bindings.supplemental,
  commands: commandBinding,
  firstFailurePreserved: {
    spec: bind(path.join(own, 'fig-24.first.spec.json')),
    svg: bind(path.join(own, 'fig-24.first.svg')),
    render: bind(path.join(own, 'fig-24.first.render.json')),
    receipt: bind(path.join(own, 'fig-24.first.render.receipt.json')),
    reason: 'p1 and p2 pressure label exclusion-footprint collisions; status fail, exit 2.',
  },
  remaining: ['Independent figure review', 'Parent collection and closure'],
  surfaceLimitations: 'Offline author preview only; no app, lesson finalization, product scroll interaction or course approval run. Native metadata intentionally retains ticket paths; it is not a durable promotion package.',
  fullTextReReviewed: false, captionLocalizationBoundOnly: true,
  independentApproval: false, promotionAuthorized: false,
  reviewAt1Created: false, sourcePageApprovalImplied: false,
  parentReceivedImagePayload: false, sourceCountsAdded: 0, completeCoursesAdded: 0,
})
const files = fs.readdirSync(own).filter(n => fs.statSync(path.join(own, n)).isFile())
const freeze = write('author-freeze.json', {
  schema: 'd135/author-freeze@1', batch: 'D135',
  status: 'FROZEN_AUTHOR_OUTPUTS_AWAITING_INDEPENDENT_REVIEW',
  report, selected: figures, counts,
  source: bindings.sources, instructions: bindings.instructions,
  inputContexts: bindings.inputs, nativeContexts: bindings.nativeContexts,
  originalSupplementalLesson: supplemental.binding,
  originalProseProjection: bindings.supplemental,
  immutableInputFreeze: bindings.inputFreeze,
  commands: commandBinding,
  ownedFiles: files.map(n => bind(path.join(own, n))),
  independentApproval: false, promotionAuthorized: false,
  completeCoursesAdded: 0, sourceCountsAdded: 0,
  noImagePayloadToParent: true,
  freezeSelfHashLocation: 'Returned final text; a file cannot contain its own SHA256.',
})
for (const b of read(freeze.path).ownedFiles) assert.deepEqual(bind(b.path), b)
console.log(JSON.stringify({ report, authorFreeze: freeze,
  figures: figures.map(f => ({ figure: f.figure, selectedCandidate: f.selectedCandidate,
    spec: f.spec, svg: f.svg, preview: f.preview })),
  counts, independentApproval: false, promotionAuthorized: false }, null, 2))
