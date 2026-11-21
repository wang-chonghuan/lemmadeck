import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const R = 'ssot-resources/soviet10year-textbooks/artifacts';
const O = `${T}/evidence/reports/d1816-d511-exact-review-asset-paths`;
const log = `${T}/tmp/d1816-recovery/native/d509-review-resource-boundary-audit/stderr.txt`;
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => ({
  path: path.resolve(file), bytes: fs.statSync(file).size,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),
});
const disposable = value => value.startsWith('.tmp/') || value.includes('/.tmp/') ||
  (value.includes('.intentfold/tickets/') && value.includes('/tmp/'));
const files = [...new Set(fs.readFileSync(log, 'utf8').split('\n')
  .map(line => line.match(/^FAIL persistent JSON depends on disposable work: (\S+\.json):\$/)?.[1])
  .filter(file => file?.endsWith('.independent-review.json') &&
    (file.startsWith(`${R}/9p/`) || file.startsWith(`${R}/10p/`))))];
assert(!fs.existsSync(O));
const plans = [];
const unresolved = [];
for (const file of files) {
  const before = read(file);
  const after = structuredClone(before);
  const owner = file.match(/\/(9p|10p)\/editions\/([^/]+)\/figures\/([^/]+)\.independent-review\.json$/);
  if (!owner) {
    unresolved.push({ file, pointer: [],
      reason: 'Independent review outside the standard edition figure library; not guessed or rewritten.' });
    continue;
  }
  const [, book, edition, figure] = owner;
  const figures = `${R}/${book}/editions/${edition}/figures`;
  const changes = [];
  const visit = (value, pointer = [], parent = null, key = null) => {
    if (Array.isArray(value)) {
      value.forEach((child, index) => visit(child, [...pointer, index], value, index));
    } else if (value && typeof value === 'object') {
      for (const [name, child] of Object.entries(value))
        visit(child, [...pointer, name], value, name);
    } else if (typeof value === 'string' && disposable(value)) {
      const expected = parent?.sha256;
      if (key !== 'path' || !/^[a-f0-9]{64}$/.test(expected ?? '')) {
        unresolved.push({ file, pointer, path: value,
          reason: 'No unambiguous current path/SHA binding; historical identity not rewritten.' });
        return;
      }
      const candidates = [];
      const durable = value.indexOf('ssot-resources/');
      if (durable >= 0) candidates.push(value.slice(durable));
      const basename = path.basename(value);
      if (/^fig-[^.]+\.(?:svg|png|spec\.json)$/.test(basename)) {
        candidates.push(`${figures}/${basename}`, `${R}/${book}/figures/${basename}`);
      }
      const parentName = pointer.at(-2);
      if (parentName === 'spec') candidates.push(`${figures}/${figure}.spec.json`);
      if (parentName === 'svg') candidates.push(`${figures}/${figure}.svg`);
      if (parentName === 'source' || parentName === 'image')
        candidates.push(`${R}/${book}/figures/${figure}.png`);
      const lesson = value.match(/\/adapt\/(9p|10p)\/([^/]+)\/lessons\/([^/]+)\/(lesson|exercises|figures)\.template\.json$/);
      if (lesson) candidates.push(`${R}/${lesson[1]}/editions/${lesson[2]}/lessons/${lesson[3]}/${lesson[4]}.json`);
      const matched = [...new Set(candidates)].find(candidate =>
        candidate.startsWith(`${R}/${book}/`) &&
        !/\.(?:render|review|independent-review)\.json$/.test(candidate) &&
        fs.existsSync(candidate) && bind(candidate).sha256 === expected);
      if (!matched) {
        unresolved.push({ file, pointer, path: value, expectedSha256: expected,
          reason: 'No byte-identical current immutable asset at an explicit candidate path.' });
        return;
      }
      parent[key] = matched;
      changes.push({ pointer, oldPath: value, current: bind(matched), sha256Changed: false });
    }
  };
  visit(after);
  if (!changes.length) continue;
  const restored = structuredClone(after);
  for (const change of changes) {
    let parent = restored;
    for (const key of change.pointer.slice(0, -1)) parent = parent[key];
    parent[change.pointer.at(-1)] = change.oldPath;
  }
  assert.deepEqual(restored, before);
  plans.push({ file, before, after, changes });
}
fs.mkdirSync(O, { recursive: true });
const repaired = [];
for (const plan of plans) {
  const before = bind(plan.file);
  const backup = `${O}/before/${path.relative(R, plan.file)}`;
  fs.mkdirSync(path.dirname(backup), { recursive: true });
  fs.copyFileSync(plan.file, backup, fs.constants.COPYFILE_EXCL);
  assert.equal(bind(backup).sha256, before.sha256);
  fs.writeFileSync(plan.file, JSON.stringify(plan.after, null, 2) + '\n');
  for (const change of plan.changes) assert.equal(bind(change.current.path).sha256, change.current.sha256);
  repaired.push({ before: { ...before, retained: bind(backup) }, after: bind(plan.file),
    changes: plan.changes, originalStatus: plan.before.status,
    semanticsAndAssertionsAndShaFieldsUnchanged: true });
}
const report = {
  stage: 'D511', status: 'PROVEN_EXACT_REVIEW_ASSET_PATHS_REPAIRED_UNRESOLVED_REFERENCES_HELD',
  originalAudit: bind(log), repaired, unresolved,
  boundary: 'Only path fields in independent-review metadata with an existing approved SHA and a byte-identical immutable current asset. No generated assets, spec edits, source edits, render/report hash substitution, or historical originalPath rewriting.',
  mathematicalOrVisualReviewsReplayed: false, originalReviewCopiesRetained: true,
  newCompleteCourses: 0, newSourcePages: 0, imagesOpened: 0, paidCalls: 0,
  wholeResourceAuditPass: false, formalHandoffComplete: false,
};
fs.writeFileSync(`${O}/repair.json`, JSON.stringify(report, null, 2) + '\n', { flag: 'wx' });
fs.copyFileSync(`${T}/tmp/d1816-recovery/repair-d511-exact-review-asset-paths.mjs`,
  `${O}/repair-asset-paths.mjs`, fs.constants.COPYFILE_EXCL);
const failed = `${T}/tmp/d1816-recovery/native/d511-exact-review-asset-path-repair`;
fs.mkdirSync(`${O}/failed-preflight`, { recursive: true });
for (const name of ['receipt.json', 'stdout.txt', 'stderr.txt', 'failed-preflight-script.mjs'])
  fs.copyFileSync(`${failed}/${name}`, `${O}/failed-preflight/${name}`, fs.constants.COPYFILE_EXCL);
const meterPath = `${T}/production-meter.json`;
const meter = read(meterPath);
assert.equal(meter.sourcePagesFinalized, 577);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 146);
meter.currentResume1816.D511 = {
  status: report.status, repair: bind(`${O}/repair.json`),
  metadataFilesChanged: repaired.length,
  provenAssetPathBindingsRepaired: repaired.reduce((sum, row) => sum + row.changes.length, 0),
  sourcePagesAdded: 0, completeCoursesAdded: 0, originalSemanticsAndShaFieldsUnchanged: true,
  parentNewImageOpens: 0, formalHandoffComplete: false,
};
fs.writeFileSync(meterPath, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ repair: bind(`${O}/repair.json`),
  changedMetadataFiles: repaired.length,
  exactAssetPathBindings: repaired.reduce((sum, row) => sum + row.changes.length, 0),
  unresolvedReferences: unresolved.length, semanticEdits: 0, newCompleteCourses: 0 }));
