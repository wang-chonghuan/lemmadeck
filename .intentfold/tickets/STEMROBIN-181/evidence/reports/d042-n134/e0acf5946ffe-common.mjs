import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

export const owned = path.dirname(fileURLToPath(import.meta.url));
export const workspace = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
assert.equal(owned, `${workspace}/.intentfold/tickets/STEMROBIN-181/tmp/d040-9p-n134-author`);
export const card = "phy9-c2-s7-n134";
export const edition = "modern-us-neutral";
export const tools = `${workspace}/.claude/skills/ld-s10y-lesson/tools`;
export const python = `${workspace}/.claude/skills/ld-s10y-lesson/.venv/bin/python`;
export const out = (relative) => {
  const file = path.resolve(owned, relative);
  assert.ok(file.startsWith(`${owned}/`), `Unowned output: ${file}`);
  return file;
};
export const hash = (file) => createHash("sha256").update(readFileSync(file)).digest("hex");
export const load = (file) => JSON.parse(readFileSync(file, "utf8"));
export const bind = (file) => ({ path: path.resolve(file), sha256: hash(file) });
export const templateDir = (language) => out(
  `${language === "zh" ? "work" : "work-en"}/adapt/9p/${edition}/lessons/${card}`,
);
export const bookDir = (language) => out(`${language === "zh" ? "root" : "root-en"}/9p`);

export function save(relative, value, replace = false) {
  const file = out(relative);
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, typeof value === "string" ? value : `${JSON.stringify(value, null, 2)}\n`,
    { flag: replace ? "w" : "wx" });
  return bind(file);
}

export function snapshot(source, relative, expected, reuse = false) {
  const original = bind(source);
  if (expected !== undefined) assert.equal(original.sha256, expected, source);
  const target = out(relative);
  if (reuse && existsSync(target)) {
    assert.equal(hash(target), original.sha256, `Existing snapshot drift: ${target}`);
    return { original, snapshot: bind(target) };
  }
  assert.ok(!existsSync(target), `Preserve existing file: ${target}`);
  mkdirSync(path.dirname(target), { recursive: true });
  copyFileSync(source, target);
  assert.equal(hash(target), original.sha256);
  return { original, snapshot: bind(target) };
}

export function run(name, executable, args, options = {}) {
  const result = spawnSync(executable, args, {
    cwd: workspace, encoding: "utf8", timeout: 180000,
    maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
    ...options,
  });
  save(`${name}.json`, {
    command: [executable, ...args], cwd: workspace,
    exitCode: result.status, signal: result.signal, stdout: result.stdout,
    stderr: result.stderr, error: result.error?.message ?? null,
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result.stdout;
}

export function verifyInputs() {
  const freeze = load(out("input-freeze.json"));
  for (const item of freeze.inputs) {
    assert.equal(hash(item.original.path), item.original.sha256, item.original.path);
    assert.equal(hash(item.snapshot.path), item.snapshot.sha256, item.snapshot.path);
  }
  return freeze;
}

export function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? walk(path.join(directory, entry.name)) : [path.join(directory, entry.name)]);
}
