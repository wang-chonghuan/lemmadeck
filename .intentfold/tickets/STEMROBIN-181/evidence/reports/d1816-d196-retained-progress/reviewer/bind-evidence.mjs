import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const cwd = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
if (process.cwd() !== cwd) throw new Error('Exact review cwd required');
const review = path.join(cwd, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d196-10p-source65-67-review');
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const input = read(path.join(review, 'input-freeze.json'));
const source = read(input.sourceOnly.path);
const after = read(input.afterInventory.path);
const native = read(after.nativeRetention.path);
const author = read(after.authorReport.path);
const records = new Map();
const add = (file, expected, role = 'input') => {
  const absolute = path.resolve(cwd, file);
  if (records.has(absolute)) {
    if (expected) records.get(absolute).expectations.push(expected);
    return;
  }
  const bytes = fs.readFileSync(absolute);
  records.set(absolute, {
    path: absolute,
    bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
    role,
    expectations: expected ? [expected] : []
  });
};
const collect = (value) => {
  if (!value || typeof value !== 'object') return;
  if (typeof value.path === 'string' && Number.isInteger(value.bytes) && typeof value.sha256 === 'string') {
    add(value.path, {bytes: value.bytes, sha256: value.sha256});
    return;
  }
  for (const item of Object.values(value)) collect(item);
};
for (const name of ['input-freeze.json', 'source-only.json', 'after-inventory.json']) add(path.join(review, name));
collect(input);
collect(source);
collect(after);
collect(native);
collect(author.inputFreeze);
collect(author.native);
for (const file of [
  '.intentfold/readme.md',
  '.intentfold/project.json',
  '.intentfold/charter/product.md',
  '.intentfold/charter/engineering.md',
  '.intentfold/charter/operations.md',
  '.claude/skills/ld-s10y-lesson/SKILL.md',
  '.claude/skills/ld-s10y-lesson/references/production-resume.md',
  '.agents/skills/ld-s10y-image/SKILL.md',
  '/Users/yong/.agents/skills/intentfold/SKILL.md',
  '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d198-source64-punctuation-review/report.json'
]) add(file);
for (const name of [
  'baseline-0065.json', 'baseline-0066.json', 'baseline-0067.json',
  'source-observations-supplement.json', 'bind-evidence.mjs', 'report.json'
]) add(path.join(review, name), null, 'output');
const mismatches = [];
for (const record of records.values()) {
  for (const expected of record.expectations) {
    if (record.bytes !== expected.bytes || record.sha256 !== expected.sha256) {
      mismatches.push({path: record.path, expected, actual: {bytes: record.bytes, sha256: record.sha256}});
    }
  }
}
const report = read(path.join(review, 'report.json'));
const p66 = read(after.pages.find((p) => p.page === 66).structured.path);
const p67 = read(after.pages.find((p) => p.page === 67).structured.path);
const d198 = read(path.join(cwd, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d198-source64-punctuation-review/report.json'));
const checks = {
  expectedInputBindingsMatch: mismatches.length === 0,
  source64InheritedComposedPass: d198.verdict === 'PASS' && d198.composedSourceApproval === true,
  unsupportedCommaStillPreserved: p66.blocks[12].lines[0] === '电容器对直流电的电阻是无限大，同时，它对交流电的阻',
  sourceSquareStillPreserved: p66.blocks[9].lines[0].includes('■'),
  provisionalEq227OvalEncodingUnchanged: p66.blocks[6].lines[0] === '$\\frac{1}{\\omega C}=X_o$ （2.27）',
  n24LastBlockPreserved: p67.blocks[0].cont && !p67.blocks[0].open && p67.blocks[0].lines[0].endsWith('返回到外线路中去.'),
  n25TitlePreserved: p67.blocks[1].kind === 'h3' && p67.blocks[1].lines[0] === '25. 交流电路中的电感',
  n25RightOpenPreserved: p67.blocks[8].open && p67.blocks[8].lines[1].endsWith('自感电动势与'),
  reportHasNoCompositeApproval: report.sourceApproval === false && report.rawSvgApproval === false && report.modernFigureApproval === false,
  recordedImageBudgetWithinLimit: report.preservationAndScope.actualImageOpens === 8 && report.preservationAndScope.contextImageOpens === 8
};
const output = {
  schema: 'd196-binding-check-stdout@1',
  cwd,
  readOnlyBindingAndSpecifiedFieldChecksOnly: true,
  nativeOrCounterOrCheckerReplay: false,
  records: [...records.values()].map(({expectations, ...record}) => record),
  expectedBindingComparisons: [...records.values()].reduce((sum, record) => sum + record.expectations.length, 0),
  mismatches,
  checks
};
console.log(JSON.stringify(output, null, 2));
if (mismatches.length || Object.values(checks).some((passed) => !passed)) process.exitCode = 1;
