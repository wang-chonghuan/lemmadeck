const fs = require("node:fs");
const crypto = require("node:crypto");
const cwd = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
const { chromium } = require(`${cwd}/.agents/skills/node_modules/playwright-core`);
const root = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n35-choice-author";
const source = "ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/figures/fig-54.svg";
const expected = "473153e455c3d9f177108177ed14f526f38a8528d2317275e653e888925daaad";
if (process.cwd() !== cwd) throw new Error("Wrong working directory");
const bytes = fs.readFileSync(source);
const hash = b => crypto.createHash("sha256").update(b).digest("hex");
if (hash(bytes) !== expected) throw new Error("Final SVG changed");
const output = `${root}/final-graph54-complete.png`;
if (fs.existsSync(output)) throw new Error("Complete final SVG rendition already exists");

(async () => {
  const context = await chromium.launchPersistentContext(`${cwd}/${root}/svg-view-profile`, {
    channel: "chrome", headless: true, serviceWorkers: "block",
    viewport: { width: 640, height: 360 }
  });
  try {
    await context.route("**/*", route => route.abort());
    const page = context.pages()[0] || await context.newPage();
    await page.setContent(bytes.toString("utf8"));
    await page.addStyleTag({ content: "html,body{margin:0;padding:0;background:white}svg{display:block}" });
    const size = await page.locator("svg").evaluate(svg => ({
      width: Math.ceil(svg.getBoundingClientRect().width),
      height: Math.ceil(svg.getBoundingClientRect().height)
    }));
    await page.setViewportSize(size);
    await page.screenshot({ path: output, fullPage: true });
    const receipt = {
      schema: "n35-final-svg-rendition-v1",
      source_path: source, source_sha256: expected,
      complete_rendition_path: output,
      complete_rendition_sha256: hash(fs.readFileSync(output)),
      size, full_page: true, external_requests_aborted: true,
      purpose: "View the unchanged actual final SVG, not an authored alternative diagram."
    };
    fs.writeFileSync(`${root}/final-graph54-rendition.json`, `${JSON.stringify(receipt, null, 2)}\n`, { flag: "wx" });
    console.log(JSON.stringify(receipt, null, 2));
  } finally {
    await context.close();
  }
})().catch(e => { console.error(e.message); process.exitCode = 2; });
