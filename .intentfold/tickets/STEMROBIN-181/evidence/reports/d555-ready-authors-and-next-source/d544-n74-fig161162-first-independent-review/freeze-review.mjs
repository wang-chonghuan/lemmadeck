import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const own = path.dirname(fileURLToPath(import.meta.url));
const author = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d533-n74-first-modern-figure-author');
const read = p => JSON.parse(fs.readFileSync(p));
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const absolute = p => path.isAbsolute(p) ? p : path.join(root, p);
const mode = p => (fs.statSync(p).mode & 0o777).toString(8).padStart(4, '0');
const bound = [
  ['READY.json', '3c03a682e55276ae4ae3a6a4122ea0fc0d99c54902b4cf80e7bbe21c0e206c7d'],
  ['author-freeze.json', '39ed97b932909080385f928962bdf793aa5daafef510e46888599ecc7fc77c8e'],
  ['report.json', '315b62236120279e3027dc7c1d28c4c8c4f7455e7198fb0957b0e101ead7d067']
];
for (const [name, expected] of bound) {
  assert.equal(sha(path.join(author, name)), expected, name);
  assert.equal(mode(path.join(author, name)), '0444', name);
}
const authorFreeze = read(path.join(author, 'author-freeze.json'));
for (const entry of authorFreeze.files) {
  const p = path.join(author, entry.path);
  assert.equal(sha(p), entry.sha256, entry.path);
  assert.equal(fs.statSync(p).size, entry.bytes, entry.path);
  assert.equal(mode(p), '0444', entry.path);
}
const report = read(path.join(own, 'report.json'));
const opens = read(path.join(own, 'actual-opens.json'));
const inventory = read(path.join(own, 'independent-inventory.json'));
const preview = read(path.join(own, 'mobile-preview-generation.json'));
assert.equal(report.status, 'COMPLETE-FIG-FAIL');
assert.equal(opens.actualOpenCount, 6);
assert.equal(opens.entries.length, 6);
assert.deepEqual(opens.entries.map(x => x.sequence), [1, 2, 3, 4, 5, 6]);
assert.deepEqual(opens.entries.map(x => x.kind), [
  'manifest-original', 'manifest-original',
  'frozen-repair1-native-candidate', 'frozen-repair1-native-candidate',
  'first-frozen-svg-resvg-mobile-342', 'first-frozen-svg-resvg-mobile-342'
]);
assert.equal(inventory.authorInventoryReadAtRecording, false);
assert.equal(report.gates.actualAppDISPLAY, 'PENDING-NOT-SIGNED');
assert.deepEqual(report.gates.independentPASSCandidates, []);
assert.equal(preview.figures.length, 2);

const inputBindings = new Map();
function verifyReferences(value) {
  if (!value || typeof value !== 'object') return;
  if (typeof value.path === 'string' && typeof value.sha256 === 'string') {
    const p = absolute(value.path);
    assert.equal(sha(p), value.sha256, p);
    if (!p.startsWith(`${own}/`)) {
      inputBindings.set(p, { path: p, sha256: value.sha256, bytes: fs.statSync(p).size, mode: mode(p) });
    }
  }
  for (const child of Object.values(value)) verifyReferences(child);
}
verifyReferences(report);
verifyReferences(opens);
verifyReferences(preview);
verifyReferences(authorFreeze.inputManifest);
verifyReferences(read(path.join(author, 'input-binding.json')));
const manifest = read(absolute(authorFreeze.inputManifest.path));
for (const fig of report.figures) {
  const item = manifest.contexts.find(x => x.figure === fig.figure);
  const context = read(absolute(item.context.path));
  const spec = read(fig.spec.path);
  const render = read(fig.render.path);
  assert.equal(context.sourceImage.sha256, item.originalImage.sha256);
  assert.equal(absolute(context.sourceImage.path), absolute(item.originalImage.path));
  assert.equal(spec.source.image.sha256, item.originalImage.sha256);
  assert.equal(absolute(spec.source.image.path), absolute(item.originalImage.path));
  assert.equal(render.spec.sha256, fig.spec.sha256);
  assert.equal(absolute(render.spec.path), fig.spec.path);
  assert.equal(render.output.svg.sha256, fig.SVG.sha256);
  assert.equal(absolute(render.output.svg.path), fig.SVG.path);
  for (const [index, key] of [[0, 'fullEN'], [1, 'fullZH']]) {
    const body = read(absolute(manifest[key].path)).prose
      .map(x => x.text).filter(Boolean).join('\n\n');
    assert.equal(spec.source.authoritativeText[index].text, body, `${fig.figure} ${key} binding`);
  }
  assert.equal(fig.FIG, 'FAIL');
  assert.equal(fig.mobileGate.status, 'FAIL');
  assert.equal(fig.mobileGate.firstRealFailureRetained, true);
  assert.equal(fig.eligibleForRecordReviewPass, false);
  const raster = preview.figures.find(x => x.figure === fig.figure);
  assert.equal(raster.input.sha256, fig.SVG.sha256);
  assert.equal(raster.output.sha256, fig.mobilePNG.sha256);
  const png = fs.readFileSync(fig.mobilePNG.path);
  assert.equal(png.readUInt32BE(16), 342);
  assert.equal(png.readUInt32BE(20), 342);
}

const freezePath = path.join(own, 'review-freeze.json');
const readyPath = path.join(own, 'READY.json');
assert.equal(fs.existsSync(freezePath), false, 'freeze must not replace existing evidence');
assert.equal(fs.existsSync(readyPath), false, 'READY must not replace existing evidence');
const files = fs.readdirSync(own).sort().map(name => {
  const p = path.join(own, name);
  assert.equal(fs.lstatSync(p).isFile(), true, name);
  fs.chmodSync(p, 0o444);
  return { path: p, sha256: sha(p), bytes: fs.statSync(p).size, mode: mode(p) };
});
const frozen = {
  schema: 'd544/independent-review-freeze@1',
  status: 'FROZEN-COMPLETE-FIG-FAIL',
  frozenAt: new Date().toISOString(),
  report: { path: path.join(own, 'report.json'), sha256: sha(path.join(own, 'report.json')) },
  files,
  inputBindings: [...inputBindings.values()].sort((a, b) => a.path.localeCompare(b.path)),
  verification: {
    authorHumanBoundTriple: 'PASS',
    authorFilesHashSize0444CheckedBeforeAndAfterReview: authorFreeze.files.length,
    sourceContextFullTextSpecRenderSVGPNGBindings: 'PASS',
    frozenSpecFullENZHTextEquality: 'PASS',
    actualOpensPathHashesAndOrder: 'PASS',
    firstMobileDimensions: '342x342 for both',
    nativeRendererOrValidatorExecuted: false,
    authorOrSRCBytesModified: false,
    gitCommands: 0
  },
  actualImageOpens: 6,
  FIG: { 'fig-161': 'FAIL', 'fig-162': 'FAIL' },
  actualAppDISPLAY: 'PENDING-NOT-SIGNED',
  allPriorFAILsAndHOLDsPreserved: true,
  recordReviewCalled: false,
  promoted: false,
  lifecycle: 'CLOSED; no second batch or automatic continuation',
  hashCoverage: 'READY hashes this freeze; this freeze hashes all preceding owned files and relevant inputs. No self-referential hash claim.'
};
fs.writeFileSync(freezePath, `${JSON.stringify(frozen, null, 2)}\n`, { flag: 'wx' });
fs.chmodSync(freezePath, 0o444);
const ready = {
  schema: 'd544/independent-review-ready@1',
  status: 'FROZEN-REVIEW-COMPLETE-WITH-FIG-FAILURES',
  report: frozen.report,
  reviewFreeze: { path: freezePath, sha256: sha(freezePath) },
  independentInventory: {
    path: path.join(own, 'independent-inventory.json'),
    sha256: sha(path.join(own, 'independent-inventory.json'))
  },
  actualOpens: { path: path.join(own, 'actual-opens.json'), sha256: sha(path.join(own, 'actual-opens.json')) },
  actualImageOpens: 6,
  FIG: frozen.FIG,
  firstRealMobileFAILsPreserved: true,
  eligibleForRecordReviewPass: [],
  actualAppDISPLAY: 'PENDING-NOT-SIGNED',
  fullcard: false,
  recordReviewCalled: false,
  promoted: false,
  allOwnedFilesMode: '0444',
  lifecycle: 'CLOSED-AFTER-ONE-SHORT-BATCH',
  secondBatchAccepted: false,
  payloadReturnedToParent: false,
  readyMeans: 'Frozen textual failure evidence is ready for parent consumption, not a FIG PASS or DISPLAY approval.'
};
fs.writeFileSync(readyPath, `${JSON.stringify(ready, null, 2)}\n`, { flag: 'wx' });
fs.chmodSync(readyPath, 0o444);
for (const entry of files) {
  assert.equal(sha(entry.path), entry.sha256);
  assert.equal(mode(entry.path), '0444');
}
verifyReferences(ready);
assert.equal(mode(freezePath), '0444');
assert.equal(mode(readyPath), '0444');
console.log(JSON.stringify({
  status: ready.status,
  actualImageOpens: 6,
  FIG: ready.FIG,
  reportSHA256: frozen.report.sha256,
  reviewFreezeSHA256: ready.reviewFreeze.sha256,
  readySHA256: sha(readyPath),
  totalOwnedFiles0444: files.length + 2,
  authorFreezeStillMatches: true
}, null, 2));
