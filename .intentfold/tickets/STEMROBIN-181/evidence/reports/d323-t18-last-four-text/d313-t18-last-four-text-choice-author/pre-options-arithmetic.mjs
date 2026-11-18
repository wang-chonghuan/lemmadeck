import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
for (const language of ["zh", "en"]) {
  assert(!fs.existsSync(path.join(root, language, "draft.json")), "Arithmetic phase must precede options.");
}
const sha = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const current = 25;
const seconds = 2 * 3600;
const electrochemicalEquivalent = 3e-7;
const density = 8.9e3;
const area = 0.2;
const charge = current * seconds;
const mass = electrochemicalEquivalent * charge;
const volume = mass / density;
const thickness = volume / area;
const electronCharge = 1.60e-19;
const electronMass = 9.11e-31;
const c = 2.998e8;
const speed = (voltage) => Math.sqrt(2 * electronCharge * voltage / electronMass);
const relativisticSpeed = (voltage) => {
  const gamma = 1 + electronCharge * voltage / (electronMass * c * c);
  return c * Math.sqrt(1 - 1 / (gamma * gamma));
};
assert.equal(seconds, 7200);
assert.equal(charge, 180000);
assert(Math.abs(mass - 0.054) < 1e-14);
assert(Math.abs(thickness - 27 / 890000) < 1e-18);
assert(Math.abs(speed(5000) / speed(500) - Math.sqrt(10)) < 1e-14);
const record = {
  schema: "d313-pre-options-arithmetic-v1",
  phase: "Independent numerical checks before any draft/options",
  checkedAt: new Date().toISOString(),
  script: { path: fileURLToPath(import.meta.url), sha256: sha(fileURLToPath(import.meta.url)) },
  sourceProjection: { path: path.join(root, "selected-source-projection.json"), sha256: sha(path.join(root, "selected-source-projection.json")) },
  source15: {
    supplied: { timeHours: 2, currentAmperes: current, electrochemicalEquivalentKgPerC: electrochemicalEquivalent, densityKgPerM3: density, areaM2: area },
    model: "100% deposition efficiency, adherent compact uniform layer, no losses",
    seconds,
    chargeC: charge,
    massKg: mass,
    volumeM3: volume,
    thicknessM: thickness,
    thicknessMm: thickness * 1000,
    thicknessMicrometers: thickness * 1e6,
    rationalThicknessM: "27/890000",
    roundedThicknessM: "3e-5"
  },
  source16: {
    suppliedVoltages: [500, 5000],
    authorAddedOrdinaryRoundedConstantsNotPrinted: { chargeMagnitudeC: electronCharge, massKg: electronMass },
    model: "Negligible initial kinetic energy, full accelerating voltage, no losses, nonrelativistic",
    orderedSpeedPairMPerS: [speed(500), speed(5000)],
    roundedOrderedSpeedPairMPerS: ["1.3e7", "4.2e7"],
    speedRatio: speed(5000) / speed(500),
    applicabilityOnly: {
      authorAddedCMPerSNotPrinted: c,
      speedFractionOfC: [speed(500) / c, speed(5000) / c],
      relativisticComparisonMPerS: [relativisticSpeed(500), relativisticSpeed(5000)],
      relativeNonrelOverestimate: [speed(500) / relativisticSpeed(500) - 1, speed(5000) / relativisticSpeed(5000) - 1],
      claim: "Check of approximate model scale only, not an independently reviewed source answer."
    }
  },
  draftsAbsent: true,
  imagesOpened: 0,
  independentReview: "PENDING"
};
fs.writeFileSync(path.join(root, "pre-options-arithmetic.json"), `${JSON.stringify(record, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify(record, null, 2));
