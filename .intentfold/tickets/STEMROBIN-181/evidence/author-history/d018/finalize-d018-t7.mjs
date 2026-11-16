import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { ticket, read, bind, verify, immutableWrite } from './retain-d016-evidence.mjs';

const work = `${ticket}/tmp`;
const card = 'phy9-c2-s2-t7';
const gatePath = process.argv[2];
assert.ok(gatePath?.startsWith(`${work}/`), 'Supply the affected-only SCI correction report.');
const gate = await read(gatePath);
assert.equal(gate.status, 'pass');
const templateRoot = `.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/${card}`;
for (const file of ['lesson.template.json', 'exercises.template.json', 'figures.template.json']) {
  const binding = await bind(`${templateRoot}/${file}`);
  const search = JSON.stringify(gate);
  assert.ok(search.includes(binding.sha256), `Current ${file} must be bound in SCI evidence.`);
  await verify(binding.path, binding.sha256);
}
const original = await read(`ssot-resources/soviet10year-textbooks/artifacts/9p/lessons/${card}/exercises.json`);
assert.equal(original.count, 11);
const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python';
const run = args => {
  const output = execFileSync(python, args, { encoding: 'utf8' });
  process.stdout.write(output);
  return { command: [python, ...args], output };
};
const finalization = run([
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'adapt-finalize',
  '--book', '9p', '--edition', 'modern-us-neutral', '--lesson', card,
]);
const destination = `ssot-resources/soviet10year-textbooks/artifacts/9p/editions/modern-us-neutral/lessons/${card}`;
assert.equal((await read(`${destination}/adaptation.audit.json`)).status, 'pass');
assert.equal((await read(`${destination}/exercises.json`)).count, 11);
const outputs = await Promise.all([
  'lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json',
].map(file => bind(`${destination}/${file}`)));
const answerPreparation = run([
  '.claude/skills/ld-s10y-answer/tools/lesson_answers.py', 'prepare',
  '--book', '9p', '--edition', 'modern-us-neutral', '--lesson', card,
]);
await immutableWrite(`${work}/d018-t7-native-finalization.json`, `${JSON.stringify({
  ticket: 'STEMROBIN-181', lesson: card, status: 'pass',
  science: await bind(`${work}/9p-t7-science-review.json`),
  scienceCorrection: await bind(gatePath), finalization, outputs, answerPreparation,
  sourceTasks: 11, previousPassedGatesRepeated: false,
  productionWrite: false, batchComplete: false,
}, null, 2)}\n`);
