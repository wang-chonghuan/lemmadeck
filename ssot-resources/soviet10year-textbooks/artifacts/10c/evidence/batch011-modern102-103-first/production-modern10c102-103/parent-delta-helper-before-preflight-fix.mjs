import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createHash } from 'node:crypto'

const work = '.intentfold/tickets/STEMROBIN-184/tmp/production-modern10c102-103'
const id = 'ana10-c7-s2-n103'
const output = `${work}/parent-103-repair-delta.json`
assert(!fs.existsSync(output), 'Preserve the first delta disposition')
const read = path => JSON.parse(fs.readFileSync(path))
const hash = path => createHash('sha256').update(fs.readFileSync(path)).digest('hex')
const oldPath = `${work}/first-finalize/before/${id}/lesson.template.json`
const newPath = `${work}/adapt/10c/modern-us-neutral/lessons/${id}/lesson.template.json`
const before = read(oldPath)
const after = read(newPath)
const expected = structuredClone(before)
const repairs = []
for (const [index, label] of [[0, 1], [1, 2], [4, 3], [5, 4]]) {
  const old = expected.prose[index].text
  const needle = `。 (${label})`
  assert.equal(old.split(needle).length, 2)
  expected.prose[index].text = old.replace(needle, ` (${label})。`)
  repairs.push({ index, label, before: old, after: expected.prose[index].text })
}
assert.equal(expected.section_breaks[0].after, before.prose[0].text)
expected.section_breaks[0].after = expected.prose[0].text
assert.deepEqual(after, expected)
for (const name of ['exercises', 'figures']) {
  assert.equal(hash(`${work}/first-finalize/before/${id}/${name}.template.json`),
    hash(`${work}/adapt/10c/modern-us-neutral/lessons/${id}/${name}.template.json`))
}
fs.writeFileSync(output, JSON.stringify({
  status: 'pass', beforeSha256: hash(oldPath), afterSha256: hash(newPath),
  repairs, sectionBreakChanged: 'only first after string matches repaired first prose',
  otherTemplateFieldsUnchanged: true, exercisesAndFiguresByteUnchanged: true,
  reason: 'Move each existing equation label inside the same sentence before prose normalization; mathematics and source snapshots unchanged.',
  firstFailureRetained: true, affected103Finalize: read(`${work}/first-finalize-103-affected/command.json`),
}, null, 2) + '\n')
console.log(output)
