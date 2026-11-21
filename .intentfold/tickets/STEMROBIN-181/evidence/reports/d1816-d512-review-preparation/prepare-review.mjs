import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const E = `${T}/evidence/reports`;
const O = `${E}/d1816-d512-review-preparation`;
const N = `${T}/tmp/d1816-recovery/native`;
const R = 'ssot-resources/soviet10year-textbooks/artifacts';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => ({
  path: path.resolve(file), bytes: fs.statSync(file).size,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),
});
const save = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
assert(!fs.existsSync(O));
const specRepair = read(`${E}/d1816-d510-exact-spec-binding-repair/repair.json`);
const assetRepair = read(`${E}/d1816-d511-exact-review-asset-paths/repair.json`);
const subset = read(`${E}/d1816-d508-n153-final-bindings/final-bindings.json`);
const names = [
  'd507-current-live181-review-scope', 'd508-n153-final-durable-bindings',
  'd509-review-resource-boundary-audit', 'd509-review-textbook-manifest-validation',
  'd509-review-content-db-unit-tests', 'd509-review-app-unit-tests', 'd509-review-app-build',
  'd510-exact-spec-path-repair', 'd511a-standard-library-exact-path-repair',
];
const receipts = names.map(name => ({ name, ...read(`${N}/${name}/receipt.json`) }));
const required = receipts.filter(row => row.name.startsWith('d509-'));
assert.deepEqual(required.map(row => row.exitCode), [1, 1, 0, 0, 0]);
const earliest = new Map();
const pointers = new Map();
const remember = (file, backup, changes) => {
  if (!earliest.has(file)) earliest.set(file, backup);
  pointers.set(file, [...(pointers.get(file) ?? []), ...changes]);
};
for (const row of specRepair.changes) remember(row.after.path, row.before.retained.path, [
  { pointer: ['spec', 'path'], oldPath: row.oldSpecBinding.path },
]);
for (const row of assetRepair.repaired)
  remember(row.after.path, row.before.retained.path, row.changes);
const scopeRoot = `${T}/tmp/d1816-recovery/d512-affected-metadata-scope`;
assert(!fs.existsSync(scopeRoot));
const affected = [];
for (const [file, backup] of earliest) {
  const current = read(file);
  const restored = structuredClone(current);
  for (const change of [...pointers.get(file)].reverse()) {
    let parent = restored;
    for (const key of change.pointer.slice(0, -1)) parent = parent[key];
    parent[change.pointer.at(-1)] = change.oldPath;
  }
  assert.deepEqual(restored, read(backup), 'Only the recorded path fields may differ');
  const target = `${scopeRoot}/${path.relative(path.resolve(R), file)}`;
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(file, target, fs.constants.COPYFILE_EXCL);
  affected.push({ current: bind(file), originalRetained: bind(backup),
    changedPointers: pointers.get(file).map(row => row.pointer) });
}
const check = execFileSync('python3', [
  '-c',
  'import importlib.util,json,sys; from pathlib import Path; p=Path("ssot-resources/soviet10year-textbooks/validate.py"); s=importlib.util.spec_from_file_location("textbook_validator",p); m=importlib.util.module_from_spec(s); s.loader.exec_module(m); n=m.check_figure_metadata({"artifactRoot":sys.argv[1]}); print(json.dumps({"checked":n,"errors":m.errors,"scope":"changed metadata only; original source/spec/output files read from the real repository"})); sys.exit(bool(m.errors))',
  path.resolve(scopeRoot),
], { cwd: repo, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
const scopedCheck = JSON.parse(check);
assert.deepEqual(scopedCheck.errors, []);
const meterPath = `${T}/production-meter.json`;
const meter = read(meterPath);
assert.equal(meter.sourcePagesFinalized, 577);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 146);
assert.deepEqual(meter.currentCheckpoint.completeUnbatchedCards, []);
const ticket = read(`${T}/ticket.json`);
assert.equal(ticket.finish, 'review');
assert.equal(ticket.stage, 'developing');
const live = read(`${N}/d507-current-live181-review-scope/stdout.txt`);
assert.equal(live.sequence_id, 181);
assert.equal(live.state_group, 'started');
const holds = [
  { item: 'N153 / phy10-c4-s3', reason: 'Source2 outflow/model and source10 literal glyph identity unresolved; full61 native binding also lacks fig08.',
    evidence: bind(`${E}/d1816-d508-n153-final-bindings/final-bindings.json`),
    approvedSubset: { readonlyPerLocale: 59, choicesPerLocale: 55, optionsPerLocale: 220 },
    wholeCourseDelivered: false },
  { item: '9p N75 / phy9-c2-s2-n75', reason: 'SOURCE187 faint additional mark after the q subscript remains unidentified; no science-based glyph guess.',
    evidence: bind(`${E}/d1816-d049-source187-hold/retained.json`), wholeCourseDelivered: false },
  { item: '10p N75', reason: 'Retained terminal fig164 failure, fig165 omitted internal marks, and fig166-171 source/detail/semantic holds.',
    checkpointKey: 'activeHumanDirection.nextSourceCheckpoints.n75', wholeCourseDelivered: false },
  { item: '10p N78 / fig181', reason: 'Paid output is missing; no repurchase or fabricated replacement. Fig182 terminal collision is also retained.',
    checkpointKey: 'activeHumanDirection.nextSourceCheckpoints.n78', wholeCourseDelivered: false },
  { item: 'exercise14 and other prior local HOLDs', reason: 'Not cleared by D500, path relocation, or this review package.',
    checkpointKey: 'currentCheckpoint / retained evidence', wholeCourseDelivered: false },
  { item: '7-9pr / 10-11pr', reason: 'Lawful complete usable sources remain unavailable; probability scope is not complete or published.',
    checkpointKey: 'probabilityStatus', wholeCourseDelivered: false },
  { item: '9p fig04 approval binding', reason: 'Current canonical FigureSpec SHA differs from the approved spec SHA; unchanged, not substituted.',
    evidence: specRepair.held[0].file, wholeCourseDelivered: false },
  { item: 'Remaining resource/provenance references', reason: 'Original resource audit failed. Unresolved historical identity, missing assets, and other dirty duplicate files are not silently rewritten or deleted.',
    evidence: bind(`${E}/d1816-d511-exact-review-asset-paths/repair.json`), wholeResourceAuditPassed: false },
];
const activeStages = meter.activeHumanDirection.nextSourceCheckpoints;
const currentUnresolved = Object.entries(activeStages).filter(([key, value]) =>
  /^[nt]\d+$/.test(key) && value?.completeCard === false).map(([key, value]) => ({
    key, status: value.status ?? null,
    facts: Object.fromEntries(Object.entries(value).filter(([name, fact]) =>
      typeof fact === 'string' && /hold|fail|missing|terminal|unresolved/i.test(fact))),
    authority: `activeHumanDirection.nextSourceCheckpoints.${key}`,
  }));
fs.mkdirSync(O, { recursive: true });
for (const name of names) {
  fs.mkdirSync(`${O}/native/${name}`, { recursive: true });
  for (const file of ['receipt.json', 'stdout.txt', 'stderr.txt'])
    fs.copyFileSync(`${N}/${name}/${file}`, `${O}/native/${name}/${file}`, fs.constants.COPYFILE_EXCL);
}
save(`${O}/affected-bindings-check.json`, { status: 'PASS_CHANGED_PATHS_ONLY',
  affected, scopedCheck, noImagesOpened: true, sourceOrFigureSemanticsChanged: false,
  fullCorpusValidationReplayed: false, originalGlobalFailuresRetained: true });
save(`${O}/hold-register.json`, { status: 'EXPLICIT_UNDELIVERED_HOLDS_NOT_FULL_SCOPE_ACCEPTANCE',
  holds, currentUnresolved, scopeIsNotExhaustiveCorpusCertification: true });
save(`${O}/review-package.json`, {
  stage: 'D512', status: 'REVIEW_PACKAGE_PREPARED_FORMAL_HANDOFF_BLOCKED',
  preparedAt: new Date().toISOString(), ticket: 'STEMROBIN-181', finish: 'review',
  branch: 'codex/STEMROBIN-181-textbooks',
  previouslyVerifiedCheckpoint: 'd66fa86e177df73dc2feefa14f6986434a9b6cf4',
  existingMeter: { deliveredCourses: 146, sourcePagesFinalized: 577,
    conventionReusedWithoutRecount: true, D500NewCompleteCourses: 1, D500NewLocalSourcePages: 2,
    D482SixPagesNotRecounted: true },
  newCompleteCoursesThisContinuation: 0, newSourcePagesThisContinuation: 0,
  subsetBindings: bind(`${E}/d1816-d508-n153-final-bindings/final-bindings.json`),
  scopedMechanicalCheck: bind(`${O}/affected-bindings-check.json`),
  holds: bind(`${O}/hold-register.json`), mechanicalReceipts: required,
  authoritativeLiveTicket: bind(`${O}/native/d507-current-live181-review-scope/stdout.txt`),
  fullProjectRequiredCommandsRunOnce: true, mechanicalDefenceStatus: 'FAIL_RESOURCE_GATES',
  appTestsPassed: 131, contentDbTestsPassed: 4, appBuildPassed: true,
  contentAndDisplayApprovalsReused: true, fullBatchDisplayOrReviewReplayed: false,
  imageOpens: 0, paidCalls: 0, providerTokens: null, providerCost: null,
  formalHandoffComplete: false, allAcceptanceCriteriaMet: false,
  databaseWrites: false, publisher: false, merge: false, deploy: false, closure: false,
  backendStateChanged: false, supervisorOrPeerMessagesSent: false,
});
fs.copyFileSync(`${T}/tmp/d1816-recovery/prepare-d512-review-with-holds.mjs`,
  `${O}/prepare-review.mjs`, fs.constants.COPYFILE_EXCL);
const link = (label, file) => `[${label}](${path.resolve(file)})`;
const surfaceLinks = locale => subset.locales.find(row => row.locale === locale).surfaces
  .filter(row => row.viewport === 'mobile')
  .map(row => link(({ written: '书写题', answers: '只读答案', choices: '选择题' })[row.surface], row.html.path))
  .join(' · ');
const reviewFile = `${T}/review.md`;
assert(!fs.existsSync(reviewFile), 'Do not overwrite an existing review or frozen handoff');
const review = `# STEMROBIN-181 Review

已交付成果可复用；整单正式 handoff 仍受内容 HOLD 和资源机械检查阻断。工单保持 In Progress，finish=review，未合并、发布或关闭。

## 可查看成果

2026-11-21 检查点沿用现有计量：146 门已推送完整课程、577 页已消费源页。D500 新增 1 门双语实验作业课程和 2 页本地新源页；D482 的 6 页未重复计数。这不是全库完整性统计。

| 材料 | 中文 | English | 交付边界 |
| --- | --- | --- | --- |
| 10p 实验作业，10 个实验 | ${link('课程', `${E}/d1816-d500-laboratory-complete-course/offline/zh/text.html`)} | ${link('Course', `${E}/d1816-d500-laboratory-complete-course/offline/en/text.html`)} | 已提交 c2a90ab、检查点 d66fa86e；既有必要门禁及 DISPLAY PASS 复用 |
| N153 已批准子集 | ${surfaceLinks('zh')} | ${surfaceLinks('en')} | 每语言 59 条只读答案、55 题／220 选项；整课未交付 |

${link('N153 最终路径与 SHA 绑定', `${E}/d1816-d508-n153-final-bindings/final-bindings.json`)} · ${link('既有计量及未决记录', meterPath)} · ${link('本轮 review 包', `${O}/review-package.json`)}

## 必须保留的未交付项

| 范围 | HOLD |
| --- | --- |
| N153 | 第 2 题模型、第 10 题字形及 fig08 依赖；不得强行全课 finalize |
| 9p N75 | 第 187 页 q 下标后的低墨迹符号仍无法确定 |
| 10p N75 | 原图内部标记、科学语义及既有终止图门禁 |
| 10p N78 | fig181 缺付费输出；fig182 既有终止失败；不重购 |
| exercise14 及其他旧 HOLD | 保持原记录，不因路径修复或实验课交付而批准 |
| 两册概率 | 缺合法完整可用源，不编造、不记为完成 |
| 正式机械门禁 | fig04 批准 SHA 不一致；旧资源／溯源引用和其他脏稿重复图仍未全部解决 |

${link('HOLD 清单及当前未决课程记录', `${O}/hold-register.json`)}。该清单不把未调查材料写成已经完整验收。

## 本轮实际续作

- 修正 currentContinuation 的 145／575 旧描述，沿用 146／577 既有计量，不重数。
- 绑定 N153 的 8 个源快照别名和 12 个既有页面，使用修正后的英文手机页面。
- 修复 24 条 FigureSpec 路径及 111 条独立审查资源路径，仅在原 SHA 匹配时改路径；保留原 JSON。
- 备份并移出实验页下 2 份未跟踪、字节相同的重复图；其他脏稿不动。

## 机械检查

| 检查 | 结果 |
| --- | --- |
| 应用单测 | 131 项通过 |
| 数据库配置单测 | 4 项通过；未连接或写入共享数据库 |
| 应用构建 | 通过 |
| 资源边界审计 | 初次失败保留，未重复全库执行 |
| 教材清单／图 metadata 校验 | 初次失败保留，未重复全库执行 |
| 本轮修改的绑定 | 现有校验器受影响范围通过；不代表全库通过 |

${link('受影响绑定检查', `${O}/affected-bindings-check.json`)} · ${link('原检查回执与失败输出', `${O}/review-package.json`)}

正式 handoff 未完成，全部 AC 未通过。既有有效分支、内容、独立审查、费用及备份均保留；本轮未开启新工人、未重跑内容或显示审查，未发消息给监督或同伴。
`;
fs.writeFileSync(reviewFile, review, { flag: 'wx' });
save(`${O}/content-brief.json`, {
  reader: 'The user reviewing delivered material and deciding how to resolve remaining HOLDs.',
  jobStory: 'When reviewing this long-running ticket, I need to open the approved work and distinguish it from blocked material so that I do not integrate unapproved content.',
  evidence: 'Current direct user continuation and live STEMROBIN-181 finish=review criteria.',
  question: 'Which actual files can be reviewed now, and which scope is still blocked?',
  priority: ['Openable approved materials', 'Undelivered HOLDs', 'Actual continuation work', 'Required mechanical outcomes'],
  omitted: ['Duplicated content reviews', 'Paid generation', 'Entire historical ledger', 'Invented full-scope completion'],
});
meter.currentCheckpoint.fullProjectTestsOrBuildRunOnResume = true;
meter.currentResume1816.D509 = {
  status: 'FORMAL_REVIEW_PREPARATION_MECHANICAL_DEFENCE_RESOURCE_GATES_FAIL',
  requiredCommandsRunOnce: true, appTestsPassed: 131, contentDbTestsPassed: 4, appBuildPassed: true,
  resourceAuditPassed: false, textbookValidationPassed: false,
  originalReceipts: bind(`${O}/review-package.json`), databaseWrites: false,
};
meter.currentResume1816.D512 = {
  status: 'REVIEW_PACKAGE_PREPARED_FORMAL_HANDOFF_BLOCKED',
  review: bind(reviewFile), package: bind(`${O}/review-package.json`),
  affectedBindings: bind(`${O}/affected-bindings-check.json`),
  explicitHolds: bind(`${O}/hold-register.json`),
  sourcePagesAdded: 0, completeCoursesAdded: 0, allAcceptanceCriteriaMet: false,
  formalHandoffComplete: false, parentNewImageOpens: 0, paidCalls: 0,
};
meter.currentResume1816.currentContinuation +=
  ' D508 approved N153 subset final durable bindings complete. D510/D511 repaired24 spec paths and111 exact-SHA asset paths without source/spec/image/semantic changes; original records preserved. D509 app131 tests/contentDB4 tests/build PASS, resource audit and textbook validation original FAIL retained. D512 existing-validator affected-binding check PASS and review package prepared with explicit uncompleted HOLDs; no full-scope formal handoff or closure.';
fs.writeFileSync(meterPath, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ review: bind(reviewFile), package: bind(`${O}/review-package.json`),
  affectedMetadataCheck: scopedCheck, formalHandoffComplete: false,
  newCompleteCourses: 0, existingDeliveredCourses: 146, existingSourcePages: 577 }));
