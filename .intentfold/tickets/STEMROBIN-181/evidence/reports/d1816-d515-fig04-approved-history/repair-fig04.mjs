import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const R = 'ssot-resources/soviet10year-textbooks/artifacts';
const F = `${R}/9p/editions/modern-us-neutral/figures`;
const O = `${T}/evidence/reports/d1816-d515-fig04-approved-history`;
const approved = '115a011c3d9a5759fa4e1429e95d2f76b70ea07dab9d3a7df94974c91d575c00';
const current = 'bccf68e788137da6281707ddb2437f7fe7e5149e669aecf22dd76d1eb063b294';
const historical = `${T}/evidence/fig04-context/before/fig-04.spec.json`;
const restored = `${F}/approved-history/fig-04/${approved}.spec.json`;
const metadata = `${F}/fig-04.independent-review.json`;
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => ({ path: path.resolve(file), bytes: fs.statSync(file).size,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') });
const save = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
const retained = [];
const before = read(metadata);
assert.equal(before.spec.sha256, approved);
assert.equal(before.status, 'pass');
assert.equal(bind(historical).sha256, approved);
assert.equal(bind(`${F}/fig-04.spec.json`).sha256, current);
assert(!fs.existsSync(O));
assert(!fs.existsSync(restored));
const context = read(`${F}/fig-04.context-binding-independent-review.json`);
const contextReview = read(context.independentReview.path);
assert.equal(bind(context.independentReview.path).sha256, context.independentReview.sha256);
assert.equal(contextReview.historicalApproval.oldVisualApprovalIsNotCurrentSpecApproval, true);
assert.equal(contextReview.specComparison.completeSpecsDeepEqualAfterRemovingOnlyAuthoritativeText, true);
assert.equal(context.historicalSnapshots.spec.sha256, approved);
assert.equal(context.current.spec.sha256, current);
for (const value of Object.values(context.current))
  assert.equal(bind(value.path).sha256, value.sha256, value.path);
const preservedCurrent = Object.values(context.current).map(value => bind(value.path));
fs.mkdirSync(`${O}/before`, { recursive: true });
for (const file of [metadata, `${T}/review.md`, `${T}/production-meter.json`]) {
  const backup = `${O}/before/${path.basename(file)}`;
  fs.copyFileSync(file, backup, fs.constants.COPYFILE_EXCL);
  retained.push({ original: bind(file), retained: bind(backup) });
}
fs.mkdirSync(path.dirname(restored), { recursive: true });
fs.copyFileSync(historical, restored, fs.constants.COPYFILE_EXCL);
assert.equal(bind(restored).sha256, approved);
const after = structuredClone(before);
after.spec.path = restored;
fs.writeFileSync(metadata, JSON.stringify(after, null, 2) + '\n');
const reversed = structuredClone(read(metadata));
reversed.spec.path = before.spec.path;
assert.deepEqual(reversed, before);
const scope = `${T}/tmp/d1816-recovery/d515-affected-scope`;
const copied = `${scope}/9p/editions/modern-us-neutral/figures/fig-04.independent-review.json`;
fs.mkdirSync(path.dirname(copied), { recursive: true });
fs.copyFileSync(metadata, copied, fs.constants.COPYFILE_EXCL);
const check = JSON.parse(execFileSync('python3', ['-c',
  'import importlib.util,json,sys; from pathlib import Path; s=importlib.util.spec_from_file_location("validator",Path("ssot-resources/soviet10year-textbooks/validate.py")); v=importlib.util.module_from_spec(s); s.loader.exec_module(v); n=v.check_figure_metadata({"artifactRoot":sys.argv[1]}); a=importlib.util.spec_from_file_location("audit",Path("ssot-resources/audit.py")); m=importlib.util.module_from_spec(a); a.loader.exec_module(m); refs={p:list(m.json_tmp_references(json.loads(Path(p).read_text()))) for p in sys.argv[2:]}; print(json.dumps({"metadataChecked":n,"errors":v.errors,"disposableReferences":refs})); sys.exit(bool(v.errors) or any(refs.values()))',
  path.resolve(scope), metadata, restored,
], { cwd: repo, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 }));
assert.equal(check.metadataChecked, 1);
assert.deepEqual(check.errors, []);
for (const row of preservedCurrent) assert.equal(bind(row.path).sha256, row.sha256);
save(`${O}/repair.json`, {
  stage: 'D515', status: 'HISTORICAL_APPROVAL_BYTES_RESTORED_PATH_ONLY_PASS',
  originalFailure: bind(`${T}/evidence/reports/d1816-d512-review-preparation/native/d509-review-textbook-manifest-validation/stderr.txt`),
  approvedSnapshot: bind(historical), restoredApprovedResource: bind(restored),
  independentReviewBefore: retained[0], independentReviewAfter: bind(metadata),
  changedPointers: [['spec', 'path']], oldPath: before.spec.path, newPath: restored,
  approvedSha256Unchanged: approved, currentCanonicalSpecSha256Unchanged: current,
  contextPromotionEvidence: bind(`${F}/fig-04.context-binding-independent-review.json`),
  currentSourceLessonSpecSvgRenderPreserved: preservedCurrent,
  scopedExistingChecks: check,
  approvalBoundary: 'Historical visual review refers to exactly its original approved spec; current context approval remains separate. No other version inherits historical PASS.',
  newApprovalClaimed: false, sourceOrGeometryChanges: false,
  sourceOrDisplayReviewReplayed: false, validatorsChanged: false,
  imagesOpened: 0, paidCalls: 0, newCompleteCourses: 0, newSourcePages: 0,
  globalAuditReplayed: false, allAcceptanceCriteriaMet: false, formalHandoffComplete: false,
});
const reviewFile = `${T}/review.md`;
let review = fs.readFileSync(reviewFile, 'utf8');
const oldGate = '| 正式机械门禁 | fig04 批准 SHA 不一致；旧资源／溯源引用和其他脏稿重复图仍未全部解决 |';
assert(review.includes(oldGate));
review = review.replace(oldGate,
  '| 正式机械门禁 | fig04 的历史批准字节已恢复并修正路径；其余旧资源／溯源引用和其他脏稿重复图尚未全部解决 |');
const heading = '## 机械检查';
assert(review.includes(heading));
review = review.replace(heading,
  `## 资源续修\n\nD515：恢复 fig04 的原批准 FigureSpec（115a011…），历史审查仅改路径，批准 SHA 不变；现存上下文版（bccf68e…）、源图、SVG 和审批均未覆盖。现有校验器只检查受影响绑定，通过。D512 的 HOLD 清单是当时记录，其中 fig04 路径项由本次证据更新，不代表其他 HOLD 已解除。\n\n[fig04 原批准字节与受影响检查](${path.resolve(`${O}/repair.json`)})\n\n${heading}`);
fs.writeFileSync(reviewFile, review);
const meterPath = `${T}/production-meter.json`;
const meter = read(meterPath);
assert.equal(meter.sourcePagesFinalized, 577);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 146);
assert.deepEqual(meter.currentCheckpoint.completeUnbatchedCards, []);
const oldReviewBinding = structuredClone(meter.currentResume1816.D512.review);
const reviewBackup = `${O}/before/review.md`;
assert.equal(bind(reviewBackup).sha256, oldReviewBinding.sha256);
meter.currentResume1816.D512.review.path = path.resolve(reviewBackup);
meter.currentResume1816.D515 = {
  status: 'FIG04_HISTORICAL_SHA_GATE_RESOLVED_ORIGINAL_APPROVAL_UNCHANGED',
  repair: bind(`${O}/repair.json`), review: bind(reviewFile),
  historicalReviewOnlyPathChanged: true, currentCanonicalSpecUnchanged: true,
  historicalD512ReviewBindingPreserved: { before: oldReviewBinding, retained: bind(reviewBackup) },
  sourcePagesAdded: 0, completeCoursesAdded: 0, parentNewImageOpens: 0, paidCalls: 0,
  formalHandoffComplete: false, allAcceptanceCriteriaMet: false,
};
meter.currentResume1816.currentContinuation +=
  ' D515 fig04 original approved115a011 spec bytes found in retained before-snapshot, restored under SSOT approved-history, historical independent-review spec.path repaired only; currentbccf68 context spec/source/lesson/SVG/render unchanged. Existing affected metadata/resource checks PASS, no review replay or inherited approval. Continue other deterministically recoverable 9p/10p provenance references.';
fs.writeFileSync(meterPath, JSON.stringify(meter, null, 2) + '\n');
fs.copyFileSync(`${T}/tmp/d1816-recovery/repair-d515-fig04-approved-history.mjs`,
  `${O}/repair-fig04.mjs`, fs.constants.COPYFILE_EXCL);
console.log(JSON.stringify({ report: bind(`${O}/repair.json`), check,
  changedPathFields: 1, approvedSha256Unchanged: approved,
  currentCanonicalSpecUnchanged: true, completeCoursesAdded: 0 }));
