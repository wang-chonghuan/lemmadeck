import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = "/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188";
assert.equal(process.cwd(), root);
const require = createRequire(resolve(root, "app/package.json"));
const { chromium } = require("playwright");
const asset = resolve(root, "ssot-resources/soviet10year-textbooks/artifacts/6-8g/editions/modern-us-neutral/figures/fig-218.svg");
const output = resolve(root, ".intentfold/tickets/STEMROBIN-188/tmp/n35-choices7/fig218-headed.png");
const hash = createHash("sha256").update(await readFile(asset)).digest("hex");
assert.equal(hash, "1641c74779d32ecd40817bf218eb08eb9c2e193583c9d40ae9adf0c43e361ad6");
const browser = await chromium.launch({ headless: false });
let result;
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 960 },
    offline: true,
    serviceWorkers: "block",
  });
  await context.route(/https?:\/\//, route => route.abort());
  const page = await context.newPage();
  await page.goto(pathToFileURL(asset).href, { waitUntil: "load" });
  const bounds = await page.locator("svg").evaluate(svg => {
    const r = svg.getBoundingClientRect();
    return {
      x: r.x, y: r.y, width: r.width, height: r.height,
      pageWidth: document.documentElement.scrollWidth,
      pageHeight: document.documentElement.scrollHeight,
      viewportWidth: innerWidth, viewportHeight: innerHeight,
    };
  });
  assert.ok(bounds.width > 0 && bounds.height > 0);
  assert.ok(bounds.x >= 0 && bounds.y >= 0);
  assert.ok(bounds.x + bounds.width <= bounds.pageWidth);
  assert.ok(bounds.y + bounds.height <= bounds.pageHeight);
  await page.screenshot({ path: output, fullPage: true });
  result = { cwd: process.cwd(), asset, asset_sha256: hash, screenshot: output, bounds, headed: true, offline: true, screenshot_count: 1 };
} finally {
  await browser.close();
}
console.log(JSON.stringify({ ...result, browser_closed: true }, null, 2));
