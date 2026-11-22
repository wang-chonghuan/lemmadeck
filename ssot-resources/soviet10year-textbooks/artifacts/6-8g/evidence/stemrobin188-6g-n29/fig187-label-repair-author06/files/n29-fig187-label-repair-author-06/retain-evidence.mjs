import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { R, OWN, bind, read, write } from './evidence.mjs';

assert.equal(process.cwd(), R);
const figure = suffix => path.join(OWN, 'figures', `fig-187.${suffix}`);
const input = read(path.join(path.dirname(OWN), 'n29-fig187189-author-collection-06/fig187-repair-author-input.json'));
const failureRoot = path.join(OWN, 'failures/author-visual-first');
const visual = read(path.join(OWN, 'author-visual.json'));
assert.equal(visual.status, 'AUTHOR_ONLY_VISUAL_HOLD');
assert.equal(bind(path.join(OWN, 'contacts/fig-187.contact.png')).sha256, visual.contactInspected.sha256);
const helperPath = path.join(OWN, 'evidence.mjs');
const helperNow = fs.readFileSync(helperPath, 'utf8');
const expanded = `  if (result.status !== 0 && chargeFailure) {
    const nestedFailureAlreadyCharged = read(path.join(OWN, 'image-ledger.json')).events
      .slice(countersBefore.events.length).some(e => e.kind === 'failed-render-or-display-attempt');
    if (!nestedFailureAlreadyCharged) ledgerEvent({ kind: 'failed-render-or-display-attempt', stage, charge: 1, conservativelyCharged: true });
  }`;
const original = `  if (result.status !== 0 && chargeFailure) ledgerEvent({ kind: 'failed-render-or-display-attempt', stage, charge: 1, conservativelyCharged: true });`;
assert.ok(helperNow.includes(expanded));
const helperV1 = helperNow.replace(expanded, original);
const v1Hash = crypto.createHash('sha256').update(helperV1).digest('hex');
const nativeReceipt = read(path.join(OWN, 'receipts/native187-repair-03.json'));
assert.equal(v1Hash, nativeReceipt.helpersBefore.find(h => h.path === helperPath).sha256);
const v1Path = path.join(OWN, 'helper-versions/evidence.v1.mjs.before');
write(v1Path, helperV1);
fs.chmodSync(v1Path, 0o444);
write(path.join(OWN, 'helper-versions/bindings.json'), {
  note: 'The recording helper gained nested-failure deduplication before display. Its exact earlier bytes are reconstructed by the single known patch, verified against both existing PASS receipts, and retained once. No producer was replayed.',
  before: bind(v1Path), current: bind(helperPath),
  receiptsUsingV1: ['repair-spec', 'native187-repair-03']
});
for (const name of ['spec.json', 'context']) {
  const inputPath = name === 'context' ? path.join(OWN, 'context/fig-187.context.json') : figure(name);
  const target = path.join(failureRoot, 'inputs', path.basename(inputPath));
  write(target, fs.readFileSync(inputPath));
  fs.chmodSync(target, 0o444);
}
const helperSnapshots = [];
for (const p of [helperPath, path.join(OWN, 'display.mjs'), path.join(OWN, 'run-stage.mjs')]) {
  const target = path.join(failureRoot, 'helpers', path.basename(p) + '.before');
  write(target, fs.readFileSync(p));
  fs.chmodSync(target, 0o444);
  helperSnapshots.push({ current: bind(p), snapshot: bind(target) });
}
const ledgerPath = path.join(OWN, 'image-ledger.json');
const ledger = read(ledgerPath);
assert.equal(ledger.chargedImages, 8);
assert.equal(ledger.events.length, 8);
const countersPath = path.join(failureRoot, 'image-counters.json');
write(countersPath, {
  ...ledger, actualImageToolOpens: 2, contactOpenCompleted: true,
  visualFailureImageCharge: 'The already-charged single-contact-open found the visual failure. No additional image load, failed render or ninth charge occurred.',
  historicalCumulativeChargedImages: 16
});
fs.chmodSync(countersPath, 0o444);
const nativeHelper = bind(path.join(R, '.agents/skills/ld-s10y-image/scripts/render_spec.mjs'));
const inheritedHelper = input.originalFailureSnapshots[2].nativeHelperSnapshot;
assert.equal(nativeHelper.sha256, inheritedHelper.sha256);
assert.equal(bind(inheritedHelper.path).sha256, nativeHelper.sha256);
const retained = [
  figure('spec.json'), figure('svg'), figure('render.json'),
  path.join(OWN, 'context/fig-187.context.json'), path.join(OWN, 'author-visual.json'),
  path.join(OWN, 'contacts/fig-187.contact.png'), path.join(OWN, 'contacts/fig-187.contact.svg'),
  path.join(OWN, 'contacts/fig-187.display.json'), path.join(OWN, 'contacts/fig-187.measurements.json'),
  path.join(OWN, 'receipts/physical-display.json'), path.join(OWN, 'receipts/physical-display.stdout'), path.join(OWN, 'receipts/physical-display.stderr'),
  path.join(OWN, 'receipts/native187-repair-03.json'), path.join(OWN, 'receipts/native187-repair-03.stdout'), path.join(OWN, 'receipts/native187-repair-03.stderr'),
  path.join(OWN, 'receipts/native-resvg-contact.json'), path.join(OWN, 'receipts/native-resvg-contact.stdout'), path.join(OWN, 'receipts/native-resvg-contact.stderr'),
  path.join(OWN, 'receipts/diagnose-spans.json'), path.join(OWN, 'receipts/diagnose-spans.stdout'), path.join(OWN, 'receipts/diagnose-spans.stderr')
].map(bind);
write(path.join(failureRoot, 'failure.json'), {
  schema: 'STEMROBIN-188/author-first-visual-failure@1',
  status: 'AUTHOR_ONLY_HOLD_INHERITED_SPAN_RENDERING', retainedAt: new Date().toISOString(),
  firstFailure: 'Single contact inspection after native PASS; six h/r spans absent',
  exactInputs: [bind(path.join(failureRoot, 'inputs/fig-187.spec.json')), bind(path.join(failureRoot, 'inputs/fig-187.context.json'))],
  inputsOutputsReceiptsStreamsRetainedInPlace: retained,
  helperSnapshots, nativeHelper: { current: nativeHelper, exactUnchangedExistingSnapshot: bind(inheritedHelper.path) },
  imageCounters: bind(countersPath),
  diagnosis: read(path.join(OWN, 'receipts/diagnose-spans.stdout')),
  repairDisposition: 'Native h-label collision fixed. No authorized bracket/renderer edit and no ninth image budget; visual approval remains HOLD.',
  separateTextOwnerHold: visual.separateTextOwnerHold,
  independentApproval: false, dependentStagesStopped: true
});
console.log(JSON.stringify({ retainedFailure: bind(path.join(failureRoot, 'failure.json')), exactOldRecordingHelper: bind(v1Path), sessionsOpen: 0 }));
