import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const cwd = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
if (process.cwd() !== cwd) throw new Error('Wrong cwd');
const root = path.join(cwd, '.intentfold/tickets/STEMROBIN-188/tmp/n47-choice-display-source191192-review-01');
const file = name => path.join(root, name);
const read = name => JSON.parse(fs.readFileSync(file(name), 'utf8'));
const sha = target => crypto.createHash('sha256').update(fs.readFileSync(target)).digest('hex');
const ref = name => ({ path: file(name), sha256: sha(file(name)) });
const before = read('before-bindings.json');
const after = read('after-bindings.json');
const supplementalBefore = read('supplementary-before-bindings.json');
const supplementalAfter = read('supplementary-after-bindings.json');
const choice = read('choice-visual-review.json');
const source = read('source-review.json');
const affected = read('affected-source-review.json');
const ledger = read('image-ledger.json');
const first = read('first-inventory-bindings.json');

if (![before, after, supplementalBefore, supplementalAfter].every(value => value.allMatch) ||
    !after.unchangedSinceBefore || !supplementalAfter.unchangedSinceBefore ||
    first.inventories.some(value => sha(value.path) !== value.sha256) ||
    choice.status !== 'pass' || source.status !== 'hold' || affected.status !== 'hold' ||
    ledger.actualImageLoads !== 8 || !ledger.withinLimits)
  throw new Error('Scoped report integrity failed');
for (const inventory of first.inventories) fs.chmodSync(inventory.path, 0o444);

const report = {
  schema: 'SAME188-6/scoped-independent-review-report@1',
  status: 'complete-scoped-review-awaiting-parent-collection',
  ticket: 'STEMROBIN-188', assignment: 'SAME188-6', cwd, soleWriteRoot: root,
  inputManifest: before.manifest,
  reviewerCount: 1, spawnedOrMessaged: false, imageBearingFork: false,
  verdicts: {
    n47ChoiceDisplayOnly: { status: 'pass', evidence: ref('choice-visual-review.json'),
      lesson: 'geo910-c2-s2-n47', viewports: [1440, 390], questions: 7, options: 24 },
    source191192: { status: 'hold', readableContentStatus: 'pass', readableMathStatus: 'pass',
      observedJoinsStatus: 'pass', completeLiteralMathGlyphStatus: 'hold',
      allInkIdentityStatus: 'hold', unseen193ContinuationStatus: 'hold', evidence: ref('source-review.json') },
    affectedSource185: { status: 'pass', sourcePageStatus: 'hold', scope: 'p0185#9 opening only',
      freshPixelWord: '底面是', historicalWordingHoldPreserved: true, allInkHoldPreserved: true,
      evidence: ref('affected-source-review.json') },
    affectedSource186: { status: 'pass', sourcePageStatus: 'hold', scope: 'p0186#11 restored 并 only',
      exactMDAndJSONOneCharacterChange: true, other11BlocksAndSourcesAndTwoCropsIdentical: true,
      sourceContentRepairsUsed: 1, sourceContentRepairLimit: 1, native15over15Reused: true,
      original186FailPreservedInHistory: true, evidence: ref('affected-source-review.json') }
  },
  findings: [
    { id: 'p0191-formula-suffix-glyph-hold', status: 'hold',
      evidence: ref('focused-crop-observations.FIRST.json'),
      detail: 'S/h tiny suffixes remain too ink-heavy to independently read. Candidate 侧/斜 not approved; all readable expression factors separately pass.' },
    { id: 'source191192-all-ink-hold', status: 'hold', evidence: ref('source-review.json'),
      detail: 'Source margins, wavy underline, dense figure48 specks/shading/arrow/tab junctions not exhaustively attributed.' },
    { id: 'source192-unfinished-paragraph', status: 'hold', evidence: ref('source-review.json'),
      detail: 'Actual §54 and final paragraph ending 正十二面体 preserved;193 not read and no complete53/54 or following figure ownership approval.' }
  ],
  n47VisualFindings: [], sourceHoldsDoNotPoisonIndependentChoicePass: true,
  inheritedHoldsPreserved: true, inheritedHolds: source.inheritedHolds,
  inheritedPassedScopesNotRepeated: choice.inheritedPassedScopesNotRepeated,
  inputIntegrity: {
    mainBindings: 73, supplementalBindings: 16, allMatchBeforeAndAfter: true, unchangedSinceBefore: true,
    before: ref('before-bindings.json'), after: ref('after-bindings.json'),
    supplementalBefore: ref('supplementary-before-bindings.json'),
    supplementalAfter: ref('supplementary-after-bindings.json')
  },
  evidence: {
    ledger: ref('image-ledger.json'), cropArrays: ref('crop-array-evidence.json'),
    source186Diff: ref('source186-change-evidence.json'),
    frozenFirstInventories: ref('first-inventory-bindings.json')
  },
  imageBudget: { planned: 6, actual: 8, maxBatch: 8, maxContext: 24, failedNoPayloadAttempt: 1,
    additionalImageLoadsAllowedInThisBatch: 0, parentImageLoads: 0 },
  technicalFailure: ledger.failedNoPayloadAttempt,
  prohibitedActionsPerformed: {
    candidatesEdited: false, contentRepairsPerformedHere: false, coreOrCharterWrites: false,
    otherOutputWrites: false, gitDBBackendAccess: false, credentialReadOrDependencyChanges: false,
    setupFreshnessGrill: false, modelServiceWebPublish: false, nativeFinalizerRendererBrowserReruns: false,
    withReviewValidationRerun: false, newN47MeasuredPixelsOrGuiPublicationClaim: false
  },
  internalChoiceKeysParsed: false, source186ImageReopened: false, source193PixelsRead: false,
  newContentRepairs: 0, whole53Approved: false, whole54Approved: false, wholeLessonApproved: false,
  published: false, nextAction: 'Stop here for parent collection/closure; return text paths and hashes only.',
  outputIndexPath: file('output-index.json'), externalIndexShaPath: file('output-index.sha256')
};
fs.writeFileSync(file('report.json'), JSON.stringify(report, null, 2) + '\n', { flag: 'wx' });
const markdown = [
  '# SAME188-6 Scoped Independent Review',
  '',
  'Status: complete scoped review; stopped for parent collection/closure.',
  '',
  '## Verdicts',
  '',
  '- N47 FIRST choice-display-only: PASS, desktop1440 and mobile390; all7 questions/24 options, last/bottom/right content observed.',
  '- Source191/192 readable lexical/math content and observed joins: PASS within the readable scope. Source top-level: HOLD for exact tiny formula suffixes, all-ink attribution and unread193 boundary.',
  '- Source185 p0185#9 affected opening: PASS. Fresh original and exact crop read 底面是. Historical wording HOLD and whole-source185 all-ink HOLD are preserved, not silently cleared.',
  '- Source186 p0186#11 affected repair: PASS. Only 并 inserted; MD/JSON agree, other11 blocks, source metadata/PNG/layout, audit and both42/43 crops identical. Source repair budget1/1; existing native15/15 reused. Original186 FAIL remains history; whole-source186 HOLD remains.',
  '',
  '## Concrete Evidence',
  '',
  '- Original191 begins 做棱台. and bound source190 ends 这样的多面体叫; retained join is 这样的多面体叫做棱台.',
  '- Exercise102 continues from 为 on191 to 制造... on192 through figure48/caption. Owner102 and A/B-foot exclusion preserved.',
  '- Figure48 readable labels275/125/200 and A/B, solid outlines/dimension strokes and shaded sides observed. No dashed edge or dimension suffix visible.',
  '- Native48 is exact bbox[542,213,435,448] plus12px white padding: array equality PASS, zero mismatched channel values. This is not all-ink approval.',
  '- Actual §54. 正多面体的概念 and unfinished paragraph ending 正十二面体 retained. No193 pixels, inferred continuation, whole53/54 or following-figure approval.',
  '- N47 mobile final formulas wrap but all rightmost radicals and last D remain visible above the final divider. No new measured-pixel, click/submission or GUI/product-publication claim.',
  '',
  '## Preserved Restrictions',
  '',
  '- Source193 FIRST9/7 FAIL, source19526/25 HOLD, source189 lost-native-receipt HOLD and N55/56/59/60 author-unobserved-crop HOLDs all unchanged.',
  '- All answer/math/fidelity/internal-key reviews, four text/exercise visuals and seven figure-fidelity passes inherited; not repeated.',
  '- One reviewer, no spawn/message/fork. No candidate edits, new content repairs, Git/DB/backend/credentials/deps/model-service/web/publish, setup/freshness/Grill, native finalizer/renderer/browser or with-review rerun.',
  '',
  '## Integrity And Budget',
  '',
  '- 73 manifest bindings and16 supplemental affected-source bindings all match before/after and remain unchanged.',
  '- 8 successful image loads in one batch, max8/batch and24/context. One mistyped-path attempt returned no image payload; corrected native48 then loaded once.',
  '- Own FIRST inventories were written before candidate/old-report comparison, hash-bound and made read-only. No source186 image reopen.',
  '',
  '## Artifact Hashes',
  ''
];
for (const name of ['choice-visual-review.json', 'source-review.json', 'affected-source-review.json',
  'image-ledger.json', 'crop-array-evidence.json', 'source186-change-evidence.json',
  'before-bindings.json', 'after-bindings.json', 'supplementary-before-bindings.json',
  'supplementary-after-bindings.json', 'report.json']) {
  const item = ref(name);
  markdown.push(`- ${item.path}`, `  SHA256: ${item.sha256}`);
}
markdown.push('', `Index: ${file('output-index.json')}`, `External index digest: ${file('output-index.sha256')}`, '');
fs.writeFileSync(file('report.md'), markdown.join('\n'), { flag: 'wx' });
console.log(JSON.stringify({ report: ref('report.json'), markdown: ref('report.md'),
  status: report.status, images: ledger.actualImageLoads, bindingsUnchanged: true }, null, 2));
