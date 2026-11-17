import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = "/Users/yong/.codex/worktrees/a07e/lemmadeck";
const out = path.dirname(fileURLToPath(import.meta.url));
const own = path.dirname(out);
const author = path.join(path.dirname(own), "geo910-n18-n19-fig74-76-author");
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const load = async (file) => JSON.parse(await readFile(file, "utf8"));
const save = async (name, value) => writeFile(path.join(out, name),
  `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
const bind = async (file, expected) => {
  const bytes = await readFile(file);
  const sha256 = hash(bytes);
  if (expected) assert.equal(sha256, expected, file);
  return { path: file, sha256, bytes: bytes.length };
};
await mkdir(path.join(out, "cells"), { recursive: true });
await writeFile(path.join(out, "single-comparison.lock"),
  "One authorized Phase B comparison; no rerun, no repair.\n", { flag: "wx" });

const phaseA = await load(path.join(own, "freeze.json"));
const frozenBindings = [];
for (const artifact of phaseA.artifacts) frozenBindings.push(await bind(artifact.path, artifact.sha256));
for (const input of phaseA.inputs.filter((item) => item.snapshot)) {
  frozenBindings.push(await bind(input.snapshot, input.snapshotSha256));
}
const ledger = await load(path.join(own, "imageledger.json"));
assert.equal(ledger.openedCount, 3);
assert.equal(ledger.sourceReopens, 0);
const selected = await load(path.join(author, "author-results.json"));
const sealed = await load(path.join(author, "artifact-hashes.json"));
const authorEvidence = [];
for (const name of ["source-inventory.json", "execution-log.json", "author-results.json", "resvg-preview-defect.json"]) {
  const file = path.join(author, name);
  authorEvidence.push(await bind(file, sealed.files.find((item) => item.path === file).sha256));
}
const rejectedPreviews = [];
for (const id of ["fig-74", "fig-75", "fig-76"]) {
  const file = path.join(author, id, "first", `${id}.preview-640-328.png`);
  rejectedPreviews.push({
    ...await bind(file, sealed.files.find((item) => item.path === file).sha256),
    status: "FAILED_PREVIEW_NOT_ACCEPTED",
    reason: "Disclosed resvg omission of semantic-CSS shafts; retained unchanged; not opened here."
  });
}

const outputs = [];
const reusableCommands = [];
const specs = new Map();
for (const id of ["fig-74", "fig-75", "fig-76"]) {
  const record = selected.figures.find((item) => item.figure === id);
  assert.equal(record.selectedAttempt, id === "fig-76" ? "first" : "repair");
  const bindings = {};
  for (const kind of ["spec", "render", "svg"]) {
    bindings[kind] = await bind(record[kind].path, record[kind].sha256);
  }
  const render = await load(record.render.path);
  assert.equal(render.spec.sha256, bindings.spec.sha256);
  assert.equal(render.output.svg.sha256, bindings.svg.sha256);
  assert.equal(path.resolve(root, render.spec.path), bindings.spec.path);
  assert.equal(path.resolve(root, render.output.svg.path), bindings.svg.path);
  const attempt = path.dirname(record.render.path);
  for (const type of id === "fig-74" ? ["render"] : ["validate", "render"]) {
    const file = path.join(attempt, `${type}.command.json`);
    const command = await load(file);
    assert.equal(command.exitCode, id === "fig-74" ? 2 : 0);
    reusableCommands.push({ figure: id, type, ...await bind(file), command, reusedNotExecuted: true });
  }
  if (id === "fig-74") {
    assert.equal(render.status, "fail");
    assert.deepEqual(render.collisions.map((item) => [item.id, item.score]),
      [["a2-vector-head-label", 10000]]);
    assert.equal(record.repairsUsed, 1);
  } else {
    assert.equal(render.status, "pass");
    assert.equal(render.collisions.length, 0);
    const spec = await load(record.spec.path);
    const frozenSource = phaseA.inputs.find((item) => item.id === id);
    assert.equal(spec.source.image.sha256, frozenSource.sha256);
    assert.equal(spec.source.image.path, frozenSource.path);
    assert.equal(spec.display.layout, "inline");
    assert.equal(spec.display.purpose, "instructional");
    assert.deepEqual(spec.display.widths, [328, 640]);
    assert.ok(spec.display.minTextPx >= 16);
    specs.set(id, spec);
  }
  outputs.push({ figure: id, selectedAttempt: record.selectedAttempt, ...bindings,
    source: record.source, renderStatus: render.status, collisions: render.collisions,
    durablePromotion: false, metadataPaths: "author scratch paths; not durable promotion metadata" });
}

const whitespaceFree = (text) => (text ?? "").replace(/\s+/gu, "");
const textChecks = [];
for (const input of phaseA.inputs.filter((item) => item.snapshot)) {
  const current = await readFile(input.path);
  const doc = JSON.parse(current);
  const old = await load(input.snapshot);
  const editionPayload = (data) => data.prose ? {
    id: data.id, title: whitespaceFree(data.title),
    prose: data.prose.map((block) => ({
      kind: block.kind, id: block.id, label: whitespaceFree(block.label), text: whitespaceFree(block.text)
    }))
  } : {
    lesson: data.lesson, count: data.count,
    exercises: data.exercises.map((exercise) => ({
      number: exercise.number, text: whitespaceFree(exercise.text),
      linesJoined: whitespaceFree(exercise.lines.join("")),
      figure_refs: exercise.figure_refs, figures: exercise.figures
    }))
  };
  assert.deepEqual(editionPayload(doc), editionPayload(old));
  if (input.path.includes("-n19/")) assert.equal(hash(current), input.sha256);
  textChecks.push({ path: input.path, frozenSha256: input.sha256, currentSha256: hash(current),
    canonicalTextUnchanged: true, exactBytesUnchanged: hash(current) === input.sha256 });
}
const n19 = await load(path.join(own, "text-snapshots", "geo910-c1-s2-n19.lesson.json"));
const n19Exercises = await load(path.join(own, "text-snapshots", "geo910-c1-s2-n19.exercises.json"));
const completeProse = n19.prose.map((block) => block.text || block.label).filter(Boolean).join("\n\n");
for (const spec of specs.values()) {
  assert.equal(spec.source.authoritativeText[0].text, completeProse);
  assert.deepEqual(spec.source.authoritativeText.slice(1).map((item) => [item.exercise, item.text]),
    n19Exercises.exercises.map((item) => [item.number, item.text]));
}

const math = [];
const subtract = (to, from) => to.map((value, index) => value - from[index]);
const closePoint = (actual, expected, tolerance = 0.0001) =>
  assert.ok(Math.hypot(...actual.map((value, index) => value - expected[index])) < tolerance);
for (const [id, spec] of specs) {
  const objects = new Map(spec.objects.map((item) => [item.id, item]));
  const coordinate = (ref) => typeof ref === "string" ? objects.get(ref).at : ref;
  const arrows = spec.objects.filter((item) => item.type === "arrow");
  for (const arrow of arrows) {
    const relation = spec.assertions.find((item) => item.type === "connects" && item.arrow === arrow.id);
    assert.ok(relation, arrow.id);
    assert.deepEqual(coordinate(relation.from), coordinate(arrow.from));
    assert.deepEqual(coordinate(relation.to), coordinate(arrow.to));
  }
  for (const relation of spec.assertions.filter((item) => item.type === "displacement")) {
    assert.deepEqual(subtract(coordinate(relation.to), coordinate(relation.from)), [relation.dx, relation.dy]);
  }
  if (id === "fig-75") {
    assert.equal(arrows.length, 2);
    assert.equal(spec.objects.filter((item) => item.type === "point").length, 0);
    const upper = objects.get("upper"), lower = objects.get("lower");
    const u = subtract(upper.to, upper.from), l = subtract(lower.to, lower.from);
    assert.deepEqual(u, [-385, 116]);
    assert.deepEqual(l, [385, -116]);
    assert.ok(u[0] < 0 && u[1] > 0 && l[0] > 0 && l[1] < 0);
    assert.equal(u[0] * l[1] - u[1] * l[0], 0);
    assert.equal(u[0] ** 2 + u[1] ** 2, l[0] ** 2 + l[1] ** 2);
    assert.ok(u[0] * l[0] + u[1] * l[1] < 0);
    assert.equal(objects.get("a").text, "a");
    assert.equal(objects.get("minus-a").text, "\u2212a");
    assert.equal(objects.get("a-vector-head").text, "\u2192");
    assert.equal(objects.get("minus-a-vector-head").text, "\u2192");
    math.push({ figure: id, status: "PASS", upperDisplacement: u, lowerDisplacement: l,
      lengthSquared: 161681, parallelCrossProduct: 0, oppositeDotProduct: -161681,
      nonzero: true, unnamedEndpoints: 4, connects: 2, vectorLabelsWithNotation: 2 });
  } else {
    assert.deepEqual(arrows.map((arrow) => [arrow.id, arrow.from, arrow.to]),
      [["OA", "O", "A"], ["AB", "A", "B"], ["OB", "O", "B"]]);
    const O = objects.get("O"), A = objects.get("A"), B = objects.get("B");
    assert.equal(O.visible, true);
    assert.equal(A.visible, false);
    assert.equal(B.visible, false);
    assert.deepEqual([A.label, B.label, O.label], ["A", "B", "O"]);
    assert.ok(A.at[0] < B.at[0] && B.at[0] < O.at[0]);
    assert.ok(O.at[1] < A.at[1] && A.at[1] < B.at[1]);
    const OA = subtract(A.at, O.at), AB = subtract(B.at, A.at), OB = subtract(B.at, O.at);
    assert.deepEqual(OA.map((value, index) => value + AB[index]), OB);
    assert.deepEqual(subtract(OB, OA), AB);
    const group = spec.source.inventory[0];
    assert.ok(group.requires.includes("pointRelationships"));
    for (const point of ["O", "A", "B"]) {
      assert.ok(spec.assertions.some((relation) => group.assertions.includes(relation.id) &&
        relation.type === "displacement" && [relation.from, relation.to].includes(point)));
    }
    math.push({ figure: id, status: "PASS", OA, AB, OB, additionIdentity: true,
      subtractionIdentity: true, pointRelationshipsComplete: true,
      sourceODotPreservedInSpec: true, connects: 3, pointLabels: ["A", "B", "O"] });
  }
}
await save("original-spec-assertions.json", { status: "PASS", frozenBindings, textChecks, math });
await save("output-hashes.json", { selectedOutputs: outputs, authorEvidence, reusedCommands: reusableCommands,
  rejectedResvgPreviews: rejectedPreviews, authorSealedManifest: await bind(path.join(author, "artifact-hashes.json")) });

const appCssPath = path.join(root, "app/src/styles/app.css");
const appCss = await readFile(appCssPath, "utf8");
const tokens = ["white", "ink", "ink-soft", "ink-dim", "line", "blue", "green", "blue-tint"]
  .map((name) => {
    const value = appCss.match(new RegExp(`--sr-${name}:\\s*(#[0-9a-fA-F]{6})\\s*;`))?.[1];
    assert.ok(value, name);
    return `--sr-${name}:${value};`;
  }).join("");
const semanticRules = appCss.match(/\.sr-figure-media \{[^}]+\}/)?.[0];
const accentRules = appCss.match(/\.sr-figure-media\[data-figure-theme="accent"\] \{[^}]+\}/)?.[0];
const printRules = appCss.match(/\.sr-print-lesson \.sr-figure-media \{[^}]+\}/)?.[0];
assert.ok(semanticRules && accentRules && printRules);
const css = `:root{${tokens}}html,body{margin:0;background:white;}
${semanticRules}${accentRules}@media print{${printRules}}
.sr-figure-media{width:100%;max-width:none;margin:0;}
.sr-figure-media>svg{width:100%;height:auto;}`;
const require = createRequire(path.join(root, "app/package.json"));
const { chromium } = require("playwright");
delete process.env.PWDEBUG;
process.env.PLAYWRIGHT_HTML_OPEN = "never";
const browser = await chromium.launch({ headless: true });
const allBrowserResults = [];
try {
  const compositorContext = await browser.newContext({ deviceScaleFactor: 1 });
  const compositor = await compositorContext.newPage();
  await compositor.setContent("<canvas id='pixels'></canvas>");
  for (const [id, spec] of specs) {
    const outputRecord = outputs.find((item) => item.figure === id);
    const svg = await readFile(outputRecord.svg.path, "utf8");
    assert.equal(hash(svg), outputRecord.svg.sha256);
    const samples = [];
    for (const theme of ["neutral", "accent", "print"]) {
      for (const width of [640, 328]) {
        const height = Math.ceil(width * spec.canvas.height / spec.canvas.width);
        const context = await browser.newContext({ viewport: { width, height },
          deviceScaleFactor: 1, colorScheme: "light" });
        await context.route("**/*", (route) => route.abort());
        const page = await context.newPage();
        const errors = [];
        page.on("pageerror", (error) => errors.push(error.message));
        await page.emulateMedia({ media: theme === "print" ? "print" : "screen" });
        await page.setContent(`<style>${css}</style><main class="${theme === "print" ? "sr-print-lesson" : ""}">
          <div class="sr-figure-media" data-figure-theme="${theme === "neutral" ? "neutral" : "accent"}">${svg}</div></main>`);
        await page.evaluate(() => document.fonts.ready);
        const geometry = await page.evaluate(() => {
          const svg = document.querySelector("svg");
          const visible = (element) => {
            const style = getComputedStyle(element);
            return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) !== 0;
          };
          const rect = (element) => {
            const box = element.getBoundingClientRect();
            return { x: box.x, y: box.y, width: box.width, height: box.height };
          };
          const screenPoint = (element, x, y) => {
            const point = new DOMPoint(x, y).matrixTransform(element.getScreenCTM());
            return [point.x, point.y];
          };
          const lines = [...svg.querySelectorAll("line")].filter(visible).map((line) => ({
            id: line.id, stroke: getComputedStyle(line).stroke,
            strokeWidth: parseFloat(getComputedStyle(line).strokeWidth) * line.getScreenCTM().a,
            from: screenPoint(line, line.x1.baseVal.value, line.y1.baseVal.value),
            shaftEnd: screenPoint(line, line.x2.baseVal.value, line.y2.baseVal.value)
          }));
          const heads = [...svg.querySelectorAll("[data-arrowhead-for]")].filter(visible).map((head) => {
            const shape = head.querySelector("path");
            return { arrow: head.getAttribute("data-arrowhead-for"), fill: getComputedStyle(shape).fill,
              path: shape.getAttribute("d"), tip: screenPoint(head, 10, 5),
              base: screenPoint(head, 0.05, 5), inside: screenPoint(head, 4, 5), bounds: rect(shape) };
          });
          const labels = [...svg.querySelectorAll("[data-label-id]")].map((label) => ({
            id: label.getAttribute("data-label-id"), text: label.textContent,
            fontFamily: getComputedStyle(label).fontFamily,
            fontWeight: getComputedStyle(label).fontWeight,
            finalFontPx: parseFloat(getComputedStyle(label).fontSize) * label.getScreenCTM().a,
            fill: getComputedStyle(label).fill, visible: visible(label), bounds: rect(label)
          }));
          const dots = [...svg.querySelectorAll("ellipse")].filter(visible).map((dot) => ({
            id: dot.id, fill: getComputedStyle(dot).fill, bounds: rect(dot),
            center: screenPoint(dot, dot.cx.baseVal.value, dot.cy.baseVal.value)
          }));
          const visibleColors = [...svg.querySelectorAll("line,ellipse,path,text")]
            .filter((element) => !element.closest("defs") && visible(element))
            .map((element) => ({ id: element.id || element.getAttribute("data-label-id"),
              strokeAttribute: element.getAttribute("stroke"), fillAttribute: element.getAttribute("fill") }));
          const media = document.querySelector(".sr-figure-media");
          return { svg: rect(svg), lines, heads, labels, dots, visibleColors,
            fontSetStatus: document.fonts.status, media: matchMedia("print").matches ? "print" : "screen",
            roles: Object.fromEntries(["ink", "muted", "accent", "accent-soft", "grid", "paper"]
              .map((role) => [role, getComputedStyle(media).getPropertyValue(`--ld-figure-${role}`).trim()])) };
        });
        assert.equal(errors.length, 0);
        assert.equal(geometry.svg.width, width);
        assert.equal(geometry.svg.height, width * spec.canvas.height / spec.canvas.width);
        const arrows = spec.objects.filter((item) => item.type === "arrow");
        assert.equal(geometry.lines.length, arrows.length);
        assert.equal(geometry.heads.length, arrows.length);
        assert.equal(geometry.labels.length, id === "fig-75" ? 4 : 3);
        const coordinate = (ref) => typeof ref === "string" ?
          spec.objects.find((item) => item.id === ref).at : ref;
        const screen = (ref) => {
          const [x, y] = coordinate(ref);
          return [x * width / 640, (spec.canvas.height - y) * width / 640];
        };
        for (const arrow of arrows) {
          const line = geometry.lines.find((item) => item.id.endsWith(`_ld-${arrow.id}`));
          const head = geometry.heads.find((item) => item.arrow === line.id);
          closePoint(line.from, screen(arrow.from));
          assert.ok(Math.hypot(...head.tip.map((value, index) => value - screen(arrow.to)[index])) < 0.5);
          assert.ok(Math.hypot(...head.base.map((value, index) => value - line.shaftEnd[index])) < 0.05);
          assert.equal(line.stroke, "rgb(21, 32, 31)");
          assert.equal(head.fill, line.stroke);
          assert.equal(head.path, "M 0,0 L 10,5 L 0,10 z");
        }
        const boxes = geometry.labels.map((item) => item.bounds);
        for (const label of geometry.labels) {
          assert.ok(label.visible && label.finalFontPx >= 16);
          assert.ok(label.bounds.x >= 0 && label.bounds.y >= 0);
          assert.ok(label.bounds.x + label.bounds.width <= width);
          assert.ok(label.bounds.y + label.bounds.height <= height);
          assert.equal(label.fill, "rgb(21, 32, 31)");
        }
        for (let a = 0; a < boxes.length; a++) for (let b = a + 1; b < boxes.length; b++) {
          const p = boxes[a], q = boxes[b];
          assert.ok(p.x + p.width <= q.x || q.x + q.width <= p.x ||
            p.y + p.height <= q.y || q.y + q.height <= p.y, "Label collision");
        }
        for (const colour of geometry.visibleColors) {
          for (const value of [colour.strokeAttribute, colour.fillAttribute].filter(Boolean)) {
            assert.ok(value === "none" || value.startsWith("var(--ld-figure-"), value);
          }
        }
        assert.equal(geometry.dots.length, id === "fig-76" ? 1 : 0);
        if (id === "fig-76") {
          assert.ok(geometry.dots[0].id.endsWith("_ld-O"));
          closePoint(geometry.dots[0].center, screen("O"));
        }
        const png = await page.screenshot({ type: "png", fullPage: false, animations: "disabled" });
        const file = path.join(out, "cells", `${id}.${theme}.${width}.png`);
        await writeFile(file, png, { flag: "wx" });
        const pixels = await compositor.evaluate(async ({ base64, geometry }) => {
          const image = new Image();
          image.src = `data:image/png;base64,${base64}`;
          await image.decode();
          const canvas = document.querySelector("canvas");
          canvas.width = image.width; canvas.height = image.height;
          const ctx = canvas.getContext("2d", { willReadFrequently: true });
          ctx.drawImage(image, 0, 0);
          const raw = ctx.getImageData(0, 0, image.width, image.height).data;
          const ink = (x, y) => {
            if (x < 0 || y < 0 || x >= image.width || y >= image.height) return false;
            const index = (y * image.width + x) * 4;
            return raw[index] < 160 && raw[index + 1] < 160 && raw[index + 2] < 160;
          };
          const near = ([x, y]) => {
            for (let dx = -2; dx <= 2; dx++) for (let dy = -2; dy <= 2; dy++) {
              if (ink(Math.round(x) + dx, Math.round(y) + dy)) return true;
            }
            return false;
          };
          let darkPixels = 0;
          for (let y = 0; y < image.height; y++) for (let x = 0; x < image.width; x++) {
            if (ink(x, y)) darkPixels++;
          }
          return { imageWidth: image.width, imageHeight: image.height, darkPixels,
            darkFraction: darkPixels / (image.width * image.height),
            shaftSamples: geometry.lines.map((line) => ({ id: line.id,
              hits: [0.2, 0.4, 0.6, 0.8].map((t) => near(line.from.map((v, i) =>
                v + t * (line.shaftEnd[i] - v)))) })),
            headSamples: geometry.heads.map((head) => ({ id: head.arrow, hit: near(head.inside) })),
            dotSamples: geometry.dots.map((dot) => ({ id: dot.id, hit: near(dot.center) })),
            glyphPixels: geometry.labels.map((label) => {
              let count = 0;
              const box = label.bounds;
              for (let y = Math.floor(box.y); y <= Math.ceil(box.y + box.height); y++) {
                for (let x = Math.floor(box.x); x <= Math.ceil(box.x + box.width); x++) if (ink(x, y)) count++;
              }
              return { id: label.id, text: label.text, count };
            }) };
        }, { base64: png.toString("base64"), geometry });
        assert.ok(pixels.darkPixels > 100 && pixels.darkFraction < 0.2);
        assert.ok(pixels.shaftSamples.every((item) => item.hits.every(Boolean)));
        assert.ok(pixels.headSamples.every((item) => item.hit));
        assert.ok(pixels.dotSamples.every((item) => item.hit));
        assert.ok(pixels.glyphPixels.every((item) => item.count > 8));
        samples.push({ theme, width, height, status: "PASS", svgSha256: outputRecord.svg.sha256,
          geometry, pixels, errors, screenshot: await bind(file), base64: png.toString("base64") });
        await context.close();
      }
    }
    const rowHeight = spec.canvas.height + 24;
    const composite = await compositor.evaluate(async ({ samples, rowHeight, id }) => {
      const canvas = document.querySelector("canvas");
      canvas.width = 968; canvas.height = rowHeight * 3;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (let index = 0; index < samples.length; index++) {
        const sample = samples[index];
        const row = Math.floor(index / 2), x = sample.width === 640 ? 0 : 640, y = row * rowHeight;
        ctx.fillStyle = "#15201f"; ctx.font = "14px Arial";
        ctx.fillText(`${id} / ${sample.theme} / ${sample.width} CSS px`, x + 6, y + 17);
        const image = new Image(); image.src = `data:image/png;base64,${sample.base64}`;
        await image.decode();
        ctx.drawImage(image, x, y + 24);
      }
      return canvas.toDataURL("image/png").split(",")[1];
    }, { samples, rowHeight, id });
    const compositePath = path.join(out, `${id}.actual-browser-six-cells.png`);
    await writeFile(compositePath, Buffer.from(composite, "base64"), { flag: "wx" });
    allBrowserResults.push({ figure: id, status: "BROWSER_ASSERTIONS_PASS_VISUAL_REVIEW_PENDING",
      svg: outputRecord.svg, composite: await bind(compositePath),
      compositeWidth: 968, compositeHeight: rowHeight * 3,
      composition: "Three theme rows; 640px cell left and 328px cell right; each screenshot copied 1:1 without scaling",
      samples: samples.map(({ base64, ...sample }) => sample) });
    console.log(`${id}: six browser cells PASS; ${compositePath}`);
  }
  await compositorContext.close();
} finally {
  await browser.close();
}
for (const item of frozenBindings) await bind(item.path, item.sha256);
for (const item of outputs) for (const kind of ["spec", "render", "svg"]) await bind(item[kind].path, item[kind].sha256);
await save("browser-observations.json", {
  schema: "independent-current-svg-browser-observations@1",
  observedAtUtc: new Date().toISOString(),
  command: ["node", path.join(out, "compare-current.mjs")],
  script: await bind(path.join(out, "compare-current.mjs")),
  css: await bind(appCssPath),
  runtime: { playwrightPath: require.resolve("playwright"), executablePath: chromium.executablePath(),
    headless: true, deviceScaleFactor: 1, userProfile: false, CDP: false, OSInput: false,
    PWDEBUG: "unset", PLAYWRIGHT_HTML_OPEN: "never", network: "aborted", browserClosed: true },
  status: "ASSERTIONS_PASS_AWAIT_TWO_COMPOSITE_IMAGE_OPENS",
  fig74BrowserInspection: "NOT_RUN_BY_AUTHORIZATION",
  rerenderSpec: false, rerunAuthorValidation: false, officialReview: false,
  actualThemes: "Current product semantic role bindings; ink-only figs unchanged under accent role remapping",
  figures: allBrowserResults
});
console.log("One comparison complete; browser closed; Phase A immutable; no source image opens.");
