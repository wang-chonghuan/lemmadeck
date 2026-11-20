import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';

const W = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), W);
const E = path.join(W, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d073-n126-author');
const [name, executable, ...args] = process.argv.slice(2);
assert.ok(name && executable);
const out = path.join(E, 'native', name);
fs.mkdirSync(out, {recursive: true});
const startedAt = new Date().toISOString();
const result = spawnSync(executable, args, {cwd: W, encoding: 'utf8',
  env: {...process.env, PYTHONDONTWRITEBYTECODE: '1',
    PYTHON: path.join(W, '.claude/skills/ld-s10y-lesson/.venv/bin/python')}});
fs.writeFileSync(path.join(out, 'stdout.txt'), result.stdout || '', {flag: 'wx'});
fs.writeFileSync(path.join(out, 'stderr.txt'), result.stderr || '', {flag: 'wx'});
fs.writeFileSync(path.join(out, 'receipt.json'), JSON.stringify({
  role: 'FIRST_AUTHOR', command: [executable, ...args], cwd: W, startedAt,
  finishedAt: new Date().toISOString(), exitCode: result.status,
  error: result.error?.message || null,
}, null, 2) + '\n', {flag: 'wx'});
console.log(result.stdout || '', result.stderr || '');
process.exit(result.status ?? 1);
