const fs = require("node:fs");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-11";
const reports = ["n34-figures46-49-review-FIRST", "n34-figures50-53-review-FIRST", "n34-labels-affected-review"];
const hash = (p) => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const byId = new Map();
for (const name of reports) {
  const report = JSON.parse(fs.readFileSync(`${base}/${name}.json`, "utf8"));
  for (const figure of report.figures) {
    if (figure.status === "pass") byId.set(figure.id, figure);
  }
}
assert.equal(byId.size, 8);
const result = {
  schema: "resume182-11/approval-binding@1", status: "pass", lesson: "alg7-c4-s1-n34",
  scope: "Six unchanged FIRST passes plus affected-only label passes for fig-47 and fig-51; no new visual or whole-lesson review.",
  reports: reports.map((name) => ({ path: `${base}/${name}.json`, sha256: hash(`${base}/${name}.json`) })),
  figures: [...byId.values()].sort((a, b) => a.id.localeCompare(b.id)),
};
fs.writeFileSync(`${base}/n34-figures-approved-binding.json`, `${JSON.stringify(result, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ figures: result.figures.map((f) => f.id), imagesOpened: 0 }));
