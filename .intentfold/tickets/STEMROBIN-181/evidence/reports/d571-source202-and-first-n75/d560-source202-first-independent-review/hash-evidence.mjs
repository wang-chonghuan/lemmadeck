import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const workspace = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const owned = path.join(workspace, ".intentfold/tickets/STEMROBIN-181/tmp/d560-source202-first-independent-review");
const author = path.join(workspace, ".intentfold/tickets/STEMROBIN-181/tmp/d554-source202-first-author");
const previews = path.join(workspace, ".intentfold/tickets/STEMROBIN-181/tmp/d559-source202-svg-and-source203-preparation/source202-previews.json");
const hash = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const absolute = (file) => path.isAbsolute(file) ? file : path.join(workspace, file);
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const inspect = (file, expected, expectedBytes, expectedMode) => {
  const target = absolute(file);
  try {
    const bytes = fs.readFileSync(target);
    const stat = fs.statSync(target);
    const sha256 = hash(bytes);
    const mode = (stat.mode & 0o777).toString(8).padStart(4, "0");
    return {
      path: target,
      expected_sha256: expected,
      sha256,
      hash_matches: sha256 === expected,
      bytes: bytes.length,
      expected_bytes: expectedBytes ?? null,
      bytes_match: expectedBytes === undefined ? null : bytes.length === expectedBytes,
      mode,
      expected_mode: expectedMode ?? null,
      mode_matches: expectedMode === undefined ? null : mode === expectedMode
    };
  } catch (error) {
    return { path: target, expected_sha256: expected, error: error.message, hash_matches: false };
  }
};
const output = (name, data) => {
  const file = path.join(owned, name);
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, { flag: "wx" });
  console.log(JSON.stringify({ path: file, sha256: hash(fs.readFileSync(file)), ...data.summary }, null, 2));
};

if (process.argv[2] === "bindings") {
  const started = new Date().toISOString();
  const inventory = inspect(path.join(owned, "sourceinventory.json"), "bd278fee221fc14fa32c3f4f13fb09c287e71bb1138fee9b8782ef808d7cc7eb", undefined, "0444");
  const entry = [
    inspect(path.join(author, "report.json"), "5d2087ee0b0d8b888790e8013e519f00c9b5a4a7275809814e7e3d7dae95497d"),
    inspect(path.join(author, "author-freeze.json"), "860d28205d66e817855609e91f667583450f42a2723a1d22f89045d97f0826e3")
  ];
  if (!inventory.hash_matches || !inventory.mode_matches || entry.some((item) => !item.hash_matches)) {
    throw new Error("Inventory or author entry hash gate failed; no bound candidate read.");
  }
  const freeze = read(path.join(author, "author-freeze.json"));
  const files = freeze.files.map((item) => inspect(item.path, item.sha256, item.bytes, item.mode));
  const manifest = read(previews);
  const manifestBytes = fs.readFileSync(previews);
  const previewBindings = manifest.previews.map((figure) => ({
    figure: figure.figure,
    svg: inspect(figure.svg.path, figure.svg.sha256),
    raw: inspect(figure.RAW.path, figure.RAW.sha256),
    preview: inspect(figure.preview.path, figure.preview.sha256),
    first_native_preview_declared: figure.firstNativePreview,
    preview_count_declared: figure.previewCount
  }));
  const mismatches = files.filter((item) => !item.hash_matches || item.bytes_match === false || item.mode_matches === false);
  const previewMismatches = previewBindings.flatMap((item) => [item.svg, item.raw, item.preview]).filter((item) => !item.hash_matches);
  output("hash-binding-evidence.json", {
    schema: "d560/hash-binding-evidence@1",
    started_at_utc: started,
    completed_at_utc: new Date().toISOString(),
    inventory_before_candidate: inventory,
    supplied_author_hash_checks: entry,
    author_freeze_path: path.join(author, "author-freeze.json"),
    author_bound_files: files,
    preview_manifest: { path: previews, sha256: hash(manifestBytes) },
    preview_author_freeze: inspect(manifest.authorFreeze.path, manifest.authorFreeze.sha256),
    preview_bindings: previewBindings,
    summary: {
      author_bound_file_count: files.length,
      author_bound_mismatches: mismatches.length,
      preview_bound_file_count: previewBindings.length * 3,
      preview_bound_mismatches: previewMismatches.length,
      inventory_unchanged_0444: inventory.hash_matches && inventory.mode_matches
    }
  });
} else if (process.argv[2] === "close") {
  const binding = read(path.join(owned, "hash-binding-evidence.json"));
  const expected = [
    ...binding.supplied_author_hash_checks,
    ...binding.author_bound_files,
    binding.preview_manifest,
    ...binding.preview_bindings.flatMap((item) => [item.svg, item.raw, item.preview])
  ];
  const records = expected.map((item) => inspect(item.path, item.sha256, item.bytes, item.mode));
  output("closing-input-hash-evidence.json", {
    schema: "d560/closing-input-hash-evidence@1",
    checked_at_utc: new Date().toISOString(),
    purpose: "Detect input byte drift during this bounded read-only review; no replay or source modification.",
    files: records,
    summary: {
      checked_input_count: records.length,
      input_mismatches: records.filter((item) => !item.hash_matches || item.bytes_match === false || item.mode_matches === false).length
    }
  });
} else {
  throw new Error("Expected bindings or close; no source pipeline actions are implemented.");
}
