import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const R = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const T = path.join(R, '.intentfold/tickets/STEMROBIN-181');
const O = path.join(T, 'tmp/d861-source234-two-spaces-crop-affected-review');
const A = path.join(T, 'tmp/d834-source234-first-author');
const F = path.join(T, 'tmp/d841-source234-first-independent-review');
const C = path.join(T, 'tmp/d857-source234-text-crop-repair');
assert.equal(process.cwd(), R);
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const info = p => {
  assert.ok(p.startsWith(`${R}/`));
  const b = fs.readFileSync(p);
  return { path: p, bytes: b.length, sha256: sha(b) };
};
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const write = (name, value) => {
  assert.equal(path.dirname(path.join(O, name)), O);
  fs.writeFileSync(path.join(O, name), JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
};
const tracked = new Map();
function check(expected, group) {
  const actual = info(expected.path);
  const match = actual.sha256 === expected.sha256 &&
    (expected.bytes === undefined || actual.bytes === expected.bytes);
  tracked.set(actual.path, { ...actual, group, expectedSha256: expected.sha256, match });
  assert.ok(match, `Input drift: ${actual.path}`);
  return actual;
}
function track(p, group) {
  const actual = info(p);
  if (!tracked.has(p)) tracked.set(p, { ...actual, group, match: true });
  return actual;
}
const af = read(path.join(A, 'freeze.json'));
const ff = read(path.join(F, 'freeze.json'));
const author = read(path.join(C, 'report.json'));
const changes = read(path.join(C, 'changes.json'));
for (const [root, manifest] of [[A, af], [F, ff]]) {
  track(path.join(root, 'freeze.json'), 'FIRST freeze manifest');
  manifest.files.forEach(x => check(x, 'FIRST retained bytes, no semantic re-review'));
}
for (const item of [...author.inputs, ...author.tools, ...author.outputs, ...author.receipts,
  author.focusedChecks, author.toolBefore]) check(item, 'd857 frozen binding');
for (const name of ['report.json', 'changes.json', 'focused-checks.py'])
  track(path.join(C, name), 'd857 review input');
check(ff.authorFreeze, 'FIRST author freeze binding');
track(path.join(F, 'source-row-inventory.json'), 'retained unaffected SOURCE approval basis');
const preparation = read(path.join(A, 'inputs.json'));
for (const input of preparation) {
  check({ ...input, path: input.source }, 'prepared original binding');
  check({ ...input, path: input.copy }, 'FIRST original binding');
  const copied = input.copy.replace(A, C);
  check({ ...input, path: copied }, 'd857 unchanged source/render/layout/template binding');
}
const oldPage = read(path.join(A, 'root/10p/pages/0234/page.json'));
const page = read(path.join(C, 'root/10p/pages/0234/page.json'));
const oldAudit = read(path.join(A, 'root/10p/pages/0234/audit.json'));
const audit = read(path.join(C, 'root/10p/pages/0234/audit.json'));
const oldMD = fs.readFileSync(path.join(A, 'root/10p/pages/0234/page.md'), 'utf8');
const md = fs.readFileSync(path.join(C, 'root/10p/pages/0234/page.md'), 'utf8');
function splitMD(text) {
  const rows = text.split('\n');
  assert.equal(rows[0], '---');
  const end = rows.indexOf('---', 1);
  assert.ok(end > 1);
  return { meta: JSON.parse(rows.slice(1, end).join('\n')), body: rows.slice(end + 1).join('\n') };
}
const before = splitMD(oldMD);
const after = splitMD(md);
assert.equal(changes.textChanges.length, 2);
let expectedBody = before.body;
for (const [left, right] of changes.textChanges) {
  assert.equal(right, left.slice(0, -1) + ' \n');
  assert.equal(expectedBody.split(left).length - 1, 1);
  expectedBody = expectedBody.replace(left, right);
}
assert.equal(after.body, expectedBody);
const expectedMeta = structuredClone(before.meta);
expectedMeta.figure_crops = changes.cropChange;
assert.deepEqual(after.meta, expectedMeta);
assert.deepEqual(page.meta, after.meta);
const expectedBlocks = structuredClone(oldPage.blocks);
const refs = [[1, 0, 8, '\u5728\u5b9e\u9a8c\u4e2d'], [7, 1, 23, '\u5206\u5e03\u5728']];
const joinSpaces = refs.map(([bi, li, row, rightPrefix]) => {
  const left = oldPage.blocks[bi].lines[li];
  const newLeft = page.blocks[bi].lines[li];
  const right = page.blocks[bi].lines[li + 1];
  assert.ok(left.endsWith('.'));
  assert.equal(newLeft, left + ' ');
  assert.equal(newLeft.charCodeAt(newLeft.length - 1), 32);
  assert.ok(!newLeft.endsWith('  '));
  assert.ok(right.startsWith(rightPrefix));
  expectedBlocks[bi].lines[li] = left + ' ';
  return { ref: `p0234#${bi + 1}`, blockLine: li + 1, printedRow: row,
    before: left, after: newLeft, next: right, addedBytesHex: '20',
    joinedBoundary: newLeft.slice(-14) + right.slice(0, 14), status: 'PASS' };
});
assert.deepEqual(page.blocks, expectedBlocks);
const crop = page.meta.figure_crops['fig-204'];
assert.deepEqual(Object.keys(page.meta.figure_crops), ['fig-204']);
assert.equal(crop.padding_px, 8);
assert.equal(crop.exclude_text_regions.length, 1);
assert.ok(!('exclude_figures' in crop));
const region = crop.exclude_text_regions[0];
assert.equal(region.block, 4);
assert.equal(region.line, 3);
assert.equal(region.text, oldPage.blocks[3].lines[2]);
assert.equal(region.text, page.blocks[3].lines[2]);
assert.deepEqual(region.box, [798, 1417, 80, 16]);
assert.deepEqual(page.meta.source, oldPage.meta.source);
assert.deepEqual(page.meta.render, oldPage.meta.render);
assert.equal(page.meta.printed_lines, 26);
assert.deepEqual(page.meta.figures, oldPage.meta.figures);
const strippedAudit = structuredClone(audit);
for (const fig of strippedAudit.figures) {
  delete fig.crop_padding_px;
  delete fig.crop_excluded_text_regions;
}
assert.deepEqual(strippedAudit, oldAudit);
assert.deepEqual(audit.figures[0].box, [806, 1425, 467, 256]);
assert.deepEqual(audit.figures[0].from, [795, 1425, 490, 255]);
assert.equal(audit.figures[0].components, 9);
assert.deepEqual(audit.figures[0].crop_excluded_text_regions, [region]);
assert.equal(audit.lines_printed, 26);
assert.equal(audit.lines_md, 26);
const native = author.receipts.map(item => {
  const value = read(item.path);
  assert.equal(value.exit, 0);
  assert.equal(value.attempt, 2);
  assert.equal(value.cwd, R);
  for (const name of ['started.json', 'stdout.txt', 'stderr.txt'])
    track(path.join(path.dirname(item.path), name), 'reused native retry2 evidence');
  assert.equal(fs.readFileSync(path.join(path.dirname(item.path), 'stdout.txt'), 'utf8'), value.stdout);
  return { ...info(item.path), exit: value.exit, attempt: value.attempt,
    stdout: value.stdout, disposition: 'PASS_REUSED_NOT_REPLAYED' };
});
assert.ok(native[0].stdout.includes('26'));
assert.ok(native[1].stdout.includes('0.014%'));
const focused = read(author.focusedChecks.path);
assert.equal(focused.status, 'PASS');
assert.equal(focused.calls, 15);
assert.equal(focused.checks.length, 15);
assert.ok(focused.checks.every(x => x.result === 'PASS'));
const require = createRequire(path.join(R, '.claude/skills/ld-s10y-lesson/package.json'));
const { Resvg } = require('@resvg/resvg-js');
const svg = path.join(C, 'work/10p/pages/0234/figures/fig-204.svg');
const raster = path.join(O, 'raw204-repaired-svg-review.png');
assert.ok(!fs.existsSync(raster));
fs.writeFileSync(raster, new Resvg(fs.readFileSync(svg), { background: '#ffffff' })
  .render().asPng(), { flag: 'wx' });
write('inputhashes.json', {
  schema: 'source234-affected-review-inputhashes@1', recordedAt: new Date().toISOString(),
  cwd: R, allExpectedBindingsMatch: true, inputs: [...tracked.values()]
});
write('text-contract-findings.json', {
  schema: 'source234-affected-text-contract-review@1', status: 'PASS',
  joinSpaces, exactlyTwoAddedAsciiBytesInBody: true, allOtherBodyBytesIdentical: true,
  allOtherBlocksAndTextIdentical: true, unaffectedSourceDisposition: 'FIRST_RETAINED_PASS_NO_WHOLE_REVIEW',
  metaDeltaOnly: 'approved fig-204 figure_crops', crop,
  sourceRenderCounterSnappedBoxUnchanged: true, auditDeltaOnly: 'crop padding and text exclusion provenance',
  native, focused: { ...info(author.focusedChecks.path), status: 'PASS_REUSED_NOT_REPLAYED',
    calls: 15, connectedComponentGuard: 'PASS_REUSED' },
  baselineFreezeEntries: { d834: af.files.length, d841: ff.files.length },
  preparationSourceCopyBindings: preparation.length,
  reviewerRaster: info(raster),
  historicalNote: 'source233 pending wording retained as historical frozen note; no source233 re-review'
});
console.log(JSON.stringify({ status: 'PASS', exactlyTwoAsciiJoinSpaces: true,
  inputFilesHashed: tracked.size, retainedFirstAuthorFiles: af.files.length,
  retainedFirstReviewFiles: ff.files.length, reviewerRaster: info(raster) }, null, 2));
