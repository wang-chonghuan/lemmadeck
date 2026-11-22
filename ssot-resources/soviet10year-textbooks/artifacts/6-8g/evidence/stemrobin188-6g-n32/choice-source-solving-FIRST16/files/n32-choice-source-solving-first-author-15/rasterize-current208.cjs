const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");
const { createRequire } = require("node:module");

const bundledRequire = createRequire(
  "/Users/yong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json",
);
const sharp = bundledRequire("sharp");
const source = path.resolve(
  "ssot-resources/soviet10year-textbooks/artifacts/6-8g/editions/modern-us-neutral/figures/fig-208.svg",
);
const expected = "971ee90792f601f7bcc221d92febbb8c6d95a3f2915ce310edb38544d343ada2";
const output = path.join(__dirname, "fig-208-current-full.png");
const digest = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");

async function main() {
  const bytes = await fs.readFile(source);
  if (digest(bytes) !== expected) throw new Error("Source SVG hash mismatch");
  if (process.argv[2] === "--white-background") {
    const raster = await fs.readFile(output);
    const rasterExpected = "7e0ee932cf45410b062bba880011962a047b70d2707a114d8e468f1f2e697225";
    if (digest(raster) !== rasterExpected) throw new Error("Existing raster hash mismatch");
    const whiteOutput = path.join(__dirname, "fig-208-current-full-white.png");
    const result = await sharp(raster).flatten({ background: "#ffffff" }).png().toFile(whiteOutput);
    const after = digest(await fs.readFile(source));
    if (after !== expected) throw new Error("Source SVG changed during background composition");
    console.log(JSON.stringify({
      operation: "White backing for existing complete raster; no SVG or geometry rerender",
      input: output,
      input_sha256: rasterExpected,
      source_sha256_after: after,
      output: whiteOutput,
      output_info: result,
      output_sha256: digest(await fs.readFile(whiteOutput)),
    }, null, 2));
    return;
  }
  const metadata = await sharp(bytes, { density: 144 }).metadata();
  const result = await sharp(bytes, { density: 144 }).png().toFile(output);
  const after = digest(await fs.readFile(source));
  if (after !== expected) throw new Error("Source SVG changed during rasterization");
  console.log(JSON.stringify({
    operation: "Full existing SVG rasterization; no geometry regeneration or crop",
    source,
    source_sha256_before: expected,
    source_sha256_after: after,
    runtime: bundledRequire.resolve("sharp"),
    density: 144,
    source_metadata: metadata,
    output,
    output_info: result,
    output_sha256: digest(await fs.readFile(output)),
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
