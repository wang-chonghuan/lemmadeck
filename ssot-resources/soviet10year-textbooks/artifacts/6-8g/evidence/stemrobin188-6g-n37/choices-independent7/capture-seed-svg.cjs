const fs = require("node:fs/promises");
const path = require("node:path");
const { createHash } = require("node:crypto");
const { createRequire } = require("node:module");
const { pathToFileURL } = require("node:url");

const W = "/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188";
const own = path.join(W, ".intentfold/tickets/STEMROBIN-188/tmp/n37-choices-independent7");
const seedPath = path.join(W, ".intentfold/tickets/STEMROBIN-188/tmp/n37-choices7/seed.json");
const expectedDigest = "50d4be02cf0dba4e990514fddadc3c9f7268e54d39e174a86e86ef1ff9d5b02d";
const runtimeRequire = createRequire(path.join(W, ".agents/skills/package.json"));
const { chromium } = runtimeRequire("playwright-core");
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const canonicalize = (value) => {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
  }
  return value;
};
const canonicalDigest = (value) => hash(
  JSON.stringify(canonicalize(value)).replace(/[\u007f-\uffff]/g, (char) =>
    "\\u" + char.charCodeAt(0).toString(16).padStart(4, "0"))
);

async function main() {
  if (process.cwd() !== W) throw new Error("Wrong working directory");
  await fs.mkdir(path.join(own, "runtime"), { recursive: true });
  process.env.TMPDIR = path.join(own, "runtime");
  const seedBytes = await fs.readFile(seedPath);
  const seed = JSON.parse(seedBytes);
  if (canonicalDigest(seed) !== expectedDigest) throw new Error("Canonical seed digest drift");
  const receipt = {
    schema: "n37-source-svg-capture-v1",
    cwd: process.cwd(),
    script_path: __filename,
    seed_path: seedPath,
    seed_canonical_sha256: expectedDigest,
    seed_file_sha256: hash(seedBytes),
    scope: "Single capture of the three current seed SVGs; not a figure approval or product test",
    isolated: true,
    headless: true,
    network_requests: [],
    captures: [],
    browser_closed: false,
    exit_code: null,
    failures: [],
    started_at: new Date().toISOString()
  };
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 1280, height: 1000 },
      deviceScaleFactor: 1
    });
    await context.route("**/*", async (route) => {
      const url = route.request().url();
      if (url.startsWith("file:") || url.startsWith("data:")) return route.continue();
      receipt.network_requests.push(url);
      return route.abort();
    });
    for (const id of ["fig-229", "fig-230", "fig-231"]) {
      const figure = seed.figures.find((item) => item.id === id);
      if (!figure || figure.assets.length !== 1) throw new Error("Unexpected asset set for " + id);
      const asset = figure.assets[0];
      if (!asset.path.endsWith(".svg")) throw new Error("Not a seed SVG");
      const assetPath = path.resolve(W, asset.path);
      if (!assetPath.startsWith(W + "/ssot-resources/")) throw new Error("Asset outside seed resource scope");
      const bytes = await fs.readFile(assetPath);
      if (hash(bytes) !== asset.sha256) throw new Error("Asset hash drift: " + id);
      const page = await context.newPage();
      await page.goto(pathToFileURL(assetPath).href, { waitUntil: "load" });
      const dimensions = await page.locator("svg").evaluate((svg) => {
        const viewBox = svg.viewBox.baseVal;
        const bbox = svg.getBBox();
        return {
          width: Number(svg.getAttribute("width")) || viewBox.width,
          height: Number(svg.getAttribute("height")) || viewBox.height,
          viewBox: { x: viewBox.x, y: viewBox.y, width: viewBox.width, height: viewBox.height },
          content_bounds: { x: bbox.x, y: bbox.y, width: bbox.width, height: bbox.height }
        };
      });
      if (!(dimensions.width > 0 && dimensions.height > 0)) throw new Error("Unreadable SVG dimensions");
      await page.setViewportSize({
        width: Math.ceil(dimensions.width),
        height: Math.ceil(dimensions.height)
      });
      const screenshotPath = path.join(own, id + ".png");
      await page.locator("svg").screenshot({ path: screenshotPath });
      receipt.captures.push({
        figure_id: id,
        asset_path: assetPath,
        asset_sha256: asset.sha256,
        screenshot_path: screenshotPath,
        screenshot_sha256: hash(await fs.readFile(screenshotPath)),
        dimensions,
        asset_navigation_count: 1,
        screenshot_count: 1
      });
      await page.close();
    }
    await context.close();
    receipt.exit_code = 0;
  } catch (error) {
    receipt.failures.push({ name: error.name, message: error.message });
    receipt.exit_code = 1;
    process.exitCode = 1;
  } finally {
    if (browser) {
      await browser.close();
      receipt.browser_closed = true;
    }
    receipt.finished_at = new Date().toISOString();
    const receiptPath = path.join(own, "capture-receipt.json");
    await fs.writeFile(receiptPath, JSON.stringify(receipt, null, 2) + "\n", { flag: "wx" });
    console.log(JSON.stringify(receipt, null, 2));
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
