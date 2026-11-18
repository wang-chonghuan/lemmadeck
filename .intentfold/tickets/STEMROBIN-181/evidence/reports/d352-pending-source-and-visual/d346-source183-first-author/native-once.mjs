import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const own = path.dirname(fileURLToPath(import.meta.url));
const repo = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const sha = (file) =>
  crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const binding = (file) => ({
  path: file,
  sha256: sha(file),
  bytes: fs.statSync(file).size,
});
const command = process.argv[2];
if (!["finalize", "vectorize"].includes(command)) {
  throw new Error("Only the requested finalize or vectorize is supported.");
}
const receipt = path.join(own, `${command}-183.receipt.json`);
if (fs.existsSync(receipt)) throw new Error(`${command} already has a receipt.`);
const source = path.join(own, "source");
const work = path.join(own, "work");
const pageMd = path.join(source, "10p/pages/0183/page.md");
if (command === "finalize") {
  const preserved = path.join(own, "author-input-page.md");
  fs.copyFileSync(pageMd, preserved, fs.constants.COPYFILE_EXCL);
}
if (command === "vectorize") {
  const finalized = JSON.parse(
    fs.readFileSync(path.join(own, "finalize-183.receipt.json"), "utf8"),
  );
  if (finalized.exit_code !== 0) {
    throw new Error("Native finalize failed; vectorize is not authorized.");
  }
}
const executable = path.join(repo, ".claude/skills/ld-s10y-lesson/.venv/bin/python");
const p2c = path.join(repo, ".claude/skills/ld-s10y-lesson/tools/p2c.py");
const args = [
  p2c,
  command,
  "--book", "10p",
  "--page", "183",
  "--root", source,
  "--work", work,
];
const environment = {
  PYTHONDONTWRITEBYTECODE: "1",
  TMPDIR: path.join(own, "native-tmp"),
};
const start = new Date().toISOString();
const before = binding(pageMd);
const result = spawnSync(executable, args, {
  cwd: repo,
  env: { ...process.env, ...environment },
  encoding: "utf8",
  maxBuffer: 8 * 1024 * 1024,
});
const stdout = path.join(own, `${command}-183.stdout.txt`);
const stderr = path.join(own, `${command}-183.stderr.txt`);
fs.writeFileSync(stdout, result.stdout ?? "", { flag: "wx" });
fs.writeFileSync(stderr, result.stderr ?? "", { flag: "wx" });
const exactInvocation = [
  "env",
  ...Object.entries(environment).map(([key, value]) => `${key}=${value}`),
  executable,
  ...args,
].join(" ");
fs.writeFileSync(
  receipt,
  JSON.stringify(
    {
      schema: "source-first-author/native-command-receipt@1",
      ticket: "STEMROBIN-181",
      book: "10p",
      page: 183,
      command,
      invocation_count: 1,
      cwd: repo,
      executable,
      argv: args,
      environment_overrides: environment,
      exact_invocation: exactInvocation,
      started_at: start,
      finished_at: new Date().toISOString(),
      exit_code: result.status,
      signal: result.signal,
      launch_error: result.error?.message ?? null,
      input_page_md: before,
      output_page_md: binding(pageMd),
      tools: [
        binding(p2c),
        binding(path.join(repo, ".claude/skills/ld-s10y-lesson/tools/layout.py")),
        binding(path.join(repo, ".claude/skills/ld-s10y-lesson/tools/blocks.py")),
        binding(path.join(repo, ".claude/skills/ld-s10y-lesson/tools/vectorize.py")),
        binding(path.join(repo, ".claude/skills/ld-s10y-lesson/tools/svg_raster.js")),
      ],
      stdout: binding(stdout),
      stderr: binding(stderr),
      independent_visual_pass: false,
      source_pass_claimed: false,
    },
    null,
    2,
  ) + "\n",
  { flag: "wx" },
);
process.stdout.write(result.stdout ?? "");
process.stderr.write(result.stderr ?? "");
console.log(`Receipt: ${receipt}`);
console.log(`Receipt SHA256: ${sha(receipt)}`);
process.exitCode = result.status ?? 1;
