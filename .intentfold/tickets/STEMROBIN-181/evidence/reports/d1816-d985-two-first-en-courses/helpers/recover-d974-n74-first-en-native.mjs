import fs from 'node:fs';
import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, copy, run } from './n42-native.mjs';

const [reviewPath, reviewHash] = process.argv.slice(2);
assert.equal(bind(reviewPath).sha256, reviewHash);
const approval = read(reviewPath);
assert.equal(approval.status, 'PASS');
const reconciliationPath = `${ticket}/tmp/d1816-d973-n74-source-section-reconciliation/reconciliation.json`;
const reconciliation = read(reconciliationPath);
const candidateFile = reconciliation.candidate;
assert.equal(bind(candidateFile.path).sha256, candidateFile.sha256);
assert(JSON.stringify(approval).includes(candidateFile.sha256));
const preparedPath = `${ticket}/tmp/d1816-d965-n74-missing-en/prepared.json`;
const prepared = read(preparedPath);
for (const file of [prepared.source, ...prepared.productsReusedExactly])
  assert.equal(bind(file.path).sha256, file.sha256);
const card = 'phy9-c2-s2-n74';
const root = `${repo}/.tmp/STEMROBIN-181/d1816-d971/root`;
const work = prepared.work;
const out = `${ticket}/tmp/d1816-d974-n74-first-en-native-recovery`;
const templates = `${work}/adapt/9p/modern-us-neutral-en/lessons/${card}`;
copy(`${templates}/lesson.template.json`, `${out}/failed-template.original.json`);
const directory = `${root}/9p/editions/modern-us-neutral-en/lessons/${card}`;
copy(`${directory}/adaptation.audit.json`, `${out}/first-failed-audit.original.json`);
copy(reviewPath, `${out}/section-identity-review.original.json`);
fs.copyFileSync(candidateFile.path, `${templates}/lesson.template.json`);
assert.equal(bind(`${templates}/lesson.template.json`).sha256, candidateFile.sha256);
const receipts = [];
for (const command of ['adapt-finalize', 'render'])
  receipts.push(run(`d974-n74-en-${command}-${command === 'adapt-finalize' ? 'section-identity-recovery' : 'first'}`, [
    `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, '-B',
    `${repo}/.claude/skills/ld-s10y-lesson/tools/p2c.py`, command,
    '--book', '9p', '--root', root, '--work', work,
    '--edition', 'modern-us-neutral-en', '--lesson', card,
  ]));
const row = {
  locale: 'en', edition: 'modern-us-neutral-en',
  lesson: bind(`${directory}/lesson.json`), exercises: bind(`${directory}/exercises.json`),
  figures: bind(`${directory}/figures.json`), audit: bind(`${directory}/adaptation.audit.json`),
  textHtml: bind(`${work}/render/9p/modern-us-neutral-en/${card}/text.html`),
};
assert.equal(read(row.audit.path).status, 'pass');
assert.equal(read(row.lesson.path).prose.length, 25);
assert.equal(read(row.exercises.path).count, 0);
assert.equal(read(row.figures.path).figures.length, 0);
const finalized = read(row.lesson.path), candidate = read(candidateFile.path);
assert.deepEqual(finalized.prose, candidate.prose);
assert.deepEqual(finalized.section_breaks, candidate.section_breaks);
for (const key of ['chapter', 'section', 'title', 'printed_title'])
  assert.equal(finalized[key], candidate[key]);
for (const file of [prepared.source, ...prepared.productsReusedExactly])
  assert.equal(bind(file.path).sha256, file.sha256);
save(`${out}/result.json`, {
  task: 'D974', status: 'FIRST_MISSING_EN_NATIVE_FINALIZE_RENDER_PASS',
  card, root, work, rows: [row], receipts,
  prepared: bind(preparedPath), reconciliation: bind(reconciliationPath), review: bind(reviewPath),
  firstFailedNative: reconciliation.failedNative,
  approvedProseMetadataAndBoundariesUnchangedAfterFinalization: true,
  originalObjects: 25, originalTasks: 0, originalFigures: 0,
  originalSourceAndZhPassReplayed: false, parentImages: 0,
  databaseWrites: 0, paidCalls: 0, fullCourseDisplayPending: true,
  fullCourseApproved: false, newCompleteCourses: 0, newSourcePages: 0,
});
console.log(JSON.stringify({ result: bind(`${out}/result.json`), nativePASS: true }));
