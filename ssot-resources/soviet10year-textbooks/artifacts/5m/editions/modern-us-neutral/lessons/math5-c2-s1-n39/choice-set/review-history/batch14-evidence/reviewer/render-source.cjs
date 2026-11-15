const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { pathToFileURL } = require("node:url");

delete process.env.PWDEBUG;
delete process.env.DEBUG;
process.env.PLAYWRIGHT_HTML_OPEN = "never";

const out = __dirname;
const repo = process.cwd();
const seed = JSON.parse(fs.readFileSync(path.join(out, "seed.json"), "utf8"));
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const { chromium } = require(require.resolve("playwright", { paths: ["app", ".agents/skills"] }));
const executablePath = "/Users/yong/Library/Caches/ms-playwright/chromium-1228/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing";

async function main() {
  const records = [];
  fs.mkdirSync(path.join(out, "figure-previews"), { recursive: true });
  const browser = await chromium.launch({ executablePath, headless: true });
  try {
    for (const figure of seed.figures) {
      for (const asset of figure.assets) {
        const file = path.resolve(repo, asset.path);
        if (path.extname(file) !== ".svg" || hash(file) !== asset.sha256) throw new Error("Invalid actual source asset");
        const context = await browser.newContext({ viewport: { width: 1800, height: 1500 } });
        try {
          await context.route(/^https?:/, (route) => route.abort());
          const page = await context.newPage();
          await page.goto(pathToFileURL(file).href);
          const canvas = await page.evaluate(() => {
            const svg = document.documentElement;
            const box = svg.viewBox.baseVal;
            if (!(box.width > 0 && box.height > 0)) throw new Error("Invalid full SVG canvas");
            const width = 1800;
            const height = Math.ceil(width * box.height / box.width);
            svg.style.width = `${width}px`;
            svg.style.height = `${height}px`;
            svg.style.display = "block";
            svg.style.background = "white";
            return { width, height, viewBox: [box.x, box.y, box.width, box.height] };
          });
          await page.setViewportSize({ width: canvas.width, height: canvas.height });
          const preview = path.join(out, "figure-previews", `${figure.id}-full.png`);
          await page.locator("svg").screenshot({ path: preview });
          records.push({
            figure_id: figure.id, asset_path: asset.path, asset_sha256: hash(file),
            preview_path: path.relative(repo, preview), preview_sha256: hash(preview),
            full_canvas: canvas,
          });
        } finally {
          await context.close();
        }
      }
    }
  } finally {
    await browser.close();
  }
  const evidence = {
    executablePath, launch: { headless: true, persistent_profile: false, cdp: false },
    PWDEBUG: "deleted", DEBUG: "deleted", PLAYWRIGHT_HTML_OPEN: "never",
    network: "HTTP/HTTPS aborted", browser_closed: true, contexts_closed: true,
    figures: records,
  };
  fs.writeFileSync(path.join(out, "render-evidence.json"), `${JSON.stringify(evidence, null, 2)}\n`);
  console.log(JSON.stringify(evidence, null, 2));
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
