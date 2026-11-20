import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
if (process.cwd() !== repo) throw new Error('Incorrect working directory');
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp');
const out = path.join(tmp, 'd1816-d371-n151-affected-text-review');
const read = file => JSON.parse(fs.readFileSync(file));
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const inputs = new Map();
function bind(file, role, expectedSha256) {
  const absolute = path.resolve(repo, file);
  const bytes = fs.readFileSync(absolute);
  const item = { path: absolute, bytes: bytes.length, sha256: digest(bytes), roles: [role] };
  if (expectedSha256) {
    item.expectedSha256 = expectedSha256;
    item.matchesDeclaredHash = item.sha256 === expectedSha256;
    if (!item.matchesDeclaredHash) throw new Error(`Input hash mismatch: ${absolute}`);
  }
  const prior = inputs.get(absolute);
  if (prior) {
    prior.roles.push(role);
    if (expectedSha256) {
      prior.expectedSha256 = expectedSha256;
      prior.matchesDeclaredHash = true;
    }
  } else inputs.set(absolute, item);
  return item;
}
const ownExpectations = bind(path.join(out, 'expectations.json'), 'criteria frozen before D370');
if (ownExpectations.sha256 !== 'f27a14609e32596f933b00de86a3e97940fc67ffad681e01b3d433b20b8a0a14') {
  throw new Error('Independent expectations changed');
}
const d358 = path.join(tmp, 'd1816-d358-n151-first-text-review');
bind(path.join(d358, 'report.json'), 'historical first verdict',
  'a520625890207ce79de9a1aadca44863ccc4904539e635a2300c6f82ede6bb1d');
bind(path.join(d358, 'review-freeze.json'), 'historical first freeze',
  '3ad93765331f210df43604e115ca6686962330cd6adbc757b13f9407ef494c35');
const firstReport = read(path.join(d358, 'report.json'));
for (const key of ['sourceExpectations', 'scienceExpectations', 'inputFreeze', 'primaryEvidence']) {
  const item = firstReport.independence[key];
  bind(item.path, `D358 ${key} reused, not rerun`, item.sha256);
}
bind(firstReport.bindings.comparisonEvidence.path, 'D358 protected-baseline comparison',
  firstReport.bindings.comparisonEvidence.sha256);
const d367 = path.join(tmp, 'd1816-d367-n149-layout-context-review');
bind(path.join(d367, 'report.json'), 'prior finite review sealed before D371',
  'ebb36d1f4e44b815faa90a013e9f8a0746c46ea0c12add37865cfefd78e89b73');
bind(path.join(d367, 'review-freeze.json'), 'D367 seal boundary',
  '05eb251eb8f6776e0483a5dff8618dcf03090946bae21099667750eb15c5e2b1');
const d357File = path.join(tmp, 'd1816-d357-n151-source-rebinding/input-freeze.json');
bind(d357File, 'frozen original/rebound bindings');
const d357 = read(d357File);
for (const key of ['originalAuthorFreeze', 'originalAuthorReport', 'affectedSourceReview',
  'sourceRepair', 'originalSource', 'repairedSource', 'exercises']) {
  bind(d357[key].path, `D357 ${key} retained`, d357[key].sha256);
}
for (const template of d357.templates) {
  for (const key of ['author', 'prepared', 'rebound']) {
    bind(template[key].path, `${template.locale} frozen ${key}`, template[key].sha256);
  }
}
const d370File = path.join(tmp, 'd1816-d370-n151-reference-clarity-repair/author-freeze.json');
bind(d370File, 'D370 author report/freeze supplied by parent',
  '26e2eaf32cb48509f4e916ff3d260eb775fd282dc3dc03059c09d9e8c56f8217');
const d370 = read(d370File);
for (const candidate of d370.outputs) {
  for (const key of ['baseline', 'candidate', 'working', 'finalFlow']) {
    bind(candidate[key].path, `${candidate.locale} D370 ${key}`, candidate[key].sha256);
  }
  bind(path.join(path.dirname(d370File), `${candidate.locale}.before.template.json`),
    `${candidate.locale} D370 before snapshot`, candidate.baseline.sha256);
}
const firstFreeze = read(path.join(d358, 'review-freeze.json'));
for (const item of firstFreeze.exactInputs) {
  if (item.path.includes('/d1816-d351-n151-bilingual-author/layout/') ||
      item.path.includes('/d1816-d351-n151-bilingual-author/technical-recovery.json') ||
      item.path.includes('/d1816-d351-n151-bilingual-author/text-contract') ||
      item.path.includes('/d1816-d351-n151-bilingual-author/first-candidate/') ||
      item.path.includes('/d1816-d357/source-work/') &&
      /\/(?:exercises|figures)\.template\.json$/.test(item.path)) {
    bind(item.path, 'unaffected D358 flow/auxiliary or author history retained', item.sha256);
  }
}
for (const file of ['.intentfold/charter/product.md', '.intentfold/charter/engineering.md',
  '.claude/skills/ld-s10y-lesson/SKILL.md',
  '.claude/skills/ld-s10y-lesson/references/edition-text-contract.md']) {
  bind(file, 'current binding contract, read only');
}
const freeze = {
  schema: 'stemrobin181/affected-independent-input-freeze@1',
  stage: 'D371',
  frozenAtUtc: new Date().toISOString(),
  criteriaFrozenBeforeD370: ownExpectations,
  historicalD358VerdictPreserved: true,
  D367AlreadySealed: true,
  expectedD370AuthorFreezeSha256: '26e2eaf32cb48509f4e916ff3d260eb775fd282dc3dc03059c09d9e8c56f8217',
  exactInputs: [...inputs.values()],
  allDeclaredHashesMatch: true,
  imageReads: 0,
  producerCalls: 0,
  note: 'Binding reads do not constitute new whole-source, science or language judgments.'
};
fs.writeFileSync(path.join(out, 'input-freeze.json'), JSON.stringify(freeze, null, 2) + '\n',
  { flag: 'wx' });
console.log(JSON.stringify({
  stage: 'D371',
  boundFiles: inputs.size,
  inputFreezeSha256: digest(fs.readFileSync(path.join(out, 'input-freeze.json'))),
  working: freeze.exactInputs.filter(item => item.roles.some(role => /D370 working/.test(role)))
}, null, 2));
