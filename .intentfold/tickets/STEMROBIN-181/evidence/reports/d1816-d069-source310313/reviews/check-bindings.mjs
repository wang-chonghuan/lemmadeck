import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";

const root = "/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck";
assert.equal(process.cwd(), root);
const owned = ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d069-source312313-review";
const read = (p) => fs.readFileSync(path.resolve(root, p), "utf8");
const json = (p) => JSON.parse(read(p));
const hash = (p) => crypto.createHash("sha256").update(fs.readFileSync(path.resolve(root, p))).digest("hex");
const bind = (p) => ({ path: p, sha256: hash(p) });
const aPath = ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d068-source312313-author/author-freeze.json";
const bPath = ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d067-source311-subscript-repair/author-freeze.json";
const a = json(aPath);
const b = json(bPath);
const checked = new Map();
function checkPairs(value) {
  if (!value || typeof value !== "object") return;
  if (typeof value.path === "string" && typeof value.sha256 === "string") {
    const actual = hash(value.path);
    assert.equal(actual, value.sha256, value.path);
    checked.set(value.path, { path: value.path, sha256: actual, matched: true });
  }
  for (const child of Object.values(value)) checkPairs(child);
}
checkPairs(a);
checkPairs(b);
assert.equal(b.baseReview.sha256, "0842a41c0a47cbc458c414ea5254609956583ea51cb0c5e4f2c3ad82797c5542");
assert.equal(b.baseReviewFreeze.sha256, "e7ad9111ab57fe179e214532669fbb33206eeb0152660f88a7d7c1a448238cb2");

// Parse the existing page block format only to compare stored representations.
function parseMd(p) {
  const text = read(p);
  const lines = text.split("\n");
  assert.equal(lines[0], "---");
  const end = lines.indexOf("---", 1);
  assert.ok(end > 1);
  const meta = JSON.parse(lines.slice(1, end).join("\n"));
  const blocks = [];
  let block;
  for (let i = end + 1; i < lines.length; i++) {
    const marker = /^<!-- (.*?) -->$/.exec(lines[i]);
    if (marker) {
      block = { header: marker[1], lines: [], mdLines: [] };
      blocks.push(block);
    } else if (block && lines[i] !== "") {
      if (block.header.split(" ")[0] !== "fig") {
        block.lines.push(lines[i]);
        block.mdLines.push(i + 1);
      }
    }
  }
  return { meta, blocks };
}
const mdJsonAgreement = a.records.map((record) => {
  const md = parseMd(record.pageMd.path);
  const doc = json(record.pageJson.path);
  assert.deepEqual(md.meta, doc.meta);
  assert.equal(md.blocks.length, doc.blocks.length);
  md.blocks.forEach((block, i) => {
    assert.deepEqual(block.lines, doc.blocks[i].lines);
    const flags = block.header.split(" ");
    assert.equal(flags[0], doc.blocks[i].kind);
    for (const flag of ["open", "cont", "samerow"]) {
      assert.equal(flags.includes(flag), doc.blocks[i][flag]);
    }
    assert.equal(flags.includes("footnote"), doc.blocks[i].label === "footnote");
  });
  return {
    page: record.page,
    metaEqual: true,
    allBlockLinesAndFlagsEqual: true,
    blockCount: doc.blocks.length,
    blocks: md.blocks.map((block, i) => ({
      block: i + 1,
      header: block.header,
      mdLines: block.mdLines,
      storedLines: block.lines.length,
    })),
  };
});
const before312Md = parseMd(a.records[0].before[0].path);
const after312Md = parseMd(a.records[0].pageMd.path);
assert.deepEqual(before312Md.blocks, after312Md.blocks.map((block, i) => ({
  ...block, mdLines: before312Md.blocks[i].mdLines,
})));
const before312Json = json(a.records[0].before[1].path);
const after312Json = json(a.records[0].pageJson.path);
assert.deepEqual(before312Json.blocks, after312Json.blocks);
const stripCounting = ({ counting, ...rest }) => rest;
assert.deepEqual(stripCounting(before312Md.meta), stripCounting(after312Md.meta));
assert.deepEqual(stripCounting(before312Json.meta), stripCounting(after312Json.meta));

const beforeMd = read(b.before[0].path);
const afterMd = read(b.pageMd.path);
const beforeLines = beforeMd.split("\n");
const afterLines = afterMd.split("\n");
assert.equal(beforeLines.length, afterLines.length);
const changedMdLines = beforeLines.flatMap((line, i) => line === afterLines[i] ? [] : [i + 1]);
assert.deepEqual(changedMdLines, [83]);
assert.equal(beforeLines[82].split(b.from).length - 1, 1);
assert.equal(afterLines[82], beforeLines[82].replace(b.from, b.to));
assert.equal(afterMd, beforeMd.replace(b.from, b.to));
const oldDoc = json(b.before[1].path);
const newDoc = json(b.pageJson.path);
const jsonChanges = [];
function differences(oldValue, newValue, pointer = "") {
  if (Object.is(oldValue, newValue)) return;
  if (oldValue && newValue && typeof oldValue === "object" && typeof newValue === "object") {
    assert.deepEqual(Object.keys(oldValue), Object.keys(newValue), `keys:${pointer}`);
    for (const key of Object.keys(oldValue)) differences(oldValue[key], newValue[key], `${pointer}/${key}`);
  } else {
    jsonChanges.push({ pointer, before: oldValue, after: newValue });
  }
}
differences(oldDoc, newDoc);
assert.equal(jsonChanges.length, 1);
assert.equal(jsonChanges[0].pointer, "/blocks/8/lines/0");
assert.equal(jsonChanges[0].before, beforeLines[82]);
assert.equal(jsonChanges[0].after, afterLines[82]);
const oldTokenJson = JSON.stringify(b.from).slice(1, -1);
const newTokenJson = JSON.stringify(b.to).slice(1, -1);
const beforeJsonText = read(b.before[1].path);
assert.equal(beforeJsonText.split(oldTokenJson).length - 1, 1);
assert.equal(read(b.pageJson.path), beforeJsonText.replace(oldTokenJson, newTokenJson));
assert.equal(hash(b.before[2].path), hash(b.audit.path));
const baseReview = json(b.baseReview.path);
assert.equal(baseReview.reviewerIsAuthor, false);
assert.equal(baseReview.findings.length, 1);
assert.equal(baseReview.findings[0].id, "D067-F1");
assert.equal(baseReview.findings[0].expected, b.to);
const base311 = baseReview.records.find((r) => r.page === 311);
const baseFreeze311 = json(b.baseReviewFreeze.path).candidates.find((r) => r.page === 311);
assert.equal(base311.SOURCE.status, "fail");
assert.equal(base311.RAW.status, "pass");
assert.equal(base311.SVG.status, "pass");
assert.equal(base311.SOURCE.candidateMd.sha256, b.before[0].sha256);
assert.equal(base311.SOURCE.candidateJson.sha256, b.before[1].sha256);
assert.equal(base311.SOURCE.audit.sha256, b.audit.sha256);
assert.equal(baseFreeze311.originalSource.sha256, b.sourceImage.sha256);
assert.equal(base311.RAW.sha256, b.rawPng.sha256);
assert.equal(base311.SVG.sha256, b.rawSvg.sha256);
assert.equal(base311.SVG.preview.sha256, b.svgPreview.sha256);

const authority181 = ".intentfold/tickets/STEMROBIN-181/tmp/d1816-recovery/native/d061-live181-read/stdout.txt";
const authority179 = ".intentfold/tickets/STEMROBIN-181/tmp/d1816-recovery/native/d061-live179-comments-read/stdout.txt";
const ticket = json(authority181);
const comment = json(authority179).results.find((r) => r.id === "830251c5-4c6f-48af-9bae-6e3a22118c80");
assert.ok(comment);
const instructions = [
  "AGENTS.md",
  ".intentfold/readme.md",
  ".intentfold/project.json",
  ".intentfold/charter/product.md",
  ".intentfold/charter/engineering.md",
  ".intentfold/charter/operations.md",
  ".intentfold/charter/ui.md",
  ".claude/skills/ld-s10y-lesson/SKILL.md",
  ".claude/skills/ld-s10y-lesson/references/production-resume.md",
  ".agents/skills/ld-s10y-image/SKILL.md",
  ".agents/skills/ld-s10y-image/references/quality-gate.md",
  "/Users/yong/.agents/skills/intentfold/SKILL.md",
].map(bind);
const evidence = {
  schema: "STEMROBIN-181/review-mechanical-evidence@1",
  batch: "D069",
  workdir: root,
  semanticJudgmentsComputed: false,
  authorFreezes: [bind(aPath), bind(bPath)],
  checkedBindings: [...checked.values()],
  mdJsonAgreement,
  source312CountingRepair: {
    allElevenBodyBlocksUnchanged: true,
    onlyMetaCountingAdded: true,
    counting: after312Md.meta.counting,
  },
  source311ExactDelta: {
    changedMdLines,
    beforeLine: beforeLines[82],
    afterLine: afterLines[82],
    from: b.from,
    to: b.to,
    inserted: "_i",
    insertedUnicodeCodepoints: 2,
    insertedUtf8Bytes: 2,
    entireMdEqualsSingleTokenReplacement: true,
    entireJsonBytesEqualSingleTokenReplacement: true,
    entireJsonStructuralChanges: jsonChanges,
    auditBytesUnchanged: true,
    baseSoleFinding: baseReview.findings[0],
    base311SourceUnchanged: true,
    baseRawSvgPreviewUnchanged: true,
  },
  authority: {
    receipts: [bind(authority181), bind(authority179)],
    ticketId: ticket.id,
    sequence: ticket.sequence_id,
    latest179Comment: { id: comment.id, createdAt: comment.created_at },
  },
  instructionBindings: instructions,
  nativeEvidenceBindings: [...a.nativeReceipts, b.nativeFinalize].map((receipt) => ({
    receipt: bind(receipt.path),
    stdout: bind(path.join(path.dirname(receipt.path), "stdout.txt")),
    stderr: bind(path.join(path.dirname(receipt.path), "stderr.txt")),
  })),
  imageFilesReadAsBytesOnlyNotOpened: true,
  imageOpensPerformedByScript: 0,
};
fs.writeFileSync(path.join(root, owned, "mechanical-evidence.json"), JSON.stringify(evidence, null, 2) + "\n");
console.log(JSON.stringify({
  semanticJudgmentsComputed: false,
  bindingChecks: checked.size,
  authorFreezes: evidence.authorFreezes,
  exact311Delta: evidence.source311ExactDelta,
  mdJsonAgreement,
  evidence: bind(`${owned}/mechanical-evidence.json`),
}, null, 2));
