import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = "/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck";
assert.equal(process.cwd(), root);
const scratch = ".tmp/stemrobin-184-six";
const target = "ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/nov22-1846-n88-ready-delivery";
const mode = process.argv[2];
assert.ok(["base", "display"].includes(mode));
const receipt = `${target}/retention-${mode}.json`;
assert.ok(!fs.existsSync(receipt), "Do not repeat evidence retention");
const hash = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const bindings = [];
const copy = (source, destination, suppliedHash) => {
  const file = `${target}/${destination}`;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  assert.ok(!fs.existsSync(file), `Existing evidence: ${file}`);
  const bytes = fs.statSync(source).size;
  const sha256 = suppliedHash ?? hash(fs.readFileSync(source));
  fs.copyFileSync(source, file, fs.constants.COPYFILE_EXCL);
  if (!suppliedHash) assert.equal(hash(fs.readFileSync(file)), sha256);
  bindings.push({ source, retained: file, bytes, sha256,
    ...(suppliedHash ? { hashAuthority: "independent reviewer; OS byte copy without parent image decode/view" } : {}) });
};
const tree = (source, destination) => {
  for (const name of fs.readdirSync(source).sort()) {
    const file = `${source}/${name}`;
    const stat = fs.lstatSync(file);
    assert.ok(!stat.isSymbolicLink());
    if (stat.isDirectory()) tree(file, `${destination}/${name}`);
    else copy(file, `${destination}/${name}`);
  }
};
if (mode === "base") {
  for (const name of ["report.md", "original-freeze.md", "execution.md"]) {
    copy(`${scratch}/n88-original-crop-gap-first/${name}`, `original-crop-review/${name}`);
  }
  copy(`${scratch}/n88-original-crop-gap-first/fig-39-upper-arrow-source-roi.png`,
    "original-crop-review/fig-39-upper-arrow-source-roi.png",
    "389466738aab1360b0c2f6d9990fa690d2d7484d0a3235de4097b1d145ec12d7");
  copy(`${scratch}/n88-canonical-ready/promotion.json`, "promotion.json");
  copy(`${scratch}/n88-current-choice-binding/binding-refresh.json`, "choice-binding-refresh.json");
  tree(`${scratch}/n88-stage-executions`, "native-executions");
  for (const stage of ["nov22-n88-first-ready-finalize-01",
    "nov22-n88-boundary-ready-finalize-02", "nov22-n88-first-ready-render-01"]) {
    tree(`${scratch}/source10c5255-work/receipts/${stage}`, `ready-executions/${stage}`);
  }
  tree(`${scratch}/n88-raw-assembly/finalization-recovery01`, "boundary-recovery");
  for (const name of ["promote-n88-ready.mjs", "run-n88-stage.mjs",
    "refresh-n88-current-binding.py", "retain-n88-delivery-evidence.mjs"]) {
    copy(`${scratch}/${name}`, `scripts/${name}`);
  }
} else {
  const source = `${scratch}/n88-ready-prose-display-affected-first`;
  const manifest = JSON.parse(fs.readFileSync(process.argv[3], "utf8"));
  assert.equal(manifest.cwd, root);
  assert.equal(manifest.status, "PASS");
  assert.ok(Array.isArray(manifest.retentionFiles));
  for (const item of manifest.retentionFiles) {
    const absolute = path.resolve(item.path);
    assert.ok(absolute.startsWith(`${root}/${source}/`), "Reviewer evidence owner");
    copy(absolute, `affected-display/${absolute.slice(`${root}/${source}/`.length)}`,
      item.image ? item.sha256 : undefined);
  }
}
const result = { schema: "stemrobin1846/scoped-ready-evidence-retention@1",
  date: "2026-11-22", cwd: root, mode, files: bindings.length,
  bytes: bindings.reduce((sum, item) => sum + item.bytes, 0), bindings,
  historicalScratchPathsAreOriginsNotRuntimeDependencies: true,
  parentImageViewsOrPixelDecodes: 0, paidCalls: 0,
  inheritedCharges: 74, fees: "UNKNOWN", completedLessons: 0 };
fs.writeFileSync(receipt, JSON.stringify(result, null, 2) + "\n", { flag: "wx" });
console.log(JSON.stringify({ path: receipt, sha256: hash(fs.readFileSync(receipt)),
  files: result.files, bytes: result.bytes }));
