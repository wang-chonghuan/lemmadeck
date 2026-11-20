import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/tmp/d1816-d337-n149-native`;
const root = '.tmp/STEMROBIN-181/d1816-d337/root';
const work = '.tmp/STEMROBIN-181/d1816-d337/source-work';
const id = 'phy10-c3-s4-n149';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => ({ path: path.resolve(file),
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') });
const verify = record => assert.equal(bind(record.path).sha256, record.sha256, record.path);
const prepared = read(`${T}/tmp/d1816-d330-n149-first-preparation/prepared.json`);
verify(prepared.source);
verify(prepared.exercises);
const text = read(`${T}/tmp/d1816-d343-n149-text-repair/author-freeze.json`);
const reports = {};
for (const [stage, folder, status] of [
  ['D346', 'd346-source392-393-review', 'PASS'],
  ['D347', 'd347-n149-affected-text-review', 'PASS'],
  ['D349', 'd349-source390391-affected-review', 'FAIL'],
]) {
  const dir = `${T}/tmp/d1816-${folder}`;
  const report = read(`${dir}/report.json`);
  assert.equal(report.status, status);
  reports[stage] = { status, report: bind(`${dir}/report.json`),
    reviewFreeze: bind(`${dir}/review-freeze.json`) };
}
assert(!fs.existsSync(O));
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.cpSync(from, to, { recursive: true, errorOnExist: true, force: false });
};
copy(`${prepared.root}/10p/pages`, `${root}/10p/pages`);
copy(`${prepared.root}/10p/figures`, `${root}/10p/figures`);
copy(`${prepared.root}/10p/lessons/${id}`, `${root}/10p/lessons/${id}`);
const book = read(`${prepared.root}/10p/book.json`);
const entry = book.lessons.find(row => row.id === id);
assert(entry);
fs.writeFileSync(`${root}/10p/book.json`, JSON.stringify({ ...book, lessons: [entry] }, null, 2) + '\n');
const templates = [];
for (const record of text.records) {
  verify(record.after);
  verify(record.working);
  const edition = record.locale === 'zh' ? 'modern-us-neutral' : 'modern-us-neutral-en';
  const dir = `${work}/adapt/10p/${edition}/lessons/${id}`;
  copy(path.dirname(record.working.path), dir);
  templates.push({ locale: record.locale, edition,
    template: bind(`${dir}/lesson.template.json`) });
}
verify({ path: `${root}/10p/lessons/${id}/lesson.json`, sha256: prepared.source.sha256 });
fs.mkdirSync(O, { recursive: true });
fs.writeFileSync(`${O}/prepared.json`, JSON.stringify({
  stage: 'D337', root, work, display: '.tmp/STEMROBIN-181/d1816-d337/display',
  id, source: bind(`${root}/10p/lessons/${id}/lesson.json`),
  exercises: bind(`${root}/10p/lessons/${id}/exercises.json`), templates,
  reusedTextReview: reports.D347, figureReviewPending: true,
  sourcePagesAdded: 0, completeCoursesAdded: 0, imagesOpened: 0, paidCalls: 0,
}, null, 2) + '\n');
const meterFile = `${T}/production-meter.json`;
const meter = read(meterFile);
for (const [stage, record] of Object.entries(reports))
  meter.currentResume1816[stage] = { ...meter.currentResume1816[stage], ...record,
    reviewerClosed: true, actualAssignmentImageOpens: 6,
    sourcePagesAdded: 0, completeCoursesAdded: 0 };
meter.currentResume1816.D343.status = 'AFFECTED_TEXT_PASS';
meter.currentResume1816.D348.status = 'AFFECTED_BOLD_MARKER_PASS';
meter.currentResume1816.D352 = { status: 'CURRENT_CONTEXT_NATIVE_PASS_FIRST_FIGURE_REVIEW_ACTIVE',
  context: bind(`${T}/tmp/d1816-d352-current-figure-context/context.json`),
  geometryRerenders: 0, sourcePagesAdded: 0, completeCoursesAdded: 0 };
meter.currentResume1816.D354 = { status: 'PUNCTUATION_ONLY_NATIVE_PASS_AFFECTED_REVIEW_ACTIVE',
  freeze: bind(`${T}/tmp/d1816-d354-source388390-punctuation-repair/author-freeze.json`),
  contentRepairs: 1, imagesOpened: 0, sourcePagesAdded: 0, completeCoursesAdded: 0 };
meter.currentResume1816.D355 = { status: 'FIRST_FIG277_INDEPENDENT_REVIEW_ACTIVE',
  reviewer: '01a1fb01-12c6-7030-89ee-797ad0a4b22d',
  sourcePagesAdded: 0, completeCoursesAdded: 0 };
meter.currentResume1816.D356 = { status: 'PUNCTUATION_AFFECTED_ONLY_REVIEW_SAME_SOLE_REVIEWER',
  reviewer: '01a1fb01-12c6-7030-89ee-797ad0a4b22d',
  sourcePagesAdded: 0, completeCoursesAdded: 0 };
meter.currentResume1816.D337 = { status: 'PREPARED_CURRENT_TEXT_PASS_FIRST_FIGURE_REVIEW_PENDING',
  prepared: bind(`${O}/prepared.json`), sourcePagesAdded: 0, completeCoursesAdded: 0 };
meter.currentResume1816.currentContinuation =
  '142 complete offline courses pushed; no new completed course. D346 source392393 PASS, D347 fourteen affected N149 text entries PASS; sole reviewer closed6/8images. D349 two confirmed archival punctuation FAIL retained, D354 exact two marks+notes repair nativePASS. D352 currentFIG277 context nativePASS under first independentD355 review, D356 affected punctuation same sole reviewer. D337 N149 final scratch copies preserve current approved text; no native finalize/capture yet. D351 N151 author still active; no source rebind midflight. No DB/publish/merge/deploy/closure/full checks.';
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ prepared: bind(`${O}/prepared.json`), collected: Object.keys(reports) }));
