import assert from 'node:assert/strict';
import {
  ticket, bytes, read, bind, verify, immutableWrite,
} from './retain-d016-evidence.mjs';

const base = `${ticket}/tmp/9p-next-source-0156-0159`;
const gate = `${ticket}/tmp/source-review-9p-0156-0159.json`;
const report = await read(gate);
assert.equal(report.status, 'blocked');
assert.equal(report.native_counting_status, 'pass');
await verify(report.author_freeze.path, report.author_freeze.sha256);
const bindings = [];
for (const page of report.pages) {
  await verify(page.draft.path, page.draft.sha256);
  const preserved = `${base}/before-emphasis/${String(page.pdf_page).padStart(4, '0')}.page.md`;
  await immutableWrite(preserved, await bytes(page.draft.path));
  bindings.push({ original: page.draft, preserved: await bind(preserved) });
}
await immutableWrite(`${base}/before-emphasis/preservation.json`, `${JSON.stringify({
  ticket: 'STEMROBIN-181', status: 'preserved-before-affected-emphasis-correction',
  gate: await bind(gate), authorFreeze: await bind(report.author_freeze.path), bindings,
  scope: 'Original frozen four-page drafts unchanged here; only158#9 and159#1 will be edited. No pixel/count/gate rerun.',
}, null, 2)}\n`);
