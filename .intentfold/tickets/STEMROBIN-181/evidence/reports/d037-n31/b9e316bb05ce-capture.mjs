import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const evidence = dirname(fileURLToPath(import.meta.url));
const workspace = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const author = join(dirname(evidence), "d037-10p-source88-91-author");
const digest = (path) => createHash("sha256").update(readFileSync(path)).digest("hex");
const record = (path) => ({ path: resolve(path), sha256: digest(path) });
const markdown = (path) => {
  const match = readFileSync(path, "utf8").match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  assert.ok(match, `Expected JSON frontmatter: ${path}`);
  return { meta: JSON.parse(match[1]), body: match[2] };
};
const freezePath = join(author, "author-freeze.json");
const freeze = JSON.parse(readFileSync(freezePath, "utf8"));
assert.deepEqual(freeze.pages.map(({ page }) => page), [88, 89, 90, 91]);
const files = new Map();
const bind = (path, expected) => {
  const entry = record(path);
  if (expected) assert.equal(entry.sha256, expected, `Frozen hash drift: ${path}`);
  files.set(entry.path, entry);
  return entry;
};
const walk = (directory) => {
  for (const item of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, item.name);
    if (item.isDirectory()) walk(path);
    else if (item.isFile()) bind(path);
    else throw new Error(`Unexpected non-file in frozen outputs: ${path}`);
  }
};
bind(freezePath);
bind(join(author, "input-freeze.json"));
bind(join(author, "finalize.mjs"));
const pageBindings = [];
for (const page of freeze.pages) {
  bind(page.candidate.path, page.candidate.sha256);
  for (const item of page.prepared) bind(item.path, item.sha256);
  const folder = String(page.page).padStart(4, "0");
  const outputDirectory = join(author, "root/10p/pages", folder);
  const workDirectory = join(author, "work/10p/pages", folder);
  const receiptPath = join(author, `finalize-${page.page}.json`);
  const receipt = JSON.parse(readFileSync(receiptPath, "utf8"));
  const auditPath = join(outputDirectory, "audit.json");
  const audit = JSON.parse(readFileSync(auditPath, "utf8"));
  assert.deepEqual(receipt, freeze.nativeResults.find((item) => item.page === page.page));
  assert.equal(receipt.exitCode, 0);
  assert.equal(audit.lines_printed, audit.lines_md);
  assert.deepEqual(audit.errors, []);
  assert.deepEqual(audit.normalizations, []);
  assert.deepEqual(audit.unknown_chars, []);
  assert.deepEqual(audit.katex_warnings, []);
  bind(receiptPath);
  const candidate = markdown(page.candidate.path);
  const finalized = markdown(join(outputDirectory, "page.md"));
  assert.deepEqual(finalized.meta, {
    ...candidate.meta,
    printed_lines: audit.lines_printed,
    figures: audit.figures.map(({ id, label, box }) => ({ id, label, box })),
    provenance: { cap: "1", normalized: true },
  });
  let expectedBody = candidate.body;
  for (const figure of audit.figures) {
    const originalMarker = `<!-- fig ${figure.label} box ${figure.from.join(",")} -->`;
    const finalMarker = `<!-- fig ${figure.label} box ${figure.box.join(",")} -->\n![${figure.label}](figures/${figure.id}.png)`;
    assert.equal(expectedBody.split(originalMarker).length, 2);
    expectedBody = expectedBody.replace(originalMarker, finalMarker);
  }
  assert.equal(finalized.body, expectedBody, `Unexpected finalized body change: ${page.page}`);
  for (const prepared of page.prepared) {
    const name = prepared.path.split("/").at(-1);
    assert.equal(digest(join(workDirectory, name)), prepared.sha256);
  }
  walk(outputDirectory);
  walk(workDirectory);
  pageBindings.push({
    page: page.page,
    candidate: record(page.candidate.path),
    original: record(page.prepared.find((item) => item.path.endsWith("/page.png")).path),
    finalizedMarkdown: record(join(outputDirectory, "page.md")),
    finalizedJson: record(join(outputDirectory, "page.json")),
    audit: record(auditPath),
    receipt: record(receiptPath),
    linesPrinted: audit.lines_printed,
    linesMarkdown: audit.lines_md,
    normalizationCount: audit.normalizations.length,
  });
}
const crops = [
  { page: 89, name: "p0089-fuel-cell-row.png", box: [180, 1520, 1380, 1640] },
  { page: 90, name: "p0090-ionized-gas-row.png", box: [160, 200, 1370, 355] },
  { page: 91, name: "p0091-rotor-punctuation-row.png", box: [180, 155, 1390, 250] },
];
for (const crop of crops) {
  const source = pageBindings.find((item) => item.page === crop.page).original;
  const output = join(evidence, crop.name);
  const result = spawnSync(join(workspace, ".claude/skills/ld-s10y-lesson/.venv/bin/python"), [
    "-B", "-c",
    "import sys; from PIL import Image; image=Image.open(sys.argv[1]); image.crop(tuple(map(int,sys.argv[3:]))).save(sys.argv[2])",
    source.path, output, ...crop.box.map(String),
  ], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  crop.source = source;
  crop.output = record(output);
}
bind(fileURLToPath(import.meta.url));
const bindings = {
  schema: "stemrobin-181/source-review-bindings@1",
  capturedAt: new Date().toISOString(),
  authority: "Frozen original pages and author outputs; existing finalize receipts consumed, not rerun.",
  freeze: record(freezePath),
  freezeChecks: "All 20 declared candidate/prepared hashes match; finalized Markdown differs only by explicit standard metadata and the recorded snapped figure marker/image link; copied work inputs match; receipts equal author-freeze nativeResults.",
  pageBindings,
  files: [...files.values()].sort((a, b) => a.path.localeCompare(b.path)),
  crops,
  figure57: record(join(author, "work/10p/pages/0091/figures/fig-57.png")),
};
const manifest = join(evidence, "bindings.json");
assert.equal(existsSync(manifest), false, "Do not replace an existing evidence snapshot.");
writeFileSync(manifest, `${JSON.stringify(bindings, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ manifest: record(manifest), freeze: bindings.freeze, pages: pageBindings, figure57: bindings.figure57, crops }, null, 2));
