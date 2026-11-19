const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");

const cwd = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
assert.equal(process.cwd(), cwd);
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-11";
const display = `${base}/display/n35-FIRST`;
const mode = process.argv[2];
assert(["pre-open", "post-observation"].includes(mode));
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const binding = (file, expected) => {
  assert(path.resolve(file).startsWith(`${cwd}/`));
  const actual = hash(file);
  if (expected) assert.equal(actual, expected, file);
  return { path: file, sha256: actual, bytes: fs.statSync(file).size };
};

const resultPath = `${display}/result.json`;
const result = read(resultPath);
assert.equal(result.cwd, cwd);
assert.equal(result.status, "pass");
assert.equal(result.checks.length, 6);
const expectedKeys = new Set(["text", "exercises", "choices"].flatMap((surface) =>
  [1440, 390].map((width) => `${surface}-${width}`)));
const checks = result.checks.map((check) => {
  const key = `${check.surface}-${check.viewport.width}`;
  assert(expectedKeys.delete(key), key);
  assert.equal(check.lesson, "alg7-c4-s1-n35");
  assert.equal(check.viewport.height, check.viewport.width === 1440 ? 960 : 844);
  assert.equal(check.screenshot.path, `${display}/alg7-c4-s1-n35-${key}.png`);
  assert.equal(check.layout.rootOverflow, 0);
  assert(check.layout.scrolls.every((item) => item.reachable));
  assert.deepEqual(check.consoleErrors, []);
  const screenshot = binding(check.screenshot.path, check.screenshot.sha256);
  const png = fs.readFileSync(check.screenshot.path);
  assert.equal(png.subarray(1, 4).toString(), "PNG");
  screenshot.pixelWidth = png.readUInt32BE(16);
  screenshot.pixelHeight = png.readUInt32BE(20);
  assert(screenshot.pixelWidth > 0 && screenshot.pixelWidth <= check.viewport.width);
  assert(screenshot.pixelHeight >= check.viewport.height);
  return {
    key,
    viewport: check.viewport,
    screenshot,
    html: binding(check.html.path, check.html.sha256),
    machineLayout: check.layout,
  };
});
assert.equal(expectedKeys.size, 0);

const displayReceiptPath = `${base}/stages/n35-display-FIRST.receipt.json`;
const displayReceipt = read(displayReceiptPath);
assert.equal(displayReceipt.cwd, cwd);
assert.equal(displayReceipt.exit, 0);
const displayStreams = displayReceipt.streams.map((stream) => binding(stream.path, stream.sha256));
const displaySummary = read(`${base}/stages/n35-display-FIRST.stdout`);
assert.equal(displaySummary.status, "pass");
assert.equal(displaySummary.completedSurfaces, 6);
assert.equal(displaySummary.result, resultPath);

const figureReviewPath = `${base}/n35-figures-review-FIRST.json`;
const figureReview = read(figureReviewPath);
assert.equal(figureReview.status, "pass");
assert.equal(figureReview.figures.length, 2);
const edition = "ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral";
const figures = figureReview.figures.map((figure) => {
  assert.equal(figure.status, "pass");
  return {
    id: figure.id,
    inheritedStatus: figure.status,
    source: binding(figure.source.path, figure.source.sha256),
    approvedCandidateSvg: binding(figure.svg.path, figure.svg.sha256),
    currentDurableSvg: binding(`${edition}/figures/${figure.id}.svg`, figure.svg.sha256),
    reuseScope: "Previously independent source/math/label pass; no figure images reopened.",
  };
});

const choiceFolder = `${edition}/lessons/alg7-c4-s1-n35/choice-set`;
const draftPath = `${choiceFolder}/draft.json`;
const choiceReviewPath = `${choiceFolder}/review.json`;
const draft = read(draftPath);
const choiceReview = read(choiceReviewPath);
assert.equal(choiceReview.outcome, "pass");
const canonicalDraftSha256 = execFileSync("python3", [
  ".agents/skills/ld-s10y-choice/scripts/prepare.py", "digest", draftPath,
], { cwd, encoding: "utf8", env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" } }).trim();
assert.equal(canonicalDraftSha256, choiceReview.draft_sha256);
assert.equal(draft.questions.length, 10);
const optionCount = draft.questions.reduce((sum, question) => sum + question.view.options.length, 0);
assert.equal(optionCount, 48);

const evidence = {
  schema: "offline-display-bindings@1",
  phase: mode,
  recordedAt: new Date().toISOString(),
  cwd,
  status: "pass",
  imagePixelLoadsInThisCommand: 0,
  rendererBrowserDomExecutions: 0,
  result: binding(resultPath),
  displayReceipt: binding(displayReceiptPath),
  displayStreams,
  checkerContract: binding(`${base}/check-display.mjs`),
  checkerContractInterpretation: "Existing exit-0 six-surface run asserts one h1, visible sheet, zero input/textarea/button/select, zero .err/.katex-error, matching prose/exercise/question/option counts. Not re-executed. Original receipt does not record checker source hash; this is its current hash.",
  checks,
  inheritedFigureReview: binding(figureReviewPath),
  inheritedFigures: figures,
  choices: {
    status: "pass",
    questions: 10,
    options: optionCount,
    draft: binding(draftPath),
    canonicalDraftSha256,
    review: binding(choiceReviewPath),
    semanticGateReconsidered: false,
  },
};

if (mode === "post-observation") {
  const before = read(`${display}/ownreceipts/pre-open-hashes.json`);
  for (const key of ["result", "displayReceipt", "checkerContract", "inheritedFigureReview"]) {
    assert.equal(evidence[key].sha256, before[key].sha256);
  }
  assert.deepEqual(evidence.checks, before.checks);
  assert.deepEqual(evidence.inheritedFigures, before.inheritedFigures);
  assert.deepEqual(evidence.choices, before.choices);
  assert.deepEqual(evidence.displayStreams, before.displayStreams);
  evidence.allBindingsUnchangedSincePreOpen = true;
}

const destination = `${display}/ownreceipts/${mode === "pre-open" ? "pre-open-hashes" : "post-observation-binding"}.json`;
fs.writeFileSync(destination, `${JSON.stringify(evidence, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify(evidence, null, 2));
