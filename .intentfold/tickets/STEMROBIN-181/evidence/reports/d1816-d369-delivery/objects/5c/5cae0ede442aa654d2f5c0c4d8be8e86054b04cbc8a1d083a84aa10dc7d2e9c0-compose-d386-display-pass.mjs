import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/tmp/d1816-d386-n149-n151-composed-display`;
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => ({ path: path.resolve(file), bytes: fs.statSync(file).size,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') });
const verify = row => assert.equal(bind(row.path).sha256, row.sha256, row.path);
const holdFile = `${T}/tmp/d1816-d364-n149-n151-display-review/report.json`;
const hold = read(holdFile);
const captureFile = `${T}/tmp/d1816-d382-display-missing-evidence/result.json`;
const capture = read(captureFile);
assert.equal(hold.status, 'HOLD');
assert.equal(capture.status, 'pass');
assert(!fs.existsSync(O));
const reviews = [
  `${T}/tmp/d1816-d384-mobile-pan-and-empty-first-review`,
  `${T}/tmp/d1816-d385-remaining-empty-destinations-first-review`,
].map(dir => {
  const freeze = read(`${dir}/review-freeze.json`);
  verify(freeze.report);
  verify(freeze.inputFreeze);
  assert.equal(freeze.status, 'PASS');
  const report = read(freeze.report.path);
  assert.equal(report.status, 'PASS');
  assert.equal(report.screenshots.length, 6);
  for (const image of report.screenshots) {
    verify(image);
    assert.equal(image.status, 'PASS');
  }
  return { dir, freeze: bind(`${dir}/review-freeze.json`),
    reportBinding: bind(freeze.report.path), report };
});
const supplements = reviews.flatMap(row => row.report.screenshots);
const captured = capture.observations.flatMap(row => row.screenshots);
assert.equal(supplements.length, 12);
assert.equal(new Set(supplements.map(row => row.sha256)).size, 12);
for (const image of captured)
  assert.equal(supplements.filter(row => row.path === image.path &&
    row.sha256 === image.sha256).length, 1);
const screenshots = hold.screenshots.map(row => {
  verify(row);
  const additions = supplements.filter(image => image.id === row.id &&
    image.locale === row.locale && image.path.includes(`-${row.viewport.name}-`));
  assert(additions.some(image => image.kind === 'empty-exercise-navigation'));
  if (row.status.toLowerCase() === 'hold') {
    assert.equal(row.id, 'phy10-c3-s4-n149');
    assert.equal(row.viewport.name, 'mobile');
    assert(additions.some(image => image.role === 'initial-left'));
    assert(additions.some(image => image.role === 'pan-right'));
  } else assert.equal(row.status.toLowerCase(), 'pass');
  return { ...row, status: 'PASS', originalPixelReportStatus: row.status,
    composedApprovalOnly: true, supplementalScreenshots: additions.map(image => ({
      path: image.path, sha256: image.sha256, status: image.status, role: image.role,
    })),
    approvalBasis: 'Unchanged D364 macro-flow observations plus D384/D385 missing-scope pixel PASS and D382 actual navigation/pan evidence. This is not a new approval of unseen glyphs or science.',
  };
});
assert.equal(screenshots.length, 8);
fs.mkdirSync(O, { recursive: true });
const reportFile = `${O}/report.json`;
fs.writeFileSync(reportFile, JSON.stringify({
  stage: 'D386', status: 'PASS',
  scope: 'COMPOSED offline final-display scope only; no new independent review',
  originalHold: bind(holdFile), originalHoldStatus: hold.status,
  inheritedAutomaticEvidence: capture.inheritedAutomaticEvidence,
  newMissingEvidence: bind(captureFile),
  independentSupplementReviews: reviews.map(row => ({
    report: row.reportBinding, reviewFreeze: row.freeze,
  })),
  scopeGates: { ...hold.scopeGates, mobileFigureCompleteFraming: 'PASS',
    emptyExerciseDestinationPixels: 'PASS', actualForwardBackNavigation: 'PASS',
    actualMouseHorizontalPan: 'PASS' },
  resolvedHoldFindings: hold.findings.map(row => ({
    id: row.id, originalStatus: row.status, composedResolution: 'PASS',
    originalFindingPreservedIn: bind(holdFile),
    evidence: row.id.includes('MOBILE') ? reviews[0].reportBinding
      : reviews.map(review => review.reportBinding),
  })),
  screenshots, supplementalScreenshots: supplements,
  limitations: [
    'Original D364 HOLD is unchanged and is not relabeled as a first-pass review.',
    'No source, science, translations, exact archival glyphs or geometry semantics rereviewed.',
    'Mouse pan and local offline forward/back navigation were observed; touch gestures and live product acceptance were not tested.',
  ],
  imagesOpenedByComposer: 0, parentCumulativeImages: 23,
  reviewerSupplementContextImages: 12, screenshotReopens: 0,
  geometryRerenders: 0, passedAutomaticTextChecksReplayed: 0,
  databaseWrites: false, paidCalls: 0, sourcePagesAdded: 0,
  completeCoursesAdded: 0, formalHandoff: false, wholeProjectChecks: false,
}, null, 2) + '\n', { flag: 'wx' });
fs.writeFileSync(`${O}/composition-freeze.json`, JSON.stringify({
  stage: 'D386', status: 'PASS', report: bind(reportFile),
  inputBindings: [bind(holdFile), bind(captureFile),
    ...reviews.flatMap(row => [row.reportBinding, row.freeze])],
  frozenAt: new Date().toISOString(),
}, null, 2) + '\n', { flag: 'wx' });
for (const file of fs.readdirSync(O)) fs.chmodSync(`${O}/${file}`, 0o444);
console.log(JSON.stringify({ report: bind(reportFile), composedSurfaces: 8,
  newSupplementalImages: 12, originalHoldPreserved: true }));
