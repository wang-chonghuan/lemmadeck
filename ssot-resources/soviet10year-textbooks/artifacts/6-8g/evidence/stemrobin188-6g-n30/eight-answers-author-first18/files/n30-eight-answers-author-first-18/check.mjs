import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const W = "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck";
const output = dirname(fileURLToPath(import.meta.url));
const retained = join(W, ".intentfold/tickets/STEMROBIN-188/tmp/n30-draft-first-18");
const preparedPath = join(retained, "work/adapt/6-8g/modern-us-neutral/lessons/geo68-c2-s4-n30/exercises.template.json");
const rawPath = join(retained, "artifacts/6-8g/lessons/geo68-c2-s4-n30/exercises.json");
const bytes = (path) => readFileSync(path);
const json = (path) => JSON.parse(bytes(path).toString("utf8"));
const hash = (path) => createHash("sha256").update(bytes(path)).digest("hex");
const prepared = json(preparedPath);
const raw = json(rawPath);
const keys = json(join(output, "answer-keys.json"));
const identities = ["373", "374", "375", "376", "377", "378", "379", "380"];
const counts = [4, 2, 1, 1, 1, 1, 2, 2];
let numericCases = 0;
const near = (actual, expected) => {
  assert.ok(Number.isFinite(actual) && Number.isFinite(expected));
  assert.ok(Math.abs(actual - expected) <= 1e-9 * Math.max(1, Math.abs(actual), Math.abs(expected)),
    `${actual} != ${expected}`);
};

assert.equal(prepared.lesson, "geo68-c2-s4-n30");
assert.equal(raw.lesson, prepared.lesson);
assert.equal(prepared.count, 8);
assert.equal(raw.count, 8);
assert.equal(prepared.edition, "modern-us-neutral");
assert.deepEqual(prepared.source.data, raw);
assert.equal(hash(preparedPath), "cfb81726fe00afdd40fe6536ec629268aa9eff84dec4249105626e68af467c1f");
assert.equal(hash(rawPath), "af6dd36b6cdb719829a25acfdef3d43fea81ee3242bb078b2f88af4da77493ff");
assert.equal(prepared.source.sha256, hash(rawPath));
assert.equal(keys.schema, "ld-s10y-answer/lesson-answers@1");
assert.equal(keys.book, "6-8g");
assert.equal(keys.edition, prepared.edition);
assert.equal(keys.lesson, prepared.lesson);
assert.equal(keys.status, "draft");
assert.deepEqual(keys.answers.map((answer) => answer.exercise), identities);
assert.deepEqual(prepared.exercises.map((exercise) => exercise.number), identities);
assert.deepEqual(raw.exercises.map((exercise) => exercise.number), identities);
assert.equal(counts.reduce((sum, count) => sum + count, 0), 14);
for (const document of [prepared, raw]) {
  for (const exercise of document.exercises) {
    assert.deepEqual(exercise.figure_refs, []);
    assert.deepEqual(exercise.figures, []);
  }
}
for (const [index, answer] of keys.answers.entries()) {
  assert.equal(answer.grading, "ungraded");
  assert.equal(answer.source, "derived");
  assert.ok(!Object.hasOwn(answer, "bookRaw"));
  assert.deepEqual(answer.parts, []);
  assert.ok(answer.displayAnswer.trim().length > 0);
  if (counts[index] > 1) {
    for (let label = 1; label <= counts[index]; label += 1) {
      assert.ok(answer.displayAnswer.includes(`${label})`));
    }
  }
}
assert.ok(keys.answers.find((answer) => answer.exercise === "378").displayAnswer.startsWith("UNKNOWN"));

for (const a of [0.25, 1, 5, 12]) {
  for (const ratio of [0.01, 0.25, 0.5, 0.99]) {
    const h = a * ratio;
    const b = a * h / Math.sqrt(a * a - h * h);
    const c = a * a / Math.sqrt(a * a - h * h);
    near(c * c, a * a + b * b);
    near(a * b / c, h);
    const dx = h * h / a;
    const dy = h * Math.sqrt(a * a - h * h) / a;
    near(dx * dx + dy * dy, h * h);
    near(dx * (dx - a) + dy * dy, 0);
    assert.ok(Math.sqrt(a * a - h * h) > 0);
    numericCases += 1;
  }
}

for (const a of [1, 5, 12]) {
  for (const ratio of [0.1, 0.5, 1 / Math.sqrt(2), 0.9]) {
    const h = a * ratio;
    const root = Math.sqrt(a * a - h * h);
    const height = a * h / (2 * root);
    const leg = a * a / (2 * root);
    const projection = root;
    near(leg * leg, a * a / 4 + height * height);
    near(a * height / leg, h);
    if (ratio < 1 / Math.sqrt(2)) assert.ok(projection > leg);
    else if (ratio > 1 / Math.sqrt(2)) assert.ok(projection < leg);
    else near(projection, leg);
    numericCases += 1;
  }
}

for (const alpha of [0.2, Math.PI / 3, 2.8]) {
  for (const [p, q] of [[2, 2], [2, 5], [7, 0.5]]) {
    for (const t of [0, 0.5, 3]) {
      const m1 = Math.hypot(t, p / 2);
      const m2 = Math.hypot(t, q / 2);
      const px = m1;
      const py = (m2 - m1 * Math.cos(alpha)) / Math.sin(alpha);
      const radius2 = py * py + p * p / 4;
      const center2 = px * px + py * py;
      near(center2 - radius2, t * t);
      near(center2 - m2 * m2 + q * q / 4, radius2);
      assert.ok(m1 - p / 2 >= 0 && m2 - q / 2 >= 0 && radius2 > 0);
      for (const s of [m1 - p / 2, m1 + p / 2]) {
        near((s - px) ** 2 + py * py, radius2);
      }
      for (const s of [m2 - q / 2, m2 + q / 2]) {
        near((s * Math.cos(alpha) - px) ** 2 + (s * Math.sin(alpha) - py) ** 2, radius2);
      }
      numericCases += 1;
    }
  }
}

for (const r of [0.5, 2, 7]) {
  for (const m of [-6, -0.2, 0.2, 6]) {
    const s = m * m / (4 * r);
    near(Math.hypot(m, s - r), r + s);
    assert.ok(s > 0);
    numericCases += 1;
  }
  for (const s of [r / 4, r, 3 * r]) {
    near(Math.abs(-s - r), r + s);
    if (s !== r) near(Math.abs(s - r), Math.abs(r - s));
    numericCases += 1;
  }
  for (const w of [-0.99, -0.5, 0, 0.7, 0.99]) {
    const ux = Math.sqrt(1 - w * w);
    const lambda = 2 / (1 - w);
    const s = r * (1 + w) / (1 - w);
    const py = r * (1 + lambda * w);
    const px = lambda * r * ux;
    const d = r * (1 + w);
    near(py, s);
    near(Math.hypot(px, py - r), r + s);
    near(Math.hypot(px - r * ux, py - r * (1 + w)), s);
    near(s, r * d / (2 * r - d));
    assert.ok(lambda > 1 && s > 0);
    numericCases += 1;
  }
  // At the antipodal point, equidistance forces the original center only.
  for (const lambda of [-2, 0, 0.5, 1, 3]) {
    near((1 + lambda) ** 2 - (lambda - 1) ** 2, 4 * lambda);
    near((1 - lambda) ** 2 - (lambda - 1) ** 2, 0);
    numericCases += 1;
  }
}

for (const [r1, r2] of [[1, 1], [1, 3], [4, 0.5]]) {
  for (const y of [-5, 0, 0.2, 7]) {
    near(r1 * r1 + y * y - r1 * r1, y * y);
    near(r2 * r2 + y * y - r2 * r2, y * y);
    if (y !== 0) {
      assert.ok(Math.hypot(r1, y) > r1 && Math.hypot(r2, y) > r2);
    }
    numericCases += 1;
  }
  for (const x of [-2, 0.3, 4]) {
    const y = 6;
    const p1 = x * x + y * y + 2 * r1 * x;
    const p2 = x * x + y * y - 2 * r2 * x;
    near(p1 - p2, 2 * (r1 + r2) * x);
    assert.notEqual(p1, p2);
    numericCases += 1;
  }
}

const result = {
  check: "offline-structure-and-sampled-arithmetic-only",
  outcome: "completed",
  gateVerdict: null,
  lesson: prepared.lesson,
  answers: keys.answers.length,
  subparts: 14,
  derived: 8,
  ungraded: 8,
  auto: 0,
  unknownSourceExercises: ["378"],
  numericCases,
  counters: {
    imageLoads: 0,
    textbookFigureOpens: 0,
    networkCalls: 0,
    modelCalls: 0,
    paidCalls: 0,
    databaseCalls: 0,
    appCalls: 0,
    nativePrepareCalls: 0,
    nativeFinalizeCalls: 0,
    independentGateVerdicts: 0
  },
  inputs: [
    { path: preparedPath, sha256: hash(preparedPath) },
    { path: rawPath, sha256: hash(rawPath) }
  ],
  files: readdirSync(output).filter((name) => name !== "manifest.json").sort().map((name) => ({
    path: join(output, name),
    sha256: hash(join(output, name))
  }))
};
const manifestPath = join(output, "manifest.json");
if (readdirSync(output).includes("manifest.json")) {
  const manifest = json(manifestPath);
  assert.deepEqual(manifest.files, result.files);
  assert.equal(manifest.verification.numericCases, numericCases);
}
console.log(JSON.stringify(result, null, 2));
