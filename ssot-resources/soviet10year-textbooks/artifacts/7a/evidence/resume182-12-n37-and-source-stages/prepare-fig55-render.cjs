const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");

const cwd = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
assert.equal(process.cwd(), cwd);
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-12";
const draft = `${base}/n39-fig55-author/spec-draft.json`;
const templates = `${base}/n38-n39-modern-work/adapt/7a/modern-us-neutral/lessons/alg7-c4-s2-n39`;
const source = "ssot-resources/soviet10year-textbooks/artifacts/7a/figures/fig-55.png";
const output = `${base}/n39-fig55-render`;
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const ref = (file) => ({ path: file, sha256: hash(file) });
const spec = read(draft);
assert.equal(hash(draft), "b01fe1bb2357463fa957931cb70edb1e8d2143dbfd09e3676bf1cda5125c6079");
assert.equal(hash(source), spec.source.image.sha256);
assert.equal(hash(`${templates}/lesson.template.json`), "7bb0d75094540710884273718cb9f18d27f81f6611511837b3fc9c8b240b6fb9");
assert.equal(hash(`${templates}/exercises.template.json`), "e50a97986c1e4f115049e9ae5003c4ff5b658f3fb25ad8a83a4e3aa48c14d907");
const lesson = read(`${templates}/lesson.template.json`);
const exercises = read(`${templates}/exercises.template.json`);
assert(!lesson.prose.some((item) => item.figure_refs?.includes("fig-55")));
const referenced = exercises.exercises.filter((item) => item.figure_refs?.includes("fig-55"));
assert.equal(referenced.length, 1);
assert.equal(String(referenced[0].number), "819");
assert.equal(referenced[0].text, spec.source.authoritativeText[0].text);
spec.source.image.path = source;
spec.source.inventory.find((item) => item.id === "text").description =
  "Complete exercise 819 text bound to hash-verified frozen edition templates. " +
  "Only 819 references this figure; finalization must preserve this text before promotion.";
fs.mkdirSync(output, { recursive: true });
fs.writeFileSync(`${output}/spec-FIRST.json`, `${JSON.stringify(spec, null, 2)}\n`, { flag: "wx" });
fs.copyFileSync(`${output}/spec-FIRST.json`, `${output}/spec.json`, fs.constants.COPYFILE_EXCL);
fs.writeFileSync(`${output}/text-binding-FIRST.json`, `${JSON.stringify({
  source: ref(source),
  draft: ref(draft),
  spec: ref(`${output}/spec-FIRST.json`),
  templates: ["lesson.template.json", "exercises.template.json"].map((name) => ref(`${templates}/${name}`)),
  authoritativeText: spec.source.authoritativeText,
  draftGeometryUnchanged: true,
  finalizedEditionTextBinding: "pending-after-figure-gate",
  reason: "The edition finalizer requires approved figure outputs; frozen templates supply the actual edition text for rendering.",
  semanticApproval: false,
}, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ prepared: path.resolve(output), parentImageOpens: 0 }));
