import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { core6g, retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const reviewRoot = path.join(tmp, 'fig187-six-span-independent-review-06')
const reportFile = path.join(reviewRoot, 'Report.json')
const manifestFile = path.join(reviewRoot, 'evidence-manifest.json')
assert.equal(hash(reportFile), '52ce68771cd90f8999a3a8d885085f77304af8a31932ac22e5360342e1fcc352')
assert.equal(hash(manifestFile), '0dfc5d4669ace90c163a91128fd3c6c1a5b992c5e3bd11065cba41789edd4be5')
const report = read(reportFile)
assert.equal(report.status, 'SCOPED_OFFLINE_REVIEW_COMPLETE_APPROVE_NOT_PROMOTED')
assert.equal(report.verdicts.fig187_source_fidelity, 'APPROVE')
assert.equal(report.verdicts.all_six_h_r_intervals, 'APPROVE')
assert.equal(report.sessions.own_exec_sessions_remaining, 0)
assert.equal(report.sessions.own_browser_sessions_remaining, 0)
assert.equal(report.counters.actual_current_context_image_loads, 2)
const references = new Map()
function add(item) {
  assert.equal(hash(item.path), item.sha256, item.path)
  references.set(item.path, { path: item.path, sha256: item.sha256 })
}
function gather(value) {
  if (!value || typeof value !== 'object') return
  if (value.path && value.sha256) add(value)
  else for (const child of Object.values(value)) gather(child)
}
add(bind(reportFile))
add(bind(manifestFile))
for (const item of read(manifestFile).own_files) add(item)
gather(report.FIRST)
gather(report.candidate)
gather(report.independent_actual_geometry_audit)
add(report.official_review)
add(report.official_record_receipt)
assert.equal(fs.statSync(report.FIRST.inventory.path).mode & 0o777, 0o444)
const receipt = read(report.official_record_receipt.path)
assert.equal(receipt.cwd, repo)
assert.equal(receipt.exitCode ?? receipt.exit_code, 0)
gather(receipt.streams)
const official = read(report.official_review.path)
assert.equal(official.status, 'pass')
assert.equal(official.spec.sha256, report.candidate.spec.sha256)
assert.equal(official.outputs.svg.sha256, report.candidate.svg.sha256)
const own = path.join(tmp, 'fig187-independent-promotion-06')
fs.mkdirSync(own)
const collectionFile = path.join(own, 'collection.json')
save(collectionFile, {
  status: 'FIG187_INDEPENDENT_SOURCE_SPEC_OUTPUT_APPROVED',
  report: bind(reportFile), FIRST: report.FIRST, candidate: report.candidate,
  officialReview: report.official_review, recording: report.official_record_receipt,
  verdicts: report.verdicts, counters: report.counters, imageLedger: report.image_ledger,
  retainedHistory: report.retained_history, scopeLimits: report.scope_limits,
  parentImageLoads: 0, producerReplays: 0, wholeLessonApproved: false, published: false,
})
add(bind(collectionFile))
add(bind(path.join(tmp, 'collect-and-promote-fig187-pass-06.mjs')))
const retained = retainCurrent6g(
  'evidence/stemrobin188-6g-n29/fig187-independent-review06',
  [...references.values()],
  ['evidence/stemrobin188-6g-n29/fig187-six-span-author06/retention.json'],
  {
    status: 'FIG187_INDEPENDENT_SOURCE_SPEC_OUTPUT_APPROVED',
    chargedImages: 2, sourceViews: 1, retainedContactViews: 1, reopens: 0,
    priorAuthorCharges: 24, aggregateAcrossSeparateContexts: 26,
    officialReviewRecordings: 1, rendererReplays: 0, sourceHoldsPreserved: true,
  },
)
const mappings = read(retained.retention.path).mappings
function durable(item) {
  const mapping = mappings.find(mapping => mapping.path && mapping.sha256 === item.sha256)
  assert.ok(mapping, item.path)
  const file = path.join(core6g, mapping.path)
  assert.equal(hash(file), item.sha256)
  return file
}
const target = path.join(core6g, 'editions/modern-us-neutral/figures/fig-187')
const relative = path.relative(repo, target)
for (const extension of ['spec.json', 'svg', 'render.json', 'review.json'])
  assert.ok(!fs.existsSync(`${target}.${extension}`))
const originalSpec = read(durable(report.candidate.spec))
const spec = structuredClone(originalSpec)
spec.source.image.path = path.relative(repo, durable(report.candidate.source))
const restored = structuredClone(spec)
restored.source.image.path = originalSpec.source.image.path
assert.deepEqual(restored, originalSpec)
save(`${target}.spec.json`, spec)
fs.copyFileSync(durable(report.candidate.svg), `${target}.svg`, fs.constants.COPYFILE_EXCL)
assert.equal(hash(`${target}.svg`), report.candidate.svg.sha256)
const render = read(durable(report.candidate.render))
assert.equal(render.status, 'pass')
render.spec = { path: `${relative}.spec.json`, sha256: hash(`${target}.spec.json`) }
render.output.svg.path = `${relative}.svg`
save(`${target}.render.json`, render)
assert.ok(!JSON.stringify({ spec, render }).includes('.intentfold/'))
const argv = [
  '-B', '.agents/skills/ld-s10y-image/scripts/record_review.py',
  '--spec', `${relative}.spec.json`, '--render', `${relative}.render.json`,
  '--output', `${relative}.review.json`, '--status', 'pass',
  '--notes', `Reuse FIG187 independent source/math/visual/cultural PASS at ${path.relative(repo, durable(bind(reportFile)))} SHA256 ${hash(reportFile)}, original review SHA256 ${report.official_review.sha256}. Only source.image path relocated to exact durable retained original PNG and spec/render/output paths rebound. Geometry, six bracket intervals, labels, inequalities, inventory, authoritative prose and physical display unchanged. Native/640-media/300-and358-scroll-end evidence reused without replay. Original three native failures, four repairs, one visual failure and all author/reviewer counters retained. Other source glyph/printing holds not cleared. No whole-lesson acceptance or DB publication.`,
]
const startedAt = new Date().toISOString()
const result = spawnSync('python3', argv, { cwd: repo, encoding: 'utf8' })
const promotionReferences = new Map()
const streams = {}
for (const name of ['stdout', 'stderr']) {
  const file = path.join(own, `relocation.${name}`)
  fs.writeFileSync(file, result[name] ?? '', { flag: 'wx' })
  streams[name] = bind(file)
  promotionReferences.set(file, streams[name])
}
const relocationFile = path.join(own, 'relocation.execution.json')
save(relocationFile, {
  cwd: repo, argv: ['python3', ...argv], startedAt, finishedAt: new Date().toISOString(),
  exitCode: result.status, signal: result.signal, error: result.error?.message ?? null,
  streams, relocationOnly: true, rendererReplays: 0, parentImageLoads: 0,
})
promotionReferences.set(relocationFile, bind(relocationFile))
assert.equal(result.status, 0, result.stderr || result.stdout)
const template = read(path.join(tmp, 'fig186188189-promotion-06/n29.figures.approved-subset.template.json'))
const entry = template.figures.find(entry => entry.id === 'fig-187')
assert.ok(entry)
for (const key of ['png', 'artwork', 'generation']) delete entry[key]
for (const [key, extension] of [
  ['spec', 'spec.json'], ['svg', 'svg'], ['render', 'render.json'], ['review', 'review.json'],
]) entry[key] = `figures/fig-187.${extension}`
const templateFile = path.join(own, 'n29.figures.all-three-approved.template.json')
save(templateFile, template)
promotionReferences.set(templateFile, bind(templateFile))
const promotionFile = path.join(own, 'promotion.json')
save(promotionFile, {
  status: 'FIG187_APPROVED_PROMOTED_RELOCATION_ONLY',
  report: bind(durable(bind(reportFile))), reviewRetention: retained,
  relocation: bind(relocationFile), template: bind(templateFile),
  outputs: ['spec.json', 'svg', 'render.json', 'review.json'].map(extension => ({
    path: path.relative(core6g, `${target}.${extension}`), sha256: hash(`${target}.${extension}`),
  })),
  geometryInventoryProseSvgDisplayUnchanged: true,
  parentImageLoads: 0, rendererReplays: 0, sourceReopens: 0,
  originalFailuresAndPrintingGlyphHoldsPreserved: true,
  wholeLessonApproved: false, published: false,
})
promotionReferences.set(promotionFile, bind(promotionFile))
const promotionRetention = retainCurrent6g(
  'evidence/stemrobin188-6g-n29/fig187-promotion06',
  [...promotionReferences.values()], [],
  { status: 'FIG187_PROMOTED_RELOCATION_ONLY', nativeRelocationRecordings: 1,
    rendererReplays: 0, parentImageLoads: 0 },
)
console.log(JSON.stringify({ collection: bind(collectionFile), retained,
  promotion: bind(promotionFile), promotionRetention }))
