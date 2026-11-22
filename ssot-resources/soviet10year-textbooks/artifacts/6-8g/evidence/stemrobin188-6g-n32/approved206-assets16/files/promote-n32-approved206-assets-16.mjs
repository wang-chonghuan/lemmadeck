import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { core6g, retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const receivedFile = path.join(tmp, 'receive-206-revision2-review-16/record.json')
const received = read(receivedFile)
assert.equal(received.status, 'FIG206_REVISION2_AFFECTED_INDEPENDENT_PASS_RECEIVED')
const retentionFile = path.join(core6g,
  'evidence/stemrobin188-6g-n32/206-revision2-independent-review16/retention.json')
const retention = read(retentionFile)
const report = retention.mappings.find(item => item.sha256 === received.report.sha256)
assert.ok(report?.path && !path.isAbsolute(report.path))
const own = path.join(tmp, 'n32-approved206-assets-16')
assert.ok(!fs.existsSync(own))
fs.mkdirSync(own)
const prefix = path.join(core6g, 'editions/modern-us-neutral/figures/fig-206')
const relative = path.relative(repo, prefix)
for (const extension of ['spec.json', 'svg', 'render.json', 'review.json'])
  assert.ok(!fs.existsSync(`${prefix}.${extension}`))
const current = received.currentNamedBindings
for (const [kind, extension] of [['spec', 'spec.json'], ['svg', 'svg']]) {
  assert.equal(hash(current[kind].path), current[kind].sha256)
  fs.copyFileSync(current[kind].path, `${prefix}.${extension}`, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(`${prefix}.${extension}`), current[kind].sha256)
}
assert.equal(hash(current.render.path), current.render.sha256)
const metadata = read(current.render.path)
assert.equal(metadata.status, 'pass')
assert.equal(metadata.spec.sha256, hash(`${prefix}.spec.json`))
assert.equal(metadata.output.svg.sha256, hash(`${prefix}.svg`))
metadata.spec.path = `${relative}.spec.json`
metadata.output.svg.path = `${relative}.svg`
assert.ok(!JSON.stringify(metadata).includes('.intentfold/'))
save(`${prefix}.render.json`, metadata)
const argv = ['python3', '-B', '.agents/skills/ld-s10y-image/scripts/record_review.py',
  '--spec', `${relative}.spec.json`, '--render', `${relative}.render.json`,
  '--output', `${relative}.review.json`, '--status', 'pass',
  '--notes', `Revision2 affected independent annotation/true-solid-conclusion/canvas/native/actual300358 PASS in ${path.relative(repo, path.join(core6g, report.path))} SHA256 ${report.sha256}; reuses original full source-FIRST and unchanged geometry/math/labels PASS from Avicenna. Rejected hypothesis and schematic dashes visibly separate from actual solid a/b parallel conclusion. All original nine objects/assertions and source inventory/authoritativeText unchanged. Historical failures, UNKNOWN and cumulative revision2 retained. Only render paths relocated. No render/native/source/mobile replay; this command records current hash-bound review with inherent contract validation. No full lesson or live-product approval.`]
const startedAt = new Date().toISOString()
const result = spawnSync(argv[0], argv.slice(1), { cwd: repo, encoding: 'utf8' })
const streams = {}
for (const stream of ['stdout', 'stderr']) {
  const file = path.join(own, `fig-206.${stream}`)
  fs.writeFileSync(file, result[stream] ?? '', { flag: 'wx' })
  streams[stream] = bind(file)
}
const receiptFile = path.join(own, 'fig-206.execution.json')
save(receiptFile, { cwd: repo, argv, startedAt, endedAt: new Date().toISOString(),
  exitCode: result.status, signal: result.signal, streams })
assert.equal(result.status, 0, result.stderr || result.stdout)
const record = {
  status: 'FIG206_REVISION2_PROMOTED_AFTER_AFFECTED_INDEPENDENT_OFFLINE_PASS',
  report, received: bind(receivedFile), receipt: bind(receiptFile), revision: 2,
  outputs: ['spec.json', 'svg', 'render.json', 'review.json'].map(extension =>
    ({ path: path.relative(core6g, `${prefix}.${extension}`), sha256: hash(`${prefix}.${extension}`) })),
  originalFailuresUNKNOWNAndCountsPreserved: true, sourceRenderNativeWidthReplays: 0,
  reviewRecordCommands: 1, parentImageLoads: 0, wholeLessonApproved: false,
}
const promotionFile = path.join(own, 'promotion.json')
save(promotionFile, record)
console.log(JSON.stringify(retainCurrent6g(
  'evidence/stemrobin188-6g-n32/approved206-assets16',
  [bind(retentionFile), bind(receivedFile), bind(receiptFile), ...Object.values(streams),
    bind(promotionFile), bind(path.join(tmp, 'promote-n32-approved206-assets-16.mjs'))],
  ['evidence/stemrobin188-6g-n32/206-revision2-independent-review16/retention.json'], record)))
