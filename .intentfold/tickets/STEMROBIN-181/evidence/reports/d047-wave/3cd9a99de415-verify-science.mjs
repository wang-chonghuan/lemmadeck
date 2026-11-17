import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const evidence = path.dirname(fileURLToPath(import.meta.url));
const tmp = path.dirname(evidence);
const cases = [];
const hash = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const inputBindings = [];
const templates = {};
function load(file) {
  const bytes = fs.readFileSync(file);
  inputBindings.push({ path: file, sha256: hash(bytes) });
  return JSON.parse(bytes);
}
for (const name of ["n38", "n40"]) {
  const author = path.join(tmp, `d044-10p-${name}-author`);
  templates[name] = {
    raw: load(path.join(author, `zh/root/10p/lessons/phy10-c1-s5-${name}/lesson.json`)),
  };
  for (const language of ["zh", "en"]) {
    templates[name][language] = load(path.join(author,
      `${language}/work/adapt/10p/modern-us-neutral/lessons/phy10-c1-s5-${name}/lesson.template.json`));
  }
}
function check(id, refs, observation, assertion) {
  try {
    assertion();
    cases.push({ id, source_refs: refs, status: "PASS", observation });
  } catch (error) {
    cases.push({ id, source_refs: refs, status: "FAIL", observation, error: error.message });
  }
}
const close = (a, b) => assert(Math.abs(a - b) < 1e-10);
const dot = (a, b) => a.reduce((sum, value, i) => sum + value * b[i], 0);
const mathTokens = (lesson) => lesson.prose.flatMap((p) => [...p.text.matchAll(/\$([^$]+)\$/g)].map((m) => m[1].trim()));

check("unchanged-periods-and-zero-added-formulas", ["p0108#5", "p0108#7", "p0109#3"], {
  description: "All three n38 versions contain exactly two T tokens; n40 contains no math tokens.",
}, () => {
  for (const language of ["raw", "zh", "en"]) {
    assert.deepEqual(mathTokens(templates.n38[language]), ["T", "T"]);
    assert.deepEqual(mathTokens(templates.n40[language]), []);
  }
});

check("oscillatory-restoring-force-and-turning-point", ["p0107#6"], {
  model: "u=A*cos(omega*t-k*x); a=-omega^2*u; at u=0 the speed can be maximal, while at |u|=A speed is zero.",
  limitation: "Checks the stated single outgoing small-amplitude oscillatory model, not all possible string disturbances.",
}, () => {
  const omega = 2;
  for (const phase of [0, Math.PI / 3, Math.PI / 2, Math.PI]) {
    const displacement = Math.cos(phase);
    const acceleration = -(omega ** 2) * displacement;
    assert(displacement * acceleration <= 1e-10);
  }
  close(-omega * Math.sin(0), 0);
  assert(Math.abs(-omega * Math.sin(Math.PI / 2)) > 0);
});

check("outgoing-drive-frequency-phase-and-polarization", ["p0108#4", "p0108#5", "p0108#7", "p0109#3"], {
  model: "For cos(omega*t-k*x), adjacent phase delay k*dx is positive and the local frequency is omega. Displacement perpendicular/parallel to the chain distinguishes transverse/longitudinal motion.",
  limitation: "Assumes a supported outgoing propagation mode after the initial transient and before reflected waves return; discrete-chain dispersion is not being simulated.",
}, () => {
  const omega = 2, k = 0.3, dx = 1;
  assert(k * dx / omega > 0);
  close(dot([0, 1, 0], [1, 0, 0]), 0);
  close(dot([1, 0, 0], [1, 0, 0]), 1);
  for (const language of ["zh", "en"]) {
    const text = templates.n38[language].prose.map((p) => p.text).join("\n");
    assert(language === "en" ?
      text.includes("small-amplitude") && text.includes("initial transient") && text.includes("reflected waves") :
      text.includes("小幅") && text.includes("暂态") && text.includes("反射波"));
  }
});

check("source-ordinal-panel-mapping-not-glyph-shape", ["p0108#6", "p0108#7", "p0109#3"], {
  figure70: [["а", "a"], ["б", "b"], ["в", "c"], ["г", "d"], ["д", "e"], ["е", "f"]],
  figure71: [["а", "a"], ["б", "b"]],
  figurePixelsReviewed: false,
}, () => {
  for (const language of ["zh", "en"]) {
    assert.deepEqual(templates.n38[language].prose[7].subfigure_label_changes.map(({ from, to }) => [from, to]),
      [["а", "a"], ["б", "b"], ["в", "c"], ["г", "d"], ["д", "e"], ["е", "f"]]);
    assert.deepEqual(templates.n38[language].prose[8].subfigure_label_changes.map(({ from, to }) => [from, to]),
      [["а", "a"], ["б", "b"]]);
  }
});

check("lossless-spherical-spreading-versus-plane-counterexample",
  ["p0112#14", "p0113#1", "p0113#2", "p0113#8", "p0114#7"], {
    model: "Conserved outgoing power gives I=P/(4*pi*r^2); at fixed impedance/frequency, amplitude-squared tracks intensity. A fixed-area ideal plane-wave tube has constant intensity without loss.",
    syntheticTestOnly: "Doubling radius reduces spherical intensity to one quarter but leaves the fixed-area plane-wave intensity unchanged.",
    authority: "openstax-intensity, equations 17.8-17.11",
    limitation: "No values or inverse-radius formula were added to the cards; this is not a general proof for heterogeneous media, interference or near fields.",
  }, () => {
    const power = 1;
    const spherical = (r) => power / (4 * Math.PI * r * r);
    close(spherical(2) / spherical(1), 0.25);
    close(Math.sqrt(spherical(2) / spherical(1)), 0.5);
    const planeIntensityAtDistance = (_distance) => power / 1;
    close(planeIntensityAtDistance(1), planeIntensityAtDistance(2));
    assert.notEqual(spherical(2), spherical(1));
  });

check("equal-phase-wavefront-and-normal-ray", ["p0113#3", "p0113#6", "p0113#7", "p0114#6"], {
  model: "At fixed time, planes normal to k have constant k dot x; tangential displacement leaves phase unchanged. Equal amplitude alone does not impose equal phase. Spherical rays are radial normals.",
  limitation: "Alignment of ray/phase normal with energy transport is restricted to the stated uniform isotropic ray model.",
}, () => {
  const k = [1, 0, 0], tangent = [0, 3, 1];
  close(dot(k, tangent), 0);
  assert.notEqual(Math.cos(0), Math.cos(Math.PI / 2));
  for (const language of ["zh", "en"]) {
    const text = templates.n40[language].prose[8].text;
    assert(language === "en" ? text.includes("isotropic") : text.includes("各向同性"));
  }
});

check("pure-shear-fluid-limit-and-longitudinal-restoring-response",
  ["p0114#8", "p0114#9", "p0114#10", "p0115#1"], {
    model: "Small pure transverse shear has zero strain trace. In the ordinary elastic continuum model, cS^2=G/rho and cP^2=(K+4G/3)/rho; G=0 eliminates bulk elastic shear propagation while K>0 allows longitudinal waves.",
    limitation: "No claim about arbitrary high-frequency viscoelastic or nonmechanical waves; gravity and surface tension can restore liquid-surface motion without bulk shear stiffness.",
  }, () => {
    const traceOfPureShearStrain = 0 + 0 + 0;
    close(traceOfPureShearStrain, 0);
    const K = 2, G = 0, rho = 1;
    close(G / rho, 0);
    assert((K + 4 * G / 3) / rho > 0);
    for (const language of ["zh", "en"]) {
      const block = templates.n40[language].prose[19];
      assert.equal(block.label, "footnote");
      assert(block.text.includes("①"));
      assert(language === "en" ?
        block.text.includes("vertically and horizontally") && block.text.includes("Gravity and surface tension") :
        block.text.includes("水平分量") && block.text.includes("重力和表面张力"));
    }
  });

check("stable-isotropic-solid-P-faster-than-S-and-distance-not-location", ["p0115#2"], {
  model: "For positive K,G,rho, cP^2-cS^2=(K+G/3)/rho>0. For common-path constant-speed waves, dt=d*(1/cS-1/cP), so a positive S-P delay can be inverted for distance, not unique direction.",
  authority: "usgs-body-waves and usgs-travel-times",
  limitation: "Synthetic constant-speed inversion is illustrative only. Real travel-time curves require source depth and a path/velocity model.",
}, () => {
  for (const K of [0.1, 1, 8]) for (const G of [0.1, 1, 3]) {
    const rho = 2;
    assert((K + 4 * G / 3) / rho > G / rho);
  }
  const cp = 6, cs = 3, distance = 12;
  const delay = distance * (1 / cs - 1 / cp);
  assert(delay > 0);
  close(delay / (1 / cs - 1 / cp), distance);
  close(Math.hypot(distance, 0), Math.hypot(0, distance));
  assert.notDeepEqual([distance, 0], [0, distance]);
  for (const language of ["zh", "en"]) {
    const text = templates.n40[language].prose[21].text;
    assert(language === "en" ?
      text.includes("isotropic") && text.includes("model of their paths") && text.includes("does not uniquely locate") :
      text.includes("各向同性") && text.includes("路径模型") && text.includes("不能独自唯一确定"));
  }
});

const status = cases.every((item) => item.status === "PASS") ? "PASS" : "FAIL";
const report = {
  schema: "ld-s10y-lesson/independent-science-consistency-evidence@1",
  ticket: "STEMROBIN-181",
  status,
  completedAt: new Date().toISOString(),
  inputBindings,
  cases,
  checkedCases: cases.length,
  meaning: "Fail-capable structural and conditional-model consistency observations supporting, not replacing, the independent sentence-by-sentence SCI judgment",
  unitsAndExamples: "Synthetic reviewer-only examples; no authored-source scientific numbers or formulas changed",
  imagesOpened: 0,
  nativeAffectedChecksRerun: false,
  sourcePageReviewRerun: false,
  authorRepairsPerformed: 0,
  fullCardApproval: false,
};
fs.writeFileSync(path.join(evidence, "science-verification.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ status, cases: cases.length, failures: cases.filter((item) => item.status === "FAIL") }, null, 2));
if (status !== "PASS") process.exitCode = 1;
