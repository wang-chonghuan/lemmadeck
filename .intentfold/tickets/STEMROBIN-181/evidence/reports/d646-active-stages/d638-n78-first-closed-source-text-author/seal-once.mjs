import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const cwd = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const own = path.dirname(new URL(import.meta.url).pathname);
const card = 'phy10-c2-s2-n78';
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({ path: file, sha256: sha(file), bytes: fs.statSync(file).size });
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
function write(relative, value) {
  const file = path.join(own, relative);
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
  return bind(file);
}
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(dir, entry.name);
    assert.equal(entry.isSymbolicLink(), false, file);
    return entry.isDirectory() ? walk(file) : [file];
  }).sort();
}
assert.deepEqual(process.argv.slice(2), ['--execute']);
assert.equal(fs.existsSync(path.join(own, 'report.json')), false);
assert.equal(fs.existsSync(path.join(own, 'author-freeze.json')), false);
const inputs = read(path.join(own, 'input-bindings.json'));
const preparation = read(path.join(own, 'preparation-manifest.json'));
const normalized = read(path.join(own, 'normalized-text-contract.json'));
assert.equal(normalized.status, 'PASS-TEXT-STRUCTURE-ONLY');
const unchanged = [
  ...inputs.authorities, ...inputs.pageFiles.flatMap(item => item.files),
  ...inputs.copies.flatMap(item => [item.source, item.copy]),
  inputs.toc, inputs.sourceManifest, ...inputs.tools,
  ...preparation.outputs,
  ...read(path.join(own, 'requirements-freeze.json')).files,
];
const mismatches = unchanged.flatMap(file =>
  sha(file.path) === file.sha256 ? [] : [{ ...file, actualSHA256: sha(file.path) }]);
const d633file = path.join(cwd, '.intentfold/tickets/STEMROBIN-181/evidence/reports/d633-source208-consumed-and-frozen-stages.json');
assert.equal(sha(d633file), '67dc5e71be4b3bd2d9ba7ab09c6c8d394f800e5dadf48199f776dced891dedda');
const d633 = read(d633file);
assert.equal(d633.source208.SOURCE, 'PASS');
assert.equal(d633.source208.firstIndependentReview.sha256, '4cabe077de8772cfe4768c46d16c66b3495f0ea042fd9e839a497f39f91e941c');
const raw = read(path.join(own, 'root/10p/lessons', card, 'lesson.json'));
const n79 = read(path.join(own, 'root/10p/pages/0209/page.json'));
assert.equal(n79.blocks[7].open, true);
const sourceRefs = read(path.join(own, 'source-blocks.json'));
assert.equal(sourceRefs.blocks.filter(item => item.kind === 'ex').length, 0);
assert.equal(sourceRefs.blocks.filter(item => item.kind === 'exhead').length, 0);
const references = text => [...text.matchAll(/(?:图\s*\.?\s*|Figures?\s+)(\d+)(?!\d)/gi)].map(item => item[1]);
const math = text => [...text.matchAll(/\$\$(.+?)\$\$|\$([^$]+?)\$/gs)].map(item => item[1] ?? item[2]);
const candidates = ['zh', 'en'].map(locale => ({
  locale,
  files: ['lesson.template.json', 'exercises.template.json', 'figures.template.json'].map(name => bind(path.join(own, 'candidate', locale, name))),
}));
const occurrenceChecks = [];
for (const locale of ['zh', 'en']) {
  const modern = read(path.join(own, 'candidate', locale, 'lesson.template.json'));
  occurrenceChecks.push({
    locale,
    rows: modern.prose.map((item, index) => {
      const expectedFigures = references(raw.prose[index].text);
      const actualFigures = references(item.text);
      const expectedMath = math(raw.prose[index].text);
      const actualMath = math(item.text);
      assert.deepEqual(actualFigures, expectedFigures);
      assert.deepEqual(actualMath, expectedMath);
      return { index, source_refs: item.source_refs, figureReferenceOccurrenceOrder: actualFigures, mathOccurrenceOrder: actualMath };
    }),
  });
}
const bindingReceipt = write('final-input-binding.json', {
  schema: 'STEMROBIN-181/n78-final-input-byte-binding@1',
  recordedAt: new Date().toISOString(),
  status: mismatches.length ? 'HOLD-INPUT-BYTES-CHANGED-NO-RESTORE' : 'PASS-NAMED-INPUT-BYTES-UNCHANGED',
  checked: unchanged, mismatches, exactOccurrenceChecks: occurrenceChecks,
  canonical208Consumption: {
    receipt: bind(d633file),
    status: d633.source208.status,
    copiedOutputs: d633.outputs.filter(item => /\/0208\//.test(item.path)),
  },
  globalDirtyWorktreeUnchangedNotClaimed: true,
  noStageReruns: true,
});
const flows = read(path.join(own, 'section-boundaries.json')).flows;
const nativeNames = ['assemble-first', 'adapt-prepare-first', 'normalize-and-text-contract-first', 'prose-flow-zh-first', 'prose-flow-en-first'];
const commands = nativeNames.map(name => {
  const file = path.join(own, 'native', name, 'receipt.json');
  const receipt = read(file);
  assert.equal(receipt.exitCode, 0);
  return { name, receipt: bind(file), command: receipt.command, exitCode: receipt.exitCode, attempt: receipt.attempt };
});
const createdFileNames = [
  ...walk(own).map(file => path.relative(own, file)),
  'report.json', 'author-freeze.json',
].sort();
const report = write('report.json', {
  schema: 'STEMROBIN-181/n78-first-closed-source-bilingual-text-author@1',
  ticket: 'STEMROBIN-181', batch: 'd638', card,
  checkout: cwd, ownedRoot: own, recordedAt: new Date().toISOString(),
  status: mismatches.length
    ? 'FIRST-AUTHOR-FROZEN-INPUT-DRIFT-HOLD-NO-RETRY'
    : 'FIRST-CLOSED-SOURCE-PREPARED-BILINGUAL-TEXT-AUTHORED-FROZEN-INDEPENDENT-SCI-ZHEN-PENDING',
  workflow: {
    humanResumeActive: true, boundedExistingAssignment: true, shortLived: true,
    firstSourceRequirementsExtendedBeforeModernAuthoring: true,
    requirementsFreeze: bind(path.join(own, 'requirements-freeze.json')),
    sourceRequirements: bind(path.join(own, 'source-requirements.json')),
    sourceBlocks: bind(path.join(own, 'source-blocks.json')),
    d619FirstNineRequirementsPreservedExactly: true,
    requirementCount: 15, appendOnlyAddedRequirements: 6,
    preparation: bind(path.join(own, 'preparation-manifest.json')),
    sourcePagesCopied: [206, 207, 208, 209],
    canonical206207208BytesCopiedWithoutEdits: true,
    source209FrozenReviewedCandidateCopiedWithoutEdits: true,
    rootIsFourPageSparseCopy: true,
    assembleInvocations: 1, selectedAdaptPrepareInvocations: 1,
    nativeStageReruns: 0, sourceFinalizeVectorizeInvocations: 0,
    adaptFinalizeAndRenderInvocations: 0, canonicalBookAssemblies: 0,
    ownAuxiliaryInterruption: bind(path.join(own, 'preparation-interruption.json')),
    ownAuxiliaryInterruptionPreservedNoNativeRetry: true,
    nativeCommands: commands,
  },
  authority: {
    source206207: inputs.authorities.filter(item => /d594|d606/.test(item.path)),
    source208Independent: inputs.authorities.find(item => /d624.*report/.test(item.path)),
    canonical208Consumption: bind(d633file),
    source209Independent: inputs.authorities.find(item => /d631.*report/.test(item.path)),
    source209Author: inputs.authorities.find(item => /d625.*report/.test(item.path)),
    historicalD631Source208Pending: 'Retained verbatim in original report; current dependency is satisfied by pinned d624 accepting the identical208 page bytes, consumed through d633. No old note or report was rewritten.',
    originalInputs: bind(path.join(own, 'input-bindings.json')),
    finalBinding: bindingReceipt,
    mismatches,
  },
  boundary: {
    leftAt: 'p0206#12', rightAfter: 'p0209#3', rightBefore: 'p0209#4',
    exactNextHeading: '79. 眼睛　眼镜',
    opaqueProjectionJoinedSourceRefs: ['p0208#6', 'p0209#3'],
    n79: {
      status: 'HOLD-OPEN-UNTOUCHED-NOT-AUTHORED',
      nativeMergedOpenRef: 'p0209#5', physicalTailRef: 'p0209#8',
      outgoingOpen: true, copiedBoundaryContextOnly: true,
      sourceFig184CopiedForNativeSparseAssemblyOnly: true,
      figure184AbsentFromN78Templates: true,
      nextPageRead: false,
    },
  },
  text: {
    candidates, mapping: bind(path.join(own, 'source-text-mapping.json')),
    sourceSnapshotUnchanged: true, nativeIdentityUnchanged: true,
    nativeTitlesUnchangedBothLanguages: true,
    titleMappings: [
      { locale: 'zh', nativeTitle: '照相机 投影仪', nativePrintedTitle: '78. 照相机 投影仪', displayTitle: '照相机与投影仪', displayPrintedTitle: '78. 照相机与投影仪' },
      { locale: 'en', nativeTitle: '照相机 投影仪', nativePrintedTitle: '78. 照相机 投影仪', displayTitle: 'Cameras and Projectors', displayPrintedTitle: '78. Cameras and Projectors' },
    ],
    displayProjectionApplied: false,
    sourceProseObjects: 15, authoredProseTextObjects: 9,
    originalWrittenQuestions: 0, originalExerciseGroups: 0,
    emptyExerciseTemplatesUnchanged: true, noAnswerChoiceOrInputArtifacts: true,
    sourceIntervalExerciseRows: [], sourceIntervalExerciseGroupRows: [],
    eightSource206QuestionsBeforeHeading78Excluded: true,
    normalizedTextContract: bind(path.join(own, 'normalized-text-contract.json')),
    sourceFormulaAndNumericSignaturesPreserved: true,
    sourceFigureReferenceOccurrencesPreservedInOrder: true,
    mathReuse: bind(path.join(own, 'math-reuse.json')),
    sourceMathOccurrencesPerLocale: 6, newKaTeXSpans: 0,
    newKaTeXValidationCalls: 0, existingMathReusedWithFirstNativeAssembleEvidence: true,
    sectionBoundaries: bind(path.join(own, 'section-boundaries.json')),
    finalFlows: flows.map(item => ({ locale: item.locale, paragraphs: item.paragraphCount, sectionBreaks: item.boundaries.length, commandReceipt: item.commandReceipt })),
    boundariesDerivedAfterExistingNormalizeLessonLayout: true,
    noPostAnchorTextEdits: true,
    scientificClarifications: [
      'Film/plate chemical recording is not silently replaced by digital electronic recording.',
      'Camera image, focusing and focused projector enlargement are scoped to the thin-lens/paraxial model.',
      'Exposure retains photosensitive-material sensitivity and film irradiance; aperture/image-distance comparisons keep object radiance, transmission and relevant conditions fixed.',
      'Aperture reduces defocus circles and increases acceptable depth of field in the geometrical regime, not exact simultaneous focus; diffraction and aberrations qualify real finite-aperture imaging.',
      'O objective, D slide and K condenser retain source order and distinct imaging/illumination roles.',
      'Magnification adjustment preserves coupled objective/slide and projector/screen motions needed to remain focused.',
      'Opaque projection uses strongly illuminated reflected light from an object such as a book illustration; no new mirror geometry or apparatus measurements.',
    ],
    numericHistoricalExpressions: '19 and30 remain literal numeric expressions in both languages; the English text includes exact-source notation after the spelled-out historical period.',
    unchangedTextHasChangesEmpty: true,
    changesLimitedToLanguageLayoutClarificationAndPlannedFigures: true,
    scientificIndependentApprovalClaimed: false,
  },
  figures: {
    sourceIds: ['fig-181', 'fig-182', 'fig-183'],
    rawContextOnlyId: 'fig-184',
    status: 'MODERN-AUTHOR-PENDING',
    templatesArePlansOnly: true,
    sourceCopiesAreNotModernFigures: true,
    rawPNGAndSVGReadAsOpaqueBytesOnly: true,
    imageOpens: 0, imageDecoderCalls: 0, imageRenderCalls: 0,
    modernFigureSpecificationsCreated: 0, modernFigureOutputsCreated: 0,
    modernFigureApprovals: 0,
  },
  conditions: {
    preparation: 'PASS-FIRST-SCOPED-NATIVE',
    textStructure: 'PASS-LOCAL-TEXT-CONTRACT-ONLY',
    SCI: 'PENDING-FIRST-INDEPENDENT',
    ZHEN: 'PENDING-FIRST-INDEPENDENT',
    FIG: 'PENDING-FIRST-MODERN-AUTHOR-AND-INDEPENDENT-REVIEW',
    DISPLAY: 'NOT-RUN-PENDING',
    wholeCardApproved: false, completeCardsAdded: 0,
    parentNext: 'Consume these frozen first-author templates for first independent SCI/ZHEN; handle modern figures separately afterward. This batch performs no further production.',
  },
  scope: {
    writesOnlyInsideOwnedRoot: true, canonicalWrites: 0,
    newWorkers: 0, newWorktrees: 0, newBranches: 0, modelChanges: 0,
    networkCalls: 0, backendReadsWrites: 0, databaseCalls: 0, paidCalls: 0,
    envFileReadsWrites: 0, mergesDeploysPublishes: 0,
    historicalFAILHOLDPreserved: true, unrelatedDirtyBytesNotReverted: true,
    globalConcurrentBytesUnchangedNotClaimed: true,
    nativeFirstFAILReceipts: 'None: assemble and adapt-prepare both exit0. The own post-assemble assertion stop is retained separately.',
    broadCorpusChecks: 0,
    scopeDeviation: [],
  },
  exactCreatedFileNames: createdFileNames,
  freeze: {
    path: path.join(own, 'author-freeze.json'), requiredAllRegularFileMode: '0444',
    reportAndSixCandidateTemplatesBound: true,
    allOwnedRegularFilesBoundExceptFreezeSelf: true,
    freezeSHAReturnedExternally: true,
  },
  boundedBatchFinished: true, followOnProduction: false,
  returnContract: 'Text, final paths/SHA and pending conditions only.',
});
const files = walk(own);
for (const file of files) fs.chmodSync(file, 0o444);
const freeze = write('author-freeze.json', {
  schema: 'STEMROBIN-181/n78-first-author-freeze@1',
  ticket: 'STEMROBIN-181', batch: 'd638', card,
  recordedAt: new Date().toISOString(),
  status: 'FROZEN-FIRST-AUTHOR-NOT-INDEPENDENT-PASS',
  report, requirementsFreeze: bind(path.join(own, 'requirements-freeze.json')),
  files: files.map(file => ({ ...bind(file), mode: '0444' })),
  selfExcludedFromHashList: true,
  exactCreatedFileNames: [...files.map(file => path.relative(own, file)), 'author-freeze.json'].sort(),
  noFurtherProduction: true,
});
fs.chmodSync(freeze.path, 0o444);
for (const file of [...files, freeze.path]) assert.equal(fs.statSync(file).mode & 0o777, 0o444);
assert.deepEqual(walk(own).map(file => path.relative(own, file)).sort(), createdFileNames);
console.log(JSON.stringify({
  status: read(report.path).status, report, freeze,
  requirementsFreeze: bind(path.join(own, 'requirements-freeze.json')),
  requirements: bind(path.join(own, 'source-requirements.json')),
  sourceBlocks: bind(path.join(own, 'source-blocks.json')),
  candidates, allOwnedFilesMode: '0444', regularFiles: files.length + 1,
  images: 0, questions: 0,
  SCI: 'PENDING-FIRST-INDEPENDENT', ZHEN: 'PENDING-FIRST-INDEPENDENT',
  FIG: 'PENDING', DISPLAY: 'NOT-RUN', boundedBatchFinished: true,
}, null, 2));
