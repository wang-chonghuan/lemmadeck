import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const out = path.dirname(fileURLToPath(import.meta.url))
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp')
const target = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/10p/editions/modern-us-neutral/figures')
const reviewFile = path.join(tmp, 'd895-n87-fig201202-affected-review/report.json')
const sha = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')
const bind = f => ({ path: path.relative(repo, f), sha256: sha(f) })
const read = f => JSON.parse(fs.readFileSync(f, 'utf8'))
const save = (f, value) => {
  fs.mkdirSync(path.dirname(f), { recursive: true })
  fs.writeFileSync(f, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
  return bind(f)
}
assert.equal(sha(reviewFile), 'eed2b9ed2cb8fe683c5e4aa78af89247dd30007a96e9a1df2a63baacf3ba629d')
const review = read(reviewFile)
assert.equal(review.status, 'SCOPED-AFFECTED-INDEPENDENT-PASS')
assert.equal(review.figures.length, 2)
assert.ok(review.figures.every(f => f.result === 'PASS' && f.metadataCurrentText === 'PASS'))
assert.ok(!fs.existsSync(path.join(out, 'report.json')))
const outputs = []
const calls = []
for (const figure of review.figures) {
  const id = figure.figure
  const base = path.join(target, id)
  assert.ok(!fs.existsSync(base + '.spec.json'))
  const source = figure.outputs
  for (const [ext, record] of [['spec.json', source.spec], ['svg', source.svg]]) {
    assert.equal(sha(record.path), record.sha256)
    fs.mkdirSync(target, { recursive: true })
    fs.copyFileSync(record.path, base + '.' + ext, fs.constants.COPYFILE_EXCL)
    assert.equal(sha(base + '.' + ext), record.sha256)
    outputs.push(bind(base + '.' + ext))
  }
  const spec = read(base + '.spec.json')
  assert.equal(sha(path.resolve(repo, spec.source.image.path)), spec.source.image.sha256)
  assert.ok(!spec.source.image.path.includes('/tmp/'))
  const priorRender = source.render ?? source.priorRenderExactCopy
  assert.equal(sha(priorRender.path), priorRender.sha256)
  const render = read(priorRender.path)
  assert.equal(render.status, 'pass')
  assert.equal(render.output.svg.sha256, sha(base + '.svg'))
  if (id === 'fig-201') assert.equal(figure.unchangedOtherSpecFieldsAndSvg, true)
  else assert.equal(render.spec.sha256, sha(base + '.spec.json'))
  render.spec = bind(base + '.spec.json')
  render.output.svg = bind(base + '.svg')
  outputs.push(save(base + '.render.json', render))
  const command = ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
    '.agents/skills/ld-s10y-image/scripts/record_review.py',
    '--spec', base + '.spec.json', '--render', base + '.render.json',
    '--output', base + '.review.json', '--status', 'pass', '--notes',
    `Inherited d877 original source/inventory/unaffected geometry/readability PASS plus d895 independent affected PASS SHA256 ${sha(reviewFile)}. fig201 is current authoritativeText metadata-only with byte-identical SVG/geometry/assertions; fig202 current normal-incidence depiction and labels independently pass 331/342/640. Original label collision and targeted recovery retained. Exact spec/SVG bytes copied, only render spec/output bindings changed; no renderer or content-review replay. Whole-card/native/display pending.`]
  const r = spawnSync(command[0], command.slice(1), { cwd: repo, encoding: 'utf8', timeout: 120000 })
  const receipt = save(path.join(out, id + '.record-review-FIRST.json'), {
    command, cwd: repo, exit: r.status, stdout: r.stdout, stderr: r.stderr,
    firstFailurePreserved: r.status !== 0,
  })
  calls.push(receipt)
  assert.equal(r.status, 0, r.stdout + r.stderr)
  outputs.push(bind(base + '.review.json'))
}
const report = save(path.join(out, 'report.json'), {
  ticket: 'STEMROBIN-181', card: 'phy10-c2-s3-n87',
  status: 'FIGURES-PASS-DURABLE-NATIVE-PENDING',
  independentAffectedReview: bind(reviewFile), outputs, calls,
  figures: ['fig-201', 'fig-202'], svgSpecBytesUnchangedFromApprovedCandidate: true,
  metadataOnlyPromotion: true, fig201PriorRenderContentReused: true,
  rendererReplays: 0, nativeFinalizationReplays: 0, parentNewImages: 0, paidCalls: 0,
  completeCard: false, databasePublisherDeploy: false, commitPush: false,
})
console.log(JSON.stringify({ report, outputs: outputs.length, paidCalls: 0 }))
