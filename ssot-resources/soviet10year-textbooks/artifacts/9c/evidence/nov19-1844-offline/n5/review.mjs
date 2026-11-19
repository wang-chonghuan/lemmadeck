import { createRequire } from "node:module";
import { readFile, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const workdir = "/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck";
if (process.cwd() !== workdir) throw new Error("Exact authorized workdir required.");
if (process.env.PWDEBUG) throw new Error("PWDEBUG is forbidden.");
const require = createRequire(resolve(workdir, "app/package.json"));
const { chromium } = require("playwright");
const output = resolve(workdir, ".tmp/stemrobin-184-resume/n5-offline-review");
const projection = resolve(workdir, ".tmp/stemrobin-184-resume/offline/render/9c/modern-us-neutral/ana9-c2-s1-n5");
const canonical = resolve(workdir, "ssot-resources/soviet10year-textbooks/artifacts/9c/editions/modern-us-neutral/lessons/ana9-c2-s1-n5");
const surfaces = ["text", "exercises", "choices"];
const viewports = [{ width: 1440, height: 960 }, { width: 390, height: 844 }];
const bindingFiles = [
  ...surfaces.map((surface) => resolve(projection, `${surface}.html`)),
  ...["lesson.json", "exercises.json", "choice-set/seed.json", "choice-set/draft.json", "choice-set/review.json"].map((name) => resolve(canonical, name)),
];
const hashFile = async (file) => ({
  file,
  bytes: (await stat(file)).size,
  sha256: createHash("sha256").update(await readFile(file)).digest("hex"),
});
// Canonical files are opaque hash bindings only; no JSON parsing or content review.
const bindings = [];
for (const file of bindingFiles) bindings.push(await hashFile(file));
const checks = [];
const screenshots = [];
const results = {
  scope: "Independent offline display review only, not product acceptance.",
  workdir,
  playwright: require.resolve("playwright"),
  browserClosed: false,
  pageOpenCount: 0,
  externalRequests: [],
  bindings,
  checks,
  screenshots,
};
const browser = await chromium.launch({
  headless: true,
  args: [
    "--disable-background-networking",
    "--disable-component-update",
    "--disable-sync",
    "--no-first-run",
    "--host-resolver-rules=MAP * ~NOTFOUND",
  ],
});
try {
  for (const viewport of viewports) {
    for (const surface of surfaces) {
      const context = await browser.newContext({
        viewport,
        deviceScaleFactor: 1,
        offline: true,
        serviceWorkers: "block",
      });
      try {
        const file = resolve(projection, `${surface}.html`);
        const url = pathToFileURL(file).href;
        await context.route("**/*", async (route) => {
          const requestUrl = route.request().url();
          if (requestUrl === url || requestUrl.startsWith("data:")) return route.continue();
          results.externalRequests.push({ surface, width: viewport.width, scheme: new URL(requestUrl).protocol });
          return route.abort("blockedbyclient");
        });
        const page = await context.newPage();
        const errors = [];
        page.on("pageerror", (error) => errors.push({ kind: "pageerror", message: error.message }));
        page.on("console", (message) => {
          if (message.type() === "error") errors.push({ kind: "consoleerror", message: message.text() });
        });
        results.pageOpenCount++;
        await page.goto(url, { waitUntil: "load" });
        await page.evaluate(async () => {
          await document.fonts.ready;
          await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));
        });
        const metrics = await page.evaluate(() => {
          const round = (n) => Math.round(n * 100) / 100;
          const box = (el) => {
            const r = el.getBoundingClientRect();
            return { x: round(r.x), y: round(r.y + scrollY), width: round(r.width), height: round(r.height) };
          };
          const hidden = (el) => {
            for (let p = el; p; p = p.parentElement) {
              const s = getComputedStyle(p);
              if (s.display === "none" || s.visibility !== "visible" || Number(s.opacity) === 0) return true;
            }
            return false;
          };
          const renderedText = (root, omitMath = false) => {
            const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
            const nodes = [];
            for (let node; (node = walker.nextNode());) {
              const el = node.parentElement;
              if (!node.textContent.trim() || el.closest("style,script,.katex-mathml,annotation")) continue;
              if (omitMath && el.closest(".katex,svg")) continue;
              const range = document.createRange();
              range.selectNodeContents(node);
              const rects = [...range.getClientRects()].filter((r) => r.width && r.height);
              nodes.push({ node, el, rects, font: parseFloat(getComputedStyle(el).fontSize) });
            }
            return nodes;
          };
          const blocks = [...document.querySelectorAll("p.para,li.ex .body")];
          const prose = blocks.map((el, index) => {
            const nodes = renderedText(el, true);
            const r = el.getBoundingClientRect();
            const clips = nodes.flatMap((node) => {
              const found = [];
              if (hidden(node.el) || !node.rects.length) found.push("hidden");
              for (let p = node.el; p && p !== document.body; p = p.parentElement) {
                const s = getComputedStyle(p);
                const bounds = p.getBoundingClientRect();
                if (["hidden", "clip"].includes(s.overflowX) && node.rects.some((v) => v.left < bounds.left - 1 || v.right > bounds.right + 1)) found.push("horizontal-clip");
                if (["hidden", "clip"].includes(s.overflowY) && node.rects.some((v) => v.top < bounds.top - 2 || v.bottom > bounds.bottom + 2)) found.push("vertical-clip");
              }
              return found;
            });
            return { index, box: box(el), textRuns: nodes.length, visible: r.width > 0 && r.height > 0 && !hidden(el), clips: [...new Set(clips)] };
          });
          const blockOverlap = [];
          for (let i = 1; i < blocks.length; i++) {
            const previous = blocks[i - 1].getBoundingClientRect();
            const current = blocks[i].getBoundingClientRect();
            if (current.top < previous.bottom - 1 && current.right > previous.left && current.left < previous.right) blockOverlap.push([i - 1, i]);
          }
          const numbers = [...document.querySelectorAll("li.ex .no")].map((el) => {
            const visibleNodes = renderedText(el);
            const fonts = visibleNodes.map((node) => node.font);
            const body = el.closest("li.ex").querySelector(".body");
            return {
              number: visibleNodes.map((node) => node.node.textContent).join("").trim(),
              visible: !hidden(el) && el.getBoundingClientRect().width > 0,
              minFont: round(Math.min(...fonts)),
              proseFont: round(parseFloat(getComputedStyle(body).fontSize)),
              box: box(el),
            };
          });
          const mathRoots = [...document.querySelectorAll("p.para .katex,li.ex .body .katex,.prose-math")];
          const mathSizes = mathRoots.map((el) => {
            const proseRoot = el.closest("p.para,li.ex .body");
            return { math: round(parseFloat(getComputedStyle(el).fontSize)), prose: round(parseFloat(getComputedStyle(proseRoot).fontSize)) };
          });
          const scrolls = [...document.querySelectorAll(".nb,.sr-nb,.body,.option-text,.fig")].filter((el) => el.scrollWidth > el.clientWidth + 1).map((el) => {
            const style = getComputedStyle(el);
            const before = el.scrollLeft;
            const max = el.scrollWidth - el.clientWidth;
            el.scrollLeft = max;
            const reached = el.scrollLeft;
            const endpointVisible = reached >= max - 1 && ["auto", "scroll"].includes(style.overflowX);
            el.scrollLeft = before;
            return { class: el.className, client: el.clientWidth, scroll: el.scrollWidth, max, reached, endpointVisible };
          });
          const svgs = [...document.querySelectorAll(".figure-media svg")].map((svg) => {
            const root = svg.getBoundingClientRect();
            const labels = [...svg.querySelectorAll("text")].map((el, index) => {
              const r = el.getBoundingClientRect();
              const m = el.getScreenCTM();
              const px = parseFloat(getComputedStyle(el).fontSize) * Math.hypot(m.c, m.d);
              return {
                index, nonblank: Boolean(el.textContent.trim()), px: round(px), box: box(el),
                clipped: r.left < root.left - 1 || r.right > root.right + 1 || r.top < root.top - 1 || r.bottom > root.bottom + 1,
              };
            });
            const overlap = [];
            for (let i = 0; i < labels.length; i++) {
              for (let j = i + 1; j < labels.length; j++) {
                const a = labels[i].box, b = labels[j].box;
                if (Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x) > 1 && Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y) > 1) overlap.push([i, j]);
              }
            }
            return { box: box(svg), labelCount: labels.length, minActualTextPx: Math.min(...labels.map((v) => v.px)), blank: labels.filter((v) => !v.nonblank).length, clipped: labels.filter((v) => v.clipped).map((v) => v.index), overlap, finalRow: labels.filter((v) => v.box.y > Math.max(...labels.map((x) => x.box.y)) - 2) };
          });
          const radios = [...document.querySelectorAll('input[type="radio"]')];
          const groups = Object.fromEntries([...new Set(radios.map((el) => el.name))].map((name) => [name, radios.filter((el) => el.name === name).length]));
          const payloadAttributeNames = [...document.querySelectorAll("*")].flatMap((el) => [...el.attributes].map((a) => a.name).filter((name) => /(^|[-_:])(answer|correct|accept|key)([-_:]|$)/i.test(name)));
          const bodyText = document.body.innerText;
          const keyLiteralCount = (document.body.innerHTML.match(/\b(?:correct_index|answer_key|answer_keys|correctIndex)\b/g) || []).length;
          const errorElements = document.querySelectorAll(".katex-error,.err").length;
          const missingGlyphMarkers = (bodyText.match(/[\uFFFD\u25A1]/g) || []).length;
          const mathFontFailures = [...new Set(mathRoots.map((el) => getComputedStyle(el).font))].filter((font) => !document.fonts.check(font)).length;
          return {
            body: { width: document.body.scrollWidth, document: document.documentElement.scrollWidth, viewport: innerWidth, height: document.documentElement.scrollHeight },
            prose: { blockCount: prose.length, hidden: prose.filter((v) => !v.visible).map((v) => v.index), clipped: prose.filter((v) => v.clips.length), overlap: blockOverlap },
            numbers, math: { rootCount: mathRoots.length, smallerThanProse: mathSizes.filter((v) => v.math < v.prose), minRootFont: Math.min(...mathSizes.map((v) => v.math)) },
            scrolls, svgs, groups, options: radios.length,
            payload: { scripts: document.scripts.length, hiddenInputs: document.querySelectorAll('input[type="hidden"]').length, forms: document.forms.length, submitControls: document.querySelectorAll('button,input[type="submit"]').length, inlineHandlers: [...document.querySelectorAll("*")].flatMap((el) => [...el.attributes].filter((a) => /^on/i.test(a.name))).length, payloadAttributeNames, keyLiteralCount },
            errors: { errorElements, missingGlyphMarkers, mathFontFailures, fontStatus: document.fonts.status, failedFaces: [...document.fonts].filter((f) => f.status === "error").length },
          };
        });
        let radioIsolation = null;
        if (surface === "choices") {
          radioIsolation = { selections: 0, failures: [] };
          const beforeDom = await page.locator("body").evaluate((el) => el.innerHTML);
          for (const name of Object.keys(metrics.groups)) {
            for (let index = 0; index < metrics.groups[name]; index++) {
              const readState = () => page.locator('input[type="radio"]').evaluateAll((els) => els.map((el) => ({ name: el.name, value: el.value, checked: el.checked })));
              const before = await readState();
              await page.locator(`input[type="radio"][name="${name}"]`).nth(index).check();
              const after = await readState();
              const inGroup = after.filter((el) => el.name === name);
              if (inGroup.filter((el) => el.checked).length !== 1 || !inGroup[index].checked || before.some((el, i) => el.name !== name && el.checked !== after[i].checked)) radioIsolation.failures.push({ name, index });
              radioIsolation.selections++;
            }
          }
          radioIsolation.domUnchanged = beforeDom === await page.locator("body").evaluate((el) => el.innerHTML);
          await page.locator('input[type="radio"]').evaluateAll((els) => els.forEach((el) => { el.checked = false; }));
        }
        const finalContent = await page.evaluate(() => {
          const last = [...document.querySelectorAll("p.para,li.ex")].at(-1);
          last.scrollIntoView({ block: "end" });
          const r = last.getBoundingClientRect();
          const row = [...document.querySelectorAll(".figure-media svg text")].at(-1);
          let finalFigureRowVisible = null;
          if (row) {
            row.scrollIntoView({ block: "center" });
            const v = row.getBoundingClientRect();
            finalFigureRowVisible = v.top >= 0 && v.bottom <= innerHeight;
          }
          window.scrollTo(0, 0);
          return { lastContentBottomReachable: r.bottom <= innerHeight + 1 && r.bottom >= 0, finalFigureRowVisible };
        });
        const screenshot = resolve(output, `${surface}-${viewport.width}x${viewport.height}.png`);
        await page.screenshot({ path: screenshot, fullPage: true });
        screenshots.push(await hashFile(screenshot));
        const failures = [];
        const expect = (ok, name) => { if (!ok) failures.push(name); };
        expect(metrics.body.width <= viewport.width && metrics.body.document <= viewport.width, "body-horizontal-overflow");
        expect(!metrics.prose.hidden.length && !metrics.prose.clipped.length && !metrics.prose.overlap.length, "prose-hidden-clipped-or-overlapping");
        expect(metrics.scrolls.every((el) => el.endpointVisible), "math-scroll-end-unreachable");
        expect(metrics.numbers.every((el) => el.visible && el.minFont >= el.proseFont), "number-font-smaller-than-prose-or-hidden");
        expect(!metrics.math.smallerThanProse.length, "math-or-Latin-root-font-smaller-than-prose");
        expect(!metrics.errors.errorElements && !metrics.errors.missingGlyphMarkers && !metrics.errors.mathFontFailures && !metrics.errors.failedFaces && !errors.length, "glyph-katex-font-or-console-error");
        expect(finalContent.lastContentBottomReachable, "final-content-bottom-unreachable");
        if (surface === "text") {
          expect(metrics.prose.blockCount > 0 && metrics.svgs.length === 1, "text-or-table-missing");
          expect(metrics.svgs.every((svg) => svg.labelCount > 0 && !svg.blank && !svg.clipped.length && !svg.overlap.length && svg.minActualTextPx >= 16), "table-label-blank-clipped-overlapping-or-below-16-screen-px");
          expect(finalContent.finalFigureRowVisible, "final-table-row-unreachable");
        } else {
          const expectedNumbers = surface === "exercises" ? "43,44,45,46,47,48" : "1,2,3,4,5,6";
          expect(metrics.numbers.length === 6 && metrics.numbers.map((el) => el.number.replace(/\D/g, "")).join(",") === expectedNumbers, "exercise-numbering-or-count");
        }
        if (surface === "choices") {
          expect(Object.keys(metrics.groups).length === 6 && Object.values(metrics.groups).every((count) => count === 4) && metrics.options === 24, "radio-group-or-option-count");
          expect(radioIsolation.selections === 24 && !radioIsolation.failures.length && radioIsolation.domUnchanged, "radio-selection-not-native-or-isolated");
          expect(Object.entries(metrics.payload).every(([, value]) => Array.isArray(value) ? !value.length : !value), "choice-answer-or-action-payload");
        }
        checks.push({ file, viewport, metrics, radioIsolation, finalContent, errors, failures, screenshot });
        console.log(JSON.stringify(checks.at(-1)));
      } finally {
        await context.close();
      }
    }
  }
} finally {
  await browser.close();
  results.browserClosed = true;
}
for (const binding of bindings) {
  const after = await hashFile(binding.file);
  if (after.sha256 !== binding.sha256) throw new Error(`Reviewed binding changed: ${binding.file}`);
}
console.log("HASHBINDINGS " + JSON.stringify(bindings));
console.log("IMAGES " + JSON.stringify(screenshots));
console.log("SUMMARY " + JSON.stringify({
  scope: results.scope, playwright: results.playwright, browserClosed: results.browserClosed,
  pageOpenCount: results.pageOpenCount, screenshotCount: screenshots.length,
  externalRequests: results.externalRequests,
  failures: checks.flatMap((check) => check.failures.map((name) => ({ surface: check.file.split("/").at(-1), width: check.viewport.width, name }))),
  bindingsUnchanged: true,
}));
