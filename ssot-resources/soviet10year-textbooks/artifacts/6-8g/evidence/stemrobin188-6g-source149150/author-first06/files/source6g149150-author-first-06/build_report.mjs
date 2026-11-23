import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const own = path.dirname(fileURLToPath(import.meta.url));
const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
if (process.cwd() !== repo) throw new Error('exact cwd required');
const now = () => new Date().toISOString();
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const read = p => JSON.parse(fs.readFileSync(path.join(own, p), 'utf8'));
const fact = p => {
  const s = fs.statSync(p);
  return {
    path: path.resolve(p), sha256: hash(p), bytes: s.size,
    permissions: (s.mode & 0o777).toString(8).padStart(4, '0'),
    birthtime: s.birthtime.toISOString(), mtime: s.mtime.toISOString(),
    ctime: s.ctime.toISOString(), statObservedAt: now(),
  };
};
const local = p => fact(path.join(own, p));
const assert = (test, message) => { if (!test) throw new Error(message); };
const prepared = read('receipts/prepare-range.stdout');
assert(prepared.ok && prepared.pages.length === 2, 'prepared range');
const receipts = ['prepare-range', 'finalize-0149', 'finalize-0150', 'native-details'].map(name => {
  const receipt = read(`receipts/${name}.json`);
  assert(receipt.exitCode === 0 && receipt.cwd === repo, `receipt ${name}`);
  for (const stream of Object.values(receipt.streams)) assert(hash(stream.path) === stream.sha256, 'stream hash drift');
  return { file: local(`receipts/${name}.json`), execution: receipt };
});
const childReceipts = prepared.pages.map(entry => ({
  physicalPage: entry.page,
  argv: entry.command, cwd: repo, exitCode: entry.returncode, status: entry.status,
  streams: { stdout: fact(entry.stdout), stderr: fact(entry.stderr) },
  provenance: local('receipts/prepare-range.stdout'),
  timing: 'Per-child start/end timestamps not emitted by prepare-range; no inferred timestamps added.',
  note: 'prepare argv declares shared --root, but prepare writes only the owned --work page directory; root is printed as suggested destination.',
}));
const pages = [149, 150].map(n => {
  const id = String(n).padStart(4, '0');
  const first = local(`FIRST-${id}.json`);
  const firstSeal = read(`seals/FIRST-${id}.json.json`);
  const candidate = local(`candidate-${id}-prefinalize.md`);
  const candidateSeal = read(`seals/candidate-${id}-prefinalize.md.json`);
  const working = local(`artifacts/6-8g/pages/${id}/page.md`);
  const execution = read(`receipts/finalize-${id}.json`);
  const audit = read(`artifacts/6-8g/pages/${id}/audit.json`);
  const pageJson = read(`artifacts/6-8g/pages/${id}/page.json`);
  assert(first.permissions === '0444' && candidate.permissions === '0444', 'seal permissions');
  assert(first.sha256 === firstSeal.file.sha256 && candidate.sha256 === candidateSeal.file.sha256, 'immutable evidence drift');
  assert(firstSeal.sealedAt < candidateSeal.input.birthtime, 'FIRST before candidate');
  assert(candidateSeal.sealedAt < execution.startedAt, 'candidate before finalize');
  assert(audit.errors.length === 0 && audit.lines_printed === audit.lines_md, 'audit failure');
  assert(audit.normalizations.length === 0, 'unexpected normalization');
  assert(pageJson.meta.page === n && pageJson.meta.printed_page === n - 10, 'page identity');
  const crops = audit.figures.map(f => ({
    id: f.id, label: f.label, coarseBox: f.from, finalizedBox: f.box,
    file: local(`work/6-8g/pages/${id}/figures/${f.id}.png`),
    authorOnlyNativeChecked: true,
  }));
  return {
    physicalPage: n, printedPage: n - 10, status: 'AUTHOR_ONLY',
    FIRST: first, FIRSTSeal: local(`seals/FIRST-${id}.json.json`),
    candidatePrefinalize: candidate,
    candidateSeal: local(`seals/candidate-${id}-prefinalize.md.json`),
    workingMd: working,
    pageJson: local(`artifacts/6-8g/pages/${id}/page.json`),
    audit: local(`artifacts/6-8g/pages/${id}/audit.json`),
    sourcePng: local(`work/6-8g/pages/${id}/page.png`),
    unviewedGridPng: local(`work/6-8g/pages/${id}/page.grid.png`),
    layout: local(`work/6-8g/pages/${id}/layout.json`),
    template: local(`work/6-8g/pages/${id}/page.template.md`),
    crops,
    lineReconciliation: { printed: audit.lines_printed, md: audit.lines_md },
    normalizedTextChanges: audit.normalizations,
    actualOrder: {
      FIRSTSeal: firstSeal, candidateSeal,
      finalizeStartedAt: execution.startedAt, finalizeFinishedAt: execution.finishedAt,
      FIRSTBeforeCandidateCreation: true, candidateBeforeFinalize: true,
    },
  };
});
const imageLedger = fs.readdirSync(path.join(own, 'images')).sort().map(name => ({
  ...read(`images/${name}`), loadOutcome: 'loaded and observed',
  receipt: local(`images/${name}`),
}));
assert(imageLedger.length === 7 && imageLedger.every((e, i) => e.ordinal === i + 1), 'image ledger');
const pdf = path.join(repo, 'ssot-resources/soviet10year-textbooks/sources/soviet10years/6-8g 苏联十年制学校数学教材 几何 六-八年级.pdf');
assert(hash(pdf) === 'd06ea093886065380febda597331bb5d48c81303d955161f2f84a7f11c116e5c', 'PDF identity drift');
const runtime = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python');
const helpers = [
  'tools/p2c.py', 'tools/production.py', 'tools/layout.py', 'tools/blocks.py',
  'profiles/soviet-cn.json', 'SKILL.md', 'references/production-resume.md',
].map(name => fact(path.join(repo, '.claude/skills/ld-s10y-lesson', name)));
const initialHashes = {
  'p2c.py': '221d1d2c6669a1087516e7c47690c87a4f6c23d433cfb16ffcfb275bd8775670',
  'production.py': '85fb4f3ef9a538985845c3987400bb55a432be524c93f7f11e6a4dc24adcdc3d',
  'layout.py': '2a5a9930ed3317084e055eca97d8986638c932d3284afba98f46083bab37d348',
};
for (const helper of helpers) {
  const expected = initialHashes[path.basename(helper.path)];
  if (expected) assert(helper.sha256 === expected, 'shared helper drift during authorship');
}
const report = {
  schema: 'same188-6/source-author-report@1',
  status: 'AUTHOR_ONLY', generatedAt: now(), ticket: 'STEMROBIN-188',
  continuation: 'SAME188-6', finish: 'review', offline: true,
  repo, ownedWriteRoot: own, scope: { book: '6-8g', physicalPages: [149, 150], printedPages: [139, 140] },
  pages,
  executionReceipts: receipts,
  perPagePrepareNativeExecution: childReceipts,
  provenance: {
    originalPdf: fact(pdf),
    pythonRuntime: { ...fact(runtime), realPath: fs.realpathSync(runtime) },
    nodeRuntime: { ...fact(process.execPath), version: process.version },
    helpers,
    imageContract: fact(path.join(repo, '.agents/skills/ld-s10y-image/SKILL.md')),
    noPdfRuntimeOrNodeModulesCopies: true,
    installedRevisions: {
      userAuthorized: ['db613601', '093a4baa'],
      readOnlyGitRevParseOutput: [
        '7251dfdcb2878ce552ce61d7030d04d8cfb745fb',
        'db61360143e803e746f5fe47700dee24beb80c22',
        '093a4baa5151eb6a8ba1074354e7c01815e13b16',
      ],
      argv: ['git', 'rev-parse', 'HEAD', 'db613601', '093a4baa'], cwd: repo, exitCode: 0,
      evidenceType: 'actual exec tool output, not a separately saved native stream',
      codeIdentity: 'Exact installed file hashes recorded above; no checkout, update or helper edit.',
    },
  },
  addenda: [local('FIRST-addendum-01.json'), local('FIRST-addendum-02-nativechecks.json')],
  nativeDetailCrops: read('receipts/native-details.stdout').map(e => ({ ...e, file: fact(e.crop), authorOnlyChecked: true })),
  imageBudget: {
    freshNonforkBatch: true, maximumBatch: 8, maximumContext: 24,
    currentBatchCharged: 7, currentContextCharged: 7, remainingBatch: 1,
    parentPermanentImages: '24/24, user-declared; return TEXT/path/hash only',
    parentImagesLoadedHere: 0, prior147148PixelsOrFIRSTRead: false,
    gridsLoaded: 0, reopens: 0, failedImageLoads: 0, image9: false,
    ledger: imageLedger, unreadLocalCropHold: [],
  },
  failures: {
    stageFailures: [], imageFailures: [],
    discoveryFailures: [{
      argv: ['rg', '--files', '.intentfold/tickets/STEMROBIN-188/tmp/source6g149150-author-first-06', '.intentfold/tickets/STEMROBIN-188/ticket.json', '.intentfold/project.json'],
      cwd: repo, exitCode: 2, chargedImages: 0,
      stdout: '.intentfold/tickets/STEMROBIN-188/ticket.json\n.intentfold/project.json\n',
      stderr: 'rg: .intentfold/tickets/STEMROBIN-188/tmp/source6g149150-author-first-06: No such file or directory (os error 2)\n',
      evidenceType: 'actual exec tool output; recorded transparently, not relabeled a native producer receipt',
      diagnosis: 'Owned output directory did not exist yet; not a production-stage or source-content failure.',
    }],
    dependentStagesStoppedAfterFailure: 'Not applicable: prepare/finalize/native-crop stages passed on first execution.',
    preservedFailedReceiptsAndOldHelperSnapshots: 'No production failure or technical fix occurred; no old helper copied.',
  },
  revisions: {
    candidateContentRevisions: 0, technicalHelperRevisions: 0,
    FIRSTEditsAfterSeal: 0, addendumCount: 2,
    successfulPrepareRangeInvocations: 1,
    successfulFinalizeInvocationsPerPage: { '149': 1, '150': 1 },
    successfulStageReplays: 0, mathematicalOrGlyphCorrections: 0,
    OSubscriptEncoding: 'Small round subscript encoded O; not independently established uppercase/lowercase pixel identity.',
    proofEndMarks: 'Recorded in FIRST/native addendum as source nontext marks; not guessed as mathematical prose.',
  },
  observedBoundaries: {
    priorContext: 'Only direct parent-collected Huygens AUTHOR_ONLY147148 text supplied by the human. Not human pixels or independent approval.',
    priorEncodingCautions: 'Human-supplied420 prose distinguishes lowercase p from uppercase Q and preserves peaked accents. Cyrillic а-shaped encoding choice is not a pixel-identity claim. None of these prior pixels or FIRST files was read here.',
    prior142And147148: 'Human-provided prior chapter2 supplementary heading on142 after380; new410 on147 and closed;420 begins147 at 求,150 work does not reread that source. Prior148 begins证 and ends直线的两侧。); no exercise open at148 end.',
    actual149: ['七年级', '第三章 平行和平移', '§1. 平行线', '31. 直线的平行和中心对称'],
    boundaryBasis: 'Actual149 original pixels only, not TOC.',
    actual150: 'No new heading; theorem39 proof and corollary proof close. Subparagraph2 follows; theorem40 statement closes.',
    exerciseObjectsOn149150: [],
    incomingExerciseContinuation: false,
    theorem40ProofBeyond150: 'unknown',
    nextUnitBoundary: 'unknown; no page beyond150 prepared, cropped or viewed',
  },
  authority: {
    sourceAuthorOnly: true, independentReview: false, unitApproval: false,
    humanPixelApproval: false, passedToolsAreNotSourceApproval: true,
    parentCollection: 'TEXT/path/hash only; independent review later',
  },
  forbiddenActionsPerformed: {
    network: false, backend: false, database: false, gitMutation: false,
    paidCalls: false, setupOrUpdate: false, grill: false, publish: false,
    deploy: false, handoff: false, chats: false, wholeBookGates: false,
    sharedOrCoreEdits: false, othersChangesReverted: false,
  },
  sessions: { ownedExecSessionsStillRunning: 0, ownedBrowserSessions: 0 },
};
const files = [];
const collect = dir => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    assert(!entry.isSymbolicLink(), 'owned output redirects outside root');
    if (entry.isDirectory()) collect(p);
    else files.push(fact(p));
  }
};
collect(own);
report.ownedFilesBeforeReport = files.sort((a, b) => a.path.localeCompare(b.path));
const output = path.join(own, 'report.json');
fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n', { flag: 'wx' });
fs.chmodSync(output, 0o444);
console.log(JSON.stringify({ report: fact(output), status: report.status, images: 7, lines: [[149, 21, 21], [150, 26, 26]], sessions: report.sessions }, null, 2));
