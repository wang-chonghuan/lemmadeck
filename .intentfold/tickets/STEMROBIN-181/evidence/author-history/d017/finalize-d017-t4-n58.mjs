import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const work = '.intentfold/tickets/STEMROBIN-181/tmp';
const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python';
const sourceRoot = 'ssot-resources/soviet10year-textbooks/artifacts/9p';
const read = async file => JSON.parse(await fs.readFile(file, 'utf8'));
const bind = async path => ({
  path, sha256: crypto.createHash('sha256').update(await fs.readFile(path)).digest('hex'),
});
const run = (binary, args) => {
  const output = execFileSync(binary, args, { encoding: 'utf8' });
  process.stdout.write(output);
  return { command: [binary, ...args], output };
};
const cards = ['phy9-c1-s7-t4', 'phy9-c2-s1'];
const gates = [];
for (const label of ['t4', 'n58']) {
  const sciencePath = `${work}/9p-${label}-science-review.json`;
  const figurePath = `${work}/9p-${label}-figure-review.json`;
  const science = await read(sciencePath);
  const figure = await read(figurePath);
  assert.equal(science.status, 'pass');
  assert.equal(figure.status, 'pass');
  assert.deepEqual(await bind(science.bindings.template.path), science.bindings.template);
  assert.deepEqual(await bind(science.bindings.exercisesTemplate.path), science.bindings.exercisesTemplate);
  gates.push({ science: await bind(sciencePath), figures: await bind(figurePath) });
}
const portraitPromotion = run(process.execPath, [
  `${work}/promote-d017-figure.mjs`, '9p', 'phy9-c2-s1', 'tbl-p0146-01',
  `${work}/9p-n58-figure-review.json`,
]);
const finalization = run(python, [
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'adapt-finalize',
  '--book', '9p', '--edition', 'modern-us-neutral',
  ...cards.flatMap(card => ['--lesson', card]),
]);
const outputs = [];
for (const card of cards) {
  const folder = `${sourceRoot}/editions/modern-us-neutral/lessons/${card}`;
  assert.equal((await read(`${folder}/adaptation.audit.json`)).status, 'pass');
  outputs.push({
    card, lesson: await bind(`${folder}/lesson.json`), exercises: await bind(`${folder}/exercises.json`),
    figures: await bind(`${folder}/figures.json`), audit: await bind(`${folder}/adaptation.audit.json`),
  });
}
const answerPreparation = run(python, [
  '.claude/skills/ld-s10y-answer/tools/lesson_answers.py', 'prepare',
  '--book', '9p', '--edition', 'modern-us-neutral', '--lesson', 'phy9-c1-s7-t4',
]);
await fs.writeFile(`${work}/d017-t4-n58-nativefinalization.json`, JSON.stringify({
  ticket: 'STEMROBIN-181', status: 'pass', cards, gates, portraitPromotion,
  finalization, outputs, answerPreparation,
  completeBatchClaim: false,
  limits: 'Consumed previously passed SCI and first independent figure gates. Native adaptation once and exercise8 answer prepare once. Answers/choices/offline batch surfaces still pending, no source/SCI repeat or production write.',
}, null, 2) + '\n', { flag: 'wx' });
