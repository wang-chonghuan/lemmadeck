import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp/d330-t18-desktop-choice-display';
const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const bind = p => ({ path: p, sha256: sha(p) });
const rawPath = path.join(root, 'dom-capture.json');
const raw = JSON.parse(fs.readFileSync(rawPath, 'utf8'));
assert.equal(raw.execution.browserLaunches, 0);
assert.equal(raw.execution.actualDOMInspections, 0);
assert.equal(raw.execution.fullPageCaptureAttempts, 0);
assert.equal(raw.execution.independentExpectedDocumentExtractions, 0);
assert.equal(raw.tiles.length, 0);
assert.ok(raw.failures[0].error.includes('ERR_PACKAGE_PATH_NOT_EXPORTED'));
const sourceInputs = [
  ['d329-t18-scoped-display/manifest.json', '0576e2ab7b403545aeb78ec8a18893912fe620e46e54f4eb4ded654f6912d113'],
  ['d328-t18-reviewed-text-assembly/manifest.json', '5c85c17433f6b5df33f735b6ddf7a8d3324dd582d3b40b1f4df191acf3070c61'],
  ['d329-t18-scoped-display/zh/choices.html', '99269defefc269eaffe3d0808f11bc0e9c0eaf9562d8baf0cbf3690f397e19a2'],
  ['d329-t18-scoped-display/en/choices.html', 'd730c8355ade25a98e40b847e9cc0e683b7de0dc29da85e72f02c931450acebb'],
  ['d328-t18-reviewed-text-assembly/zh/visible-only.json', '813c5f02f745338ddfb594701b67a9a8a40f18886a2af66e62b5cc2d981a76b9'],
  ['d328-t18-reviewed-text-assembly/en/visible-only.json', '3058b7ff7f8b256c45497e6928913d11f838c225d0d2996eb8cfbe541e9f589f'],
].map(([p, expectedSHA256]) => {
  const input = bind(path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp', p));
  return { ...input, expectedSHA256, unchanged: input.sha256 === expectedSHA256 };
});
const report = {
  schema: 'STEMROBIN-181/d330-desktop-choice-display-handoff@1',
  ticket: 'STEMROBIN-181', card: 'phy9-c2-s4-t18',
  status: 'CHECKER-PREFLIGHT-FAIL-DISPLAY-NOT-RUN',
  final: true, finishedAt: new Date().toISOString(),
  outputRoot: root, originalBranch: 'codex/STEMROBIN-181-textbooks',
  scope: 'First visual DISPLAY of two immutable partial choices HTML documents; not source/math review or whole-card acceptance.',
  rawFirstAttempt: bind(rawPath),
  failure: {
    kind: 'CHECKER-INFRASTRUCTURE', surfaceFinding: false,
    code: 'ERR_PACKAGE_PATH_NOT_EXPORTED',
    path: path.join(root, 'check.mjs'), line: 95,
    detail: 'Bundled sharp loads, but requireRuntime.resolve("sharp/package.json") is not exported. Failure while recording dependency provenance, before input preparation and browser launch.',
    sourceContentFailureClaim: false,
    rawStatusQualification: 'The untouched raw file says FAIL-DOM-preserved-no-repair; counters prove no DOM ran. This handoff classifies it as checker preflight failure, not a rendered-document failure.',
    preservedWithoutRepairOrRerun: true,
  },
  counts: {
    firstCommandAttempts: 1, repeatedCommands: 0, browserLaunches: 0,
    actualDOMInspections: 0, independentExpectedDocumentExtractions: 0,
    DOMByLanguage: { zh: 0, en: 0 }, captureAttemptsByLanguage: { zh: 0, en: 0 },
    fullPageCaptures: 0, pixelCropsCreated: 0, actualImageOpens: 0,
    batchImageBudget: 8, contextImageOpens: 0, contextImageBudget: 24,
    parentNewImagePayloads: 0, parentInheritedCountAtAssignment: 24,
    parentCounterWrittenOrReset: false,
  },
  actualOpenedImages: [], actualPerScreenVisualObservations: [],
  observedCoverage: { zh: [], en: [] },
  unobservedCoverage: ['zh', 'en'].map(language => ({
    language, viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1,
    surface: 'choices', extent: 'Entire document, heading through final option including right and bottom.',
    expectedQuestions: 14, expectedOptions: 59,
    sourceTasks: ['2', '3', '4', '5', '6', '7', '8', '10', '11', '12', '13', '14', '15', '16'],
    DOMStatus: 'NOT-RUN', pixelStatus: 'NOT-OBSERVED',
    sheetBounds: null, cropRanges: null, reason: 'No browser launched; no bounds or screenshots exist.',
  })),
  pendingCriteria: [
    'Independent expected Document text/formula extraction and comparison to actual visible stems/options.',
    'Exact 14-question/59-option order, single/multiple controls, native unselected disabled state.',
    'Input/live script count zero; all KaTeX rendering and fonts.',
    'No horizontal overflow, clipping, text/control collisions; complete last-option reachability.',
    'One fullPage screenshot per language with SHA256 and original-pixel sheet crops <=960px high.',
    'Firsthand natural-order visual observation of at most eight crops, with any remainder explicitly unobserved.',
  ],
  sourceInputs, allSixSourceInputsUnchanged: sourceInputs.every(i => i.unchanged),
  sourceInputsCopiedOrChanged: false,
  prohibitedInputsRead: {
    internalChoicesProjection: false, answersHTML: false, keys: false,
    sourceSolutions: false, originalMathReviews: false,
    note: 'Manifest entries were read as metadata only, never traversed into prohibited files.',
  },
  method: raw.methodReuse,
  DOMConclusion: 'No DOM result exists; cannot claim PASS or document FAIL.',
  pixelConclusion: 'No pixels observed; neither language has visual PASS.',
  originalSourceTaskCount: 16, selectedSourceTaskCount: 14,
  heldSourceTasksOutsideSubset: ['1', '9'],
  completeCardClaim: false, fullGate2PASS: false, formalProductAC: false,
  answersOrMobileChecked: false, permanentWorkerCreated: false,
  newWorktreeOrBranch: false, foregroundActions: 0, networkActions: 0,
  DBOrServerStarted: false, nativeReviewOrRenderRepeated: false,
  mathematicalReviewRepeated: false, contentRepairs: 0,
  sharedMeterOrIndexWritten: false, existingChangesReverted: false,
  commitPushMergeDeploy: false,
  erroneousRepoRootOutput: {
    path: path.join(repo, 'tmp/d330-t18-desktop-choice-display'),
    existedBeforeWrites: false, written: false, correspondenceNeeded: false,
    originalTmpBytesDeletedOrOverwritten: false,
  },
  freeze: {
    allOwnFilesMode: '0444', manifest: path.join(root, 'frozen-manifest.json'),
    manifestHashSuppliedExternallyInTextHandoff: true,
    noImagePayloadSentToParent: true,
  },
};
assert.ok(report.allSixSourceInputsUnchanged, 'Retain failure; do not claim unchanged inputs');
const write = (name, value) => {
  const p = path.join(root, name);
  fs.writeFileSync(p, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
  return bind(p);
};
const reportBinding = write('report.json', report);
const ownNames = fs.readdirSync(root).sort();
assert.ok(ownNames.every(n => fs.statSync(path.join(root, n)).isFile()));
const frozen = write('frozen-manifest.json', {
  schema: 'STEMROBIN-181/d330-own-products-frozen@1',
  ticket: 'STEMROBIN-181', outputRoot: root, status: report.status,
  files: ownNames.map(n => ({ ...bind(path.join(root, n)), frozenMode: '0444' })),
  inputsReadOnlyAndUnchanged: sourceInputs, actualImageOpens: 0,
  fullPageCaptures: 0, entireBothDocumentsUnobserved: true,
  wholeCardOrFullGate2PASS: false,
  self: { path: path.join(root, 'frozen-manifest.json'), frozenMode: '0444',
    sha256: 'Provided externally to avoid a circular self-hash.' },
});
for (const n of fs.readdirSync(root)) fs.chmodSync(path.join(root, n), 0o444);
const modes = fs.readdirSync(root).map(n => ({
  path: path.join(root, n), mode: (fs.statSync(path.join(root, n)).mode & 0o777).toString(8) }));
assert.ok(modes.every(m => m.mode === '444'));
assert.equal(sha(reportBinding.path), reportBinding.sha256);
assert.equal(sha(frozen.path), frozen.sha256);
console.log(JSON.stringify({ status: report.status, report: reportBinding,
  frozenManifest: frozen, rawFirstAttempt: report.rawFirstAttempt,
  ownFilesAll0444: true, actualDOM: 0, capture: 0, openedImages: 0,
  wholeBothDocumentsUnobserved: true, allSixInputsUnchanged: true }, null, 2));
