import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
if (process.cwd() !== repo) throw new Error('Incorrect working directory');
const out = path.join(repo,
  '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d371-n151-affected-text-review');
const read = file => JSON.parse(fs.readFileSync(file));
function bind(file) {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
}
const input = read(path.join(out, 'input-freeze.json'));
const reportFile = path.join(out, 'report.json');
const report = read(reportFile);
const evidence = read(report.bindings.comparison.path);
if (report.status !== 'PASS' || evidence.status !== 'PASS' ||
    evidence.checks.some(item => item.status !== 'PASS')) {
  throw new Error('Cannot seal PASS with unresolved comparison failures');
}
const exactInputs = input.exactInputs.map(item => {
  const current = bind(item.path);
  if (current.sha256 !== item.sha256) throw new Error(`Input changed: ${item.path}`);
  return { ...current, roles: item.roles, reviewedSha256: item.sha256, unchanged: true };
});
for (const field of [report.independence.expectations, report.independence.inputFreeze,
  report.bindings.comparison, report.SCI.primaryEvidenceReuse,
  ...Object.values(report.historicalBindings).filter(value => value?.path && value?.sha256)]) {
  if (bind(field.path).sha256 !== field.sha256) throw new Error(`Report binding mismatch: ${field.path}`);
}
const formatter = bind(evidence.formatterEvidence.path);
if (formatter.sha256 !== evidence.formatterEvidence.sha256) throw new Error('Formatter changed');
exactInputs.push({ ...formatter, roles: ['read-only production sectionBreak expectation'],
  reviewedSha256: formatter.sha256, unchanged: true });
const artifacts = fs.readdirSync(out).sort()
  .filter(name => name !== 'review-freeze.json')
  .map(name => bind(path.join(out, name)));
const freeze = {
  schema: 'stemrobin181/affected-independent-review-freeze@1',
  stage: 'D371',
  frozenAtUtc: new Date().toISOString(),
  status: report.status,
  SCI: report.SCI.status,
  ZHEN: report.ZHEN.status,
  report: bind(reportFile),
  artifacts,
  exactInputs,
  allInputsUnchanged: true,
  allNamedEvidenceMatches: true,
  D358HistoricalFirstVerdictUnchanged: true,
  D367PreviouslySealedAndUnchanged: true,
  independentExpectationsFrozenBeforeCandidate: true,
  affectedOnly: true,
  imagesOpened: 0,
  producerCalls: 0,
  usage: report.usage,
  elapsedMsSinceInputBindingFreeze: Date.now() - Date.parse(input.frozenAtUtc),
  boundary: 'Final requested finite review completed. No new full SCI/ZHEN, native/display approval or canonical promotion.'
};
const freezeFile = path.join(out, 'review-freeze.json');
fs.writeFileSync(freezeFile, JSON.stringify(freeze, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({
  stage: 'D371', status: report.status,
  report: bind(reportFile), reviewFreeze: bind(freezeFile),
  D367Report: report.historicalBindings.D367Report,
  D367Freeze: report.historicalBindings.D367Freeze,
  allInputsUnchanged: true, imagesOpened: 0, producerCalls: 0
}, null, 2));
