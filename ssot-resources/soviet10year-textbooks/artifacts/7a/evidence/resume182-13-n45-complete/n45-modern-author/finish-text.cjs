const fs = require("node:fs");
const path = require("node:path");
const cp = require("node:child_process");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
const cwd = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
assert.equal(process.cwd(), cwd);
const base = `${cwd}/.intentfold/tickets/STEMROBIN-182/tmp/resume182-13`;
const author = `${base}/n45-modern-author`;
const id = "alg7-c4-s3-n45";
const working = `${author}/WORKING/${id}`;
const final = `${author}/FINAL/${id}`;
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const sha = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const ref = file => ({ path: file, sha256: sha(file), bytes: fs.statSync(file).size,
  mode: (fs.statSync(file).mode & 0o777).toString(8).padStart(4, "0") });
const save = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
function run(label, command, args) {
  const log = `${author}/${label}`;
  const start = { cwd, command: [command, ...args], startedAt: new Date().toISOString(),
    environmentOverride: { PYTHONDONTWRITEBYTECODE: "1" } };
  save(`${log}.start.json`, start);
  const stdout = fs.openSync(`${log}.stdout`, "wx");
  const stderr = fs.openSync(`${log}.stderr`, "wx");
  const result = cp.spawnSync(command, args, {
    cwd, env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
    stdio: ["ignore", stdout, stderr],
  });
  fs.closeSync(stdout);
  fs.closeSync(stderr);
  save(`${log}.receipt.json`, { ...start, finishedAt: new Date().toISOString(),
    exit: result.status, signal: result.signal, error: result.error?.message ?? null,
    streams: [ref(`${log}.stdout`), ref(`${log}.stderr`)] });
  console.log(fs.readFileSync(`${log}.stdout`, "utf8"));
  console.error(fs.readFileSync(`${log}.stderr`, "utf8"));
  if (result.status !== 0) process.exit(result.status ?? 1);
  return log;
}
assert(!fs.existsSync(final), "Do not overwrite a frozen FINAL candidate.");
run("text-check-RECOVERY1", ".claude/skills/ld-s10y-lesson/.venv/bin/python",
  [`${author}/verify-text.py`, working]);
const flowLog = run("prose-flow-FINAL", "node",
  [".claude/skills/ld-s10y-lesson/tools/prose_flow.mjs", "--json", `${working}/lesson.template.json`]);
const flow = read(`${flowLog}.stdout`);
const lesson = read(`${working}/lesson.template.json`);
assert.equal(flow.paragraphs.length, 18);
assert.equal(flow.boundaries.length, 1);
assert.deepEqual(flow.boundaries.map(({ before, after }) => ({ before, after })), lesson.section_breaks);
const preservation = read(`${author}/text-preservation.json`);
assert.equal(preservation.textOnlyPass, true);
const inputBinding = read(`${base}/n45-source-stage/inputs.json`);
for (const input of inputBinding.inputs) {
  assert.equal(sha(input.source.path), input.source.sha256);
  assert.equal(sha(input.isolated.path), input.isolated.sha256);
}
fs.mkdirSync(final, { recursive: true });
const outputs = ["lesson.template.json", "exercises.template.json", "figures.template.json"].map(name => {
  const from = `${working}/${name}`;
  const to = `${final}/${name}`;
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(to, 0o444);
  assert.equal(sha(from), sha(to));
  assert.equal(fs.statSync(from).mode & 0o777, 0o644);
  return { working: ref(from), final: ref(to) };
});
assert.equal(sha(`${final}/figures.template.json`),
  sha(`${base}/n45-adapt-work/PREPARED/${id}/figures.template.json`));
const figures = read(`${final}/figures.template.json`).figures;
const markdown = [
  "# 45. 可化为解二次方程的问题", "",
  ...lesson.prose.flatMap(block => block.kind === "fig"
    ? [`[RAW figure reference: ${block.id}; ${block.source_refs.join(", ")}; modern figure pending]`, ""]
    : [block.text, ""]),
];
fs.writeFileSync(`${final}/modern-text.md`, `${markdown.join("\n").trim()}\n`, { flag: "wx" });
const exercises = read(`${working}/exercises.template.json`);
const exerciseMarkdown = ["# Exercises 873-891", ""];
for (const exercise of exercises.exercises) {
  if (exercise.number === "886") exerciseMarkdown.push("## 复习题", "");
  exerciseMarkdown.push(exercise.text, "");
  if (exercise.figure_refs.length) exerciseMarkdown.push(
    `[RAW figure reference: ${exercise.figure_refs.join(", ")}; modern figure pending]`, "");
}
fs.writeFileSync(`${final}/modern-exercises.md`, `${exerciseMarkdown.join("\n").trim()}\n`, { flag: "wx" });
for (const name of ["modern-text.md", "modern-exercises.md"]) fs.chmodSync(`${final}/${name}`, 0o444);
save(`${author}/final-binding.json`, {
  schema: "stemrobin182/n45-modern-text-final-candidate@1", cwd, selected: [id],
  status: "TEXT_CANDIDATE_FROZEN_NOT_MODERN_FIGURE_APPROVAL",
  outputs, readableText: [ref(`${final}/modern-text.md`), ref(`${final}/modern-exercises.md`)],
  counts: { rawProseBlocks: 19, modernProseParagraphs: flow.paragraphs.length,
    originals: 19, latinSubparts: 44, figures: 3, mathSpans: preservation.mathSpans,
    sectionBreaks: lesson.section_breaks.length },
  sectionBreaks: lesson.section_breaks, proseFlow: ref(`${flowLog}.stdout`),
  preservation: ref(`${author}/text-preservation.json`),
  sourcePagesUnchanged: inputBinding.inputs, rawCandidate: ref(`${base}/n45-source-stage/candidate-binding.json`),
  commands: [
    ref(`${base}/n45-source-stage/assembly-FIRST.receipt.json`),
    ref(`${base}/n45-adapt-work/adapt-prepare-FIRST.receipt.json`),
    ref(`${author}/text-check-FIRST.receipt.json`),
    ref(`${author}/text-check-RECOVERY1.receipt.json`),
    ref(`${flowLog}.receipt.json`),
  ],
  figureEntriesByteIdenticalToPrepared: true,
  rawFigureReferences: figures.map(figure => ({
    id: figure.id, sourceRef: figure.id === "fig-59" ? "p0267#5" : figure.id === "fig-60" ? "p0273#4" : "p0273#9",
    owner: figure.id === "fig-59" ? "prose" : figure.id === "fig-60" ? "exercise 889" : "exercise 891",
    source: figure.source,
    absoluteRawPNG: `${base}/n45-source-stage/artifacts/7a/${figure.source.png.path}`,
  })),
  forbiddenActionsPerformed: { imagesOpened: 0, pageFinalizersRerun: 0, sourceReviewsRerun: 0,
    DB: 0, envFiles: 0, network: 0, app: 0, dependencyInstall: 0, modelCalls: 0, publish: 0,
    commits: 0, progressWrites: 0, usageWrites: 0, durableIndexWrites: 0, durableWrites: 0 },
  p2cCalls: { assemble: 1, adaptPrepare: 1, adaptFinalize: 0, render: 0, publish: 0 },
  source274Excluded: true, n46ExcludedFromSelectedLesson: true,
  recoveryRecords: [ref(`${base}/n45-source-stage/preflight-FIRST.failure.json`),
    ref(`${author}/text-check-FIRST.diagnosis.json`)],
});
console.log(JSON.stringify({ frozen: final, working, counts: preservation.mathSpans,
  textCandidate: true, figureEntriesUnchanged: true, imagesOpened: 0, outputs }, null, 2));
