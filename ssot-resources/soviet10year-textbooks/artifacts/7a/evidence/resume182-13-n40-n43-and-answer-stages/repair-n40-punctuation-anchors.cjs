const fs = require("node:fs");
const cp = require("node:child_process");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
const file = `${base}/n40-adapt-work-affected/adapt/7a/modern-us-neutral/lessons/alg7-c4-s2-n40/lesson.template.json`;
const read = name => JSON.parse(fs.readFileSync(name, "utf8"));
const sha = name => crypto.createHash("sha256").update(fs.readFileSync(name)).digest("hex");
const first = read(`${file}.finalize-FIRST.json`);
const current = read(file);
const flowFirst = read(`${base}/n40-modern-review/prose-flow-FIRST.json`);
const expected = structuredClone(first);
expected.prose[3].text = expected.prose[3].text.replace("因数4。", "因数4.");
expected.prose[6].text = expected.prose[6].text.replace("因数5。", "因数5.");
assert.deepEqual(current, expected);
assert.deepEqual(read(`${file}.finalize-RECOVERY1.json`), current);
const flow = read(`${base}/n40-punctuation-prose-flow.json`);
assert.equal(flow.paragraphs.length, flowFirst.paragraphs.length);
const normalize = text => {
  let value = text.replace(/因数([45])。/g, "因数$1.");
  for (const erratum of first.errata) {
    value = value.replace(erratum.original, erratum.corrected);
  }
  return value;
};
flow.paragraphs.forEach((paragraph, index) => {
  assert.equal(paragraph.text, normalize(flowFirst.paragraphs[index].text));
});
current.section_breaks = flowFirst.resolvedBreaks.map(index => ({
  before: flow.paragraphs[index - 1].text,
  after: flow.paragraphs[index].text,
}));
fs.writeFileSync(file, `${JSON.stringify(current, null, 2)}\n`);
fs.writeFileSync(`${base}/n40-punctuation-repair.json`, `${JSON.stringify({
  first: { path: `${file}.finalize-FIRST.json`, sha256: sha(`${file}.finalize-FIRST.json`) },
  current: { path: file, sha256: sha(file) },
  changes: ["prose[3] restores source ASCII terminator", "prose[6] restores source ASCII terminator", "two affected prose_flow anchors"],
  mathematicsUnchanged: true,
  sourceErratumUnchanged: true,
  boundaryIndicesUnchanged: flowFirst.resolvedBreaks,
  imagesOpened: 0,
}, null, 2)}\n`, { flag: "wx" });
