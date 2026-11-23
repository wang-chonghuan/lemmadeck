import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";

const repo = "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck";
const input = path.join(repo, ".intentfold/tickets/STEMROBIN-188/tmp/source155156-independent-inputs-09");
const own = path.dirname(new URL(import.meta.url).pathname);
const sha = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const json = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const bindings = [];
function bind(entry) {
  const bytes = fs.readFileSync(entry.path);
  const actual = sha(bytes);
  assert.equal(actual, entry.sha256, entry.path);
  bindings.push({ path: entry.path, sha256: actual, bytes: bytes.length });
  return bytes;
}
const source = json(path.join(input, "source-only.json"));
const post = json(path.join(input, "post-FIRST.json"));
const affected = json(path.join(input, "source151-affected.json"));
for (const [name, hash] of [
  ["source-only.json", "b5ace285b17fdc895008e7a61b21ac3b2614ccebcdfe772da9e096cc4ffd9428"],
  ["post-FIRST.json", "7556d3c543c278009a411169ce999f40b3dd0562abf9083e50ab22d9d7c95744"],
  ["source151-affected.json", "0fdac35ef7dde8cef44f4bf85a8b3dc942e5db6af3c532f6ec465b4d2997355f"],
]) bind({ path: path.join(input, name), sha256: hash });
for (const original of source.originals) bind(original.png);
bind(post.authorReport);
bind(post.record);

function readReceipt(entry) {
  const receipt = JSON.parse(bind(entry));
  assert.equal(receipt.cwd, repo);
  assert.equal(receipt.signal, null);
  assert.ok(!receipt.interrupted && !receipt.spawn_error && !receipt.error);
  const streams = {};
  for (const [name, stream] of Object.entries(receipt.streams)) {
    const bytes = bind(stream);
    if (stream.bytes !== undefined) assert.equal(bytes.length, stream.bytes);
    streams[name] = bytes.toString("utf8");
  }
  return { path: entry.path, sha256: entry.sha256, exitCode: receipt.exitCode, argv: receipt.argv, streams };
}

function parseMarkdown(md) {
  const end = md.indexOf("\n---", 4);
  const meta = JSON.parse(md.slice(4, end).trim());
  const body = md.slice(end + 4);
  const blocks = [];
  const marker = /<!--\s*(.*?)\s*-->\s*\n/g;
  const matches = [...body.matchAll(marker)];
  for (let i = 0; i < matches.length; i++) {
    const header = matches[i][1];
    const tokens = header.split(/\s+/);
    const kind = tokens.shift();
    const start = matches[i].index + matches[i][0].length;
    const text = body.slice(start, matches[i + 1]?.index ?? body.length).trim();
    blocks.push({
      kind,
      label: kind === "fig" || kind === "cap" ? tokens.slice(0, 2).join(" ") : ["ex", "foot"].includes(kind) ? tokens[0] ?? null : null,
      cont: tokens.includes("cont"),
      open: tokens.includes("open"),
      samerow: tokens.includes("samerow"),
      lines: kind === "fig" ? [] : text.split("\n"),
    });
  }
  return { meta, blocks };
}

const candidates = [];
for (const page of post.candidates) {
  const files = Object.fromEntries(page.files.map((entry) => [path.basename(entry.path), bind(entry)]));
  const structured = JSON.parse(files["page.json"]);
  const md = parseMarkdown(files["page.md"].toString("utf8"));
  assert.deepEqual(md.meta, structured.meta);
  assert.equal(md.blocks.length, structured.blocks.length);
  md.blocks.forEach((block, i) => {
    for (const key of ["kind", "label", "cont", "open", "samerow", "lines"]) {
      assert.deepEqual(block[key], structured.blocks[i][key], `${page.physical} block${i} ${key}`);
    }
  });
  const figures = structured.blocks.filter((b) => b.kind === "fig");
  for (const crop of page.crops) bind(crop);
  const audit = JSON.parse(files["audit.json"]);
  const receipt = readReceipt(page.receipt);
  const h3 = structured.blocks.find((b) => b.kind === "h3");
  const triangleStrings = [];
  function findTriangle(value, location = "") {
    if (typeof value === "string" && value.includes("\u25bc")) {
      triangleStrings.push({ path: location, count: value.split("\u25bc").length - 1 });
    } else if (value && typeof value === "object") {
      for (const [key, child] of Object.entries(value)) {
        findTriangle(child, Array.isArray(value) ? `${location}[${key}]` : location ? `${location}.${key}` : key);
      }
    }
  }
  findTriangle(structured);
  const triangle = structured.blocks.flatMap((block, i) => block.lines.flatMap((line, j) => {
    const result = [];
    for (let k = 0; k < line.length; k++) if (line.codePointAt(k) === 0x25bc) result.push({ block: i, line: j, utf16Offset: k });
    return result;
  }));
  candidates.push({
    physical: page.physical, mdStructuredEquality: true, figures,
    heading: h3?.lines ?? null, triangleOccurrencesInBody: triangle,
    triangleStrings,
    audit, receipt,
  });
}

bind(affected.priorReview);
const before = JSON.parse(bind(affected.before));
const after = JSON.parse(bind(affected.after));
const differences = [];
function diff(a, b, at = "") {
  if (Object.is(a, b)) return;
  if (a && b && typeof a === "object" && typeof b === "object") {
    assert.equal(Array.isArray(a), Array.isArray(b), at);
    for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
      const next = Array.isArray(a) ? `${at}[${key}]` : at ? `${at}.${key}` : key;
      if (!(key in a) || !(key in b)) differences.push({ path: next, before: a[key], after: b[key] });
      else diff(a[key], b[key], next);
    }
  } else differences.push({ path: at, before: a, after: b });
}
diff(before, after);
assert.deepEqual(differences.map((d) => d.path), ["blocks[9].lines[0]", "blocks[9].lines[1]"]);
let replacements = 0;
for (const d of differences) {
  replacements += d.before.split("Z_o").length - 1;
  assert.equal(d.after, d.before.replaceAll("Z_o", "Z_{\\text{UNKNOWN}}"));
}
assert.equal(replacements, 3);
assert.deepEqual(before.meta.figures, after.meta.figures);
assert.deepEqual(before.meta.render, after.meta.render);
const recovery = readReceipt(affected.receipt);
const failure = readReceipt(affected.firstFailure);
assert.equal(recovery.exitCode, 0);
assert.equal(failure.exitCode, 1);
assert.deepEqual(recovery.argv, failure.argv);
assert.match(failure.streams.stderr, /PermissionError/);
assert.match(recovery.streams.stdout, /25 行（印刷 25）/);
assert.equal(recovery.streams.stderr, "");

const sourceCrop = path.join(repo, ".intentfold/tickets/STEMROBIN-188/tmp/source6g151152-author-first-07/work/6-8g/pages/0151/figures/fig-203.png");
const repairWork = recovery.argv[recovery.argv.indexOf("--work") + 1];
const repairCrop = path.join(repairWork, "6-8g/pages/0151/figures/fig-203.png");
const sourceCropHash = sha(fs.readFileSync(sourceCrop));
const repairCropHash = sha(fs.readFileSync(repairCrop));
assert.equal(sourceCropHash, "84e321b8b2c8012eedf7497bc8afdf80d42aedf456b9780b5aa0f0f907ac54dc");
assert.equal(repairCropHash, sourceCropHash);
for (const p of [sourceCrop, repairCrop]) bind({ path: p, sha256: sourceCropHash });

const firstPath = path.join(own, "FIRST.md");
assert.equal(fs.statSync(firstPath).mode & 0o777, 0o444);
const firstHash = sha(fs.readFileSync(firstPath));
assert.equal(firstHash, "63f3e9efd849a79826d896ad1a7fe88db887a07bedeb96c5545f56cb1d4dcd65");
console.log(JSON.stringify({
  status: "PASS_READ_ONLY_BINDING_AND_STRUCTURED_CHECKS",
  first: { path: firstPath, sha256: firstHash, mode: "0444" },
  bindings,
  candidates,
  affected151: {
    differences, changedLeaves: differences.length, replacements,
    onlyThreeUnknownEncodings: true, otherFieldsEqual: true,
    figureBox: after.meta.figures, originalAndDerivedCropBytesEqual: true,
    originalCrop: sourceCrop, repairCrop, cropSha256: sourceCropHash,
    recovery, failure,
  },
}, null, 2));
