import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const root = ".intentfold/tickets/STEMROBIN-182/tmp/6a-n28";
const history = `${root}/history/positive18-table-paragraph-before`;
const oldDraft = JSON.parse(readFileSync(`${history}/draft.json`, "utf8"));
const draft = JSON.parse(readFileSync(`${root}/draft.json`, "utf8"));
const diffs = [];
function compare(before, after, path = "") {
  if (JSON.stringify(before) === JSON.stringify(after)) return;
  if (before !== null && after !== null && typeof before === "object" && typeof after === "object") {
    for (const key of new Set([...Object.keys(before), ...Object.keys(after)])) {
      compare(before[key], after[key], `${path}/${key}`);
    }
  } else {
    diffs.push({ path, before, after });
  }
}
compare(oldDraft, draft);
const rootsIndex = draft.questions.findIndex(({ id }) => id === "four-absolute-equation-root-sets");
const tableIndex = draft.questions.findIndex(({ id }) => id === "fill-absolute-table-and-all-equalities");
const allowed = [
  `/questions/${rootsIndex}/view/options/2/text`,
  `/questions/${rootsIndex}/key/rationales/2/derivation`,
  `/questions/${rootsIndex}/key/rationales/2/misconception`,
  ...[0, 1, 2].map((index) => `/questions/${tableIndex}/view/options/${index}/text`),
];
if (diffs.length !== 6 || diffs.some(({ path }) => !allowed.includes(path))) {
  throw new Error("Unexpected draft change; refusing projection.");
}
for (const index of [0, 1, 2]) {
  const before = oldDraft.questions[tableIndex].view.options[index].text;
  const after = draft.questions[tableIndex].view.options[index].text;
  const expected = before.replace(/\n([^\n|][^\n]*)$/, "\n\n$1");
  if (after !== expected || after.length !== before.length + 1) {
    throw new Error("Table repair must be exactly one added newline per option.");
  }
}
const beforeRoots = oldDraft.questions[rootsIndex].view.options[2].text;
if (draft.questions[rootsIndex].view.options[2].text !== beforeRoots.replace(
  "a) $\\{-18,18\\}$", "a) $\\{-18\\}$",
)) {
  throw new Error("Unexpected root-candidate text change.");
}
const oldView = JSON.parse(readFileSync(`${history}/view.json`, "utf8"));
const view = {
  questions: draft.questions.map(({ id, source_numbers, view }) => ({ id, source_numbers, view })),
};
const changedViewIds = oldView.questions.filter((question, index) => (
  JSON.stringify(question) !== JSON.stringify(view.questions[index])
)).map(({ id }) => id);
if (changedViewIds.length !== 2 || !changedViewIds.includes("four-absolute-equation-root-sets") ||
    !changedViewIds.includes("fill-absolute-table-and-all-equalities")) {
  throw new Error("Unexpected pure-view changed questions.");
}
writeFileSync(`${root}/view.json`, `${JSON.stringify(view, null, 2)}\n`);
writeFileSync(`${root}/view-revised-delta.json`, `${JSON.stringify({
  questions: view.questions.filter(({ id }) => changedViewIds.includes(id)),
}, null, 2)}\n`, { flag: "wx" });

const hash = (path) => createHash("sha256").update(readFileSync(path)).digest("hex");
const archives = readdirSync(history).map((name) => ({
  path: `${history}/${name}`,
  sha256: hash(`${history}/${name}`),
}));
const unchangedCurrentFiles = archives.filter(({ path }) => {
  const name = path.slice(path.lastIndexOf("/") + 1);
  return !["draft.json", "view.json"].includes(name);
}).map(({ path, sha256 }) => {
  const name = path.slice(path.lastIndexOf("/") + 1);
  if (hash(`${root}/${name}`) !== sha256) throw new Error(`Unrelated file changed: ${name}`);
  return name;
});
const digest = (path) => {
  const execution = spawnSync("python3", [
    ".agents/skills/ld-s10y-choice/scripts/prepare.py", "digest", path,
  ], { encoding: "utf8" });
  if (execution.status !== 0) throw new Error(execution.stderr);
  return execution.stdout.trim();
};
const evidence = {
  stage: "parent-pure-view-findings-narrow-author-repair",
  lesson: "alg6-c3-s2-n28",
  findings: [
    { question_id: "four-absolute-equation-root-sets", evidence: "Every old candidate contained positive18 for the first source subtask; incorrect C now omits it using a negative-branch-only procedure while its other three incorrect shifts remain unchanged." },
    { question_id: "fill-absolute-table-and-all-equalities", evidence: "Each of the three table options now has exactly one additional newline before its narrative so that the narrative is outside the table." },
  ],
  exact_draft_delta: diffs,
  changed_view_question_ids: changedViewIds,
  mathematical_candidate_changes: 1,
  table_newline_only_changes: 3,
  other_questions_byte_content_unchanged: 11,
  original_request_other12_preserved_except_explicit_table_formatting: true,
  option_order_unchanged: true,
  all_correct_sets_unchanged: true,
  all_rationale_truths_unchanged: true,
  all_intents_unchanged: true,
  coverage_unchanged: true,
  source_and_actual_figure_evidence_reused: true,
  archived_original_files: archives,
  unchanged_current_files: unchangedCurrentFiles,
  original_structural_evidence: `${history}/validation-result.json`,
  original_validation_result_current_file_unchanged: true,
  additional_structural_execution_count: 0,
  canonical_execution_count: 0,
  new_browser_launched: false,
  parent_records_read: false,
  snapshots: Object.fromEntries(["seed", "draft", "view"].map((name) => [name, {
    path: `${root}/${name}.json`,
    canonical_sha256: digest(`${root}/${name}.json`),
    file_sha256: hash(`${root}/${name}.json`),
  }])),
  pure_view: `${root}/view.json`,
  pure_delta_view: `${root}/view-revised-delta.json`,
  next_stage: "Revised draft and pure view frozen for parent independent review; no standalone or canonical rerun.",
  observable_model: null,
  observable_usage: null,
};
writeFileSync(`${root}/narrow-repair-evidence.json`, `${JSON.stringify(evidence, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({
  changed_view_question_ids: changedViewIds,
  exact_delta_paths: diffs.map(({ path }) => path),
  additional_structural_execution_count: 0,
  canonical_execution_count: 0,
  pure_view: evidence.pure_view,
  pure_delta_view: evidence.pure_delta_view,
  evidence: `${root}/narrow-repair-evidence.json`,
  view_sha256: evidence.snapshots.view.canonical_sha256,
}, null, 2));
