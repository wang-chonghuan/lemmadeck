import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { isDeepStrictEqual } from "node:util";

const R = "/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck";
const W = path.join(R, ".tmp/stemrobin-184-six/source10c5255-work");
if (process.cwd() !== R) throw new Error("cwd mismatch");

const reads = new Map();
const checks = [];
const sha = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
function readText(filename) {
  if (reads.has(filename)) throw new Error("Repeated text read: " + filename);
  const bytes = fs.readFileSync(filename);
  const result = { text: bytes.toString("utf8"), bytes: bytes.length, sha256: sha(bytes) };
  reads.set(filename, result);
  return result;
}
function check(name, ok) {
  checks.push({ name, ok: Boolean(ok) });
}
function parseMD(text) {
  if (!text.startsWith("---\n")) throw new Error("Unexpected frontmatter opening");
  const end = text.indexOf("\n---\n", 4);
  if (end < 0) throw new Error("Missing frontmatter closing");
  return { meta: JSON.parse(text.slice(4, end)), body: text.slice(end + 5) };
}
function readPage(directory, prefix = "") {
  const md = readText(path.join(directory, prefix + "page.md"));
  const json = readText(path.join(directory, prefix + "page.json"));
  const audit = readText(path.join(directory, prefix + "audit.json"));
  return {
    md, json, audit,
    parsedMD: parseMD(md.text),
    parsedJSON: JSON.parse(json.text),
    parsedAudit: JSON.parse(audit.text),
  };
}

for (const page of [71, 73]) {
  const number = String(page).padStart(4, "0");
  const oldDirectory = path.join(W, "receipts", `nov22-finalize-p${number}-01`);
  const newDirectory = path.join(W, "receipts", `nov22-affected-finalize-p${number}-02`);
  const old = readPage(oldDirectory, "output-");
  const current = readPage(path.join(W, "artifacts/10c/pages", number));
  const output = readPage(newDirectory, "output-");
  const input = readText(path.join(newDirectory, "input-page.md"));
  const executionFile = readText(path.join(newDirectory, "execution.json"));
  const stdout = readText(path.join(newDirectory, "stdout.txt"));
  const stderr = readText(path.join(newDirectory, "stderr.txt"));
  const execution = JSON.parse(executionFile.text);
  const parsedInput = parseMD(input.text);
  const before = old.parsedJSON;
  const after = current.parsedJSON;
  const expected = structuredClone(before);

  const addedNotes = after.meta.notes.slice(before.meta.notes.length);
  check(`${page}: exactly one appended note; original notes unchanged`,
    after.meta.notes.length === before.meta.notes.length + 1
    && isDeepStrictEqual(after.meta.notes.slice(0, before.meta.notes.length), before.meta.notes));
  expected.meta.notes = after.meta.notes;
  let expectedBody = old.parsedMD.body;
  let delta;

  if (page === 71) {
    const index = before.blocks.findLastIndex((block) => block.kind === "p");
    check("71: final paragraph exists and had no owner array",
      index >= 0 && !Object.hasOwn(before.blocks[index], "owner_exercises"));
    const owners = ["211", "212", "213", "214"];
    expected.blocks[index].owner_exercises = owners;
    const oldHeader = "<!-- p -->";
    const headerIndex = expectedBody.lastIndexOf(oldHeader);
    check("71: original last ordinary p header found", headerIndex >= 0);
    const newHeader = `<!-- p owners-ex ${JSON.stringify(owners)} -->`;
    expectedBody = expectedBody.slice(0, headerIndex)
      + newHeader + expectedBody.slice(headerIndex + oldHeader.length);
    delta = {
      block: index + 1,
      previousHeader: oldHeader,
      currentHeader: newHeader,
      owner_exercises: after.blocks[index].owner_exercises,
      unchangedRequestLines: before.blocks[index].lines,
      flags: {
        open: after.blocks[index].open,
        cont: after.blocks[index].cont,
        samerow: after.blocks[index].samerow,
      },
    };
  } else {
    const index = before.blocks.findIndex((block) =>
      block.kind === "p" && block.lines.length === 1
      && block.lines[0].endsWith("(1)成立"));
    check("73: exact original missing-period paragraph found", index >= 0);
    const oldLine = before.blocks[index].lines[0];
    const newLine = after.blocks[index].lines[0];
    check("73: only one terminal period added",
      newLine === oldLine + "." || newLine === oldLine + "\u3002");
    expected.blocks[index].lines[0] = newLine;
    check("73: original domain paragraph occurs once in MD",
      expectedBody.split(oldLine).length === 2);
    expectedBody = expectedBody.replace(oldLine, newLine);
    delta = { block: index + 1, previousLine: oldLine, currentLine: newLine };
    check("73: first output MD identity matches prior PhaseB",
      old.md.sha256 === "b6e86efa559164323fcf745dc85f26fa66528c9973041d596f5cb70e4ef1b47e");
    check("73: first output JSON identity matches prior PhaseB",
      old.json.sha256 === "c025c8b0274197c3d9d23a1fb2d9642fd7ca2663b6455a29439cb5f66f7ae124");
    check("73: first output audit identity matches prior PhaseB",
      old.audit.sha256 === "7f169cd29b6613ddc25483bf205477964d5e1536d0c746d741811722f6bb3719");
  }

  check(`${page}: all JSON metadata/blocks/flags/owners/lines unchanged except designated delta and note`,
    isDeepStrictEqual(expected, after));
  check(`${page}: MD body equals exact designated edit, including all other linebreaks and whitespace`,
    current.parsedMD.body === expectedBody);
  check(`${page}: MD frontmatter equals current JSON metadata`,
    isDeepStrictEqual(current.parsedMD.meta, after.meta));
  check(`${page}: original MD frontmatter equals original JSON metadata`,
    isDeepStrictEqual(old.parsedMD.meta, before.meta));
  check(`${page}: all audit fields unchanged`,
    isDeepStrictEqual(old.parsedAudit, current.parsedAudit));
  check(`${page}: affected input body exactly equals output/current body`,
    parsedInput.body === current.parsedMD.body);
  check(`${page}: affected input metadata exactly equals output/current metadata`,
    isDeepStrictEqual(parsedInput.meta, current.parsedMD.meta));
  for (const key of ["md", "json", "audit"]) {
    check(`${page}: new receipt output ${key} byte-identical to current`,
      output[key].sha256 === current[key].sha256);
  }

  const argv = execution.argv ?? [];
  const argument = (name) => argv[argv.indexOf(name) + 1];
  check(`${page}: affected execution cwd R and exitCode 0`,
    execution.cwd === R && execution.exitCode === 0);
  check(`${page}: explicit finalize/book/page/work/artifacts`,
    argv.includes("finalize") && argument("--book") === "10c"
    && argument("--page") === String(page) && argument("--work") === W
    && argument("--root") === path.join(W, "artifacts"));

  const claimedFiles = [
    execution.input_page,
    ...(execution.outputs ?? []),
    execution.streams?.stdout,
    execution.streams?.stderr,
  ];
  check(`${page}: receipt has exactly six input/output/stream claims`, claimedFiles.length === 6);
  for (const claim of claimedFiles) {
    const actual = claim && reads.get(claim.path);
    check(`${page}: recorded text-byte binding ${claim?.path ? path.basename(claim.path) : "missing"}`,
      actual && actual.sha256 === claim.sha256 && actual.bytes === claim.bytes);
  }
  const nativeRows = page === 71 ? 22 : 19;
  check(`${page}: native audit expected rows; no errors or exclusions`,
    current.parsedAudit.lines_printed === nativeRows
    && current.parsedAudit.lines_md === nativeRows
    && current.parsedAudit.errors.length === 0
    && current.parsedAudit.count_exclusions.length === 0);

  console.log(JSON.stringify({
    page, delta, addedNotes,
    currentAudit: current.parsedAudit,
    inputMetadataExact: isDeepStrictEqual(parsedInput.meta, current.parsedMD.meta),
    execution: { cwd: execution.cwd, exitCode: execution.exitCode, argv },
    stdout: stdout.text, stderr: stderr.text,
    pageChecks: checks.filter((item) => item.name.startsWith(String(page) + ":")),
  }, null, 2));
}

console.log("TEXT BINDINGS (no source/image bytes or trace files read)");
for (const [filename, result] of reads) {
  console.log(`${result.sha256}  ${filename}`);
}
const failed = checks.filter((item) => !item.ok);
console.log(JSON.stringify({
  readFiles: reads.size, checkCount: checks.length,
  failedChecks: failed,
  images: 0, imageBytes: 0, imageHashes: 0, imageHeaders: 0,
  rois: 0, decodes: 0, producerCalls: 0, paidJobs: 0,
  explicitReviewCodecCycles: 0, upstreamCodecCycles: "UNKNOWN", fees: "UNKNOWN",
}, null, 2));
if (failed.length) process.exitCode = 1;
