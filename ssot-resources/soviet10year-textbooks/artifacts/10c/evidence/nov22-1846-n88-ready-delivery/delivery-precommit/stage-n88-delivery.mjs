import assert from "node:assert/strict";
import fs from "node:fs";
import { execFileSync } from "node:child_process";

const root = "/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck";
assert.equal(process.cwd(), root);
const git = (...args) => execFileSync("git", args, { cwd: root, encoding: "utf8", maxBuffer: 16 * 1024 * 1024 });
assert.equal(git("diff", "--cached", "--name-only").trim(), "", "Preserve existing staged edits");
const book = "ssot-resources/soviet10year-textbooks/artifacts/10c";
const lesson = "ana10-c6-s3-n88";
const completion = JSON.parse(fs.readFileSync(`${book}/evidence/nov22-1846-n88-ready-delivery/completion.json`));
assert.equal(completion.status, "OFFLINE_REVIEW_READY");
const selected = [
  ".claude/skills/ld-s10y-lesson/tools/p2c.py",
  ".claude/skills/ld-s10y-lesson/tools/test_reindex_fragments.py",
  `${book}/book.json`, `${book}/editions/modern-us-neutral/book.json`,
  `${book}/lessons/${lesson}`,
  `${book}/editions/modern-us-neutral/lessons/${lesson}`,
  ...Array.from({ length: 7 }, (_, index) => `${book}/pages/${String(67 + index).padStart(4, "0")}`),
  ...[38, 39, 40, 41].flatMap(id => [
    ...["png", "svg"].map(ext => `${book}/figures/fig-${id}.${ext}`),
    ...["spec.json", "render.json", "review.json", "svg"].map(ext =>
      `${book}/editions/modern-us-neutral/figures/fig-${id}.${ext}`),
  ]),
  ...[
    "nov22-1846-source0065-0067", "nov22-1846-source0068-0071",
    "nov22-1846-source0072-0073", "nov22-1846-local-operator0068",
    "nov22-1846-n88-answers", "nov22-1846-n88-authored-text",
    "nov22-1846-n88-choices", "nov22-1846-n88-display",
    "nov22-1846-n88-figures", "nov22-1846-n88-independent-science",
    "nov22-1846-n88-native-continuation", "nov22-1846-n88-ready-delivery",
  ].map(name => `${book}/evidence/${name}`),
];
git("add", "--", ...selected);
const stageText = (file, text) => {
  const oid = execFileSync("git", ["hash-object", "-w", "--stdin"],
    { cwd: root, input: text, encoding: "utf8" }).trim();
  git("update-index", "--cacheinfo", `100644,${oid},${file}`);
};
const usagePath = ".intentfold/tickets/STEMROBIN-184/usage.json";
const currentUsage = JSON.parse(fs.readFileSync(usagePath));
const stagedUsage = JSON.parse(git("show", `HEAD:${usagePath}`));
stagedUsage.nov22_1846_production_resume = currentUsage.nov22_1846_production_resume;
stageText(usagePath, JSON.stringify(stagedUsage, null, 2) + "\n");
const planPath = ".intentfold/tickets/STEMROBIN-184/plan.md";
const plan = fs.readFileSync(planPath, "utf8");
const start = plan.indexOf("N88 crop gap review now received");
const end = plan.indexOf("\nReal missing stages advanced:", start);
assert.ok(start >= 0 && end > start);
const headPlan = git("show", `HEAD:${planPath}`);
const titleEnd = headPlan.indexOf("\n") + 1;
stageText(planPath, headPlan.slice(0, titleEnd) +
  "\n## 184-6 N88 review-ready delivery (2026-11-22)\n\n" +
  plan.slice(start, end).trim() + "\n" + headPlan.slice(titleEnd));
const staged = git("diff", "--cached", "--name-only").trim().split("\n");
assert.ok(!staged.some(file => /(^|\/)\.env($|\.)/.test(file)));
assert.ok(staged.every(file => selected.some(prefix => file === prefix || file.startsWith(`${prefix}/`)) ||
  [usagePath, planPath].includes(file)), "No unrelated path may be staged");
console.log(JSON.stringify({ stagedFiles: staged.length,
  recordStaging: "Only nov22_1846_production_resume plus the current N88 plan entry; other record dirt remains unstaged",
  credentialsStaged: false, selection: selected }));
