import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";

const evidence = path.dirname(fileURLToPath(import.meta.url));
const ticketTmp = path.dirname(evidence);
const author = path.join(ticketTmp, "d041-10p-source108-111-author");
const freezePath = path.join(author, "evidence-freeze.json");
const expectedFreeze = "8e49e0093c00c9e908f8664d215b3504ecaf035f6df740c6ed6eb90cfbaa84c4";
const digest = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const freezeBytes = fs.readFileSync(freezePath);
assert.equal(digest(freezeBytes), expectedFreeze);
const freeze = JSON.parse(freezeBytes);
assert.equal(freeze.files.length, 63);
assert.equal(freeze.readonly_references.length, 8);

function verify(entry, category) {
  assert.ok(path.isAbsolute(entry.path));
  const bytes = fs.readFileSync(entry.path);
  const actual = digest(bytes);
  assert.equal(actual, entry.sha256, entry.path);
  if (entry.bytes !== undefined) assert.equal(bytes.length, entry.bytes, entry.path);
  return {
    category,
    path: entry.path,
    bytes: bytes.length,
    expected_sha256: entry.sha256,
    actual_sha256: actual,
    status: "PASS",
  };
}

const bindings = [
  ...freeze.files.map((entry) => verify(entry, "frozen_author_file")),
  ...freeze.readonly_references.map((entry) => verify(entry, "readonly_contract_reference")),
];
const copied = readJson(path.join(author, "receipts/prepared-copy.json"));
const originalPageBindings = copied.files
  .filter((entry) => path.basename(entry.source) === "page.png")
  .map((entry) => verify({ path: entry.source, sha256: entry.sha256 }, "original_prepared_page"));
assert.equal(originalPageBindings.length, 4);
const pageNumbers = [108, 109, 110, 111];
const pageFiles = pageNumbers.map((page) =>
  path.join(author, "prepared/10p/pages", String(page).padStart(4, "0"), "page.png"));
const cropFiles = pageNumbers.map((page, index) =>
  path.join(author, "work/10p/pages", String(page).padStart(4, "0"), "figures", `fig-${69 + index}.png`));
const frozenByPath = new Map(freeze.files.map((entry) => [entry.path, entry]));
const images = [...pageFiles, ...cropFiles].map((file, index) => {
  const entry = frozenByPath.get(file);
  assert.ok(entry, file);
  const bytes = fs.readFileSync(file);
  assert.equal(bytes.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
  return {
    load: index + 1,
    role: index < 4 ? "SOURCE" : "RAW",
    physical_page: pageNumbers[index % 4],
    printed_page: pageNumbers[index % 4] - 10,
    path: file,
    sha256: entry.sha256,
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20),
    visual_tool: "functions.view_image",
    detail: "original",
    loaded_once_in_this_review: true,
  };
});
const pages = pageNumbers.map((page) => {
  const key = String(page).padStart(4, "0");
  const native = readJson(path.join(author, "root/10p/pages", key, "page.json"));
  const audit = readJson(path.join(author, "root/10p/pages", key, "audit.json"));
  const receipt = readJson(path.join(author, "receipts", `${key}.initial-finalize.json`));
  assert.equal(receipt.status, 0);
  assert.equal(native.meta.counting, undefined);
  assert.equal(native.meta.figure_crops, undefined);
  return {
    physical_page: page,
    printed_page: native.meta.printed_page,
    stored_native_exit: receipt.status,
    stored_native_printed_lines: audit.lines_printed,
    stored_native_authored_lines: audit.lines_md,
    status_use: "CORROBORATION_ONLY_NOT_SOURCE_APPROVAL",
    block_inventory: native.blocks.map((block, index) => ({
      ref: `p${key}#${index + 1}`,
      kind: block.kind,
      line_count: block.lines.length,
      open: block.open,
      cont: block.cont,
      samerow: block.samerow,
    })),
    counting_overrides: 0,
    figure_crop_overrides: 0,
  };
});
const result = {
  schema: "source-independent/binding-evidence@1",
  checked_at: new Date().toISOString(),
  verification_script: { path: fileURLToPath(import.meta.url), sha256: digest(fs.readFileSync(fileURLToPath(import.meta.url))) },
  freeze: { path: freezePath, expected_sha256: expectedFreeze, actual_sha256: digest(freezeBytes), status: "PASS" },
  frozen_files: 63,
  readonly_references: 8,
  verified_bindings: bindings.length,
  bindings,
  original_page_bindings: originalPageBindings,
  image_count: images.length,
  images_in_order: images,
  pages,
  author_tools_executed: false,
  author_files_written: false,
  raster_images_emitted_by_this_script: 0,
};
const destination = path.join(evidence, "bindings.json");
fs.writeFileSync(destination, JSON.stringify(result, null, 2) + "\n", { flag: "wx" });
console.log(JSON.stringify({ path: destination, sha256: digest(fs.readFileSync(destination)), verified_bindings: bindings.length, original_page_bindings: originalPageBindings.length, images: images.length }));
