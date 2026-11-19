const fs = require("node:fs");
const path = require("node:path");
const cp = require("node:child_process");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const cwd = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
assert.equal(process.cwd(), cwd);
const base = `${cwd}/.intentfold/tickets/STEMROBIN-182/tmp/resume182-13`;
const author = `${base}/n45-modern-author`;
const id = "alg7-c4-s3-n45";
const prepared = `${base}/n45-adapt-work/PREPARED/${id}`;
const working = `${author}/WORKING/${id}`;
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const save = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
const hash = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const edits = read(`${author}/text-edits.json`);
assert.equal(edits.lesson, id);
assert(!fs.existsSync(working), "Do not overwrite another author or rerun authoring.");
fs.mkdirSync(working, { recursive: true });
const lesson = read(`${prepared}/lesson.template.json`);
const exercises = read(`${prepared}/exercises.template.json`);
assert.deepEqual(lesson.errata, []);
assert.equal(exercises.count, 19);
for (const [index, text] of Object.entries(edits.prose)) {
  const block = lesson.prose[Number(index)];
  assert.equal(block.kind, "p");
  block.text = text;
  block.changes = text === block.source_text ? [] : ["layout"];
}
const labels = "абвгдежзиклмнопрстуфхцчшщэюя";
const latin = "abcdefghijklmnopqrstuvwxyz";
const partCounts = [];
for (const exercise of exercises.exercises) {
  let text = exercise.text.replace(/(^|\n)([а-яё])\)/gu, (_match, before, label) => {
    const index = labels.indexOf(label);
    assert(index >= 0);
    return `${before}${latin[index]})`;
  });
  // Punctuation is changed only outside intact math spans.
  text = text.split(/(\$\$[\s\S]+?\$\$|\$[^$]+?\$)/u).map((part, index) =>
    index % 2 ? part : part.replace(/(?<=[\p{Script=Han}]|\$)\.(?![a-z])/gu, "。")
      .replace(/([。？！])(?=[\p{Script=Han}])/gu, "$1 ")
  ).join("");
  for (const replacement of edits.contextual_replacements.filter(item => item.exercise === exercise.number)) {
    assert.equal(text.split(replacement.from).length - 1, replacement.expectedOccurrences);
    text = text.replaceAll(replacement.from, replacement.to);
    exercise.changes.push("context");
  }
  for (const replacement of edits.figure_reference_replacements.filter(item => item.exercise === exercise.number)) {
    assert(text.includes(replacement.from));
    text = text.replace(replacement.from, replacement.to);
  }
  exercise.text = text;
  exercise.lines = text.split("\n");
  exercise.changes = text === exercise.source_text ? [] : [...new Set(["layout", ...exercise.changes])];
  const markers = exercise.lines.filter(line => /^[a-z]\)/u.test(line)).map(line => line[0]);
  assert.deepEqual(markers, [...latin.slice(0, markers.length)]);
  assert(!/\u3000|[\u0400-\u04ff]/u.test(text));
  if (markers.length) {
    assert(!/^[a-z]\)/u.test(exercise.lines[0]));
    assert.equal(exercise.lines.length, markers.length + 1);
  }
  partCounts.push({ number: exercise.number, subparts: markers.length, labels: markers });
}
save(`${working}/lesson.template.json`, lesson);
save(`${working}/exercises.template.json`, exercises);
fs.copyFileSync(`${prepared}/figures.template.json`, `${working}/figures.template.json`, fs.constants.COPYFILE_EXCL);
for (const name of ["lesson.template.json", "exercises.template.json", "figures.template.json"]) {
  fs.chmodSync(`${working}/${name}`, 0o644);
}
assert.equal(hash(`${working}/figures.template.json`), hash(`${prepared}/figures.template.json`));
save(`${author}/authoring-binding.json`, {
  selected: [id], inputs: ["lesson.template.json", "exercises.template.json", "figures.template.json"]
    .map(name => ({ path: `${prepared}/${name}`, sha256: hash(`${prepared}/${name}`) })),
  textEdits: { path: `${author}/text-edits.json`, sha256: hash(`${author}/text-edits.json`) },
  working, partCounts, figureEntriesUntouched: true, sourceImagesOpened: 0,
});
const command = ".claude/skills/ld-s10y-lesson/.venv/bin/python";
const args = [`${author}/verify-text.py`, "--normalize", working];
const log = `${author}/text-check-FIRST`;
const start = { cwd, command: [command, ...args], startedAt: new Date().toISOString() };
save(`${log}.start.json`, start);
const stdout = fs.openSync(`${log}.stdout`, "wx");
const stderr = fs.openSync(`${log}.stderr`, "wx");
const result = cp.spawnSync(command, args, {
  cwd, env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
  stdio: ["ignore", stdout, stderr],
});
fs.closeSync(stdout);
fs.closeSync(stderr);
save(`${log}.receipt.json`, { ...start, finishedAt: new Date().toISOString(), exit: result.status,
  signal: result.signal, error: result.error?.message ?? null,
  streams: ["stdout", "stderr"].map(name => ({ path: `${log}.${name}`, sha256: hash(`${log}.${name}`) })) });
console.log(fs.readFileSync(`${log}.stdout`, "utf8"));
console.error(fs.readFileSync(`${log}.stderr`, "utf8"));
process.exitCode = result.status ?? 1;
