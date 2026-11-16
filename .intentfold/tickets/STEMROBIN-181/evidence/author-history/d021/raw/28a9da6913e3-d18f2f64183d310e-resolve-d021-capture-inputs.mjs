import assert from 'node:assert/strict';
import {
  read, bind, binding, bytes, hash, encode, immutableWrite, identity,
} from './d021-retention-preparation/retain-d021-evidence.mjs';

const base = '.intentfold/tickets/STEMROBIN-181/tmp';
const folder = `${base}/d021-retention-preparation/d021-retention-input-preparation`;
const input = `${folder}/d021-final-selection-411e610e41349549.json`;
const selection = await read(input);
const diagnostic = await read(`${folder}/main-closure-diagnostic-1.json`);
const recovered = [];
for (const number of [83, 84]) {
  const original = diagnostic.missingFiles.find(item =>
    item.path.endsWith(`/phy9-c2-s2-n${number}/lesson.template.json`));
  assert.ok(original);
  const source = `${base}/d021-n83-n84-text-20261116-a/n${number}/frozen/lesson.template.json`;
  const template = await read(source);
  template.section_breaks = [];
  const data = encode(template);
  assert.equal(hash(data), original.sha256, 'Historical template must reproduce its declared byte SHA.');
  const snapshot = `${folder}/recovered-templates/n${number}-${original.sha256}.json`;
  await immutableWrite(snapshot, data);
  recovered.push({
    original: binding(original), snapshot: await bind(snapshot), recoveredFrom: await bind(source),
    reconstruction: { field: 'section_breaks', value: [], method: 'Exact historical pre-break-registration bytes, not a new template or gate.' },
  });
}
const proofPath = `${folder}/main-template-recovery-proof.json`;
await immutableWrite(proofPath, encode({
  batch: 'D021', status: 'exact-historical-template-byte-recovery-no-new-review',
  input: await bind(input), helper: await bind(import.meta.filename), recovered,
}));
const proof = await bind(proofPath);
selection.history.push(proof);
selection.proofReports.push(proof);
selection.aliases.push(...recovered.map((row, index) => ({
  originalPath: row.original.path, ...row.snapshot,
  proof: { report: proof, originalTrail: ['recovered', index, 'original'],
    snapshotTrail: ['recovered', index, 'snapshot'] },
})));
const linkProof = {
  path: `${folder}/native-link-proofs-a2ae54febacc5dc5204ad184e9fac0e865cb63f336a560a4e9daa8fcd085cdec.json`,
  sha256: 'a2ae54febacc5dc5204ad184e9fac0e865cb63f336a560a4e9daa8fcd085cdec',
};
const correction = {
  path: `${base}/9p-n82-prose-correction-freeze.json`,
  sha256: '3e89ebe166490e4e0a634d553a3dc6a4a67791c4337ce5bcab82034d457c01be',
};
const resolvedPathReport = {
  path: `${base}/9p-n82-figure-review-157-proof/binding-and-context-checks.json`,
  sha256: '66422ecb7c43af520eba029a0e59d9e91fc79f9c410c24cad601d51cffb74494',
};
selection.bindingProofs.push(
  { report: linkProof, trail: ['rows', 1, 'link', 'target'],
    proof: linkProof, proofTrail: ['rows', 1, 'target'] },
  { report: resolvedPathReport, trail: ['checks', 'currentLessonResolvedPath'],
    proof: correction, proofTrail: ['bindings', 'lessonTemplate'] },
);
const runtimeReport = {
  path: '.tmp/STEMROBIN-181/9p-d021-n84-fig160/author-freeze.json',
  sha256: '548d053671c28b2d75f66f32b8c9503563b0b18c2e71b029b4b0a7c880ab698d',
};
const executable = binding((await read(runtimeReport.path)).executable);
for (const item of diagnostic.external) {
  if (item.path !== executable.path) continue;
  if (selection.provenanceOnly.some(old => identity(old.report) === identity(item.report) &&
    JSON.stringify(old.trail) === JSON.stringify(item.trail))) continue;
  selection.provenanceOnly.push({
    report: item.report, trail: item.trail, path: item.path,
    kind: 'runtime-identity', classification: 'harness-only-provenance',
    activeDependency: false,
    reason: 'Exact external Chromium identity is already byte-hashed by the actual author/native runtime receipt; no binary is a product asset.',
    runtimeIdentityProof: { report: runtimeReport, trail: ['executable'] },
  });
}
const ticketRead = diagnostic.pending.find(item =>
  JSON.stringify(item.trail) === JSON.stringify(['live_ticket_read', 'helper']));
assert.ok(ticketRead);
selection.provenanceOnly.push({
  report: ticketRead.report, trail: ticketRead.trail, path: ticketRead.path,
  kind: 'ticket-read-transport', classification: 'harness-only-provenance',
  activeDependency: false, reason: 'Existing exact Plane helper identity in the original ticket-read transport, not generation input.',
});
const output = `${folder}/d021-main-final-selection.json`;
await immutableWrite(output, encode(selection));
console.log(JSON.stringify(await bind(output)));
