import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = process.cwd();
assert.equal(repo, '/Users/yong/.codex/worktrees/00b1/lemmadeck');
const owned = path.join(repo, 'tmp/d1224-n99-first-independent-text-review');
const ticket = '.intentfold/tickets/STEMROBIN-181';
const hash = (filename) => crypto.createHash('sha256').update(fs.readFileSync(filename)).digest('hex');
const read = (filename) => JSON.parse(fs.readFileSync(path.resolve(repo, filename), 'utf8'));
const requirementPath = `${ticket}/tmp/d1201-n97n99-first-preparation/cards/phy10-c2-s4-n99/source-requirements.json`;
const requirement = read(requirementPath);
const raw = read(requirement.rawLesson.path);
const exercises = read(requirement.rawExercises.path);
assert.equal(hash(requirement.rawLesson.path), requirement.rawLesson.sha256);
assert.equal(hash(requirement.rawExercises.path), requirement.rawExercises.sha256);
const retainedPath = `${ticket}/evidence/reports/d1211-source266-errata/retained.json`;
const retained = read(retainedPath);
for (const binding of [retained.registration, retained.independentNumericalReview, ...retained.currentPage]) {
  assert.equal(hash(path.resolve(repo, binding.path)), binding.sha256);
}
const registration = read(retained.registration.path);
const recordsPath = `${ticket}/evidence/reports/d1211-source266-errata/modern-errata-records.json`;
const records = read(recordsPath);
assert.equal(hash(path.resolve(repo, recordsPath)), registration.modernRecords.sha256);
const sourceInputs = [];
for (const binding of requirement.sourcePages) {
  const current = hash(binding.path);
  const page = read(binding.path);
  if (page.meta.page === 266) {
    assert.equal(binding.sha256, registration.original.find((x) => x.path.endsWith('/page.json')).sha256);
    assert.equal(current, retained.currentPage.find((x) => x.path.endsWith('/page.json')).sha256);
    assert.deepEqual(page.meta.errata, registration.registeredRecords);
  } else {
    assert.equal(current, binding.sha256);
  }
  sourceInputs.push({
    path: binding.path,
    preparation_sha256: binding.sha256,
    current_sha256: current,
    delta: current === binding.sha256 ? 'none' : 'registered errata metadata; bound block text unchanged',
  });
}
for (const block of requirement.blocks) {
  const [, pageNumber, blockNumber] = block.ref.match(/^p(\d+)#(\d+)$/);
  const pagePath = `ssot-resources/soviet10year-textbooks/artifacts/10p/pages/${pageNumber}/page.json`;
  const actual = read(pagePath).blocks[Number(blockNumber) - 1];
  for (const key of ['kind', 'label', 'box', 'owner_exercise', 'cont', 'open', 'samerow', 'lines']) {
    assert.deepEqual(actual[key], block[key], `${block.ref}.${key}`);
  }
}
assert.equal(requirement.sourceQuestions, 0);
assert.equal(exercises.count, 0);
assert.deepEqual(exercises.exercises, []);
assert.equal(raw.prose.length, 19);
assert.equal(raw.prose.filter((x) => x.kind === 'p').length, 17);
assert.deepEqual(raw.prose.flatMap((x) => x.source_refs), requirement.blocks.slice(1).map((x) => x.ref)
  .filter((x) => x !== 'p0265#7' && x !== 'p0265#8')
  .toSpliced(10, 0, 'p0265#7', 'p0265#8'));

const obligations = [
  'Low-speed domain of classical Newton law; equation8.7; inertial-frame relativity; finite interval acceleration versus instantaneous limit.',
  'Classical constant-force extrapolation is not valid near c; speed bound for massive bodies; equation8.8 finite interval versus instantaneous force.',
  'Classical momentum p=m v; velocity-independent mass is a classical premise; joined p0264#8/p0265#1.',
  'The speed-dependent quantity m is historical relativistic mass; rest mass m0 does not change when the frame speed changes; retain historical context.',
  'Relativistic momentum conservation under the new spacetime description; complex derivation omitted rather than invented.',
  'm=m0/sqrt(1-v^2/c^2), equation8.9; m0 invariant rest mass; v relative to an inertial frame; massive-body domain v<c.',
  'Figure227 text reference and source ownership only; no pixel or figure approval.',
  'Joined low-speed example across figure; denominator tends to1, not gamma; v=10 km/s yields0.99999999944 at stated precision.',
  'Figure227 identity only; visual stage excluded.',
  'Figure227 caption identity only; visual stage excluded.',
  'Joined p0265#10/p0266#1: low-speed change difficult to observe; accelerator speeds; registered90 km/s to approximately15 km/s for100x, and35-40 km/s to35-40 m/s forapproximately2000x; historical electron mass exceeds proton rest mass; same-speed/same-radius magnetic force ratio about2000; no added exercise, answer or conditions leaked.',
  'Equation8.9 supplies relativistic momentum.',
  'Vector p=m0 vector v/sqrt(1-v^2/c^2), equation8.10; denominator and vector meaning preserved.',
  'Relativistic momentum-force law retains momentum-change form.',
  'Delta p/Delta t=F denotes finite-interval average force generally, instantaneous force in the zero-interval limit.',
  'Use equation8.10 rather than nonrelativistic m0 v.',
  'As v approaches c from below, historical m diverges; with finite longitudinal force acceleration tends to0; no finite-time stop, no speed greater than or equal toc for a massive object, no universal F=m a claim.',
  'Accelerator calculation is an engineering application of relativity.',
  'Newton mechanics is the v much less thanc approximation of relativistic mechanics.',
];
const c = 300000;
const gamma = (delta) => c / Math.sqrt(delta * (2 * c - delta));
const deficit = (G) => (c / (G * G)) / (1 + Math.sqrt(1 - 1 / (G * G)));
const numerics = {
  derivation: [
    'delta=c-v; 1-v^2/c^2=delta*(2*c-delta)/c^2',
    'gamma=c/sqrt(delta*(2*c-delta))',
    'delta=(c/G^2)/(1+sqrt(1-1/G^2))',
  ],
  independently_computed_here: true,
  c_km_per_s: c,
  c_is_rounded: true,
  forward: [90, 35, 40, 15, 0.035, 0.040].map((delta) => ({ delta_km_per_s: delta, gamma: gamma(delta) })),
  inverse: [100, 2000].map((G) => ({ gamma: G, delta_km_per_s: deficit(G), delta_m_per_s: deficit(G) * 1000 })),
  low_speed: {
    v_km_per_s: 10,
    denominator: Math.sqrt(1 - (10 / c) ** 2),
    gamma: 1 / Math.sqrt(1 - (10 / c) ** 2),
    printed_denominator: 0.99999999944,
  },
  acceleration_reasoning: 'For parallel finite force, dp/dv=m0*gamma^3 and a_parallel=F_parallel/(m0*gamma^3); transverse a=F_transverse/(m0*gamma). Both tend to0 for bounded force and fixed positive m0 as v->c. Force changes momentum, not a velocity-independent relativistic scalar inertia.',
  circular_force_reasoning: 'For uniform circular motion at fixed speed and radius, |dp/dt|=gamma*m0*v^2/r; relative to classical m0*v^2/r the ratio is gamma.',
  proton_comparison_reasoning: 'At gamma approximately2000, gamma*m_e exceeds m_p because m_p/m_e is approximately1836; compare relativistic electron mass to proton rest mass, not invariant electron mass to invariant proton mass.',
};
assert.ok(gamma(90) < 100);
assert.ok(Math.abs(gamma(15) - 100) < 0.01);
assert.ok(gamma(0.040) < 2000 && gamma(0.035) > 2000);
assert.ok(Math.abs(numerics.low_speed.denominator - 0.99999999944) < 5e-12);
const inventory = {
  schema: 'independent-source-text-inventory/v1',
  ticket: 'STEMROBIN-181',
  batch: 'D037',
  card: raw.id,
  status: 'FIRST-INDEPENDENT-INVENTORY-FROZEN-BEFORE-AUTHOR-MATERIAL-READ',
  frozen_at: new Date().toISOString(),
  repo,
  output_root: owned,
  independence: {
    author_materials_opened_before_freeze: false,
    prior_author_or_modern_review_inventory_used: false,
    source_pixel_review: false,
    retained_errata_numerics_use: 'source-bound corroboration; calculations independently derived here',
  },
  inputs: [
    { path: path.resolve(repo, requirementPath), sha256: hash(path.resolve(repo, requirementPath)) },
    { ...requirement.rawLesson },
    { ...requirement.rawExercises },
    { path: path.resolve(repo, retainedPath), sha256: hash(path.resolve(repo, retainedPath)) },
    { path: path.resolve(repo, recordsPath), sha256: hash(path.resolve(repo, recordsPath)) },
    ...sourceInputs,
  ],
  boundary: {
    first: requirement.boundary.first,
    last: requirement.boundary.last,
    next_heading: null,
    next_heading_independent_confirmation_pending: true,
    ruling: 'Review bound n99 text only; no page267, full-card closure, or consumption approval.',
  },
  counts: { prose: 17, figure_identity: 1, caption_identity: 1, questions: 0, bound_blocks: requirement.blocks.length },
  entries: raw.prose.map((block, index) => ({
    target: `lesson.prose[${index}]`,
    kind: block.kind,
    source_refs: block.source_refs,
    source_text: block.text,
    requirements: obligations[index],
  })),
  registered_errata: records,
  numerics,
};
const inventoryPath = path.join(owned, 'inventory.json');
fs.writeFileSync(inventoryPath, `${JSON.stringify(inventory, null, 2)}\n`, { flag: 'wx', mode: 0o444 });
const receipt = {
  schema: 'source-inventory-freeze/v1',
  frozen_at: new Date().toISOString(),
  inventory: { path: inventoryPath, sha256: hash(inventoryPath) },
  generator: { path: path.join(owned, 'freeze-source.mjs'), sha256: hash(path.join(owned, 'freeze-source.mjs')) },
  author_materials_opened: false,
  usage: { paid_calls: 0, image_opens: 0, native_adapt_or_finalize: 0, outbound_chats: 0, db_writes: 0 },
};
fs.writeFileSync(path.join(owned, 'inventory-freeze.json'), `${JSON.stringify(receipt, null, 2)}\n`, { flag: 'wx', mode: 0o444 });
console.log(JSON.stringify(receipt, null, 2));
