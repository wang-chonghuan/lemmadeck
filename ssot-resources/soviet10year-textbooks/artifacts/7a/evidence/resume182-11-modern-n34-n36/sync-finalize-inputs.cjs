const fs = require("node:fs");
const cp = require("node:child_process");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const cwd = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
assert.equal(process.cwd(), cwd);
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-11";
const [name, lesson] = process.argv.slice(2);
const scratch = `.tmp/ld-s10y-lesson/adapt/7a/modern-us-neutral/lessons/${lesson}`;
const durable = `ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/lessons/${lesson}`;
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const hash = (p) => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const evidence = `${base}/${name}-finalize-inputs-before`;
fs.mkdirSync(evidence, { recursive: true });
for (const file of ["lesson.template.json", "exercises.template.json", "figures.template.json"]) {
  if (fs.existsSync(`${evidence}/${file}`)) {
    assert.equal(hash(`${scratch}/${file}`), hash(`${evidence}/${file}`));
  } else {
    fs.copyFileSync(`${scratch}/${file}`, `${evidence}/${file}`, fs.constants.COPYFILE_EXCL);
  }
}
if (fs.existsSync(`${durable}/adaptation.audit.json`)) {
  fs.copyFileSync(`${durable}/adaptation.audit.json`, `${evidence}/adaptation.audit.json`);
}
const original = read(`${scratch}/lesson.template.json`);
const normalized = cp.spawnSync(".claude/skills/ld-s10y-lesson/.venv/bin/python", [
  "-B", "-c",
  "import json,sys;sys.path.insert(0,'.claude/skills/ld-s10y-lesson/tools');import edition;d=json.load(sys.stdin);edition.normalize_lesson_layout(d);print(json.dumps(d,ensure_ascii=False))",
], { cwd, input: JSON.stringify(original), encoding: "utf8" });
assert.equal(normalized.status, 0, normalized.stderr);
const candidate = JSON.parse(normalized.stdout);
assert.deepEqual(candidate.source, original.source);
const { proseFlow } = require(`${cwd}/.claude/skills/ld-s10y-lesson/tools/htmlfrag.js`);
const finalFlow = proseFlow(candidate.prose, []).filter((b) => !["fig", "cap"].includes(b.kind));
const compact = (text) => text.replace(/\s/g, "");
candidate.section_breaks = original.section_breaks.map((boundary) => {
  const matches = finalFlow.map((b, i) => i > 0 &&
    compact(boundary.before).endsWith(compact(finalFlow[i - 1].text)) &&
    (compact(boundary.after).startsWith(compact(b.text)) ||
      compact(b.text).startsWith(compact(boundary.after))) ? i : -1).filter((i) => i > 0);
  assert.equal(matches.length, 1, "Boundary must retain exactly one conceptual transition");
  const index = matches[0];
  return { before: finalFlow[index - 1].text, after: finalFlow[index].text };
});
proseFlow(candidate.prose, candidate.section_breaks);
fs.writeFileSync(`${scratch}/lesson.template.json`, `${JSON.stringify(candidate, null, 2)}\n`);
const figures = read(`${durable}/figures.json`);
for (const figure of figures.figures) {
  assert(figure.svg && figure.render && figure.review && figure.spec);
}
fs.writeFileSync(`${scratch}/figures.template.json`, `${JSON.stringify(figures, null, 2)}\n`);
fs.writeFileSync(`${base}/${name}-finalize-input-sync.json`, `${JSON.stringify({
  lesson, imagesOpened: 0, sourceUnchanged: true,
  normalizedProseOnly: true, sectionBoundaries: candidate.section_breaks,
  beforeLessonSha256: hash(`${evidence}/lesson.template.json`),
  afterLessonSha256: hash(`${scratch}/lesson.template.json`),
  figureManifestSha256: hash(`${scratch}/figures.template.json`),
}, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ lesson, paragraphs: finalFlow.length, boundaries: candidate.section_breaks.length }));
