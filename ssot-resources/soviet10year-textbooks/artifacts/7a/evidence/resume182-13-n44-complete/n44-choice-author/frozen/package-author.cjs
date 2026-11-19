const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { spawnSync } = require("node:child_process");

const repo = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
const working = __dirname;
const owner = path.dirname(working);
const frozen = path.join(owner, "frozen");
if (process.cwd() !== repo) throw new Error("Wrong checkout");
if (owner !== path.join(repo, ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n44-choice-author")) {
  throw new Error("Wrong ownership boundary");
}
const read = name => JSON.parse(fs.readFileSync(path.join(working, name), "utf8"));
const hash = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const write = (name, value) => fs.writeFileSync(path.join(working, name), JSON.stringify(value, null, 2) + "\n", { flag: "wx" });
const seal = name => {
  const source = path.join(working, name);
  const target = path.join(frozen, name);
  if (fs.existsSync(target)) {
    if (hash(source) !== hash(target)) throw new Error(`Existing immutable snapshot changed: ${name}`);
  } else {
    fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL);
  }
  fs.chmodSync(target, 0o444);
};
const canonicalDigest = name => {
  const result = spawnSync("python3", [
    ".agents/skills/ld-s10y-choice/scripts/prepare.py", "digest", path.join(working, name),
  ], { cwd: repo, encoding: "utf8" });
  if (result.status !== 0) throw new Error(result.stderr);
  return result.stdout.trim();
};

// All mathematical content is already manually authored in draft.json.
// This utility only projects, binds, checks structure once, and packages it.
const seed = read("seed.json");
const draft = read("draft.json");
for (const name of ["seed.json", "source-calculations.md", "table-source.json"]) {
  if (hash(path.join(working, name)) !== hash(path.join(frozen, name))) {
    throw new Error(`Pre-option source freeze changed: ${name}`);
  }
}
const expected = Array.from({ length: 15 }, (_, i) => String(858 + i));
if (JSON.stringify(seed.exercises.map(e => e.number)) !== JSON.stringify(expected)) throw new Error("Seed coverage changed");
if (seed.figures.length || draft.new_figures.length) throw new Error("Unexpected figure");
if (draft.questions.length !== 33) throw new Error("Response-unit plan changed");
const views = draft.questions.map(question => question.view);
if (views.some(view => Object.keys(view).sort().join(",") !== "figure_ids,mode,options,stem")) {
  throw new Error("Non-view field in learner projection");
}
write("learner-views.json", views);
write("coverage.json", draft.coverage);
write("author-analysis.json", {
  schema: "n44-author-analysis-v1",
  semantic_approval: false,
  questions: draft.questions.map(({ id, source_numbers, intent, key }) => ({ id, source_numbers, intent, key })),
  coverage: draft.coverage,
});
const tableCapture = path.join(repo, ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n44-original-root-capture/capture.json");
const imagePaths = read("table-source.json").image_openings.map(entry => entry.path);
write("source-bindings.json", {
  schema: "n44-author-source-bindings-v1",
  seed_canonical_sha256: canonicalDigest("seed.json"),
  draft_canonical_sha256: canonicalDigest("draft.json"),
  seed_trace_at_prepare: seed.trace,
  source_json_at_packaging: seed.trace.map(entry => ({
    path: entry.path, sha256: hash(path.join(repo, entry.path)),
  })),
  own_image_opens: imagePaths.map(relative => ({
    path: path.join(repo, relative), sha256: hash(path.join(repo, relative)), count: 1,
  })),
  independent_source_only_capture: { path: tableCapture, sha256: hash(tableCapture) },
  semantic_review: "not performed by author; independent reviewer required",
});
const checkerArgs = [
  ".agents/skills/ld-s10y-choice/scripts/validate.py",
  "--repo", ".",
  "--seed", path.relative(repo, path.join(working, "seed.json")),
  "--draft", path.relative(repo, path.join(working, "draft.json")),
];
const result = spawnSync("python3", checkerArgs, { cwd: repo, encoding: "utf8" });
write("structural-check.json", {
  schema: "n44-author-structural-check-receipt-v1",
  cwd: repo,
  command: ["python3", ...checkerArgs],
  checker_sha256: hash(path.join(repo, checkerArgs[0])),
  invocations: 1,
  exit: result.status,
  stdout: result.stdout,
  stderr: result.stderr,
  semantic_approval: false,
});
if (result.status !== 0) {
  console.error(result.stdout, result.stderr);
  process.exit(result.status || 2);
}
const counts = {
  originals: seed.exercises.length,
  printed_letter_level_tasks: 64,
  questions: draft.questions.length,
  single: views.filter(view => view.mode === "single").length,
  multiple: views.filter(view => view.mode === "multiple").length,
  options: views.reduce((n, view) => n + view.options.length, 0),
  true_options: draft.questions.reduce((n, q) => n + q.key.correct.length, 0),
  selected_definition_blocks: seed.concepts.map(concept => concept.block),
  lesson_figures: seed.figures.length,
  new_figures: draft.new_figures.length,
  same_book_table_image_opens: 1,
  earlier_bradis_image_opens: 2,
  total_own_source_image_opens: 3,
  crops: 0,
  reopens: 0,
  structural_checker_invocations: 1,
  source_mathematical_subtasks_deferred: 0,
};
write("handoff.json", {
  schema: "n44-offline-choice-author-handoff-v1",
  status: "provisional_unreviewed_draft",
  cwd: repo,
  branch: "codex/STEMROBIN-182-textbooks",
  owner: owner,
  seed_preparations: 1,
  pre_option_freeze_preserved: true,
  counts,
  table_obligations: {
    missing_literal_cells: [],
    missing_addresses: [],
    missing_table_access: [],
    historical_tie_rule_needed: false,
    independent_literal_source_comparison: "4/4 values, addresses, precision format and image hash match",
    no_whole_appendix_approval_claimed: true,
    remaining: ["Independent reviewer must check all question mathematics, correct sets, equivalence, coverage and leakage."],
  },
  source_table: {
    image: path.join(repo, ".tmp/ld-s10y-lesson/7a/pages/0346/page.grid.png"),
    sha256: hash(path.join(repo, ".tmp/ld-s10y-lesson/7a/pages/0346/page.grid.png")),
    physical: 346,
    printed: 340,
    precision: "Literal3-decimal entries; no separate rounding/tie rule visible",
  },
  losses: [
    "Recognition is not independent written solution, calculation, or proof production.",
    "Source-bound table excerpts do not assess independent physical full-table search.",
  ],
  external_actions: [],
  review_file: null,
  semantic_approval: false,
});
const files = [
  "seed.json", "source-calculations.md", "table-source.json", "table-comparison.md",
  "draft.json", "learner-views.json", "coverage.json", "author-analysis.json",
  "source-bindings.json", "structural-check.json", "handoff.json", "package-author.cjs",
];
files.forEach(seal);
write("freeze.json", {
  schema: "n44-author-freeze-v1",
  frozen_at: new Date().toISOString(),
  pre_option_source_files: ["seed.json", "source-calculations.md", "table-source.json"],
  mode: "0444",
  working_copy_mode: "writable",
  files: files.map(name => ({
    path: path.join(frozen, name),
    sha256: hash(path.join(frozen, name)),
    bytes: fs.statSync(path.join(frozen, name)).size,
    mode: "0444",
  })),
  self_hash_excluded: true,
  semantic_approval: false,
});
seal("freeze.json");
console.log(JSON.stringify({
  counts,
  checker: { exit: result.status, stdout: result.stdout.trim(), invocations: 1 },
  seed_canonical_sha256: canonicalDigest("seed.json"),
  draft_canonical_sha256: canonicalDigest("draft.json"),
  freeze: path.join(frozen, "freeze.json"),
  freeze_sha256: hash(path.join(frozen, "freeze.json")),
}, null, 2));
