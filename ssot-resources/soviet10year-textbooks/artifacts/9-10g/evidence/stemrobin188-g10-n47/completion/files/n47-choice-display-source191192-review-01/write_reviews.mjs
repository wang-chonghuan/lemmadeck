import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const cwd = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
if (process.cwd() !== cwd) throw new Error('Wrong cwd');
const tmp = path.join(cwd, '.intentfold/tickets/STEMROBIN-188/tmp');
const root = path.join(tmp, 'n47-choice-display-source191192-review-01');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const ref = file => ({ path: file, sha256: sha(file) });
const local = name => path.join(root, name);
const write = (name, value) => fs.writeFileSync(local(name), JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
const manifestPath = path.join(tmp, 'n47-choice-display-source191192-review-inputs-01/manifest.json');
const manifest = read(manifestPath);
const sourceManifest = read(manifest.sourceReviewInput.path);
const questions = read(manifest.visibleQuestions.path).questions;
const display = read(manifest.choiceDisplayResult.path);
const cropChecks = read(local('crop-array-evidence.json'));
const change186 = read(local('source186-change-evidence.json'));
const priorReview = read(sourceManifest.affected.source186.previousIndependentReview.path);
const prior185 = priorReview.pages.find(page => page.page === 185);
const prior186 = priorReview.pages.find(page => page.page === 186);
const sourcePage = page => {
  const entry = sourceManifest.pages.find(item => item.page === page);
  return { entry, candidate: read(entry.candidateJSON.path), audit: read(entry.audit.path) };
};
const page191 = sourcePage(191);
const page192 = sourcePage(192);
const predecessor = read(sourceManifest.predecessorTextOnly.path);
const successor = read(sourceManifest.actual192Tail.path);

if (questions.length !== 7 || questions.reduce((count, q) => count + q.view.options.length, 0) !== 24)
  throw new Error('Wrong visible choice scope');
if (!read(local('before-bindings.json')).allMatch ||
    !read(local('supplementary-before-bindings.json')).allMatch ||
    cropChecks.figure48.status !== 'pass' || change186.status !== 'pass')
  throw new Error('Evidence verification did not pass');

const inheritedHolds = [
  { id: 'source193-native-9-over-7', status: 'fail', scope: 'physical193 native FIRST 9/7', preserved: true,
    basis: 'Direct assigned inherited verdict; no source193 pixels or validation loaded/rerun.' },
  { id: 'source195-native-26-over-25', status: 'hold', scope: 'physical195 native 26/25', preserved: true,
    basis: 'Direct assigned inherited verdict; not re-reviewed.' },
  { id: 'p0189-native-stdout-and-exit-receipt', status: 'hold', scope: 'source189 lost original native receipt',
    preserved: true, evidence: ref(sourceManifest.predecessorTextOnly.path),
    reason: 'Emitted author audit is not the lost stdout/stderr/exit receipt; neither reconstructed nor rerun.' },
  { id: 'N55-author-unobserved-source-crops', status: 'hold', preserved: true, basis: 'Inherited restriction; not inspected.' },
  { id: 'N56-author-unobserved-source-crops', status: 'hold', preserved: true, basis: 'Inherited restriction; not inspected.' },
  { id: 'N59-author-unobserved-source-crops', status: 'hold', preserved: true, basis: 'Inherited restriction; not inspected.' },
  { id: 'N60-author-unobserved-source-crops', status: 'hold', preserved: true, basis: 'Inherited restriction; not inspected.' },
  { id: 'source185-historical-wording-and-all-ink-holds', status: 'hold', preserved: true,
    evidence: ref(sourceManifest.affected.source185.previousIndependentReview.path),
    reason: 'Historical wording HOLD remains in its immutable report. A fresh affected-word verdict does not approve whole source185 or remove all-ink holds.' },
  { id: 'source186-original-omission-FIRST-failure', status: 'fail', preserved: true,
    evidence: ref(sourceManifest.affected.source186.previousIndependentReview.path),
    reason: 'Original p0186#11 omission FAIL remains historical; affected repaired bytes receive a separate verdict.' }
];

const ledgerImages = [
  { ...manifest.choiceScreenshots[0], ordinal: 1, evidence: 'Full desktop screenshot including last option, right-side terms and page bottom observed.' },
  { ...manifest.choiceScreenshots[1], ordinal: 2, evidence: 'Full mobile screenshot including wrapped final formulas, right-side terms and page bottom observed.' },
  { ...manifest.images[0], ordinal: 3, evidence: 'Original191 observed and independent FIRST inventory frozen before candidate/report.' },
  { ...manifest.images[1], ordinal: 4, evidence: 'Original192 observed before candidate/report.' },
  { ...manifest.images[2], ordinal: 5, evidence: 'Native source48 crop observed; independent figure inventory frozen before candidate/report.' },
  { ...manifest.images[3], ordinal: 6, evidence: 'Original185 opened once; attention restricted to exercise85 opening; focused FIRST frozen before candidate/old report.' },
  { ...ref(path.join(tmp, 'source191192-author/evidence/crops/0191-area-formula.png')), ordinal: 7,
    scope: 'source191-targeted-math-detail', evidence: 'Original exact formula detail; S/h suffixes unresolved, not guessed.' },
  { ...ref(local('source185-ex85-opening-original-crop.png')), ordinal: 8,
    scope: 'source185-ex85-opening-targeted-detail', evidence: 'Actual original crop independently confirms the separate 面 glyph.' }
];
write('image-ledger.json', {
  schema: 'SAME188-6/bounded-independent-image-ledger@1', cwd, ticket: manifest.ticket,
  reviewerCount: 1, spawned: false, messagedOtherChats: false, imageBearingFork: false,
  batches: 1, plannedLoads: 6, actualImageLoads: 8, toolImageCallAttempts: 9,
  batchLimit: 8, contextLimit: 24, cumulativeContextImages: 8, withinLimits: true,
  images: ledgerImages,
  failedNoPayloadAttempt: {
    betweenOrdinals: [4, 5], tool: 'view_image',
    path: path.join(cwd, '.intentfold/tickets/STEMROBIN-188-six/tmp/source191192-author/work/9-10g/pages/0192/figures/fig-g10-48.png'),
    outcome: 'No such file; zero image payload and zero image loads. Correct manifest-bound path then loaded once as ordinal5.',
    scientificVerdict: false
  },
  arrayOnlyDecodes: 'PIL/numpy produced text/hashes only, not images in context; no native code rerun.',
  source185FullPageLoads: 1, source186ImageLoads: 0, source193ImageLoads: 0, parentImageLoads: 0,
  finalImagesEmbeddedInReturn: false, additionalImageLoadsAllowedInThisBatch: 0
});

const perQuestionVisualEvidence = [
  'Complete longest opening stem visible; A-D descriptions and radio circles separated on both viewports.',
  'Complete existence stem and both A/B checkbox labels visible; no missing right-side words.',
  'All four short numeric alternatives visible; A-D labels and radio circles stable and legible.',
  'Long construction stem and all A-D descriptions visible; mobile continuation lines do not collide with controls or the next option.',
  'Long multiple-selection construction text and all four checkbox options visible; bottom option ends before divider.',
  'Complete quoted condition and both A/B checkbox statements visible, including mobile final lines before next question.',
  'Full figure-bearing stem and A-F display labels visible. All A-D formula options render Greek letters, degree marks, fractions, arctan and radicals; final D and its rightmost radical are above the final divider.'
];
const screenshots = manifest.choiceScreenshots.map((shot, index) => ({
  ...shot, status: 'pass', imageLoadOrdinal: index + 1, fullScreenshotObserved: true,
  coverage: { questions: 7, options: 24, top: true, bottom: true, lastQuestion: true, lastOption: true, rightmostContent: true },
  evidence: index === 0 ? [
    'Title and all seven question groups, every A-D/A-B alternative, final formula option D and bottom divider/white margin observed.',
    'Single-choice options use round radio controls and multiple-choice options square checkboxes; the selected first radio is rendered blue. Selection appearance is not a correctness judgment.',
    'No visible overlap or clipping in stems, option letters, controls, formula numerator/denominator/radicals or figure labels.',
    'Last A-D formulas have their complete right ends visible; no horizontal scroller or hidden rightmost alternative apparent.'
  ] : [
    'Title through the last D formula, final divider and white page-bottom margin observed in the complete mobile screenshot.',
    'Long stems and construction alternatives wrap with distinct control/letter/text placement; no continuation line visibly overlaps another option.',
    'The final formula group wraps; B carries the last radical to the following line and A/C/D continue after S=. All end terms and punctuation are visible.',
    'Figure labels A-F and its displayed extreme edges are legible within the screenshot; no diagram fidelity re-review made.',
    'No visible right-edge clipping, occluded last option, or illegible option/control rendering.'
  ],
  mechanicalEvidenceReused: {
    ...ref(manifest.choiceDisplayResult.path),
    recordedStatus: display.results[index].status,
    scope: 'Existing offline browser mechanical display result only; not rerun, not a new GUI/product verification.'
  }
}));
write('choice-visual-review.json', {
  schema: 'SAME188-6/choice-display-only-visual-review@1', status: 'pass', ticket: manifest.ticket,
  assignment: manifest.assignment, book: manifest.book, lesson: manifest.lesson, cwd,
  scope: 'FIRST actual N47 choice display only, supplied full desktop1440/mobile390 screenshots',
  inputManifest: ref(manifestPath), visibleQuestions: ref(manifest.visibleQuestions.path),
  screenshots, questionCount: 7, optionCount: 24,
  questionEvidence: questions.map((question, index) => ({
    id: question.id, mode: question.view.mode, optionLabels: question.view.options.map(option => option.id),
    status: 'pass', evidence: perQuestionVisualEvidence[index]
  })),
  controls: { singleQuestions: 4, multipleQuestions: 3, radioOptions: 16, checkboxOptions: 8,
    staticRenderingStatus: 'pass', newClickOrSubmissionTestPerformed: false },
  tables: { presentInVisibleQuestionProjection: false, status: 'not-applicable' },
  plotExtrema: { presentInChoiceScope: false, status: 'not-applicable' },
  findings: [], hiddenRightmostContentObserved: false, insufficientEvidence: false,
  newMeasuredPixelsClaimed: false, newBrowserRun: false, guiProductPublicationClaimed: false,
  inheritedSemanticReview: { ...manifest.inheritedChoiceSemanticReview,
    status: 'pass-inherited-not-re-reviewed', contentsParsedHere: false },
  inheritedPassedScopesNotRepeated: ['all answers', 'all mathematics', 'source fidelity', 'internal choice keys',
    'four text/exercise visual screenshots', 'seven modern-figure fidelity verdicts'],
  internalChoiceKeysParsed: false, draftOrSeedContentsParsed: false,
  imageLedger: ref(local('image-ledger.json')), inheritedHoldsPreserved: true,
  inheritedSourceVerdictsDoNotChangeChoiceDisplayVerdict: true,
  inheritedHolds, candidatesEdited: false, newContentRepairs: 0, wholeLessonApproved: false, published: false
});

const comparisons191 = [
  { ref: 'p0191#1', status: 'pass', evidence: 'Actual 做棱台. retained as cont=true/open=false; joins predecessor 这样的多面体叫 without invented wording.' },
  { ref: 'p0191#2', status: 'pass-readable', evidence: 'Both base polygon names and 位似多边形 retained across two printed rows. Indexed-letter roles preserved; exact tiny subscript ink identity remains separately held.' },
  { ref: 'p0191#3', status: 'pass', evidence: 'Both rows preserved: endpoints within both bases, perpendicular height definition, and trapezoidal side faces.' },
  { ref: 'p0191#4', status: 'pass-readable', evidence: 'Regular-frustum condition, source 合同, 等腰梯形, repeated 图47, 斜高 and [MM_1] segment retained. No modern synonym substituted; exact tiny suffix ink identity held.' },
  { ref: 'p0191#5', status: 'pass', evidence: 'One side-face area multiplied by face count and formula introduction retained.' },
  { ref: 'p0191#6', status: 'pass-readable', exactSuffixStatus: 'hold', evidence: 'S, 1/2, (P+P_1), multiplication dot and h match both original full page and exact detail. Candidate 侧/斜 suffixes are not approved from the unreadable dark suffix pixels.' },
  { ref: 'p0191#7', status: 'pass', evidence: 'Full lateral-area statement retained; source wavy underline observed but all-ink/print-versus-annotation identity not approved.' },
  { ref: 'p0191#8', status: 'pass', evidence: 'Printed 习 题 remains an exercise heading.' },
  { ref: 'p0191#9', status: 'pass', evidence: 'Exercise99 retains 16 cm, 24 cm, 40 cm, diagonal length and diagonal-section area; split cm line preserved.' },
  { ref: 'p0191#10', status: 'pass', evidence: 'Exercise100 retains 1)/2), smaller-base diagonal endpoint, perpendicular section, a>b, lateral edge c and section-area request, all four printed rows.' },
  { ref: 'p0191#11', status: 'pass', evidence: 'Exercise101 retains H, a/b, a>b with actual row break after >, all 1)/2)/3) cases and n棱台; no new subparts or answer.' },
  { ref: 'p0191#12', status: 'pass', evidence: 'Exercise102 retains 贮物槽, one base and sides of regular square frustum, centimetre units, 图48 reference and actual unfinished ending 为; open=true.' },
  { ref: 'p0191#13', status: 'pass-readable', evidence: 'Printed184 remains a footer; decorative/margin/folio ink attribution not approved.' }
];
const comparisons192 = [
  { ref: 'p0192#1', status: 'pass-readable', evidence: 'Actual native figure48 contains 275 upper rear span, 125 lower front span, 200 external vertical dimension, A/B feet, solid outline/dimension strokes and dark side shading. No dashed edge or dimension suffix visible. owner_exercise=102 supported by actual source191 reference and source192 continuation.', allInkStatus: 'hold' },
  { ref: 'p0192#2', status: 'pass', evidence: '图48 retained as separate caption; not inside native figure crop.' },
  { ref: 'p0192#3', status: 'pass', evidence: 'Exact exercise102 continuation retained; square-decimetre iron-plate request, A and B two feet excluded, closes before103; cont=true/open=false.' },
  { ref: 'p0192#4', status: 'pass', evidence: 'All three source rows of103 preserved via actual wrap marker after a: isosceles triangle, a>b,120 degrees, perpendicular edge through the angle vertex, length c and lateral-area request.' },
  { ref: 'p0192#5', status: 'pass', evidence: 'All three rows of104 retained: square bases8/4 cm, perpendicular isosceles-trapezoid side, opposite-face/base angle60 degrees and lateral-area request.' },
  { ref: 'p0192#6', status: 'pass', evidence: 'Actual printed §54. 正多面体的概念 retained as h3 after104; not guessed from TOC.' },
  { ref: 'p0192#7', status: 'pass', evidence: 'Entire three-row definition retained, source 合同的正多边形 and same face count at all polyhedral angles; no altered definition or invented completion.' },
  { ref: 'p0192#8', status: 'pass', evidence: 'Entire four-row paragraph retains 合同, cube/49, tetrahedron/50, octahedron/51, icosahedron/52 and ends at 正十二面体 without terminal punctuation; open=true, no unseen 图53 appended.' },
  { ref: 'p0192#9', status: 'pass-readable', evidence: 'Printed185 footer retained; folio-adjacent all-ink identity held.' }
];
const joins = [
  { id: '190-to-191-paragraph', status: 'pass', from: 'p0190#11', to: 'p0191#1',
    predecessor: ref(sourceManifest.predecessorTextOnly.path), predecessorTextOnly: true,
    actualTail: '这样的多面体叫', actualHead: '做棱台.',
    joinedEnding: '这样的多面体叫做棱台.',
    evidence: 'Bound predecessor tail and original191 FIRST pixels match candidate191 cont=true/open=false. Predecessor not newly approved; lost189 receipt HOLD unchanged.' },
  { id: '191-to-192-exercise102', status: 'pass', from: 'p0191#12', through: 'p0192#1/#2', to: 'p0192#3',
    actualTail: '按图上的尺寸（以厘米为单位）计算，为',
    actualHead: '制造这样一个贮物槽，需要多少平方分米的铁板',
    evidence: 'Actual source text joins 为制造..., with transparent figure/caption; candidate open/cont flags retain one exercise102, figure owner102 and explicit A/B feet exclusion. No inferred geometric answer.' },
  { id: 'local53-to54-heading', status: 'pass', from: 'p0192#5', to: 'p0192#6',
    evidence: 'Actual104 is complete, followed by actual§54 heading. Local observed boundary only; neither whole53 nor whole54 approved.' },
  { id: '192-to-unread193-tail', status: 'hold', from: 'p0192#8', to: 'unread193',
    boundTail: ref(sourceManifest.actual192Tail.path), actualTail: '正十二面体',
    evidence: 'Actual incomplete final paragraph and candidate open=true preserved. No source193 pixels, continuation, following figure ownership or terminal punctuation guessed.' }
];
if (!predecessor.last_text.endsWith('这样的多面体叫') ||
    page191.candidate.blocks[0].lines[0] !== '做棱台.' ||
    !page191.candidate.blocks[0].cont || page191.candidate.blocks[0].open ||
    !page191.candidate.blocks[11].open || !page192.candidate.blocks[2].cont ||
    page192.candidate.blocks[2].open || page192.candidate.blocks[0].owner_exercise !== '102' ||
    page192.candidate.blocks[5].lines[0] !== '§54. 正多面体的概念' ||
    !page192.candidate.blocks[7].open ||
    JSON.stringify(page192.candidate.blocks[7].lines) !== JSON.stringify(successor.exact_last_object_lines) ||
    !page192.candidate.blocks[7].lines.at(-1).endsWith('正十二面体'))
  throw new Error('Source join or tail binding failed');

write('source-review.json', {
  schema: 'SAME188-6/independent-source-review@1', ticket: manifest.ticket, assignment: manifest.assignment,
  status: 'hold', statusReason: 'All readable lexical/math content and observed joins pass within their stated scope. Exact tiny formula suffixes, all-ink attribution and unseen193 right boundary remain HOLD.',
  cwd, book: manifest.book, scope: 'source191192 FIRST independent original review only; no whole53/54 approval',
  inputManifest: ref(manifestPath), reviewInputManifest: ref(manifest.sourceReviewInput.path),
  predecessorTextOnly: ref(sourceManifest.predecessorTextOnly.path),
  pages: [
    { page: 191, printedPage: 184, status: 'hold', readableContentStatus: 'pass',
      readableContentScope: 'Every readable printed lexical row and readable mathematical token; exact ink-heavy S/h suffix identities excluded and held explicitly.',
      readableMathStatus: 'pass', completeLiteralMathGlyphStatus: 'hold',
      completeSourceApprovalStatus: 'hold', joinsStatus: 'pass', allInkIdentityStatus: 'hold',
      original: ref(page191.entry.original.path), candidateMD: ref(page191.entry.candidateMD.path),
      candidateJSON: ref(page191.entry.candidateJSON.path), audit: ref(page191.entry.audit.path),
      sourceInventory: ref(local('source191-inventory.FIRST.json')),
      detailInventory: ref(local('focused-crop-observations.FIRST.json')),
      independentPrintedRows: read(local('source191-inventory.FIRST.json')).rows.length,
      nativeLineCountsReused: { printed: page191.audit.lines_printed, md: page191.audit.lines_md, rerun: false, independentApproval: false },
      comparisons: comparisons191,
      holds: [
        { id: 'p0191-small-subscript-glyphs', status: 'hold', scope: 'p0191#2/#4/#6',
          reason: 'Exact tiny indexed-name/segment glyph identity remains scoped HOLD; S/h suffixes particularly unreadable in both full page and exact math detail. Candidate 侧/斜 not independently approved.' },
        { id: 'p0191-all-ink-attribution', status: 'hold', reason: 'Left-edge trace, detached margins, formula-adjacent and folio ink not exhaustively assigned.' },
        { id: 'p0191-area-statement-underline', status: 'hold', reason: 'Wavy underline observed; print-versus-annotation and individual stroke identity unapproved.' }
      ] },
    { page: 192, printedPage: 185, status: 'hold', readableContentStatus: 'pass',
      readableContentScope: 'All readable rows, all readable mathematics and figure48 labels/dimensions/structure; dense local ink identity excluded and held.',
      readableMathStatus: 'pass', completeSourceApprovalStatus: 'hold',
      joinsStatus: 'pass-observed-191-to192', unseen193ContinuationStatus: 'hold', allInkIdentityStatus: 'hold',
      original: ref(page192.entry.original.path), candidateMD: ref(page192.entry.candidateMD.path),
      candidateJSON: ref(page192.entry.candidateJSON.path), audit: ref(page192.entry.audit.path),
      sourceInventory: ref(local('source192-inventory.FIRST.json')),
      independentPrintedRows: read(local('source192-inventory.FIRST.json')).rows.length,
      nativeLineCountsReused: { printed: page192.audit.lines_printed, md: page192.audit.lines_md, rerun: false, independentApproval: false },
      comparisons: comparisons192, figure48: { readableStructureStatus: 'pass', exactCropStatus: 'pass',
        smallSuffixesVisible: false, sourceSolidDashedStatus: 'pass-readable-no-dashed-edge-observed',
        owner: 'exercise102', ownerStatus: 'pass', allInkIdentityStatus: 'hold',
        sourceCrop: ref(page192.entry.figures[0].crop.path), arrayEvidence: ref(local('crop-array-evidence.json')),
        captionExcludedFromCrop: true },
      holds: [
        { id: 'p0192-all-ink-attribution', status: 'hold', reason: 'Margin/folio specks and dense figure-adjacent ink not exhaustively assigned.' },
        { id: 'fig-g10-48-dense-small-ink', status: 'hold', reason: 'Shading flecks, arrow/leader endpoints and lower tab junctions retained as pixels, not exhaustive semantic/glyph attribution.' },
        { id: 'p0192-N54-right-boundary', status: 'hold', reason: 'Actual paragraph incomplete at 正十二面体;193 unread. No unseen continuation or whole54 approval.' },
        { id: 'N54-following-figure-ownership-and-right-boundary', status: 'hold', reason: 'References49-52 are readable text only; following original figure pixels/ownership not reviewed.' }
      ] }
  ],
  readableContentStatus: 'pass', readableMathStatus: 'pass',
  readableStatusQualification: 'PASS does not claim exact held formula suffixes or every ink mark.',
  completeLiteralSourceStatus: 'hold', observedJoinsStatus: 'pass', joins,
  cropByteEqualityStatus: 'pass', cropEvidence: ref(local('crop-array-evidence.json')),
  nativeAuthorPassIsNotIndependentSourceApproval: true, nativeFinalizerRerun: false,
  allInkIdentityStatus: 'hold', inheritedHoldsPreserved: true, inheritedHolds,
  historicalAuthorLocalHolds: { evidence: ref(sourceManifest.actual192Tail.path), unchanged: true,
    newlyObserved102JoinSeparateFromHistoricalHold: true },
  independentN47ChoiceVerdict: 'pass-separate-no-source-hold-poisoning',
  imageLedger: ref(local('image-ledger.json')), source193PixelsRead: false, candidatesEdited: false,
  newContentRepairs: 0, whole53Approved: false, whole54Approved: false, published: false
});

const source185Candidate = read(sourceManifest.affected.source185.candidateJSON.path).blocks[8];
if (!source185Candidate.lines[0].includes('底面是')) throw new Error('Source185 affected candidate wording differs');
write('affected-source-review.json', {
  schema: 'SAME188-6/affected-independent-source-review@1', status: 'hold', ticket: manifest.ticket,
  assignment: manifest.assignment, cwd, book: manifest.book,
  statusReason: 'Two narrowly affected lexical verdicts pass; original historical FAIL/HOLD and current whole-page all-ink HOLDs remain.',
  inputManifest: ref(manifest.sourceReviewInput.path),
  affected: [
    { page: 185, printedPage: 178, ref: 'p0185#9', scope: 'exercise85 opening 底是 versus 底面是 only',
      status: 'pass', affectedReadableWordingStatus: 'pass', pageStatus: 'hold',
      original: ref(sourceManifest.affected.source185.original.path),
      candidateMD: ref(sourceManifest.affected.source185.candidateMD.path),
      candidateJSON: ref(sourceManifest.affected.source185.candidateJSON.path),
      freshFocusedFIRST: ref(local('source185-focused.FIRST.json')),
      freshCropFIRST: ref(local('focused-crop-observations.FIRST.json')),
      crop: ref(local('source185-ex85-opening-original-crop.png')),
      cropMetadata: ref(local('source185-ex85-opening-original-crop.json')),
      cropArrayEvidence: ref(local('crop-array-evidence.json')),
      freshIndependentPixelWord: '底面是', candidateWord: '底面是',
      evidence: 'Original185 opened once and fresh focused FIRST frozen before candidate or old report. Original exact crop then independently shows a separate 面 between 底 and 是; no inference from rhombus geometry.',
      historicalIndependentFIRST: ref(sourceManifest.affected.source185.firstIndependentInventory.path),
      historicalReview: ref(sourceManifest.affected.source185.previousIndependentReview.path),
      historicalWord: '底是',
      historicalWordingHold: { ...prior185.holds.find(hold => hold.id === 'p0185-ex85-base-wording'),
        originalReportUnchanged: true, separateNewAffectedVerdict: 'pass' },
      unaffected79Through84AndFigure41Passes: 'inherited-not-re-reviewed',
      allInkIdentityStatus: 'hold', otherHolds: prior185.holds.filter(hold => hold.id !== 'p0185-ex85-base-wording'),
      source185HoldPreserved: true, wholePageApproved: false, candidateEdited: false, newSourceRepairs: 0 },
    { page: 186, printedPage: 179, ref: 'p0186#11', scope: 'one restored 并 character only',
      status: 'pass', affectedRepairStatus: 'pass', pageStatus: 'hold',
      originalMD: change186.originalMD, repairedMD: change186.repairedMD,
      originalJSON: change186.originalJSON, repairedJSON: change186.repairedJSON,
      priorIndependentFIRST: change186.priorIndependentFIRST,
      priorIndependentReview: change186.priorIndependentReview,
      recordedIndependentPixelWord: '并且顶点的射影',
      actualBefore: change186.before, actualAfter: change186.after,
      insertedCharacter: '并', insertedCodePoint: 'U+5E76',
      exactOneCharacterMDChange: true, exactOneCharacterJSONChange: true, other11BlocksIdentical: true,
      sourcesMetadataAuditAndTwoCropsIdentical: true,
      differenceAndByteEvidence: ref(local('source186-change-evidence.json')),
      nativeReceipt: change186.nativeReceipt, nativeAudit: change186.nativeAudit,
      nativeCountsReused: change186.nativeCountsReused,
      sourceContentRepairBudget: { used: 1, limit: 1, newRepairsHere: 0 },
      historicalOriginalReadableStatus: 'fail', historicalAffectedOmissionStatus: 'fail',
      historicalOmissionFinding: { ...prior186.holds.find(hold => hold.id === 'p0186-regular-definition-wording'),
        originalReportUnchanged: true, separateRepairedVerdict: 'pass' },
      allInkIdentityStatus: 'hold', otherHolds: prior186.holds.filter(hold => hold.id !== 'p0186-regular-definition-wording'),
      source186ImageReopened: false, original186FailPreservedInHistory: true,
      unaffectedPassedFullSourceAndFigures: 'inherited-not-re-reviewed', wholePageApproved: false }
  ],
  affectedRepairVerdictsStatus: 'pass', completeSourceApprovalStatus: 'hold',
  inheritedHoldsPreserved: true, source185HoldPreserved: true, original186FailPreservedInHistory: true,
  inheritedHolds, imageLedger: ref(local('image-ledger.json')), nativeFinalizerRerun: false,
  candidatesEdited: false, newContentRepairs: 0, wholeLessonApproved: false, published: false
});

write('first-inventory-bindings.json', {
  purpose: 'Frozen own FIRST inventories remain separate from candidate comparisons and old reports.',
  creationOrderRecordedInImageLedger: true, sourceOriginalsBeforeCandidates: true,
  inventories: ['source191-inventory.FIRST.json', 'source192-inventory.FIRST.json',
    'source185-focused.FIRST.json', 'focused-crop-observations.FIRST.json'].map(name => ref(local(name)))
});
console.log(JSON.stringify({
  choice: { ...ref(local('choice-visual-review.json')), status: 'pass' },
  source: { ...ref(local('source-review.json')), status: 'hold', readable: 'pass', observedJoins: 'pass' },
  affected: { ...ref(local('affected-source-review.json')), status: 'hold', affected185: 'pass', affected186: 'pass' },
  imageLoads: 8
}, null, 2));
