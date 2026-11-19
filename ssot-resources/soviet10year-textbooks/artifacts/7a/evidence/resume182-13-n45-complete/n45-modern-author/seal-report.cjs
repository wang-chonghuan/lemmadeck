const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
const cwd = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
assert.equal(process.cwd(), cwd);
const base = `${cwd}/.intentfold/tickets/STEMROBIN-182/tmp/resume182-13`;
const author = `${base}/n45-modern-author`;
const id = "alg7-c4-s3-n45";
const final = `${author}/FINAL/${id}`;
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const hash = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const ref = file => ({ path: file, sha256: hash(file), bytes: fs.statSync(file).size });
const save = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
const math = /(\$\$[\s\S]+?\$\$|\$[^$]+?\$)/u;
const labels = "абвгдежзиклмнопрстуфхцчшщэюя";
function canonical(text) {
  return text.split(math).map((part, index) => index % 2 ? part : part
    .replaceAll("女打字员", "打字员")
    .replace(/[а-яё]/gu, label => "abcdefghijklmnopqrstuvwxyz"[labels.indexOf(label)])
    .replace(/[\s.,，、;；。?!？！:：]/gu, "")).join("");
}
const lesson = read(`${final}/lesson.template.json`);
const exercises = read(`${final}/exercises.template.json`);
const equivalence = [];
for (const [index, block] of lesson.prose.entries()) {
  assert.equal(canonical(block.source_text), canonical(block.text), `Source prose loss: ${index}`);
  equivalence.push({ target: `prose[${index}]`, refs: block.source_refs, sourceProseComplete: true,
    permittedDifferences: ["layout", "sentence punctuation"] });
}
for (const item of exercises.exercises) {
  assert.equal(canonical(item.source_text), canonical(item.text), `Source task loss: ${item.number}`);
  equivalence.push({ target: `exercise[${item.number}]`, refs: item.pages, sourceTaskAndConditionsComplete: true,
    permittedDifferences: ["layout", "sentence punctuation", "Latin labels",
      ...(item.number === "885" ? ["gender-neutral worker wording"] : [])] });
}
save(`${author}/source-prose-equivalence.json`, {
  selected: [id], sourceProseAndTaskWordingRetained: true,
  exactMathCheckedSeparately: ref(`${author}/text-preservation.json`), rows: equivalence,
});
const figures = read(`${final}/figures.template.json`).figures;
const handoff = figures.map(item => {
  const page = item.id === "fig-59" ? "0267" : "0273";
  const crop = `${cwd}/.tmp/ld-s10y-lesson/7a/pages/${page}/figures/${item.id}.png`;
  const raw = `${base}/n45-source-stage/artifacts/7a/${item.source.png.path}`;
  assert(fs.statSync(crop).isFile());
  assert(fs.statSync(raw).isFile());
  return { id: item.id, sourceRef: item.id === "fig-59" ? "p0267#5" : item.id === "fig-60" ? "p0273#4" : "p0273#9",
    owner: item.id === "fig-59" ? "prose" : item.id === "fig-60" ? "exercise 889" : "exercise 891",
    actualRawPNG: raw, existingPageCrop: crop, recordedPNGHash: item.source.png.sha256,
    preparedEntryUnchanged: true, imageOpened: false, geometryAuthored: false };
});
save(`${author}/raw-figure-handoff.json`, {
  selected: [id], modernFigureAuthorIsSeparate: true, figures: handoff,
  figuresTemplate: ref(`${final}/figures.template.json`), imageOpens: 0,
});

const originalEdits = `${author}/text-edits-FIRST.reconstructed.json`;
const currentBytes = fs.readFileSync(`${author}/text-edits.json`, "utf8");
const firstBytes = currentBytes.replace(
  '"3": "解二次方程后，求出它的根是 2 和 6.",',
  '"3": "解二次方程后，求出它的根是 2 和 6。",',
);
assert.notEqual(currentBytes, firstBytes);
fs.writeFileSync(originalEdits, firstBytes, { flag: "wx" });
const historical = read(`${author}/authoring-binding.json`);
assert.equal(hash(originalEdits), historical.textEdits.sha256);
save(`${author}/text-edits-recovery-binding.json`, {
  firstAuthoringBinding: ref(`${author}/authoring-binding.json`),
  firstEdits: { ...ref(originalEdits), reconstructedFromSingleRecordedPunctuationDifference: true,
    exactHashMatchesOriginalAttempt: true },
  correctedEdits: ref(`${author}/text-edits.json`),
  firstCandidateFailureReceipt: ref(`${author}/text-check-FIRST.receipt.json`),
  recoveryReceipt: ref(`${author}/text-check-RECOVERY1.receipt.json`),
  authoredTemplatesRerun: false,
});
const inputs = read(`${base}/n45-source-stage/inputs.json`).inputs;
for (const item of inputs) {
  assert.equal(hash(item.source.path), item.source.sha256);
  assert.equal(hash(item.isolated.path), item.isolated.sha256);
}
const evidence = [];
for (const directory of [`${base}/n45-source-stage`, `${base}/n45-adapt-work`, author]) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (!entry.isFile() || entry.name.endsWith(".cjs") || entry.name.endsWith(".py")) continue;
    const file = path.join(directory, entry.name);
    fs.chmodSync(file, 0o444);
    evidence.push(ref(file));
  }
}
for (const entry of fs.readdirSync(final)) {
  const file = path.join(final, entry);
  assert.equal(fs.statSync(file).mode & 0o777, 0o444);
  evidence.push(ref(file));
}
for (const name of ["lesson.template.json", "exercises.template.json", "figures.template.json"]) {
  const file = `${author}/WORKING/${id}/${name}`;
  assert.equal(fs.statSync(file).mode & 0o777, 0o644);
  assert.equal(hash(file), hash(`${final}/${name}`));
}
const binding = read(`${author}/final-binding.json`);
for (const item of binding.outputs) assert.equal(hash(item.final.path), item.final.sha256);
save(`${author}/freeze.json`, {
  schema: "stemrobin182/n45-text-freeze@1", cwd, frozenAt: new Date().toISOString(),
  selected: [id], finalMode: "0444", workingMode: "0644", sourcePageTripletsUnchanged: true,
  evidence, ownedWriteRoots: ["n45-source-stage", "n45-adapt-work", "n45-modern-author"].map(name => `${base}/${name}`),
  noDurableWrites: true, noImagesOpened: true, noPublication: true,
});
fs.chmodSync(`${author}/freeze.json`, 0o444);
console.log(JSON.stringify({ report: ref(`${author}/report.md`), freeze: ref(`${author}/freeze.json`),
  final, working: `${author}/WORKING/${id}`, sourcePagesUnchanged: true,
  proseAndTaskEquivalence: true, figureEntriesUnchanged: true, imagesOpened: 0 }, null, 2));
