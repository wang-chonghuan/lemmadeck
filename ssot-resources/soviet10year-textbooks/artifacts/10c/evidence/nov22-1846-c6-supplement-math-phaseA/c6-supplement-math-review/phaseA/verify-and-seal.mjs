import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const cwd = "/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck";
const out = path.join(cwd, ".tmp/stemrobin-184-six/c6-supplement-math-review/phaseA");
if (process.cwd() !== cwd) throw new Error("Wrong cwd");
const sha256 = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const base = ".tmp/stemrobin-184-six/c6-supplement-first/";
const modernDir = base + "work/adapt/10c/modern-us-neutral/lessons/ana10-c6-ex/";
const specifications = [
  ["modern-exercises", modernDir + "exercises.template.json", "7fb9af937709e464be2c1c211ac032d7b4bb4fd8e7be3ad97818418dc24aa9a0"],
  ["raw-exercises", base + "artifacts/10c/lessons/ana10-c6-ex/exercises.json", "05ebdbcc2f6830271040fdec2d097638d410b2aa807a14f38aa08cebf5d19c26"],
  ["modern-lesson", modernDir + "lesson.template.json", "ca4e7e343b6e18ccbb04a190824fcbb7d72e1f75148847ff6b5fee9e68eaf794"],
  ["modern-figures-metadata", modernDir + "figures.template.json", "06665195f26fa6376a01a4e50b3ff0b6f3b6ae0403b2f7dac2b70b3ddf94ee6f"],
];
const checks = [];
const commandFailures = [];
const check = (name, condition, detail = {}) => {
  checks.push({ name, passed: Boolean(condition), ...detail });
  if (!condition) commandFailures.push({ type: "local-verification-failure", name, detail });
};
const loaded = specifications.map(([role, relativePath, delegatedHash]) => {
  const absolutePath = path.join(cwd, relativePath);
  const bytes = fs.readFileSync(absolutePath);
  const actualHash = sha256(bytes);
  check("input-hash:" + role, actualHash === delegatedHash, { actualHash, delegatedHash });
  return { role, path: absolutePath, bytes: bytes.length, sha256: actualHash, data: JSON.parse(bytes) };
});
if (commandFailures.length) throw new Error("Input hash mismatch; math verification stopped");
const [modern, raw, lesson, figures] = loaded.map((x) => x.data);
const orderedNumbers = Array.from({ length: 57 }, (_, i) => String(335 + i));
check("modern-exact-scope", modern.count === 57 && JSON.stringify(modern.exercises.map((x) => x.number)) === JSON.stringify(orderedNumbers));
check("raw-exact-scope", raw.count === 57 && JSON.stringify(raw.exercises.map((x) => x.number)) === JSON.stringify(orderedNumbers));
check("zero-prose-and-figures", lesson.prose.length === 0 && lesson.figures.length === 0 && figures.figures.length === 0);
const items = modern.exercises.map((x, i) => {
  const r = raw.exercises[i];
  const aligned = ["number", "source_number", "group", "group_id"].every((key) => x[key] === r[key]);
  check("source-number-group-text:" + x.number, aligned && x.source_text === r.text
    && x.figure_refs.length === 0 && x.figures.length === 0 && r.figure_refs.length === 0 && r.figures.length === 0);
  return {
    number: x.number, source_number: x.source_number, group_id: x.group_id, group: x.group,
    modern_text: x.text, source_text: x.source_text, raw_text: r.text,
    raw_source_number: r.source_number, raw_group_id: r.group_id, raw_group: r.group,
    modern_lines: x.lines, raw_lines: r.lines, pages: x.pages,
    figure_refs: x.figure_refs, figures: x.figures,
    mathematical_status: x.number === "338" ? "HOLD-noanswer" : "independently-solved",
    source_ownership_status: ["371", "372", "373"].includes(x.number) ? "inherited-qualified" : "retained-not-newly-approved",
  };
});
const solutions = fs.readFileSync(path.join(out, "source-first-solutions.md"), "utf8");
const headings = [...solutions.matchAll(/^### (\d+)$/gm)].map((m) => m[1]);
check("solution-exact-order-and-coverage", JSON.stringify(headings) === JSON.stringify(orderedNumbers));
const heldSection = solutions.split("### 338\n")[1].split("### 339\n")[0];
check("338-hold-without-formula-or-alternatives",
  heldSection.includes("HOLD / noanswer") && heldSection.includes("UNKNOWN")
  && !heldSection.includes("\\[") && !heldSection.includes("y'"));
check("g9-qualified-in-each-section", ["371", "372", "373"].every((n) =>
  solutions.split("### " + n + "\n")[1].split("### ")[0].includes("QUALIFIED inherited command ownership")));

const pi = Math.PI;
const sin = Math.sin, cos = Math.cos, tan = Math.tan;
const cot = (x) => 1 / tan(x);
const arccot = (x) => Math.atan2(1, x);
const degree = (x) => x * pi / 180;
const samples = [-1.13, -0.37, 0.21, 0.83, 1.79, 2.36];
const near = (name, actual, wanted, tolerance = 1e-10) =>
  check(name, Number.isFinite(actual) && Math.abs(actual - wanted) <= tolerance,
    { actual, wanted, absoluteError: Math.abs(actual - wanted), tolerance });
const identity = (number, left, right) => {
  for (const x of samples) near(`math:${number}:x=${x}`, left(x), right(x));
};
const derivative = (number, f, df) => {
  for (const x of samples) {
    const h = 1e-5;
    near(`derivative:${number}:x=${x}`, (f(x + h) - f(x - h)) / (2 * h), df(x), 2e-7);
  }
};
derivative("335", (x) => sin(5 * x), (x) => 5 * cos(5 * x));
derivative("336", (x) => cos(6 * x + pi / 2), (x) => -6 * cos(6 * x));
for (const [a, b] of [[-2, 0.3], [0, -0.8], [1.7, 0.4]]) {
  derivative(`337:a=${a},b=${b}`, (x) => cos(a * x + b) ** 2, (x) => -a * sin(2 * a * x + 2 * b));
}
derivative("339", (x) => (x * x + x + 1) * sin(3 * x),
  (x) => (2 * x + 1) * sin(3 * x) + 3 * (x * x + x + 1) * cos(3 * x));
derivative("340", (x) => sin(x) * cos(x), (x) => cos(2 * x));
derivative("341", (x) => tan(x) + (1 + cot(x)) * cos(x),
  (x) => 1 / cos(x) ** 2 - cos(x) / sin(x) ** 2 - sin(x) - cos(x));
for (const x of [-1e-6, 1e-6]) {
  near(`limit:342:t=${x}`, sin(x) / x, 1);
  near(`limit:343:x=${x}`, sin(3 * x) / (5 * x), 3 / 5);
  near(`limit:344:x=${x}`, sin(4 * x) / sin(7 * x), 4 / 7);
  near(`limit:345:x=${x}`, sin(5 * x) / tan(3 * x), 5 / 3);
}
const harmonics = [
  ["346.1", 3, 2, -pi / 4, (x) => 3 * sin(2 * x - pi / 4)],
  ["346.2", 2, 4, 3 * pi / 10, (x) => 2 * cos(pi / 5 - 4 * x)],
  ["347.1", 0.6, 0.5, -pi / 5, (x) => -0.6 * cos(x / 2 + 0.3 * pi)],
  ["347.2", 1, 1, 1 + pi / 6, (x) => Math.sqrt(3) / 2 * sin(x + 1) + 0.5 * cos(x + 1)],
  ["351", 2, 2, pi / 4, (x) => 2 * (sin(pi / 4) * sin(2 * x) + cos(pi / 4) * cos(2 * x))],
  ["352", 5, 3, pi / 12 + Math.atan(3 / 4), (x) => 3 * cos(3 * x + pi / 12) + 4 * sin(3 * x + pi / 12)],
  ["353", Math.sqrt(2) / 2, 1, 3 * pi / 4, (x) => 0.5 * (cos(x) - sin(x))],
  ["354", 3, 2, 0, (x) => 3 * sin(2 * x)],
  ["355", 4, 2, -pi / 2, (x) => 4 - 8 * cos(x) ** 2],
  ["356", 2 * Math.sqrt(13), 1, -pi + Math.atan(2 * Math.sqrt(3)), (x) => -2 * sin(x) - 4 * Math.sqrt(3) * cos(x)],
];
for (const [n, A, omega, phi, f] of harmonics) {
  check("harmonic-convention:" + n, A > 0 && omega > 0 && phi > -pi && phi <= pi);
  identity(n, f, (x) => A * sin(omega * x + phi));
  identity(n + ":period", (x) => f(x + 2 * pi / omega), f);
}
const graphs = [
  ["348", 1.5, 8 / 3, -pi / 24, [-pi / 24, 7 * pi / 48, pi / 3, 25 * pi / 48, 17 * pi / 24]],
  ["349", 3, 5 / 3, -pi / 20, [-pi / 20, pi / 4, 11 * pi / 20, 17 * pi / 20, 23 * pi / 20]],
  ["350", 1, 2, pi / 8, [pi / 8, 3 * pi / 8, 5 * pi / 8, 7 * pi / 8, 9 * pi / 8]],
];
for (const [n, A, w, h, coordinates] of graphs) {
  const f = (x) => A * cos(w * (x - h));
  const df = (x) => -A * w * sin(w * (x - h));
  derivative(n, f, df);
  coordinates.forEach((x, i) => near(`plot-coordinate:${n}:${i}`, f(x), [A, 0, -A, 0, A][i]));
  const T = 2 * pi / w;
  near("graph-period:" + n, coordinates[4] - coordinates[0], T);
  check("graph-monotonicity:" + n, df(h + T / 4) < 0 && df(h + 3 * T / 4) > 0);
}
derivative("350:second", (x) => -2 * sin(2 * x - pi / 4), (x) => -4 * cos(2 * x - pi / 4));
identity("357", (a) => cos(pi - a) * cot(pi / 2 - a), (a) => -sin(a));
identity("358", (a) => cot(pi / 2 - a) * sin(0.7 - pi / 2) / (cos(pi - 0.7) * tan(-a)), () => -1);
identity("359", (x) => (1 - sin(3 * pi / 2 + x) ** 2) / (1 - sin(pi + x) ** 2), (x) => tan(x) ** 2);
identity("360", (a) => cos(pi - a) ** 2 / (1 - cos(3 * pi / 2 - a)), (a) => 1 - sin(a));
identity("361", (x) => tan(x) + tan(pi - x) + cot(pi / 2 + x), (x) => tan(2 * pi - x));
for (const y of [-37, 11, 43, 121]) {
  near("identity:362:degrees=" + y,
    sin(degree(90 + y)) * cos(degree(180 - y)) * cot(degree(270 + y)),
    sin(degree(90 - y)) * sin(degree(270 - y)) * cot(degree(90 + y)));
}
near("value:363", 10 * cot(degree(135)) * sin(degree(210)) * cos(degree(225)), -5 * Math.sqrt(2) / 2);
near("value:364", 2 * sin(degree(225)) ** 2 - cot(degree(330)) * tan(degree(405)), 1 + Math.sqrt(3));
near("value:365", Math.asin(Math.sqrt(3) / 2) + Math.asin(0.5), pi / 2);
near("value:366", Math.acos(0.5) + Math.acos(Math.sqrt(2) / 2), 7 * pi / 12);
near("value:367", Math.asin(-0.5) + Math.acos(-Math.sqrt(3) / 2), 2 * pi / 3);
near("value:368", Math.atan(-1) + Math.atan(1), 0);
near("value:369", Math.atan(Math.sqrt(3)) + arccot(1), 7 * pi / 12);
near("value:370", Math.acos(0) + Math.asin(Math.sqrt(2) / 2), 3 * pi / 4);
near("value:371:ownership-qualified", Math.acos(-1) + Math.acos(1), pi);
near("value:372:ownership-qualified", Math.asin(-Math.sqrt(2) / 2) + Math.asin(Math.sqrt(2) / 2), 0);
near("value:373:ownership-qualified", Math.atan(-1) + arccot(1), 0);
identity("374", (a) => cos(2 * a) / (1 + sin(2 * a)), (a) => (cos(a) - sin(a)) / (cos(a) + sin(a)));
identity("375", (a) => (tan(pi / 4 + a) ** 2 - 1) / (tan(pi / 4 + a) ** 2 + 1), (a) => sin(2 * a));
identity("376", (a) => (1 - cos(2 * a) + sin(2 * a)) / (1 + cos(2 * a) + sin(2 * a)), tan);
near("value:377", sin(degree(15)) * cos(degree(15)), 1 / 4);
const alpha1 = Math.asin(4 / 5);
const alpha2 = pi + Math.atan(24 / 7);
for (const [n, a, s, c, t] of [
  ["378.1", alpha1, Math.sqrt(5) / 5, 2 * Math.sqrt(5) / 5, 0.5],
  ["378.2", alpha2, 4 / 5, -3 / 5, -4 / 3],
]) {
  near(n + ":sin-half", sin(a / 2), s);
  near(n + ":cos-half", cos(a / 2), c);
  near(n + ":tan-half", tan(a / 2), t);
}
identity("379", (b) => (cos(b / 2) - sin(b / 2)) / (cos(b / 2) + sin(b / 2)), (b) => 1 / cos(b) - tan(b));
identity("380", (a) => cot(a / 2) - tan(a / 2), (a) => 2 * cot(a));
const t381 = -Math.sqrt(3);
near("381:t", tan(2 * pi / 3), t381);
near("381:sin", 2 * t381 / (1 + t381 ** 2), -Math.sqrt(3) / 2);
near("381:tan", 2 * t381 / (1 - t381 ** 2), Math.sqrt(3));
near("381:cot", (1 - t381 ** 2) / (2 * t381), Math.sqrt(3) / 3);

const equations = [
  ["382", (x) => sin(x / 2) ** 4 - cos(x / 2) ** 4 - 0.25,
    (k) => [Math.acos(-0.25) + 2 * k * pi, -Math.acos(-0.25) + 2 * k * pi]],
  ["383", (x) => cos(x) ** 2 + 4 * sin(x) ** 2 - 2 * sin(2 * x),
    (k) => [Math.atan(0.5) + k * pi]],
  ["384", (x) => 4 * (1 + cos(x)) - 3 * sin(x / 2) ** 2 * cos(x / 2),
    (k) => [pi + 2 * k * pi, 2 * Math.acos(1 / 3) + 4 * k * pi, -2 * Math.acos(1 / 3) + 4 * k * pi]],
  ["385", (x) => sin(x) + sin(3 * x), (k) => [k * pi / 2]],
  ["386", (x) => cos(2 * x) - cos(6 * x), (k) => [k * pi / 4]],
  ["387", (x) => sin(pi / 6 + x) - sin(pi / 6 - x) - 1,
    (k) => [Math.asin(1 / Math.sqrt(3)) + 2 * k * pi, pi - Math.asin(1 / Math.sqrt(3)) + 2 * k * pi]],
];
for (const [n, residual, family] of equations) {
  for (let k = -3; k <= 3; k++) {
    family(k).forEach((x, i) => near(`equation:${n}:k=${k}:family=${i}`, residual(x), 0));
  }
}
near("383:introduced-tangent-pole-not-solution", cos(pi / 2) ** 2 + 4 * sin(pi / 2) ** 2 - 2 * sin(pi), 4);
const shifted384 = 2 * Math.acos(1 / 3) + 2 * pi;
near("384:invalid-2pi-shift-detected", 4 * (1 + cos(shifted384)) - 3 * sin(shifted384 / 2) ** 2 * cos(shifted384 / 2), 16 / 9);
for (const x of samples) {
  const y = 0.47, a = x, b = -0.61;
  near(`product-sum:388:x=${x}`, sin(2 * x + y) * cos(x + 2 * y), (sin(3 * x + 3 * y) + sin(x - y)) / 2);
  near(`product-sum:389:alpha=${a}`, cos(2 * a - b) * cos(2 * a + b), (cos(4 * a) + cos(2 * b)) / 2);
  near(`product-sum:390:x=${x}`, sin(2 * x - y) * sin(x + 2 * y), (cos(x - 3 * y) - cos(3 * x + y)) / 2);
  near(`product-sum:391:x=${x}`, 4 * cos(x / 2) ** 2 * sin(x / 2) ** 2, (1 - cos(2 * x)) / 2);
}

const procedureReads = [
  ["pwd", "exact assigned cwd printed"],
  ["sed -n '1,240p' .intentfold/readme.md", "read session router"],
  ["sed -n '1,260p' .claude/skills/ld-s10y-answer/SKILL.md", "read answer skill"],
  ["test ! -e .tmp/stemrobin-184-six/c6-supplement-math-review/phaseA", "output absent before all writes"],
  ["sed -n '1,280p' .claude/skills/ld-s10y-answer/references/gate-2-lesson-answers/gate.md", "read Gate 2 constraints"],
  ["sed -n '1,280p' .claude/skills/ld-s10y-lesson/references/production-resume.md", "read resume constraints"],
  ["sed -n '1,240p' .intentfold/charter/engineering.md", "read engineering constraints"],
  ["sed -n '1,240p' .intentfold/charter/operations.md", "read operations constraints, first segment"],
  ["sed -n '1,220p' .intentfold/charter/product.md", "read product constraints"],
  ["sed -n '1,240p' /Users/yong/.agents/skills/intentfold/SKILL.md", "read routing, same invocation; no capability replay"],
  ["sed -n '240,320p' .intentfold/charter/operations.md", "read remaining guidance and redlines"],
];
const intakeReads = [
  { commandKind: "node -e", purpose: "four-source byte SHA-256, JSON keys/counts", exitCode: 0,
    inputs: specifications.map((x) => path.join(cwd, x[1])), outcome: "all four delegated hashes match; 57 modern/raw exercises, zero figures/prose" },
  ...[[335, 354], [355, 374], [375, 391]].map(([first, last]) => ({
    commandKind: "node -e", purpose: "whitelisted source-only projection by number range",
    exitCode: 0, range: [first, last], inputs: loaded.slice(0, 2).map((x) => x.path),
    printedFields: ["number", "source_number", "group", "group_id", "modern", "source_text", "raw", "raw_group", "raw_group_id", "lines"],
    outcome: "source-only question/group text read; no answer fields read",
  })),
];
const accounting = {
  scopedExercises: 57, solvedExercises: 56, heldExercises: ["338"],
  scopedNumberedLeafRequests: 60, solvedNumberedLeafRequests: 59,
  imageOperations: 0, imageViews: 0, imageHeadersOrBytes: 0, imagePixelsOrDecodesOrCrops: 0,
  paidCalls: 0, modelServiceEndpoints: 0, externalServiceRequests: 0,
  installs: 0, freshnessReplays: 0, backendReplays: 0, assemblyReplays: 0, adaptPreparationReplays: 0,
  authoredKeysSeen: false, phaseBPerformed: false,
  parentPermanentImages: { used: 24, limit: 24, status: "exhausted-inherited-not-reset" },
};
const writeNew = (filename, value) =>
  fs.writeFileSync(path.join(out, filename), JSON.stringify(value, null, 2) + "\n", { flag: "wx" });
writeNew("bindings.json", {
  schema: "stemrobin-184/c6-source-first-bindings@1", cwd, invocation: "same-ongoing-STEMROBIN-184/184-6",
  role: "sole-independent-mathematics-reviewer", phase: "A", finish: "review",
  sourceApproval: "not-established-by-delegated-path-hash-or-math-check",
  inheritedStages: ["scoped-raw-assembly", "adapt-preparation", "Pasteur-source-review-closed-per-human-delegation"],
  inputs: loaded.map(({ data, ...metadata }) => metadata), items,
});
writeNew("failures.json", {
  schema: "stemrobin-184/c6-phaseA-failures@1",
  commandFailures,
  sourceHolds: [{ exercise: "338", status: "HOLD-noanswer", ambiguity: "inner-lowpoint-2.3-decimal-versus-multiplication-UNKNOWN",
    innerMinusDoesNotResolveLowpoint: true, interpreted: false, derivativeProduced: false, alternativeAnswersProduced: false }],
  qualifiedOwnership: [{ exercises: ["371", "372", "373"], group_id: "g9", group: "验证等式：",
    mathematicalEqualityChecked: true, newSourceOwnershipApproval: false }],
  notationQualifications: [{ exercise: "364", retained: "\\sin^2225^\\circ", mathematicalNotation: "\\sin^2(225^\\circ)",
    newGlyphApproval: false }],
  lessonCoursePass: false, accounting,
});
writeNew("ledger.json", {
  schema: "stemrobin-184/c6-phaseA-ledger@1", cwd,
  observationBasis: "actual tool results for intake; locally calculated values for deterministic checks",
  stdoutRetention: "intake stdout observed in this chat, not fabricated as separately saved streams",
  commands: [
    ...procedureReads.map(([command, outcome]) => ({ command, cwd, exitCode: 0, outcome })),
    ...intakeReads.map((record) => ({ ...record, cwd })),
    { argv: ["node", ".tmp/stemrobin-184-six/c6-supplement-math-review/phaseA/verify-and-seal.mjs"],
      cwd, exitCode: commandFailures.length ? 1 : 0,
      outcome: commandFailures.length ? "deterministic checks failed; freeze not locally verified" : "source binding, coverage and deterministic sanity checks completed",
      exitCodeBasis: "script completed checks and writes payloads, then exits with the recorded status below" },
  ],
  manualWrites: { tool: "apply_patch", scope: out, otherPathsWritten: false },
  generatedWrites: { tool: "this deterministic Node script", scope: out, exclusiveCreate: true },
  mathematicalCheckLimit: "sanity checks of independently written derivations; not auto judging, source approval, or completeness proof",
  checks, checkCount: checks.length, passed: checks.filter((x) => x.passed).length, failed: commandFailures.length,
  accounting,
});
const payloadNames = ["source-first-solutions.md", "report.md", "verify-and-seal.mjs", "bindings.json", "failures.json", "ledger.json"];
const payloads = payloadNames.map((name) => {
  const absolutePath = path.join(out, name);
  const bytes = fs.readFileSync(absolutePath);
  return { name, path: absolutePath, bytes: bytes.length, sha256: sha256(bytes) };
});
writeNew("seal.json", {
  schema: "stemrobin-184/c6-phaseA-seal@1", phase: "A", cwd,
  status: commandFailures.length ? "LOCAL-CHECK-FAILURE" : "SOURCE-FIRST-MATH-FROZEN-WITH-338-HOLD",
  inputs: loaded.map(({ data, ...metadata }) => metadata), payloads,
  sealSelfHash: "excluded to avoid self-reference; actual seal-byte hash is printed by this command",
  noPhaseB: true, authoredKeysUnseen: true, noLessonCoursePass: true, accounting,
});
const sealBytes = fs.readFileSync(path.join(out, "seal.json"));
console.log(JSON.stringify({
  cwd, checkCount: checks.length, passed: checks.filter((x) => x.passed).length, failed: commandFailures.length,
  accounting, payloads,
  seal: { path: path.join(out, "seal.json"), bytes: sealBytes.length, sha256: sha256(sealBytes) },
}, null, 2));
process.exitCode = commandFailures.length ? 1 : 0;
