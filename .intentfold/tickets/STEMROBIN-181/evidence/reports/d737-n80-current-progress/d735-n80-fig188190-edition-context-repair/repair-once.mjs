import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp')
const out = path.join(tmp, 'd735-n80-fig188190-edition-context-repair')
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = (file) => ({ path: path.relative(repo, file), sha256: sha(file) })
const textReview = path.join(tmp, 'd715-n80-first-bilingual-text-review/affected-review.json')
assert.equal(read(textReview).status, 'PASS')
assert.equal(sha(textReview), 'f7f6bf3ce554083b4293ca6e66dbda26e31f02d11f836649401579f1d77f516e')
const contexts = ['zh', 'en'].map((locale) => {
  const file = path.join(tmp, 'd726-n80-english-normalization-continuation/candidates', locale, 'phy10-c2-s2-n80/lesson.template.json')
  const lesson = read(file)
  return { locale, file, lesson }
})
const authoritativeText = contexts.flatMap(({ locale, lesson }) =>
  lesson.prose.filter((item) => item.text?.trim()).map((item) => ({
    lesson: lesson.id, locale, text: item.text,
  })))
const report = {
  ticket: 'STEMROBIN-181', status: 'FIG188190-EDITION-CONTEXT-REPAIR-PENDING',
  textReview: bind(textReview), contexts: contexts.map(({ locale, file }) => ({ locale, ...bind(file) })),
  figures: [], imagesOpened: 0, geometryRepairBudgetsReset: false,
  reason: 'Replace original source prose in authoritativeText with the complete current approved bilingual modern edition prose. No objects, assertions, layout, canvas, source inventory or display changes.',
  canonicalWrites: false, independentMetadataReviewPending: true,
}
fs.writeFileSync(path.join(out, 'started.json'), JSON.stringify({ startedAt: new Date().toISOString() }), { flag: 'wx' })
for (const [id, sourceSpec, sourceSvg, sourceRender, independent] of [
  ['fig-188', 'd707-n80-fig188189-first-author/fig-188.first.spec.json', 'd707-n80-fig188189-first-author/fig-188.first.svg', 'd707-n80-fig188189-first-author/fig-188.first.render.json', 'd719-n80-fig188-first-review/report.json'],
  ['fig-190', 'd708-n80-fig190191192-first-author/fig-190/repair1/spec.json', 'd708-n80-fig190191192-first-author/fig-190/repair1/figure.svg', 'd708-n80-fig190191192-first-author/fig-190/repair1/render.json', 'd722-n80-fig190-first-review/report.json'],
]) {
  const originalSpec = path.join(tmp, sourceSpec)
  const originalSvg = path.join(tmp, sourceSvg)
  const originalRender = path.join(tmp, sourceRender)
  const prior = read(originalSpec)
  assert.equal(read(originalRender).status, 'pass')
  const current = structuredClone(prior)
  current.source.authoritativeText = authoritativeText
  const withoutText = (spec) => {
    const result = structuredClone(spec)
    delete result.source.authoritativeText
    return result
  }
  assert.deepEqual(withoutText(current), withoutText(prior))
  const folder = path.join(out, id)
  fs.mkdirSync(folder, { recursive: true })
  const spec = path.join(folder, 'spec.json')
  const svg = path.join(folder, 'figure.svg')
  const render = path.join(folder, 'render.json')
  fs.writeFileSync(spec, `${JSON.stringify(current, null, 2)}\n`, { flag: 'wx' })
  const command = [
    process.execPath, '.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
    '--spec', spec, '--svg', svg, '--report', render,
  ]
  const result = spawnSync(command[0], command.slice(1), { cwd: repo, encoding: 'utf8', timeout: 120000 })
  const receipt = path.join(folder, 'render.receipt.json')
  fs.writeFileSync(receipt, `${JSON.stringify({ command, exitCode: result.status, stdout: result.stdout, stderr: result.stderr }, null, 2)}\n`, { flag: 'wx' })
  const item = {
    id, original: { spec: bind(originalSpec), svg: bind(originalSvg), render: bind(originalRender), independentReview: bind(path.join(tmp, independent)) },
    spec: bind(spec), receipt: bind(receipt), nativeExitCode: result.status,
  }
  report.figures.push(item)
  assert.equal(result.status, 0, result.stdout + result.stderr)
  assert.equal(read(render).status, 'pass')
  item.svg = bind(svg)
  item.render = bind(render)
  item.svgByteIdentical = sha(svg) === sha(originalSvg)
  assert.equal(item.svgByteIdentical, true, 'Metadata-only repair must not change pixels; preserve this output and stop dependent approval if renderer bytes drift.')
}
report.status = 'FIG188190-METADATA-ONLY-REPAIRED-NATIVE-PASS-IDENTICAL-SVG-AFFECTED-REVIEW-PENDING'
fs.writeFileSync(path.join(out, 'report.json'), `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify({ status: report.status, figures: report.figures.map(({ id, spec, svgByteIdentical }) => ({ id, spec, svgByteIdentical })), imagesOpened: 0 }))
