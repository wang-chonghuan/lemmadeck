import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp')
const own = path.join(tmp, 'd704-source193-caption-affected-review')
const first = path.join(tmp, 'd699-source219220-first-review/report.json')
const repair = path.join(tmp, 'd702-source219220-affected-repair')
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = (file) => ({ path: file, sha256: sha(file) })
const prior = read(first)
const candidate = read(path.join(repair, 'report.json'))
const pageRoot = path.join(repair, 'root/10p/pages/0219')
const figures = path.join(repair, 'work/10p/pages/0219/figures')
const page = read(path.join(pageRoot, 'page.json'))
const oldPage = read(prior.evidence['p219_page.json'].path)
const audit = read(path.join(pageRoot, 'audit.json'))
const oldAudit = read(prior.evidence['p219_audit.json'].path)

for (const key of ['source219', 'p219_page.md', 'p219_page.json', 'p219_audit.json']) {
  assert.equal(sha(prior.evidence[key].path), prior.evidence[key].sha256, key)
}
for (const output of candidate.outputs.filter((item) => item.path.includes('/0219/'))) {
  assert.equal(sha(output.path), output.sha256, output.path)
}
assert.deepEqual(page.blocks, oldPage.blocks)
const strippedPage = structuredClone(page)
delete strippedPage.meta.figure_crops
assert.deepEqual(strippedPage, oldPage)
assert.deepEqual(page.meta.figure_crops['fig-193'].padding_px, 0)
assert.deepEqual(audit.figures[0].box, [231, 122, 1076, 544])
assert.deepEqual(audit.figures[0].box, oldAudit.figures[0].box)
const strippedAudit = structuredClone(audit)
delete strippedAudit.figures[0].crop_padding_px
assert.deepEqual(strippedAudit, oldAudit)
const oldMd = fs.readFileSync(prior.evidence['p219_page.md'].path, 'utf8')
const newMd = fs.readFileSync(path.join(pageRoot, 'page.md'), 'utf8')
const oldLines = oldMd.split('\n')
const newLines = newMd.split('\n')
const markdownDelta = []
for (let i = 0; i < Math.max(oldLines.length, newLines.length); i += 1) {
  if (oldLines[i] !== newLines[i]) markdownDelta.push({
    line: i + 1, before: oldLines[i] ?? null, after: newLines[i] ?? null,
  })
}
for (const extension of ['png', 'svg']) {
  assert.equal(sha(path.join(figures, `fig-194.${extension}`)),
    prior.evidence[`fig194_${extension}`].sha256)
}
const nativePath = path.join(repair, '219-vectorize193-continuation.receipt.json')
const native = read(nativePath)
const nativeResult = JSON.parse(native.stdout)
assert.equal(native.exitCode, 0)
assert.equal(nativeResult.ok, true)
const failurePath = path.join(repair, '219-vectorize193.receipt.json')
assert.equal(read(failurePath).exitCode, 2)
assert.equal(sha(failurePath), candidate.firstTechnicalFAIL.sha256)

const packageRoot = path.join(repo, '.claude/skills/ld-s10y-lesson/node_modules/@resvg/resvg-js')
const require = createRequire(import.meta.url)
const { Resvg } = require(packageRoot)
const svg = path.join(figures, 'fig-193.svg')
const png = path.join(figures, 'fig-193.png')
const output = path.join(own, 'previews/fig-193.svg.png')
fs.mkdirSync(path.dirname(output), { recursive: true })
const rendered = new Resvg(fs.readFileSync(svg), { background: 'white' }).render()
assert.equal(rendered.width, 1076)
assert.equal(rendered.height, 544)
fs.writeFileSync(output, rendered.asPng(), { flag: 'wx' })
console.log(JSON.stringify({
  cwd: process.cwd(),
  firstReview: bind(first),
  repairReport: bind(path.join(repair, 'report.json')),
  evidence: {
    source219: bind(prior.evidence.source219.path),
    candidateSource219: bind(path.join(repair, 'work/10p/pages/0219/page.png')),
    pageMd: bind(path.join(pageRoot, 'page.md')),
    pageJson: bind(path.join(pageRoot, 'page.json')),
    audit: bind(path.join(pageRoot, 'audit.json')),
    raw193: bind(png),
    svg193: bind(svg),
    svg193Preview: bind(output),
    raw194: bind(path.join(figures, 'fig-194.png')),
    svg194: bind(path.join(figures, 'fig-194.svg')),
    native193: bind(nativePath),
    unsupportedFigureTechnicalFailure: bind(failurePath),
    previewCode: bind(path.join(own, 'preview.mjs')),
    resvgPackage: bind(path.join(packageRoot, 'package.json')),
  },
  checks: {
    sourceBlocksStructurallyUnchanged: true,
    nonCropPageMetadataUnchanged: true,
    snappedBoxUnchanged: true,
    auditUnchangedExceptPadding: true,
    raw194Svg194HashesUnchanged: true,
    markdownDelta,
    sourceBlocksSha256: crypto.createHash('sha256')
      .update(JSON.stringify(page.blocks)).digest('hex'),
  },
  preview: {
    width: rendered.width,
    height: rendered.height,
    background: 'white',
    resizing: false,
    nodeVersion: process.version,
    resvgVersion: read(path.join(packageRoot, 'package.json')).version,
  },
  nativeReused: nativeResult,
  nativeReplay: false,
}, null, 2))
