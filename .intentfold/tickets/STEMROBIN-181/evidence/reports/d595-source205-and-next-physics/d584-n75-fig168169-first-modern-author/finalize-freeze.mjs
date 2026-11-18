import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const workspace = path.resolve(root, '../../../../..');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const read = name => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'));
const mode = file => fs.statSync(file).mode & 0o777;
const report = read('report.json');
const opens = read('actual-opens.json');
const expected = [
  'actual-opens.json',
  'fig-168.source-inventory.json',
  'fig-169.source-center-detail.png',
  'fig-169.source-inventory.json',
  'finalize-freeze.mjs',
  'make-source-detail.py',
  'report.json',
  'routing-and-semantic-hold.json',
].sort();
const freezePath = path.join(root, 'author-freeze.json');

assert.equal(fs.existsSync(freezePath), false, 'Freeze is one-shot; do not overwrite it.');
assert.equal(workspace, report.workspaceRoot);
assert.deepEqual(fs.readdirSync(root).sort(), expected);
for (const binding of report.inputs) {
  assert.equal(hash(path.resolve(workspace, binding.path)), binding.sha256, binding.path);
}
for (const binding of Object.values(report.sourceFirstOrdering).filter(value => value?.path)) {
  assert.equal(hash(binding.path), binding.sha256, binding.path);
  assert.equal(mode(binding.path), 0o444, 'Source inventory must already be sealed.');
}
assert.equal(opens.opens.length, 3);
assert.equal(opens.actualOpens, 3);
assert.equal(opens.contextFinalCount, 3);
for (const item of opens.opens) assert.equal(hash(item.path), item.sha256, item.path);
assert.deepEqual(report.figures, ['fig-168', 'fig-169']);
assert.equal(report.counts.nativeRenders, 0);
assert.equal(report.counts.FigureSpecs, 0);
assert.equal(report.counts.paidCalls, 0);

const files = expected.map(name => {
  const file = path.join(root, name);
  assert.equal(fs.lstatSync(file).isFile(), true, file);
  return { path: file, sha256: hash(file), bytes: fs.statSync(file).size, mode: '0444' };
});
const freeze = {
  schema: 'STEMROBIN-181/n75-first-modern-author-freeze@1',
  ticket: report.ticket,
  task: report.task,
  status: report.status,
  ownedRoot: root,
  files,
  ownedFileCountIncludingThisManifest: files.length + 1,
  inputBindingsVerified: report.inputs.length,
  actualImageOpens: opens.actualOpens,
  contextFinalCount: opens.contextFinalCount,
  originals: 2,
  crops: 1,
  fullRenders: 0,
  actual342Previews: 0,
  nativeValidateRenderReviewCalls: 0,
  repairs: 0,
  paidCalls: 0,
  FIG: report.FIG,
  DISPLAY: report.DISPLAY,
  fullCard: false,
  noImagePayloadReturned: true,
  manifestSelfHash: 'Excluded to avoid circular hashing; returned separately.',
};
fs.writeFileSync(freezePath, `${JSON.stringify(freeze, null, 2)}\n`, { flag: 'wx' });
for (const item of [...files, { path: freezePath }]) fs.chmodSync(item.path, 0o444);

for (const item of files) {
  assert.equal(mode(item.path), 0o444, item.path);
  assert.equal(hash(item.path), item.sha256, item.path);
}
assert.equal(mode(freezePath), 0o444);
console.log(JSON.stringify({
  status: freeze.status,
  files0444: files.length + 1,
  actualImageOpens: opens.actualOpens,
  report: { path: path.join(root, 'report.json'), sha256: hash(path.join(root, 'report.json')) },
  freeze: { path: freezePath, sha256: hash(freezePath) },
  outputs: files.map(({ path: outputPath, sha256 }) => ({ path: outputPath, sha256 })),
}, null, 2));
