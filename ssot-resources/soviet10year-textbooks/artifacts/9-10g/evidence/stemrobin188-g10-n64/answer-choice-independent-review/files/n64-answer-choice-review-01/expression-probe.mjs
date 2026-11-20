import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { createRequire } from "node:module";

const repo = "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck";
const root = path.join(repo, ".intentfold/tickets/STEMROBIN-188/tmp/n64-answer-choice-review-01");
if (process.cwd() !== repo) throw new Error("Explicit repository workdir required");
const require = createRequire(path.join(repo, "app/package.json"));
const { ComputeEngine } = require("@cortex-js/compute-engine");
const engine = new ComputeEngine();
const candidatePath = path.join(repo, ".intentfold/tickets/STEMROBIN-188/tmp/n64-answer-author/answer-keys.candidate.json");
const candidateBytes = fs.readFileSync(candidatePath);
const candidateSha256 = crypto.createHash("sha256").update(candidateBytes).digest("hex");
if (candidateSha256 !== "c1e8476fd7beebb6dcc0862b342201d0d0ab3fd8fafa514b45709edd46ab7f3a") {
  throw new Error("Answer input changed");
}
const parts = JSON.parse(candidateBytes).answers.find(a => a.exercise === "234").parts;
const cases = [
  { part: 0, input: "y=3", shouldAccept: true, reason: "Original plane." },
  { part: 0, input: "3\\cdot y=9", shouldAccept: true, reason: "Explicit alternate key." },
  { part: 0, input: "2\\cdot y=6", shouldAccept: true, reason: "Nonzero scalar multiple." },
  { part: 0, input: "3=y", shouldAccept: true, reason: "Equation sides reversed." },
  { part: 0, input: "y-3=0", shouldAccept: true, reason: "Residual-zero form." },
  { part: 0, input: "-y=-3", shouldAccept: true, reason: "Negative scalar multiple." },
  { part: 0, input: "y=1", shouldAccept: false, reason: "Wrong constant and cut plane." },
  { part: 0, input: "x=3", shouldAccept: false, reason: "Different tangent contact." },
  { part: 0, input: "0=0", shouldAccept: false, reason: "Whole space, not a plane." },
  { part: 1, input: "2\\cdot y-\\sqrt{5}\\cdot z=9", shouldAccept: true, reason: "Original second plane." },
  { part: 1, input: "4\\cdot y-2\\cdot\\sqrt{5}\\cdot z=18", shouldAccept: true, reason: "Nonzero scalar multiple." },
  { part: 1, input: "9=2\\cdot y-\\sqrt{5}\\cdot z", shouldAccept: true, reason: "Sides reversed." },
  { part: 1, input: "2\\cdot y-\\sqrt{5}\\cdot z-9=0", shouldAccept: true, reason: "Residual-zero form." },
  { part: 1, input: "2\\cdot y+\\sqrt{5}\\cdot z=9", shouldAccept: false, reason: "Wrong contact sign." },
  { part: 1, input: "2\\cdot y-\\sqrt{5}\\cdot z=3", shouldAccept: false, reason: "Wrong radius constant." },
  { part: 2, input: "2\\cdot x-2\\cdot y-z=9", shouldAccept: true, reason: "Original third plane." },
  { part: 2, input: "-2\\cdot x+2\\cdot y+z=-9", shouldAccept: true, reason: "Negative scalar multiple." },
  { part: 2, input: "4\\cdot x-4\\cdot y-2\\cdot z=18", shouldAccept: true, reason: "Positive scalar multiple." },
  { part: 2, input: "2\\cdot x-2\\cdot y-z-9=0", shouldAccept: true, reason: "Residual-zero form." },
  { part: 2, input: "2\\cdot x-2\\cdot y-z=3", shouldAccept: false, reason: "Wrong radius constant." },
  { part: 2, input: "2\\cdot x+2\\cdot y+z=9", shouldAccept: false, reason: "Wrong normal signs." }
];
const results = cases.map(item => {
  const input = engine.parse(item.input);
  const comparisons = parts[item.part].expected.map(expected => {
    const target = engine.parse(expected);
    return { expected, inputParseError: input.has("Error"), expectedParseError: target.has("Error"),
      isEqual: input.isEqual(target) ?? null };
  });
  const actual = !input.has("Error") && comparisons.some(value =>
    !value.expectedParseError && value.isEqual === true);
  return { ...item, accepted: actual, matches: actual === item.shouldAccept, comparisons };
});
const runtimePath = path.join(repo, "app/src/lib/textbook-answer.ts");
const result = {
  schema: "stemrobin188-local-expression-probe@1",
  scope: "Pure installed ComputeEngine parse/isEqual used by the current expression branch, not app execution or DB evidence.",
  candidate: { path: candidatePath, sha256: candidateSha256 },
  runtime: { path: runtimePath, sha256: crypto.createHash("sha256").update(fs.readFileSync(runtimePath)).digest("hex"),
    operation: "parse submission; parse every expected; accept iff some input.isEqual(target) === true" },
  variableDomains: "Candidate and current AnswerPart type have no variableDomains. Source x,y,z are unrestricted real coordinates; these linear equalities need no excluded-value domain.",
  caseCount: results.length,
  expectedAccepted: results.filter(x => x.shouldAccept).length,
  expectedRejected: results.filter(x => !x.shouldAccept).length,
  matchCount: results.filter(x => x.matches).length,
  mismatchCount: results.filter(x => !x.matches).length,
  verdict: results.every(x => x.matches) ? "PASS" : "HOLD",
  results,
  browserGlyphVerification: "NOT_RUN_OFFLINE",
  mathliveEditingVerification: "NOT_RUN_OFFLINE",
  dbConnections: 0,
  appChanges: false
};
fs.writeFileSync(path.join(root, "expression-probe-result.json"), JSON.stringify(result, null, 2) + "\n",
  { flag: "wx", mode: 0o644 });
console.log(JSON.stringify(result, null, 2));
