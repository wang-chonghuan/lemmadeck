import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const started = new Date().toISOString()
const hash = bytes => createHash('sha256').update(bytes).digest('hex')
const describe = file => {
  const bytes = fs.readFileSync(file)
  return { path: file, bytes: bytes.length, sha256: hash(bytes) }
}
const write = (name, value) => {
  const file = path.join(root, name)
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
  return describe(file)
}
const inputs = JSON.parse(fs.readFileSync(path.join(root, 'input-manifest.json'), 'utf8'))
const observation = JSON.parse(fs.readFileSync(path.join(root, 'full-text-observation.json'), 'utf8'))
const retention = JSON.parse(fs.readFileSync(path.join(root, 'retained-before-manifest-observation.json'), 'utf8'))
const workspace = '/Users/yong/.codex/worktrees/a07e/lemmadeck'
const supplement = []
for (const name of [
  'production-assemble10c125-corrected-once.mjs',
  'production-retain125-factorial-before-once.mjs',
  'production-retain125-first-boundary-failure-once.mjs',
  'production-modern10c125-once.mjs',
]) {
  const relative = `.intentfold/tickets/STEMROBIN-184/tmp/${name}`
  const source = path.join(workspace, relative)
  const bytes = fs.readFileSync(source)
  const retained = path.join(root, 'inputs/workspace', relative)
  fs.writeFileSync(retained, bytes, { flag: 'wx' })
  supplement.push({ source, retained, bytes: bytes.length, sha256: hash(bytes),
    role: 'Supplemental byte retention of initially read parent command definitions; never executed.' })
}
write('supplemental-input-manifest.json', {
  schema: 'first-modern-text-discovery-input-supplement@1', inputs: supplement,
  scope: 'Four command definitions already read in discovery, hash-bound without execution or check reruns.',
})
const retainedObservations = [...inputs.inputs, ...supplement].map(input => {
  const actual = describe(input.retained)
  return { original: input.source, retained: actual.path, bytes: actual.bytes,
    sha256: actual.sha256, manifestBytes: input.bytes, manifestSha256: input.sha256,
    matchesManifest: actual.bytes === input.bytes && actual.sha256 === input.sha256 }
})
const lessonPath = inputs.inputs.find(input =>
  input.source.endsWith('/author-frozen/lesson.template.json')).retained
const frozen = JSON.parse(fs.readFileSync(lessonPath, 'utf8'))
const flowPath = inputs.inputs.find(input => input.source.endsWith('/first-flow/stdout.txt')).retained
const flow = fs.readFileSync(flowPath, 'utf8')
const boundary = frozen.section_breaks[0]
const summary = {
  status: 'FIRST_TEXT_REVIEW_PASS_SOURCE_FIDELITY_ONLY',
  objects: observation.rawObjectCount, sentencesManuallyReviewed: 11,
  exercisesReviewed: 0, figuresReviewed: 0, imagesLoaded: 0, parentImages: '24/24 permanent',
  inputFilesRetained: retainedObservations.length,
  inputCopiesMatchingManifest: retainedObservations.filter(item => item.matchesManifest).length,
  beforeRepairFiles: retention.actualFiles, beforeRepairBytes: retention.actualBytes,
  beforeRepairFilesMatchingManifest: retention.files.filter(item => item.matches).length,
  embeddedSourceEqualsRaw: observation.embeddedSourceEqualsRaw,
  objectsWithExactSourceRelativeContent: observation.objects.filter(item =>
    item.sourceRelativeContentEqualPeriodAndWhitespaceOnly &&
    item.sourceTextSnapshotExact && item.sourceFieldsUnchanged &&
    item.authoritativePageTextEqualsRawIgnoringPrintedWrap).length,
  authoredBoundaryInExistingFlow: flow.includes('break: ' + JSON.stringify(boundary)),
  report: describe(path.join(root, 'report.md')),
  sourceOriginalsRehashed: false,
  note: 'Four discovery definitions byte-retained, then local bytes/manual review sealed. No original-file rewrite, source checks or parent consumption.',
}
write('retained-input-observation.json', { method: 'Local retained byte hashes only', files: retainedObservations })
const files = []
const walk = directory => {
  for (const name of fs.readdirSync(directory).sort()) {
    const file = path.join(directory, name)
    if (fs.lstatSync(file).isDirectory()) walk(file)
    else files.push(describe(file))
  }
}
walk(root)
const manifest = write('output-manifest.json', {
  schema: 'independent-first-modern-text-outputs@1',
  ticket: 'STEMROBIN-184', session: 'SessionB',
  verdict: summary.status, files,
  coverage: 'Every existing payload file, including complete retained inputs, report, scripts and read/diff receipts.',
  selfReferenceExclusions: ['output-manifest.json', 'retention-receipt.json'],
  originalInputs: describe(path.join(root, 'input-manifest.json')),
  supplementalInputs: describe(path.join(root, 'supplemental-input-manifest.json')),
})
const receipt = write('retention-receipt.json', {
  schema: 'independent-first-modern-text-local-retention@1',
  executable: process.execPath, args: process.argv.slice(1), cwd: process.cwd(), runtime: process.version,
  started, finished: new Date().toISOString(), exitCode: 0,
  actualOperation: 'Byte-retain four previously read discovery definitions; hash-only seal local copies/report; no original rehash or acceptance rerun.',
  outputManifest: manifest, summary,
  reportConsumedAndRetainedLocally: true,
  parentConsumptionObserved: false, parentPromotionApproved: false,
  images: 0, browser: 0, tests: 0, pipelineTools: 0,
})
process.stdout.write(JSON.stringify({ report: summary.report, manifest, receipt, summary }, null, 2) + '\n')
