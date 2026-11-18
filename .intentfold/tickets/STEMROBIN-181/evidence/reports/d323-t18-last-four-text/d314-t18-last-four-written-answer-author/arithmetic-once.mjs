import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const nickel = { kKgPerC: 3e-7, densityKgPerM3: 8.9e3, totalAreaM2: 0.2, currentA: 25, hours: 2 };
const constants = { eC: 1.60e-19, electronMassKg: 9.11e-31, cMPerS: 3.00e8 };
const timeS = nickel.hours * 3600;
const chargeC = nickel.currentA * timeS;
const massKg = nickel.kKgPerC * chargeC;
const volumeM3 = massKg / nickel.densityKgPerM3;
const thicknessM = volumeM3 / nickel.totalAreaM2;
const cases = [500, 5000].map(voltageV => {
  const kineticEnergyJ = constants.eC * voltageV;
  const classicalMPerS = Math.sqrt(2 * kineticEnergyJ / constants.electronMassKg);
  const gamma = 1 + kineticEnergyJ / (constants.electronMassKg * constants.cMPerS ** 2);
  const relativisticMPerS = constants.cMPerS * Math.sqrt(1 - gamma ** -2);
  return { voltageV, kineticEnergyJ, classicalMPerS,
    classicalSpeedOverC: classicalMPerS / constants.cMPerS, relativisticMPerS };
});
const receipt = {
  schema: 'stemrobin/t18-selected-author-arithmetic@1',
  invocations: 1,
  role: 'Independent author arithmetic from the new selected prompts; not an independent review.',
  sourceExercise15Inputs: nickel,
  nickelModel: 'Constant current; unit current efficiency; stated bulk density; thin uniform layer over the stated total coated area.',
  nickelResults: { timeS, chargeC, massKg, volumeM3, thicknessM, thicknessMm: thicknessM * 1000 },
  sourceExercise16VoltagesV: [500, 5000],
  conventionalRoundedConstantsNotPrintedSourceData: constants,
  electronModel: 'Negligible initial speed and no energy losses; classical and relativistic evaluations identified separately.',
  electronCases: cases,
  unrelatedTasksComputed: [],
  oldAnswersOrParentBaselineConsumed: false
};
fs.writeFileSync(path.join(root, 'author-arithmetic.json'),
  JSON.stringify(receipt, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify(receipt, null, 2));
