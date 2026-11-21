import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/evidence/reports/d1816-d520-indexed-provenance`;
const read = file => JSON.parse(fs.readFileSync(file));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const disposable = value => value.startsWith('.tmp/') || value.includes('/.tmp/') ||
  (value.startsWith('.intentfold/tickets/') && value.includes('/tmp/'));
const prior = read(`${T}/evidence/reports/d1816-d517-retained-provenance/plan.json`);
const expected = prior.unresolved.map(row => ({ file: row.file, pointer: row.pointer,
  oldPath: row.path, expectedSha256: row.expectedSha256 }));
const extraFiles = [
  'ssot-resources/soviet10year-textbooks/artifacts/10p/pages/0264/page.json',
  'ssot-resources/soviet10year-textbooks/artifacts/10p/editions/modern-us-neutral/lessons/phy10-c2-s2-n77/choice-set/source-rebinding.json',
];
const visit = (value, pointer, file) => {
  if (!value || typeof value !== 'object') return;
  if (typeof value.path === 'string' && disposable(value.path) && /^[a-f0-9]{64}$/.test(value.sha256 ?? ''))
    expected.push({ file, pointer: [...pointer, 'path'], oldPath: value.path, expectedSha256: value.sha256 });
  for (const [key, child] of Object.entries(value))
    visit(child, [...pointer, Array.isArray(value) ? Number(key) : key], file);
};
for (const file of extraFiles) visit(read(file), [], file);
const indexRows = new Map();
const addIndex = value => {
  if (!value || typeof value !== 'object') return;
  if (typeof value.path === 'string' && /^[a-f0-9]{64}$/.test(value.sha256 ?? '')) {
    const rows = indexRows.get(value.sha256) ?? [];
    rows.push({ path: value.path, originalPath: value.originalPath ?? null });
    indexRows.set(value.sha256, rows);
  }
  for (const child of Object.values(value)) addIndex(child);
};
addIndex(read(`${T}/evidence/index.json`));
const plans = [];
const unresolved = [];
const missingIndexFiles = new Set();
for (const row of expected) {
  const parent = row.pointer.slice(0, -1).reduce((v, key) => v?.[key], read(row.file));
  assert.equal(parent.path, row.oldPath);
  assert.equal(parent.sha256, row.expectedSha256);
  const indexed = indexRows.get(row.expectedSha256) ?? [];
  const candidates = indexed.map(entry => entry.path);
  if (fs.existsSync(row.oldPath)) candidates.push(row.oldPath);
  for (const entry of indexed) if (!fs.existsSync(entry.path)) missingIndexFiles.add(entry.path);
  const actual = [...new Set(candidates)].filter(file => fs.existsSync(file) &&
    fs.statSync(file).isFile() && hash(file) === row.expectedSha256);
  if (!actual.length) {
    unresolved.push({ ...row, indexedCandidates: indexed,
      reason: 'Recorded index or original path has no existing byte-identical candidate; index claims are not usable bytes.' });
    continue;
  }
  actual.sort((a, b) => Number(disposable(a)) - Number(disposable(b)) || a.length - b.length || a.localeCompare(b));
  const matched = path.resolve(actual[0]);
  const retained = matched.startsWith(path.resolve(`${T}/evidence`) + '/');
  const relative = path.relative(repo, matched);
  const copyRequired = !retained || disposable(relative);
  const target = copyRequired ? `${O}/assets/${row.expectedSha256}/${path.basename(row.oldPath)}` : relative;
  assert(!disposable(target));
  plans.push({ ...row, matched, target, copyRequired,
    statusPreserved: read(row.file).status ?? null, indexedCandidates: indexed });
}
assert(!fs.existsSync(O));
fs.mkdirSync(O, { recursive: true });
fs.writeFileSync(`${O}/plan.json`, JSON.stringify({
  stage: 'D520', status: 'INDEX_AND_ORIGINAL_PATH_EXACT_BYTES_DISCOVERY',
  priorUnresolvedExpectedShaReferences: 182, additionalRecordedSourceBindings: expected.length - 182,
  plans, unresolved, missingIndexedPaths: [...missingIndexFiles],
  indexIsNotByteEvidenceByItself: true, noHashOrApprovalChanges: true,
  imagesOpened: 0, paidCalls: 0, originalAuditReplayed: false,
}, null, 2) + '\n', { flag: 'wx' });
fs.copyFileSync(`${T}/tmp/d1816-recovery/discover-d520-indexed-provenance.mjs`,
  `${O}/discover-indexed-provenance.mjs`, fs.constants.COPYFILE_EXCL);
console.log(JSON.stringify({ exactBindingsAvailable: plans.length,
  affectedMetadataFiles: new Set(plans.map(row => row.file)).size,
  copiesRequired: plans.filter(row => row.copyRequired).length,
  unresolvedReferences: unresolved.length, missingIndexedPaths: missingIndexFiles.size,
  sourceFilesEdited: false }));
