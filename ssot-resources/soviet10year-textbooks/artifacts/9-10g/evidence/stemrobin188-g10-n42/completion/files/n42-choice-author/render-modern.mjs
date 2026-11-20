import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const repo = "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck";
if (fs.realpathSync(process.cwd()) !== repo) throw new Error("Wrong cwd");
const out = path.join(repo, ".intentfold/tickets/STEMROBIN-188/tmp/n42-choice-author");
const require = createRequire(path.join(repo, "app/package.json"));
const { chromium } = require("playwright-core");
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
  for (const number of ["01", "02"]) {
    const source = path.join(
      repo,
      `ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/figures/fig-g10-${number}.svg`,
    );
    await page.goto(`file://${source}`);
    const svg = page.locator("svg").first();
    await svg.waitFor({ state: "visible" });
    const box = await svg.boundingBox();
    if (!box || box.width <= 0 || box.height <= 0) throw new Error("Blank SVG");
    const target = path.join(out, `modern-fig-g10-${number}-complete.png`);
    await svg.screenshot({ path: target });
    console.log(JSON.stringify({ source, screenshot: target, svg_box: box }));
  }
} finally {
  await browser.close();
}
