import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const work = '.intentfold/tickets/STEMROBIN-181/tmp';
const id = 'phy9-c1-s6-t8';
const folder = `ssot-resources/soviet10year-textbooks/artifacts/9p/editions/modern-us-neutral/lessons/${id}`;
const cards = ['phy9-c1-s6-n54', id, 'phy9-c1-s7-n56', 'phy9-c1-s7-n57'];
const read = async file => JSON.parse(await fs.readFile(file, 'utf8'));
const bind = async path => ({
  path, sha256: crypto.createHash('sha256').update(await fs.readFile(path)).digest('hex'),
});
const answerReview = await read(`${work}/9p-t8-answer-review.json`);
assert.equal(answerReview.status, 'pass');
assert.deepEqual(await bind(answerReview.bindings.draft.path), answerReview.bindings.draft);
const choices = await read(`${work}/9p-t8-choice-review.json`);
assert.equal(choices.outcome, 'pass');
assert.equal((await read(`${work}/9p-t8-choice-author-comparison.json`)).status, 'pass');
for (const card of cards) {
  const audit = await read(folder.replace(id, card) + '/adaptation.audit.json');
  assert.equal(audit.status, 'pass');
}
await fs.copyFile(answerReview.bindings.draft.path, `${folder}/answer-keys.json`, fs.constants.COPYFILE_EXCL);
const answerCommand = [
  '.claude/skills/ld-s10y-answer/tools/lesson_answers.py', 'finalize', '--book', '9p',
  '--edition', 'modern-us-neutral', '--lesson', id,
];
const answerOutput = execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', answerCommand, { encoding: 'utf8' });
process.stdout.write(answerOutput);
const renderCommand = [
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'render', '--book', '9p', '--edition', 'modern-us-neutral',
  ...cards.flatMap(card => ['--lesson', card]),
];
const renderOutput = execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', renderCommand, { encoding: 'utf8' });
process.stdout.write(renderOutput);
const previewCommand = [
  `${work}/retain-choice-ex1.mjs`, '9p', id, '9p-t8-choice', '9p-t8-choice-review.json',
];
const previewOutput = execFileSync(process.execPath, previewCommand, { encoding: 'utf8' });
process.stdout.write(previewOutput);
for (const surface of ['text', 'exercises', 'choices', 'answers']) {
  await fs.access(`.tmp/ld-s10y-lesson/render/9p/modern-us-neutral/${id}/${surface}.html`);
}
await fs.writeFile(`${work}/d016-native-offline-finalization.json`, JSON.stringify({
  ticket: 'STEMROBIN-181', status: 'pass', cards,
  answerGate: await bind(`${work}/9p-t8-answer-review.json`),
  choiceGate: await bind(`${work}/9p-t8-choice-review.json`),
  authorComparison: await bind(`${work}/9p-t8-choice-author-comparison.json`),
  answerFinalization: {
    command: answerCommand, output: answerOutput,
    answerKeys: await bind(`${folder}/answer-keys.json`),
    audit: await bind(`${folder}/answer-keys.audit.json`),
  },
  offlineRender: { command: renderCommand, output: renderOutput },
  previewPreparation: {
    command: previewCommand, output: previewOutput,
    allFourT8SurfacesExistBeforeAcceptance: true,
    browserUse: 'Existing helper reads native HTML styles/media in isolated headless Chromium solely to prepare self-contained previews; no acceptance assertions or screenshot gate.',
  },
  noLegacyInteractionsOrProductionWrite: true,
}, null, 2) + '\n', { flag: 'wx' });
