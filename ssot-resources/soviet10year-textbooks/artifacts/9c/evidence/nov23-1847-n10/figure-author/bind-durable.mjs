import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import { spawnSync } from 'node:child_process'

const root = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184'
assert.equal(process.cwd(), root)
const durable = 'ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov23-1847-n10/figure-author'
const figure = 'tbl-p0044-01'
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const rawSpecFile = `${durable}/${figure}.raw-bound.spec.json`
const draftSpecFile = `${durable}/${figure}.spec.json`
const reportFile = `${durable}/${figure}.render.json`
const checkFile = `${durable}/candidate-check.json`
const sourceFile = 'ssot-resources/soviet10year-textbooks/artifacts/9c/figures/tbl-p0044-01.png'
const expectedSha = '7f437a89e35a22a92aca0952032470aa914d6ad494b91a00dec285cfac787dfb'
const raw = read(rawSpecFile)
const draft = read(draftSpecFile)
const report = read(reportFile)
const candidate = read(checkFile)
assert.equal(hash(sourceFile), expectedSha)
assert.equal(raw.source.image.sha256, expectedSha)
assert.equal(draft.source.image.path, sourceFile)
assert.deepEqual(
  { ...raw, source: { ...raw.source, image: draft.source.image } },
  draft,
  'Only the original-image path may differ between the rendered candidate and durable draft',
)
const lessonPath = '.tmp/stemrobin-184-six/n10-nov23-source4345/adapt/9c/modern-us-neutral/lessons/ana9-c2-s3-n10/lesson.template.json'
const lesson = read(lessonPath)
const latestProse = lesson.prose.filter((item) => item.kind === 'p' && item.text?.trim())
  .map((item) => ({ lesson: 'ana9-c2-s3-n10', text: item.text }))
assert.deepEqual(draft.source.authoritativeText, latestProse)
assert.equal(report.spec.sha256, hash(rawSpecFile))
assert.equal(report.output.svg.sha256, hash(`${durable}/${figure}.svg`))
assert.equal(candidate.specSha256, hash(rawSpecFile))
fs.copyFileSync(reportFile, `${durable}/${figure}.raw-bound.render.json`, fs.constants.COPYFILE_EXCL)
fs.copyFileSync(checkFile, `${durable}/candidate-check.raw-bound.json`, fs.constants.COPYFILE_EXCL)
const command = ['python3', '.agents/skills/ld-s10y-image/scripts/validate_spec.py', draftSpecFile, '--stage', 'draft', '--json']
const execution = spawnSync(command[0], command.slice(1), { cwd: root, encoding: 'utf8' })
assert.equal(execution.status, 0, execution.stdout + execution.stderr)
const bindingReceipt = `${durable}/durable-binding.json`
const receipt = {
  schema: 'n10-figure-author/path-binding@1',
  status: 'mechanical-binding-complete-no-independent-review',
  source: { image: draft.source.image },
  originalRender: {
    path: `${durable}/${figure}.raw-bound.render.json`,
    sha256: hash(`${durable}/${figure}.raw-bound.render.json`),
    specPath: rawSpecFile, specSha256: hash(rawSpecFile),
  },
  boundDraft: { path: draftSpecFile, sha256: hash(draftSpecFile) },
  exactSpecDifference: {
    field: 'source.image.path',
    before: raw.source.image.path, after: draft.source.image.path,
  },
  unchanged: ['source pixels', 'source SHA-256', 'complete current authoritative prose', 'source inventory', 'canvas', 'display', 'objects', 'assertions', 'SVG bytes', 'visual screenshots'],
  authoritativeEdition: {
    pathAtReading: lessonPath,
    sha256: hash(lessonPath),
    selection: 'Top-level prose only; complete current prose already matched the rendered candidate.',
    p0044_4: lesson.prose.find((item) => item.kind === 'p' && item.source_refs?.includes('p0044#4')).text,
  },
  output: { path: `${durable}/${figure}.svg`, sha256: hash(`${durable}/${figure}.svg`) },
  execution: { argv: command, cwd: root, exitCode: execution.status, stdout: execution.stdout, stderr: execution.stderr },
  imageOpensAdded: 0,
  rerendered: false,
  note: 'User authorized byte-identical promoted-source path binding. Render status records the actual existing JSXGraph result, not a fresh render or an independent PASS review.',
}
fs.writeFileSync(bindingReceipt, `${JSON.stringify(receipt, null, 2)}\n`, { flag: 'wx' })
report.spec = { path: draftSpecFile, sha256: hash(draftSpecFile) }
report.source = { image: draft.source.image }
report.binding = {
  method: 'mechanical-path-rebinding-no-rerender',
  receipt: { path: bindingReceipt, sha256: hash(bindingReceipt) },
}
fs.writeFileSync(reportFile, `${JSON.stringify(report, null, 2)}\n`)
candidate.sourcePath = draft.source.image.path
candidate.specPath = draftSpecFile
candidate.specSha256 = hash(draftSpecFile)
candidate.renderPath = reportFile
candidate.renderSha256 = hash(reportFile)
candidate.binding = report.binding
fs.writeFileSync(checkFile, `${JSON.stringify(candidate, null, 2)}\n`)
console.log('Durable source hash, complete current top-level prose, path-only spec difference, unchanged SVG, and rebound spec validation verified; no redraw or image reopen.')
