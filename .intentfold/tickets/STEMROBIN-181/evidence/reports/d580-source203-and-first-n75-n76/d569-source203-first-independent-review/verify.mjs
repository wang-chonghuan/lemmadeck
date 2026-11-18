import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(root, "../../../../..");
const author = path.resolve(root, "../d561-source203-first-author");
const prepared = path.resolve(root, "../d567-source203-svg-and-source204-preparation");
const hash = (file) => createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const json = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const mode = (file) => "0" + (fs.statSync(file).mode & 0o777).toString(8);
const bind = (file) => ({
  path: file,
  sha256: hash(file),
  bytes: fs.statSync(file).size,
  mode: mode(file),
});
const writeNew = (name, value) => fs.writeFileSync(
  path.join(root, name),
  JSON.stringify(value, null, 2) + "\n",
  { flag: "wx" },
);

const expectedInventory = "ecdedaf5e2d2041acf216ac52e26204111f14046bb34eeaa88b95f80b8541897";
assert.equal(hash(path.join(root, "sourceinventory.json")), expectedInventory);
assert.equal(mode(path.join(root, "sourceinventory.json")), "0444");
assert.equal(hash(path.join(author, "report.json")), "7b09f98b9de9f43f320854c0cdbb56a4132f35635036e7c49b8c13cde04bc2a2");
assert.equal(hash(path.join(author, "author-freeze.json")), "64b24d918e704ed3fdaea402effc2cfca8d6b0df7ac73e14fa75af7ec27989f8");
const authorFreeze = json(path.join(author, "author-freeze.json"));
const boundFiles = authorFreeze.files.map((expected) => {
  assert.ok(expected.path.startsWith(author + path.sep));
  const actual = bind(expected.path);
  assert.equal(actual.sha256, expected.sha256);
  assert.equal(actual.bytes, expected.bytes);
  assert.equal(actual.mode, expected.mode);
  return actual;
});
const previewManifest = path.join(prepared, "source203-previews.json");
assert.equal(hash(previewManifest), "5eeffccf4383bcaff5cf1190cdd497ab549859da430057cee747e6bccb8dffc4");
const previewBindings = json(previewManifest).previews.map((figure) => {
  assert.equal(figure.page, 203);
  const files = {};
  for (const field of ["svg", "RAW", "preview"]) {
    const file = path.resolve(repo, figure[field].path);
    assert.equal(hash(file), figure[field].sha256);
    files[field] = bind(file);
  }
  return { figure: figure.figure, files };
});
writeNew("input-verification.json", {
  schema: "d569/source203-input-verification@1",
  recorded_at: new Date().toISOString(),
  first_precomparison_verification: "Tool execution verified all 103 freeze-bound hashes/bytes/modes before reading candidate page.md/page.json/audit.json; this durable receipt rechecks the same bindings at report generation.",
  author_report: bind(path.join(author, "report.json")),
  author_freeze: bind(path.join(author, "author-freeze.json")),
  verified_author_file_count: boundFiles.length,
  bound_files: boundFiles,
  source203_preview_manifest: bind(previewManifest),
  preview_bindings: previewBindings,
});
writeNew("sourceinventory-seal.json", {
  schema: "d569/source203-independent-inventory-seal@1",
  inventory: bind(path.join(root, "sourceinventory.json")),
  observed_tool_order: [
    "SOURCE203 page.png opened as the first evidence read; no grid used.",
    "Lesson/image skills loaded, with no author/candidate files exposed.",
    "Pixel-derived sourceinventory.json manually written.",
    "sourceinventory.json chmod 0444 completed.",
    "SHA256 ecdedaf5e2d2041acf216ac52e26204111f14046bb34eeaa88b95f80b8541897 obtained before author report/freezemetadata exposure.",
    "Author top-level hashes checked, then all freeze-bound files checked before candidate comparison.",
  ],
  receipt_written_after_exposure: true,
  initial_inventory_rewritten: false,
  candidate_exposed_at_inventory_seal: false,
  image_count_at_inventory_seal: 1,
  strictseal: "PASS",
});

const inventory = json(path.join(root, "sourceinventory.json"));
const page = json(path.join(author, "source/10p/pages/0203/page.json"));
const plain = (text) => text.replaceAll("$", "").replaceAll("（", "(").replaceAll("）", ")").replace(/\s+/g, "");
const prose = [];
const order = page.blocks.map((block, index) => {
  const start = prose.length + 1;
  if (block.kind === "p") {
    block.lines.forEach((text, line) => prose.push({
      row: prose.length + 1,
      native: `p0203#${index + 1}`,
      pointer: `/blocks/${index}/lines/${line}`,
      text,
    }));
  }
  return {
    native: `p0203#${index + 1}`,
    pointer: `/blocks/${index}`,
    kind: block.kind,
    id: block.id ?? null,
    label: block.label,
    cont: block.cont,
    open: block.open,
    samerow: block.samerow,
    lines: block.lines.length,
    prose_rows: block.kind === "p" ? [start, prose.length] : null,
  };
});
assert.equal(prose.length, 23);
const adjudicatedRow21 = "射线 BC 就通过 C 点. 这样一来，就作出了 S 点发出的两条";
const comparisons = prose.map((row, index) => {
  const original = inventory.prose_rows[index].text;
  const source = row.row === 21 ? adjudicatedRow21 : original;
  assert.equal(plain(row.text), plain(source), "Literal text mismatch at row " + row.row);
  return {
    ...row,
    sealed_inventory_text: original,
    adjudicated_source_text: source,
    adjudication: row.row === 21 ? "First inventory omitted 了; source crop open #6 confirms 了 and the candidate is correct. The sealed inventory was not altered." : null,
    comparison: "MATCH",
  };
});
const md = fs.readFileSync(path.join(author, "source/10p/pages/0203/page.md"), "utf8");
const mdBlocks = [...md.matchAll(/<!-- ([^\n]+?) -->\n([\s\S]*?)(?=\n<!-- |$)/g)];
assert.equal(mdBlocks.length, page.blocks.length);
for (let index = 0; index < mdBlocks.length; index++) {
  const [ , header, body ] = mdBlocks[index];
  const block = page.blocks[index];
  assert.equal(header.split(" ")[0], block.kind);
  for (const key of ["cont", "open", "samerow"]) {
    assert.equal(header.split(" ").includes(key), block[key], "MD/JSON block flag drift");
  }
  if (block.kind !== "fig") {
    assert.deepEqual(body.trim().split("\n"), block.lines);
  }
}
assert.deepEqual(order.map((block) => block.kind), ["p", "fig", "cap", "p", "p", "fig", "cap", "p", "foot"]);
assert.equal(page.blocks[0].cont, true);
assert.equal(page.blocks[0].open, true);
assert.equal(page.blocks[3].cont, true);
assert.equal(page.blocks[3].open, false);
assert.equal(page.blocks[4].cont, false);
assert.equal(page.blocks[4].open, true);
assert.equal(page.blocks[7].cont, true);
assert.equal(page.blocks[7].open, false);
writeNew("text-comparisons.json", {
  schema: "d569/source203-text-comparisons@1",
  comparison_convention: "Ignore editorial whitespace/math fences and width-equivalent parentheses only. Preserve every Chinese glyph, Latin letter, subscript and sentence stop.",
  source_prose_rows: 23,
  native_rowcount_not_truth: true,
  native_audit_rows: json(path.join(author, "source/10p/pages/0203/audit.json")).lines_printed,
  actual_block_order: order,
  rows: comparisons,
  MD_JSON_blocks_lines_and_flags_equal: true,
  inventory_adjudications: [
    { row: 21, initial: "就作出", confirmed: "就作出了", image_open: 6, candidate_correct: true, initial_inventory_unchanged: true },
    { location: "fig-180 lower-left label", confirmed: "italic capital P", image_open: 7, pixels_preserved_in_RAW_and_SVG: true, initial_inventory_unchanged: true },
    { location: "rows 11, 12, 17", note: "Narrow printed parentheses represented with fullwidth parentheses in the first inventory. Candidate uses ASCII parentheses; width-equivalent comparison only, no text substitution." },
  ],
});
const python = path.join(repo, ".claude/skills/ld-s10y-lesson/.venv/bin/python");
const pixelcheck = JSON.parse(execFileSync(python, [path.join(root, "pixelcheck.py")], { encoding: "utf8" }));
writeNew("pixel-binding.json", pixelcheck);
console.log(JSON.stringify({
  author_bound_files: boundFiles.length,
  preview_bound_files: previewBindings.length * 3,
  text_rows: prose.length,
  MD_JSON_equal: true,
  block_order: order,
  pixel_binding: pixelcheck,
}, null, 2));
