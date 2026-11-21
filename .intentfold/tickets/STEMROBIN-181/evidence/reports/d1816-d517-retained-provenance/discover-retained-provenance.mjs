import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/evidence/reports/d1816-d517-retained-provenance`;
const read = file => JSON.parse(fs.readFileSync(file));
const old = read(`${T}/evidence/reports/d1816-d511-exact-review-asset-paths/repair.json`);
const expected = old.unresolved.filter(row => row.expectedSha256 && row.pointer.at(-1) === 'path');
const disposable = value => value.startsWith('.tmp/') || value.includes('/.tmp/') ||
  (value.startsWith('.intentfold/tickets/') && value.includes('/tmp/'));
const hashCache = new Map();
const hash = file => {
  if (!hashCache.has(file)) hashCache.set(file,
    crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'));
  return hashCache.get(file);
};
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
  const file = `${dir}/${entry.name}`;
  if (entry.isSymbolicLink()) return [];
  return entry.isDirectory() ? walk(file) : [file];
});
assert(!fs.existsSync(O));
const basenameSet = new Set(expected.map(row => path.basename(row.path)));
const byBasename = new Map([...basenameSet].map(name => [name, []]));
for (const file of walk(`${T}/evidence`)) {
  const name = path.basename(file);
  for (const basename of basenameSet) {
    if (name === basename || name.endsWith(`-${basename}`)) byBasename.get(basename).push(file);
  }
}
const plans = [];
const unresolved = [];
for (const row of expected) {
  const metadata = read(row.file);
  const parent = row.pointer.slice(0, -1).reduce((value, key) => value?.[key], metadata);
  if (parent?.sha256 !== row.expectedSha256 || parent?.path !== row.path) {
    unresolved.push({ ...row, currentReason: 'Current binding differs from retained failure; not overwritten.' });
    continue;
  }
  assert(disposable(row.path));
  const candidates = [...byBasename.get(path.basename(row.path))];
  const local = path.resolve(row.path);
  if (local.startsWith(`${repo}/`) && fs.existsSync(local)) candidates.push(local);
  const tmp = row.path.indexOf('/.tmp/');
  if (tmp >= 0) {
    const currentCheckoutAlias = path.join(repo, row.path.slice(tmp + 1));
    if (fs.existsSync(currentCheckoutAlias)) candidates.push(currentCheckoutAlias);
  }
  const matches = [...new Set(candidates)].filter(file => fs.statSync(file).isFile() &&
    hash(file) === row.expectedSha256).sort((a, b) => {
      const aRetained = path.resolve(a).startsWith(path.resolve(`${T}/evidence`) + '/');
      const bRetained = path.resolve(b).startsWith(path.resolve(`${T}/evidence`) + '/');
      return Number(bRetained) - Number(aRetained) || a.length - b.length || a.localeCompare(b);
    });
  if (!matches.length) {
    unresolved.push({ ...row, candidateFilesCompared: candidates.length,
      currentReason: 'No exact approved bytes found in same-ticket retained candidates or original current-checkout path.' });
    continue;
  }
  const matched = path.relative(repo, path.resolve(matches[0]));
  const isFrozen = matched.startsWith(`${T}/evidence/`);
  const target = isFrozen ? matched :
    `${O}/assets/${row.expectedSha256}/${path.basename(row.path)}`;
  if (row.pointer.length === 2 && row.pointer[0] === 'spec') {
    unresolved.push({ ...row, matched, currentReason: 'Top-level FigureSpec requires SSOT restoration; separate bounded batch.' });
    continue;
  }
  plans.push({ file: row.file, pointer: row.pointer, oldPath: row.path,
    expectedSha256: row.expectedSha256, matched, target,
    candidateBytes: fs.statSync(matches[0]).size, exactMatches: matches.map(file => path.relative(repo, path.resolve(file))),
    retainedHistoricalBindingOnly: true, approvalStatusUnchanged: metadata.status ?? null,
    copyRequired: !isFrozen });
}
fs.mkdirSync(O, { recursive: true });
fs.writeFileSync(`${O}/plan.json`, JSON.stringify({
  stage: 'D517', status: 'READONLY_EXACT_BYTES_DISCOVERY_FROM_RETAINED_FAILURES',
  originalFailedReferences: expected.length, plans, unresolved,
  candidateFilesHashed: hashCache.size, imagesOpened: 0, paidCalls: 0,
  corpusAuditReplayed: false, approvalHashesChanged: false,
  historicalStatusOrSemanticsChanged: false, productFilesEdited: false,
}, null, 2) + '\n', { flag: 'wx' });
fs.copyFileSync(`${T}/tmp/d1816-recovery/discover-d517-retained-provenance.mjs`,
  `${O}/discover-retained-provenance.mjs`, fs.constants.COPYFILE_EXCL);
console.log(JSON.stringify({ exactBindingsAvailable: plans.length,
  affectedMetadataFiles: new Set(plans.map(row => row.file)).size,
  copiesRequired: plans.filter(row => row.copyRequired).length,
  unresolvedExpectedShaReferences: unresolved.length, candidateFilesHashed: hashCache.size }));
