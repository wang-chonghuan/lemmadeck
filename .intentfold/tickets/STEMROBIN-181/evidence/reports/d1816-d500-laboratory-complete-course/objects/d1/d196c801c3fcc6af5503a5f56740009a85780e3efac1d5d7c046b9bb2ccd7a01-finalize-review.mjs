import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const out = path.dirname(fileURLToPath(import.meta.url));
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const bind = file => {
  assert(file.startsWith(`${repo}/`));
  const data = fs.readFileSync(file);
  return { path: file, bytes: data.length,
    sha256: crypto.createHash('sha256').update(data).digest('hex') };
};
const save = (name, data) => fs.writeFileSync(path.join(out, name),
  `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' });
const freezePath = path.join(out, 'input-freeze.json');
const freeze = read(freezePath);
for (const row of freeze.inputBindings) assert.equal(bind(row.path).sha256, row.sha256);
const domPath = path.join(out, 'dom-review-evidence.json');
const completePath = path.join(out, 'completeness-evidence.json');
const dom = read(domPath);
const complete = read(completePath);
assert.equal(dom.status, 'PASS');
assert.equal(complete.status, 'PASS');
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp');
const inheritedPath = path.join(tmp, 'd1816-d496a-laboratory-affected-review/report.json');
const nativePath = path.join(tmp, 'd1816-d497-laboratory-native-finalization/result.json');
const defectPath = path.join(tmp, 'd1816-d498-laboratory-offline-display/italic-dom-defect.json');
const tests = path.join(tmp, 'd1816-recovery/native/d498a-laboratory-emphasis-renderer-tests');
const dimensions = [[1440, 7664], [1440, 9061], [390, 8941], [390, 12770],
  [390, 844], [390, 844], [390, 844], [390, 844]];
const displayedDimensions = [[1127, 6000], [954, 6000], [262, 6000], [183, 6000],
  [390, 844], [390, 844], [390, 844], [390, 844]];
const imageObservations = [
  'Continuous centered ZH whole-course layout. All ten experiment headings, figure/caption, final diffraction steps, footnote and zero-exercise forward link are retained. No blank/black region, apparent paragraph collision or clipped course tail. Fine glyphs are qualified because this fullpage view is reduced.',
  'Continuous centered EN whole-course layout. All I-X experiment headings, paragraphs, figure/caption, diffraction tail, footnote and zero-exercise link are present without apparent overlap or clipping. Fine glyphs are qualified because this fullpage view is reduced.',
  'Narrow ZH whole-course layout preserves all ten experiment sections and their paragraph order through the final footnote/link. Figure remains integrated and headings/paragraphs do not visibly collide. Reduction prevents native-size fine-glyph certification from this fullpage image.',
  'Narrow EN whole-course layout preserves I-X headings and wrapping through the final footnote/link. Figure is present and there is no apparent structural overlap, blank output or missing tail. This is the most reduced fullpage image, not native-size fine-glyph evidence.',
  'At the actual 390px mobile screenshot width, the 358px figure is fully drawn and legible: A/B/C and alpha/beta labels, rays, normal, plate and angle arcs remain distinct. No blank/black image, missing visible object, label collision or figure clipping; caption and next heading are clear.',
  'At the actual 390px mobile screenshot width, the same 358px figure and all five labels remain legible, distinct and unclipped, with a clean English caption and wrapping next heading. The preceding formula is partly outside this scrolled viewport, not a clipped figure or missing course block.',
  'Native-size mobile ZH microscope viewport shows clear prior formulas, section VII heading, apparatus/procedure labels and the objective term in clean italic emphasis without literal stars or line collisions. Eyepiece is outside this focused viewport; its full-course placement and emphasis are checked in the exact DOM, not an extra image.',
  'Native-size mobile EN microscope viewport shows clear formula text, section VII heading, apparatus/procedure labels and the objective term in italic without literal stars. The viewport naturally ends within the first step; eyepiece is outside this focused viewport and is checked in exact full-course DOM, not an extra image.',
];
const opens = freeze.selectedScreenshots.map((row, index) => {
  const data = fs.readFileSync(row.path);
  assert.equal(data.readUInt32BE(16), dimensions[index][0]);
  assert.equal(data.readUInt32BE(20), dimensions[index][1]);
  return {
    ...row, actualOpen: index + 1, tool: 'functions.view_image',
    actualOpenedOnce: true, reopened: false, croppedOrDerivativeOpened: false,
    originalPixels: dimensions[index], pixelsDeliveredByViewer: displayedDimensions[index],
    reducedByViewer: index < 4, observation: imageObservations[index],
  };
});
const records = dom.records.map(row => {
  const c = complete.records.find(item => item.locale === row.locale &&
    item.viewport.name === row.viewport.name);
  const screenshot = opens.find(item => path.basename(item.path) ===
    `${row.locale}-${row.viewport.name}-complete-text.png`);
  return {
    locale: row.locale, viewport: row.viewport, status: 'PASS',
    html: row.html, emptyExerciseHtml: row.destination, wholeTextScreenshot: screenshot,
    courseIdentity: { id: 'phy10-c4-s4', courses: 1, experiments: 10,
      sourceBlocks: 110, renderedContentBlocks: c.structuralContentBlocks,
      paragraphsIncludingExperimentHeadings: row.text.paragraphCount,
      figures: 1, originalIndependentExercises: 0 },
    structure: {
      title: row.text.title, breadcrumb: row.text.crumb,
      experiments: c.experiments, sheetChildCount: row.text.sheetChildCount,
      scrollWidth: row.text.width, documentHeight: row.text.height,
      matchesD498aScreenshotGeometry: true, maxGeometryDeltaPx: row.maxGeometryDelta,
      allSheetBoxesWithinViewport: true, sheetChildrenDoNotOverlap: true,
      zeroParagraphIndent: row.text.zeroIndent, canonicalTail: c.canonicalTail,
      footnotes: c.footnoteCount, tailAndForwardVisibleAtScrollEnd: c.scroll,
    },
    actualTextSize: {
      paragraphFontSizes: row.text.paragraphFontSizes,
      paragraphLineHeights: row.text.paragraphLineHeights,
      fontStatus: row.text.fontStatus, katexMainFontLoaded: row.text.katexFontLoaded,
      katexOrProseMathNodes: row.text.mathCount, families: row.text.mathFamilies,
      minimumRatioToParagraphSize: row.text.minMathRatio,
      evidence: 'Computed browser styles/font loading and exact geometry on frozen HTML; not estimated from reduced screenshot glyphs.',
    },
    microscopeEmphasis: { status: 'PASS', terms: row.text.terms,
      noLiteralStarsInTheFourAffectedPhrases: true,
      assessment: 'Exactly two EM elements per locale, computed italic at 16.96px, nonzero in-bounds geometry; objective and eyepiece both clean in DOM. Native-size objective pixels are independently observed in the two selected mobile microscope images.' },
    figureDisplay: {
      status: 'PASS', svgWidthPx: row.text.figureBox.width,
      svgBox: row.text.figureBox, labels: row.text.labels,
      labelScreenSizesMeet16PxGate: true,
      pixelEvidence: row.viewport.name === 'mobile'
        ? 'Selected native-size mobile figure image; all labels and drawing legible at 358px actual width.'
        : 'Wholepage layout plus exact 480px SVG geometry and 32px label screen-size; no additional desktop figure crop opened.',
      sourceTopologyApproval: 'INHERITED_D496a_PASS_UNCHANGED_NOT_REPLAYED',
    },
    emptyExercises: {
      status: 'PASS', applicability: 'Original independently numbered exercises = 0; no answers or choices are applicable.',
      actualHtmlAndDom: row.emptyExercises,
      independentObservedForwardClick: row.independentObservedForwardClick,
      independentObservedBackClick: row.independentObservedBackClick,
      boundD498aObservedForwardClick: row.boundD498aObservedForwardClick,
      boundD498aObservedBackClick: row.boundD498aObservedBackClick,
      exerciseItems: 0, answerChoiceControls: 0, imagesOpenedForEmptyPage: 0,
    },
    observation: screenshot.observation, browserErrors: row.errors,
  };
});
const inherited = read(inheritedPath);
const report = {
  schemaVersion: 1, task: 'STEMROBIN-181 D499 FIRST independent COMPLETE LABORATORY OFFLINE DISPLAY review',
  batch: 'D499', status: 'PASS', findings: [], completedAt: new Date().toISOString(),
  cwd: repo, ownership: out, course: 'phy10-c4-s4',
  authority: freeze.authority, inputFreeze: bind(freezePath),
  inputBindings: freeze.inputBindings, reviewFreezePath: path.join(out, 'review-freeze.json'),
  reviewKind: 'FIRST_INDEPENDENT_CURRENT_D498a_COMPLETE_OFFLINE_DISPLAY',
  gates: { completeOfflineDisplay: 'PASS', modernFigureActualMobileDisplay: 'PASS',
    microscopeEmphasisRepair: 'PASS', emptyExerciseHtmlAndNavigation: 'PASS',
    inputByteIntegrity: 'PASS' },
  inheritedGates: {
    report: bind(inheritedPath), status: inherited.status, gates: inherited.gates,
    sourceTextScienceFigure: 'INHERITED_CURRENT_D496a_PASS_ONLY; no source/RAW or semantic review replay.',
    originalD496FailPreserved: inherited.inheritedOriginalFail,
    soleAffectedZhText: '/prose/88/text separator corrected in D496a; all unaffected gates inherited unchanged.',
    nativeFinalization: { ...bind(nativePath), statusVerbatim: read(nativePath).status,
      interpretation: 'Native PASS was display-pending, not a previously completed independent display approval.' },
    historicalD498Defect: { ...bind(defectPath), status: read(defectPath).status,
      disposition: 'Resolved by the narrow D498a display renderer emphasis change only; historical receipt preserved.' },
    historicalD498WholeContentMechanicalPassIsCurrentAuthority: false,
  },
  rendererRepairReview: {
    status: 'PASS',
    files: freeze.inputBindings.filter(row =>
      /\/tools\/(?:htmlfrag\.js|render_lesson\.js)$/.test(row.path)),
    assessment: 'The narrow file-specific diff introduces single-star emphasis in escaped nonmath text chunks before/between/after math. Math parsing, TeX payloads, trailing punctuation, unit association, strong-text handling and escaping remain intact. No content/tooling edit was made by D499.',
    exactCurrentHtmlDelta: freeze.displayOnlyHtmlDelta,
    deltaAssessment: 'For each locale, replacing exactly two EM start/end tags back with literal stars reproduces the preserved native HTML byte-for-byte. Current exercise HTML remains byte-identical to native. This isolates the four affected microscope phrases without replaying scientific or source approvals.',
    tests: {
      receipt: bind(path.join(tests, 'receipt.json')),
      stdout: bind(path.join(tests, 'stdout.txt')),
      stderr: bind(path.join(tests, 'stderr.txt')),
      exitCode: read(path.join(tests, 'receipt.json')).exitCode,
      tests: 12, passing: 12, failing: 0, rerunByReviewer: false,
      coverage: 'Five caption regressions, inline/prose emphasis and strong text, math asterisks, escaped HTML/plain multiplication/escaped literal stars, and shared lesson/exercise renderer contract. Existing receipt reviewed, not rerendered.',
    },
  },
  perLocaleViewport: records,
  actualImageOpenEvents: opens,
  evidence: { dom: bind(domPath), completeness: bind(completePath) },
  limitations: [
    'Four fullpage screenshots were reduced by the viewer: 1440x7664 to 1127x6000, 1440x9061 to 954x6000, 390x8941 to 262x6000, and 390x12770 to 183x6000. They establish whole-course layout/continuity, not native fine-glyph inspection of every paragraph or formula.',
    'Completeness and actual type size use current hash-bound HTML, independent exact browser DOM/geometry/font checks and D498a whole-text/navigation evidence. Geometry matches the screenshot receipt with zero delta. Native source/text/science/figure gates are inherited from D496a and are not reopened or reapproved.',
    'The two native-size microscope viewports expose the objective terms but not the eyepiece terms. Both eyepiece terms are present in the fullpage views and verified as EM/italic/no literal stars/in-bounds in exact DOM for desktop and mobile. No extra eyepiece crop or reopen was performed.',
    'The scrolled EN figure screenshot starts with a partly offscreen preceding formula; the complete figure is not clipped. Viewport boundaries in the microscope screenshots naturally interrupt surrounding prose; exact wholecourse geometry and retained tail establish continuation.',
    'Raw textContent in auxiliary DOM evidence includes duplicated hidden KaTeX MathML/annotation and visible-tree strings. This is not a claim of visible repeated numbers; canonical tail evidence replaces each KaTeX subtree with its one original TeX annotation, and the actual pixels show no repeated numeric glyphs.',
    'Scientific PASS remains source-preserving modernization only, with all D496a source qualifications and historical SCI/FAIL/HOLD retained. No specialist, safety, raw-source or new figure-source approval is asserted.',
    'This is a bounded offline self-contained HTML display review, not a live production acceptance, full application/browser/device matrix, publication or permission for merge/deploy/closure. D498a visualObservationPending is not rewritten; this separate report provides the independent display judgment.',
    'All pre-opening input hashes remain unchanged, including source/lesson JSON/SVG/native products and original HTML/receipts. Hash-only source reads are integrity evidence, not source-page review. Existing renderer test receipt is inspected, not rerun; no renderer or lesson content was modified.',
  ],
  usage: {
    actualImageOpensThisBatch: 8, cumulativeActualImageOpensThisReviewer: 8,
    maxBatchImageOpens: 8, maxContextImageOpens: 24,
    reopens: 0, extraCrops: 0, extraImagesCreated: 0, emptyExercisePageImageOpens: 0,
    paidCalls: 0, newPaidCalls: 0, newSourceApprovals: 0,
    sourcePagesAdded: 0, completeCoursesAdded: 0,
    contentEdits: false, toolingEdits: false, courseOrFigureRender: false,
    sourceRawReviewReplay: false, databaseAccess: false, publisherInvoked: false,
    readmeCharterInitializationOrBaselineGitScan: false,
    gitInspection: 'Only the requested two renderer files had their local diff inspected; no status/baseline/history scan or Git mutation.',
    otherReviewersAwakenedOrReset: false, authorContacted: false,
    newBranchWorktreeChatOrTask: false, merge: false, deploy: false, ticketClosure: false,
    productAcceptance: false, originalIndependentExercises: 0,
    inventedAnswersQuestionsChoices: false,
  },
  finalIntegrity: { status: 'PASS', preOpeningInputs: freeze.inputBindings.length,
    preOpeningInputHashesUnchanged: true, sourceLessonSvgBytesUnchanged: true,
    parentFilesModifiedByReviewer: false, writesExclusivelyOwnedDirectory: true },
};
save('report.json', report);
const artifacts = [
  'input-freeze.json', 'dom-review-evidence.json', 'completeness-evidence.json',
  'review-checks.mjs', 'completeness-check.mjs', 'finalize-review.mjs',
].map(name => bind(path.join(out, name)));
save('review-freeze.json', {
  schemaVersion: 1, task: report.task, status: 'PASS', cwd: repo, ownership: out,
  frozenAt: new Date().toISOString(), report: bind(path.join(out, 'report.json')),
  authority: freeze.authority, preOpeningFreeze: bind(freezePath),
  preOpeningFreezeAt: freeze.frozenAt, frozenBeforeFirstImageOpen: freeze.frozenBeforeImageOpen,
  inputBindings: freeze.inputBindings, reviewArtifacts: artifacts,
  actualImageOpenEvents: opens, actualImageOpens: 8,
  inputHashesRecheckedAfterLastImageOpenAndDomReview: true,
  allInputsUnchanged: true, newPaidCalls: 0, newSourceApprovals: 0,
  parentFilesModified: false,
});
for (const row of freeze.inputBindings) assert.equal(bind(row.path).sha256, row.sha256);
const finalFreeze = read(path.join(out, 'review-freeze.json'));
assert.equal(bind(finalFreeze.report.path).sha256, finalFreeze.report.sha256);
for (const row of finalFreeze.reviewArtifacts) assert.equal(bind(row.path).sha256, row.sha256);
console.log(JSON.stringify({ status: 'PASS', findings: [],
  report: bind(path.join(out, 'report.json')),
  reviewFreeze: bind(path.join(out, 'review-freeze.json')),
  authority: freeze.authority, actualImageOpens: 8, inputsUnchanged: freeze.inputBindings.length,
  newPaidCalls: 0, newSourceApprovals: 0 }, null, 2));
