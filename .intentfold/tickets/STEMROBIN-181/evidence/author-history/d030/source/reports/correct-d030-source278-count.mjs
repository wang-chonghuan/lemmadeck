import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  ticket, read, bytes, bind, verify, exists, immutableWrite, hash,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const folder = `${ticket}/tmp/d030-source278-count-correction`;
const initialPath = `${ticket}/tmp/d030-source276-279-source-review.json`;
const initial = await read(initialPath);
assert.deepEqual(initial.effectiveFailPages, [278]);
const row = initial.pages.find(page => page.pdfPage === 278);
const source = row.source;
const change = row.requiredCountingChange;
assert.equal(change.edge_margin_px, 110);
await verify(row.candidate.path, row.candidate.sha256);
await verify(source.path, source.sha256);
assert.ok(!await exists(`${folder}/result.json`));
const oldBytes = await bytes(row.candidate.path);
const old = oldBytes.toString('utf8');
const match = old.match(/^---\n([\s\S]*?)\n---\n/);
assert.ok(match);
const meta = JSON.parse(match[1]);
assert.equal(meta.counting, undefined);
const body = oldBytes.subarray(Buffer.byteLength(match[0]));
meta.counting = {
  edge_margin_px: change.edge_margin_px, reason: change.reason,
};
const currentPath = `${folder}/0278.page.md`;
await immutableWrite(`${folder}/before/0278.page.md`, oldBytes);
await immutableWrite(currentPath, Buffer.concat([
  Buffer.from(`---\n${JSON.stringify(meta, null, 2)}\n---\n`), body,
]));
const payload = { pages: [{ page: 278, candidate: currentPath, source: source.path }] };
await immutableWrite(`${folder}/stdin.json`, `${JSON.stringify(payload, null, 2)}\n`);
const args = ['-B', `${ticket}/tmp/d025-source240-count.py`];
const result = spawnSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', args, {
  encoding: 'utf8', timeout: 30000, input: `${JSON.stringify(payload)}\n`,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
});
await immutableWrite(`${folder}/count.command.json`, `${JSON.stringify({
  command: ['.claude/skills/ld-s10y-lesson/.venv/bin/python', ...args],
  exitCode: result.status, signal: result.signal,
  stdin: await bind(`${folder}/stdin.json`), stdout: result.stdout, stderr: result.stderr,
}, null, 2)}\n`);
assert.equal(result.status, 0, result.stderr);
await immutableWrite(`${folder}/count.stdout.json`, result.stdout);
const count = JSON.parse(result.stdout).pages[0];
assert.equal(count.candidate_rows, 25);
const originalCount = JSON.parse((await bytes(
  `${ticket}/tmp/d030-source276-279-author/native/count.stdout.txt`,
)).toString('utf8')).pages.find(page => page.pdf_page === 278);
const bandsEqual = JSON.stringify(count.native_masked_bands)
  === JSON.stringify(originalCount.native_masked_bands.filter(
    band => JSON.stringify(band) !== JSON.stringify([2160, 2184]),
  ));
const pass = count.native_count_matches_candidate && bandsEqual;
await immutableWrite(`${folder}/author-freeze.json`, `${JSON.stringify({
  ticket: 'STEMROBIN-181', page: 278, status: 'counting-only-correction-not-new-pixel-review',
  initialSOURCE: await bind(initialPath), original: row.candidate,
  corrected: await bind(currentPath), source,
  bodySha256BeforeAndAfter: hash(body),
  onlyChangedKeys: ['counting.edge_margin_px', 'counting.reason'],
  nativeCount: await bind(`${folder}/count.stdout.json`),
  nativeRows: count.native_masked_rows, candidateRows: 25,
  retainedBandsUnchanged: bandsEqual, oldFAILPreserved: true,
}, null, 2)}\n`);
const newPages = initial.pages.map(page => page.pdfPage === 278 ? {
  ...page, status: pass ? 'PASS' : 'FAIL', sourceApproval: pass,
  candidate: page.candidate,
} : page);
const changed = newPages.find(page => page.pdfPage === 278);
changed.candidate = await bind(currentPath);
changed.nativeRows = count.native_masked_rows;
changed.nativeReceipt = await bind(`${folder}/count.stdout.json`);
changed.necessaryCorrections = pass ? [] : ['R278-EDGE-COUNT'];
changed.affectedDecision = 'Existing independent full-page/bottom-crop pixel judgment '
  + 'is reused for the unchanged body. Native receipt is newly observed; every '
  + 'retained band is compared exactly. No SOURCE text or figure re-review.';
const affectedPath = `${ticket}/tmp/d030-source276-279-affected-review.json`;
await immutableWrite(affectedPath, `${JSON.stringify({
  schema: 'ld-s10y-source-review@1', ticket: 'STEMROBIN-181', book: '9p',
  status: pass ? 'SOURCE-PASS' : 'SOURCE-FAIL-278-count-only',
  reviewKind: 'affected-counting-only-with-initial-pixel-evidence-reused',
  independentOriginalSOURCE: await bind(initialPath),
  correction: await bind(`${folder}/author-freeze.json`),
  pages: newPages,
  effectivePassPages: newPages.filter(page => page.status === 'PASS').map(page => page.pdfPage),
  effectiveFailPages: newPages.filter(page => page.status !== 'PASS').map(page => page.pdfPage),
  imageOpens: 0, bodyBytesChanged: false, sourcePixelsChanged: false,
  retainedBandsUnchanged: bandsEqual,
  limits: 'Only the approved counting override and its actual native band result '
    + 'are newly inspected. Original independent visual evidence and all limitations '
    + 'remain unchanged. No crop, modern science, assembly or completion approval.',
}, null, 2)}\n`);
await immutableWrite(`${folder}/result.json`, `${JSON.stringify({
  ticket: 'STEMROBIN-181', status: pass ? 'pass-affected-native-count' : 'fail-retained',
  affectedSOURCE: await bind(affectedPath), count: await bind(`${folder}/count.stdout.json`),
  correctiveInvocationCount: 1, nativeRows: count.native_masked_rows,
  candidateRows: 25, allOtherOriginalBandsEqual: bandsEqual,
}, null, 2)}\n`);
console.log(JSON.stringify({ result: await bind(`${folder}/result.json`),
  status: pass ? 'PASS' : 'FAIL', rows: count.native_masked_rows }));
