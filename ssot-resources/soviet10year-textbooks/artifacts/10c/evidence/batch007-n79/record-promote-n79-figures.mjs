import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const root = '.tmp/s10y-image/batch007/10c'
const lessonDir = 'ssot-resources/soviet10year-textbooks/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c6-s2-n79'
const sha = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file))
const lesson = read(`${lessonDir}/lesson.json`)
assert.equal(sha(`${lessonDir}/lesson.json`), 'f524ad010824e99b00118d124b150e0d8e9aa1eeff5999ee27fd74c63c6682cf')
assert.equal(sha(`${lessonDir}/exercises.json`), 'fe891a960cfb9d8af0e4756bfe7e9ee486b377a1bb6f344bda00e8c9406077f6')
const ids = lesson.figures.map(figure => figure.id)
assert.equal(ids.length, 6)
const packages = []
for (const id of ids) {
  const dir = `${root}/${id}`
  const spec = read(`${dir}/spec.json`)
  const render = read(`${dir}/${id}.render.json`)
  const evidence = read(`${dir}/${id}.author-display-evidence.json`)
  assert.equal(render.status, 'pass')
  assert.equal(evidence.mechanicalStatus, 'pass')
  assert.equal(spec.source.image.sha256, sha(spec.source.image.path))
  assert.equal(render.spec.sha256, sha(`${dir}/spec.json`))
  assert.equal(render.output.svg.sha256, sha(`${dir}/${id}.svg`))
  for (const binding of Object.values(evidence.bindings)) {
    assert.equal(binding.sha256, sha(binding.path))
  }
  for (const capture of evidence.captures) {
    assert.equal(capture.output.sha256, sha(capture.output.path))
    assert(capture.metrics.measuredMinPx >= 16)
    if (capture.scrollEndOutput) assert.equal(capture.scrollEndOutput.sha256, sha(capture.scrollEndOutput.path))
  }
  const mathematical = []
  if (/^fig-0[5-8]$/.test(id)) {
    const index = Number(id.slice(-1)) - 5
    const coefficients = [[180, 40, 190], [180, 420, -190], [410, -420, 190], [410, -40, -190]][index]
    const path = spec.objects.find(object => object.type === 'svgPath')
    const pairs = [...path.d.matchAll(/[ML]\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/g)]
      .map(match => [Number(match[1]), 560 - Number(match[2])])
    assert(pairs.length > 500)
    for (const [x, y] of pairs) {
      const t = (x - 230) / 260
      assert(t > 0 && t < 1)
      assert(Math.abs(y - (coefficients[0] + coefficients[1] * t + coefficients[2] * t * t)) < 0.00003)
      assert.equal(Math.sign(coefficients[1] + 2 * coefficients[2] * t), [1, 1, -1, -1][index])
      assert.equal(Math.sign(coefficients[2]), [1, -1, 1, -1][index])
      assert(y > 100)
    }
    mathematical.push({ pathSamples: pairs.length, firstDerivativeSign: [1, 1, -1, -1][index], secondDerivativeSign: [1, -1, 1, -1][index] })
  } else if (id === 'fig-09') {
    const path = spec.objects.find(object => object.id === 'f09-cosine')
    const pairs = [...path.d.matchAll(/[ML]\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/g)]
      .map(match => [Number(match[1]) - 0.8, 2.2 - Number(match[2])])
    assert.equal(pairs.length, 601)
    assert(Math.abs(pairs[0][0]) < 0.000001)
    assert(Math.abs(pairs.at(-1)[0] - Math.PI) < 0.000001)
    for (const [x, y] of pairs) assert(Math.abs(y - Math.cos(x)) < 0.000001)
    const tangent = spec.objects.find(object => object.id === 'f09-tangent')
    for (const [x, y] of [tangent.from, tangent.to]) assert(Math.abs(y - (Math.PI / 2 - x)) < 1e-12)
    mathematical.push({ cosineSamples: pairs.length, domain: [0, Math.PI], tangentSlope: -1, leftAboveRightBelow: 'g(x)=pi/2-x-cos(x), g prime=sin(x)-1 <=0, g(pi/2)=0' })
  } else {
    assert.equal(id, 'tbl-p0021-01')
    assert.deepEqual(spec.assertions.find(item => item.type === 'gridDimensions'), { id: 't21-grid-3x3', type: 'gridDimensions', grid: 't21-grid', columns: 3, rows: 3 })
    assert.equal(spec.objects.filter(item => item.type === 'text').length, 8)
    mathematical.push({ rows: 3, columns: 3, texts: 8, blankCell: 'r0c0' })
  }
  packages.push({ id, spec: sha(`${dir}/spec.json`), svg: sha(`${dir}/${id}.svg`), render: sha(`${dir}/${id}.render.json`), source: spec.source.image, displayEvidence: sha(`${dir}/${id}.author-display-evidence.json`), mathematical })
}
fs.writeFileSync(`${ticket}/ana10-n79-independent-figure-bindings.json`, JSON.stringify({
  status: 'pass', independentReview: sha(`${ticket}/ana10-n79-independent-figure-review.md`),
  packages,
}, null, 2) + '\n')
for (const id of ids) {
  const dir = `${root}/${id}`
  assert(!fs.existsSync(`${dir}/${id}.review.json`), 'Do not duplicate an existing review')
  console.log(execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', [
    '.agents/skills/ld-s10y-image/scripts/record_review.py',
    '--spec', `${dir}/spec.json`, '--render', `${dir}/${id}.render.json`,
    '--output', `${dir}/${id}.review.json`, '--status', 'pass',
    '--notes', `Sole parent independent source/spec/current native and 240-neutral/346-print visual review PASS; table also full640 and both scroll ends. See ${ticket}/ana10-n79-independent-figure-review.md and hash-bound bindings JSON. No author self-review; first failures and one-repair limit preserved.`,
  ], { encoding: 'utf8' }).trim())
  console.log(execFileSync('node', [`${ticket}/retain-approved-figures.mjs`, id], {
    encoding: 'utf8', env: { ...process.env, FIGURE_BOOK: '10c', FIGURE_SCRATCH_DIR: dir },
  }).trim())
}
console.log(execFileSync('node', [`${ticket}/bind-approved-figure-manifest.mjs`, 'ana10-c6-s2-n79'], {
  encoding: 'utf8', env: { ...process.env, FIGURE_BOOK: '10c' },
}).trim())
