import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const root = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), root);
const T = '.intentfold/tickets/STEMROBIN-181';
const own = `${T}/tmp/d1816-d081-source316317-review`;
const native = `${T}/tmp/d1816-recovery/native`;
const authorPath = `${T}/tmp/d1816-d075-source316317-author/author-freeze.json`;
const authorSha = '96e30895027126b710376141abfb7fa37666054ff0c9f4cf78103ae7bbd603f5';
const inputs = new Map();
const absolute = p => path.resolve(root, p);
const read = p => fs.readFileSync(absolute(p));
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bind = (p, role, expected) => {
  const bytes = read(p);
  const actual = sha(bytes);
  if (expected) assert.equal(actual, expected, `Frozen input changed: ${p}`);
  const entry = inputs.get(absolute(p)) ?? {
    path: absolute(p), sha256: actual, bytes: bytes.length, roles: [],
  };
  assert.equal(entry.sha256, actual);
  if (!entry.roles.includes(role)) entry.roles.push(role);
  inputs.set(entry.path, entry);
  return { path: entry.path, sha256: actual, bytes: bytes.length };
};
const json = p => JSON.parse(read(p));
const text = p => read(p).toString('utf8');
const output = (name, object) => {
  const target = absolute(`${own}/${name}`);
  assert.equal(path.dirname(target), absolute(own));
  assert(!fs.existsSync(target), `Refuse to overwrite an existing review: ${target}`);
  fs.writeFileSync(target, `${JSON.stringify(object, null, 2)}\n`);
  return bind(target, 'review-output');
};

const authorBinding = bind(authorPath, 'author-freeze', authorSha);
const author = json(authorPath);
assert.deepEqual(author.records.map(r => r.page), [316, 317]);
const consumeFrozen = item => {
  if (Array.isArray(item)) return item.forEach(consumeFrozen);
  if (!item || typeof item !== 'object') return;
  if (item.path && item.sha256) bind(item.path, 'author-frozen-input', item.sha256);
  else Object.values(item).forEach(consumeFrozen);
};
consumeFrozen(author);

const sources = author.records.map(r => json(r.pageJson.path));
const mds = author.records.map(r => text(r.pageMd.path).split('\n'));
const beforeRoot = `${T}/tmp/d1816-d075-source316-before`;
const before = json(`${beforeRoot}/page.json`);
const beforeAudit = json(`${beforeRoot}/audit.json`);
const currentAudit = json(author.records[0].audit.path);
assert.deepEqual(before.blocks, sources[0].blocks);
assert.deepEqual(before.meta.figures, sources[0].meta.figures);
assert.deepEqual(before.meta.render, sources[0].meta.render);
assert.deepEqual(beforeAudit.figures, currentAudit.figures);
const withoutCounting = structuredClone(sources[0].meta);
delete withoutCounting.counting;
assert.deepEqual(before.meta, withoutCounting);
assert.equal(text(`${beforeRoot}/page.md`).split('\n---\n')[1],
  text(author.records[0].pageMd.path).split('\n---\n')[1]);
assert.equal(beforeAudit.lines_printed, 25);
assert.equal(beforeAudit.lines_md, 24);
assert.equal(currentAudit.lines_printed, 24);
assert.equal(currentAudit.lines_md, 24);
assert.equal(sources[0].meta.counting.edge_margin_px, 80);

const authorityPaths = [
  '.intentfold/readme.md',
  '.intentfold/project.json',
  '.intentfold/charter/product.md',
  '.intentfold/charter/engineering.md',
  '.intentfold/charter/ui.md',
  '.intentfold/charter/operations.md',
  '.claude/skills/ld-s10y-lesson/SKILL.md',
  '.agents/skills/ld-s10y-image/SKILL.md',
  '.claude/skills/ld-s10y-lesson/references/production-resume.md',
  '/Users/yong/.agents/skills/intentfold/SKILL.md',
  '/Users/yong/.agents/skills/intentfold/references/common/grill.md',
  '/Users/yong/.agents/skills/n-grill/SKILL.md',
  `${native}/d061-live181-read/stdout.txt`,
  `${native}/d061-live179-comments-read/stdout.txt`,
];
const authority = authorityPaths.map(p => bind(p, 'existing-authority-read'));
const live181 = json(`${native}/d061-live181-read/stdout.txt`);
assert.equal(live181.sequence_id, 181);
assert(live181.description_stripped.includes('Grill: self'));
const comment = json(`${native}/d061-live179-comments-read/stdout.txt`).results
  .find(r => r.id === '830251c5-4c6f-48af-9bae-6e3a22118c80');
assert(comment);
assert(comment.comment_stripped.includes('181-6 / STEMROBIN-181'));

const nativeNames = [
  'd075-source316-first-finalize',
  'd075-source316-counting-diagnosis',
  'd075-source316-counting-only-repair',
  'd075-source317-first-finalize',
  'd075-source316-first-vectorize',
  'd075-source317-first-vectorize',
  'd075-raw291-svg-first-preview',
  'd075-raw292-svg-first-preview',
  'd075-raw293-svg-first-preview',
];
const nativeEvidence = nativeNames.map(name => {
  const receipt = bind(`${native}/${name}/receipt.json`, 'existing-native-receipt');
  const stdout = bind(`${native}/${name}/stdout.txt`, 'existing-native-stdout');
  const stderr = name === 'd075-source316-first-finalize'
    ? bind(`${native}/${name}/stderr.txt`, 'retained-first-failure-stderr') : null;
  return {
    name, receipt, stdout, ...(stderr ? { stderr } : {}),
    execution: json(receipt.path),
    observedStdout: text(stdout.path),
    rerunByD081: false,
  };
});

const plans = [
  [author.records[0].sourceImage, 'FULL-original-page', 316],
  [author.records[1].sourceImage, 'FULL-original-page', 317],
  [author.records[0].figures[0].rawPng, 'RAW-original-crop', 291],
  [author.records[1].figures[0].rawPng, 'RAW-original-crop', 292],
  [author.records[1].figures[1].rawPng, 'RAW-original-crop', 293],
  [author.records[0].figures[0].svgPreview, 'existing-native-SVG-preview', 291],
  [author.records[1].figures[0].svgPreview, 'existing-native-SVG-preview', 292],
  [author.records[1].figures[1].svgPreview, 'existing-native-SVG-preview', 293],
];
const ledgerRows = plans.map(([entry, kind, target], index) => {
  const binding = bind(entry.path, 'actually-opened-image', entry.sha256);
  const bytes = read(entry.path);
  assert.equal(bytes.subarray(1, 4).toString(), 'PNG');
  return {
    sequence: index + 1, target, kind, ...binding,
    width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20),
    actualOpen: true, tool: 'functions.view_image', fullResolutionOriginalFile: true,
    reopened: false,
  };
});
const imageLedger = output('image-ledger.json', {
  schema: 'STEMROBIN-181/independent-review-image-ledger@1',
  reviewer: 'D081',
  workdir: root,
  authorFreeze: authorBinding,
  plannedActualOpens: 8,
  actualImageOpens: 8,
  actualCurrentContextImageOpens: 8,
  perBatchLimit: 8,
  perContextLimit: 24,
  reopens: 0,
  images: ledgerRows,
  forbiddenImageOperationsPerformed: [],
  stoppedAfterSequence: 8,
  inheritedAuthorOpensNotResetOrClaimed: {
    authorActualImageOpens: author.actualImageOpens,
    authorReopens: author.reopens,
    authorSvgImageOpens: author.authorSvgImageOpens,
    authorRecordedParentContextOpens: author.parentActualContextImageOpens,
  },
  furtherImageOpenRequested: false,
});

const row = (sourceIndex, physicalRow, block, line, mdLine, note, segment) => {
  const source = sources[sourceIndex];
  const sourceText = source.blocks[block - 1].lines[line - 1];
  assert.equal(mds[sourceIndex][mdLine - 1], sourceText);
  const printedSegment = segment === undefined ? sourceText : sourceText.split('↵')[segment];
  return {
    physicalRow, blockRef: `p${String(source.meta.page).padStart(4, '0')}#${block}`,
    blockIndex1Based: block, jsonBlockIndex0Based: block - 1,
    jsonLineIndex0Based: line - 1,
    jsonPointer: `/blocks/${block - 1}/lines/${line - 1}`,
    mdLine, currentText: sourceText, printedSegment,
    ...(segment === undefined ? {} : { continuationSegment0Based: segment }),
    SOURCE: 'PASS', observation: note ?? 'Literal printed row, punctuation and symbols match.',
  };
};
const rows316 = [
  row(0, 1, 1, 1, 55, 'Incoming 电动势 joins the read-only315 tail 感生; low literal dot.'),
  row(0, 2, 1, 2, 56, 'First physical cosine-formula row ends after 90-degree minus sign.', 0),
  row(0, 3, 1, 2, 56, 'Second physical formula row begins alpha; BS sin alpha and vector-angle prose follow.', 1),
  row(0, 4, 1, 3, 57, 'Distinct vector B and surface normal vector n preserved.'),
  row(0, 5, 1, 4, 58, 'Figure291 reference and S/ABCD labels literal.'),
  row(0, 6, 1, 5, 59, 'Sixth wrap row; caption291 shares this physical row.'),
  row(0, 7, 4, 1, 68, 'First full-width continuation: t=0, AB/CD/BC and figure290 reference literal.'),
  row(0, 8, 4, 2, 69, 'Second full-width continuation, concluding colon literal.'),
  row(0, 9, 5, 1, 72, 'S=AB(BC-vt), negative vt and low dot literal.'),
  row(0, 10, 6, 1, 75, 'Delta S=-lv Delta t; negative area increment and explanation literal.'),
  row(0, 11, 6, 2, 76, 'Delta Phi=-Blv Delta t prefix; negative sign literal.'),
  row(0, 12, 6, 3, 77, 'sin alpha completes the flux expression; low dot and comma literal.'),
  row(0, 13, 7, 1, 80, 'emf=-Delta Phi/Delta t=Blv sin alpha; initial minus, positive final sign and comma literal. Fraction is one physical row.'),
  row(0, 14, 8, 1, 83, 'Printed formula12-6 reference, closing parenthesis and low dot literal.'),
  ...Array.from({ length: 6 }, (_, i) => row(0, 15 + i, 9, i + 1, 86 + i)),
  row(0, 21, 10, 1, 94, 'Heading129 自感 closes128 locally; not course-level approval.'),
  row(0, 22, 11, 1, 97, 'Alternating-current/flux-change statement and low dot literal.'),
  row(0, 23, 11, 2, 98, 'Outgoing 这种现象 remains open toward317 叫做自感.'),
  row(0, 24, 12, 1, 101, 'Printed footer307, two flanking dots and slanted/heavy digits match.'),
];
rows316[5].sharedPhysicalRow = [
  { ...row(0, 6, 3, 1, 65, 'Caption291 is same sixth physical wrap row.'),
    samerow: true, additionalPhysicalRows: 0 },
];
const rows317 = [
  row(1, 1, 1, 1, 60, 'Incoming 叫做自感 and double-role explanation; low dot, colon literal.'),
  row(1, 2, 1, 2, 61, 'Semicolon and low dot literal; bold begins exactly at 变化的磁场在通电导体本身.'),
  row(1, 3, 1, 3, 62, 'Bold continues exactly 上感生有电动势; final low dot remains outside bold.'),
  ...Array.from({ length: 3 }, (_, i) => row(1, 4 + i, 2, i + 1, 65 + i)),
  ...Array.from({ length: 5 }, (_, i) => row(1, 7 + i, 3, i + 1, 70 + i)),
  row(1, 12, 6, 1, 83, 'Caption292 and caption293 occupy one shared physical row.'),
  ...Array.from({ length: 6 }, (_, i) => row(1, 13 + i, 8, i + 1, 89 + i)),
  row(1, 19, 9, 1, 97, 'Figure294 is a textual reference to following page, not an invented current figure.'),
  row(1, 20, 9, 2, 98, 'Opening switch K, sustained original current, low dot and outgoing 结 literal.'),
  row(1, 21, 10, 1, 101, 'Printed footer308 and two flanking dots match.'),
];
rows317[11].sharedPhysicalRow = [
  { ...row(1, 12, 7, 1, 86, 'Caption293 shares caption292 physical row.'),
    samerow: true, additionalPhysicalRows: 0 },
];
const weightedRows = source => source.blocks.reduce((total, block) => {
  if (block.kind === 'fig') return total;
  const count = block.lines.reduce((n, line) => n + line.split('↵').length, 0);
  return total + count - (block.samerow ? (block.kind === 'cap' ? block.lines.length : 1) : 0);
}, 0);
assert.equal(weightedRows(sources[0]), 24);
assert.equal(weightedRows(sources[1]), 21);
for (const [index, rows] of [rows316, rows317].entries()) {
  assert.deepEqual(rows.map(r => r.physicalRow), Array.from({ length: rows.length }, (_, n) => n + 1));
  const covered = new Set();
  rows.forEach(r => [r, ...(r.sharedPhysicalRow ?? [])].forEach(x =>
    covered.add(`${x.jsonBlockIndex0Based}:${x.jsonLineIndex0Based}`)));
  sources[index].blocks.forEach((block, b) => block.lines.forEach((_, l) => {
    assert(covered.has(`${b}:${l}`), `Uncovered block line ${index}:${b}:${l}`);
  }));
}

const figureDetails = [
  {
    figure: 'fig-291', sourcePage: 316, blockIndex1Based: 2, jsonBlockIndex0Based: 1, mdLine: 61,
    cropBox: [911, 283, 397, 254],
    inventory: [
      'Horizontal B-to-C segment, labels B at left and C at right.',
      'Upward normal vector n, vector mark above n and upward arrowhead.',
      'Oblique vector B through the horizontal/normal intersection, extending to lower left and upper right; B vector mark and arrowhead.',
      'Complete 90-degree-minus-alpha arc between upward normal and oblique B; alpha arc between oblique B and right horizontal.',
      'Both angle labels, double arc strokes, horizontal and oblique extents retained.',
    ],
    rawObservation: 'Complete source diagram with existing12px padding; no figure caption or prose. Source speckles are not interpreted as extra labels or dashes.',
    svgObservation: 'Actual native preview matches full source and raw: B/C/n/B marks, arrowheads, full line extents and both angular relationships/arc strokes. No label, designed stroke or relationship lost. Minor tracing smoothing has no semantic effect.',
  },
  {
    figure: 'fig-292', sourcePage: 317, blockIndex1Based: 4, jsonBlockIndex0Based: 3, mdLine: 76,
    cropBox: [174, 1035, 453, 295],
    inventory: [
      'I vertical axis with upward arrow; t horizontal axis with rightward arrow.',
      'Printed oval origin O label to lower left; I above/left, t below/right.',
      'Solid current-versus-time curve starts at origin, rises steeply, becomes flatter and ends on the right near a plateau.',
      'No tick values, dashed asymptote or additional graph introduced.',
    ],
    rawObservation: 'Entire source axes, both arrowheads, origin, labels and rising/flattening curve retained with12px padding. No caption292 or surrounding prose.',
    svgObservation: 'Actual native preview matches full source and raw in curve origin, progression, terminal plateau, I/O/t glyphs and both axis arrowheads. Scan-sized irregularities smooth without adding ticks or dashed lines.',
  },
  {
    figure: 'fig-293', sourcePage: 317, blockIndex1Based: 5, jsonBlockIndex0Based: 4, mdLine: 79,
    cropBox: [793, 1025, 518, 317],
    inventory: [
      'Left/right vertical rails with filled junctions on the middle branch.',
      'Top branch contains rectangular resistor R in series with crossed-circle lamp1.',
      'Middle parallel branch contains four-hump coil with separate iron-core bar above it, in series with crossed-circle lamp2.',
      'R above resistor;1 at top lamp;2 at middle lamp; branch wires and rail endpoints retained.',
      'Bottom branch contains open switch with raised blade, left pivot and separate right contact.',
      'Two cells on bottom right, each short plate left and long plate right; no printed plus/minus labels.',
      'Original short broken/gapped inter-cell conductor strokes retained; no gap silently bridged or source ink erased.',
    ],
    rawObservation: 'Both complete branches, core/coil, resistor, both lamps, filled junctions, all source wire segments/gaps, open switch and both cells with rightward long-plate polarity retained.12px padding excludes both captions and prose.',
    svgObservation: 'Actual native preview preserves full-source/raw topology, four coil humps and core clearance, lamp crosses/numbers, R, both junctions, switch gap/blade/contacts, cell plate order and the same broken inter-cell source strokes. No circuit relationship replaced by a simplified modern schematic.',
  },
];
const figures = figureDetails.map(detail => {
  const record = author.records.find(r => r.page === detail.sourcePage);
  const frozen = record.figures.find(f => f.figure === detail.figure);
  assert.deepEqual(frozen.cropBox, detail.cropBox);
  assert.deepEqual(sources[detail.sourcePage === 316 ? 0 : 1].blocks[detail.jsonBlockIndex0Based].box, detail.cropBox);
  return {
    ...detail, SOURCE: 'PASS', RAW: 'PASS', SVG: 'PASS',
    rawPng: bind(frozen.rawPng.path, 'reviewed-RAW', frozen.rawPng.sha256),
    rawSvg: bind(frozen.rawSvg.path, 'reviewed-SVG-input', frozen.rawSvg.sha256),
    svgPreview: bind(frozen.svgPreview.path, 'reviewed-native-SVG-preview', frozen.svgPreview.sha256),
    sourceOnly: true, modernApproval: false, defects: [],
  };
});

const boundary315Path = 'ssot-resources/soviet10year-textbooks/artifacts/9p/pages/0315/page.md';
const boundary318Path = 'ssot-resources/soviet10year-textbooks/artifacts/9p/pages/0318/page.md';
const boundary315 = bind(boundary315Path, 'text-only-incoming-boundary315');
const boundary318 = bind(boundary318Path, 'text-only-outgoing-boundary318');
assert(text(boundary315Path).includes('另一方面，利用电磁感应定律(12-4)也可以计算出感生'));
assert(text(boundary318Path).includes('果，在打开电键的时刻，检流计有电'));
const grill = bind(`${own}/grill.md`, 'completed-scoped-Grill-self');
const builder = bind(`${own}/build-review.mjs`, 'reviewer-only-artifact-builder');
const report = output('report.json', {
  schema: 'STEMROBIN-181/independent-source-raw-svg-review@1',
  ticket: 'STEMROBIN-181', batch: 'D081', reviewer: 'D081',
  independent: true, firstIndependentReview: true, soleReviewer: true,
  status: 'PASS-parent-consumption-pending',
  workdir: root, writeOwnership: absolute(own),
  authorFreeze: authorBinding, imageLedger, grill,
  authorityReuse: {
    mode: 'existing-d061-receipts-no-freshness-or-live-ticket-calls',
    authority, comment179: comment.id, Finish: 'review', Grill: 'self',
  },
  records: author.records.map((record, i) => ({
    page: record.page, printedPage: record.printedPage, SOURCE: 'PASS',
    pageMd: bind(record.pageMd.path, 'current-reviewed-pageMd', record.pageMd.sha256),
    pageJson: bind(record.pageJson.path, 'current-reviewed-pageJson', record.pageJson.sha256),
    audit: bind(record.audit.path, 'existing-audit-not-source-approval', record.audit.sha256),
    sourceImage: bind(record.sourceImage.path, 'actual-full-source-image', record.sourceImage.sha256),
    allPrintedRowsReviewed: true, physicalRows: i === 0 ? 24 : 21,
    nativeCount: i === 0 ? { first: '25/24 FAIL retained', current: '24/24 PASS' } : { first: '21/21 PASS' },
    markdownJsonBodyExact: true,
    rowCoverage: i === 0 ? rows316 : rows317,
    figures: figures.filter(f => f.sourcePage === record.page),
    literalPunctuation: 'Low source paragraph full stops are ASCII dots, not modern Chinese full stops. Printed commas, semicolon/colon, parentheses and mathematical signs independently matched.',
    wholeCourseApproval: false, defects: [],
  })),
  countingRepair316: {
    verdict: 'PASS-counting-only-exclusion-justified',
    firstFailureRetained: true,
    first: { linesPrinted: beforeAudit.lines_printed, linesMd: beforeAudit.lines_md, errors: beforeAudit.errors },
    current: { linesPrinted: currentAudit.lines_printed, linesMd: currentAudit.lines_md, errors: currentAudit.errors },
    edgeMarginPx: 80,
    excludedEdgeX: [[0, 79], [1424, 1503]],
    extraNativeBandY: [2149, 2180],
    observedFooterBandY: [2011, 2037],
    independentVisualJudgment: 'The full original316 shows only dark edge/scan blemishes in the excluded side strips, including y2149-2180 below footer307. No printed text, formula, figure, caption or footer occupies those80px edge strips. No bottom/text-content crop was made.',
    beforeCurrentBlocksEqual: true, beforeCurrentMarkdownBodyEqual: true,
    beforeCurrentRenderIdentityEqual: true, beforeCurrentFigureGeometryEqual: true,
    sourcePixelsChanged: false, repairRerunByReviewer: false,
    countingPassIsNotSourceApproval: true,
  },
  boundaries: {
    incoming315: { ...boundary315, textOnly: true, reviewedTail: '另一方面，利用电磁感应定律(12-4)也可以计算出感生', joins316: '电动势.', SOURCE: 'NOT-REVIEWED-BY-D081' },
    local316: 'Heading129 closes128 locally. Outgoing这种现象 joins317叫做自感. No whole128/129 approval.',
    outgoing317: { terminal: '结', incoming318: '果，在打开电键的时刻，检流计有电', context: boundary318, textOnly: true, imageOpened: false, SOURCE318: 'NOT-REVIEWED-BY-D081', createsNewTarget: false },
    textualLookupRecovery: 'An exact p-cont header query first returned a later single continuation 电动势.; a first-header query then read only318 incoming lines57-61. Neither query reviewed or certified318.',
    alreadyConsumedNotReopenedOrCertified: ['SOURCE314', 'SOURCE315', 'RAW290', 'SVG290'],
    alreadyConsumedAuthority: 'Direct human instruction: D076 composedPASS consumed.',
  },
  nativeEvidence,
  actionableDefects: [],
  unresolvedNarrowQuestions: [],
  wholeCourseApproval: false, modernApproval: false,
  sourcePagesAdded: 0, newSourcePages: 0, completeCoursesAdded: 0, newCourses: 0,
  actualImageOpens: 8, reopens: 0,
  sourceWrites: false, productWrites: false,
  repairs: 0, nativeProducerReruns: 0, wholeProjectChecks: 0,
  freshnessCalls: 0, liveTicketCalls: 0, paidCalls: 0,
  databaseWrites: false, deploy: false, dependenciesChanged: false, modelsChanged: false,
  meterWrites: false, evidenceIndexWrites: false,
  newAgents: 0, newChats: 0, branchesOrWorktreesCreated: 0,
  commit: false, push: false, formalHandoff: false,
  parentConsumption: 'pending',
  selfAudit: {
    status: 'PASS', decisionMaker: 'D081 under direct Grill-self instruction',
    everyRowCovered: true, beforeCurrentCountingComparisonDone: true,
    observedPixelsNotAuthorNotesAlone: true, allFiguresComparedAcrossThreeSurfaces: true,
    hashesAndCountsNotUsedAsSourceApproval: true, imageLimitHonored: true,
    constraintsHonored: true, unresolvedMaterialQuestions: [],
    textLookupMismatchDisclosedAndCorrectedWithoutImageOrTargetExpansion: true,
  },
});

// Re-read every bound input so a concurrent change cannot silently inherit PASS.
for (const entry of inputs.values()) assert.equal(sha(read(entry.path)), entry.sha256, entry.path);
const freeze = output('review-freeze.json', {
  schema: 'STEMROBIN-181/independent-review-freeze@1',
  ticket: 'STEMROBIN-181', reviewer: 'D081', workdir: root,
  status: 'PASS-parent-consumption-pending',
  authorFreeze: authorBinding, report, imageLedger, grill, builder,
  actualCurrentInputs: [...inputs.values()].sort((a, b) => a.path.localeCompare(b.path)),
  currentInputsMatchAuthorFreeze: true, inputsUnchangedAtFreeze: true,
  exactVerdicts: { SOURCE316: 'PASS', SOURCE317: 'PASS', RAW291: 'PASS', RAW292: 'PASS', RAW293: 'PASS', SVG291: 'PASS', SVG292: 'PASS', SVG293: 'PASS' },
  actualImageOpens: 8, actualCurrentContextImageOpens: 8, reopens: 0,
  wholeCourseApproval: false, modernApproval: false,
  sourcePagesAdded: 0, completeCoursesAdded: 0,
  productWrites: false, parentConsumption: 'pending', formalHandoff: false,
});
console.log(JSON.stringify({ report, reviewFreeze: freeze, imageLedger, grill, actualImageOpens: 8, exactVerdicts: json(freeze.path).exactVerdicts }, null, 2));
