import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
const root = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/n62-fig8990-author');
const input = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/n62-fig8990-author-inputs-01');
const phase = process.argv[2];
if (!['before', 'after'].includes(phase)) throw new Error('Expected before or after');
const intake = JSON.parse(fs.readFileSync(path.join(input, 'blind-intake.json'), 'utf8'));
const manifest = JSON.parse(fs.readFileSync(intake.afterAllOriginalFIRSTsSealed.path, 'utf8'));
const expected = new Map();
function collect(value) {
  if (!value || typeof value !== 'object') return;
  if (typeof value.path === 'string' && path.isAbsolute(value.path) && value.sha256) {
    if (!value.path.startsWith(repo + '/')) throw new Error('Non-repository binding');
    if (expected.has(value.path) && expected.get(value.path) !== value.sha256) throw new Error('Conflicting binding');
    expected.set(value.path, value.sha256);
  }
  for (const child of Object.values(value)) collect(child);
}
collect(intake);
collect(manifest);
for (const figure of manifest.figures) {
  for (const asset of Object.values(figure.originalContract.source)) {
    const absolute = path.join(path.dirname(figure.sourceImage.path), path.basename(asset.path));
    expected.set(absolute, asset.sha256);
  }
}
const outputs = [...expected].map(([absolute, sha256]) => {
  const bytes = fs.readFileSync(absolute);
  const actual = crypto.createHash('sha256').update(bytes).digest('hex');
  return {path: path.relative(repo, absolute), sha256: actual, bytes: bytes.length, expectedSha256: sha256, match: actual === sha256};
});
const seals = intake.originals.map(({figure}) => {
  const absolute = path.join(root, `${figure}-FIRST.json`);
  const bytes = fs.readFileSync(absolute);
  return {path: path.relative(repo, absolute), sha256: crypto.createHash('sha256').update(bytes).digest('hex'), bytes: bytes.length, mode: (fs.statSync(absolute).mode & 0o777).toString(8)};
});
const receipt = {schema: 'bounded-input-bindings@1', phase, outputs, FIRSTs: seals, status: outputs.every(v => v.match) && seals.every(v => v.mode === '444') ? 'MATCH' : 'FAIL'};
fs.writeFileSync(path.join(root, `bindings-${phase}.json`), JSON.stringify(receipt, null, 2) + '\n');
if (receipt.status !== 'MATCH') throw new Error('Input bindings or FIRST modes failed');
if (phase === 'before') {
  const holdManifest = JSON.parse(fs.readFileSync(manifest.sourceHolds.manifest.path, 'utf8'));
  fs.writeFileSync(path.join(root, 'inherited-holds.json'), JSON.stringify({schema: 'unchanged-inherited-holds@1', manifestReference: manifest.sourceHolds, originalSourceHolds: holdManifest.sourceHolds, status: 'ALL_INHERITED_HOLDS_RETAINED_UNCHANGED'}, null, 2) + '\n');
} else {
  const before = JSON.parse(fs.readFileSync(path.join(root, 'bindings-before.json'), 'utf8'));
  if (JSON.stringify(before.outputs) !== JSON.stringify(outputs) || JSON.stringify(before.FIRSTs) !== JSON.stringify(seals)) throw new Error('Inputs or sealed FIRST changed during authoring');
}
console.log(JSON.stringify({phase, status: receipt.status, count: outputs.length, FIRSTs: seals}));
