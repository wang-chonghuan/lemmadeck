const fs = require("node:fs");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
const suffix = "adapt/7a/modern-us-neutral/lessons/alg7-c4-s2-n40";
const oldDir = `${base}/n40-adapt-work/${suffix}`;
const newDir = `${base}/n40-adapt-work-affected/${suffix}`;
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const hash = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const record = read(`${base}/n40-modern-review/erratum-prescription-FIRST.json`);
const prepared = read(`${newDir}/lesson.template.json`);
const authored = read(`${oldDir}/lesson.template.json`);
assert.equal(prepared.source.sha256, authored.source.sha256);
assert.equal(prepared.errata.length, 1);
assert.equal(prepared.errata[0].original, record.original);
assert.equal(prepared.errata[0].target, "lesson.prose[18]");
const merged = { ...authored, source: prepared.source, errata: prepared.errata };
assert.deepEqual(merged.prose[18].source_refs, ["p0243#9"]);
assert.equal(merged.prose[18].text.split(record.original).length, 2);
merged.errata[0].corrected = record.corrected;
merged.prose[18].text = merged.prose[18].text.replace(record.original, record.corrected);
merged.prose[18].changes = [...new Set([...merged.prose[18].changes, "math-correction"])];
for (const name of ["lesson", "exercises", "figures"]) {
  const file = `${newDir}/${name}.template.json`;
  fs.copyFileSync(file, `${file}.prepared-FIRST.json`, fs.constants.COPYFILE_EXCL);
  if (name === "lesson") {
    fs.writeFileSync(file, JSON.stringify(merged, null, 2) + "\n");
  } else {
    assert.deepEqual(read(file).source, read(`${oldDir}/${name}.template.json`).source);
    fs.copyFileSync(`${oldDir}/${name}.template.json`, file);
  }
}
fs.writeFileSync(`${base}/n40-erratum-application.json`, JSON.stringify({
  sourcePrescription: {
    path: `${base}/n40-modern-review/erratum-prescription-FIRST.json`,
    sha256: hash(`${base}/n40-modern-review/erratum-prescription-FIRST.json`),
  },
  sourceMetadataDerivedByPrepare: true,
  correctedProse: 18, priorAuthorAndFirstReviewPreserved: true,
  unchangedProseBlocks: 18, exercisesUnchanged: true,
  sectionBoundariesUnchanged: true,
  templates: ["lesson", "exercises", "figures"].map(name => ({
    path: `${newDir}/${name}.template.json`,
    sha256: hash(`${newDir}/${name}.template.json`),
  })),
}, null, 2) + "\n", { flag: "wx" });
