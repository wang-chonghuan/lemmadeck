import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const R = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const T = path.join(R, ".intentfold/tickets/STEMROBIN-181/tmp");
const OUT = path.dirname(fileURLToPath(import.meta.url));
const AUTHOR = path.join(T, "d885-n87-first-choice-author");
const EXPECTED_OUT = path.join(T, "d896-n87-first-independent-choice-review");
if (process.cwd() !== R || OUT !== EXPECTED_OUT) throw new Error("Wrong workdir or output root");

const sha = (value) => crypto.createHash("sha256").update(value).digest("hex");
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const bytesHash = (file) => sha(fs.readFileSync(file));
const canonical = (value) => {
  if (typeof value === "string") {
    return JSON.stringify(value).replace(/[\u007f-\uffff]/g,
      (c) => "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0"));
  }
  if (Array.isArray(value)) return "[" + value.map(canonical).join(",") + "]";
  if (value !== null && typeof value === "object") {
    return "{" + Object.keys(value).sort().map(
      (key) => canonical(key) + ":" + canonical(value[key])).join(",") + "}";
  }
  return JSON.stringify(value);
};
const digest = (value) => sha(canonical(value));
const write = (name, value) => {
  const target = path.resolve(OUT, name);
  if (!target.startsWith(OUT + path.sep)) throw new Error("Write outside output root");
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, JSON.stringify(value, null, 2) + "\n", { flag: "wx" });
};
const demand = (condition, message) => {
  if (!condition) throw new Error(message);
};
const frozen = (record) => {
  demand(bytesHash(path.join(OUT, record.frozen_file)) === record.sha256_bytes,
    "Independent phase file changed");
};
const independent = read(path.join(OUT, "independent-source-solutions.json"));
const observations = read(path.join(OUT, "view-only-observations.json"));
const comparison = read(path.join(OUT, "author-comparison.json"));
frozen(read(path.join(OUT, "seed-phase-freeze.json")));
frozen(read(path.join(OUT, "view-phase-freeze.json")));

if (process.argv[2] === "build") {
  const external = path.join(T, comparison.external_file);
  demand(bytesHash(external) === comparison.external_expected_bytes_sha256, "External hash mismatch");
  const checkpoint = read(path.join(AUTHOR, "pre-options-checkpoint.json"));
  demand(digest(checkpoint) === comparison.author_checkpoint_canonical_sha256, "Checkpoint mismatch");
  const reviews = {};
  for (const locale of ["zh", "en"]) {
    const seed = read(path.join(AUTHOR, locale, "seed.json"));
    const draft = read(path.join(AUTHOR, locale, "draft.json"));
    const views = read(path.join(AUTHOR, locale, "client-views.json"));
    const solutions = read(path.join(AUTHOR, locale, "solutions.json"));
    const structural = read(path.join(AUTHOR, locale, "validation.json"));
    demand(digest(draft) === comparison.expected_draft_canonical_sha256[locale], "Draft hash mismatch");
    demand(digest(views) === digest(draft.questions.map((q) => q.view)), "View/draft mismatch");
    demand(structural.invocation_count === 1 && structural.exit_code === 0 &&
      structural.result.draft_sha256 === digest(draft), "Original structural receipt mismatch");
    demand(solutions.pre_options_checkpoint_sha256 === digest(checkpoint), "Solution checkpoint mismatch");
    demand(seed.exercises.length === 6 && draft.questions.length === 6, "Wrong source/question count");
    for (let i = 0; i < 6; i++) {
      const question = draft.questions[i];
      const observed = observations.questions[i];
      const solution = solutions.solutions[i];
      const beforeOptions = checkpoint.solutions[i];
      demand(solution.written_task === seed.exercises[i].text, "Original written task changed");
      demand(solution.source_solution === beforeOptions.solution[locale] &&
        solution.source_solution === question.intent.source_solution, "Author derivations disagree");
      demand(digest([...question.key.correct].sort()) === digest([...observed.mathematics.correct].sort()),
        "Author key disagrees with frozen independent truth set");
      demand(question.view.mode === observed.mode, "Response mode mismatch");
      for (const option of observed.mathematics.option_checks) {
        const rationale = question.key.rationales.find((r) => r.option_id === option.option_id);
        demand(rationale?.truth === option.truth, "Author option truth disagrees");
      }
    }
    const review = {
      schema: "s10y-choice-review-v1",
      seed_sha256: digest(seed),
      draft_sha256: digest(draft),
      reviewer: {
        kind: "independent_agent",
        identity: "Codex d896 FIRST separate seed-first reviewer; not the d885 author or d839 source solver"
      },
      source_reviews: independent.locales[locale].map((solution, i) => ({
        source_number: solution.source_number,
        independent_solution: solution.independent_solution,
        coverage: comparison.sources[i].coverage
      })),
      figure_checks: [],
      new_figure_reviews: [],
      question_reviews: observations.questions.map((observed, i) => ({
        question_id: draft.questions[i].id,
        task_fidelity: observed.task_fidelity,
        redundancy: observed.redundancy,
        answer_leakage: observed.answer_leakage,
        mathematics: {
          ...observed.mathematics,
          independent_solution: observed.mathematics.independent_solution +
            " Post-freeze comparison: the author's complete set agrees; both language versions preserve these conditions.",
          option_checks: observed.mathematics.option_checks.map((option) => ({
            ...option,
            evidence: option.evidence + " Post-freeze derivation check: " +
              comparison.rationale_checks[i].options[option.option_id]
          }))
        }
      })),
      outcome: "pass"
    };
    write(locale + "/review.json", review);
    reviews[locale] = {
      path: path.join(OUT, locale, "review.json"),
      sha256_bytes: bytesHash(path.join(OUT, locale, "review.json")),
      sha256_canonical: digest(review),
      seed_sha256_canonical: digest(seed),
      draft_sha256_canonical: digest(draft),
      source_count: review.source_reviews.length,
      question_count: review.question_reviews.length,
      option_count: review.question_reviews.reduce((sum, q) => sum + q.mathematics.option_checks.length, 0),
      original_structural_receipt: path.join(AUTHOR, locale, "validation.json"),
      original_structural_receipt_sha256_bytes: bytesHash(path.join(AUTHOR, locale, "validation.json")),
      original_structural_check_reused_not_rerun: true,
      solutions_sha256_bytes: bytesHash(path.join(AUTHOR, locale, "solutions.json")),
      solutions_sha256_canonical: digest(solutions)
    };
  }
  write("reviews-freeze.json", {
    schema: "d896-review-freeze-v1",
    phase: "3-frozen-native-contract-reviews-before-sole-validation",
    frozen_at_utc: new Date().toISOString(),
    reviews,
    native_finalization: "pending",
    native_index_freshness: "pending",
    images_opened: 0,
    immutable: true
  });
  console.log(JSON.stringify(reviews, null, 2));
} else if (process.argv[2] === "validate") {
  const locale = process.argv[3];
  demand(["zh", "en"].includes(locale), "Expected locale");
  const freeze = read(path.join(OUT, "reviews-freeze.json"));
  const record = freeze.reviews[locale];
  demand(bytesHash(record.path) === record.sha256_bytes, "Frozen review changed");
  const repo = path.join(T, "d884-n87-first-choice-preparation", locale, "source");
  const script = path.join(R, ".agents/skills/ld-s10y-choice/scripts/validate.py");
  const args = ["-B", script, "--repo", repo,
    "--seed", path.join(AUTHOR, locale, "seed.json"),
    "--draft", path.join(AUTHOR, locale, "draft.json"),
    "--review", record.path];
  const started = new Date().toISOString();
  write(locale + "/validation-FIRST-start.json", {
    locale, command: ["python3", ...args], workdir: R, invocation_count: 1, started_at_utc: started
  });
  const result = spawnSync("python3", args, {
    cwd: R, encoding: "utf8", env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" }
  });
  const receipt = {
    schema: "d896-n87-native-review-validation-FIRST-v1",
    locale, command: ["python3", ...args], workdir: R, invocation_count: 1,
    started_at_utc: started, ended_at_utc: new Date().toISOString(),
    exit_code: result.status, signal: result.signal,
    error: result.error ? String(result.error) : null,
    stdout: result.stdout ?? "", stderr: result.stderr ?? "",
    review_sha256_bytes: record.sha256_bytes,
    review_sha256_canonical: record.sha256_canonical,
    seed_sha256_canonical: record.seed_sha256_canonical,
    draft_sha256_canonical: record.draft_sha256_canonical,
    validator_sha256_bytes: bytesHash(script),
    original_structural_check_reused_not_rerun: true,
    scope: "Exactly one unmodified official --review CLI invocation against the d884 frozen projected --repo; no standalone author structural check was repeated.",
    first_failure_preserved: result.status !== 0,
    retry_count: 0,
    native_finalization: "pending",
    native_index_freshness: "pending",
    projected_index_check_is_not_native_index_freshness: true
  };
  write(locale + "/validation-FIRST.json", receipt);
  console.log(JSON.stringify(receipt, null, 2));
} else {
  throw new Error("Expected build or validate mode");
}
