import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {W, E, O, save, bind} from './common.mjs';

const [name, executable, ...args] = process.argv.slice(2);
assert.ok(name && executable);
const dir = path.join(E, 'native', name);
assert.ok(!fs.existsSync(dir));
fs.mkdirSync(dir, {recursive: true});
const startedAt = new Date().toISOString();
const result = spawnSync(executable, args, {
  cwd: W, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
  env: {...process.env, PYTHONDONTWRITEBYTECODE: '1', TMPDIR: O,
    PYTHON: path.join(W, '.claude/skills/ld-s10y-lesson/.venv/bin/python')},
});
for (const [file, text] of [['stdout.txt', result.stdout], ['stderr.txt', result.stderr]]) {
  fs.writeFileSync(path.join(dir, file), text || '', {flag: 'wx'});
}
save(path.join(dir, 'receipt.json'), {
  role: 'AFFECTED_ONLY_FIRST_REPAIR_AUTHOR', batch: 'D083', cwd: W,
  command: [executable, ...args], startedAt, finishedAt: new Date().toISOString(),
  exitCode: result.status, error: result.error?.message || null,
  stdout: bind(path.join(dir, 'stdout.txt')), stderr: bind(path.join(dir, 'stderr.txt')),
  independentApproval: false,
});
console.log(result.stdout || '');
console.error(result.stderr || '');
process.exit(result.status ?? 1);
