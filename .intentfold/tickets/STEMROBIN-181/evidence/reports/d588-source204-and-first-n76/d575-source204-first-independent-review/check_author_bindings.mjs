import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const owned = dirname(fileURLToPath(import.meta.url));
const authorRoot = resolve(owned, "../d570-source204-first-author");
const output = resolve(owned, "author-binding-check.json");
const digest = (buffer) => createHash("sha256").update(buffer).digest("hex");
const checks = [];

function check(label, binding) {
  const path = isAbsolute(binding.path)
    ? resolve(binding.path)
    : resolve(authorRoot, binding.path);
  const rel = relative(authorRoot, path);
  if (rel === ".." || rel.startsWith(`..${sep}`) || isAbsolute(rel)) {
    checks.push({ label, binding, resolved_path: path, status: "FAIL", reason: "OUTSIDE_D570_ROOT" });
    return;
  }
  if (!existsSync(path)) {
    checks.push({ label, binding, resolved_path: path, status: "FAIL", reason: "MISSING" });
    return;
  }
  const bytes = readFileSync(path);
  const stat = statSync(path);
  const actual = {
    sha256: digest(bytes),
    bytes: bytes.length,
    mode: (stat.mode & 0o777).toString(8).padStart(4, "0"),
  };
  const mismatches = ["sha256", "bytes", "mode"].filter(
    (key) => binding[key] !== undefined && binding[key] !== actual[key],
  );
  checks.push({
    label,
    binding,
    resolved_path: path,
    relative_to: authorRoot,
    actual,
    status: mismatches.length ? "FAIL" : "PASS",
    mismatches,
  });
}

check("user.report", {
  path: "report.md",
  sha256: "c689179fe287a6f05c30aa6c5408326a0d830b870deb8e038fc144740188a5a0",
  mode: "0444",
});
check("user.READY", {
  path: "READY.json",
  sha256: "15710d3d797c3e118cad219045a6cd4b3f90544e02a4b156a8094f3d25029dd4",
  mode: "0444",
});
check("user.author-freeze", {
  path: "author-freeze.json",
  sha256: "24fb81eb5853d70724fa71a6fc84bd4c0e069b7af0e29e231e9958f1fe1555f8",
  mode: "0444",
});

const freeze = JSON.parse(readFileSync(resolve(authorRoot, "author-freeze.json"), "utf8"));
const ready = JSON.parse(readFileSync(resolve(authorRoot, "READY.json"), "utf8"));
for (const entry of freeze.entries) check("author-freeze.entry", entry);
for (const [label, entry] of Object.entries(ready)) {
  if (entry && typeof entry === "object" && "path" in entry && "sha256" in entry) {
    check(`READY.${label}`, entry);
  }
}

const failures = checks.filter((entry) => entry.status === "FAIL");
const result = {
  schema: "d575/author-bindings@1",
  phase: "AFTER_INDEPENDENT_INVENTORY_AND_CROP_ADJUDICATION_SEALED",
  author_root: authorRoot,
  path_resolution: "Relative freeze/READY paths resolve from d570 owned root, NOT repo root.",
  status: failures.length ? "FAIL" : "PASS",
  blocking_list: failures,
  first_fail: failures[0] ?? null,
  author_freeze_entries: freeze.entries.length,
  checks_performed: checks.length,
  files_read_as_bytes_only_are_not_image_opens: true,
  image_opens_added: 0,
  native_commands_or_validators_replayed: false,
  author_files_changed: false,
  checks,
};

if (existsSync(output)) throw new Error("Refusing to overwrite first binding evidence.");
writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`, { mode: 0o444, flag: "wx" });
console.log(JSON.stringify({
  path: output,
  sha256: digest(readFileSync(output)),
  status: result.status,
  author_freeze_entries: result.author_freeze_entries,
  checks_performed: result.checks_performed,
  blocking_list: failures,
}, null, 2));
if (failures.length) process.exitCode = 1;
