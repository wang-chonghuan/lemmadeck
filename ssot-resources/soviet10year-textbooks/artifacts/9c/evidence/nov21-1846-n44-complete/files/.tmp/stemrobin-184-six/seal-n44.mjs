import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), repo);
const base = path.join(repo, '.tmp/stemrobin-184-six');
const usagePath = path.join(repo, '.intentfold/tickets/STEMROBIN-184/usage.json');
const progressPath = path.join(base, 'source-progress.json');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const verify = expected => {
  const actual = bind(expected.path);
  assert.equal(actual.bytes, expected.bytes);
  assert.equal(actual.sha256, expected.sha256);
  return actual;
};
const writeNew = (file, value) => fs.writeFileSync(file,
  JSON.stringify(value, null, 2) + '\n', { flag: 'wx', mode: 0o444 });
const usage = read(usagePath);
const progress = read(progressPath);
const save = (key, entry) => {
  assert(!Object.hasOwn(usage, key));
  usage[key] = entry;
  progress.observed_at = entry.at;
  fs.writeFileSync(usagePath, JSON.stringify(usage, null, 2) + '\n');
  fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2) + '\n');
  console.log(JSON.stringify(entry));
};
const agent = '01a1fb7b-8cb8-7971-aae0-1b0d8b047509';
const intakePath = path.join(base, 'n44-offline-parent-intake.json');
const retained = path.join(repo,
  'ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov21-1846-n44-offline');

if (process.argv[2] === 'offline') {
  assert(!fs.existsSync(intakePath));
  assert(!fs.existsSync(retained));
  const root = path.join(base, 'n44-offline');
  const reportPath = path.join(root, 'report.json');
  const reportBinding = bind(reportPath);
  assert.equal(reportBinding.sha256,
    'cece01b409653569b94f296124dd97aab5e8e163032b713118cfc3ce5fc13470');
  const report = read(reportPath);
  assert.equal(report.stageExit, 0);
  assert.equal(report.assertionVerdict, 'PASS');
  assert.equal(report.visualVerdict, 'PASS');
  assert.deepEqual(report.failures, []);
  assert.equal(report.accounting.actualImageToolViews, 6);
  assert.equal(report.accounting.originalSourceImageViewsOrDecodes, 0);
  assert.equal(report.network.remoteDependencies, 0);
  assert.equal(report.screenshots.length, 6);
  const inputs = Object.values(report.bindings.inputs).map(verify);
  const outputs = Object.entries(report.bindings)
    .filter(([key]) => key !== 'inputs').map(([, value]) => verify(value));
  const screenshots = report.screenshots.map(screenshot => {
    assert.equal(screenshot.actualToolViews, 1);
    assert.equal(screenshot.visualVerdict, 'PASS');
    return { ...screenshot, binding: verify(screenshot) };
  });
  assert.equal(screenshots.reduce((sum, item) => sum + item.bytes, 0), 512245);
  const receipt = read(report.bindings.receipt.path);
  assert.equal(receipt.cwd, repo);
  assert.equal(receipt.exitCode, 0);
  fs.mkdirSync(retained);
  const rows = [];
  const copy = source => {
    const relative = path.relative(repo, source.path);
    assert(!relative.startsWith('..'));
    const target = path.join(retained, 'files', relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(source.path, target, fs.constants.COPYFILE_EXCL);
    fs.chmodSync(target, 0o444);
    const actual = bind(target);
    assert.equal(actual.sha256, source.sha256);
    assert.equal(actual.bytes, source.bytes);
    rows.push({ origin: source.path, path: path.relative(retained, target),
      bytes: actual.bytes, sha256: actual.sha256 });
  };
  const unique = new Map([...inputs, ...outputs, reportBinding,
    ...screenshots.map(item => item.binding)].map(item => [item.path, item]));
  for (const item of unique.values()) copy(item);
  const entry = { at: new Date().toISOString(), agent, name: 'Helmholtz',
    status: 'FULL_OFFLINE_PRESENTATION_PASS_INTAKEN_AND_RETAINED_READY_FOR_CLOSE',
    report: reportBinding, inputs, outputs, screenshots,
    fullTextAlreadyConsumed: ['253ad7', '7d00c9', '85b35c', '3c8bf4'],
    newlyReadImagePayloads: 0, parentRasterViewsOrDecodes: 0,
    parentBudget: 'Permanent24/24; not reset',
    historicalNativeBudget: 'technical4/8; known7/page; unchanged',
    reviewerImageBudget: '6/8 batch;6/24 context; no new views',
    preservedHistoricalPendingFields: true,
    choiceReviewKind: 'self_review', newChoiceMathematicsApproval: false,
    completedLessonDelta: 0, completeGroup: false, finish: 'review',
    stageReplays: 0, GitDBPaidPublishMergeDeployTicketClosure: 0 };
  writeNew(intakePath, entry);
  copy(bind(intakePath));
  writeNew(path.join(retained, 'manifest.json'), {
    schema: 's10y-evidence-retention@1', lesson: 'ana9-c4-s2-n44',
    status: 'OFFLINE_PRESENTATION_PASS_ONLY_NOT_COMPLETE_LESSON',
    copied: rows.length, bytes: rows.reduce((sum, row) => sum + row.bytes, 0),
    rawByteCopyAndHashNotImageDecoding: true, rows });
  entry.intake = bind(intakePath);
  entry.retainedManifest = bind(path.join(retained, 'manifest.json'));
  progress.n44.offline = { ...progress.n44.offline, agent,
    status: entry.status, closed: false, intake: entry.intake,
    retainedManifest: entry.retainedManifest,
    assertionVerdict: 'PASS', visualVerdict: 'PASS' };
  progress.n44.status = 'OFFLINE_PASS_INTAKEN_CHOICE_INDEPENDENCE_PENDING';
  progress.status = '1846 n44 offline PASS retained; close Helmholtz then one bounded choice independent review';
  save('nov21_1846_n44_offline_FULL_intake_and_retention', entry);
} else if (process.argv[2] === 'offline-close') {
  assert.equal(progress.n44.offline.closed, false);
  const intake = bind(intakePath);
  verify(progress.n44.offline.intake);
  const entry = { at: new Date().toISOString(), agent, name: 'Helmholtz',
    status: 'ACTUALLY_CLOSED_AFTER_FULL_OFFLINE_INTAKE',
    toolReceipt: process.argv[3],
    actualClosure: 'close_agent returned completed after FULL hash-bound text intake and retention',
    intake, parentRasterViewsOrDecodes: 0, nativeBudgetUnchanged: true };
  assert(entry.toolReceipt);
  const closure = path.join(base, 'n44-offline-closure.json');
  writeNew(closure, entry);
  fs.copyFileSync(closure, path.join(retained, 'closure.json'), fs.constants.COPYFILE_EXCL);
  fs.chmodSync(path.join(retained, 'closure.json'), 0o444);
  progress.n44.offline.closed = true;
  progress.n44.offline.closure = bind(closure);
  progress.n44.offline.status = entry.status;
  save('nov21_1846_n44_offline_reviewer_actual_closure', entry);
} else if (process.argv[2] === 'choice-packets') {
  assert.equal(progress.n44.offline.closed, true);
  const target = path.join(repo,
    'ssot-resources/soviet10year-textbooks/artifacts/9c/editions/modern-us-neutral/lessons/ana9-c4-s2-n44/choice-set');
  const draftPath = path.join(target, 'draft.json');
  const seedPath = path.join(target, 'seed.json');
  verify(progress.n44.files.find(item => item.path === draftPath));
  verify(progress.n44.files.find(item => item.path === seedPath));
  const draft = read(draftPath);
  const seed = read(seedPath);
  assert.equal(seed.figures.length, 0);
  assert.equal(draft.new_figures.length, 0);
  const directory = path.join(base, 'n44-choice-independent');
  fs.mkdirSync(directory);
  fs.copyFileSync(seedPath, path.join(directory, 'source-seed.json'), fs.constants.COPYFILE_EXCL);
  fs.chmodSync(path.join(directory, 'source-seed.json'), 0o444);
  writeNew(path.join(directory, 'view-only.json'),
    draft.questions.map(({ id, view }) => ({ id, view })));
  writeNew(path.join(directory, 'packet-bindings.json'), {
    seed: bind(seedPath), draft: bind(draftPath),
    sourcePacket: bind(path.join(directory, 'source-seed.json')),
    visiblePacket: bind(path.join(directory, 'view-only.json')),
    seedCanonical: '6c973ae2b14ffa33c58cc6df92f8af945368567753b2864b7ab533a86f7e42f1',
    draftCanonical: 'fbe0d46b0c34ae68b4b35c335bfe7a40db9608d3e575364e23d6c4c9e8ecf710',
    originalReviewKind: 'self_review',
    stages: ['source-first independent solution', 'view-first fidelity and every option',
      'key-last complete draft and coverage comparison'],
    originalScanImagesOrNativeReplaysAuthorized: 0 });
  console.log(JSON.stringify({ directory, sourcePacket: 'source-seed.json',
    visiblePacket: 'view-only.json', figures: 0, imagesAuthorized: 0 }));
} else if (process.argv[2] === 'source-dispatch') {
  assert.equal(progress.n44.completeLessonDelta, 1);
  assert.equal(progress.n44.independentChoice.closed, true);
  assert(!Object.hasOwn(progress, 'source164165'));
  const entry = { at: new Date().toISOString(), agent: process.argv[3],
    name: process.argv[4], status: 'SEQUENTIAL_SOURCE164165_ACTUALLY_DISPATCHED',
    assignment: bind(path.join(base, 'source164165-source-assignment.txt')),
    root: path.join(base, 'source164165-source'),
    pages: [164, 165], executionOrder: '164 freeze then165 freeze;no166',
    freshBatchLimit: 8, contextLimit: 24, roisOrReopensAuthorized: 0,
    parentImagesOrDecodes: 0, parentBudget: 'Permanent24/24;not reset',
    inheritedNativeBudget: 'technical4/8;known7/page162163;unchanged',
    n44Completion: verify(progress.n44.completion.completion),
    GitMutation: 0, unfinishedOutputs: 'UNREAD_UNTIL_COMPLETION', closed: false };
  assert(entry.agent && entry.name);
  writeNew(path.join(base, 'source164165-dispatch-parent-receipt.json'), entry);
  progress.source164165 = entry;
  progress.n44.nextSourceDispatched = true;
  progress.status = '1846 n44 offline complete;next SOURCE164/165 sequential batch active;no166';
  save('nov21_1846_source164165_actual_dispatch_after_n44_complete', entry);
} else if (process.argv[2] === 'choice-close') {
  const independent = progress.n44.independentChoice;
  assert.equal(independent.closed, false);
  verify(independent.stage3Intake);
  const entry = { at: new Date().toISOString(), agent: independent.agent,
    name: independent.name, status: 'ACTUALLY_CLOSED_AFTER_FULL_CHOICE_INTAKE',
    toolReceipt: process.argv[3], fullStage3Intake: independent.stage3Intake,
    originalSelfReviewPreserved: true, parentImagesOrDecodes: 0,
    nativeBudgetUnchanged: true };
  assert(entry.toolReceipt);
  const closure = path.join(base, 'n44-choice-independent-closure.json');
  writeNew(closure, entry);
  independent.closed = true;
  independent.closure = bind(closure);
  independent.status = entry.status;
  save('nov21_1846_n44_independent_choice_actual_closure', entry);
} else if (process.argv[2] === 'choice-stage-intake') {
  const stage = Number(process.argv[3]);
  assert([1, 2, 3].includes(stage));
  const directory = path.join(base, 'n44-choice-independent');
  const names = stage === 1
    ? ['stage1-source.json', 'stage1-source.md', 'stage1-receipt.json']
    : stage === 2
      ? ['stage2-view.json', 'stage2-view.md', 'stage2-receipt.json']
      : ['review.json', 'final-report.md', 'stage3-receipt.json'];
  const files = names.map(name => bind(path.join(directory, name)));
  assert.equal(files.at(-1).sha256, process.argv[4]);
  assert(process.argv[5], 'Record actual FULL text consumption command IDs');
  const independent = progress.n44.independentChoice;
  assert.equal(independent.closed, false);
  if (stage > 1) assert(independent[`stage${stage - 1}Intake`]);
  const entry = { at: new Date().toISOString(),
    agent: independent.agent, name: independent.name, stage,
    status: `FULL_CHOICE_STAGE${stage}_TEXT_INTAKEN`,
    files, fullTextConsumption: process.argv[5],
    parentImagesOrDecodes: 0, existingContentReviewReplays: 0,
    historicalSelfReviewPreserved: true, completeLessonDelta: 0 };
  if (stage === 3) entry.proceduralDecision = {
    strictAllowlistCompliance: false,
    retainedException: 'Generic contract reread outside stage3 allowlist; exact stage1 instruction hash matched',
    semanticEvidenceAccepted: true,
    reason: 'No new source/candidate/key/parent-review content disclosed early; frozen independent evidence unchanged',
    approvalIsNotAClaimOfStrictProceduralCompliance: true,
    repeatedReviewAuthorizedOrRequired: false };
  const output = path.join(base, `n44-choice-stage${stage}-parent-intake.json`);
  writeNew(output, entry);
  independent[`stage${stage}Intake`] = bind(output);
  independent.status = entry.status;
  if (stage < 3) independent[`stage${stage + 1}Released`] = true;
  save(`nov21_1846_n44_independent_choice_stage${stage}_FULL_intake`, entry);
} else if (process.argv[2] === 'choice-dispatch') {
  assert.equal(progress.n44.offline.closed, true);
  const directory = path.join(base, 'n44-choice-independent');
  const entry = { at: new Date().toISOString(),
    agent: process.argv[3], name: process.argv[4],
    status: 'SOURCE_FIRST_DISPATCHED_ONLY',
    packets: bind(path.join(directory, 'packet-bindings.json')),
    originalSelfReview: verify(progress.n44.files.find(item =>
      item.path.endsWith('choice-set/review.json'))),
    stage2Released: false, stage3Released: false, closed: false,
    imagesAuthorized: 0, nativeOrExistingContentReviewReplays: 0,
    parentBudget: 'Permanent24/24; zero new images/decodes',
    nativeBudget: 'technical4/8;known7/page;unchanged',
    completeLessonDelta: 0 };
  assert(entry.agent && entry.name);
  writeNew(path.join(base, 'n44-choice-independent-dispatch.json'), entry);
  progress.n44.independentChoice = entry;
  progress.n44.status = 'OFFLINE_SEALED_CHOICE_SOURCE_FIRST_ACTIVE';
  progress.status = '1846 n44 offline retained/Helmholtz closed;Curie bounded choice source-first active';
  save('nov21_1846_n44_choice_independent_actual_dispatch', entry);
} else {
  throw new Error('Use an explicit seal mode');
}
