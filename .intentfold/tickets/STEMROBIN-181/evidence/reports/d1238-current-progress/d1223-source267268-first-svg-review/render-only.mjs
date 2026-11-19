import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const cwd = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
assert.equal(process.cwd(), cwd);
const require = createRequire(import.meta.url);
const packageRoot = path.join(cwd, ".claude/skills/ld-s10y-lesson/node_modules/@resvg/resvg-js");
const { Resvg } = require(packageRoot);
const rendererVersion = require(path.join(packageRoot, "package.json")).version;
const owned = path.dirname(new URL(import.meta.url).pathname);
const ticketTmp = path.dirname(owned);
const manifestPath = path.join(ticketTmp, "d1217-source267268-first-vectorize/report.json");
const hash = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const bind = (file) => {
  const bytes = fs.readFileSync(file);
  return { path: file, sha256: hash(bytes), bytes: bytes.length };
};
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const inventoryPath = path.join(owned, "independent-inventory.json");
const inventory = JSON.parse(fs.readFileSync(inventoryPath, "utf8"));
assert.equal(manifest.status, "FIRST-VECTORIZE-PASS");
assert.deepEqual(manifest.outputs.map((entry) => entry.page), [267, 268]);
const outputs = [];

for (const entry of manifest.outputs) {
  const bindings = {};
  for (const role of ["source", "png", "svg", "receipt"]) {
    bindings[role] = bind(entry[role].path);
    assert.equal(bindings[role].sha256, entry[role].sha256, `${entry.page} ${role}`);
  }
  const source = inventory.pages.find((item) => item.page === entry.page);
  bindings.original_approved_crop = bind(source.crop_path);
  assert.equal(bindings.original_approved_crop.sha256, source.crop_sha256);
  assert.equal(bindings.original_approved_crop.sha256, bindings.png.sha256);
  assert.equal(bindings.source.sha256, bindings.png.sha256);
  const png = fs.readFileSync(entry.png.path);
  const dimensions = [png.readUInt32BE(16), png.readUInt32BE(20)];
  assert.deepEqual(dimensions, source.actual_file_dimensions);
  const receipt = JSON.parse(fs.readFileSync(entry.receipt.path, "utf8"));
  assert.equal(receipt.page, entry.page);
  assert.equal(receipt.exitCode, 0);
  const options = { fitTo: { mode: "original" }, background: "#ffffff", font: { loadSystemFonts: false } };
  const renderer = new Resvg(fs.readFileSync(entry.svg.path), options);
  const externalImages = renderer.imagesToResolve();
  assert.equal(externalImages.length, 0);
  const rendered = renderer.render();
  assert.deepEqual([rendered.width, rendered.height], dimensions);
  const pixels = rendered.pixels;
  let count = 0;
  let minX = rendered.width;
  let minY = rendered.height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < rendered.height; y += 1) {
    for (let x = 0; x < rendered.width; x += 1) {
      const offset = 4 * (y * rendered.width + x);
      if (pixels[offset] < 128 && pixels[offset + 1] < 128 && pixels[offset + 2] < 128) {
        count += 1;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }
  assert.ok(count > 0);
  const renderPath = path.join(owned, `source${entry.page}-svg-full-resolution.png`);
  fs.writeFileSync(renderPath, rendered.asPng(), { flag: "wx" });
  outputs.push({
    page: entry.page,
    bindings,
    png_dimensions: dimensions,
    rendered_dimensions: [rendered.width, rendered.height],
    render: bind(renderPath),
    options,
    external_images_to_resolve: externalImages,
    dark_pixels: count,
    threshold: "All RGB channels less than 128 on a white background.",
    dark_pixel_bbox_inclusive: [minX, minY, maxX, maxY],
    dark_pixel_clearance: { left: minX, top: minY, right: rendered.width - 1 - maxX, bottom: rendered.height - 1 - maxY },
    native_receipt_exit_code_reused: receipt.exitCode,
    png_sha256_unchanged_after_render: bind(entry.png.path).sha256 === bindings.png.sha256,
    svg_sha256_unchanged_after_render: bind(entry.svg.path).sha256 === bindings.svg.sha256
  });
}

const result = {
  schema: "source267268-first-svg-render-receipt/v1",
  ticket: "STEMROBIN-181",
  date: "2026-11-19",
  cwd,
  write_root: owned,
  status: "RENDERED_FOR_INDEPENDENT_VISUAL_REVIEW_NOT_APPROVAL",
  renderer: { package: "@resvg/resvg-js", version: rendererVersion, package_root: packageRoot },
  script: bind(new URL(import.meta.url).pathname),
  input_manifest: bind(manifestPath),
  independent_crop_inventory: bind(inventoryPath),
  outputs,
  svg_render_calls: 2,
  native_vectorize_calls: 0,
  native_finalize_calls: 0,
  context_image_opens_by_script: 0,
  note: "Byte-only hash/dimension reads and numerical RGBA inspection do not load image payloads into model context. No source or generated SVG bytes were modified."
};
const receiptPath = path.join(owned, "render-receipt.json");
fs.writeFileSync(receiptPath, `${JSON.stringify(result, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ receipt: bind(receiptPath), outputs: outputs.map(({ page, render, rendered_dimensions, dark_pixel_clearance }) => ({ page, render, rendered_dimensions, dark_pixel_clearance })) }, null, 2));
