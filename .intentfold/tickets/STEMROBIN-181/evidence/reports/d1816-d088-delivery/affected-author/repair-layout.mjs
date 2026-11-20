import path from 'node:path';
import assert from 'node:assert/strict';
import {E, O, B, load, bind, save, sha, editions, differences} from './common.mjs';

const prepared = load(path.join(E, 'prepared.json'));
const failurePath = path.join(O, 'figures/modern-us-neutral/fig-286.render.json');
const failure = load(failurePath);
assert.equal(failure.status, 'fail');
assert.deepEqual(failure.collisions.map(row => row.id), [
  'source-right-B-prime-label-label', 'source-left-B-prime-label-label', 'text-decreasing-flux-label']);
const base = load(path.join(B, 'author-freeze.json'));
const initialWhitelist = load(path.join(E, 'exact-diff-whitelist.json'));
const results = [];
for (const [index, name] of editions.entries()) {
  const initial = prepared.specs[index];
  const spec = load(initial.after.path);
  const old = structuredClone(spec);
  const binding = load(initial.textBinding.path);
  for (const [side, x] of [['left', 386], ['right', 498]]) {
    const label = spec.objects.find(row => row.id === `source-${side}-B-prime-label`);
    const leaderID = `modern-relocated-${side}-B-prime-leader`;
    label.at = [x, 605];
    const leader = spec.objects.find(row => row.id === leaderID);
    leader.from = [x, 586];
    const connection = spec.assertions.find(row => row.id === leaderID + '-connects');
    connection.from = leader.from;
    const relation = spec.assertions.find(row => row.id === leaderID + '-label-below');
    relation.id = leaderID + '-label-above';
    relation.from = label.at;
    relation.dy = -33;
    const labels = spec.source.inventory.find(row => row.id === 'source-labels');
    labels.assertions = labels.assertions.map(id => id === leaderID + '-label-below'
      ? leaderID + '-label-above' : id);
    binding.printedLabelRelocations.find(row => row.labelID === label.id).modernAt = label.at;
  }
  const file = path.join(O, 'figures-repaired', name, 'fig-286.spec.json');
  save(file, spec);
  binding.currentSpec = bind(file);
  binding.sourceContextSHA256 = sha(JSON.stringify(spec.source));
  binding.repairHistory = {
    originalCandidate: initial.after, failedZHRender: bind(failurePath),
    reason: 'Native renderer found label/arrow and caption overlap; only relocated label and leader placement changed.',
    geometryAndWordingChangedByLayoutRepair: false, independentApproval: false,
  };
  const contextFile = path.join(O, 'figures-repaired', name, 'fig-286.text-binding.json');
  save(contextFile, binding);
  const finalDiff = differences(load(base.figures[index].spec.path), spec);
  results.push({edition: name, before: base.figures[index].spec, after: bind(file),
    textBinding: bind(contextFile), exactPermittedPointers: finalDiff.map(row => row.pointer),
    diff: finalDiff, layoutRepairDiff: differences(old, spec), initialCandidate: initial.after});
}
save(path.join(E, 'layout-failure-and-targeted-repair.json'), {
  schema: 'STEMROBIN-181/affected-author-layout-repair@1',
  failedRender: bind(failurePath), failedSVG: bind(path.join(O, 'figures/modern-us-neutral/fig-286.svg')),
  failedPreview: bind(path.join(O, 'figures/modern-us-neutral/fig-286.preview.png')),
  failedCall: bind(path.join(E, 'native/zh-native-render/receipt.json')),
  failureObserved: failure.collisions, initialSpecCandidates: prepared.specs.map(row => row.after),
  oldPreviewOpened: false, newImageOpens: 0,
  onlyPlacementRepair: true, speculativePhysicsAdded: false,
  finalSpecs: results, independentApproval: false,
});
save(path.join(E, 'final-exact-diff-whitelist.json'), {
  ...initialWhitelist,
  supersedesOwnedInitialWhitelistForFinalCandidates: bind(path.join(E, 'exact-diff-whitelist.json')),
  specs: results,
  objectDiffs: results.map(row => {
    const before = load(row.before.path);
    const after = load(row.after.path);
    return {edition: row.edition, changedObjects: [...new Set([...before.objects, ...after.objects].map(object => object.id))]
      .flatMap(id => {
        const a = before.objects.find(object => object.id === id);
        const b = after.objects.find(object => object.id === id);
        if (JSON.stringify(a) === JSON.stringify(b)) return [];
        assert.ok(initialWhitelist.figureChangedObjectIDs.includes(id), id);
        return [{id, differences: differences(a, b)}];
      })};
  }),
  copiedOnlyNecessaryWorkingInputs: [prepared.newENTemplate, ...results.map(row => row.after)],
  failedCandidateAndReceiptsPreserved: true,
});
save(path.join(E, 'prepared-layout-repaired.json'), {
  ...prepared, status: 'affected-placement-repaired-ready-for-native-render',
  specs: results.map(({diff, layoutRepairDiff, exactPermittedPointers, ...row}) => row),
  targetedLayoutRepairs: 1, initialFailedRenders: 1, approvals: 0,
});
console.log(JSON.stringify({status: 'layout-repaired', changedSourceGeometry: false,
  preservedFailedRenders: 1, labelsAtYUser: 605}));
