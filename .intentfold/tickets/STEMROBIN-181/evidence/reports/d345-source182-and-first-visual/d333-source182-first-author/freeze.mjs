import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const base = path.dirname(fileURLToPath(import.meta.url));
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const record = p => ({ path: p, sha256: hash(p), bytes: fs.statSync(p).size });
const load = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const create = (p, value) => fs.writeFileSync(p, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
  const p = path.join(dir, entry.name);
  if (entry.isSymbolicLink()) throw new Error(`Unexpected symlink: ${p}`);
  return entry.isDirectory() ? walk(p) : [p];
});
const page = path.join(base, 'source/10p/pages/0182');
const work = path.join(base, 'work/10p/pages/0182');
const manifest = path.join(base, 'inputs/preparation-manifest.json');
if (hash(manifest) !== '53fd286a9ccdd63c2b08f401804d6dc6b2f1a90ed5c03c4662f571722e2dad63') {
  throw new Error('Preparation manifest changed');
}
for (const copy of load(path.join(base, 'inputs/receipt.json')).copies) {
  if (hash(copy.copy.path) !== copy.copy.sha256 || hash(copy.source.path) !== copy.source.sha256) {
    throw new Error('Prepared bytes changed after copying');
  }
}
const opensPath = path.join(base, 'actual-opens.json');
const opens = load(opensPath);
if (opens.actualImageOpens !== 8 || opens.entries.length !== 8) throw new Error('Incorrect opens ledger');
opens.contextFinalImages = 8;
opens.remainingBatchImageOpens = 0;
opens.entries = opens.entries.map((entry, index) => {
  if (entry.ordinal !== index + 1) throw new Error('Nonconsecutive actual opens');
  return { ...entry, sha256: hash(entry.path) };
});
fs.writeFileSync(opensPath, JSON.stringify(opens, null, 2) + '\n');
const finalizePath = path.join(base, 'native/finalize-182.receipt.json');
const vectorizePath = path.join(base, 'native/vectorize-182.receipt.json');
const finalize = load(finalizePath);
const vectorize = load(vectorizePath);
const audit = load(path.join(page, 'audit.json'));
if (finalize.invocationCount !== 1 || vectorize.invocationCount !== 1) throw new Error('Native invocation limit violated');
if (finalize.exitCode !== 0 || vectorize.exitCode !== 0) throw new Error('Unexpected native status');
if (audit.lines_printed !== 21 || audit.lines_md !== 21 || audit.normalizations.length !== 0) {
  throw new Error('Native facts do not match observed invocation');
}
const figures = ['139', '140'].map(number => ({
  raw: `RAW${number}`, id: `fig-${number}`,
  png: record(path.join(work, `figures/fig-${number}.png`)),
  svg: record(path.join(work, `figures/fig-${number}.svg`)),
  nativeTraceStatus: 'PASS',
  mismatchPercentFromNativeStdout: number === '139' ? 0.028 : 0.015,
  nativeMetricPrecision: 'As printed by the sole scoped p2c.py vectorize invocation',
  authorCropStatus: number === '139' ? 'FAIL-HOLD: separate caption strokes leak into lower edge' : 'CLEAR-NOT-INDEPENDENTLY-APPROVED',
  semanticStatus: 'HOLD',
}));
const holds = [
  {
    id: 'RAW139-CAPTION-LEAK', status: 'HOLD', observedResult: 'FAIL',
    finding: 'Initial native crop includes clipped upper strokes of the separate 图 139 caption; the SVG reproduces the defect.',
    evidence: record(path.join(base, 'crop-observations.json')),
    affectedOnlyRepairCount: 0,
    requiredLater: 'Separately authorized affected-only crop-padding repair, current native evidence, and independent crop observation. Do not promote current PNG or SVG.',
  },
  {
    id: 'TEXT-TYPOGRAPHY-BOUNDARIES', status: 'HOLD',
    finding: 'Author readings of inclined emphasis around 边缘光线 and 物体/物体本身, and bold 像 occurrences, require independent exact-boundary review. Page words are transcribed without physics substitution.',
  },
  {
    id: 'INDEPENDENT-TEXT-REVIEW', status: 'HOLD',
    finding: 'SOURCE182 text has first-author inventory and native checks only; no independent text semantic PASS is claimed.',
  },
  {
    id: 'INDEPENDENT-FIGURE-REVIEW', status: 'HOLD',
    finding: 'RAW139 and the additionally observed RAW140 have first-author pixel inventories only. Native trace PASS and RAW140 clear crop do not establish independent semantic approval.',
  },
  {
    id: 'SOURCE182-OPEN-CONTINUATION', status: 'HOLD',
    finding: 'p0182#9 ends with 这些像的大小已经不像在平面 and remains open. Source183 was not accessed; page, lesson n69, unit70 and card completion are not claimed.',
  },
  {
    id: 'INHERITED-RAW138', status: 'HOLD',
    finding: 'User-supplied carry-over only: two central glyph identities remain HOLD. Source181 and all earlier pages were not viewed, reviewed or repaired in this batch.',
  },
];
const recordedUtc = new Date().toISOString();
const report = {
  schema: 'source-first-author/bounded-report@1',
  ticket: 'STEMROBIN-181', batch: 'd333-source182-first-author',
  role: 'FIRST-AUTHOR', book: '10p', sourcePages: [182], printedPage: 172,
  workspace: '/Users/yong/.codex/worktrees/00b1/lemmadeck',
  branchObservedAtEntry: 'codex/STEMROBIN-181-textbooks',
  writeRoot: base, status: 'AUTHOR-FROZEN-HOLD', recordedUtc,
  frozenPreparation: record(manifest),
  preparationReused: true, prepareInvocationsThisBatch: 0,
  text: {
    status: 'FIRST-AUTHOR-DRAFT; NATIVE-PASS; INDEPENDENT-REVIEW-HOLD',
    inventory: record(path.join(base, 'row-figure-inventory.json')),
    initialPageMd: record(path.join(base, 'author-initial/page.md')),
    finalizedPageMd: record(path.join(page, 'page.md')),
    pageJson: record(path.join(page, 'page.json')),
    audit: record(path.join(page, 'audit.json')),
    rows: 21, independentVisualRows: 21, nativePrintedRows: 21,
    blocks: 10, normalizationChanges: 0,
    sourceWordLiteralPreserved: '弯曲平面的例子',
    cont: { block: 'p0182#3', from: 'p0181#9 preparation text only', open: false },
    open: { block: 'p0182#9', unit: '70. 球面镜', lastWords: '这些像的大小已经不像在平面' },
  },
  native: {
    finalize: { status: 'PASS', invocationCount: 1, receipt: record(finalizePath) },
    vectorize: { status: 'PASS', invocationCount: 1, pages: [182], figures: 2, receipt: record(vectorizePath) },
    svgDetail: { count: 1, figure: 'fig-139', receipt: record(path.join(base, 'native/svg-detail-139.receipt.json')) },
    authorRepairCount: 0, reruns: 0, initialNativeFailure: null,
    initialVisualFailure: record(path.join(base, 'crop-observations.json')),
    note: 'Native finalize was PASS, not FAIL; original PASS receipt, audit and crops preserved byte-for-byte. The genuine initial author crop FAIL is separately recorded and retained, not relabelled as a native command failure.',
  },
  figures,
  svgDetailObservation: {
    image: record(path.join(base, 'details/fig-139.svg-render.png')),
    labelsReadable: ['S', 'S_1', 'A', 'C', 'B', 'D'],
    captionLeakReproduced: true, semanticStatus: 'HOLD',
    fig140SvgVisuallyOpened: false,
  },
  unresolvedNewSourceGlyphs: [],
  holds,
  actualOpens: record(opensPath),
  imageCount: { initialContext: 0, batch: 8, finalContext: 8, batchMaximum: 8, contextMaximum: 24, budgetReset: false },
  inputsReceipt: record(path.join(base, 'inputs/receipt.json')),
  sourceDetailReceipt: record(path.join(base, 'details/source-details.receipt.json')),
  completion: {
    source182SemanticPass: false, sourcePageComplete: false, cardComplete: false,
    n69Complete: false, unit70Complete: false, independentReviewPerformed: false,
    promotedPageCount: 0, promotedFigureCount: 0, canonicalWrites: false,
  },
  restrictionsObserved: {
    otherPagesAccessed: false, noOcr: true, noPhysicsReconstruction: true,
    noModelOrLibraryDocFetch: true, noPaidImageGeneration: true,
    noModernFiguresChoicesAnswers: true, noScreenshotsOrFullTextValidation: true,
    noBuildDbGitWritesCommitPushMergeDeploy: true,
    noChildAgentsNewChatsWorktreesBranchesOrPermanentWorker: true,
    onlyAllowedDirectoryWritten: true, returnImages: false,
  },
  freezePath: path.join(base, 'author-freeze.json'),
};
const reportPath = path.join(base, 'report.json');
create(reportPath, report);
const inventoryPath = path.join(base, 'author-freeze.json');
const files = walk(base).sort().map(record);
create(inventoryPath, {
  schema: 'source-first-author/freeze@1',
  ticket: 'STEMROBIN-181', batch: 'd333-source182-first-author',
  role: 'FIRST-AUTHOR', status: 'FROZEN-HOLD', recordedUtc,
  root: base, report: record(reportPath), actualOpens: record(opensPath),
  source: { page: 182, initialAuthor: record(path.join(base, 'author-initial/page.md')), currentAuthor: record(path.join(page, 'page.md')) },
  initialVisualFailure: record(path.join(base, 'crop-observations.json')),
  unresolvedHolds: holds.map(hold => hold.id),
  files, fileMode: '0444',
  selfHash: 'Excluded from its own file inventory to avoid circular hashing; SHA256 returned separately',
  noPromotion: true, noCompletionClaim: true, imageOpens: 8,
});
for (const file of walk(base)) fs.chmodSync(file, 0o444);
for (const file of load(inventoryPath).files) {
  if (hash(file.path) !== file.sha256 || (fs.statSync(file.path).mode & 0o777) !== 0o444) {
    throw new Error(`Frozen bytes or permissions mismatch: ${file.path}`);
  }
}
if ((fs.statSync(inventoryPath).mode & 0o777) !== 0o444) throw new Error('Freeze file permissions mismatch');
console.log(JSON.stringify({
  report: record(reportPath), freeze: record(inventoryPath), actualOpens: record(opensPath),
  pageMd: record(path.join(page, 'page.md')),
  filesReadOnly0444: walk(base).length, imageOpens: 8,
  finalizeInvocations: 1, vectorizeInvocations: 1,
  crop139: 'FAIL-HOLD', crop140: 'CLEAR-REVIEW-HOLD', semanticStatus: 'HOLD',
}, null, 2));
