import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/evidence/reports/d1816-d517-retained-provenance`;
const R = 'ssot-resources/soviet10year-textbooks/artifacts';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => ({ path: path.resolve(file), bytes: fs.statSync(file).size,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') });
const save = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
const plan = read(`${O}/plan.json`);
assert.equal(plan.plans.length, 249);
assert(plan.plans.every(row => !row.copyRequired));
assert(!fs.existsSync(`${O}/repair.json`));
const originals = new Map();
const changed = new Map();
const earliest = [];
for (const row of plan.plans) {
  assert(row.file.startsWith(`${R}/9p/`) || row.file.startsWith(`${R}/10p/`));
  assert(row.target.startsWith(`${T}/evidence/`));
  assert.equal(bind(row.target).sha256, row.expectedSha256);
  if (!originals.has(row.file)) {
    originals.set(row.file, read(row.file));
    changed.set(row.file, structuredClone(originals.get(row.file)));
  }
  let parent = changed.get(row.file);
  for (const key of row.pointer.slice(0, -1)) parent = parent[key];
  assert.equal(parent.sha256, row.expectedSha256);
  assert.equal(parent.path, row.oldPath);
  parent.path = row.target;
}
const meterPath = `${T}/production-meter.json`;
fs.mkdirSync(`${O}/before`, { recursive: true });
fs.copyFileSync(meterPath, `${O}/before/production-meter.json`, fs.constants.COPYFILE_EXCL);
for (const [file, value] of changed) {
  const backup = `${O}/before/${path.relative(R, file)}`;
  fs.mkdirSync(path.dirname(backup), { recursive: true });
  fs.copyFileSync(file, backup, fs.constants.COPYFILE_EXCL);
  earliest.push({ file, backup, before: bind(backup) });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n');
  const reversed = structuredClone(read(file));
  for (const row of plan.plans.filter(row => row.file === file)) {
    let parent = reversed;
    for (const key of row.pointer.slice(0, -1)) parent = parent[key];
    parent.path = row.oldPath;
  }
  assert.deepEqual(reversed, originals.get(file));
}
const scope = `${T}/tmp/d1816-recovery/d518-affected-scope`;
for (const file of changed.keys()) {
  const copied = `${scope}/${path.relative(R, file)}`;
  fs.mkdirSync(path.dirname(copied), { recursive: true });
  fs.copyFileSync(file, copied, fs.constants.COPYFILE_EXCL);
}
save(`${O}/affected-inputs.json`, { earliest, changes: plan.plans });
const scoped = JSON.parse(execFileSync('python3', ['-c',
  'import importlib.util,json,sys; from pathlib import Path; s=importlib.util.spec_from_file_location("validator",Path("ssot-resources/soviet10year-textbooks/validate.py")); v=importlib.util.module_from_spec(s); s.loader.exec_module(v); n=v.check_figure_metadata({"artifactRoot":sys.argv[1]}); s=importlib.util.spec_from_file_location("audit",Path("ssot-resources/audit.py")); a=importlib.util.module_from_spec(s); s.loader.exec_module(a); d=json.loads(Path(sys.argv[2]).read_text()); rows=[]; beforeCount=afterCount=0; changedCount=len(d["changes"]); remaining=[]\nfor r in d["earliest"]:\n b=list(a.json_tmp_references(json.loads(Path(r["backup"]).read_text()))); c=list(a.json_tmp_references(json.loads(Path(r["file"]).read_text()))); beforeCount+=len(b); afterCount+=len(c); remaining.extend({"file":r["file"],"pointer":p,"path":x} for p,x in c); rows.append({"file":r["file"],"beforeDisposable":len(b),"afterDisposable":len(c)})\nprint(json.dumps({"metadataChecked":n,"metadataErrors":v.errors,"scope":"changed metadata only","beforeDisposable":beforeCount,"afterDisposable":afterCount,"removedDisposable":beforeCount-afterCount,"expectedChangedBindings":changedCount,"affectedScopeResourceAuditPassed":afterCount==0,"remainingAffectedReferences":remaining,"files":rows})); sys.exit(bool(v.errors) or beforeCount-afterCount!=changedCount)',
  path.resolve(scope), `${O}/affected-inputs.json`,
], { cwd: repo, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 }));
assert.deepEqual(scoped.metadataErrors, []);
assert.equal(scoped.removedDisposable, 249);
save(`${O}/affected-check.json`, scoped);
save(`${O}/repair.json`, {
  stage: 'D518', status: 'EXACT_RETAINED_PROVENANCE_PATHS_REPAIRED_REMAINING_REFERENCES_VISIBLE',
  plans: bind(`${O}/plan.json`), changes: plan.plans,
  before: earliest, after: [...changed.keys()].map(bind),
  affectedCheck: bind(`${O}/affected-check.json`),
  originalGlobalAuditFailure: bind(`${T}/evidence/reports/d1816-d512-review-preparation/native/d509-review-resource-boundary-audit/stderr.txt`),
  immutableOriginalShaFieldsStatusesAndSemanticsPreserved: true,
  historicalSnapshotsNotCurrentCourseCertification: true,
  unresolvedExpectedShaReferences: plan.unresolved.length,
  noShaHistoricalPointersNotRewritten: true,
  parentImagesOpened: 0, paidCalls: 0, newCompleteCourses: 0, newSourcePages: 0,
  globalAuditReplayed: false, allAcceptanceCriteriaMet: false, formalHandoffComplete: false,
});
fs.copyFileSync(`${T}/tmp/d1816-recovery/repair-d518-retained-provenance.mjs`,
  `${O}/repair-retained-provenance.mjs`, fs.constants.COPYFILE_EXCL);
const meter = read(meterPath);
assert.equal(meter.sourcePagesFinalized, 577);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 146);
assert.deepEqual(meter.currentCheckpoint.completeUnbatchedCards, []);
meter.currentResume1816.D518 = {
  status: '249_EXACT_RETAINED_PROVENANCE_PATHS_REPAIRED_NO_APPROVAL_CHANGES',
  repair: bind(`${O}/repair.json`), affectedCheck: bind(`${O}/affected-check.json`),
  metadataFilesChanged: changed.size, exactPathBindingsRepaired: 249,
  unresolvedExpectedShaReferences: plan.unresolved.length,
  affectedScopeResourceAuditPassed: scoped.affectedScopeResourceAuditPassed,
  sourcePagesAdded: 0, completeCoursesAdded: 0, parentNewImageOpens: 0, paidCalls: 0,
  allAcceptanceCriteriaMet: false, formalHandoffComplete: false,
};
meter.currentResume1816.currentContinuation +=
  ' D518 repaired249 additional 9p/10p provenance path bindings in47 existing review files to retained exact-SHA snapshots; statuses/sha/semantics unchanged, existing scoped metadata check PASS, residual affected disposable references retained. No corpus audit/content/display replay. Continue182 unresolved SHA references and explicitly unsupported historical pointers without blocking on a single figure.';
fs.writeFileSync(meterPath, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ repair: bind(`${O}/repair.json`), pathBindingsRepaired: 249,
  affectedMetadataFiles: changed.size, metadataCheckErrors: scoped.metadataErrors,
  remainingAffectedDisposableReferences: scoped.afterDisposable,
  affectedScopeResourceAuditPassed: scoped.affectedScopeResourceAuditPassed,
  newCompleteCourses: 0 }));
