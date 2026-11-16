import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

delete process.env.PWDEBUG;
process.env.PLAYWRIGHT_HTML_OPEN = 'never';
const work = '.intentfold/tickets/STEMROBIN-181/tmp';
const root = 'ssot-resources/soviet10year-textbooks/artifacts/9p/editions/modern-us-neutral';
const cards = ['phy9-c1-s7-t4', 'phy9-c2-s1', 'phy9-c2-s2-n59', 'phy9-c2-s2-n61'];
const read = async path => JSON.parse(await fs.readFile(path, 'utf8'));
const bind = async path => ({
  path, sha256: crypto.createHash('sha256').update(await fs.readFile(path)).digest('hex'),
});
const tracePath = `${work}/d017-native-offline-finalization.json`;
assert.equal(await fs.access(tracePath).then(() => true, () => false), false);
for (const card of cards) assert.equal((await read(`${root}/lessons/${card}/adaptation.audit.json`)).status, 'pass');
assert.equal((await read(`${root}/lessons/${cards[0]}/answer-keys.json`)).status, 'ready');
assert.equal((await read(`${work}/9p-t4-choice-review.json`)).outcome, 'pass');
assert.equal((await read(`${work}/9p-t4-choice-author-comparison.json`)).status, 'pass');
const renderCommand = [
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'render', '--book', '9p', '--edition', 'modern-us-neutral',
  ...cards.flatMap(card => ['--lesson', card]),
];
const renderOutput = execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', renderCommand, { encoding: 'utf8' });
process.stdout.write(renderOutput);
const previewCommand = [
  `${work}/retain-choice-ex1.mjs`, '9p', cards[0], '9p-t4-choice', '9p-t4-choice-review.json',
];
const previewOutput = execFileSync(process.execPath, previewCommand, { encoding: 'utf8' });
process.stdout.write(previewOutput);
await fs.writeFile(tracePath, JSON.stringify({
  ticket: 'STEMROBIN-181', status: 'pass', cards,
  answerGate: await bind(`${work}/9p-t4-answer-review.json`),
  choiceGate: await bind(`${work}/9p-t4-choice-review.json`),
  authorComparison: await bind(`${work}/9p-t4-choice-author-comparison.json`),
  n58PathCorrection: await bind(`${work}/d017-n58-path-correction.json`),
  offlineRender: { command: renderCommand, output: renderOutput },
  previewPreparation: {
    command: previewCommand, output: previewOutput,
    browserUse: 'Existing helper uses isolated headless page solely for native CSS/media extraction; no acceptance assertions or pixel gate. All helper browsers closed.',
  },
  limits: 'Native render once for this batch. Answers already native finalized, not repeated. No legacy interactions, production write or full-project checks.',
}, null, 2) + '\n', { flag: 'wx' });
