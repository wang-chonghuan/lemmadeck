import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, core, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'

assert.equal(process.cwd(), repo)
const reviewPath = path.resolve(process.argv[2])
assert.equal(hash(reviewPath), process.argv[3])
const independent = read(reviewPath)
assert((independent.verdict || independent.status).startsWith('PASS'))
const own = path.join(tmp, 'appendix-s4-display-width-repair-02')
const id = 'fig-g10-171'
const figures = path.join(core, 'editions/modern-us-neutral/figures')
const candidateSpec = path.join(own, 'spec.json')
const candidateRender = path.join(own, `${id}.render.json`)
assert.equal(hash(candidateSpec), '2e37c248c9aa1d057354e97b8b3bada5e9d4b6fc7fe78636e70ad4a756aa0879')
assert.equal(hash(path.join(own, `${id}.svg`)), hash(path.join(figures, `${id}.svg`)))
for (const suffix of ['spec.json', 'render.json', 'review.json']) {
  assert.equal(hash(path.join(figures, `${id}.${suffix}`)), hash(path.join(own, `before.${suffix}`)))
}
assert(!fs.existsSync(path.join(own, 'promotion.json')))
fs.copyFileSync(candidateSpec, path.join(figures, `${id}.spec.json`))
const render = read(candidateRender)
render.spec.path = path.relative(repo, path.join(figures, `${id}.spec.json`))
render.output.svg.path = path.relative(repo, path.join(figures, `${id}.svg`))
const restoredRender = structuredClone(render)
restoredRender.spec.path = read(candidateRender).spec.path
restoredRender.output.svg.path = read(candidateRender).output.svg.path
assert.deepEqual(restoredRender, read(candidateRender))
assert.equal(render.spec.sha256, hash(path.join(figures, `${id}.spec.json`)))
assert(!JSON.stringify(render).includes('.intentfold/'))
fs.writeFileSync(path.join(figures, `${id}.render.json`), JSON.stringify(render, null, 2) + '\n')
const command = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const args = [
  '.agents/skills/ld-s10y-image/scripts/record_review.py',
  '--spec', path.join(figures, `${id}.spec.json`),
  '--render', path.join(figures, `${id}.render.json`),
  '--output', path.join(figures, `${id}.review.json`),
  '--status', 'pass', '--notes',
  `Unchanged source and geometry reuse independent figure PASS 7b0a6aec2b6a9cd2937d9debb7b9f960106894fb3f3259074b3eef4933665157. Affected actual 358px display contract and desktop/mobile lesson display PASS: ${reviewPath} SHA256 ${process.argv[3]}. Only display.widths extended; SVG and current lesson HTML unchanged. Prior reviews, failures and repair counts preserved.`,
]
const result = spawnSync(command, args, { cwd: repo, encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' } })
const stdout = path.join(own, 'record-review.stdout')
const stderr = path.join(own, 'record-review.stderr')
fs.writeFileSync(stdout, result.stdout || '', { flag: 'wx' })
fs.writeFileSync(stderr, result.stderr || '', { flag: 'wx' })
const receipt = path.join(own, 'record-review.command.json')
save(receipt, {
  command, args, cwd: repo, exitCode: result.status,
  streams: { stdout: bind(stdout), stderr: bind(stderr) }, error: result.error?.message || null,
})
assert.equal(result.status, 0, 'Preserve current metadata-record failure, stop downstream')
const mirror = path.join(tmp, 'appendix-s4-source-repair-02/artifacts/9-10g/editions/modern-us-neutral/figures')
for (const suffix of ['spec.json', 'render.json', 'review.json']) {
  assert.equal(hash(path.join(mirror, `${id}.${suffix}`)), hash(path.join(own, `before.${suffix}`)))
  fs.copyFileSync(path.join(figures, `${id}.${suffix}`), path.join(mirror, `${id}.${suffix}`))
}
save(path.join(own, 'promotion.json'), {
  status: 'AFFECTED_ACTUAL_WIDTH_METADATA_PROMOTED_ONLY',
  independentDisplayReview: bind(reviewPath), oldReview: bind(path.join(own, 'before.review.json')),
  actualWidths: [300, 358, 480], record: bind(receipt),
  currentAssets: ['spec.json', 'svg', 'render.json', 'review.json'].map(suffix => bind(path.join(figures, `${id}.${suffix}`))),
  svgUnchanged: true, lessonAndFigureManifestUnchanged: true,
  sourceOrScienceReplays: 0, lessonFinalizerReplays: 0, lessonHtmlRendererReplays: 0,
  originalFigureRendererCalls: 2, affectedWidthRendererCalls: 1,
  originalLayoutRepairs: 1, displayContractAmendments: 1,
  parentImages: 0, parentPermanentImages: 24, published: false,
})
for (const file of [stdout, stderr, receipt, path.join(own, 'promotion.json')]) fs.chmodSync(file, 0o444)
console.log(JSON.stringify({ promotion: bind(path.join(own, 'promotion.json')) }))
