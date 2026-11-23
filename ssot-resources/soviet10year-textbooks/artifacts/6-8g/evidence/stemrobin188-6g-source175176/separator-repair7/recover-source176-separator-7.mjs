import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const W = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188';
assert.equal(fs.realpathSync(process.cwd()), W);
const base = 'ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-source175176';
const original = `${base}/author-first7`;
const recovery = `${base}/separator-repair7`;
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
assert.equal(hash(`${original}/author-manifest.json`),
  'b8963f75609af626283eb56ce4593e8c70695e5f6ba1563dba07b28a4cafd4a4');
const page = `${recovery}/artifacts/6-8g/pages/0176`;
const work = `${recovery}/work/6-8g/pages/0176`;
function copy(from, to) {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(to, 0o644);
}

if (process.argv[2] === 'prepare') {
  assert.ok(!fs.existsSync(recovery), 'Do not replay recovery preparation');
  for (const file of ['page.md', 'page.json', 'audit.json'])
    copy(`${original}/artifacts/6-8g/pages/0176/${file}`, `${page}/${file}`);
  for (const file of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md'])
    copy(`${original}/work/6-8g/pages/0176/${file}`, `${work}/${file}`);
  for (const id of ['fig-236', 'fig-237'])
    copy(`${original}/work/6-8g/pages/0176/figures/${id}.png`, `${work}/figures/${id}.png`);
  console.log('176 isolated working copy prepared; original failure preserved; no exclusion applied.');
} else if (process.argv[2] === 'finalize') {
  assert.ok(fs.existsSync(`${base}/independent7/comparison-review7.json`),
    'Actual independent source comparison must be retained first');
  const name = `${recovery}/native-separator-recovery-first7`;
  for (const extension of ['stdout', 'stderr', 'execution.json'])
    assert.ok(!fs.existsSync(`${name}.${extension}`), 'Do not replay native recovery');
  const command = '.claude/skills/ld-s10y-lesson/.venv/bin/python';
  const argv = ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'finalize',
    '--book', '6-8g', '--page', '176', '--root', `${recovery}/artifacts`,
    '--work', `${recovery}/work`,
    '--books', 'ssot-resources/soviet10year-textbooks/sources'];
  const result = spawnSync(command, argv, { cwd: W, encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024 });
  for (const stream of ['stdout', 'stderr'])
    fs.writeFileSync(`${name}.${stream}`, result[stream] || '', { flag: 'wx' });
  fs.writeFileSync(`${name}.execution.json`, `${JSON.stringify({
    cwd: W, command, argv, exitCode: result.status,
    streams: Object.fromEntries(['stdout', 'stderr'].map(stream => [stream, {
      path: `${name}.${stream}`, sha256: hash(`${name}.${stream}`),
    }])),
  }, null, 2)}\n`, { flag: 'wx' });
  console.log(result.stdout);
  console.error(result.stderr);
  assert.equal(result.status, 0, '176 native separator recovery failed; original receipts retained');
  const before = read(`${original}/artifacts/6-8g/pages/0176/page.json`);
  const after = read(`${page}/page.json`);
  assert.deepEqual(after.blocks, before.blocks, 'Source text or block ownership changed');
  assert.deepEqual(after.meta.figures, before.meta.figures, 'Original figure geometry changed');
  for (const id of ['fig-236', 'fig-237'])
    assert.equal(hash(`${work}/figures/${id}.png`),
      hash(`${original}/work/6-8g/pages/0176/figures/${id}.png`), 'Source crop changed');
  console.log('Only 176 counting metadata recovered; source blocks and both crops unchanged.');
} else {
  throw new Error('Select prepare or finalize');
}
