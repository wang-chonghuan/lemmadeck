import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const evidenceRoot = dirname(fileURLToPath(import.meta.url));
const tmp = dirname(evidenceRoot);
const repairRoot = resolve(tmp, 'd045-n40-text-repair');
const reportPath = resolve(tmp, 'd045-n40-affected-review.json');
const observationPath = resolve(evidenceRoot, 'observations.json');
const bindingPath = resolve(evidenceRoot, 'bindings.json');
const ownedOutputs = [observationPath, reportPath, bindingPath];
for (const path of ownedOutputs) assert.equal(existsSync(path), false, `Refuse overwrite: ${path}`);

const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const inputs = new Map();
function bind(path, expectedSha256, role, parseJSON = true) {
  path = resolve(path);
  const bytes = readFileSync(path);
  const sha256 = sha(bytes);
  if (expectedSha256) assert.equal(sha256, expectedSha256, `Binding mismatch: ${path}`);
  const previous = inputs.get(path);
  if (previous) {
    assert.equal(sha256, previous.sha256, `Input changed during review: ${path}`);
    previous.roles.push(role);
  } else {
    inputs.set(path, { path, sha256, bytes: bytes.length, expectedSha256: expectedSha256 ?? null, roles: [role] });
  }
  return { bytes, data: parseJSON ? JSON.parse(bytes) : null, binding: { path, sha256, bytes: bytes.length } };
}
const freeze = bind(resolve(repairRoot, 'repair-freeze.json'),
  '234f22abbc69b624a4207ac9ac74d1397e70633e17a5297252b9148aed590296', 'sole-repair-freeze');
const original = bind(resolve(tmp, 'd044-n38-n40-science-review.json'),
  freeze.data.originalScience.sha256, 'original-independent-SCI-and-ZHEN');
assert.equal(readFileSync(freeze.data.originalScience.path).equals(original.bytes), true);
bind(freeze.data.originalScience.path, original.binding.sha256, 'preserved-original-independent-review');
const card = original.data.cardResults.find(item => item.card === 'phy10-c1-s5-n40');
assert.equal(card.SCI, 'PASS');
assert.equal(card.ZHEN, 'HOLD');
assert.deepEqual(card.defects.map(item => item.blockIndex), [5, 17]);
assert.equal(freeze.data.repairs, 1);
assert.deepEqual(freeze.data.outputs.find(item => item.language === 'en').changedBlocks, [5, 17]);
assert.deepEqual(freeze.data.outputs.find(item => item.language === 'zh').changedBlocks, []);
const judgments = bind(resolve(evidenceRoot, 'judgments.json'), null, 'independent-manual-semantic-judgments');
assert.equal(judgments.data.inputRepairFreezeSha256, freeze.binding.sha256);
bind(fileURLToPath(import.meta.url), null, 'evidence-only-binding-script', false);
const author = bind(card.authorFreeze.path, card.authorFreeze.sha256, 'preserved-original-author-freeze');
bind(freeze.data.originalAuthor.path, card.authorFreeze.sha256, 'preserved-original-author-freeze-copy');
const raw = bind(resolve(tmp, '../../../..', card.raw.path), card.raw.sha256, 'complete-raw-source-context');
const languages = {};

function receipt(binding, role) {
  const bound = bind(binding.path, binding.sha256, role);
  const value = bound.data.stdout === undefined ? bound.data : JSON.parse(bound.data.stdout);
  if (bound.data.exitCode !== undefined) assert.equal(bound.data.exitCode, 0);
  return { ...bound, value };
}

for (const language of ['zh', 'en']) {
  const frozenOutput = freeze.data.outputs.find(item => item.language === language);
  const prior = card.languages.find(item => item.language === language);
  const priorAuthor = author.data.frozen.find(item => item.language === language);
  const before = bind(resolve(repairRoot, `before/${language}/lesson.template.json`),
    prior.template.sha256, `${language}-before-template-bound-to-original-review`);
  const current = bind(frozenOutput.template.path, frozenOutput.template.sha256, `${language}-current-template`);
  const frozen = bind(frozenOutput.frozen.path, frozenOutput.frozen.sha256, `${language}-repair-frozen-template`);
  assert.equal(current.bytes.equals(frozen.bytes), true);
  const beforeFlow = receipt({ path: resolve(repairRoot, `flow-before-${language}.json`) },
    `${language}-recorded-before-flow-not-rerun`);
  const originalFlow = receipt(priorAuthor.proseFlowReceipt, `${language}-original-authoritative-flow-not-rerun`);
  assert.deepEqual(beforeFlow.value, originalFlow.value);
  const flow = receipt(frozenOutput.flow, `${language}-recorded-repaired-flow-not-rerun`);
  const nativeFlow = receipt(frozenOutput.nativeFlow, `${language}-recorded-native-flow-not-rerun`);
  const nativeParagraphs = nativeFlow.value.flow.filter(item => item.kind === 'p');
  assert.deepEqual(nativeParagraphs.map(item => item.text), flow.value.paragraphs.map(item => item.text));
  assert.deepEqual(flow.value.boundaries.map(({ before, after }) => ({ before, after })), current.data.section_breaks);
  assert.deepEqual(flow.value.boundaries.map(item => item.index), flow.value.resolvedBreaks);
  assert.deepEqual(flow.value.resolvedBreaks, frozenOutput.sectionBreaks);
  assert.equal(flow.value.paragraphs.length, frozenOutput.paragraphs);
  assert.equal(nativeFlow.value.flow.length, frozenOutput.fullFlowObjects);
  const prose = bind(frozenOutput.prose.path, frozenOutput.prose.sha256, `${language}-frozen-reading-text`, false);
  assert.deepEqual(current.data.source.data, raw.data);
  assert.deepEqual(before.data.source.data, raw.data);
  assert.equal(current.data.prose.length, 22);
  if (language === 'zh') assert.equal(current.bytes.equals(before.bytes), true);
  const omit = (value, keys) => Object.fromEntries(Object.entries(value).filter(([key]) => !keys.includes(key)));
  assert.deepEqual(omit(current.data, ['prose', 'section_breaks']), omit(before.data, ['prose', 'section_breaks']));
  for (let index = 0; index < 22; index++) {
    assert.deepEqual(omit(current.data.prose[index], ['text']), omit(before.data.prose[index], ['text']));
    if (language === 'zh' || ![5, 17].includes(index)) {
      assert.deepEqual(current.data.prose[index], before.data.prose[index]);
    }
  }
  languages[language] = { before, current, frozen, beforeFlow, flow, nativeFlow, prose };
}

const blocks = [5, 17].map(blockIndex => {
  const before = languages.en.before.data.prose[blockIndex];
  const after = languages.en.current.data.prose[blockIndex];
  const zh = languages.zh.current.data.prose[blockIndex];
  const source = raw.data.prose[blockIndex];
  const replacement = freeze.data.replacements.find(item => item.blockIndex === blockIndex);
  const judgment = judgments.data.affected.find(item => item.blockIndex === blockIndex);
  assert.deepEqual(after.source_refs, replacement.source_refs);
  assert.deepEqual(after.source_refs, zh.source_refs);
  assert.deepEqual(after.source_refs, source.source_refs);
  assert.equal(judgment.replacement, replacement.after);
  assert.equal(before.text.split(replacement.before).length, 2);
  const sentenceStream = text => text.split('\n').filter(Boolean);
  assert.deepEqual(sentenceStream(after.text), sentenceStream(before.text.replace(replacement.before, replacement.after)));
  assert.equal(after.source_text, source.text);
  assert.equal(zh.source_text, source.text);
  const oldJudgment = card.objects.find(item => item.index === blockIndex);
  assert.equal(sha(source.text), oldJudgment.rawTextSha256);
  assert.equal(sha(zh.text), oldJudgment.reviewedText.zh.textSha256);
  assert.equal(sha(before.text), oldJudgment.reviewedText.en.textSha256);
  const paragraphs = languages.en.flow.value.paragraphs.filter(item => item.blockIndex === blockIndex).map(item => {
    const lines = item.text.split('\n').filter(Boolean);
    assert.equal(lines.every(line => /[.!?](?:\*\*)?$/.test(line)), true);
    assert.equal(lines.some(line => line.includes(';')), false);
    return { ...item, sentences: lines.length, charactersIncludingNewlinesAndMarkdown: item.text.length, textSha256: sha(item.text) };
  });
  assert.deepEqual(paragraphs.map(item => item.sentences), blockIndex === 17 ? [3, 3] : [2, 3, 3, 2]);
  assert.deepEqual(paragraphs.map(item => item.text), after.text.split('\n\n'));
  assert.deepEqual(languages.en.nativeFlow.value.flow
    .filter(item => item.kind === 'p' && JSON.stringify(item.source_refs) === JSON.stringify(after.source_refs))
    .map(item => item.text), paragraphs.map(item => item.text));
  if (blockIndex === 17) {
    assert.equal(paragraphs[1].text.endsWith('In an elastic solid, shear produces restoring forces.\nThese forces drive the local oscillations.'), true);
  }
  return {
    ...judgment,
    exactTexts: {
      raw: { jsonPointer: `/prose/${blockIndex}/text`, text: source.text, textSha256: sha(source.text), file: raw.binding },
      zh: { jsonPointer: `/prose/${blockIndex}/text`, text: zh.text, textSha256: sha(zh.text), file: languages.zh.current.binding },
      beforeEN: { jsonPointer: `/prose/${blockIndex}/text`, text: before.text, textSha256: sha(before.text), file: languages.en.before.binding },
      repairedEN: { jsonPointer: `/prose/${blockIndex}/text`, text: after.text, textSha256: sha(after.text), file: languages.en.frozen.binding }
    },
    actualRecordedParagraphs: paragraphs
  };
});

function cuts(language, which) {
  const entry = languages[language][which].value;
  return entry.resolvedBreaks.map(index => {
    const before = entry.paragraphs[index - 1];
    const after = entry.paragraphs[index];
    return {
      paragraphIndex: index, blockPair: [before.blockIndex, after.blockIndex],
      sourceRefs: [raw.data.prose[before.blockIndex].source_refs, raw.data.prose[after.blockIndex].source_refs],
      anchors: { before: before.text, after: after.text }
    };
  });
}
const conceptCuts = {};
for (const language of ['zh', 'en']) {
  const before = cuts(language, 'beforeFlow');
  const after = cuts(language, 'flow');
  assert.deepEqual(before.map(item => item.blockPair), judgments.data.conceptCuts.blockPairs);
  assert.deepEqual(after.map(item => item.blockPair), judgments.data.conceptCuts.blockPairs);
  assert.deepEqual(before.map(item => item.sourceRefs), after.map(item => item.sourceRefs));
  for (let index = 0; index < 7; index++) {
    assert.equal(before[index].anchors.before, after[index].anchors.before);
    if (language === 'zh' || ![1, 4].includes(index)) {
      assert.equal(before[index].anchors.after, after[index].anchors.after);
    }
  }
  conceptCuts[language] = { status: 'PASS', before, after };
}
const native = receipt(freeze.data.native, 'existing-affected-native-PASS-receipt-not-rerun');
const nativeResult = receipt(freeze.data.nativeResult, 'existing-affected-native-PASS-result-not-rerun');
assert.equal(native.value.status, 'pass');
assert.deepEqual(native.value, nativeResult.value);
const preservation = bind(freeze.data.preservation.path, freeze.data.preservation.sha256,
  'author-preservation-receipt-text-metadata-only-no-listed-images-read');
assert.equal(preservation.data.status, 'pass');
for (const input of inputs.values()) assert.equal(sha(readFileSync(input.path)), input.sha256, `Final binding drift: ${input.path}`);

const observation = {
  schema: 'ld-s10y-lesson/affected-zhen-binding-observations@1',
  ticket: 'STEMROBIN-181', batch: 'D029', card: 'phy10-c1-s5-n40',
  repairFreeze: freeze.binding, originalReview: original.binding,
  inputBindings: [...inputs.values()],
  checks: {
    status: 'PASS', soleChangedENBlocks: [5, 17], completeZHUnchangedBytewise: true,
    currentAndFrozenTemplatesIdentical: true, beforeTemplatesMatchOriginalReview: true,
    unchangedENObjects: card.objects.filter(item => ![5, 17].includes(item.index)).map(item => item.index),
    sourceAndBlockMetadataUnchanged: true, sentenceReplacementsOnly: true,
    actualRecordedFlowMatchesFrozenTextAndNativeReceipt: true,
    affectedENParagraphGroups: { block5: [2, 3, 3, 2], block17: [3, 3] },
    nativeChecksRerun: false, nativeStatus: 'REUSED-PASS', imagesOpened: 0
  },
  completeContext: { zh: languages.zh.current.data.prose, raw: raw.data.prose },
  blocks, conceptCuts, endBindingCheck: 'PASS'
};
function writeNew(path, value) {
  assert.equal(ownedOutputs.includes(path), true);
  writeFileSync(path, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
  const bytes = readFileSync(path);
  return { path, sha256: sha(bytes), bytes: bytes.length };
}
const observationBinding = writeNew(observationPath, observation);
const report = {
  schema: 'ld-s10y-lesson/independent-affected-zhen-review@1',
  ticket: 'STEMROBIN-181', batch: 'D029', card: 'phy10-c1-s5-n40',
  completedAt: new Date().toISOString(), reviewer: judgments.data.reviewer,
  status: 'AFFECTED-PASS', affectedZHEN: 'PASS', independentZHEN: true,
  reviewedBlocks: [5, 17], repairFreeze: freeze.binding, originalReview: original.binding,
  currentZH: languages.zh.current.binding, repairedEN: languages.en.current.binding,
  frozenEN: languages.en.frozen.binding, raw: raw.binding,
  affectedResults: blocks.map(({ exactTexts, actualRecordedParagraphs, ...judgment }) => ({
    ...judgment,
    textBindings: Object.fromEntries(Object.entries(exactTexts).map(([key, value]) =>
      [key, { file: value.file, jsonPointer: value.jsonPointer, textSha256: value.textSha256 }])),
    paragraphIndices: actualRecordedParagraphs.map(item => item.index),
    sentencesPerParagraph: actualRecordedParagraphs.map(item => item.sentences)
  })),
  inherited: {
    originalSCI: 'PASS', SCIReviewRerun: false, originalZHEN: 'HOLD',
    unaffectedZHEN: 'PASS', unaffectedReviewRerun: false,
    unaffectedBlockIndices: observation.checks.unchangedENObjects,
    source: original.binding,
    priorHOLDsResolvedOnlyForBlocks: [5, 17]
  },
  sevenConceptCuts: {
    status: 'PASS', blockPairs: judgments.data.conceptCuts.blockPairs,
    zhBefore: languages.zh.beforeFlow.value.resolvedBreaks,
    zhAfter: languages.zh.flow.value.resolvedBreaks,
    enBefore: languages.en.beforeFlow.value.resolvedBreaks,
    enAfter: languages.en.flow.value.resolvedBreaks
  },
  reusedNative: { status: 'PASS', rerun: false, receipt: native.binding, result: nativeResult.binding },
  evidence: { judgments: judgments.binding, observations: observationBinding },
  defects: [], scope: judgments.data.scope, fullCardApproval: false,
  endBindingCheck: 'PASS'
};
const reportBinding = writeNew(reportPath, report);
const bindings = writeNew(bindingPath, {
  schema: 'ld-s10y-lesson/affected-review-output-bindings@1',
  ticket: 'STEMROBIN-181', batch: 'D029', card: 'phy10-c1-s5-n40',
  affectedZHEN: 'PASS', repairFreeze: freeze.binding, originalReview: original.binding,
  outputs: [reportBinding, observationBinding, judgments.binding, inputs.get(fileURLToPath(import.meta.url))],
  endInputBindingsUnchanged: true,
  selfBinding: 'This file is externally SHA-256 bound in the reviewer response; no circular self-hash.',
  fullCardApproval: false
});
console.log(JSON.stringify({ status: report.status, affectedZHEN: report.affectedZHEN,
  repairFreeze: freeze.binding, originalReview: original.binding,
  report: reportBinding, bindings, observations: observationBinding,
  paragraphGroups: observation.checks.affectedENParagraphGroups,
  sevenConceptCuts: report.sevenConceptCuts, inputsBound: inputs.size,
  nativeChecksRerun: false, imagesOpened: 0, fullCardApproval: false }, null, 2));
