import { createHash } from "node:crypto";
import { chmodSync, existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const owned = dirname(fileURLToPath(import.meta.url));
const target = resolve(owned, "review-freeze.json");
const digest = (buffer) => createHash("sha256").update(buffer).digest("hex");
const entry = (name) => {
  const path = resolve(owned, name);
  const buffer = readFileSync(path);
  return {
    path,
    owned_relative_path: name,
    sha256: digest(buffer),
    bytes: buffer.length,
    mode: (statSync(path).mode & 0o777).toString(8).padStart(4, "0"),
  };
};

if (existsSync(target)) throw new Error("Refusing to replace first review freeze.");
const files = readdirSync(owned).sort();
for (const name of files) {
  if (!statSync(resolve(owned, name)).isFile()) throw new Error(`Unexpected directory: ${name}`);
}

const jsonFiles = files.filter((name) => name.endsWith(".json"));
for (const name of jsonFiles) JSON.parse(readFileSync(resolve(owned, name), "utf8"));
const firstInventory = entry("sourceinventory.json");
const cropAdjudication = entry("cropadjudication.json");
if (firstInventory.sha256 !== "80bd3f55754917caa12347554a95f8f9221649780a9b988a234f60d95a9349b3") {
  throw new Error("Independent first inventory changed.");
}
if (cropAdjudication.sha256 !== "ac702b0f9085a599df7934fc9bc9196c177b18c786f41f5a1b302c8ca5f499a3") {
  throw new Error("Independent crop adjudication changed.");
}
for (const name of files) chmodSync(resolve(owned, name), 0o444);
const entries = files.map(entry);
const report = JSON.parse(readFileSync(resolve(owned, "report.json"), "utf8"));
const freeze = {
  schema: "d575/review-freeze@1",
  status: "SEALED",
  owned_root: owned,
  recipient: "parent24",
  review_role: report.role,
  SOURCE204: report.gates.SOURCE204,
  N76_RIGHT_BOUNDARY: report.gates.N76_RIGHT_BOUNDARY,
  retained_dependency: report.retained_dependency,
  RAW: report.gates.RAW,
  SVG: report.gates.SVG,
  image_opens: report.image_accounting.context_actual_opens,
  batch_opens: report.image_accounting.batch_1_actual_opens,
  fullCard: false,
  whole_n76_signature: "NOT_CERTIFIED",
  report: entry("report.json"),
  first_inventory: entry("sourceinventory.json"),
  crop_adjudication: entry("cropadjudication.json"),
  author_binding_evidence: entry("author-binding-check.json"),
  author_inputs: {
    report: report.author_binding_verification.report,
    READY: report.author_binding_verification.READY,
    author_freeze: report.author_binding_verification.author_freeze,
    native_artifacts: report.reviewed_native_artifacts,
    source_image: report.image_accounting.opens[0],
  },
  entries,
  self_binding: {
    excluded_path: target,
    mode: "0444",
    reason: "A manifest cannot include its own final hash; terminal textual handoff supplies the full SHA256.",
  },
};
writeFileSync(target, `${JSON.stringify(freeze, null, 2)}\n`, { flag: "wx", mode: 0o444 });
for (const expected of entries) {
  const actual = entry(expected.owned_relative_path);
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`Owned freeze entry mismatch: ${expected.path}`);
  }
}
if ((statSync(target).mode & 0o777) !== 0o444) throw new Error("Freeze not sealed 0444.");
console.log(JSON.stringify({
  report: entry("report.json"),
  review_freeze: entry("review-freeze.json"),
  frozen_other_owned_files: entries.length,
  all_owned_files_mode: "0444",
  SOURCE204: report.gates.SOURCE204.status,
  N76_RIGHT_BOUNDARY: report.gates.N76_RIGHT_BOUNDARY.status,
  N76_RIGHT_BOUNDARY_scope: report.gates.N76_RIGHT_BOUNDARY.scope,
  retained_dependency: report.retained_dependency.status,
  RAW: report.gates.RAW.status,
  SVG: report.gates.SVG.status,
  actual_opens: report.image_accounting.context_actual_opens,
  no_source202_or_source203_opens: true,
}, null, 2));
