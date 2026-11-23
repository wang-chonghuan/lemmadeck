import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp');
const own = path.join(tmp, 'source165166-first-and163164-affected-review-12');
const seen = new Map();
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
function bind(file, expected, purpose) {
  const absolute = path.resolve(repo, file);
  const bytes = fs.readFileSync(absolute);
  const actual = hash(bytes);
  if (expected) assert.equal(actual, expected, absolute);
  const stat = fs.statSync(absolute);
  seen.set(absolute, { path: absolute, sha256: actual, bytes: bytes.length,
    mode: (stat.mode & 0o777).toString(8).padStart(4, '0'), purpose });
  return bytes;
}
function json(file, expected, purpose) {
  return JSON.parse(bind(file, expected, purpose));
}
function walkBindings(value, purpose) {
  if (!value || typeof value !== 'object') return;
  if (typeof value.path === 'string' && typeof value.sha256 === 'string') {
    bind(value.path, value.sha256, purpose);
    return;
  }
  for (const item of Object.values(value)) walkBindings(item, purpose);
}
function differences(before, after, pointer = '') {
  if (JSON.stringify(before) === JSON.stringify(after)) return [];
  if (!before || !after || typeof before !== 'object' || typeof after !== 'object') {
    return [{ pointer, before, after }];
  }
  const keys = [...new Set([...Object.keys(before), ...Object.keys(after)])];
  return keys.flatMap(key => differences(before[key], after[key], `${pointer}/${key}`));
}
function execution(reference, expectedExit) {
  const receipt = json(reference.path, reference.sha256, 'retained native execution');
  assert.equal(receipt.cwd, repo);
  assert.equal(receipt.exitCode, expectedExit);
  assert.ok(receipt.endedAt);
  assert.equal(receipt.argv[3], 'finalize');
  const streams = {};
  for (const [name, stream] of Object.entries(receipt.streams)) {
    const streamPath = path.resolve(path.dirname(reference.path), stream.path);
    const bytes = bind(streamPath, stream.sha256, 'retained native stream');
    streams[name] = { ...stream, path: streamPath, bytes: bytes.length };
  }
  return { receipt: reference, argv: receipt.argv, cwd: receipt.cwd,
    startedAt: receipt.startedAt, endedAt: receipt.endedAt,
    exitCode: receipt.exitCode, streams, replayed: false };
}

const source = json(path.join(tmp, 'source165166-independent-inputs-12/source-only.json'),
  '14a893b5d182315cedf6bf3cf20340c33a64774a76a308bde84e7b0801d31bd4', 'A source-only input');
const post = json(path.join(tmp, 'source165166-independent-inputs-12/post-FIRST.json'),
  'a2db3566b470b286fbd7fb19f6c5a18af1f440401d3d1cca8223573a4cbbd47d', 'A post-freeze input');
const affected = json(path.join(tmp, 'source163164-affected-inputs-12/inputs.json'),
  '194e09fef97b8fab2bac484552615cde24649a3be3e6106dcb8cee593665464f', 'B zero-image input');
walkBindings(source, 'A original image bytes; not an image load');
walkBindings(post, 'A allowed post-freeze bindings');
walkBindings(affected, 'B current and reused text bindings');
const freeze = json(path.join(own, 'FIRST-freeze-receipt.json'), undefined, 'A actual FIRST freeze');
for (const artifact of freeze.artifacts) {
  bind(path.join(own, artifact.file), artifact.sha256, 'A immutable independent FIRST');
  assert.equal(seen.get(path.join(own, artifact.file)).mode, '0444');
}
assert.deepEqual(freeze.sequence.map(step => step.command), ['chmod', 'stat', 'shasum']);
assert.ok(freeze.sequence.every(step => step.exitCode === 0));
const prior = json(affected.originalIndependentReport.path,
  affected.originalIndependentReport.sha256, 'B prior independent review; scopeA only reused');
const priorManifest = bind(prior.manifest, undefined, 'reused prior independent manifest, not new review');
bind(prior.scopeA.FIRST.receipt.path, prior.scopeA.FIRST.receipt.sha256, 'reused old FIRST freeze');
bind(prior.actualVerification.evidence.path, prior.actualVerification.evidence.sha256,
  'reused original historical counters and verification, not a 161 repeat');
bind(prior.scopeA.FIRST.annotationClarification, undefined, 'reused FIRST annotation');
const oldFirst = bind(affected.originalIndependentFIRST.path,
  affected.originalIndependentFIRST.sha256, 'B frozen source FIRST').toString('utf8');
const repair = json(affected.repairRecord.path, affected.repairRecord.sha256, 'B repair retention record');
bind(repair.technicalRecovery.failedScript.path, repair.technicalRecovery.failedScript.sha256,
  'retained failed wrapper script; never executed');
const native = [
  ...post.candidates.map(page => execution(page.receipt, 1)),
  ...affected.pages.map(page => execution(page.receipt, 0))
];
const diffReports = [];
for (const page of affected.pages) {
  const before = json(page.before.path, page.before.sha256, 'B historical placeholder candidate');
  const afterRef = page.after.find(file => file.path.endsWith('/page.json'));
  const after = json(afterRef.path, afterRef.sha256, 'B affected candidate');
  const expected = structuredClone(before);
  if (page.page === 163) {
    expected.blocks[2].lines[1] = 'б）。与同一条射线方向相同的所有射线的集合，叫做方向。方';
    expected.blocks[4].lines[0] = '证明。观察不在一条直线上的两条方向相反的射线$AB$和';
    expected.blocks[7].lines[2] = '到直线$A_1B_1$上。半平面$\\alpha$（见图217）映射到半平面$\\alpha_1$。所以';
    expected.blocks[7].lines[3] = '射线$AB$映射到始点在$A_1$的射线上，这条射线在半平面$\\alpha_1$';
    for (const [block, line] of [[2, 1], [4, 0], [7, 2], [7, 3]]) {
      assert.ok(oldFirst.includes(expected.blocks[block].lines[line]));
    }
  } else {
    for (const block of [8, 9]) {
      const indices = block === 8 ? [0, 1, 2, 3] : [0, 1, 3, 4];
      for (const [position, line] of indices.entries()) {
        expected.blocks[block].lines[line] = before.blocks[block].lines[line]
          .replace('UNKNOWN)', position % 2 === 0 ? 'a)' : 'б)');
      }
    }
    for (const line of [1, 4]) {
      expected.blocks[9].lines[line] = expected.blocks[9].lines[line].replace('图形？б)', '图形；б)');
    }
    for (const [block, indices] of [[8, [0, 1, 2, 3]], [9, [0, 1, 3, 4]]]) {
      for (const line of indices) assert.ok(oldFirst.includes(expected.blocks[block].lines[line]));
    }
  }
  assert.equal(after.meta.notes.length, before.meta.notes.length + 1);
  const note = after.meta.notes.at(-1);
  assert.ok(note.includes('shape transport only'));
  assert.ok(note.includes('UNKNOWN'));
  assert.ok(note.includes('Prior FIRST, placeholder candidate and native PASS remain historical'));
  expected.meta.notes.push(note);
  assert.deepEqual(after, expected);
  const auditRef = page.after.find(file => file.path.endsWith('/audit.json'));
  const audit = json(auditRef.path, auditRef.sha256, 'B retained native audit');
  assert.deepEqual([audit.lines_printed, audit.lines_md], page.page === 163 ? [21, 21] : [25, 25]);
  assert.deepEqual(audit.errors, []);
  const figure = prior.scopeA.figures.find(item => item.figure === (page.page === 163 ? 217 : 218));
  const currentCrop = repair.pages.find(item => item.page === page.page).sourceCrop;
  bind(figure.crop.path, figure.crop.sha256, 'B prior PASS source crop bytes; ZERO pixel loads');
  bind(currentCrop.path, currentCrop.sha256, 'B current crop bytes; ZERO pixel loads');
  assert.equal(currentCrop.sha256, figure.crop.sha256);
  diffReports.push({ page: page.page, diffs: differences(before, after),
    allOtherLeavesUnchanged: true, appendedNote: note, sourceCropPASSReused: figure,
    currentCrop, imageAttempts: 0, contentRevisionsUsed: 1, nativeExitCode: 0 });
}
const author = json(post.authorReport.path, post.authorReport.sha256, 'A original author historical counters');
const currentCrops = ['166-definition-crop.png', '166-property-label-crop.png',
  '166-proof-punctuation-crop.png'];
for (const crop of currentCrops) bind(path.join(own, crop), undefined, 'A charged source-derived detail crop');
bind(path.join(own, 'FIRST-annotations.md'), undefined, 'A post-freeze reviewer annotation');
const verification = {
  schema: 'same188-focused-verification@1',
  cwd: repo,
  command: ['node', path.join(own, 'verify.mjs')],
  scope: 'A165166 source/candidate; B163164 five-group affected comparison only',
  inputHashesMatched: true,
  firstFreezeMatched: true,
  nativeExecutions: native,
  affectedDiffs: diffReports,
  retainedWrapperFailure: repair.technicalRecovery,
  wrapperStreams: 'No separately referenced wrapper stdout/stderr file in supplied inputs; native streams verified. Failed wrapper script and repair record retained. No stream fabricated.',
  reusedManifest: { path: prior.manifest, sha256: hash(priorManifest) },
  historicalCountersUnchanged: {
    source165166Author: author.counters,
    source165166AuthorImages: author.images,
    priorIndependent163164: prior.counters,
    earlierInheritedCountersReference: prior.actualVerification.evidence,
    repair163164: affected.perPageContentRevisionsUsed,
    actualRepairNativeExitCodes: affected.actualNativeExitCodes,
    originalWrapperExitCode: repair.technicalRecovery.actualWrapperExitCode
  },
  currentReviewer: {
    freshNonfork: true, imageAttempts: 7, contextImages: 7, fullOriginalLoads: 2,
    nativeCropLoads: 2, sourceDerivedDetailCropLoads: 3, imageFailures: 0,
    fullPageReopens: 0, maxImageAttempts: 8, maxContextImages: 24,
    scopeBImageAttempts: 0, producerReplays: 0, contentRepairs: 0,
    frozenFIRSTRevisions: 0, annotationSupplements: 1,
    localExecFailures: 1, localExecFailure: 'Initial ls of absent fresh owned root exit1; not content/native/image failure',
    parentPermanentImages: '24/24 unchanged', counterReset: false,
    forbiddenActions: 0, writesOutsideOwnRoot: 0, wholeLessonApproved: false
  },
  activeExecSessions: []
};
fs.writeFileSync(path.join(own, 'verification.json'), JSON.stringify(verification, null, 2) + '\n');
bind(path.join(own, 'verify.mjs'), undefined, 'current reviewer verifier; native finalizer not run');
bind(path.join(own, 'verification.json'), undefined, 'new command and stream evidence');
fs.writeFileSync(path.join(own, 'manifest.json'), JSON.stringify({
  schema: 'same188-new-and-reused-manifest@1',
  files: [...seen.values()], reusedHistoricalManifest: verification.reusedManifest,
  inheritedEvidenceNotCopiedOrReplayed: true, imageAndRevisionCountersReset: false,
  activeExecSessions: []
}, null, 2) + '\n');
console.log(JSON.stringify({ status: 'VERIFIED_FOCUSED_BINDINGS_DIFFS_STREAMS',
  verifiedFiles: seen.size, affectedLeafChanges: diffReports.map(item =>
    ({ page: item.page, changes: item.diffs.length })), nativeExits: native.map(item => item.exitCode),
  manifest: path.join(own, 'manifest.json'), verification: path.join(own, 'verification.json'),
  activeExecSessions: [] }));
