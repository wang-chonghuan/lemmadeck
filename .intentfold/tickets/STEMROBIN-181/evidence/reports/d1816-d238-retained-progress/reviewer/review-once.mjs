import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';

const cwd = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
const tmp = path.join(cwd, '.intentfold/tickets/STEMROBIN-181/tmp');
const own = path.join(tmp, 'd1816-d238-source74-75-affected-review');
const author = path.join(tmp, 'd1816-d237-source74-75-text-repair');
const original = path.join(tmp, 'd1816-d219-source74-76-review');
const expectedInputSha = 'ec2d5e21868a8c3411096fdefe19d9c273d52ffc282f08f392f18b570506809a';
const reads = new Map();
const assertions = [];
const inputNames = ['input-freeze.json', 'source-only.json', 'after-baseline.json', 'dispatch-record.json'];
assert.equal(process.cwd(), cwd);
assert(!fs.existsSync(path.join(own, 'report.json')), 'Bounded review must not overwrite a result');
assert(!fs.existsSync(path.join(own, 'review-freeze.json')), 'Bounded review must not restart');

function sha(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

function read(file) {
  file = path.resolve(file);
  assert(!/\.(png|svg|pdf|jpe?g|webp|woff2?)$/i.test(file), 'No image, RAW or source PDF reads');
  if (!reads.has(file)) {
    const data = fs.readFileSync(file);
    reads.set(file, { data, binding: { path: file, bytes: data.length, sha256: sha(data) } });
  }
  return reads.get(file).data;
}

function binding(file) {
  read(file);
  return reads.get(path.resolve(file)).binding;
}

function json(file) {
  return JSON.parse(read(file).toString('utf8'));
}

function bound(entry) {
  const actual = binding(path.resolve(cwd, entry.path));
  assert.equal(actual.bytes, entry.bytes, entry.path);
  assert.equal(actual.sha256, entry.sha256, entry.path);
  return actual;
}

function check(name, actual, expected = true) {
  assert.deepEqual(actual, expected, name);
  assertions.push({ name, status: 'PASS' });
}

function once(text, from, to) {
  assert.equal(text.split(from).length - 1, 1, 'Exactly one literal occurrence must change');
  return text.replace(from, to);
}

function delta(a, b, pointer = '') {
  if (isDeepStrictEqual(a, b)) return [];
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    assert.deepEqual(Object.keys(a), Object.keys(b), `Unchanged structure at ${pointer}`);
    return Object.keys(a).flatMap(key => delta(a[key], b[key], `${pointer}/${key}`));
  }
  return [{ pointer, before: a, after: b }];
}

function parseMd(text) {
  const lines = text.split('\n');
  assert.equal(lines[0], '---');
  const end = lines.indexOf('---', 1);
  assert(end > 0);
  const meta = JSON.parse(lines.slice(1, end).join('\n'));
  const blocks = [];
  for (const line of lines.slice(end + 1)) {
    if (!line.trim()) continue;
    const header = /^<!-- (p|foot)(?: (cont|open))? -->$/.exec(line);
    if (header) {
      blocks.push({
        kind: header[1],
        cont: header[2] === 'cont',
        open: header[2] === 'open',
        lines: [],
      });
    } else {
      assert(blocks.length, 'No unowned MD rows');
      blocks.at(-1).lines.push(line);
    }
  }
  return { meta, blocks };
}

function writeGenerated(name, value) {
  const file = path.join(own, name);
  assert.equal(path.dirname(file), own);
  assert(!fs.existsSync(file), `Preserve existing ${name}`);
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
  return file;
}

// Source-only expectations were saved before the after-baseline was read.
const baselinePath = path.join(own, 'expected-narrow-baseline.json');
const baseline = json(baselinePath);
check('Expected source-only phase', baseline.phase,
  'persisted-before-reading-after-baseline-or-changed-candidates');
const inputPath = path.join(own, 'input-freeze.json');
check('Human-pinned input freeze SHA256', binding(inputPath).sha256, expectedInputSha);
const input = json(inputPath);
bound(input.sourceOnly);
bound(input.afterBaseline);
Object.values(baseline.authority).forEach(bound);
const sourceOnly = json(input.sourceOnly.path);
sourceOnly.sourceBaselines.forEach(bound);
bound(sourceOnly.firstFailedReview);
const failed = json(sourceOnly.firstFailedReview.path);
check('Original D219 remains FAIL', failed.verdict, 'fail');
check('Exactly D219 F1/F2 preserved', failed.findings.map(f => [f.id, f.status]),
  [['D219-F1', 'FAIL_UNREPAIRED'], ['D219-F2', 'FAIL_UNREPAIRED']]);

for (const expectation of baseline.expectations) {
  bound(expectation.inventory);
  const inventory = json(expectation.inventory.path);
  const row = inventory.groups.find(g => g.id === expectation.inventory.group)
    .rows[expectation.inventory.rowIndex];
  check(`${expectation.finding} source inventory literal`, row.includes(expectation.sourceLiteral));
  const finding = failed.findings.find(f => f.id === expectation.finding);
  check(`${expectation.finding} expected observed literal`, expectation.sourceLiteral, finding.sourceLiteral);
  check(`${expectation.finding} expected failed literal`, expectation.failedLiteral, finding.candidateLiteral);
  check(`${expectation.finding} permitted pointer`, expectation.pointer, finding.candidateJson.pointer);
  check(`${expectation.finding} dispatch finding unchanged`,
    sourceOnly.exactFindings.find(f => f.id === expectation.finding), finding);
}

const after = json(input.afterBaseline.path);
bound(after.authorReport);
bound(after.authorFreeze);
const authorReport = json(after.authorReport.path);
const authorFreeze = json(after.authorFreeze.path);
bound(authorReport.prepared);
const prepared = json(authorReport.prepared.path);
prepared.before.forEach(bound);
authorReport.preNative.forEach(bound);
authorReport.frozen.forEach(bound);
authorReport.natives.forEach(bound);
bound(authorFreeze.report);
bound(authorFreeze.prepared);
bound(authorFreeze.firstFailedReview);
authorFreeze.frozen.forEach(bound);
authorFreeze.preNative.forEach(bound);
authorFreeze.natives.forEach(bound);
const closedPath = path.join(author, 'parent-collected.json');
const closed = json(closedPath);
bound(closed.report);
bound(closed.freeze);
check('D237 author lane closed', closed.authorClosed && closed.authorLaneClosed);
check('D237 author lane completed', closed.status, 'D237_AUTHORREADY_RETAINED_AUTHOR_CLOSED');
check('D237 cumulative repair budget retained', authorReport.cumulativeSourceTextRepairs,
  { source74: 1, source75: 1 });
check('D237 repair budget before', prepared.textRepairsBefore, { source74: 0, source75: 0 });
check('D237 repair budget after', prepared.textRepairsAfter, { source74: 1, source75: 1 });
check('No source approval claimed by author', authorReport.sourceApproval, false);
check('No additional repairs authorized by after-baseline', after.repairsAuthorized, false);
check('Sole reviewer dispatch', json(path.join(own, 'dispatch-record.json')).soleIndependentReviewer);

const pages = [];
for (const expectation of baseline.expectations) {
  const page = expectation.sourcePage;
  const padded = String(page).padStart(4, '0');
  const candidate = after.candidates.find(c => c.page === page);
  bound(candidate.md);
  bound(candidate.json);
  const beforeMdPath = path.join(author, 'before', padded, 'page.md');
  const beforeJsonPath = path.join(author, 'before', padded, 'page.json');
  const beforeAuditPath = path.join(author, 'before', padded, 'audit.json');
  const afterAuditPath = path.join(author, 'frozen', padded, 'audit.json');
  const preNativePath = path.join(author, 'pre-native', padded, 'page.md');
  const finding = failed.findings.find(f => f.id === expectation.finding);
  check(`${page} before MD matches original failed binding`,
    [binding(beforeMdPath).bytes, binding(beforeMdPath).sha256],
    [finding.candidateMd.bytes, finding.candidateMd.sha256]);
  check(`${page} before JSON matches original failed binding`,
    [binding(beforeJsonPath).bytes, binding(beforeJsonPath).sha256],
    [finding.candidateJson.bytes, finding.candidateJson.sha256]);
  const beforeMd = read(beforeMdPath).toString('utf8');
  const afterMd = read(candidate.md.path).toString('utf8');
  const beforeJsonText = read(beforeJsonPath).toString('utf8');
  const afterJsonText = read(candidate.json.path).toString('utf8');
  const beforeJson = JSON.parse(beforeJsonText);
  const afterJson = JSON.parse(afterJsonText);
  const blockIndex = page === 74 ? 0 : 4;
  const rowBefore = beforeJson.blocks[blockIndex].lines[0];
  const rowAfter = afterJson.blocks[blockIndex].lines[0];
  check(`${page} before row includes original FAIL`, rowBefore.includes(expectation.failedLiteral));
  check(`${page} restored literal is source expectation`, rowAfter.includes(expectation.sourceLiteral));
  const expectedRow = once(rowBefore, expectation.failedLiteral, expectation.sourceLiteral);
  check(`${page} complete affected row changes only the expected literal`, rowAfter, expectedRow);
  check(`${page} MD bytes change only one literal`,
    afterMd, once(beforeMd, expectation.failedLiteral, expectation.sourceLiteral));
  check(`${page} JSON bytes change only one literal`,
    afterJsonText, once(beforeJsonText, expectation.failedLiteral, expectation.sourceLiteral));
  const differences = delta(beforeJson, afterJson);
  check(`${page} only one JSON pointer changed`, differences.map(d => d.pointer), [expectation.pointer]);
  const restored = structuredClone(afterJson);
  restored.blocks[blockIndex].lines[0] = rowBefore;
  check(`${page} all other rows, blocks, metadata and flags unchanged`, restored, beforeJson);
  check(`${page} pre-native MD equals frozen MD`, read(preNativePath), read(candidate.md.path));
  check(`${page} audit bytes unchanged`, read(afterAuditPath), read(beforeAuditPath));

  const md = parseMd(afterMd);
  check(`${page} MD frontmatter equals JSON metadata`, md.meta, afterJson.meta);
  check(`${page} MD rows and flags equal JSON`,
    md.blocks, afterJson.blocks.map(b => ({
      kind: b.kind, cont: b.cont, open: b.open, lines: b.lines,
    })));
  const logicalRows = afterJson.blocks.reduce((n, b) => n + b.lines.length, 0);
  const rowCount = blocks => blocks.reduce((n, b) =>
    n + b.lines.reduce((sum, line) => sum + line.split('\u21b5').length, 0), 0);
  const printedRows = rowCount(afterJson.blocks);
  const bodyRows = rowCount(afterJson.blocks.filter(b => b.kind !== 'foot'));
  const footerRows = rowCount(afterJson.blocks.filter(b => b.kind === 'foot'));
  const audit = json(afterAuditPath);
  const d219Page = failed.pageComparisons.find(p => p.physicalPage === page);
  check(`${page} native total equals original independent rows`,
    [printedRows, audit.lines_printed, audit.lines_md, afterJson.meta.printed_lines],
    Array(4).fill(d219Page.independentTotalTextRows));
  check(`${page} body/footer original counts retained`, [bodyRows, footerRows],
    [d219Page.independentBodyRows, d219Page.independentFooterRows]);
  check(`${page} inherited warnings retained`, audit.katex_warnings.length, page === 74 ? 4 : 10);
  check(`${page} no audit errors`, audit.errors, []);
  check(`${page} no count normalizations`, audit.normalizations, []);
  check(`${page} opening continuation preserved`, afterJson.blocks[0].cont);
  check(`${page} final prose remains open`, afterJson.blocks.filter(b => b.kind === 'p').at(-1).open);
  if (page === 75) {
    check('SOURCE75 separate source wording unchanged',
      afterJson.blocks[1].lines[0], beforeJson.blocks[1].lines[0]);
  }

  const receiptPath = authorReport.natives.find(n => n.path.includes(`source${page}-`)).path;
  const receipt = json(receiptPath);
  const stdoutPath = path.join(path.dirname(receiptPath), 'stdout.txt');
  const stderrPath = path.join(path.dirname(receiptPath), 'stderr.txt');
  const stdout = read(stdoutPath).toString('utf8');
  check(`${page} existing affected receipt success`, [receipt.exitCode, receipt.error], [0, null]);
  check(`${page} receipt cwd`, receipt.cwd, cwd);
  check(`${page} receipt command exact`, receipt.command, [
    '.claude/skills/ld-s10y-lesson/.venv/bin/python',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py',
    'finalize', '--book', '10p', '--page', String(page),
    '--root', '.tmp/STEMROBIN-181/d1816-d237/root',
    '--work', '.tmp/STEMROBIN-181/d1816-d237/source-work',
  ]);
  check(`${page} existing native stdout counts`, stdout.includes(`${printedRows} \u884c\uff08\u5370\u5237 ${printedRows}\uff09`));
  check(`${page} empty existing native stderr`, read(stderrPath).length, 0);
  pages.push({
    sourcePage: page,
    printedPage: expectation.printedPage,
    finding: expectation.finding,
    verdict: 'PASS_NARROW_LITERAL_REPAIR_ONLY',
    pointer: expectation.pointer,
    candidateMdLine: finding.candidateMd.line,
    beforeRow: rowBefore,
    afterRow: rowAfter,
    literalExpectedFromIndependentEvidence: expectation.sourceLiteral,
    jsonChangedPointers: differences.map(d => d.pointer),
    changedCandidateRows: 1,
    mdByteDelta: binding(candidate.md.path).bytes - binding(beforeMdPath).bytes,
    jsonByteDelta: binding(candidate.json.path).bytes - binding(beforeJsonPath).bytes,
    blockCount: afterJson.blocks.length,
    logicalRows,
    bodyPrintedRows: bodyRows,
    footerPrintedRows: footerRows,
    totalPrintedRows: printedRows,
    unchangedPrintedRows: printedRows - 1,
    cumulativeAuthorTextRepairs: 1,
    reviewerTextRepairs: 0,
    metadataCountsFlagsAndUnaffectedRowsUnchanged: true,
    auditByteIdentical: true,
    nativeWarningsUnchanged: audit.katex_warnings.length,
    nativeEvidence: {
      review: 'EXISTING_AFFECTED_RECEIPT_AND_LOGS_ONLY_NO_EXECUTION_OR_REPLAY',
      receipt: binding(receiptPath),
      stdout: binding(stdoutPath),
      stderr: binding(stderrPath),
      exitCode: receipt.exitCode,
      rerun: false,
      linkage: 'Author freeze binds pre-native MD, frozen MD/JSON/audit and receipt; pre-native and frozen MD are byte-identical.',
    },
    files: {
      beforeMd: binding(beforeMdPath),
      beforeJson: binding(beforeJsonPath),
      beforeAudit: binding(beforeAuditPath),
      preNativeMd: binding(preNativePath),
      frozenMd: binding(candidate.md.path),
      frozenJson: binding(candidate.json.path),
      frozenAudit: binding(afterAuditPath),
    },
    sourcePageApproved: false,
    n27Approved: false,
    canonicalConsumptionEligible: false,
  });
}

inputNames.forEach(name => read(path.join(own, name)));
read(path.join(own, 'review-once.mjs'));
const manifest = [...reads.values()].map(entry => entry.binding).sort((a, b) => a.path.localeCompare(b.path));
const counters = {
  affectedPagesReviewed: 2,
  narrowLiteralRepairsPassed: 2,
  reviewerSourceTextRepairs: 0,
  cumulativeAuthorTextRepairs: { source74: 1, source75: 1 },
  actualImageOpens: 0,
  parentImageOpens: 0,
  sourceImageReads: 0,
  glyphReinterpretations: 0,
  nativeCalls: 0,
  nativeReplays: 0,
  existingAffectedNativeReceiptsRead: 2,
  wholeSourceReplays: 0,
  raw47Replays: 0,
  gitCalls: 1,
  gitWrites: 0,
  p2cCalls: 0,
  productionCalls: 0,
  vectorizeCalls: 0,
  previewCalls: 0,
  paidCalls: 0,
  modelApiCalls: 0,
  databaseCalls: 0,
  publisherCalls: 0,
  deployCalls: 0,
  mergeCalls: 0,
  handoffCalls: 0,
  peerMessages: 0,
  childrenStarted: 0,
  canonicalEdits: 0,
  canonicalPromotions: 0,
  wholePageApprovals: 0,
  wholeCourseApprovals: 0,
  completeCoursesAdded: 0,
  sourcePagesApproved: 0,
  boundInputFiles: manifest.length,
  mechanicalAssertions: assertions.length,
};
const report = {
  schema: 'stemrobin181/affected-literal-review@1',
  batch: 'D238',
  ticket: 'STEMROBIN-181',
  role: 'SOLE_AFFECTED_SOURCE74_75_LITERAL_TEXT_REVIEW_ONLY',
  cwd,
  status: 'BOUNDED_REVIEW_COMPLETE_TWO_NARROW_PASSES_PROCESS_DEVIATION_RECORDED',
  verdict: 'PASS_NARROW_LITERAL_REPAIRS_ONLY',
  source74Verdict: pages.find(p => p.sourcePage === 74).verdict,
  source75Verdict: pages.find(p => p.sourcePage === 75).verdict,
  processComplianceVerdict: 'FAIL_NO_GIT_BOUNDARY_VIOLATION',
  authority: {
    inputFreeze: binding(inputPath),
    expectedNarrowBaseline: binding(baselinePath),
    sourceOnly: binding(input.sourceOnly.path),
    originalInventories: sourceOnly.sourceBaselines.map(bound),
    originalFailedReport: bound(sourceOnly.firstFailedReview),
    afterBaseline: bound(input.afterBaseline),
    authorReport: bound(after.authorReport),
    authorFreeze: bound(after.authorFreeze),
    authorClosedReceipt: binding(closedPath),
    expectedBaselineSavedBeforeAfterRead: true,
    freshPixelsOrGlyphInterpretationUsed: false,
  },
  pages,
  checks: assertions,
  bindings: manifest,
  preservation: {
    originalD219Verdict: 'fail',
    originalD219Findings: failed.findings.map(f => ({
      id: f.id, status: f.status, historicalBinding: sourceOnly.firstFailedReview,
      newAffectedRepairVerdict: 'PASS_NARROW_LITERAL_REPAIR_ONLY',
      originalRewritten: false,
    })),
    inheritedD219HoldsVerbatim: failed.holds,
    inheritedD219BoundaryEvidenceVerbatim: failed.boundaryReview,
    additionalExplicitHumanHolds: [
      { id: 'source73-predecessor', status: 'HOLD_PRESERVED_NO_NEW_REVIEW_OR_APPROVAL' },
      { id: 'modulus', status: 'HOLD_PRESERVED_NO_GLYPH_OR_SCIENCE_ADJUDICATION' },
      { id: 'amplitude-subscript', status: 'HOLD_PRESERVED_NO_SCRIPT_SUBSTITUTION' },
      { id: 'terminal-boundary', status: 'HOLD_PRESERVED_N27_NOT_COMPLETE' },
      { id: 'RAW47', status: 'HOLD_PRESERVED_NO_RAW_REPLAY_OR_PROMOTION' },
    ],
    source76AndRaw47Evidence: 'Referenced only through unchanged D219 report; no page, native or RAW assets replayed or copied.',
    noWholePageOrN27Approval: true,
    otherWorkPreserved: true,
    writesOnly: own,
    canonicalEdited: false,
    charterEdited: false,
    toolsOutsideOwnDirectoryEdited: false,
    historicalEvidenceOverwritten: false,
  },
  processDeviations: [{
    id: 'D238-P1',
    severity: 'NO_GIT_SCOPE_VIOLATION',
    command: 'git status --short',
    calls: 1,
    readOnly: true,
    gitWrites: 0,
    stage: 'Initial entry context gathering, before expected baseline.',
    disclosure: 'Disclosed in commentary and expected-narrow-baseline.json; no waiver or process-compliance approval.',
    reason: 'Reviewer mistakenly used a generic repository-entry command despite the explicit 0 Git constraint.',
  }],
  counters,
  closure: {
    boundedReviewComplete: true,
    sourceApproval: false,
    qualifyingWholeSourcePass: false,
    canonicalConsumptionEligible: false,
    n27Approval: false,
    formalHandoff: false,
    stopAfterBoundedReview: true,
    ownFreezeVerificationRequiredExactlyOnce: true,
    freezePath: path.join(own, 'review-freeze.json'),
    verificationReceiptPath: path.join(own, 'review-freeze-verification.json'),
  },
};
const reportPath = writeGenerated('report.json', report);
const reportBinding = {
  path: reportPath,
  bytes: fs.statSync(reportPath).size,
  sha256: sha(fs.readFileSync(reportPath)),
};
const freeze = {
  schema: 'stemrobin181/affected-literal-review-freeze@1',
  batch: 'D238',
  ticket: 'STEMROBIN-181',
  role: report.role,
  source74Verdict: report.source74Verdict,
  source75Verdict: report.source75Verdict,
  processComplianceVerdict: report.processComplianceVerdict,
  report: reportBinding,
  counters,
  fileCount: manifest.length + 1,
  files: [...manifest, reportBinding],
  selfBindingPolicy: 'Own freeze is bound by the single verification receipt and final stdout, not circularly by itself.',
  verificationReceiptPolicy: 'Generated after exactly one own-freeze verification; receipt is hash-bound in final stdout.',
  sourceApproval: false,
  wholePageApproval: false,
  n27Approval: false,
  canonicalConsumptionEligible: false,
  formalHandoff: false,
  allInheritedFailuresAndHoldsPreserved: true,
  writesOnly: own,
};
const freezePath = writeGenerated('review-freeze.json', freeze);

// Verify the sealed manifest once, then report final own-file hashes and stop.
const sealedBytes = fs.readFileSync(freezePath);
const sealed = JSON.parse(sealedBytes.toString('utf8'));
assert.equal(sealed.files.length, sealed.fileCount);
assert.equal(new Set(sealed.files.map(f => f.path)).size, sealed.fileCount);
for (const entry of sealed.files) {
  const bytes = fs.readFileSync(entry.path);
  assert.equal(bytes.length, entry.bytes, entry.path);
  assert.equal(sha(bytes), entry.sha256, entry.path);
}
const freezeBinding = { path: freezePath, bytes: sealedBytes.length, sha256: sha(sealedBytes) };
const verificationPath = writeGenerated('review-freeze-verification.json', {
  schema: 'stemrobin181/review-freeze-verification@1',
  batch: 'D238',
  status: 'PASS_SINGLE_OWN_FREEZE_VERIFICATION',
  ownFreezeVerificationCount: 1,
  checkedFileCount: sealed.fileCount,
  uniqueBoundPaths: sealed.fileCount,
  checkedByteTotal: sealed.files.reduce((sum, entry) => sum + entry.bytes, 0),
  freeze: freezeBinding,
  report: reportBinding,
  source74Verdict: sealed.source74Verdict,
  source75Verdict: sealed.source75Verdict,
  processComplianceVerdict: sealed.processComplianceVerdict,
  counters,
  sourceApproval: false,
  wholePageApproval: false,
  n27Approval: false,
  stoppedAfterBoundedReview: true,
});
const ownFiles = fs.readdirSync(own).sort().map(name => {
  const file = path.join(own, name);
  assert(fs.statSync(file).isFile(), 'Own directory contains only expected review files');
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length, sha256: sha(bytes) };
});
console.log(JSON.stringify({
  status: 'BOUNDED_REVIEW_CLOSED',
  source74Verdict: sealed.source74Verdict,
  source75Verdict: sealed.source75Verdict,
  processComplianceVerdict: sealed.processComplianceVerdict,
  ownFreezeVerifications: 1,
  verifiedFreezeFileCount: sealed.fileCount,
  totalPrintedRows: pages.reduce((sum, page) => sum + page.totalPrintedRows, 0),
  counters,
  report: reportBinding,
  freeze: freezeBinding,
  verificationReceipt: ownFiles.find(file => file.path === verificationPath),
  ownFileCount: ownFiles.length,
  ownByteTotal: ownFiles.reduce((sum, file) => sum + file.bytes, 0),
  finalOwnFiles: ownFiles,
}, null, 2));
