import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';

const cwd = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
const out = path.join(cwd, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d222-source69-70-affected-review');
if (process.cwd() !== cwd) throw new Error('Wrong active checkout');
const bindings = new Map();
const buffers = new Map();
const checks = [];
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const describe = (file, bytes) => ({ path: file, bytes: bytes.length, sha256: digest(bytes) });
function read(file) {
  if (!buffers.has(file)) {
    const bytes = fs.readFileSync(file);
    buffers.set(file, bytes);
    bindings.set(file, describe(file, bytes));
  }
  return buffers.get(file);
}
const text = file => read(file).toString('utf8');
const json = file => JSON.parse(text(file));
function check(id, ok, detail = null) {
  checks.push({ id, outcome: ok ? 'PASS' : 'FAIL', detail });
}
function bound(binding) {
  read(binding.path);
  check(`binding:${binding.path}`, isDeepStrictEqual(bindings.get(binding.path), binding));
}
function once(value, before, after, id) {
  const pieces = value.split(before);
  check(id, pieces.length === 2, { occurrences: pieces.length - 1 });
  return pieces.length === 2 ? pieces.join(after) : value;
}
function generate(file, data) {
  if (path.dirname(file) !== out || fs.existsSync(file)) throw new Error(`Refuse overwrite: ${file}`);
  const bytes = Buffer.from(JSON.stringify(data, null, 2) + '\n');
  fs.writeFileSync(file, bytes, { flag: 'wx' });
  return describe(file, bytes);
}

const baseline = json(path.join(out, 'narrow-baseline.json'));
read(path.join(out, 'review.mjs'));
bound(baseline.inputFreeze);
check('human_input_freeze_sha256', baseline.inputFreeze.sha256 === '2ff8df8e683dc73581747cf17874d0b48a20812dfe95ec6cf1c35f0d537ebdec');
const input = json(baseline.inputFreeze.path);
bound(input.sourceOnly);
const source = json(input.sourceOnly.path);
for (const binding of [...source.sourceBaselines, source.firstFailedReview]) bound(binding);
const original = json(source.firstFailedReview.path);
check('exact_findings_are_original_D209_failures', isDeepStrictEqual(source.exactFindings, original.findings.filter(item => item.outcome === 'FAIL')));
check('narrow_baseline_saved_before_after_read', baseline.savedBeforeAfterBaselineRead === true);
check('baseline_exact_finding_ids', isDeepStrictEqual(baseline.findings.map(item => item.id).sort(), ['D209-F1', 'D209-F2', 'D209-F3']));
bound(input.afterBaseline);
const after = json(input.afterBaseline.path);
bound(after.authorReport);
bound(after.authorFreeze);
const author = json(after.authorReport.path);
const authorFreeze = json(after.authorFreeze.path);
bound(author.prepared);
const prepared = json(author.prepared.path);
for (const binding of [
  ...prepared.before, prepared.firstFailedReview,
  authorFreeze.report, authorFreeze.prepared, authorFreeze.firstFailedReview,
  ...authorFreeze.frozen, ...authorFreeze.preNative, ...authorFreeze.native,
  ...author.frozen, ...author.preNative, ...author.natives
]) bound(binding);
check('prepared_findings_match_D209_exactly', isDeepStrictEqual(prepared.permittedFindings, source.exactFindings));
check('author_closure_not_source_approval', author.sourceApproval === false && after.sourceApprovalStillFalse === true);
check('author_and_freeze_bind_same_outputs', isDeepStrictEqual(author.frozen, authorFreeze.frozen) && isDeepStrictEqual(author.natives, authorFreeze.native));

const pageResults = [];
const findingResults = [];
for (const candidate of after.candidates) {
  const page = candidate.page;
  const code = String(page).padStart(4, '0');
  const authorDir = path.dirname(after.authorReport.path);
  const beforeMd = path.join(authorDir, 'before', code, 'page.md');
  const beforeJson = path.join(authorDir, 'before', code, 'page.json');
  const beforeAudit = path.join(authorDir, 'before', code, 'audit.json');
  const frozenAudit = path.join(authorDir, 'frozen', code, 'audit.json');
  bound(candidate.md);
  bound(candidate.json);
  const oldMd = text(beforeMd);
  const oldJsonText = text(beforeJson);
  const oldJson = json(beforeJson);
  const newMd = text(candidate.md.path);
  const newJsonText = text(candidate.json.path);
  const newJson = json(candidate.json.path);
  const expectedJson = structuredClone(oldJson);
  let expectedMd = oldMd;
  let expectedJsonText = oldJsonText;
  const changes = [];
  const pageChecksStart = checks.length;
  for (const finding of baseline.findings.filter(item => item.page === page)) {
    const originalFinding = source.exactFindings.find(item => item.id === finding.id);
    const start = checks.length;
    if (finding.id === 'D209-F3') {
      check('D209-F3_original_emphasis_match', isDeepStrictEqual(finding.confirmedSourceEmphasis, originalFinding.confirmedSourceEmphasis));
      for (let row = 0; row < 3; row++) {
        const oldRow = oldJson.blocks[7].lines[row];
        const emphasized = finding.expectedMarkdownEmphasisContent[row];
        check(`D209-F3_row${row}_plain_before`, !oldRow.includes('**'));
        const expectedRow = once(oldRow, emphasized, `**${emphasized}**`, `D209-F3_row${row}_single_run`);
        expectedJson.blocks[7].lines[row] = expectedRow;
        changes.push({ findingId: finding.id, markdownLine: finding.markdownLines[row], structuredLocation: finding.structuredLocations[row], before: oldRow, after: expectedRow });
      }
    } else {
      const block = page === 69 ? 9 : 1;
      const row = page === 69 ? 1 : 3;
      const oldRow = oldJson.blocks[block].lines[row];
      check(`${finding.id}_original_failed_row_match`, oldRow === originalFinding.candidateFullRow);
      check(`${finding.id}_original_source_literal_match`, finding.expectedMarkdownRow.replaceAll('$', '') === originalFinding.observedSourceFullRow);
      const expectedRow = page === 69
        ? once(oldRow, '导体，', '导体、', 'D209-F2_one_punctuation_replacement')
        : once(oldRow, '$R$、电容', '$R$、容', 'D209-F1_one_character_deletion');
      check(`${finding.id}_baseline_expected_row`, expectedRow === finding.expectedMarkdownRow);
      expectedJson.blocks[block].lines[row] = expectedRow;
      changes.push({ findingId: finding.id, markdownLine: finding.markdownLine, structuredLocation: finding.structuredLocation, before: oldRow, after: expectedRow });
    }
    for (const change of changes.filter(item => item.findingId === finding.id)) {
      const location = /blocks\[(\d+)\]\.lines\[(\d+)\]/.exec(change.structuredLocation);
      const currentRow = newJson.blocks[Number(location[1])].lines[Number(location[2])];
      check(`${finding.id}_${change.structuredLocation}_JSON`, currentRow === change.after);
      check(`${finding.id}_MD_line${change.markdownLine}`, newMd.split('\n')[change.markdownLine - 1] === change.after);
    }
    findingResults.push({
      id: finding.id,
      page,
      sourceRef: finding.sourceRef,
      outcome: checks.slice(start).every(item => item.outcome === 'PASS') ? 'PASS_AFFECTED_LITERAL_ONLY' : 'FAIL',
      originalFinding,
      expectedFromIndependentBaseline: finding,
      changes: changes.filter(item => item.findingId === finding.id),
      candidateBindings: { md: candidate.md, json: candidate.json },
      sourceApproval: false
    });
  }
  for (const change of changes) {
    check(`${page}_old_MD_line${change.markdownLine}`, oldMd.split('\n')[change.markdownLine - 1] === change.before);
    expectedMd = once(expectedMd, `\n${change.before}\n`, `\n${change.after}\n`, `${page}_MD_unique_row_${change.markdownLine}`);
    expectedJsonText = once(expectedJsonText, JSON.stringify(change.before), JSON.stringify(change.after), `${page}_JSON_unique_row_${change.markdownLine}`);
  }
  check(`${page}_exact_MD_bytes_only_authorized_delta`, Buffer.from(expectedMd).equals(read(candidate.md.path)));
  check(`${page}_exact_JSON_bytes_only_authorized_delta`, Buffer.from(expectedJsonText).equals(read(candidate.json.path)));
  check(`${page}_parsed_JSON_only_authorized_delta`, isDeepStrictEqual(expectedJson, newJson));
  check(`${page}_metadata_unchanged`, isDeepStrictEqual(oldJson.meta, newJson.meta));
  check(`${page}_audit_bytes_unchanged`, read(beforeAudit).equals(read(frozenAudit)));
  const diffRows = oldMd.split('\n').flatMap((row, index) => row === newMd.split('\n')[index] ? [] : [index + 1]);
  check(`${page}_only_exact_affected_MD_rows`, isDeepStrictEqual(diffRows, changes.map(item => item.markdownLine).sort((a, b) => a - b)));
  const originalCandidateMd = source.exactFindings.find(item => item.page === page).candidatePath;
  const originalCandidateJson = path.join(path.dirname(originalCandidateMd), 'page.json');
  check(`${page}_before_equals_original_D209_candidate_MD`, read(originalCandidateMd).equals(read(beforeMd)));
  check(`${page}_before_equals_original_D209_candidate_JSON`, read(originalCandidateJson).equals(read(beforeJson)));
  const currentDir = path.join(cwd, prepared.root, '10p', 'pages', code);
  const currentBindings = {};
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    const current = path.join(currentDir, name);
    const frozen = path.join(authorDir, 'frozen', code, name);
    check(`${page}_current_matches_frozen_${name}`, read(current).equals(read(frozen)));
    currentBindings[name] = bindings.get(current);
  }
  const nativeBinding = author.natives.find(item => item.path.includes(`source${page}-`));
  const receipt = json(nativeBinding.path);
  const stdoutPath = path.join(path.dirname(nativeBinding.path), 'stdout.txt');
  const stderrPath = path.join(path.dirname(nativeBinding.path), 'stderr.txt');
  const stdout = text(stdoutPath);
  const stderr = text(stderrPath);
  const audit = json(frozenAudit);
  const rows = page === 69 ? 18 : 24;
  check(`${page}_inherited_native_exit_and_cwd`, receipt.exitCode === 0 && receipt.error === null && receipt.cwd === cwd);
  check(`${page}_inherited_native_exact_target`, isDeepStrictEqual(receipt.command, [
    '.claude/skills/ld-s10y-lesson/.venv/bin/python',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py',
    'finalize', '--book', '10p', '--page', String(page),
    '--root', prepared.root, '--work', prepared.work
  ]));
  check(`${page}_inherited_native_stdout`, stdout.includes(`p${code}`) && stdout.includes(`${rows} 行（印刷 ${rows}）`) && stdout.includes('规范化 0 处') && stdout.includes('✓ 通过') && stderr.length === 0);
  check(`${page}_inherited_audit`, audit.lines_printed === rows && audit.lines_md === rows && audit.errors.length === 0 && audit.normalizations.length === 0);
  pageResults.push({
    page,
    printedPage: page === 69 ? 59 : 60,
    affectedVerdict: checks.slice(pageChecksStart).every(item => item.outcome === 'PASS') ? 'PASS_AFFECTED_LITERAL_REPAIRS_ONLY' : 'FAIL_AFFECTED_REVIEW',
    findingIds: changes.map(item => item.findingId).filter((item, index, list) => list.indexOf(item) === index),
    changedMarkdownRows: diffRows,
    changedStructuredRows: changes.map(item => item.structuredLocation),
    otherRows: 'BYTE_IDENTICAL_EXCEPT_EXACT_DECLARED_DELTAS; NOT_RE_REVIEWED',
    metadataAndPreciseCropGeometry: 'UNCHANGED_BYTES_AND_STRUCTURE',
    byteDelta: { md: read(candidate.md.path).length - read(beforeMd).length, json: read(candidate.json.path).length - read(beforeJson).length },
    before: { md: bindings.get(beforeMd), json: bindings.get(beforeJson), audit: bindings.get(beforeAudit) },
    originalFailedCandidates: { md: bindings.get(originalCandidateMd), json: bindings.get(originalCandidateJson) },
    frozen: { md: candidate.md, json: candidate.json, audit: bindings.get(frozenAudit) },
    current: currentBindings,
    inheritedNative: {
      receipt: nativeBinding,
      stdout: bindings.get(stdoutPath),
      stderr: bindings.get(stderrPath),
      exitCode: receipt.exitCode,
      rows: `${rows}/${rows}`,
      normalizations: 0,
      replayed: false,
      independentSourceApproval: false,
      katexWarningsRetained: audit.katex_warnings
    },
    sourceApproval: false,
    composedSourceApproval: false,
    wholePageVerdict: 'NOT_APPROVED_BY_D222',
    glyphHolds: original.findings.filter(item => item.outcome === 'HOLD' && (item.page === page || item.pages?.includes(page))).map(item => item.id)
  });
}
check('exactly_two_affected_pages', isDeepStrictEqual(pageResults.map(item => item.page).sort(), [69, 70]));
check('exactly_three_findings_reviewed', findingResults.length === 3);
const counters = {
  affectedReviewPasses: 1,
  affectedPages: 2,
  exactFindingsReviewed: 3,
  affectedMarkdownRows: 5,
  affectedStructuredRows: 5,
  actualImageOpens: 0,
  contextImageOpens: 0,
  parentImageOpens: 0,
  originalSourceOpens: 0,
  imageReopens: 0,
  glyphReinterpretations: 0,
  sourceEdits: 0,
  candidateEdits: 0,
  contentRepairs: 0,
  nativePrepareCalls: 0,
  nativeFinalizeCalls: 0,
  vectorizeCalls: 0,
  previewCommands: 0,
  wholeSourceReviews: 0,
  repeatedSettledReviews: 0,
  wholeChecks: 0,
  gitCommands: 0,
  databaseCalls: 0,
  publisherCalls: 0,
  deployCalls: 0,
  mergeCalls: 0,
  peerMessages: 0,
  childrenCreated: 0,
  modelApiCalls: 0,
  paidCalls: 0,
  canonicalPromotions: 0,
  sourcePagesAdded: 0,
  completeCoursesAdded: 0,
  formalHandoffs: 0,
  setupGrillFreshnessReplays: 0
};
const failures = checks.filter(item => item.outcome === 'FAIL');
const report = {
  schema: 'ld-s10y-source-review/affected-report@1',
  batch: 'D222',
  ticket: 'STEMROBIN-181',
  book: '10p',
  role: 'SOLE_AFFECTED_SOURCE69_70_TEXT_REVIEW_ONLY',
  cwd,
  sameOfflineInvocation: true,
  finish: 'review',
  verdict: failures.length === 0 ? 'PASS_THREE_AFFECTED_LITERAL_FINDINGS_ONLY_WITH_ALL_EXISTING_HOLDS' : 'FAIL_AFFECTED_REVIEW',
  approvalScope: 'Only D209-F2 punctuation and D209-F3 three confirmed emphasis runs on SOURCE69, and D209-F1 deletion of spurious 电 on SOURCE70. Not SOURCE69 missing 全. No original pixel/glyph or whole-source review.',
  sourceApproval: false,
  composedSourceApproval: false,
  wholeSource69Approval: false,
  wholeSource70Approval: false,
  N26Approval: false,
  N26Complete: false,
  wholeCourseApproval: false,
  modernFigureApproval: false,
  productAcceptance: false,
  formalHandoff: false,
  independence: {
    sourceOnlyAndD209ReadFirst: true,
    narrowBaselineSavedBeforeAfterBaselineRead: true,
    narrowBaseline: bindings.get(path.join(out, 'narrow-baseline.json')),
    authority: 'Independent D209 original-source literal findings, exactly matched; D221 closure and native receipts are implementation evidence only.',
    authorClaimsUsedAsSourceApproval: false,
    unchangedRowsReReviewed: false,
    originalImagesReopened: false,
    firstFailurePreserved: true,
    latestHumanCorrectionApplied: true
  },
  findings: findingResults,
  pageOutcomes: pageResults,
  retainedHolds: [
    { scope: 'SOURCE modulus/amplitude alphabet', verdict: 'HOLD', findingIds: ['D209-H1'], resolutionAttempted: false },
    { scope: 'RAW40-43/SVG microdetails', verdict: 'HOLD_RETAINED_UNREVIEWED', resolutionAttempted: false, rawOrSvgReadsByD222: 0, note: 'Narrow text passes do not approve RAW40-43 or SVG microdetails. D221 pixel-unchanged claim is not independently promoted here.' },
    { scope: 'SOURCE68', verdict: 'HOLD_RETAINED_UNREVIEWED', findingIds: ['D209-H1', 'D209-H2'], resolutionAttempted: false },
    { scope: 'SOURCE69 fig42 origin O/0', verdict: 'HOLD', findingIds: ['D209-H3'], resolutionAttempted: false },
    { scope: 'SOURCE69 dense first definition glyph', verdict: 'HOLD', findingIds: ['D209-H4'], resolutionAttempted: false }
  ],
  inheritedHoldFindings: original.findings.filter(item => item.outcome === 'HOLD'),
  inheritedSourceTextRepairsSeparateFromD222: { source69: 1, source70: 1, furtherRepairAuthorization: false },
  preservedMetadataCaveat: 'SOURCE70 author notes still quote R、电容, and SOURCE69 notes claim a square. These pre-existing metadata bytes are intentionally unchanged, not source authority or new D222 approval.',
  checks,
  checkSummary: { count: checks.length, passed: checks.length - failures.length, failed: failures.length },
  allExactBindings: [...bindings.values()],
  bindingCount: bindings.size,
  counters,
  reviewerWritesRestrictedTo: out,
  freezeVerification: { plannedPasses: 1, resultPath: path.join(out, 'freeze-verification.json'), semanticReviewRepeated: false },
  reviewFreeze: path.join(out, 'review-freeze.json'),
  stoppedAfterBoundedReview: true
};
const reportBinding = generate(path.join(out, 'report.json'), report);
const freeze = {
  schema: 'ld-s10y-source-review/affected-freeze@1',
  batch: 'D222',
  ticket: 'STEMROBIN-181',
  cwd,
  inputFreeze: baseline.inputFreeze,
  report: reportBinding,
  files: [...bindings.values(), reportBinding],
  bindingCount: bindings.size + 1,
  sourceApproval: false,
  scope: report.approvalScope,
  counters,
  selfHashPolicy: 'Freeze cannot bind itself; its exact bytes and SHA256 are recorded by the single freeze verification.'
};
const freezeBinding = generate(path.join(out, 'review-freeze.json'), freeze);

// Verify the finalized package once; this is an integrity check, not a second content review.
const savedFreezeBytes = fs.readFileSync(freezeBinding.path);
const savedFreeze = JSON.parse(savedFreezeBytes);
const verificationResults = savedFreeze.files.map(binding => {
  const actual = describe(binding.path, fs.readFileSync(binding.path));
  return { ...binding, outcome: isDeepStrictEqual(actual, binding) ? 'PASS' : 'FAIL', actual };
});
const verification = {
  schema: 'ld-s10y-source-review/freeze-verification@1',
  batch: 'D222',
  verificationPasses: 1,
  verifiedBindingCount: verificationResults.length,
  mismatches: verificationResults.filter(item => item.outcome !== 'PASS'),
  freeze: describe(freezeBinding.path, savedFreezeBytes),
  report: reportBinding,
  narrowBaseline: bindings.get(path.join(out, 'narrow-baseline.json')),
  outcome: verificationResults.every(item => item.outcome === 'PASS') && isDeepStrictEqual(describe(freezeBinding.path, savedFreezeBytes), freezeBinding) ? 'PASS' : 'FAIL',
  semanticReviewRepeated: false,
  counters,
  bindings: verificationResults
};
const verificationBinding = generate(path.join(out, 'freeze-verification.json'), verification);
console.log(JSON.stringify({
  verdict: report.verdict,
  affectedSource69: pageResults.find(item => item.page === 69)?.affectedVerdict,
  affectedSource70: pageResults.find(item => item.page === 70)?.affectedVerdict,
  exactFindings: findingResults.map(item => ({ id: item.id, outcome: item.outcome })),
  checks: report.checkSummary,
  freezeVerification: { outcome: verification.outcome, passes: 1, bindings: verification.verifiedBindingCount, mismatches: verification.mismatches.length },
  outputBindings: [verification.narrowBaseline, bindings.get(path.join(out, 'review.mjs')), reportBinding, freezeBinding, verificationBinding],
  counters
}, null, 2));
if (failures.length > 0 || verification.outcome !== 'PASS') process.exitCode = 1;
