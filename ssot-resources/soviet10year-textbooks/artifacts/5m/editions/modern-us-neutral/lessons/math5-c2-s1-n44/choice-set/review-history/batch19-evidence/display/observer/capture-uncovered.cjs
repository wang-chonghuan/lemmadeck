const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const readline = require("node:readline");
const { pathToFileURL } = require("node:url");
const { chromium } = require("/Users/yong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

delete process.env.PWDEBUG;
delete process.env.PWTEST_CLI_IS_UNDER_TEST;
process.env.PLAYWRIGHT_HTML_OPEN = "never";
const root = __dirname;
const repo = path.resolve(root, "../../../../..");
const htmlRoot = path.join(repo, ".tmp/ld-s10y-lesson/render/5m/modern-us-neutral/math5-c2-s1-n44");
const expected = {
  text: "1b9f12bd07aef550e86e47a47ac12ac2850e063aa3cebd99e5306844ae9eff6b",
  exercises: "a960ac2a5194ab0422f1e7fc214afa37e994c3ae1b89bff2bd83e0d680a8f70c",
  choices: "44dce62df28b62d8e5cac32e43e968facedc0392241277d5860dac613522f758",
};
const sha = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const hashes = {};
for (const surface of Object.keys(expected)) {
  const file = path.join(htmlRoot, `${surface}.html`);
  hashes[surface] = { path: file, before: sha(file) };
  if (hashes[surface].before !== expected[surface]) throw new Error(`HTML binding changed: ${surface}`);
}

(async () => {
  let browser;
  const contexts = [];
  const pages = {};
  const evidence = { hashes, headless: true, isolated: true, PWDEBUG_cleared: true, captures: [], browser_closed: false };
  try {
    browser = await chromium.launch({ headless: true });
    const geometry = {};
    for (const width of [1440, 390]) {
      for (const surface of ["text", "exercises", "choices"]) {
        const key = `${surface}-${width}`;
        const context = await browser.newContext({ viewport: { width, height: width === 1440 ? 960 : 844 }, deviceScaleFactor: 1 });
        contexts.push(context);
        await context.route("**/*", route => {
          const url = route.request().url();
          if (url === pathToFileURL(hashes[surface].path).href || url.startsWith("data:")) return route.continue();
          return route.abort();
        });
        const page = await context.newPage();
        pages[key] = page;
        await page.goto(pathToFileURL(hashes[surface].path).href, { waitUntil: "load" });
        await page.evaluate(() => document.fonts.ready);
        geometry[key] = await page.evaluate(() => {
          const rect = e => {
            const r = e.getBoundingClientRect();
            return { x: r.x + scrollX, y: r.y + scrollY, width: r.width, height: r.height };
          };
          const item = e => ({
            tag: e.tagName, id: e.id, class: e.className?.baseVal ?? e.className,
            text: e.tagName === "svg" ? undefined : e.innerText?.slice(0, 260),
            rect: rect(e), clientWidth: e.clientWidth, scrollWidth: e.scrollWidth,
          });
          return {
            documentHeight: document.documentElement.scrollHeight,
            nodes: [...document.querySelectorAll("h1,.crumb,p.para,.figcap,.jump,li.ex,.choice-heading,.choice-stem,.choice-options>li,.figure-media,.nb,.sr-nb")].map(item),
            tables: document.querySelectorAll("table").length,
            exerciseChildren: [...document.querySelectorAll("li.ex")].map(e => ({
              id: e.id,
              children: [...e.querySelectorAll(".body > *")].map(item),
            })),
          };
        });
      }
    }
    const geometryFile = path.join(root, "supplement-geometry.json");
    const geometryBytes = JSON.stringify(geometry, null, 2) + "\n";
    if (fs.existsSync(geometryFile)) {
      if (fs.readFileSync(geometryFile, "utf8") !== geometryBytes) throw new Error("Geometry changed before capture");
    } else {
      fs.writeFileSync(geometryFile, geometryBytes);
    }
    let planPath = process.argv[2];
    if (!planPath) {
      console.log("GEOMETRY_READY; send capture-plan.json absolute path on stdin");
      const reader = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });
      planPath = await new Promise((resolve, reject) => {
        reader.once("line", resolve);
        reader.once("close", () => reject(new Error("Input closed before capture plan")));
      });
      reader.close();
    }
    if (path.dirname(path.resolve(planPath)) !== root) throw new Error("Plan outside owned directory");
    const plan = JSON.parse(fs.readFileSync(planPath, "utf8"));
    for (const capture of plan.captures) {
      if (!capture.reason || !capture.uncovered) throw new Error("Missing uncovered-region justification");
      const page = pages[capture.combination];
      if (!page) throw new Error("Unauthorized combination");
      if (!/^[a-zA-Z0-9_.-]+\.png$/.test(capture.filename)) throw new Error("Invalid output name");
      if (capture.scroll) {
        await page.locator(capture.scroll.selector).nth(capture.scroll.index ?? 0).evaluate((el, offset) => { el.scrollLeft = offset; }, capture.scroll.offset);
      }
      await page.evaluate(y => window.scrollTo(0, y), Math.max(0, capture.rect.y - 40));
      const clip = { ...capture.rect, y: capture.rect.y - await page.evaluate(() => scrollY) };
      const viewport = page.viewportSize();
      if (clip.x < 0 || clip.y < 0 || clip.x + clip.width > viewport.width || clip.y + clip.height > viewport.height) {
        throw new Error(`Capture exceeds same viewport: ${capture.filename} ${JSON.stringify(clip)}`);
      }
      const file = path.join(root, capture.filename);
      if (fs.existsSync(file)) throw new Error("No recapture / overwrite permitted");
      await page.screenshot({ path: file, clip });
      evidence.captures.push({ ...capture, path: file, sha256: sha(file), native: true, clip, observed_scrollY: await page.evaluate(() => scrollY) });
    }
  } finally {
    for (const context of contexts) await context.close();
    if (browser) {
      await browser.close();
      evidence.browser_closed = true;
    }
    for (const surface of Object.keys(expected)) {
      hashes[surface].after = sha(hashes[surface].path);
      hashes[surface].unchanged = hashes[surface].before === hashes[surface].after;
    }
    fs.writeFileSync(path.join(root, "supplement-capture-evidence.json"), JSON.stringify(evidence, null, 2) + "\n");
    console.log(JSON.stringify({ captures: evidence.captures.length, browser_closed: evidence.browser_closed, inputs_unchanged: Object.values(hashes).every(h => h.unchanged) }));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
