import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const review = path.join(root, ".intentfold/tickets/STEMROBIN-181/tmp/d897-source238-first-independent-review");
const author = path.join(root, ".intentfold/tickets/STEMROBIN-181/tmp/d890-source238-first-author");
const digest = (buffer) => createHash("sha256").update(buffer).digest("hex");
const inventoryBytes = readFileSync(path.join(review, "frozen-source-inventory.json"));
if (digest(inventoryBytes) !== "2db227e41ba041fbb608257c06e6edf455354a4ecb5ea6d246a51039fbb695e0") {
  throw new Error("Frozen inventory changed before candidate exposure");
}
const target = path.join(review, "candidate-read-once-bindings.json");
if (existsSync(target)) throw new Error("Candidate exposure already recorded; do not reread");

const names = [
  "first/output/page.md",
  "first/output/page.json",
  "first/output/audit.json",
  "first/native/finalize.0001.receipt.json",
  "first/native/finalize.0001.stdout",
  "first/native/finalize.0001.stderr",
  "first/output-sha256.json",
  "first/author/page.md",
  "input-reuse.json",
  "report.md",
  "report.json",
  "SHA256SUMS",
];
const bindings = [];
for (const name of names) {
  const file = path.join(author, name);
  const bytes = readFileSync(file);
  bindings.push({ path: file, sha256: digest(bytes), bytes: bytes.length, semantic_read_count: 1 });
  console.log(JSON.stringify({ path: file, sha256: digest(bytes), content: bytes.toString("utf8") }, null, 2));
}
writeFileSync(target, JSON.stringify({
  schema: "d897/source238-candidate-single-exposure@1",
  inventory_sha256: digest(inventoryBytes),
  candidate_reads_before_freeze: 0,
  files: bindings,
  pipeline_commands_executed: [],
}, null, 2) + "\n", { flag: "wx" });
