import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  ticket, read, bytes, bind, verify, exists, immutableWrite, hash,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const folder = `${ticket}/tmp/d030-source280-282-count-correction`;
const initialPath = `${ticket}/tmp/d030-source280-283-source-review.json`;
await verify(initialPath, 'ebd9804e183f2813bacd395c8001e9f03b7e0db695903e04bc7a220068624be6');
const initial = await read(initialPath);
assert.deepEqual(initial.pages.filter(page => !page.sourceApproval).map(page => page.physicalPage), [280, 282]);
assert.ok(!await exists(`${folder}/started.json`));
const oldCountPath = `${ticket}/tmp/d030-source280-283-author/initial/counts.json`;
await verify(oldCountPath, 'dad830c67c15b7a77405590d455f749c14768e81c41ff1a6a46eb2ea07622a4a');
const oldCounts = (await read(oldCountPath)).pages;
const selections = [];
for (const number of [280, 282]) {
  const row = initial.pages.find(page => page.physicalPage === number);
  const proposal = row.countingReview.lawfulPageSpecificProposal;
  const counting = proposal.counting;
  assert.equal(counting.edge_margin_px, number === 280 ? 80 : 88);
  for (const key of ['excludedPrintedWords', 'excludedFigures', 'excludedCaptions', 'excludedFootOrFootnote'])
    assert.equal(proposal[key], false);
  await verify(row.candidate.path, row.candidate.sha256);
  await verify(row.sourceImageBinding.path, row.sourceImageBinding.sha256);
  const oldBytes = await bytes(row.candidate.path);
  const match = oldBytes.toString('utf8').match(/^---\n([\s\S]*?)\n---\n/);
  assert.ok(match);
  const meta = JSON.parse(match[1]);
  assert.equal(meta.counting, undefined);
  const body = oldBytes.subarray(Buffer.byteLength(match[0]));
  meta.counting = counting;
  const candidate = `${folder}/${String(number).padStart(4, '0')}.page.md`;
  await immutableWrite(`${folder}/before/${String(number).padStart(4, '0')}.page.md`, oldBytes);
  await immutableWrite(candidate, Buffer.concat([
    Buffer.from(`---\n${JSON.stringify(meta, null, 2)}\n---\n`), body,
  ]));
  selections.push({
    page: number, original: row.candidate, candidate: await bind(candidate),
    source: row.sourceImageBinding, bodySha256BeforeAndAfter: hash(body),
    counting, extraBand: row.countingReview.extraNativeBandYInclusive,
    expectedRows: row.independentVisualRowInventory.total,
  });
}
await immutableWrite(`${folder}/started.json`, `${JSON.stringify({
  selections, independentSOURCE: await bind(initialPath), oldCount: await bind(oldCountPath),
  correctiveNativeInvocationsPerPage: 1, sourceOrBodyChanges: false,
}, null, 2)}\n`);
const payload = { pages: selections.map(row => ({
  page: row.page, candidate: row.candidate.path, source: row.source.path,
})) };
await immutableWrite(`${folder}/stdin.json`, `${JSON.stringify(payload, null, 2)}\n`);
const command = ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
  `${ticket}/tmp/d025-source240-count.py`];
const native = spawnSync(command[0], command.slice(1), {
  encoding: 'utf8', timeout: 30000, input: `${JSON.stringify(payload)}\n`,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
});
await immutableWrite(`${folder}/count.command.json`, `${JSON.stringify({
  command, exitCode: native.status, signal: native.signal,
  stdin: await bind(`${folder}/stdin.json`), stdout: native.stdout, stderr: native.stderr,
}, null, 2)}\n`);
assert.equal(native.status, 0, native.stderr);
await immutableWrite(`${folder}/count.stdout.json`, native.stdout);
const counts = JSON.parse(native.stdout).pages;
const pages = [];
for (const row of initial.pages) {
  const selection = selections.find(item => item.page === row.physicalPage);
  if (!selection) {
    pages.push(row);
    continue;
  }
  const current = counts.find(item => item.pdf_page === row.physicalPage);
  const original = oldCounts.find(item => item.pdf_page === row.physicalPage);
  assert.equal(current.candidate_rows, selection.expectedRows);
  const expectedBands = original.native_masked_bands.filter(band =>
    JSON.stringify(band) !== JSON.stringify(selection.extraBand));
  const retainedBandsUnchanged = JSON.stringify(expectedBands) === JSON.stringify(current.native_masked_bands);
  const pass = current.native_count_matches_candidate && retainedBandsUnchanged;
  pages.push({
    ...row, status: pass ? 'PASS' : 'FAIL', sourceApproval: pass,
    candidate: selection.candidate,
    affectedNative: {
      candidateRows: current.candidate_rows, nativeRows: current.native_masked_rows,
      receipt: await bind(`${folder}/count.stdout.json`), retainedBandsUnchanged,
      onlyApprovedOriginalBandRemoved: pass, furtherRecountsAllowed: false,
    },
    affectedDecision: 'Existing independent full-page pixel judgment reused for unchanged body; only actual new native rows and exact retained bands inspected. No image reopened.',
    corrections: pass ? [] : row.corrections,
  });
}
const effectiveFailPages = pages.filter(page => !page.sourceApproval).map(page => page.physicalPage);
const affectedPath = `${ticket}/tmp/d030-source280-283-affected-review.json`;
await immutableWrite(affectedPath, `${JSON.stringify({
  schema: 'ld-s10y-lesson/affected-counting-only-source-review@1',
  ticket: 'STEMROBIN-181', book: '9p', status: effectiveFailPages.length ? 'FAIL' : 'PASS',
  pages, effectivePassPages: pages.filter(page => page.sourceApproval).map(page => page.physicalPage),
  effectiveFailPages, initialReview: await bind(initialPath), selections,
  native: await bind(`${folder}/count.stdout.json`), sourcePixelsChanged: false,
  bodyBytesChanged: false, imageOpens: 0, originalFailuresPreserved: true,
  limits: 'Only approved counting margins and actual new native band result inspected. Text/figures/typography/boundaries inherit independentSOURCE. No new SOURCE image, exact crop, scientific, modern, assembly or delivery approval; no additional retries.',
}, null, 2)}\n`);
await immutableWrite(`${folder}/result.json`, `${JSON.stringify({
  affectedSOURCE: await bind(affectedPath), effectiveFailPages,
  status: effectiveFailPages.length ? 'fail-retained' : 'pass-affected-native-count',
  count: await bind(`${folder}/count.stdout.json`),
  correctiveInvocationCount: 1, correctiveNativeCallsPerPage: 1,
}, null, 2)}\n`);
console.log(JSON.stringify({ result: await bind(`${folder}/result.json`),
  pages: pages.map(row => ({ page: row.physicalPage, status: row.status,
    native: row.affectedNative?.nativeRows })) }));
