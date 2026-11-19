import fs from 'node:fs'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import { createRequire } from 'node:module'
import { spawnSync } from 'node:child_process'

const root = '/Users/yong/.codex/worktrees/d9b1/lemmadeck'
assert.equal(process.cwd(), root)
const scratch = '.tmp/ld-s10y-lesson/adapt/7a/modern-us-neutral/lessons/alg7-c4-s2-n36'
const durable = 'ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/lessons/alg7-c4-s2-n36'
const out = '.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n36-author'
const read = path => JSON.parse(fs.readFileSync(path, 'utf8'))
const lesson = read(`${scratch}/lesson.template.json`)
const exercises = read(`${scratch}/exercises.template.json`)
const initialLesson = read(`${durable}/lesson.json`)
const initialExercises = read(`${durable}/exercises.json`)
const require = createRequire(import.meta.url)
const {proseOutline, sectionBreakIndices} = require(`${root}/.claude/skills/ld-s10y-lesson/tools/htmlfrag.js`)
assert.equal(lesson.title, '恒等式')
assert.equal(exercises.exercises.length, 16)
assert.deepEqual(exercises.exercises.map(item => item.number), Array.from({length: 16}, (_, i) => `${761+i}`))
for (const [modern, initial] of [[lesson, initialLesson], [exercises, initialExercises]]) {
  assert.deepEqual(modern.source, initial.source)
  const items = modern.prose ?? modern.exercises
  const original = initial.prose ?? initial.exercises
  for (let i = 0; i < items.length; i++) {
    assert.equal(items[i].source_text, original[i].source_text)
    assert.deepEqual(items[i].numeric_changes, original[i].numeric_changes)
    assert(!/[\u0400-\u04ff]/u.test(items[i].text))
    assert.equal(items[i].figures?.length ?? 0, 0)
    assert.equal(items[i].figure_refs?.length ?? 0, 0)
    if (items[i].lines) assert.deepEqual(items[i].lines, items[i].text.split('\n'))
    const labels = [...items[i].text.matchAll(/^([a-z])\)/gm)].map(match => match[1])
    assert.deepEqual(labels, [...'abcdefghijklmnopqrstuvwxyz'].slice(0, labels.length))
    assert(items[i].changes.includes('layout'))
  }
}
assert.equal(lesson.figures.length, 0)
assert(exercises.exercises.find(item => item.number === '765').text.includes('b) $\\sqrt{a^2}$，设 $a>0$；'))
const indices = sectionBreakIndices(lesson.prose, lesson.section_breaks)
const outline = proseOutline(lesson.prose)
assert.equal(indices.length, 5)
const mathCheck = spawnSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', [
  '-B', '-c',
  "import json,sys; sys.path.insert(0,'.claude/skills/ld-s10y-lesson/tools'); import edition; d=json.load(sys.stdin); pairs=[(d['lesson']['prose'], d['lesson']['source']['data']['prose']),(d['exercises']['exercises'],d['exercises']['source']['data']['exercises'])]; [(_ for _ in ()).throw(AssertionError('mathematics changed')) for aa,bb in pairs for a,b in zip(aa,bb) if edition.math_signature(a['text']) != edition.math_signature(b['text'])]; print('all formula signatures unchanged')",
], {
  cwd: root, input: JSON.stringify({lesson, exercises}), encoding: 'utf8',
  env: {...process.env, PYTHONDONTWRITEBYTECODE: '1'},
})
assert.equal(mathCheck.status, 0, mathCheck.stderr)
const files = {}
for (const name of ['lesson', 'exercises']) {
  const source = `${scratch}/${name}.template.json`
  const target = `${durable}/${name}.json`
  fs.copyFileSync(source, target)
  assert(fs.readFileSync(source).equals(fs.readFileSync(target)))
  for (const path of [source, target]) {
    files[path] = crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex')
  }
}
const receipt = {
  status: 'TEXT_READY_FROZEN_PARENT_MAY_FIRST_ADAPT_FINALIZE',
  cwd: root,
  files,
  source_hashes: {lesson: lesson.source.sha256, exercises: exercises.source.sha256},
  source_objects_source_text_and_formula_signatures: 'unchanged',
  modern_labels: 'a,b,c,... natural sequence; text and lines synchronized; layout flagged',
  images: 0,
  boundaries: indices.map(index => ({index, before: outline[index-1].text, after: outline[index].text})),
  choices: 'waiting for parent first adapt-finalize notification',
  independent_solutions: 'in progress; not yet frozen',
  approval: 'candidate only; no self approval',
}
fs.writeFileSync(`${out}/text-ready-receipt.json`, `${JSON.stringify(receipt, null, 2)}\n`, {flag: 'wx'})
console.log(JSON.stringify(receipt, null, 2))
