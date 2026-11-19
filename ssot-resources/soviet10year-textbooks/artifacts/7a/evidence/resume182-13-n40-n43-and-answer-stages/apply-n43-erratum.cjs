const fs = require("node:fs");
const cp = require("node:child_process");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
const id = "alg7-c4-s3-n43";
const original = `${base}/n41-n43-adapt-work/adapt/7a/modern-us-neutral/lessons/${id}`;
const target = `${base}/n43-adapt-work-affected/adapt/7a/modern-us-neutral/lessons/${id}`;
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const sha = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const ref = file => ({ path: file, sha256: sha(file) });
const prescription = read(`${base}/n41-n43-modern-review/prescribed-erratum.json`);
const prepared = read(`${target}/lesson.template.json`);
const authored = read(`${original}/lesson.template.json`);
assert.equal(prepared.errata.length, 1);
assert.equal(prepared.errata[0].id, "p0256-math-1");
assert.equal(prepared.errata[0].target, "lesson.prose[15]");
assert.equal(prepared.errata[0].original, prescription.modern_correction.original);
assert.equal(authored.prose[15].text.split(prepared.errata[0].original).length, 2);
const lesson = structuredClone(authored);
lesson.errata = structuredClone(prepared.errata);
lesson.errata[0].corrected = prescription.modern_correction.corrected;
lesson.prose[15].text = lesson.prose[15].text.replace(
  prescription.modern_correction.original, prescription.modern_correction.corrected);
lesson.prose[15].changes.push("math-correction");
assert(lesson.prose[3].text.includes("是 3。"));
assert(lesson.prose[25].text.includes("根 9。"));
lesson.prose[3].text = lesson.prose[3].text.replace("是 3。", "是 3.");
lesson.prose[25].text = lesson.prose[25].text.replace("根 9。", "根 9.");
const previousFlow = read(`${base}/n43-modern-author/prose-flow-affected1.json`);
const unanchored = structuredClone(lesson);
unanchored.section_breaks = [];
const result = cp.spawnSync("node", [
  ".claude/skills/ld-s10y-lesson/tools/prose_flow.mjs", "--stdin",
], { input: JSON.stringify(unanchored), encoding: "utf8" });
assert.equal(result.status, 0, result.stderr);
fs.writeFileSync(`${base}/n43-affected-prose-flow.json`, result.stdout, { flag: "wx" });
const flow = JSON.parse(result.stdout);
assert.equal(flow.paragraphs.length, previousFlow.paragraphs.length);
lesson.section_breaks = previousFlow.resolvedBreaks.map(index => ({
  before: flow.paragraphs[index - 1].text,
  after: flow.paragraphs[index].text,
}));
const exercises = read(`${original}/exercises.template.json`);
const exercise = exercises.exercises.find(item => item.number === "857");
assert(exercise.text.includes("等于 1。"));
exercise.text = exercise.text.replace("等于 1。", "等于 1.");
exercise.lines = exercise.lines.map(line => line.replace("等于 1。", "等于 1."));
const figures = read(`${original}/figures.template.json`);
for (const [name, data] of [["lesson", lesson], ["exercises", exercises], ["figures", figures]]) {
  const file = `${target}/${name}.template.json`;
  fs.copyFileSync(file, `${file}.prepared-FIRST.json`, fs.constants.COPYFILE_EXCL);
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}
fs.writeFileSync(`${base}/n43-erratum-application.json`, `${JSON.stringify({
  prescription: ref(`${base}/n41-n43-modern-review/prescribed-erratum.json`),
  templates: ["lesson", "exercises", "figures"].map(name => ref(`${target}/${name}.template.json`)),
  sourceErratum: lesson.errata[0], formulasChanged: false,
  restoredSourceTerminators: ["prose[3] 3.", "prose[25] 9.", "exercise857 1."],
  affectedAnchor: "unchanged semantic boundary after prose[25], source ASCII terminator restored",
  originalTemplateEvidenceUnchanged: true, imagesOpened: 0, fullLessonCredit: false,
}, null, 2)}\n`, { flag: "wx" });
