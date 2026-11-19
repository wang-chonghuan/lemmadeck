import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const R = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const T = path.join(R, '.intentfold/tickets/STEMROBIN-181/tmp');
const O = path.join(T, 'd894-source236-eleven-finding-affected-review');
const B = path.join(T, 'd883-source236-first-independent-review');
const C = path.join(T, 'd893-source236-eleven-finding-repair');
const V = path.join(T, 'd891-source236-portrait-first-vectorize');
assert.equal(process.cwd(), R);
const generated = ['candidate.diff', 'report.json', 'report.md', 'freeze.json'];
assert(generated.every(name => !fs.existsSync(path.join(O, name))),
  'Refusing to replace existing evidence');
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const json = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const clone = value => structuredClone(value);
const inputs = new Map();
function bind(p, expected, purpose) {
  p = path.resolve(R, p);
  assert(p.startsWith(`${R}/`), `Input outside sole root: ${p}`);
  const bytes = fs.readFileSync(p);
  const actual = sha(bytes);
  if (expected) assert.equal(actual, expected, `Hash mismatch: ${p}`);
  const old = inputs.get(p);
  if (old) assert.equal(old.sha256, actual);
  const binding = { path: p, sha256: actual, expectedSha256: expected || null,
    matched: true, purpose };
  inputs.set(p, binding);
  return binding;
}
function write(name, value) {
  assert(generated.includes(name));
  fs.writeFileSync(path.join(O, name), value, { flag: 'wx', mode: 0o600 });
}
const priorReportBinding = bind(path.join(B, 'report.current.json'),
  'e009743cddc78ac759e31828cb1db680c553f6cb21722056fadc71ccbf296ab8',
  'Authoritative previous SOURCE HOLD and retained PASS scopes');
const repairReportBinding = bind(path.join(C, 'report.json'),
  'bd6fa3760051f03ff53d125ba58cfcabe144bc86adcf3a359add75d57e232d5e',
  'User-bound d893 repair report; not approval');
const prior = json(priorReportBinding.path);
const repair = json(repairReportBinding.path);
const priorFreezeBinding = bind(path.join(B, 'freeze-with-svg.json'), null,
  'Bind original frozen row inventory, detail images and FIRST SVG review');
const priorFreeze = json(priorFreezeBinding.path);
assert.equal(priorFreeze.currentReportSha256, priorReportBinding.sha256);
const rowsBinding = bind(path.join(B, 'row-review.json'),
  priorFreeze.hashes[path.join(B, 'row-review.json')], 'Eleven structured FIRST findings');
const rr = json(rowsBinding.path);
const changesBinding = bind(repair.changes.path, repair.changes.sha256,
  'Author repair declaration independently checked below');
const changes = json(changesBinding.path);
assert.equal(rr.status, 'HOLD');
assert.equal(prior.status, 'HOLD');
assert.equal(rr.findings.length, 11);
assert.equal(changes.findingCount, 11);
assert.equal(changes.changes.length, 11);
assert.deepEqual(rr.findings, prior.review.findings);
const observationsBinding = bind(path.join(O, 'pixel-observations.json'), null,
  'Independent d894 observations from two authorized original details');
const observations = json(observationsBinding.path);
assert.deepEqual(observations.observations.map(o => o.id),
  rr.findings.map(f => f.id));

const details = ['original-middle-detail.png', 'original-lower-detail.png'].map(name =>
  bind(path.join(B, name), priorFreeze.hashes[path.join(B, name)],
    'Authorized unmasked original detail; visually loaded once'));
const provenanceBinding = bind(path.join(B, 'source-details-provenance.json'),
  priorFreeze.hashes[path.join(B, 'source-details-provenance.json')],
  'Existing crop provenance, without recropping or rendering');
const provenance = json(provenanceBinding.path);
assert.equal(provenance.sourceSha256, prior.source.page.sha256);
assert.equal(provenance.sourcePixelsModified, false);
for (const d of details) {
  assert.equal(provenance.outputs.find(e => e.path === d.path)?.sha256, d.sha256);
}

const beforeMdBinding = bind(prior.bindings.candidate.pageMd.path,
  prior.bindings.candidate.pageMd.sha256, 'Previous reviewed candidate; parser and exact diff');
assert.equal(beforeMdBinding.sha256, repair.original.sha256);
assert.equal(path.resolve(R, repair.original.path), beforeMdBinding.path);
const beforeJsonBinding = bind(prior.bindings.candidate.pageJson.path,
  prior.bindings.candidate.pageJson.sha256, 'Prior structured content binding');
const beforeAuditBinding = bind(prior.bindings.candidate.audit.path,
  prior.bindings.candidate.audit.sha256, 'Previous native audit; hash reuse only');
const candidateBindings = repair.outputs.map(e => bind(e.path, e.sha256,
  'Current repaired candidate; no edits'));
const afterMdBinding = candidateBindings.find(e => e.path.endsWith('/page.md'));
const afterJsonBinding = candidateBindings.find(e => e.path.endsWith('/page.json'));
const afterAuditBinding = candidateBindings.find(e => e.path.endsWith('/audit.json'));
assert(afterMdBinding && afterJsonBinding && afterAuditBinding);
assert.equal(afterAuditBinding.sha256, beforeAuditBinding.sha256);
const beforeMd = fs.readFileSync(beforeMdBinding.path, 'utf8');
const afterMd = fs.readFileSync(afterMdBinding.path, 'utf8');

// Import only the native block parser; -B prevents bytecode writes anywhere.
const parser = path.join(R, '.claude/skills/ld-s10y-lesson/tools/blocks.py');
const parserBinding = bind(parser, null, 'Existing authoritative read-only parser');
const py = [
  'import sys,json',
  'from pathlib import Path',
  'sys.path.insert(0,sys.argv[1])',
  'import blocks',
  'results=[]',
  'for filename in sys.argv[2:]:',
  ' meta,items=blocks.load(Path(filename))',
  ' results.append({"meta":meta,"blocks":items})',
  'print(json.dumps(results,ensure_ascii=False))',
].join('\n');
const parsedCall = spawnSync(path.join(R, '.claude/skills/ld-s10y-lesson/.venv/bin/python'),
  ['-B', '-c', py, path.dirname(parser), beforeMdBinding.path, afterMdBinding.path],
  { cwd: R, encoding: 'utf8', maxBuffer: 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' } });
assert.equal(parsedCall.status, 0, parsedCall.stderr);
const [before, after] = JSON.parse(parsedCall.stdout);
const expected = clone(before);
let expectedBytes = beforeMd;
const affectedLocations = new Set();
const patchTrace = [];
for (let index = 0; index < changes.changes.length; index++) {
  const change = changes.changes[index];
  const finding = rr.findings[index];
  assert.equal(change.finding, finding.id);
  assert.equal(finding.sourceRef, `p0236#${change.block}`);
  assert.equal(change.line, finding.line);
  const line = expected.blocks[change.block - 1].lines[change.line - 1];
  assert.equal(line, change.before, `Incorrect declared before line: ${finding.id}`);
  assert.equal(observations.observations[index].observed, finding.source);
  if (index < 2) {
    const from = index === 0 ? '\u6b63' : '\u4e01';
    const to = index === 0 ? '\u51c6' : '\u6c40';
    assert.equal(change.after, change.before.replace(from, to));
  } else {
    assert.equal(change.after, change.before.replace('\u3002', '.'));
  }
  expected.blocks[change.block - 1].lines[change.line - 1] = change.after;
  const needle = `\n${change.before}\n`;
  assert.equal(expectedBytes.split(needle).length - 1, 1,
    `Expected one exact raw body line for ${finding.id}`);
  expectedBytes = expectedBytes.replace(needle, `\n${change.after}\n`);
  affectedLocations.add(change.block * 100 + change.line);
  patchTrace.push({ id: finding.id, block: change.block, line: change.line,
    row: finding.row, exactDeclaredChangeVerified: true });
}
assert.equal(changes.metadataNoteIndex, 1);
assert.equal(expected.meta.notes[1], changes.metadataNoteBefore);
assert.equal(changes.metadataNoteAfter,
  changes.metadataNoteBefore.replace('\u6b63\u786e\u7684', '\u51c6\u786e\u7684'));
expected.meta.notes[1] = changes.metadataNoteAfter;
const noteBefore = JSON.stringify(changes.metadataNoteBefore);
assert.equal(expectedBytes.split(noteBefore).length - 1, 1);
expectedBytes = expectedBytes.replace(noteBefore, JSON.stringify(changes.metadataNoteAfter));
assert.equal(expectedBytes, afterMd, 'Out-of-scope raw Markdown bytes changed');
assert.deepEqual(expected, after, 'Out-of-scope parsed fields changed');
assert.deepEqual([...affectedLocations].sort((a, b) => a - b), changes.affectedRows);
assert.equal(affectedLocations.size, 10);

const beforeJson = json(beforeJsonBinding.path);
const afterJson = json(afterJsonBinding.path);
function serializedView(parsed) {
  const value = clone(parsed);
  let seq = 0;
  for (const block of value.blocks) {
    if (block.kind === 'fig') {
      seq++;
      assert.equal(block.label, null);
      block.id = `tbl-p0236-${String(seq).padStart(2, '0')}`;
    }
  }
  return value;
}
assert.deepEqual(serializedView(before), beforeJson);
assert.deepEqual(serializedView(after), afterJson);
const expectedJson = clone(beforeJson);
for (const change of changes.changes) {
  expectedJson.blocks[change.block - 1].lines[change.line - 1] = change.after;
}
expectedJson.meta.notes[1] = changes.metadataNoteAfter;
assert.deepEqual(expectedJson, afterJson, 'Out-of-scope structured content changed');
assert.equal(before.blocks.length, 9);
assert.equal(after.blocks.length, 9);
const shape = blocks => blocks.map(({ lines, ...fields }) =>
  ({ ...fields, lineCount: lines.length, boldCounts: lines.map(s => s.split('**').length - 1) }));
assert.deepEqual(shape(before.blocks), shape(after.blocks));
const unaffected = rr.rows.filter(r => !affectedLocations.has(r.block * 100 + r.line));
assert.equal(unaffected.length, 16);
for (const row of unaffected) {
  assert.equal(row.status, 'PASS');
  const oldLine = before.blocks[row.block - 1].lines[row.line - 1];
  const newLine = after.blocks[row.block - 1].lines[row.line - 1];
  assert.equal(oldLine, row.candidateText);
  assert.equal(newLine, oldLine);
}
const affected = rr.rows.filter(r => affectedLocations.has(r.block * 100 + r.line));
assert.equal(affected.length, 10);
const glyphComparable = text => text.replaceAll('**', '').replace(/[ \u3000]/g, '');
const affectedReview = affected.map(row => {
  assert.equal(row.status, 'HOLD');
  const candidateText = after.blocks[row.block - 1].lines[row.line - 1];
  assert.equal(before.blocks[row.block - 1].lines[row.line - 1], row.candidateText);
  assert.equal(glyphComparable(candidateText), glyphComparable(row.sourceText));
  return { row: row.row, sourceRef: row.sourceRef, block: row.block, line: row.line,
    findings: row.findings, originalStatus: 'HOLD', affectedStatus: 'PASS',
    candidateText, sourceInventoryText: row.sourceText,
    affectedGlyphsIndependentlyVerifiedFromPixels: true,
    typographyStatus: 'PASS_REUSED_UNCHANGED', blockRoleStatus: 'PASS_REUSED_UNCHANGED' };
});
const diffCall = spawnSync('diff', ['-u', beforeMdBinding.path, afterMdBinding.path],
  { cwd: R, encoding: 'utf8' });
assert.equal(diffCall.status, 1);
assert.equal(diffCall.stderr, '');

const nativeBinding = bind(repair.native.path, repair.native.sha256,
  'Existing d893 native26/26 receipt; no replay');
const nativeReceipt = json(nativeBinding.path);
assert.equal(nativeReceipt.cwd, R);
assert.equal(nativeReceipt.exit, 0);
assert(nativeReceipt.stdout.includes('26 \u884c\uff08\u5370\u5237 26\uff09'));
const audit = json(afterAuditBinding.path);
assert.equal(audit.lines_md, 26);
assert.equal(audit.lines_printed, 26);
assert.deepEqual(audit.errors, []);
assert.deepEqual(audit.normalizations, []);
bind(repair.patch.path, repair.patch.sha256, 'Existing first patch receipt, preserved');
const vectorBinding = bind(path.join(V, 'FIRST/receipt.json'),
  prior.native.portraitVectorStage.receiptSha256, 'Existing d891 FIRST vector receipt');
const vector = json(vectorBinding.path);
assert.equal(vector.exit, 0);
assert.equal(vector.cwd, R);
const portrait = prior.ownership.unnumberedPortrait;
assert.equal(portrait.cropStatus, 'PASS');
assert.equal(portrait.svgStatus, 'FIRST_SCOPED_PASS');
const svgReviewBinding = bind(portrait.svgReview, portrait.svgReviewSha256,
  'Reuse independently approved FIRST SVG scope, not native metric alone');
assert.equal(json(svgReviewBinding.path).status, 'PASS');
const sourceHashBindings = [
  bind(prior.source.page.path, prior.source.page.sha256, 'Raw-byte source hash only; not visually reopened'),
  bind(path.join(C, 'work/10p/pages/0236/page.png'), prior.source.page.sha256,
    'Raw-byte candidate source hash only; not visually reopened'),
  bind(portrait.path, portrait.sha256, 'Original reviewed portrait hash only; not visually reopened'),
  bind(repair.portraitPNGUnchanged.path, portrait.sha256, 'Candidate portrait hash only; not visually reopened'),
  bind(vector.png.path, portrait.sha256, 'FIRST vector input PNG hash only'),
  bind(portrait.svg.path, portrait.svg.sha256, 'FIRST SVG hash only; no rendering'),
  bind(portrait.svgRaster.path, portrait.svgRaster.sha256, 'Prior SVG evidence hash only; not visually reopened'),
];
assert.equal(vector.svg.sha256, portrait.svg.sha256);
assert.equal(repair.portraitSVGReuse.sha256, portrait.svg.sha256);
assert.equal(prior.boundaries.closure, false);
assert.equal(after.blocks[0].cont, true);
assert(after.blocks[0].lines[0].startsWith(prior.boundaries.ownIncomingExactStart));
assert.equal(after.blocks[7].open, true);
assert(after.blocks[7].lines.at(-1).endsWith(prior.boundaries.ownOutgoingExactTail));
const historicalBindings = [
  bind(prior.bindings.originalAuthor.report, prior.bindings.originalAuthor.reportSha256,
    'FIRST author HOLD retained without reclassification'),
  bind(prior.bindings.currentRepairAuthor.report, prior.bindings.currentRepairAuthor.reportSha256,
    'Previous six-stop author-only repair retained'),
  bind(prior.priorFrozenSourceReport.path, prior.priorFrozenSourceReport.sha256,
    'Immutable FIRST independent SOURCE HOLD retained'),
  bind(prior.priorFrozenSourceReport.freeze, prior.priorFrozenSourceReport.freezeSha256,
    'Original FIRST failure freeze retained'),
];
// Detect concurrent edits to any evidence bound by this review before freezing.
for (const entry of inputs.values()) {
  assert.equal(sha(fs.readFileSync(entry.path)), entry.sha256, `Input changed: ${entry.path}`);
}
const report = {
  schema: 'source-page-affected-independent-review@1',
  assignment: 'STEMROBIN-181 successor181-3 d894 SOURCE236 eleven-finding affected-only review',
  recordedAt: new Date().toISOString(), root: R, ownedWriteRoot: O,
  book: '10p', physicalPage: 236, printedPage: 226,
  independentReview: true, candidateEdited: false,
  scope: { findingCount: 11, affectedRowCount: 10, glyphs: 2, filledStops: 9,
    matchingMetadataNote: 'meta.notes[1], under S236-F01',
    affectedLocations: [...affectedLocations].sort((a, b) => a - b),
    full26RowReviewReplay: false },
  affectedStatus: 'PASS', composedSourceStatus: 'SOURCE_PASS', status: 'PASS',
  sourceApproval: true, approvalScope: 'Hash-bound SOURCE236 page candidate only',
  completeCard: false, fullCardApproval: false, modernEditionApproval: false,
  assemblyClosure: false, dependentStageAuthorization: false,
  bindings: { priorReport: priorReportBinding, repairReport: repairReportBinding,
    priorFreeze: priorFreezeBinding, rowReview: rowsBinding, changes: changesBinding,
    observations: observationsBinding, provenance: provenanceBinding,
    candidate: candidateBindings, native: nativeBinding, vector: vectorBinding,
    svgReview: svgReviewBinding, sourceAndPortraitHashes: sourceHashBindings },
  findings: rr.findings.map((finding, index) => ({
    originalFinding: finding, originalStatus: 'HOLD',
    affectedStatus: observations.observations[index].status,
    independentPixelObservation: observations.observations[index],
    declaredChange: changes.changes[index], exactChangeVerified: true,
  })),
  affectedRows: affectedReview,
  metadataNote: { status: 'PASS', index: 1,
    before: changes.metadataNoteBefore, after: changes.metadataNoteAfter,
    sameSourceReadingAsF01: true, otherNotesUnchanged: true },
  diffVerification: { status: 'PASS', parser: parserBinding,
    parserInvocations: 1, parserOnlyNoProducerCalls: true,
    exactExpectedMarkdownBytes: true, exactExpectedParsedObject: true,
    pageJsonMatchesAuthoritativeParser: true, pageJsonOnlyExpectedChanges: true,
    auditByteIdentical: true, blockFieldsAndLineCountsUnchanged: true,
    boldDelimiterLocationsUnchanged: true, figureReferenceBytesUnchanged: true,
    allOtherMetadataUnchanged: true, noOutOfScopeChanges: true,
    patchTrace, rawDiff: path.join(O, 'candidate.diff') },
  reusedChecks: {
    unaffectedRows: { status: 'PASS_REUSED_UNCHANGED', count: 16,
      rowIds: unaffected.map(r => r.row), glyphReviewReplays: 0,
      method: 'Exact row-byte identity against bound prior candidate; no new source-glyph review' },
    typography: { status: 'PASS_REUSED_UNCHANGED', prior: prior.review.typography,
      clarification: 'F01 repairs wording only; the original bold span is unchanged' },
    blocks: { status: 'PASS_REUSED_UNCHANGED', count: 9 },
    exactSixStops: { status: 'PASS_REUSED_UNCHANGED', prior: prior.exactSixRepair },
    boundaries: { status: 'PASS_REUSED_WITH_OPEN_OUTGOING_BOUNDARY',
      prior: prior.boundaries, incomingTextAndFlagUnchanged: true,
      outgoingTailAndFlagUnchanged: true, closure: false },
    rawPortraitPNG: { status: 'PASS_REUSED_UNCHANGED', sha256: portrait.sha256,
      visualReplays: 0 },
    rawPortraitFIRSTSVG: { status: 'FIRST_SCOPED_PASS_REUSED_UNCHANGED',
      sha256: portrait.svg.sha256, receipt: vectorBinding,
      independentReview: svgReviewBinding, visualReplays: 0 },
    native: { status: 'PASS_REUSED', linesPrinted: 26, linesMd: 26,
      errors: [], normalizations: 0, replayCount: 0,
      nativeCountNotSoleSourceApproval: true },
  },
  composedSourceGate: { status: 'PASS', method: 'Affected-only composition, not a new full-card or full-page review',
    affectedFindings: '11/11 PASS', affectedRows: '10/10 PASS',
    unaffectedRows: '16/16 prior PASS, unchanged bytes',
    typographyBlocksBoundariesAndRawPortrait: 'Previous PASS scopes reused with unchanged bindings',
    noRemainingFindingsInAuthorizedSourceScope: true, newFull26RowReplay: false,
    source235Reapproval: false, source237ReadOrInference: false,
    fullCard: 'NOT_APPROVED; outgoing p0236#8 remains open' },
  preservedFirstFailures: {
    bindings: historicalBindings, priorCurrentSourceStatus: prior.sourceStatus,
    originalAuthorStatus: prior.bindings.originalAuthor.originalStatus,
    firstIndependentRowStatus: rr.status, firstIndependentFindingsCount: 11,
    firstFilesOverwritten: false, failuresReclassifiedAsPass: false,
    currentPassIsNewAffectedCompositionOnly: true },
  usage: { imagesThisReview: 2, inheritedImagesInThisContext: 0,
    contextImageLoads: 2, batches: 1, maximumImagesInBatch: 2,
    batchLimit: 8, contextLimit: 24, imageLoads: details.map((d, i) =>
      ({ order: i + 1, batch: 1, path: d.path, sha256: d.sha256 })),
    imageReopens: 0, newImagesOrCropsGenerated: 0, portraitVisualReplays: 0,
    prepareCalls: 0, finalizeCalls: 0, vectorizeCalls: 0, renderCalls: 0,
    full26RowReviewReplays: 0, paidCalls: 0, candidateEdits: 0,
    gitCalls: 0, dbCalls: 0, publisherCalls: 0, deployCalls: 0, otherChats: 0,
    repairRoundsCumulativeReportedByD893: repair.repairRoundsCumulative,
    repairRoundsThisReview: 0, d893NativeCallsReportedByParent: 1,
    priorD883ImageLoadsHistoricalSeparateContext: prior.usage.imageLoadsCumulativeInContext,
    priorD891VectorInvocationsHistorical: 1, hostTokenUsage: 'not exposed' },
  stop: { onlyOwnedWriteRootUsed: true, otherWorkPreserved: true,
    noCandidateEdits: true, noOtherStages: true, freezeThenTextPathsAndHashesOnly: true },
  inputVerification: { status: 'PASS', allHashesMatched: true,
    finalInputStabilityCheck: 'PASS', entries: [...inputs.values()] },
};
write('candidate.diff', diffCall.stdout);
write('report.json', `${JSON.stringify(report, null, 2)}\n`);
const md = [
  '# d894 SOURCE236 Affected-Only Independent Review',
  '',
  'Affected: PASS (11 findings, 10 rows). Composed SOURCE236 gate: PASS.',
  'Full-card approval: NO. Outgoing p0236#8 remains open; no source237 inference.',
  '',
  'The original details independently confirm U+51C6 in the bold conclusion,',
  'U+6C40 in the printed name, and all nine filled stops as U+002E transcription.',
  'The matching metadata note is corrected; no other note is changed.',
  '',
  'Native parser and exact byte diff admit only those eleven body substitutions',
  'and the matching metadata note. page.json matches the parser. audit.json,',
  'block fields, line breaks, bold delimiters and figure reference remain unchanged.',
  '',
  'Reused: 16 unaffected row PASS checks, typography, block roles, boundaries,',
  'raw portrait PNG PASS, independently reviewed FIRST SVG PASS, and native26/26.',
  'Reuse is bound to unchanged hashes, not a new visual or full26-row replay.',
  '',
  'Original d860 author HOLD and d883 FIRST SOURCE HOLD/finding records remain',
  'unchanged. This PASS is a new affected-only composition for d893, not a',
  'retroactive PASS or an authorization for dependent stages.',
  '',
  'Usage: 2 authorized existing detail images, one batch, context 2/24;',
  '0 candidate edits, 0 paid/prepare/finalize/vectorize/render/replay calls.',
  'No Git, DB, publisher, deploy, other-chat or production actions.',
  '',
  `Candidate: ${afterMdBinding.path}`,
  `Candidate SHA256: ${afterMdBinding.sha256}`,
  `d893 report SHA256: ${repairReportBinding.sha256}`,
  `d883 current report SHA256: ${priorReportBinding.sha256}`,
  '',
  'Detailed observations, checks, usage, bindings and retained failures: report.json.',
  'Frozen output and input hashes: freeze.json. Evidence files are mode 0444.',
  '',
].join('\n');
write('report.md', md);
const outputNames = ['pixel-observations.json', 'review-evidence.mjs',
  'candidate.diff', 'report.json', 'report.md'];
const outputs = outputNames.map(name => {
  const p = path.join(O, name);
  return { path: p, sha256: sha(fs.readFileSync(p)), mode: '0444' };
});
const freeze = { schema: 'source-page-affected-review-freeze@1', root: R,
  ownedWriteRoot: O, affectedStatus: 'PASS', composedSourceStatus: 'SOURCE_PASS',
  sourceApprovalScope: 'Only hash-bound SOURCE236 d893 candidate',
  completeCard: false, firstFailuresPreserved: true,
  inputsUnchanged: true, outputFiles: outputs, inputFiles: [...inputs.values()],
  imagesThisReview: 2, full26RowReviewReplays: 0,
  permissions: 'All d894 files frozen 0444; no input permissions changed' };
write('freeze.json', `${JSON.stringify(freeze, null, 2)}\n`);
for (const entry of inputs.values()) {
  assert.equal(sha(fs.readFileSync(entry.path)), entry.sha256);
}
for (const name of [...outputNames, 'freeze.json']) {
  const p = path.join(O, name);
  fs.chmodSync(p, 0o444);
  console.log(`${sha(fs.readFileSync(p))}  ${p}`);
}
