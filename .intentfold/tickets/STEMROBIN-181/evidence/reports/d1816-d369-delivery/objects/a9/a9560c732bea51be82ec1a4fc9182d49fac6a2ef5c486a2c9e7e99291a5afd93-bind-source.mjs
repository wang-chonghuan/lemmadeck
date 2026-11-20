import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = process.cwd();
const own = path.join(root, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d358-n151-first-text-review");
const digest = value => crypto.createHash("sha256").update(value).digest("hex");
const bind = p => {
  const absolute = path.resolve(root, p);
  const bytes = fs.readFileSync(absolute);
  return {path: absolute, bytes: bytes.length, sha256: digest(bytes)};
};
const input = ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d357-n151-source-rebinding/input-freeze.json";
const packageData = JSON.parse(fs.readFileSync(input, "utf8"));
const declared = [];
function collect(value) {
  if (!value || typeof value !== "object") return;
  if (typeof value.path === "string" && typeof value.sha256 === "string") {
    const actual = bind(value.path);
    declared.push({...actual, declaredSha256: value.sha256, matches: actual.sha256 === value.sha256});
  }
  for (const item of Object.values(value)) collect(item);
}
collect(packageData);
const raw = JSON.parse(fs.readFileSync(packageData.repairedSource.path, "utf8"));
const pageNumbers = [...new Set(raw.prose.flatMap(p => p.source_refs.map(ref => ref.match(/^p(\d+)#/)[1])))];
const sourceBlocks = raw.prose.map((p, entry) => ({
  entry,
  rawTextSha256: digest(p.text),
  refs: p.source_refs.map(ref => {
    const [, page, block] = ref.match(/^p(\d+)#(\d+)$/);
    const data = JSON.parse(fs.readFileSync(`${packageData.root}/10p/pages/${page}/page.json`, "utf8"));
    return {ref, originalBlock: data.blocks[Number(block) - 1]};
  })
}));
const output = {
  schema: "stemrobin181/independent-input-freeze@1",
  stage: "D358",
  frozenAtUtc: new Date().toISOString(),
  candidateTextExposed: false,
  bindingMethod: "Read candidate bytes solely to calculate hashes; no candidate JSON/text parsing or display before independent expectations.",
  d357Package: bind(input),
  sourceExpectations: bind(path.join(own, "source-expectations.json")),
  declaredBindings: declared,
  allDeclaredBindingsMatch: declared.every(b => b.matches),
  sourcePages: pageNumbers.map(p => bind(`${packageData.root}/10p/pages/${p}/page.json`)),
  sourceBlocks,
  authority: [
    bind(".intentfold/charter/product.md"),
    bind(".intentfold/charter/engineering.md"),
    bind(".claude/skills/ld-s10y-lesson/SKILL.md"),
    bind(".claude/skills/ld-s10y-lesson/references/edition-text-contract.md")
  ],
  usage: {imagesOpened: 0, paidCalls: 0, backendCalls: 0, nestedAgents: 0}
};
fs.writeFileSync(path.join(own, "input-freeze.json"), JSON.stringify(output, null, 2) + "\n", {flag: "wx"});
console.log(JSON.stringify({allBindingsMatch: output.allDeclaredBindingsMatch, sourceExpectations: output.sourceExpectations, inputFreeze: bind(path.join(own, "input-freeze.json"))}, null, 2));
