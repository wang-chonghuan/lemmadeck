import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

assert.equal(process.cwd(), '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck');
const T = '.intentfold/tickets/STEMROBIN-181', B = '.tmp/STEMROBIN-181/d1816-d090';
const O = `${T}/tmp/d1816-d090-n128-promotion`, I = 'phy9-c2-s6-n128';
const read = p => JSON.parse(fs.readFileSync(p));
const bind = p => ({ path: p, sha256: crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex') });
const verify = r => assert.equal(bind(r.path).sha256, r.sha256, r.path);
const require = createRequire(import.meta.url);
const { proseFlow } = require(path.resolve('.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'));
const layout = read(`${O}/native-layout-recovery.json`);
const displayFile = `${T}/tmp/d1816-d090-n128-display/result.json`, display = read(displayFile);
assert.equal(display.status, 'pass');
assert.equal(display.records.length, 4);
for (const row of display.records) for (const key of ['lesson', 'html', 'screenshot']) verify(row[key]);
const records = [];
for (const row of layout.templates) {
  verify(row.working);
  const directory = `${B}/root/9p/editions/${row.edition}/lessons/${I}`;
  const lessonFile = `${directory}/lesson.json`, lesson = read(lessonFile);
  const working = read(row.working.path);
  assert.deepEqual(lesson.prose, working.prose);
  assert.deepEqual(lesson.section_breaks, working.section_breaks);
  assert.equal(read(`${directory}/adaptation.audit.json`).status, 'pass');
  const nativeFlow = proseFlow(lesson.prose, lesson.section_breaks);
  const paragraphs = nativeFlow.filter(r => r.kind === 'p');
  assert.equal(paragraphs.length, row.locale === 'zh' ? 23 : 19);
  for (const record of display.records.filter(r => r.locale === row.locale)) {
    assert.equal(record.paragraphs, paragraphs.length);
  }
  records.push({
    locale: row.locale, edition: row.edition, templateBefore: row.before, templateAfter: row.working,
    sourceEntries: lesson.prose.length, renderedParagraphs: paragraphs.length,
    fullDisplayEntries: nativeFlow.length, sourceFigureEntries: 2, sourceCaptionEntries: 2,
    sectionBoundaries: lesson.section_breaks, affectedLayout: row,
    finalized: ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json'].map(p => bind(`${directory}/${p}`)),
    screenshots: display.records.filter(r => r.locale === row.locale).map(r => r.screenshot),
  });
}
for (const row of layout.records) for (const key of ['spec', 'svg', 'render', 'review']) verify(row[key]);
const freezeFile = `${O}/layout-display-author-freeze.json`;
assert(!fs.existsSync(freezeFile));
fs.writeFileSync(freezeFile, JSON.stringify({
  schema: 'STEMROBIN-181/native-layout-display-affected-freeze@1',
  batch: 'D090', lesson: I, status: 'native-and-offline-DOM-pass-affected-layout-and-first-pixels-pending',
  originalSCIAndGraphicsReview: bind(`${T}/tmp/d1816-d089-n128-first-review/report.json`),
  affectedSCIAndLocalesReview: bind(`${T}/tmp/d1816-d095-affected128-source320321-review/report.json`),
  affectedReviewFreeze: bind(`${T}/tmp/d1816-d095-affected128-source320321-review/review-freeze.json`),
  affectedAuthor: bind(`${T}/tmp/d1816-d092-n128-affected-author/author-freeze.json`),
  layoutRecovery: bind(`${O}/native-layout-recovery.json`),
  offlineDOM: bind(displayFile), records, figures: layout.records,
  currentFigureTextContextsMatchNormalizedTemplates: true,
  firstNativeFailuresPreserved: true, scienceProseNonWhitespaceUnchanged: true,
  graphicPASSReused: true, geometryRerenders: 0, parentImageOpens: 0,
  sourcePagesAdded: 0, completeCoursesAdded: 0, databaseWrites: false, formalHandoff: false,
}, null, 2) + '\n', { flag: 'wx' });
const meterFile = `${T}/production-meter.json`, meter = read(meterFile);
Object.assign(meter.currentResume1816.D090, {
  status: 'native-and-offline-four-surfaces-PASS-first-pixel-and-layout-affected-review-pending',
  offlineDOM: bind(displayFile), layoutDisplayFreeze: bind(freezeFile), actualParentImages: 0,
});
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ freeze: bind(freezeFile), pending: 'layout-context-and-four-pixels', counts: records.map(r => ({ locale: r.locale, paragraphs: r.renderedParagraphs, entries: r.fullDisplayEntries })) }));
