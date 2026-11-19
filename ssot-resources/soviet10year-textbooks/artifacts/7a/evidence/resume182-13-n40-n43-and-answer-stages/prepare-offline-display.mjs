import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const cwd = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
assert.equal(process.cwd(), cwd);
const require = createRequire(path.join(cwd, "app/package.json"));
const { chromium } = require("playwright");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
const [lesson] = process.argv.slice(2);
assert(lesson);
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const output = `${base}/render-ready/${lesson}`;
assert(!fs.existsSync(output));
fs.mkdirSync(output, { recursive: true });
const edition = `ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/lessons/${lesson}`;
const sources = ["lesson.json", "exercises.json", "figures.json", "answer-keys.json",
  "choice-set/seed.json", "choice-set/draft.json", "choice-set/review.json"]
  .filter((name) => fs.existsSync(`${edition}/${name}`))
  .map((name) => ({ path: `${edition}/${name}`, sha256: hash(`${edition}/${name}`) }));
const changes = [];
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  for (const surface of ["text", "exercises"]) {
    const input = `${base}/render/${lesson}/${surface}.html`;
    await page.goto(pathToFileURL(path.resolve(input)).href);
    const result = await page.evaluate((surface) => {
      const content = () => ({
        paragraphs: [...document.querySelectorAll("p.para")].map((e) => e.outerHTML),
        exercises: [...document.querySelectorAll("li.ex")].map((e) => e.outerHTML),
        figures: [...document.querySelectorAll(".figure-media")].map((e) => e.outerHTML),
        captions: [...document.querySelectorAll(".figcap")].map((e) => e.outerHTML).sort(),
        headings: [...document.querySelectorAll("h1,.crumb,.exgroup")].map((e) => e.outerHTML),
      });
      const before = content();
      const controls = [...document.querySelectorAll("a.jump")];
      const removedControls = controls.map((e) => e.outerHTML);
      controls.forEach((e) => e.remove());
      const captions = [];
      if (surface === "text") {
        for (const caption of document.querySelectorAll(".sheet > .figcap")) {
          const match = caption.textContent.replace(/\s/g, "").match(/^图(\d+)$/);
          if (!match) throw new Error("Unresolved caption owner");
          const figure = document.getElementById(`fig-${match[1]}`);
          if (!figure || !figure.matches("figure.fig")) throw new Error("Missing caption figure");
          const moved = figure.nextElementSibling !== caption;
          figure.after(caption);
          captions.push({ figure: figure.id, moved, adjacent: figure.nextElementSibling === caption });
        }
      }
      return { before, after: content(), removedControls, captions,
        html: `<!DOCTYPE html>\n${document.documentElement.outerHTML}\n` };
    }, surface);
    assert.equal(result.removedControls.length, 1);
    assert.deepEqual(result.after, result.before);
    assert(result.captions.every((c) => c.adjacent));
    const file = `${output}/${surface}.html`;
    fs.writeFileSync(file, result.html, { flag: "wx" });
    delete result.html;
    delete result.before;
    delete result.after;
    changes.push({ surface, input: { path: input, sha256: hash(input) },
      output: { path: file, sha256: hash(file) }, ...result });
  }
} finally {
  await browser.close();
}
for (const source of sources) assert.equal(hash(source.path), source.sha256);
const choices = `${base}/render/${lesson}/choices.html`;
if (fs.existsSync(choices)) {
  fs.copyFileSync(choices, `${output}/choices.html`, fs.constants.COPYFILE_EXCL);
  assert.equal(hash(`${output}/choices.html`), hash(choices));
}
const receipt = { lesson, changes, sources, sourceFilesUnchanged: true,
  paragraphExerciseFigureCaptionBytesUnchangedInDOM: true,
  scope: "Offline display derivation only; no application or durable content changes.",
  inheritedChoices: fs.existsSync(choices) ? { path: choices, sha256: hash(choices) } : null,
  knownRendererNavigationDerivationReused: true,
  sourceImageOpens: 0, screenshotOpens: 0, screenshotsCaptured: 0 };
fs.writeFileSync(`${base}/${lesson}-display-repair.json`, `${JSON.stringify(receipt, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ lesson, changedSurfaces: changes.length,
  removedNavigationControls: 2, relocatedCaptions: changes.flatMap((c) => c.captions).filter((c) => c.moved).length,
  sourceFilesUnchanged: true, output }));
