const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = '/Users/yong/.codex/worktrees/d9b1/lemmadeck';
const own = path.join(root, '.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n45-modern-review/output-binding');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const mode = file => (fs.statSync(file).mode & 0o777).toString(8).padStart(4, '0');
const review = JSON.parse(fs.readFileSync(path.join(own, 'review.json'), 'utf8'));
const freezeFile = path.join(own, 'freeze.json');
if (fs.existsSync(freezeFile)) throw new Error('Already frozen');
const changed = review.inputs.filter(file => hash(file.path) !== file.sha256 || mode(file.path) !== file.mode);
if (changed.length) throw new Error(`Input changed; preserve and report: ${JSON.stringify(changed)}`);
function files(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry =>
    entry.isDirectory() ? files(path.join(dir, entry.name)) : [path.join(dir, entry.name)]);
}
const freeze = {
  schema: 'n45-affected-output-binding-freeze@1',
  frozenAt: new Date().toISOString(),
  ownedScratch: own,
  status: review.status,
  candidateBindingStatus: review.candidateBindingStatus,
  requestedFiveOutputCoverage: review.requestedFiveOutputCoverage,
  inputHashesAndModesRechecked: review.inputs.length,
  inputBytesAndModesUnchanged: true,
  previousFreezePreserved: true,
  outputFiles: files(own).sort().map(file => ({
    path: file, sha256: hash(file), bytes: fs.statSync(file).size, modeAfterSeal: '0444'
  })),
  execution: review.execution,
  note: 'Only output-binding/ is frozen. Four actual outputs pass; requested separate changes-file coverage gap remains. No promotion.'
};
fs.writeFileSync(freezeFile, JSON.stringify(freeze, null, 2) + '\n', { flag: 'wx' });
for (const file of files(own)) fs.chmodSync(file, 0o444);
if (files(own).some(file => mode(file) !== '0444')) throw new Error('Failed to freeze new evidence');
console.log(JSON.stringify({
  status: review.status, candidateBindingStatus: review.candidateBindingStatus,
  frozenFiles: files(own).length, unchangedInputHashes: review.inputs.length,
  freeze: { path: freezeFile, sha256: hash(freezeFile) }
}, null, 2));
