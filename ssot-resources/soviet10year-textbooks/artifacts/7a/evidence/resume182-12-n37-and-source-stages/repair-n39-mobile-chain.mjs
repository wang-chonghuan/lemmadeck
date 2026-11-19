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
const reviewFile = `${base}/display/n39-text-exercises-FIRST/pixel-review/review.json`;
const review = JSON.parse(fs.readFileSync(reviewFile, "utf8"));
assert.equal(review.status, "revise");
assert.equal(review.findings.length, 1);
const finding = review.findings[0];
assert.equal(finding.id, "N39-PIXEL-R1");
const input = finding.html;
const output = `${base}/render-affected/alg7-c4-s2-n39/text.html`;
assert(!fs.existsSync(output));
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const sourceFiles = ["lesson.json", "exercises.json", "figures.json", "adaptation.audit.json"]
  .map((name) => `${path.dirname(finding.sourceFile)}/${name}`)
  .map((file) => ({ path: file, sha256: hash(file) }));
const browser = await chromium.launch({ headless: true });
let result;
try {
  const page = await browser.newPage();
  await page.goto(pathToFileURL(path.resolve(input)).href);
  result = await page.evaluate((tex) => {
    const signature = () => ({
      text: document.querySelector(".sheet").textContent,
      formulas: [...document.querySelectorAll("annotation")].map((node) => node.textContent),
      mathMarkup: [...document.querySelectorAll(".katex")].map((node) => node.outerHTML),
    });
    const before = signature();
    const paragraph = document.querySelectorAll(".sheet>p.para")[26];
    const matches = [...paragraph.querySelectorAll("annotation")]
      .filter((node) => node.textContent === tex);
    if (matches.length !== 1) throw new Error("Expected one exact formula in prose/26");
    const wrapper = matches[0].closest(".nb");
    if (!wrapper) throw new Error("Missing existing formula wrapper");
    wrapper.classList.add("wrap-chain");
    const style = document.createElement("style");
    style.id = "n39-affected-display-repair";
    style.textContent = `
      @media(max-width:860px){
        .nb.wrap-chain{display:inline;overflow:visible;max-width:none;white-space:normal}
        .nb.wrap-chain .katex,.nb.wrap-chain .katex-html{white-space:normal}
        .nb.wrap-chain .katex-html>.base{white-space:nowrap}
      }`;
    document.head.append(style);
    return { before, after: signature(), formula: tex,
      html: `<!DOCTYPE html>\n${document.documentElement.outerHTML}\n` };
  }, finding.formulaTex);
  assert.deepEqual(result.after, result.before);
} finally {
  await browser.close();
}
for (const file of sourceFiles) assert.equal(hash(file.path), file.sha256);
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, result.html, { flag: "wx" });
fs.writeFileSync(`${base}/n39-mobile-chain-display-repair.json`, `${JSON.stringify({
  scope: "N39-PIXEL-R1 only; current lesson prose and TeX unchanged",
  finding: { path: reviewFile, sha256: hash(reviewFile) },
  input: { path: input, sha256: hash(input) },
  output: { path: output, sha256: hash(output) },
  sourceFiles, formula: result.formula,
  textFormulaAndMathMarkupUnchanged: true,
  originalFirstHtmlAndScreenshotsUnchanged: true, imageOpens: 0,
}, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ repairedOfflineSurfaces: 1, textAndMathUnchanged: true, output }));
