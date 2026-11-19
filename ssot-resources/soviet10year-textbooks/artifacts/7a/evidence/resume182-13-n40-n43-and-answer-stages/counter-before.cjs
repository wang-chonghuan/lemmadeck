const fs = require("node:fs");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13/counter-affected";
fs.mkdirSync(base, { recursive: true });
const files = [
  ".claude/skills/ld-s10y-lesson/tools/layout.py",
  ".claude/skills/ld-s10y-lesson/tests/test_wrapped_fraction_baselines.py",
  ...[251, 258].flatMap(page => [
    ...["page.md", "page.json", "audit.json"].map(name =>
      `ssot-resources/soviet10year-textbooks/artifacts/7a/pages/${String(page).padStart(4, "0")}/${name}`),
    ...["page.png", "layout.json"].map(name =>
      `.tmp/ld-s10y-lesson/7a/pages/${String(page).padStart(4, "0")}/${name}`),
  ]),
];
const inputs = files.map(file => {
  const bytes = fs.readFileSync(file);
  const sha256 = crypto.createHash("sha256").update(bytes).digest("hex");
  if (!file.endsWith(".png")) {
    fs.writeFileSync(`${base}/${file.replaceAll("/", "__")}`, bytes, { flag: "wx" });
  }
  return { path: file, sha256 };
});
fs.writeFileSync(`${base}/before-inputs.json`, JSON.stringify(inputs, null, 2) + "\n", { flag: "wx" });
