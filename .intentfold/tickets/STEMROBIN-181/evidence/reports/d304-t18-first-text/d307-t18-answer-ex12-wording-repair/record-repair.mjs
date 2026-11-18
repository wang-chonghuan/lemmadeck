import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const tmp = path.dirname(root);
const original = path.join(tmp, 'd305-t18-written-answer-author');
const reviewPath = path.join(tmp, 'd306-t18-written-answer-review/first-review.json');
const oldPhrase = '留下一个电子占据的空位';
const newPhrase = '在价带留下一个原先由电子占据、现在空缺的状态';
const digest = data => crypto.createHash('sha256').update(data).digest('hex');
const read = p => fs.readFileSync(p);
const parse = p => JSON.parse(read(p));
const ensure = (condition, message) => { if (!condition) throw new Error(message); };
const bind = p => ({ path: p, sha256: digest(read(p)), bytes: read(p).length });
const verify = (p, expected) => {
  const result = bind(p);
  ensure(result.sha256 === expected, `Binding mismatch: ${p}`);
  ensure((fs.statSync(p).mode & 0o777) === 0o444, `Not frozen: ${p}`);
  return { ...result, observedMode: '0444' };
};
const write = (name, value) => {
  const p = path.join(root, name);
  fs.writeFileSync(p, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
  return bind(p);
};
const differences = (before, after, pointer = '') => {
  if (Object.is(before, after)) return [];
  if (before === null || after === null ||
      typeof before !== 'object' || typeof after !== 'object') return [pointer];
  const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
  return [...keys].flatMap(key => differences(
    before[key], after[key], `${pointer}/${key.replaceAll('~', '~0').replaceAll('/', '~1')}`
  ));
};

const originalFreezePath = path.join(original, 'author-freeze.json');
const originalFreezeBinding = verify(
  originalFreezePath, '30872532ee5513f24605e1415b575865c4ed590a6e47c527494d5baf5233fd74'
);
const reviewBinding = verify(
  reviewPath, 'ba94e5db324769821e0bc40fef76a450e6686cce2030a3e10b188ef31c4bf390'
);
const originalFreeze = parse(originalFreezePath);
const firstReview = parse(reviewPath);
const finding = firstReview.findings.find(item => item.id === 'T18-ANSWER-ZHEN-F01');
ensure(finding?.exercise === '12' && finding.language === 'zh' && finding.status === 'REVISE',
  'Authorized finding mismatch');

// Hash comparison only: no original semantic, native, or formula checks are rerun.
const preservedOriginalArtifacts = originalFreeze.artifacts.map(item =>
  verify(item.path, item.sha256)
);
const specs = [
  ['written-answers.candidate.json', '/answers/3/displayAnswer/zh'],
  ['zh/answer-keys.candidate.json', '/answers/3/displayAnswer'],
  ['en/answer-keys.candidate.json', null]
];
const deltas = specs.map(([name, pointer]) => {
  const beforePath = path.join(original, name);
  const afterPath = path.join(root, name);
  const beforeBytes = read(beforePath);
  const afterBytes = read(afterPath);
  const before = JSON.parse(beforeBytes);
  const after = JSON.parse(afterBytes);
  const changedPaths = differences(before, after);
  if (!pointer) {
    ensure(beforeBytes.equals(afterBytes), 'English native candidate changed');
    ensure(changedPaths.length === 0, 'English JSON changed');
    return { before: bind(beforePath), after: bind(afterPath), changedPaths, byteIdentical: true };
  }
  ensure(before.answers[3].exercise === '12' && after.answers[3].exercise === '12',
    'Affected exercise identity changed');
  const oldText = beforeBytes.toString('utf8');
  ensure(oldText.split(oldPhrase).length === 2, `Phrase must occur exactly once: ${name}`);
  ensure(Buffer.from(oldText.replace(oldPhrase, newPhrase)).equals(afterBytes),
    `Unexpected byte delta: ${name}`);
  ensure(changedPaths.length === 1 && changedPaths[0] === pointer,
    `Unexpected field delta: ${name}`);
  const oldAnswer = name.startsWith('zh/') ?
    before.answers[3].displayAnswer : before.answers[3].displayAnswer.zh;
  const newAnswer = name.startsWith('zh/') ?
    after.answers[3].displayAnswer : after.answers[3].displayAnswer.zh;
  return {
    before: bind(beforePath), after: bind(afterPath), changedPaths,
    exactSinglePhraseReplacement: true, allOtherBytesIdentical: true,
    affectedAnswerUtf8: { beforeSha256: digest(oldAnswer), afterSha256: digest(newAnswer) }
  };
});
ensure(deltas[0].affectedAnswerUtf8.afterSha256 === deltas[1].affectedAnswerUtf8.afterSha256,
  'Bilingual and native ZH copies disagree');

const inputBindings = write('input-bindings.json', {
  schema: 'stemrobin/affected-answer-repair-bindings@1',
  ticket: 'STEMROBIN-181',
  originalAuthorFreeze: originalFreezeBinding,
  parentFirstReview: reviewBinding,
  originalCandidates: deltas.map(item => item.before),
  originalReport: originalFreeze.report,
  originalInputBindings: originalFreeze.inputBindings,
  inheritedSourceAndContractBindings: originalFreeze.verifiedInputs,
  inheritedBindingsAreNotNewSemanticReviews: true
});
const deltaBinding = write('affected-only-delta.json', {
  schema: 'stemrobin/affected-answer-wording-delta@1',
  finding: finding.id, exercise: '12', language: 'zh',
  replacement: {
    before: oldPhrase, after: newPhrase,
    beforeUtf8Sha256: digest(oldPhrase), afterUtf8Sha256: digest(newPhrase)
  },
  files: deltas,
  preservation: {
    originalAuthorFreeze: originalFreezeBinding,
    parentFirstReview: reviewBinding,
    originalArtifactsUnchanged: preservedOriginalArtifacts,
    sourceAndTemplateBytesNotWritten: true
  }
});
const actual = write('actual-opens.json', {
  schema: 'stemrobin/zero-image-actual-opens@1',
  opens: [],
  budget: {
    contextImagesBeforeReview: 24, newImagesOpened: 0, actualOpenCalls: 0,
    reopens: 0, otherImagesOpened: 0, cumulativeContextImages: 24, reset: false
  }
});
const receipt = write('local-integrity.receipt.json', {
  schema: 'stemrobin/affected-repair-integrity-receipt@1',
  status: 'MATCH',
  scope: 'Byte/hash and affected JSON-pointer comparisons only; not SCI/ZHEN approval.',
  exactReplacementPerZHFile: 1,
  changedPointers: deltas.map(item => ({ path: item.after.path, pointers: item.changedPaths })),
  englishNativeByteIdentical: true,
  bilingualEnglishAndAllUnaffectedFieldsBytePreserved: true,
  originalArtifactsAndParentReviewUnchanged: true,
  checksNotRun: ['SCI', 'ZHEN', 'KaTeX', 'native-checks', 'tests', 'full-gate2', 'native-finalize'],
  script: bind(fileURLToPath(import.meta.url))
});
const report = write('report.json', {
  schema: 'stemrobin/t18-affected-answer-wording-repair@1',
  ticket: 'STEMROBIN-181',
  lesson: 'phy9-c2-s4-t18',
  status: 'REPAIRED-CANDIDATE-AFFECTED-REVIEW-PENDING',
  finding: {
    id: finding.id, exercise: '12', language: 'zh',
    originalReviewStatusPreserved: 'REVISE',
    repair: { before: oldPhrase, after: newPhrase },
    affectedReview: 'PENDING-PARENT-ONCE',
    closed: false
  },
  inputBindings, affectedOnlyDelta: deltaBinding,
  candidates: deltas.map(item => item.after),
  localIntegrityReceipt: receipt,
  inheritedReview: {
    binding: reviewBinding,
    SCI: { status: 'PASS', exercises: ['2', '3', '11', '12'], treatment: 'REUSED-NOT-RERUN' },
    completeZHEN: { status: 'PASS', exercises: ['2', '3', '11'], treatment: 'REUSED-NOT-RERUN' },
    ex12ZHEN: 'AFFECTED-CHINESE-WORDING-REVIEW-PENDING; UNCHANGED-EN-PRESERVED'
  },
  coverage: {
    authoredTasks: 4, sourceTasks: 16, displayAnswers: 8,
    selectedExercises: ['2', '3', '11', '12'],
    notAuthoredInThisBatch: ['1', '4', '5', '6', '7', '8', '9', '10', '13', '14', '15', '16'],
    notAuthoredDoesNotMeanAllHOLD: true
  },
  retainedBoundaries: [
    { exercise: '1', status: 'HOLD', reason: 'Existing figure189 boundary; unchanged.' },
    { exercise: '9', status: 'HOLD', reason: 'Existing discharge-type errata-authorization boundary; unchanged.' }
  ],
  missingStages: ['Parent affected ex12 ZH wording review', 'Remaining 12 written answers',
    'Complete answer gate2 and native finalize', 'Actual DISPLAY and publication'],
  fullGate2PASS: false, completeAnswerKey: false, wholeCardApproved: false,
  authorLocalChecksRerun: false, nativeFinalizeRun: false,
  actualOpens: actual,
  images: { inherited: 24, new: 0, cumulative: 24, reset: false },
  originalD305AndD306Preserved: true,
  forbiddenOperationsPerformed: []
});
const artifacts = [
  ...deltas.map(item => item.after),
  inputBindings, deltaBinding, actual, receipt, report,
  bind(fileURLToPath(import.meta.url))
];
const freeze = write('author-freeze.json', {
  schema: 'stemrobin/t18-affected-answer-wording-repair-freeze@1',
  ticket: 'STEMROBIN-181',
  frozenUtc: new Date().toISOString(),
  status: 'FROZEN-AFFECTED-WORDING-REVIEW-PENDING',
  finding: finding.id,
  originalAuthorFreeze: originalFreezeBinding,
  parentFirstReview: reviewBinding,
  candidates: deltas.map(item => item.after),
  inputBindings, report,
  artifacts: artifacts.map(item => ({ ...item, handoffMode: '0444' })),
  completeAnswerKey: false, fullGate2PASS: false, wholeCardApproved: false,
  images: { inherited: 24, new: 0, cumulative: 24, reset: false },
  immutability: 'All new owned files, including this freeze, are chmod 0444; self-hash returned externally.'
});
for (const item of [...artifacts, freeze]) {
  fs.chmodSync(item.path, 0o444);
  ensure((fs.statSync(item.path).mode & 0o777) === 0o444, `Freeze mode mismatch: ${item.path}`);
  ensure(digest(read(item.path)) === item.sha256, `Frozen bytes changed: ${item.path}`);
}
console.log(JSON.stringify({
  status: 'FROZEN-AFFECTED-WORDING-REVIEW-PENDING',
  candidates: deltas.map(item => item.after), inputBindings, report, authorFreeze: freeze,
  images: { new: 0, cumulative: 24 }, mode: '0444'
}, null, 2));
