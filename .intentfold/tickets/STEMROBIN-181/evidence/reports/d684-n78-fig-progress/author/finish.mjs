import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const owned = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d662-n78-fig182183-author');
assert.equal(process.cwd(), repo);
assert.deepEqual(process.argv.slice(2), ['--execute']);
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const bind = file => ({ path: file, sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),
  bytes: fs.statSync(file).size });
const write = (relative, value) => {
  const target = path.resolve(owned, relative);
  assert.ok(target.startsWith(`${owned}/`));
  fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
  return target;
};
const sourceRoot = path.join(repo,
  '.intentfold/tickets/STEMROBIN-181/evidence/reports/d646-active-stages/d638-n78-first-closed-source-text-author/root/10p/figures');
const actualImages = [
  { file: path.join(sourceRoot, 'fig-182.png'), role: 'actual original source 182' },
  { file: path.join(sourceRoot, 'fig-183.png'), role: 'actual original source 183' },
  { file: path.join(owned, 'fig-182/native.png'), role: 'initial native 182, first genuine d-label collision' },
  { file: path.join(owned, 'fig-183/native.png'), role: 'native 183, complete 640px image' },
  { file: path.join(owned, 'fig-183/display-331-342.png'), role: 'actual 331px and 342px native-SVG comparison' },
];
write('actual-opens.json', {
  schema: 'd662/current-context-image-opens@1', date: '2026-11-18',
  events: actualImages.map((image, i) => ({ sequence: i + 1, tool: 'functions.view_image',
    detail: 'original', ...bind(image.file), role: image.role, actuallyOpened: true })),
  currentBatch: 5, currentContextLifetime: 5, batchMaximum: 8, lifetimeMaximum: 24,
  reopens: 0, sourceCrops: 0, previousAuthorTwoOpensReused: false,
  previousAuthorOpensNotClaimedAsThisContext: true, oldParentBudgetNotReset: true,
  generatedButNotOpened: [
    path.join(owned, 'fig-182/repair1/native.png'),
    ...[331, 342, 640].map(width => path.join(owned, `fig-183/display-${width}.png`)),
  ].map(bind),
  fig181Opened: false,
});
write('author-observations.json', {
  schema: 'd662/author-observations-not-independent-review@1', imageLedger: bind(path.join(owned, 'actual-opens.json')),
  source182: 'Directly observed six panels in two columns/three rows, repeated object/lens/film positions, A focus, B noncrossed defocus and C crossing before film; reduced-opening outer blocked paths on right, stop bars to the right of each lens. Actual inventory predates specs.',
  source183: 'Directly observed S inside housing, paired K, framed D with leader, O in stepped tube, tall screen and directed paths.',
  native182First: 'Actually opened complete initial PNG. All six panels, English point and panel labels, fixed film lines, wide and reduced admitted ray bundles and nonzero B/C film sections appear. Native d-title padded-label collision is a genuine failure even though it is subtle in the visible raster.',
  native182SoleRepair: {
    imageActuallyOpened: false, dependentVisualStageStopped: true,
    report: bind(path.join(owned, 'fig-182/repair1/render.json')),
    outcome: 'Same d-label collision remains, score 15.820976257324219. First failure score 51.80535125732422 and outputs remain intact. No second repair.',
  },
  native183: 'Actually opened full 640px native PNG and the actual 331/342px comparison. S/K/D/O, both condenser outlines, slide frame/leader, objective/tube, crossing projection rays and full screen are present; all six labels remain visible in the smaller views. This is an author observation, not independent FIG/source/visual approval.',
  widths: 'Inherited 331/342/640px records are hash-bound. Current native reports test all three media widths; smallest final font 17.584375/18.168750000000003/34px respectively. Full-card headed product was NOT run.',
  native183PixelEvidence: bind(path.join(owned, 'preview-receipt.json')),
  sourceFactsVersusModels: 'Source coordinates are not measured. Selected exact thin-lens geometry, fixed image-side-stop construction, inverted/enlarged projector image endpoints, cleaned lens/hatching/housing contours and English scope headers are declared additions. K rays are illumination schematic, not a quantitative condenser imaging model.',
  knownUnresolved: 'Source-right aperture versus edition-before wording is explicitly pending independent FIG resolution; it was not silently corrected.',
  native183IndependentReview: 'PENDING', native182IndependentReview: 'PENDING-BLOCKED-NATIVE',
  selfApproval: false, reviewAt1FilesWritten: 0, completeCardsAdded: 0, paidCalls: 0,
});
const summary = spawnSync('node', [path.join(owned, 'author.mjs'), 'summarize'], {
  cwd: repo, encoding: 'utf8', timeout: 30000, env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
});
assert.equal(summary.status, 0, summary.stderr);
const reportPath = path.join(owned, 'report.json'), report = read(reportPath);
assert.ok(report.sourceBindingStillCurrent.every(pin => pin.unchanged));
assert.ok(report.textBindingStillCurrent.every(pin => pin.unchanged), 'current text changed; report cannot claim current binding');
assert.equal(report.figures[0].nativeStatus, 'fail');
assert.equal(report.figures[0].identifiedSpecRepairs, 1);
assert.equal(report.figures[1].nativeStatus, 'pass');
for (const figure of report.figures) {
  const native = read(figure.nativeRender.path);
  assert.equal(native.spec.sha256, figure.spec.sha256);
  assert.equal(native.output.svg.sha256, figure.svg.sha256);
}
const outputs = report.figures.map(figure => ({
  figure: figure.id, nativeStatus: figure.nativeStatus, spec: figure.spec, svg: figure.svg,
  nativePNG: figure.png, nativeRender: figure.nativeRender,
  initialFailurePreserved: figure.firstFailurePreserved,
}));
const hashesPath = write('output-hashes.json', { report: bind(reportPath), outputs,
  figure183Previews: read(path.join(owned, 'preview-receipt.json')).receipts.map(row => row.screenshot),
  comparison: bind(path.join(owned, 'fig-183/display-331-342.png')),
  independentFIG: 'PENDING', independentVisual: 'PENDING', noWholeCardCompletion: true });
const walk = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
  const file = path.join(directory, entry.name);
  return entry.isDirectory() ? walk(file) : [file];
});
const files = walk(owned).sort().map(bind);
const freeze = write('author-freeze.json', {
  schema: 'd662/author-freeze@1', report: bind(reportPath), outputHashes: bind(hashesPath),
  files, ownedRoot: owned, boundedBatchEnded: true, fig182RepairsExhausted: true,
  independentFIGPending: true, independentVisualPending: true, noSelfApproval: true,
  writesOnlyUnderOwnedRoot: true, immutableInputsReferencedNotCopied: true,
  summaryNativeCommand: { cwd: repo, argv: ['node', path.join(owned, 'author.mjs'), 'summarize'],
    exitCode: summary.status, stdout: summary.stdout, stderr: summary.stderr },
});
for (const file of [...files.map(file => file.path), freeze]) fs.chmodSync(file, 0o444);
console.log(JSON.stringify({ report: bind(reportPath), outputHashes: bind(hashesPath),
  freeze: bind(freeze), outputs, imageOpens: 5, allOwnedFilesFrozen: true }, null, 2));
