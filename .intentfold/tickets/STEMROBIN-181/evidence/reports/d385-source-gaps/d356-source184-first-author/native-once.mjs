import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const own = path.dirname(fileURLToPath(import.meta.url));
const repo = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const expected = path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d356-source184-first-author");
if (own !== expected) throw new Error("Wrong batch root.");
const sha = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const binding = (file) => ({ path: file, sha256: sha(file), bytes: fs.statSync(file).size });
const command = process.argv[2];
if (!["finalize", "vectorize"].includes(command)) throw new Error("Unsupported command.");
const receiptFile = path.join(own, `${command}-184.receipt.json`);
if (fs.existsSync(receiptFile)) throw new Error("Native command already ran.");
const inventoryFile = path.join(own, "source-inventory.json");
if (sha(inventoryFile) !== "02cb342d83ef7a553e6b84ad313c7beaed4c7e39010474e6606afb149dc8897e") {
  throw new Error("Frozen source inventory changed.");
}
const pageMd = path.join(own, "source/10p/pages/0184/page.md");
if (command === "finalize") {
  fs.copyFileSync(pageMd, path.join(own, "author-input-page.md"), fs.constants.COPYFILE_EXCL);
}
if (command === "vectorize") {
  const prior = JSON.parse(fs.readFileSync(path.join(own, "finalize-184.receipt.json"), "utf8"));
  if (prior.exit_code !== 0) throw new Error("Native finalize failed; no vectorize.");
  const audit = JSON.parse(fs.readFileSync(path.join(own, "source/10p/pages/0184/audit.json"), "utf8"));
  if (!audit.figures.length) throw new Error("No figures; vectorize not needed.");
}
const executable = path.join(repo, ".claude/skills/ld-s10y-lesson/.venv/bin/python");
const tools = path.join(repo, ".claude/skills/ld-s10y-lesson/tools");
const toolFiles = [
  "p2c.py", "layout.py", "blocks.py", "normalize.py", "mathcheck.py",
  "katex_check.js", "vectorize.py", "svg_raster.js",
].map((name) => path.join(tools, name));
toolFiles.push(path.join(repo, ".claude/skills/ld-s10y-lesson/profiles/soviet-cn.json"));
const toolsBefore = toolFiles.map(binding);
const args = [
  path.join(tools, "p2c.py"), command,
  "--book", "10p", "--page", "184",
  "--root", path.join(own, "source"),
  "--work", path.join(own, "work"),
];
const environment = { PYTHONDONTWRITEBYTECODE: "1", TMPDIR: path.join(own, "native-tmp") };
const started = new Date().toISOString();
const inputPage = binding(pageMd);
const result = spawnSync(executable, args, {
  cwd: repo, env: { ...process.env, ...environment },
  encoding: "utf8", maxBuffer: 8 * 1024 * 1024,
});
const stdout = path.join(own, `${command}-184.stdout.txt`);
const stderr = path.join(own, `${command}-184.stderr.txt`);
fs.writeFileSync(stdout, result.stdout ?? "", { flag: "wx" });
fs.writeFileSync(stderr, result.stderr ?? "", { flag: "wx" });
const toolsAfter = toolFiles.map(binding);
const exactInvocation = [
  "env", ...Object.entries(environment).map(([key, value]) => `${key}=${value}`),
  executable, ...args,
].join(" ");
fs.writeFileSync(receiptFile, JSON.stringify({
  schema: "source-first-author/native-command-receipt@1",
  ticket: "STEMROBIN-181", book: "10p", page: 184,
  command, invocation_count: 1, cwd: repo, executable, argv: args,
  environment_overrides: environment, exact_invocation: exactInvocation,
  started_at: started, finished_at: new Date().toISOString(),
  exit_code: result.status, signal: result.signal, launch_error: result.error?.message ?? null,
  input_page_md: inputPage, output_page_md: binding(pageMd),
  frozen_source_inventory: binding(inventoryFile),
  tools_before: toolsBefore, tools_after: toolsAfter,
  tool_hashes_stable_during_command: toolsBefore.every((tool, i) => tool.sha256 === toolsAfter[i].sha256),
  stdout: binding(stdout), stderr: binding(stderr),
  source_pass_claimed: false, independent_raw_pass_claimed: false,
}, null, 2) + "\n", { flag: "wx" });
process.stdout.write(result.stdout ?? "");
process.stderr.write(result.stderr ?? "");
console.log(`Receipt: ${receiptFile}\nSHA256: ${sha(receiptFile)}`);
process.exitCode = result.status ?? 1;
