const fs = require("node:fs");
const path = require("node:path");
const cp = require("node:child_process");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
const cwd = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
assert.equal(process.cwd(), cwd);
const book = "ssot-resources/soviet10year-textbooks/artifacts/7a";
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-11";
const stage = `${base}/n34-source-stage`;
const root = `${stage}/artifacts`;
const ids = ["alg7-c4-s1-n34"];
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const ref = (file) => ({ path: file, sha256: hash(file) });
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
};
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  assert.equal(hash(from), hash(to));
};
assert(process.argv[2] && /^[a-f0-9]{64}$/.test(process.argv[2]));
const sourceReview = `${base}/n34-errata-binding.md`;
assert.equal(hash(sourceReview), process.argv[2]);
assert(!fs.existsSync(stage));
for (const id of ids) assert(!fs.existsSync(`${book}/lessons/${id}`));
const previous = read(`${book}/book.json`);
assert(ids.every((id) => !previous.lessons.some((item) => item.id === id)));
const inputs = [];
for (let page = 214; page <= 220; page++) {
  const directory = String(page).padStart(4, "0");
  assert.deepEqual(read(`${book}/pages/${directory}/audit.json`).errors, []);
  for (const name of ["page.md", "page.json", "audit.json"]) {
    const file = `${book}/pages/${directory}/${name}`;
    inputs.push(ref(file));
    copy(file, `${root}/7a/pages/${directory}/${name}`);
  }
}
const crops = [
  [215, "fig-46"], [215, "fig-47"], [216, "fig-48"], [216, "fig-49"],
  [217, "fig-50"], [218, "fig-51"], [219, "fig-52"], [219, "fig-53"],
  [220, "tbl-p0220-01"],
];
for (const [page, figure] of crops) {
  copy(`.tmp/ld-s10y-lesson/7a/pages/${String(page).padStart(4, "0")}/figures/${figure}.png`,
    `${stage}/work/7a/pages/${String(page).padStart(4, "0")}/figures/${figure}.png`);
}
save(`${stage}/inputs.json`, {
  inputs, sourceReview: ref(sourceReview),
  priorSourceReviews: [
    ref(`${book}/evidence/resume182-8-modern-n31-n33/resume182-8/source210-216-review.md`),
    ref(`${book}/evidence/resume182-8-modern-n31-n33/resume182-8/source210-216-affected-review.md`),
    ref(`${book}/evidence/resume182-8-modern-n31-n33/resume182-9/source217-220-review.md`),
  ],
  selected: ids, preTargetBoundaryExcluded: true, postTargetBoundaryExcluded: true,
  sourceImagesReopened: 0, boundaryTableNotSelected: "tbl-p0220-01",
});
const run = (label, args) => {
  const command = [".claude/skills/ld-s10y-lesson/.venv/bin/python",
    ".claude/skills/ld-s10y-lesson/tools/p2c.py", ...args];
  const start = { cwd, command, startedAt: new Date().toISOString() };
  save(`${stage}/${label}.start.json`, start);
  const out = fs.openSync(`${stage}/${label}.stdout`, "wx");
  const err = fs.openSync(`${stage}/${label}.stderr`, "wx");
  const result = cp.spawnSync(command[0], command.slice(1), { cwd, stdio: ["ignore", out, err] });
  fs.fsyncSync(out);
  fs.fsyncSync(err);
  fs.closeSync(out);
  fs.closeSync(err);
  const receipt = { ...start, finishedAt: new Date().toISOString(), exit: result.status,
    signal: result.signal, error: result.error?.message ?? null,
    streams: [ref(`${stage}/${label}.stdout`), ref(`${stage}/${label}.stderr`)] };
  save(`${stage}/${label}.json`, receipt);
  assert.equal(result.status, 0, `${label} failed; dependent stages stopped`);
  return receipt;
};
const assembly = run("FIRST-assembly", ["assemble", "--book", "7a", "--root", root,
  "--work", `${stage}/work`, "--toc", "ssot-resources/soviet10year-textbooks/toc/7a/zh.json"]);
const assembled = read(`${root}/7a/book.json`);
const selected = ids.map((id) => {
  const matches = assembled.lessons.filter((lesson) => lesson.id === id);
  assert.equal(matches.length, 1);
  return matches[0];
});
assert.deepEqual(read(`${root}/7a/lessons/${ids[0]}/exercises.json`).exercises.map((e) =>
  Number(e.source_number)), [746, 747, 748, 749, 750, 751, 752, 753]);
assert.deepEqual(read(`${root}/7a/lessons/${ids[0]}/lesson.json`).figures.map((f) => f.id).sort(),
  Array.from({ length: 8 }, (_, i) => `fig-${46 + i}`));
copy(`${book}/book.json`, `${stage}/original-book.json`);
for (const id of ids) {
  for (const name of ["lesson.md", "lesson.json", "exercises.json"]) {
    copy(`${root}/7a/lessons/${id}/${name}`, `${book}/lessons/${id}/${name}`);
  }
}
for (const [, figure] of crops.filter(([, id]) => id !== "tbl-p0220-01")) {
  copy(`${root}/7a/figures/${figure}.png`, `${book}/figures/${figure}.png`);
}
const next = structuredClone(previous);
next.lessons.push(...selected);
next.pages += 6;
next.audit.exercise_count += 8;
next.audit.exercise_range[1] = Math.max(next.audit.exercise_range[1], 753);
next.audit.figure_numbers = [...new Set([...next.audit.figure_numbers,
  ...Array.from({ length: 8 }, (_, i) => 46 + i)])].sort((a, b) => a - b);
next.audit.warnings.push("Appended only complete RAW n34 from214-220 through753 after two metadata-only confirmed erratum registrations. Source mathematics remains printed0/x; n33 tail and partial n35 including table220 are boundary material only. Modern text/figures/answers/choices/display require their own stages.");
assert.deepEqual(next.lessons.slice(0, previous.lessons.length), previous.lessons);
fs.writeFileSync(`${book}/book.json`, `${JSON.stringify(next, null, 2)}\n`);
const preparations = ids.map((id) => run(`FIRST-modern-prepare-${id}`, [
  "adapt-prepare", "--book", "7a", "--edition", "modern-us-neutral", "--lesson", id,
]));
save(`${stage}/source-stage-receipt.json`, {
  ticket: "STEMROBIN-182", book: "7a", selected, assembly, preparations,
  inputs: ref(`${stage}/inputs.json`), confirmedErrata: ["p0215-math-1", "p0219-math-1"],
  neighboringTargetsNotPromoted: true, oldLessonIndexRowsUnchanged: true,
  modernStagesApproved: false, selectedPackagesOrFullCourseCredit: false,
  outputs: ids.flatMap((id) => ["lesson.md", "lesson.json", "exercises.json"]
    .map((name) => ref(`${book}/lessons/${id}/${name}`))),
});
console.log(JSON.stringify({ selected, assemblyExit: assembly.exit,
  preparationExits: preparations.map((item) => item.exit), fullCourseCredit: false }));
