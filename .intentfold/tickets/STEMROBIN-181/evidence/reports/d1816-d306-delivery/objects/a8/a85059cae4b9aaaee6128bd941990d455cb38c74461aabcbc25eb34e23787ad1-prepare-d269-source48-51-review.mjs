import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const ticket = '.intentfold/tickets/STEMROBIN-181';
const output = `${ticket}/tmp/d1816-d269-source48-51-review`;
const root = '.tmp/STEMROBIN-181/d1816-d270/root/10p';
const work = '.tmp/STEMROBIN-181/d1816-d270/source-work/10p';
const nativeFile = `${ticket}/tmp/d1816-d270-source48-51-native-recovery/result.json`;
const native = JSON.parse(fs.readFileSync(nativeFile));
assert.equal(native.firstFailure, null);
assert.equal(native.status, 'native-pass-review-pending');
assert(!fs.existsSync(`${output}/input-freeze.json`));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: path.resolve(file), bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
  return bind(file);
};
const pages = [48, 49, 50, 51].map(page => {
  const id = String(page).padStart(4, '0');
  return { page, printedPage: page - 10, original: bind(`${work}/pages/${id}/page.png`) };
});
const sourceOnly = save(`${output}/source-only.json`, {
  batch: 'D269', book: '10p', pages,
  instruction: 'Open original pages one at a time, independently record visible text, emphasis, formulas, headings, captions, footnote, figure structure and outgoing/incoming joins before reading candidate material. Source figures stay in pixels; no Latin/Cyrillic codepoint identity can be inferred solely from look-alike glyphs.',
});
const candidates = pages.map(({ page }) => {
  const id = String(page).padStart(4, '0');
  return { page, md: bind(`${root}/pages/${id}/page.md`),
    json: bind(`${root}/pages/${id}/page.json`),
    audit: bind(`${root}/pages/${id}/audit.json`) };
});
const boundary = `${root}/pages/0052/page.json`;
const afterInventory = save(`${output}/after-inventory.json`, {
  candidates, native: bind(nativeFile), nextPageTextOnly: bind(boundary),
  originalNativeFailure: bind(`${ticket}/tmp/d1816-d268-source48-51-native/result.json`),
  captionCounter: bind('.claude/skills/ld-s10y-lesson/tools/layout.py'),
  focusedTests: bind('.claude/skills/ld-s10y-lesson/tests/test_adjacent_caption_rows.py'),
  authorReport: bind(`${ticket}/tmp/d1816-d268-source48-51-author/report.json`),
  instructions: 'Read after saving independent source observations. Compare actual candidate rows/blocks to original pixels. Reuse passed native receipts; do not run producers or alter candidates. Next-page metadata is boundary context only, not approval for that page.',
});
const inputFreeze = save(`${output}/input-freeze.json`, {
  batch: 'D269', ticket: 'STEMROBIN-181', book: '10p', sourceOnly, afterInventory,
  imageLimitPerBatch: 8, imageLimitPerContext: 24,
  sourceApproval: false, rawCandidateApproval: false, completeCoursesAdded: 0,
  paidCalls: 0, databaseWrites: false, formalHandoff: false,
});
console.log(JSON.stringify({ inputFreeze, parentImageOpens: 0, nativeReplays: 0 }));
