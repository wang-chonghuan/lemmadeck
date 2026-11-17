import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const root = "/Users/yong/.codex/worktrees/a07e/lemmadeck";
const output = path.dirname(fileURLToPath(import.meta.url));
const seedPath = path.join(root, ".intentfold/tickets/STEMROBIN-184/tmp/geo910-n19-choice-seed.json");
const expectedDigest = "21aba5ade30915e19ae40469c14a891e7b70f16f33ac4e9c32f7fe14536de2f4";
const sha = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const canonical = (value) => {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value !== null && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${canonical(key)}:${canonical(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value).replace(/[\u007f-\uffff]/g, (char) =>
    `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`);
};
const jsonOutput = (name, value) =>
  fs.writeFileSync(path.join(output, name), `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
const seedBytes = fs.readFileSync(seedPath);
const seed = JSON.parse(seedBytes);
assert.equal(sha(canonical(seed)), expectedDigest);
assert.deepEqual(seed.exercises.map((item) => item.number), ["186", "187", "188", "189", "190", "191"]);
assert.deepEqual(seed.concepts.map((item) => item.block), [1, 2, 5, 8, 9]);
assert.deepEqual(seed.figures.map((item) => item.id), ["fig-75", "fig-76"]);
assert(seed.exercises.every((item) => item.figure_ids.length === 0));

const inputs = [];
const record = (absolutePath, role, expected = null) => {
  const bytes = fs.readFileSync(absolutePath);
  const digest = sha(bytes);
  if (expected !== null) assert.equal(digest, expected, absolutePath);
  inputs.push({
    path: absolutePath,
    realpath: fs.realpathSync(absolutePath),
    role,
    byte_length: bytes.length,
    sha256: digest,
    expected_sha256: expected,
    matches_expected: expected === null ? null : true,
  });
  return bytes;
};
record(seedPath, "sole_mathematical_prose_input");
const policyPaths = [
  ".intentfold/readme.md",
  ".intentfold/charter/engineering.md",
  ".intentfold/charter/operations.md",
  ".intentfold/project.json",
  ".agents/skills/ld-s10y-choice/SKILL.md",
  ".agents/skills/ld-s10y-choice/references/review.md",
  ".agents/skills/ld-s10y-choice/references/contract.md",
  ".agents/skills/ld-s10y-image/SKILL.md",
  "/Users/yong/.agents/skills/intentfold/SKILL.md",
  "/Users/yong/.agents/skills/context7-mcp/SKILL.md",
];
for (const item of policyPaths) record(path.isAbsolute(item) ? item : path.join(root, item), "policy_read_not_mathematical_source");
for (const item of seed.trace) record(path.join(root, item.path), "seed_trace_freshness_hash_only_not_parsed", item.sha256);

const requireApp = createRequire(path.join(root, "app/package.json"));
const playwrightEntry = requireApp.resolve("@playwright/test");
record(playwrightEntry, "existing_app_playwright_runtime_entry_not_content");
const { chromium } = requireApp("@playwright/test");
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1 });
await context.route("**/*", (route) => route.abort());
const renders = [];
try {
  for (const figure of seed.figures) {
    assert.equal(figure.assets.length, 1);
    const asset = figure.assets[0];
    const sourcePath = path.join(root, asset.path);
    assert(fs.realpathSync(sourcePath).startsWith(path.join(root, "ssot-resources/soviet10year-textbooks/artifacts/9-10g/")));
    const svg = record(sourcePath, "actual_seed_svg_render_input", asset.sha256).toString("utf8");
    assert(!/<script\b/i.test(svg), "Unexpected active content in source SVG");
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>
      html,body{margin:0;background:white;color:#111}
      #source{padding:24px;width:max-content;height:max-content}
      #source>svg{display:block;overflow:visible}
      </style></head><body><main id="source">${svg}</main></body></html>`);
    await page.locator("#source>svg").waitFor({ state: "visible" });
    await page.evaluate(() => document.fonts.ready);
    const geometry = await page.locator("#source>svg").evaluate((element) => {
      const rect = element.getBoundingClientRect();
      const box = element.viewBox.baseVal;
      const labels = [...element.querySelectorAll("text,foreignObject")].map((label) => {
        const bounds = label.getBoundingClientRect();
        return { text: label.textContent, x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height };
      });
      return {
        rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
        viewBox: { x: box.x, y: box.y, width: box.width, height: box.height },
        labels,
        graphical_element_count: element.querySelectorAll("path,line,polygon,polyline,circle,ellipse,rect").length,
      };
    });
    assert(geometry.rect.width > 0 && geometry.rect.height > 0);
    const viewport = {
      width: Math.max(1440, Math.ceil(geometry.rect.width + 48)),
      height: Math.max(960, Math.ceil(geometry.rect.height + 48)),
    };
    await page.setViewportSize(viewport);
    const bounds = await page.locator("#source").boundingBox();
    assert(bounds && bounds.x >= 0 && bounds.y >= 0);
    assert(bounds.x + bounds.width <= viewport.width && bounds.y + bounds.height <= viewport.height);
    assert.equal(errors.length, 0);
    const screenshotPath = path.join(output, `${figure.id}-full-current.png`);
    assert(!fs.existsSync(screenshotPath), "Refusing to overwrite image evidence");
    await page.screenshot({ path: screenshotPath, fullPage: true, animations: "disabled" });
    renders.push({
      figure_id: figure.id,
      source_path: sourcePath,
      source_sha256: asset.sha256,
      screenshot_path: screenshotPath,
      screenshot_sha256: sha(fs.readFileSync(screenshotPath)),
      viewport,
      geometry,
      whole_svg_with_24px_margin: true,
      page_errors: errors,
    });
    await page.close();
  }
  jsonOutput("render-evidence.json", {
    schema: "independent-source-render-evidence-v1",
    rendered_at: new Date().toISOString(),
    renderer: "existing app @playwright/test chromium",
    playwright_entry: playwrightEntry,
    browser_version: browser.version(),
    headless: true,
    isolated_new_context: true,
    network_requests_aborted: true,
    user_profile: false,
    cdp: false,
    os_input: false,
    app_or_database_started: false,
    inputs: "exact current seed SVG bytes, no source specs or author outputs",
    renders,
  });
} finally {
  await context.close();
  await browser.close();
}
record(fileURLToPath(import.meta.url), "reviewer_owned_render_script");
jsonOutput("inputhashledger.json", {
  schema: "independent-source-inputhashledger-v1",
  phase: "phase1_source_first",
  recorded_at: new Date().toISOString(),
  workspace: root,
  seed_path: seedPath,
  seed_raw_sha256: sha(seedBytes),
  seed_canonical_sha256: sha(canonical(seed)),
  expected_seed_canonical_sha256: expectedDigest,
  canonical_digest_matches: true,
  inputs,
  path_clarification: {
    TMP: path.dirname(seedPath),
    nonexistent_exact_probe_paths: [
      path.join(root, "TMP/geo910-n19-choice-seed.json"),
      path.join(root, ".tmp/geo910-n19-choice-seed.json"),
      path.join(root, "tmp/geo910-n19-choice-seed.json"),
    ],
    wrong_root_files_created: [],
    author_tree_search_performed: false,
  },
  unprovided_inputs: [
    "live ticket prose and ticket workflow artifacts intentionally not opened",
    "draft and learner choice views",
    "internal author solution, key, misconceptions and reports",
    "previous choices, answers, interactions, judging parts, reviewer outputs",
    "old skill versions and tests",
    "SVG specs, render reports and pre-existing figure reviews",
  ],
  access_events: [
    { operation: "read_policy_text", repeats: "none except seed digest reads", mathematical_authority: false },
    { operation: "read_seed_and_verify_canonical_digest", expected_matched: true },
    { operation: "hash_only_seed_trace_files", count: seed.trace.length, parsed: false },
    { operation: "render_seed_svg", count: renders.length, image_opens: 0 },
  ],
});
console.log(JSON.stringify({ seed_canonical_sha256: expectedDigest, output_directory: output, renders }, null, 2));
