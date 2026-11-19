const fs = require("node:fs");
const path = require("node:path");
const cp = require("node:child_process");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");

const cwd = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
assert.equal(process.cwd(), cwd);
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-12";
const report = `${base}/n37-modern-author`;
const lessonId = "alg7-c4-s2-n37";
const work = `${base}/n37-modern-work/adapt/7a/modern-us-neutral/lessons/${lessonId}`;
const book = `${base}/n37-source-stage-affected/artifacts/7a`;
const tools = ".claude/skills/ld-s10y-lesson/tools";
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const hashBytes = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const fileRecord = (file) => ({
  path: path.resolve(file),
  bytes: fs.statSync(file).size,
  sha256: hashBytes(fs.readFileSync(file)),
});
const save = (file, value) =>
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });

assert.equal(fs.existsSync(`${base}/stages/n37-modern-finalize-FIRST.start.json`), false);
assert.equal(read(`${base}/stages/n37-modern-prepare-FIRST.receipt.json`).exit, 0);
const snapshot = `${report}/FIRST-template`;
fs.mkdirSync(snapshot);
const templates = ["lesson.template.json", "exercises.template.json", "figures.template.json"];
const templateRecords = templates.map((name) => {
  const source = `${work}/${name}`;
  const destination = `${snapshot}/${name}`;
  fs.copyFileSync(source, destination, fs.constants.COPYFILE_EXCL);
  assert.equal(hashBytes(fs.readFileSync(source)), hashBytes(fs.readFileSync(destination)));
  return { working: fileRecord(source), snapshot: fileRecord(destination) };
});

const lesson = read(`${work}/lesson.template.json`);
const exercises = read(`${work}/exercises.template.json`);
const refs = [
  ...lesson.source.data.prose.flatMap((block) => block.source_refs ?? []),
  ...exercises.source.data.exercises.flatMap((item) => item.pages ?? []),
];
const pages = [...new Set(refs.map((ref) => ref.split("#")[0].slice(1)))].sort();
const sourceFiles = [
  `${book}/book.json`,
  ...["lesson.json", "lesson.md", "exercises.json"].map((name) => `${book}/lessons/${lessonId}/${name}`),
  ...pages.flatMap((page) =>
    ["page.json", "page.md", "audit.json"]
      .map((name) => `${book}/pages/${page}/${name}`)
      .filter((file) => fs.existsSync(file))),
];

const normalizationCommand = [
  ".claude/skills/ld-s10y-lesson/.venv/bin/python",
  "-c",
  [
    "import json, pathlib, sys",
    `sys.path.insert(0, str(pathlib.Path("${tools}").resolve()))`,
    "import edition",
    "d = json.load(sys.stdin)",
    "edition.normalize_lesson_layout(d)",
    "print(json.dumps(d, ensure_ascii=False))",
  ].join("; "),
];
const flowCommand = ["node", `${tools}/prose_flow.mjs`, "--stdin"];
const startedAt = new Date().toISOString();
const normalization = cp.spawnSync(normalizationCommand[0], normalizationCommand.slice(1), {
  cwd,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
  input: fs.readFileSync(`${work}/lesson.template.json`),
  encoding: "utf8",
});
assert.equal(normalization.status, 0, normalization.stderr);
const flow = cp.spawnSync(flowCommand[0], flowCommand.slice(1), {
  cwd,
  input: normalization.stdout,
  encoding: "utf8",
});
for (const name of ["stdout", "stderr"]) {
  fs.writeFileSync(`${report}/prose-flow-FIRST.${name}`, flow[name] ?? "", { flag: "wx" });
}
const receipt = {
  cwd,
  normalizationCommand,
  normalizationExit: normalization.status,
  command: flowCommand,
  normalizedInputSha256: hashBytes(normalization.stdout),
  startedAt,
  finishedAt: new Date().toISOString(),
  exit: flow.status,
  signal: flow.signal,
  error: flow.error?.message ?? null,
  streams: ["stdout", "stderr"].map((name) => fileRecord(`${report}/prose-flow-FIRST.${name}`)),
};
save(`${report}/prose-flow-FIRST.receipt.json`, receipt);
assert.equal(flow.status, 0, flow.stderr);
const outline = JSON.parse(flow.stdout);
const manifest = {
  schema: "n37-offline-authorship-snapshot@1",
  cwd,
  ticket: "STEMROBIN-182",
  finish: "review",
  capturedAt: new Date().toISOString(),
  stageNotYetInvoked: "n37-modern-finalize-FIRST",
  promotion: false,
  independentTextMathReview: "pending-parent",
  affectedToolBindingReview: "pending",
  imageOpens: 0,
  templates: templateRecords,
  sourceFiles: sourceFiles.map(fileRecord),
  toolFiles: [
    ...["p2c.py", "edition.py", "htmlfrag.js", "prose_flow.mjs", "blocks.py", "assemble.py", "normalize.py",
      "mathcheck.py", "katex_check.js", "render_lesson.js"].map((name) => `${tools}/${name}`),
    ".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json",
    `${base}/run-stage.cjs`,
    __filename,
  ].map(fileRecord),
  prepareReceipt: fileRecord(`${base}/stages/n37-modern-prepare-FIRST.receipt.json`),
  proseFlowReceipt: fileRecord(`${report}/prose-flow-FIRST.receipt.json`),
  counts: {
    proseBlocks: lesson.prose.length,
    finalParagraphs: outline.paragraphs.length,
    sectionBreaks: outline.boundaries.length,
    exercises: exercises.exercises.length,
    figures: read(`${work}/figures.template.json`).figures.length,
    mathErrata: lesson.errata.length,
    numberingErrata: exercises.exercises.filter((item) => item.numbering_erratum).length,
  },
  resolvedBreaks: outline.resolvedBreaks,
};
save(`${report}/FIRST-template.manifest.json`, manifest);
console.log(JSON.stringify({
  manifest: fileRecord(`${report}/FIRST-template.manifest.json`),
  templates: templateRecords,
  counts: manifest.counts,
  resolvedBreaks: manifest.resolvedBreaks,
}, null, 2));
