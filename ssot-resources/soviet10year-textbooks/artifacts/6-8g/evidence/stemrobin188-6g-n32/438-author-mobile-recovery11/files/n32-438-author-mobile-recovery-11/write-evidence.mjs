import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const root = path.dirname(import.meta.filename);
const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
const prior = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/n32-fig207208-author-first-10');
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const binding = p => {
  const bytes = fs.readFileSync(p);
  return { path: p, sha256: crypto.createHash('sha256').update(bytes).digest('hex'), bytes: bytes.length };
};
const write = (name, value) => fs.writeFileSync(path.join(root, name), `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
const previousManifest = read(path.join(prior, 'figures.manifest.json'));
const previousLedger = read(path.join(prior, 'ledger.json'));
const figure = previousManifest.figures.find(f => f.id === 'fig-208');
assert.equal(binding(path.join(prior, 'figures.manifest.json')).sha256, '6869d4cedd91e6163e906cfdcf812edfc59846171e783c319d726356cdc37984');
assert.equal(binding(path.join(prior, 'hashes.json')).sha256, '0df1734ef4c8d295ca15a6c518b83e227a531e269687a6ccfca32f40bb81dbd3');
for (const b of [figure.source, ...Object.values(figure.current), figure.revision]) {
  assert.equal(binding(b.path).sha256, b.sha256, `External binding drift: ${b.path}`);
}
assert.equal(figure.author.contentRevisions, 1);
assert.equal(figure.author.fullRenderInvocations, 2);
const failures = previousLedger.imageBudget.reads.filter(r => r.result === 'failure');
assert.equal(failures.length, 1);
assert.equal(failures[0].sequence, 8);
assert.equal(failures[0].actualToolExitCode, null);

const receiptNames = fs.readdirSync(path.join(root, 'receipts')).filter(n => n.endsWith('.execution.json')).sort();
const actualReceipts = receiptNames.map(name => {
  const p = path.join(root, 'receipts', name);
  const receipt = read(p);
  assert.equal(receipt.cwd, repo);
  assert.equal(receipt.exitCode, 0);
  assert.equal(receipt.signal, null);
  for (const stream of Object.values(receipt.streams)) assert.equal(binding(stream.path).sha256, stream.sha256);
  return { ...binding(p), cwd: receipt.cwd, argv: receipt.argv, actualExitCode: receipt.exitCode, streams: receipt.streams };
});
const freezeNames = ['01-first-chmod', '02-first-stat', '03-first-sha'];
const freeze = freezeNames.map(name => read(path.join(root, 'receipts', `${name}.execution.json`)));
for (let i = 1; i < freeze.length; i++) assert.ok(freeze[i].startedAt >= freeze[i - 1].completedAt);
const specReceipt = read(path.join(root, 'receipts/06-current-spec-read.execution.json'));
const modernReceipt = read(path.join(root, 'receipts/05-modern-exercise-read.execution.json'));
assert.ok(specReceipt.startedAt >= freeze[2].completedAt);
assert.ok(modernReceipt.startedAt >= freeze[2].completedAt);
const first = binding(path.join(root, 'FIRST.md'));
assert.equal(first.sha256, '0824fc6a2ce2357244a26237f41edb5a5c5b2cb583077d8df5a5212c8b71f921');
assert.equal(fs.statSync(first.path).mode & 0o777, 0o444);
const freezeReceipt = {
  schema: 'same188-6/first-freeze@1',
  role: 'AUTHOR_ONLY',
  first: { ...first, mode: '0444', completeBeforeFreeze: true, unchangedAfterFreeze: true },
  sequentialCompletedCommands: freezeNames.map(name => {
    const p = path.join(root, 'receipts', `${name}.execution.json`);
    return { ...binding(p), ...read(p) };
  }),
  beforeModernTextSpecAssetsAndAnswerKeys: true,
  actualSourceImageRead: {
    tool: 'functions.view_image',
    argv: { path: figure.source.path },
    result: 'success',
    numericProcessExitCode: null,
    note: 'The image tool provides a successful image result, not numeric process exit status. No image payload is retained or forwarded.',
  },
};
write('FIRST.freeze-receipt.json', freezeReceipt);

const imageReads = [
  { sequence: 1, role: 'actual-original-source', path: figure.source.path, result: 'success', beforeFirstFreeze: true },
  { sequence: 2, role: 'existing-r1-native-author-inspection', path: figure.current.nativePreview.path, result: 'success', afterFirstFreeze: true },
  { sequence: 3, role: 'correct-path-mobile-author-recovery', path: figure.current.mobilePreview.path, result: 'success', afterFirstFreeze: true },
].map(r => ({
  ...r,
  tool: 'functions.view_image',
  charged: true,
  numericProcessExitCode: null,
  binding: binding(r.path),
  noImagePayloadForwarded: true,
}));
const observations = read(path.join(root, 'author-observations.json'));
const sanity = read(path.join(root, 'author-sanity.json'));
assert.equal(sanity.status, 'PASS_AUTHOR_ONLY');
assert.equal(sanity.checkedParts.length, 10);
assert.equal(sanity.katex.formulaCount, 44);
const pendingReceipts = ['11-package-evidence', '12-seal-evidence'].map(name => ({
  path: path.join(root, 'receipts', `${name}.execution.json`),
  note: 'Actual packaging/sealing receipt is produced after this manifest. Its file and stream hashes are included in the final hashes.json.',
}));
const ledger = {
  schema: 'same188-6/author-mobile-recovery-ledger@1',
  ticket: 'STEMROBIN-188',
  assignment: 'SAME188-6',
  role: 'AUTHOR_ONLY',
  ownedRoot: root,
  imageBudget: {
    freshContext: true, batchLimit: 8, contextLimit: 24,
    charged: 3, successful: 3, failed: 0, reopens: 0, crops: 0,
    reads: imageReads,
    priorClosedBatch: { charged: 8, successful: 7, failed: 1, ledger: binding(path.join(prior, 'ledger.json')) },
    chargedAcrossTheseTwoBatches: 11,
    parent: { charged: 24, limit: 24, permanent: true, newImagePayloads: 0 },
    note: 'Separate bounded contexts; historical usage, failed loads and revisions are not reset.',
  },
  preservedFailure: {
    originalLedger: binding(path.join(prior, 'ledger.json')),
    entryUnchanged: failures[0],
    originalGate: 'HOLD_MOBILE_NOT_INSPECTED',
    disposition: 'Technical malformed-path failure retained. New correct-path observation resolves only missing AUTHOR mobile sanity.',
  },
  figure208: {
    contentRevisionsBefore: 1, contentRevisionsAfter: 1, addedContentRevisions: 0,
    fullRenderInvocationsBefore: 2, fullRenderInvocationsAfter: 2, addedRenderInvocations: 0,
    addedWidthChecks: 0, technicalRecoveriesBefore: 0, technicalRecoveriesAfter: 1,
    machineChecks: 'Existing pass evidence reused; not rerun.',
    authorMobile: 'PASS_AUTHOR_ONLY',
    independentSourceMathDisplay: 'NOT_CLAIMED',
    finalGate: 'HOLD_INDEPENDENT_REVIEW',
  },
  answer: { exercise: '438', nativeDraft: binding(path.join(root, 'answer-keys.json')), grading: 'ungraded', source: 'derived', subparts: 10, teachingFootnote: true, fullLessonFinalizerRuns: 0, authorSanityRuns: 1 },
  receipts: actualReceipts,
  finalPackagingReceipts: pendingReceipts,
  forbiddenActions: { dbCalls: 0, envReads: 0, networkCalls: 0, paidCalls: 0, commits: 0, pushes: 0, appEdits: 0, dependencyEdits: 0, charterEdits: 0, canonicalEdits: 0, otherOwnedRootEdits: 0 },
  independentReviewFilesProduced: 0,
  activeExecSessions: [],
};
write('ledger.json', ledger);
const manifest = {
  schema: 'same188-6/author-mobile-recovery-manifest@1',
  ticket: 'STEMROBIN-188', assignment: 'SAME188-6', book: '6-8g',
  lesson: 'geo68-c3-s1-n32', edition: 'modern-us-neutral', role: 'AUTHOR_ONLY',
  offline: true, ownedRoot: root,
  status: 'AUTHOR_ONLY_COMPLETE_INDEPENDENT_REVIEW_HOLD',
  authorMobileSanity: 'PASS_AUTHOR_ONLY',
  authorMathematicalKaTeXSanity: 'PASS_AUTHOR_ONLY',
  independentSourceMathDisplayApproval: 'NOT_CLAIMED',
  publicationApproval: 'HOLD',
  originalManifest: binding(path.join(prior, 'figures.manifest.json')),
  originalHashes: binding(path.join(prior, 'hashes.json')),
  sourceExercise: binding(path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/n32-draft-first-10/artifacts/6-8g/lessons/geo68-c3-s1-n32/exercises.json')),
  authoritativeModernExercise: binding(path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/n32-text-candidate-10/exercises.template.json')),
  figure208: {
    source: figure.source,
    current: figure.current,
    revision: figure.revision,
    existingMachineStatus: figure.machineStatus,
    historicalWidthChecks: figure.widths,
    checksReusedNotExecuted: true,
    contentRevisions: 1, fullRenderInvocations: 2,
    authorObservations: binding(path.join(root, 'author-observations.json')),
    independentApproval: 'NOT_CLAIMED',
  },
  FIRST: { ...first, mode: '0444', freezeReceipt: binding(path.join(root, 'FIRST.freeze-receipt.json')) },
  nativeAnswerDraft: { ...binding(path.join(root, 'answer-keys.json')), schema: 'ld-s10y-answer/lesson-answers@1', status: 'draft', exercises: ['438'], grading: 'ungraded', source: 'derived', completeSubparts: 10, teachingFootnote: true, wholeLessonComplete: false },
  scopedAuthorSanity: { report: binding(path.join(root, 'author-sanity.json')), execution: binding(path.join(root, 'receipts/10-author-math-katex.execution.json')), actualExitCode: 0, executions: 1, subparts: 10, formulaCount: 44 },
  ledger: binding(path.join(root, 'ledger.json')),
  executionReceipts: actualReceipts,
  finalPackagingReceipts: pendingReceipts,
  hashesPath: path.join(root, 'hashes.json'),
  reportPath: path.join(root, 'report.md'),
  imageReads: 3, imagePayloadsToParent: 0,
  noRedrawRerenderWidthCheckOrRevisionReset: true,
  activeExecSessions: [],
};
write('manifest.json', manifest);
const report = [
  '# SAME188-6 exercise 438: AUTHOR_ONLY recovery',
  '',
  'Author work is complete. Independent source/math/display approval and publication remain HOLD.',
  'The historical malformed-path failure is retained verbatim in ledger.json, with its original file binding.',
  'Only the missing author mobile sanity was resolved. No independent review file was created.',
  '',
  '## Completed',
  '',
  '- Actual source exercise and original PNG read before modern text/spec/assets or answer keys.',
  '- FIRST contains the complete source inventory, all ten proofs and teaching footnote.',
  '- FIRST was frozen by sequential successful chmod 0444, stat and shasum commands.',
  `- FIRST SHA256: ${first.sha256}. It remains mode 0444 and byte-unchanged.`,
  '- Current r1 native and correct-path 300 px mobile PNG each actually inspected once.',
  '- Existing manifest, hashes, source, spec, render, SVG, native/mobile, revision and width-report bindings match.',
  '- One native answer-keys.json draft, derived and ungraded with empty parts: all ten proofs and teaching footnote.',
  '- One scoped author mathematical/KaTeX sanity invocation: exit 0; ten subparts and 44 formulas passed.',
  '- No other answer drafts or book answer were read; no full-nine native finalizer was run.',
  '',
  '## Preserved Boundaries',
  '',
  '- Figure 208 remains content revision 1 and historical fullRenderInvocations 2.',
  '- Added redraws/renders/width checks/content revisions: 0. Added author technical recoveries: 1.',
  '- Fresh recovery context: 3/8 charged image attempts and 3/24 context images; all succeeded, no crops/reopens.',
  '- Prior figure-author batch stays 8/8, including its failed load. Parent stays permanently 24/24.',
  '- Images returned to parent: 0. Return text and these file bindings only.',
  '- All writes are inside this owned recovery root. No DB/env/network/paid/app/dependency/charter/canonical writes.',
  '- No commit, push, promotion, publication, independent-review record or dependency change.',
  '- Active exec sessions: none.',
  '',
  '## Files',
  '',
  ...['FIRST.md', 'FIRST.freeze-receipt.json', 'answer-keys.json', 'author-observations.json', 'author-sanity.json', 'ledger.json', 'manifest.json', 'hashes.json', 'receipts/10-author-math-katex.execution.json', 'receipts/11-package-evidence.execution.json', 'receipts/12-seal-evidence.execution.json'].map(name => `- ${path.join(root, name)}`),
  '',
  'manifest.json binds external inputs and output files; hashes.json binds the complete owned evidence package,',
  'including every actual command receipt and its stdout/stderr. hashes.json cannot contain its own recursive SHA;',
  'that SHA is returned in the actual sealing tool output. Image-tool results expose no numeric process exit status.',
  '',
].join('\n');
fs.writeFileSync(path.join(root, 'report.md'), report, { flag: 'wx' });
console.log(JSON.stringify({
  status: manifest.status, manifest: binding(path.join(root, 'manifest.json')),
  report: binding(path.join(root, 'report.md')), ledger: binding(path.join(root, 'ledger.json')),
  first, answer: manifest.nativeAnswerDraft, imageReads: 3, activeExecSessions: [],
}, null, 2));
