import assert from 'node:assert/strict';
import {
  ticket, read, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const tmp = `${ticket}/tmp`;
const output = `${tmp}/9p-n105-science-review.json`;
assert.ok(!await exists(output));
const freezePath = `${tmp}/9p-n105-prose-freeze.json`;
await verify(freezePath, '8f4b0da263be54380a0d3db1b6837c32549ca9adf66cbd3bedb0126543c177ef');
const freeze = await read(freezePath);
for (const binding of [...freeze.sourceFiles, ...freeze.editionTemplates])
  await verify(binding.path, binding.sha256);
const lessonBinding = freeze.editionTemplates.find(row => row.path.endsWith('/lesson.template.json'));
const exercisesBinding = freeze.editionTemplates.find(row => row.path.endsWith('/exercises.template.json'));
const lesson = await read(lessonBinding.path);
const source = await read(freeze.sourceFiles[0].path);
assert.deepEqual(lesson.source.data, source);
assert.deepEqual(lesson.prose.map(row => row.source_text), source.prose.map(row => row.text));
assert.deepEqual(lesson.prose.map(row => row.source_refs), source.prose.map(row => row.source_refs));
assert.equal(source.prose.length, 9);
assert.equal((await read(exercisesBinding.path)).count, 0);
const checks = [
  {
    id: 'SCI-105-01', status: 'pass', sourceRefs: ['p0260#7'],
    topic: 'Collective behavior, approximate neutrality and partial ionization',
    reasoning: 'Electrical forces couple charged particles. Approximate charge balance on a sufficiently large scale does not require pointwise equality and does not imply the absence of electrons or ions. Neutral atoms can coexist with the charged species. The text explicitly includes collective response and does not classify every dilute ionized gas solely from equal charge counts.',
  },
  {
    id: 'SCI-105-02', status: 'pass', sourceRefs: ['p0260#8', 'p0261#1'],
    topic: 'Cathode space charge and positive column',
    reasoning: 'A positive space-charge region fails the specific quasineutral-region condition. The modern statement is limited to that condition, not a universal denial of nonneutral plasmas or plasma sheaths. The nearly neutral positive column remains the source discharge-plasma example.',
  },
  {
    id: 'SCI-105-03', status: 'pass', sourceRefs: ['p0261#2'],
    topic: 'Discharge lamps and fluorescence',
    reasoning: 'Excited discharge particles emit radiation. A fluorescent coating absorbs excitation radiation and re-emits visible light; choosing phosphors changes the visible spectrum. The passage does not confuse the tube discharge with the coating or imply that every discharge directly emits white light.',
    externalReference: 'openstax-interstellar-gas',
  },
  {
    id: 'SCI-105-04', status: 'pass', sourceRefs: ['p0261#3'],
    topic: 'Gas-discharge laser application without power ranking',
    reasoning: 'The passage discusses discharge-excited gas lasers, not every possible gas-laser pumping mechanism. Gain-medium identity alone cannot determine an absolute power ranking. Removing the unsupported superlative leaves the source application and distinctive directional radiation intact, without replacing it with an unverified record.',
  },
  {
    id: 'SCI-105-05', status: 'pass', sourceRefs: ['p0261#4'],
    topic: 'Metal electron-plasma model and positive ion cores',
    reasoning: 'Accounting for conduction electrons leaves positive ion cores and maintains total charge balance. In the crystalline model, cores vibrate about lattice positions while electrons are mobile. The text explicitly treats electron plasma as a collective-response model, not a claim that a solid is an ionized gas, and does not exclude all diffusion processes.',
  },
  {
    id: 'SCI-105-06', status: 'pass', sourceRefs: ['p0261#4'],
    topic: 'Density, units and quantum scope',
    reasoning: 'The original density order and reciprocal-cubic-centimeter unit are retained. Number per volume has dimensions L^-3. At typical metallic electron densities the Fermi scale grows with density to the two-thirds power, so a classical dilute independent-particle description is not generally adequate. The quantum requirement is correctly scoped to an accurate description of the dense electrons, not to every possible classical approximation for lattice vibrations.',
  },
  {
    id: 'SCI-105-07', status: 'pass', sourceRefs: ['p0261#5', 'p0261#6'],
    topic: 'Stellar ionization and different interstellar phases',
    reasoning: 'Heating and ionizing radiation produce ions and free electrons. A completely stripped atom leaves its positively charged nucleus. Density and temperature are independent physical quantities; dilute matter need not be cold. The modern paragraph explicitly limits its plasma claim to ionized interstellar components and retains warm as well as hot possibilities, rather than declaring all interstellar matter ionized.',
    externalReference: 'openstax-interstellar-gas',
  },
  {
    id: 'SCI-105-08', status: 'pass', sourceRefs: ['p0261#7', 'p0262#1'],
    topic: 'Fusion supplies stellar energy',
    reasoning: 'For a Sun-like star, fusion of appropriate light nuclei into more tightly bound products releases energy. The text is explicitly scoped to such stars and explains an energy source replenishing outgoing radiation, without claiming that every fusion reaction or every phase of every star must release energy.',
    externalReference: 'doe-fusion-fuel',
  },
  {
    id: 'SCI-105-09', status: 'pass', sourceRefs: ['p0262#2'],
    topic: 'Controlled fusion versus a practical energy system',
    reasoning: 'Reaction energy, sustained operation and useful net energy from a complete plant are distinct. Fuel-cycle reliability and material performance are separate constraints. The passage keeps the source research direction but makes no commercial deployment date, record-performance assertion or already-unlimited-energy claim.',
    externalReferences: ['pnnl-fusion-energy', 'doe-fusion-fuel'],
  },
];
const references = [
  {
    id: 'openstax-interstellar-gas', title: 'Astronomy 2e, 20.2 Interstellar Gas',
    url: 'https://openstax.org/books/astronomy-2e/pages/20-2-interstellar-gas',
    accessDate: '2026-11-16', method: 'cloak-fetch', observedStatus: 200,
    summary: 'The authored textbook describes ionized hydrogen regions and very hot interstellar gas separately from neutral and molecular phases. It also explains excitation radiation, phosphor absorption and visible emission in fluorescent lamps.',
  },
  {
    id: 'pnnl-fusion-energy', title: 'Fusion Energy Science, Pacific Northwest National Laboratory',
    url: 'https://www.pnnl.gov/fusion-energy-science',
    accessDate: '2026-11-16', method: 'cloak-fetch', observedStatus: 200,
    summary: 'PNNL identifies fuel-cycle and materials challenges in developing practical fusion systems, separately from sustaining a reaction. Its program includes tritium production, recovery, reuse and material behavior under interacting extreme conditions.',
  },
  {
    id: 'doe-fusion-fuel', title: 'DOE Explains...Deuterium-Tritium Fusion Fuel',
    url: 'https://www.energy.gov/science/doe-explainsdeuterium-tritium-fusion-fuel',
    accessDate: '2026-11-16', pageUpdatedDate: '2026-06-01',
    method: 'cloak-fetch', observedStatus: 200,
    summary: 'DOE describes stellar fusion and the fuel-supply requirements of future fusion plants. It distinguishes potentially useful fuel resources from reliable production and supply-chain requirements.',
  },
];
await immutableWrite(output, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D025', lesson: lesson.id, status: 'pass',
  reviewer: 'Main session, independent of the bounded n105 prose author',
  reviewDate: '2026-11-16',
  bindings: {
    authorFreeze: await bind(freezePath), lessonTemplate: await bind(lessonBinding.path),
    exercisesTemplate: await bind(exercisesBinding.path),
    source: await bind(freeze.sourceFiles[0].path),
    sourceMarkdown: await bind(freeze.sourceFiles[1].path),
    exercisesSource: await bind(freeze.sourceFiles[2].path),
  },
  counts: {
    sourceProseBlocks: 9, reviewedPublishedParagraphs: 20, declaredSectionBoundaries: 4,
    sourceTasks: 0, modernTasks: 0, figuresReviewed: 0, scienceChecks: checks.length,
    scienceChecksPassed: checks.length, unresolvedFindings: 0,
  },
  checks, references, findings: [],
  sourceCompleteness: 'Inherited approved SOURCE and exact current source bindings; no extraction or source review repeated.',
  method: 'Read all nine source/edition prose pairs and author correction notes; independently judge definitions, physical distinctions, units and energy accounting. Public documents fetched through CloakBrowser for the affected contemporary scientific qualifications.',
  limits: 'One independent SCI review only. No source images, figure review, native counting, adapt-finalize/render, browser display, Git, database or complete-card claim.',
}, null, 2)}\n`);
console.log(JSON.stringify(await bind(output)));
