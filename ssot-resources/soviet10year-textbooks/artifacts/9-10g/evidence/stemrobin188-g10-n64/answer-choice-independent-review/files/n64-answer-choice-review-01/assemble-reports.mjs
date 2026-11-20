import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";

const repo = "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck";
const root = path.join(repo, ".intentfold/tickets/STEMROBIN-188/tmp/n64-answer-choice-review-01");
if (process.cwd() !== repo) throw new Error("Explicit repository workdir required");
const read = name => JSON.parse(fs.readFileSync(path.join(root, name), "utf8"));
const hash = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const newFile = (name, value) => fs.writeFileSync(path.join(root, name),
  JSON.stringify(value, null, 2) + "\n", { flag: "wx", mode: 0o644 });
for (const name of ["source-solutions-FIRST.json", "option-solutions-FIRST.json"]) {
  const seal = read(`${name}.seal.json`);
  if (hash(path.join(root, name)) !== seal.output.sha256 ||
      (fs.statSync(path.join(root, name)).mode & 0o777) !== 0o444) {
    throw new Error(`FIRST changed: ${name}`);
  }
}
const manifestPath = path.join(repo, ".intentfold/tickets/STEMROBIN-188/tmp/n64-answer-choice-review-inputs-02/manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const baseline = read("input-bindings-before.json");
const inputBindings = baseline.inputs.map(item => {
  const after = hash(item.path);
  if (after !== item.sha256) throw new Error(`Input changed: ${item.path}`);
  return { path: item.path, sha256Before: item.sha256, sha256After: after };
});
const source = read("source-solutions-FIRST.json");
const option = read("option-solutions-FIRST.json");
const notes = read("comparison-notes.json");
const draft = JSON.parse(fs.readFileSync(manifest.draftKeyLast.path, "utf8"));
const visible = JSON.parse(fs.readFileSync(manifest.visible.path, "utf8"));
const projection = { questions: draft.questions.map(({ id, source_numbers, view }) =>
  ({ id, source_numbers, view })) };
if (JSON.stringify(projection) !== JSON.stringify(visible)) {
  throw new Error("Visible projection differs from the bound draft");
}
if (draft.new_figures.length || draft.questions.some(q =>
  q.view.figure_ids.length || q.view.options.some(o => o.figure_ids.length))) {
  throw new Error("Zero-image intake unexpectedly needs figures");
}
for (const q of draft.questions) {
  const independent = option.questionReviews.find(row => row.question_id === q.id).mathematics;
  if (JSON.stringify([...independent.correct].sort()) !== JSON.stringify([...q.key.correct].sort())) {
    throw new Error("Manual comparison key mismatch");
  }
  for (const r of q.key.rationales) {
    if (independent.option_checks.find(row => row.option_id === r.option_id).truth !== r.truth) {
      throw new Error("Author truth differs from FIRST");
    }
  }
}
const canonical = spawnSync("python3", ["-B", "-c",
  "import hashlib,json,sys; print(json.dumps([hashlib.sha256(json.dumps(json.load(open(p)),sort_keys=True,ensure_ascii=True,separators=(',',':')).encode('utf-8')).hexdigest() for p in sys.argv[1:]]))",
  manifest.seed.path, manifest.draftKeyLast.path], { cwd: repo, encoding: "utf8" });
if (canonical.status !== 0) throw new Error(canonical.stderr);
const [seedDigest, draftDigest] = JSON.parse(canonical.stdout);
const review = {
  schema: "s10y-choice-review-v1",
  seed_sha256: seedDigest,
  draft_sha256: draftDigest,
  reviewer: source.reviewer,
  source_reviews: source.solutions.map(item => {
    const coverage = notes.choiceSources.find(row => row.source_number === item.exercise);
    return {
      source_number: item.exercise,
      independent_solution: item.parts.map(part =>
        `${part.part}: ${part.answer} ${part.reason}`).join("\n"),
      coverage: { verdict: coverage.verdict, evidence: coverage.evidence }
    };
  }),
  figure_checks: [],
  new_figure_reviews: [],
  question_reviews: option.questionReviews.map(row => ({
    question_id: row.question_id,
    task_fidelity: row.task_fidelity,
    redundancy: row.redundancy,
    answer_leakage: row.answer_leakage,
    mathematics: row.mathematics
  })),
  outcome: notes.choiceOutcome
};
newFile("review.json", review);
newFile("answer-review.json", {
  schema: "stemrobin188-n64-answer-review@1",
  reviewer: source.reviewer,
  result: notes.answerGateVerdict,
  scope: "Original-answer semantic content and offline bounded grading qualification only",
  semanticContentResult: notes.answerContentVerdict,
  findings: notes.findings.filter(item => item.id.startsWith("N64-AUTO")),
  perExercise: notes.answerReviews.map(({ exercise, result }) => ({ exercise, result })),
  perExerciseEvidence: notes.answerReviews,
  inputBindings,
  sourceFIRST: read("source-solutions-FIRST.json.seal.json").output,
  optionFIRST: read("option-solutions-FIRST.json.seal.json").output,
  limitations: notes.limitations,
  counts: notes.counts,
  original232UniqueDistanceResult: "HOLD",
  constructionAndProofOriginals: { "233": "ungraded-readonly", "235": "ungraded-readonly" },
  wholeLessonApproved: false, productApproved: false, published: false
});
newFile("draft-trace.json", {
  schema: "stemrobin188-n64-independent-draft-trace@1",
  note: "The canonical review contract permits exactly its listed fields; draft_trace therefore lives in this companion receipt rather than an invalid extra review.json field.",
  draft_trace: [
    { path: manifest.seed.path, sha256: hash(manifest.seed.path), canonicalSha256: seedDigest },
    { path: manifest.draftKeyLast.path, sha256: hash(manifest.draftKeyLast.path), canonicalSha256: draftDigest },
    { path: manifest.visible.path, sha256: hash(manifest.visible.path) },
    { path: manifest.answersKeyLast.path, sha256: hash(manifest.answersKeyLast.path) }
  ],
  sourceFIRST: read("source-solutions-FIRST.json.seal.json").output,
  optionFIRST: read("option-solutions-FIRST.json.seal.json").output,
  visibleExactlyMatchesDraftProjection: true,
  correctSetMatches: 6, optionTruthMatches: 24, rationaleChecks: 24,
  review: { path: path.join(root, "review.json"), sha256: hash(path.join(root, "review.json")),
    outcome: review.outcome },
  authorReadAfterBothSeals: true,
  figuresRequired: 0, imagesOpened: 0,
  inputBindings
});
newFile("contract-bindings.json", {
  schema: "stemrobin188-reviewed-contract-bindings@1",
  files: [
    ".agents/skills/ld-s10y-choice/SKILL.md",
    ".agents/skills/ld-s10y-choice/references/review.md",
    ".agents/skills/ld-s10y-choice/references/contract.md",
    ".agents/skills/ld-s10y-choice/scripts/validate.py",
    ".agents/skills/ld-s10y-choice/scripts/prepare.py",
    ".claude/skills/ld-s10y-answer/references/gate-2-lesson-answers/gate.md",
    ".claude/skills/ld-s10y-answer/tools/lesson_answers.py",
    ".claude/skills/ld-s10y-answer/tools/check_math_expressions.mjs",
    "app/src/lib/textbook-answer.ts"
  ].map(name => ({ path: path.join(repo, name), sha256: hash(path.join(repo, name)) })),
  renamedGateLocatedByRg: true,
  noLibraryDocumentationOrNetworkRequired: "Offline mathematical/code review; no setup, migration, or library API recommendation."
});
console.log(JSON.stringify({
  review: { path: path.join(root, "review.json"), sha256: hash(path.join(root, "review.json")),
    outcome: review.outcome, seedDigest, draftDigest },
  answer: { path: path.join(root, "answer-review.json"),
    sha256: hash(path.join(root, "answer-review.json")), result: notes.answerGateVerdict },
  counts: notes.counts
}, null, 2));
