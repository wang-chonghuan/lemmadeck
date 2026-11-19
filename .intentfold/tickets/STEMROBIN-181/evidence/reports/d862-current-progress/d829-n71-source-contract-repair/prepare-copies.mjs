import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";

const R = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
assert.equal(process.cwd(), R);
const ticket = path.join(R, ".intentfold/tickets/STEMROBIN-181");
const O = path.join(ticket, "tmp/d829-n71-source-contract-repair");
const D = path.join(ticket, "tmp/d822-n71-first-bilingual-native");
const E = path.join(ticket, "evidence/reports");
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const hash = (p) => {
  assert.ok(fs.realpathSync(p).startsWith(`${R}/`), p);
  const bytes = fs.readFileSync(p);
  return { path: p, sha256: crypto.createHash("sha256").update(bytes).digest("hex"), bytes: bytes.length };
};
const files = new Set([
  ...["native-gate-disposition.json", "choice-bindings.json", "choice-seed-lookup.json",
    "input-bindings.json", "metadata-only-candidate-changes.json", "usage-baseline.json",
    "report.final.json"].map((f) => path.join(D, f)),
  path.join(ticket, "evidence/index.json"),
  path.join(ticket, "production-meter.json"),
  ...["edition.py", "render_lesson.js", "publish.mjs"].map((f) =>
    path.join(R, ".claude/skills/ld-s10y-lesson/tools", f)),
  ...["app/src/lib/lessons.ts", "app/src/lib/i18n.ts", "app/src/routes/_app/card.$id.tsx",
    ".agents/skills/ld-s10y-choice/references/contract.md",
    ".agents/skills/ld-s10y-choice/scripts/prepare.py",
    ".agents/skills/ld-s10y-choice/scripts/validate.py"].map((f) => path.join(R, f)),
  path.join(E, "d442-source189-n71-progress/d433-n71-first-independent-text-review/report.json"),
  path.join(ticket, "tmp/d814-n71-fig147148-affected-independent-review/report.json"),
]);
const bindings = read(path.join(D, "input-bindings.json"));
for (const b of bindings) {
  if (!/\.(json|md)$/.test(b.path) || b.path.endsWith("/production-meter.json")) continue;
  const current = hash(b.path);
  assert.equal(current.sha256, b.sha256, `Retained input changed: ${b.path}`);
  files.add(b.path);
}
const approved = path.join(E, "d430-source186187-and-n71/d432-n71-first-bilingual-text-author/candidate");
const source = path.join(E, "d430-source186187-and-n71/d427-n71-source-preparation/root/10p/lessons/phy10-c2-s2-n71");
const metadata = read(path.join(D, "metadata-only-candidate-changes.json"));
const copies = [];
for (const locale of ["zh", "en"]) {
  for (const kind of ["lesson", "exercises"]) {
    const name = `${kind}.template.json`;
    const input = path.join(D, locale, "work/adapt/10p/modern-us-neutral/lessons/phy10-c2-s2-n71", name);
    const original = path.join(approved, `${locale === "en" ? "english." : ""}${name}`);
    const restored = read(input);
    for (const change of metadata.changes.filter((c) => c.file === input)) {
      const parts = change.pointer.slice(1).split("/");
      const key = parts.pop();
      let parent = restored;
      for (const part of parts) parent = parent[part];
      assert.deepEqual(parent[key] ?? null, change.after);
      if (change.before === null) delete parent[key];
      else parent[key] = change.before;
    }
    assert.deepEqual(restored, read(original), `Unexpected pre-existing changes: ${input}`);
    const raw = path.join(source, `${kind}.json`);
    assert.deepEqual(read(input).source.data, read(raw), input);
    files.add(input);
    files.add(original);
    files.add(raw);
    const workingSource = path.join(D, locale, "workingartifactroot/10p/lessons/phy10-c2-s2-n71", `${kind}.json`);
    assert.equal(hash(workingSource).sha256, hash(raw).sha256);
    files.add(workingSource);
    copies.push({ locale, kind, input: hash(input), approved: hash(original),
      source: hash(raw), output: path.join(O, locale, "phy10-c2-s2-n71", name) });
  }
}
for (const pack of read(path.join(D, "choice-bindings.json")).packages) {
  for (const key of ["draft", "review"]) {
    for (const p of [pack[key].path, pack[key].copy]) {
      assert.equal(hash(p).sha256, pack[key].sha256);
      files.add(p);
    }
  }
}
for (const folder of [
  "d485-bounded-progress/d456-n71-q3-first-choice-seeds",
  "d485-bounded-progress/d472-n71-q12-first-choice-seeds",
]) {
  files.add(path.join(E, folder, "manifest.json"));
  for (const locale of ["zh", "en"]) files.add(path.join(E, folder, locale, "prepare.receipt.json"));
}
for (const folder of [
  "d485-bounded-progress/d458-n71-q3-first-choice-author",
  "d490-current-progress/d473-n71-q12-first-choice-author",
]) {
  for (const f of ["input-bindings.json", "author-freeze.json"]) files.add(path.join(E, folder, f));
}
const baseline = {
  schema: "d829-input-baseline@1",
  root: R, writeRoot: O,
  inheritedD822Usage: read(path.join(D, "usage-baseline.json")),
  protectedFiles: [...files].sort().map(hash),
  writableCopies: copies,
  approvedSemanticBytesVerified: true,
  inheritedMetadataOnlyChangesVerified: true,
  sourceSnapshotsVerified: true,
  imageFilesRead: 0,
};
fs.writeFileSync(path.join(O, "input-baseline.json"), `${JSON.stringify(baseline, null, 2)}\n`, { flag: "wx" });
for (const copy of copies) {
  fs.mkdirSync(path.dirname(copy.output), { recursive: true });
  fs.copyFileSync(copy.input.path, copy.output, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(copy.output, 0o644);
  assert.equal(hash(copy.output).sha256, copy.input.sha256);
}
console.log(JSON.stringify({ protectedFiles: baseline.protectedFiles.length,
  writableTemplateCopies: copies.length, writeRoot: O, sourceOrValidatorEdits: 0 }));
