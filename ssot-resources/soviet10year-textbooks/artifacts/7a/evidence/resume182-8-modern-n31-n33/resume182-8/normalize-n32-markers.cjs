const fs = require("node:fs");
const assert = require("node:assert/strict");
const cwd = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
assert.equal(process.cwd(), cwd);
const file = ".tmp/ld-s10y-lesson/adapt/7a/modern-us-neutral/lessons/alg7-c4-s1-n32/exercises.template.json";
const snapshot = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-8/n32-exercises-before-marker-normalization.json";
fs.copyFileSync(file, snapshot, fs.constants.COPYFILE_EXCL);
const document = JSON.parse(fs.readFileSync(file, "utf8"));
const source = structuredClone(document.source);
const labels = Object.fromEntries([..."абвгдежзикл"].map((letter, index) => [letter, String.fromCharCode(97 + index)]));
for (const exercise of document.exercises) {
  const replace = (text) => text.replace(/([абвгдежзикл])\)/g, (_, label) => `${labels[label]})`);
  const original = exercise.text;
  exercise.text = replace(exercise.text);
  exercise.lines = exercise.lines.map(replace);
  if (original !== exercise.text && !exercise.changes.includes("modernized")) exercise.changes.push("modernized");
}
assert.deepEqual(document.source, source);
fs.writeFileSync(file, `${JSON.stringify(document, null, 2)}\n`);
console.log("Modern marker codes only; original source snapshot unchanged.");
