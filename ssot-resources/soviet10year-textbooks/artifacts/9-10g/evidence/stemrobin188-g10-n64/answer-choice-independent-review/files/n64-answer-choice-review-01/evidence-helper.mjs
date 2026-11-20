import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";

const repo = "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck";
const root = path.join(repo, ".intentfold/tickets/STEMROBIN-188/tmp/n64-answer-choice-review-01");
const manifestPath = path.join(repo, ".intentfold/tickets/STEMROBIN-188/tmp/n64-answer-choice-review-inputs-02/manifest.json");
const sha = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const describe = file => {
  const bytes = fs.readFileSync(file);
  return { path: path.resolve(file), sha256: sha(bytes), bytes: bytes.length,
    mode: (fs.statSync(file).mode & 0o777).toString(8).padStart(4, "0") };
};
const writeNew = (name, value) => {
  const file = path.join(root, name);
  if (path.dirname(file) !== root) throw new Error("Output escaped exclusive root");
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + "\n", { flag: "wx", mode: 0o644 });
  return describe(file);
};
const tracked = manifest => [
  { path: manifestPath, sha256: "5edc236a41332ea598f207a94112b94733ff3839822c4906e474c647a955521f" },
  ...manifest.inputs
];
const snapshot = manifest => tracked(manifest).map(expected => {
  const actual = describe(expected.path);
  if (actual.sha256 !== expected.sha256) throw new Error(`Intake changed: ${expected.path}`);
  return actual;
});
const requireSeal = name => {
  const receipt = read(path.join(root, `${name}.seal.json`));
  const actual = describe(path.join(root, name));
  if (actual.sha256 !== receipt.output.sha256 || actual.mode !== "0444") {
    throw new Error(`FIRST seal broken: ${name}`);
  }
  return receipt;
};
const phase = process.argv[2];
if (process.cwd() !== repo) throw new Error("Explicit repository workdir required");
if (phase === "baseline") {
  const manifest = read(manifestPath);
  writeNew("input-bindings-before.json", { schema: "stemrobin188-input-bindings@1",
    phase: "before-author-content-disclosure", capturedAt: new Date().toISOString(), inputs: snapshot(manifest) });
  console.log("Baseline bound; author candidates hashed only, not disclosed.");
} else if (phase === "seal") {
  const name = process.argv[3];
  if (!["source-solutions-FIRST.json", "option-solutions-FIRST.json"].includes(name)) {
    throw new Error("Not a permitted FIRST");
  }
  if (name === "option-solutions-FIRST.json") requireSeal("source-solutions-FIRST.json");
  const file = path.join(root, name);
  const before = describe(file);
  fs.chmodSync(file, 0o444);
  const output = describe(file);
  if (before.sha256 !== output.sha256) throw new Error("Seal altered content");
  const receipt = writeNew(`${name}.seal.json`, { schema: "stemrobin188-first-seal@1",
    sealedAt: new Date().toISOString(), output,
    beforeAuthorCandidateContent: true,
    beforeVisibleQuestions: name === "source-solutions-FIRST.json" });
  console.log(JSON.stringify({ output, receipt }, null, 2));
} else if (phase === "validate") {
  requireSeal("source-solutions-FIRST.json");
  requireSeal("option-solutions-FIRST.json");
  const manifest = read(manifestPath);
  snapshot(manifest);
  const receiptPath = path.join(root, "native-with-review-result.json");
  const fd = fs.openSync(receiptPath, "wx", 0o644);
  const args = ["-B", ".agents/skills/ld-s10y-choice/scripts/validate.py",
    "--repo", repo, "--seed", manifest.seed.path, "--draft", manifest.draftKeyLast.path,
    "--review", path.join(root, "review.json")];
  const startedAt = new Date().toISOString();
  const result = spawnSync("python3", args, { cwd: repo, encoding: "utf8" });
  const receipt = { schema: "stemrobin188-native-with-review-result@1",
    startedAt, finishedAt: new Date().toISOString(), command: ["python3", ...args],
    cwd: repo, invocationCount: 1, exitCode: result.status, signal: result.signal,
    error: result.error?.message ?? null, stdout: result.stdout ?? "", stderr: result.stderr ?? "",
    review: describe(path.join(root, "review.json")),
    failurePreserved: result.status !== 0,
    promotionPermitted: false, imagesOpened: 0, published: false, wholeLessonApproved: false };
  fs.writeFileSync(fd, JSON.stringify(receipt, null, 2) + "\n");
  fs.closeSync(fd);
  console.log(JSON.stringify(receipt, null, 2));
} else if (phase === "finish") {
  const manifest = read(manifestPath);
  const after = snapshot(manifest);
  const before = read(path.join(root, "input-bindings-before.json")).inputs;
  const bindings = before.map(item => {
    const current = after.find(value => value.path === item.path);
    if (!current || item.sha256 !== current.sha256 || item.bytes !== current.bytes ||
        item.mode !== current.mode) throw new Error("Input bytes or mode changed");
    return { path: item.path, sha256Before: item.sha256, sha256After: current.sha256,
      bytesBefore: item.bytes, bytesAfter: current.bytes, modeBefore: item.mode, modeAfter: current.mode };
  });
  writeNew("input-bindings.json", { schema: "stemrobin188-input-bindings@1", inputBindings: bindings,
    allUnchanged: true, imagesOpened: 0 });
  const source = requireSeal("source-solutions-FIRST.json");
  const options = requireSeal("option-solutions-FIRST.json");
  const validation = read(path.join(root, "native-with-review-result.json"));
  const answer = read(path.join(root, "answer-review.json"));
  for (const binding of answer.inputBindings) {
    const actual = bindings.find(item => item.path === binding.path);
    if (!actual || binding.sha256Before !== actual.sha256Before ||
        binding.sha256After !== actual.sha256After) throw new Error("Answer report binding mismatch");
  }
  const review = read(path.join(root, "review.json"));
  writeNew("execution-ledger.json", { schema: "stemrobin188-independent-review-ledger@1",
    order: ["manifest-and-hashes-only", "seed-and-modern-prose", "source-FIRST-sealed-0444",
      "visible-only-fidelity-and-all-options", "option-FIRST-sealed-0444",
      "bound-author-draft-and-answer-comparison", "canonical-review", "native-validator-with-review-once",
      "unchanged-input-binding-and-output-index"],
    sourceSeal: source.output, optionSeal: options.output,
    originalExercises: 7, originalSubparts: 13, questions: review.question_reviews.length,
    options: review.question_reviews.reduce((n, item) => n + item.mathematics.option_checks.length, 0),
    answerVerdict: answer.result, choiceVerdict: review.outcome,
    nativeExitCode: validation.exitCode, nativeInvocations: 1, imagesOpened: 0,
    parentActualImages: 15, parentImageLimit: 24, parentCountsChanged: false,
    original232UniqueDistance: "HOLD", productApproval: false, wholeLessonApproval: false,
    published: false, gitWrites: false, otherChats: false, newAgents: false,
    inputBindings: bindings });
  const names = fs.readdirSync(root).filter(name => name !== "output-index.json").sort();
  const outputs = names.map(name => describe(path.join(root, name)));
  const result = writeNew("output-index.json", { schema: "stemrobin188-output-index@1",
    outputRoot: root, selfExcluded: true, outputs });
  console.log(JSON.stringify({ index: result, count: outputs.length, outputs }, null, 2));
} else {
  throw new Error("Expected baseline, seal, validate, or finish");
}
