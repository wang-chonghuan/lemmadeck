const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = '/Users/yong/.codex/worktrees/d9b1/lemmadeck';
const own = path.join(root, '.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n45-modern-review');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const freezeFile = path.join(own, 'freeze.json');
if (fs.existsSync(freezeFile)) throw new Error('Already sealed');
const inputs = read(path.join(own, 'comparison.json')).inputHashes;
const changed = inputs.filter(record => hash(record.path) !== record.sha256);
if (changed.length) throw new Error(`Inputs changed; preserve and report: ${JSON.stringify(changed)}`);
const commands = read(path.join(own, 'record-review-commands.json'));
if (commands.length !== 3 || commands.some(record => record.exitCode !== 0)) {
  throw new Error('Three successful once-only record_review.py receipts required');
}
for (const command of commands) {
  const receipt = read(command.receipt);
  const review = read(receipt.output.path);
  if (!receipt.specUnchanged || !receipt.renderUnchanged || review.status !== 'pass' ||
      review.schema !== 'ld-s10y-image/review@1' || hash(receipt.output.path) !== receipt.output.sha256) {
    throw new Error(`Invalid record evidence: ${command.figure}`);
  }
}
function files(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry =>
    entry.isDirectory() ? files(path.join(dir, entry.name)) : [path.join(dir, entry.name)]);
}
const outputs = files(own).sort().map(file => ({
  path: file, sha256: hash(file), bytes: fs.statSync(file).size, modeAfterSeal: '0444'
}));
const freeze = {
  schema: 'n45-independent-modern-review-freeze@1',
  date: new Date().toISOString(),
  cwd: root,
  own,
  status: 'review-complete',
  independentVerdict: 'pass',
  inputHashesRechecked: inputs.length,
  inputBytesUnchanged: true,
  outputFiles: outputs,
  recordReviewCalls: 3,
  recordReviewInternalValidateCalls: 3,
  standaloneValidatorCalls: 0,
  producerCalls: 0,
  tests: 0,
  browserRuns: 0,
  renders: 0,
  sourceImageOpens: 3,
  previewImageOpens: 3,
  reopens: 0,
  finalizerCalls: 0,
  promotions: 0,
  publications: 0,
  durableWrites: 0,
  networkCalls: 0,
  dbCalls: 0,
  appRuns: 0,
  envFileAccesses: 0,
  dependencyOperations: 0,
  indexOrProgressWrites: 0,
  commits: 0,
  note: 'Own evidence only is chmod-ed. Review stops here; no finalizer or promotion. Review limitations are frozen in review.json and report.md.'
};
fs.writeFileSync(freezeFile, JSON.stringify(freeze, null, 2) + '\n', { flag: 'wx' });
for (const file of files(own)) fs.chmodSync(file, 0o444);
const frozenFiles = files(own);
if (frozenFiles.some(file => (fs.statSync(file).mode & 0o777) !== 0o444)) {
  throw new Error('A review evidence file did not freeze to 0444');
}
console.log(JSON.stringify({ status: 'review-complete', frozenFiles: frozenFiles.length,
  unchangedInputHashes: inputs.length, recordReviewCalls: 3,
  freeze: { path: freezeFile, sha256: hash(freezeFile) } }, null, 2));
