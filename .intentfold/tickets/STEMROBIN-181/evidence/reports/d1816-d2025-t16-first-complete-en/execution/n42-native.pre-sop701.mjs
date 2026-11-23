import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

export const repo = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-181';
assert.equal(process.cwd(), repo);
export const ticket = `${repo}/.intentfold/tickets/STEMROBIN-181`;
const retiredRoot = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
export const localPath = value => typeof value === 'string' && value.startsWith(`${retiredRoot}/`)
  ? `${repo}${value.slice(retiredRoot.length)}` : value;
const localRecord = value => Array.isArray(value) ? value.map(localRecord)
  : value && typeof value === 'object' ? Object.fromEntries(
    Object.entries(value).map(([key, item]) => [key, localRecord(item)])) : localPath(value);
export const bind = file => ({
  path: path.resolve(localPath(file)), bytes: fs.statSync(localPath(file)).size,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(localPath(file))).digest('hex'),
});
export const read = file => localRecord(JSON.parse(fs.readFileSync(localPath(file))));
export function save(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', { flag: 'wx' });
}
export function copy(from, to) {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  assert.equal(bind(from).sha256, bind(to).sha256);
}
export function run(name, command, outputs = []) {
  const directory = `${ticket}/tmp/d1816-recovery/native/${name}`;
  fs.mkdirSync(directory, { recursive: false });
  const startedAt = new Date().toISOString();
  const result = spawnSync(command[0], command.slice(1), {
    cwd: repo, encoding: 'utf8', maxBuffer: 20 * 1024 * 1024,
  });
  const stdout = `${directory}/stdout.txt`;
  const stderr = `${directory}/stderr.txt`;
  fs.writeFileSync(stdout, result.stdout ?? '', { flag: 'wx' });
  fs.writeFileSync(stderr, result.stderr ?? '', { flag: 'wx' });
  save(`${directory}/receipt.json`, {
    cwd: repo, argv: command, startedAt, finishedAt: new Date().toISOString(),
    exitCode: result.status, signal: result.signal, error: result.error?.message ?? null,
    streams: { stdout: bind(stdout), stderr: bind(stderr) },
    outputs: outputs.filter(file => fs.existsSync(file)).map(bind),
  });
  process.stdout.write(result.stdout ?? '');
  process.stderr.write(result.stderr ?? '');
  assert.equal(result.status, 0, `${name}: native call failed; receipt preserved`);
  return bind(`${directory}/receipt.json`);
}
