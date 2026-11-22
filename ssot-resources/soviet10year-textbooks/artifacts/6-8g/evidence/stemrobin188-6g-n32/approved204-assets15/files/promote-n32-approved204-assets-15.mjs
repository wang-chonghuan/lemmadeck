import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { core6g, retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const manifestFile = path.join(tmp, 'n32-204206-first-and-source169171-affected-review-14/manifest.json')
assert.equal(hash(manifestFile), '2c901cefe40562fbf91a8a8e56a54131089b65ce6fd333f6669137712176fa8b')
const review = read(manifestFile)
assert.equal(review.scopeA.fig204.status, 'PASS_SCOPED_OFFLINE_SOURCE_MATH_CULTURE_VISUAL_REVIEW')
const retentionFile = path.join(core6g,
  'evidence/stemrobin188-6g-n32/204206-source169171-independent-review15/retention.json')
const retention = read(retentionFile)
const report = retention.mappings.find(item =>
  item.sha256 === '870d70a4a82e9fd43c9775842552431044325a0fa4c5a00c6b28337d050c176e')
assert.ok(report?.path && !path.isAbsolute(report.path))
const own = path.join(tmp, 'n32-approved204-assets-15')
assert.ok(!fs.existsSync(own))
fs.mkdirSync(own)
const assets = path.join(core6g, 'editions/modern-us-neutral/figures')
const prefix = path.join(assets, 'fig-204')
const relative = path.relative(repo, prefix)
for (const extension of ['spec.json', 'svg', 'render.json', 'review.json'])
  assert.ok(!fs.existsSync(`${prefix}.${extension}`))
const source = name => {
  const binding = review.namedInputBindings.find(item => item.name === name)
  assert.ok(binding)
  assert.equal(hash(binding.path), binding.sha256)
  return binding
}
for (const [kind, extension] of [['spec', 'spec.json'], ['svg', 'svg']]) {
  const binding = source(`204-current-r1-${kind}`)
  fs.copyFileSync(binding.path, `${prefix}.${extension}`, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(`${prefix}.${extension}`), binding.sha256)
}
const metadata = read(source('204-current-r1-render').path)
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
  '--notes', `Independent complete original-FIRST/source/math/culture/native and actual300/358 offline-media PASS for fig204 revision1 in ${path.relative(repo, path.join(core6g, report.path))} SHA256 ${report.sha256}. Original solid endpoint/gap retained; separately inventoried dashed collinear continuation represents proved intersection, not rejected premise. Original FIRST/HOLD/UNKNOWN and revision1 preserved. Only render paths relocated. No render/native/source/mobile replay; this command records current hash-bound review with inherent contract validation. No full lesson or live-product approval.`]
const startedAt = new Date().toISOString()
const result = spawnSync(argv[0], argv.slice(1), { cwd: repo, encoding: 'utf8' })
const streams = {}
for (const stream of ['stdout', 'stderr']) {
  const file = path.join(own, `fig-204.${stream}`)
  fs.writeFileSync(file, result[stream] ?? '', { flag: 'wx' })
  streams[stream] = bind(file)
}
const receiptFile = path.join(own, 'fig-204.execution.json')
save(receiptFile, { cwd: repo, argv, startedAt, endedAt: new Date().toISOString(),
  exitCode: result.status, signal: result.signal, streams })
assert.equal(result.status, 0, result.stderr || result.stdout)
const template = read(path.join(tmp, 'n32-approved205208-assets-14/figures.with-approved205207208.template.json'))
const entry = template.figures.find(item => item.id === 'fig-204')
assert.ok(entry)
for (const field of ['png', 'artwork', 'generation']) delete entry[field]
for (const [field, extension] of [['spec', 'spec.json'], ['svg', 'svg'],
  ['render', 'render.json'], ['review', 'review.json']])
  entry[field] = `figures/fig-204.${extension}`
const templateFile = path.join(own, 'figures.with-approved204205207208.template.json')
save(templateFile, template)
const promotionFile = path.join(own, 'promotion.json')
const record = {
  status: 'FIG204_REVISION1_PROMOTED_AFTER_INDEPENDENT_FULL_OFFLINE_PASS',
  report, receipt: bind(receiptFile), revision: 1,
  outputs: ['spec.json', 'svg', 'render.json', 'review.json'].map(extension =>
    ({ path: path.relative(core6g, `${prefix}.${extension}`), sha256: hash(`${prefix}.${extension}`) })),
  proposedTemplate: bind(templateFile), proposedTemplateApplied: false,
  remaining206NotApproved: true, originalFailuresUNKNOWNAndCountsPreserved: true,
  sourceRenderNativeWidthReplays: 0, reviewRecordCommands: 1,
  parentImageLoads: 0, wholeLessonApproved: false,
}
save(promotionFile, record)
console.log(JSON.stringify(retainCurrent6g(
  'evidence/stemrobin188-6g-n32/approved204-assets15',
  [bind(manifestFile), bind(retentionFile), bind(receiptFile), ...Object.values(streams),
    bind(templateFile), bind(promotionFile), bind(path.join(tmp, 'promote-n32-approved204-assets-15.mjs'))],
  ['evidence/stemrobin188-6g-n32/204206-source169171-independent-review15/retention.json'],
  record)))
