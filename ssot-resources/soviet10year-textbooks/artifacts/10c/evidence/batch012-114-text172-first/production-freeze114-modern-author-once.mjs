import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createHash } from 'node:crypto'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const work = `${ticket}/production-modern10c114`
const directory = `${work}/adapt/10c/modern-us-neutral/lessons/ana10-c8-s2-n114`
const output = `${work}/author`
const load = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = bytes => createHash('sha256').update(bytes).digest('hex')
assert(!fs.existsSync(output))
const previous = load(`${work}/prepared-snapshots/lesson.template.json`)
const current = load(`${directory}/lesson.template.json`)
const restored = structuredClone(current)
restored.section_breaks = previous.section_breaks
restored.errata[0].corrected = previous.errata[0].corrected
const changed = []
for (let i = 0; i < current.prose.length; i++) {
  if (JSON.stringify(current.prose[i]) === JSON.stringify(previous.prose[i])) continue
  changed.push(i)
  restored.prose[i] = previous.prose[i]
}
assert.deepEqual(changed, [18, 19, 20, 21, 27])
assert.deepEqual(restored, previous)
for (const index of [18, 19, 20, 21]) {
  const before = previous.prose[index]
  const after = current.prose[index]
  const expected = before.text.replaceAll('а)', 'a)').replaceAll('б)', 'b)')
    .replaceAll('в)', 'c)').replaceAll('г)', 'd)')
  assert.equal(after.text, expected)
  assert.deepEqual({ ...after, text: before.text }, before)
}
const before = previous.prose[27]
const after = current.prose[27]
const record = current.errata[0]
assert.equal(record.original, '$\\exp_a(x)=\\exp_a(x\\cdot\\ln a)$')
assert.equal(record.corrected, '$\\exp_a(x)=\\exp(x\\cdot\\ln a)$')
assert.equal(after.text, before.text.replace(record.original, record.corrected))
assert.deepEqual({ ...after, text: before.text, changes: before.changes }, before)
assert.deepEqual(after.changes, [...before.changes, 'math-correction'])
assert.equal(current.section_breaks.length, 2)
const flow = fs.readFileSync(`${work}/first-flow/stdout.txt`, 'utf8')
for (const boundary of current.section_breaks)
  assert(flow.includes(`break: ${JSON.stringify(boundary)}`), 'Exact prose-flow boundary must be used')
const paths = [
  `${directory}/lesson.template.json`, `${directory}/exercises.template.json`,
  `${directory}/figures.template.json`,
  `${ticket}/production-assembly10c114-heading-fixed/10c/lessons/ana10-c8-s2-n114/lesson.json`,
  `${ticket}/production-assembly10c114-heading-fixed/10c/lessons/ana10-c8-s2-n114/exercises.json`,
  `${ticket}/production-assembly10c114-heading-fixed/10c/pages/0171/page.json`,
  `${work}/first-prepare/command.json`, `${work}/first-prepare/stdout.txt`, `${work}/first-prepare/stderr.txt`,
  `${work}/first-flow/command.json`, `${work}/first-flow/stdout.txt`, `${work}/first-flow/stderr.txt`,
  `${ticket}/production-modern10c114-once.mjs`,
  `${ticket}/production-freeze114-modern-author-once.mjs`,
]
const inputs = paths.map(file => {
  const bytes = fs.readFileSync(file)
  return { path: file, bytes: bytes.length, sha256: hash(bytes) }
})
fs.mkdirSync(output)
for (const name of ['lesson', 'exercises', 'figures'])
  fs.copyFileSync(`${directory}/${name}.template.json`, `${output}/${name}.template.json`, fs.constants.COPYFILE_EXCL)
fs.writeFileSync(`${output}/manifest.json`, JSON.stringify({
  status: 'AUTHOR FROZEN; independent text review not yet performed',
  inputs, changedProseIndexes: changed, sectionBreaks: current.section_breaks,
  mathematicalChange: { id: record.id, target: record.target, original: record.original, corrected: record.corrected },
  zeroExercises: load(`${directory}/exercises.template.json`).exercises.length === 0,
  zeroFigures: load(`${directory}/figures.template.json`).figures.length === 0,
  immutableFieldsUnchanged: true, modelImages: 0,
  qualification: 'Automatic prepared layout retained except Latin enum mapping and exactly one independently justified, source-registered erratum. Body/source_refs/numeric/historical fields unchanged; source literal preserved. Two boundaries copied verbatim from actual prose-flow output. Author snapshot is not finalizer or independent text/visual PASS.',
}, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({ changed, modelImages: 0, inputs,
  manifestSha256: hash(fs.readFileSync(`${output}/manifest.json`)) }))
