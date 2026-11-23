import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, statSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const own = path.dirname(fileURLToPath(import.meta.url));
const tmp = path.dirname(own);
const repo = path.resolve(tmp, '../../../..');
const prior = path.join(tmp, 'source159160-independent-review-10');
const author = path.join(tmp, 'source6g159160-author-first-09');
const repair = path.join(tmp, 'source159-period-repair-11');
const pagePath = (root, page, file) => path.join(root, `artifacts/6-8g/pages/0${page}/${file}`);
const inputs = [];
const checked = new Map();
const sha = bytes => createHash('sha256').update(bytes).digest('hex');

function read(file, role, expectedSha256, expectedMode) {
  assert(!/\.(png|jpe?g|webp|gif|pdf)$/i.test(file), 'No image/PDF bytes may be read');
  if (checked.has(file)) return checked.get(file);
  const bytes = readFileSync(file);
  const stat = statSync(file);
  const binding = {
    path: file, sha256: sha(bytes), bytes: bytes.length,
    mode: (stat.mode & 0o777).toString(8).padStart(4, '0'), role,
  };
  if (expectedSha256) {
    binding.expectedSha256 = expectedSha256;
    binding.match = binding.sha256 === expectedSha256;
    assert(binding.match, `Hash drift: ${file}`);
  }
  if (expectedMode) assert.equal(binding.mode, expectedMode, `Mode drift: ${file}`);
  inputs.push(binding);
  const result = { binding, text: bytes.toString('utf8') };
  checked.set(file, result);
  return result;
}
const json = (file, role, expected, mode) => JSON.parse(read(file, role, expected, mode).text);
const bindingFor = file => checked.get(file).binding;

assert.equal(repo, '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck');
for (const name of ['bindings.json', 'report.json', 'manifest.json']) {
  assert(!existsSync(path.join(own, name)), `Preserve existing output: ${name}`);
}
const priorReport = json(path.join(prior, 'report.json'), 'completed-independent-review',
  'ae0ae17e6c81a0434e70407e132491e4b04cf8ad8812c5cdfd988eedd559a6db', '0444');
const first = read(path.join(prior, 'FIRST.md'), 'REUSED_FROZEN_FIRST_NOT_NEW_OBSERVATION',
  '909a2446357bfb340af1e868841e8f17e1c01ae7efb6ad1c474a02265733e89c', '0444');
const priorBindings = json(path.join(prior, 'bindings.json'), 'prior-text-and-image-binding-record',
  priorReport.receiptReception.bindingRecord.sha256);
read(path.join(prior, 'manifest.json'), 'completed-independent-manifest', undefined, '0444');
for (const relative of [
  '.intentfold/readme.md', '.intentfold/project.json', '.intentfold/charter/product.md',
  '.intentfold/charter/engineering.md', '.intentfold/charter/operations.md',
  '.claude/skills/ld-s10y-lesson/references/production-resume.md',
]) read(path.join(repo, relative), 'routed-rules-read');
assert(priorReport.reviewCompleted);
assert(first.text.includes('445**. 不利用平行公理'));
const defect = priorReport.defects.find(item => item.id === '159-ex445-printed-period');
assert(defect.observed.includes('separate low printed period'));
assert.equal(defect.starIdentityAndRole, 'UNKNOWN');

const record = json(path.join(repair, 'record.json'), 'author-repair-record');
const staging = json(path.join(repair, 'staging.json'), 'historical-copy-time-staging-record');
assert.equal(staging.review.sha256, bindingFor(path.join(prior, 'report.json')).sha256);
assert.equal(record.onlyLeaf, '/blocks/3/lines/0');
assert.equal(staging.onlyLeaf, record.onlyLeaf);
const beforeFile = pagePath(author, 159, 'page.json');
const afterFile = pagePath(repair, 159, 'page.json');
assert.equal(record.before.path, beforeFile);
assert.equal(record.after.path, afterFile);
const before = json(beforeFile, 'before159-structured-candidate',
  '503a68dae0e3668647830429e6f9dfe870bf840727afe7ab6b7a966dc53e188b');
const after = json(afterFile, 'current159-repaired-structured-candidate', record.after.sha256);
const changes = [];
function compare(a, b, pointer = '') {
  if (Object.is(a, b)) return;
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    assert.equal(Array.isArray(a), Array.isArray(b), `Container drift: ${pointer}`);
    assert.deepEqual(Object.keys(a), Object.keys(b), `Key/order drift: ${pointer}`);
    if (Array.isArray(a)) assert.equal(a.length, b.length, `Array drift: ${pointer}`);
    for (const key of Object.keys(a)) {
      const escaped = key.replace(/~/g, '~0').replace(/\//g, '~1');
      compare(a[key], b[key], `${pointer}/${escaped}`);
    }
  } else changes.push({ pointer, before: a, after: b });
}
compare(before, after);
assert.equal(changes.length, 1);
assert.equal(changes[0].pointer, '/blocks/3/lines/0');
assert(changes[0].before.startsWith('445** 不利用'));
assert.equal(changes[0].after, changes[0].before.replace('445** 不利用', '445**. 不利用'));
assert.equal(changes[0].after.length - changes[0].before.length, 1);
assert.equal(changes[0].after.charCodeAt(5), 0x2e);
const oldExpected = file => {
  const entry = priorBindings.inputs.find(item => item.path === file);
  assert(entry?.sha256, `Missing prior binding: ${file}`);
  return entry.sha256;
};
const beforeMdFile = pagePath(author, 159, 'page.md');
const afterMdFile = pagePath(repair, 159, 'page.md');
const beforeMd = read(beforeMdFile, 'before159-markdown', oldExpected(beforeMdFile));
const afterMd = read(afterMdFile, 'current159-repaired-markdown');
assert.equal(beforeMd.text.split('445** 不利用').length, 2);
assert.equal(afterMd.text, beforeMd.text.replace('445** 不利用', '445**. 不利用'));
const prefinalize = read(path.join(repair, '0159.prefinalize.md'),
  'frozen-repaired-prefinalize-markdown', afterMd.binding.sha256, '0444');
const auditBeforeFile = pagePath(author, 159, 'audit.json');
const auditAfterFile = pagePath(repair, 159, 'audit.json');
const auditBefore = json(auditBeforeFile, 'prior159-native-audit', oldExpected(auditBeforeFile));
const auditAfter = json(auditAfterFile, 'current159-native-audit', oldExpected(auditBeforeFile));
assert.deepEqual(auditAfter, auditBefore);
assert.equal(auditAfter.page, 159);
assert.deepEqual([auditAfter.lines_md, auditAfter.lines_printed], [24, 24]);
assert.deepEqual(record.rows, [24, 24]);
for (const field of ['figures', 'normalizations', 'unknown_chars', 'katex_warnings', 'count_exclusions', 'errors']) {
  assert.deepEqual(auditAfter[field], []);
}
assert.equal(auditAfter.errata, 0);
const layoutBefore = path.join(author, 'work/6-8g/pages/0159/layout.json');
const layoutAfter = path.join(repair, 'work/6-8g/pages/0159/layout.json');
const layoutMapping = staging.mappings.find(item => item.source.path === layoutBefore);
assert(layoutMapping);
read(layoutBefore, 'unchanged-before159-layout', layoutMapping.source.sha256);
read(layoutAfter, 'unchanged-current159-layout', layoutMapping.source.sha256);

// Copy-time target hashes are historical; current bindings come from the files.
const stagingTargets = staging.mappings.filter(item => !item.target.path.endsWith('.png')).map(item => {
  assert.equal(bindingFor(item.source.path).sha256, item.source.sha256);
  const actual = bindingFor(item.target.path);
  const changed = item.target.path === afterFile || item.target.path === afterMdFile;
  assert.equal(actual.sha256 !== item.target.sha256, changed);
  return {
    path: item.target.path, copyTimeSha256: item.target.sha256, currentSha256: actual.sha256,
    disposition: changed ? 'HISTORICAL_PRE_REPAIR_HASH_NOT_CURRENT' : 'UNCHANGED_CURRENT_HASH_MATCH',
  };
});
function receive(file, expected, page, root, work, exitCode, role) {
  const receipt = json(file, role, expected);
  assert.equal(receipt.cwd, repo);
  assert.deepEqual(receipt.argv, [
    '.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'finalize',
    '--book', '6-8g', '--page', String(page),
    '--root', path.join(root, 'artifacts'), '--work', path.join(work, 'work'),
    '--books', path.join(repo, 'ssot-resources/soviet10year-textbooks/sources'),
  ]);
  assert.equal(receipt.exitCode, exitCode);
  assert.equal(receipt.signal, null);
  assert.equal(receipt.error, null);
  assert(Date.parse(receipt.finishedAt) >= Date.parse(receipt.startedAt));
  const streams = {};
  for (const name of ['stdout', 'stderr']) {
    const declared = receipt.streams[name];
    assert(declared?.path && declared?.sha256, `Missing actual ${name}`);
    const actual = read(declared.path, `${role}-${name}`, declared.sha256);
    if (declared.bytes !== undefined) assert.equal(actual.binding.bytes, declared.bytes);
    streams[name] = { ...actual.binding, text: actual.text };
  }
  assert.equal(streams.stderr.bytes, 0);
  assert(streams.stdout.text.includes(`p0${page}:`));
  return {
    receipt: bindingFor(file), cwd: receipt.cwd, argv: receipt.argv,
    startedAt: receipt.startedAt, finishedAt: receipt.finishedAt,
    exitCode: receipt.exitCode, signal: receipt.signal, error: receipt.error,
    streams, receivedNotRerun: true, producerInvocationsByReviewer: 0,
  };
}
assert.equal(record.nativeReceipt.path, path.join(repair, 'finalize.execution.json'));
const native = receive(record.nativeReceipt.path, record.nativeReceipt.sha256, 159,
  repair, repair, 0, 'actual-repair159-native-finalize-receipt');
const old159File = path.join(author, 'evidence/finalize-0159/execution.json');
const old159 = receive(old159File, oldExpected(old159File), 159,
  author, author, 0, 'prior159-native-finalize-receipt');
assert.equal(native.streams.stdout.sha256, old159.streams.stdout.sha256);
assert(native.streams.stdout.text.includes('24'));
for (const file of ['page.md', 'page.json', 'audit.json']) {
  const target = pagePath(author, 160, file);
  read(target, 'unchanged160-textual-artifact-prior-pass-reused', oldExpected(target));
}
const page160 = JSON.parse(checked.get(pagePath(author, 160, 'page.json')).text);
assert(page160.blocks[4].lines[0].includes('\u25bc'));
assert.equal(page160.blocks[6].open, true);
assert(page160.blocks[6].lines.at(-1).endsWith('这些类就是'));
const audit160 = JSON.parse(checked.get(pagePath(author, 160, 'audit.json')).text);
assert.equal(audit160.unknown_chars.length, 1);
assert.equal(audit160.unknown_chars[0].codepoint, 'U+25BC');
assert.equal(audit160.errors.length, 1);
const old160File = path.join(author, 'evidence/finalize-0160/execution.json');
const old160 = receive(old160File, oldExpected(old160File), 160,
  author, author, 1, 'preserved160-failed-native-finalize-receipt');
assert.equal(priorReport.verdicts.table160, 'PASS_ALL_HEADERS_AND_15_DATA_CELLS');
assert.equal(priorReport.verdicts.figure213, 'PASS_EIGHT_TRAJECTORIES_TWO_ARRAYS_SHARED_CAPTION');
assert.equal(priorReport.actualBoundaries.actual33Right.verdict, 'PASS');

const timestamp = new Date().toISOString();
const report = {
  schema: 'independent-affected-source-review@1', ticket: 'STEMROBIN-188',
  assignment: 'SAME188-6 OFFLINE narrow affected source review',
  role: 'SOLE_INDEPENDENT_REVIEWER', createdAt: timestamp,
  status: 'SOURCE159_PERIOD_AFFECTED_PASS_SOURCE160_MECHANICAL_FAIL_HOLDS_PRESERVED',
  reviewCompleted: true, wholeLessonApproved: false, source160FinalizationApproved: false,
  scope: {
    own, book: '6-8g', physicalPage: 159, printedPage: 149,
    defectId: defect.id, onlyLeaf: record.onlyLeaf,
    authority: 'Latest direct human offline instruction; no backend/network read',
    basis: 'Completed independent report and frozen FIRST reused; no fresh pixel observation',
  },
  reusedIndependentEvidence: {
    report: bindingFor(path.join(prior, 'report.json')),
    manifest: bindingFor(path.join(prior, 'manifest.json')),
    FIRST: { ...first.binding, reused: true, newFIRSTCreated: false, modified: false },
    originalDefect: defect,
    originalImageEvidence: {
      ...defect.evidence, bindingSource: 'sha-bound completed independent report',
      bytesReadOrHashedHere: false, viewedHere: false, recapturedHere: false,
    },
    originalReportRemainsHistoricalFail: true,
  },
  affectedRepair: {
    verdict: 'PASS_LITERAL_LOW_PRINTED_PERIOD_OMISSION_REPAIRED_ONLY',
    clearedDefectId: defect.id,
    before: bindingFor(beforeFile), after: bindingFor(afterFile), changes,
    insertedCodepoint: 'U+002E', insertionCount: 1,
    otherStructuredLeavesAndContainersUnchanged: true,
    metadataBlockOrderLabelsRowsOwnershipOpenContSamerowUnchanged: true,
    readable159UnchangedExceptPeriod: 'PRIOR_PASS_REUSED_NOT_RE_REVIEWED_FROM_PIXELS',
    markdown: {
      before: beforeMd.binding, after: afterMd.binding, prefinalize: prefinalize.binding,
      onlyLiteralPeriodInsertion: true, finalizedMatchesPrefinalizeBytes: true,
    },
    stagingTargetHashDisposition: stagingTargets,
    stagingImageMapping: 'DECLARED_ONLY_NOT_OPENED_OR_HASHED; NO_NEW_IMAGE_BINDING',
    contentRevisionsReceived: record.contentRevisions,
  },
  mechanical159: {
    verdict: 'PASS_ACTUAL_COMPLETED_NATIVE_RECEIPT_RECEIVED_NOT_RERUN',
    native, priorNative: old159,
    audit: bindingFor(auditAfterFile), existingAuditUnchanged: true, rows: [24, 24],
    errors: [], unknownCharacters: [], formulaWarnings: [], countExclusions: [],
    receiptCandidateBinding: {
      record: bindingFor(path.join(repair, 'record.json')),
      after: bindingFor(afterFile), prefinalize: prefinalize.binding,
      route: 'Actual argv selects repair159 artifact/work roots; repair record binds current JSON and receipt; frozen prefinalize equals current MD',
      limitation: 'Receipt itself has no input/output snapshot hashes; record plus actual file and stream hashes bind reception. No claim of a fresh native run or independent invocation-time attestation.',
    },
  },
  preservedEvidence: {
    source160ReadableContent: 'PRIOR_PASS_REUSED_TEXT_HASHES_UNCHANGED',
    table160: priorReport.table,
    figure213: priorReport.figure213,
    imageEvidenceDisposition: 'ALL_IMAGE_HASHES_AND_PIXEL_VERDICTS_INHERITED_FROM_COMPLETED_REPORT; ZERO_IMAGE_BYTES_READ_HERE',
    actual33RightBoundary: priorReport.actualBoundaries.actual33Right,
    section33LeftBoundaryOrWholeClosureApproved: false,
    mechanical160: {
      verdict: 'FAIL_U+25BC_ONLY_PRESERVED', audit: bindingFor(pagePath(author, 160, 'audit.json')),
      native: old160, originalDefect: priorReport.defects.find(item => item.id === '160-U25BC-mechanical'),
      readablePassDoesNotClearMechanicalFailure: true,
    },
    allOriginalHolds: priorReport.holds,
    raised445StarCount: 2, raised445StarIdentity: 'UNKNOWN', raised445StarRole: 'UNKNOWN',
    originalRelationGlyphIdentity: 'UNKNOWN', originalDownwardMarkIdentityAndRole: 'UNKNOWN',
    outgoing160: { open: true, ending: '这些类就是', nextPageText: 'UNKNOWN', topic34RightClosure: 'UNKNOWN' },
  },
  authorizationAndPreservation: {
    writtenOnlyWithinOwnDirectory: true, preservedOthers: true, sourceEdits: 0,
    nativeProducerFinalizerRendererCalls: 0, imageLoads: 0, imageBytesRead: 0,
    pixelChecks: 0, sourceRecaptures: 0, newFIRST: false, paidCalls: 0, networkCalls: 0,
    countChanges: 0, toolChanges: 0, whitelistChanges: 0, charterChanges: 0,
    appChanges: 0, envChanges: 0, DBCalls: 0, commits: 0,
    modernFiguresAnswersLessonCompletionApproved: false, dependentStagesStarted: false,
    failed160ReceiptAndValidOutputsUnmodified: true,
  },
  execution: {
    nativeReceiptsCompleted: true, reviewerCheck: 'ALL_ASSERTIONS_PASS',
    completion: 'Synchronous read-only verification; output files only in owned review directory',
    activeExecSessions: [], image0: true,
  },
};

function output(name, object) {
  const file = path.join(own, name);
  const bytes = Buffer.from(`${JSON.stringify(object, null, 2)}\n`);
  writeFileSync(file, bytes, { flag: 'wx', mode: 0o444 });
  return { path: file, sha256: sha(bytes), bytes: bytes.length, mode: '0444' };
}
read(fileURLToPath(import.meta.url), 'reviewer-local-verification-script');
for (const input of inputs) {
  assert.equal(sha(readFileSync(input.path)), input.sha256, `Input changed during review: ${input.path}`);
}
const bindings = output('bindings.json', {
  schema: 'affected-source-review-bindings@1', createdAt: timestamp, own,
  status: 'ALL_TEXT_HASHES_STRUCTURAL_DIFF_AND_NATIVE_RECEIPT_BINDINGS_PASS',
  inputs, stagingTargets, imageFilesReadOrHashed: 0, nativeCommandsExecuted: 0,
});
report.bindings = bindings;
const reportOutput = output('report.json', report);
const manifestOutput = output('manifest.json', {
  schema: 'affected-source-review-manifest@1', ticket: 'STEMROBIN-188', createdAt: timestamp, own,
  status: report.status, report: reportOutput, bindings, inputs,
  nativeReceiptBindings: [native, old159, old160],
  inheritedImageBindings: {
    provenance: bindingFor(path.join(prior, 'report.json')),
    newImageReadsOrHashes: 0,
    references: [defect.evidence, priorReport.table.sourceCrop, priorReport.figure213.sourceCrop],
  },
  noNewFIRST: true, source160FinalizationApproved: false, wholeLessonApproved: false,
  image0: true, activeExecSessions: [],
});
console.log(JSON.stringify({
  verdict: report.status, report: reportOutput, manifest: manifestOutput, bindings,
  changedStructuredLeaves: changes.map(item => item.pointer),
  imageLoads: 0, imageBytesRead: 0, nativeProducerCalls: 0, activeExecSessions: [],
}, null, 2));
