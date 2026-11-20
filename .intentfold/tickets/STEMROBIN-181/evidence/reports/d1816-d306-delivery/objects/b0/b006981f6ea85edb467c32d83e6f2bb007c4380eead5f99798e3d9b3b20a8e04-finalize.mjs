import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const out = path.dirname(fileURLToPath(import.meta.url));
assert.equal(out, path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d282-fig26-author'));
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({ path: path.resolve(file), sha256: sha(file) });
const read = file => JSON.parse(fs.readFileSync(path.join(out, file), 'utf8'));
const write = (file, payload) => fs.writeFileSync(path.join(out, file), JSON.stringify(payload, null, 2) + '\n', { flag: 'wx' });
const inventory = read('inventory.json');
const inputs = read('inputs.json');
const context = read('context.json');
const spec = read('fig-26.repair.spec.json');
const render = read('fig-26.repair.render.json');
const preview = read('fig-26.repair.preview.json');
const observation = read('final-observation.json');
const repair = read('content-repair.json');
const protectedInputs = [inputs.source, ...inputs.templates, ...inputs.contracts];
const inputsNow = protectedInputs.map(row => ({
  ...row, currentSha256: sha(row.path), unchanged: row.sha256 === sha(row.path),
}));
assert(inputsNow.every(row => row.unchanged), 'Read-only input drift: hold; do not silently rebind.');
const fullText = inputs.templates.flatMap(row => JSON.parse(fs.readFileSync(row.path)).prose
  .filter(block => block.kind !== 'fig').map(block => ({ lesson: 'phy10-c1-s3-n17', text: block.text })));
assert.deepEqual(spec.source.authoritativeText, fullText);
assert.deepEqual(context.authoritativeText, fullText);
assert.equal(fullText.length, 24);
assert.equal(spec.source.image.sha256, inputs.source.sha256);
assert.equal(inventory.source.sha256, inputs.source.sha256);
assert.equal(render.status, 'pass');
assert.equal(preview.status, 'pass');
assert.equal(render.spec.sha256, sha(path.resolve(render.spec.path)));
assert.equal(render.output.svg.sha256, sha(path.resolve(render.output.svg.path)));
assert.equal(preview.preview.sha256, sha(preview.preview.path));
assert.equal(observation.previewSha256, preview.preview.sha256);
assert.equal(observation.specSha256, render.spec.sha256);
assert.equal(repair.repairCount, 1);
assert(render.displayChecks.every(row => row.status === 'pass' && row.measuredMinPx >= 16));
const ledger = {
  schema: 'd282/image-ledger@1', batch: 'd1816-d282-fig26-author',
  totalImageOpens: 3, maximumAuthorized: 4, paidCalls: 0,
  images: [
    { sequence: 1, role: 'original-before-inventory', ...inputs.source, tool: 'functions.view_image', opens: 1 },
    { sequence: 2, role: 'first-preview-420-and-331', ...bind(path.join(out, 'fig-26.preview.png')), tool: 'functions.view_image', opens: 1 },
    { sequence: 3, role: 'affected-label-repair-preview-420-and-331', ...bind(path.join(out, 'fig-26.repair.preview.png')), tool: 'functions.view_image', opens: 1 },
  ],
  sourceReopens: 0, crops: 0, otherImagesLoaded: 0,
  screenshotsCreated: 2,
  previewTechnicalRecovery: 'The first Chromium PNG survived the missing pngjs statistics failure. It was reused unchanged; Pillow checked its pixels. No Resvg preview or blank PNG was produced.',
  programmaticPixelChecksAreNotImageContextLoads: true,
  imagePayloadReturnedToUser: false,
};
write('image-ledger.json', ledger);

const closingCall = 'd282-finalize-freeze';
const calls = fs.readdirSync(path.join(out, 'native')).sort().filter(name => name !== closingCall)
  .map(name => {
    const receiptPath = path.join(out, 'native', name, 'receipt.json');
    const row = JSON.parse(fs.readFileSync(receiptPath));
    return { ...row, receipt: bind(receiptPath), stdout: bind(path.join(out, 'native', name, 'stdout.txt')), stderr: bind(path.join(out, 'native', name, 'stderr.txt')) };
  });
const receipts = new Map(calls.map(row => [row.name, row]));
for (const name of [
  'd282-author-first', 'd282-validate-first', 'd282-render-short-arrow-recovery',
  'd282-one-targeted-label-repair', 'd282-validate-affected-repair',
  'd282-render-affected-label-repair', 'd282-preview-affected-label-repair',
]) assert.equal(receipts.get(name)?.exitCode, 0);
assert.equal(receipts.get('d282-render-first')?.exitCode, 1);
assert.equal(receipts.get('d282-render-technical-recovery')?.exitCode, 1);
assert.equal(receipts.get('d282-preview-first-unchanged-svg')?.exitCode, 1);
const selected = {
  inventory: bind(path.join(out, 'inventory.json')),
  context: bind(path.join(out, 'context.json')),
  spec: bind(path.join(out, 'fig-26.repair.spec.json')),
  svg: bind(path.join(out, 'fig-26.repair.svg')),
  render: bind(path.join(out, 'fig-26.repair.render.json')),
  preview: bind(path.join(out, 'fig-26.repair.preview.png')),
  previewReport: bind(path.join(out, 'fig-26.repair.preview.json')),
  observation: bind(path.join(out, 'final-observation.json')),
  imageLedger: bind(path.join(out, 'image-ledger.json')),
};
const report = {
  schema: 'd282/first-apparatus-author-report@1',
  ticket: 'STEMROBIN-181', book: '10p', lesson: 'phy10-c1-s3-n17', figure: 'fig-26',
  status: 'authored-candidate-frozen-independent-review-not-run',
  workspace: repo, ownedDirectory: out, selected,
  route: { mode: 'deterministic', purpose: 'instructional', paidCalls: 0, routing: bind(path.join(out, 'routing.json')) },
  authoritativeText: {
    sourceTemplates: inputs.templates, nonfigEntriesPerEdition: [12, 12], totalEntries: fullText.length,
    exactFullTextBindingVerified: true, contentSha256: context.authoritativeTextSha256,
    captionsAndFootnoteIncluded: true, sourceForcedInductionExplanationRetained: true,
  },
  inputPreservation: { files: inputsNow, allUnchanged: true, externalInputsCopied: false },
  display: {
    layout: 'inline', purpose: 'instructional', maxWidthPx: 420, widths: [420, 331],
    requiredMinTextPx: 16, native: render.displayChecks,
    isolatedChromiumLabels: preview.previews.map(row => ({ width: row.width, labels: row.geometry.labels })),
    pixelChecks: preview.pixels, networkRequests: preview.requests,
    headedProductSurfaceMeasured: false,
    limit: 'Author SVG-only preview uses the explicitly required 420/331px media widths; no product server, database or full lesson acceptance was requested or run.',
  },
  nativeOutcome: {
    draftValidation: 'pass', selectedRender: render.status, unchangedSvgPreview: preview.status,
    objects: render.objects, labels: render.labels, assertions: spec.assertions.length,
    nativeRenderAttempts: 4, successfulGeometryRenders: 2,
    technicalRenderFailures: 2, contentRepairCount: 1,
    failedRenderReceipts: ['d282-render-first', 'd282-render-technical-recovery'].map(name => receipts.get(name).receipt),
    markerDiagnosis: bind(path.join(out, 'native/d282-diagnose-short-arrow-marker/stdout.txt')),
    markerRecovery: bind(path.join(out, 'native-recovery2.json')),
    previewStatisticsFailure: receipts.get('d282-preview-first-unchanged-svg').receipt,
    reusedFirstPngRecovery: receipts.get('d282-preview-retained-png-recovery').receipt,
    readCommandFailure: receipts.get('d282-read-prior-fault-context').receipt,
    firstVisualFailurePreserved: bind(path.join(out, 'first-observation.json')),
    contentRepair: bind(path.join(out, 'content-repair.json')),
    finalClosingReceipt: path.join(out, 'native', closingCall, 'receipt.json'),
    closingReceiptIsWrittenAfterSnapshot: true,
  },
  imageLedger: ledger,
  semanticLimits: observation.remainingInterpretationLimits,
  artifactsAreCandidatesNotApproval: true,
  reviewAt1Created: false, promotionPerformed: false, canonicalSourceModified: false,
  manifestsModified: false, databaseOpened: false, published: false, gitRun: false,
  projectWideTestsRun: false, otherAgentsOrChatsUsed: false, paidGenerationCalls: 0,
  modificationsOutsideOwnedDirectory: false,
  freeze: {
    path: path.join(out, 'freeze.json'),
    convention: 'Hash-bound, read-only owned artifacts and completed native call files; originals and external dependencies referenced by hash rather than duplicated.',
  },
  nativeCallsBeforeClosing: calls,
};
write('report.json', report);

const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(item => {
  const file = path.join(dir, item.name);
  if (file === path.join(out, 'native', closingCall)) return [];
  return item.isDirectory() ? walk(file) : [file];
});
const files = walk(out).sort();
const freeze = {
  schema: 'd282/author-freeze@1', ticket: 'STEMROBIN-181', figure: 'fig-26',
  state: 'candidate-only-not-review-pass', ownedDirectory: out,
  selected, report: bind(path.join(out, 'report.json')), inputs: inputsNow,
  files: files.map(bind), imageOpens: 3, contentRepairs: 1, paidCalls: 0,
  reviewAt1: false, promotion: false,
  excludes: ['Self hash (returned by native stdout)', 'Closing call receipt/stdout/stderr, written after this snapshot; no unrecorded author/render/preview stage.'],
};
write('freeze.json', freeze);
for (const file of [...files, path.join(out, 'freeze.json')]) fs.chmodSync(file, 0o444);
for (const row of freeze.files) assert.equal(sha(row.path), row.sha256);
console.log(JSON.stringify({
  status: report.status, selected, report: bind(path.join(out, 'report.json')),
  freeze: bind(path.join(out, 'freeze.json')), imageLedger: selected.imageLedger,
  nativeOutcome: report.nativeOutcome, imageOpens: 3, contentRepairs: 1, paidCalls: 0,
}, null, 2));
