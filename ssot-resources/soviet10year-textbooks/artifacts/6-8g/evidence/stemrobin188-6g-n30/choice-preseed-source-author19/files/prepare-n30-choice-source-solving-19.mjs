import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const W = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
const T = path.join(W, '.intentfold/tickets/STEMROBIN-188/tmp');
const base = path.join(T, 'n30-errata-bound-working-18/work/adapt/6-8g/modern-us-neutral/lessons/geo68-c2-s4-n30');
const lessonPath = path.join(base, 'lesson.template.json');
const exercisePath = path.join(base, 'exercises.template.json');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const lesson = JSON.parse(fs.readFileSync(lessonPath, 'utf8'));
const exercises = JSON.parse(fs.readFileSync(exercisePath, 'utf8'));
const root = path.join(T, 'n30-choice-source-solving-inputs-19');
fs.mkdirSync(root);
const output = {
  status: 'PRESEED_BLIND_SOURCE_SOLVING_ONLY',
  book: '6-8g',
  lesson: 'geo68-c2-s4-n30',
  bindings: [
    { path: lessonPath, sha256: hash(lessonPath) },
    { path: exercisePath, sha256: hash(exercisePath) },
  ],
  sourceNumbers: exercises.exercises.map(ex => String(ex.number)),
  exercises: exercises.exercises.map(ex => ({
    number: String(ex.number),
    text: ex.text,
    figure_refs: ex.figure_refs,
  })),
  selectedDefinition: { templateIndex: 16, text: lesson.prose[16].text },
  noAnswerKeysOrOptions: true,
  noExerciseFigures: exercises.exercises.every(ex => ex.figure_refs.length === 0),
  notOfficialSeed: true,
};
if (!output.noExerciseFigures) throw new Error('Unexpected exercise figure');
const file = path.join(root, 'source-only.json');
fs.writeFileSync(file, JSON.stringify(output, null, 2) + '\n');
fs.chmodSync(file, 0o444);
console.log(JSON.stringify({ path: file, sha256: hash(file), status: output.status }));
