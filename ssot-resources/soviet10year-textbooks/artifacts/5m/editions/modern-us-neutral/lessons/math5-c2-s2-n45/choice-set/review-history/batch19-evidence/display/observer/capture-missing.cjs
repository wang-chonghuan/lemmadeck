const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { pathToFileURL } = require("node:url");
const { chromium } = require("/Users/yong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
delete process.env.PWDEBUG;
process.env.PLAYWRIGHT_HTML_OPEN = "never";
const root = __dirname;
const repo = path.resolve(root, "../../../../..");
const htmlRoot = path.join(repo, ".tmp/ld-s10y-lesson/render/5m/modern-us-neutral/math5-c2-s2-n45");
const expected = {
  text: "29864c179dc7eb0490a73a513461f1095eb9dc959f31647e69523227b74f2edc",
  exercises: "9534a02f9ae886cd2684c6ac6a9c2aa3639690457755ba589e42d721281c2323",
  choices: "a3fb6052416014f48656acd2989381a56a8b26f8f143c3f7c67a0fb3204e1910",
};
const sha = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const bindings = Object.fromEntries(Object.entries(expected).map(([surface, hash]) => {
  const file = path.join(htmlRoot, surface + ".html");
  if (sha(file) !== hash) throw new Error("HTML binding differs");
  return [surface, { path: file, before: hash }];
}));
(async () => {
  let browser;
  const contexts = [];
  const pages = {};
  const record = { headless: true, isolated_contexts: true, PWDEBUG_cleared: true, reports_open: "never", bindings, captures: [], browser_closed: false };
  try {
    browser = await chromium.launch({ headless: true });
    const geometry = {};
    for (const width of [1440, 390]) {
      for (const surface of ["text", "exercises", "choices"]) {
        const key = `${surface}-${width}`;
        const context = await browser.newContext({ viewport: { width, height: width === 1440 ? 960 : 844 }, deviceScaleFactor: 1 });
        contexts.push(context);
        const allowed = pathToFileURL(bindings[surface].path).href;
        await context.route("**/*", route => route.request().url() === allowed || route.request().url().startsWith("data:") ? route.continue() : route.abort());
        const page = await context.newPage();
        pages[key] = page;
        await page.goto(allowed, { waitUntil: "load" });
        await page.evaluate(() => document.fonts.ready);
        geometry[key] = await page.evaluate(() => {
          const rect = e => {
            const r = e.getBoundingClientRect();
            return { x: r.x + scrollX, y: r.y + scrollY, width: r.width, height: r.height };
          };
          const item = e => ({ tag: e.tagName, id: e.id, class: typeof e.className === "string" ? e.className : "", text: e.innerText ?? "", rect: rect(e), clientWidth: e.clientWidth, scrollWidth: e.scrollWidth });
          return {
            height: document.documentElement.scrollHeight,
            table_count: document.querySelectorAll("table").length,
            nodes: [...document.querySelectorAll("h1,.crumb,p.para,.figcap,.jump,li.ex,.choice-heading,.choice-stem,.choice-options>li,.figure-media,.nb,.sr-nb")].map(item),
            math_scrollers: [...document.querySelectorAll(".nb,.sr-nb")].map((e, index) => ({ ...item(e), index })),
            questions: [...document.querySelectorAll("section.choice")].map((e, index) => ({
              number: index + 1,
              heading: item(e.querySelector(".choice-heading")),
              stem: item(e.querySelector(".choice-stem")),
              options: [...e.querySelectorAll(".choice-options>li")].map(option => ({ ...item(option), label: option.querySelector(".option-id")?.innerText })),
            })),
          };
        });
      }
    }
    const file = path.join(root, "geometry.json");
    if (fs.existsSync(file)) throw new Error("Do not repeat the geometry/capture session");
    fs.writeFileSync(file, JSON.stringify(geometry, null, 2) + "\n");
    console.log("GEOMETRY_READY; waiting for owned capture-plan.json");
    const planFile = path.join(root, "capture-plan.json");
    await new Promise((resolve, reject) => {
      const start = Date.now();
      const timer = setInterval(() => {
        if (fs.existsSync(planFile)) { clearInterval(timer); resolve(); }
        else if (Date.now() - start > 1200000) { clearInterval(timer); reject(new Error("Capture-plan wait expired")); }
      }, 250);
    });
    const plan = JSON.parse(fs.readFileSync(planFile, "utf8"));
    for (const capture of plan.captures) {
      if (!capture.reason || !capture.uncovered || !pages[capture.combination]) throw new Error("Unauthorized capture");
      if (!/^[a-z0-9_.-]+\.png$/.test(capture.filename)) throw new Error("Invalid filename");
      const page = pages[capture.combination];
      if (capture.scroll) await page.locator(".nb,.sr-nb").nth(capture.scroll.index).evaluate((e, value) => { e.scrollLeft = value; }, capture.scroll.offset);
      await page.evaluate(y => scrollTo(0, y), Math.max(0, capture.rect.y - 20));
      const scrollY = await page.evaluate(() => window.scrollY);
      const clip = { ...capture.rect, y: capture.rect.y - scrollY };
      const vp = page.viewportSize();
      if (clip.x < 0 || clip.y < 0 || clip.x + clip.width > vp.width || clip.y + clip.height > vp.height) throw new Error("Clip exceeds authorized viewport: " + capture.filename);
      const output = path.join(root, capture.filename);
      if (fs.existsSync(output)) throw new Error("No repeat capture/overwrite");
      await page.screenshot({ path: output, clip });
      record.captures.push({ ...capture, path: output, sha256: sha(output), clip, scrollY });
    }
  } finally {
    for (const context of contexts) await context.close();
    if (browser) { await browser.close(); record.browser_closed = true; }
    for (const binding of Object.values(bindings)) { binding.after = sha(binding.path); binding.unchanged = binding.before === binding.after; }
    fs.writeFileSync(path.join(root, "capture-evidence.json"), JSON.stringify(record, null, 2) + "\n");
    console.log(JSON.stringify({ supplement_png_count: record.captures.length, browser_closed: record.browser_closed, same_html_unchanged: Object.values(bindings).every(b => b.unchanged) }));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
