import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), repo);
const directory = path.join(repo,
  '.tmp/ld-s10y-lesson/adapt/9c/modern-us-neutral/lessons/ana9-c4-s2-n46');
const lessonFile = path.join(directory, 'lesson.template.json');
const lesson = JSON.parse(fs.readFileSync(lessonFile, 'utf8'));
if (process.argv[2] === 'boundaries') {
  const outline = fs.readFileSync(path.join(repo,
    '.tmp/stemrobin-184-six/stages/n46-first-prose-flow-nov21.stdout'), 'utf8');
  assert.deepEqual(lesson.section_breaks, []);
  const boundaries = outline.split('\n').map(line => line.trim())
    .filter(line => line.startsWith('break: '))
    .map(line => JSON.parse(line.slice('break: '.length)));
  const matches = boundaries.filter(boundary =>
    boundary.after.startsWith('由这个定理和前面得到的微分法则得出'));
  assert.equal(matches.length, 1);
  lesson.section_breaks = matches;
  fs.writeFileSync(lessonFile, JSON.stringify(lesson, null, 2) + '\n');
  console.log(JSON.stringify({ section_breaks: lesson.section_breaks }));
} else {
  assert.equal(process.argv.length, 2);
  for (const [index, before, after] of [
    [0, '定理．', '**定理** '],
    [1, '证明 ', '**证明** '],
  ]) {
    const block = lesson.prose[index];
    assert(block.text.startsWith(before));
    block.text = after + block.text.slice(before.length);
    block.changes = [...new Set([...block.changes, 'layout'])];
  }
  const exerciseFile = path.join(directory, 'exercises.template.json');
  const exercises = JSON.parse(fs.readFileSync(exerciseFile, 'utf8'));
  assert.deepEqual(exercises.exercises.map(exercise => exercise.number), ['375', '376', '377']);
  let enumerationEdits = 0;
  for (const exercise of exercises.exercises) {
    const original = exercise.text;
    exercise.text = original.replace(/а\)/g, 'a)').replace(/б\)/g, 'b)').replace(/в\)/g, 'c)');
    exercise.lines = exercise.text.split('\n');
    if (exercise.text !== original) {
      enumerationEdits++;
      exercise.changes = [...new Set([...exercise.changes, 'enumeration'])];
    }
  }
  fs.writeFileSync(lessonFile, JSON.stringify(lesson, null, 2) + '\n');
  fs.writeFileSync(exerciseFile, JSON.stringify(exercises, null, 2) + '\n');
  console.log(JSON.stringify({ proseLabelEdits: 2,
    enumerationExercises: enumerationEdits, mathematicalEdits: 0 }));
}
