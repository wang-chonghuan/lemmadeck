import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const evidenceRoot = path.dirname(fileURLToPath(import.meta.url));
const tmpRoot = path.dirname(evidenceRoot);
const repoRoot = path.resolve(tmpRoot, '../../../../');
const repairRoot = path.join(tmpRoot, 'd035-n124-directed-flux-repair');
const authorRoot = path.join(tmpRoot, 'd035-n124-prose-author');
const inputBytes = new Map();
const fileBindings = [];
const sha = value => createHash('sha256').update(value).digest('hex');
const absolute = value => path.resolve(repoRoot, value);
const noLineBreaks = value => value.replace(/[\r\n]/g, '');
const tokens = value => [...value.matchAll(/\$[^$]*\$/g)].map(match => match[0]);

function readText(filename, expectedSha256) {
  const resolved = absolute(filename);
  assert.match(path.extname(resolved), /^\.(json|txt|md|mjs)$/);
  const bytes = fs.readFileSync(resolved);
  const observedSha256 = sha(bytes);
  if (expectedSha256 !== undefined) assert.equal(observedSha256, expectedSha256, resolved);
  if (inputBytes.has(resolved)) assert.equal(observedSha256, sha(inputBytes.get(resolved)), resolved);
  else {
    inputBytes.set(resolved, bytes);
    fileBindings.push({
      path: resolved,
      expectedSha256: expectedSha256 ?? null,
      observedSha256,
      match: expectedSha256 === undefined ? null : true,
    });
  }
  return bytes.toString('utf8');
}

const readJson = (filename, expectedSha256) => JSON.parse(readText(filename, expectedSha256));
const checkBinding = binding => readJson(binding.path, binding.sha256);
const withoutAffectedText = document => {
  const copy = structuredClone(document);
  delete copy.prose[6].text;
  return copy;
};

const originalPath = path.join(tmpRoot, 'd035-n124-science-review.json');
const originalSha = '698f554bedacdafbc973eb7171e0a4827be7cdaeac2ed24d8e69a2e67c771b27';
const repairPath = path.join(repairRoot, 'repair-freeze.json');
const repairSha = '39d31f396eede200a2178c140afaec3ee4266b55a1d555d154cfd3ae257561b3';
const original = readJson(originalPath, originalSha);
const repair = readJson(repairPath, repairSha);
assert.equal(original.status, 'FAIL-SCI-p0307#10;PASS-ZHEN-fidelity-only');
assert.equal(repair.originalReview.sha256, originalSha);
assert.equal(absolute(repair.originalReview.path), originalPath);
assert.equal(repair.card, original.card);
assert.deepEqual(repair.sourceRefs, ['p0307#10']);

const originalFreeze = checkBinding(repair.originalFreeze);
assert.equal(repair.originalFreeze.sha256, original.freeze.observedSha256);
const required = original.requiredAffectedChanges.find(change => change.defect === 'SCI-1');
assert.ok(required);
assert.deepEqual(repair.requestedChanges, required);
assert.deepEqual(required.sourceRefs, ['p0307#10']);

const oldZh = checkBinding(originalFreeze.frozenFiles.lessonTemplate);
const oldEn = checkBinding(originalFreeze.frozenFiles.englishLesson);
const currentZh = checkBinding(repair.outputs[0]);
const currentEn = checkBinding(repair.outputs[1]);
assert.equal(repair.outputs.length, 2);
assert.equal(absolute(repair.outputs[0].path), path.join(repairRoot, 'frozen/lesson.template.json'));
assert.equal(absolute(repair.outputs[1].path), path.join(repairRoot, 'frozen/english.lesson.json'));

const stagedZh = readJson(path.join(repairRoot, 'before-normalization/lesson.json'));
const stagedEn = readJson(path.join(repairRoot, 'before-normalization/english.lesson.json'));
assert.deepEqual(readJson(path.join(repairRoot, 'before/lesson.json')), oldZh);
assert.deepEqual(readJson(path.join(repairRoot, 'before/english.lesson.json')), oldEn);

const affectedBindings = [];
for (const [language, old, staged, current, wording] of [
  ['zh', oldZh, stagedZh, currentZh, required.chinese],
  ['en', oldEn, stagedEn, currentEn, required.english],
]) {
  assert.equal(old.prose.length, 7);
  assert.equal(current.prose.length, 7);
  assert.deepEqual(current.prose[6].source_refs, ['p0307#10']);
  assert.equal(current.prose[6].kind, 'p');
  assert.equal(old.prose[6].text, wording.before);
  assert.equal(staged.prose[6].text, wording.requiredAfter);
  assert.equal(noLineBreaks(current.prose[6].text), noLineBreaks(wording.requiredAfter));
  assert.deepEqual(withoutAffectedText(staged), withoutAffectedText(old));
  assert.deepEqual(withoutAffectedText(current), withoutAffectedText(old));
  const expectedTokens = ['$S$', '$\\vec{B}$', '$B$', '$S$'];
  for (const body of [wording.before, wording.requiredAfter, staged.prose[6].text,
    current.prose[6].text, current.prose[6].source_text]) {
    assert.deepEqual(tokens(body), expectedTokens);
  }
  assert.equal(tokens(current.prose[6].text).filter(token => token.includes('=')).length, 0);
  assert.equal(current.exercise_count, 0);
  affectedBindings.push({
    language,
    pointer: '/prose/6/text',
    before: wording.before,
    requiredAfter: wording.requiredAfter,
    currentNativeText: current.prose[6].text,
    beforeSha256: sha(wording.before),
    requiredAfterSha256: sha(wording.requiredAfter),
    currentNativeTextSha256: sha(current.prose[6].text),
    beforeMatchesOriginalReportExactly: true,
    stagedAfterMatchesOriginalReportExactly: true,
    normalizedAfterDiffersOnlyByLineBreaks: true,
    mathTokens: expectedTokens,
    mathTokenCount: 4,
    allOtherDocumentValuesUnchanged: true,
    sourceTextSha256: sha(current.prose[6].source_text),
  });
}

const reuse = original.objects.filter(object => object.sourceRef !== 'p0307#10').map(object => {
  const index = object.proseIndexZeroBased;
  assert.equal(object.SCI_ZH, 'PASS');
  assert.equal(object.SCI_EN, 'PASS');
  assert.equal(object.ZHEN, 'PASS');
  assert.deepEqual(currentZh.prose[index], oldZh.prose[index]);
  assert.deepEqual(currentEn.prose[index], oldEn.prose[index]);
  assert.deepEqual(currentZh.prose[index].source_refs, object.sourceRefs);
  assert.equal(sha(currentZh.prose[index].source_text), object.sourceTextSha256);
  assert.equal(sha(currentEn.prose[index].source_text), object.sourceTextSha256);
  assert.equal(sha(currentZh.prose[index].text), object.chineseBodySha256);
  assert.equal(sha(currentEn.prose[index].text), object.englishBodySha256);
  return {
    sourceRef: object.sourceRef,
    sourceRefs: object.sourceRefs,
    proseIndexZeroBased: index,
    mode: 'REUSED-exact-original-PASS-no-substantive-rereview',
    SCI_ZH: object.SCI_ZH,
    SCI_EN: object.SCI_EN,
    ZHEN: object.ZHEN,
    sourceTextSha256: object.sourceTextSha256,
    chineseBodySha256: object.chineseBodySha256,
    englishBodySha256: object.englishBodySha256,
    qualifierDependencies: object.qualifierDependencies,
    completeObjectsIncludingMetadataUnchanged: true,
    qualifierDependencyObjectsUnchanged: object.qualifierDependencies.every(ref =>
      original.objects.some(dependency => dependency.sourceRef === ref &&
        dependency.sourceRef !== 'p0307#10')),
  };
});
assert.deepEqual(reuse.map(object => object.sourceRef), required.unaffectedObjectsMustRemainUnchanged);
assert.ok(reuse.every(object => object.qualifierDependencyObjectsUnchanged));
const affectedOriginal = original.objects.find(object => object.sourceRef === 'p0307#10');
assert.equal(sha(oldZh.prose[6].source_text), affectedOriginal.sourceTextSha256);
assert.equal(sha(oldEn.prose[6].source_text), affectedOriginal.sourceTextSha256);
assert.equal(sha(oldZh.prose[6].text), affectedOriginal.chineseBodySha256);
assert.equal(sha(oldEn.prose[6].text), affectedOriginal.englishBodySha256);
for (const dependency of affectedOriginal.qualifierDependencies) {
  assert.ok(reuse.some(object => object.sourceRef === dependency));
}

const flow = checkBinding(repair.flow);
const validation = checkBinding(repair.validation);
const oldFlow = checkBinding(originalFreeze.bindings['native-flow.json']);
const receipts = new Map();
for (const binding of repair.commands) {
  const receipt = checkBinding(binding);
  assert.equal(receipt.exitCode, 0);
  assert.equal(receipt.signal, null);
  assert.equal(receipt.error, null);
  const streams = {};
  for (const key of ['stdin', 'stdout', 'stderr']) {
    streams[key] = receipt[key] ? readText(receipt[key].path, receipt[key].sha256) : null;
  }
  assert.equal(streams.stderr, '');
  receipts.set(path.basename(binding.path, '.json'), { receipt, streams });
}
assert.deepEqual([...receipts.keys()],
  ['normalize', 'validate-text', 'prose-flow-zh', 'prose-flow-en']);
const normalizeInput = JSON.parse(receipts.get('normalize').streams.stdin);
const normalizeOutput = JSON.parse(receipts.get('normalize').streams.stdout);
assert.equal(normalizeInput.mode, 'normalize');
assert.deepEqual(normalizeInput.documents, [stagedZh, stagedEn]);
assert.deepEqual(normalizeOutput.documents, [currentZh, currentEn]);
const validateInput = JSON.parse(receipts.get('validate-text').streams.stdin);
assert.equal(validateInput.mode, 'validate');
assert.deepEqual(validateInput.lesson, currentZh);
assert.deepEqual(validateInput.english, currentEn);
assert.deepEqual(JSON.parse(receipts.get('validate-text').streams.stdout), validation);
assert.deepEqual(validation.errors, []);
assert.equal(validation.sourceTasks, 0);
assert.equal(validation.mathAtoms, 19);
assert.equal(validation.sourceApproval, false);
assert.equal(validation.independentSCIApproval, false);
assert.equal(flow.length, 2);

const nativeBindings = [];
for (const [index, language, current] of [[0, 'zh', currentZh], [1, 'en', currentEn]]) {
  const stored = flow[index];
  const previous = oldFlow[language];
  assert.equal(stored.actualNativeCliText, receipts.get(`prose-flow-${language}`).streams.stdout);
  assert.equal(absolute(receipts.get(`prose-flow-${language}`).receipt.args[1]),
    absolute(repair.outputs[index].path));
  const originalAffectedIndices = language === 'zh'
    ? affectedOriginal.chineseNativeIndicesZeroBased
    : affectedOriginal.englishNativeIndicesZeroBased;
  assert.deepEqual(stored.paragraphs.filter(paragraph => paragraph.blockIndex !== 6)
    .map(({ index: paragraphIndex, text }) => ({ index: paragraphIndex, text })),
  previous.paragraphs.filter(paragraph => !originalAffectedIndices.includes(paragraph.index)));
  assert.deepEqual(current.section_breaks, previous.selectedBoundaries);
  const resolvedFromRetainedAnchors = previous.selectedBoundaries.map(boundary => {
    const after = stored.paragraphs.findIndex(paragraph => paragraph.text === boundary.after);
    assert.ok(after > 0);
    assert.equal(stored.paragraphs[after - 1].text, boundary.before);
    return after;
  });
  assert.deepEqual(stored.resolvedBreaks, resolvedFromRetainedAnchors);
  const affected = stored.paragraphs.filter(paragraph => paragraph.blockIndex === 6);
  assert.deepEqual(affected.map(paragraph => paragraph.paragraphInBlock),
    affected.map((_, number) => number));
  assert.equal(affected.map(paragraph => paragraph.text).join('\n\n'), current.prose[6].text);
  for (const paragraph of affected) {
    assert.ok(stored.actualNativeCliText.includes(`[${paragraph.index}] ${paragraph.text}\n`));
  }
  nativeBindings.push({
    language,
    templatePath: absolute(repair.outputs[index].path),
    templateSha256: repair.outputs[index].sha256,
    affectedBlockIndexZeroBased: 6,
    affectedNativeIndicesZeroBased: affected.map(paragraph => paragraph.index),
    affectedParagraphs: affected,
    exactJoinedNativeBodySha256: sha(affected.map(paragraph => paragraph.text).join('\n\n')),
    exactJoinedNativeBodyMatchesTemplate: true,
    cliStdoutMatchesRetainedFlowExactly: true,
    unaffectedNativeParagraphBodiesAndIndicesUnchanged: true,
    sectionAnchorsUnchanged: true,
    layoutApproval: false,
  });
}
const currentAllTokens = currentZh.prose.flatMap(block => tokens(block.text));
assert.deepEqual(currentAllTokens, oldZh.prose.flatMap(block => tokens(block.text)));
assert.deepEqual(currentEn.prose.flatMap(block => tokens(block.text)),
  oldEn.prose.flatMap(block => tokens(block.text)));
assert.equal(currentAllTokens.length, 19);
assert.deepEqual(tokens(currentZh.prose[1].text).filter(token => token.includes('=')),
  ['$\\Phi=BS\\cos\\alpha$']);
assert.deepEqual(tokens(currentZh.prose[4].text).filter(token => token.includes('=')),
  ['$B\\cos\\alpha=B_n$', '$\\Phi=B_nS$']);
const affectedSignature = validation.signatures.find(signature =>
  JSON.stringify(signature.source_refs) === JSON.stringify(['p0307#10']));
assert.ok(affectedSignature);
assert.deepEqual(affectedSignature.exactSourceMathTokens, tokens(currentZh.prose[6].text));
for (const field of ['sourceMath', 'chineseMath', 'englishMath']) {
  assert.deepEqual(affectedSignature[field], ['S', '\\vec{B}', 'B', 'S']);
}

// Compare only text artifacts; never follow or hash media references.
const untouchedArtifacts = [];
for (const key of ['lessonTemplate', 'englishLesson', 'exercisesTemplate',
  'englishExercises', 'figuresTemplate', 'texts']) {
  const binding = originalFreeze.frozenFiles[key];
  readText(binding.path, binding.sha256);
  readText(binding.originalPath, binding.sha256);
  untouchedArtifacts.push({ key, sha256: binding.sha256, frozenAndOriginalPathsUnchanged: true });
}
assert.deepEqual(validateInput.exercises, checkBinding(originalFreeze.frozenFiles.exercisesTemplate));
for (const [snapshot, expectedSha256] of [
  ['inputs/source/lesson.json', original.bindingVerification.sourceLessonSha256],
  ['inputs/source/lesson.md', original.bindingVerification.sourceMarkdownSha256],
  ['root/9p/pages/0307/page.json', original.bindingVerification.sourcePageJsonSha256],
]) readText(path.join(authorRoot, snapshot), expectedSha256);
const authoritiesPath = original.primaryEvidence;
const authorities = readJson(authoritiesPath,
  '4eee65a9786829ce3495e4f424d128ac2c3699ab5573caa230ce28aeefa9464e');
assert.deepEqual(authorities.authorities.map(authority => authority.id), ['PHYS-1', 'PHYS-2']);
for (const [filename, bytes] of inputBytes) {
  assert.equal(sha(fs.readFileSync(filename)), sha(bytes), `Input changed during check: ${filename}`);
}
const evidence = {
  schema: 'ld-s10y-lesson/affected-text-binding-evidence@1',
  ticket: original.ticket,
  card: original.card,
  date: '2026-11-17',
  status: 'PASS',
  method: 'Read-only SHA-256 and structured comparisons, not execution of native stages.',
  verifier: fileURLToPath(import.meta.url),
  verifierSha256: sha(fs.readFileSync(fileURLToPath(import.meta.url))),
  originalReview: { path: originalPath, sha256: originalSha, status: original.status, unchanged: true },
  repairFreeze: { path: repairPath, sha256: repairSha, unchanged: true },
  exactCurrentTemplates: repair.outputs.map(binding => ({ ...binding, path: absolute(binding.path) })),
  affectedBindings,
  reusedObjects: reuse,
  nativeBindings,
  untouchedArtifacts,
  allSevenProseObjectsMetadataAndAllNonAffectedValuesUnchanged: true,
  retainedSourceTextAndSourceRefsUnchanged: true,
  all19MathTokensUnchanged: true,
  unchangedFormulae: ['$\\Phi=BS\\cos\\alpha$', '$B\\cos\\alpha=B_n$', '$\\Phi=B_nS$'],
  equationTagsUnchanged: ['12-1', '12-2'],
  sourceAndModernTasks: 0,
  nativeReceipts: [...receipts].map(([name, { receipt }]) => ({
    name, exitCode: receipt.exitCode, executedByReviewer: false,
  })),
  nativeTextResultBoundToExactCurrentInputs: true,
  retainedAuthorityEvidence: {
    path: authoritiesPath,
    sha256: sha(inputBytes.get(absolute(authoritiesPath))),
    authorityIds: authorities.authorities.map(authority => authority.id),
    webRequests: 0,
  },
  fileBindings,
  uniqueReadOnlyTextBindings: fileBindings.length,
  allReadInputsUnchangedAtCompletion: true,
  verifierExecution: {
    attempts: 2,
    firstAttempt: 'Exited 1 before writing evidence: original flow paragraphs lack the repair flow blockIndex/paragraphInBlock fields.',
    correction: 'Compare original index/text projections, excluding original affected indices recorded in the independent report; resolve unchanged anchors from retained paragraph text.',
    nativeInvocations: 0,
    inputEdits: 0,
  },
  mismatches: [],
  approval: { source: false, RAW: false, tokens: false, figure: false,
    native: false, render: false, display: false, fullCard: false, publication: false },
  scope: 'One affected bilingual text object; unaffected science and fidelity judgments are inherited, not rerun.',
};
const outputPath = path.join(evidenceRoot, 'binding-verification.json');
fs.writeFileSync(outputPath, `${JSON.stringify(evidence, null, 2)}\n`);
console.log(JSON.stringify({
  status: evidence.status,
  output: outputPath,
  outputSha256: sha(fs.readFileSync(outputPath)),
  uniqueReadOnlyTextBindings: evidence.uniqueReadOnlyTextBindings,
  exactCurrentTemplates: evidence.exactCurrentTemplates,
  affectedBodyHashes: affectedBindings.map(binding => ({
    language: binding.language,
    requiredAfterSha256: binding.requiredAfterSha256,
    currentNativeTextSha256: binding.currentNativeTextSha256,
  })),
  nativeBindings: nativeBindings.map(binding => ({
    language: binding.language,
    affectedNativeIndicesZeroBased: binding.affectedNativeIndicesZeroBased,
  })),
  reusedSourceRefs: reuse.map(object => object.sourceRef),
}, null, 2));
