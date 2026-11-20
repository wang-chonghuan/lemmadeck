import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {W, E, O, B, R, ID, load, hash, bind, save, sha, editions,
  wholeText, differences, assertBound} from './common.mjs';

const baseFile = path.join(B, 'author-freeze.json');
const reportFile = path.join(R, 'report.json');
const reviewFreezeFile = path.join(R, 'review-freeze.json');
assert.equal(hash(baseFile), '9cd457adf1c3f5f6f2bbbf2603f9634e17ce9b0b6679b6f635d7f5256646bf58');
assert.equal(hash(reportFile), '145168200da4878a86d6ed681c494158b2c4136ad32d2d2afb3d909e22e04548');
assert.equal(hash(reviewFreezeFile), '9a374972875683330b27977278a22c56796422e84d6fb8869f0e06789975096a');
const base = load(baseFile);
const review = load(reportFile);
assert.deepEqual(review.findings.map(row => row.id), ['R1', 'R2', 'R3', 'R4']);
const required = [bind(baseFile), bind(reportFile), bind(reviewFreezeFile),
  ...base.sourceFiles, ...base.authoritativeRawLesson,
  base.sourceFigure.originalPNG, base.sourceFigure.approvedRawSVG,
  base.mechanicalTextValidation, base.firstAuthorFigureValidation,
  base.authoritativeBilingualBindings, base.imageLedger, base.selfGrill,
  ...base.editions.flatMap(row => row.templates),
  ...base.figures.flatMap(row => [row.spec, row.svg, row.nativeRenderReport, row.preview]),
  bind(path.join(B, 'en-prose-flow.json')), bind(path.join(B, 'zh-prose-flow.json'))];
const runtimeReceipt = load(path.join(B, 'runtime-reuse.json'));
for (const row of runtimeReceipt.files) {
  required.push(bind(row.source.path), bind(row.readOnlyReusedCopy.path));
  assert.equal(hash(row.source.path), hash(row.readOnlyReusedCopy.path));
}
for (const name of ['d061-live181-read', 'd061-live179-comments-read']) {
  const dir = path.join(W, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-recovery/native', name);
  const receipt = load(path.join(dir, 'receipt.json'));
  assert.equal(receipt.exitCode, 0);
  assert.equal(receipt.cwd, W);
  required.push(bind(path.join(dir, 'receipt.json')), bind(path.join(dir, 'stdout.txt')));
}
const commentsFile = path.join(W,
  '.intentfold/tickets/STEMROBIN-181/tmp/d1816-recovery/native/d061-live179-comments-read/stdout.txt');
const comment = load(commentsFile).results.find(row => row.id === '830251c5-4c6f-48af-9bae-6e3a22118c80');
assert.ok(comment.comment_stripped.includes('Grill=self'));
const unique = [...new Map(required.map(row => [row.path, row])).values()];
unique.forEach(assertBound);
save(path.join(E, 'before-bindings.json'), {
  schema: 'STEMROBIN-181/affected-before-bindings@1', batch: 'D083',
  files: unique, originalFilesReferencedNotCopied: true, fullBookOrUnusedFiguresCopied: 0,
  authority: {commentID: comment.id, existingReceiptReuseOnly: true,
    sameOngoingCapability: true, finish: 'review', grill: 'self'},
});
save(path.join(E, 'grill.json'), {
  schema: 'STEMROBIN-181/affected-author-self-grill@1', mode: 'self',
  decisionMaker: 'D083 affected-only author', finish: 'review',
  questions: [
    {question: 'What is the repair boundary?', decision: 'Only R1/R2/R4 in fig-286 and R3 in EN prose/11/text.',
      basis: 'Direct human instruction and exact D078 findings; no canonical or other-worker writes.'},
    {question: 'Must the small traces acquire a physical identity?', decision: 'No. Preserve unlabelled visual structure; neither inventory nor assertions claim local field or current.',
      basis: 'D078 R4 explicitly supports this structural route; source pixels show strokes and arrow slopes, not independent physical identity.'},
    {question: 'How are all printed B-prime labels retained?', decision: 'Retain both printed labels as separate labelled objects, relocate them with visible leaders to the known modern axial induced-field annotation.',
      basis: 'D078 R1/R4 permit justified text-binding relocation. Pixel positions and relocation are recorded separately. No main B trace is renamed.'},
    {question: 'What may change in English?', decision: 'Use the exact R3 sentence with literal current math markup; preserve every other sentence and all source/math fields.',
      basis: 'Direct instruction and reviewer exact wording. Native flow may only change its affected final paragraph, not section boundaries.'},
    {question: 'What is evidence versus approval?', decision: 'Native draft validation/render and author observations only. Independent affected review remains pending; no review@1, finalization, promotion or full lesson display.',
      basis: 'Direct instruction, production-resume and quality-gate. Reused prose approval and mathematical proof do not settle new figure semantics.'},
    {question: 'Should dependencies, backend state or capability freshness be rerun?', decision: 'No. Read-only existing byte-identical renderer runtime and saved d061 authority suffice.',
      basis: 'Same ongoing capability; explicit no freshness/live/backend/paid calls and no models, dependency, skill or runtime copying.'},
  ],
  humanQuestionRequired: false, independentApproval: false,
});

const enBase = base.editions.find(row => row.locale === 'en').templates[0];
const oldEN = load(enBase.path);
const oldSentence = "We choose the following positive direction: when the field $\\vec{B}'$ produced by the induced current inside the loop points in the same direction as the field $\\vec{B}$ that causes the induction, we call the current and the EMF **positive**.";
const newSentence = "We choose the following positive direction: when, inside the loop, the field $\\vec{B}'$ produced by the induced current points in the same direction as the field $\\vec{B}$ that causes the induction, we call the current and the EMF **positive**.";
assert.equal(oldEN.prose[11].text.split(oldSentence).length, 2);
const newEN = structuredClone(oldEN);
newEN.prose[11].text = oldEN.prose[11].text.replace(oldSentence, newSentence);
const enPath = path.join(O, 'templates/modern-us-neutral-en', ID, 'lesson.template.json');
save(enPath, newEN);
const lessonDiff = differences(oldEN, newEN);
assert.deepEqual(lessonDiff.map(row => row.pointer), ['/prose/11/text']);
save(path.join(E, 'R3-exact-text-diff.json'), {
  before: bind(enBase.path), after: bind(enPath), exactSentence: newSentence,
  differences: lessonDiff, unchangedZHTemplate: base.editions.find(row => row.locale === 'zh').templates[0],
  sourceTextSourceRefsOtherENUnchanged: true, sectionBreaksUnchanged: true,
});

const P = k => {
  const t = Math.PI + k * Math.PI / 16;
  const x = 79 * Math.cos(t), y = 24 * Math.sin(t);
  return [Number((185 + x * Math.cos(0.17) - y * Math.sin(0.17)).toFixed(6)),
    Number((640 - (408 + x * Math.sin(0.17) + y * Math.cos(0.17))).toFixed(6))];
};
const specs = [];
for (const [index, name] of editions.entries()) {
  const old = load(base.figures[index].spec.path);
  const spec = structuredClone(old);
  const docPath = index === 0 ? base.editions[0].templates[0].path : enPath;
  const doc = load(docPath);
  const text = wholeText(doc);
  const oldText = old.source.authoritativeText.find(row => row.text.startsWith(doc.locale.toUpperCase() + ':')).text;
  spec.source.authoritativeText = [{lesson: ID, text}];
  spec.description = "Circular conducting loop in decreasing applied magnetic flux. Five external B traces, the hatched loop and both small solid/broken source-visual details are retained. Small details are deliberately unlabelled and carry no asserted current or local-field identity. Both printed B-prime labels are retained by disclosed modern text-binding relocation with leaders to the known axial induced-field annotation, aligned with B under the lesson's positive convention. Affected author candidate; independent review pending.";
  const byID = id => {
    const object = spec.objects.find(row => row.id === id);
    assert.ok(object, id);
    return object;
  };
  const arrow = byID('source-left-circulation-upper-3');
  arrow.from = P(0);
  arrow.to = P(3);
  for (const [k, a, b] of [[0, 3, 4], [1, 4, 5], [2, 5, 6]]) {
    const object = byID(`source-left-circulation-upper-${k}`);
    object.from = P(a);
    object.to = P(b);
  }
  const restored = {id: 'source-left-circulation-upper-6', type: 'segment',
    from: P(6), to: P(7), stroke: 'ink', strokeWidth: 2.3, dash: 0};
  spec.objects.splice(spec.objects.findIndex(row => row.id === 'source-left-circulation-upper-7'), 0, restored);
  const connection = spec.assertions.find(row => row.id === 'source-left-circulation-upper-3-connects');
  connection.from = arrow.from;
  connection.to = arrow.to;
  spec.assertions.push({id: 'source-left-upper-rightward-rise', type: 'displacement',
    from: arrow.from, to: arrow.to,
    dx: Number((arrow.to[0] - arrow.from[0]).toFixed(6)),
    dy: Number((arrow.to[1] - arrow.from[1]).toFixed(6))});
  const relocationRows = [];
  for (const [side, x] of [['left', 386], ['right', 498]]) {
    const labelID = `source-${side}-B-prime-label`;
    const label = byID(labelID);
    const pixelCandidateAt = structuredClone(label.at);
    label.at = [x, 549];
    const leaderID = `modern-relocated-${side}-B-prime-leader`;
    spec.objects.push({id: leaderID, type: 'segment', from: [x, 559], to: [x, 572],
      stroke: 'ink', strokeWidth: 1.2, dash: 0});
    spec.assertions.push(
      {id: leaderID + '-connects', type: 'connects', arrow: leaderID, from: [x, 559], to: [x, 572]},
      {id: leaderID + '-on-induced-annotation', type: 'pointOnLine',
        point: [x, 572], a: [370, 572], b: [515, 572]},
      {id: leaderID + '-label-below', type: 'displacement',
        from: label.at, to: [x, 572], dx: 0, dy: 23});
    relocationRows.push({labelID, unchangedText: label.text, sourcePixelPlacement:
      side === 'left' ? 'Printed B-prime beside the lower-left broken small return.' :
        'Printed B-prime above the right small solid/broken detail.',
    beforeCandidateAt: pixelCandidateAt, modernAt: label.at, leaderID,
    modernReferent: 'text-induced-field-direction',
    reason: 'The lesson defines induced B-prime inside the loop aligned with B in this decreasing-flux positive-convention case. The printed symbol is preserved, but its pixel adjacency is not evidence for an identity of the small detail.'});
  }
  const sourceLabels = spec.source.inventory.find(row => row.id === 'source-labels');
  sourceLabels.description = "Source pixels: B at top-right; two printed B-prime labels beside the lower-left broken small return and above the right small detail. Modern text-binding relocation, NOT source-pixel placement: retain both printed B-prime symbols as source-left-B-prime-label and source-right-B-prime-label in the modern axial-field annotation band; visible leader segments terminate on text-induced-field-direction. All three B-prime labels there denote the same induced field defined inside the loop by the lesson, not the small visual details or any of the five external B traces. The two relocated labels are retained printed symbols, not two extra physical fields.";
  sourceLabels.objects.push(...relocationRows.map(row => row.leaderID));
  sourceLabels.assertions = relocationRows.flatMap(row => [
    row.leaderID + '-connects', row.leaderID + '-on-induced-annotation', row.leaderID + '-label-below']);
  for (const side of ['left', 'right']) {
    const group = spec.source.inventory.find(row => row.id === `source-${side}-circulation`);
    group.description = `Source pixels only: small ${side} closed-outline solid-upper/broken-lower visual detail beside/crossing the loop rim. The upper short arrow runs rightward and ${side === 'left' ? 'visibly rises' : 'descends'}; the lower return has broken strokes and no added arrowhead. Retained UNLABELLED structural detail, with no asserted current or local-field identity. Stable historical IDs containing 'circulation' name source strokes only, not physical semantics. The adjacent printed B-prime label is separately accounted for by the disclosed source-labels relocation to the known modern axial induced-field annotation. Endpoint and slope assertions certify visual relationships only.`;
    if (side === 'left') {
      group.objects.splice(group.objects.indexOf('source-left-circulation-upper-7'), 0, restored.id);
      group.assertions.push('source-left-upper-rightward-rise');
    }
  }
  for (const prefix of ['text-applied-field', 'text-induced-field']) {
    const object = byID(prefix + '-direction');
    const assertionID = prefix + '-rightward-axial';
    spec.assertions.push({id: assertionID, type: 'displacement',
      from: object.from, to: object.to, dx: 145, dy: 0});
    const group = spec.source.inventory.find(row => row.id === prefix);
    group.assertions.push(assertionID);
    if (prefix === 'text-induced-field') {
      group.description = "Justified modern text-binding annotation, not source pixels: B-prime produced by induced current is the field inside the loop, aligned and same-direction with inducing B under the stated positive convention. This axial-direction annotation remains unchanged. The two printed B-prime symbols are retained separately with leaders in source-labels; they share this known referent. Neither this assertion nor the relocated labels assign a field/current identity to either small solid/broken visual detail.";
    }
  }
  const specPath = path.join(O, 'figures', name, 'fig-286.spec.json');
  save(specPath, spec);
  const contextPath = path.join(O, 'figures', name, 'fig-286.text-binding.json');
  save(contextPath, {
    schema: 'STEMROBIN-181/affected-figure-text-binding@1', edition: name, locale: doc.locale,
    figure: 'fig-286', lesson: ID, template: bind(docPath), rawLesson: base.authoritativeRawLesson[0],
    sourcePNG: base.sourceFigure.originalPNG, beforeSpec: base.figures[index].spec,
    currentSpec: bind(specPath), authoritativeText: {sha256: sha(text), text},
    beforeAuthoritativeTextSHA256: sha(oldText), sourceContextSHA256: sha(JSON.stringify(spec.source)),
    ownLocaleOnly: true, changedENBinding: index === 1, unchangedZHText: index === 0,
    sourcePixelPlacementAndModernRelocationSeparate: true, printedLabelRelocations: relocationRows,
    independentApproval: false, renderingProvesSemantics: false,
  });
  specs.push({edition: name, before: base.figures[index].spec, after: bind(specPath),
    textBinding: bind(contextPath), diff: differences(old, spec)});
}
const allowedObjects = new Set(['source-left-circulation-upper-0', 'source-left-circulation-upper-1',
  'source-left-circulation-upper-2', 'source-left-circulation-upper-3',
  'source-left-circulation-upper-6', 'source-left-B-prime-label', 'source-right-B-prime-label',
  'modern-relocated-left-B-prime-leader', 'modern-relocated-right-B-prime-leader']);
const objectDiffs = specs.map(row => {
  const before = load(row.before.path);
  const after = load(row.after.path);
  const rows = [...new Set([...before.objects, ...after.objects].map(object => object.id))].flatMap(id => {
    const oldObject = before.objects.find(object => object.id === id);
    const newObject = after.objects.find(object => object.id === id);
    if (JSON.stringify(oldObject) === JSON.stringify(newObject)) return [];
    assert.ok(allowedObjects.has(id), id);
    return [{id, differences: differences(oldObject, newObject)}];
  });
  return {edition: row.edition, changedObjects: rows};
});
save(path.join(E, 'exact-diff-whitelist.json'), {
  schema: 'STEMROBIN-181/affected-exact-diff-whitelist@1',
  ownedRoots: [O, E], lessonTemplate: {before: enBase, after: bind(enPath),
    permittedPointers: ['/prose/11/text'], actualDifferences: lessonDiff},
  figureChangedObjectIDs: [...allowedObjects], objectDiffs,
  specs: specs.map(row => ({...row, exactPermittedPointers: row.diff.map(diff => diff.pointer)})),
  leftArcRepair: {arrowID: 'source-left-circulation-upper-3',
    beforeNearHorizontalChord: [P(3), P(7)], newShortLocalRise: [P(0), P(3)],
    restoredCurve: [[P(3), P(4)], [P(4), P(5)], [P(5), P(6)], [P(6), P(7)]],
    basis: 'Same source-visual sampled left oval; replace only the shortcut with a short rising local arrow and restore the intervening curved segments. No lower arrows or physical identity added.'},
  unchanged: ['All source/raw files and original PNG/raw SVG', 'All ZH prose',
    'All other EN text and source_text/source_refs/math tokens', 'All five external B traces',
    'Main closed hatched loop and heavy rim', 'Both lower broken returns',
    'Entire right small visual detail and descending arrow', 'Known axial B/B-prime arrows',
    'Other labels, layout, display and cultural content', 'D073/D078 frozen evidence'],
  copiedOnlyNecessaryWorkingInputs: [bind(enPath), ...specs.map(row => row.after)],
  failedBaseReused: {report: bind(reportFile), exactFindings: review.findings,
    failedFigureAndENRemainHistorical: true, semanticHOLDNotHumanVeto: true},
});
save(path.join(E, 'prepared.json'), {
  status: 'affected-working-copies-ready', specs: specs.map(({diff, ...row}) => row),
  newENTemplate: bind(enPath), readOnlyRendererRuntime: runtimeReceipt.readOnlyExistingRuntime,
  imageOpensSoFar: 3, plannedTotalImageOpens: 5, approvals: 0,
});
console.log(JSON.stringify({status: 'prepared', templatesWritten: 1, specsWritten: 2,
  leftUpperArrowAngleDegrees: Math.atan2(P(3)[1] - P(0)[1], P(3)[0] - P(0)[0]) * 180 / Math.PI,
  changedObjectsEach: objectDiffs[0].changedObjects.length}));
