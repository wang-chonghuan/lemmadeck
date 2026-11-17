import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const own = path.dirname(fileURLToPath(import.meta.url));
const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const tmp = `${root}/.intentfold/tickets/STEMROBIN-181/tmp`;
const repair = `${tmp}/d059-source146-text-repair`;
const originalAuthor = `${root}/tmp/d054-10p-source144-147-author`;
const target = `${own}/report.json`;
assert.equal(fs.existsSync(target), false, 'Preserve every historical report');
const hash = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const files = new Map();
function bind(file, expected) {
  const bytes = fs.readFileSync(file);
  const record = { path: file, sha256: hash(bytes), bytes: bytes.length };
  if (expected) {
    assert.equal(record.sha256, expected, file);
    record.expectedSha256 = expected;
    record.matchesExpected = true;
  }
  files.set(file, record);
  return record;
}
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const freezeBinding = bind(
  `${repair}/author-freeze.json`,
  'c40665ebf6a0a498c5c11b6a6e51774f2eda6366d2c5a88a786b3955ffac44c7',
);
const freeze = read(freezeBinding.path);
const originalReportBinding = bind(
  freeze.originalIndependentReport.path,
  'df93267eb0126b7fd2741b39445fadfe0ec71459ddf8671efcf005aa595d3fe3',
);
const originalReport = read(originalReportBinding.path);
const originalAuthorFreeze = bind(
  freeze.originalAuthorFreeze.path,
  'bd1eb39669e8bf991c7eb0f0bef81c617ea290a1c04094f314170ac88ae28271',
);
bind(
  freeze.originalIndependentReport.preservedCopy.path,
  originalReportBinding.sha256,
);
const oldPage = originalReport.pages.find((page) => page.physicalPage === 146);
const before = {
  pageMd: bind(oldPage.pageMd.path, oldPage.pageMd.sha256),
  pageJson: bind(oldPage.pageJson.path, oldPage.pageJson.sha256),
};
const after = {
  pageMd: bind(freeze.page.files['page.md'].path, freeze.page.files['page.md'].sha256),
  pageJson: bind(freeze.page.files['page.json'].path, freeze.page.files['page.json'].sha256),
  audit: bind(freeze.page.files['audit.json'].path, freeze.page.files['audit.json'].sha256),
};
const beforeJson = read(before.pageJson.path);
const afterJson = read(after.pageJson.path);
assert.deepEqual(freeze.authorizedPhysicalPages, [146]);
assert.equal(beforeJson.blocks.length, 9);
assert.equal(afterJson.blocks.length, 9);
const typographyChange = freeze.changes.find((change) => change.finding === 'SOURCE-01');
const numeralChange = freeze.changes.find((change) => change.finding === 'SOURCE-02');
const expectedJson = structuredClone(beforeJson);
expectedJson.meta.notes[1] = numeralChange.associatedExistingNote.after;
expectedJson.meta.notes.push(typographyChange.after);
expectedJson.blocks[5].lines[0] = numeralChange.after;
assert.deepEqual(afterJson, expectedJson);
assert.deepEqual(beforeJson.blocks[2], afterJson.blocks[2]);
assert.equal(typographyChange.totalUnderdots, 4);
assert.deepEqual(typographyChange.affectedPrintedRows, [1, 2]);
assert.equal(typographyChange.dotsPerCharacter, 1);
assert.equal(afterJson.meta.notes[5], typographyChange.after);
assert.equal(numeralChange.exactAfterGlyph.codepoint, 'U+4E8C');
assert.equal(
  afterJson.blocks[5].lines[0],
  beforeJson.blocks[5].lines[0].replace('\u539f\u6765\u76842\u500d\u65f6', '\u539f\u6765\u7684\u4e8c\u500d\u65f6'),
);

function splitMd(file) {
  const text = fs.readFileSync(file, 'utf8');
  assert.equal(text.slice(0, 4), '---\n');
  const end = text.indexOf('\n---', 4);
  assert.ok(end > 4);
  return {
    frontmatter: JSON.parse(text.slice(4, end)),
    body: text.slice(end + 4),
  };
}
const beforeMd = splitMd(before.pageMd.path);
const afterMd = splitMd(after.pageMd.path);
const oldWord = '\u539f\u6765\u76842\u500d\u65f6';
const newWord = '\u539f\u6765\u7684\u4e8c\u500d\u65f6';
assert.equal(beforeMd.body.split(oldWord).length - 1, 1);
assert.equal(afterMd.body, beforeMd.body.replace(oldWord, newWord));
const expectedFrontmatter = structuredClone(beforeMd.frontmatter);
expectedFrontmatter.notes[1] = numeralChange.associatedExistingNote.after;
expectedFrontmatter.notes.push(typographyChange.after);
assert.deepEqual(afterMd.frontmatter, expectedFrontmatter);
assert.deepEqual(afterMd.frontmatter.notes, afterJson.meta.notes);
assert.equal(afterJson.meta.printed_lines, 26);

const inheritedImageBindings = {
  sourcePage: bind(oldPage.sourcePixels.path, oldPage.sourcePixels.sha256),
  exactSourceCrop: bind(
    originalReport.sourceFindings.find((finding) => finding.id === 'SOURCE-02').sourceCrop.path,
    '84117b842771cb33d7c81ff901b74d55efeb7a4f9e2778a8de5aadd3978c6f85',
  ),
  repairedWorkPagePixels: bind(
    freeze.page.workFiles.find((record) => record.path.endsWith('/page.png')).path,
    oldPage.sourcePixels.sha256,
  ),
  imageAccess: 'Binary SHA-256 verification only; no decode, view, crop, render, or reopen',
};
const retainedRawHolds = originalReport.rawHolds.map((hold) => {
  const raw = originalReport.rawJudgments.find((judgment) => judgment.id === hold.figure);
  return {
    ...hold,
    originalJudgmentUnchanged: true,
    newRawReviewPerformed: false,
    hashOnlyBindings: {
      sourceCrop: bind(raw.sourceCrop.path, raw.sourceCrop.sha256),
      nativeSvg: bind(raw.nativeSvg.path, raw.nativeSvg.sha256),
      existingSvgRaster: bind(raw.svgRaster.path, raw.svgRaster.sha256),
    },
  };
});
assert.deepEqual(retainedRawHolds.map((hold) => hold.figure),
  ['fig-105', 'fig-108', 'tbl-p0146-01']);
const repairedPortraitBindings = freeze.page.workFiles
  .filter((record) => /tbl-p0146-01\.(png|svg)$/.test(record.path))
  .map((record) => bind(record.path, record.sha256));
const oldPortrait = retainedRawHolds[2].hashOnlyBindings;
assert.deepEqual(
  repairedPortraitBindings.map((record) => record.sha256).sort(),
  [oldPortrait.sourceCrop.sha256, oldPortrait.nativeSvg.sha256].sort(),
);
const receiptBinding = bind(freeze.nativeReceipt.path, freeze.nativeReceipt.sha256);
const nativeReceipt = read(receiptBinding.path);
assert.equal(nativeReceipt.exitCode, 0);
assert.equal(nativeReceipt.nativeInvocationCount, 1);
const audit = read(after.audit.path);
assert.equal(audit.lines_printed, 26);
assert.equal(audit.lines_md, 26);
assert.deepEqual(audit.errors, []);
const receiptLogs = {
  stdout: bind(freeze.nativeReceipt.stdout.path, freeze.nativeReceipt.stdout.sha256),
  stderr: bind(freeze.nativeReceipt.stderr.path, freeze.nativeReceipt.stderr.sha256),
};
const beforeManifest = bind(freeze.beforeBindings.path, freeze.beforeBindings.sha256);
const afterManifest = bind(freeze.afterBindings.path, freeze.afterBindings.sha256);
const priorReviewByteBindings = bind(
  originalReport.byteBindings.path, originalReport.byteBindings.sha256,
);
const precedingN52Report = bind(
  `${tmp}/d059-n52-text-review/report.json`,
  'f3a6e63370917eb1c88a84b86f315f8bba55bcf7542753409929be113d896933',
);
bind(fileURLToPath(import.meta.url));
for (const record of files.values()) {
  assert.equal(hash(fs.readFileSync(record.path)), record.sha256, record.path);
}
const report = {
  schema: 'STEMROBIN-181/independent-affected-source-text-review@1',
  ticket: 'STEMROBIN-181', book: '10p',
  physicalPage: 146, printedPage: 136,
  reviewedAt: new Date().toISOString(),
  status: 'PASS',
  SOURCE: 'PASS',
  SOURCEscope: 'Only the two affected findings SOURCE-01 and SOURCE-02 on the exact new frozen page.md/page.json; untouched source judgments are inherited, not replayed.',
  RAW: 'HOLD',
  effectiveGate: 'HOLD-whole-n54-not-approved',
  FINDINGS: [
    {
      id: 'SOURCE-01', sourceRef: 'p0146#3',
      originalStatus: 'FAIL', affectedStatus: 'PASS',
      status: 'PASS', originalReportPointer: '/sourceFindings/0',
      affectedPointers: ['/meta/notes/5', '/blocks/2'],
      actualNewDeclaration: afterJson.meta.notes[5],
      reusedActualPixelObservation: {
        originalImageSequence: 3,
        observation: 'The previously inspected original page has emphasis dots under both characters of the first ordinal label on printed row1 and both characters of the second label on row2: four underdots, not bold type.',
        sourceBinding: inheritedImageBindings.sourcePage,
        reopened: false,
      },
      judgment: 'PASS for explicit retention of original typography in the existing notes carrier. The original finding objected to both missing emphasis markup and absence of an explicit retained typography declaration. The new declaration precisely identifies the block, both rows, both two-character labels, per-character lower-dot position, total four dots, and non-bold identity. It therefore satisfies that finding without changing the prose or pretending the dots have been rendered.',
      bothMdAndJsonNotesAgree: true,
      affectedBlockBodyIdentical: true,
      renderedUnderdotsApproved: false,
      rendererOrAppSupportVerified: false,
      visibleTypographyGate: 'NOT_REVIEWED-NOT_APPROVED',
      noExtraPrintedRows: true,
    },
    {
      id: 'SOURCE-02', sourceRef: 'p0146#6',
      originalStatus: 'FAIL', affectedStatus: 'PASS',
      status: 'PASS', originalReportPointer: '/sourceFindings/1',
      affectedPointers: ['/blocks/5/lines/0', '/meta/notes/1'],
      actualBeforeRow: beforeJson.blocks[5].lines[0],
      actualAfterRow: afterJson.blocks[5].lines[0],
      oldCodepoint: 'U+0032', restoredSourceCodepoint: 'U+4E8C',
      associatedNote: afterJson.meta.notes[1],
      reusedActualPixelObservation: {
        originalImageSequences: [3, 9],
        observation: 'The already inspected exact source crop shows the two horizontal strokes of the Chinese numeral, not the Arabic digit2.',
        sourceBinding: inheritedImageBindings.exactSourceCrop,
        reopened: false,
      },
      judgment: 'PASS: the only body substitution restores the exact observed Chinese source numeral in the same original printed row. The corresponding existing note is updated to match. This is source-character restoration, not an inference from the physical fourth-power relationship. All other characters, math, bold markup and continuation flags are unchanged.',
      physicalArgumentUsedToGuessCharacter: false,
      bodyGlyphChanges: 1,
    },
  ],
  unresolvedAffectedSourceFindings: [],
  repairFreeze: freezeBinding,
  originalHistory: {
    independentReport: originalReportBinding,
    originalSOURCE: 'FAIL', originalRAW: 'HOLD',
    originalSourceFindings: originalReport.sourceFindings,
    originalAuthorFreeze,
    priorReviewByteBindings,
    retainedExactBytes: true,
    oldFindingsRewrittenOrDeleted: false,
    supersedesOriginalReportBytes: false,
    additiveDispositionOnly: true,
  },
  exactBeforeBindings: before,
  exactNewFrozenBindings: after,
  authorBeforeAndAfterManifests: { before: beforeManifest, after: afterManifest },
  inheritedImageBindings,
  changeScopeVerified: {
    jsonExactlyEqualsBeforePlusTwoNotesAndOneBodyCharacter: true,
    mdBodyExactlyEqualsBeforePlusOneBodyCharacter: true,
    mdFrontmatterExactlyEqualsBeforePlusCorrespondingNoteAndTypographyNote: true,
    dotLabelBodyUnchanged: true,
    totalBlockCount: 9,
    unaffectedBlocksComparedMechanicallyOnly: true,
    noFullPageSourceReadingOrScientificReview: true,
    printedLineCountUnchanged: 26,
    repairedPortraitBindings,
    imageEvidenceBytesUnchangedByHashOnly: true,
  },
  existingNativeReceipt: {
    binding: receiptBinding, logs: receiptLogs,
    stage: 'finalize', authorInvocations: 1, authorFailures: 0,
    linesPrinted: 26, linesTranscribed: 26, status: 'PASS-reused',
    reviewInvocations: 0,
    notBasisOfIndependentSourceJudgment: true,
  },
  retainedRawHolds,
  objectLimits: {
    n54OverallApproved: false,
    wholeCardApproved: false,
    originalClosedN54RangeReusedOnly: 'p0144#1 through p0147#2',
    noBoundaryReReview: true,
    originalN55IncompleteDispositionNotChanged: true,
    earlier132To143AndFig104HoldsNotChanged: true,
    sourceDotDeclarationDoesNotEstablishVisibleRenderingSupport: true,
    noPublicationCanonicalIndexMeterOrDatabasePromotion: true,
  },
  independence: {
    authoredOriginalSourceOrRepair: false,
    originalReviewerObservationsReused: true,
    authorPassAcceptedAsIndependentEvidence: false,
    authorFilesModified: false,
    newAgentsOrBranches: 0,
  },
  precedingN52Report: {
    ...precedingN52Report,
    completedBeforeThisAffectedReview: true,
    retainedUnchangedForParentConsumption: true,
    replayed: false,
  },
  imageBudget: {
    priorCumulative: 16, newOpens: 0, opens: [],
    cumulative: 16, maximum: 24, remaining: 8,
    originalSourcePageOrCropReopened: false,
    rawReReviewOrRender: false,
    noCounterReset: true,
    repairAuthorCounterNotSubstitutedForIndependentReviewerCounter: true,
  },
  scopeRestrictions: {
    originalOrNewSourceEdits: 0,
    nativeToolEditsOrInvocations: 0,
    imageOrSvgEdits: 0, newRenders: 0,
    scientificReReviews: 0, databaseOrBackendCalls: 0,
    canonicalIndexMeterAppDependenciesGitChanges: 0,
    oldReportsOverwritten: false,
    writesOnlyUnderOwnedAffectedReviewDirectory: true,
  },
  filesVerifiedBeforeFreeze: files.size,
  fileBindings: [...files.values()],
};
fs.writeFileSync(target, `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' });
const bytes = fs.readFileSync(target);
console.log(JSON.stringify({
  path: target, sha256: hash(bytes), bytes: bytes.length,
  affectedSOURCE: 'PASS', findingStatuses: report.FINDINGS.map((finding) => ({
    id: finding.id, original: finding.originalStatus, affected: finding.status,
  })),
  RAW: 'HOLD', n54Approved: false,
  newImageOpens: 0, cumulativeImages: 16,
  filesVerified: files.size,
}, null, 2));
