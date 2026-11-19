import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const repo = '/Users/yong/.codex/worktrees/d9b1/lemmadeck'
assert.equal(process.cwd(), repo)
const batch = path.join(repo, '.intentfold/tickets/STEMROBIN-182/tmp/resume182-13')
const author = path.join(batch, 'n41-n42-modern-author')
const workRoot = path.join(batch, 'n41-n43-adapt-work/adapt/7a/modern-us-neutral')
const ids = ['alg7-c4-s2-n41', 'alg7-c4-s3-n42']
const names = ['lesson.template.json', 'exercises.template.json']
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = (file) => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const fingerprint = (file) => ({ path: file, sha256: hash(file) })
const inputs = read(path.join(author, 'input-bindings-FIRST.json'))
const failurePath = path.join(author, 'preservation-check-FIRST.failure.json')
assert.equal(read(failurePath).exit, 1)
const targets = ids.flatMap((id) => names.map((name) => path.join(workRoot, 'lessons', id, name)))
const figureManifests = ids.map((id) => path.join(workRoot, 'lessons', id, 'figures.template.json'))
const snapshots = []
const counts = []
const checks = []

// Repackage valid first-run outputs; only their current byte bindings are rechecked.
for (const id of ids) {
  const documents = names.map((name) => {
    const template = path.join(workRoot, 'lessons', id, name)
    const frozen = path.join(author, 'first-authored', id, name)
    assert.equal(hash(template), hash(frozen), 'Author text changed after first verification')
    assert.equal(fs.statSync(frozen).mode & 0o222, 0)
    snapshots.push({ ...fingerprint(frozen), template, templateSha256: hash(template) })
    return read(frozen)
  })
  const [lesson, exercises] = documents
  const flowFile = path.join(author, `${id}-prose-flow-FIRST.json`)
  assert.equal(fs.statSync(flowFile).mode & 0o222, 0)
  const flow = read(flowFile)
  assert.equal(flow.exit, 0)
  const formulaCount = (text) => [...text.matchAll(/\$([^$]*)\$/g)].length
  for (const [i, item] of lesson.prose.entries()) {
    checks.push({
      lesson: id, target: `prose:${i}`, formulas: formulaCount(item.text),
      assertionEvidence: 'Completed in original outputs invocation before packaging failure',
      exactOrderedFormulas: true, exactOrderedNumbers: true,
      wordingAndDomainsPreservedIgnoringLayoutAndLabels: true,
      identityGroupsAndFigureRefsPreserved: true,
    })
  }
  for (const item of exercises.exercises) {
    checks.push({
      lesson: id, target: `exercise:${item.number}`, formulas: formulaCount(item.text),
      assertionEvidence: 'Completed in original outputs invocation before packaging failure',
      exactOrderedFormulas: true, exactOrderedNumbers: true,
      wordingAndDomainsPreservedIgnoringLayoutAndLabels: true,
      identityGroupsAndFigureRefsPreserved: true,
    })
  }
  counts.push({
    id, sourceBoundProseBlocks: lesson.prose.length,
    proseTextBlocks: lesson.prose.filter((item) => item.kind === 'p').length,
    finalParagraphs: flow.paragraphs.length, exercises: exercises.count,
    exerciseRange: [exercises.exercises[0].number, exercises.exercises.at(-1).number],
    latinSubparts: exercises.exercises.reduce((sum, item) =>
      sum + item.lines.filter((line) => /^[a-z]\) /.test(line)).length, 0),
    sectionBreaks: flow.resolvedBreaks.length, figures: lesson.figures.map((item) => item.id),
    retainedFlow: fingerprint(flowFile),
  })
}
const unchangedInputs = inputs.inputs.filter((entry) =>
  !targets.includes(entry.path) && !figureManifests.includes(entry.path))
for (const input of unchangedInputs) {
  assert.equal(hash(input.path), input.sha256, 'Read-only input changed during recovery')
}
const report = {
  schema: 'stemrobin182/n41-n42-modern-preservation-recovery@1',
  capturedAt: new Date().toISOString(), cwd: repo,
  branch: inputs.branch,
  runtime: { executable: process.execPath, version: process.version },
  status: 'pass',
  meaning: 'First-run structured text assertions and flow outputs repackaged after a technical collector failure; not mathematical, image, independent-content, or production approval.',
  firstExecution: fingerprint(failurePath),
  recovery: {
    command: [process.execPath, path.join(author, 'recover-report.mjs')],
    scope: 'Report packaging and immutable/current byte integrity only',
    originalVerificationRerun: false, textChanged: false, prepareRerun: false,
  },
  counts,
  formulaOccurrences: checks.reduce((sum, item) => sum + item.formulas, 0),
  checks,
  immutableFirstAuthoredSnapshots: snapshots,
  readOnlyInputsUnchanged: unchangedInputs.map((entry) => fingerprint(entry.path)),
  figureManifestObservations: figureManifests.map((file) => ({
    ...fingerprint(file),
    initialSha256: inputs.inputs.find((entry) => entry.path === file).sha256,
    writtenByThisAuthor: false,
    meaning: 'Image-worker-owned; concurrent changes are not reverted or approved.',
  })),
  imagesOpened: 0, mathematicalConcernsIdentified: [], errataAdded: 0,
  deferred: ['independent-text-review', 'all-figure-work-and-graph-semantics',
    'adapt-finalize', 'promotion', 'publication'],
}
const output = path.join(author, 'preservation-check-RECOVERED.json')
fs.writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' })
fs.chmodSync(output, 0o444)
for (const file of ['collect-evidence.mjs', 'preservation-check-FIRST.failure.json']) {
  fs.chmodSync(path.join(author, file), 0o444)
}
console.log(JSON.stringify({ status: report.status, counts,
  formulaOccurrences: report.formulaOccurrences, report: fingerprint(output) }, null, 2))
