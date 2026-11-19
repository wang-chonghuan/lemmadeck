import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const cwd = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
if (process.cwd() !== cwd) throw new Error("Unauthorized cwd.");
const own = dirname(fileURLToPath(import.meta.url));
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const seed = JSON.parse(readFileSync(join(own, "seed.json"), "utf8"));
const snapshot = JSON.parse(readFileSync(join(own, "source-snapshot.json"), "utf8"));
if (JSON.stringify(seed.exercises) !== JSON.stringify(snapshot.exercises)) {
  throw new Error("Finalized exercise prose changed from the frozen solved authority.");
}
if (JSON.stringify(seed.concepts) !== JSON.stringify(snapshot.concepts)) {
  throw new Error("Selected definitions changed from the frozen solved authority.");
}
const receiptPath = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-11/stages/n34-modern-finalize-FIRST.receipt.json";
const receiptBytes = readFileSync(resolve(cwd, receiptPath));
const receipt = JSON.parse(receiptBytes.toString("utf8"));
if (receipt.exit !== 0 || receipt.cwd !== cwd) throw new Error("Finalization receipt did not succeed.");
const authority = {
  schema: "n34-final-authority-binding-v1",
  finalization_receipt: { path: receiptPath, sha256: hash(receiptBytes), exit: receipt.exit },
  exercise_prose_matches_frozen_solved_snapshot: true,
  selected_definitions_match_frozen_solved_snapshot: true,
  final_trace: seed.trace,
  original_solutions_sha256: hash(readFileSync(join(own, "source-solutions.json"))),
};
writeFileSync(join(own, "final-authority-binding.json"), `${JSON.stringify(authority, null, 2)}\n`, { flag: "wx" });

const require = createRequire(resolve(cwd, ".agents/skills/package.json"));
const { chromium } = require("playwright-core");
const executablePath = [
  chromium.executablePath(),
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].find(existsSync);
if (!executablePath) throw new Error("No installed Chromium; no installation is authorized.");
const renderRoot = join(own, "final-assets-render");
mkdirSync(renderRoot, { recursive: true });
const browser = await chromium.launchPersistentContext(join(renderRoot, "profile"), {
  executablePath,
  headless: true,
  downloadsPath: join(renderRoot, "downloads"),
  tracesDir: join(renderRoot, "traces"),
  args: [
    "--disable-background-networking",
    `--disk-cache-dir=${join(renderRoot, "cache")}`,
    `--crash-dumps-dir=${join(renderRoot, "crashes")}`,
  ],
});
const images = [];
try {
  await browser.route("**/*", (route) => route.abort());
  const page = await browser.newPage();
  for (const figure of seed.figures) {
    if (!["fig-52", "fig-53"].includes(figure.id) || figure.assets.length !== 1) {
      throw new Error("Only the two required final SVG assets are allowed.");
    }
    const asset = figure.assets[0];
    const bytes = readFileSync(resolve(cwd, asset.path));
    if (hash(bytes) !== asset.sha256) throw new Error("Final SVG hash changed.");
    await page.setContent(`<style>
      :root {
        --ld-figure-ink:#15201f; --ld-figure-muted:#4c5a58;
        --ld-figure-accent:#15201f; --ld-figure-accent-soft:#8a9795;
        --ld-figure-grid:#e3eae9; --ld-figure-paper:#ffffff;
      }
      html,body { margin:0; background:#fff; }
      svg { display:block; }
    </style>${bytes.toString("utf8")}`);
    const svg = page.locator("svg").first();
    const box = await svg.boundingBox();
    if (!box || box.width <= 0 || box.height <= 0) throw new Error("Unrenderable final SVG.");
    await page.setViewportSize({ width: Math.ceil(box.width), height: Math.ceil(box.height) });
    const imagePath = join(own, `${figure.id}-final-complete.png`);
    await svg.screenshot({ path: imagePath, animations: "disabled" });
    images.push({
      figure_id: figure.id,
      asset_path: asset.path,
      asset_sha256: asset.sha256,
      complete_render_path: imagePath,
      complete_render_sha256: hash(readFileSync(imagePath)),
      width: box.width,
      height: box.height,
      hash_recorded_before_view: true,
      view_count: 0,
    });
  }
} finally {
  await browser.close();
}
const ledger = {
  schema: "n34-final-assets-image-use-v1",
  previous_image_views: 4,
  this_stage_authorized_image_views: 2,
  batch_limit: 8,
  context_limit: 24,
  images,
  semantic_gate: "not performed by author",
};
writeFileSync(join(own, "final-image-use.json"), `${JSON.stringify(ledger, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify(ledger, null, 2));
