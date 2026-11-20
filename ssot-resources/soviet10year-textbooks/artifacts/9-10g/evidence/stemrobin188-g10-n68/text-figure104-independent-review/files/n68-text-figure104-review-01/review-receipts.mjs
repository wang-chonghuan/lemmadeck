import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const repo = "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck";
const tmp = `${repo}/.intentfold/tickets/STEMROBIN-188/tmp`;
if (process.cwd() !== repo) throw new Error("Wrong absolute workdir");
const sha = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const writeNew = (name, value) => {
  const target = path.join(root, name);
  fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
  fs.chmodSync(target, 0o444);
};
const describe = (p) => {
  const bytes = fs.readFileSync(p);
  const stat = fs.statSync(p);
  return {
    path: p,
    sha256: sha(bytes),
    bytes: bytes.length,
    mode: `0${(stat.mode & 0o777).toString(8)}`,
  };
};

if (process.argv[2] === "before") {
  const expected = new Map();
  const add = (p, hash = null) => {
    p = path.resolve(repo, p);
    if (expected.has(p) && hash && expected.get(p) && expected.get(p) !== hash) {
      throw new Error(`Conflicting declared hashes: ${p}`);
    }
    expected.set(p, hash ?? expected.get(p) ?? null);
  };
  const collect = (v) => {
    if (!v || typeof v !== "object") return;
    if (typeof v.path === "string" && typeof v.sha256 === "string") add(v.path, v.sha256);
    Object.values(v).forEach(collect);
  };
  const manifestPath = `${tmp}/n68-text-figure104-review-inputs-01/manifest.json`;
  add(manifestPath, "cfd88d0f778f0ba543439edede146e5f36cadf68f1ab223d01cb5cf3145b2e45");
  collect(read(manifestPath));
  collect(read(`${tmp}/n68-modern-text-author-inputs-01/manifest.json`));
  collect(read(`${tmp}/n68-text-author-01-collection-01.json`));
  const proseCommand = read(`${tmp}/n68-text-author-01/prose-flow.command.json`);
  collect(proseCommand.stdout);
  const admission = read(`${tmp}/g10-n68/source-admission.json`);
  collect(admission.firstIndependentReview);
  collect(admission.affectedWordReview);
  add(`${tmp}/n68-text-figure104-review-inputs-01/blind-intake.json`,
    "a3b4ec1a0853545f0b6af171a1072672ad85cd62e792b6bf68d40ad0a4b28710");
  for (const p of [
    ".intentfold/readme.md",
    ".intentfold/project.json",
    ".intentfold/charter/engineering.md",
    ".intentfold/charter/operations.md",
    ".claude/skills/ld-s10y-lesson/SKILL.md",
    ".claude/skills/ld-s10y-lesson/references/production-resume.md",
    ".claude/skills/ld-s10y-lesson/references/edition-text-contract.md",
    ".agents/skills/ld-s10y-image/SKILL.md",
    ".agents/skills/ld-s10y-image/references/quality-gate.md",
    ".agents/skills/ld-s10y-image/scripts/record_review.py",
    ".agents/skills/ld-s10y-image/scripts/validate_spec.py",
  ]) add(p);
  add("/Users/yong/.agents/skills/intentfold/SKILL.md");
  const inputs = [...expected].map(([p, declared]) => {
    const actual = describe(p);
    return {
      ...actual,
      sha256Before: actual.sha256,
      declaredSha256: declared,
      matchesDeclared: declared === null || actual.sha256 === declared,
    };
  });
  if (inputs.some((v) => !v.matchesDeclared)) throw new Error("Input hash mismatch");
  writeNew("inputs-before.json", {
    schema: "stemrobin188-review-input-receipt@1",
    phase: "before-review-output-recording",
    measuredAt: new Date().toISOString(),
    cwd: repo,
    note: "Main manifest inputs were also measured before candidate reading; this retained receipt adds the inherited textual receipts and tooling. Source-page files in source-admission bindings are deliberately not reopened or transcribed.",
    status: "pass",
    inputs,
  });
  console.log(JSON.stringify({ status: "pass", inputs: inputs.length }));
} else if (process.argv[2] === "after") {
  const before = read(path.join(root, "inputs-before.json"));
  const inputBindings = before.inputs.map((v) => {
    const after = describe(v.path);
    return {
      path: v.path,
      sha256Before: v.sha256Before,
      sha256After: after.sha256,
      bytesBefore: v.bytes,
      bytesAfter: after.bytes,
      modeBefore: v.mode,
      modeAfter: after.mode,
      unchanged: after.sha256 === v.sha256Before
        && after.bytes === v.bytes && after.mode === v.mode,
    };
  });
  if (inputBindings.some((v) => !v.unchanged)) throw new Error("Input changed during review");
  const payload = {
    schema: "stemrobin188-review-input-bindings@1",
    status: "pass",
    measuredAt: new Date().toISOString(),
    cwd: repo,
    unchanged: true,
    inputBindings,
  };
  writeNew("inputBindings.json", payload);
  console.log(JSON.stringify({ status: "pass", inputs: inputBindings.length }));
} else if (process.argv[2] === "index") {
  const outputs = fs.readdirSync(root).sort()
    .filter((name) => name !== "output-index.json")
    .map((name) => describe(path.join(root, name)));
  writeNew("output-index.json", {
    schema: "stemrobin188-review-output-index@1",
    ticket: "STEMROBIN-188",
    reviewer: "SAME188-6",
    scope: "N68 modern TEXT and current fig-g10-104 only",
    outputs,
  });
  const index = describe(path.join(root, "output-index.json"));
  console.log(JSON.stringify({ index, outputs: outputs.length }));
} else {
  throw new Error("Expected before, after or index");
}
