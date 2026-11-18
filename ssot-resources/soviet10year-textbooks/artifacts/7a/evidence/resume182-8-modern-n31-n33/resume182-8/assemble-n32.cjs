const fs = require("node:fs");
const path = require("node:path");
const cp = require("node:child_process");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
const cwd = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
assert.equal(process.cwd(), cwd);
const book = "ssot-resources/soviet10year-textbooks/artifacts/7a";
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-8";
const n33 = process.argv.includes("--n33");
const n31 = process.argv.includes("--n31");
assert(!(n31 && n33));
const stage = `${base}/${n31 ? "n31" : n33 ? "n33" : "n32"}-source-stage`;
const root = `${stage}/artifacts`;
const ids = [n31 ? "alg7-c4-s1-n31" : n33 ? "alg7-c4-s1-n33" : "alg7-c4-s1-n32"];
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
const sourceReview = `${base}/${n31 ? "counter205-206/review" : n33 ? "source210-216-affected-review" : "source210-216-review"}.md`;
assert.equal(hash(sourceReview), process.argv[2]);
assert(!fs.existsSync(stage));
for (const id of ids) assert(!fs.existsSync(`${book}/lessons/${id}`));
const previous = read(`${book}/book.json`);
assert(ids.every((id) => !previous.lessons.some((item) => item.id === id)));
const inputs = [];
for (let page = n31 ? 205 : n33 ? 211 : 207; page <= (n31 ? 207 : n33 ? 214 : 211); page++) {
  const directory = String(page).padStart(4, "0");
  assert.deepEqual(read(`${book}/pages/${directory}/audit.json`).errors, []);
  for (const name of ["page.md", "page.json", "audit.json"]) {
    const file = `${book}/pages/${directory}/${name}`;
    inputs.push(ref(file));
    copy(file, `${root}/7a/pages/${directory}/${name}`);
  }
}
const crops = n31 || n33 ? [] : [
  [208, "fig-44"], [209, "fig-45"],
  [209, "tbl-p0209-02"], [210, "tbl-p0210-01"],
];
for (const [page, figure] of crops) {
  copy(`.tmp/ld-s10y-lesson/7a/pages/${String(page).padStart(4, "0")}/figures/${figure}.png`,
    `${stage}/work/7a/pages/${String(page).padStart(4, "0")}/figures/${figure}.png`);
}
save(`${stage}/inputs.json`, {
  inputs, sourceReview: ref(sourceReview),
  priorSourceReview: ref(`${book}/evidence/resume182-7-source203-209/source203-209-review.md`),
  selected: ids, preTargetBoundaryExcluded: true, postTargetBoundaryExcluded: true,
  source205_206NotLoaded: !n31, sourceImagesReopened: 0,
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
  Number(e.source_number)), n31 ? [730, 731, 732, 733, 734, 735, 736] : n33 ? [745] : [737, 738, 739, 740, 741, 742, 743, 744]);
if (n31 || n33) assert.deepEqual(read(`${root}/7a/lessons/${ids[0]}/lesson.json`).figures, []);
copy(`${book}/book.json`, `${stage}/original-book.json`);
for (const id of ids) {
  for (const name of ["lesson.md", "lesson.json", "exercises.json"]) {
    copy(`${root}/7a/lessons/${id}/${name}`, `${book}/lessons/${id}/${name}`);
  }
}
for (const [, figure] of crops) copy(`${root}/7a/figures/${figure}.png`, `${book}/figures/${figure}.png`);
const next = structuredClone(previous);
next.lessons.push(...selected);
next.pages += n31 ? 2 : n33 ? 3 : 5;
next.audit.exercise_count += n31 ? 7 : n33 ? 1 : 8;
next.audit.exercise_range[1] = Math.max(next.audit.exercise_range[1], n31 ? 736 : n33 ? 745 : 744);
next.audit.figure_numbers = [...new Set([...next.audit.figure_numbers, ...(n31 || n33 ? [] : [44, 45])])].sort((a, b) => a - b);
next.audit.warnings.push(n31
  ? "Appended only complete RAW n31 from205-207 after counter-only recovery and local no-confirmed-erratum adjudication. Pre-n31728/729 and post-n31partial n32 are boundary material only. Modern text/answers/choices/display require their own stages."
  : n33
  ? "Appended only complete RAW n33 from211-214 with three registered relation-sign errata. Pre-n33 exercises739-744 and post-n33 partial n34 are boundary material only, not promoted. Modern text/answers/choices/display require their own stages."
  : "Appended only complete RAW n32 from207-211. Pre-n32 exercises733-736 and post-n32 partial n33 are boundary material only, not promoted. Count/scientific HOLDs205/206 remain; modern text/figures/answers/choices/display require their own stages.");
assert.deepEqual(next.lessons.slice(0, previous.lessons.length), previous.lessons);
fs.writeFileSync(`${book}/book.json`, `${JSON.stringify(next, null, 2)}\n`);
const preparations = ids.map((id) => run(`FIRST-modern-prepare-${id}`, [
  "adapt-prepare", "--book", "7a", "--edition", "modern-us-neutral", "--lesson", id,
]));
save(`${stage}/source-stage-receipt.json`, {
  ticket: "STEMROBIN-182", book: "7a", selected, assembly, preparations,
  inputs: ref(`${stage}/inputs.json`), source205_206NotLoaded: !n31,
  neighboringTargetsNotPromoted: true, oldLessonIndexRowsUnchanged: true,
  modernStagesApproved: false, selectedPackagesOrFullCourseCredit: false,
  outputs: ids.flatMap((id) => ["lesson.md", "lesson.json", "exercises.json"]
    .map((name) => ref(`${book}/lessons/${id}/${name}`))),
});
console.log(JSON.stringify({ selected, assemblyExit: assembly.exit,
  preparationExits: preparations.map((item) => item.exit), fullCourseCredit: false }));
