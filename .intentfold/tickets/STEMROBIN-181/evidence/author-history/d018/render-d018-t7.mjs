import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { ticket, read, bind, exists, immutableWrite } from './retain-d018-evidence.mjs';

const work = `${ticket}/tmp`;
const trace = `${work}/d018-t7-offline-render.json`;
const card = 'phy9-c2-s2-t7';
assert.ok(!(await exists(trace)), 't7 native render is already recorded.');
for (const file of ['d018-t7-native-finalization.json', 'd018-t7-answer-native-finalization.json', '9p-t7-choice-validation.json']) {
  assert.equal((await read(`${work}/${file}`)).status, 'pass');
}
const command = [
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'render',
  '--book', '9p', '--edition', 'modern-us-neutral', '--lesson', card,
];
const output = execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', command, { encoding: 'utf8' });
process.stdout.write(output);
const retentionCommand = [
  `${work}/retain-choice-ex1.mjs`, '9p', card, '9p-t7-choice', '9p-t7-choice-review.json',
];
const retentionOutput = execFileSync('node', retentionCommand, { encoding: 'utf8' });
process.stdout.write(retentionOutput);
const folder = `.tmp/ld-s10y-lesson/render/9p/modern-us-neutral/${card}`;
await immutableWrite(trace, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D018', card, status: 'pass',
  nativeFinalization: await bind(`${work}/d018-t7-native-finalization.json`),
  answers: await bind(`${work}/d018-t7-answer-native-finalization.json`),
  choices: await bind(`${work}/9p-t7-choice-validation.json`),
  command, output, retentionCommand: ['node', ...retentionCommand], retentionOutput,
  surfaces: await Promise.all(['text', 'exercises', 'answers', 'choices'].map(surface => bind(`${folder}/${surface}.html`))),
  limits: 'Native render and approved set retention only. No repeated independent gate, acceptance browser check or production write.',
}, null, 2)}\n`);
