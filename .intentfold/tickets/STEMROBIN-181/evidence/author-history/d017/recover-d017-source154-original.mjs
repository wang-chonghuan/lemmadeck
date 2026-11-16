import assert from 'node:assert/strict';
import {
  ticket, read, bytes, hash, bind, verify, immutableWrite,
} from './retain-d016-evidence.mjs';

const work = `${ticket}/tmp`;
const correctionPath = `${work}/source-review-9p-0152-0155-correction.json`;
const correction = await read(correctionPath);
assert.equal(correction.status, 'pass');
const currentPath = correction.pages.find(page => page.pdf_page === 154).draft.path;
const currentBytes = await bytes(currentPath);
await verify(currentPath, correction.correction.current_draft_sha256);
const text = currentBytes.toString('utf8');
assert.ok(text.startsWith('---\n'));
const split = text.indexOf('\n---\n', 4);
assert.ok(split > 0);
const metadata = JSON.parse(text.slice(4, split));
assert.equal(metadata.notes.at(-1), correction.correction.appended_note);
metadata.notes.pop();
const body = text.slice(split + 5);
assert.equal(body.split(correction.correction.after).length, 2);
const original = Buffer.from(`---\n${JSON.stringify(metadata, null, 2)}\n---\n${
  body.replace(correction.correction.after, correction.correction.before)}`);
assert.equal(hash(original), correction.correction.baseline_draft_sha256,
  'Recovery must reproduce exact frozen bytes, never a similar reconstructed draft');
const destination = `${work}/d017-source154-original-recovery/0154.page.md`;
await immutableWrite(destination, original);
await immutableWrite(`${work}/d017-source154-original-recovery.json`, `${JSON.stringify({
  ticket: 'STEMROBIN-181', status: 'exact-original-source154-bytes-recovered',
  originalPath: currentPath, recovered: await bind(destination),
  current: await bind(currentPath), affectedCorrection: await bind(correctionPath),
  method: 'Reverse only the documented appended note and two bold delimiters in memory; frozen initial SHA must match before writing.',
  attribution: 'Later archival byte recovery, not an original saved author snapshot or a new source approval.',
  sourcePixelsCountingMathAndCurrentDraftUnchanged: true, gatesRepeated: false,
}, null, 2)}\n`);
assert.deepEqual(await bytes(currentPath), currentBytes);
console.log('Original154 draft bytes recovered exactly for archival binding; no gate repeated.');
