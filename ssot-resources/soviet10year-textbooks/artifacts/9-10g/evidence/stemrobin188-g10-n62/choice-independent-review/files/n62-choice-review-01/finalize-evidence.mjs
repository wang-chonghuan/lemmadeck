import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const repo = "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck";
const output = `${repo}/.intentfold/tickets/STEMROBIN-188/tmp/n62-choice-review-01`;
const author = `${repo}/.intentfold/tickets/STEMROBIN-188/tmp/n62-choice-author`;
if (path.dirname(fileURLToPath(import.meta.url)) !== output) {
  throw new Error("Unexpected evidence directory");
}
const sha = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value !== null && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value).replace(/[\u007f-\uffff]/g, (character) => `\\u${character.charCodeAt(0).toString(16).padStart(4, "0")}`);
}
const baselines = [
  {
    file: "seed.json", first_read_stage: 1, bytes: 4127,
    sha256: "5142c2e52cb151e84684cddf87c9f99d35796a52cd3f2e3e99b64faea58ec642",
    canonical_sha256: "60f21f5d5fdfaa0be87b9a0f46b1c0ba39d89d2ab156a70838669f4f4489be88"
  },
  {
    file: "view-only.json", first_read_stage: 3, bytes: 7655,
    sha256: "d2f2c26249f6dedebc239791f62018a9119dc8990d7cc153f74f9eb6dbded66f",
    canonical_sha256: "095ea286dcb1be68737d2519a3101a8c3e3967c60841ff74eedd55562ead76c3"
  },
  {
    file: "draft.json", first_read_stage: 6, bytes: 34704,
    sha256: "b151ff9a7c7d5bd47f185ba21eae0f89fc387de5ed141b892487144f123f8900",
    canonical_sha256: "5cfa281ed7a79f1f6a2a21055598eae6a411acb9f255a245cd9b330783f871e5"
  }
];
const inputs = baselines.map((baseline) => {
  const inputPath = `${author}/${baseline.file}`;
  const bytes = fs.readFileSync(inputPath);
  const after = {
    bytes: bytes.length,
    sha256: sha(bytes),
    canonical_sha256: sha(canonical(JSON.parse(bytes)))
  };
  const before = {
    bytes: baseline.bytes,
    sha256: baseline.sha256,
    canonical_sha256: baseline.canonical_sha256
  };
  const unchanged = canonical(before) === canonical(after);
  if (!unchanged) throw new Error(`Input changed: ${inputPath}`);
  return { path: inputPath, first_read_stage: baseline.first_read_stage, before, after, unchanged };
});
const seals = [
  ["source-solutions-FIRST.json", 3722, "bdd709bdbd4e0d6db812f8b69160401de3387e8251b7f3440c615918d114d526"],
  ["visible-gates-FIRST.json", 7956, "a26789d15ec87e5a80b42aee04831622bfcf968407e74cb5ce2124d192ae1179"],
  ["visible-mathematics-SEALED.json", 8558, "2a6869382329d07685de4dfb4599e11cf791528962d91c3e237c6176cf44cae7"]
].map(([file, byteCount, hash]) => {
  const sealedPath = `${output}/${file}`;
  const bytes = fs.readFileSync(sealedPath);
  const stat = fs.statSync(sealedPath);
  if (bytes.length !== byteCount || sha(bytes) !== hash || (stat.mode & 0o777) !== 0o444) {
    throw new Error(`Seal changed: ${sealedPath}`);
  }
  return { path: sealedPath, bytes: bytes.length, sha256: hash, mode: "0444", unchanged: true };
});
const validation = JSON.parse(fs.readFileSync(`${output}/validation-result.json`, "utf8"));
if (validation.invocations !== 1 || validation.exit !== 0 || validation.signal !== null) {
  throw new Error("Unexpected validation result; preserve logs without rerunning");
}
const draft = JSON.parse(fs.readFileSync(`${author}/draft.json`, "utf8"));
const visible = JSON.parse(fs.readFileSync(`${author}/view-only.json`, "utf8"));
const projectView = (questions) => questions.map(({ id, view }) => ({ id, view }));
const viewMatches = canonical(projectView(draft.questions)) === canonical(projectView(visible.questions ?? visible));
if (!viewMatches || draft.questions.length !== 8 || draft.new_figures.length !== 0) {
  throw new Error("Unexpected visible package");
}
const provenance = {
  schema: "n62-choice-review-evidence-v1",
  repo,
  output_directory: output,
  disclosure_order: [
    "1. Read seed only and verify expected canonical digest.",
    "2. Independently solve all seven sources; seal source-solutions-FIRST.json 0444 and verify its actual hash.",
    "3. Read exactly eight visible question IDs/views from view-only.json.",
    "4. Judge fidelity, redundancy and leakage; seal visible-gates-FIRST.json 0444 and verify its actual hash.",
    "5. Independently solve every option and complete true set; seal visible-mathematics-SEALED.json 0444 and verify its actual hash.",
    "6. Read draft for the first time; verify expected canonical digest and equality of all visible subtrees; compare solutions, keys, coverage and all 23 false-option procedures.",
    "7. Write contract review with apply_patch; run validator exactly once and retain command/stdout/stderr/exit.",
    "8. Verify before/after input hashes and blind seals; bind all evidence files in output-index.json."
  ],
  inputs,
  seals,
  view_matches_draft: viewMatches,
  source_review_count: 7,
  question_review_count: 8,
  option_check_count: 32,
  false_option_procedure_checks: 23,
  source_figures: [],
  new_figures: [],
  additional_author_solution_files_read: [],
  findings: [],
  outcome: "pass",
  validation: { invocations: 1, exit: validation.exit },
  boundaries: [
    "No historical answers, interactions, old choices, other ticket outputs or pre-existing N62 answer reviews were used.",
    "No prepare/native/renderer/publisher/DB/env/paid-service/Git/backend/chat-message action was performed.",
    "The requested validator refreshes the seed from its whitelisted original source files; those files were not used as an answer-key source.",
    "Python -B suppresses bytecode writes outside the sole authorized output directory.",
    "All exec calls had the explicit repository workdir; no other person's changes were reverted.",
    "216 original independent written proof production remains deferred; this pass applies only to the eight-question natural-choice package."
  ]
};
fs.writeFileSync(`${output}/input-hashes-and-order.json`, `${JSON.stringify(provenance, null, 2)}\n`, { flag: "wx" });
for (const file of ["author-comparison.json", "review.json", "input-hashes-and-order.json"]) {
  fs.chmodSync(`${output}/${file}`, 0o444);
}
const artifacts = fs.readdirSync(output).sort().filter((file) => file !== "output-index.json").map((file) => {
  const artifactPath = `${output}/${file}`;
  const stat = fs.statSync(artifactPath);
  if (!stat.isFile()) throw new Error(`Unexpected non-file output: ${artifactPath}`);
  const bytes = fs.readFileSync(artifactPath);
  return { path: artifactPath, sha256: sha(bytes), bytes: bytes.length, mode: (stat.mode & 0o777).toString(8).padStart(4, "0") };
});
const index = {
  schema: "n62-choice-output-index-v1",
  output_directory: output,
  outcome: "pass",
  validation_exit: validation.exit,
  failed_outputs: [],
  artifacts,
  self_binding: "This index cannot contain its own recursive byte hash; its absolute path, byte count and SHA-256 are returned in the final response."
};
const indexPath = `${output}/output-index.json`;
fs.writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`, { flag: "wx", mode: 0o444 });
const indexBytes = fs.readFileSync(indexPath);
console.log(JSON.stringify({
  inputs_unchanged: inputs.every((input) => input.unchanged),
  blind_seals_unchanged_0444: true,
  artifacts,
  index: { path: indexPath, sha256: sha(indexBytes), bytes: indexBytes.length },
  validation_exit: validation.exit
}, null, 2));
