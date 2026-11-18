import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const owned = path.dirname(fileURLToPath(import.meta.url));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const json = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const bindings = json(path.join(owned, 'binding-evidence.json'));
const authorFreeze = json(bindings.files.find(file => file.path.endsWith('/author-freeze.json')).path);
const extraSuffixes = [
  'commands/fig-153.draft.repair.stdout.txt',
  'commands/fig-153.draft.repair.receipt.json',
  'commands/fig-154.draft.first.stdout.txt',
  'commands/fig-154.draft.first.receipt.json'
];
const extra = extraSuffixes.map(suffix => {
  const file = authorFreeze.files.find(entry => entry.path.endsWith(suffix));
  if (!file) throw new Error('Existing gate evidence not hash-bound: ' + suffix);
  return { path: file.path, expectedSha256: file.sha256 };
});
const after = [...bindings.files, ...extra].map(file => ({
  path: file.path,
  expectedSha256: file.expectedSha256,
  sha256: hash(file.path),
  mode: (fs.statSync(file.path).mode & 0o777).toString(8)
}));
if (after.some(file => file.expectedSha256 !== file.sha256)) throw new Error('Bound external bytes changed; do not restore another worker bytes');
fs.writeFileSync(path.join(owned, 'shared-bound-after.json'), JSON.stringify({
  schema: 'd565/read-only-bound-after-comparison@1',
  timestampUtc: new Date().toISOString(),
  unchanged: true,
  restorationOrWritesOutsideOwnedScope: false,
  files: after
}, null, 2) + '\n', { flag: 'wx' });

const list = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
  const file = path.join(directory, entry.name);
  if (entry.isSymbolicLink()) throw new Error('Do not follow symlinks while freezing owned evidence');
  return entry.isDirectory() ? list(file) : [file];
});
const payload = list(owned).sort();
const files = payload.map(file => {
  fs.chmodSync(file, 0o444);
  return { path: file, sha256: hash(file), bytes: fs.statSync(file).size, mode: (fs.statSync(file).mode & 0o777).toString(8) };
});
const envelope = {
  schema: 'd565/first-independent-review-byte-freeze@1',
  timestampUtc: new Date().toISOString(),
  writeScope: owned,
  status: 'FIG153-PASS-FIG154-HOLD-FROZEN-0444',
  files,
  fileCount: files.length,
  report: files.find(file => file.path.endsWith('/report.json')),
  sourceInventory: files.find(file => file.path.endsWith('/source-inventory.json')),
  actualOpens: 6,
  imageCrops: 0,
  imageReopens: 0,
  parentImageCountUnchanged: 24,
  allBrowsersClosed: json(path.join(owned, 'mobile-capture-evidence.json')).allBrowsersClosed,
  standardReviewRecorderInvocations: 0,
  selfHashExclusion: 'review-freeze.json excludes itself; its SHA-256 is returned externally. No self-hash cycle.'
};
const envelopePath = path.join(owned, 'review-freeze.json');
fs.writeFileSync(envelopePath, JSON.stringify(envelope, null, 2) + '\n', { flag: 'wx', mode: 0o444 });
fs.chmodSync(envelopePath, 0o444);
if (list(owned).some(file => (fs.statSync(file).mode & 0o777) !== 0o444)) throw new Error('Owned file not frozen');
console.log(JSON.stringify({
  report: envelope.report,
  sourceInventory: envelope.sourceInventory,
  reviewFreeze: { path: envelopePath, sha256: hash(envelopePath), mode: (fs.statSync(envelopePath).mode & 0o777).toString(8) },
  actualOpens: envelope.actualOpens,
  frozenFileCountIncludingEnvelope: files.length + 1,
  allBrowsersClosed: envelope.allBrowsersClosed,
  externalBindingsUnchanged: true
}, null, 2));
