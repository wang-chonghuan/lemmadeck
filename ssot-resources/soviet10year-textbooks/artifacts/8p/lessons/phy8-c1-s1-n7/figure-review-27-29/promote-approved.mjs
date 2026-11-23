import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import { spawnSync } from 'node:child_process'

const root = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180'
assert.equal(process.cwd(), root)
const base = 'ssot-resources/soviet10year-textbooks/artifacts/8p'
const reviewDir = `${base}/lessons/phy8-c1-s1-n7/figure-review-27-29`
const canonical = `${base}/editions/modern-us-neutral/figures`
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const bind = file => ({ path: file, sha256: sha(file) })
const evidence = read(`${reviewDir}/inspections.json`)
const report = bind(`${reviewDir}/first-independent-figure-review.md`)
assert.ok(fs.readFileSync(report.path, 'utf8').includes('**PASS for all three current figures:'))
const protectedAuthor = read(`${reviewDir}/protected-author-bindings.json`)
for (const file of protectedAuthor.files) assert.equal(sha(file.path), file.sha256)
for (const file of evidence.templatesReadOnly) assert.equal(sha(file.path), file.sha256)
for (const figure of evidence.figures) {
  for (const input of figure.inputs) assert.equal(sha(input.path), input.sha256)
  assert.equal(sha(figure.source.path), figure.source.sha256)
  assert.equal(sha(figure.composite.path), figure.composite.sha256)
  for (const ext of ['spec.json', 'svg', 'render.json', 'review.json']) {
    assert.ok(!fs.existsSync(`${canonical}/${figure.figure}.${ext}`), 'Existing canonical target: stop without overwrite')
  }
}
const results = []
for (const figure of evidence.figures) {
  const stem = `${canonical}/${figure.figure}`
  fs.copyFileSync(figure.inputs[0].path, `${stem}.spec.json`, fs.constants.COPYFILE_EXCL)
  fs.copyFileSync(figure.inputs[1].path, `${stem}.svg`, fs.constants.COPYFILE_EXCL)
  const originalRender = read(figure.authorRenderSnapshot.path)
  const render = structuredClone(originalRender)
  render.spec.path = `${stem}.spec.json`
  render.output.svg.path = `${stem}.svg`
  fs.writeFileSync(`${stem}.render.json`, JSON.stringify(render, null, 2) + '\n', { flag: 'wx' })
  assert.equal(sha(`${stem}.spec.json`), figure.inputs[0].sha256)
  assert.equal(sha(`${stem}.svg`), figure.inputs[1].sha256)
  const comparison = read(`${stem}.render.json`)
  comparison.spec.path = originalRender.spec.path
  comparison.output.svg.path = originalRender.output.svg.path
  assert.deepEqual(comparison, originalRender)
  const notes = `First independent FIGURE PASS after inspecting original source and actual full final-width/theme pixels. ` +
    `Report: ${report.path} SHA-256 ${report.sha256}. ` +
    `Inspection evidence: ${reviewDir}/inspections.json SHA-256 ${sha(`${reviewDir}/inspections.json`)}. ` +
    `Source inventory, mathematical/cultural fidelity, exact query coordinates, all labels/units, ` +
    `318/358/480px and neutral/accent/print roles approved. Reviewer image loads 6; repairs 0. ` +
    `Spec/SVG copied byte-identically from candidate-2; renderer paths only rebound; no rerender.`
  assert.ok(!fs.existsSync(`${stem}.review.json`))
  const recorded = spawnSync('python3', ['.agents/skills/ld-s10y-image/scripts/record_review.py',
    '--spec', `${stem}.spec.json`, '--render', `${stem}.render.json`,
    '--output', `${stem}.review.json`, '--status', 'pass', '--notes', notes], {
    cwd: root, encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  })
  assert.equal(recorded.status, 0, recorded.stdout + recorded.stderr)
  const review = read(`${stem}.review.json`)
  assert.equal(review.schema, 'ld-s10y-image/review@1')
  assert.equal(review.status, 'pass')
  for (const file of [review.source, review.spec, review.render, ...Object.values(review.outputs)]) {
    assert.equal(sha(file.path), file.sha256)
    assert.ok(!file.path.startsWith('.tmp/'))
  }
  results.push({ figure: figure.figure, source: review.source,
    outputs: ['spec.json', 'svg', 'render.json', 'review.json'].map(ext => bind(`${stem}.${ext}`)),
    candidateSpecAndSvgByteIdentical: true, renderChangesOnly: ['spec.path', 'output.svg.path'],
    recordReviewExecution: { status: recorded.status, stdout: recorded.stdout } })
  console.log(recorded.stdout.trim())
}
for (const file of protectedAuthor.files) assert.equal(sha(file.path), file.sha256)
for (const file of evidence.templatesReadOnly) assert.equal(sha(file.path), file.sha256)
for (const figure of evidence.figures) {
  for (const file of figure.inputs) assert.equal(sha(file.path), file.sha256)
}
fs.writeFileSync(`${reviewDir}/promotion-bindings.json`, JSON.stringify({
  schema: 'ld-s10y-image/independent-promotion@1', ticket: evidence.ticket, lesson: evidence.lesson,
  verdict: 'PASS', completedAt: new Date().toISOString(), imageLoads: 6, imageReopens: 0, imageCrops: 0,
  report, inspections: bind(`${reviewDir}/inspections.json`), figures: results,
  protectedAuthor: bind(`${reviewDir}/protected-author-bindings.json`),
  protectedAuthorFilesUnchanged: true, readonlyTemplatesUnchanged: true,
  originalCandidateFilesUnchanged: true, canonicalTargetsAbsentBeforeWrites: true,
  rerendered: false, contentRepairs: 0, parentOwnsManifestFinalizeAnswersChoicesDisplayAndGit: true,
}, null, 2) + '\n', { flag: 'wx' })
