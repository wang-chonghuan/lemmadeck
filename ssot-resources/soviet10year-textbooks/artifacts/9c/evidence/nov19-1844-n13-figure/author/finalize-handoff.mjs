import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const out = path.join(root, '.tmp/stemrobin-184-resume/n13-figure-author')
const digest = value => crypto.createHash('sha256').update(value).digest('hex')
const read = name => JSON.parse(fs.readFileSync(path.join(out, name)))
const entry = file => {
  const bytes = fs.readFileSync(file)
  return {path: file, bytes: bytes.length, sha256: digest(bytes)}
}
const bindings = read('author-bindings.first.json')
const spec = read('tbl-p0056-01.spec.json')
const render = read('tbl-p0056-01.render.json')
const observation = read('output-observation.first.json')
const context = read('author-context.first.json')
const usage = read('image-usage.json')
const specFile = entry(path.join(out, 'tbl-p0056-01.spec.json'))
const svgFile = entry(path.join(out, 'tbl-p0056-01.svg'))
assert.equal(specFile.sha256, render.spec.sha256)
assert.equal(svgFile.sha256, render.output.svg.sha256)
assert.equal(entry(path.join(out, 'source-inventory.first.json')).sha256, bindings.independentInventorySha256)
assert.equal(read('render.receipt.json').actualExit, 0)
assert.equal(read('validate-draft-repair-1.receipt.json').actualExit, 0)
assert.equal(read('inspect-output-technical-recovery.receipt.json').actualExit, 0)
assert.equal(usage.total, 3)
assert.equal(usage.opens.length, 3)
assert.equal(usage.sourceReopens, 0)
assert.equal(render.status, 'pass')
assert.equal(spec.assertions.length, 65)
const latestInputs = context.files.map(file => ({
  ...entry(path.join(root, file.path)),
  authoringSha256: file.sha256,
  byteIdenticalToAuthorContext: entry(path.join(root, file.path)).sha256 === file.sha256
}))
assert.equal(latestInputs[0].sha256, spec.source.image.sha256)
const currentLesson = JSON.parse(fs.readFileSync(latestInputs[1].path))
const currentExercises = JSON.parse(fs.readFileSync(latestInputs[2].path))
const currentParagraph = currentLesson.prose.find(item => item.source_refs?.includes('p0056#2'))
const math = text => [...text.matchAll(/\$([^$]+)\$/g)].map(match => match[1].replace(/\s+/g, ''))
assert.deepEqual(math(currentParagraph.text), math(spec.source.authoritativeText[0].text))
assert.deepEqual(currentExercises.exercises.flatMap(item =>
  (item.figure_refs || []).filter(ref => ref === spec.id)), [])
const toolFiles = [
  '.agents/skills/ld-s10y-image/assets/figure-spec.schema.json',
  '.agents/skills/ld-s10y-image/scripts/validate_spec.py',
  '.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
  '.agents/skills/ld-s10y-image/scripts/materialize_arrowheads.mjs'
].map(file => entry(path.join(root, file)))
const handoff = {
  schema: 'bounded-modern-figure-author-handoff@1',
  ticket: 'STEMROBIN-184',
  lesson: 'ana9-c3-s1-n13',
  figure: 'tbl-p0056-01',
  phase: 'B continuation AUTHOR',
  disposition: 'candidate complete; STOP at parent intake; independent review pending',
  artifacts: {
    spec: specFile,
    render: entry(path.join(out, 'tbl-p0056-01.render.json')),
    svg: svgFile,
    naturalRaster: entry(path.join(out, 'tbl-p0056-01.png')),
    mobileRaster: entry(path.join(out, 'tbl-p0056-01.mobile-350.png')),
    selfObservations: entry(path.join(out, 'self-observations.first.json')),
    executableOutputObservation: entry(path.join(out, 'output-observation.first.json'))
  },
  hashBindings: {
    source: latestInputs[0],
    independentSourceInventory: entry(path.join(out, 'source-inventory.first.json')),
    mathematicalSourceAndContext: entry(path.join(out, 'math-binding.first.json')),
    authoringContext: entry(path.join(out, 'author-context.first.json')),
    initialSpec: entry(path.join(out, 'tbl-p0056-01.spec.first.json')),
    finalSpec: specFile,
    frozenAuthoringInputs: context.files,
    observedInputsAtMobileCheck: observation.inputBindingsAtObservation,
    latestInputsAtIntake: latestInputs,
    exactFigureParagraphTextUnchanged: currentParagraph.text === spec.source.authoritativeText[0].text,
    figureParagraphMathUnchanged: true,
    toolFiles
  },
  machineStages: {
    initialDraft: {actualExit: 2, receipt: entry(path.join(out, 'validate-draft.receipt.json'))},
    draftAfterOneSpecRepair: {actualExit: 0, receipt: entry(path.join(out, 'validate-draft-repair-1.receipt.json'))},
    render: {actualExit: 0, invocations: 1, receipt: entry(path.join(out, 'render.receipt.json'))},
    initialOutputInspection: {actualExit: 1, receipt: entry(path.join(out, 'inspect-output.receipt.json'))},
    recoveredOutputInspection: {actualExit: 0, receipt: entry(path.join(out, 'inspect-output-technical-recovery.receipt.json'))},
    firstFailure: entry(path.join(out, 'first-failure.receipt.json')),
    realSpecRepairs: 1,
    inspectionOnlyTechnicalCorrections: 1,
    passedStagesReplayed: [],
    rendererOutputsHandEdited: false
  },
  sourceCoverage: {
    groups: spec.source.inventory.map(group => ({
      id: group.id, objects: group.objects, assertions: group.assertions, requires: group.requires || []
    })),
    assertionCount: spec.assertions.length,
    objectCountUsedAsMathProof: false,
    noSolvedAdditionsAbsentFromSource: true,
    allVisibleLabelsNumeric: true,
    recurrenceArrowDirections: ['right', 'right']
  },
  display: {
    purpose: spec.display.purpose,
    naturalMaxWidthPx: spec.display.maxWidthPx,
    widths: spec.display.widths,
    minTextPx: spec.display.minTextPx,
    renderChecks: render.displayChecks,
    collisions: render.collisions,
    standaloneMediaWidthPx: observation.displayAssertions.actualMediaWidthPx,
    browser: 'isolated HEADLESS existing repository Playwright copies; closed after each invocation',
    formalProductSurfaceAcceptance: false
  },
  imageUsage: usage,
  authorizationBoundary: {
    formalFigureReview: 'not performed',
    formalFigureApproval: 'not given',
    formalLessonApproval: 'not given',
    reviewFileCreated: false,
    durablePromotion: false,
    figuresTemplateModified: false,
    canonicalFilesModified: false,
    backendGitDatabasePublisherPaidGenerationNewChatOtherWorkerMessages: 'none',
    writeRoot: out,
    parentReceives: 'TEXT ONLY; no image payloads'
  }
}
const resultPath = path.join(out, 'author-result.first.json')
fs.writeFileSync(resultPath, `${JSON.stringify(handoff, null, 2)}\n`, {flag: 'wx'})
for (const name of fs.readdirSync(out)) {
  const file = path.join(out, name)
  if (fs.statSync(file).isFile()) fs.chmodSync(file, 0o444)
}
const files = fs.readdirSync(out).sort().map(name => entry(path.join(out, name)))
const manifestPath = path.join(out, 'full-file-manifest.json')
const manifest = {
  schema: 'bounded-author-file-manifest@1',
  root: out,
  scope: 'Every candidate, source/context snapshot, script, raw stdout/stderr, receipt and author handoff file in this directory. No source bytes duplicated.',
  manifestSelfExclusion: 'This envelope cannot contain its own SHA-256. Its separate path/bytes/SHA-256 receipt is returned in the final text.',
  files
}
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, {flag: 'wx'})
fs.chmodSync(manifestPath, 0o444)
console.log(JSON.stringify({
  result: entry(resultPath),
  manifest: entry(manifestPath),
  payloadFileCount: files.length,
  totalFileCountIncludingManifest: files.length + 1,
  spec: specFile, svg: svgFile,
  sourceHash: bindings.sourceImageSha256,
  mathHash: bindings.mathBindingSha256,
  contextHash: bindings.authorContextSha256,
  latestLessonHash: latestInputs[1].sha256,
  figureParagraphTextUnchanged: handoff.hashBindings.exactFigureParagraphTextUnchanged,
  images: usage.total,
  stop: 'parent intake; independent review pending'
}, null, 2))
