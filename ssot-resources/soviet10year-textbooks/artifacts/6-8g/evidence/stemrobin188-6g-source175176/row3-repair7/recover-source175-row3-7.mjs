import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const W = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188';
assert.equal(fs.realpathSync(process.cwd()), W);
const base = 'ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-source175176';
const original = `${base}/author-first7`;
const recovery = `${base}/row3-repair7`;
const page = `${recovery}/artifacts/6-8g/pages/0175`;
const work = `${recovery}/work/6-8g/pages/0175`;
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
assert.equal(hash(`${original}/author-manifest.json`),
  'b8963f75609af626283eb56ce4593e8c70695e5f6ba1563dba07b28a4cafd4a4');
assert.equal(hash('ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-source177178/independent7/source175-target-FIRST.json'),
  '1d096541b5ed49d6c34f222d5bbd579813217afe4791b06680b856fae7812608');
function copy(from, to) {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(to, 0o644);
}

if (process.argv[2] === 'prepare') {
  assert.ok(!fs.existsSync(recovery), 'Do not replay affected preparation');
  for (const file of ['page.md', 'page.json', 'audit.json'])
    copy(`${original}/artifacts/6-8g/pages/0175/${file}`, `${page}/${file}`);
  for (const file of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md'])
    copy(`${original}/work/6-8g/pages/0175/${file}`, `${work}/${file}`);
  for (const id of ['fig-234', 'fig-235'])
    copy(`${original}/work/6-8g/pages/0175/figures/${id}.png`, `${work}/figures/${id}.png`);
  console.log('175 writable affected copy prepared; original candidate and source HOLD unchanged.');
} else if (process.argv[2] === 'finalize') {
  const name = `${recovery}/native-row3-recovery-first7`;
  for (const extension of ['stdout', 'stderr', 'execution.json'])
    assert.ok(!fs.existsSync(`${name}.${extension}`), 'Do not replay affected native call');
  const command = '.claude/skills/ld-s10y-lesson/.venv/bin/python';
  const argv = ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'finalize',
    '--book', '6-8g', '--page', '175', '--root', `${recovery}/artifacts`,
    '--work', `${recovery}/work`,
    '--books', 'ssot-resources/soviet10year-textbooks/sources'];
  const result = spawnSync(command, argv, { cwd: W, encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024 });
  for (const stream of ['stdout', 'stderr'])
    fs.writeFileSync(`${name}.${stream}`, result[stream] || '', { flag: 'wx' });
  fs.writeFileSync(`${name}.execution.json`, `${JSON.stringify({
    cwd: W, command, argv, exitCode: result.status, contentRevision: 1,
    streams: Object.fromEntries(['stdout', 'stderr'].map(stream => [stream, {
      path: `${name}.${stream}`, sha256: hash(`${name}.${stream}`),
    }])),
  }, null, 2)}\n`, { flag: 'wx' });
  console.log(result.stdout);
  console.error(result.stderr);
  assert.equal(result.status, 0, '175 affected native call failed; originals retained');
  const expected = read(`${original}/artifacts/6-8g/pages/0175/page.json`);
  assert.equal(expected.blocks[1].lines[0].split('三角形有').length, 2);
  expected.blocks[1].lines[0] = expected.blocks[1].lines[0].replace('三角形有', '三角形中有');
  assert.deepEqual(read(`${page}/page.json`), expected, 'Change exceeds the one source character');
  for (const id of ['fig-234', 'fig-235'])
    assert.equal(hash(`${work}/figures/${id}.png`),
      hash(`${original}/work/6-8g/pages/0175/figures/${id}.png`), 'Approved source crop changed');
  console.log('Only 175 corollary-1 source character restored; metadata and both crops unchanged.');
} else {
  throw new Error('Select prepare or finalize');
}
