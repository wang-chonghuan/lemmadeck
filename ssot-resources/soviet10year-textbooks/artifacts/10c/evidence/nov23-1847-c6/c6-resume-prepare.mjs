import assert from 'node:assert/strict';
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const root = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184';
assert.equal(process.cwd(), root);
const out = '.tmp/stemrobin-184-six/c6-resume';
const common = ['--repo', '.', '--book', '10c', '--lesson', 'ana10-c6-ex'];
const exerciseArgs = Array.from({ length: 57 }, (_, i) => ['--exercise', String(335 + i)]).flat();
for (const [name, args] of [
  ['inspect', ['inspect', ...common]],
  ['prepare', ['prepare', ...common, ...exerciseArgs, '--no-concepts', '--out', `${out}/seed.json`]],
]) {
  const result = spawnSync('python3',
    ['.agents/skills/ld-s10y-choice/scripts/prepare.py', ...args],
    { cwd: root, encoding: 'utf8', maxBuffer: 2 * 1024 * 1024 });
  fs.writeFileSync(`${out}/${name}.stdout.txt`, result.stdout, { flag: 'wx' });
  fs.writeFileSync(`${out}/${name}.stderr.txt`, result.stderr, { flag: 'wx' });
  console.log(JSON.stringify({ stage: name, exit: result.status,
    stdout: `${out}/${name}.stdout.txt`, stderr: `${out}/${name}.stderr.txt` }));
  assert.equal(result.status, 0, result.stderr);
}
