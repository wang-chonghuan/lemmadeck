import assert from "node:assert/strict";
import { cpSync, existsSync } from "node:fs";
import path from "node:path";
import {
  workspace, out, card, edition, tools, python, load, snapshot as copyBinding, save, run, verifyInputs,
} from "./common.mjs";

const snapshot = (source, relative, expected) => copyBinding(source, relative, expected, true);
const evidence = `${workspace}/.intentfold/tickets/STEMROBIN-181/evidence/reports`;
const canonical = `${workspace}/ssot-resources/soviet10year-textbooks/artifacts/9p`;
const consumption = [
  ["d037-source324-327-consumed.json",
    "962ef7852d036547abbe291f63ca8fc36f0e93b3dfbe84d3cdc7ed11e8ec0b03"],
  ["d037-source328-331-consumed.json",
    "d458090c12b846d629ff88d3434d56e1bd1f741d4e3d1819282392d24cc96301"],
];
assert.ok(!existsSync(out("input-freeze.json")));
const inputs = [];
const manifests = consumption.map(([name, expected]) => {
  const item = snapshot(`${evidence}/${name}`, `inputs/consumption/${name}`, expected);
  inputs.push(item);
  const document = load(item.snapshot.path);
  assert.equal(document.status, "PASS-source-consumed");
  return document;
});
const records = manifests.flatMap((document) => document.outputs);
const expectedFor = (file) => {
  const record = records.find((item) => path.resolve(workspace, item.path) === file);
  assert.ok(record, `Missing consumed source binding: ${file}`);
  return record.sha256;
};
const pageDocuments = [];
for (const page of [327, 328, 329, 330, 331]) {
  const number = String(page).padStart(4, "0");
  for (const name of ["page.md", "page.json", "audit.json"]) {
    const source = `${canonical}/pages/${number}/${name}`;
    inputs.push(snapshot(source, `root/9p/pages/${number}/${name}`, expectedFor(source)));
  }
  const document = load(out(`root/9p/pages/${number}/page.json`));
  const audit = load(out(`root/9p/pages/${number}/audit.json`));
  assert.equal(document.meta.page, page);
  assert.equal(document.meta.printed_page, page - 9);
  assert.deepEqual(document.meta.errata, []);
  assert.equal(audit.lines_printed, audit.lines_md);
  assert.deepEqual(audit.errors, []);
  pageDocuments.push(document);
}
// Whole boundary pages stay byte-identical; only the selected card is adapted and frozen.
const sourceFigureIds = pageDocuments.flatMap((document) =>
  document.blocks.filter((block) => block.kind === "fig").map((block) => block.id));
assert.deepEqual(sourceFigureIds, ["fig-300", "fig-301", "fig-302", "fig-303"]);
for (const id of sourceFigureIds) {
  for (const suffix of [".png", ".svg"]) {
    const source = `${canonical}/figures/${id}${suffix}`;
    inputs.push(snapshot(source, `root/9p/figures/${id}${suffix}`, expectedFor(source)));
  }
}
for (const record of manifests.flatMap((document) => document.retained)) {
  if (!record.path.endsWith(".json")) continue;
  inputs.push(snapshot(path.resolve(workspace, record.path),
    `inputs/retained/${path.basename(record.path)}`, record.sha256));
}
const tocPath = `${workspace}/ssot-resources/soviet10year-textbooks/toc/9p/zh.json`;
inputs.push(snapshot(tocPath, "inputs/9p.zh.toc.json"));
const toc = load(out("inputs/9p.zh.toc.json"));
const cards = toc.contents.flatMap((content) => [
  ...(content.kind !== "chapter" ? [content] : []),
  ...(content.lessons ?? []).flatMap((section) => {
    const topics = section.topics ?? [];
    return [
      ...(!topics.length || !topics.some((topic) => topic.printedNumber != null) ? [section] : []),
      ...topics,
    ];
  }),
]);
const target = cards.find((entry) => entry.id === card);
assert.ok(target);
assert.equal(target.printedNumber, 134);
assert.equal(target.title, "铁磁质的基本性质");
assert.equal(target.page, 318);
assert.equal(cards[cards.indexOf(target) - 1].id, "phy9-c2-s7-n133");
assert.equal(cards[cards.indexOf(target) + 1].id, "phy9-conclusion");
assert.equal(cards[cards.indexOf(target) + 1].page, 322);
inputs.push(snapshot(`${evidence}/d038-conclusion-readiness.json`,
  "inputs/d038-conclusion-readiness.json"));
const readiness = load(out("inputs/d038-conclusion-readiness.json"));
assert.equal(readiness.card, "phy9-conclusion");
assert.equal(readiness.status, "complete-unbatched-local-only");
assert.equal(readiness.sourceClosure.headingRef, "p0331#1");

for (const relative of [
  "AGENTS.md",
  ".claude/skills/ld-s10y-lesson/SKILL.md",
  ".claude/skills/ld-s10y-lesson/references/edition-text-contract.md",
  ".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json",
  ".claude/skills/ld-s10y-lesson/profiles/soviet-cn.json",
  ".claude/skills/ld-s10y-lesson/tools/p2c.py",
  ".claude/skills/ld-s10y-lesson/tools/assemble.py",
  ".claude/skills/ld-s10y-lesson/tools/edition.py",
  ".claude/skills/ld-s10y-lesson/tools/blocks.py",
  ".claude/skills/ld-s10y-lesson/tools/normalize.py",
  ".claude/skills/ld-s10y-lesson/tools/mathcheck.py",
  ".claude/skills/ld-s10y-lesson/tools/prose_flow.mjs",
  ".claude/skills/ld-s10y-lesson/tools/htmlfrag.js",
  "ssot-resources/soviet10year-textbooks/sources/manifest.json",
  ".intentfold/tickets/STEMROBIN-181/tmp/d039-9p-n133-author/pipeline.mjs",
  ".intentfold/tickets/STEMROBIN-181/tmp/d039-9p-n133-author/freeze.mjs",
  ".intentfold/tickets/STEMROBIN-181/tmp/d039-10p-n35-author/prepare.mjs",
  ".intentfold/tickets/STEMROBIN-181/tmp/d039-10p-n35-author/author.mjs",
  ".intentfold/tickets/STEMROBIN-181/tmp/d039-10p-n35-author/validate-text.py",
]) {
  const prefix = relative.includes("d039-9p-n133") ? "n133"
    : relative.includes("d039-10p-n35") ? "n35" : String(inputs.length);
  inputs.push(snapshot(`${workspace}/${relative}`,
    `inputs/contracts-and-reuse/${prefix}-${path.basename(relative)}`));
}
save("input-freeze.json", {
  schema: "ld-s10y-lesson/bounded-author-input-freeze@1",
  ticket: "STEMROBIN-181", card, inputs,
  sourceConsumption: consumption, physicalPages: [327, 328, 329, 330, 331],
  targetPhysicalPages: [327, 328, 329, 330], boundaryOnlyPage: 331,
  sourceFigureIds, targetFigureIds: ["fig-301", "fig-302", "fig-303"],
  sourceEvidence: "Existing SOURCE/native/RAW PASS consumed; original failure reports retained.",
  noNewSourceAdjudication: true, imagesOpened: 0, imagesDecoded: 0,
  reusedScripts: ["n133 isolated assembly/freeze", "n35 independent text-only validation"],
});
console.log(run("assemble", python, [
  "-B", `${tools}/p2c.py`, "assemble", "--book", "9p",
  "--root", out("root"), "--work", out("work"), "--toc", out("inputs/9p.zh.toc.json"),
]).trim());
assert.ok(!existsSync(out("root-en")));
cpSync(out("root"), out("root-en"), { recursive: true, errorOnExist: true, force: false });
for (const language of ["zh", "en"]) {
  console.log(run(`adapt-prepare-${language}`, python, [
    "-B", `${tools}/p2c.py`, "adapt-prepare", "--book", "9p", "--edition", edition,
    "--lesson", card, "--root", out(language === "zh" ? "root" : "root-en"),
    "--work", out(language === "zh" ? "work" : "work-en"),
  ]).trim());
}
verifyInputs();
