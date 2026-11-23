import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = "/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck";
assert.equal(process.cwd(), root);
const [mode] = process.argv.slice(2);
assert.ok(["c6", "c6-author", "c6-math-A", "c6-math-B", "n81", "source-preparation", "source190193-preparation", "source182185-A", "source182185-author", "source182185-B", "source182185-affected", "source182185-native", "source184185-wrap", "source186189-A", "source186189-author", "source186189-B", "source186189-affected", "source186189-native", "source190193-author", "source188-folio"].includes(mode));
const scratch = path.join(root, ".tmp/stemrobin-184-six");
const evidence = path.join(root, "ssot-resources/soviet10year-textbooks/artifacts/10c/evidence");
const target = path.join(evidence, {
  c6: "nov22-1846-c6-supplement-first-assembly",
  "c6-author": "nov22-1846-c6-supplement-author",
  "c6-math-A": "nov22-1846-c6-supplement-math-phaseA",
  "c6-math-B": "nov22-1846-c6-supplement-math-phaseB",
  n81: "nov22-1846-n81-current-group-binding",
  "source-preparation": "nov22-1846-source0182-0189-preparation",
  "source190193-preparation": "nov22-1846-source0190-0193-preparation",
  "source182185-A": "nov22-1846-source0182-0185-phaseA",
  "source182185-author": "nov22-1846-source0182-0185-author",
  "source182185-B": "nov22-1846-source0182-0185-phaseB-and-candidate",
  "source182185-affected": "nov22-1846-source0182-0185-affected-text",
  "source182185-native": "nov22-1846-source0182-0185-first-native",
  "source184185-wrap": "nov22-1846-source0184-0185-wrap-recovery",
  "source186189-A": "nov22-1846-source0186-0189-phaseA",
  "source186189-author": "nov22-1846-source0186-0189-author",
  "source186189-B": "nov22-1846-source0186-0189-phaseB-and-candidate",
  "source186189-affected": "nov22-1846-source0186-0189-affected-text",
  "source186189-native": "nov22-1846-source0186-0189-first-native",
  "source190193-author": "nov22-1846-source0190-0193-author",
  "source188-folio": "nov22-1846-source0188-folio-metadata-recovery",
}[mode]);
const partialRecovery = mode === "source182185-A" && fs.existsSync(target)
  && !fs.existsSync(path.join(target, "retention.json"));
if (partialRecovery) {
  const failure = JSON.parse(fs.readFileSync(path.join(scratch, "n88-stage-executions/nov22-source182185-phasea-retain-once/execution.json")));
  assert.equal(failure.exitCode, 1);
} else {
  assert.ok(!fs.existsSync(target));
}
const selected = new Set();
const add = relative => {
  const file = path.join(scratch, relative);
  assert.ok(fs.statSync(file).isFile());
  assert.ok(!fs.lstatSync(file).isSymbolicLink());
  selected.add(file);
};
const addTree = relative => {
  const directory = path.join(scratch, relative);
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const child = `${relative}/${entry.name}`;
    assert.ok(!entry.isSymbolicLink());
    if (entry.isDirectory()) addTree(child);
    else add(child);
  }
};
if (mode === "c6") {
  add("prepare-c6-supplement.mjs");
  add("recover-c6-output-root.mjs");
  add("c6-supplement-first/inputs.json");
  addTree("c6-supplement-first/wrong-root-failure");
  add("c6-supplement-first/artifacts/10c/book.json");
  addTree("c6-supplement-first/artifacts/10c/lessons/ana10-c6-ex");
  for (const stage of [
    "nov22-c6-supplement-first-inputs", "nov22-c6-supplement-first-assemble",
    "nov22-c6-wrong-root-preserve-recovery", "nov22-c6-supplement-scoped-assemble-recovery",
    "nov22-c6-supplement-first-adapt-prepare", "nov22-c6-supplement-adapt-argument-recovery",
  ]) addTree(`n88-stage-executions/${stage}`);
} else if (mode === "c6-math-A") {
  addTree("c6-supplement-math-review/phaseA");
  add("c6-supplement-math-phasea-parent-note.md");
  addTree("n88-stage-executions/nov22-source188-folio-retain-once");
} else if (mode === "c6-math-B") {
  addTree("c6-supplement-math-review/phaseB");
  add("c6-supplement-math-phaseb-parent-note.md");
  add("c6-supplement-math-phaseb-release.md");
  add("retain-active-continuation.mjs");
} else if (mode === "c6-author") {
  addTree("c6-supplement-answer-author");
  add("c6-supplement-first/attribution-note.md");
  for (const name of ["lesson.template.json", "exercises.template.json", "figures.template.json"])
    add(`c6-supplement-first/work/adapt/10c/modern-us-neutral/lessons/ana10-c6-ex/${name}`);
} else if (mode === "n81") {
  for (const name of ["seed.json", "draft.json", "review.json", "rebind.py", "rebind.json", "promote.mjs", "promotion.json"])
    add(`n81-group-binding-first/${name}`);
  addTree("n81-group-binding-first/before");
  addTree("n81-group-binding-review-first");
  for (const stage of [
    "nov22-n81-current-group-seed-first", "nov22-n81-group-binding-candidate-first",
    "nov22-n81-group-binding-promote-first",
  ]) addTree(`n88-stage-executions/${stage}`);
  const promotion = JSON.parse(fs.readFileSync(path.join(scratch, "n81-group-binding-first/promotion.json")));
  addTree(path.relative(scratch, path.dirname(promotion.validationReceipt.path)));
} else if (mode === "source184185-wrap") {
  addTree("source10c5255-work/current184185-wrap-candidate");
  add("prepare-source184185-wrap-candidate.mjs");
  add("check-source184185-wrap-candidate.py");
  add("source184185-wrap-parent-note.md");
  add("retain-active-continuation.mjs");
  for (const stage of [
    "nov22-source184185-wrap-candidate-copy-first",
    "nov22-source184185-wrap-object-proof-first",
    "nov22-source186189-author-retain-once",
    "nov22-source186189-phasea-retain-once",
  ]) addTree(`n88-stage-executions/${stage}`);
  for (const page of [184, 185])
    addTree(`source10c5255-work/receipts/nov22-source184185-wrap-p${String(page).padStart(4, "0")}-recovery-once`);
} else if (mode === "source188-folio") {
  addTree("source10c5255-work/current188-folio-candidate");
  add("prepare-source188-folio.mjs");
  add("check-source188-folio.py");
  add("source188-folio-parent-note.md");
  addTree("source10c5255-work/receipts/nov22-source188-folio-native-affected-once");
  for (const stage of [
    "nov22-source188-folio-copy-first",
    "nov22-source188-folio-object-proof-first",
    "nov22-source190193-author-retain-once",
  ]) addTree(`n88-stage-executions/${stage}`);
} else if (mode === "source190193-author") {
  addTree("source10c190193-author");
  add("source190193-author-parent-note.md");
  addTree("n88-stage-executions/nov22-source186189-first-native-retain-once");
} else if (mode === "source186189-native") {
  addTree("source10c5255-work/current186189-native-first");
  add("prepare-source186189-native.mjs");
  add("source186189-native-parent-note.md");
  addTree("n88-stage-executions/nov22-source186189-native-inputs-first");
  addTree("n88-stage-executions/nov22-source186189-affected-text-retain-once");
  for (const page of [186, 187, 188, 189])
    addTree(`source10c5255-work/receipts/nov22-source186189-native-p${String(page).padStart(4, "0")}-first`);
} else if (mode === "source186189-affected") {
  addTree("source10c186189-review/affected-text");
  addTree("n88-stage-executions/nov22-source186189-phaseb-candidate-retain-once");
} else if (mode === "source186189-B") {
  addTree("source10c186189-review/phaseB");
  addTree("source10c186189-current");
  add("prepare-source186189-affected.mjs");
  add("check-source186189-affected.py");
  add("source186189-phaseb-parent-note.md");
  for (const stage of [
    "nov22-source186189-affected-copy-first",
    "nov22-source186189-affected-object-proof-first",
    "nov22-source184185-wrap-retain-once",
  ]) addTree(`n88-stage-executions/${stage}`);
} else if (mode === "source186189-A") {
  addTree("source10c186189-review/phaseA");
  add("source186189-parent-intake-note.md");
} else if (mode === "source186189-author") {
  addTree("source10c186189-author");
  addTree("n88-stage-executions/nov22-source182185-native-retain-once");
} else if (mode === "source182185-native") {
  addTree("source10c5255-work/current182185-native-first");
  add("source182185-native-parent-note.md");
  addTree("n88-stage-executions/nov22-source182185-affected-text-retain-once");
  addTree("n88-stage-executions/nov22-source190193-preparation-retain-once");
  for (const page of [182, 183, 184, 185]) {
    addTree(`source10c5255-work/receipts/nov22-source182185-native-p${String(page).padStart(4, "0")}-first`);
  }
  add("source10c5255-work/10c/pages/0183/figures/fig-73.png");
  add("source10c5255-work/10c/pages/0184/figures/fig-79.png");
} else if (mode === "source182185-affected") {
  addTree("source10c182185-review/affected-text");
  addTree("n88-stage-executions/nov22-source182185-phaseb-candidate-retain-once");
} else if (mode === "source182185-B") {
  addTree("source10c182185-review/phaseB");
  addTree("source10c182185-current");
  add("prepare-source182185-affected.mjs");
  addTree("n88-stage-executions/nov22-source182185-affected-copy-first");
  addTree("n88-stage-executions/nov22-source182185-author-retain-once");
} else if (mode === "source182185-author") {
  addTree("source10c182185-author");
  add("source182185-author-attribution-note.md");
  addTree("n88-stage-executions/nov22-source182185-phasea-retention-path-recovery");
} else if (mode === "source182185-A") {
  addTree("source10c182185-review/phaseA");
  add("source182185-phasea-retention-launch-failure.md");
  if (partialRecovery) {
    add("source182185-retention-first-failed.mjs");
    addTree("n88-stage-executions/nov22-source182185-phasea-retain-once");
  }
} else {
  const stages = mode === "source190193-preparation"
    ? ["nov22-source190193-missing-input-prepare-first"] : [
    "nov22-source182185-missing-input-prepare-first",
    "nov22-source186189-missing-boundary-prepare-first",
  ];
  for (const stage of stages) addTree(`source10c5255-work/receipts/${stage}`);
  const [first, last] = mode === "source190193-preparation" ? [190, 193] : [182, 189];
  for (let page = first; page <= last; page++) {
    const relative = `source10c5255-work/10c/pages/${String(page).padStart(4, "0")}`;
    add(`${relative}/prepare.0001.stdout`);
    add(`${relative}/prepare.0001.stderr`);
  }
}
const hash = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const retained = [];
for (const file of [...selected].sort()) {
  const isImage = file.endsWith(".png");
  assert.ok(!/\.(svg|pdf|pyc)$/i.test(file), "No source PDF or runtime duplication");
  assert.ok(!isImage || (mode === "source182185-A" && path.basename(file) === "roi-0183-caption.png")
    || (mode === "source182185-author" && [
      "0183-caption-native.png", "0185-worked-chain-native.png",
    ].includes(path.basename(file)))
    || (mode === "source182185-native" && ["fig-73.png", "fig-79.png"].includes(path.basename(file)))
    || (mode === "source186189-author" && path.basename(file) === "0188-footer-native.png")
    || (mode === "source190193-author" && path.basename(file) === "roi0191-native.png")
    || (mode === "source186189-A" && ["roi-0188-zero-condition.png", "roi-0188-footer.png"].includes(path.basename(file))));
  let bytes, byteCount, sha256;
  if (isImage) {
    if (mode === "source190193-author") {
      const manifest = JSON.parse(fs.readFileSync(path.join(scratch,
        "source10c190193-author/hashes-manifest.json"), "utf8"));
      const binding = manifest.outputs.find(item => item.path === file);
      assert.ok(binding, "Native ROI must be bound by the author manifest");
      sha256 = binding.sha256;
    } else if (mode === "source186189-A") {
      const manifest = JSON.parse(fs.readFileSync(path.join(scratch,
        "source10c186189-review/phaseA/evidence-hashes.json"), "utf8"));
      const binding = manifest.phaseA_artifacts.find(item => item.path === file);
      assert.ok(binding, "Native ROI must be bound by independent PhaseA evidence");
      sha256 = binding.sha256;
    } else if (mode === "source186189-author") {
      const manifest = fs.readFileSync(path.join(scratch, "source10c186189-author/hashes.sha256"), "utf8");
      const line = manifest.split("\n").find(line => line.length > 66 && path.resolve(root, line.slice(66)) === file);
      assert.ok(line, "Native ROI must be bound by author manifest");
      sha256 = line.slice(0, 64);
    } else if (mode === "source182185-native") {
      const manifest = JSON.parse(fs.readFileSync(path.join(scratch,
        "source10c5255-work/current182185-native-first/bound-manifest.json"), "utf8"));
      const binding = manifest.pages.flatMap(item => item.new_native_crop_outputs_bytes_only)
        .find(item => item.path === file);
      assert.ok(binding, "Native new crop must be bound by the returned manifest");
      sha256 = binding.sha256;
    } else if (mode === "source182185-author") {
      const authorRoot = path.join(scratch, "source10c182185-author");
      const manifest = JSON.parse(fs.readFileSync(path.join(authorRoot, "manifest.json"), "utf8"));
      const binding = manifest.artifacts.find(item => path.resolve(authorRoot, item.path) === file);
      assert.ok(binding, "Native ROI must be bound by the author manifest");
      sha256 = binding.sha256;
    } else {
      const manifest = fs.readFileSync(path.join(scratch, "source10c182185-review/phaseA/evidence-manifest.sha256"), "utf8");
      const line = manifest.split("\n").find(line => line.length > 66
        && path.resolve(root, line.slice(66)) === file);
      assert.ok(line, "Native ROI must be bound by the observer manifest");
      sha256 = line.slice(0, 64);
    }
    assert.match(sha256, /^[a-f0-9]{64}$/);
    byteCount = fs.statSync(file).size;
  } else {
    bytes = fs.readFileSync(file);
    byteCount = bytes.length;
    sha256 = hash(bytes);
  }
  const destination = path.join(target, path.relative(scratch, file));
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  if (partialRecovery && fs.existsSync(destination)) {
    assert.ok(!isImage, "First failed copy did not reach its ROI");
    assert.equal(hash(fs.readFileSync(destination)), sha256, "Do not replace a different retained file");
  } else {
    fs.copyFileSync(file, destination, fs.constants.COPYFILE_EXCL);
  }
  retained.push({ origin: file, retained: destination, bytes: byteCount, sha256,
    ...(isImage ? { hashAuthority: `${mode === "source182185-native" ? "Native delegate manifest" : mode.endsWith("-author") ? "Author" : "Independent observer"}; OS copy without parent image view/header/decode` } : {}) });
}
const receipt = path.join(target, "retention.json");
fs.writeFileSync(receipt, JSON.stringify({
  status: "RETAINED_ONCE_NOT_NEW_APPROVAL",
  mode, cwd: root, resumedOnlyExactPartialCopies: partialRecovery, files: retained.length,
  bytes: retained.reduce((sum, x) => sum + x.bytes, 0), retained,
  unchangedSourceAndEarlierApprovedEvidenceReferencedNotRecopied: true,
  historicalScratchOriginsNotRuntimeDependencies: true,
  parentImageViews: 0, newCompleteLessonCredit: 0,
  knownCharges: 74, paidCalls: 0, fees: "UNKNOWN",
}, null, 2) + "\n", { flag: "wx" });
console.log(JSON.stringify({ receipt, sha256: hash(fs.readFileSync(receipt)), files: retained.length,
  bytes: retained.reduce((sum, x) => sum + x.bytes, 0) }));
