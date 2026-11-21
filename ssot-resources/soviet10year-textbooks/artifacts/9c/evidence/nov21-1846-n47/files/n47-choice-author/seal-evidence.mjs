import {
  constants,
  copyFileSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { createHash } from "node:crypto";
import { join, resolve } from "node:path";

const repo = "/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck";
const relativeRoot = ".tmp/stemrobin-184-six/n47-choice-author";
const root = join(repo, relativeRoot);
if (resolve(process.cwd()) !== repo) throw new Error("Explicit ROOT cwd required.");

const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const json = (name) => JSON.parse(readFileSync(join(root, name), "utf8"));
const text = (name) => readFileSync(join(root, name), "utf8").trim();
function sorted(value) {
  if (Array.isArray(value)) return value.map(sorted);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value).sort().map((key) => [key, sorted(value[key])]),
    );
  }
  return value;
}
function canonicalDigest(value) {
  const serialized = JSON.stringify(sorted(value)).replace(
    /[\u0080-\uffff]/g,
    (character) => "\\u" + character.charCodeAt(0).toString(16).padStart(4, "0"),
  );
  return sha256(Buffer.from(serialized, "utf8"));
}

const seed = json("seed.json");
const draft = json("draft.json");
const seedDigest = canonicalDigest(seed);
if (seedDigest !== draft.seed_sha256) throw new Error("Seed digest mismatch.");
if (seedDigest !== "0fb25f75af6cb074a20699b17b9abef4ffa4561f5d38093ca8a026c45bfbcdb9") {
  throw new Error("The first official seed was changed.");
}
const solutionBytes = readFileSync(join(root, "independent-solutions.md"));
const solutionHash = sha256(solutionBytes);
if (solutionHash !== "03d4238ac041e8a663cfbe01dbe136c81213fc9b29e3eb5cfab79c7eed6362f6") {
  throw new Error("The pre-option independent solution was changed.");
}
const solutionFrozen = text("independent-solutions.frozen.txt");
const draftStarted = text("draft.started.txt");
if (Date.parse(solutionFrozen) >= Date.parse(draftStarted)) {
  throw new Error("Independent solution freeze must precede draft start.");
}
for (const prefix of ["inspect", "prepare", "validate-first"]) {
  if (text(`${prefix}.exit.txt`) !== "0") throw new Error(`${prefix} did not pass.`);
}

copyFileSync(
  join(root, "draft.json"),
  join(root, "draft.snapshot.json"),
  constants.COPYFILE_EXCL,
);
const draftBytes = readFileSync(join(root, "draft.json"));
const snapshotBytes = readFileSync(join(root, "draft.snapshot.json"));
if (!draftBytes.equals(snapshotBytes)) throw new Error("Snapshot bytes differ.");

const artifacts = readdirSync(root).sort().map((name) => {
  const path = join(root, name);
  const metadata = statSync(path);
  if (!metadata.isFile()) throw new Error("Unexpected non-file in exclusive root.");
  const bytes = readFileSync(path);
  return {
    path: `${relativeRoot}/${name}`,
    sha256: sha256(bytes),
    bytes: metadata.size,
    birthtime_utc: metadata.birthtime.toISOString(),
    mtime_utc: metadata.mtime.toISOString(),
    final_mode: "0444",
  };
});
const contractPaths = [
  ".agents/skills/ld-s10y-choice/SKILL.md",
  ".agents/skills/ld-s10y-choice/references/authoring.md",
  ".agents/skills/ld-s10y-choice/references/contract.md",
  ".agents/skills/ld-s10y-image/SKILL.md",
];
const commands = ["inspect", "prepare", "validate-first"].map((prefix) => {
  const rawArgv = readFileSync(join(root, `${prefix}.argv.nul`));
  if (rawArgv.at(-1) !== 0) throw new Error("Missing terminal argument NUL.");
  return {
    name: prefix,
    cwd: repo,
    argv: rawArgv.toString("utf8").split("\0").slice(0, -1),
    argv_file: `${relativeRoot}/${prefix}.argv.nul`,
    stdout_file: `${relativeRoot}/${prefix}.stdout.${prefix === "inspect" ? "json" : "txt"}`,
    stderr_file: `${relativeRoot}/${prefix}.stderr.txt`,
    exit_file: `${relativeRoot}/${prefix}.exit.txt`,
    exit_code: Number(text(`${prefix}.exit.txt`)),
    started_utc: text(`${prefix}.started.txt`),
    finished_utc: text(`${prefix}.finished.txt`),
    attempts: 1,
  };
});

const manifest = {
  schema: "cold-choice-author-manifest-v1",
  created_utc: new Date().toISOString(),
  repository_root: repo,
  ownership_root: root,
  authorization: "STEMROBIN-184/184-6 delegated offline n47 CHOICE AUTHOR ONLY",
  book: "9c",
  lesson: "ana9-c4-s2-n47",
  status: "author_draft_structural_pass_semantic_review_pending",
  snapshots: {
    seed_path: `${relativeRoot}/seed.json`,
    seed_canonical_sha256: seedDigest,
    seed_bytes_sha256: sha256(readFileSync(join(root, "seed.json"))),
    independent_solution_path: `${relativeRoot}/independent-solutions.md`,
    independent_solution_sha256: solutionHash,
    draft_path: `${relativeRoot}/draft.json`,
    draft_snapshot_path: `${relativeRoot}/draft.snapshot.json`,
    draft_canonical_sha256: canonicalDigest(draft),
    draft_bytes_sha256: sha256(draftBytes),
    draft_snapshot_bytes_sha256: sha256(snapshotBytes),
    source_files_edited: false,
    seed_edited_after_prepare: false,
    independent_solution_edited_after_freeze: false,
    draft_edited_after_first_validate: false,
  },
  ordering: {
    independent_solution_started_utc: text("independent-solutions.started.txt"),
    independent_solution_frozen_utc: solutionFrozen,
    draft_started_utc: draftStarted,
    independent_solution_frozen_before_options: true,
  },
  selection: {
    exercise_numbers: seed.exercises.map((item) => item.number),
    concept_blocks: seed.concepts.map((item) => item.block),
    excluded_concept_blocks: [1, 2, 3, 4, 5],
    exclusion_reason: "Proof or worked example, not definitions.",
    concept_figure_ids: seed.source.concept_figure_ids,
  },
  source_trace: seed.trace,
  counts: {
    selected_exercises: seed.exercises.length,
    selected_concept_blocks: seed.concepts.length,
    source_requested_outputs: 14,
    questions: draft.questions.length,
    single_questions: draft.questions.filter((q) => q.view.mode === "single").length,
    multiple_questions: draft.questions.filter((q) => q.view.mode === "multiple").length,
    options: draft.questions.reduce((sum, q) => sum + q.view.options.length, 0),
    source_figures: seed.figures.length,
    new_figures: draft.new_figures.length,
    loaded_images: 0,
    deferred_source_outputs: 0,
    semantic_reviews: 0,
    listed_artifacts_excluding_manifest: artifacts.length,
    total_owned_files_including_manifest: artifacts.length + 1,
  },
  source_task_coverage: draft.coverage,
  validation: {
    mechanical_status: "pass",
    first_attempt_exit_code: 0,
    exact_stdout: readFileSync(join(root, "validate-first.stdout.txt"), "utf8"),
    exact_stderr: readFileSync(join(root, "validate-first.stderr.txt"), "utf8"),
    semantic_review_performed: false,
    semantic_approval_claimed: false,
  },
  unresolved: [
    {
      kind: "required_gate_pending",
      finding: "Separate cold semantic review of fidelity, redundancy, leakage, equivalence and all option truth sets remains required.",
    },
    {
      kind: "explicit_capacity_loss",
      finding: "Complete-result recognition cannot demonstrate unaided written derivation, simplification, argument-expression writing or evaluation. Supplied domain conditions also remove unaided domain discovery.",
    },
    {
      kind: "conditional_adaptation_to_review",
      finding: "The arbitrary-parameter source is answered conditionally on each natural-domain denominator, including c=d=0. No unresolved mathematical assumption was introduced; reviewer must assess the visible common convention.",
    },
  ],
  commands,
  ledger_path: `${relativeRoot}/ledger.json`,
  contracts_read: contractPaths.map((path) => ({
    path,
    sha256: sha256(readFileSync(join(repo, path))),
  })),
  images: {
    referenced: 0,
    opened: 0,
    generated: 0,
    batches: 0,
    authorized_work_needed: false,
  },
  permissions: {
    files: "0444",
    directories: "0555",
    source_paths_outside_ownership_untouched: true,
    note: "Final mode verification is performed after manifest generation.",
  },
  artifact_inventory: artifacts,
  manifest_self_hash: {
    excluded_from_inventory: true,
    reason: "A finite manifest cannot contain its own byte hash. Final textual handoff supplies manifest.json SHA-256 after generation.",
  },
};
writeFileSync(
  join(root, "manifest.json"),
  JSON.stringify(manifest, null, 2) + "\n",
  { flag: "wx" },
);
console.log(JSON.stringify({
  manifest_path: join(root, "manifest.json"),
  manifest_bytes_sha256: sha256(readFileSync(join(root, "manifest.json"))),
  seed_canonical_sha256: seedDigest,
  seed_bytes_sha256: manifest.snapshots.seed_bytes_sha256,
  independent_solution_sha256: solutionHash,
  independent_solution_frozen_utc: solutionFrozen,
  draft_started_utc: draftStarted,
  draft_canonical_sha256: manifest.snapshots.draft_canonical_sha256,
  draft_bytes_sha256: manifest.snapshots.draft_bytes_sha256,
  counts: manifest.counts,
}, null, 2));
