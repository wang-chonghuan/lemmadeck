import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const work = '.intentfold/tickets/STEMROBIN-181/tmp';
const seedPath = `${work}/9p-t8-choice-seed.json`;
const seed = JSON.parse(await fs.readFile(seedPath, 'utf8'));
const bind = async path => ({
  path, sha256: crypto.createHash('sha256').update(await fs.readFile(path)).digest('hex'),
});
assert.deepEqual(seed.exercises.map(exercise => exercise.number), Array.from({ length: 11 }, (_, index) => String(index + 1)));
assert.equal(seed.figures.length, 1);
const figure = seed.figures[0].assets[0];
assert.deepEqual(await bind(figure.path), figure);
const sourceSolutions = [
  'Direction-dependence alone is insufficient: aligned amorphous structure can be anisotropic; randomly oriented polycrystals may be isotropic; single-crystal properties need not all be anisotropic.',
  'Sharp melting removes the stated below-melting continuous softening range, but liquid viscosity, crystallization rate and shape retention remain unspecified; disappearance of blowing is not logically forced.',
  'Ordinary granulated sugar and ordinary solid aluminum are crystalline; ordinary amber is amorphous. Classification does not require a macroscopic crystal face or prove single-crystal identity.',
  'Total ions per volume are2rhoNA/M; one ion per ideal simple-cubic d^3 givesd=(M/(2rhoNA))^(1/3)=2.7973156e-10m. External cube image supplies no microscopic spacing or calibration.',
  'Circular area piD^2/4=4pi*10^-6m^2; F=sigmaA=600piN≈1884.96N. Diameter0.4cm is0.004m, not radius.',
  'Bottom self-weight stressrho*g*h=352800Pa forg9.8. A section below depthz carriesrho*g*z; upper bricks require less self-weight load resistance, equal strength is not required. Stress is not material strength.',
  'Largest hanging-wire stress is at the top:rho*g*l. Critical lengthsigma/(rho*g)=4186.29m forg9.8; uniform area cancels; a thicker uniform wire has the same threshold.',
  'StressF/A=4e7Pa; strainDeltaL/L=2e-4; E=stress/strain=2e11Pa. Both requested quantities must remain.',
  'Initial50C=323.15K; DeltaT=600-323.15=276.85K. v=sqrt(2*(125*276.85+25000))=345.27m/s. Mass cancels only because all kinetic energy becomes its own heat.',
  'm=.2*cw*15/(3ci+lambda+8cw). Withcw4200,ci2100,lambda340000,m=.0331666kg. All three introduced-ice heat terms required; final8C means all introduced ice is melted.',
  'Qsteam=.0066*(2260000+4200*100)=17688J; full fusion.0544*340000=18496J. Qsteam<fusion, so equilibrium0C with residualice≈.002376kg; never force a liquid-only negative-temperature branch.',
];
await fs.writeFile(`${work}/d016-choice-source-review-freeze.json`, JSON.stringify({
  ticket: 'STEMROBIN-181', lesson: 'phy9-c1-s6-t8',
  role: 'Main initial semantic gate source-first stage, before draft view/key/rationales',
  seed: await bind(seedPath),
  rawIndependentSolutions: await bind(`${work}/d016-independent-raw-solutions.md`),
  sourceSolutions: sourceSolutions.map((independent_solution, index) => ({
    source_number: String(index + 1), independent_solution,
  })),
  figureObservations: [{
    figure_id: 'fig-77', asset_path: figure.path, asset_sha256: figure.sha256,
    actuallyOpened: true,
    observation: 'Opened complete current square PNG: one textured near-white cubic salt specimen, complete top/front/right faces, no scale, ions, labels or cutaway. Also opened original small black-and-white three-face cube and read current spec. Artwork is external appearance only and cannot provide nearest-ion spacing.',
  }],
  existingFigureApproval: 'Inherited77 pixel PASS is not repeated or replaced by this task-specific answer/choice observation.',
  authorInternalSolutionOrCorrectSetRead: false,
}, null, 2) + '\n', { flag: 'wx' });
console.log('Frozen eleven independently solved sources and actual figure observation before draft/key review.');
