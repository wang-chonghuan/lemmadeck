import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = "/Users/yong/.codex/worktrees/00b1/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp/d560-source202-first-independent-review";
const digest = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const freezePath = path.join(root, "review-freeze.json");
if (fs.existsSync(freezePath)) throw new Error("Existing final freeze must be preserved; refusing replacement.");
const entries = fs.readdirSync(root, { withFileTypes: true });
if (entries.some((entry) => !entry.isFile())) throw new Error("Unexpected non-file in owned final root.");
const files = entries.map((entry) => {
  const file = path.join(root, entry.name);
  fs.chmodSync(file, 0o444);
  return { path: file, sha256: digest(file), bytes: fs.statSync(file).size, mode: "0444" };
}).sort((a, b) => a.path.localeCompare(b.path));
const inventory = files.find((file) => path.basename(file.path) === "sourceinventory.json");
if (inventory?.sha256 !== "bd278fee221fc14fa32c3f4f13fb09c287e71bb1138fee9b8782ef808d7cc7eb") {
  throw new Error("Independent inventory drift; cannot freeze.");
}
const freeze = {
  schema: "stemrobin181/d560-first-independent-review-freeze@1",
  ticket: "STEMROBIN-181",
  batch: "d560",
  root,
  frozen_at_utc: new Date().toISOString(),
  files,
  all_listed_files_mode: "0444",
  independent_inventory_unchanged_since_pre_candidate_freeze: true,
  self_binding_note: "This manifest excludes itself to avoid a circular hash. Its SHA256 and 0444 mode are recorded by the final command evidence and returned in the text-only report.",
  no_fullcard_signature: true,
  old_FAIL_HOLD_and_other_files_preserved: true,
  image_opens: 8,
  further_image_opens_allowed_this_batch: 0
};
fs.writeFileSync(freezePath, `${JSON.stringify(freeze, null, 2)}\n`, { flag: "wx" });
fs.chmodSync(freezePath, 0o444);
const allFiles = [...files, { path: freezePath, sha256: digest(freezePath), bytes: fs.statSync(freezePath).size, mode: "0444" }];
const mismatches = allFiles.filter((file) => digest(file.path) !== file.sha256 || (fs.statSync(file.path).mode & 0o777) !== 0o444);
if (mismatches.length) throw new Error(`Final frozen bytes or modes mismatch: ${JSON.stringify(mismatches)}`);
console.log(JSON.stringify({
  report: files.find((file) => path.basename(file.path) === "report.json"),
  sourceinventory: inventory,
  review_freeze: allFiles.at(-1),
  frozen_at_utc: freeze.frozen_at_utc,
  total_owned_final_files_0444: allFiles.length,
  final_hash_mode_mismatches: mismatches.length,
  gates: JSON.parse(fs.readFileSync(path.join(root, "report.json"), "utf8")).gates,
  image_opens: 8
}, null, 2));
