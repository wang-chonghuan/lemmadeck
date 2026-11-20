import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const read = file => JSON.parse(fs.readFileSync(file));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({ path: file, sha256: hash(file) });
const oldFile = `${T}/tmp/d1816-d112-n19-author/author-freeze.json`;
assert.equal(hash(oldFile), 'ca3a08af8c63840a3b878306123b9d05f03028858c66b12c67ec7ce3443b0230');
const old = read(oldFile);
const reviewFile = `${T}/tmp/d1816-d113-n19-text-review/review-freeze.json`;
assert.equal(hash(reviewFile), '2264b77456d3edf491556eb51085d84f62ae817c7a26d5ca8def27fac70726ae');
const review = read(reviewFile);
assert.equal(hash(review.report.path), review.report.sha256);
for (const item of Object.values(review.inputs)) assert.equal(hash(item.path), item.sha256);
const records = old.records.map(row => {
  assert.equal(hash(row.template.path), row.template.sha256);
  const file = row.template.path.replace('d1816-d112/work', 'd1816-d115/work');
  const before = read(row.template.path);
  const current = read(file);
  const stripped = structuredClone(current);
  stripped.prose[14].historical_entities = before.prose[14].historical_entities;
  for (const key of ['chapter', 'section', 'printed_title']) {
    if (row.locale === 'en') {
      assert.equal(current[key], current.source.data[key]);
      stripped[key] = before[key];
    }
  }
  assert.deepEqual(stripped, before);
  assert.deepEqual(current.prose.map(item => item.text), before.prose.map(item => item.text));
  assert.equal(current.prose[14].historical_entities.length, 2);
  for (const entity of current.prose[14].historical_entities) {
    assert(current.prose[14].text.includes(entity.term));
    assert(current.prose[14].source_text.includes(entity.source_term ?? entity.term));
    assert(entity.reason.startsWith('p0050#5 '));
  }
  return {
    locale: row.locale, edition: row.edition,
    priorTemplate: row.template, template: bind(file),
    proseBytesUnchanged: true, sourceSnapshotUnchanged: true,
    changedPointers: [
      ...(row.locale === 'en' ? ['/chapter', '/section', '/printed_title'] : []),
      '/prose/14/historical_entities',
    ],
  };
});
const result = {
  schema: 'STEMROBIN-181/affected-text-metadata-author@1',
  ticket: 'STEMROBIN-181', batch: 'D115', lesson: old.lesson,
  priorAuthor: bind(oldFile), priorReview: bind(reviewFile), records,
  work: '.tmp/STEMROBIN-181/d1816-d115/work',
  root: '.tmp/STEMROBIN-181/d1816-d112/root',
  resolves: ['D113 F1 native English identity', 'D113 F2 retained source-law-name declarations'],
  priorScienceAndLanguageVerdictsReused: true,
  originalChinesePassNotRebound: true,
  substantiveProseChanged: false, newScienceCorrection: false,
  sourcePagesAdded: 0, completeCoursesAdded: 0, imageOpens: 0,
  paidCalls: 0, databaseWrites: false, approval: false,
};
const output = `${T}/tmp/d1816-d115-n19-text-metadata-author/author-freeze.json`;
fs.writeFileSync(output, JSON.stringify(result, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ freeze: bind(output), records }));
