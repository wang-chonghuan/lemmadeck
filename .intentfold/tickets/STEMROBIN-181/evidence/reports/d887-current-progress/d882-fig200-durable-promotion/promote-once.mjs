import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const ticket = path.join(repo, '.intentfold/tickets/STEMROBIN-181')
const tmp = path.join(ticket, 'tmp')
const out = path.dirname(new URL(import.meta.url).pathname)
const durable = path.join(ticket, 'evidence/reports/d882-fig200-promotion')
const raw = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/10p')
const base = path.join(raw, 'editions/modern-us-neutral/figures/fig-200')
const authorBase = path.join(tmp, 'd859-n86-fig200-disclosure-repair/frozen/fig-200')
const read = f => JSON.parse(fs.readFileSync(f, 'utf8'))
const sha = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')
const bind = f => ({ path: path.relative(repo, f), sha256: sha(f) })
const save = (f, value) => {
  fs.mkdirSync(path.dirname(f), { recursive: true })
  fs.writeFileSync(f, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
  return bind(f)
}
const indexFile = path.join(ticket, 'evidence/index.json')
const meterFile = path.join(ticket, 'production-meter.json')
const index = read(indexFile)
const meter = read(meterFile)
assert.equal(meter.imageCalls, 12)
assert.ok(!fs.existsSync(base + '.spec.json'))
const authorFile = path.join(tmp, 'd859-n86-fig200-disclosure-repair/report.json')
const reviewFile = path.join(tmp, 'd871-n86-fig200-disclosure-affected-review/report.json')
assert.equal(sha(authorFile), '2fd5b0c6d6b2a6774a64a777fc2e2b4f885dbfab8b9c61ef41773f8e022be5b3')
assert.equal(sha(reviewFile), '664aa3df948a13f5ad79b4878b801d7b82f4ed0f8b829852ef6a3f2f5aa995cd')
const spec = read(authorBase + '.spec.json')
const before = structuredClone(spec)
const sourceImage = path.join(raw, 'figures/fig-200.png')
assert.equal(sha(sourceImage), spec.source.image.sha256)
assert.equal(sha(spec.source.image.path), sha(sourceImage))
spec.source.image.path = path.relative(repo, sourceImage)
const restored = structuredClone(spec)
restored.source.image.path = before.source.image.path
assert.deepEqual(restored, before)
const outputs = [save(base + '.spec.json', spec)]
fs.copyFileSync(authorBase + '.svg', base + '.svg', fs.constants.COPYFILE_EXCL)
outputs.push(bind(base + '.svg'))
const render = read(authorBase + '.render.json')
assert.equal(render.status, 'pass')
assert.equal(render.spec.sha256, sha(authorBase + '.spec.json'))
assert.equal(render.output.svg.sha256, sha(base + '.svg'))
render.spec = bind(base + '.spec.json')
render.output.svg = bind(base + '.svg')
outputs.push(save(base + '.render.json', render))
const command = [
  '.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
  '.agents/skills/ld-s10y-image/scripts/record_review.py',
  '--spec', base + '.spec.json', '--render', base + '.render.json',
  '--output', base + '.review.json', '--status', 'pass',
  '--notes', `Inherited d844 FIRST23-assertion geometry/readability PASS plus d871 independent disclosure/spacing affected PASS, SHA256 ${sha(reviewFile)}. All geometry, objects and rendered SVG bytes unchanged; only exact-source path and durable spec/render/output bindings changed. Source image SHA256 ${sha(sourceImage)} matches original reviewed input. No render or content review replay. Plate V Roman/color HOLD remains; not whole-n86 approval.`,
]
const result = spawnSync(command[0], command.slice(1), { cwd: repo, encoding: 'utf8', timeout: 120000 })
const call = save(path.join(out, 'record-review.receipt.json'), {
  command, cwd: repo, exit: result.status, stdout: result.stdout, stderr: result.stderr,
})
assert.equal(result.status, 0, result.stdout + result.stderr)
outputs.push(bind(base + '.review.json'))
const report = save(path.join(durable, 'promoted.json'), {
  ticket: 'STEMROBIN-181', batch: 'D034', figure: 'fig-200', card: 'phy10-c2-s3-n86',
  status: 'FIGURE-PASS-DURABLE-METADATA-ONLY-N86-PLATEV-HOLD',
  author: index.reports.find(b => b.sha256 === sha(authorFile)),
  affectedReview: index.reports.find(b => b.sha256 === sha(reviewFile)),
  sourcePathBefore: before.source.image, sourcePathAfter: spec.source.image,
  metadataOnlySourcePathChange: true, svgBytesUnchanged: true,
  geometryAssertionsUnchanged: true, outputs, call, newCompleteCards: 0,
  plateVBypass: false, figureRenderReplays: 0, parentImageLoads: 0, paidCalls: 0,
})
index.reports.push({ ...report, batch: 'D034' })
meter.currentCheckpoint.productionContinuation.fig200 = { status: 'FIGURE-PASS-DURABLE-N86-PLATEV-HOLD', receipt: report }
meter.activeHumanDirection.nextSourceCheckpoints.n86 ??= {}
Object.assign(meter.activeHumanDirection.nextSourceCheckpoints.n86, {
  fig200: 'FIGURE-PASS-DURABLE', fig200Promotion: report, completeCard: false,
})
index.updatedAt = meter.updatedAt = new Date().toISOString()
fs.writeFileSync(indexFile, JSON.stringify(index, null, 2) + '\n')
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n')
console.log(JSON.stringify({ report, paidCalls: 0, newCompleteCards: 0, svgUnchanged: true }))
