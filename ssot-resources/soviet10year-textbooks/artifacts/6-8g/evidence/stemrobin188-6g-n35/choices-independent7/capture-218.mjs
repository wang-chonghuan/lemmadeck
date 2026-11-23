import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const root = "/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188";
assert.equal(process.cwd(), root);
const owned = join(root, ".intentfold/tickets/STEMROBIN-188/tmp/n35-choice-independent7");
const asset = join(root, "ssot-resources/soviet10year-textbooks/artifacts/6-8g/editions/modern-us-neutral/figures/fig-218.svg");
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const assetBytes = await readFile(asset);
const assetHash = sha256(assetBytes);
assert.equal(assetHash, "1641c74779d32ecd40817bf218eb08eb9c2e193583c9d40ae9adf0c43e361ad6");
const { chromium } = await import(pathToFileURL(join(root, ".agents/skills/node_modules/playwright-core/index.mjs")).href);
const receipt = {
  cwd: root,
  asset_path: asset,
  asset_sha256: assetHash,
  headless: false,
  offline: true,
  only_document: "about:blank with the unchanged fig-218 SVG inline",
  prior_failure_receipt: join(owned, "fig-218-capture.json"),
  prior_failure_receipt_sha256: "6ee1b317d0a0b4f6e3d548613bfd7e15bfcf358f11b954dfa69799e39e9b6d24",
  renderer_replay: false,
  screenshot_count: 0,
  model_image_opens_at_capture: 0,
  non_file_requests: [],
  browser_closed: false,
  status: "incomplete"
};
let browser;
try {
  browser = await chromium.launch({
    channel: "chrome",
    headless: false,
    args: ["--disable-background-networking", "--disable-component-update", "--disable-sync"]
  });
  const context = await browser.newContext({
    offline: true,
    serviceWorkers: "block",
    viewport: { width: 1200, height: 900 },
    deviceScaleFactor: 1
  });
  await context.route("**/*", async (route) => {
    if (route.request().url().startsWith("file:")) {
      await route.continue();
    } else {
      receipt.non_file_requests.push(route.request().url());
      await route.abort();
    }
  });
  const page = await context.newPage();
  await page.setContent("<!doctype html><html><head><meta charset=\"utf-8\"></head><body style=\"margin:0;background:white\">" + assetBytes.toString("utf8") + "</body></html>", { waitUntil: "load" });
  assert.equal(page.url(), "about:blank");
  receipt.document_dimensions = await page.evaluate(() => {
    const svg = document.querySelector("svg");
    if (!svg || document.querySelectorAll("svg").length !== 1) throw new Error("Expected exactly one SVG");
    const rect = svg.getBoundingClientRect();
    return {
      tag: svg.localName,
      width: rect.width,
      height: rect.height,
      viewBox: svg.getAttribute("viewBox"),
      scrollWidth: svg.scrollWidth,
      scrollHeight: svg.scrollHeight
    };
  });
  const { width, height } = receipt.document_dimensions;
  if (width > 1200 || height > 900) {
    await page.setViewportSize({
      width: Math.ceil(Math.max(1200, width)),
      height: Math.ceil(Math.max(900, height))
    });
  }
  const screenshot = join(owned, "fig-218-headed-offline.png");
  await page.screenshot({ path: screenshot, fullPage: true });
  receipt.screenshot_count = 1;
  receipt.screenshot_path = screenshot;
  receipt.screenshot_sha256 = sha256(await readFile(screenshot));
  assert.equal(receipt.non_file_requests.length, 0);
  receipt.status = "captured";
} catch (error) {
  receipt.status = "execution_failed";
  receipt.error = String(error);
  process.exitCode = 2;
} finally {
  if (browser) {
    await browser.close();
    receipt.browser_closed = !browser.isConnected();
  }
  await writeFile(join(owned, "fig-218-capture-retry.json"), JSON.stringify(receipt, null, 2) + "\n", { flag: "wx" });
  console.log(JSON.stringify(receipt, null, 2));
}
