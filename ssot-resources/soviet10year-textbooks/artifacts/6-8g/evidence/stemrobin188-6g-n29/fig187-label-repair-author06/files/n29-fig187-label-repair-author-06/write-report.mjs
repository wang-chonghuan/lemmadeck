import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { R, OWN, bind, hash, read, write, run } from './evidence.mjs';

assert.equal(process.cwd(), R);
const figure = suffix => path.join(OWN, 'figures', `fig-187.${suffix}`);
const receipt = run('retain-first-visual-failure', [process.execPath, path.join(OWN, 'retain-evidence.mjs')], {
  inputs: [figure('spec.json'), figure('svg'), figure('render.json'), path.join(OWN, 'author-visual.json'), path.join(OWN, 'image-ledger.json')],
  outputs: [path.join(OWN, 'failures/author-visual-first/failure.json'), path.join(OWN, 'failures/author-visual-first/image-counters.json'), path.join(OWN, 'helper-versions/bindings.json')]
});
assert.equal(receipt.exitCode, 0);
const inputPath = path.join(path.dirname(OWN), 'n29-fig187189-author-collection-06/fig187-repair-author-input.json');
const input = read(inputPath), spec = read(figure('spec.json')), render = read(figure('render.json'));
const firstPath = path.join(OWN, 'first/fig-187.FIRST.json'), sealPath = path.join(OWN, 'first/fig-187.seal.json');
const seal = read(sealPath);
assert.equal(hash(inputPath), '27ce45f9542b0da86be11767579b57860fbf524b845d2110bc31e418b6d3de20');
assert.equal(hash(firstPath), seal.first.sha256);
assert.equal(bind(firstPath).mode, '0444');
assert.equal(bind(sealPath).mode, '0444');
assert.ok(bind(figure('spec.json')).birthtime > seal.sealedAt);
for (const ref of [input.source, input.sourceFIRST.inventory, input.sourceFIRST.seal, input.failedSpec, input.failedSvg, input.failedRender, input.originalContext, input.candidateModernText, input.priorRepairs.binding, input.originalReport, input.collection]) {
  assert.equal(hash(ref.path), ref.sha256, `Retained binding drift: ${ref.path}`);
}
const old = read(input.failedSpec.path), restored = structuredClone(spec);
restored.objects.find(o => o.id === 'right-h-name').labelPlacement.offset = [0, 0];
assert.deepEqual(restored, old);
assert.equal(render.status, 'pass');
assert.deepEqual(render.collisions, []);
const display = read(path.join(OWN, 'contacts/fig-187.display.json'));
assert.equal(display.browser.sessionsOpen, 0);
assert.equal(display.browser.closed, true);
assert.deepEqual(display.browser.requests, []);
const ledger = read(path.join(OWN, 'failures/author-visual-first/image-counters.json'));
assert.equal(ledger.chargedImages, 8);
const receiptsDir = path.join(OWN, 'receipts');
const executions = fs.readdirSync(receiptsDir).filter(n => n.endsWith('.json')).sort().map(n => {
  const p = path.join(receiptsDir, n), r = read(p);
  assert.equal(r.cwd, R);
  assert.equal(r.exitCode, 0);
  assert.equal(hash(r.streams.stdout.path), r.streams.stdout.sha256);
  assert.equal(hash(r.streams.stderr.path), r.streams.stderr.sha256);
  return { binding: bind(p), ...r };
});
const commands = [
  'pwd',
  "sed -n '1,240p' .intentfold/readme.md",
  "sed -n '1,260p' .intentfold/charter/engineering.md",
  "rg --files -g 'production-resume.md' -g 'SKILL.md' .intentfold .agents/skills/ld-s10y-image",
  "sed -n '1,300p' .agents/skills/ld-s10y-image/SKILL.md",
  'shasum -a 256 .intentfold/tickets/STEMROBIN-188/tmp/n29-fig187189-author-collection-06/fig187-repair-author-input.json',
  'cat .intentfold/tickets/STEMROBIN-188/tmp/n29-fig187189-author-collection-06/fig187-repair-author-input.json',
  "sed -n '1,300p' .claude/skills/ld-s10y-lesson/references/production-resume.md",
  "sed -n '1,320p' .agents/skills/ld-s10y-image/references/figure-spec.md",
  "sed -n '1,240p' .agents/skills/ld-s10y-image/references/routing.md",
  "sed -n '1,220p' .agents/skills/ld-s10y-image/references/quality-gate.md",
  "stat -f '%N|%Sp|%OLp|%z|%SB|%Sm|%Sc' -t '%Y-%m-%dT%H:%M:%S%z' .intentfold/tickets/STEMROBIN-188/tmp/n29-draft-first-06/artifacts/6-8g/figures/fig-187.png",
  'shasum -a 256 .intentfold/tickets/STEMROBIN-188/tmp/n29-draft-first-06/artifacts/6-8g/figures/fig-187.png',
  "stat -f '%N|%Sp|%OLp|%z' .intentfold/tickets/STEMROBIN-188/tmp/n29-fig187-label-repair-author-06",
  "sed -n '1,240p' .intentfold/charter/operations.md",
  'node .intentfold/tickets/STEMROBIN-188/tmp/n29-fig187-label-repair-author-06/seal-first.mjs'
];
write(path.join(OWN, 'preflight-tool-observations.json'), {
  provenance: 'Initial read-only functions.exec_command outputs observed in this tool transcript before the receipt helper existed. No command was replayed to fabricate original streams.',
  commands: commands.map(command => ({ command, cwd: R, exitCode: command.startsWith("stat -f '%N|%Sp|%OLp|%z' ") ? 1 : 0, streams: { source: 'functions.exec_command tool response', fileCapture: false } })),
  expectedOwnRootAbsence: { exitCode: 1, stderr: 'stat: .intentfold/tickets/STEMROBIN-188/tmp/n29-fig187-label-repair-author-06: stat: No such file or directory', meaning: 'The new ownership root did not yet exist; this is not a render or image failure.' },
  sealObservedStdout: { first: bind(firstPath), seal: bind(sealPath), sealedAt: seal.sealedAt, exitCode: 0, stderr: '' },
  laterReadOnlyInspections: 'Old failed spec/render/receipts/repairs/context and relevant installed helper excerpts were read only after own FIRST seal. They did not execute a gate or load another image.',
  producerAndDisplayCommands: 'Exact actual executable argv/cwd/exitCode/full stdout and stderr are in the stage receipts included in Report.json.',
  noNetworkGitDbOrOtherChatActions: true
});
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const p = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(p) : entry.isFile() ? [p] : [];
  });
}
const ownedFiles = walk(OWN).filter(p => path.basename(p) !== 'Report.json').sort();
const report = {
  schema: 'STEMROBIN-188/affected-label-layout-author-report@1',
  status: 'AUTHOR_ONLY_LABEL_REPAIR_NATIVE_PASS_VISUAL_HOLD',
  ticket: 'STEMROBIN-188', task: 'SAME188-6', figure: 'fig-187', createdAt: new Date().toISOString(),
  repository: R, ownedRoot: OWN,
  authority: { installed: 'db613601', corresponding: '093a4baa', unchangedAsDirected: true, freshnessSetupGrillNotInvoked: true },
  current: { spec: bind(figure('spec.json')), svg: bind(figure('svg')), render: bind(figure('render.json')), context: bind(path.join(OWN, 'context/fig-187.context.json')), source: bind(input.source.path), input: bind(inputPath) },
  native: { status: render.status, objectCount: render.objects, labelCount: render.labels, collisions: render.collisions, displayChecks: render.displayChecks, includedNativeDraftValidation: true, standaloneDraftValidationRuns: 0, attemptsThisContext: 1, affectedStageOnly: true },
  edit: { object: 'right-h-name', onlyChangedField: 'labelPlacement.offset', before: [0, 0], after: [-12, 0], equivalentCssShiftAt640: [-8, 0], fontSize: 28, allOtherFieldsByteStructureEqual: true, geometryPointsLinesBracketsSpansAssertionsGivensLabelsInequalitiesOrderUnchangedInSpec: true, rightB: { fontSize: 24, position: 'NW', offset: [5, -30], unchanged: true }, generatedSvgHandEdited: false, binding: bind(path.join(OWN, 'repair-binding.json')) },
  firstSeal: { ownFirst: bind(firstPath), ownSeal: bind(sealPath), actualOrder: seal.order, actualSealedAt: seal.sealedAt, sourceHashCheckedBeforeOpenAndAgainAtSeal: true, sourceOpenedOnceBeforeOldSpec: true, ownFirstUnchangedAfter0444Seal: true, originalFirst: bind(input.sourceFIRST.inventory.path), originalSeal: bind(input.sourceFIRST.seal.path), originalsUnchanged: true, specAuthorshipBirthtime: bind(figure('spec.json')).birthtime },
  historical: {
    priorFailedNativeRenders: 3, priorRepairs: 2, priorChargedImages: 8,
    oldFailedSpec: bind(input.failedSpec.path), oldFailedSvg: bind(input.failedSvg.path), oldFailedRender: bind(input.failedRender.path),
    oldFailureSnapshotBindings: input.originalFailureSnapshots, oldRepairs: bind(input.priorRepairs.binding.path),
    oldOriginalReport: bind(input.originalReport.path), oldCollection: bind(input.collection.path), noHistoricalCounterReset: true
  },
  totals: { nativeAttemptsAcrossHistory: 4, failedNativeRendersAcrossHistory: 3, successfulNativeRendersThisContext: 1, repairsAcrossHistory: 3, ownVisualFailures: 1, historicalPlusCurrentConservativeImageCharges: 16 },
  authorVisual: read(path.join(OWN, 'author-visual.json')),
  physicalDisplay: { status: 'MEASUREMENTS_PASS_NOT_VISUAL_APPROVAL', evidence: bind(path.join(OWN, 'contacts/fig-187.display.json')), contract: 'Fixed 640px instructional media, actual 358px and 300px viewport windows', measurements: display.measurements, pixelChecks: display.resvgPixelChecks, scrollEndReachability: display.scrollEndReachability, browser: display.browser, native960And640FullViewsInspectedOnce: true, headedProductAcceptance: false },
  holds: [
    { owner: 'affected figure author / parent integration', status: 'HOLD_INHERITED_H_R_SPANS_OFFCANVAS', reason: 'All six unchanged bracket paths are multiplied by raw-path-layer scale(30 30); they are invisible, so visual/semantic source fidelity is not approved.', nativeCollisionRepairDoesNotClear: true, evidence: bind(path.join(OWN, 'failures/author-visual-first/failure.json')), authorizedLabelOnlyScopeAndImageBudgetPreventFurtherRepair: true },
    { owner: 'text owner', status: 'HOLD_PANEL_REFERENCE_DISCREPANCY', reason: 'Modern a/b/c panels versus retained Cyrillic prose references. Separate and unchanged.', proseEdited: false, claimedCleared: false }
  ],
  imageLedger: ledger,
  allExecAndBrowserSessions: { execSessionsOpen: 0, browserSessionsOpen: 0, displayBrowserClosedBeforeReturn: true, noDevServerStarted: true, evidenceBasis: 'All exec calls returned completed exit status; both native renderer finally-close and isolated display explicit-close completed, and their synchronous child processes exited.' },
  executions,
  bootstrapEvidence: bind(path.join(OWN, 'preflight-tool-observations.json')),
  nativeValidationStreamLimitation: 'Installed render_spec.mjs invokes and checks its validator internally, but discards successful validator stdout. Native parent stdout/stderr are retained exactly; no standalone validation replay fabricated missing inner streams.',
  unaffected: { figures188189: 'Existing author native+visual PASS reused untouched: no image reopens, rerenders, edits or gate replay', oldSource: 'unchanged', source189GlyphIssuesRelevant: false },
  forbiddenActionsPerformed: { setup: false, update: false, grill: false, network: false, database: false, git: false, paid: false, publish: false, chat: false, handoff: false, canonicalEdit: false, toolEdit: false, charterEdit: false, proseEdit: false, wholeBookGate: false, recordReview: false, finalizeLesson: false, renderLesson: false, wholePdfRuntimeOrEarlierPackageCopy: false },
  approvals: { independentReview: false, modernFigureApproved: false, lessonApproved: false, published: false, retentionIntegrationOwner: 'parent' },
  allOwnedEvidenceManifest: ownedFiles.map(bind),
  manifestScope: 'Every owned file present before writing Report.json, including exact streams, receipts, helpers, immutable FIRST and first visual failure inputs/counters. Report.json itself is excluded from its own hash manifest; its actual SHA-256 is returned as text after process completion.'
};
write(path.join(OWN, 'Report.json'), report);
console.log(JSON.stringify({ report: bind(path.join(OWN, 'Report.json')), status: report.status, ownedEvidenceFiles: ownedFiles.length, chargedImages: 8, execSessionsOpen: 0, browserSessionsOpen: 0 }));
