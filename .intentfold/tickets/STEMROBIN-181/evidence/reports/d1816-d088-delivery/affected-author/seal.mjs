import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {W, E, O, B, R, ID, load, hash, bind, save, sha, editions, wholeText,
  differences, assertBound} from './common.mjs';

const baseFile = path.join(B, 'author-freeze.json');
const reviewFile = path.join(R, 'report.json');
const base = load(baseFile);
const review = load(reviewFile);
const prepared = load(path.join(E, 'prepared-layout-repaired.json'));
const before = load(path.join(E, 'before-bindings.json'));
before.files.forEach(assertBound);
assert.equal(hash(baseFile), '9cd457adf1c3f5f6f2bbbf2603f9634e17ce9b0b6679b6f635d7f5256646bf58');
assert.equal(hash(reviewFile), '145168200da4878a86d6ed681c494158b2c4136ad32d2d2afb3d909e22e04548');
assert.equal(hash(path.join(R, 'review-freeze.json')), '9a374972875683330b27977278a22c56796422e84d6fb8869f0e06789975096a');
const validation = load(path.join(E, 'native-affected-validation.json'));
assert.equal(validation.status, 'pass');
const whitelistPath = path.join(E, 'final-exact-diff-whitelist.json');
const whitelist = load(whitelistPath);
const oldEN = load(base.editions[1].templates[0].path);
const newEN = load(prepared.newENTemplate.path);
assert.deepEqual(differences(oldEN, newEN), whitelist.lessonTemplate.actualDifferences);
assert.deepEqual(differences(oldEN, newEN).map(row => row.pointer), ['/prose/11/text']);
const maths = text => [...text.matchAll(/\$\$[\s\S]*?\$\$|\$[^$]*?\$/g)].map(match => match[0]);
assert.deepEqual(oldEN.prose.flatMap(block => maths(block.text)),
  newEN.prose.flatMap(block => maths(block.text)));
assert.equal(newEN.prose.flatMap(block => maths(block.text)).length, 21);
const flowBefore = load(path.join(B, 'en-prose-flow.json'));
const flowAfterFile = path.join(E, 'native/en-prose-flow/stdout.txt');
const flowAfter = load(flowAfterFile);
assert.deepEqual(differences(flowBefore, flowAfter).map(row => row.pointer), ['/paragraphs/12/text']);
save(path.join(E, 'affected-flow-binding.json'), {
  schema: 'STEMROBIN-181/affected-prose-flow-binding@1',
  before: bind(path.join(B, 'en-prose-flow.json')), after: bind(flowAfterFile),
  exactDifference: differences(flowBefore, flowAfter),
  sectionBreakAnchorsUnchanged: true, nativeAnchorUpdatesNeeded: false,
  reason: 'R3 changes final paragraph 12 only; neither section boundary uses that paragraph.',
  unchangedZHFlowReused: bind(path.join(B, 'zh-prose-flow.json')),
  unchangedZHFlowReruns: 0, independentApproval: false,
});
const relational = [];
const figures = [];
for (const [index, name] of editions.entries()) {
  const candidate = prepared.specs[index];
  const folder = path.dirname(candidate.after.path);
  const spec = load(candidate.after.path);
  const old = load(base.figures[index].spec.path);
  const renderFile = path.join(folder, 'fig-286.render.json');
  const svgFile = path.join(folder, 'fig-286.svg');
  const previewFile = path.join(folder, 'fig-286.preview.png');
  const report = load(renderFile);
  assert.equal(report.status, 'pass');
  assert.equal(report.spec.sha256, hash(candidate.after.path));
  assert.equal(report.output.svg.sha256, hash(svgFile));
  const textBinding = load(candidate.textBinding.path);
  assert.equal(textBinding.currentSpec.sha256, hash(candidate.after.path));
  assert.equal(textBinding.authoritativeText.sha256, sha(wholeText(load(textBinding.template.path))));
  assert.equal(textBinding.sourceContextSHA256, sha(JSON.stringify(spec.source)));
  assert.deepEqual(spec.source.authoritativeText, [{lesson: ID, text: wholeText(load(textBinding.template.path))}]);
  assert.equal(spec.objects.some(object => object.type === 'svgPath'), false);
  assert.deepEqual(differences(old, spec), whitelist.specs[index].diff);
  const oldMap = new Map(old.objects.map(object => [object.id, object]));
  const objectMap = new Map(spec.objects.map(object => [object.id, object]));
  for (const [id, object] of oldMap) {
    if (!whitelist.figureChangedObjectIDs.includes(id)) assert.deepEqual(objectMap.get(id), object, id);
  }
  const objects = objectMap;
  const left = objects.get('source-left-circulation-upper-3');
  const right = objects.get('source-right-circulation-upper-9');
  const delta = arrow => [arrow.to[0] - arrow.from[0], arrow.to[1] - arrow.from[1]];
  const leftDelta = delta(left);
  const rightDelta = delta(right);
  assert.ok(leftDelta[0] > 0 && leftDelta[1] > 0);
  assert.ok(rightDelta[0] > 0 && rightDelta[1] < 0);
  const angle = Math.atan2(leftDelta[1], leftDelta[0]) * 180 / Math.PI;
  assert.ok(angle > 30);
  const upper = spec.objects.filter(object => object.id.startsWith('source-left-circulation-upper-'));
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const chain = [];
  let current = left;
  while (current) {
    assert.ok(!chain.includes(current.id));
    chain.push(current.id);
    current = upper.find(object => same(object.from, current.to));
  }
  assert.equal(chain.length, upper.length);
  assert.deepEqual(chain.slice(0, 5), [
    'source-left-circulation-upper-3', 'source-left-circulation-upper-0',
    'source-left-circulation-upper-1', 'source-left-circulation-upper-2',
    'source-left-circulation-upper-6']);
  assert.deepEqual(objects.get('source-circular-loop'), oldMap.get('source-circular-loop'));
  assert.equal(objects.get('source-circular-loop').points.length, 72);
  const external = spec.source.inventory.filter(group => group.id.startsWith('source-field-trace-'));
  assert.equal(external.length, 5);
  external.forEach(group => group.objects.forEach(id => assert.deepEqual(objects.get(id), oldMap.get(id))));
  const labelIDs = ['source-left-B-prime-label', 'source-right-B-prime-label', 'text-induced-field-label'];
  assert.ok(labelIDs.every(id => objects.get(id).text === "B'"));
  assert.deepEqual(objects.get('source-B-label'), oldMap.get('source-B-label'));
  assert.deepEqual(objects.get('text-applied-field-label'), oldMap.get('text-applied-field-label'));
  const induced = objects.get('text-induced-field-direction');
  const applied = objects.get('text-applied-field-direction');
  assert.deepEqual(delta(induced), delta(applied));
  assert.deepEqual(delta(induced), [145, 0]);
  const leaders = ['left', 'right'].map(side => {
    const leader = objects.get(`modern-relocated-${side}-B-prime-leader`);
    const label = objects.get(`source-${side}-B-prime-label`);
    assert.equal(leader.to[1], induced.from[1]);
    assert.ok(leader.to[0] > induced.from[0] && leader.to[0] < induced.to[0]);
    assert.equal(leader.from[0], label.at[0]);
    assert.equal(label.at[1] - leader.from[1], 19);
    return {labelID: label.id, labelAt: label.at, leaderID: leader.id,
      startsBelowLabel: leader.from, endsOnKnownInducedAnnotation: leader.to,
      doesNotTargetMainBTraceOrSmallDetail: true};
  });
  assert.ok(spec.source.inventory.find(group => group.id === 'source-labels').description.includes('NOT source-pixel placement'));
  assert.ok(['left', 'right'].every(side => spec.source.inventory.find(group =>
    group.id === `source-${side}-circulation`).description.includes('UNLABELLED structural detail')));
  const assertionMap = new Map(spec.assertions.map(row => [row.id, row]));
  spec.source.inventory.forEach(group => {
    group.objects.forEach(id => assert.ok(objects.has(id)));
    group.assertions.forEach(id => assert.ok(assertionMap.has(id)));
  });
  const allMapped = new Set(spec.source.inventory.flatMap(group => group.objects));
  assert.ok(spec.objects.every(object => allMapped.has(object.id)));
  spec.assertions.filter(row => row.type === 'connects').forEach(row => {
    assert.deepEqual(row.from, objects.get(row.arrow).from);
    assert.deepEqual(row.to, objects.get(row.arrow).to);
  });
  assert.ok(!spec.assertions.some(row => row.type === 'objectCount'));
  relational.push({edition: name, leftUpper: {arrowID: left.id, from: left.from, to: left.to,
    rightwardRiseDegrees: angle, lengthPxAt640: Math.hypot(...leftDelta),
    sourceVisualRelationshipOnly: true, continuousRestoredUpperChain: chain},
  rightUpper: {arrowID: right.id, unchanged: true, rightwardDescendingDelta: rightDelta},
  leaders, externalBTracesExact: true, lowerBrokenReturnsExact: true,
  noAddedLowerArrowheads: true, closedMainLoopExact: true,
  threeBPrimeLabelsShareOneKnownInducedAnnotation: true,
  physicalIdentityOfSmallDetailsAsserted: false,
  connectsMatchObjects: true, mappedRelationshipsResolve: true,
  mathematicalProofIsSemanticApproval: false});
  figures.push({edition: name, locale: index === 0 ? 'zh' : 'en', figure: 'fig-286',
    spec: bind(candidate.after.path), textBinding: bind(candidate.textBinding.path),
    svg: bind(svgFile), preview: bind(previewFile), nativeRenderReport: bind(renderFile),
    objects: spec.objects.length, assertions: spec.assertions.length,
    inventoryGroups: spec.source.inventory.length, visibleLabels: report.labels,
    actualMediaWidthPx: 640, measuredMinimumTextPx: report.displayChecks[0].measuredMinPx,
    authorPreviewOpenedExactlyOnce: true, independentApproval: false, nativeReviewRecord: null});
}
assert.notEqual(figures[0].spec.sha256, figures[1].spec.sha256);
assert.notEqual(load(figures[0].textBinding.path).sourceContextSHA256,
  load(figures[1].textBinding.path).sourceContextSHA256);
assert.equal(figures[0].svg.sha256, figures[1].svg.sha256);
save(path.join(E, 'affected-relationship-proof.json'), {
  schema: 'STEMROBIN-181/affected-relationship-proof@1', role: 'AFFECTED_ONLY_FIRST_REPAIR_AUTHOR',
  status: 'pass', results: relational,
  limit: 'Coordinate and endpoint proof checks the real depicted relationships; it does not establish physical semantics or independent review.',
  independentApproval: false,
});
const opened = [
  {kind: 'original-source-PNG', path: base.sourceFigure.originalPNG.path,
    observation: 'One hatched upright closed loop, five outgoing B traces, B at upper right, two printed B-prime symbols beside small solid/broken details. No lower arrowhead invented.'},
  {kind: 'existing-source-detail-left', path: path.join(W, '.tmp/STEMROBIN-181/d1816-d073/source-details/left-circulation.png'),
    observation: 'Short upper arrow visibly rises rightward; lower broken return beside printed B-prime. Pixels do not independently name a local current/field.'},
  {kind: 'existing-source-detail-right', path: path.join(W, '.tmp/STEMROBIN-181/d1816-d073/source-details/right-circulation.png'),
    observation: 'Upper arrow descends rightward; broken lower return and adjacent printed B-prime. No lower arrowhead added.'},
  {kind: 'new-ZH-native-preview', path: figures[0].preview.path,
    observation: 'At 640px left arrow visibly rises rightward; right arrow descends. Both small details are unlabelled. All three B-prime symbols in the top annotation band refer to the same induced axial-field direction, with the two relocated printed labels connected by leaders. Five B traces, hatched closed loop and other captions remain visible.'},
  {kind: 'new-EN-native-preview', path: figures[1].preview.path,
    observation: 'Same inspected 640px geometry/labels as ZH with separately bound EN text context. Clear rising/descending short upper arrows, unlabelled small details, all seven readable labels and explicit relocation leaders.'},
];
save(path.join(E, 'image-ledger.json'), {
  schema: 'STEMROBIN-181/image-ledger@1', batch: 'D083',
  actualImageOpens: 5, sourceOpens: 1, existingSourceDetailOpens: 2,
  newPreviewOpens: 2, oldModernPreviewOpens: 0, failedPreviewOpens: 0,
  reopens: 0, contextImagesBefore: 0, actualContextImageOpens: 5,
  batchLimit: 8, contextLimit: 24, plannedTotal: 5,
  ledger: opened.map((row, index) => ({order: index + 1, ...row, file: bind(row.path), opens: 1})),
  noFurtherImageOpens: true, independentApproval: false,
});
save(path.join(E, 'author-observations.json'), {
  schema: 'STEMROBIN-181/affected-author-observations@1',
  role: 'AFFECTED_ONLY_FIRST_REPAIR_AUTHOR', inspectedAt: new Date().toISOString(),
  findingsAddressed: [
    {id: 'R1', authorOutcome: 'candidate-corrected-independent-review-pending',
      observation: 'Left printed B-prime no longer labels source-field-4-*; both relocated printed labels use leaders to text-induced-field-direction.'},
    {id: 'R2', authorOutcome: 'candidate-corrected-independent-review-pending',
      observation: 'Short upper-left arrow is rightward/upward at 35.302256 degrees, with the intervening upper curve restored. Upper-right descending arrow and broken returns remain exact.'},
    {id: 'R3', authorOutcome: 'exact-reviewer-sentence-adopted-independent-affected-review-pending',
      observation: 'Inside the loop modifies the field explicitly; exact literal math markup retained. Only prose/11/text and its final flow paragraph changed. Section anchors unchanged.'},
    {id: 'R4', authorOutcome: 'structural-route-implemented-independent-semantic-review-pending',
      observation: 'Small details remain unlabelled source-visual structure. Every printed B-prime is retained and disclosed as modern text-binding relocation to the known axial annotation. No field/current identity for a small detail is invented.'},
  ],
  authorFindsAdditionalUncertainty: false,
  unresolvedSmallDetailIdentityNotClaimedOrRequiredByStructuralRoute: true,
  carriedLocalGate: {
    phase: 'fig-286 modern-figure affected independent semantic review', status: 'HOLD-pending-independent-review',
    scope: ['fig-286 ZH', 'fig-286 EN'],
    isPermanentHumanVeto: false, isGlobalSourceStop: false,
    reason: 'The author implemented the reviewer-supported structural route. New relationships/relocations await independent affected review; native proof and author preview are not that approval.',
  },
  noNewIndependentApprovals: true, mathematicalProofDoesNotSettleSemantics: true,
  fullLessonDisplayPerformed: false, offlineDisplayDeferredUntilParentPromotion: true,
});
const receipts = fs.readdirSync(path.join(E, 'native')).map(name => path.join(E, 'native', name, 'receipt.json'))
  .filter(file => fs.existsSync(file)).map(file => ({...bind(file), data: load(file)}));
const failures = receipts.filter(row => row.data.exitCode !== 0);
assert.equal(failures.length, 2);
const renderFailures = failures.filter(row =>
  row.data.command.some(value => value.endsWith('/render_spec.mjs')));
assert.equal(renderFailures.length, 1);
assert.equal(receipts.filter(row => row.data.command.some(value => value.endsWith('/render_spec.mjs'))).length, 3);
const stageReuse = {
  D078Report: bind(reviewFile), originalReviewFreeze: bind(path.join(R, 'review-freeze.json')),
  exactBaseVerdicts: review.verdicts,
  unchangedPassedStages: {SCIProse: 'PASS', ZH: 'PASS', ENExceptR3: 'PASS',
    cultural: 'PASS', readabilityAt640: 'PASS'},
  changedCandidateApprovalInherited: false,
  originalFailuresAndHOLDRetained: review.findings,
  fullLessonOrSourceRechecks: 0, sourceApprovalUnchanged: true, rawSVGApprovalUnchanged: true,
};
save(path.join(E, 'stage-reuse.json'), stageReuse);
const retained = [];
const inventory = root => {
  for (const entry of fs.readdirSync(root, {withFileTypes: true})) {
    const file = path.join(root, entry.name);
    if (entry.isDirectory()) inventory(file);
    else if (entry.isFile()) retained.push(bind(file));
    else assert.fail('Unexpected special file: ' + file);
  }
};
inventory(E);
inventory(O);
const freeze = {
  schema: 'STEMROBIN-181/bilingual-lesson-affected-repair-author-freeze@1',
  ticket: 'STEMROBIN-181', batch: 'D083', role: 'AFFECTED_ONLY_FIRST_REPAIR_AUTHOR',
  lesson: ID, workdir: W, frozenAt: new Date().toISOString(),
  status: 'affected-author-frozen-native-pass-independent-affected-review-pending',
  ownedRoots: [O, E], sameOngoingCapability: true, finish: 'review', grill: 'self',
  parentPromotionPending: true, independentAffectedReviewPending: true,
  approvals: {newIndependentSCI: false, newIndependentZH: false, newIndependentEN: false,
    newIndependentFigure: false, whole126: false, offlineDisplay: false},
  hold: load(path.join(E, 'author-observations.json')).carriedLocalGate,
  base: {D073AuthorFreeze: bind(baseFile), D078Report: bind(reviewFile),
    originalD078ReviewFreeze: bind(path.join(R, 'review-freeze.json'))},
  beforeBindings: bind(path.join(E, 'before-bindings.json')),
  exactDiffWhitelist: bind(whitelistPath), sourceFigure: base.sourceFigure,
  authoritativeRawLesson: base.authoritativeRawLesson, sourceFiles: base.sourceFiles,
  editions: [
    {locale: 'zh', edition: editions[0], templates: base.editions[0].templates,
      textAndSourceUnchanged: true, textCopied: false},
    {locale: 'en', edition: editions[1], templates: [bind(prepared.newENTemplate.path),
      ...base.editions[1].templates.slice(1)], oldTemplate: base.editions[1].templates[0],
      changedPointerOnly: '/prose/11/text', sourceTextSourceRefsMathTokensOtherENUnchanged: true},
  ],
  figures, sameGeometryAndLabels: true, separateLocaleTextAndContextHashes: true,
  rawSourceAndSourceApprovalUnchanged: true, unchangedZH: true, unchangedOtherEN: true,
  affectedNativeValidation: bind(path.join(E, 'native-affected-validation.json')),
  affectedFlowBinding: bind(path.join(E, 'affected-flow-binding.json')),
  relationshipProof: bind(path.join(E, 'affected-relationship-proof.json')),
  imageLedger: bind(path.join(E, 'image-ledger.json')),
  authorObservations: bind(path.join(E, 'author-observations.json')),
  selfGrill: bind(path.join(E, 'grill.json')), stageReuse: bind(path.join(E, 'stage-reuse.json')),
  failedBaseReused: stageReuse, targetedLayoutRepair: bind(path.join(E, 'layout-failure-and-targeted-repair.json')),
  nativeReceipts: receipts, nativeFailures: failures,
  technicalRecovery: {
    failedCall: bind(path.join(E, 'native/affected-native-validation/receipt.json')),
    diagnosis: 'Evidence helper passed strings to edition.load, whose contract requires pathlib.Path.',
    correction: 'Convert the two template path arguments to Path; no candidate, source, renderer or picture changed.',
    rerunOnlyFailedStage: true, technicalFailureIsNotContentVerdict: true,
  },
  previousD073NativeFailuresReused: base.nativeFailures,
  authority: before.authority,
  counts: {lessonsAffected: 1, localesAffected: 2, uniqueFiguresAffected: 1,
    newLessonTemplates: 1, initialSpecWorkingCopies: 2, finalRepairedSpecs: 2,
    nativeRenderCalls: 3, nativeRenderFailures: 1, finalNativeRenderPasses: 2,
    nativeEvidenceHelperFailures: 1, totalNativeFailures: 2,
    layoutRepairRounds: 1, figureObjectsEach: 222, figureAssertionsEach: 19,
    inventoryGroupsEach: 12, labelsEach: 7, mathTokensEach: 21, finalParagraphsEach: 15,
    exactENTextPointersChanged: 1, nativeSectionAnchorChanges: 0,
    actualImageOpens: 5, originalSourceOpens: 1, existingDetailCropOpens: 2,
    newPreviewOpens: 2, oldModernPreviewOpens: 0, reopens: 0,
    paidCalls: 0, sourcePagesAdded: 0, coursesAdded: 0, coursesPushed: 0,
    newIndependentApprovals: 0},
  execution: {canonicalEdits: false, meterOrIndexWrites: false,
    adaptFinalizeCalls: 0, promoteCalls: 0, nativeRecordReviewCalls: 0,
    fullOfflineLessonDisplays: 0, databaseConnections: 0, deployments: 0,
    modelDependencySkillChanges: false, branchesCommitsPushes: 0,
    chatsOrOtherAgentsUsed: false, freshnessReruns: 0, liveBackendReruns: 0,
    wholeBookUnusedFiguresPDFDependenciesCopied: 0, originalD073D078Writes: 0,
    wroteOnlyOwnedRoots: true},
  outputInventory: retained, frozenInputHashCheckCount: before.files.length,
  limitations: [
    'Native rendering and author previews prove mechanical depiction, not independent semantics.',
    'Two relocated printed B-prime labels and the existing B-prime annotation share one known induced-field referent; they do not denote additional fields.',
    'Small details retain source solid/broken visual structure only; no current/local-field identity asserted.',
    'No full lesson display until parent promotion; no approval inherited for changed candidates.',
  ],
};
assert.equal(validation.figureReports[0].assertions, freeze.counts.figureAssertionsEach);
save(path.join(E, 'author-freeze.json'), freeze);
console.log(JSON.stringify({status: freeze.status, authorFreeze: bind(path.join(E, 'author-freeze.json')),
  outputFilesBeforeFreeze: retained.length, imageOpens: 5, finalNativePasses: 2,
  nativeFailuresPreserved: failures.length, approvals: 0, figures}));
