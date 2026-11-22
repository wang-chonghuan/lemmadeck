import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, core, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'

assert.equal(process.cwd(), repo)
const own = path.join(tmp, 'appendix-s4-display-width-repair-02')
assert(!fs.existsSync(own))
fs.mkdirSync(own)
const id = 'fig-g10-171'
const figures = path.join(core, 'editions/modern-us-neutral/figures')
const currentSpec = path.join(figures, `${id}.spec.json`)
const spec = read(currentSpec)
const original = structuredClone(spec)
assert.deepEqual(spec.display.widths, [300, 480])
const displayPath = path.join(tmp, 'offline-display-9-10g_geo910-appendix-s4-surfaces/result.json')
const display = read(displayPath)
const mobile = display.results.find(result => result.viewport.width === 390)
const measured = mobile.layout.figures.find(figure => figure.id === id).width
assert.equal(measured, 358)
spec.display.widths = [...new Set([...spec.display.widths, measured])].sort((a, b) => a - b)
const restored = structuredClone(spec)
restored.display.widths = original.display.widths
assert.deepEqual(restored, original)
for (const suffix of ['spec.json', 'svg', 'render.json', 'review.json']) {
  fs.copyFileSync(path.join(figures, `${id}.${suffix}`), path.join(own, `before.${suffix}`), fs.constants.COPYFILE_EXCL)
}
const candidateSpec = path.join(own, 'spec.json')
const candidateSvg = path.join(own, `${id}.svg`)
const candidateRender = path.join(own, `${id}.render.json`)
save(candidateSpec, spec)
const args = [
  '.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
  '--spec', candidateSpec, '--svg', candidateSvg, '--report', candidateRender,
]
const result = spawnSync('node', args, { cwd: repo, encoding: 'utf8' })
const stdout = path.join(own, 'render.stdout')
const stderr = path.join(own, 'render.stderr')
fs.writeFileSync(stdout, result.stdout || '', { flag: 'wx' })
fs.writeFileSync(stderr, result.stderr || '', { flag: 'wx' })
save(path.join(own, 'render.command.json'), {
  command: 'node', args, cwd: repo, exitCode: result.status,
  streams: { stdout: bind(stdout), stderr: bind(stderr) }, error: result.error?.message || null,
})
assert.equal(result.status, 0, 'Preserve affected width-render failure')
assert.equal(read(candidateRender).status, 'pass')
assert.equal(hash(candidateSvg), hash(path.join(figures, `${id}.svg`)))
save(path.join(own, 'repair.json'), {
  status: 'ACTUAL_OFFLINE_MOBILE_WIDTH_DECLARED_DISPLAY_REVIEW_PENDING',
  changedFieldOnly: 'display.widths', oldWidths: original.display.widths, widths: spec.display.widths,
  measuredMobileWidth: measured, measuredMobileTextPx: mobile.layout.minFigureTextPx,
  observedDisplay: bind(displayPath),
  candidate: { spec: bind(candidateSpec), svg: bind(candidateSvg), render: bind(candidateRender) },
  oldFigureReview: bind(path.join(figures, `${id}.review.json`)),
  svgByteIdentical: true, geometryAndAuthoritativeTextUnchanged: true,
  oldLessonHtmlAndScreenshotsStillCurrent: true,
  affectedRendererCalls: 1, originalAuthorRendererCalls: 2,
  originalLabelRepairs: 1, displayContractAmendments: 1,
  parentImageLoads: 0, parentPermanentImageCount: 24, published: false,
})
for (const file of fs.readdirSync(own)) fs.chmodSync(path.join(own, file), 0o444)
console.log(JSON.stringify({ repair: bind(path.join(own, 'repair.json')), candidateSpec: bind(candidateSpec) }))
