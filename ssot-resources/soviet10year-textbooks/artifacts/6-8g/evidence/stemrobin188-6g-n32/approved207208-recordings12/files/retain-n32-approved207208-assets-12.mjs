import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { core6g } from './retain-current-6g-evidence-03.mjs'

const reviewFile = path.join(tmp, 'n32-nineanswers-text-207208-independent-review-11/manifest.json')
assert.equal(hash(reviewFile), '2b4b6ebd485133eea4f402a68cd7eb39dd5ac64aab2ea2ba23f98be0889528b7')
const review = read(reviewFile)
const retentionFile = path.join(core6g,
  'evidence/stemrobin188-6g-n32/independent-nineanswers-text-207208-review12/retention.json')
const retained = read(retentionFile)
const durableReport = retained.mappings.find(item => item.sha256 === review.finalReport.sha256)
assert.ok(durableReport?.path)
const own = path.join(tmp, 'n32-approved207208-assets-12')
const evidence = path.join(core6g, 'evidence/stemrobin188-6g-n32/approved207208-assets12')
assert.ok(!fs.existsSync(own) && !fs.existsSync(evidence))
fs.mkdirSync(own)
const assets = path.join(core6g, 'editions/modern-us-neutral/figures')
fs.mkdirSync(assets, { recursive: true })
const results = []
for (const figure of review.figures) {
  assert.ok(['fig-207', 'fig-208'].includes(figure.id))
  for (const field of ['mathematical', 'sourceFidelity', 'cultural', 'actualNativeAnd300PxMobileVisual'])
    assert.equal(figure[field], 'SCOPED_PASS')
  const relative = path.relative(repo, path.join(assets, figure.id))
  const target = path.join(repo, relative)
  for (const extension of ['spec.json', 'svg', 'render.json', 'review.json'])
    assert.ok(!fs.existsSync(`${target}.${extension}`))
  for (const [kind, extension] of [['spec', 'spec.json'], ['svg', 'svg']]) {
    assert.equal(hash(figure.current[kind].path), figure.current[kind].sha256)
    fs.copyFileSync(figure.current[kind].path, `${target}.${extension}`, fs.constants.COPYFILE_EXCL)
    assert.equal(hash(`${target}.${extension}`), figure.current[kind].sha256)
  }
  const metadata = read(figure.current.render.path)
  assert.equal(metadata.status, 'pass')
  metadata.spec.path = `${relative}.spec.json`
  metadata.output.svg.path = `${relative}.svg`
  assert.ok(!JSON.stringify(metadata).includes('.intentfold/'))
  save(`${target}.render.json`, metadata)
  const argv = ['python3', '-B', '.agents/skills/ld-s10y-image/scripts/record_review.py',
    '--spec', `${relative}.spec.json`, '--render', `${relative}.render.json`,
    '--output', `${relative}.review.json`, '--status', 'pass',
    '--notes', `Reuse exact independent source/math/cultural/native300-mobile PASS from ${path.relative(repo, core6g)}/${durableReport.path} SHA256 ${review.finalReport.sha256}. Source/spec/SVG/display/current authoritativeText bytes unchanged; only render paths relocated. This command records review metadata with its inherent contract validation, not a new visual review or renderer/width replay. Existing revision ${figure.revision} and all image/path failures remain historical. Figure208 current draft has source-script exercise438 markers; later modern text normalization must update affected context bindings without treating this recording as text-readiness clearance. No whole-N32, full-nine answers, offline page display or product approval.`]
  const startedAt = new Date().toISOString()
  const result = spawnSync(argv[0], argv.slice(1), { cwd: repo, encoding: 'utf8' })
  const streams = {}
  for (const name of ['stdout', 'stderr']) {
    const file = path.join(own, `${figure.id}.${name}`)
    fs.writeFileSync(file, result[name] ?? '', { flag: 'wx' })
    streams[name] = bind(file)
  }
  const receiptFile = path.join(own, `${figure.id}.execution.json`)
  save(receiptFile, { cwd: repo, argv, startedAt, endedAt: new Date().toISOString(),
    exitCode: result.status, signal: result.signal, streams })
  assert.equal(result.status, 0, result.stderr || result.stdout)
  results.push({ id: figure.id, revision: figure.revision, receipt: bind(receiptFile),
    outputs: ['spec.json', 'svg', 'render.json', 'review.json'].map(extension => ({
      path: path.relative(core6g, `${target}.${extension}`), sha256: hash(`${target}.${extension}`),
    })) })
}
const template = read(path.join(tmp, 'n32-text-candidate-10/figures.template.json'))
for (const { id } of results) {
  const entry = template.figures.find(item => item.id === id)
  assert.ok(entry)
  for (const field of ['png', 'artwork', 'generation']) delete entry[field]
  for (const [field, extension] of [['spec', 'spec.json'], ['svg', 'svg'],
    ['render', 'render.json'], ['review', 'review.json']])
    entry[field] = `figures/${id}.${extension}`
}
const proposed = path.join(own, 'figures.with-approved207208.template.json')
save(proposed, template)
fs.mkdirSync(evidence)
save(path.join(evidence, 'promotion.json'), {
  status: 'N32_FIG207208_SCOPED_PASS_ASSETS_RETAINED',
  report: { path: durableReport.path, sha256: review.finalReport.sha256 }, results,
  sourceSpecSvgDisplayAndTextContextChanged: false, renderPathsOnlyRelocated: true,
  proposedTemplate: bind(proposed), sharedDraftTemplateUnchanged: true,
  proposedTemplateApplied: false, sourceReopens: 0, rendererReplays: 0, widthReplays: 0,
  reviewRecordCommands: 2, inherentRecordContractValidation: true,
  figure208ModernTextNormalizationPending: true,
  parentImageLoads: 0, wholeLessonApproved: false, published: false,
})
console.log(JSON.stringify({ promotion: bind(path.join(evidence, 'promotion.json')),
  outputs: results.length * 4, proposedTemplate: bind(proposed) }))
