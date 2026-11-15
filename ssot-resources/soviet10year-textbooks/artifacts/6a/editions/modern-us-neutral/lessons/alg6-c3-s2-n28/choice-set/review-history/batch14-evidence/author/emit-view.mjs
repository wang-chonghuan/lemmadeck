import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const root = ".intentfold/tickets/STEMROBIN-182/tmp/6a-n28";
const paths = Object.fromEntries(["seed", "draft", "view", "validation-result"].map(
  (name) => [name, `${root}/${name}.json`],
));
if (existsSync(paths.view) || existsSync(paths["validation-result"])) {
  throw new Error("Existing projection or validation record; refusing a second execution.");
}
const seed = JSON.parse(readFileSync(paths.seed, "utf8"));
const draft = JSON.parse(readFileSync(paths.draft, "utf8"));
const view = {
  questions: draft.questions.map(({ id, source_numbers, view }) => ({ id, source_numbers, view })),
};
writeFileSync(paths.view, `${JSON.stringify(view, null, 2)}\n`, { flag: "wx" });
const args = [
  ".agents/skills/ld-s10y-choice/scripts/validate.py",
  "--repo", ".",
  "--seed", paths.seed,
  "--draft", paths.draft,
];
const startedAt = new Date().toISOString();
const execution = spawnSync("python3", args, { encoding: "utf8" });
const finishedAt = new Date().toISOString();
const snapshots = Object.fromEntries(["seed", "draft", "view"].map((name) => {
  const digest = spawnSync("python3", [
    ".agents/skills/ld-s10y-choice/scripts/prepare.py", "digest", paths[name],
  ], { encoding: "utf8" });
  return [name, {
    path: paths[name],
    canonical_sha256: digest.status === 0 ? digest.stdout.trim() : null,
    file_sha256: createHash("sha256").update(readFileSync(paths[name])).digest("hex"),
    digest_error: digest.status === 0 ? null : digest.stderr,
  }];
}));
const figures = JSON.parse(readFileSync(`${root}/figure-observation-machine.json`, "utf8"));
const result = {
  stage: "offline-author-structural-only",
  lesson: seed.source.lesson,
  command: ["python3", ...args].join(" "),
  execution_count: 1,
  started_at: startedAt,
  finished_at: finishedAt,
  exit_code: execution.status,
  signal: execution.signal,
  stdout: execution.stdout ?? "",
  stderr: execution.stderr ?? "",
  launch_error: execution.error ? String(execution.error) : null,
  result: execution.status === 0 ? "structural-pass-semantic-review-pending" : "structural-failure",
  counts: {
    sources: seed.exercises.length,
    questions: view.questions.length,
    options: view.questions.reduce((sum, question) => sum + question.view.options.length, 0),
    required_figures: seed.figures.length,
    actual_figures_observed: figures.figures.length,
    new_figures: draft.new_figures.length,
  },
  snapshots,
  pure_view_fields: ["questions"],
  pure_question_fields: ["id", "source_numbers", "view"],
  canonical_review_run: false,
  semantic_review: "pending-parent-independent-review",
  author_precheck_rejections: [`${root}/history/precheck-text-before/findings.json`],
  source_notices_retained: [
    "471 provides coordinate classes rather than a particular point; visible conditional membership does not invent a fixed-point yes/no answer.",
    "475 graphical readings use visible approximate whole-hour/one-degree precision, not invented exact interpolation.",
  ],
  files_frozen: true,
  browser: {
    launch: figures.launch,
    PWDEBUG: figures.PWDEBUG,
    html_report_open: figures.html_report_open,
    browser_closed: figures.browser_closed,
    context_closed: figures.context_closed,
    user_ui_accessed: figures.user_ui_accessed,
    in_flight_session: false,
  },
  observable_model: null,
  observable_usage: null,
};
writeFileSync(paths["validation-result"], `${JSON.stringify(result, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({
  lesson: result.lesson,
  exit_code: result.exit_code,
  execution_count: result.execution_count,
  stdout: result.stdout,
  stderr: result.stderr,
  counts: result.counts,
  seed: paths.seed,
  pure_view: paths.view,
  browser_closed: result.browser.browser_closed,
  context_closed: result.browser.context_closed,
}, null, 2));
process.exitCode = execution.status ?? 1;
