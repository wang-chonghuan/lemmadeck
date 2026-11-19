import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const cwd = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
assert.equal(process.cwd(), cwd);
const require = createRequire(path.join(cwd, "app/package.json"));
const { chromium } = require("playwright");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-12";
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const output = `${base}/render-affected`;
const records = [];
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  for (const lesson of ["alg7-c4-s2-n37", "alg7-c4-s2-n38"]) {
    for (const surface of ["text", "exercises"]) {
      const input = `${base}/render-ready/${lesson}/${surface}.html`;
      const file = `${output}/${lesson}/${surface}.html`;
      await page.goto(pathToFileURL(path.resolve(input)).href);
      if (fs.existsSync(file)) {
        const signature = () => page.evaluate(() => ({
          text: document.querySelector(".sheet").textContent,
          formulas: [...document.querySelectorAll("annotation")].map((node) => node.textContent),
          mathMarkup: [...document.querySelectorAll(".katex")].map((node) => node.outerHTML),
          exercises: [...document.querySelectorAll("li.ex")].map((node) => node.id),
        }));
        const before = await signature();
        await page.goto(pathToFileURL(path.resolve(file)).href);
        assert.deepEqual(await signature(), before);
        records.push({ lesson, surface, validPartialOutputReused: true,
          input: { path: input, sha256: hash(input) }, output: { path: file, sha256: hash(file) },
          textFormulaAndMathMarkupUnchanged: true });
        continue;
      }
      const result = await page.evaluate(({ lesson, surface }) => {
        const signature = () => ({
          text: document.querySelector(".sheet").textContent,
          formulas: [...document.querySelectorAll("annotation")].map((node) => node.textContent),
          mathMarkup: [...document.querySelectorAll(".katex")].map((node) => node.outerHTML),
          exercises: [...document.querySelectorAll("li.ex")].map((node) => node.id),
        });
        const before = signature();
        const wanted = lesson.endsWith("n37")
          ? surface === "text" ? ["\\sqrt{16\\times49\\times4}="] : ["\\sqrt{96100}", "\\sqrt{26.01}"]
          : surface === "text" ? ["0.357^2", "432.7^2"] : [];
        const changed = [];
        for (const tex of wanted) {
          const annotations = [...document.querySelectorAll("annotation")].filter((node) => node.textContent.replace(/\s+/g, "").includes(tex));
          if (annotations.length !== 1) throw new Error(`Ambiguous formula ${tex}: ${annotations.length}`);
          const nb = annotations[0].closest(".nb");
          if (!nb) throw new Error(`Missing wrapper for ${tex}`);
          nb.classList.add("wrap-chain");
          if (lesson.endsWith("n37") && surface === "exercises") {
            if (!/[12]\)\s*$/.test(nb.previousSibling?.textContent ?? "")) {
              throw new Error(`Missing adjacent format label for ${tex}`);
            }
          }
          changed.push({ tex: annotations[0].textContent, baseGroups: nb.querySelectorAll(".katex-html>.base").length });
        }
        const style = document.createElement("style");
        style.id = "affected-display-repair";
        style.textContent = `
          #ex-796 .body>.nb,#ex-805 .body>.nb{padding-block:8px}
          @media(max-width:860px){
            .nb.wrap-chain{display:inline;overflow:visible;max-width:none;white-space:normal}
            .nb.wrap-chain .katex,.nb.wrap-chain .katex-html{white-space:normal}
            .nb.wrap-chain .katex-html>.base{white-space:nowrap}
          }`;
        document.head.append(style);
        return { before, after: signature(), changed,
          html: `<!DOCTYPE html>\n${document.documentElement.outerHTML}\n` };
      }, { lesson, surface });
      assert.deepEqual(result.after, result.before, "Displayed text, TeX, or KaTeX markup changed");
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, result.html, { flag: "wx" });
      records.push({ lesson, surface, changed: result.changed,
        input: { path: input, sha256: hash(input) }, output: { path: file, sha256: hash(file) },
        textFormulaAndMathMarkupUnchanged: true });
    }
  }
} finally {
  await browser.close();
}
fs.writeFileSync(`${base}/n37-n38-display-repair.json`, `${JSON.stringify({
  records, scope: "D1-D4 offline-only layout repair; durable source and app unchanged",
  originalFirstHtmlAndScreenshotsUnchanged: true, imageOpens: 0,
}, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ repairedOfflineSurfaces: records.length, textAndMathUnchanged: true }));
