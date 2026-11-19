import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";

const checkout = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
const owner = path.join(checkout, ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n41-answer-review");
const lessonBase = "ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/lessons/alg7-c4-s2-n41";
const figureBase = "ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/figures";
const scratch = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
const digest = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const readJson = file => JSON.parse(fs.readFileSync(file, "utf8"));
const writeOnce = (name, data) => fs.writeFileSync(path.join(owner, name), data, { flag: "wx", mode: 0o600 });
const writeJsonOnce = (name, data) => writeOnce(name, `${JSON.stringify(data, null, 2)}\n`);
const generated = ["source-snapshot.stage1.json", "validation.stage1.json", "hashes.stage1.json", "stage1-freeze.json", "checksums.stage1.sha256"];
for (const file of generated) assert(!fs.existsSync(path.join(owner, file)), `Write-once output already exists: ${file}`);

const expectedInputs = [
  [`${lessonBase}/lesson.json`, "8508778adfdc60948175c75548b30e0679dba9d7a8eb7d73da34ff375ef95099", "durable-lesson"],
  [`${lessonBase}/exercises.json`, "e006083b093bf4825130229a6e729311c37f9abe9fdab18c92d34d1da0431d37", "durable-exercises"],
  [`${lessonBase}/figures.json`, "e636955d8237544aa65e35f47b20c91bd07af960b74a084db27ed2bf5ec7d6be", "durable-figure-manifest"],
  ["ssot-resources/soviet10year-textbooks/artifacts/7a/figures/fig-56.png", "ef48757e77876673409fdc7a32efaad96ac64c92046c8b5583c4b78fca09b324", "original-fig56"],
  ["ssot-resources/soviet10year-textbooks/artifacts/7a/figures/fig-57.png", "27041b86de4e3b681a54d7d3ad916542199de60d4b769549ee9398636f7566e1", "original-fig57"],
  [`${figureBase}/fig-56.spec.json`, "eabfaaced5e0d48d4fbc81fb34acdce7ea11613f87149751b40eb1c292d9a250", "current-fig56-spec"],
  [`${figureBase}/fig-57.spec.json`, "9debf6ab689074ba3ec337472c9708671069ad5323d083ce3a961c7bdc2f0e67", "current-fig57-spec"],
  [`${figureBase}/fig-56.svg`, "9718696a477d11aa802b4bdcac08a501079dd7514587ef8eb0a0f04318041fb2", "current-fig56-svg-hash-only"],
  [`${figureBase}/fig-57.svg`, "1107af721f971376df6b19b53b2133596a06269b866144c10832bcb413966360", "current-fig57-svg-hash-only"],
  [`${scratch}/n41-n42-figure-author/fig-56/fig-56-width640-REPAIR-1.png`, "c33620eab37e416985daa2f33ed661ba1daf4a75d94dabceb28c5cbcec7aad4d", "current-fig56-preview"],
  [`${scratch}/n41-n42-figure-author/fig-57/fig-57-width640-ASSOCIATION-2.png`, "9a1f2205d05fcb6d02c19d40a4a611718e96ddacf05411e6e3694117a4d73f62", "current-fig57-preview"],
  [`${scratch}/n41-n42-figure-author/fig-56/preview-width640-REPAIR-1-receipt.json`, "c0eea3258be4f7650fc1c36e0d0fa12011c338937ddddc170794f2230b915a65", "fig56-preview-binding"],
  [`${scratch}/n41-n42-figure-author/fig-57/preview-width640-ASSOCIATION-2-receipt.json`, "1451df1a653ad1817f9af44ce057413698e4a74a249be3b987e2e66e567e0d1e", "fig57-preview-binding"],
  [`${scratch}/n41-table-cell-source/source-captures.json`, "a0c15b211b479ca85e23c235be11a12a162e77fe205a03b62b14a0a1dc3fd370", "source-only-root3-5-7-10-captures"],
  [`${scratch}/bradis-cell-review/capture-36.json`, "f7f2a7a1420a0c5d9448d47e3233707bb19dc9b394e6559f80b9e8e9b3e500bc", "existing-root2-capture-only"],
  [`${scratch}/bradis-tables-source-review/source-rules.corrected.json`, "41a84bf4ad20217b9eb056bdaebcf5417d5d72d08820119b63bbf05308611f46", "source-only-IV-rules"],
  [`${scratch}/bradis-method-rules/source-rules.json`, "a0f08bfe1b78099bd6489bc53fd869c4c215f16bf6ea7cf3787050080df1d05a", "source-only-main-entry-error-rule"]
];
const inputs = expectedInputs.map(([relative, expected, role]) => {
  const file = path.join(checkout, relative);
  const bytes = fs.readFileSync(file);
  assert.equal(digest(bytes), expected, `Input changed since independent observation: ${relative}`);
  return { path: file, sha256: expected, bytes: bytes.length, role };
});

const solutions = readJson(path.join(owner, "source-solutions.stage1.json"));
const observations = readJson(path.join(owner, "figure-observations.stage1.json"));
const exercises = readJson(path.join(checkout, lessonBase, "exercises.json"));
const tasks = solutions.exercises.flatMap(exercise => exercise.tasks);
assert.equal(solutions.exercises.length, 17);
assert.equal(tasks.length, 80);
assert.equal(new Set(tasks.map(task => task.id)).size, 80);
assert.deepEqual(solutions.exercises.map(exercise => exercise.exercise), exercises.exercises.map(exercise => exercise.number));
assert.equal(observations.actualImageLoadsAtThisCheckpoint, 4);
assert.equal(observations.observations.length, 2);
assert.equal(observations.modernComparison.length, 2);
for (const exercise of solutions.exercises) {
  assert.equal(exercise.grading, "ungraded");
  assert.equal(exercise.tasks.length, solutions.coverage.taskCounts[exercise.exercise]);
  for (const task of exercise.tasks) {
    for (const field of ["id", "label", "answer", "derivation", "domain"]) assert(task[field]?.length > 0, `${task.id} missing ${field}`);
  }
}
for (const [number, count] of Object.entries(solutions.coverage.taskCounts)) {
  if (["844", "845", "848", "849", "850"].includes(number)) continue;
  const source = exercises.exercises.find(exercise => exercise.number === number);
  const labels = [...source.text.matchAll(/^([a-z])\)/gm)].map(match => `${number}.${match[1]}`);
  assert.equal(labels.length, count);
  assert.deepEqual(tasks.filter(task => task.id.startsWith(`${number}.`)).map(task => task.id), labels);
}
const cells = new Map(solutions.tableEvidence.cells.map(cell => [cell.id, cell]));
const lookupTasks = tasks.filter(task => task.table);
assert.equal(lookupTasks.length, 12);
assert.deepEqual(lookupTasks.map(task => task.id), solutions.coverage.tableTasks);
for (const task of lookupTasks) {
  const table = task.table;
  assert.equal(table.lookupAndArithmeticCompleted, true);
  assert.equal(table.cells.length, table.coefficients.length);
  let result = table.exactConstant * 1000;
  for (let i = 0; i < table.cells.length; i++) {
    const cell = cells.get(table.cells[i]);
    assert(cell, `Missing literal source cell ${table.cells[i]}`);
    const decimal = cell.decimalValue.split(".");
    const thousandths = Number(decimal[0]) * 1000 + Number(decimal[1]);
    result += table.coefficients[i] * thousandths;
  }
  assert.equal(Math.round(Number(table.approximation) * 1000), result, `${task.id} table arithmetic`);
  const bound = table.coefficients.reduce((total, value) => total + Math.abs(value), 0) * 0.0005;
  assert(Math.abs(Number(table.absoluteErrorBound) - bound) < 1e-12, `${task.id} error bound`);
}
assert.equal(tasks.filter(task => task.graph).length, 5);
assert.equal(tasks.filter(task => task.extremum).length, 6);
assert.equal(tasks.filter(task => task.cases).length, 2);
assert(tasks.filter(task => task.cases).every(task => task.cases.length === 4));

const sourcePacket = readJson(path.join(checkout, scratch, "n41-table-cell-source/source-captures.json"));
const root2Page = readJson(path.join(checkout, scratch, "bradis-cell-review/capture-36.json"));
const root2 = root2Page.records_in_request_address_order.find(record => record.id === "r2");
assert.equal(root2.main.printed, "1,414");
assert.deepEqual(sourcePacket.distinctCells.map(cell => cell.mainCellExact), ["1,732", "2,236", "2,646", "3,162"]);
const ivRules = readJson(path.join(checkout, scratch, "bradis-tables-source-review/source-rules.corrected.json")).tables.find(table => table.id === "IV");
const mainRule = readJson(path.join(checkout, scratch, "bradis-method-rules/source-rules.json")).rules.find(rule => rule.id === "I-main-entry-error");
const validation = {
  schema: "stemrobin182/n41-answer-stage1-validation@1",
  status: "PASS_SOURCE_SOLUTION_COMPLETENESS_ONLY",
  exerciseCount: 17,
  mathematicalTaskCount: 80,
  uniqueTaskCount: 80,
  tableTaskCount: 12,
  literalSourceCells: 5,
  tableArithmetic: "All twelve matched using exact integer thousandths.",
  graphTaskCount: 5,
  extremaTaskCount: 6,
  exhaustiveFormulaCaseSplits: 2,
  imageLoads: 4,
  imageReopens: 0,
  inputHashesVerified: inputs.length,
  noAuthorKeyComparison: true,
  noFinalizerPublicationOrProductApproval: true,
  checkingLimits: "Structured completeness and exact decimal arithmetic checks do not replace the reviewer's written algebra/proofs or first-hand figure observations."
};
writeJsonOnce("source-snapshot.stage1.json", {
  schema: "stemrobin182/n41-answer-source-snapshot@1",
  capturedAtUtc: new Date().toISOString(),
  inputs,
  lesson: readJson(path.join(checkout, lessonBase, "lesson.json")),
  exercises,
  figures: readJson(path.join(checkout, lessonBase, "figures.json")),
  figureSpecs: [56, 57].map(number => readJson(path.join(checkout, figureBase, `fig-${number}.spec.json`))),
  previewReceipts: [observations.modernComparison[0].receiptPath, observations.modernComparison[1].receiptPath].map(readJson),
  sourceOnlyTableEvidenceProjection: {
    distinctCells: sourcePacket.distinctCells,
    root2: { pdfImage: root2Page.pdf_image, printedPage: root2Page.printed_page, table: root2Page.table, record: root2 },
    tableIVRules: ivRules,
    mainEntryErrorRule: mainRule,
    projectionPolicy: "No author answer package; root2 only from the existing independent page record; no other lesson method/answer summaries copied."
  },
  imageBytesCopiedOrReopened: false
});
writeJsonOnce("validation.stage1.json", validation);
const payloadNames = ["source-solutions.stage1.json", "source-snapshot.stage1.json", "figure-observations.stage1.json", "validation.stage1.json", "freeze-stage1.mjs"];
const payloads = payloadNames.map(name => {
  const bytes = fs.readFileSync(path.join(owner, name));
  return { name, path: path.join(owner, name), sha256: digest(bytes), bytes: bytes.length, freezeMode: "0444" };
});
writeJsonOnce("hashes.stage1.json", {
  schema: "stemrobin182/n41-answer-stage1-hashes@1",
  algorithm: "sha256",
  inputs,
  artifacts: payloads,
  frozenBeforeAnyAuthorKeyDisclosure: true
});
const manifestHash = digest(fs.readFileSync(path.join(owner, "hashes.stage1.json")));
writeJsonOnce("stage1-freeze.json", {
  schema: "stemrobin182/n41-answer-stage1-freeze@1",
  ticket: "STEMROBIN-182",
  lesson: "alg7-c4-s2-n41",
  stage: 1,
  frozenAtUtc: new Date().toISOString(),
  owner,
  status: "FROZEN_AWAITING_N41_ANSWER_KEYS",
  writeOnce: true,
  mode: "0444",
  sourceSolutions: payloads.find(item => item.name === "source-solutions.stage1.json"),
  sourceSnapshot: payloads.find(item => item.name === "source-snapshot.stage1.json"),
  figureObservations: payloads.find(item => item.name === "figure-observations.stage1.json"),
  hashManifest: { path: path.join(owner, "hashes.stage1.json"), sha256: manifestHash },
  coverage: { originals: 17, mathematicalTasks: 80, tableTasks: 12, graphTasks: 5, extrema: 6 },
  independence: solutions.independence,
  imageLoads: 4,
  furtherImageLoads: 0,
  nextN41Action: "Stop before keys. Only a later explicit disclosure may start answer comparison.",
  queuedSeparateWork: "After this freeze, n40 affected Stage2 RECOVERY-BINDING view-only review is authorized; n40 FIRST17 artifacts remain unchanged.",
  precisionLimitations: solutions.tableEvidence.precisionLimitations
});
const checksumNames = [...payloadNames, "hashes.stage1.json", "stage1-freeze.json"];
writeOnce("checksums.stage1.sha256", checksumNames.map(name => `${digest(fs.readFileSync(path.join(owner, name)))}  ${name}\n`).join(""));
for (const input of inputs) assert.equal(digest(fs.readFileSync(input.path)), input.sha256, `Input changed during freezing: ${input.path}`);
for (const name of [...checksumNames, "checksums.stage1.sha256"]) fs.chmodSync(path.join(owner, name), 0o444);
for (const name of [...checksumNames, "checksums.stage1.sha256"]) assert.equal(fs.statSync(path.join(owner, name)).mode & 0o777, 0o444);
for (const item of payloads) assert.equal(digest(fs.readFileSync(item.path)), item.sha256);
console.log(JSON.stringify({
  status: "FROZEN_0444",
  ...validation,
  sourceSolutionsPath: path.join(owner, "source-solutions.stage1.json"),
  sourceSolutionsSha256: payloads.find(item => item.name === "source-solutions.stage1.json").sha256,
  receiptPath: path.join(owner, "stage1-freeze.json"),
  receiptSha256: digest(fs.readFileSync(path.join(owner, "stage1-freeze.json"))),
  hashManifestSha256: manifestHash,
  allFrozenFileModes: "0444"
}, null, 2));
