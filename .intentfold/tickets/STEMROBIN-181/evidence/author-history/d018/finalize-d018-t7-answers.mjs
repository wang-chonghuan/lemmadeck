import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { ticket, book, exerciseCard, read, bytes, bind, exists, verify, immutableWrite } from './retain-d018-evidence.mjs';

const work = `${ticket}/tmp`;
const destination = `${book}/editions/modern-us-neutral/lessons/${exerciseCard}`;
const trace = `${work}/d018-t7-answer-native-finalization.json`;
assert.ok(!(await exists(trace)), 'Native answer finalization is already recorded.');
const gatePath = `${work}/9p-t7-answer-review.json`;
const gate = await read(gatePath);
assert.equal(gate.status, 'pass');
const draftPath = `${work}/9p-t7-answer-draft.json`;
const draftBinding = await bind(draftPath);
assert.ok(JSON.stringify(gate).includes(draftBinding.sha256), 'Use the reviewed answer snapshot.');
const draft = await read(draftPath);
assert.equal(draft.answers.length, 11);
assert.ok(draft.answers.every(answer => answer.grading === 'ungraded' && answer.parts.length === 0));
assert.ok(!(await exists(`${destination}/answer-keys.json`)), 'Do not replace an existing answer key.');
await immutableWrite(`${destination}/answer-keys.json`, await bytes(draftPath));
const command = [
  '.claude/skills/ld-s10y-answer/tools/lesson_answers.py', 'finalize',
  '--book', '9p', '--edition', 'modern-us-neutral', '--lesson', exerciseCard,
];
const output = execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', command, { encoding: 'utf8' });
process.stdout.write(output);
assert.equal((await read(`${destination}/answer-keys.json`)).status, 'ready');
assert.equal((await read(`${destination}/answer-keys.audit.json`)).status, 'pass');
await verify(draftPath, draftBinding.sha256);
await immutableWrite(trace, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D018', card: exerciseCard, status: 'pass',
  answerGate: await bind(gatePath), authorFreeze: await bind(`${work}/9p-t7-answer-author-freeze.json`),
  authorDraft: draftBinding, command, output,
  outputs: await Promise.all(['answer-keys.json', 'answer-keys.audit.json'].map(file => bind(`${destination}/${file}`))),
  writtenTasks: 11, ungraded: 11, auto: 0, oldInputInteractions: false,
  answerPrepareOrIndependentGateRepeated: false, productionWrite: false,
}, null, 2)}\n`);
