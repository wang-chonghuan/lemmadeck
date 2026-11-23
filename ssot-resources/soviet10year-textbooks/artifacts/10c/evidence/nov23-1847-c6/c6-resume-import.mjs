import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

const root = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184';
assert.equal(process.cwd(), root);
const base = '.tmp/stemrobin-184-six';
const source = `${base}/c6-modern-representation-repair/artifacts/10c`;
const answer = `${base}/c6-answer-reviewed-working-copy/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c6-ex`;
const book = 'ssot-resources/soviet10year-textbooks/artifacts/10c';
const modern = `${book}/editions/modern-us-neutral/lessons/ana10-c6-ex`;
const raw = `${book}/lessons/ana10-c6-ex`;
const out = `${base}/c6-resume`;
assert(!fs.existsSync(out));
assert(!fs.existsSync(raw));
assert(!fs.existsSync(modern));
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const audit = read(`${source}/editions/modern-us-neutral/lessons/ana10-c6-ex/adaptation.audit.json`);
assert.equal(audit.status, 'pass');
assert.equal(hash(`${source}/lessons/ana10-c6-ex/lesson.json`), audit.sourceLessonSha256);
assert.equal(hash(`${source}/lessons/ana10-c6-ex/exercises.json`), audit.sourceExercisesSha256);
const ready = read(`${base}/c6-answer-reviewed-working-copy/ready-answers-interactions-bindings.json`);
for (const row of ready.outputs) {
  assert.equal(hash(`${answer}/${path.basename(row.path)}`), row.sha256);
}
for (let i = 98; i <= 104; i++) {
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    const relative = `pages/${String(i).padStart(4, '0')}/${name}`;
    assert.equal(hash(`${source}/${relative}`), hash(`${book}/${relative}`));
  }
}
assert.equal(hash(`${source}/editions/modern-us-neutral/lessons/ana10-c6-ex/exercises.json`),
  ready.editionSha256);
fs.mkdirSync(out);
const files = [
  ...['lesson.json', 'lesson.md', 'exercises.json'].map(name => [
    `${source}/lessons/ana10-c6-ex/${name}`, `${raw}/${name}`]),
  ...['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json'].map(name => [
    `${source}/editions/modern-us-neutral/lessons/ana10-c6-ex/${name}`, `${modern}/${name}`]),
  ...['answer-keys.json', 'answer-keys.audit.json', 'interactions.json'].map(name => [
    `${answer}/${name}`, `${modern}/${name}`]),
];
for (const [from, to] of files) {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
}
fs.writeFileSync(`${out}/import.json`, JSON.stringify({
  status: 'EXACT_APPROVED_SNAPSHOTS_IMPORTED_ONLY_INDEX_AND_NEW_CHOICES_REMAIN',
  files: files.map(([from, to]) => ({ source: from, target: to, sha256: hash(to) })),
  reusedReadyAnswers: 57, reusedFreeInteractions: 57,
  sourcePagesUnchanged: 7, mathematicalOrSourceReviewsReplayed: false,
  sourceEvidence: 'ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/nov22-1846-c6-edition-affected-finalization/retention.json',
  answerEvidence: 'ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/nov22-1846-c6-ready-answers-interactions/retention.json',
  databaseWrites: 0,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ imported: files.length, sourcePagesUnchanged: 7 }));
