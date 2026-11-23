import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
const out = path.join(root, '.tmp/stemrobin-184-six/c6-first-offline-display-review');
const manifestPath = path.join(out, 'manifest.json');
if (process.cwd() !== root || fs.existsSync(manifestPath)) throw Error('Wrong cwd or manifest already exists');
const digest = p => ({
  path: p,
  bytes: fs.statSync(p).size,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'),
});
const bindings = JSON.parse(fs.readFileSync(path.join(out, 'bindings.json'), 'utf8'));
const evidence = JSON.parse(fs.readFileSync(path.join(out, 'browser-evidence.json'), 'utf8'));
const receipt = JSON.parse(fs.readFileSync(path.join(out, 'execution.json'), 'utf8'));
const checks = [];
for (const item of bindings.inputs) checks.push({ type: 'input-binding', path: item.path, matches: digest(item.path).sha256 === item.sha256 });
for (const item of bindings.evidence) {
  const actual = digest(path.join(out, item.filename));
  checks.push({ type: 'evidence-binding', path: actual.path, matches: actual.sha256 === item.sha256 && actual.bytes === item.bytes });
}
for (const item of bindings.screenshots) checks.push({
  type: 'uncaptured-screenshot',
  filename: item.filename,
  matches: !fs.existsSync(path.join(out, item.filename)) && item.sha256 === null && item.creationCount === 0 && item.modelViewCount === 0,
});
checks.push({
  type: 'single-stopped-browser-execution',
  matches: receipt.attempts === 1 && receipt.exitCode === 1 && evidence.exitCode === 1 &&
    evidence.browserClosed === true && evidence.viewports.length === 1 &&
    evidence.imageUsage.screenshotsCreated === 0 && evidence.imageUsage.modelViews === 0,
});
const files = [
  'report.md', 'bindings.json', 'execution-ledger.md', 'verify-manifest.mjs',
  ...bindings.evidence.map(item => item.filename),
].map(name => digest(path.join(out, name)));
const valid = checks.every(check => check.matches);
const manifest = {
  schema: 'stemrobin-184/c6-first-offline-display-manifest@1',
  cwd: process.cwd(),
  argv: process.argv,
  timestamp: new Date().toISOString(),
  exitCode: valid ? 0 : 1,
  bindingVerification: valid ? 'PASS' : 'FAIL',
  displayVerdictUnchanged: bindings.verdict,
  ticketState: 'OPEN',
  textExecCount: 15,
  files,
  checks,
  screenshotCount: 0,
  modelImageViewCount: 0,
  note: 'This verifies the retained package, not a replay or a passed display review. Incidental owned browser profile is not copied or enumerated.',
};
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({
  bindingVerification: manifest.bindingVerification,
  displayVerdict: bindings.verdict,
  exitCode: manifest.exitCode,
  textExecCount: 15,
  report: files.find(f => f.path.endsWith('/report.md')),
  bindings: files.find(f => f.path.endsWith('/bindings.json')),
  manifest: digest(manifestPath),
  screenshotsCreated: 0,
  modelImageViews: 0,
  ticketState: 'OPEN',
}, null, 2));
process.exitCode = manifest.exitCode;
