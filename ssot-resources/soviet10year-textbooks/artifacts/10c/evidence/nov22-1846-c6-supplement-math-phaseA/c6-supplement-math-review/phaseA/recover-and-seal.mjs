import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";

const cwd = "/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck";
const out = path.join(cwd, ".tmp/stemrobin-184-six/c6-supplement-math-review/phaseA");
if (process.cwd() !== cwd) throw new Error("Wrong cwd");
const hash = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const readJson = (name) => JSON.parse(fs.readFileSync(path.join(out, name), "utf8"));
const priorSeal = readJson("seal.json");
const initialFailures = readJson("failures.json");
const initialLedger = readJson("ledger.json");
const priorPayloadsIntact = priorSeal.payloads.every((p) => hash(fs.readFileSync(p.path)) === p.sha256);
if (!priorPayloadsIntact) throw new Error("Initial sealed evidence changed");
if (initialFailures.commandFailures.length !== 1
    || initialFailures.commandFailures[0].name !== "math:374:x=2.36") {
  throw new Error("Recovery must target exactly the recorded 374 numerical check");
}
const sourceHashesStillMatch = priorSeal.inputs.every((p) => hash(fs.readFileSync(p.path)) === p.sha256);
if (!sourceHashesStillMatch) throw new Error("Source hash drift");
const pythonPath = path.join(out, "recovery-374.py");
const run = spawnSync("python3", [pythonPath], { cwd, encoding: "utf8" });
if (run.error || run.status !== 0) throw new Error("High-precision recovery failed: " + (run.error?.message || run.stderr));
const result = JSON.parse(run.stdout);
if (!result.passed || result.exercise !== "374") throw new Error("Recovery result not passed");
const writeNew = (name, data) =>
  fs.writeFileSync(path.join(out, name), JSON.stringify(data, null, 2) + "\n", { flag: "wx" });
writeNew("recovery-374-result.json", result);
writeNew("recovery-failures.json", {
  schema: "stemrobin-184/c6-phaseA-recovery-failures@1",
  originalCommandFailureCount: 1, originalFailureEvidence: path.join(out, "failures.json"),
  resolvedChecks: [{ name: "math:374:x=2.36", reason: "double-precision cancellation near excluded denominator zero",
    unchangedMathematicalResult: true, affectedOnlyRecovery: true, highPrecisionResult: path.join(out, "recovery-374-result.json") }],
  unresolvedCommandFailures: [], sourceHolds: initialFailures.sourceHolds,
  qualifiedOwnership: initialFailures.qualifiedOwnership,
  notationQualifications: initialFailures.notationQualifications,
  accounting: priorSeal.accounting, lessonCoursePass: false,
});
writeNew("recovery-ledger.json", {
  schema: "stemrobin-184/c6-phaseA-recovery-ledger@1", cwd,
  originalVerification: { exitCode: 1, total: initialLedger.checkCount, passed: initialLedger.passed,
    failed: initialLedger.failed, path: path.join(out, "ledger.json") },
  diagnosisCommand: { commandKind: "node -e", purpose: "read own newly generated failures.json commandFailures only",
    cwd, exitCode: 0, outcome: "one failed numerical check: math:374:x=2.36" },
  recoveryCommand: { argv: ["python3", pythonPath], cwd, exitCode: run.status,
    stdout: "retained as parsed JSON in recovery-374-result.json", stderr: run.stderr,
    scope: "only original failing sample", passed: result.passed },
  sealCommand: { argv: ["node", ".tmp/stemrobin-184-six/c6-supplement-math-review/phaseA/recover-and-seal.mjs"],
    cwd, exitCode: 0, priorPayloadsIntact, sourceHashesStillMatch,
    exitCodeBasis: "checks completed and final seal generated; enclosing tool records final actual status" },
  resolvedFailureCount: 1, unresolvedFailureCount: 0,
  all480OriginalCheckObligationsSettled: true,
  noClaimThatOriginal480CheckRunExitedZero: true,
  accounting: priorSeal.accounting,
});
const names = [
  "source-first-solutions.md", "report.md", "verify-and-seal.mjs", "bindings.json",
  "failures.json", "ledger.json", "seal.json", "recovery-374.py",
  "recovery-report.md", "recover-and-seal.mjs", "recovery-374-result.json",
  "recovery-failures.json", "recovery-ledger.json",
];
const payloads = names.map((name) => {
  const absolutePath = path.join(out, name);
  const bytes = fs.readFileSync(absolutePath);
  return { name, path: absolutePath, bytes: bytes.length, sha256: hash(bytes) };
});
writeNew("final-seal.json", {
  schema: "stemrobin-184/c6-phaseA-final-seal@1",
  cwd, phase: "A", finish: "review",
  status: "SOURCE-FIRST-MATH-FROZEN-WITH-338-HOLD",
  inputs: priorSeal.inputs, payloads,
  initialVerificationExitCode: 1, initialChecksPassed: 479, initialChecksTotal: 480,
  affectedRecoveryExitCode: run.status, recoveryPassed: result.passed,
  originalFailurePreserved: true, unresolvedCommandFailures: 0,
  sourceHold: "338-noanswer-lowpoint-UNKNOWN", qualifiedOwnershipExercises: ["371", "372", "373"],
  sourceApprovalNotEstablished: true, authoredKeysUnseen: true, phaseBPerformed: false,
  lessonCoursePass: false, accounting: priorSeal.accounting,
  sealSelfHash: "excluded to avoid self-reference; actual final-seal-byte hash printed by this command",
});
const bytes = fs.readFileSync(path.join(out, "final-seal.json"));
console.log(JSON.stringify({
  cwd, recovery: result, initialFailurePreserved: true, priorPayloadsIntact, sourceHashesStillMatch,
  unresolvedCommandFailures: 0, accounting: priorSeal.accounting, payloads,
  finalSeal: { path: path.join(out, "final-seal.json"), bytes: bytes.length, sha256: hash(bytes) },
}, null, 2));
