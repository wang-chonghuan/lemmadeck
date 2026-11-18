import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const out = path.dirname(new URL(import.meta.url).pathname);
const hash = p => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const checks = [];
function check(p, expected, kind) {
  const absolute = path.resolve(root, p);
  const actual = hash(absolute);
  checks.push({path: absolute, expectedSha256: expected, sha256: actual, matches: actual === expected, kind});
}
const packages = [
  ["d224-source176-first-author", "ff810bc88872c61943109fecda4907896a16efa31112caf657d6dc9b61ba494e"],
  ["d216-source174-175-first-author", "12c00f2691773c6540795d69e2e5bc7480e03b890130af1fd023b3392b5fa560"]
];
for (const [name, expected] of packages) {
  const base = path.join(root, ".intentfold/tickets/STEMROBIN-181/tmp", name);
  const freezePath = path.join(base, "author-freeze.json");
  check(freezePath, expected, "author-freeze");
  const freeze = JSON.parse(fs.readFileSync(freezePath, "utf8"));
  function walk(value) {
    if (!value || typeof value !== "object") return;
    if (typeof value.path === "string" && typeof value.sha256 === "string") {
      check(value.path.startsWith(".intentfold/") ? value.path : path.join(base, value.path), value.sha256, "freeze-binding");
    }
    for (const child of Object.values(value)) walk(child);
  }
  walk(freeze);
  if (name.startsWith("d224")) {
    const manifest = JSON.parse(fs.readFileSync(path.join(root, freeze.inputManifest.path), "utf8"));
    const source = manifest.outputs.find(p => p.physicalPage === 176).files.find(f => f.path.endsWith("/page.png"));
    check(source.path, source.sha256, "prepared-original-176");
    check(path.join(base, "work/10p/pages/0176/page.png"), source.sha256, "author-copy-original-176");
  }
}
const result = {
  schema: "stemrobin/bounded-first-review-bindings@1",
  date: "2026-11-17",
  scope: ["SOURCE176", "RAW134"],
  status: checks.every(c => c.matches) ? "PASS" : "FAIL",
  checks,
  imagePayloadsRead: 0,
  authorPageContentsReadBeforePixelInventory: false
};
fs.writeFileSync(path.join(out, "input-bindings.json"), JSON.stringify(result, null, 2) + "\n", {flag: "wx"});
fs.writeFileSync(path.join(out, "actual-opens.json"), JSON.stringify({
  schema: "stemrobin/actual-image-opens@1",
  freshTemporaryReviewer: true,
  permanentADWorker: false,
  parentImageTotal: 24,
  parentMayOpenImages: false,
  carriedReviewerImageTotal: 0,
  batchLimit: 8,
  cumulativeLimit: 24,
  opens: [],
  newTotal: 0,
  cumulativeTotal: 0,
  imagesReturnedToParent: false
}, null, 2) + "\n", {flag: "wx"});
console.log(JSON.stringify({status: result.status, checked: checks.length, failures: checks.filter(c => !c.matches)}));
if (result.status !== "PASS") process.exitCode = 1;
