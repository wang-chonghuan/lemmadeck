import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const meterFile = `${T}/production-meter.json`;
const meter = read(meterFile);
const entries = [
  ['D149', '01a1f8d8-8c68-7a52-90a1-0a001ef161c9',
    'd1816-d149-n9-figures-author', '3ec39d874b9cdac9538fa748f8d205c17eb279986c8b49605fd5988ef5727773'],
  ['D151', '01a1f8da-9911-7d12-a651-95b58c648487',
    'd1816-d151-n9-figures89-author', 'f2c6bd04fbbb13da4b33e153c66e4268e49b86d3982cfeaee9e307f1a80617f4'],
];
for (const [batch, author, dir, expected] of entries) {
  const inputFreeze = bind(`${T}/tmp/${dir}/input-freeze.json`);
  assert.equal(inputFreeze.sha256, expected);
  assert.equal(meter.currentResume1816[batch].canonicalPromotions, 0);
  Object.assign(meter.currentResume1816[batch], {
    status: 'FIRST_BOUNDED_TWO_FIGURE_AUTHOR_ACTIVE', author, authorClosed: false,
    inputFreeze, actualImageOpens: null, independentApproval: false,
    authorReportPending: true, wholeCourseApproved: false,
    maximumAuthorImageOpens: 8, maximumContentRepairsPerFigure: 1,
    parentImageOpens: 0, portraitGenerationAuthorized: false,
  });
}
meter.currentResume1816.D150 = {
  status: 'SOURCE_ONLY_AND_APPROVED_TEXT_PREPARED_AUTHOR_CANDIDATES_PENDING',
  sourceOnly: bind(`${T}/tmp/d1816-d150-n9-figures-review-input/source-only.json`),
  visibleText: bind(`${T}/tmp/d1816-d150-n9-figures-review-input/visible-text.json`),
  imagesAuthorized: 8, reviewer: null, reviewerClosed: null,
  independentApproval: false, completeCoursesAdded: 0,
};
meter.currentResume1816.currentContinuation =
  '137 complete offline courses pushed at5e5712dece2cd02da131823d49b0b882bef60b5a;561 SOURCE pages and136 book-answer records unchanged. D144 N8 delivered and actual push receipt verified. N9 composed SCI/ZH/EN text PASS retained atD148,original34 block observations reused and3 attributed-source limits preserved. Fresh D149 fig06/07 and D151 fig08/09 authors active in disjoint output scopes,each8 opens maximum;no independent reviewer open. D150 source-only review input prepared;all10 N9 figures still unapproved,portrait generation unauthorized. All earlier HOLDs/source187/307 and unapproved figures unchanged. Continue authorized small batches;no parent images,paid calls,DB,publisher,deploy,merge,closure or formal handoff.';
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ activeAuthors: entries.map(([batch, author]) => ({ batch, author })),
  independentReviewersOpen: 0, parentImageOpens: 0, completeCoursesAdded: 0 }));
