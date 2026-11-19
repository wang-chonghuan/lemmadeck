const fs = require("node:fs");
const path = require("node:path");
const cp = require("node:child_process");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");

const cwd = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
assert.equal(process.cwd(), cwd);
const base = path.join(cwd, ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13");
const stage = path.join(base, "n45-source-stage");
const root = path.join(stage, "artifacts");
const source = path.join(cwd, "ssot-resources/soviet10year-textbooks/artifacts/7a");
const id = "alg7-c4-s3-n45";
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const hash = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const ref = file => ({ path: path.resolve(file), sha256: hash(file) });
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
};
const textOf = blocks => {
  let result = "";
  for (const line of blocks.flatMap(block => block.lines)) {
    const next = line.replaceAll("\u21b5", "");
    if ((result.endsWith("$") && next.startsWith("$"))
        || (result.endsWith(")") && /^[A-Za-z\u0400-\u04ff]\)/u.test(next))) result += " ";
    result += next;
  }
  return result.trim();
};

assert(!fs.existsSync(`${stage}/assembly-FIRST.receipt.json`), "Do not rerun a completed assembly.");
const reviewPath = path.join(base, "source267-274-review/bindings.json");
const review = read(reviewPath);
const inputs = [];
const pageDocs = new Map();
for (let page = 266; page <= 273; page++) {
  const directory = String(page).padStart(4, "0");
  const doc = read(`${source}/pages/${directory}/page.json`);
  assert.equal(doc.meta.page, page);
  assert.equal(doc.meta.printed_page, page - 6);
  assert.deepEqual(read(`${source}/pages/${directory}/audit.json`).errors, []);
  pageDocs.set(page, doc);
  for (const name of ["page.md", "page.json", "audit.json"]) {
    const from = `${source}/pages/${directory}/${name}`;
    const to = `${root}/7a/pages/${directory}/${name}`;
    if (page >= 267) {
      const reviewed = review.pages.find(item => item.page === page)
        .files.find(item => item.path === from);
      assert(reviewed, `Missing source-review binding: ${from}`);
      assert.equal(hash(from), reviewed.sha256, `Reviewed source changed: ${from}`);
    } else {
      const approved = `${base}/source259-266-author/first-finalize/0266/${name}`;
      assert.equal(hash(from), hash(approved), `Approved page 266 changed: ${name}`);
    }
    fs.mkdirSync(path.dirname(to), { recursive: true });
    if (!fs.existsSync(to)) {
      fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
      fs.chmodSync(to, 0o444);
    }
    assert.equal(hash(from), hash(to));
    inputs.push({ source: ref(from), isolated: ref(to) });
  }
}
const finalizers = [
  { page: 266, file: `${base}/source259-266-author/first-finalize/0266/receipt.json` },
  ...review.producerCalls.filter(item => item.exit === 0 && item.page < 274)
    .map(item => ({ page: item.page, file: item.receipt.path })),
];
assert.deepEqual(finalizers.map(item => item.page).sort((a, b) => a - b),
  Array.from({ length: 8 }, (_, index) => 266 + index));
for (const item of finalizers) {
  const receipt = read(item.file);
  assert.equal(receipt.exit ?? receipt.exit_code, 0);
}
const toc = "ssot-resources/soviet10year-textbooks/toc/7a/zh.json";
save(`${stage}/inputs.json`, {
  schema: "stemrobin182/n45-isolated-inputs@1",
  cwd, selected: [id], pages: [266, 267, 268, 269, 270, 271, 272, 273],
  inputs, toc: ref(toc),
  sourceReviews: [
    ref(`${base}/source267-274-review/report.md`),
    ref(`${base}/source259-266-review/report.md`),
    ref(reviewPath),
  ],
  existingSuccessfulFinalizers: finalizers.map(item => ({ page: item.page, ...ref(item.file) })),
  tools: ["p2c.py", "assemble.py", "edition.py", "blocks.py", "htmlfrag.js", "prose_flow.mjs"]
    .map(name => ref(`.claude/skills/ld-s10y-lesson/tools/${name}`)),
  sourceImagesOpened: 0, finalizedPagesRerun: 0, sourceReviewsRerun: 0,
  boundary: { start: "p0266#5", endExclusive: "p0273#11", physical274Excluded: true },
  durableWrites: false,
});

const command = ".claude/skills/ld-s10y-lesson/.venv/bin/python";
const args = [
  ".claude/skills/ld-s10y-lesson/tools/p2c.py", "assemble", "--book", "7a",
  "--root", root, "--work", ".tmp/ld-s10y-lesson", "--toc", toc,
];
const log = `${stage}/assembly-FIRST`;
const start = { cwd, command: [command, ...args], startedAt: new Date().toISOString(),
  environmentOverride: { PYTHONDONTWRITEBYTECODE: "1" } };
save(`${log}.start.json`, start);
const stdout = fs.openSync(`${log}.stdout`, "wx");
const stderr = fs.openSync(`${log}.stderr`, "wx");
const result = cp.spawnSync(command, args, {
  cwd, env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
  stdio: ["ignore", stdout, stderr],
});
fs.closeSync(stdout);
fs.closeSync(stderr);
save(`${log}.receipt.json`, { ...start, finishedAt: new Date().toISOString(),
  exit: result.status, signal: result.signal, error: result.error?.message ?? null,
  streams: [ref(`${log}.stdout`), ref(`${log}.stderr`)] });
console.log(fs.readFileSync(`${log}.stdout`, "utf8"));
console.error(fs.readFileSync(`${log}.stderr`, "utf8"));
if (result.status !== 0) process.exit(result.status ?? 1);

const folder = `${root}/7a/lessons/${id}`;
const lesson = read(`${folder}/lesson.json`);
const exercisesDoc = read(`${folder}/exercises.json`);
const exercises = exercisesDoc.exercises;
assert.equal(lesson.id, id);
assert.equal(lesson.number, "45");
assert.equal(lesson.start_page, 266);
assert.equal(lesson.start_printed, 260);
assert.equal(lesson.exercise_count, 19);
assert.equal(exercisesDoc.count, 19);
assert.deepEqual(exercises.map(item => Number(item.number)),
  Array.from({ length: 19 }, (_, index) => 873 + index));
assert.deepEqual(lesson.figures.map(item => item.id), ["fig-59", "fig-60", "fig-61"]);
assert.deepEqual(lesson.prose.filter(item => item.kind === "fig").map(item => item.id), ["fig-59"]);
assert.deepEqual(exercises.filter(item => item.figure_refs.length)
  .map(item => ({ number: item.number, refs: item.figure_refs, displays: item.figures.map(fig => fig.id) })),
  [{ number: "889", refs: ["fig-60"], displays: ["fig-60"] },
    { number: "891", refs: ["fig-61"], displays: ["fig-61"] }]);

const sourceBlocks = new Map();
for (const [page, doc] of pageDocs) {
  doc.blocks.forEach((block, index) => sourceBlocks.set(`p${String(page).padStart(4, "0")}#${index + 1}`, block));
}
const expectedRefs = [...sourceBlocks].filter(([blockRef, block]) => {
  const [page, blockIndex] = blockRef.slice(1).split("#").map(Number);
  return (page > 266 || blockIndex > 5) && (page < 273 || blockIndex < 11)
    && !["foot", "exhead", "h3"].includes(block.kind);
}).map(([blockRef]) => blockRef);
const actualRefs = [
  ...lesson.prose.flatMap(item => item.source_refs),
  ...exercises.flatMap(item => item.pages),
  "p0273#4", "p0273#6", "p0273#9", "p0273#10",
];
assert.deepEqual([...actualRefs].sort(), [...expectedRefs].sort());
for (const item of [...lesson.prose, ...exercises]) {
  const refs = item.source_refs ?? item.pages;
  const blocks = refs.map(blockRef => sourceBlocks.get(blockRef));
  assert(blocks.every(Boolean));
  assert.equal(item.text, textOf(blocks), `Source text loss at ${refs.join(",")}`);
  assert.equal(blocks.at(-1).open, false, `Unclosed n45 object: ${refs.join(",")}`);
}
const book = read(`${root}/7a/book.json`);
assert.deepEqual(book.audit.errors, []);
assert(!fs.existsSync(`${root}/7a/pages/0274`));
const rawFigures = lesson.figures.map(item => ({
  ...item, sourceRef: item.id === "fig-59" ? "p0267#5"
    : item.id === "fig-60" ? "p0273#4" : "p0273#9",
  assets: [".png", ".svg"].filter(suffix => fs.existsSync(`${root}/7a/figures/${item.id}${suffix}`))
    .map(suffix => ({ path: `${root}/7a/figures/${item.id}${suffix}` })),
}));
save(`${stage}/candidate-binding.json`, {
  schema: "stemrobin182/n45-raw-candidate@1", selected: [id],
  complete: true, originalCount: 19, originals: exercises.map(item => item.number),
  proseBlocks: lesson.prose.length, sourceRefs: expectedRefs, allSourceProseAndExercisesExact: true,
  figures: rawFigures, figureOwnershipExact: true, allN45ObjectsClosed: true,
  preceding869872Excluded: true, n46PartialExcludedFromSelection: true,
  partialN46RetainedOnlyAsToolOutput: book.lessons.filter(item => item.id === "alg7-c4-s3-n46"),
  physical274Excluded: true, sourcePageTripletsUnchanged: true,
  outputs: ["lesson.json", "lesson.md", "exercises.json"].map(name => ref(`${folder}/${name}`)),
  assemblyReceipt: ref(`${log}.receipt.json`), durablePromotion: false, modernApproval: false,
});
for (const name of ["lesson.json", "lesson.md", "exercises.json"]) fs.chmodSync(`${folder}/${name}`, 0o444);
for (const item of inputs) assert.equal(hash(item.source.path), item.source.sha256);
console.log(JSON.stringify({ selected: [id], complete: true, proseBlocks: lesson.prose.length,
  originals: exercises.length, figures: rawFigures.map(item => item.id), sourceImagesOpened: 0 }));
