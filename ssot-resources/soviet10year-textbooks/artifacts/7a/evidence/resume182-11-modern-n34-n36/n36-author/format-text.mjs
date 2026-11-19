import fs from 'node:fs'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const root = '/Users/yong/.codex/worktrees/d9b1/lemmadeck'
assert.equal(process.cwd(), root)
const scratch = '.tmp/ld-s10y-lesson/adapt/7a/modern-us-neutral/lessons/alg7-c4-s2-n36'
const durable = 'ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/lessons/alg7-c4-s2-n36'
const evidence = '.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n36-author'
const read = path => JSON.parse(fs.readFileSync(path, 'utf8'))
const lesson = read(`${scratch}/lesson.template.json`)
const exercises = read(`${scratch}/exercises.template.json`)
const baselineLesson = read(`${durable}/lesson.json`)
const baselineExercises = read(`${durable}/exercises.json`)
const labels = [...'абвгдежзи']
const latin = [...'abcdefghi']

function format(text) {
  return text.split(/(\$[^$]+\$)/g).map((part, index) =>
    index % 2 ? part : part
      .replace(/^([абвгдежзи])\)/gm, (_, label) => `${latin[labels.indexOf(label)]})`)
      .replace(/(?<!\d)\./g, '。')
  ).join('')
}

for (const block of lesson.prose) {
  block.text = format(block.text)
  if (block.text !== block.source_text && !block.changes.includes('layout')) {
    block.changes.push('layout')
  }
}
for (const exercise of exercises.exercises) {
  exercise.text = format(exercise.text).replace(/，\n(?=[a-i]\))/g, '；\n')
  exercise.lines = exercise.text.split('\n')
  if (!exercise.changes.includes('layout')) exercise.changes.push('layout')
}

// Use the existing deterministic layout rules without invoking finalization.
const normalized = spawnSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', [
  '-B', '-c',
  "import json,sys; sys.path.insert(0,'.claude/skills/ld-s10y-lesson/tools'); import edition; d=json.load(sys.stdin); edition.normalize_lesson_layout(d['lesson']); edition.normalize_exercise_layout(d['exercises']); print(json.dumps(d,ensure_ascii=False))",
], {
  cwd: root, input: JSON.stringify({lesson, exercises}), encoding: 'utf8',
  env: {...process.env, PYTHONDONTWRITEBYTECODE: '1'},
})
assert.equal(normalized.status, 0, normalized.stderr)
const result = JSON.parse(normalized.stdout)
for (const [candidate, baseline, name] of [
  [result.lesson, baselineLesson, 'lesson'],
  [result.exercises, baselineExercises, 'exercises'],
]) {
  assert.deepEqual(candidate.source, baseline.source, `${name}: changed source`)
  const candidateItems = candidate.prose ?? candidate.exercises
  const baselineItems = baseline.prose ?? baseline.exercises
  candidateItems.forEach((item, index) => {
    assert.equal(item.source_text, baselineItems[index].source_text)
    assert.deepEqual(item.numeric_changes, baselineItems[index].numeric_changes)
  })
}
fs.writeFileSync(`${scratch}/lesson.template.json`, `${JSON.stringify(result.lesson, null, 2)}\n`)
fs.writeFileSync(`${scratch}/exercises.template.json`, `${JSON.stringify(result.exercises, null, 2)}\n`)
fs.writeFileSync(`${evidence}/initial-copy-and-format-receipt.json`, `${JSON.stringify({
  cwd: root,
  status: 'modern_text_formatted_not_finalized',
  durable_initial_copy: 'both files created by cp and compared byte-for-byte before edits',
  initial_template_sha256: {
    lesson: '403f540a1371b4b427d290cf0bccba662b7460473bb9c65ba6a65fee94047958',
    exercises: '8e12b6a9bb03a39bbc91eb43906843d1966eeed8a1c979ee5a66569dab0ce878',
  },
  source_objects_and_source_text: 'deep comparison passed against initial durable copies',
  source765b: 'a>0 retained; true sufficient condition; no erratum',
  images: 0,
}, null, 2)}\n`)
console.log('Modern-only formatting complete; source/source_text/numeric_changes unchanged.')
