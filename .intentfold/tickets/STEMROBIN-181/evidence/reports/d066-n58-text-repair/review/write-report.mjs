import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const tmp = `${root}/.intentfold/tickets/STEMROBIN-181/tmp`;
const own = path.dirname(fileURLToPath(import.meta.url));
const output = `${own}/report.json`;
assert.equal(fs.existsSync(output), false, 'Never overwrite existing review evidence');
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bindings = new Map();
function bind(file, expectedSha256, role) {
  const bytes = fs.readFileSync(file);
  assert.equal(sha(bytes), expectedSha256, file);
  const binding = {
    role, path: file, sha256: expectedSha256, expectedSha256,
    bytes: bytes.length, hashMatchesExpected: true,
  };
  bindings.set(file, binding);
  return { binding, data: JSON.parse(bytes) };
}
const original = bind(
  `${tmp}/d064-n58-text-review/report.json`,
  'e72c04c915faf8f2217589da5018516d2d9fcd46ae95e17a78a52bbcc15a76dd',
  'original-independent-HOLD-preserved',
);
const freeze = bind(
  `${tmp}/d065-n58-text-repair/author-freeze.json`,
  'bf40cb3b1fe84891438f38204b7f645d8cd0f33094139cad8a01018a7c7190fc',
  'sole-targeted-author-repair-freeze',
);
const pointerDiff = bind(
  freeze.data.exactJSONPointerDiff.path,
  freeze.data.exactJSONPointerDiff.sha256,
  'author-declared-pointer-diff-independently-compared',
);
const amendment = bind(
  freeze.data.changeRegisterAmendment.path,
  freeze.data.changeRegisterAmendment.sha256,
  'additive-change-register-amendment',
);
assert.equal(original.data.SCI, 'HOLD');
assert.equal(original.data.ZHEN, 'HOLD');
assert.deepEqual(original.data.findings.map(finding => finding.id), ['N58-TEXT-01']);
assert.equal(freeze.data.triggeringIndependentReview.sha256, original.binding.sha256);
assert.equal(freeze.data.finding, 'N58-TEXT-01');
assert.equal(pointerDiff.data.changes.length, 2);
assert.deepEqual(amendment.data.changes, pointerDiff.data.changes);

function differences(before, after, pointer = '') {
  if (Object.is(before, after)) return [];
  if (before === null || after === null || typeof before !== 'object' ||
      typeof after !== 'object' || Array.isArray(before) !== Array.isArray(after)) {
    return [{ pointer, before, after }];
  }
  const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
  return [...keys].flatMap(key => differences(
    before[key], after[key],
    `${pointer}/${key.replaceAll('~', '~0').replaceAll('/', '~1')}`,
  ));
}
const exactTemplateBindings = [];
const actualDiffs = [];
const candidates = {};
for (const language of ['zh', 'en']) {
  candidates[language] = {};
  for (const kind of ['lesson', 'exercises', 'figures']) {
    const oldRecord = original.data.exactTemplateBindings.find(
      row => row.language === language && row.kind === kind,
    ).frozen;
    const newRecord = freeze.data.textCandidates[language][kind];
    const before = bind(oldRecord.path, oldRecord.sha256, `${language}.${kind}.original`);
    const after = bind(newRecord.path, newRecord.sha256, `${language}.${kind}.repaired`);
    const delta = differences(before.data, after.data);
    candidates[language][kind] = after.data;
    exactTemplateBindings.push({
      language, kind, original: before.binding, repaired: after.binding,
      changedPointers: delta.map(row => row.pointer),
      byteIdentical: before.binding.sha256 === after.binding.sha256,
    });
    if (kind === 'lesson') {
      assert.deepEqual(delta.map(row => row.pointer), ['/prose/0/text']);
      const declared = pointerDiff.data.changes.find(row => row.locale === language);
      assert.equal(declared.pointer, delta[0].pointer);
      assert.equal(declared.before, delta[0].before);
      assert.equal(declared.after, delta[0].after);
      assert.equal(declared.beforeTemplate.sha256, before.binding.sha256);
      assert.equal(declared.afterTemplate.sha256, after.binding.sha256);
      assert.equal(sha(Buffer.from(delta[0].before)), declared.beforeTextSha256);
      assert.equal(sha(Buffer.from(delta[0].after)), declared.afterTextSha256);
      assert.equal(
        delta[0].before.replace(declared.exactSubstitution.from, declared.exactSubstitution.to),
        delta[0].after,
      );
      assert.equal(
        delta[0].before,
        original.data.blocks[0].candidates[language].text,
      );
      actualDiffs.push({ language, ...delta[0], exactSubstitution: declared.exactSubstitution });
    } else {
      assert.deepEqual(delta, []);
      assert.equal(before.binding.sha256, after.binding.sha256);
    }
  }
}
const zh = candidates.zh.lesson.prose[0].text;
const en = candidates.en.lesson.prose[0].text;
assert.ok(zh.includes('\u8be5\u4e09\u6781\u7ba1\u7684\u9633\u6781\u4e0e\u9634\u6781'));
assert.ok(en.includes("the triode's anode-to-cathode voltage"));
assert.ok(original.data.blocks[0].source.text.includes('\u4e09\u6781\u7ba1'));
const inheritedBlocks = original.data.blocks.slice(1).map(block => {
  for (const language of ['zh', 'en']) {
    assert.equal(
      sha(Buffer.from(candidates[language].lesson.prose[block.proseIndex].text)),
      block.candidates[language].textSha256,
    );
  }
  assert.equal(block.SCI, 'PASS');
  assert.equal(block.ZHEN, 'PASS');
  return {
    blockId: block.id, proseIndex: block.proseIndex, sourceRefs: block.sourceRefs,
    SCI: block.SCI, ZHEN: block.ZHEN,
    judgmentSource: { ...original.binding, pointer: `/blocks/${block.proseIndex}` },
    originalJudgmentConsumedUnchanged: true,
    sourceAndCandidateBlockExact: true,
    newSubstantiveReviewPerformed: false,
    candidateTextSha256: Object.fromEntries(['zh', 'en'].map(language => [
      language, block.candidates[language].textSha256,
    ])),
    figureApproval: block.figureApproval ?? 'NOT-IN-SCOPE',
  };
});
const report = {
  schema: 'STEMROBIN-181/affected-independent-SCI-ZHEN-review@1',
  ticket: 'STEMROBIN-181', lesson: 'phy10-c1-s6-n58',
  reviewedAt: new Date().toISOString(),
  status: 'PASS', SCI: 'PASS', ZHEN: 'PASS',
  effectiveSCI: 'PASS', effectiveZHEN: 'PASS',
  reviewer: {
    identity: 'Feynman', runtime: 'Codex',
    role: 'Original independent n58 text reviewer; affected-only repair review',
    authoredSourceModernLessonOrRepair: false,
  },
  approvalScope: 'Text SCI/ZHEN only: resolve N58-TEXT-01 in /prose/0/text for both locales and consume the unchanged first-review judgments for the other six blocks. No second full review, modern figure approval, native/display approval, or full-card promotion.',
  originalReview: original.binding,
  originalGates: { status: original.data.status, SCI: original.data.SCI, ZHEN: original.data.ZHEN },
  originalFindings: original.data.findings,
  originalHOLDReportPreservedExactBytes: true,
  repairFreeze: freeze.binding,
  differenceEvidence: { jsonPointerDiff: pointerDiff.binding, changeRegisterAmendment: amendment.binding },
  preReviewByteDrift: false,
  exactTemplateBindings,
  independentlyComputedDifferences: actualDiffs,
  findings: [{
    id: 'N58-TEXT-01', originalStatus: original.data.findings[0].status,
    status: 'PASS', disposition: 'RESOLVED',
    sourceRefs: ['p0154#2'], affectedPointers: { zh: '/prose/0/text', en: '/prose/0/text' },
    SCI: 'PASS', ZHEN: 'PASS',
    omissionJudgment: 'The source-specified triode is now explicit in the anode/cathode voltage sentence in both learner-facing texts. It is no longer confined to the embedded raw-source snapshot.',
    scientificRegressionJudgment: 'The added apparatus noun identifies the existing vacuum tube. It changes no voltage/current/energy-per-period/amplitude relationship, operating-range condition, generally/usually qualifier, or explicit rejection of a universal tube law. No new physical law or numerical assertion is introduced.',
    bilingualRegressionJudgment: 'The Chinese specific reference to this triode and English possessive reference to the triode identify the same source apparatus in the same conditional sentence. Electrode names, current, supplied energy, amplitude changes, and the surrounding caveats remain equivalent.',
    originalBlockJudgmentConsumed: { ...original.binding, pointer: '/blocks/0' },
    newDefects: [], authorRepairPerformedByReviewer: false,
  }],
  resolvedFindingIDs: ['N58-TEXT-01'], unresolvedFindingIDs: [],
  effectiveTextVerdictBasis: 'The original review had only this source-fact omission blocking SCI/ZHEN. The exact two local noun insertions resolve it without changed physical qualifiers or bilingual regression; all other first-review PASS judgments retain their exact candidate bytes.',
  inheritedUnchangedBlocks: inheritedBlocks,
  preservation: {
    otherSixProseBlocksExact: true, allOtherLessonJSONFieldsExact: true,
    embeddedSourceAndSourceRefsExact: true, numericFormulaAndNotationChanges: [],
    sectionBreaksExact: true, sourceFMTailExact: true,
    originalNumericAndFormulaJudgmentConsumed: { ...original.binding, pointer: '/numericAndFormulaFidelity' },
    originalZeroExerciseJudgmentConsumed: { ...original.binding, pointer: '/zeroExerciseReview' },
    zeroExerciseTemplateBytesExact: true, figureTemplateBytesExact: true,
    originalSourceApprovalsAndFailureHistoriesReinterpreted: false,
    previousReportsAuthorDraftsAndSharedFilesEdited: false,
  },
  sourceBindingConsumedWithoutReopen: original.data.originalSource,
  pending: {
    modernFigure114: 'HOLD', figureApproval: false,
    fullNative: 'PENDING', DISPLAY: 'PENDING',
    fullCardApproval: false, readyForPublication: false,
  },
  imageBudget: {
    inheritedCumulativeImageCount: 24, imagesOpened: 0, actualNewOpens: 0,
    cumulativeImageCount: 24, maximum: 24, remaining: 0,
    imageFilesRead: 0, noCounterReset: true,
  },
  actions: {
    affectedSubstantiveReviewCount: 1, fullSCIOrZHENReviewReplayCount: 0,
    externalReferenceFetches: 0, sourceFullpageReads: 0, imageOpens: 0,
    authorRepairs: 0, nativeStageInvocations: 0, renders: 0, displayRuns: 0,
    browserCalls: 0, newAgents: 0, canonicalMeterIndexDBGitBackendToolWrites: false,
    writesOnlyUnder: own,
  },
  metadataInputBindings: [...bindings.values()],
};
for (const binding of bindings.values()) {
  assert.equal(sha(fs.readFileSync(binding.path)), binding.sha256, binding.path);
  binding.postReviewSha256 = binding.sha256;
  binding.unchangedAfterReview = true;
}
fs.writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({
  path: output, sha256: sha(fs.readFileSync(output)),
  SCI: report.SCI, ZHEN: report.ZHEN,
  resolvedFindingIDs: report.resolvedFindingIDs,
  unchangedBlocksConsumed: inheritedBlocks.length,
  originalHOLDUnchanged: true, actualNewOpens: 0, cumulativeImageCount: 24,
  modernFigure114: 'HOLD', fullNative: 'PENDING', DISPLAY: 'PENDING',
}, null, 2));
