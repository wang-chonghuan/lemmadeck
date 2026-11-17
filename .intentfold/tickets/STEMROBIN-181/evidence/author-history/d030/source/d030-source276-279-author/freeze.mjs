import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const out = path.dirname(import.meta.filename);
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: path.relative(root, path.resolve(file)), bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const check = entry => assert.equal(bind(entry.path).sha256, entry.sha256, entry.path);
const bindings = read(path.join(out, 'input-bindings.json'));
[...bindings.inputs, bindings.savedNativeHelper, bindings.capture].forEach(check);
check(bindings.incomingTextOnly.snapshot);
const started = read(path.join(out, 'native/count.started.json'));
started.inputs.forEach(check);
const counts = read(path.join(out, 'native/count.stdout.txt'));
const opens = read(path.join(out, 'image-opens.json'));
assert.equal(opens.entries.length, 8);
assert.equal(opens.sourceOpens, 4);
opens.entries.forEach(check);
const initialBindings = read(path.join(out, 'bindings.initial.json'));
assert.equal(initialBindings.pages.filter(page => page.status === 'fail').length, 1);
const repair = read(path.join(out, 'repairs/0279.metadata-repair.json'));
assert.equal(repair.status, 'pass');
assert.equal(repair.repairAttempt, 1);
assert.equal(repair.bodyByteIdentical, true);
[repair.original, repair.frozenInitial, repair.candidate, repair.stdout, repair.stderr,
  repair.stdin, repair.started].forEach(check);
const observations = read(path.join(out, 'source-observations.json'));
const pages = counts.pages.map(item => {
  const stem = String(item.pdf_page).padStart(4, '0');
  const initial = bind(item.candidate);
  const frozen = bind(path.join(out, 'snapshots/candidates', `${stem}.page.md`));
  assert.equal(initial.sha256, frozen.sha256);
  const prepared = read(path.join(out, `prepare-${item.pdf_page}.command.json`));
  assert.equal(prepared.exitCode, 0);
  assert.equal(prepared.nativePrepareInvocations, 1);
  prepared.outputs.forEach(entry => {
    check(entry);
    check(entry.snapshot);
    assert.equal(entry.sha256, entry.snapshot.sha256);
  });
  fs.chmodSync(path.resolve(initial.path), 0o444);
  return {
    pdfPage: item.pdf_page, printedPage: item.pdf_page - 9,
    initialCandidate: initial, frozenInitial: frozen,
    reviewCandidate: item.pdf_page === 279 ? repair.candidate : initial,
    originMetadata: item.pdf_page === 279 ? repair.verified : initialBindings.pages.find(p => p.page === item.pdf_page),
    sourceImage: bind(item.source_png), sourceAndLayoutSnapshots: prepared.outputs,
    candidateRows: item.candidate_rows, nativeRows: item.native_masked_rows,
    difference: item.native_minus_candidate, nativeCountMatches: item.native_count_matches_candidate,
    countStatus: item.native_count_matches_candidate ? 'match-not-SOURCE-approval' : 'HOLD',
    nativeBands: item.native_masked_bands, figures: item.figures, blocks: item.blocks,
    originalRowCountReceipt: bind(path.join(out, 'native/count.stdout.txt')),
    ...(item.pdf_page === 279 ? { metadataRepair: bind(path.join(out, 'repairs/0279.metadata-repair.json')) } : {}),
    authorObservations: observations.pages.find(page => page.page === item.pdf_page),
  };
});
const auxiliary = [
  'capture.mjs', 'details.py', 'bindings.mjs', 'freeze.mjs', 'image-opens.template.json',
  ...['0276', '0277', '0278', '0279'].map(page => `details/${page}.detail.json`),
].map(file => bind(path.join(out, file)));
const report = {
  schema: 'ld-s10y-source-author-freeze@1',
  ticket: 'STEMROBIN-181', batch: 'd030-source276-279-author',
  status: 'AUTHOR-FROZEN-COUNT-HOLD-NOT-SOURCE-PASS',
  frozenAt: new Date().toISOString(), cwd: root,
  independentReviewRequired: true, sourceApproval: false,
  inputBindings: bind(path.join(out, 'input-bindings.json')),
  observations: bind(path.join(out, 'source-observations.json')),
  imageLedger: bind(path.join(out, 'image-opens.json')),
  sourceImageOpens: 4, detailImageOpens: 4, totalContextImageOpens: 8,
  originalPrepareCommands: [276, 277, 278, 279].map(page => bind(path.join(out, `prepare-${page}.command.json`))),
  nativePrepareInvocations: 4,
  nativeInitialBatchCountInvocations: 1, nativeAffectedRepairCountInvocations: 1,
  nativeTotalCountInvocations: 2,
  initialNativeCountCommand: bind(path.join(out, 'native/count.command.json')),
  initialNativeCountStdout: bind(path.join(out, 'native/count.stdout.txt')),
  initialNativeCountStderr: bind(path.join(out, 'native/count.stderr.txt')),
  initialMetadataBindingReceipt: bind(path.join(out, 'bindings.initial.json')),
  repairs: [bind(path.join(out, 'repairs/0279.metadata-repair.json'))],
  unresolvedCountPages: [278], nativeMatchingPages: [276, 277, 279],
  pages, incomingText: observations.incomingText, outgoingText: observations.outgoingText,
  uncertainties: observations.uncertainties, auxiliary,
  immutableOriginalDrafts: true, failedReceiptsPreserved: true,
  figureCropsWritten: 0, finalizedPages: 0, vectorization: false, sourceBookAssembly: false,
  durableWrites: 0, modernGeneration: false, indexOrMeterWrites: false,
  databaseAccess: false, gitCommands: 0, gitWrites: false, testsOrBuilds: false,
  existingToolEdits: false, newDependencies: false, modelServiceCalls: 0,
  imagePayloadReturned: false,
  allowedWriteRoots: bindings.allowedWriteRoots,
};
const file = path.join(out, 'author-freeze.json');
fs.writeFileSync(file, `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' });
fs.chmodSync(file, 0o444);
console.log(JSON.stringify(bind(file), null, 2));
