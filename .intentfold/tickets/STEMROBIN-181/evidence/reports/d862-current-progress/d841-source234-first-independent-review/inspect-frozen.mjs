import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';

const R = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const O = path.join(R, '.intentfold/tickets/STEMROBIN-181/tmp/d841-source234-first-independent-review');
const A = path.join(R, '.intentfold/tickets/STEMROBIN-181/tmp/d834-source234-first-author');
if (process.cwd() !== R) throw new Error('Explicit authorized cwd required');
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const fileInfo = p => {
  const bytes = fs.readFileSync(p);
  return { path: p, bytes: bytes.length, sha256: sha(bytes) };
};
const freeze = JSON.parse(fs.readFileSync(path.join(A, 'freeze.json'), 'utf8'));
const checks = freeze.files.map(expected => {
  if (!expected.path.startsWith(`${A}/`)) throw new Error('Unexpected author input path');
  const actual = fileInfo(expected.path);
  return { ...actual, expectedSha256: expected.sha256, expectedBytes: expected.bytes,
    match: actual.sha256 === expected.sha256 && actual.bytes === expected.bytes };
});
if (checks.some(x => !x.match)) throw new Error('Frozen author input has changed');
const inputs = JSON.parse(fs.readFileSync(path.join(A, 'inputs.json'), 'utf8'));
const inputChecks = inputs.map(expected => {
  const source = fileInfo(expected.source);
  const copy = fileInfo(expected.copy);
  return { source, copy, expectedSha256: expected.sha256,
    match: source.sha256 === expected.sha256 && copy.sha256 === expected.sha256 };
});
if (inputChecks.some(x => !x.match)) throw new Error('Prepared source/copy mismatch');
const require = createRequire(path.join(R, '.claude/skills/ld-s10y-lesson/package.json'));
const { Resvg } = require('@resvg/resvg-js');
const svg = path.join(A, 'work/10p/pages/0234/figures/fig-204.svg');
const raster = path.join(O, 'raw204-frozen-svg-review.png');
const result = new Resvg(fs.readFileSync(svg), { background: '#ffffff' }).render();
fs.writeFileSync(raster, result.asPng(), { flag: 'wx' });
const page = JSON.parse(fs.readFileSync(path.join(A, 'root/10p/pages/0234/page.json'), 'utf8'));
let sourceRow = 1;
const rows = [];
const missingJoinSpaces = [];
page.blocks.forEach((block, bi) => {
  if (block.kind === 'fig') return;
  if (block.samerow) {
    rows.push({ blockRef: `p0234#${bi + 1}`, kind: block.kind, sharesSourceRow: sourceRow - 1,
      lines: block.lines });
    return;
  }
  block.lines.forEach((line, li) => {
    rows.push({ blockRef: `p0234#${bi + 1}`, blockLine: li + 1, kind: block.kind,
      sourceRow: sourceRow++, text: line, endsWithAsciiSpace: line.endsWith(' ') });
    if (li + 1 < block.lines.length && line.endsWith('.')) {
      missingJoinSpaces.push({
        blockRef: `p0234#${bi + 1}`, blockLine: li + 1, sourceRow: sourceRow - 1,
        left: line, right: block.lines[li + 1],
        literalJoinedBoundary: `${line.slice(-12)}${block.lines[li + 1].slice(0, 12)}`,
        necessaryEdit: 'Append exactly one ASCII space to the left printed line; do not add a source row.'
      });
    }
  });
});
const inventoryPath = path.join(O, 'source-first-inventory.md');
const report = {
  schema: 'source234-independent-frozen-inspection@1',
  recordedAt: new Date().toISOString(), cwd: process.cwd(),
  operation: 'Hash checks and rasterization of frozen SVG for reviewer evidence only; no producer invocation',
  originalInventory: { ...fileInfo(inventoryPath),
    createdAt: fs.statSync(inventoryPath).birthtime.toISOString() },
  manifests: [fileInfo(path.join(A, 'inputs.json')), fileInfo(path.join(A, 'freeze.json'))],
  allAuthorFreezeEntriesMatch: checks.every(x => x.match), checks, inputChecks,
  svgInput: fileInfo(svg), reviewerRaster: fileInfo(raster),
  rows, countedRows: sourceRow - 1, missingJoinSpaces
};
fs.writeFileSync(path.join(O, 'frozen-inspection.json'), JSON.stringify(report, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({
  allAuthorFreezeEntriesMatch: report.allAuthorFreezeEntriesMatch,
  authorFilesChecked: checks.length, sourceInputsChecked: inputChecks.length,
  countedRows: report.countedRows, missingJoinSpaces,
  raster: report.reviewerRaster
}, null, 2));
