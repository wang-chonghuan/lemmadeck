import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = process.cwd();
const own = path.join(root, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d358-n151-first-text-review");
const primary = path.join(root, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d351-n151-bilingual-author/primary-sources");
const bind = p => {
  const bytes = fs.readFileSync(p);
  return {path: p, bytes: bytes.length, sha256: crypto.createHash("sha256").update(bytes).digest("hex")};
};
const references = fs.readdirSync(primary).filter(p => p.endsWith(".receipt.json")).map(name => {
  const p = path.join(primary, name);
  const receipt = JSON.parse(fs.readFileSync(p, "utf8"));
  const stdout = receipt.stdout ? bind(receipt.stdout.path) : null;
  const stderr = receipt.stderr ? bind(receipt.stderr.path) : null;
  return {
    receipt: bind(p),
    id: receipt.id,
    url: receipt.url,
    successful: (receipt.exitCode ?? receipt.exit_code) === 0 && String(receipt.httpStatus ?? receipt.http_status) === "200",
    stdout,
    stdoutMatches: stdout ? stdout.sha256 === receipt.stdout.sha256 && stdout.bytes === receipt.stdout.bytes : null,
    stderr,
    stderrMatches: stderr ? stderr.sha256 === receipt.stderr.sha256 && stderr.bytes === receipt.stderr.bytes : null,
    limitedObservationWithoutFullStdout: !stdout
  };
});
const fermilab = bind(path.join(root, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d332-n149-first-text-review/primary-sources/fermilab-beta-decay.receipt.json"));
const output = {
  schema: "stemrobin181/independent-primary-evidence-freeze@1",
  stage: "D358",
  frozenAtUtc: new Date().toISOString(),
  modernCandidateExposure: false,
  sourceExpectations: bind(path.join(own, "source-expectations.json")),
  scienceExpectations: bind(path.join(own, "science-expectations.json")),
  inputFreeze: bind(path.join(own, "input-freeze.json")),
  references,
  fermilab,
  allSuccessfulAndRetainedHashesMatch: references.every(r => r.successful && r.stdoutMatches !== false && r.stderrMatches !== false),
  limitations: [
    "Reused Fermilab and nuclear fulltext are retained successful primary-observation receipts, not full independently hashed stdout.",
    "Primary stdout was read for relevant factual passages; large Feynman search output was truncated, so only actually visible passages and the subsequent focused Hamiltonian extract are relied upon.",
    "No reference imagery was opened; no archival quotation authentication claimed.",
    "No new external requests or paid calls."
  ]
};
fs.writeFileSync(path.join(own, "primary-evidence.json"), JSON.stringify(output, null, 2) + "\n", {flag: "wx"});
console.log(JSON.stringify({allEvidenceBindingsMatch: output.allSuccessfulAndRetainedHashesMatch, scienceExpectations: output.scienceExpectations, primaryEvidence: bind(path.join(own, "primary-evidence.json"))}, null, 2));
