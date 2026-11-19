import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const directory = '.tmp/ld-s10y-lesson/adapt/9c/modern-us-neutral/lessons/ana9-c3-s1-n12';
const snapshot = '.tmp/stemrobin-184-resume/n12-text-before';
assert(!fs.existsSync(snapshot), 'Protect first templates');
fs.mkdirSync(snapshot, { recursive: true });
for (const name of ['lesson.template.json', 'exercises.template.json', 'figures.template.json']) {
  fs.copyFileSync(path.join(directory, name), path.join(snapshot, name), fs.constants.COPYFILE_EXCL);
}
const lessonFile = path.join(directory, 'lesson.template.json');
const lesson = JSON.parse(fs.readFileSync(lessonFile));
assert.equal(lesson.prose.length, 15);
assert.equal(lesson.errata.length, 1);
const correction = lesson.errata[0];
assert.equal(correction.target, 'lesson.prose[10]');
assert.equal(correction.source.block, 'p0053#6');
assert.equal(correction.original, '$0\\leqslant a_k<9$');
correction.corrected = '$0\\leqslant a_k\\leqslant9$';
lesson.prose[0].text = '1. 数的概念是由于实践的需要逐步形成的。\n很早以前，人类就使用数来：\na) 计数；\nb) 测量量的大小。';
lesson.prose[0].changes = ['layout'];
lesson.prose[8].text += '\n横线只作用于整数部分，小数部分仍为非负数。';
lesson.prose[8].changes.push('clarification');
lesson.prose[10].text = lesson.prose[10].text.replace(correction.original, correction.corrected);
lesson.prose[10].changes.push('math-correction');
lesson.prose[12].text = '本节采用有限小数补无穷个零的标准展开，不使用最终全为九的另一种等值展开。\n以下比较法则均在这一约定下使用。\n' + lesson.prose[12].text;
lesson.prose[12].changes = ['clarification', 'layout'];
fs.writeFileSync(lessonFile, JSON.stringify(lesson, null, 2) + '\n');

const exercisesFile = path.join(directory, 'exercises.template.json');
const exercises = JSON.parse(fs.readFileSync(exercisesFile));
assert.deepEqual(exercises.exercises.map(row => row.number), ['113', '114']);
const letters = { а: 'a', б: 'b', в: 'c', г: 'd', д: 'e', е: 'f' };
for (const exercise of exercises.exercises) {
  exercise.text = exercise.text.replace(/([абвгде])\)/gu, (_, letter) => `${letters[letter]})`);
  exercise.changes = exercise.text === exercise.source_text ? [] : ['layout'];
}
fs.writeFileSync(exercisesFile, JSON.stringify(exercises, null, 2) + '\n');
console.log(JSON.stringify({ status: 'Modern candidate only, independent content review pending',
  prose: 15, exercises: 2, correction, images: 0 }));
