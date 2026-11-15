import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

delete process.env.PWDEBUG;
process.env.PLAYWRIGHT_HTML_OPEN = "never";
const { chromium } = await import(pathToFileURL(resolve(
  ".agents/skills/node_modules/playwright-core/index.mjs",
)).href);
const root = ".intentfold/tickets/STEMROBIN-182/tmp/6a-n28";
const seed = JSON.parse(readFileSync(`${root}/seed.json`, "utf8"));
const hash = (path) => createHash("sha256").update(readFileSync(path)).digest("hex");
const executablePath = chromium.executablePath();
const figures = [];
let browser;
let context;
try {
  browser = await chromium.launch({ executablePath, headless: true });
  context = await browser.newContext({ viewport: { width: 1024, height: 1024 }, deviceScaleFactor: 1 });
  await context.route("**/*", (route) => route.abort());
  const page = await context.newPage();
  for (const figure of seed.figures) {
    const asset = figure.assets.find(({ path }) => path.endsWith(".svg"));
    if (!asset) throw new Error("Expected declared actual SVG.");
    await page.setContent(
      `<html><head><style>html,body{margin:0;padding:0;background:white;}svg{width:1024px;height:auto;display:block;}</style></head><body>${readFileSync(asset.path, "utf8")}</body></html>`,
    );
    await page.evaluate(() => document.fonts.ready);
    const bounds = await page.locator("svg").evaluate((svg) => ({
      width: svg.getBoundingClientRect().width,
      height: svg.getBoundingClientRect().height,
      viewBox: svg.getAttribute("viewBox"),
      labels: [...svg.querySelectorAll("text")].map((label) => label.textContent),
    }));
    await page.setViewportSize({ width: 1024, height: Math.max(640, Math.ceil(bounds.height)) });
    const screenshot = `${root}/${figure.id}-complete.png`;
    await page.screenshot({ path: screenshot, fullPage: true });
    const source = `ssot-resources/soviet10year-textbooks/artifacts/6a/figures/${figure.id}.png`;
    figures.push({
      figure_id: figure.id,
      source_png: { path: source, sha256: hash(source) },
      actual_svg: { path: asset.path, sha256: hash(asset.path) },
      screenshot: { path: screenshot, sha256: hash(screenshot) },
      bounds,
    });
  }
} finally {
  if (context) await context.close();
  if (browser) await browser.close();
}
const result = {
  figures,
  launch: { executablePath, headless: true, persistentProfile: false, CDP: false },
  browser_closed: true,
  context_closed: true,
  external_requests_blocked: true,
  PWDEBUG: null,
  html_report_open: "never",
  user_ui_accessed: false,
};
writeFileSync(`${root}/figure-observation-machine.json`, `${JSON.stringify(result, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify(result, null, 2));
