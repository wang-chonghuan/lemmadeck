import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck";
const out = path.join(root, ".intentfold/tickets/STEMROBIN-188/tmp/n46-answer-symbol-affected-review-01");
const primaryPath = path.join(root, ".intentfold/tickets/STEMROBIN-188/tmp/n46-symbol-affected-review-inputs-01/manifest.json");
const sha = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const primary = read(primaryPath);
const sourcePath = primary.sourceFirstReview.path;
const source = read(sourcePath);
const refs = new Map();
function collect(value) {
  if (!value || typeof value !== "object") return;
  if (typeof value.path === "string" && typeof value.sha256 === "string") {
    const key = value.path;
    const item = refs.get(key) ?? { path: key, expected_sha256: [] };
    if (!item.expected_sha256.includes(value.sha256)) item.expected_sha256.push(value.sha256);
    refs.set(key, item);
  }
  for (const child of Object.values(value)) collect(child);
}
collect(primary);
collect(source);
refs.set(primaryPath, { path: primaryPath, expected_sha256: [] });
const mode = process.argv[2];
if (!["before", "after"].includes(mode)) throw new Error("Use before or after.");
const first = mode === "after" ? read(path.join(out, "bindings-before.json")) : null;
const rows = [...refs.values()].map((ref) => {
  try {
    const bytes = fs.readFileSync(ref.path);
    const raw_sha256 = sha(bytes);
    const previous = first?.files.find((row) => row.path === ref.path);
    return {
      ...ref, bytes: bytes.length, raw_sha256,
      expected_matches: ref.expected_sha256.every((digest) => digest === raw_sha256),
      ...(previous ? { unchanged_since_before: previous.raw_sha256 === raw_sha256 } : {}),
    };
  } catch (error) {
    return { ...ref, expected_matches: false, error: String(error) };
  }
});
const result = {
  phase: mode, primary_manifest: primaryPath,
  candidate_read_policy: "Hash-only bytes before FIRST; no candidate semantic content inspected by this binding operation.",
  file_count: rows.length,
  expected_mismatch_count: rows.filter((row) => !row.expected_matches).length,
  changed_since_before_count: rows.filter((row) => row.unchanged_since_before === false).length,
  files: rows,
};
const target = path.join(out, `bindings-${mode}.json`);
fs.writeFileSync(target, `${JSON.stringify(result, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({
  path: target, raw_sha256: sha(fs.readFileSync(target)),
  file_count: result.file_count,
  expected_mismatch_count: result.expected_mismatch_count,
  changed_since_before_count: result.changed_since_before_count,
  mismatches: rows.filter((row) => !row.expected_matches),
}, null, 2));
