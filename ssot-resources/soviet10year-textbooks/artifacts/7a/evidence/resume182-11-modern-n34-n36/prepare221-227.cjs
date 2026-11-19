const fs = require("node:fs");
const cp = require("node:child_process");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
const cwd = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
assert.equal(process.cwd(), cwd);
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-11";
const python = ".claude/skills/ld-s10y-lesson/.venv/bin/python";
const tool = ".claude/skills/ld-s10y-lesson/tools/production.py";
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const save = (file, data) => {
  const fd = fs.openSync(file, "wx");
  fs.writeFileSync(fd, `${JSON.stringify(data, null, 2)}\n`);
  fs.fsyncSync(fd);
  fs.closeSync(fd);
};
const receipts = [];
for (const [first, last] of [[221, 224], [225, 227]]) {
  const stem = `${base}/prepare${first}-${last}-FIRST`;
  const command = [python, tool, "prepare-range", "--repo", cwd, "--book", "7a",
    "--first", String(first), "--last", String(last), "--work", ".tmp/ld-s10y-lesson"];
  const startedAt = new Date().toISOString();
  save(`${stem}.start.json`, { cwd, command, startedAt });
  const output = fs.openSync(`${stem}.stdout`, "wx");
  const errors = fs.openSync(`${stem}.stderr`, "wx");
  const result = cp.spawnSync(command[0], command.slice(1), { cwd, stdio: ["ignore", output, errors] });
  fs.fsyncSync(output);
  fs.fsyncSync(errors);
  fs.closeSync(output);
  fs.closeSync(errors);
  const finishedAt = new Date().toISOString();
  const parseCommand = [python, tool, "read-json", "--input", `${stem}.stdout`];
  const parsed = cp.spawnSync(parseCommand[0], parseCommand.slice(1), { cwd, encoding: "utf8" });
  const receipt = {
    cwd, book: "7a", command, startedAt, finishedAt, invocations: 1,
    exit: result.status, signal: result.signal, error: result.error?.message ?? null,
    stdout: { path: `${stem}.stdout`, sha256: hash(`${stem}.stdout`) },
    stderr: { path: `${stem}.stderr`, sha256: hash(`${stem}.stderr`) },
    parse: { command: parseCommand, exit: parsed.status, stdout: parsed.stdout, stderr: parsed.stderr },
    machine: parsed.status === 0 ? JSON.parse(parsed.stdout) : null,
    contentApproval: false, imageReads: 0,
  };
  save(`${stem}.json`, receipt);
  receipts.push(receipt);
  assert.equal(result.status, 0, `Range ${first}-${last} failed; later range not started`);
  assert.equal(parsed.status, 0, parsed.stderr);
  assert(receipt.machine.docs.length === 1 && receipt.machine.docs[0].ok === true);
  assert.equal(receipt.machine.docs[0].pages.length, last - first + 1);
  assert(receipt.machine.docs[0].pages.every((page) =>
    page.status === "reused" || (page.status === "prepared" && page.returncode === 0)));
  console.log(JSON.stringify({ first, last, exit: result.status,
    pages: receipt.machine.docs[0].pages.map((page) => ({ page: page.page, status: page.status, exit: page.returncode ?? null })) }));
}
save(`${base}/prepare221-227-FIRST.json`, { ticket: "STEMROBIN-182", book: "7a", receipts });
