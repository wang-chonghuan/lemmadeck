import fs from 'node:fs';
import assert from 'node:assert/strict';
import { repo, ticket, read, bind, save, run } from './n42-native.mjs';

const configs = {
  n38: {
    task: 'D1428', author: 'd1816-d1423-n38-first-missing-en', review: 'd1816-d1409-n38-first-en-review',
    reviewHash: '2d6547bc6537ca645a73721b8f0467c9db5ab2fd3d0ea33c7d8c08d5eb43d438',
    boundaryPrefixes: ['At constant temperature $T$', '**Vapor in equilibrium'],
    edits: [
      [10, 'At a given temperature and vapor-phase volume, the equilibrium vapor has the corresponding saturation mass.\nAdding vapor leads to net condensation as the substance approaches a new equilibrium.',
        'For a fixed temperature, a fixed space occupied by vapor holds a certain mass of vapor in equilibrium with the liquid.\nIf that same space temporarily contains extra vapor at the same temperature, the extra vapor condenses into liquid until equilibrium returns.'],
      [13, 'The horizontal liquid-vapor coexistence segment begins at volume',
        'The prime mark labels the endpoints on this higher-temperature curve.\nThe horizontal liquid-vapor coexistence segment begins at volume'],
      [13, 'Further compression to $V_1\'>V_1$ completes condensation.',
        'Keep decreasing the volume until condensation is complete.\nThe liquid-end volume is larger than for the lower-temperature curve: $V_1\'>V_1$.'],
    ],
  },
  n39: {
    task: 'D1429', author: 'd1816-d1424-n39-first-missing-en', review: 'd1816-d1416-n39-first-en-review',
    reviewHash: '0464419a792290aff9b138d75968cc4cf7b2ee55f61138d621d6406a34681adb',
    boundaryPrefixes: ['Keep a fixed mass', 'The textbook illustrates observations', 'At a constant temperature above'],
    edits: [
      [0, 'Compare experimentally obtained isotherms for a real gas (Figure 55) to see how the liquid-vapor coexistence segment changes near the critical point.\nWe compare the same pure substance and the same total mass at different constant temperatures.\nWe are not assuming that all substances at all temperatures follow one curve.',
        'An isotherm shows how pressure changes with volume while temperature stays fixed.\nFigure 55 compares curves for the same pure substance and the same total mass.\nBelow the critical temperature, each curve has a flat part where liquid and vapor are both present.\nThese flat parts become shorter at higher temperatures below the critical temperature.\nWe are not assuming that all substances at all temperatures follow one curve.'],
      [0, 'As temperature rises, the vapor volume',
        'As temperature rises below the critical temperature, the vapor volume'],
      [2, "The textbook's statements about a maximum liquid volume and maximum saturated vapor pressure refer to endpoints of the coexistence curves discussed here.\nThey mean the endpoint approached by a fixed mass of saturated liquid and the critical endpoint of the saturated vapor pressure curve.\nThey do not mean that every liquid has a condition-independent maximum volume, or that a substance's pressure cannot exceed its critical pressure.",
        "The textbook's statements about a maximum liquid volume and maximum saturated vapor pressure concern the coexistence curves discussed here.\nFor a fixed mass, the saturated-liquid branch ends at the critical volume.\nThe saturated vapor pressure curve ends at the critical pressure.\n\nThese are not limits for every possible state.\nPressure can exceed the critical pressure, and liquid volume depends on the conditions."],
      [3, 'Further compression produces a denser single-phase fluid with liquid-like properties.\nWe should not unconditionally call it a cylinder full of ordinary liquid.\nThis path has no finite interval of liquid-vapor coexistence like the one below the critical temperature.\n\nThere is no interface separating two phases.\nThe continuous transition here concerns phase state and density.\nIt does not mean that physical properties near the critical point show no marked changes.',
        'Further compression makes the single-phase fluid denser and more liquid-like.\nIt does not split into separate liquid and vapor regions.\nUnlike the curve below the critical temperature, this curve has no flat coexistence segment covering a range of volumes.\n\nThere is no interface separating two phases.\nDensity changes continuously along this path, though other physical properties can still change strongly near the critical point.'],
    ],
  },
  n35: {
    task: 'D1427', author: 'd1816-d1401-n35-first-missing-en', review: 'd1816-d1402-n35-first-en-review',
    reviewHash: '0d23889dc7ca243d1201247882af63c6c8131f46d88f6213be27c143130216c9',
    boundaryPrefixes: ['Molecular-beam speed measurements', 'Equation $(3-18)$ also'],
    edits: [
      [0, 'Substituting',
        'The ideal-gas model treats molecules as particles whose own size and interactions between collisions can be neglected.\nHere, classical means using the ordinary motion-energy model rather than quantum effects.\nThermal equilibrium means a settled thermal state whose average behavior is not changing with time.\n\nSubstituting'],
      [0, 'Here, the mass is that of one molecule, speeds are measured in a frame where the gas as a whole is at rest, and temperature must be the absolute temperature in kelvins:',
        'The mass in this expression is the mass of one molecule.\nMeasure speeds from a viewpoint moving with the gas as a whole, so its overall flow is not counted.\nUse absolute temperature in kelvins: this scale is measured from absolute zero, not from the zero on the Celsius scale.'],
      [9, 'The measured result must be interpreted using the distribution of speeds and how the instrument selects atoms.',
        'A speed distribution describes how many atoms have the different speeds.\nThe instrument records only atoms that pass through its slit and collect on the wall.\nThis selected sample and the way it is recorded need interpretation before comparison with the gas\'s root mean square speed.'],
      [10, 'The apparatus has two concentric cylinders, $A$ and $B$, rigidly connected so that they rotate together (Figure $52$).',
        'The apparatus has two concentric cylinders, $A$ and $B$, rigidly connected so that they rotate together (Figure $52$).\nConcentric here means that one cylinder is nested inside the other around the same central line.\nThat line is their axis.'],
      [13, 'Next rotate the cylinders at angular speed $\\omega$.',
        'Next rotate the cylinders at angular speed $\\omega$.\nAngular speed describes how quickly the apparatus turns.'],
      [13, "In the textbook's approximation, atoms fly radially in straight lines at constant speed.\nThe time to travel the difference in the cylinder radii, $R_B-R_A$, is $t$.",
        "In the textbook's approximation, atoms fly radially in straight lines at constant speed.\nRadially means outward from the common center.\nEach radius is the distance from that center to the corresponding cylinder wall, not a diameter.\n\nThe time to travel the difference in the cylinder radii, $R_B-R_A$, is $t$.\nThis flight time starts when the atom passes through the inner cylinder's slit, not when it leaves the wire."],
      [13, "The shift along the outer cylinder's inner wall is an arc length $s$ (Figure $53$).\n\nHere, $s$ is a wall shift caused by rotation, not the atom's flight-path length.",
        "The shift along the outer cylinder's inner wall is an arc length $s$ (Figure $53$).\nAn arc length is a curved distance along the wall.\nIn the figure, D marks the wall point currently aligned with the rotating slit, and D-prime marks the atom's impact point.\n\nHere, $s$ is the separation of those wall points caused by rotation, not the atom's straight flight-path length."],
      [18, "The silver band represents atoms selected by the instrument, so its position and width must be interpreted using the speed distribution.",
        "The silver band consists only of atoms that passed through the slit and were collected on the wall.\nIt is not automatically a representative average of every atom in the gas.\nIts position and width need interpretation using how many atoms have each speed and how the instrument records them."],
      [19, 'If a Brownian particle is in classical thermal equilibrium with the surrounding liquid, and energy is shared according to the equipartition model for motion through space, its average kinetic energy is described by formula $(3-15)$.',
        'A Brownian particle is a tiny particle suspended in a liquid, moving irregularly as the surrounding molecules push it unevenly.\nConsider it in classical thermal equilibrium with that liquid.\nIts kinetic energy here means the energy of movement through space, not rotation.\n\nThe equipartition model assigns equal average motion energy to each independent spatial direction.\nThis is an average, not equal energy in every direction at every moment.\nUnder these conditions, its average kinetic energy is described by formula $(3-15)$.'],
      [20, 'An observed zigzag path should not be treated as a directly measured instantaneous velocity.',
        'Instantaneous velocity means velocity at one moment, whereas an observation interval lasts for some time.\nAn observed zigzag path should not be treated as a directly measured instantaneous velocity.'],
      [20, 'In the ideal Brownian diffusion model that neglects inertia, a path has no ordinary instantaneous velocity.',
        'Inertia is a finite-mass particle\'s resistance to a change of motion.\nThe ideal Brownian diffusion model neglects this effect and describes the spreading of irregular displacements.\nIn that model, a path has no ordinary instantaneous velocity.'],
    ],
  },
  n34: {
    task: 'D1425', author: 'd1816-d1394-n34-first-missing-en', review: 'd1816-d1395-n34-first-en-review',
    reviewHash: 'bbb4d78532b65113863d0be02da956748112251c856318d93be273981d31ec97',
    boundaryPrefixes: ['Substituting', 'The textbook traces'],
    edits: [
      [3, "Here, average kinetic energy means the molecules' irregular motion through space.",
        "Here, average kinetic energy means the energy of the molecules' irregular motion through space."],
      [14, 'The textbook calls this number density at its standard state the **Loschmidt number**.',
        'The calculation uses meters, so its result is first a number of molecules per cubic meter.\nOne cubic meter contains a million cubic centimeters.\nDivide the per-cubic-meter density by a million to express it per cubic centimeter.\n\nThe textbook calls this number density at its standard state the **Loschmidt number**.'],
      [19, "Under the textbook's definition, the complete factor for this average kinetic energy also includes three halves.\nIt is not defined as only the constant multiplied by temperature.",
        "For this average kinetic energy, multiply Boltzmann's constant by the absolute temperature and then by three halves."],
    ],
  },
  n22: {
    task: 'D1387', author: 'd1816-d1383-n22-first-missing-en', review: 'd1816-d1355-n22-first-en-review',
    reviewHash: '22d9ee8043e8b7cb49458e226f2ce58d34dcc39714814bcad1c28ef8d1546605',
    boundaryPrefixes: ['To measure heat', 'How can we measure', "A calorimeter can measure a material's specific heat"],
    edits: [
      [0, 'Energy entering a system by heat transfer is called heat absorbed by the system.\nWork and heat transfer are two different ways to change a system\'s energy.',
        'Heat is energy transferred because of a temperature difference.\nHeat entering a system is heat absorbed by it.\nMechanical work transfers energy through large-scale forces and displacement, as when gas pushes a moving piston.\nWork and heat transfer can occur together, although the fixed piston here does no volume-change work.\nThe heated gas gains internal energy.\nIt does not store heat.'],
      [4, 'motion through space;\n\nit does not give every molecule the same speed.',
        'motion through space.\n\nMolecules do not all move at the same speed.'],
      [4, 'When no large-scale mechanical work is done, this energy transfer is heat transfer.',
        'The energy transferred because of the temperature difference is heat.\nMechanical work is a different transfer route and can occur alongside heat transfer in other processes.'],
      [5, 'We will review its measurement and distinguish temperature, heat, and internal energy stored in a body.',
        'We will review its measurement and distinguish temperature, heat, and internal energy stored in a body.\nInternal energy consists of the kinetic energy of microscopic particle motion and the potential energy of particle interactions.\nIt is distinct from the kinetic and potential energy of the body moving or changing position as a whole.\nHeat describes a transfer process, not this stored microscopic energy.'],
      [13, 'A thermometer measures temperature;\n\na calorimeter helps measure heat exchange.',
        'A thermometer measures temperature.\n\nA calorimeter helps measure heat exchange.'],
      [17, 'The water absorbs heat and warms;\n\nthe iron releases heat and cools.',
        'The water absorbs heat and warms.\n\nThe iron releases heat and cools.'],
    ],
  },
  n26: {
    task: 'D1385', author: 'd1816-d1368-n26-first-missing-en', review: 'd1816-d1369-n26-first-en-review',
    reviewHash: '53e8cde5a1d8129f00910e0119a635c0b5e141a4704de2f82605b3984e7e154b',
    edits: [[8, 'An internal-combustion engine burns fuel inside its working cylinder.',
      'In the Diesel engine described here, fuel burns inside the cylinder.']],
  },
  n29: {
    task: 'D1386', author: 'd1816-d1375-n29-first-missing-en', review: 'd1816-d1376-n29-first-en-review',
    reviewHash: '9a5aea80cffd769045d544b47b8e5f82e562d8200f1a5d4af41d1dc6c19710b3',
    edits: [
      [5, "Momentum is the mechanical quantity transferred in a collision that changes a body's motion.",
        "In this classical model, a particle's momentum is its mass multiplied by its velocity, and has the direction of that velocity."],
      [5, 'Figure $45$ illustrates them qualitatively;\n\nit is not a calibrated set of measurements.',
        'Figure $45$ illustrates them qualitatively.\n\nThe figure is not a calibrated set of measurements.'],
      [8, 'The modern figure identifies it as "Spring plate";\n\nthe faithful source layer retains',
        'The modern figure identifies it as "Spring plate".\n\nThe faithful source layer retains'],
    ],
  },
};
const card = process.argv[2], config = configs[card];
assert(config);
const originalAuthorPath = `${ticket}/tmp/${config.author}/authored.json`;
const reviewPath = `${ticket}/tmp/${config.review}/review.json`;
assert.equal(bind(reviewPath).sha256, config.reviewHash);
assert.equal(read(reviewPath).status, 'REVISE');
const original = read(originalAuthorPath), lesson = read(original.englishDraft.path);
for (const [index, before, after] of config.edits) {
  assert.equal(lesson.prose[index].text.split(before).length, 2, `${card}: exact repair fragment at prose ${index}`);
  lesson.prose[index].text = lesson.prose[index].text.replace(before, after);
}
const indices = [...new Set(config.edits.map(edit => edit[0]))];
const out = `${ticket}/tmp/d1816-${config.task.toLowerCase()}-${card}-affected-text`;
const input = `${out}/en.before-native.json`;
save(input, lesson);
const receipt = run(`${config.task.toLowerCase()}-${card}-affected-text-native`, [
  `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, '-B', '-c',
  `import sys,json
from pathlib import Path
sys.path.insert(0,${JSON.stringify(`${repo}/.claude/skills/ld-s10y-lesson/tools`)})
import edition
lesson=edition.load(Path(${JSON.stringify(input)}))
baseline=edition.load(Path(${JSON.stringify(original.englishDraft.path)}))
indices=${JSON.stringify(indices)}
for index in indices:
    assert edition.math_signature(lesson["prose"][index]["text"])==edition.math_signature(baseline["prose"][index]["text"])
edition.normalize_lesson_layout(lesson)
if ${Number(!!config.boundaryPrefixes)}:
    candidate_flow,candidate_errors=edition.prose_flow_contract(lesson["prose"],[])
    assert not candidate_errors,candidate_errors
    boundaries=[]
    for prefix in ${JSON.stringify(config.boundaryPrefixes ?? [])}:
        matches=[i for i,p in enumerate(candidate_flow["paragraphs"]) if p["text"].startswith(prefix)]
        assert len(matches)==1 and matches[0]>0,(prefix,matches)
        i=matches[0]
        boundaries.append({"before":candidate_flow["paragraphs"][i-1]["text"],"after":candidate_flow["paragraphs"][i]["text"]})
    lesson["section_breaks"]=boundaries
flow,errors=edition.prose_flow_contract(lesson["prose"],lesson["section_breaks"])
comparison=json.loads(json.dumps(lesson))
if ${Number(!!config.boundaryPrefixes)}:
    comparison["section_breaks"]=baseline["section_breaks"]
for index in indices:
    comparison["prose"][index]["text"]=baseline["prose"][index]["text"]
assert comparison==baseline,"Only named affected text may change"
print(json.dumps({"lesson":lesson,"flow":flow,"errors":errors},ensure_ascii=False))
assert not errors,errors`,
]);
const output = JSON.parse(fs.readFileSync(read(receipt.path).streams.stdout.path, 'utf8'));
save(`${out}/en.lesson.draft.json`, output.lesson);
save(`${out}/en.prose-flow.json`, output.flow);
save(`${out}/authored.json`, {
  ...original, task: config.task, status: 'AFFECTED_ONLY_HEAT_PARTICLE_FINDINGS_AUTHOR_PASS',
  englishBeforeNative: bind(input), englishDraft: bind(`${out}/en.lesson.draft.json`),
  englishFlow: bind(`${out}/en.prose-flow.json`), nativeReceipt: receipt,
  flowParagraphs: output.flow.paragraphs.length,
  derivedConceptBoundaries: output.flow.boundaries.length, originalAuthor: bind(originalAuthorPath),
  firstIndependentReview: bind(reviewPath), changedPointers: indices.map(index => `/prose/${index}/text`),
  repairs: config.edits.map(([index, before, after]) => ({ index, before, after })),
  otherProseSourceFormulasFiguresMetadataUnchanged: true,
  conceptBoundariesDerivedFromAffectedFinalFlow: !!config.boundaryPrefixes,
  conceptBoundaryCountUnchanged: output.flow.boundaries.length === read(original.englishFlow.path).boundaries.length,
  independentAffectedReviewPending: true,
});
console.log(JSON.stringify({ authored: bind(`${out}/authored.json`), paragraphs: output.flow.paragraphs.length }));
