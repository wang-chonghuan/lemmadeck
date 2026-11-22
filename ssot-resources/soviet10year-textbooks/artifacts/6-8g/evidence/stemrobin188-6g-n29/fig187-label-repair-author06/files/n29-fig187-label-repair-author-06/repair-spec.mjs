import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { R, OWN, bind, hash, read, write } from './evidence.mjs';

assert.equal(process.cwd(), R);
const inputPath = path.join(path.dirname(OWN), 'n29-fig187189-author-collection-06/fig187-repair-author-input.json');
assert.equal(hash(inputPath), '27ce45f9542b0da86be11767579b57860fbf524b845d2110bc31e418b6d3de20');
const input = read(inputPath);
const firstPath = path.join(OWN, 'first/fig-187.FIRST.json');
const sealPath = path.join(OWN, 'first/fig-187.seal.json');
const seal = read(sealPath);
assert.equal(bind(firstPath).mode, '0444');
assert.equal(bind(sealPath).mode, '0444');
assert.equal(hash(firstPath), seal.first.sha256);
const referenced = [input.source, input.candidateModernText, input.originalContext, input.sourceFIRST.inventory, input.sourceFIRST.seal, input.failedSpec, input.failedSvg, input.failedRender, input.priorRepairs.binding];
for (const ref of referenced) assert.equal(hash(ref.path), ref.sha256, `Binding drift: ${ref.path}`);
const failureSnapshots = input.originalFailureSnapshots.filter(s => s.path);
for (const ref of failureSnapshots) assert.equal(hash(ref.path), ref.sha256);
const third = input.originalFailureSnapshots[2];
for (const ref of Object.values(third)) assert.equal(hash(ref.path), ref.sha256);
const old = read(input.failedSpec.path);
const failedRender = read(input.failedRender.path);
assert.equal(failedRender.status, 'fail');
assert.deepEqual(failedRender.collisions, input.nativeCollisions);
assert.equal(old.source.image.sha256, input.source.sha256);
assert.equal(old.display.minTextPx, 16);
assert.deepEqual(old.display.widths, [640]);
const candidate = structuredClone(old);
const label = candidate.objects.find(o => o.id === 'right-h-name');
assert.deepEqual(label.labelPlacement, { position: 'CENTER', offset: [0, 0] });
label.labelPlacement.offset = [-12, 0];
const restored = structuredClone(candidate);
restored.objects.find(o => o.id === 'right-h-name').labelPlacement.offset = [0, 0];
assert.deepEqual(restored, old, 'Only the right h placement offset may change');
assert.deepEqual(candidate.objects.find(o => o.id === 'right-B').labelPlacement, { position: 'NW', offset: [5, -30] });
assert.equal(candidate.objects.find(o => o.id === 'right-B').fontSize, 24);
const target = path.join(OWN, 'figures/fig-187.spec.json');
write(target, candidate);
fs.mkdirSync(path.join(OWN, 'runtime-tmp'), { recursive: true });
write(path.join(OWN, 'context/fig-187.context.json'), {
  schema: 'STEMROBIN-188/affected-figure-author-context@1',
  status: 'AUTHOR_ONLY_REPAIR_CONTEXT',
  input: bind(inputPath), source: bind(input.source.path), candidateModernText: bind(input.candidateModernText.path),
  originalContext: bind(input.originalContext.path), relevantAuthoritativeText: old.source.authoritativeText,
  ownFirst: bind(firstPath), ownSeal: bind(sealPath), inheritedSourceFirst: bind(input.sourceFIRST.inventory.path),
  inheritedSourceSeal: bind(input.sourceFIRST.seal.path),
  inventoryUnchanged: old.source.inventory,
  interpretation: 'Three cases and h/r spans match own original-pixel FIRST. Move only right h left; original source review is not modern approval.',
  panelReferenceHold: { status: 'HOLD_TEXT_OWNER', modernPanelOrder: ['(a)', '(b)', '(c)'], proseReferences: 'Cyrillic as retained; no prose edits or clearance claim.' },
  unaffected188189: 'Prior author native+visual PASS reused without rerender, image reopen or asset edits.',
  authority: { installedIntentfold: 'db613601', corresponding: '093a4baa', basis: 'direct human instruction, unchanged; no setup/update/Grill/network/DB/Git/paid/publish/chat/handoff' }
});
write(path.join(OWN, 'repair-binding.json'), {
  status: 'AUTHOR_ONLY_AFFECTED_FIG187_LABEL_LAYOUT_REPAIR',
  authoredAt: new Date().toISOString(), originalFailedSpec: bind(input.failedSpec.path),
  originalFailedSvg: bind(input.failedSvg.path), originalFailedRender: bind(input.failedRender.path),
  originalFailureSnapshots: failureSnapshots.map(ref => bind(ref.path)), originalThirdFailure: Object.fromEntries(Object.entries(third).map(([key, ref]) => [key, bind(ref.path)])),
  originalRepairs: bind(input.priorRepairs.binding.path), originalFirst: bind(input.sourceFIRST.inventory.path), originalFirstSeal: bind(input.sourceFIRST.seal.path),
  ownFirst: bind(firstPath), ownSeal: bind(sealPath), currentSpec: bind(target),
  changes: [{ path: '/objects/right-h-name/labelPlacement/offset', before: [0, 0], after: [-12, 0], rationale: 'Separate the remaining h/B padded-label intersection; h remains above its unchanged O-to-B bracket.' }],
  exactOnlyChangeConfirmed: true, assertionsUnchanged: true, minimumTextUnchanged: true,
  circlesPointsLinesBracketsInequalitiesOrderGivensSemanticsUnchanged: true,
  rightB: { fontSize: 24, position: 'NW', offset: [5, -30], unchanged: true },
  historical: { failedRenders: 3, repairs: 2, chargedImages: 8 },
  current: { plannedNativeAttempts: 1, repairNumberAcrossHistory: 3 },
  onlyFailedStage: 'fig-187 native renderer including its internal draft validation',
  noStandaloneValidationReplay: true,
  sourceOriginalAndFirstUnchanged: true,
  generatedSvgHandEdited: false,
  separateHold: 'HOLD_TEXT_OWNER_PANEL_REFERENCES'
});
console.log(JSON.stringify({ currentSpec: bind(target), ownFirst: bind(firstPath), repair: 'right-h-name labelPlacement.offset only: [0,0] -> [-12,0]' }));
