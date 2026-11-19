import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
const relative = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n38-choice-author";
const directory = path.join(root, relative);
const sha = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value !== null && typeof value === "object") {
    return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonical(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value).replace(/[\u007f-\uffff]/g, c =>
    `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`);
}
if (fs.existsSync(path.join(directory, "draft.json"))) {
  throw new Error("Cannot create a before-options solve freeze after a draft exists");
}
const files = ["source.json", "solve.md", "supplementary-context.json"].map(name => {
  const bytes = fs.readFileSync(path.join(directory, name));
  return {
    path: `${relative}/${name}`,
    sha256: sha(bytes),
    canonical_json_sha256: name.endsWith(".json") ? sha(canonical(JSON.parse(bytes))) : null,
  };
});
const receipt = {
  schema: "n38-independent-solve-freeze-v1",
  frozen_at: new Date().toISOString(),
  phase: "INDEPENDENT_SOLVES_FROZEN_BEFORE_OPTIONS",
  checkout: root,
  branch: "codex/STEMROBIN-182-textbooks",
  source_seed_canonical_sha256: "7408cddfd1708375927eedd577eed061db345b7befc28caead8e875c72826875",
  full_original_task_count: 49,
  explicit_original_correction_task_count: 18,
  files,
  review: "PENDING_INDEPENDENT_REVIEW",
};
if (files[0].canonical_json_sha256 !== receipt.source_seed_canonical_sha256) {
  throw new Error("Unexpected seed canonical hash");
}
fs.writeFileSync(path.join(directory, "solve-freeze.json"), `${JSON.stringify(receipt, null, 2)}\n`, {flag: "wx"});
for (const name of ["source.json", "solve.md", "supplementary-context.json", "solve-freeze.json"]) {
  fs.chmodSync(path.join(directory, name), 0o444);
}
console.log(JSON.stringify(receipt, null, 2));
