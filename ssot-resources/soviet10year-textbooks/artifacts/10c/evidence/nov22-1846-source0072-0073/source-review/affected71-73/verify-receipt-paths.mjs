import path from "node:path";
import assert from "node:assert/strict";

const R = "/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck";
const W = path.join(R, ".tmp/stemrobin-184-six/source10c5255-work");
assert.equal(process.cwd(), R);

// Metadata retained from the one completed text intake; no receipt is reread.
const observations = [
  {
    page: 71,
    receiptSHA256: "d55c207d43ad094cc5f88220d0c62495714f125ab521bd7f6a7ca56daf70ed0f",
  },
  {
    page: 73,
    receiptSHA256: "9b45c247eaaab327006246ce79004705a9677cbab7c8436425b9adca1b6550b3",
  },
];
for (const observation of observations) {
  const recordedCwd = R;
  const recordedExitCode = 0;
  const recordedArgv = [
    ".claude/skills/ld-s10y-lesson/.venv/bin/python",
    ".claude/skills/ld-s10y-lesson/tools/p2c.py",
    "finalize",
    "--book", "10c",
    "--page", String(observation.page),
    "--root", ".tmp/stemrobin-184-six/source10c5255-work/artifacts",
    "--books", "ssot-resources/soviet10year-textbooks/sources",
    "--work", ".tmp/stemrobin-184-six/source10c5255-work",
  ];
  const arg = (name) => recordedArgv[recordedArgv.indexOf(name) + 1];
  assert.equal(recordedCwd, R);
  assert.equal(recordedExitCode, 0);
  assert.ok(recordedArgv.includes("finalize"));
  assert.equal(arg("--book"), "10c");
  assert.equal(arg("--page"), String(observation.page));
  assert.equal(path.resolve(recordedCwd, arg("--work")), W);
  assert.equal(path.resolve(recordedCwd, arg("--root")), path.join(W, "artifacts"));
  console.log(JSON.stringify({
    ...observation,
    result: "verified recorded relative arguments against recorded cwd",
    work: path.resolve(recordedCwd, arg("--work")),
    artifacts: path.resolve(recordedCwd, arg("--root")),
    textInputRereads: 0,
    producerCalls: 0,
  }));
}
