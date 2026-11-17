import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const ticket = path.join(root, ".intentfold/tickets/STEMROBIN-181/tmp");
const evidence = path.join(ticket, "d042-10p-source112-115-review-evidence");
const phase = process.argv[2];
if (!["before", "after"].includes(phase)) throw new Error("Expected before or after");
const authorities = [
  {
    path: path.join(ticket, "d042-10p-source112-115-author/complete-freeze.json"),
    sha256: "1dc3dca6e106836279a31c077c654d74485b1178e0f8144754096b79b7d029d1",
  },
  {
    path: path.join(ticket, "d042-source112-115-preparation/prepared.json"),
    sha256: "4df2238d78edbc710b26bc1e21a0dec8d7dca3f33ed3886a24c46a03202583c6",
  },
];
const bindings = new Map();
function collect(value) {
  if (!value || typeof value !== "object") return;
  if (typeof value.path === "string" && /^[a-f0-9]{64}$/.test(value.sha256 || "")) {
    const absolute = path.resolve(root, value.path);
    const expected = bindings.get(absolute);
    if (expected && expected !== value.sha256) throw new Error(`Conflicting binding: ${absolute}`);
    bindings.set(absolute, value.sha256);
  }
  for (const child of Object.values(value)) collect(child);
}
for (const authority of authorities) {
  collect(authority);
  collect(JSON.parse(fs.readFileSync(authority.path, "utf8")));
}
const rows = [...bindings].sort(([a], [b]) => a.localeCompare(b)).map(([file, expected]) => {
  const bytes = fs.readFileSync(file);
  const actual = crypto.createHash("sha256").update(bytes).digest("hex");
  return { path: file, expected, actual, sizeBytes: bytes.length, matches: expected === actual };
});
const result = {
  schema: "source-raw-review/bindings@1",
  phase,
  timestamp: new Date().toISOString(),
  count: rows.length,
  allMatch: rows.every((row) => row.matches),
  bindings: rows,
};
if (phase === "after") {
  const before = JSON.parse(fs.readFileSync(path.join(evidence, "bindings-before.json"), "utf8"));
  result.unchangedFromBefore = JSON.stringify(before.bindings) === JSON.stringify(rows);
}
fs.writeFileSync(path.join(evidence, `bindings-${phase}.json`), JSON.stringify(result, null, 2) + "\n", { flag: "wx" });
console.log(JSON.stringify({ phase, count: result.count, allMatch: result.allMatch, unchangedFromBefore: result.unchangedFromBefore }));
if (!result.allMatch || result.unchangedFromBefore === false) process.exitCode = 1;
