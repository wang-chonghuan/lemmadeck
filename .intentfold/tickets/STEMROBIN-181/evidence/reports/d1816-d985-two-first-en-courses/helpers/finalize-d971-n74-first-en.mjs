import fs from 'node:fs';
import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, copy, run } from './n42-native.mjs';

const [reviewPath, reviewHash] = process.argv.slice(2);
assert.equal(bind(reviewPath).sha256, reviewHash);
const approval = read(reviewPath);
assert.equal(approval.status, 'PASS');
const correctionPath = `${ticket}/tmp/d1816-d970-n74-two-text-findings/correction.json`;
const corrected = read(correctionPath);
assert(JSON.stringify(approval).includes(corrected.candidate.sha256));
assert.equal(bind(corrected.candidate.path).sha256, corrected.candidate.sha256);
const preparedPath = `${ticket}/tmp/d1816-d965-n74-missing-en/prepared.json`;
const prepared = read(preparedPath);
for (const file of [prepared.source, prepared.approvedZh, ...prepared.productsReusedExactly])
  assert.equal(bind(file.path).sha256, file.sha256);
const card = 'phy9-c2-s2-n74';
const source = `${repo}/ssot-resources/soviet10year-textbooks/artifacts/9p`;
const root = `${repo}/.tmp/STEMROBIN-181/d1816-d971/root`;
const work = prepared.work;
const out = `${ticket}/tmp/d1816-d971-n74-first-en-native`;
assert(!fs.existsSync(root));
fs.mkdirSync(`${root}/9p/lessons`, { recursive: true });
for (const name of ['book.json', 'pages', 'figures', `lessons/${card}`]) {
  const from = `${source}/${name}`;
  fs.symlinkSync(from, `${root}/9p/${name}`, fs.statSync(from).isDirectory() ? 'dir' : 'file');
}
copy(reviewPath, `${out}/affected-text-review.original.json`);
const templates = `${work}/adapt/9p/modern-us-neutral-en/lessons/${card}`;
copy(`${templates}/lesson.template.json`, `${out}/prepared-template.original.json`);
fs.copyFileSync(corrected.candidate.path, `${templates}/lesson.template.json`);
assert.equal(bind(`${templates}/lesson.template.json`).sha256, corrected.candidate.sha256);
const receipts = [];
for (const command of ['adapt-finalize', 'render'])
  receipts.push(run(`d971-n74-en-${command}-first`, [
    `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, '-B',
    `${repo}/.claude/skills/ld-s10y-lesson/tools/p2c.py`, command,
    '--book', '9p', '--root', root, '--work', work,
    '--edition', 'modern-us-neutral-en', '--lesson', card,
  ]));
const directory = `${root}/9p/editions/modern-us-neutral-en/lessons/${card}`;
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
const finalized = read(row.lesson.path), candidate = read(corrected.candidate.path);
assert.deepEqual(finalized.prose, candidate.prose);
assert.deepEqual(finalized.section_breaks, candidate.section_breaks);
for (const key of ['chapter', 'section', 'title', 'printed_title'])
  assert.equal(finalized[key], candidate[key]);
for (const file of [prepared.source, prepared.approvedZh, ...prepared.productsReusedExactly])
  assert.equal(bind(file.path).sha256, file.sha256);
save(`${out}/result.json`, {
  task: 'D971', status: 'FIRST_MISSING_EN_NATIVE_FINALIZE_RENDER_PASS',
  card, root, work, rows: [row], receipts,
  prepared: bind(preparedPath), correction: bind(correctionPath), review: bind(reviewPath),
  approvedProseMetadataAndBoundariesUnchangedAfterFinalization: true,
  originalObjects: 25, originalTasks: 0, originalFigures: 0,
  originalSourceAndZhPassReplayed: false, parentImages: 0,
  databaseWrites: 0, paidCalls: 0, fullCourseDisplayPending: true,
  fullCourseApproved: false, newCompleteCourses: 0, newSourcePages: 0,
});
console.log(JSON.stringify({ result: bind(`${out}/result.json`), nativePASS: true }));
