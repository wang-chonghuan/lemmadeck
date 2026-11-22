import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { core6g, retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const reviewFile = path.join(tmp, 'n32-205-first-208-binding-finite-grading-review-14/manifest.json')
assert.equal(hash(reviewFile), 'ecfded2e7fac8b7f44df93407e73d86c4c39391c07740b90e0a847768c2e6e62')
const review = read(reviewFile)
assert.equal(review.A.status, 'PASS')
assert.equal(review.B.status, 'PASS_AFFECTED_BINDING_ONLY')
const retentionFile = path.join(core6g, 'evidence/stemrobin188-6g-n32/205208-finite-independent-review14/retention.json')
const retained = read(retentionFile)
const durableReport = retained.mappings.find(item => item.sha256 === review.report.sha256)
assert.ok(durableReport?.path && !path.isAbsolute(durableReport.path))
const inputs208 = read(path.join(tmp, 'n32-208-text-binding-revision2-13/affected-review-inputs.json'))
const own = path.join(tmp, 'n32-approved205208-assets-14')
const evidence = path.join(core6g, 'evidence/stemrobin188-6g-n32/approved205208-assets14')
assert.ok(!fs.existsSync(own) && !fs.existsSync(evidence))
fs.mkdirSync(own)
fs.mkdirSync(evidence)
const assets = path.join(core6g, 'editions/modern-us-neutral/figures')
const history = path.join(evidence, 'previous208')
fs.mkdirSync(history)
const previous208 = []
for (const extension of ['spec.json', 'render.json', 'review.json']) {
  const original = path.join(assets, `fig-208.${extension}`)
  const snapshot = path.join(history, `fig-208.${extension}`)
  fs.copyFileSync(original, snapshot, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(snapshot), hash(original))
  fs.chmodSync(snapshot, 0o444)
  previous208.push({ original: path.relative(core6g, original),
    preserved: path.relative(core6g, snapshot), sha256: hash(snapshot) })
}
assert.equal(hash(path.join(history, 'fig-208.spec.json')), inputs208.oldSpec.sha256)
assert.equal(hash(path.join(history, 'fig-208.review.json')), inputs208.originalReview.sha256)
const jobs = [
  { id: 'fig-205', revision: 2, current: review.A.currentOutputBindings },
  { id: 'fig-208', revision: 2,
    current: { spec: inputs208.newSpec, svg: inputs208.newSVG, render: inputs208.currentRender } },
]
const results = []
const references = [bind(reviewFile), bind(retentionFile)]
for (const figure of jobs) {
  const prefix = path.join(assets, figure.id)
  const relative = path.relative(repo, prefix)
  if (figure.id === 'fig-205')
    for (const extension of ['spec.json', 'svg', 'render.json', 'review.json'])
      assert.ok(!fs.existsSync(`${prefix}.${extension}`))
  for (const [kind, extension] of [['spec', 'spec.json'], ['svg', 'svg']]) {
    assert.equal(hash(figure.current[kind].path), figure.current[kind].sha256)
    if (figure.id === 'fig-208' && kind === 'svg')
      assert.equal(hash(`${prefix}.${extension}`), figure.current[kind].sha256)
    else fs.copyFileSync(figure.current[kind].path, `${prefix}.${extension}`,
      figure.id === 'fig-205' ? fs.constants.COPYFILE_EXCL : 0)
    assert.equal(hash(`${prefix}.${extension}`), figure.current[kind].sha256)
  }
  assert.equal(hash(figure.current.render.path), figure.current.render.sha256)
  const metadata = read(figure.current.render.path)
  assert.equal(metadata.status, 'pass')
  assert.equal(metadata.spec.sha256, hash(`${prefix}.spec.json`))
  assert.equal(metadata.output.svg.sha256, hash(`${prefix}.svg`))
  metadata.spec.path = `${relative}.spec.json`
  metadata.output.svg.path = `${relative}.svg`
  assert.ok(!JSON.stringify(metadata).includes('.intentfold/'))
  fs.writeFileSync(`${prefix}.render.json`, JSON.stringify(metadata, null, 2) + '\n',
    { flag: figure.id === 'fig-205' ? 'wx' : 'w' })
  const argv = ['python3', '-B', '.agents/skills/ld-s10y-image/scripts/record_review.py',
    '--spec', `${relative}.spec.json`, '--render', `${relative}.render.json`,
    '--output', `${relative}.review.json`, '--status', 'pass',
    '--notes', `Independent ${figure.id === 'fig-205' ? 'first full source/math/culture/current native and actual300/358 offline-media PASS' : 'affected authoritativeText/context/template/spec/render binding PASS with original source/math/culture/native/mobile PASS reused'} recorded in ${path.relative(repo, path.join(core6g, durableReport.path))} SHA256 ${review.report.sha256}. Current revision2; original FIRSTs, failures and UNKNOWN preserved. Only render paths relocated; no source reopening, renderer, width, editor or full-lesson replay. ${figure.id === 'fig-208' ? `Previous review/spec/render retained under ${path.relative(repo, history)}; SVG byte-identical.` : 'Both prior collision failures preserved.'} This command records hash-bound review with inherent contract validation, not a new content/visual review. No full lesson or live-product approval.`]
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
  references.push(bind(receiptFile), ...Object.values(streams))
  results.push({ id: figure.id, revision: figure.revision,
    receipt: bind(receiptFile), outputs: ['spec.json', 'svg', 'render.json', 'review.json']
      .map(extension => ({ path: path.relative(core6g, `${prefix}.${extension}`),
        sha256: hash(`${prefix}.${extension}`) })) })
}
const template = read(path.join(tmp, 'n32-approved207208-assets-12/figures.with-approved207208.template.json'))
for (const figure of jobs) {
  const entry = template.figures.find(item => item.id === figure.id)
  assert.ok(entry)
  for (const field of ['png', 'artwork', 'generation']) delete entry[field]
  for (const [field, extension] of [['spec', 'spec.json'], ['svg', 'svg'],
    ['render', 'render.json'], ['review', 'review.json']])
    entry[field] = `figures/${figure.id}.${extension}`
}
const proposed = path.join(own, 'figures.with-approved205207208.template.json')
save(proposed, template)
const promotionFile = path.join(evidence, 'promotion.json')
const promotion = {
  status: 'N32_FIG205_REVISION2_PROMOTED_FIG208_BINDING_REVISION2_UPDATED',
  report: { path: durableReport.path, sha256: review.report.sha256 },
  results, previous208, previous208SvgUnchanged: true,
  oldRecordsHistoricalSupersededCanonical208BindingsPreservedBySnapshots: true,
  proposedTemplate: bind(proposed), proposedTemplateApplied: false,
  remaining204206NotApprovedByThisPromotion: true,
  rendererReplays: 0, widthReplays: 0, sourceReopens: 0,
  reviewRecordCommands: 2, inherentContractValidationOnly: true,
  parentImageLoads: 0, wholeLessonApproved: false, published: false,
}
save(promotionFile, promotion)
references.push(bind(proposed), bind(promotionFile),
  bind(path.join(tmp, 'promote-n32-approved205208-assets-14.mjs')))
console.log(JSON.stringify({ promotion: bind(promotionFile),
  retention: retainCurrent6g('evidence/stemrobin188-6g-n32/205208-review-recording14',
    references, ['evidence/stemrobin188-6g-n32/205208-finite-independent-review14/retention.json'],
    { ...promotion, proposedTemplateApplied: false }) }))
