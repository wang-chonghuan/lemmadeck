import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const repo = "/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck";
const out = path.join(repo, ".tmp/stemrobin-184-resume/n13-figure-independent-first");
const inputs = [
  {
    role: "original_source_png",
    path: "ssot-resources/soviet10year-textbooks/artifacts/9c/figures/tbl-p0056-01.png",
    expectedSha256: "3e37d5b276033c4a10dff8523e63c5429805b85016f80b19f6807efdff011c5a",
  },
  {
    role: "current_authoritative_lesson_template",
    path: ".tmp/ld-s10y-lesson/adapt/9c/modern-us-neutral/lessons/ana9-c3-s1-n13/lesson.template.json",
    expectedSha256: "20ffd453585388eac6a410e7265e8dbefd867488ed60a9450d942f4074285656",
  },
  {
    role: "current_authoritative_exercises_template",
    path: ".tmp/ld-s10y-lesson/adapt/9c/modern-us-neutral/lessons/ana9-c3-s1-n13/exercises.template.json",
    expectedSha256: "f3a8b77823acc53fc4b3e5873506a8a0019c66d4b08d7948f9b3b1eda4ee8314",
  },
];

function hash(bytes) {
  return crypto.createHash("sha256").update(bytes).digest("hex");
}

function bindInputs() {
  return inputs.map((input) => {
    const absolute = path.join(repo, input.path);
    const bytes = fs.readFileSync(absolute);
    const sha256 = hash(bytes);
    assert.equal(sha256, input.expectedSha256, `Input changed: ${input.path}`);
    return { role: input.role, path: absolute, bytes: bytes.length, sha256 };
  });
}

function writeNew(name, data) {
  const target = path.join(out, name);
  assert.equal(path.dirname(target), out);
  fs.writeFileSync(target, `${JSON.stringify(data, null, 2)}\n`, {
    flag: "wx",
    mode: 0o444,
  });
}

function command(argv) {
  const result = spawnSync(argv[0], argv.slice(1), {
    cwd: repo,
    encoding: "utf8",
    maxBuffer: 1024 * 1024,
    env: { ...process.env, LC_ALL: "C" },
  });
  return {
    argv,
    cwd: repo,
    exitCode: result.status,
    signal: result.signal,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
    executionError: result.error?.message ?? null,
  };
}

const textCheck = `
const assert = require("node:assert/strict");
const fs = require("node:fs");
const paths = ${JSON.stringify(inputs.slice(1).map((item) => item.path))};
const lesson = JSON.parse(fs.readFileSync(paths[0], "utf8"));
const exercises = JSON.parse(fs.readFileSync(paths[1], "utf8"));
assert.equal(lesson.id, "ana9-c3-s1-n13");
assert.equal(lesson.edition, "modern-us-neutral");
assert.equal(exercises.lesson, lesson.id);
assert.equal(exercises.edition, lesson.edition);
assert.equal(lesson.figures.length, 1);
assert.equal(lesson.figures[0].id, "tbl-p0056-01");
const figureEntries = lesson.prose.filter(item => item.kind === "fig");
assert.equal(figureEntries.length, 1);
assert.equal(figureEntries[0].id, "tbl-p0056-01");
assert.equal(exercises.count, 1);
assert.equal(exercises.exercises.length, 1);
assert.equal(exercises.exercises[0].number, "115");
assert.deepEqual(exercises.exercises[0].figure_refs, []);
const explanation = lesson.prose.find(item => item.source_refs?.includes("p0056#2"));
assert.ok(explanation.text.includes("$12$"));
assert.ok(explanation.text.includes("$55$"));
assert.ok(explanation.text.includes("$10$"));
assert.ok(explanation.text.includes("0.2(18)"));
console.log(JSON.stringify({
  status: "text-structure-checks-completed-not-figure-approval",
  lessonPath: paths[0],
  exercisesPath: paths[1],
  authoritativeModernProse: lesson.prose.map((item, index) => ({
    index, kind: item.kind, id: item.id, label: item.label,
    printed_page: item.printed_page, source_refs: item.source_refs, text: item.text
  })),
  authoritativeModernExercises: exercises.exercises.map(item => ({
    number: item.number, text: item.text, lines: item.lines,
    pages: item.pages, figure_refs: item.figure_refs
  })),
  figureExplanation: explanation.text,
  restrictions: "No answer files, answer keys, candidate specs, SVGs or render evidence read."
}, null, 2));
`;

const headerCheck = `
const assert = require("node:assert/strict");
const fs = require("node:fs");
const filename = ${JSON.stringify(inputs[0].path)};
const descriptor = fs.openSync(filename, "r");
const header = Buffer.alloc(24);
try { assert.equal(fs.readSync(descriptor, header, 0, 24, 0), 24); }
finally { fs.closeSync(descriptor); }
assert.equal(header.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
assert.equal(header.subarray(12, 16).toString("ascii"), "IHDR");
console.log(JSON.stringify({
  path: filename, width: header.readUInt32BE(16), height: header.readUInt32BE(20),
  method: "24-byte PNG header only; no image rendering or visual load"
}, null, 2));
`;

assert.equal(fs.realpathSync(process.cwd()), repo);
assert.equal(fs.realpathSync(out), out);
const phase = process.argv[2];
assert.ok(["pre-view", "freeze"].includes(phase));
const bindings = bindInputs();
const checks = [
  command(["date", "-u", "+%Y-%m-%dT%H:%M:%SZ"]),
  command(["shasum", "-a", "256", ...inputs.map((input) => input.path)]),
  command([process.execPath, "-e", textCheck]),
  command([process.execPath, "-e", headerCheck]),
];

if (phase === "pre-view") {
  writeNew("checks.pre-view.json", {
    stage: "A",
    status: "command-evidence-only",
    inputs: bindings,
    checks,
  });
  for (const check of checks) assert.equal(check.exitCode, 0);
  writeNew("ledger.pre-view.json", {
    stage: "A",
    createdAtUtc: checks[0].stdout.trim(),
    ticket: "STEMROBIN-184",
    figure: "tbl-p0056-01",
    lesson: "ana9-c3-s1-n13",
    scope: "Independent source-pixel inventory only; no candidate disclosed",
    parent: { permanentImageCount: 24, imageLimit: 24, returnFormat: "text-only-no-image-payloads" },
    freshBatch: {
      maximumImages: 4,
      initialImages: 0,
      imagesLoadedBeforeLedger: 0,
      reservedNextView: { tool: "functions.view_image", path: bindings[0].path, count: 1 },
      plannedTotalAfterView: 1,
      resetAfterPhase: false,
      sourceReopenAllowed: false,
      cropAllowed: false,
    },
    inputs: bindings,
    restrictions: [
      "Write only this evidence directory and never replace another worker's files.",
      "No candidate author inventory, candidate spec, render, SVG, keys, answer files or other evidence.",
      "No backend, DB, publish, Git, history, browser, setup, model services or worker messages.",
      "No figure promotion, canonical writes, new worker or lesson approval.",
    ],
  });
  console.log(JSON.stringify({
    stage: "A", phase, status: "pre-view-ledger-recorded",
    imagesLoaded: 0, nextViewCount: 1, inputs: bindings,
  }, null, 2));
} else {
  const ledger = JSON.parse(fs.readFileSync(path.join(out, "ledger.pre-view.json"), "utf8"));
  const first = JSON.parse(fs.readFileSync(path.join(out, "FIRST.json"), "utf8"));
  assert.deepEqual(bindings, ledger.inputs);
  assert.deepEqual(first.inputs, bindings);
  assert.equal(first.stage, "A");
  assert.equal(first.formalFigurePass, false);
  assert.equal(first.candidateDisclosed, false);
  assert.equal(first.imageLedger.initial, 0);
  assert.equal(first.imageLedger.sourceViews, 1);
  assert.equal(first.imageLedger.total, 1);
  assert.equal(first.imageLedger.crops, 0);
  assert.equal(first.imageLedger.reopens, 0);
  assert.equal(first.imageLedger.resetAfterPhase, false);
  assert.equal(first.inventory.numberRows.length, 8);
  assert.equal(first.inventory.strokes.length, 8);
  assert.equal(first.inventory.arrows.length, 2);
  checks.push(command([process.execPath, "-e", `
const assert = require("node:assert/strict");
const fs = require("node:fs");
const firstPath = ${JSON.stringify(path.join(out, "FIRST.json"))};
const first = JSON.parse(fs.readFileSync(firstPath, "utf8"));
assert.equal(first.formalFigurePass, false);
assert.equal(first.candidateDisclosed, false);
assert.equal(first.inventory.numberRows.length, 8);
assert.equal(first.inventory.strokes.length, 8);
assert.equal(first.inventory.arrows.length, 2);
console.log(JSON.stringify({
  status: "source-first-freeze-structure-only-not-formal-PASS",
  firstPath,
  rows: first.inventory.numberRows.map(row => ({id: row.id, text: row.text, columns: row.digitColumns})),
  strokes: first.inventory.strokes.map(stroke => ({id: stroke.id, role: stroke.role})),
  arrows: first.inventory.arrows,
  limitations: first.sourceLimits,
  candidateDisclosed: false, formalFigurePass: false, imagesLoaded: 1
}, null, 2));
`]));
  writeNew("checks.freeze.json", {
    stage: "A",
    status: "captured-command-evidence-not-figure-approval",
    inputs: bindings,
    checks,
  });
  for (const check of checks) assert.equal(check.exitCode, 0);
  const names = fs.readdirSync(out).sort();
  assert.ok(!names.includes("manifest.json"), "Refusing to replace an existing manifest");
  const files = names.map((name) => {
    const absolute = path.join(out, name);
    assert.ok(fs.lstatSync(absolute).isFile(), `Unexpected non-file: ${absolute}`);
    const bytes = fs.readFileSync(absolute);
    fs.chmodSync(absolute, 0o444);
    return { path: absolute, bytes: bytes.length, sha256: hash(bytes) };
  });
  writeNew("manifest.json", {
    stage: "A",
    status: "source-first-freeze-for-parent-intake-not-formal-PASS",
    mode: "0444",
    inputs: bindings,
    files,
    selfExcluded: "manifest.json is not included in its own hash list; its SHA-256 is emitted separately.",
  });
  for (const file of files) {
    assert.equal(fs.statSync(file.path).mode & 0o777, 0o444);
    assert.equal(hash(fs.readFileSync(file.path)), file.sha256);
  }
  const manifestPath = path.join(out, "manifest.json");
  assert.equal(fs.statSync(manifestPath).mode & 0o777, 0o444);
  console.log(JSON.stringify({
    stage: "A",
    status: "source-first-freeze-for-parent-intake-not-formal-PASS",
    files,
    manifest: {
      path: manifestPath,
      bytes: fs.statSync(manifestPath).size,
      sha256: hash(fs.readFileSync(manifestPath)),
      mode: "0444",
    },
    imagesLoaded: 1,
    stop: "Await parent intake before any candidate StageB disclosure.",
  }, null, 2));
}
