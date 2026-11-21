import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/evidence/reports/d1816-d523-finite-references`;
const read = file => JSON.parse(fs.readFileSync(file));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({ path: file, bytes: fs.statSync(file).size, sha256: hash(file) });
const previous = read(`${T}/evidence/reports/d1816-d520-indexed-provenance/affected-check.json`);
const plan = read(`${T}/evidence/reports/d1816-d520-indexed-provenance/plan.json`);
assert.equal(previous.remainingAffectedReferences.length, 20);
assert(!fs.existsSync(O));
fs.mkdirSync(O, { recursive: true });
const rows = previous.remainingAffectedReferences.map(row => {
  const identity = row.pointer.endsWith('.originalPath');
  const recorded = plan.unresolved.find(item => item.file === row.file && item.oldPath === row.path);
  if (identity) {
    const key = row.pointer.split('.')[1];
    const value = read(row.file)[key];
    assert.equal(value.originalPath, row.path);
    return { ...row, classification: 'HISTORICAL_IDENTITY_NOT_ASSET_BINDING',
      originalRecord: value, reason: 'Preserve originalPath as historical identity; do not rewrite it as a current asset pointer.' };
  }
  assert(recorded, row.pointer);
  const value = recorded.pointer.slice(0, -1).reduce((v, key) => v[key], read(row.file));
  assert.equal(value.path, row.path);
  assert.equal(value.sha256, recorded.expectedSha256);
  const candidates = [...new Set([row.path, ...recorded.indexedCandidates.flatMap(c => [c.path, c.originalPath])])];
  const observations = candidates.map(file => ({ path: file, exists: fs.existsSync(file),
    ...(fs.existsSync(file) ? { sha256: hash(file), exactSha: hash(file) === value.sha256 } : {}) }));
  assert(!observations.some(candidate => candidate.exactSha), 'New exact bytes found; repair rather than mark missing.');
  return { ...row, expectedSha256: value.sha256, candidates: observations,
    classification: 'MISSING_RECORDED_BYTES_LOCAL_HOLD',
    reason: 'None of the finite recorded candidates exists at the expected SHA. Preserve approval and failed history; do not synthesize past evidence.' };
});
assert.equal(rows.filter(row => row.classification.startsWith('MISSING')).length, 18);
assert.equal(rows.filter(row => row.classification.startsWith('HISTORICAL')).length, 2);
fs.writeFileSync(`${O}/remaining-references.json`, JSON.stringify({
  stage: 'D523', input: bind(`${T}/evidence/reports/d1816-d520-indexed-provenance/affected-check.json`),
  scope: 'Exactly D521 remaining 20 references; finite recorded candidates only.',
  records: rows, assetBindingsMissing: 18, historicalIdentityStrings: 2,
  actualPathRepairs: 0, metadataChanged: false, globalSearchOrAudit: false,
  approvalHashesChanged: false, wholeResourceGatePassed: false,
}, null, 2) + '\n', { flag: 'wx' });

const D050 = `${T}/evidence/reports/d1816-d050-delivery`;
const ready = read(`${D050}/batch-ready.json`);
const relevant = ready.productBindings.filter(item => /fig-17\.(spec\.json|svg|render\.json|review\.json)$/.test(item.path));
assert.equal(relevant.length, 8);
for (const item of relevant) assert.equal(hash(item.path), item.sha256, item.path);
const retained = ready.retained.filter(item => /text-and-figure-report|figure-scratch-review|display-report|localized-repair|original-inventory/.test(item.path));
assert.equal(retained.length, 5);
for (const item of retained) assert.equal(hash(item.path), item.sha256, item.path);
const source = 'ssot-resources/soviet10year-textbooks/artifacts/10p/figures/fig-17.png';
assert.equal(hash(source), '1e5e8f4c0e2bfdc00be7882bbde64a2b0b7464e581d1d86847932c400aa62eb2');
for (const item of relevant.filter(item => item.path.endsWith('.svg'))) {
  const svg = fs.readFileSync(item.path, 'utf8');
  const rim = svg.match(/<[^>]+\bid="ld-fig-17_ld-motor-disk-rim"[^>]*>/)?.[0];
  assert(rim?.includes('fill-opacity="0"'), 'Current disk is not transparent.');
}
fs.writeFileSync(`${O}/fig17-reused-approval.json`, JSON.stringify({
  stage: 'D523', figure: '10p fig-17', status: 'D050_APPROVED_BYTES_CURRENT_NO_REPAIR_NEEDED',
  source: bind(source), productBindings: relevant, retainedEvidence: retained,
  oldDefect: 'Opaque disk fill covered the existing directed arrow tip.',
  deliveredRepair: 'motor-disk-rim fillOpacity changed from 1 to 0; geometry unchanged.',
  approvalReusedAtExactSha: true, contentOrDisplayChecksReplayed: false,
  imageOpens: 0, candidateCreated: false, newApproval: false,
  distinct9pBoyleFigureUntouched: true,
}, null, 2) + '\n', { flag: 'wx' });
fs.copyFileSync(import.meta.filename, `${O}/assess-finite-references.mjs`, fs.constants.COPYFILE_EXCL);
console.log(JSON.stringify({ stage: 'D523', missingBindings: 18, historicalIdentityStrings: 2,
  actualRepairs: 0, fig17: 'Existing D050 exact-SHA PASS reused', imageOpens: 0 }));
