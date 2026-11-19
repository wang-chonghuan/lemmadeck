const fs = require("node:fs");
const cp = require("node:child_process");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
const cwd = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
assert.equal(process.cwd(), cwd);
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-11";
const work = ".tmp/ld-s10y-lesson/adapt/7a/modern-us-neutral/lessons/alg7-c4-s1-n34";
const durable = "ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/lessons/alg7-c4-s1-n34";
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const hash = (p) => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const save = (p, v) => fs.writeFileSync(p, JSON.stringify(v, null, 2) + "\n");
const lesson = read(`${work}/lesson.template.json`);
const exercises = read(`${work}/exercises.template.json`);
fs.mkdirSync(`${base}/n34-layout-before`, { recursive: true });
for (const name of ["lesson", "exercises"]) {
  fs.copyFileSync(`${work}/${name}.template.json`, `${base}/n34-layout-before/${name}.json`, fs.constants.COPYFILE_EXCL);
}
assert(lesson.prose[17].text.endsWith("*"));
lesson.prose[17].text = lesson.prose[17].text.slice(0, -1);
lesson.prose[23].text = lesson.prose[23].text.replace("****", "");
for (const i of [17, 23]) {
  if (!lesson.prose[i].changes.includes("layout")) lesson.prose[i].changes.push("layout");
}
const labels = new Map([..."абвгдежзийклмнопрстуфхцчшщэюя"].map((letter, i) => [letter, String.fromCharCode(97 + i)]));
for (const exercise of exercises.exercises) {
  const old = exercise.text;
  exercise.text = old.replace(/([абвгдежзийклмнопрстуфхцчшщэюя])\)/g, (_, label) => `${labels.get(label)})`);
  exercise.lines = exercise.text.split("\n");
  if (exercise.text !== old && !exercise.changes.includes("subitem-label")) exercise.changes.push("subitem-label");
}
save(`${work}/lesson.template.json`, lesson);
save(`${work}/exercises.template.json`, exercises);
const stage = cp.spawnSync("node", [`${base}/run-stage.cjs`, "n34-prose-flow-FIRST",
  "node", ".claude/skills/ld-s10y-lesson/tools/prose_flow.mjs", "--json",
  `${work}/lesson.template.json`], { cwd, encoding: "utf8" });
process.stdout.write(stage.stdout || "");
process.stderr.write(stage.stderr || "");
assert.equal(stage.status, 0);
const flow = read(`${base}/stages/n34-prose-flow-FIRST.stdout`);
const starts = [
  "我们来看另一个例子.",
  "下面我们举几个我们熟悉的函数的例子",
  "例2 在图50",
  "例3 在图51",
];
lesson.section_breaks = starts.map((prefix) => {
  const matches = flow.paragraphs.filter((p) => p.text.startsWith(prefix));
  assert.equal(matches.length, 1, prefix);
  const index = matches[0].index;
  return { before: flow.paragraphs[index - 1].text, after: flow.paragraphs[index].text };
});
save(`${work}/lesson.template.json`, lesson);
for (const [name, value] of [["lesson", lesson], ["exercises", exercises]]) {
  save(`${durable}/${name}.json`, value);
}
save(`${base}/n34-modern-text-complete.json`, {
  proseBlocks: lesson.prose.length, exercises: exercises.count,
  textChanges: "Modern subitem labels, emphasis markup and exact prose-flow section boundaries only; three registered corrections retained.",
  sourceSnapshotsUnchanged: true,
  sectionBreaks: lesson.section_breaks,
  outputs: ["lesson", "exercises"].map((name) => ({
    path: `${durable}/${name}.json`, sha256: hash(`${durable}/${name}.json`),
  })),
  imagesOpened: 0, finalized: false,
});
