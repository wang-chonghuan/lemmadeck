import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const own = path.dirname(fileURLToPath(import.meta.url));
const repo = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
if (own !== path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d364-source185-first-author")) {
  throw new Error("Wrong batch root.");
}
const sha = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const binding = (file) => ({ path: file, sha256: sha(file), bytes: fs.statSync(file).size });
const command = process.argv[2];
if (!["finalize", "vectorize", "preview"].includes(command)) throw new Error("Unsupported command.");
const receiptFile = path.join(own, command === "preview"
  ? "first-svg-preview-185.receipt.json" : `${command}-185.receipt.json`);
if (fs.existsSync(receiptFile)) throw new Error("This first command already has a receipt.");
const inventoryFile = path.join(own, "source-inventory.json");
if (sha(inventoryFile) !== "652ddd495336905ea776eb5623aa9b8dbe76374f7d4fffc1bdccc00e74a71db6") {
  throw new Error("Frozen source inventory drifted.");
}
const pageMd = path.join(own, "source/10p/pages/0185/page.md");
const tools = path.join(repo, ".claude/skills/ld-s10y-lesson/tools");
const python = path.join(repo, ".claude/skills/ld-s10y-lesson/.venv/bin/python");
const toolFiles = [
  "p2c.py", "layout.py", "blocks.py", "normalize.py", "mathcheck.py",
  "katex_check.js", "vectorize.py", "svg_raster.js",
].map((name) => path.join(tools, name));
toolFiles.push(path.join(repo, ".claude/skills/ld-s10y-lesson/profiles/soviet-cn.json"));
const toolsBefore = toolFiles.map(binding);
if (command === "finalize") {
  fs.copyFileSync(pageMd, path.join(own, "author-input-page.md"), fs.constants.COPYFILE_EXCL);
} else {
  const previousFile = path.join(own, command === "preview"
    ? "vectorize-185.receipt.json" : "finalize-185.receipt.json");
  const previous = JSON.parse(fs.readFileSync(previousFile, "utf8"));
  if (previous.exit_code !== 0) throw new Error("Previous native step failed.");
}
const environment = { PYTHONDONTWRITEBYTECODE: "1", TMPDIR: path.join(own, "native-tmp") };
const tasks = command === "preview"
  ? ["fig-145", "fig-146", "fig-147"].map((id) => {
      const input = path.join(own, `work/10p/pages/0185/figures/${id}.svg`);
      const output = path.join(own, `first-svg-preview/${id}.png`);
      if (fs.existsSync(output)) throw new Error("First preview PNG already exists.");
      fs.mkdirSync(path.dirname(output), { recursive: true });
      return {
        id, executable: process.execPath,
        argv: [path.join(tools, "svg_raster.js"), input, output],
        input: binding(input), output_path: output,
      };
    })
  : [{
      id: `${command}-185`, executable: python,
      argv: [
        path.join(tools, "p2c.py"), command, "--book", "10p", "--page", "185",
        "--root", path.join(own, "source"), "--work", path.join(own, "work"),
      ],
      input: binding(pageMd), output_path: pageMd,
    }];
const started = new Date().toISOString();
const results = [];
for (const task of tasks) {
  const result = spawnSync(task.executable, task.argv, {
    cwd: repo, env: { ...process.env, ...environment },
    encoding: "utf8", maxBuffer: 8 * 1024 * 1024,
  });
  const prefix = command === "preview" ? `first-svg-preview-${task.id}` : task.id;
  const stdout = path.join(own, `${prefix}.stdout.txt`);
  const stderr = path.join(own, `${prefix}.stderr.txt`);
  fs.writeFileSync(stdout, result.stdout ?? "", { flag: "wx" });
  fs.writeFileSync(stderr, result.stderr ?? "", { flag: "wx" });
  results.push({
    id: task.id, invocation_count: 1, executable: task.executable, argv: task.argv,
    exact_invocation: [
      "env", ...Object.entries(environment).map(([key, value]) => `${key}=${value}`),
      task.executable, ...task.argv,
    ].join(" "),
    cwd: repo, environment_overrides: environment, input: task.input,
    output: fs.existsSync(task.output_path) ? binding(task.output_path) : null,
    exit_code: result.status, signal: result.signal,
    launch_error: result.error?.message ?? null,
    stdout: binding(stdout), stderr: binding(stderr),
  });
  process.stdout.write(result.stdout ?? "");
  process.stderr.write(result.stderr ?? "");
  if (result.status !== 0) break;
}
const toolsAfter = toolFiles.map(binding);
const exitCode = results.every((result) => result.exit_code === 0) && results.length === tasks.length ? 0 : 1;
fs.writeFileSync(receiptFile, JSON.stringify({
  schema: "source-first-author/native-command-receipt@1",
  ticket: "STEMROBIN-181", book: "10p", page: 185, command,
  batch_invocation_count: 1, invocation_count_per_task: 1,
  started_at: started, finished_at: new Date().toISOString(), exit_code: exitCode,
  tasks: results, tools_before: toolsBefore, tools_after: toolsAfter,
  tool_hashes_stable_during_command: toolsBefore.every((tool, i) => tool.sha256 === toolsAfter[i].sha256),
  frozen_source_inventory: binding(inventoryFile),
  first_review_pixels_only: command === "preview",
  preview_is_not_another_vectorize_or_finalize: command === "preview",
  preview_image_tool_opens: 0,
  source_pass_claimed: false, independent_raw_pass_claimed: false,
  independent_svg_visual_pass_claimed: false,
}, null, 2) + "\n", { flag: "wx" });
console.log(`Receipt: ${receiptFile}\nSHA256: ${sha(receiptFile)}`);
process.exitCode = exitCode;
