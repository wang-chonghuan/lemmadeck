import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const root = path.dirname(fileURLToPath(import.meta.url));
export const workspace = "/Users/yong/.codex/worktrees/a07e/lemmadeck";

export function recordCommand(id, task) {
  let stdout = "";
  let stderr = "";
  const emit = (text) => {
    stdout += text;
    process.stdout.write(text);
  };
  try {
    task(emit);
  } catch (error) {
    stderr = `${error.stack ?? error}\n`;
    process.stderr.write(stderr);
    process.exitCode = 1;
  }
  process.on("exit", (exitCode) => {
    fs.writeFileSync(path.join(root, `${id}.stdout.txt`), stdout, { flag: "wx" });
    fs.writeFileSync(path.join(root, `${id}.stderr.txt`), stderr, { flag: "wx" });
    fs.writeFileSync(path.join(root, `${id}.command.json`), `${JSON.stringify({
      argv: [process.execPath, ...process.argv.slice(1)],
      cwd: process.cwd(),
      stdoutPath: path.join(root, `${id}.stdout.txt`),
      stderrPath: path.join(root, `${id}.stderr.txt`),
      exitCodeObservedByProcessExitEvent: exitCode,
      childProcesses: 0,
      capture: "Direct writes made to this process stdout/stderr, retained verbatim; no child session.",
      enclosingToolExit: "Read the actual functions.exec_command response, not a predicted status.",
    }, null, 2)}\n`, { flag: "wx" });
  });
}
