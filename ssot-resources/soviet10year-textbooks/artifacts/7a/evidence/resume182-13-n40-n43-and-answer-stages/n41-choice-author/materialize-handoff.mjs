import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
const owner = path.dirname(fileURLToPath(import.meta.url));
assert.equal(owner, path.join(root, ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n41-choice-author"));
assert.equal(process.cwd(), root);
const read = (name) => JSON.parse(readFileSync(path.join(owner, name), "utf8"));
const hash = (filename) => createHash("sha256").update(readFileSync(filename)).digest("hex");
const write = (name, value) => writeFileSync(path.join(owner, name), typeof value === "string" ? value : `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
const canonical = (value) => {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value !== null && typeof value === "object") return `{${Object.keys(value).sort().map((key) => `${canonical(key)}:${canonical(value[key])}`).join(",")}}`;
  return JSON.stringify(value).replace(/[\u007f-\uffff]/g, (char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`);
};
const digest = (value) => createHash("sha256").update(canonical(value)).digest("hex");
const seed = read("seed.json");
const draft = read("draft.json");
const taskMap = read("task-map.json");
const freeze = read("solve-freeze-receipt.json");
const amendment = read("solve-amendment-freeze-receipt.json");
assert.equal(digest(seed), draft.seed_sha256);
for (const entry of freeze.frozen_files) assert.equal(hash(path.join(owner, entry.path)), entry.sha256);
assert.equal(hash(path.join(owner, amendment.amendment_path)), amendment.amendment_sha256);
assert.equal(hash(path.join(owner, amendment.retained_first_candidate)), amendment.retained_first_candidate_sha256);
assert.equal(hash(path.join(owner, "solve-freeze-receipt.json")), amendment.original_freeze_receipt_sha256);

// Count the manually authored mapping; this script never constructs a question.
const tasks = taskMap.mapping.flatMap((entry) => entry.tasks);
assert.equal(tasks.length, 80);
assert.equal(new Set(tasks).size, 80);
assert.equal(taskMap.mapping.length, draft.questions.length);
for (const entry of taskMap.mapping) {
  const question = draft.questions.find((item) => item.id === entry.question_id);
  assert.ok(question);
  for (const task of entry.tasks) assert.ok(question.source_numbers.includes(task.split(".")[0]));
}
for (const [number, count] of Object.entries(freeze.counts_by_original)) {
  assert.equal(tasks.filter((task) => task.split(".")[0] === number).length, count);
}
assert.equal(draft.coverage.length, 17);

const images = read("image-observations.json");
for (const image of images.images) assert.equal(hash(path.join(root, image.path)), image.sha256);
const reused = images.reused_independent_approval;
assert.equal(hash(path.join(root, reused.binding_receipt)), reused.binding_receipt_sha256);
assert.equal(hash(path.join(root, reused.fig57_affected_report)), reused.fig57_affected_report_sha256);
for (const [id, binding] of [["fig-56", reused.fig56], ["fig-57", reused.fig57_ASSOCIATION_2]]) {
  for (const role of ["svg", "spec", "render", "review"]) {
    const suffix = role === "svg" ? ".svg" : `.${role}.json`;
    assert.equal(hash(path.join(root, `ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/figures/${id}${suffix}`)), binding[`${role}_sha256`]);
  }
}
const table = read("table-provenance.json");
assert.equal(hash(path.join(root, table.source_package.path)), table.source_package.sha256);
for (const filename of ["source-report.md", "freeze-receipt.json"]) {
  const key = filename === "source-report.md" ? "report_sha256" : "freeze_receipt_sha256";
  assert.equal(hash(path.join(root, path.dirname(table.source_package.path), filename)), table.source_package[key]);
}
for (const cell of table.cells) assert.equal(hash(path.join(root, cell.capture_path)), cell.capture_sha256);
for (const rule of table.rules) assert.equal(hash(path.join(root, rule.path)), rule.sha256);

const validationArgs = [
  ".agents/skills/ld-s10y-choice/scripts/validate.py", "--repo", ".",
  "--seed", path.relative(root, path.join(owner, "seed.json")),
  "--draft", path.relative(root, path.join(owner, "draft.json"))
];
const validation = spawnSync("python3", validationArgs, { cwd: root, encoding: "utf8" });
write("validation-receipt.json", {
  schema: "STEMROBIN-182/n41-choice-author-structural-validation@1",
  checked_at_utc: new Date().toISOString(),
  command: ["python3", ...validationArgs],
  exit_code: validation.status,
  stdout: validation.stdout,
  stderr: validation.stderr,
  seed_canonical_sha256: digest(seed),
  draft_canonical_sha256: digest(draft),
  draft_file_sha256: hash(path.join(owner, "draft.json")),
  semantic_review: "PENDING; no review file supplied or authored",
  source_and_figure_binding_checks: "Hashes equal retained independent evidence; not new semantic PASS"
});
assert.equal(validation.status, 0, validation.stderr);

const views = draft.questions.map((question) => question.view);
write("learner-views.json", views);
assert.deepEqual(read("learner-views.json"), views);
assert.ok(!/"(?:key|correct|rationales|intent|source_numbers|coverage)"\s*:/.test(JSON.stringify(views)));
const figureAssets = new Map(seed.figures.map((figure) => [figure.id, path.join(root, figure.assets[0].path)]));
const lines = ["# 数学练习", ""];
for (const [index, view] of views.entries()) {
  lines.push(`## ${index + 1}. ${view.mode === "multiple" ? "多选" : "单选"}`, "", view.stem, "");
  for (const id of view.figure_ids) lines.push(`[坐标图](${figureAssets.get(id)})`, "");
  for (const option of view.options) {
    lines.push(`${option.id}. ${option.text}`, "");
    for (const id of option.figure_ids) lines.push(`[选项图](${figureAssets.get(id)})`, "");
  }
}
write("learner-views.md", `${lines.join("\n")}\n`);
write("coverage-counts.json", {
  schema: "STEMROBIN-182/n41-choice-author-counts@1",
  original_count: draft.coverage.length,
  distinct_source_tasks: new Set(tasks).size,
  questions: draft.questions.length,
  single: draft.questions.filter((question) => question.view.mode === "single").length,
  multiple: draft.questions.filter((question) => question.view.mode === "multiple").length,
  options: draft.questions.reduce((sum, question) => sum + question.view.options.length, 0),
  referenced_figures: [...new Set(draft.questions.flatMap((question) => question.view.figure_ids))],
  new_figures: draft.new_figures.length,
  new_image_opens: images.image_budget.opened_this_batch,
  context_image_count: images.image_budget.context_total,
  table_image_reopens: images.image_budget.table_image_opens,
  mathematical_tasks_omitted: taskMap.mathematical_tasks_omitted,
  capacity_loss_entries: taskMap.capacity_losses.length,
  independent_semantic_review: "PENDING_AUTHOR_CANDIDATE_ONLY"
});
const fileHashes = readdirSync(owner).filter((name) => !name.startsWith(".")).sort().map((name) => ({ path: name, sha256: hash(path.join(owner, name)) }));
write("hashes.json", {
  schema: "STEMROBIN-182/n41-choice-author-file-hashes@1",
  scope: "All owned files existing at handoff; this manifest excludes itself.",
  canonical: { seed: digest(seed), draft: digest(draft) },
  files: fileHashes
});
console.log(JSON.stringify({
  status: "AUTHOR_CANDIDATE_COMPLETE_SEMANTIC_REVIEW_PENDING",
  questions: views.length, tasks: tasks.length,
  draft_canonical_sha256: digest(draft),
  hashes_file_sha256: hash(path.join(owner, "hashes.json")),
  validator_stdout: validation.stdout.trim()
}, null, 2));
