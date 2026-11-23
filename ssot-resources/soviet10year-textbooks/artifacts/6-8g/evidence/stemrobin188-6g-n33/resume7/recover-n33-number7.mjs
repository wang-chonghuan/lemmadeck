import fs from 'node:fs';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
const W = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188';
assert.equal(fs.realpathSync(process.cwd()), W);
const O = 'ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-n33/display7';
const phase = process.argv[2];
const name = `number-${phase}7`;
const command = phase === 'render' ? '.claude/skills/ld-s10y-lesson/.venv/bin/python' : 'node';
const argv = phase === 'render'
  ? ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'render', '--book', '6-8g', '--edition', 'modern-us-neutral', '--lesson', 'geo68-c3-s1-n33']
  : ['--test', '--test-name-pattern=offline exercise numbers', '.claude/skills/ld-s10y-lesson/tools/render_lesson.test.cjs'];
const result = spawnSync(command, argv, { cwd: W, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
for (const stream of ['stdout', 'stderr'])
  fs.writeFileSync(`${O}/${name}.${stream}`, result[stream] || '', { flag: 'wx' });
fs.writeFileSync(`${O}/${name}.json`, `${JSON.stringify({ cwd: W, command, argv, exitCode: result.status }, null, 2)}\n`, { flag: 'wx' });
console.log(result.stdout);
console.error(result.stderr);
assert.equal(result.status, phase === 'before' ? 1 : 0);
