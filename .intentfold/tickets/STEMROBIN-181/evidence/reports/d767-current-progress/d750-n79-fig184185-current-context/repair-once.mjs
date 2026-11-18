import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp')
const out = path.join(tmp, 'd750-n79-fig184185-current-context')
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = (file) => ({ path: path.relative(repo, file), sha256: sha(file) })
const write = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}
const independent = path.join(tmp, 'd705-n79-fig184185-first-review/report.json')
assert.equal(read(independent).status, 'PASS')
assert.equal(sha(independent), '48f9c1ad367c1fe09087a65974c45a370c874e4c37edbe116c4a0e28cfb881c0')
const contexts = ['zh', 'en'].map((locale) => {
  const file = path.join(tmp, 'd700-n79-readability-repair/candidates', locale, 'phy10-c2-s2-n79/lesson.template.json')
  return { locale, file, lesson: read(file) }
})
const authoritativeText = contexts.flatMap(({ locale, lesson }) =>
  lesson.prose.filter((item) => item.text?.trim()).map((item) => ({ lesson: lesson.id, locale, text: item.text })))
const report = {
  ticket: 'STEMROBIN-181', status: 'CURRENT-CONTEXT-REPAIR-STARTED',
  reason: 'd705 visualPASS references current d700 text separately but the embedded FigureSpec still contains earlier d683 modern prose. Only authoritativeText changes.',
  contexts: contexts.map(({ locale, file }) => ({ locale, ...bind(file) })),
  originalIndependentReview: bind(independent),
  figures: [], geometryInventoryAssertionsDisplayChanged: false,
  imagesOpened: 0, priorImageAndRevisionCountsReset: false, canonicalWrites: false,
  affectedMetadataReviewPending: true,
}
write(path.join(out, 'started.json'), { startedAt: new Date().toISOString() })
for (const [id, stem] of [['fig-184', 'fig-184.repair-1'], ['fig-185', 'fig-185.first']]) {
  const base = path.join(tmp, 'd693-n79-fig184185-first-author', stem)
  const prior = read(`${base}.spec.json`)
  assert.equal(read(`${base}.render.json`).status, 'pass')
  const current = structuredClone(prior)
  current.source.authoritativeText = authoritativeText
  const omitText = (value) => {
    const copy = structuredClone(value)
    delete copy.source.authoritativeText
    return copy
  }
  assert.deepEqual(omitText(prior), omitText(current))
  const folder = path.join(out, id)
  const spec = path.join(folder, 'spec.json')
  const svg = path.join(folder, 'figure.svg')
  const render = path.join(folder, 'render.json')
  write(spec, current)
  const command = [process.execPath, '.agents/skills/ld-s10y-image/scripts/render_spec.mjs', '--spec', spec, '--svg', svg, '--report', render]
  const result = spawnSync(command[0], command.slice(1), { cwd: repo, encoding: 'utf8', timeout: 120000 })
  const receipt = path.join(folder, 'render.receipt.json')
  write(receipt, { command, exitCode: result.status, stdout: result.stdout, stderr: result.stderr })
  assert.equal(result.status, 0, result.stdout + result.stderr)
  assert.equal(read(render).status, 'pass')
  assert.equal(sha(svg), sha(`${base}.svg`), 'Metadata-only repair changed SVG; preserve and require affected visual review.')
  report.figures.push({
    id, spec: bind(spec), svg: bind(svg), render: bind(render), receipt: bind(receipt),
    original: { spec: bind(`${base}.spec.json`), svg: bind(`${base}.svg`), render: bind(`${base}.render.json`) },
    svgByteIdentical: true, newContentRevision: 'authoritativeText-metadata-only',
  })
}
report.status = 'FIG184185-CURRENT-TEXT-NATIVE-PASS-IDENTICAL-SVG-AFFECTED-METADATA-REVIEW-PENDING'
write(path.join(out, 'report.json'), report)
console.log(JSON.stringify({ status: report.status, report: bind(path.join(out, 'report.json')), imagesOpened: 0 }))
