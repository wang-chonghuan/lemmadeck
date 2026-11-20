import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {spawnSync} from "node:child_process";

const cwd = "/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck";
if (process.cwd() !== cwd) throw new Error("Wrong cwd");
const locale = process.argv[2];
if (!["zh", "en"].includes(locale)) throw new Error("Locale required");
const own = path.join(cwd, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d138-t9-semantic-review");
const author = path.join(cwd, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d138-t9-choice-author");
const repo = path.join(cwd, ".tmp/STEMROBIN-181/d1816-d138/choice-repo");
const hash = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const read = name => JSON.parse(fs.readFileSync(path.join(own, name), "utf8"));
const projection = read("visible-only.json");
const draft = path.join(author, `draft.${locale}.json`);
const review = path.join(own, `review.${locale}.json`);
const receipt = path.join(own, `checker.${locale}.json`);
if (fs.existsSync(receipt)) throw new Error("Checker already run; no rerun authorized");
if (hash(fs.readFileSync(draft)) !== projection.locales[locale].draftBinding.sha256) {
  throw new Error("Frozen draft changed; refusing passed-stage rerun");
}
const args = [
  "-B", path.join(cwd, ".agents/skills/ld-s10y-choice/scripts/validate.py"),
  "--repo", repo, "--seed", path.join(repo, ".tmp/d138/seed.json"),
  "--draft", draft, "--review", review
];
const result = spawnSync("python3", args, {
  cwd, encoding: "utf8", env: {...process.env, PYTHONDONTWRITEBYTECODE: "1"}, timeout: 60000
});
const output = {
  cwd, locale, checkerCallsForCompletedReview: 1,
  executable: "python3", argv: args,
  reviewSha256: hash(fs.readFileSync(review)),
  draftSha256: hash(fs.readFileSync(draft)),
  exitCode: result.status, signal: result.signal,
  stdout: result.stdout ?? "", stderr: result.stderr ?? "",
  executionError: result.error?.message ?? null,
  status: result.status === 0 ? "pass" : "fail",
  semanticFailurePreserved: true,
  normalizedToAuthorKey: false
};
fs.writeFileSync(receipt, JSON.stringify(output, null, 2) + "\n", {flag: "wx"});
console.log(JSON.stringify(output));
