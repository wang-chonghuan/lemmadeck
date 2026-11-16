import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const work = '.intentfold/tickets/STEMROBIN-181/tmp';
const folder = 'ssot-resources/soviet10year-textbooks/artifacts/9p/editions/modern-us-neutral/lessons/phy9-c1-s5-t6';
const read = async p => JSON.parse(await fs.readFile(p, 'utf8'));
const bind = async path => ({
  path, sha256: crypto.createHash('sha256').update(await fs.readFile(path)).digest('hex'),
});
const review = await read(`${work}/9p-t6-answer-review.json`);
assert.equal(review.status, 'pass');
assert.deepEqual(await bind(review.bindings.draft.path), review.bindings.draft);
await fs.copyFile(review.bindings.draft.path, `${folder}/answer-keys.json`, fs.constants.COPYFILE_EXCL);
const choices = await read(`${work}/9p-t6-choice-review.json`);
assert.equal(choices.outcome, 'pass');
await fs.mkdir(`${folder}/choice-set`, { recursive: false });
for (const name of ['seed', 'draft', 'review']) await fs.copyFile(
  `${work}/9p-t6-choice-${name}.json`, `${folder}/choice-set/${name}.json`, fs.constants.COPYFILE_EXCL,
);
const command = [
  '.claude/skills/ld-s10y-answer/tools/lesson_answers.py', 'finalize', '--book', '9p',
  '--edition', 'modern-us-neutral', '--lesson', 'phy9-c1-s5-t6',
];
const output = execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', command, { encoding: 'utf8' });
process.stdout.write(output);
const render = [
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'render', '--book', '9p', '--edition', 'modern-us-neutral',
  '--lesson', 'phy9-c1-s5-t6', '--lesson', 'phy9-c1-s6-n52', '--lesson', 'phy9-c1-s6-n53',
];
const renderOutput = execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', render, { encoding: 'utf8' });
process.stdout.write(renderOutput);
await fs.writeFile(`${work}/d015-native-offline-finalization.json`, JSON.stringify({
  ticket: 'STEMROBIN-181', status: 'pass',
  answerGate: await bind(`${work}/9p-t6-answer-review.json`),
  choiceGate: await bind(`${work}/9p-t6-choice-review.json`),
  answerFinalization: { command, output, answerKeys: await bind(`${folder}/answer-keys.json`),
    audit: await bind(`${folder}/answer-keys.audit.json`) },
  offlineRender: { command: render, output: renderOutput },
  noLegacyInteractionsOrProductionWrite: true,
}, null, 2) + '\n', { flag: 'wx' });
