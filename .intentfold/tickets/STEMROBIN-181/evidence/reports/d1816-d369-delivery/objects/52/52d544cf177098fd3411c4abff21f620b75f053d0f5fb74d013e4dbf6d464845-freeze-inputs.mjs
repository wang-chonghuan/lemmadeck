import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = process.cwd();
const own = path.join(root, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d367-n149-layout-context-review");
const prefix = ".intentfold/tickets/STEMROBIN-181/tmp";
const manifestPath = path.join(root, prefix, "d1816-d365-n149-native-layout-repair/author-freeze.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const bind = p => {
  const absolute = path.resolve(root, p);
  const bytes = fs.readFileSync(absolute);
  return {path: absolute, bytes: bytes.length, sha256: crypto.createHash("sha256").update(bytes).digest("hex")};
};
const declared = [];
function collect(value, key = "") {
  if (!value || typeof value !== "object") return;
  if (value.path && value.sha256) {
    if (key === "before") {
      declared.push({path: value.path, declaredSha256: value.sha256, mutablePathNowAfter: true, validation: "Use retained beforeSnapshot, not the intentionally changed working pathname."});
    } else {
      const actual = bind(value.path);
      declared.push({...actual, declaredSha256: value.sha256, matches: actual.sha256 === value.sha256});
    }
  }
  for (const [childKey, child] of Object.entries(value)) collect(child, childKey);
}
collect(manifest);
const additionalPaths = [
  `${prefix}/d1816-d358-n151-first-text-review/report.json`,
  `${prefix}/d1816-d358-n151-first-text-review/review-freeze.json`,
  `${prefix}/d1816-d332-n149-first-text-review/report.json`,
  `${prefix}/d1816-d347-n149-affected-text-review/report.json`,
  `${prefix}/d1816-d347-n149-affected-text-review/review-freeze.json`,
  `${prefix}/d1816-d347-n149-affected-text-review/zh.prose-flow.json`,
  `${prefix}/d1816-d347-n149-affected-text-review/en.prose-flow.json`,
  `${prefix}/d1816-d355-fig277-first-review/report.json`,
  `${prefix}/d1816-recovery/native/d337-n149-zh-first-adapt-finalize/receipt.json`,
  `${prefix}/d1816-recovery/native/d337-n149-zh-first-adapt-finalize/stdout.txt`,
  `${prefix}/d1816-recovery/native/d337-n149-zh-first-adapt-finalize/stderr.txt`,
  ".tmp/STEMROBIN-181/d1816-d337/root/10p/lessons/phy10-c3-s4-n149/lesson.json",
  ".tmp/STEMROBIN-181/d1816-d337/root/10p/lessons/phy10-c3-s4-n149/exercises.json",
  ".tmp/STEMROBIN-181/d1816-d337/root/10p/pages/0382/page.json",
  ".tmp/STEMROBIN-181/d1816-d337/root/10p/pages/0385/page.json",
  ".tmp/STEMROBIN-181/d1816-d352/fig-277.render.json",
  ".tmp/STEMROBIN-181/d1816-d344/fig-277.svg",
  ".tmp/STEMROBIN-181/d1816-d330/root/10p/figures/fig-277.png",
  "ssot-resources/soviet10year-textbooks/artifacts/10p/figures/fig-277.png",
  ".claude/skills/ld-s10y-lesson/tools/edition.py",
  ".claude/skills/ld-s10y-lesson/tools/prose_flow.mjs",
  ".claude/skills/ld-s10y-lesson/tools/htmlfrag.js"
];
const output = {
  schema: "stemrobin181/affected-review-input-freeze@1",
  stage: "D367",
  frozenAtUtc: new Date().toISOString(),
  manifest: bind(manifestPath),
  expectations: bind(path.join(own, "expectations.json")),
  declared,
  allApplicableDeclarationsMatch: declared.every(b => b.matches !== false),
  additional: additionalPaths.map(bind),
  imagesOpened: 0,
  imageFilesUsedOnlyAsByteHashEvidence: true,
  D358AlreadySealedBeforeThisInputFreeze: true
};
fs.writeFileSync(path.join(own, "input-freeze.json"), JSON.stringify(output, null, 2) + "\n", {flag: "wx"});
console.log(JSON.stringify({allApplicableDeclarationsMatch: output.allApplicableDeclarationsMatch, inputFreeze: bind(path.join(own, "input-freeze.json")), expectations: output.expectations}, null, 2));
