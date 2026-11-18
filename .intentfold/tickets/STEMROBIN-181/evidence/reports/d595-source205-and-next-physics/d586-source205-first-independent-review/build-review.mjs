import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const own = path.dirname(new URL(import.meta.url).pathname);
const author = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d579-source205-first-author');
const hash = b => crypto.createHash('sha256').update(b).digest('hex');
const pin = p => ({path: p, sha256: hash(fs.readFileSync(p))});
const json = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const inventoryPath = path.join(own, 'source-inventory.json');
assert.equal(hash(fs.readFileSync(inventoryPath)),
  '427ecc435db63a6b3ac6532e9fd0dd4a29cf7809c46668f3af8380e250399045');
assert.equal(fs.statSync(inventoryPath).mode & 0o777, 0o444);
const inv = json(inventoryPath);
const qualificationPath = path.join(own, 'inventory-qualification.json');
const qualification = json(qualificationPath);
const verificationPath = path.join(own, 'author-hash-verification.json');
assert.equal(hash(fs.readFileSync(verificationPath)),
  '7011cc013062a6a29af1faf063d3d01d57170ca4ead11a183bdf35840ca11e72');
const verified = json(verificationPath);
assert.equal(verified.all_pass, true);
const authorFreezePath = path.join(author, 'author-freeze.json');
const authorReportPath = path.join(author, 'report.json');
const preFreezePath = path.join(author, 'pre-native-freeze.json');
const preFreeze = json(preFreezePath);
assert.equal(preFreeze.schema, 's10y/pre-native-source-freeze@1');
assert.equal(preFreeze.beforeNative, true);
assert.ok(Array.isArray(preFreeze.files));

// This schema uses absolute path/hash/mode entries; the working page hash is historical.
const preNativePins = preFreeze.files.map(entry => {
  assert.ok(path.isAbsolute(entry.path) && entry.path.startsWith(author + path.sep));
  assert.match(entry.sha256, /^[0-9a-f]{64}$/);
  assert.equal(entry.mode, '0444');
  const finalPin = verified.pins.find(p => p.path === entry.path);
  assert.ok(finalPin);
  assert.equal(finalPin.actual_sha256, entry.sha256);
  assert.equal(finalPin.mode_match, true);
  return {...entry, verified_against_hash_receipt: true};
});
assert.equal(preFreeze.nativeWorkingPageSha256,
  '75a267a887fb0f9e4d9db496a4932d5e3c9a34204a0134e0aac28fe17397ce04');
const pageDir = path.join(author, 'source/10p/pages/0205');
const pageJsonPath = path.join(pageDir, 'page.json');
const pageMdPath = path.join(pageDir, 'page.md');
const auditPath = path.join(pageDir, 'audit.json');
const page = json(pageJsonPath);
const audit = json(auditPath);
assert.equal(page.meta.render.sha256, inv.source.sha256);
assert.equal(page.meta.page, 205);
assert.equal(page.meta.printed_page, 195);
assert.deepEqual(page.meta.figures, []);
assert.deepEqual(audit.figures, []);

function parsePageMd(p) {
  const lines = fs.readFileSync(p, 'utf8').split('\n');
  assert.equal(lines[0], '---');
  const end = lines.indexOf('---', 1);
  assert.ok(end > 1);
  const meta = JSON.parse(lines.slice(1, end).join('\n'));
  const blocks = [];
  for (const line of lines.slice(end + 1)) {
    if (!line.trim()) continue;
    const marker = /^<!-- (p|foot)( open)? -->$/.exec(line);
    if (marker) {
      blocks.push({kind: marker[1], open: Boolean(marker[2]), lines: []});
    } else {
      assert.ok(blocks.length, 'Unexpected text before typed block.');
      assert.ok(!line.startsWith('<!--'), 'Unrecognized block marker.');
      blocks.at(-1).lines.push(line);
    }
  }
  return {meta, blocks};
}
const nativeMd = parsePageMd(pageMdPath);
const authorFirstPath = path.join(author, 'author-first/page.md');
const authorFirst = parsePageMd(authorFirstPath);
assert.equal(hash(fs.readFileSync(authorFirstPath)), preFreeze.nativeWorkingPageSha256);
assert.deepEqual(nativeMd.blocks, authorFirst.blocks);
assert.deepEqual(nativeMd.meta, page.meta);
assert.equal(page.blocks.length, 7);
page.blocks.forEach((b, i) => {
  assert.equal(b.kind, nativeMd.blocks[i].kind);
  assert.equal(b.open, nativeMd.blocks[i].open);
  assert.deepEqual(b.lines, nativeMd.blocks[i].lines);
  assert.equal(b.cont, false);
  assert.equal(b.samerow, false);
});

const groupKeys = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'FOOTER'];
const visualText = s => s.replaceAll('。', '.').replace(/\s+/gu, '');
const math = s => [...s.matchAll(/\$([^$]+)\$/g)].map(m => m[1]);
const bold = s => [...s.matchAll(/\*\*([^*]+)\*\*/g)].map(m => visualText(m[1]));
const rowEvidence = inv.rows.map(row => {
  const bi = groupKeys.indexOf(row.paragraph);
  assert.ok(bi >= 0);
  const sourceGroupRows = inv.rows.filter(r => r.paragraph === row.paragraph);
  const li = sourceGroupRows.findIndex(r => r.row === row.row);
  const actual = page.blocks[bi].lines[li];
  assert.equal(typeof actual, 'string');
  let expected = row.text;
  if (row.row === 10) expected = qualification.qualification.effectivePixelText;
  if (row.kind === 'footer') expected = '• 195 •';
  const textMatch = visualText(expected) === visualText(actual);
  const mathMatch = JSON.stringify(math(expected)) === JSON.stringify(math(actual));
  const emphasisMatch = JSON.stringify(bold(expected)) === JSON.stringify(bold(actual));
  assert.ok(textMatch && mathMatch && emphasisMatch, 'Source mismatch at row ' + row.row);
  return {
    physicalRow: row.row, paragraphIdentity: row.paragraph, kind: row.kind,
    nativeRef: 'p0205#' + (bi + 1),
    blockPointer: '/blocks/' + bi,
    linePointer: '/blocks/' + bi + '/lines/' + li,
    sourcePixelBandApprox: row.y_band_approx,
    frozenInventoryReading: row.text,
    effectivePixelReading: expected,
    nativeMdPhysicalRow: actual,
    nativeJsonPhysicalRow: actual,
    firstAuthorPhysicalRowUnchanged: authorFirst.blocks[bi].lines[li] === actual,
    literalMathExpected: math(expected), literalMathActual: math(actual),
    boldExpected: bold(expected), boldActual: bold(actual),
    textMatchWithDeclaredTypographyOnly: textMatch,
    literalMathMatch: mathMatch, emphasisMatch, status: 'PASS',
    qualification: row.row === 10 ? 'See separately pinned inventory-qualification.json; initial Unicode punctuation label is transparently qualified, sealed inventory unchanged.' :
      row.kind === 'footer' ? 'Numeral and both observed ornaments retained.' :
      expected.includes('。') ? 'Observed old-style solid-dot period is ASCII dot in author text.' : null,
  };
});
const boundaryEvidence = groupKeys.map((identity, i) => {
  const expectedRows = inv.rows.filter(r => r.paragraph === identity).map(r => r.row);
  const actual = page.blocks[i];
  assert.equal(actual.lines.length, expectedRows.length);
  assert.equal(actual.kind, identity === 'FOOTER' ? 'foot' : 'p');
  assert.equal(actual.open, identity === 'P6');
  return {
    paragraphIdentity: identity, nativeRef: 'p0205#' + (i + 1),
    pointer: '/blocks/' + i, sourcePhysicalRows: expectedRows,
    kind: actual.kind, cont: actual.cont, open: actual.open, samerow: actual.samerow,
    pixelEvidence: inv.local_boundaries.find(x => x.at_row === expectedRows[0]).fact,
    localStatus: 'PASS',
    crossPageQualification: identity === 'P1' ?
      'Only current-page indentation/new-paragraph boundary is certified. SOURCE204 open flag remains HOLD and untouched.' :
      identity === 'P6' ? 'Visible incomplete tail supports leaving object open; actual next-page continuation and n77 closure are not certified.' : null,
  };
});
assert.equal(rowEvidence.length, inv.expected_lines_from_pixels.total_physical_rows);
assert.equal(audit.lines_printed, inv.expected_lines_from_pixels.total_physical_rows);
assert.equal(audit.lines_md, inv.expected_lines_from_pixels.total_physical_rows);
assert.deepEqual(audit.errors, []);
const finalizePath = path.join(author, 'native/finalize-first.status.json');
const finalize = json(finalizePath);
assert.equal(finalize.status, 'PASS');
assert.equal(finalize.exitCode, 0);
assert.equal(finalize.invocations, 1);
const setupPath = path.join(author, 'setup/init-first.status.json');
assert.equal(json(setupPath).status, 'FAIL');
const holdPath = path.join(author, 'HOLD.json');
assert.equal(json(holdPath).status, 'HOLD');
const opens = [...inv.image_open_log, qualification.imageOpen];
assert.equal(opens.length, 5);
assert.ok(opens.length <= 8 && opens.length <= 24);
const joinBlocker = {
  id: 'SOURCE204_OPEN_VS_SOURCE205_INDENTED_PARAGRAPH',
  gate: 'SOURCE204205_JOIN', status: 'HOLD', blocksSource205LocalPass: false,
  blocksCrosspageAssemblyOrObjectClosure: true,
  incomingNativeRef: 'p0204#3', incomingPointer: '/blocks/2', incomingOpen: true,
  outgoingCurrentPageRef: 'p0205#1', currentPagePointer: '/blocks/0',
  currentPageCont: false, currentPageOpen: false,
  reason: 'Supplied SOURCE204 final relation and current-page indentation establish an explanatory paragraph transition but do not independently adjudicate the original SOURCE204 open flag. No SOURCE204 pixels reread, no flag edit, and no crosspage continuity signature.',
};
const sourceQualification = 'PASS for SOURCE205 physical rows, mathematics, emphasis, footer and source-local paragraphs only; excludes SOURCE204205 crosspage join, next-page continuation, n77 completion and figure visual review. One frozen inventory punctuation label is transparently qualified by a fifth original-pixel native crop; row counts and mathematics were frozen before author access.';
const report = {
  schema: 's10y/first-independent-source-review@1',
  ticket: 'STEMROBIN-181', reviewer: 'd586',
  role: 'fresh-one-off-FIRST-independent-SOURCE205-reviewer',
  permanentOrReplacementAD: false, book: '10p', sourcePage: 205, printedPage: 195,
  status: 'SOURCE-PASS-CROSSPAGE-JOIN-HOLD',
  ownershipRoot: own, sharedCheckout: root,
  branch: 'User-supplied shared original181 branch; no Git command or branch mutation.',
  sourceInventory: {...pin(inventoryPath), mode: '0444'},
  source: inv.source,
  inventoryQualification: pin(qualificationPath),
  firstReaderOrdering: {
    sourceFirstImage: true, initialImageOpens: 0,
    inventorySealedAt: '2026-11-18T11:59:38.274Z', inventorySealedMode: '0444',
    inventoryHashReceiptBeforeAuthorAccess: true,
    authorProseReportREADYAuditLayoutTemplateTOCReadBeforeSeal: false,
    authorFreezeSchemaInspectedBeforeResolvingManifestPaths: true,
    allAuthorManifestPinsVerifiedBeforeReportOrNativeProseReads: true,
    preNativeSchemaInspectedBeforeResolvingItsEntries: true,
    postSealSourceDetail: 'Only fifth crop qualifies row10 punctuation after native comparison; sealed inventory unchanged. This is explicitly post-author-access, not misrepresented as a pre-seal open.',
    expectedRowsDerivedFromPixelsNotCounters: true,
  },
  skillsAndInstructionsRead: [
    path.join(root, '.intentfold/readme.md'),
    path.join(root, '.intentfold/project.json'),
    path.join(root, '.intentfold/charter/product.md'),
    path.join(root, '.intentfold/charter/engineering.md'),
    path.join(root, '.intentfold/charter/operations.md'),
    '/Users/yong/.agents/skills/intentfold/SKILL.md',
    path.join(root, '.claude/skills/ld-s10y-lesson/SKILL.md'),
    path.join(root, '.agents/skills/ld-s10y-image/SKILL.md'),
  ],
  gates: {
    SOURCE205: {status: 'PASS', qualification: sourceQualification, blocking_list: []},
    SOURCE205_LOCAL_BOUNDARIES: {
      status: 'PASS',
      qualification: 'Certifies six current-page paragraph identities, run-in heading on row14, four emphasis spans, display formula within P5, footer and incomplete P6 tail only. SOURCE205 first indentation is certified without changing or adjudicating SOURCE204 metadata.',
      blocking_list: [],
    },
    SOURCE204205_JOIN: {
      status: 'HOLD',
      qualification: 'SOURCE204 accepted heading/rows from d575 are retained as supplied text-only accepted context, not re-reviewed. Incoming p0204#3 open=true remains unresolved against the observed current-page new paragraph. SOURCE205 can PASS independently.',
      blocking_list: [joinBlocker],
    },
  },
  blocking_list: [joinBlocker],
  independentPixelExpectedLines: inv.expected_lines_from_pixels,
  nativeCountComparison: {
    expectedBeforeAuthorAccess: 22, nativeAuditPrinted: audit.lines_printed,
    nativeAuditMarkdown: audit.lines_md, actualJsonPhysicalRows: rowEvidence.length,
    matchesIndependentExpectation: true, nativeCounterUsedAsSourceTruth: false,
  },
  lineByLineEvidence: rowEvidence,
  localBoundaryEvidence: boundaryEvidence,
  emphasis: {
    row1: '薄透镜公式', row14: '透镜的放大率', row15: '放大率',
    row16: '像的线度与物体线度之比叫做线放大率.',
    fullDefinitionBold: true, otherRowsNoAdditionalSemanticBold: true,
  },
  literalMathChecks: {
    absoluteBars: 'Rows4,6,7,9 preserve |F|, |f| and |d|.',
    negativeSign: 'Row6 has ASCII - before 1/|F|; row5 F<0.',
    bareSignedUnknownTerms: 'Row10 1/F, 1/f, 1/d have no absolute bars in the pixels.',
    subscriptAndCase: 'Rows18,21 A_1B_1; uppercase H/lowercase h; uppercase F distinct from lowercase f.',
    magnification: 'Row19 Gamma=H/h, exactly one physical fraction row, no printed equation number.',
    triangles: 'Row21 triangle OAB and triangle OA_1B_1, not invented equality/formula.',
    allLiteralMathStringsMatch: true,
  },
  initialText: page.blocks[0].lines[0],
  outgoingTail: {
    observed: inv.outgoing_tail_latex, nativeRef: 'p0205#6', pointer: '/blocks/5',
    terminalPunctuation: false, derivedFormulaOnThisPage: false,
    currentOpenFlag: true, nextPageRead: false,
    actualNextPageContinuationCertified: false, n77Closed: false, n77Complete: false,
  },
  figures: {
    actualSourceLocalFigures: [], figureBoxes: [], captions: [], tables: [],
    textualReferenceOnly: {label: '图 179', physicalRow: 17, nativeRef: 'p0205#5', pointer: '/blocks/4/lines/0'},
    RAW: {status: 'NOT-APPLICABLE', qualification: 'No source-local figure; zero crop reviews, no visual PASS.'},
    SVG: {status: 'NOT-APPLICABLE', qualification: 'No source-local figure; zero SVG reviews, no visual PASS.'},
    figureVisualPASS: false,
  },
  authorHashVerification: pin(verificationPath),
  authorFreeze: pin(authorFreezePath), authorReport: pin(authorReportPath),
  preNativeFreeze: {...pin(preFreezePath), schema: preFreeze.schema, entries: preNativePins,
    historicalWorkingPage: {
      path: preFreeze.nativeWorkingPagePath, preNativeSha256: preFreeze.nativeWorkingPageSha256,
      frozenOriginal: pin(authorFirstPath),
      postNativeSha256: pin(pageMdPath).sha256,
      bodyRowsAndFlagsUnchanged: true,
      qualification: 'Historical 0644 working-page hash is not incorrectly asserted to be the current normalized 0444 hash. Pre-native original remains pinned separately.',
    },
  },
  faithfulArtifacts: {pageMd: pin(pageMdPath), pageJson: pin(pageJsonPath), audit: pin(auditPath)},
  native: {
    existingFinalize: pin(finalizePath), existingStatus: 'PASS', exitCode: 0,
    authorInvocationCount: 1, reviewerFinalizeInvocations: 0,
    reviewerVectorizeInvocations: 0, reviewerAssembleInvocations: 0,
    reviewerRenderInvocations: 0, passedNativeNotReplayed: true,
    auditReadOnly: true, markdownJsonFirstAuthorRowsAndFlagsAgree: true,
  },
  preservedPriorStates: {
    setupFAIL: {...pin(setupPath), status: 'FAIL', unchanged: true},
    authorBoundaryHOLD: {...pin(holdPath), status: 'HOLD', unchanged: true},
    d575SOURCE204AcceptedHeadingAndRows: 'User-supplied independently accepted context; retained without image rereview.',
    d575OriginalSOURCE203PendingNote: 'Original historical note retained, never edited or reset.',
    actualSOURCE203PASSConsumedByD580: 'User-supplied accepted context, not guessed or re-reviewed.',
    authorSOURCE204PendingMetadata: 'Frozen historical author metadata retained; not used to revoke supplied accepted SOURCE204 status.',
    allOtherOldFAILHOLD: 'Untouched; no replacement, reset, supersession or hidden repair.',
  },
  imageBudget: {
    initialContextCount: 0, actualOpens: opens.length, batchCount: 1,
    currentBatchCount: opens.length, currentContextCount: opens.length,
    batchLimit: 8, contextLimit: 24, opens,
    fullOriginalOpens: 1, nativeUnscaledCropOpens: 4,
    samePathReopens: 0, cropLoadsCountedInclusively: true,
    source204ImageOpens: 0, nextPageImageOpens: 0,
    nativeRAWOrSVGImageOpens: 0, authorImagePayloadsOpened: 0,
    parentBefore: 24, parentAfter: 24, oldReviewersBefore: '24/24', oldReviewersAfter: '24/24',
    oldCountersReset: false, parentImagePayloadsReturned: 0, textPathsHashesOnly: true,
  },
  prohibitedOperations: {
    writesOutsideOwnership: 0, authorRepairs: 0, gitOperations: 0,
    databaseOperations: 0, deployments: 0, canonicalEdits: 0,
    finalize: 0, vectorize: 0, assemble: 0, renders: 0,
    SOURCE204FlagEdits: 0, n77Closure: 0,
  },
  finalDisposition: 'Bounded one-off batch complete. SOURCE205 and local boundaries PASS, SOURCE204205 join HOLD, RAW/SVG NOT-APPLICABLE. No further images or native commands.',
  fileModeAtFinalFreeze: '0444',
  selfHash: 'Pinned by review-freeze.json; review-freeze self hash returned externally.',
  generatedAt: new Date().toISOString(),
};
const output = path.join(own, 'report.json');
assert.equal(fs.existsSync(output), false);
fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n', {flag: 'wx'});
console.log(JSON.stringify({report: pin(output),
  gates: Object.fromEntries(Object.entries(report.gates).map(([k,v]) => [k,v.status])),
  rows: rowEvidence.length, actualImageOpens: opens.length}, null, 2));
