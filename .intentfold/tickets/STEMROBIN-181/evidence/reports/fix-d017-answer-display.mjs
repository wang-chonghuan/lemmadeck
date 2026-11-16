import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { choiceHtml } from '../../../../.claude/skills/ld-s10y-lesson/tools/choice_html.mjs';

const work = '.intentfold/tickets/STEMROBIN-181/tmp';
const folder = `${work}/d017-answer-display`;
await fs.mkdir(folder, { recursive: true });
const keyFile = 'ssot-resources/soviet10year-textbooks/artifacts/9p/editions/modern-us-neutral/lessons/phy9-c1-s7-t4/answer-keys.json';
const htmlFile = '.tmp/ld-s10y-lesson/render/9p/modern-us-neutral/phy9-c1-s7-t4/answers.html';
const checkpointFile = `${work}/offline-d017/checkpoint-phy9-c1-s7-t4--phy9-c2-s1--phy9-c2-s2-n59--phy9-c2-s2-n61.json`;
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bind = async path => ({ path, sha256: hash(await fs.readFile(path)) });
for (const [source, name] of [[keyFile, 'initial.answer-keys.json'], [htmlFile, 'initial.answers.html'],
  [checkpointFile, 'initial.offline-checkpoint.json']]) {
  const destination = `${folder}/${name}`;
  if (await fs.access(destination).then(() => true, () => false)) {
    assert.equal((await bind(source)).sha256, (await bind(destination)).sha256);
  } else await fs.copyFile(source, destination, fs.constants.COPYFILE_EXCL);
}
const initial = JSON.parse(await fs.readFile(keyFile, 'utf8'));
const changed = structuredClone(initial);
const atoms = [
  [2, '$\\alpha_{\\mathrm{Hg}}$'],
  [2, '$\\alpha_{\\mathrm{g}}$'],
  [2, '$$q=\\alpha_{\\mathrm{Hg}}-\\alpha_{\\mathrm{g}}$$'],
  [4, '$$V_0=m/\\rho_0$$'],
  [4, '$$V_{60}=m/\\rho_{60}$$'],
  [6, '$$\\beta_{\\mathrm{lower}}<\\beta_{\\mathrm{upper}}$$'],
];
const edits = [];
for (const [index, before] of atoms) {
  const delimiter = before.startsWith('$$') ? '$$' : '$';
  const after = before.slice(0, -delimiter.length) + '\\;' + delimiter;
  const answer = changed.answers[index];
  assert.equal(answer.displayAnswer.split(before).length, 2, `Expected one complete atom:${before}`);
  answer.displayAnswer = answer.displayAnswer.replace(before, () => after);
  edits.push({ exercise: answer.exercise, before, after, type: 'terminal math spacing only' });
}
const reversed = structuredClone(changed);
for (const [index, { before, after }] of edits.entries()) {
  reversed.answers[atoms[index][0]].displayAnswer = reversed.answers[atoms[index][0]].displayAnswer.replace(after, () => before);
}
assert.deepEqual(reversed, initial);
changed.status = 'draft';
const draftFile = `${folder}/spacing-only.answer-draft.json`;
await fs.writeFile(draftFile, JSON.stringify(changed, null, 2) + '\n', { flag: 'wx' });
await fs.copyFile(draftFile, keyFile);
const command = [
  '.claude/skills/ld-s10y-answer/tools/lesson_answers.py', 'finalize', '--book', '9p',
  '--edition', 'modern-us-neutral', '--lesson', 'phy9-c1-s7-t4',
];
const output = execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', command, { encoding: 'utf8' });
process.stdout.write(output);
const final = JSON.parse(await fs.readFile(keyFile, 'utf8'));
const restoredFinal = structuredClone(final);
for (const [index, { before, after }] of edits.entries()) {
  restoredFinal.answers[atoms[index][0]].displayAnswer = restoredFinal.answers[atoms[index][0]].displayAnswer.replace(after, () => before);
}
assert.deepEqual(restoredFinal, initial);
let html = await fs.readFile(htmlFile, 'utf8');
const htmlBefore = html;
for (const index of [...new Set(atoms.map(([index]) => index))]) {
  const before = choiceHtml(initial.answers[index].displayAnswer);
  const after = choiceHtml(final.answers[index].displayAnswer);
  assert.equal(html.split(before).length, 2, `Expected one full rendered answer:${index + 1}`);
  html = html.replace(before, () => after);
}
assert.notEqual(html, htmlBefore);
await fs.writeFile(htmlFile, html);
const checkpoint = JSON.parse(await fs.readFile(checkpointFile, 'utf8'));
assert.equal(checkpoint.status, 'fail');
checkpoint.initialFailure = {
  checkpoint: await bind(`${folder}/initial.offline-checkpoint.json`),
  actualAffectedScreenshot: await bind(`${work}/offline-d017/initial-answer-1440.png`),
  finding: 'Six narrow subscript math atoms overflowed their own KaTeX layout box by about2px on1440px answer surface; not page-width overflow.',
  correction: `${work}/d017-answer-display-correction.json`,
};
await fs.writeFile(checkpointFile, JSON.stringify(checkpoint, null, 2) + '\n');
await fs.writeFile(`${work}/d017-answer-display-correction.json`, JSON.stringify({
  ticket: 'STEMROBIN-181', status: 'spacing-only-contract-pass-surface-recheck-pending',
  originalAnswerGate: await bind(`${work}/9p-t4-answer-review.json`),
  originalAuthorDraft: await bind(`${work}/9p-t4-answer-draft.json`),
  preservedInitialKeys: await bind(`${folder}/initial.answer-keys.json`),
  preservedInitialHtml: await bind(`${folder}/initial.answers.html`),
  preservedInitialCheckpoint: await bind(`${folder}/initial.offline-checkpoint.json`),
  newDraft: await bind(draftFile), currentKeys: await bind(keyFile), currentAnswersHtml: await bind(htmlFile),
  edits, nativeAffectedFinalization: { command, output },
  reverseSpacingEditsRestoreAllOriginalKeyData: true,
  independentAffectedReview: 'Main compared all six full-atom edits after initial independent answer approval. Removing terminal TeX spacing restores every answer, prompt, figureEvidence, grading, parts, bookRaw and note. No scientific assertion, source datum or result changed.',
  limits: 'Only three affected answers have terminal-spacing edits; all seven native keys remain ungraded. Original gate/author bytes retained. Only answers HTML rerendered from existing choiceHtml; text/exercises/choices HTML and earlier passed surfaces unchanged. No app/CSS/stable tool/source/SCI/choice gate change or production write.',
}, null, 2) + '\n', { flag: 'wx' });
