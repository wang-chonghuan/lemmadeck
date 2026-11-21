import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const root = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
const directory = path.join(root, '.tmp/stemrobin-184-six/source166-affected-review');
assert.equal(process.cwd(), root);
const manifest = path.join(directory, 'manifest.sha256.txt');
assert(!fs.existsSync(manifest), 'Seal is one-shot.');
const report = JSON.parse(fs.readFileSync(path.join(directory, 'report.json'), 'utf8'));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const binding = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length, sha256: hash(bytes) };
};

// Hash bytes only; no image parser, decoder, subprocess or runtime/PDF copy.
for (const expected of [
  ...report.bindings,
  report.independent_freeze.source,
  ...report.independent_freeze.files,
]) {
  const actual = binding(expected.path);
  assert.equal(actual.bytes, expected.bytes, expected.path);
  assert.equal(actual.sha256, expected.sha256, expected.path);
}
for (const expected of report.independent_freeze.files) {
  assert.equal(fs.statSync(expected.path).mode & 0o777, 0o444);
}
assert.equal(report.native.invocations, 0);
assert.equal(report.native.actual_outcome, 'NOT_RUN_SOURCE_DISAGREEMENT');
assert.equal(report.budgets.cumulative_source166_known, 6);
assert(!fs.existsSync(path.join(directory, 'repair')));

const files = fs.readdirSync(directory).sort().map(name => path.join(directory, name));
assert.equal(files.length, 6);
for (const file of files) {
  assert(fs.lstatSync(file).isFile(), file);
  assert(['.md', '.json', '.mjs'].includes(path.extname(file)), file);
  if (file.endsWith('.json')) JSON.parse(fs.readFileSync(file, 'utf8'));
}
const rows = files.map(binding);
fs.writeFileSync(
  manifest,
  '# SHA-256\tbytes\tabsolute-path; self-excluding; zero image decodes\n'
    + rows.map(row => `${row.sha256}\t${row.bytes}\t${row.path}`).join('\n') + '\n',
  { flag: 'wx', mode: 0o444 },
);
for (const file of [...files, manifest]) fs.chmodSync(file, 0o444);
fs.chmodSync(directory, 0o555);
console.log(JSON.stringify({
  verdict: 'TEXT_SEAL_PASS_CONTENT_FAILURE_PRESERVED',
  imageDecodes: 0,
  mechanicalSealRuns: 1,
  nativeInvocations: 0,
  cumulativeSource166Known: 6,
  filesMode: '0444',
  ownedDirectoryMode: '0555',
  entries: rows,
  manifest: binding(manifest),
}, null, 2));
