import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const repo = "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck";
const scope = path.join(repo, ".intentfold/tickets/STEMROBIN-188/tmp/n64-figure96-review-01");
const author = path.join(repo, ".intentfold/tickets/STEMROBIN-188/tmp/n64-text-review-figure-author-01");
const recovery = process.argv.includes("--browser-recovery-01");
const sourcePath = path.join(repo, ".intentfold/tickets/STEMROBIN-188/tmp/g10-n64/artifacts/9-10g/figures/fig-g10-96.png");
const lessonPath = path.join(repo, ".intentfold/tickets/STEMROBIN-188/tmp/g10-n64/work/adapt/9-10g/modern-us-neutral/lessons/geo910-c2-s3-n64/lesson.template.json");
const digest = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const load = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
function binding(file, role) {
  const st = fs.statSync(file);
  return { role, path: path.resolve(file), sha256: digest(fs.readFileSync(file)), bytes: st.size, mode: (st.mode & 0o7777).toString(8).padStart(4, "0") };
}
function writeJson(name, value) {
  const target = path.resolve(scope, recovery ? name.replace(/\.json$/, ".recovery-01.json") : name);
  assert.ok(target.startsWith(`${scope}/`));
  fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
}

const startedAt = new Date().toISOString();
const authorFiles = fs.readdirSync(author).filter((name) => fs.statSync(path.join(author, name)).isFile());
const before = [
  binding(sourcePath, "source-PNG"),
  binding(lessonPath, "current-modern-text-context-not-rereview"),
  ...authorFiles.map((name) => binding(path.join(author, name), `closed-author/${name}`)),
  binding(path.join(scope, "source-FIRST-inventory.json"), "independent-frozen-source-FIRST"),
  binding(path.join(repo, ".agents/skills/ld-s10y-image/scripts/record_review.py"), "existing-review-recorder")
];
writeJson("input-before.json", { capturedAt: startedAt, bindings: before });
const expected = {
  [sourcePath]: "b52716065833d05150fbbc9b9cb36d3f46c639b5d91645cb96c17c11bbfe6473",
  [path.join(author, "spec.json")]: "db9259060f3741149484f29711de98f0dc9ea29cb2d39ece18bb685b8854a4aa",
  [path.join(author, "fig-g10-96.svg")]: "98f4bf5394c433067ac86b4c44d9be2d67391fc3e7f3e99ded66fba779f93cb4",
  [path.join(author, "fig-g10-96.render.json")]: "a33690d593d3298fdc4bed83ec50572c8adb336b1a6f5c12ea1887c082a38df6",
  [path.join(scope, "source-FIRST-inventory.json")]: "1e03e79a51681235b2e01c49151b1e152674751ce55b15c29ccfd57f1da9b717"
};
for (const item of before) {
  if (expected[item.path]) assert.equal(item.sha256, expected[item.path], item.path);
}
assert.equal(before.find((item) => item.role === "independent-frozen-source-FIRST").mode, "0444");
const spec = load(path.join(author, "spec.json"));
const model = load(path.join(author, "geometry-model.json"));
const render = load(path.join(author, "fig-g10-96.render.json"));
const sideInventory = load(path.join(author, "source-inventory.json"));
const lesson = load(lessonPath);
const objects = new Map(spec.objects.map((item) => [item.id, item]));
const assertions = new Map(spec.assertions.map((item) => [item.id, item]));
assert.equal(render.status, "pass");
assert.equal(render.spec.sha256, expected[path.join(author, "spec.json")]);
assert.equal(render.output.svg.sha256, expected[path.join(author, "fig-g10-96.svg")]);
assert.deepEqual(sideInventory.inventory, spec.source.inventory);
assert.deepEqual(
  spec.source.authoritativeText.filter((item) => !item.exercise).map((item) => item.text),
  lesson.prose.filter((item) => item.text).map((item) => item.text)
);
assert.equal(load(path.join(author, "text-review.json")).status, "pass");

const checks = [];
if (!recovery) {
const dot = (a, b) => a.reduce((sum, x, i) => sum + x * b[i], 0);
const sub = (a, b) => a.map((x, i) => x - b[i]);
const norm = (a) => Math.sqrt(dot(a, a));
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const det = (a, b) => a[0] * b[1] - a[1] * b[0];
const coord = (value) => Array.isArray(value) ? value : (objects.get(value).at);
function near(id, residual, detail, tolerance = 1e-8) {
  checks.push({ id, residual, tolerance, status: Math.abs(residual) <= tolerance ? "pass" : "fail", detail });
}
function truth(id, actual, detail) {
  checks.push({ id, actual: Boolean(actual), status: actual ? "pass" : "fail", detail });
}

// This is an independent relationship review, not a renderer or validator invocation.
for (const group of spec.source.inventory) {
  truth(`${group.id}/object-resolution`, group.objects.every((id) => objects.has(id)), "All source-inventory object references resolve.");
  truth(`${group.id}/assertion-resolution`, group.assertions.every((id) => assertions.has(id)), "All source-inventory assertion references resolve.");
}
for (const a of spec.assertions) {
  let residual;
  switch (a.type) {
    case "distance":
      residual = norm(sub(coord(a.a), coord(a.b))) - a.value;
      break;
    case "equalDistance":
      residual = norm(sub(coord(a.a), coord(a.b))) - norm(sub(coord(a.c), coord(a.d)));
      break;
    case "collinear":
      residual = det(sub(coord(a.b), coord(a.a)), sub(coord(a.c), coord(a.a)));
      break;
    case "parallel":
      residual = det(sub(coord(a.b), coord(a.a)), sub(coord(a.d), coord(a.c)));
      break;
    case "perpendicular":
      residual = dot(sub(coord(a.b), coord(a.a)), sub(coord(a.d), coord(a.c)));
      break;
    case "pointOnLine":
      residual = det(sub(coord(a.point), coord(a.a)), sub(coord(a.b), coord(a.a)));
      break;
    case "pointOnCircle":
      residual = norm(sub(coord(a.point), coord(a.center))) - a.radius;
      break;
    case "centralSymmetry":
      residual = Math.max(...a.pairs.map((pair) => norm(sub(coord(pair.a).map((x, i) => (x + coord(pair.b)[i]) / 2), coord(a.center)))));
      break;
    case "inside": {
      const p = coord(a.point);
      const vertices = objects.get(a.container).points.map(coord);
      const sides = vertices.map((start, i) => {
        const edge = sub(vertices[(i + 1) % vertices.length], start);
        return det(edge, sub(p, start)) / norm(edge);
      });
      truth(a.id, sides.every((v) => v >= 0) || sides.every((v) => v <= 0), { signedEdgeDistances: sides, frame: "projected" });
      truth(`${a.id}/declared-margin`, Math.min(...sides.map(Math.abs)) >= a.margin - 1e-8, { minimumDistance: Math.min(...sides.map(Math.abs)), margin: a.margin });
      continue;
    }
    case "connects": {
      const line = objects.get(a.arrow);
      residual = Math.max(norm(sub(coord(line.from), coord(a.from))), norm(sub(coord(line.to), coord(a.to))));
      break;
    }
    case "objectCount":
      residual = spec.objects.filter((item) => item.type === a.objectType && item.visible !== false).length - a.count;
      break;
    default:
      throw new Error(`Unreviewed assertion type ${a.type}`);
  }
  near(a.id, residual, { type: a.type, frame: a.coordinateFrame ?? "projected" });
}
for (const group of spec.source.inventory.filter((item) => item.requires?.includes("pointRelationships"))) {
  const pointIds = group.objects.filter((id) => objects.get(id).type === "point");
  const relationshipIds = group.assertions.filter((id) => ["collinear", "equalDistance", "centralSymmetry"].includes(assertions.get(id).type));
  for (const id of pointIds) {
    truth(`${group.id}/${id}/point-coverage`, relationshipIds.some((assertionId) => JSON.stringify(assertions.get(assertionId)).includes(`"${id}"`)), "Coverage is supplied by projected relationships among A, O, B inside the mapped group, not objectCount or isolated meridian literals.");
  }
}

const A = objects.get("source-contact-A").spatialAt;
const O = objects.get("source-center-O").spatialAt;
const B = objects.get("source-endpoint-B").spatialAt;
const plane = objects.get("source-plane-alpha").spatialPoints;
const ends = objects.get("source-tangent-line-a").spatialEndpoints;
const radius = model.radius;
const OA = sub(A, O);
const OB = sub(B, O);
const AB = sub(A, B);
const u = sub(plane[1], plane[0]);
const v = sub(plane[3], plane[0]);
const normal = cross(u, v);
const unitNormal = normal.map((x) => x / norm(normal));
truth("spatial/independent-plane-nondegenerate", norm(normal) > 1e-8, { areaNormal: normal });
near("spatial/A-on-sphere", norm(OA) - radius, "A is on the 3D sphere, not its 2D silhouette.");
near("spatial/B-on-sphere", norm(OB) - radius, "B is on the 3D sphere.");
near("spatial/O-midpoint", norm(sub(A.map((x, i) => (x + B[i]) / 2), O)), "O is the midpoint of AB.");
near("spatial/AB-diameter", norm(AB) - 2 * radius, "AB is a sphere diameter.");
near("spatial/AB-normal-to-plane", norm(cross(AB, unitNormal)), "Plane normal is independently derived from patch vertices.");
near("spatial/OA-normal-to-plane", norm(cross(OA, unitNormal)), "Radius OA is perpendicular to alpha.");
for (let i = 0; i < plane.length; i++) {
  near(`spatial/plane-vertex-${i}-coplanar`, dot(sub(plane[i], A), unitNormal), "Patch vertex belongs to the tangent plane through A.");
  near(`spatial/plane-vertex-${i}-projection`, norm(sub(plane[i].slice(0, 2), objects.get("source-plane-alpha").points[i])), "Visible patch is the XY projection of the checked plane.");
}
near("spatial/center-plane-distance-radius", Math.abs(dot(sub(plane[0], O), unitNormal)) - radius, "Sphere-plane contact is unique: the plane distance equals R, and its foot is A.");
near("spatial/A-on-line-midpoint", norm(sub(ends[0].map((x, i) => (x + ends[1][i]) / 2), A)), "A is on the finite drawn portion of line a.");
const direction = sub(ends[1], ends[0]);
near("spatial/tangent-direction-normal-dot", dot(direction, OA), "For X=A+t*d, |X-O|^2=R^2+t^2*|d|^2; d is nonzero and perpendicular to OA, hence only t=0 meets the sphere.");
truth("spatial/tangent-direction-nonzero", norm(direction) > 0, { squaredNorm: dot(direction, direction) });
for (let i = 0; i < ends.length; i++) {
  near(`spatial/line-end-${i}-on-plane`, dot(sub(ends[i], A), unitNormal), "Line endpoint belongs to alpha.");
  near(`spatial/line-end-${i}-on-patch-edge`, norm(sub(ends[i], (i === 0 ? [plane[0], plane[3]] : [plane[1], plane[2]]).reduce((acc, p) => acc.map((x, j) => x + p[j] / 2), [0, 0, 0]))), "Both finite endpoints are on opposite patch edges; midpoint placement is modern regularization, not a scanned given.");
}
for (const [id, p, m] of [["source-contact-A", A, model.A], ["source-center-O", O, model.O], ["source-endpoint-B", B, model.B]]) {
  near(`spatial/${id}/model-binding`, norm(sub(p, m)), "Spatial model and current object agree.");
  near(`spatial/${id}/projection-binding`, norm(sub(p.slice(0, 2), objects.get(id).at)), "Displayed point is exactly the XY projection.");
}
near("spatial/model-plane-normal", norm(cross(model.planeNormal, unitNormal)), "Stored model normal agrees with the independently derived plane normal.");
near("spatial/model-plane-constant", dot(model.planeNormal, A) - model.planeConstant, "Stored plane equation passes through A.");
near("outline/solid-dashed-join-1", norm(sub(objects.get("source-sphere-solid").start, objects.get("source-sphere-dashed").end)), "First solid/dashed join is shared, not two disconnected curves.");
near("outline/solid-dashed-join-2", norm(sub(objects.get("source-sphere-solid").end, objects.get("source-sphere-dashed").start)), "Second solid/dashed join is shared.");
truth("style/diameter-dashed", objects.get("source-diameter-AB").dash === 2, "Source B-O-A is dashed.");
truth("style/tangent-solid", !objects.get("source-tangent-line-a").dash, "Source a is solid.");
truth("style/outline-solid-dashed", !objects.get("source-sphere-solid").dash && objects.get("source-sphere-dashed").dash === 2, "Source left/lower versus upper/right distinction retained.");
truth("labels/exact-source-set", JSON.stringify(spec.objects.filter((o) => o.label || o.text).map((o) => o.label || o.text).sort()) === JSON.stringify(["A", "B", "O", "a", "\u03b1"].sort()), "Exactly the five source labels; alpha is a mathematical symbol, not cultural text.");
truth("objects/no-extra-visible-lines-or-dots", spec.objects.length === 10 && spec.objects.filter((o) => o.type === "point").length === 3 && spec.objects.every((o) => !["axis", "grid", "measure", "arrow", "svgPath", "image"].includes(o.type)), "No absent-source radius, right-angle glyph, sphere latitude or cultural illustration added.");
writeJson("independent-math-check.json", {
  schema: "same188/independent-figure-math@1",
  status: checks.every((item) => item.status === "pass") ? "pass" : "fail",
  inputSpec: binding(path.join(author, "spec.json"), "current-spec"),
  method: "Independent arithmetic on current FigureSpec and 3D projection, derived plane normal and linked objects. Existing validator/renderer PASS stages reused without invoking validate_spec.py or render_spec.mjs.",
  assertionsReviewed: spec.assertions.length,
  checks,
  projectionCaution: "AB normal to alpha and OA normal to a are 3D facts; the oblique 2D projection is not asserted perpendicular. Source A/B are not forced onto the silhouette.",
  textReview: "Existing modern-text PASS reused. Current prose loaded only as authoritative figure context; no new lesson/exercise text verdict."
});
assert.ok(checks.every((item) => item.status === "pass"), "Independent mathematics failed; no browser-dependent PASS can override it.");
} else {
  const passedMath = load(path.join(scope, "independent-math-check.json"));
  assert.equal(passedMath.status, "pass");
  assert.equal(passedMath.inputSpec.sha256, expected[path.join(author, "spec.json")]);
  checks.push(...passedMath.checks);
}

process.env.TMPDIR = path.join(scope, "runtime-tmp");
fs.mkdirSync(process.env.TMPDIR, { recursive: true });
const appRequire = createRequire(path.join(repo, "app/package.json"));
const { chromium } = appRequire("playwright");
const svgPath = path.join(author, "fig-g10-96.svg");
const svg = fs.readFileSync(svgPath, "utf8");
const harness = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'none'; connect-src 'none'; font-src 'none'">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Figure 96 offline review</title>
<style>
html,body{margin:0;background:white;color:black}
body{padding:24px;box-sizing:border-box}
#window{width:640px;max-width:100%;overflow-x:auto;overflow-y:hidden}
#media{width:640px;height:640px;flex:none}
#media>svg{width:640px!important;height:640px!important;max-width:none!important}
@media(max-width:600px){body{padding:24px 45px}#window{width:300px;max-width:300px}}
</style></head><body><div id="window" role="region" aria-label="Figure 96" tabindex="0"><div id="media">${svg}</div></div></body></html>`;
if (!recovery) fs.writeFileSync(path.join(scope, "offline-preview.html"), harness, { flag: "wx" });
else assert.equal(fs.readFileSync(path.join(scope, "offline-preview.html"), "utf8"), harness);
const receipt = {
  schema: "same188/offline-playwright-figure-check@1",
  startedAt: new Date().toISOString(),
  status: "running",
  mode: "headless-isolated-offline-current-svg",
  headedProductAcceptance: false,
  sourcePageReopened: false,
  applicationStarted: false,
  runtime: {
    package: appRequire.resolve("playwright"),
    version: appRequire("playwright/package.json").version,
    chromiumExecutable: chromium.executablePath(),
    temporaryDirectory: process.env.TMPDIR
  },
  inputSvg: binding(svgPath, "current-SVG"),
  network: { contextOffline: true, serviceWorkers: "block", allNonAllowlistedRequestsAborted: true, allowedLocalFiles: [pathToFileURL(svgPath).href, pathToFileURL(path.join(scope, "offline-preview.html")).href], proxy: "http://127.0.0.1:9", permittedLocalRequests: [], deniedRequests: [], requestFailures: [] },
  pageErrors: [],
  screenshots: [],
  observations: []
};
let browser;
try {
  browser = await chromium.launch({
    headless: true,
    proxy: { server: "http://127.0.0.1:9" },
    args: [
      "--disable-background-networking",
      "--disable-component-update",
      "--disable-sync",
      "--disable-default-apps",
      "--no-first-run",
      "--host-resolver-rules=MAP * ~NOTFOUND",
      `--disk-cache-dir=${path.join(scope, "runtime-tmp/disk-cache")}`
    ]
  });
  receipt.runtime.chromiumVersion = browser.version();
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1, offline: true, serviceWorkers: "block" });
  await context.route("**/*", async (route) => {
    if (receipt.network.allowedLocalFiles.includes(route.request().url())) {
      receipt.network.permittedLocalRequests.push(route.request().url());
      await route.continue();
      return;
    }
    receipt.network.deniedRequests.push(route.request().url());
    await route.abort("internetdisconnected");
  });
  const page = await context.newPage();
  page.on("pageerror", (e) => receipt.pageErrors.push(String(e)));
  page.on("requestfailed", (request) => receipt.network.requestFailures.push({ url: request.url(), failure: request.failure() }));
  await page.goto(pathToFileURL(svgPath).href, { waitUntil: "load" });
  receipt.directSvgOpen = await page.evaluate(() => ({
    url: location.href,
    root: document.documentElement.localName,
    viewBox: document.documentElement.getAttribute("viewBox"),
    width: document.documentElement.getBoundingClientRect().width,
    labels: [...document.querySelectorAll("text")].map((e) => e.textContent)
  }));
  assert.equal(receipt.directSvgOpen.root, "svg");
  assert.equal(receipt.directSvgOpen.width, 640);
  await page.goto(pathToFileURL(path.join(scope, "offline-preview.html")).href, { waitUntil: "load" });
  async function metrics(name) {
    const result = await page.evaluate(() => {
      const media = document.querySelector("#media");
      const svgRoot = document.querySelector("#media>svg");
      const windowElement = document.querySelector("#window");
      const rootBox = svgRoot.getBoundingClientRect();
      const windowBox = windowElement.getBoundingClientRect();
      const box = (r) => ({ x: r.x, y: r.y, width: r.width, height: r.height });
      const labels = [...svgRoot.querySelectorAll("text")].map((el) => {
        const r = el.getBoundingClientRect();
        const bbox = el.getBBox();
        const transform = el.getScreenCTM();
        const fontSize = parseFloat(getComputedStyle(el).fontSize);
        return {
          id: el.getAttribute("data-label-id"),
          text: el.textContent,
          screenBox: box(r),
          svgGlyphBBox: box(bbox),
          fontSizePx: fontSize,
          finalGlyphEmPx: fontSize * Math.min(Math.hypot(transform.a, transform.b), Math.hypot(transform.c, transform.d)),
          insideSvgCanvas: r.left >= rootBox.left && r.top >= rootBox.top && r.right <= rootBox.right && r.bottom <= rootBox.bottom,
          fullyVisibleInScrollWindow: r.left >= windowBox.left && r.right <= windowBox.right && r.top >= windowBox.top && r.bottom <= windowBox.bottom
        };
      });
      const geometry = [...svgRoot.querySelectorAll("path,line,polygon,ellipse")].filter((el) => {
        const s = getComputedStyle(el);
        return s.display !== "none" && s.visibility !== "hidden";
      }).map((el) => {
        const r = el.getBoundingClientRect();
        const halfStroke = parseFloat(getComputedStyle(el).strokeWidth || "0") / 2;
        return {
          id: el.id,
          tag: el.localName,
          box: box(r),
          halfStroke,
          insideCanvasIncludingStroke: r.left - halfStroke >= rootBox.left && r.top - halfStroke >= rootBox.top && r.right + halfStroke <= rootBox.right && r.bottom + halfStroke <= rootBox.bottom,
          dash: getComputedStyle(el).strokeDasharray
        };
      });
      const canvas = document.createElement("canvas");
      canvas.width = 640;
      canvas.height = 640;
      return {
        viewport: { width: innerWidth, height: innerHeight, devicePixelRatio },
        media: box(media.getBoundingClientRect()),
        svg: box(rootBox),
        window: { ...box(windowBox), clientWidth: windowElement.clientWidth, scrollWidth: windowElement.scrollWidth, scrollLeft: windowElement.scrollLeft, maxScrollLeft: windowElement.scrollWidth - windowElement.clientWidth },
        labels,
        visibleGeometryCount: geometry.length,
        geometry,
        minimumFinalGlyphEmPx: Math.min(...labels.map((item) => item.finalGlyphEmPx)),
        pageHorizontalOverflow: document.documentElement.scrollWidth > innerWidth
      };
    });
    assert.equal(result.media.width, 640);
    assert.equal(result.svg.width, 640);
    assert.equal(result.labels.length, 5);
    assert.ok(result.minimumFinalGlyphEmPx >= 16);
    assert.ok(result.labels.every((item) => item.insideSvgCanvas));
    assert.ok(result.geometry.every((item) => item.insideCanvasIncludingStroke));
    assert.equal(result.pageHorizontalOverflow, false);
    receipt.observations.push({ name, ...result });
    return result;
  }
  const desktop = await metrics("desktop-full-640");
  assert.equal(desktop.window.scrollLeft, 0);
  assert.ok(desktop.labels.every((item) => item.fullyVisibleInScrollWindow));
  const desktopFile = path.join(scope, "desktop-full-640.png");
  await page.locator("#media").screenshot({ path: desktopFile });
  receipt.screenshots.push(binding(desktopFile, "desktop-full-640"));
  await page.setViewportSize({ width: 390, height: 844 });
  for (const [name, left] of [["mobile-start-0", 0], ["mobile-middle-170", 170], ["mobile-end-340", 340]]) {
    await page.locator("#window").evaluate((el, position) => { el.scrollLeft = position; }, left);
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const actual = await metrics(name);
    assert.equal(actual.window.clientWidth, 300);
    assert.equal(actual.window.scrollWidth, 640);
    assert.equal(actual.window.scrollLeft, left);
    if (name === "mobile-end-340") assert.equal(actual.window.scrollLeft, actual.window.maxScrollLeft);
    const target = path.join(scope, `${name}.png`);
    await page.screenshot({ path: target });
    receipt.screenshots.push(binding(target, name));
  }
  const mobile = receipt.observations.filter((item) => item.name.startsWith("mobile"));
  receipt.mobileLabelCoverage = desktop.labels.map((label) => ({
    id: label.id,
    text: label.text,
    fullyVisibleAt: mobile.filter((view) => view.labels.find((item) => item.id === label.id)?.fullyVisibleInScrollWindow).map((view) => view.window.scrollLeft)
  }));
  assert.ok(receipt.mobileLabelCoverage.every((item) => item.fullyVisibleAt.length > 0));
  receipt.mobileContentRangesPx = mobile.map((item) => [item.window.scrollLeft, item.window.scrollLeft + item.window.clientWidth]);
  assert.equal(receipt.pageErrors.length, 0);
  assert.equal(receipt.network.deniedRequests.length, 0);
  receipt.status = "pass";
  await context.close();
} catch (error) {
  receipt.status = "blocked";
  receipt.error = { name: error.name, message: error.message, stack: error.stack };
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  receipt.browserClosed = true;
  receipt.finishedAt = new Date().toISOString();
  writeJson("browser-receipt.json", receipt);
  const after = before.map((item) => {
    const current = binding(item.path, item.role);
    return {
      role: item.role,
      path: item.path,
      sha256Before: item.sha256,
      sha256After: current.sha256,
      bytesBefore: item.bytes,
      bytesAfter: current.bytes,
      modeBefore: item.mode,
      modeAfter: current.mode,
      unchanged: item.sha256 === current.sha256 && item.bytes === current.bytes && item.mode === current.mode
    };
  });
  writeJson("input-after-browser.json", { capturedAt: new Date().toISOString(), bindings: after, allUnchanged: after.every((item) => item.unchanged) });
  console.log(JSON.stringify({ mathematics: checks.every((item) => item.status === "pass") ? "pass" : "fail", browser: receipt.status, screenshotsCreated: receipt.screenshots.length, allInputsUnchanged: after.every((item) => item.unchanged), browserClosed: receipt.browserClosed, scope }));
}
