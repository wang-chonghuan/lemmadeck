import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const W = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), W);
const root = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d064-source308309-review';
const authorPath = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d063-source308309-author/author-freeze.json';
const beforeRoot = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d063-source309-before';
const read = p => fs.readFileSync(p);
const json = p => JSON.parse(read(p));
const hash = p => crypto.createHash('sha256').update(read(p)).digest('hex');
const bind = p => ({ path: path.resolve(W, p), sha256: hash(p), bytes: read(p).length });
const write = (name, value) => {
  const destination = path.resolve(W, root, name);
  assert(destination.startsWith(path.resolve(W, root) + path.sep));
  fs.writeFileSync(destination, JSON.stringify(value, null, 2) + '\n');
};
const author = json(authorPath);
const report = json(`${root}/report.json`);
const ledger = json(`${root}/image-ledger.json`);
assert.equal(hash(authorPath), report.authorFreeze.sha256);

const bindings = [];
function checkBindings(value) {
  if (!value || typeof value !== 'object') return;
  if (value.path && value.sha256) {
    const actual = bind(value.path);
    assert.equal(actual.sha256, value.sha256, value.path);
    bindings.push({ ...actual, expectedSha256: value.sha256, status: 'pass' });
  }
  for (const child of Object.values(value)) checkBindings(child);
}
checkBindings(author);
assert.equal(bindings.length, 31);

const before = json(`${beforeRoot}/page.json`);
const after = json(author.records[1].pageJson.path);
const beforeAudit = json(`${beforeRoot}/audit.json`);
const afterAudit = json(author.records[1].audit.path);
assert.equal(JSON.stringify(before.blocks), JSON.stringify(after.blocks));
assert.equal(JSON.stringify(beforeAudit.figures), JSON.stringify(afterAudit.figures));
const beforeMd = read(`${beforeRoot}/page.md`).toString();
const afterMd = read(author.records[1].pageMd.path).toString();
assert.equal(beforeMd.slice(beforeMd.indexOf('<!--')), afterMd.slice(afterMd.indexOf('<!--')));
const metaWithoutCounting = structuredClone(after.meta);
delete metaWithoutCounting.counting;
assert.deepEqual(before.meta, metaWithoutCounting);
assert.equal(after.meta.counting.edge_margin_px, 80);
assert.deepEqual(
  Object.keys(afterAudit).filter(k => JSON.stringify(afterAudit[k]) !== JSON.stringify(beforeAudit[k])),
  ['lines_printed', 'errors']
);

const diagnosis = json(author.countingRepair.diagnosis.path);
const counts = diagnosis.nativeCountingOnly;
const baselineBands = counts.find(c => c.edge === 15).bands;
assert.equal(baselineBands.length, 20);
assert.deepEqual(baselineBands.at(-1), [2151, 2173]);
for (const edge of [80, 100, 120]) {
  assert.deepEqual(counts.find(c => c.edge === edge).bands, baselineBands.slice(0, -1));
}
assert.equal(json(author.countingRepair.firstFailure.path).exitCode, 1);
assert.equal(json(author.countingRepair.successfulAffectedCall.path).exitCode, 0);

const pageProofs = author.records.map((record, index) => {
  const page = json(record.pageJson.path);
  const mdLines = read(record.pageMd.path).toString().split('\n');
  const rows = page.blocks.reduce((sum, block) => sum + block.lines.length, 0);
  assert.equal(rows, index === 0 ? 27 : 19);
  const periodLocations = page.blocks.flatMap((block, i) =>
    block.lines.flatMap((line, j) => Array.from(line).flatMap((character, k) =>
      character === '\u3002' ? [{
        block: i + 1,
        blockLine: j + 1,
        character: k + 1,
        pageMdLine: mdLines.indexOf(line) + 1,
        text: line,
        expected: 'U+002E',
        actual: 'U+3002'
      }] : []
    ))
  );
  assert.equal(periodLocations.length, index === 0 ? 16 : 11);
  assert.equal(page.blocks.filter(block => block.kind === 'p').length, index === 0 ? 6 : 4);
  assert.equal(page.blocks.some(block => ['ex', 'exhead', 'h1', 'h2', 'h3'].includes(block.kind)), false);
  const files = ['pageMd', 'pageJson', 'audit', 'sourceImage', 'sourceGrid', 'rawPng', 'rawSvg', 'svgPreview'];
  const boundFiles = Object.fromEntries(files.map(key => [key, bind(record[key].path)]));
  report.records[index].boundFiles = boundFiles;
  report.records[index].SOURCE.bodyFidelity.periodLocations = periodLocations;
  return { page: record.page, rows, periodLocations, boundFiles };
});
assert.equal(after.blocks[0].cont, true);
assert.equal(after.blocks[5].open, true);
const page308 = json(author.records[0].pageJson.path);
assert.equal(page308.blocks[0].cont, false);
assert.equal(page308.blocks[5].open, true);
assert(page308.blocks[5].lines.at(-1).endsWith('感生电'));
assert(after.blocks[0].lines[0].startsWith('流，'));
assert(after.blocks[5].lines.at(-1).endsWith('使矢量$\\vec{B}$的磁通量'));
const body309 = after.blocks.flatMap(block => block.lines).join('\n');
assert(body309.includes('图285\u0430'));
assert(body309.includes('图285\u0431'));
assert.equal(body309.match(/\\vec\{B\}'/g).length, 3);
assert.equal(body309.match(/\\vec\{B\}(?!')/g).length, 2);
const profilePath = '.claude/skills/ld-s10y-lesson/profiles/soviet-cn.json';
assert.equal(json(profilePath).sentence_period, '.');

for (const item of ledger.images) {
  const buffer = read(item.path);
  assert.equal(buffer.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  assert.deepEqual([buffer.readUInt32BE(16), buffer.readUInt32BE(20)], item.dimensions);
  item.sha256 = hash(item.path);
  item.path = path.resolve(W, item.path);
}
assert.equal(ledger.images.length, 6);
assert.equal(ledger.actualImageOpens, 6);
assert.equal(ledger.reopens, 0);
assert(ledger.conservativeContextImageTotal <= 24);
report.authority.boundFiles = [
  bind(report.authority.live181),
  bind(report.authority.latest179)
];
const comments = json(report.authority.latest179).results;
assert.equal(
  [...comments].sort((a, b) => b.created_at.localeCompare(a.created_at))[0].id,
  report.authority.latestCommentId
);
report.countingRepairQualification.boundEvidence = [
  bind(author.countingRepair.firstFailure.path),
  bind(author.countingRepair.diagnosis.path),
  bind(author.countingRepair.successfulAffectedCall.path),
  ...author.countingRepair.before.map(item => bind(item.path))
];
report.profile = bind(profilePath);
report.authorFreezeBindingCount = bindings.length;
report.authorFreezeBindingsAllMatch = true;
report.createdAt = new Date().toISOString();
write('image-ledger.json', ledger);
write('binding-proof.json', {
  schema: 'STEMROBIN-181/review-binding-proof@1',
  workdir: W,
  authorFreeze: bind(authorPath),
  bindings,
  pages: pageProofs,
  checks: {
    allAuthorBindingsMatch: true,
    beforeAfterBodyBytesEqual: true,
    beforeAfterBlocksByteEquivalent: true,
    beforeAfterFigureAuditByteEquivalent: true,
    onlyCountingMetadataAdded: true,
    legitimateBandsPreserved: true,
    pngDimensionsMatch: true,
    nativeProducersRerun: false
  }
});
write('report.json', report);
write('review-freeze.json', {
  schema: 'STEMROBIN-181/independent-review-freeze@1',
  ticket: 'STEMROBIN-181',
  batch: 'D064',
  status: 'fail',
  reviewerIsAuthor: false,
  authorFreeze: bind(authorPath),
  report: bind(`${root}/report.json`),
  imageLedger: bind(`${root}/image-ledger.json`),
  bindingProof: bind(`${root}/binding-proof.json`),
  selfGrill: bind(`${root}/grill.json`),
  mechanicalVerifier: bind(`${root}/verify-freeze.mjs`),
  actualImageOpens: 6,
  sourcePagesApprovedHere: 0,
  rawGates: { 'fig-284': 'pass', 'fig-285': 'pass' },
  svgGates: { 'fig-284': 'pass', 'fig-285': 'pass' },
  parentConsumption: 'pending',
  whole125Approved: false,
  modernFiguresApproved: false,
  formalHandoff: false,
  createdAt: new Date().toISOString()
});
console.log(JSON.stringify({
  status: report.status,
  report: bind(`${root}/report.json`),
  reviewFreeze: bind(`${root}/review-freeze.json`),
  imageLedger: bind(`${root}/image-ledger.json`),
  actualImages: ledger.images.map(item => ({ path: item.path, sha256: item.sha256 }))
}, null, 2));
