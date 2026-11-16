import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const ticket = '.intentfold/tickets/STEMROBIN-181/tmp';
const proof = `${ticket}/9p-n82-figure-review-157-proof`;
const authorRoot = '.tmp/STEMROBIN-181/9p-d021-n82-fig155-157';
const native = `${ticket}/d021-n82-context-update/fig-157`;
const lessonPath = '.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/phy9-c2-s2-n82/lesson.template.json';
const sourcePath = 'ssot-resources/soviet10year-textbooks/artifacts/9p/figures/fig-157.png';
const reportPath = `${ticket}/9p-n82-figure-review-157.json`;
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const absolute = file => path.resolve(root, file);
const load = async file => JSON.parse(await fs.readFile(absolute(file), 'utf8'));
const bind = async file => {
  const bytes = await fs.readFile(absolute(file));
  return { path: path.relative(root, absolute(file)), sha256: hash(bytes), bytes: bytes.length };
};
const verify = async record => {
  const actual = await bind(record.path);
  assert.equal(actual.sha256, record.sha256, `Binding changed: ${record.path}`);
  return actual;
};
const writeNew = async (file, value) => {
  const destination = absolute(file);
  assert.ok(file === reportPath || destination.startsWith(`${absolute(proof)}/`));
  await fs.writeFile(destination, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
};

assert.equal(await fs.realpath(process.cwd()), root);
const authorPath = `${authorRoot}/author-freeze.json`;
const updatePath = `${ticket}/d021-n82-figure-context-update.json`;
const inventoryPath = `${proof}/independent-source-inventory.json`;
await verify({ path: authorPath, sha256: 'ba9bb66a48ab05e32a212858f929af4154e384d105f93d48a8b2d19f506b1d0f' });
await verify({ path: updatePath, sha256: 'fdec879f848f8da30104932c7646c73a0448439d4c66ff25175712b40576e1ea' });
await verify({ path: inventoryPath, sha256: '1975913bbd84168d21e5495136f50d658ba03aed9df12e5d06d93d7982d5a5cc' });
const author = await load(authorPath);
const update = await load(updatePath);
const row = update.rows.find(item => item.id === 'fig-157');
assert.ok(row);
for (const record of Object.values(row.before)) await verify(record);
for (const record of Object.values(row.after)) await verify(record);
await verify(row.context);
assert.equal(row.geometryDisplayLabelsAssertionsInventoryUnchanged, true);
assert.equal(row.geometryRepairsAdded, 0);
assert.equal(row.imageOpens, 0);

const initialSpec = await load(row.before.spec.path);
const spec = await load(row.after.spec.path);
const initialWithoutText = structuredClone(initialSpec);
const currentWithoutText = structuredClone(spec);
delete initialWithoutText.source.authoritativeText;
delete currentWithoutText.source.authoritativeText;
assert.deepEqual(currentWithoutText, initialWithoutText);
assert.deepEqual(row.delta.before, initialSpec.source.authoritativeText);
assert.deepEqual(row.delta.after, spec.source.authoritativeText);
assert.deepEqual(await fs.readFile(absolute(row.after.svg.path)), await fs.readFile(absolute(row.before.svg.path)));
assert.equal(spec.id, 'fig-157');
assert.equal(spec.mode, 'deterministic');
await verify(spec.source.image);
const source = await bind(sourcePath);
assert.equal(source.sha256, spec.source.image.sha256);

const lesson = await load(lessonPath);
const historicalLessonPath = `${ticket}/d021-n82-text-correction-before/lesson.template.json`;
const historicalLesson = await load(historicalLessonPath);
const historicalLessonBinding = await verify({
  path: historicalLessonPath,
  sha256: '8567d8ac59eb0e01467e28dfcd55e91049ff8d0bae9fa28731ff6095a65cbf76',
});
await verify(author.inputs.lessonTemplate.frozen);
assert.deepEqual(await fs.readFile(absolute(author.inputs.lessonTemplate.frozen.path)), await fs.readFile(absolute(historicalLessonPath)));
const lessonBinding = await verify({
  path: lessonPath,
  sha256: 'f02013f1d141f90eb8566e07660df6584ae437e7e19967e4eda792bbfd3e2b63',
});
const fullText = [lesson.printed_title, ...lesson.prose.map(block => block.text).filter(Boolean)].join('\n\n');
assert.deepEqual(spec.source.authoritativeText, [{ lesson: lesson.id, text: fullText }]);
assert.equal(lesson.prose.length, 24);
const changedBlocks = lesson.prose.flatMap((block, index) =>
  JSON.stringify(block) === JSON.stringify(historicalLesson.prose[index]) ? [] : [index]);
assert.deepEqual(changedBlocks, [14]);
const correctionPath = `${ticket}/9p-n82-prose-correction-freeze.json`;
const sciencePath = `${ticket}/9p-n82-science-review.json`;
const initialProsePath = `${ticket}/9p-n82-prose-freeze.json`;
const correction = await load(correctionPath);
const science = await load(sciencePath);
await verify(update.correction);
await verify(correction.bindings.lessonTemplate);
await verify(correction.initialAuthorFreeze);
await verify(science.bindings.authorFreeze);
await verify(science.bindings.lessonTemplate);
await verify(science.bindings.initialReviewBinding.snapshot);
await verify(science.bindings.initialLessonTemplateBinding.snapshot);
assert.equal(science.status, 'pass');
assert.deepEqual(correction.changedBlocks, [14]);
assert.equal(science.coverage.find(item => item.index === 14).status, 'pass');
assert.equal(science.coverage.find(item => item.index === 22).status, 'pass');

const render = await load(`${native}/render.json`);
const renderBinding = await bind(`${native}/render.json`);
const specBinding = await bind(`${native}/spec.json`);
const svgBinding = await bind(`${native}/fig-157.svg`);
assert.equal(render.schema, 'ld-s10y-image/render@2');
assert.equal(render.figure, spec.id);
assert.equal(render.status, 'pass');
await verify(render.spec);
await verify(render.output.svg);
assert.equal(render.spec.sha256, specBinding.sha256);
assert.equal(render.output.svg.sha256, svgBinding.sha256);
assert.deepEqual(render.collisions, []);

const previewPath = author.results['fig-157'].previews.path;
await verify(author.results['fig-157'].previews);
const previews = await load(previewPath);
await verify(previews.svg);
await verify(previews.spec);
assert.equal(previews.svg.sha256, svgBinding.sha256);
assert.equal(previews.spec.sha256, row.before.spec.sha256);
assert.deepEqual(previews.widths.map(item => item.width), [640, 331, 342]);
assert.deepEqual(previews.errors, []);
for (const item of previews.widths) await verify(item.screenshot);
for (const check of render.displayChecks) {
  assert.equal(check.status, 'pass');
  assert.deepEqual(check.failures, []);
}
assert.equal(author.observations.observations['fig-157'].repairs, 0);
await verify({
  path: `${authorRoot}/source-inventory.json`,
  sha256: 'caeb4d1dff9fb2dff54fe7a08b9086b89d4cd4d6be92e2a81dc2b896b5ce5542',
});

// Parse the already-rendered XML only; no browser, renderer or image decoding.
const xml = JSON.parse(execFileSync('python3', ['-c', [
  'import json,sys,xml.etree.ElementTree as E',
  'r=E.parse(sys.argv[1]).getroot()',
  'tag=lambda x:x.tag.rsplit("}",1)[-1]',
  'labels=[{"text":"".join(x.itertext()),"attributes":x.attrib} for x in r.iter() if tag(x)=="text"]',
  'print(json.dumps({"viewBox":r.get("viewBox"),"width":r.get("width"),"height":r.get("height"),"labels":labels,"images":sum(tag(x)=="image" for x in r.iter()),"foreignObjects":sum(tag(x)=="foreignObject" for x in r.iter())}))',
].join('\n'), absolute(svgBinding.path)], { encoding: 'utf8' }));
assert.equal(xml.viewBox, '0 0 640 740');
assert.deepEqual(xml.labels.map(item => item.text), ['Electrolytic capacitors', 'Axial leads', 'Mounting stud']);
assert.equal(xml.images, 0);
assert.equal(xml.foreignObjects, 0);

const checksPath = `${proof}/binding-and-context-checks.json`;
const checks = {
  schema: 'STEMROBIN-181/figure-review-binding-proof@1',
  ticket: 'STEMROBIN-181',
  batch: 'D021',
  figure: 'fig-157',
  observedAt: new Date().toISOString(),
  status: 'pass',
  method: 'Read-only hashing, JSON equality and existing SVG XML parsing; not a native validation, render, screenshot, browser, promotion or physics rerun.',
  checks: {
    suppliedAuthorFreezeAndUpdateHashesMatch: true,
    originalAndFrozenSourceBytesMatch: true,
    currentNativeBindingsMatchUpdateAndRender: true,
    onlySpecSourceAuthoritativeTextChanged: true,
    geometryLabelsDisplayInventoryAssertionsUnchanged: true,
    currentSvgExactlyEqualsInitialSvg: true,
    allExistingPreviewHashesMatchFreeze: true,
    initialPreviewSpecProvenancePreserved: true,
    currentSpecContainsExactPrintedTitleAndEveryNonemptyCurrentLessonBlock: true,
    completeLessonBlocksRead: 24,
    lessonChangedBlocks: changedBlocks,
    restoredBlock14AndElectrolyticBlock22MatchCorrectedScienceContext: true,
    currentLessonResolvedPath: await fs.realpath(absolute(lessonPath)),
    oldAuthorLessonDeclarationIsHistorical: true,
    oldAuthorFrozenLessonExactlyEqualsHistoricalSnapshot: true,
    oldDeclaredPathNotMisrepresentedAsCurrentBytes: true,
  },
  svgXml: xml,
  existingRenderEvidence: renderBinding,
  existingPreviewEvidence: await bind(previewPath),
  limitations: [
    'Existing native PASS and saved CSS-width measurements are reused, not rerun.',
    'SVG equality supports preview reuse only; source fidelity was judged from the four independently opened images.',
    'No native-size SVG/raster open or headed/offline/product acceptance was performed.',
  ],
};
await writeNew(checksPath, checks);

const independent = await load(inventoryPath);
const imageLedger = {
  priorContextImageHistory: 0,
  imageOpens: 4,
  sourceOpens: 1,
  previewOpens: 3,
  reopens: 0,
  crops: 0,
  nativeImageOpens: 0,
  batchImageCeiling: 8,
  contextImageCeiling: 24,
  totalContextImageHistory: 4,
  inventoryPersistedBeforeAuthorFreezeInventorySpecOrPreviewRead: true,
  entries: [
    { ordinal: 1, kind: 'original', ...source },
    ...previews.widths.map((item, index) => ({
      ordinal: index + 2, kind: 'existing-width-preview', width: item.width,
      ...{ path: path.relative(root, absolute(item.screenshot.path)), sha256: item.screenshot.sha256 },
    })),
  ],
  finalOutcomeReturnedAsTextOnly: true,
};
const mappedInventory = [
  {
    independentId: 'source-large-left-cylinder',
    sourceRequirements: 'Tall left upright cylindrical sleeve, rounded closures, printed-front region and projecting lower terminal.',
    authorInventoryGroups: ['157-tall-can', '157-tall-base', '157-print'],
    objects: ['157-tall-sleeve', '157-tall-top', '157-tall-bottom-rim', '157-tall-seal', '157-tall-mount-nut', '157-tall-terminal-base', '157-tall-terminal-pin', '157-tall-pin-loop', '157-tall-neutral-panel'],
    assertions: ['157-tall-terminal-pin-connection'],
    assessment: 'Preserved visibly at all three widths. Stylized seal/nut outlines retain the source hardware rather than asserting hidden material composition.',
  },
  {
    independentId: 'source-small-lower-right-cylinder',
    sourceRequirements: 'Separate shorter lower-right can, upper rim, lower mount/stud and projecting terminal, with printed-front region.',
    authorInventoryGroups: ['157-short-can', '157-short-base', '157-print'],
    objects: ['157-short-sleeve', '157-short-top-rim', '157-short-top-seal', '157-short-bottom-rim', '157-short-mount-nut', '157-threaded-mount-stud', '157-short-terminal', '157-thread-0', '157-thread-1', '157-thread-2', '157-thread-3', '157-thread-4', '157-thread-5', '157-thread-6', '157-short-neutral-panel'],
    assertions: ['157-short-terminal-connection'],
    assessment: 'Preserved visibly. Seven schematic thread strokes are a regularized depiction of source thread texture, not seven source-given turns or measured dimensions.',
  },
  {
    independentId: 'source-slender-upper-right-cylinder',
    sourceRequirements: 'Separate down-right-sloping slender can with a bent lead from each end and a printed sleeve region.',
    authorInventoryGroups: ['157-slender-can', '157-slender-leads', '157-print'],
    objects: ['157-slender-sleeve', '157-slender-upper-cap', '157-slender-lower-seal', '157-upper-axial-wire-a', '157-upper-axial-wire-b', '157-lower-axial-wire-a', '157-lower-axial-wire-b', '157-lower-axial-wire-c', '157-slender-neutral-panel'],
    assertions: ['157-upper-axial-wire-a-connection', '157-upper-axial-wire-b-connection', '157-lower-axial-wire-a-connection', '157-lower-axial-wire-b-connection', '157-lower-axial-wire-c-connection'],
    assessment: 'Both end leads and their bends are visible; neither lead connects this example to either other capacitor.',
  },
  {
    independentId: 'source-markings-and-negative-inventory',
    sourceRequirements: 'Three isolated package examples; no source cutaway, circuit, internal layer diagram, mathematical grid or external instructional labels.',
    authorInventoryGroups: ['157-print', '157-modern-identification'],
    objects: ['157-tall-neutral-panel', '157-slender-neutral-panel', '157-short-neutral-panel', '157-heading', '157-axial-label', '157-axial-callout', '157-mount-label', '157-stud-callout'],
    assertions: ['157-axial-callout-connection', '157-stud-callout-connection'],
    assessment: 'Neutral sleeve regions replace historical print without fabricated ratings. English heading and two callouts are declared modern identification additions. No beaker, experiment, polarity assignment or hidden material layers were invented.',
  },
];
const nativeBindings = {
  source, context: lessonBinding, lesson: lessonBinding,
  spec: specBinding, render: renderBinding, svg: svgBinding,
};
const provenance = {
  declaration: await bind(updatePath),
  status: update.status,
  affectedFigure: 'fig-157',
  changedField: 'source.authoritativeText',
  before: row.before,
  after: row.after,
  currentCompleteContext: lessonBinding,
  geometryDisplayLabelsInventoryAssertionsUnchanged: true,
  svgByteIdenticalToInitial: true,
  useExistingInitialPreviews: true,
  geometryRepairsAdded: 0,
  declarationNativeContextUpdateInvocations: row.nativeContextUpdateInvocations,
  reviewerNativeContextUpdateInvocations: 0,
  historicalAuthorLessonDeclaration: {
    ...author.inputs.lessonTemplate.current,
    historicalOnly: true,
    exactSnapshot: historicalLessonBinding,
    frozenCopy: await bind(author.inputs.lessonTemplate.frozen.path),
    currentLiveBinding: lessonBinding,
    note: 'The old SHA is attributed only to the historical snapshot/frozen copy. Reads of the current path, including any symlink resolution, bind current full-context bytes.',
  },
  proseCorrectionFreeze: await bind(correctionPath),
  currentScienceReview: await bind(sciencePath),
  initialScienceReviewSnapshot: await bind(science.bindings.initialReviewBinding.snapshot.path),
};
const widthInspection = previews.widths.map(item => ({
  width: item.width,
  screenshot: { path: path.relative(root, absolute(item.screenshot.path)), sha256: item.screenshot.sha256 },
  openedOnce: true,
  mediaWidthPx: item.mediaWidthPx,
  measuredMinTextPx: Math.min(...item.texts.map(text => text.finalFontPx)),
  minTextPx: 16,
  measurementSource: 'Existing frozen width-previews.json and current native render.json; no new measurement or browser.',
  status: 'pass',
  visualObservation: 'Nonblank. All three package forms, sleeve panels, end leads, lower terminals and stud ridges remain visible. The English heading and both labels are readable, with no clipping, glyph substitution or obscured component. Thin muted callouts are distinguishable from heavier dark electrical leads and do not join the separate capacitors.',
}));
const figure = {
  id: 'fig-157',
  status: 'pass',
  contextKind: 'lesson',
  reviewRound: 'INITIAL',
  reviewer: 'Codex, user-assigned independent reviewer; not Main or the figure author',
  bindings: {
    ...nativeBindings,
    nativeSource: await bind(spec.source.image.path),
    authorFreeze: await bind(authorPath),
    science: await bind(sciencePath),
    proseCorrectionFreeze: await bind(correctionPath),
    initialProseFreeze: await bind(initialProsePath),
    contextUpdate: await bind(updatePath),
    previewsEvidence: await bind(previewPath),
    independentInventory: await bind(inventoryPath),
    metadataProof: await bind(checksPath),
    authorInventory: await bind(`${authorRoot}/source-inventory.json`),
    initialSpec: await bind(row.before.spec.path),
    initialRender: await bind(row.before.render.path),
    initialSvg: await bind(row.before.svg.path),
  },
  independentSourceInventory: { ...independent, mappedRequirements: mappedInventory },
  sourceFidelity: {
    status: 'pass',
    packageCount: 3,
    sourceMeasuredValuesRequiredByLesson: 0,
    gridDimensionsApplicable: false,
    pointRelationshipsApplicable: false,
    observation: 'The original and previews agree on the tall left can, separate upper-right axial can, separate shorter lower-right can and their external lead/terminal distinctions. No source instructional subfigure is omitted or replaced with a generic circuit icon.',
    markingPolicy: 'Source maker/model/date/rating print is not lesson data. The independent review does not endorse the author tentative numeric transcription and imports no numeric rating. Blank neutral sleeve panels retain print positions without Cyrillic or fictional values.',
    additions: ['Neutral sleeve panels instead of historical lettering', 'English identifying heading', 'English axial-lead and mounting-stud callouts', 'Regularized cylindrical closures and thread texture, not measured layer or thread counts'],
  },
  completeContextAssessment: {
    status: 'pass',
    fullCurrentLessonRead: true,
    completeBlockCount: 24,
    currentSpecFullTextEqualsPrintedTitleAndAllNonemptyLessonBlocksExactly: true,
    tinFoilBlock14: 'The restored source-specific two tin-foil layers and paraffin-impregnated insulating paper remain attached to fig-155. They are not relabeled as the construction material of fig-157.',
    electrolyticBlock22: 'The current text distinguishes metal foil, its thin oxide dielectric, paper as an electrolyte-holding separator, and electrolyte as the conductive material at the oxide interface. Fig-157 illustrates exterior packages only and makes no contrary layer/material assertion.',
    materialLeaderDistinctions: 'The only callouts identify axial leads and the threaded mounting stud, not foil, oxide, paper or electrolyte. Thin grey callouts are visually distinct from the thicker dark wires; no contact or polarity is inferred from their leader strokes.',
    noSolutionLeak: 'The illustration contains only component identification. It adds no capacitance/rating values, formula derivation, proof steps, charge state, answer choice or fabricated polarity. The lesson proof invitation remains prose outside the figure.',
    scienceScope: 'Compared against the already-corrected SCI report; this is independent figure review, not a new full SCI gate.',
  },
  geometryAndAssertions: {
    status: 'pass-existing-native-evidence-and-independent-visual-observation',
    objects: render.objects,
    labels: render.labels,
    connectsAssertions: spec.assertions.length,
    existingNativePassReused: true,
    executableAssertionsNotRerun: true,
    inventoryAndAssertionsExactlyUnchangedByContextUpdate: true,
    semanticArrowsApplicable: false,
    note: 'Ordinary segments are referenced by the schema field connects.arrow; these package wires and callouts are not directed arrows requiring heads. No source lattice or multi-point mathematical frame exists. Executable connects records preserve their declared endpoints; visual review separately confirms what the leaders identify.',
  },
  visualChecks: {
    status: 'pass',
    sourceAndThreeExistingWidthsOnly: true,
    noClippingObserved: true,
    noMeaningObscuringOverlapObserved: true,
    englishLabelsOnly: true,
    noCulturalOrSourceLanguageLeak: true,
    noBlackOrBrokenRaster: true,
    semanticCssVariableColors: true,
    widthInspection,
    previewText: xml.labels.map(item => item.text),
    minimumObservedFinalTextPx: 16.55,
    noNativeSizeVisualOpen: true,
    noHeadedOfflineOrProductAcceptanceClaim: true,
    printAndAlternateThemesNotNewlyRendered: true,
  },
  contextUpdateProvenance: provenance,
  evidence: { bindings: await bind(checksPath), previews: await bind(previewPath), inventory: await bind(inventoryPath) },
  repairs: 0,
  repairLimit: 1,
  repairsPerformedByReviewer: 0,
  findings: [],
  requiredAuthorChanges: [],
};
const report = {
  schema: 'ld-s10y-image/review@1',
  ticket: 'STEMROBIN-181',
  session: 'D',
  batch: 'D021',
  lesson: 'phy9-c2-s2-n82',
  figure: 'fig-157',
  reviewRound: 'INITIAL',
  reviewedAt: new Date().toISOString(),
  status: 'pass',
  reviewer: figure.reviewer,
  source, spec: specBinding, render: renderBinding, outputs: { svg: svgBinding },
  authorFreeze: await bind(authorPath),
  science: await bind(sciencePath),
  independentInventory: await bind(inventoryPath),
  proof: await bind(checksPath),
  proofHelper: await bind(`${proof}/record-review.mjs`),
  imageLedger,
  contextUpdateProvenance: provenance,
  figures: [figure],
  repairs: 0,
  repairLimit: 1,
  findings: [],
  requiredAuthorChanges: [],
  scopeLimits: {
    onlyFigureReviewed: 'fig-157',
    reviewerIsNotAuthor: true,
    sharedOrAuthorFilesEdited: false,
    writesConfinedToReportAndOwnProofDirectory: true,
    nativeValidatorRenderBrowserPromotionReruns: 0,
    repairs: 0,
    databaseOperations: 0,
    gitOperations: 0,
    fullProjectChecks: 0,
    liveTicketRead: { backend: 'plane', id: '7ebae0e0-c024-481d-8360-5b3d3bfdda79', sequence: 181, status: 'HTTP 200', access: 'n-plane read-only GET', readDate: '2026-11-16' },
    promotionCompatibility: 'Normal aggregate figures[].bindings shape, bound to the current corrected full lesson and current native files. This INITIAL figure pass supplies review evidence only; no durable promotion or headed/offline acceptance was performed.',
  },
  notes: 'Independent source inventory preceded every author inventory/spec read. Exactly original plus three existing width previews were opened once each. Source fidelity, material-context distinctions, leaders, English labels and readability pass. Current full-context bytes and identical-SVG provenance are explicitly bound; historical author lesson hashes are not treated as live bytes.',
};
await writeNew(reportPath, report);
const completion = await bind(reportPath);
console.log(JSON.stringify({ status: report.status, report: completion, proof: await bind(checksPath), source, context: lessonBinding, spec: specBinding, render: renderBinding, svg: svgBinding, imageOpens: 4, repairs: 0, findings: [] }, null, 2));
