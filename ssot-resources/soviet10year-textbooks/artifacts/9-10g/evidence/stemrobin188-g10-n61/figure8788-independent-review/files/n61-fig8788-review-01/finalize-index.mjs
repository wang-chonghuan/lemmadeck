import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = path.dirname(new URL(import.meta.url).pathname);
const hash = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const load = (relative) => JSON.parse(fs.readFileSync(path.join(root, relative), "utf8"));
const before = load("binding-verification.before.json");
const after = load("binding-verification.after.json");
if (before.status !== "PASS" || after.status !== "PASS") throw new Error("Failed input bindings");
for (const item of after.bindings) {
  const initial = before.bindings.find((entry) => entry.path === item.path);
  if (!initial || initial.sha256 !== item.sha256 ||
      hash(fs.readFileSync(item.path)) !== item.sha256) {
    throw new Error(`Input changed: ${item.path}`);
  }
}
for (const seal of after.sourceFirstSeals) {
  const p = path.join(root, seal.path);
  if ((fs.statSync(p).mode & 0o777) !== 0o444 ||
      hash(fs.readFileSync(p)) !== seal.sha256) throw new Error(`FIRST changed: ${p}`);
}
const ledger = load("image-ledger.json");
if (ledger.attempts.reduce((sum, entry) => sum + entry.imageUnits, 0) !== 6 ||
    ledger.totals.actualImageUnitsLoaded !== 6) throw new Error("Image accounting mismatch");
const report = load("report.json");
if (report.figures[0].verdict !== "EXHAUSTED_FAIL" ||
    report.figures[1].verdict !== "CURRENT_DRAFT_VISUAL_CONTENT_PASS_WITH_HOLDS" ||
    report.promotionApproved || report.wholeLessonApproved) throw new Error("Review scope mismatch");
if (!load("authoritative-text-readback.json").contextsMatchEditionText) {
  throw new Error("Authoritative contexts differ from complete edition text");
}
const verifyReferences = (value) => {
  if (!value || typeof value !== "object") return;
  if (typeof value.path === "string" && typeof value.sha256 === "string") {
    const p = path.isAbsolute(value.path) ? value.path : path.join(root, value.path);
    const bytes = fs.readFileSync(p);
    if (hash(bytes) !== value.sha256 ||
        (typeof value.bytes === "number" && bytes.length !== value.bytes)) {
      throw new Error(`Handwritten receipt binding mismatch: ${value.path}`);
    }
  }
  for (const child of Object.values(value)) verifyReferences(child);
};
for (const name of ["report.json", "fig-g10-87-current-review.json", "fig-g10-88-current-review.json"]) {
  verifyReferences(load(name));
}
const collect = (directory, prefix = "") => fs.readdirSync(directory, { withFileTypes: true })
  .flatMap((entry) => {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (relative === "output-index.json") return [];
    if (entry.isSymbolicLink()) throw new Error(`Unexpected output symlink: ${relative}`);
    if (entry.isDirectory()) return collect(path.join(directory, entry.name), relative);
    const p = path.join(root, relative);
    const bytes = fs.readFileSync(p);
    if (entry.name.endsWith(".json")) JSON.parse(bytes);
    return [{ path: relative, sha256: hash(bytes), bytes: bytes.length }];
  });
const outputs = collect(root).sort((a, b) => a.path.localeCompare(b.path));
const index = {
  schema: "stemrobin188-independent-review-output-index@1",
  ticket: "STEMROBIN-188", assignment: "SAME188-6",
  root, selfExcluded: "output-index.json", outputs
};
const p = path.join(root, "output-index.json");
fs.writeFileSync(p, JSON.stringify(index, null, 2) + "\n", { flag: "wx" });
const saved = load("output-index.json");
if (saved.outputs.length !== collect(root).length) throw new Error("Index completeness mismatch");
for (const item of saved.outputs) {
  const bytes = fs.readFileSync(path.join(root, item.path));
  if (hash(bytes) !== item.sha256 || bytes.length !== item.bytes) {
    throw new Error(`Output index mismatch: ${item.path}`);
  }
}
console.log(JSON.stringify({
  status: "PASS", outputIndex: p, sha256: hash(fs.readFileSync(p)),
  bytes: fs.statSync(p).size, outputs: outputs.length,
  inputBindingsUnchanged: after.bindings.length, sealedFIRSTsStill0444: true,
  actualImageUnits: 6, nativeReruns: 0, sessionsLeftRunning: 0,
  verdicts: report.figures.map((figure) => ({ figure: figure.id, verdict: figure.verdict }))
}, null, 2));
