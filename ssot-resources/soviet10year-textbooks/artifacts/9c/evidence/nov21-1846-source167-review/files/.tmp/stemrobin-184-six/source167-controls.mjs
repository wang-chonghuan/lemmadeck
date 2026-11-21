import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), repo);
const base = path.join(repo, '.tmp/stemrobin-184-six');
const author = path.join(base, 'source167-active');
const raw = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/9c');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const bind = file => {
  file = path.resolve(repo, file);
  const bytes = fs.readFileSync(file);
  return { path: path.relative(repo, file), bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const verify = row => {
  const actual = bind(row.path);
  assert.equal(actual.sha256, row.sha256, row.path);
  assert.equal(actual.bytes, row.bytes, row.path);
  return actual;
};
const usageFile = path.join(repo, '.intentfold/tickets/STEMROBIN-184/usage.json');
const progressFile = path.join(base, 'source-progress.json');
const usage = read(usageFile);
const progress = read(progressFile);
const source = progress.source167;
const entry = { at: new Date().toISOString(), book: '9c', page: 167,
  parentImagesOrDecodes: 0, parentBudget: 'Permanent24/24,unchanged',
  finish: 'review', completeLessonDelta: 0, sourceOrGroupComplete: false,
  previousFailuresHoldsUnknowns: 'PRESERVED', passedStageReplays: 0 };
const mode = process.argv[2];
const writeNew = (file, value) => fs.writeFileSync(file,
  JSON.stringify(value, null, 2) + '\n', { flag: 'wx', mode: 0o444 });
let suffix;
if (mode === 'author-intake') {
  assert(!source.intake);
  assert.equal(bind(path.join(author, 'manifest.json')).sha256,
    '3dc1977b5430a04d3ea19e9b74bb71c1c269e1780fb2035efebe8dd8ef8a6936');
  const manifest = read(path.join(author, 'manifest.json'));
  entry.files = manifest.files.flatMap(row => {
    if (row.kind === 'symlink') {
      const link = path.join(author, row.path);
      assert.equal(fs.readlinkSync(link), row.target);
      verify(row.target_binding);
      return [];
    }
    const current = verify({ ...row, path: path.join(author, row.path) });
    assert.equal(fs.statSync(path.join(repo, current.path)).mode & 0o777, 0o444);
    return [current];
  });
  entry.files.push(bind(path.join(author, 'manifest.json')));
  entry.stageFiles = manifest.external_stage_bindings.map(verify);
  const sealReceipt = read(manifest.sealing_receipt_external);
  assert.equal(sealReceipt.exitCode, 0);
  entry.stageFiles.push(bind(manifest.sealing_receipt_external),
    ...Object.values(sealReceipt.outputs).map(verify));
  const integrity = read(path.join(author, 'final-integrity.json'));
  integrity.runtime_references.forEach(verify);
  verify(integrity.source_original_unchanged);
  verify(integrity.source_PDF_reference);
  assert.equal(integrity.body_byte_identical_after_native, true);
  assert.equal(integrity.native_first_exit_code, 0);
  assert.deepEqual(integrity.native_audit.errors, []);
  assert.deepEqual([integrity.native_audit.lines_printed, integrity.native_audit.lines_md], [22, 22]);
  entry.agent = source.agent;
  entry.status = 'FULL_SOURCE167_AUTHOR_NATIVE22_22_PASS_INTAKEN';
  entry.fullTextConsumption = ['04b210', '473649', 'cb6155', '00eaa1'];
  entry.counts = { blocks: 13, printedRows: 22, typedRows: 22, figures: 0,
    exercises: ['375', '376', '377'], subparts: [3, 2, 2] };
  entry.actualBoundary = '47. 商的导数';
  entry.incoming = '可微分的函数。';
  entry.outgoing = '证明用w表示商u/v。这时;unit47OPEN';
  entry.mathReview = 'PENDING independent source-first solve and author-last comparison';
  entry.knownSource167Charge = 5;
  entry.knownTracked164165166167 = 29;
  entry.hiddenInternalLoads = 'UNKNOWN';
  entry.provenanceQualification = 'Child human_supplied fields are parent dispatch facts under existing human ordinary-production authority, not a new direct human prompt.';
  const output = path.join(base, 'source167-author-parent-intake.json');
  writeNew(output, entry);
  const retained = path.join(raw, 'evidence/nov21-1846-source167');
  assert(!fs.existsSync(retained));
  fs.mkdirSync(retained);
  const rows = [...entry.files, ...entry.stageFiles, bind(output)].map(row => {
    const target = path.join(retained, 'files', row.path);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(path.join(repo, row.path), target, fs.constants.COPYFILE_EXCL);
    fs.chmodSync(target, 0o444);
    assert.equal(bind(target).sha256, row.sha256);
    return { origin: row.path, path: path.relative(retained, target),
      bytes: row.bytes, sha256: row.sha256 };
  });
  writeNew(path.join(retained, 'manifest.json'), { status: entry.status,
    files: rows.length, bytes: rows.reduce((n, row) => n + row.bytes, 0), rows,
    sourcePNGAndPDFAndRuntimesReferencedNotCopied: true });
  source.intake = bind(output);
  source.retained = bind(path.join(retained, 'manifest.json'));
  source.nativeStatus = 'FIRST_PASS22_22';
  source.knownCharge = 5;
  source.status = entry.status;
  suffix = 'author_FULL_native_intake';
} else if (mode === 'author-close') {
  assert.equal(source.closed, false);
  entry.intake = verify(source.intake);
  entry.agent = source.agent;
  entry.toolReceipt = process.argv[3];
  assert(entry.toolReceipt);
  entry.status = 'ACTUALLY_CLOSED_AFTER_FULL_SOURCE167_TEXT_INTAKE';
  writeNew(path.join(base, 'source167-author-closure.json'), entry);
  source.closed = true;
  source.closure = bind(path.join(base, 'source167-author-closure.json'));
  suffix = 'author_actual_close';
} else if (mode === 'review-dispatch') {
  assert.equal(source.closed, true);
  assert(!source.review);
  entry.agent = process.argv[3];
  entry.name = process.argv[4];
  assert(entry.agent && entry.name);
  entry.status = 'ONE_INDEPENDENT_SOURCE167_REVIEW_SOURCE_FIRST_DISPATCHED';
  entry.authorReleased = false;
  entry.initialImageViewsAuthorized = 1;
  entry.batchLimit = 8;
  entry.closed = false;
  source.review = entry;
  suffix = 'independent_source_first_dispatch';
} else if (mode === 'review-stage1-intake') {
  assert.equal(source.review.closed, false);
  const reviewRoot = path.join(base, 'source167-review');
  const receipt = read(path.join(reviewRoot, 'stage1-receipt.json'));
  entry.files = ['independent.md', 'inventory.json', 'math.json', 'stage1-receipt.json']
    .map(name => bind(path.join(reviewRoot, name)));
  receipt.files.forEach(verify);
  verify(receipt.source);
  assert.equal(receipt.actualImageAccounting.nativeWholePageViewCalls, 1);
  assert.deepEqual(receipt.coverage.unresolvedGlyphs, ['U1']);
  entry.fullTextConsumption = process.argv[3];
  assert(entry.fullTextConsumption);
  entry.status = 'FULL_SOURCE167_INDEPENDENT_STAGE1_INTAKEN_HOLD_U1';
  entry.holds = [receipt.hold];
  entry.knownSource167Charge = 6;
  entry.knownTracked164165166167 = 30;
  entry.childReportedTrackedTotal = 31;
  entry.accountingQualification = 'Preserve child31 as reported. Actual known164=6,165=6,166=12,167author=5 sum29; reviewerONEview adds1 =>30. Child used prior30, an arithmetic/dispatch-provenance discrepancy, not an extra observed image operation.';
  writeNew(path.join(base, 'source167-review-stage1-parent-intake.json'), entry);
  source.review.stage1Intake = bind(path.join(base, 'source167-review-stage1-parent-intake.json'));
  source.review.authorReleased = false;
  source.review.holds = entry.holds;
  source.knownCharge = 6;
  suffix = 'independent_stage1_FULL_intake';
} else if (mode === 'review-recovery-dispatch') {
  assert(source.review.stage1Intake);
  assert.equal(source.review.authorReleased, false);
  assert(!source.review.recovery);
  entry.status = 'SOURCE167_U1_ONLY_BLIND_LOCALIZED_RECOVERY_AUTHORIZED';
  entry.agent = source.review.agent;
  entry.finding = 'U1,R13,376b,last exponent9vs3';
  entry.authorReleased = false;
  entry.authorOrAnswerDisclosure = false;
  entry.authorizedAdditionalOperations = {
    sourceDecodeForSingleTightCrop: 1, tightROIView: 1,
    fullSourceReopens: 0, otherImages: 0,
  };
  entry.knownSource167Before = 6;
  entry.knownTrackedBefore = 30;
  entry.maximumKnownSource167After = 8;
  entry.maximumKnownTrackedAfter = 32;
  source.review.recovery = { ...entry, executed: false };
  suffix = 'U1_blind_localized_recovery_dispatch';
} else if (mode === 'review-recovery-intake') {
  assert(source.review.recovery);
  assert.equal(source.review.authorReleased, false);
  const recovery = read(path.join(base, 'source167-review/u1-recovery.json'));
  entry.files = recovery.files.map(verify);
  entry.files.push(bind(path.join(base, 'source167-review/u1-recovery.json')));
  entry.fullTextConsumption = process.argv[3];
  assert(entry.fullTextConsumption);
  assert.equal(recovery.status, 'PASS_U1_SOURCE_EXPONENT9');
  assert.equal(recovery.authorRead, false);
  assert.equal(recovery.actualAdditional.sourceDecodes, 1);
  assert.equal(recovery.actualAdditional.roiViews, 1);
  assert.equal(recovery.actualAdditional.fullReopens, 0);
  recovery.preservedStage1Files.forEach(verify);
  assert.equal(recovery.literalRead.actualRoiFragment, '2x^9+x^4-3x^9.');
  assert.equal(recovery.mathematicalConsequenceAfterVisualRead.derivative, "g'(x)=4x^3-45x^8");
  entry.status = 'FULL_SOURCE167_BLIND_U1_RECOVERY_INTAKEN_EXPONENT9';
  entry.knownSource167Charge = 8;
  entry.knownTracked164165166167 = 32;
  entry.originalStage1Hold = 'PRESERVED_IN_IMMUTABLE_STAGE1_FILES';
  entry.additionalSourceFinding = recovery.additionalFindingsWithinAuthorizedRoi;
  entry.originalStage1MathFailure = recovery.failures;
  entry.corrected376bGiven = '7-2x^9+x^4-3x^9';
  entry.corrected376bDerivative = '4x^3-45x^8';
  entry.provenanceQualification = 'Child direct-human/human-supplied wording denotes parent dispatch and reported intake facts under existing human ordinary-production authority, not a new direct human prompt.';
  writeNew(path.join(base, 'source167-review-u1-parent-intake.json'), entry);
  source.review.recovery.intake = bind(path.join(base, 'source167-review-u1-parent-intake.json'));
  source.review.recovery.executed = true;
  source.knownCharge = 8;
  suffix = 'U1_blind_localized_recovery_FULL_intake';
} else if (mode === 'review-author-release') {
  assert(source.review.recovery.intake);
  assert.equal(source.review.authorReleased, false);
  entry.status = 'FIXED_AUTHOR_PACKAGE_RELEASED_FOR_ONE_ALL_ROW_ALL_OBJECT_STAGE2';
  entry.authorManifest = verify({
    path: path.join(author, 'manifest.json'), bytes: 10852,
    sha256: '3dc1977b5430a04d3ea19e9b74bb71c1c269e1780fb2035efebe8dd8ef8a6936',
  });
  entry.additionalImageOperationsAuthorized = 0;
  source.review.authorReleased = true;
  source.review.authorRelease = entry;
  suffix = 'fixed_author_stage2_release';
} else if (mode === 'review-stage2-intake') {
  assert.equal(source.review.authorReleased, true);
  assert.equal(source.review.closed, false);
  assert(!source.review.stage2Intake);
  const reviewRoot = path.join(base, 'source167-review');
  const receipt = read(path.join(reviewRoot, 'stage2-receipt.json'));
  const comparison = read(path.join(reviewRoot, 'comparison.json'));
  receipt.files.forEach(verify);
  entry.files = ['stage2-report.md', 'comparison.json', 'stage2-receipt.json']
    .map(name => bind(path.join(reviewRoot, name)));
  entry.fullTextConsumption = process.argv[3];
  assert(entry.fullTextConsumption);
  assert(['PASS', 'REVISE', 'HOLD'].includes(comparison.outcome));
  assert.equal(comparison.allRowsCompared, 22);
  assert.equal(comparison.allObjectsCompared, 13);
  assert.equal(comparison.newImagesOrDecodes, 0);
  entry.status = `FULL_SOURCE167_ONE_ALL_ROW_ALL_OBJECT_STAGE2_${comparison.outcome}_INTAKEN`;
  entry.outcome = comparison.outcome;
  entry.findings = comparison.unresolvedFindings;
  entry.originalHold = 'U1_PRESERVED_AND_RESOLVED_BY_PRIOR_BLIND_LOCALIZED_SOURCE_RECOVERY';
  entry.knownSource167Charge = 8;
  entry.knownTracked164165166167 = 32;
  writeNew(path.join(base, 'source167-review-stage2-parent-intake.json'), entry);
  source.review.stage2Intake = bind(path.join(base, 'source167-review-stage2-parent-intake.json'));
  source.review.approved = comparison.outcome === 'PASS';
  source.review.findings = comparison.unresolvedFindings;
  suffix = 'independent_stage2_FULL_intake';
} else if (mode === 'review-affected-intake') {
  assert.equal(source.review.approved, false);
  assert.equal(source.review.closed, false);
  assert(source.review.stage2Intake);
  const report = read(path.join(base, 'source167-review/affected376b.json'));
  entry.files = report.files.map(verify);
  entry.files.push(bind(path.join(base, 'source167-review/affected376b.json')));
  entry.fullTextConsumption = process.argv[3];
  assert(entry.fullTextConsumption);
  assert.equal(report.outcome, 'PASS');
  assert.equal(report.newImagesOrDecodes, 0);
  assert.deepEqual(report.unresolvedFindings, []);
  entry.status = 'FULL_SOURCE167_AFFECTED_376B_ONLY_REPAIR_PASS_INTAKEN';
  entry.originalStage2Revision = 'PRESERVED_NOT_REPLACED_OR_REPLAYED';
  writeNew(path.join(base, 'source167-review-affected-parent-intake.json'), entry);
  source.review.affectedIntake = bind(path.join(base, 'source167-review-affected-parent-intake.json'));
  source.review.approved = true;
  source.review.findings = [];
  suffix = 'affected376b_FULL_intake';
} else if (mode === 'review-close') {
  assert.equal(source.review.closed, false);
  assert.equal(source.review.approved, true);
  entry.intake = verify(source.review.affectedIntake ?? source.review.stage2Intake);
  entry.agent = source.review.agent;
  entry.toolReceipt = process.argv[3];
  assert(entry.toolReceipt);
  entry.status = 'SOURCE167_REVIEWER_ACTUALLY_CLOSED_AFTER_FULL_STAGED_INTAKES';
  writeNew(path.join(base, 'source167-review-closure.json'), entry);
  source.review.closed = true;
  source.review.closure = bind(path.join(base, 'source167-review-closure.json'));
  suffix = 'independent_actual_close';
} else if (mode === 'retain-canonical') {
  assert.equal(source.review.closed, true);
  assert.equal(source.review.approved, true);
  assert(!source.canonical);
  const target = path.join(raw, 'pages/0167');
  assert(!fs.existsSync(target));
  assert(source.review.affectedIntake);
  const repairRoot = path.join(base, 'source167-working-repair');
  const repair = read(path.join(repairRoot, 'repair-receipt.json'));
  const expected = Object.fromEntries(repair.files.filter(row =>
    ['page.md', 'page.json', 'audit.json'].includes(path.basename(row.path)))
    .map(row => [path.basename(row.path), row.sha256]));
  assert.equal(Object.keys(expected).length, 3);
  fs.mkdirSync(target);
  entry.files = Object.entries(expected).map(([name, sha256]) => {
    const input = path.join(repairRoot, name);
    assert.equal(bind(input).sha256, sha256);
    const destination = path.join(target, name);
    fs.copyFileSync(input, destination, fs.constants.COPYFILE_EXCL);
    fs.chmodSync(destination, 0o444);
    return verify({ path: destination, sha256, bytes: bind(input).bytes });
  });
  const retained = path.join(raw, 'evidence/nov21-1846-source167-review');
  assert(!fs.existsSync(retained));
  fs.mkdirSync(retained);
  const rows = new Map();
  const include = file => {
    const row = bind(file);
    rows.set(row.path, row);
  };
  for (const name of ['stage1', 'u1', 'stage2', 'affected']) {
    const file = path.join(base, `source167-review-${name}-parent-intake.json`);
    include(file);
    read(file).files.forEach(row => include(row.path));
  }
  include(path.join(base, 'source167-review-closure.json'));
  include(path.join(base, 'source167-controls.mjs'));
  include(path.join(repairRoot, 'repair-receipt.json'));
  repair.files.forEach(row => include(row.path));
  for (const name of ['u1-recovery.json', 'stage2-receipt.json']) {
    read(path.join(base, 'source167-review', name)).files.forEach(row => include(row.path));
  }
  const retainedRows = [...rows.values()].map(row => {
    const destination = path.join(retained, 'files', row.path);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(path.join(repo, row.path), destination, fs.constants.COPYFILE_EXCL);
    fs.chmodSync(destination, 0o444);
    assert.equal(bind(destination).sha256, row.sha256);
    return { origin: row.path, path: path.relative(retained, destination),
      bytes: row.bytes, sha256: row.sha256 };
  });
  writeNew(path.join(retained, 'manifest.json'), {
    status: 'SOURCE167_STAGED_REVIEW_PASS_ORIGINAL_HOLD_PRESERVED',
    files: retainedRows.length, rows: retainedRows,
    bytes: retainedRows.reduce((sum, row) => sum + row.bytes, 0),
    sourcePNGAndPDFAndRuntimesReferencedNotCopied: true,
    knownSource167Charge: 8, knownTracked164165166167: 32,
    originalChild31PreservedWithParentArithmeticQualification: true,
  });
  entry.status = 'SOURCE167_CANONICAL_RETAINED_FROM_FIRST_NATIVE_NO_REPLAY';
  entry.reviewRetention = bind(path.join(retained, 'manifest.json'));
  entry.nativeReplays = 0;
  writeNew(path.join(base, 'source167-canonical-retention.json'), entry);
  source.canonical = bind(path.join(base, 'source167-canonical-retention.json'));
  source.review.retained = entry.reviewRetention;
  source.status = entry.status;
  suffix = 'canonical_retention';
} else {
  throw new Error('Explicit supported control mode required');
}
const key = `nov21_1846_source167_${suffix}`;
assert(!Object.hasOwn(usage, key));
usage[key] = entry;
progress.observed_at = entry.at;
fs.writeFileSync(usageFile, JSON.stringify(usage, null, 2) + '\n');
fs.writeFileSync(progressFile, JSON.stringify(progress, null, 2) + '\n');
console.log(JSON.stringify({ status: entry.status, mode, parentImagesOrDecodes: 0,
  completeLessonDelta: 0, files: entry.files?.length, closed: source.closed }));
