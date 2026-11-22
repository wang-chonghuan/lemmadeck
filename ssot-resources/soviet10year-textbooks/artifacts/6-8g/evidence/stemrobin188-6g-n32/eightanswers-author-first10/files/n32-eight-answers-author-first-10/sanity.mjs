import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
assert.equal(process.cwd(), repo)
const own = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/n32-eight-answers-author-first-10')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const candidate = read(path.join(own, 'answer-candidates.json'))
const source = read(path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/n32-draft-first-10/artifacts/6-8g/lessons/geo68-c3-s1-n32/exercises.json'))
assert.equal(candidate.lesson, source.lesson)
assert.deepEqual(candidate.answers.map(item => item.exercise), ['432', '433', '434', '435', '436', '437', '439', '440'])
assert.equal(source.count, 9)
assert.equal(candidate.status, 'draft')
assert.equal(fs.existsSync(path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/6-8g/answers.json')), false)
const require = createRequire(path.join(repo, '.claude/skills/ld-s10y-lesson/package.json'))
const katex = require('katex')
let formulas = 0
for (const item of candidate.answers) {
  assert.equal(item.source, 'derived')
  assert.equal(item.grading, 'ungraded')
  assert.deepEqual(item.parts, [])
  assert.ok(item.displayAnswer.trim())
  assert.equal('bookRaw' in item, false)
  const task = source.exercises.find(task => task.number === item.exercise)
  assert.ok(task)
  assert.deepEqual(task.figure_refs, [])
  const math = [...item.displayAnswer.matchAll(/\$([^$]+)\$/g)]
  assert.equal(math.length * 2, (item.displayAnswer.match(/\$/g) ?? []).length)
  for (const [, formula] of math) {
    katex.renderToString(formula, { throwOnError: true, strict: 'error' })
    formulas++
  }
}
const parallelOffsetsInvariant = (offsets, center) => {
  const distinct = [...new Set(offsets)].sort((a, b) => a - b)
  const reflected = distinct.map(value => 2 * center - value).sort((a, b) => a - b)
  return JSON.stringify(distinct) === JSON.stringify(reflected)
}
assert.equal(parallelOffsetsInvariant([-2, 2], 0), true)
assert.equal(parallelOffsetsInvariant([-2, 2], 1), false)
assert.equal(parallelOffsetsInvariant([-2, 0, 2], 0), true)
assert.equal(parallelOffsetsInvariant([-2, 0, 3], 0), false)
assert.equal(parallelOffsetsInvariant([1, 1], 1), true)
assert.equal(parallelOffsetsInvariant([1, 1, 3], 2), true)
const reflection = ([x, y], [cx, cy]) => [2 * cx - x, 2 * cy - y]
assert.deepEqual(reflection([4, 2], [3, 0]), [2, -2])
assert.deepEqual(reflection([3, 4], [3, 0]), [3, -4])
for (const u of [0, 1, 3]) {
  const theta = Math.PI / 6
  const rayParameter = u / Math.cos(theta)
  assert.ok(rayParameter >= 0)
  assert.ok(Math.abs(rayParameter * Math.sin(theta) - u * Math.tan(theta)) < 1e-12)
}
assert.equal(30 + 150 + 30 + 150, 360)
console.log(JSON.stringify({
  status: 'PASS_AUTHOR_SANITY_ONLY', completeDraftKeys: 8, omittedExercise: '438',
  formulasChecked: formulas, deterministicCasesChecked: 12, imageLoads: 0,
  independentReview: false, nativeFinalization: false, wholeLessonCoverage: false,
}))
