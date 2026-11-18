import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const own = path.dirname(fileURLToPath(import.meta.url));
const previous = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d544-n74-fig161162-first-independent-review');
const author = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d533-n74-first-modern-figure-author');
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const read = p => JSON.parse(fs.readFileSync(p));
const mode = p => (fs.statSync(p).mode & 0o777).toString(8).padStart(4, '0');
const bind = p => ({ path: p, sha256: hash(p), bytes: fs.statSync(p).size, mode: mode(p) });
const expected = [
  [path.join(previous, 'READY.json'), '5d0a1f471391f64dd3b7c9fbd9dba337ab339435e98c2da777299f09bfe16929'],
  [path.join(previous, 'report.json'), 'd78dfdb7f5782a76ae4e3fcf479f9b62fd2738cc54a313d4245218f93f3f0ca7'],
  [path.join(previous, 'review-freeze.json'), 'b6199832fa05bfe5b8aca0a9e0b556a1ca7e86f419ea5450ea8d333523baf9ef'],
  [path.join(author, 'READY.json'), '3c03a682e55276ae4ae3a6a4122ea0fc0d99c54902b4cf80e7bbe21c0e206c7d'],
  [path.join(author, 'author-freeze.json'), '39ed97b932909080385f928962bdf793aa5daafef510e46888599ecc7fc77c8e'],
  [path.join(author, 'report.json'), '315b62236120279e3027dc7c1d28c4c8c4f7455e7198fb0957b0e101ead7d067']
];
for (const [p, sha256] of expected) {
  assert.equal(hash(p), sha256, p);
  assert.equal(mode(p), '0444', p);
}
const priorFreeze = read(path.join(previous, 'review-freeze.json'));
for (const item of priorFreeze.files) {
  assert.equal(hash(item.path), item.sha256);
  assert.equal(mode(item.path), '0444');
}
const authorFreeze = read(path.join(author, 'author-freeze.json'));
for (const item of authorFreeze.files) {
  const p = path.join(author, item.path);
  assert.equal(hash(p), item.sha256);
  assert.equal(fs.statSync(p).size, item.bytes);
  assert.equal(mode(p), '0444');
}
const inputBindings = new Map();
function verifyRefs(value) {
  if (!value || typeof value !== 'object') return;
  if (typeof value.path === 'string' && typeof value.sha256 === 'string') {
    const p = path.isAbsolute(value.path) ? value.path : path.join(root, value.path);
    assert.equal(hash(p), value.sha256, p);
    if (!p.startsWith(`${own}/`)) inputBindings.set(p, bind(p));
  }
  for (const child of Object.values(value)) verifyRefs(child);
}
const report = read(path.join(own, 'report.json'));
const opens = read(path.join(own, 'actual-opens.json'));
const command = read(path.join(own, 'command.json'));
const results = read(path.join(own, 'browser-results.json'));
verifyRefs(report);
verifyRefs(opens);
verifyRefs(command);
verifyRefs(results);
verifyRefs(priorFreeze.inputBindings);
for (const [p] of expected) inputBindings.set(p, bind(p));
assert.equal(opens.initialActualContextCount, 6);
assert.equal(opens.additionalActualOpens, 2);
assert.equal(opens.cumulativeActualContextCount, 8);
assert.equal(opens.remainingAuthorizedOpens, 0);
assert.deepEqual(opens.entries.map(x => x.sequence), [7, 8]);
assert.ok(opens.entries.every(x => x.actualOpen));
assert.equal(results.browserClosed, true);
assert.equal(results.contextClosed, true);
assert.equal(results.requests.length, 0);
assert.equal(results.pageErrors.length, 0);
assert.equal(report.gates.fullcard, false);
assert.equal(report.gates.actualAppDISPLAY, 'PENDING-NOT-SIGNED');
assert.equal(report.notFigureSecondRepair, true);
assert.equal(report.environmentCorrection.CSSStringsReplaced, false);
assert.equal(report.environmentCorrection.SVGSpecNativeChanged, false);
for (const figure of report.figures) {
  assert.equal(figure.browserMobile, 'PASS');
  assert.equal(figure.composedFIG, 'PASS');
  assert.equal(figure.oldD544MobileResvg, 'FAIL-RETAINED');
  const result = results.figures.find(x => x.figure === figure.figure);
  assert.equal(result.screenshotsTakenForFigure, 1);
  assert.equal(result.screenshot.sha256, figure.browserScreenshot.sha256);
  assert.equal(result.exactFrozenSVGInlineVerified, true);
  const dom = read(result.dom.path);
  assert.equal(dom.status, 'PASS');
  assert.equal(dom.media.width, 342);
  assert.equal(dom.SVG.width, 342);
  assert.equal(dom.SVG.height, 342);
  assert.equal(dom.rootInkVariable, '');
  assert.equal(dom.svgInkVariable, '');
  assert.equal(dom.evidenceSavedBeforeScreenshot, true);
  assert.ok(dom.lineRecords.every(line => line.computedStroke === 'rgb(21, 32, 31)' && line.screenStrokeWidthPx > 0));
  assert.equal(fs.readFileSync(result.harness.path, 'utf8').includes(fs.readFileSync(figure.frozenSVG.path, 'utf8')), true);
  const screenshot = fs.readFileSync(figure.browserScreenshot.path);
  assert.equal(screenshot.readUInt32BE(16), 342);
  assert.equal(screenshot.readUInt32BE(20), 342);
}
const freezePath = path.join(own, 'review-freeze.json');
const readyPath = path.join(own, 'READY.json');
assert.equal(fs.existsSync(freezePath), false);
assert.equal(fs.existsSync(readyPath), false);
const files = fs.readdirSync(own).sort().map(name => {
  const p = path.join(own, name);
  assert.equal(fs.lstatSync(p).isFile(), true, name);
  fs.chmodSync(p, 0o444);
  return bind(p);
});
const frozen = {
  schema: 'd556/affected-review-freeze@1',
  status: 'FROZEN-COMPOSED-FIG-PASS-D544-FAIL-RETAINED',
  frozenAt: new Date().toISOString(),
  files,
  inputBindings: [...inputBindings.values()].sort((a, b) => a.path.localeCompare(b.path)),
  report: bind(path.join(own, 'report.json')),
  actualOpens: bind(path.join(own, 'actual-opens.json')),
  verification: {
    d544AllFrozenFileHashesAnd0444ModesStillMatch: true,
    d533AuthorFilesHashSize0444Verified: authorFreeze.files.length,
    reusedSourceContextFullTextSpecRenderSVGPNGHashesStillMatch: true,
    noOriginalOrNativeFullPNGReopens: true,
    unchangedFrozenSVGInlineBytesVerified: true,
    commandAndDOMEvidenceSavedBeforeElementScreenshots: true,
    browserNaturallyResolvedCSSVarFallback: true,
    browserMediaWidth342MeasuredForBoth: true,
    actualNewScreenshotOpens: 2,
    cumulativeActualContextAndBatchOpens: 8,
    ninthImageOpened: false,
    noSVGSpecNativeModification: true,
    noRenderSpecOrValidator: true,
    noRecordReviewOrPromote: true,
    oldFAILsAndHOLDsRetained: true
  },
  browserMobile: { 'fig-161': 'PASS', 'fig-162': 'PASS' },
  composedFIG: { 'fig-161': 'PASS', 'fig-162': 'PASS' },
  d544MobileResvg: 'FAIL-BOTH-RETAINED',
  d544RecordedFIG: 'FAIL-BOTH-UNCHANGED',
  fullcard: false,
  actualAppDISPLAY: 'PENDING-NOT-SIGNED',
  lifecycle: 'Affected-only correction complete; headless browser closed; parent closes temporary review context; no further image opens.',
  hashCoverage: 'This freeze hashes all preceding new artifacts and reused inputs; READY hashes this freeze. No self-reference.'
};
fs.writeFileSync(freezePath, `${JSON.stringify(frozen, null, 2)}\n`, { flag: 'wx' });
fs.chmodSync(freezePath, 0o444);
const ready = {
  schema: 'd556/affected-review-ready@1',
  status: frozen.status,
  report: bind(path.join(own, 'report.json')),
  reviewFreeze: bind(freezePath),
  actualOpens: bind(path.join(own, 'actual-opens.json')),
  browserMobile: frozen.browserMobile,
  composedFIG: frozen.composedFIG,
  d544MobileFAILRetained: true,
  oldd544VerdictsUnchanged: true,
  additionalFigureRepairs: 0,
  actualNewImageOpens: 2,
  cumulativeActualContextAndSameBatchOpens: 8,
  remainingAuthorizedOpens: 0,
  allNewFilesMode: '0444',
  fullcard: false,
  actualAppDISPLAY: 'PENDING-NOT-SIGNED',
  recordReviewCalled: false,
  promoted: false,
  browserAndContextClosed: true,
  parentToCloseTemporaryReviewContext: true,
  payloadReturnedToParent: false
};
fs.writeFileSync(readyPath, `${JSON.stringify(ready, null, 2)}\n`, { flag: 'wx' });
fs.chmodSync(readyPath, 0o444);
verifyRefs(ready);
for (const item of files) {
  assert.equal(hash(item.path), item.sha256);
  assert.equal(mode(item.path), '0444');
}
assert.equal(mode(freezePath), '0444');
assert.equal(mode(readyPath), '0444');
console.log(JSON.stringify({
  status: ready.status,
  browserMobile: ready.browserMobile,
  composedFIG: ready.composedFIG,
  cumulativeActualOpens: 8,
  reportSHA256: ready.report.sha256,
  reviewFreezeSHA256: ready.reviewFreeze.sha256,
  readySHA256: hash(readyPath),
  totalNewFiles0444: files.length + 2,
  d544Unchanged: true,
  fullcardDISPLAY: ready.actualAppDISPLAY
}, null, 2));
