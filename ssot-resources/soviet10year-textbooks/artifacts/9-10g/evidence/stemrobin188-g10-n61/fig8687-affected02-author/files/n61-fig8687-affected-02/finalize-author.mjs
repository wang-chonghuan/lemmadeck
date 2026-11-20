import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
const root = path.dirname(fileURLToPath(import.meta.url));
if (process.cwd() !== repo) throw new Error('Wrong authorized checkout');
const base = '.intentfold/tickets/STEMROBIN-188/tmp';
const read = p => JSON.parse(fs.readFileSync(path.resolve(repo, p), 'utf8'));
const write = (name, data) => fs.writeFileSync(path.join(root, name), JSON.stringify(data, null, 2) + '\n', { flag: 'wx' });
const bind = p => {
  const absolute = path.resolve(repo, p);
  assert(absolute.startsWith(`${repo}/`), 'Bindings must be inside the explicit repository');
  const bytes = fs.readFileSync(absolute);
  return {
    path: path.relative(repo, absolute),
    sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
    bytes: bytes.length,
    mode: (fs.statSync(absolute).mode & 0o777).toString(8).padStart(4, '0'),
  };
};
const before = read(path.join(root, 'bindings.before.json'));
const after = before.map(item => bind(item.path));
assert.deepEqual(after, before, 'Protected input bytes and permissions must remain unchanged');
write('bindings.after.json', after);
const authorization = read(path.join(root, 'commands/live188-read/stdout.txt'));
assert.equal(authorization.sequence_id, 188);
assert.equal(authorization.state_group, 'started');
assert(authorization.description_stripped.includes('内部一次修订、第三次尝试、FIRST1/1不是新审批门槛'));
const changes = read(path.join(root, 'isolated-changes.json'));
const localChange = read(path.join(root, 'fig-g10-86.repair3.changes.json'));
const observations = read(path.join(root, 'author-observations.json'));
assert.equal(observations.imageLedger.entries.reduce((sum, item) => sum + item.imageUnits, 0), 8);
for (const entry of observations.imageLedger.entries) entry.binding = bind(entry.path);

// Retain the earlier snapshot tool bytes identified by its completed command receipts.
const snapshotTool = fs.readFileSync(path.join(root, 'snapshot-targeted.mjs'), 'utf8');
const priorSnapshotTool = snapshotTool
  .replace("const [number, draft = 'repair2'] = process.argv.slice(2);", 'const [number] = process.argv.slice(2);')
  .replace("if (draft !== 'repair2' && !(number === '86' && draft === 'repair3')) throw new Error('Only actual changed candidates allowed');\n", '')
  .replace('const stem = `fig-g10-${number}.${draft}`;', 'const stem = `fig-g10-${number}.repair2`;');
const priorToolHash = crypto.createHash('sha256').update(priorSnapshotTool).digest('hex');
const oldSnapshotReceipt = read(path.join(root, 'commands/fig86-repair2-snapshot/command.json'));
assert.equal(priorToolHash, oldSnapshotReceipt.executables.find(item => item.path.endsWith('/snapshot-targeted.mjs')).sha256);
fs.writeFileSync(path.join(root, 'snapshot-targeted.repair2-tool.mjs'), priorSnapshotTool, { flag: 'wx' });
const commandReceipts = fs.readdirSync(path.join(root, 'commands')).sort().map(name => {
  const directory = path.join(root, 'commands', name);
  return {
    name,
    command: bind(path.join(directory, 'command.json')),
    stdout: bind(path.join(directory, 'stdout.txt')),
    stderr: bind(path.join(directory, 'stderr.txt')),
    exit: bind(path.join(directory, 'exit.json')),
    actualExit: read(path.join(directory, 'exit.json')),
  };
});
const oldPaths = {
  86: `${base}/n61-fig8586-author/fig-g10-86.repair1`,
  87: `${base}/n61-fig8788-author/fig-g10-87.REPAIR1`,
};
const figures = [86, 87].map(number => {
  const draft = number === 86 ? 'repair3' : 'repair2';
  const prefix = path.join(root, `fig-g10-${number}.${draft}`);
  const report = read(`${prefix}.render.json`);
  assert.equal(report.status, 'pass');
  assert.equal(report.collisions.length, 0);
  assert.deepEqual(report.displayChecks.map(check => check.width), [480, 300]);
  const currentSpec = read(`${prefix}.spec.json`);
  const previousSpec = read(`${oldPaths[number]}.spec.json`);
  const normalized = structuredClone(currentSpec);
  const targetId = number === 86 ? 'A1' : 'G87-O1';
  normalized.objects.find(object => object.id === targetId).labelPlacement =
    previousSpec.objects.find(object => object.id === targetId).labelPlacement;
  if (number === 87) {
    normalized.objects.pop();
    normalized.assertions.pop();
  }
  assert.deepEqual(normalized, previousSpec, 'Final comparison must remain affected-only');
  const svgBytes = fs.readFileSync(`${prefix}.svg`);
  assert.equal(crypto.createHash('sha256').update(svgBytes).digest('hex'), report.output.svg.sha256);
  assert.equal(bind(`${prefix}.spec.json`).sha256, report.spec.sha256);
  return {
    figure: `fig-g10-${number}`,
    draft,
    status: 'AUTHOR_NATIVE_DRAFT_PASS_NOT_INDEPENDENTLY_APPROVED',
    oldBoundFiles: ['spec.json', 'render.json', 'svg'].map(ext => bind(`${oldPaths[number]}.${ext}`)),
    newBoundFiles: ['spec.json', 'render.json', 'svg', 'snapshot.json', 'widths-480-300.png'].map(ext => bind(`${prefix}.${ext}`)),
    focusedOriginalNotes: bind(path.join(root, `fig-g10-${number}.focused-pixel-notes.json`)),
    lifetimeRepairCounter: { before: 1, newRepairsThisRun: number === 86 ? 2 : 1, after: number === 86 ? 3 : 2, reset: false },
    isolatedChanges: changes.find(change => change.figure === `fig-g10-${number}`),
    furtherLocalChange: number === 86 ? localChange : null,
    allOtherExistingFieldsDeepEqual: true,
    validation: {
      externalDraftValidationCallsForFinalCandidate: 1,
      nativeRenderCallsForFinalCandidate: 1,
      nativeRendererInternalValidation: 'Existing unmodified renderer internally invokes draft validation; not a rerun by the author',
      nativeStatus: report.status,
      nativeCollisions: report.collisions,
      displayChecks: report.displayChecks,
      snapshotCallsForFinalCandidate: 1,
      authorInspectionCountForFinalSheet: 1,
    },
    authorObservation: observations.observations.find(observation => observation.figure === `fig-g10-${number}`),
    independentApproval: false,
    canonicalReviewWritten: false,
    promoted: false,
  };
});
const result = {
  schema: 'stemrobin188-bounded-figure-author-result@1',
  ticket: 'STEMROBIN-188', book: '9-10g', lesson: 'geo910-c2-s3-n61',
  assignment: 'N61 FIG86/87 AFFECTED-02',
  role: 'AUTHOR_NOT_INDEPENDENT_REVIEWER',
  status: 'AUTHOR_NATIVE_DRAFTS_AVAILABLE_NOT_INDEPENDENTLY_APPROVED',
  repo, newWriteRoot: root, generatedOn: new Date().toISOString(),
  authorization: {
    liveRead: bind(path.join(root, 'commands/live188-read/stdout.txt')),
    ticketId: authorization.id, ticketStateGroup: authorization.state_group,
    override: 'The active ticket expressly authorizes ordinary reversible repairs and source/review-grounded content repairs. Internal one revision, third attempt and FIRST1/1 are not new approval gates.',
    narrowHumanScope: 'Only N61 fig86 A1 placement and fig87 O1 association; no independent reviewer started, peer messaging, paid models, DB/Git/core/publish writes, passed figure reopening or full redraw.',
    oldInternalRepairLimitsRemainHistorical: true,
    notASecondApprovalOrReportingFramework: true,
  },
  figures,
  repairCounters: { 'fig-g10-86': 3, 'fig-g10-87': 2, previousLifetimeEach: 1, neverReset: true },
  failures: [{
    figure: 'fig-g10-86', draft: 'repair2', stage: 'native-render', exitCode: 2,
    collision: { id: 'A1-label', position: 'W', score: 10000 },
    failedBoundFiles: ['spec.json', 'render.json', 'svg', 'snapshot.json', 'widths-480-300.png']
      .map(ext => bind(path.join(root, `fig-g10-86.repair2.${ext}`))),
    diagnosis: bind(path.join(root, 'fig86-repair2-diagnosis.json')),
    disposition: 'Actual fresh failure preserved read-only; only diagnosed A1 offset changed for repair3. No failed spec/command repeated.',
    counterAtFailure: 2, counterAfterCorrection: 3,
  }],
  historyAndHoldReferences: [
    { file: bind(`${base}/n61-fig8586-author/author-result.json`), scope: 'Old figure86 initial/repair1 failures, lifetime count1, image ledger, fees/governance and inherited HOLDs retained byte-identically.' },
    { file: bind(`${base}/n61-fig8788-author/author-result.json`), scope: 'Old figure87 FIRST failure and repair1 count1, image ledger and procedural/source HOLDs retained byte-identically.' },
    { file: bind(`${base}/n61-fig8788-review-01/fig-g10-87-current-review.json`), scope: 'Historical independent F87-CURRENT-O1-LABEL-ASSOCIATION FAIL and then-operative limit1 are not erased or reclassified. The active ticket overrides the obsolete stop instruction for this repair only.' },
    { file: bind(`${base}/n61-fig8788-review-01/inherited-state.json`), scope: 'All source, fine-codepoint/font, procedural and integration history retained.' },
  ],
  holds: [
    'Independent affected-content review not performed or granted by this author.',
    'All inherited source/glyph/font/procedural/integration HOLDs remain unchanged.',
    'Isolated headless 480/300 widths are not actual headed product acceptance.',
    'Temporary changed drafts only; no template application, source/text admission, promotion, whole lesson approval or publication.',
  ],
  imageLedger: observations.imageLedger,
  fees: {
    newPaidCalls: 0, newPaidCostUSD: 0,
    inheritedFees: 'Retained in unchanged prior author/history bindings; no inherited amount or paid usage reset.',
  },
  protectedBindings: { before: bind(path.join(root, 'bindings.before.json')), after: bind(path.join(root, 'bindings.after.json')), files: before.length, bytesAndModesUnchanged: true },
  commandReceipts,
  snapshotToolVersions: {
    originalRepair2ReceiptToolBytes: bind(path.join(root, 'snapshot-targeted.repair2-tool.mjs')),
    changedRepair3ToolBytes: bind(path.join(root, 'snapshot-targeted.mjs')),
  },
  restrictionsObserved: {
    allCommandsExplicitRepoWorkdir: true,
    protectedInputsWrites: 0, stableSkillEdits: 0, sourceWrites: 0, DBWrites: 0,
    gitOperations: 0, coreWrites: 0, publish: 0, paidModels: 0, peerMessages: 0,
    createdOrReopenedAuthorsOrReviewers: 0, independentReviewersStarted: 0,
    passedFiguresOpenedOrRedrawn: [], handEditedSVG: false, externalBrowserRequests: 0,
    sameFailedCommandOrSpecRepeated: false, execSessionsStillRunning: 0,
    liveTicketAccess: 'n-plane read-only GETs; no backend mutation',
  },
  outputIndex: { path: path.relative(repo, path.join(root, 'output-index.json')), paths: 'repo-root-relative', excludesItself: true },
};
write('author-result.json', result);
write('finalization-command.json', {
  schema: 'bounded-author-command@1', cwd: repo, command: 'node',
  args: [path.relative(repo, fileURLToPath(import.meta.url))],
  executable: bind(fileURLToPath(import.meta.url)),
  outcome: 'Protected bytes/modes, isolated final diffs, native bindings, counters and image ledger verified before indexing.',
});
const walk = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
  const p = path.join(directory, entry.name);
  if (entry.isSymbolicLink()) throw new Error('Output index refuses symbolic links');
  return entry.isDirectory() ? walk(p) : [p];
});
const outputs = walk(root).filter(p => p !== path.join(root, 'output-index.json')).sort().map(p => {
  const { mode, ...binding } = bind(p);
  assert(!path.isAbsolute(binding.path));
  assert(!binding.path.split(path.sep).includes('..'));
  assert.equal(fs.realpathSync(path.join(repo, binding.path)), p);
  return binding;
});
write('output-index.json', { schema: 'stemrobin188-output-index@1', root: repo, outputs, excludesItself: true });
const index = read(path.join(root, 'output-index.json'));
for (const output of index.outputs) {
  const { mode, ...actual } = bind(output.path);
  assert.deepEqual(actual, output);
}
assert.equal(index.outputs.length, walk(root).length - 1);
console.log(JSON.stringify({
  authorResult: bind(path.join(root, 'author-result.json')),
  outputIndex: bind(path.join(root, 'output-index.json')),
  outputPathsVerified: outputs.length, protectedBytesAndModesVerified: before.length,
  figure86: { nativeDraft: 'pass', lifetimeRepairs: 3 },
  figure87: { nativeDraft: 'pass', lifetimeRepairs: 2 },
  imageUnits: 8, independentApproval: false,
}));
