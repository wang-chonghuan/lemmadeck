import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const workdir = "/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck";
if (process.cwd() !== workdir || process.env.PWDEBUG) throw new Error("Authorized workdir and no PWDEBUG required.");
const require = createRequire(resolve(workdir, "app/package.json"));
const { chromium } = require("playwright");
const evidence = resolve(workdir, ".tmp/stemrobin-184-resume/n5-offline-review");
const current = resolve(workdir, ".tmp/stemrobin-184-resume/offline/render/9c/modern-us-neutral/ana9-c2-s1-n5");
const before = resolve(workdir, ".tmp/stemrobin-184-resume/offline-before-typography/ana9-c2-s1-n5");
const sha = (bytes) => createHash("sha256").update(bytes).digest("hex");
const bind = async (file) => {
  const bytes = await readFile(file);
  return { file, bytes: bytes.length, sha256: sha(bytes) };
};
const prior = JSON.parse(await readFile(resolve(evidence, "hashbindings.json"), "utf8"));
const preservation = [];
for (const name of ["review.mjs", "report.md", "checks.json", "hashbindings.json", "images-ledger.json"]) {
  preservation.push(await bind(resolve(evidence, name)));
}
const opaqueInputs = [];
for (const old of prior.files.filter((entry) => entry.file.includes("/ssot-resources/"))) {
  const now = await bind(old.file);
  opaqueInputs.push({ ...now, priorSha256: old.sha256, unchanged: now.sha256 === old.sha256 });
}
const renderers = [];
for (const file of [
  ".tmp/stemrobin-184-resume/render_lesson.before-typography.js",
  ".claude/skills/ld-s10y-lesson/tools/render_lesson.js",
]) renderers.push(await bind(resolve(workdir, file)));
const projections = [];
const checks = [];
const images = [];
let pageOpens = 0;
let browserClosed = false;
const deniedRequests = [];
const browser = await chromium.launch({
  headless: true,
  args: ["--disable-background-networking", "--disable-component-update", "--disable-sync", "--no-first-run", "--host-resolver-rules=MAP * ~NOTFOUND"],
});
try {
  for (const viewport of [{ width: 1440, height: 960 }, { width: 390, height: 844 }]) {
    for (const surface of ["text", "exercises", "choices"]) {
      const oldFile = resolve(before, `${surface}.html`);
      const file = resolve(current, `${surface}.html`);
      const oldHtml = await readFile(oldFile, "utf8");
      if (viewport.width === 1440) {
        const oldBinding = await bind(oldFile);
        const priorBinding = prior.files.find((entry) => entry.file === file);
        projections.push({
          surface, old: oldBinding, current: await bind(file),
          oldMatchesPriorReview: oldBinding.sha256 === priorBinding.sha256,
        });
      }
      const context = await browser.newContext({ viewport, deviceScaleFactor: 1, offline: true, serviceWorkers: "block" });
      try {
        const url = pathToFileURL(file).href;
        await context.route("**/*", async (route) => {
          const requestUrl = route.request().url();
          if (requestUrl === url || requestUrl.startsWith("data:")) return route.continue();
          deniedRequests.push({ surface, width: viewport.width, scheme: new URL(requestUrl).protocol });
          return route.abort("blockedbyclient");
        });
        const page = await context.newPage();
        pageOpens++;
        await page.goto(url, { waitUntil: "load" });
        await page.evaluate(async () => {
          await document.fonts.ready;
          await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));
        });
        const observed = await page.evaluate((oldHtml) => {
          const old = new DOMParser().parseFromString(oldHtml, "text/html");
          const round = (v) => Math.round(v * 10000) / 10000;
          const signature = (doc) => {
            const root = doc.querySelector(".sheet");
            const walker = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT);
            const parts = [];
            for (let node; (node = walker.nextNode());) {
              if (!node.parentElement.closest("svg,style,script,.katex-mathml,annotation")) parts.push(node.textContent);
            }
            return {
              text: parts.join("").replace(/\s+/g, " ").trim(),
              annotations: JSON.stringify([...root.querySelectorAll(".katex-mathml annotation")].map((el) => ({ encoding: el.getAttribute("encoding"), text: el.textContent }))),
              annotationCount: root.querySelectorAll(".katex-mathml annotation").length,
            };
          };
          const priorText = signature(old);
          const currentText = signature(document);
          const metrics = (el, parent) => {
            const s = getComputedStyle(el), p = getComputedStyle(parent);
            return {
              px: round(parseFloat(s.fontSize)),
              prosePx: round(parseFloat(p.fontSize)),
              ratio: round(parseFloat(s.fontSize) / parseFloat(p.fontSize)),
              family: s.fontFamily,
              fontLoaded: document.fonts.check(s.font),
            };
          };
          const bodyFor = (el) => el.closest("p.para,li.ex .body");
          const math = [...document.querySelectorAll("p.para .katex,li.ex .body .katex")].map((el) => metrics(el, bodyFor(el)));
          const ascii = [...document.querySelectorAll("p.para .prose-math,li.ex .body .prose-math")].map((el) => metrics(el, bodyFor(el)));
          const numberLabels = [...document.querySelectorAll("li.ex .no")].map((el, index) => {
            const body = el.closest("li.ex").querySelector(".body");
            const sample = metrics(el, body);
            const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
            const actual = [];
            for (let node; (node = walker.nextNode());) {
              if (node.textContent.trim() && !node.parentElement.closest(".katex-mathml,annotation")) actual.push(metrics(node.parentElement, body));
            }
            return { index, ...sample, leafFonts: [...new Set(actual.map((value) => value.px))], families: [...new Set(actual.map((value) => value.family))] };
          });
          const letterLabels = [...document.querySelectorAll(".option-letter")].map((el, index) => {
            const displayed = el.querySelector(".katex,.prose-math") || el;
            return { index, ...metrics(displayed, bodyFor(el)) };
          });
          const rawAscii = [];
          for (const root of document.querySelectorAll("p.para,li.ex .body")) {
            const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
            for (let node; (node = walker.nextNode());) {
              const el = node.parentElement;
              if (/[A-Za-z0-9]/.test(node.textContent) && !el.closest(".katex,.prose-math,svg")) rawAscii.push(metrics(el, root));
            }
          }
          const affected = [...document.querySelectorAll("p.para .katex,li.ex .body .katex,p.para .prose-math,li.ex .body .prose-math,li.ex .no,.option-letter")];
          const hidden = [], clipped = [], unscrollable = [], overflowingRegions = [], overlaps = [];
          const containers = [...new Set(affected.map((el) => el.closest(".stem,.option-text,.option-letter,.no,p.para") || el.closest(".body")))];
          for (let index = 0; index < affected.length; index++) {
            const el = affected[index], r = el.getBoundingClientRect();
            if (!r.width || !r.height) hidden.push(index);
            for (let p = el; p && p !== document.body; p = p.parentElement) {
              const s = getComputedStyle(p), b = p.getBoundingClientRect();
              if (s.display === "none" || s.visibility !== "visible" || Number(s.opacity) === 0) hidden.push(index);
              if (["hidden", "clip"].includes(s.overflowX) && (r.left < b.left - 1 || r.right > b.right + 1)) clipped.push({ index, direction: "x" });
              if (["hidden", "clip"].includes(s.overflowY) && (r.top < b.top - 2 || r.bottom > b.bottom + 2)) clipped.push({ index, direction: "y" });
            }
          }
          for (let index = 0; index < containers.length; index++) {
            const el = containers[index], r = el.getBoundingClientRect(), s = getComputedStyle(el);
            if (r.left < -1 || r.right > innerWidth + 1) overflowingRegions.push(index);
            if (el.scrollWidth > el.clientWidth + 1 && !["auto", "scroll"].includes(s.overflowX)) unscrollable.push(index);
            const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
            const tokens = [];
            for (let node; (node = walker.nextNode());) {
              if (!node.textContent.trim() || node.parentElement.closest(".katex,.prose-math,svg")) continue;
              const range = document.createRange();
              range.selectNodeContents(node);
              tokens.push(...[...range.getClientRects()].filter((v) => v.width && v.height));
            }
            const atoms = [...el.querySelectorAll(".katex,.prose-math")].filter((node) => !node.parentElement.closest(".katex,.prose-math")).map((node) => node.getBoundingClientRect());
            for (const atom of atoms) {
              for (const token of tokens) {
                if (Math.min(atom.right, token.right) - Math.max(atom.left, token.left) > 2 && Math.min(atom.bottom, token.bottom) - Math.max(atom.top, token.top) > 2) overlaps.push(index);
              }
            }
          }
          const exerciseRows = [...document.querySelectorAll("li.ex")];
          const numberBodyCollisions = exerciseRows.flatMap((el, index) => {
            const n = el.querySelector(".no").getBoundingClientRect(), b = el.querySelector(".body").getBoundingClientRect();
            return n.right > b.left - 1 ? [index] : [];
          });
          const optionLabelCollisions = [...document.querySelectorAll(".option")].flatMap((el, index) => {
            const letter = el.querySelector(".option-letter").getBoundingClientRect();
            const option = el.querySelector(".option-text").getBoundingClientRect();
            return letter.right > option.left - 1 ? [index] : [];
          });
          return {
            signatures: { old: priorText, current: currentText },
            math, ascii, numberLabels, letterLabels, rawAscii,
            affectedGeometry: {
              changedAtoms: affected.length, regions: containers.length,
              hidden: [...new Set(hidden)], clipped, unscrollable, overflowingRegions,
              textMathOverlaps: [...new Set(overlaps)], numberBodyCollisions, optionLabelCollisions,
              documentWidth: document.documentElement.scrollWidth, viewportWidth: innerWidth,
            },
          };
        }, oldHtml);
        const signatures = observed.signatures;
        delete observed.signatures;
        const content = {
          oldDomTextSha256: sha(signatures.old.text),
          currentDomTextSha256: sha(signatures.current.text),
          textEqual: signatures.old.text === signatures.current.text,
          oldAnnotationsSha256: sha(signatures.old.annotations),
          currentAnnotationsSha256: sha(signatures.current.annotations),
          annotationsEqual: signatures.old.annotations === signatures.current.annotations,
          annotationCount: signatures.current.annotationCount,
        };
        const failures = [];
        const expect = (condition, name) => { if (!condition) failures.push(name); };
        expect(content.textEqual && content.annotationsEqual, "display-text-or-annotations-changed");
        expect([...observed.math, ...observed.ascii, ...observed.rawAscii, ...observed.letterLabels].every((v) => Math.abs(v.ratio - 1.1) <= 0.0001), "math-or-ASCII-not-1.10-times-prose");
        expect([...observed.math, ...observed.ascii, ...observed.rawAscii, ...observed.letterLabels].every((v) => v.family.includes("KaTeX_Main") && v.fontLoaded), "math-or-ASCII-family-not-loaded-KaTeX_Main");
        expect(observed.numberLabels.every((v) => Math.abs(v.ratio - 1.1) <= 0.0001 && v.leafFonts.every((px) => Math.abs(px - v.prosePx * 1.1) <= 0.001) && v.px >= v.prosePx && v.family.includes("KaTeX_Main")), "number-label-not-math-sized-or-KaTeX_Main");
        const geometry = observed.affectedGeometry;
        expect(!geometry.hidden.length && !geometry.clipped.length && !geometry.unscrollable.length && !geometry.overflowingRegions.length && !geometry.textMathOverlaps.length && !geometry.numberBodyCollisions.length && !geometry.optionLabelCollisions.length && geometry.documentWidth <= viewport.width, "affected-typography-overflow-clipping-or-overlap");
        const summarize = (values) => ({
          count: values.length,
          uniqueSizes: [...new Set(values.map((v) => v.px))],
          uniqueRatios: [...new Set(values.map((v) => v.ratio))],
          uniqueFamilies: [...new Set(values.map((v) => v.family))],
          fontFailures: values.filter((v) => !v.fontLoaded).length,
        });
        const check = {
          surface, file, viewport, content,
          math: summarize(observed.math), ascii: summarize(observed.ascii),
          rawAscii: summarize(observed.rawAscii), optionLetters: summarize(observed.letterLabels),
          numbers: observed.numberLabels, affectedGeometry: geometry, failures,
        };
        checks.push(check);
        console.log("CHECK " + JSON.stringify(check));
        if (viewport.width === 390 && (surface === "exercises" || surface === "choices")) {
          const target = surface === "exercises" ? page.locator("ol.ex") : page.locator("li.ex").first();
          const screenshot = resolve(evidence, `typography-${surface}-region-390x844.png`);
          await target.screenshot({ path: screenshot });
          const pixels = await target.evaluate((el) => ({ width: Math.ceil(el.getBoundingClientRect().width), height: Math.ceil(el.getBoundingClientRect().height) }));
          images.push({ ...await bind(screenshot), viewport, pixels, fullPage: false });
        }
      } finally {
        await context.close();
      }
    }
  }
} finally {
  await browser.close();
  browserClosed = true;
}
const priorRecordsPreserved = [];
for (const old of preservation) {
  const now = await bind(old.file);
  priorRecordsPreserved.push({ ...old, unchanged: old.sha256 === now.sha256 });
}
const runBindingsStable = [];
for (const old of [...opaqueInputs, ...renderers, ...projections.flatMap((p) => [p.old, p.current])]) {
  const now = await bind(old.file);
  runBindingsStable.push({ file: old.file, unchanged: old.sha256 === now.sha256 });
}
console.log("BINDINGS " + JSON.stringify({ opaqueInputs, renderers, projections, priorRecordsPreserved, runBindingsStable }));
console.log("IMAGES " + JSON.stringify(images));
console.log("SUMMARY " + JSON.stringify({
  scope: "Affected-only typography follow-up; all prior non-typography passing checks inherited, not rerun.",
  browserClosed, headless: true, offline: true, pageOpens, oldPageOpens: 0,
  deniedRequests, newImages: images.length, cumulativeImages: 6 + images.length,
  priorRecordsPreserved: priorRecordsPreserved.every((v) => v.unchanged),
  bindingsStable: runBindingsStable.every((v) => v.unchanged),
  canonicalInputsUnchanged: opaqueInputs.every((v) => v.unchanged),
  oldSnapshotsMatchPriorReview: projections.every((v) => v.oldMatchesPriorReview),
  failures: checks.flatMap((check) => check.failures.map((name) => ({ surface: check.surface, width: check.viewport.width, name }))),
}));
