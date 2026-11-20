import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const D = `${T}/tmp/d1816-d138-t9-display`;
const O = `${T}/tmp/d1816-d138-t9-display-review`;
const result = JSON.parse(fs.readFileSync(`${D}/result.json`));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: path.resolve(file), bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
assert.equal(result.status, 'pass');
assert.equal(result.records.length, 12);
fs.mkdirSync(O, { recursive: true });
for (const locale of ['zh', 'en']) {
  const records = result.records.filter(row => row.locale === locale);
  assert.equal(records.length, 6);
  for (const row of records) {
    assert.equal(bind(row.screenshot.path).sha256, row.screenshot.sha256);
    assert.equal(bind(row.html.path).sha256, row.html.sha256);
  }
  fs.writeFileSync(`${O}/input.${locale}.json`, JSON.stringify({
    batch: 'D138', locale, role: 'FIRST_OFFLINE_DISPLAY_PIXELS_ONLY',
    display: bind(`${D}/result.json`), records,
    authorizedImageOpens: 8, requiredScreenshots: 6,
    sourceOrFigureReviewReplayed: false, productAcceptance: false,
    reviewScope: 'Actual screenshot layout, text fit, equations/tables, labels and clipping. Mathematical/source/option judgments use separate semantic review.',
    scrollScope: 'Native diagrams are fixed 640px scroll media on mobile. Display script checks the reachable rightmost edge; mobile screenshots are captured at that edge. A deliberate scroll viewport is not a missing/clipped source figure.',
    parentImageOpens: 0, canonicalPromotions: 0,
  }, null, 2) + '\n', { flag: 'wx' });
}
console.log(JSON.stringify({ inputs: ['zh', 'en'].map(locale => bind(`${O}/input.${locale}.json`)),
  screenshots: 12, imagesOpened: 0 }));
