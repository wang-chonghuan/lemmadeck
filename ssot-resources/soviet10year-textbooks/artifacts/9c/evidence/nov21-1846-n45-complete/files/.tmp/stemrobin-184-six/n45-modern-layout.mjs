import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), repo);
const directory = path.join(repo,
  '.tmp/ld-s10y-lesson/adapt/9c/modern-us-neutral/lessons/ana9-c4-s2-n45');
const lessonFile = path.join(directory, 'lesson.template.json');
const lesson = JSON.parse(fs.readFileSync(lessonFile, 'utf8'));
if (process.argv[2] === 'boundaries') {
  const outline = JSON.parse(fs.readFileSync(path.join(repo,
    '.tmp/stemrobin-184-six/stages/n45-first-prose-flow-nov21.stdout'), 'utf8'));
  assert.deepEqual(lesson.section_breaks, []);
  lesson.section_breaks = ['**定理**', '**推论**'].map(prefix => {
    const matches = outline.paragraphs.filter(item => item.text.startsWith(prefix));
    assert.equal(matches.length, 1);
    const after = matches[0];
    assert(after.index > 0);
    return { before: outline.paragraphs[after.index - 1].text, after: after.text };
  });
  fs.writeFileSync(lessonFile, JSON.stringify(lesson, null, 2) + '\n');
  console.log(JSON.stringify({ section_breaks: lesson.section_breaks }));
} else {
  assert.equal(process.argv.length, 2);
  const edits = [
    [0, '引理．\n', '**引理** '],
    [1, '证明', '**证明**'],
    [9, '重要注释 ', '**重要注释** '],
    [10, '定理。\n', '**定理** '],
    [12, '证明 ', '**证明** '],
    [14, '推论。\n', '**推论** '],
  ];
  for (const [index, before, after] of edits) {
    const block = lesson.prose[index];
    assert(block.text.startsWith(before));
    block.text = after + block.text.slice(before.length);
    block.changes = [...new Set([...block.changes, 'layout'])];
  }
  lesson.prose[11].historical_entities = [{
    term: '莱布尼兹',
    reason: '原书用真实数学家的名字命名积的求导公式，保留这一数学史身份。',
  }];
  const exerciseFile = path.join(directory, 'exercises.template.json');
  const exercises = JSON.parse(fs.readFileSync(exerciseFile, 'utf8'));
  let enumerationEdits = 0;
  for (const exercise of exercises.exercises) {
    const original = exercise.text;
    exercise.text = original.replace(/а\)/g, 'a)').replace(/б\)/g, 'b)');
    exercise.lines = exercise.text.split('\n');
    if (original !== exercise.text) {
      enumerationEdits += 1;
      exercise.changes = [...new Set([...exercise.changes, 'enumeration'])];
    }
  }
  fs.writeFileSync(lessonFile, JSON.stringify(lesson, null, 2) + '\n');
  fs.writeFileSync(exerciseFile, JSON.stringify(exercises, null, 2) + '\n');
  console.log(JSON.stringify({ proseLabelEdits: edits.length,
    enumerationExercises: enumerationEdits, mathematicalEdits: 0 }));
}
