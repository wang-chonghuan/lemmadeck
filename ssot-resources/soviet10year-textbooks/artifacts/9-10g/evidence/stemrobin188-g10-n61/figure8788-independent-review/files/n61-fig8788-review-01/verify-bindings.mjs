import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = path.dirname(new URL(import.meta.url).pathname);
const intakePath = path.resolve(root, "../n61-fig8788-review-inputs-01/blind-intake.json");
const hash = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const intakeBytes = fs.readFileSync(intakePath);
const intake = JSON.parse(intakeBytes);
const manifestBytes = fs.readFileSync(intake.afterAllOriginalFIRSTsSealed.path);
if (hash(manifestBytes) !== intake.afterAllOriginalFIRSTsSealed.sha256) {
  throw new Error("Blind-intake manifest binding mismatch");
}
const manifest = JSON.parse(manifestBytes);
const phase = process.argv[2];
if (!["before", "after"].includes(phase)) throw new Error("Expected before or after");
const expectedFirst = {
  "fig-g10-87-FIRST.json": "9ba9eccb117b60296188806125f2b3d3e51e1b207a13ad65f69c4040051b386a",
  "fig-g10-88-FIRST.json": "4c5298eb70f785d21dccb44b561e5b2000d2cf7c0b1554ee4a20f96673299221"
};
const seals = Object.entries(expectedFirst).map(([relativePath, expectedSha256]) => {
  const p = path.join(root, relativePath);
  const bytes = fs.readFileSync(p);
  const stat = fs.statSync(p);
  const sha256 = hash(bytes);
  return { path: relativePath, expectedSha256, sha256, bytes: bytes.length,
    mode: (stat.mode & 0o777).toString(8).padStart(4, "0"),
    status: sha256 === expectedSha256 && (stat.mode & 0o777) === 0o444 ? "PASS" : "FAIL" };
});
const references = [
  { path: intakePath, sha256: "5044ad630588ab28b9cba6a3013b194aed8b4299342f71c0551454ac13328649" },
  intake.afterAllOriginalFIRSTsSealed, ...manifest.bindings,
  ...manifest.figures.flatMap((figure) => [
    figure.source.sourceImage, figure.source.context, ...Object.values(figure.current)
  ])
];
const expected = new Map();
for (const entry of references) {
  if (expected.has(entry.path) && expected.get(entry.path) !== entry.sha256) {
    throw new Error(`Conflicting bindings: ${entry.path}`);
  }
  expected.set(entry.path, entry.sha256);
}
const bindings = [...expected].map(([p, expectedSha256]) => {
  try {
    const bytes = fs.readFileSync(p);
    const stat = fs.statSync(p);
    const sha256 = hash(bytes);
    return { path: p, expectedSha256, sha256, bytes: bytes.length,
      mode: (stat.mode & 0o777).toString(8).padStart(4, "0"),
      status: sha256 === expectedSha256 ? "PASS" : "FAIL" };
  } catch (error) {
    return { path: p, expectedSha256, status: "FAIL", error: String(error) };
  }
});
const result = {
  schema: "independent-review-binding-verification@1", phase,
  verifiedAt: new Date().toISOString(),
  status: [...seals, ...bindings].every((entry) => entry.status === "PASS") ? "PASS" : "FAIL",
  sourceFirstSeals: seals, bindings,
  imageRenderingsProduced: 0,
  note: "Byte/hash/stat verification only; no image decoded or visually opened, no native stage rerun."
};
const output = path.join(root, `binding-verification.${phase}.json`);
fs.writeFileSync(output, JSON.stringify(result, null, 2) + "\n", { flag: "wx" });
console.log(JSON.stringify({ output, status: result.status, bindingCount: bindings.length,
  sha256: hash(fs.readFileSync(output)), bytes: fs.statSync(output).size,
  failures: [...seals, ...bindings].filter((entry) => entry.status !== "PASS") }, null, 2));
if (result.status !== "PASS") process.exitCode = 1;
