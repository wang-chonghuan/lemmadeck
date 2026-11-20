import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const scope = path.dirname(fileURLToPath(import.meta.url));
const tmp = path.dirname(scope);
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const record = p => {
  const stat = fs.lstatSync(p);
  if (!stat.isFile() || stat.isSymbolicLink()) throw new Error(`Not a regular file: ${p}`);
  return {
    path: p, sha256: hash(p), bytes: stat.size,
    mode: (stat.mode & 0o777).toString(8).padStart(4, '0'),
  };
};
const own = name => path.join(scope, name);
const manifestPath = path.join(tmp, 'n66-figure100101-review-inputs-01/manifest.json');
const manifest = read(manifestPath);
const before = read(own('input-bindings.before.json'));
const after = read(own('input-bindings.after.json'));
for (const input of before.inputs) {
  const final = after.inputs.find(item => item.path === input.path);
  if (!final || input.sha256 !== final.sha256 || input.bytes !== final.bytes) {
    throw new Error('Input changed across review');
  }
}
const ledger = read(own('image-ledger.json'));
const assessment = read(own('visual-assessment.json'));
const candidates = read(own('candidate-checks.json'));
if (ledger.actualCount !== 8 || candidates.status !== 'pass') {
  throw new Error('Invalid image or candidate gate');
}
const authorPath = manifest.inputs.find(item => item.path.endsWith('/author-report.json')).path;
const author = read(authorPath);
const seals = manifest.figures.map(f => {
  const receiptPath = own(`${f.id}.FIRST.receipt.json`);
  const receipt = read(receiptPath);
  const first = record(receipt.first.path);
  if (first.mode !== '0444' || first.sha256 !== receipt.first.sha256) {
    throw new Error('FIRST seal changed');
  }
  return { figure: f.id, first, receipt: record(receiptPath), sealedAt: receipt.sealedAt };
});
const figures = manifest.figures.map(f => {
  const reviewPath = own(`${f.id}.review.json`);
  const commandPath = own(`${f.id}.record-review.receipt.json`);
  const review = read(reviewPath);
  const command = read(commandPath);
  const authorFigure = author.figures.find(item => item.id === f.id);
  if (review.status !== 'pass' || command.invocationCount !== 1 || command.exitCode !== 0 ||
      review.spec.sha256 !== f.spec.sha256 || review.render.sha256 !== f.render.sha256 ||
      review.outputs.svg.sha256 !== f.svg.sha256 || review.source.sha256 !== f.original.sha256) {
    throw new Error(`Native review binding failed: ${f.id}`);
  }
  return {
    figure: f.id, status: 'pass', scope: 'Current bound candidate only',
    selectedCurrent: {
      spec: record(f.spec.path), svg: record(f.svg.path), render: record(f.render.path),
      original: record(f.original.path),
    },
    nativeReview: record(reviewPath), nativeCommandReceipt: record(commandPath),
    nativeReviewInvocations: 1,
    independentAssessment: assessment.assessments.find(item => item.figure === f.id),
    independentTextOnlyChecks: candidates.figures.find(item => item.figure === f.id),
    authorHistoryPreserved: {
      firstSpec: authorFigure.firstSpec,
      firstEqualsCurrent: authorFigure.firstEqualsCurrent,
      draftValidationInvocations: authorFigure.nativeDraftValidationInvocations,
      rendererInvocations: authorFigure.rendererInvocations,
      substantiveSpecRepairs: authorFigure.substantiveSpecRepairs,
      executionRecoveries: authorFigure.executionRecoveries,
      failures: authorFigure.failures,
      repairs: authorFigure.repairs,
      authorOriginalHoldsVerbatimHistoricalNotCurrentStatus: authorFigure.holds,
    },
  };
});
const findings = [
  {
    id: 'SOURCE-GLYPHS-HOLD', status: 'hold', figures: ['fig-g10-100', 'fig-g10-101'],
    finding: 'Original O-versus-zero identity and exact original basis-vector accent/font typography remain unresolved. Modern 0 and vector labels are readable, but are not evidence that source glyph uncertainty was resolved.',
    disposition: 'Preserved; no source transcription or candidate guess substituted.',
  },
  {
    id: 'STRICT-FIRST-PROCEDURE-HOLD', status: 'hold', figures: ['fig-g10-100', 'fig-g10-101'],
    finding: 'Reviewer source inventories were independently observed and actually chmod0444/hash-sealed before later manifest/candidate reads. This does not approve the prior author/source FIRST production procedure or erase its original failure HOLDs.',
    disposition: 'strictFIRSTProcedureApproved=false; prior provenance and failures remain in history.',
  },
  {
    id: 'PROMOTION-PRODUCT-HOLD', status: 'hold', figures: ['fig-g10-100', 'fig-g10-101'],
    finding: 'Selected outputs/render metadata still name ticket scratch paths. Supplied headless offline screenshots establish bounded readability and endpoint evidence, not headed real-product integration, durable promotion, alternate-theme visual approval, or whole-lesson acceptance.',
    disposition: 'No promotion, publication, database, text re-review, merge, deploy, or closure performed or approved.',
  },
];
const report = {
  schema: 'same188-6/independent-figure-review-report@1',
  ticket: 'STEMROBIN-188', assignment: 'SAME188-6', role: 'sole-independent-reviewer',
  status: 'hold',
  statusRationale: 'Both current figure candidates pass the bounded mathematical/visual/cultural review; overall promotion remains HOLD for carried source-glyph/FIRST-procedure and offline/durable/product limitations.',
  boundedCandidateStatus: 'pass', promotionStatus: 'hold',
  reviewedAt: new Date().toISOString(), scope, figuresReviewed: ['fig-g10-100', 'fig-g10-101'],
  findings, figures, sourceFIRSTSeals: seals,
  inputBindings: {
    before: record(own('input-bindings.before.json')),
    after: record(own('input-bindings.after.json')),
    all20InputsHashAndBytesUnchanged: true,
    manifest: record(manifestPath),
    beforeInputs: before.inputs, afterInputs: after.inputs,
    all11SuppliedDeclaredByteBindingsMatch: candidates.authorCollectionAndInputDeclaredByteChecks,
    screenshotByteCountsBoundBeforeAndComparedAfter: true,
  },
  perImageLedger: ledger.images, imageLedger: record(own('image-ledger.json')),
  imageActualCount: 8, imagePlannedCount: 8, originalOpens: 2, screenshotOpens: 6,
  reopens: 0, extraDiagnosticImages: 0, currentContextImageLoads: 8,
  parentImageLoads0: true, parentImageLoads: 0,
  parentActualImageLifetimeUnchanged: '15/24', imagePayloadsToParent: 0,
  strictFIRSTProcedureApproved: false, sourceOriginalGlyphHoldsPreserved: true,
  sourceOriginalFailureHoldsPreserved: true,
  nativeReviewInvocationsTotal: 2, nativeReviewInvocationsEach: 1,
  originalAuthorFailuresPreserved: author.failures,
  originalAuthorRepairsPreserved: author.repairs,
  authorSubstantiveSpecRepairs: author.substantiveSpecRepairs,
  authorExecutionRecoveries: author.executionRecoveries,
  reviewerInfrastructureFailurePreserved: record(own('candidate-checks.attempt01.json')),
  reviewerInfrastructureRepair: record(own('checker-repair01.json')),
  reviewerInfrastructureRepairs: 1, reviewerSubstantiveFigureRepairs: 0,
  reviewerNativeReviewFailures: 0, producerFilesChanged: false,
  headlessOfflineOnly: true, realProductApproved: false,
  textContextUsedOnlyForFigureSemantics: true, n66TextReReviewed: false,
  otherFiguresReviewed: false, wholeLessonApproved: false, published: false,
  paidCalls: 0, networkCalls: 0, databaseAccess: false, publisherInvoked: false,
  installations: false, gitWrites: false, mergeDeployClosure: false,
  otherChatsAccessed: false, additionalAgents: 0,
  evidenceMetricLimit: 'Manifest path counts 72/27 are not equated with static bound SVG path counts 22/8; the measurement scope is unspecified. No path-count proxy replaces source inventory or actual visual/geometry review.',
  alternateThemes: 'Semantic CSS variable roles inspected in SVG; no additional theme screenshots opened and no all-theme visual acceptance claimed.',
  requiredOutputFiles: [
    ...seals.flatMap(s => [s.first, s.receipt]),
    ...figures.flatMap(f => [f.nativeReview, f.nativeCommandReceipt]),
    record(own('candidate-checks.json')), record(own('visual-assessment.json')),
    record(own('image-ledger.json')),
  ],
};
fs.writeFileSync(own('report.json'), `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' });
const lines = [
  '# STEMROBIN-188 / SAME188-6: figures 100 and 101',
  '',
  'Status: HOLD overall; both current figure candidates PASS this bounded independent offline mathematical, visual, and cultural review.',
  '',
  '## Findings',
  '',
  ...findings.map(f => `- ${f.id}: ${f.finding} ${f.disposition}`),
  '',
  '## Current Figure Decisions',
  '',
  '- Figure 100: PASS for the manifest-selected repair01 SVG/render, not the failed unsuffixed files. Shared frame and a<x<x+Delta x<b order retained; two comparison cylinders have matching endpoint radii and equal axial height. Inner/slice/outer containment, rim styles, dashed guides, and solid b diameters verified. All ten labels are readable at 22 px.',
  '- Figure 101: PASS. Single positive nonmonotone hump, a<c<b, endpoints on the axis, summit guide at c, and full down-right hatching retained. Actual SVG cubic/guide relationships and all 24 modern hatch segments checked. All nine labels are readable at 22/24 px; no invented equation, numeric maximum, or symmetry claim.',
  '',
  '## Surface And Source Evidence',
  '',
  '- Exactly 8 actual image opens: two originals first, then desktop/start/end for each figure. No reopen, crop, diagnostic image, or image payload to parent; parentImageLoads0=true and parent lifetime remains 15/24.',
  '- Two reviewer FIRST inventories were individually sealed before the later manifest/candidates with actual chmod0444 and SHA256 receipts. They retain original glyph/overlap unknowns; strict FIRST production procedure is NOT approved.',
  '- Desktop 1440x960 and mobile 390x844 screenshots are hash-bound supplied headless/offline evidence. SVG media stays 640 px; minimum label size is 22 px. Mobile end 282+358=640 reaches the right boundary. Viewport-edge cropping is intentional scrolling; all labels appear across start/end, with no intrinsic canvas clipping or incoherent overlap observed.',
  '- All 20 input hash/byte records remain unchanged before/after. All 11 available declared-byte bindings agree. Figure 100 uses the exact repair01 hashes in the manifest. Numeric path-count metadata is not used as fidelity proof.',
  '',
  '## Preserved History',
  '',
  '- Author figure 100: renderer failure for x+Delta x collision retained; one substantive repair, two render invocations, two draft validations, zero execution recoveries. Figure 101: no author failures or repairs; one render and one draft validation. No counters reset.',
  '- Reviewer checker attempt01 falsely compared shortened arrow shafts with full endpoints. Failed JSON/script preserved; one bounded checker-only infrastructure repair verified transformed arrowhead tips (about 0.084 px marker tolerance). No producers changed or extra images opened.',
  '- Native record_review.py ran exactly once per figure and passed both. Command receipts and current source/spec/render/SVG hashes are included.',
  '',
  '## Boundaries',
  '',
  'No N66 text or other-figure re-review, real headed-product acceptance, whole-lesson acceptance, durable promotion, database, publisher, installation, paid/network call, Git write, merge/deploy/closure, other-chat access, or additional agent. Culture is neutral mathematical line art only. Scratch-path outputs and all original-glyph/FIRST procedure HOLDs remain.',
  '',
  '## Artifact References',
  '',
  ...['report.json', 'image-ledger.json', 'input-bindings.before.json', 'input-bindings.after.json',
      'candidate-checks.json', 'visual-assessment.json', 'fig-g10-100.review.json',
      'fig-g10-101.review.json'].map(name => {
    const r = record(own(name));
    return `- ${r.path} SHA256 ${r.sha256} (${r.bytes} bytes, ${r.mode})`;
  }),
  ...seals.map(s => `- ${s.first.path} SHA256 ${s.first.sha256} (${s.first.bytes} bytes, ${s.first.mode}); receipt ${s.receipt.path} SHA256 ${s.receipt.sha256}`),
  '',
];
fs.writeFileSync(own('report.md'), lines.join('\n'), { flag: 'wx' });
const excluded = new Set(['output-index.json', 'node_modules', '__pycache__', 'deps', 'env', '.env']);
function collect(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    if (excluded.has(entry.name) || entry.isSymbolicLink()) return [];
    const p = path.join(dir, entry.name);
    return entry.isDirectory() ? collect(p) : entry.isFile() ? [record(p)] : [];
  });
}
const outputs = collect(scope).sort((a, b) => a.path.localeCompare(b.path));
const index = {
  schema: 'same188-6/output-index@1', root: scope,
  status: report.status, boundedCandidateStatus: report.boundedCandidateStatus,
  outputs, indexExcludedFromOutputs: true, symlinksEnvDepsExcluded: true,
  parentImageLoads0: true, imageActualCount: 8, wholeLessonApproved: false, published: false,
};
fs.writeFileSync(own('output-index.json'), `${JSON.stringify(index, null, 2)}\n`, { flag: 'wx' });
for (const name of ['report.json', 'report.md', 'output-index.json']) {
  console.log(JSON.stringify(record(own(name))));
}
