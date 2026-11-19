import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const R = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const O = path.join(R, '.intentfold/tickets/STEMROBIN-181/tmp/d841-source234-first-independent-review');
const A = path.join(R, '.intentfold/tickets/STEMROBIN-181/tmp/d834-source234-first-author');
if (process.cwd() !== R || fs.realpathSync(O) !== O) throw new Error('Authorized root/cwd required');
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const info = p => {
  const stat = fs.lstatSync(p);
  if (!stat.isFile() || stat.isSymbolicLink()) throw new Error(`Not a plain file: ${p}`);
  const bytes = fs.readFileSync(p);
  return { path: p, bytes: bytes.length, sha256: sha(bytes) };
};
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const authorFreeze = read(path.join(A, 'freeze.json'));
const authorChecks = authorFreeze.files.map(expected => {
  if (!expected.path.startsWith(`${A}/`)) throw new Error('Author input escaped root');
  const actual = info(expected.path);
  if (actual.sha256 !== expected.sha256 || actual.bytes !== expected.bytes) {
    throw new Error(`Author freeze changed: ${expected.path}`);
  }
  return { ...actual, matchesAuthorFreeze: true };
});
const priorInspection = read(path.join(O, 'frozen-inspection.json'));
if (info(path.join(O, 'source-first-inventory.md')).sha256 !== priorInspection.originalInventory.sha256) {
  throw new Error('Original source-first observation was altered');
}
const initialFailure = read(path.join(O, 'measurement-first-failure.json'));
if (info(path.join(O, 'measure-recommendation.first.py')).sha256 !== initialFailure.originalScriptSha256) {
  throw new Error('Original failed reviewer script was altered');
}
const sourceRows = read(path.join(O, 'source-row-inventory.json'));
const page = read(path.join(A, 'root/10p/pages/0234/page.json'));
if (sourceRows.rows.length !== 26) throw new Error('Final source inventory must contain exactly 26 rows');
for (const row of sourceRows.rows) {
  const blockNumber = Number(row.ref.split('#')[1]);
  if (page.blocks[blockNumber - 1].lines[row.blockLine - 1] !== row.text) {
    throw new Error(`Unexpected transcription difference at ${row.ref} line ${row.blockLine}`);
  }
}
if (sourceRows.rows.filter(row => row.requiredJoinSpaceAfterRow).map(row => row.row).join(',') !== '8,23') {
  throw new Error('Necessary join repair set drifted');
}
const measurement = read(path.join(O, 'recommendation-measurement.json'));
if (measurement.proposedExclusionFigureInkOverlapPx !== 0 ||
    measurement.proposedExclusionProseInkRemovedPx !== 547 ||
    measurement.topCropAt1433WouldLoseFigureInkPx !== 22) {
  throw new Error('Crop recommendation measurement drifted');
}
const source233ReceiptPath = path.join(R,
  '.intentfold/tickets/STEMROBIN-181/evidence/reports/d836-source233-consumed/consumed.json');
const source233Receipt = read(source233ReceiptPath);
const source233JsonRelative = 'ssot-resources/soviet10year-textbooks/artifacts/10p/pages/0233/page.json';
const source233Json = info(path.join(R, source233JsonRelative));
if (source233Json.sha256 !== source233Receipt.outputs.find(x => x.path === source233JsonRelative).sha256) {
  throw new Error('Approved source233 text binding changed');
}
const source233FailurePath = path.join(R,
  '.intentfold/tickets/STEMROBIN-181/evidence/reports/d836-source233-consumed/FIRST/verification-failed.json');
if (info(source233FailurePath).sha256 !== source233Receipt.firstVerifierFailure.sha256) {
  throw new Error('Historical source233 failure binding changed');
}
const review = read(path.join(O, 'review.json'));
if (review.status !== 'SOURCE-HOLD_RAW-FAIL_NATIVE-FIRST-PASS') throw new Error('Unexpected review decision');
const files = fs.readdirSync(O).sort().map(name => info(path.join(O, name)));
const manifest = {
  schema: 'source234-independent-review-freeze@1',
  frozenAt: new Date().toISOString(),
  cwd: process.cwd(), root: O,
  status: 'FROZEN_SOURCE-HOLD_RAW-FAIL_NATIVE-FIRST-PASS',
  files, authorFreeze: info(path.join(A, 'freeze.json')), authorChecks,
  authorInputs: info(path.join(A, 'inputs.json')),
  retainedSource233TextContext: [info(source233ReceiptPath), source233Json, info(source233FailurePath)],
  sourceFirstObservationAndOriginalFailedScriptRetained: true,
  candidateEdits: 0, producerReruns: 0, priorPageImages: 0, contextImageLoads: 5,
  newApproval: false, paidCalls: 0,
  scopeDeviation: review.usageAndScope.scopeDeviation,
  stop: 'Frozen outputs; no required or authorized action follows'
};
const target = path.join(O, 'freeze.json');
fs.writeFileSync(target, JSON.stringify(manifest, null, 2) + '\n', { flag: 'wx' });
const frozenManifest = info(target);
for (const name of fs.readdirSync(O)) fs.chmodSync(path.join(O, name), 0o444);
fs.chmodSync(O, 0o555);
console.log(JSON.stringify({
  status: manifest.status,
  report: path.join(O, 'review.md'),
  sourceRowInventory: path.join(O, 'source-row-inventory.json'),
  freeze: frozenManifest,
  ownFilesFrozen: files.length + 1,
  authorFilesVerifiedUnchanged: authorChecks.length,
  imagesLoaded: 5, priorPageImages: 0, producerReruns: 0,
  permissions: 'files 0444, directory 0555',
  scopeDeviation: manifest.scopeDeviation,
  stopped: true
}, null, 2));
