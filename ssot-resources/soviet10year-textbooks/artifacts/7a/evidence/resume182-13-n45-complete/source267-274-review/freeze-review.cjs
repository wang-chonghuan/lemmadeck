const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");

const root = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
const own = path.join(root, ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13/source267-274-review");
const author = path.join(path.dirname(own), "source267-274-author");
const stages = path.join(path.dirname(own), "stages");
assert.equal(process.cwd(), root);
assert.equal(__dirname, own);
assert.equal(execFileSync("git", ["branch", "--show-current"], { encoding: "utf8" }).trim(),
  "codex/STEMROBIN-182-textbooks");
const inputs = new Map();

function bind(file) {
  const bytes = fs.readFileSync(file);
  const stat = fs.statSync(file);
  const result = {
    path: file,
    sha256: crypto.createHash("sha256").update(bytes).digest("hex"),
    bytes: bytes.length,
    mode: (stat.mode & 0o777).toString(8).padStart(4, "0"),
  };
  inputs.set(file, result);
  return result;
}

function readJSON(file) {
  bind(file);
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJSON(name, value) {
  const file = path.join(own, name);
  assert.equal(path.dirname(file), own);
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
}

function body(markdown) {
  const parts = markdown.split(/^---\s*$/m);
  assert.ok(parts.length >= 3);
  return parts.slice(2).join("---")
    .replace(/^!\[[^\n]*\n/gm, "")
    .replace(/box [0-9,]+/g, "box BBOX");
}

const ledger = JSON.parse(fs.readFileSync(path.join(own, "image-ledger.json"), "utf8"));
assert.equal(ledger.images.length, 8);
for (const image of ledger.images) assert.equal(bind(image.path).sha256, image.sha256);
const freezePath = path.join(author, "outputs-freeze.json");
const authorFreeze = readJSON(freezePath);
const authorSnapshotChecks = authorFreeze.files
  .filter(item => item.path.startsWith(`${author}/`))
  .map(item => {
    const current = bind(item.path);
    assert.equal(current.sha256, item.sha256);
    assert.equal(current.mode, "0444");
    return { ...current, matchesAuthorFreeze: true };
  });

const pages = [];
const exerciseStarts = [];
const observed = [25, 22, 24, 16, 27, 24, 20, 20];
const expectedMD = [
  "fac9cef0429a4513dbee91a3b2ed1b1de06e377a5e58c4cc56c5fb454b59b64e",
  "bf882e1b2c0247f41aa3c2c7c945bb3039e871580dfe37f31b633db4a942e75f",
  "bd266b97bbfed5f00b69bb4ff0efb0b43c2143686d6b04407c62f39c8ec0c066",
  "bc6f0c04b446023e8bbdd8e63ca910188007e60fbc59a445d296834efff1d74a",
  "1bd6d653e9d0d30e48962fb27e28dfb0080870010d0a0b65d3742459a001d3b9",
  "208892bbea5d9aab248ea36a1f65b60d33425ab6f5ff452e22814ccb3ed5ce89",
  "38e6b3dd343afe108f77845d2eec5d6ddbce47b0eb5090c61d9648d24b0370f1",
  "1d61b169f32001b3698b1c26c83b3f2cad5a420d19e0b6116ddcb632a46457e3",
];
// Bind the actual reviewed bytes, including the known failed audit, without running producers.
for (let n = 267; n <= 274; n += 1) {
  const id = String(n).padStart(4, "0");
  const dir = path.join(root, `ssot-resources/soviet10year-textbooks/artifacts/7a/pages/${id}`);
  const md = bind(path.join(dir, "page.md"));
  assert.equal(md.sha256, expectedMD[n - 267]);
  const page = readJSON(path.join(dir, "page.json"));
  const audit = readJSON(path.join(dir, "audit.json"));
  const currentMD = fs.readFileSync(md.path, "utf8");
  const markdownMeta = JSON.parse(currentMD.split(/^---\s*$/m)[1]);
  assert.deepEqual(markdownMeta, page.meta);
  assert.equal(audit.lines_md, observed[n - 267]);
  assert.equal(audit.lines_printed, n === 274 ? 21 : observed[n - 267]);
  assert.equal(audit.errors.length, n === 274 ? 1 : 0);
  for (const [index, block] of page.blocks.entries()) {
    for (const line of block.lines) assert.ok(currentMD.includes(line));
    if (block.kind === "ex" && !block.cont) {
      exerciseStarts.push({ number: Number(block.label), ref: `p${id}#${index + 1}` });
    }
  }
  const recoveryMDPath = path.join(author, `execution-recovery1/${id}/page.md`);
  const recoveryMD = bind(recoveryMDPath);
  const sameBody = body(currentMD) === body(fs.readFileSync(recoveryMDPath, "utf8"));
  assert.ok(sameBody);
  const exactReused = ![267, 273].includes(n);
  if (exactReused) {
    for (const file of ["page.md", "page.json", "audit.json"]) {
      assert.equal(bind(path.join(dir, file)).sha256,
        bind(path.join(author, `execution-recovery1/${id}/${file}`)).sha256);
    }
  }
  pages.push({
    page: n,
    printed: page.meta.printed_page,
    independentPhysicalRows: observed[n - 267],
    files: ["page.md", "page.json", "audit.json"].map(file => inputs.get(path.join(dir, file))),
    sameBodyAsRecovery1IgnoringOnlyFrontmatterFigureLinksAndBBoxNumbers: sameBody,
    exactRecovery1FilesReused: exactReused,
    recovery1Markdown: recoveryMD,
    blocks: page.blocks.map((block, i) => ({
      ref: `p${id}#${i + 1}`,
      kind: block.kind,
      label: block.label,
      owner_exercise: block.owner_exercise,
      open: block.open,
      cont: block.cont,
      samerow: block.samerow,
      box: block.box,
      lines: block.lines,
    })),
    existingAudit: audit,
  });
}
assert.deepEqual(exerciseStarts.map(item => item.number),
  Array.from({ length: 19 }, (_, i) => 873 + i));

const calls = [];
for (const stage of ["first-finalize", "execution-recovery1"]) {
  for (let n = 267; n <= 274; n += 1) {
    const id = String(n).padStart(4, "0");
    const dir = path.join(author, `${stage}/${id}`);
    const receipt = readJSON(path.join(dir, "receipt.json"));
    const stdout = bind(path.join(dir, "stdout.txt"));
    const stderr = bind(path.join(dir, "stderr.txt"));
    const error = fs.readFileSync(stderr.path, "utf8");
    const expected = stage === "first-finalize" || [267, 273, 274].includes(n) ? 1 : 0;
    assert.equal(receipt.exit_code, expected);
    if (stage === "first-finalize") assert.ok(error.includes("checkout") || error.includes("root"));
    calls.push({
      producer: "author", stage, page: n, exit: receipt.exit_code,
      receipt: inputs.get(path.join(dir, "receipt.json")), stdout, stderr,
      classification: stage === "first-finalize" ? "checkout-devnull-sandbox-failure"
        : [267, 273].includes(n) ? "crop-permission-failure"
        : n === 274 ? "row-count-failure" : "pass-reused",
    });
  }
}
for (const n of [267, 273]) {
  const prefix = path.join(stages, `source${n}-crop-output-RECOVERY2`);
  const receipt = readJSON(`${prefix}.receipt.json`);
  assert.equal(receipt.exit, 0);
  assert.equal(receipt.cwd, root);
  assert.ok(!receipt.command.includes("/usr/bin/sandbox-exec"));
  calls.push({
    producer: "parent", stage: "RECOVERY2", page: n, exit: receipt.exit,
    receipt: inputs.get(`${prefix}.receipt.json`),
    start: bind(`${prefix}.start.json`),
    stdout: bind(`${prefix}.stdout`),
    stderr: bind(`${prefix}.stderr`),
    classification: "crop-output-recovered-outside-author-custom-sandbox",
  });
}
assert.equal(calls.length, 18);
const incoming = path.join(root, "ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0266/page.md");
bind(incoming);
assert.ok(fs.readFileSync(incoming, "utf8").includes("以后，"));
const diagnostic = readJSON(path.join(author, "count-diagnostic.stdout.json"));
assert.deepEqual(diagnostic.bands.slice(16, 18), [[1780, 1811], [1813, 1861]]);
for (const file of [
  "AGENTS.md",
  ".intentfold/readme.md",
  ".intentfold/project.json",
  ".intentfold/charter/engineering.md",
  ".intentfold/charter/product.md",
  ".intentfold/charter/operations.md",
  ".claude/skills/ld-s10y-lesson/SKILL.md",
  ".claude/skills/ld-s10y-lesson/references/production-resume.md",
  ".agents/skills/ld-s10y-image/SKILL.md",
  "ssot-resources/soviet10year-textbooks/toc/7a/zh.json",
  "ssot-resources/soviet10year-textbooks/sources/manifest.json",
  ".claude/skills/ld-s10y-lesson/tools/layout.py",
  ".claude/skills/ld-s10y-lesson/tools/p2c.py",
]) bind(path.join(root, file));
const sourceRoot = path.join(root, "ssot-resources/soviet10year-textbooks/sources");
const manifest = JSON.parse(fs.readFileSync(path.join(sourceRoot, "manifest.json"), "utf8"));
const sourceEntry = manifest.pdfs.find(item => item.book === "7a");
assert.ok(sourceEntry);
const pdfBinding = bind(path.join(root, manifest.pdfRoot, sourceEntry.file));
assert.equal(pdfBinding.sha256, sourceEntry.sha256);

writeJSON("bindings.json", {
  schema: "stemrobin182/independent-raw-source-review-binding@1",
  reviewer: "reviewer7a",
  cwd: root,
  gitHead: execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim(),
  collectedAt: new Date().toISOString(),
  verdict: "HOLD_AFFECTED_PHYSICAL274",
  completeCourseApproval: false,
  mathematicalAnswerApproval: false,
  modernFigureApproval: false,
  sourceFindings: [
    { ref: "p0274#5", row: 9, band: [957, 998], kind: "transcription-loss",
      source: "$ax^2+bx+c=0$", current: "$ax+bx+c=0$" },
    { ref: "p0274#7", row: 17, band: [1780, 1861], kind: "counter-overcount",
      extraDetectedBand: [1813, 1861], sourceRows: 1, detectedRows: 2, missingTextRows: 0 },
    { ref: "p0274#5", row: 11, band: [1100, 1187], kind: "confirmed-source-printing-error",
      literalPreserved: "$x_2=\\frac{-b+\\sqrt{b}}{2a}$", sourceRewriteAuthorized: false },
  ],
  pages,
  exerciseStarts,
  producerCalls: calls,
  authorFinalizeCount: 16,
  parentRecovery2Count: 2,
  reviewerFinalizeCount: 0,
  authorSnapshotChecks,
  independentImageLoads: 8,
  reviewerPersistentWriteRoot: own,
});

// Recheck bound inputs immediately before the terminal read-only seal.
for (const item of inputs.values()) {
  assert.equal(crypto.createHash("sha256").update(fs.readFileSync(item.path)).digest("hex"),
    item.sha256, `Input changed during freeze: ${item.path}`);
}
const inputRows = [...inputs.values()].sort((a, b) => a.path.localeCompare(b.path));
fs.writeFileSync(path.join(own, "input-hashes.sha256"),
  inputRows.map(item => `${item.sha256}  ${item.path}`).join("\n") + "\n", { flag: "wx" });
const ownFiles = fs.readdirSync(own).sort().map(name => path.join(own, name));
const ownBindings = ownFiles.map(file => {
  const bytes = fs.readFileSync(file);
  return {
    path: file,
    sha256: crypto.createHash("sha256").update(bytes).digest("hex"),
    bytes: bytes.length,
    mode: "0444",
  };
});
fs.writeFileSync(path.join(own, "hashes.sha256"),
  ownBindings.map(item => `${item.sha256}  ${item.path}`).join("\n") + "\n", { flag: "wx" });
const hashesBytes = fs.readFileSync(path.join(own, "hashes.sha256"));
ownBindings.push({
  path: path.join(own, "hashes.sha256"),
  sha256: crypto.createHash("sha256").update(hashesBytes).digest("hex"),
  bytes: hashesBytes.length,
  mode: "0444",
});
writeJSON("freeze.json", {
  schema: "stemrobin182/independent-review-output-freeze@1",
  reviewer: "reviewer7a",
  sealedAt: new Date().toISOString(),
  mode: "0444",
  files: ownBindings,
  selfHashExcluded: true,
  inputCount: inputs.size,
  sourceEdits: 0,
  imageLoads: 8,
  imageBatches: 1,
  finalizeCalls: 0,
  noDownstreamActions: true,
});
for (const name of fs.readdirSync(own)) fs.chmodSync(path.join(own, name), 0o444);
for (const item of ownBindings) {
  assert.equal(crypto.createHash("sha256").update(fs.readFileSync(item.path)).digest("hex"),
    item.sha256);
  assert.equal(fs.statSync(item.path).mode & 0o777, 0o444);
}
assert.equal(fs.statSync(path.join(own, "freeze.json")).mode & 0o777, 0o444);
console.log(JSON.stringify({
  status: "FROZEN_HOLD_PHYSICAL274",
  files: fs.readdirSync(own),
  reportSha256: ownBindings.find(item => item.path.endsWith("/report.md")).sha256,
  freezeSha256: crypto.createHash("sha256").update(fs.readFileSync(path.join(own, "freeze.json"))).digest("hex"),
  mode: "0444",
  imageLoads: 8,
  imageBatches: 1,
  producerReceiptsReused: 18,
  sourceEdits: 0,
  reviewerFinalizeCalls: 0,
}, null, 2));
