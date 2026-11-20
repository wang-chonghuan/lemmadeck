import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n61-fig838485-review-01";
const sha = b => crypto.createHash("sha256").update(b).digest("hex");
const read = name => JSON.parse(fs.readFileSync(path.join(root, name), "utf8"));
const before = read("inputs-before.json");
const after = read("inputs-after.json");
const comparison = read("current-comparison.json");
const report = read("report.json");
const bindings = new Map(after.entries.map(e => [e.path, e]));
const suffixBinding = suffix => {
  const matches = after.entries.filter(e => e.path.endsWith(suffix));
  if (matches.length !== 1) throw new Error(`Ambiguous packaging reference: ${suffix}`);
  return matches[0];
};
if (before.status !== "PASS" || after.status !== "PASS" || after.changes.length) throw new Error("Binding evidence not PASS");
for (const n of [83, 84, 85]) {
  const review = read(`figure${n}-review.json`);
  const seal = report.FIRSTSeals.find(s => s.figure === review.figure);
  const firstPath = path.join(root, seal.path);
  if (sha(fs.readFileSync(firstPath)) !== seal.sha256 || (fs.statSync(firstPath).mode & 0o777) !== 0o444) throw new Error("FIRST delivery seal mismatch");
  const r = comparison.results.find(x => x.figure === review.figure);
  const source = suffixBinding(`/fig-g10-${n}.png`);
  const context = suffixBinding(`/fig-g10-${n}.context.json`);
  const inputFigure = n === 85 ? "n61-fig8586-author/fig-g10-85.initial" : `n61-fig8384-author/fig-g10-${n}`;
  const spec = suffixBinding(n === 85 ? `${inputFigure}.spec.json` : `${inputFigure}.spec-REPAIR1.json`);
  const render = suffixBinding(n === 85 ? `${inputFigure}.render.json` : `${inputFigure}.REPAIR1.render.json`);
  const expected = {
    sourcePNG: source.sha256,
    context: context.sha256,
    spec: spec.sha256,
    render: render.sha256,
    svg: r.svgHash,
    snapshot: r.snapshot.sha256
  };
  for (const [key, value] of Object.entries(expected)) {
    if (review.currentInputHashes[key] !== value) throw new Error(`Packaging hash transcription mismatch: ${review.figure} ${key}`);
  }
  if (n === 85) {
    const historic = bindings.get(review.historicMetadataHOLD.historicFIRSTPath);
    if (!historic || historic.sha256 !== review.historicMetadataHOLD.historicFIRSTSha256) throw new Error("Historic FIRST reference hash mismatch");
  }
}
const excluded = new Set(["output-index.json", "output-index.sha256"]);
const paths = [];
function walk(folder) {
  for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
    const full = path.join(folder, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && !excluded.has(path.relative(root, full))) paths.push(full);
    else if (!entry.isFile()) throw new Error("Unexpected non-file in reviewer output");
  }
}
walk(root);
const outputs = paths.sort().map(p => {
  const bytes = fs.readFileSync(p);
  return { path: path.relative(root, p), sha256: sha(bytes), bytes: bytes.length };
});
for (const file of ["figure83-review.json", "figure84-review.json", "figure85-review.json", "report.json"]) {
  if (!outputs.some(o => o.path === file)) throw new Error("Missing requested output");
}
for (const p of paths) fs.chmodSync(p, 0o444);
const indexPath = path.join(root, "output-index.json");
const indexBytes = Buffer.from(JSON.stringify({ schema: "stemrobin188-output-index@1", outputs }, null, 2) + "\n");
fs.writeFileSync(indexPath, indexBytes, { flag: "wx" });
const digest = sha(indexBytes);
fs.writeFileSync(path.join(root, "output-index.sha256"), `${digest}  output-index.json\n`, { flag: "wx" });
fs.chmodSync(indexPath, 0o444);
fs.chmodSync(path.join(root, "output-index.sha256"), 0o444);
console.log(JSON.stringify({ index: indexPath, sha256: digest, bytes: indexBytes.length, outputCount: outputs.length, allExecWorkFinished: true, parentCollectAndCloseBeforeRead: true }, null, 2));
