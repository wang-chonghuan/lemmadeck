import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
delete process.env.PWDEBUG;
process.env.PLAYWRIGHT_HTML_OPEN = "never";
const require = createRequire(`${path.resolve(".agents/skills")}/package.json`);
const { chromium } = require("playwright-core");
const directory = ".intentfold/tickets/STEMROBIN-182/tmp/reviewer-6a-n32";
const seedPath = ".intentfold/tickets/STEMROBIN-182/tmp/6a-n32/seed.json";
const seed = JSON.parse(fs.readFileSync(seedPath, "utf8"));
const sha = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const output = `${directory}/source-asset-observations.json`;
if (fs.existsSync(output)) throw new Error("Source asset evidence already saved.");
const chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const executablePath = fs.existsSync(chrome) ? chrome : chromium.executablePath();
assert.ok(fs.existsSync(executablePath));
let browser;
let closedFinally = false;
const observations = [];
try {
  browser = await chromium.launch({ executablePath, headless: true });
  const context = await browser.newContext({ viewport: { width: 1000, height: 800 }, deviceScaleFactor: 1 });
  await context.route("**/*", (route) => route.abort());
  const page = await context.newPage();
  for (const figure of seed.figures) {
    for (const asset of figure.assets) {
      assert.equal(sha(asset.path), asset.sha256);
      const svg = fs.readFileSync(asset.path, "utf8");
      const nativeWidth = Number(svg.match(/\bwidth="([^"]+)"/)?.[1]);
      assert.ok(Number.isFinite(nativeWidth));
      await page.setContent(`<!doctype html><html><head><style>html,body{margin:0;background:white}#media>svg{display:block;width:1000px;height:auto;max-width:none}</style></head><body><div id="media">${svg}</div></body></html>`);
      await page.evaluate(() => document.fonts.ready);
      const geometry = await page.evaluate(() => {
        const svg = document.querySelector("#media>svg");
        return {
          viewBox: svg.getAttribute("viewBox"),
          renderedWidth: svg.getBoundingClientRect().width,
          renderedHeight: svg.getBoundingClientRect().height,
          text: [...svg.querySelectorAll("text")].map((node) => {
            const box = node.getBBox();
            return { text: node.textContent, x: box.x, y: box.y, width: box.width, height: box.height };
          }),
        };
      });
      const screenshot = `${directory}/${figure.id}-full-1000.png`;
      await page.locator("#media").screenshot({ path: screenshot });
      observations.push({ figure_id: figure.id, asset_path: asset.path, asset_sha256: sha(asset.path), nativeWidth, geometry, screenshot: { path: screenshot, sha256: sha(screenshot) } });
    }
  }
  await context.close();
} finally {
  if (browser) {
    await browser.close();
    closedFinally = true;
  }
}
fs.writeFileSync(output, JSON.stringify({
  stage: "actual_seed_asset_before_view",
  seed_byte_sha256: sha(seedPath),
  reviewer: { kind: "independent_agent", identity: "STEMROBIN-182-Session-A-independent-6a-n32" },
  browser: { executablePath, headless: true, isolatedNonpersistent: true, PWDEBUG: "unset_before_import", PLAYWRIGHT_HTML_OPEN: "never", networkAborted: true, userWindowOrTabAccess: false, closedFinally },
  observations,
  model: null,
  usage: null,
}, null, 2) + "\n", { flag: "wx" });
console.log(JSON.stringify({ output, observations, closedFinally }, null, 2));
