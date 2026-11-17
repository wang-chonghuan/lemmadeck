import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { root, workspace, recordCommand } from "./command-evidence.mjs";

const sha = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const readJSON = (name) => JSON.parse(fs.readFileSync(path.join(root, name), "utf8"));
const writeJSON = (name, value) => fs.writeFileSync(path.join(root, name), `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
const stageAPath = path.join(root, "..", "input-outputbindings.json");
const expectedStageA = "ea37384e87d6f8aedd841e78a5c4e0323d6ef8f390a2875685d3ff6ed6588a88";
let inputs;

recordCommand("CB05-freeze", (emit) => {
  const stageABytes = fs.readFileSync(stageAPath);
  if (sha(stageABytes) !== expectedStageA) throw new Error("StageA manifest changed");
  const stageA = JSON.parse(stageABytes);
  for (const output of stageA.outputs) {
    if (sha(fs.readFileSync(output.path)) !== output.sha256) throw new Error(`Frozen StageA output changed: ${output.path}`);
  }
  const authors = [
    ["0168", "4ad9cef52d6ce9bc90eb60349b15fd2af9a76c97ed966d1795274216a23d7e36"],
    ["0169", "ca67e8335de4eed69cd1c35ca5cbeaf37fc0eeab1b88e3ef3969e28042d1f1c7"],
    ["0170", "d7b658ff0c222adcfe4f1853baac4dabde36a6d136dc455e36b60becf640e19c"],
    ["0171", "cc5c595c812f745511f9c239fa22155bf5957a6a7a4cdd190e3600e13d178686"],
  ].map(([page, expectedSha256]) => {
    const authorPath = path.join(workspace, `ssot-resources/soviet10year-textbooks/artifacts/10c/pages/${page}/page.md`);
    const snapshotPath = path.join(root, `comparison-inputs/${page}.author.verified.md`);
    if (sha(fs.readFileSync(authorPath)) !== expectedSha256 || sha(fs.readFileSync(snapshotPath)) !== expectedSha256) throw new Error(`Author or verified snapshot changed: ${page}`);
    return { page, authorPath, snapshotPath, sha256: expectedSha256, role: "Exact-hash comparison input, not independent pixels" };
  });
  const crops = ["168-r15", "170-underbrace"].map((id) => {
    const metadata = readJSON(`${id}.native.metadata.json`);
    if (sha(fs.readFileSync(metadata.crop_path)) !== metadata.crop_sha256) throw new Error(`Native crop changed: ${id}`);
    return metadata;
  });
  inputs = {
    stageABindingPath: stageAPath,
    stageABindingSha256: expectedStageA,
    stageAOutputsUnchangedAtSeal: true,
    sourceInventoryBindings: stageA.inputBindings,
    authorComparisonInputs: authors,
    newNativeCropBindings: crops,
    originalPngReadAtSeal: false,
    sourceHashProvenance: "Inherited immutable StageA bindings and hash-checked exact ROI-production reads; originals not reopened",
  };
  emit("Unique StageB comparison artifacts prepared. Exit handler seals all append-only files including direct command streams. STOP; no further images or production actions.\n");
});

process.on("exit", (code) => {
  if (code !== 0) return;
  const walk = (directory) => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error("Unexpected symlink in owned StageB");
    return entry.isDirectory() ? walk(absolute) : [absolute];
  });
  const outputs = walk(root).sort().map((absolute) => {
    const bytes = fs.readFileSync(absolute);
    return {
      path: absolute,
      bytes: bytes.length,
      sha256: sha(bytes),
      type: absolute.endsWith(".png") ? "native ROI; path/hash only to parent" : "text evidence",
    };
  });
  writeJSON("input-outputbindings.json", {
    stage: "B",
    uniqueStageB: true,
    status: "FROZEN_STOP_TEXT_PATH_HASH_ONLY",
    authorComparisonResult: "NO_AUTHOR_CONTENT_MISMATCH_ESTABLISHED",
    stageAEdited: false,
    inputs,
    outputs,
    imageUsage: { inheritedLifetime: 4, finalLifetime: 6, lifetimeLimit: 24, inheritedBatch: 4, finalBatch: 6, batchLimit: 8, resets: 0 },
    remainingUnknownsAndHolds: "Unchanged; no old release or new outside-page inference",
    selfHashAndReadOnlyHashPublication: "External final functions.exec_command transcript; excluded to avoid self-reference",
    finalReadOnlyPublicationVector: ["shasum", "-a", "256", `${root}/input-outputbindings.json`, `${root}/report.md`, `${root}/comparisons.md`, `${root}/ledger.json`],
    stop: true,
  });
});
