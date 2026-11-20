import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/tmp/d1816-d368-source394397-first-review`;
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => ({ path: path.resolve(file), bytes: fs.statSync(file).size,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') });
const verify = record => assert.equal(bind(record.path).sha256, record.sha256, record.path);
assert(!fs.existsSync(O));
const earlierFile = `${T}/tmp/d1816-d341-source392-394-author/author-freeze.json`;
const laterFile = `${T}/tmp/d1816-d360-source395-397-first-author/author-freeze.json`;
const earlier = read(earlierFile);
const laterReport = read(`${T}/tmp/d1816-d360-source395-397-first-author/report.json`);
const pages = [];
for (const row of earlier.pages.filter(row => row.page === 394)) {
  verify(row.draft);
  verify(row.immutable_draft_snapshot);
  verify(row.source_original_render);
  pages.push({ page: row.page, source: row.source_original_render, draft: row.draft,
    snapshot: row.immutable_draft_snapshot, inventory: row.inventory,
    nativeFinalized: false, authorHolds: row.lexical_holds });
}
for (const row of laterReport.pages) {
  verify(row.draft);
  verify(row.snapshot);
  const source = row.prepared_inputs.find(record => record.path.endsWith('/page.png'));
  verify(source);
  pages.push({ page: row.source_page, source, draft: row.draft, snapshot: row.snapshot,
    inventory: bind(`${T}/tmp/d1816-d360-source395-397-first-author/inventory-${String(row.source_page).padStart(4, '0')}.json`),
    nativeFinalized: false, authorHolds: row.holds });
}
assert.deepEqual(pages.map(row => row.page), [394, 395, 396, 397]);
const crops = [
  '.tmp/STEMROBIN-181/d1816-d341/source-work/10p/pages/0394/source-row07-punctuation.crop.png',
  '.tmp/STEMROBIN-181/d1816-d360/source-work/crops/0396-row10-punctuation.png',
  '.tmp/STEMROBIN-181/d1816-d360/source-work/crops/0396-rows17-19-emphasis.png',
  '.tmp/STEMROBIN-181/d1816-d360/source-work/crops/0395-rows19-25-emphasis.png',
].map(bind);
fs.mkdirSync(O, { recursive: true });
const file = `${O}/input-freeze.json`;
fs.writeFileSync(file, JSON.stringify({
  stage: 'D368', role: 'FIRST_INDEPENDENT_SOURCE_REVIEW', pages, optionalCrops: crops,
  authorFreezes: [bind(earlierFile), bind(laterFile)],
  sourceFirst: 'Open original pixels and freeze your own source expectations before candidate prose or author explanations.',
  imageBatchMaximum: 8, contextMaximum: 24, authorActualImageOpens: { D341: 8, D360: 8 },
  source392393PriorPassNotReplayed: true,
  source397Boundary: 'Review heading starts here; exercise12 remains open beyond397. No398 content is supplied.',
  archivalScriptLimit: 'SOURCE397 maximum EMF subscript Latin m versus Cyrillic м is a future-exercise archival uncertainty, not absent N152 prose; do not infer a codepoint from physics.',
  noNativeSourceOrCourseApprovalYet: true, imagesOpenedByParent: 0,
  completeCoursesAdded: 0, sourcePagesAdded: 0, paidToolCalls: 0, databaseWrites: false,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ freeze: bind(file), pages: pages.map(row => row.page), newImageOpens: 0 }));
