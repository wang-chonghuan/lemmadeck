import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187';
assert.equal(process.cwd(), root);
const directory = path.dirname(fileURLToPath(import.meta.url));
const relative = path.relative(root, directory);
const id = 'fig-choice-4m-992-measure';
const spec = `${relative}/${id}.spec.json`;
const stages = [
  { name: 'validation', command: 'python3', args: [
    '.agents/skills/ld-s10y-image/scripts/validate_spec.py', spec, '--stage', 'draft', '--json'
  ] },
  { name: 'render', command: 'node', args: [
    '.agents/skills/ld-s10y-image/scripts/render_spec.mjs', '--spec', spec,
    '--svg', `${relative}/${id}.svg`, '--report', `${relative}/${id}.render.json`,
    '--png', `${relative}/${id}.full-normal640.png`
  ] },
  { name: 'check', command: 'node', args: [`${relative}/check.mjs`] }
];
for (const stage of stages) {
  assert.equal(fs.existsSync(path.join(directory, `${stage.name}-FIRST.command.json`)), false,
    `FIRST evidence exists for ${stage.name}; inspect it instead of overwriting or replaying`);
}
for (const stage of stages) {
  const startedAt = new Date().toISOString();
  const result = spawnSync(stage.command, stage.args, { cwd: root, encoding: 'utf8' });
  const finishedAt = new Date().toISOString();
  const stdout = result.stdout || '';
  const stderr = result.stderr || '';
  fs.writeFileSync(path.join(directory, `${stage.name}-FIRST.stdout.txt`), stdout, { flag: 'wx' });
  fs.writeFileSync(path.join(directory, `${stage.name}-FIRST.stderr.txt`), stderr, { flag: 'wx' });
  fs.writeFileSync(path.join(directory, `${stage.name}-FIRST.command.json`),
    `${JSON.stringify({ ...stage, workdir: root, startedAt, finishedAt,
      exitCode: result.status, signal: result.signal, error: result.error?.message || null }, null, 2)}\n`,
    { flag: 'wx' });
  console.log(`${stage.name}: exit ${result.status}`);
  if (stdout) process.stdout.write(stdout);
  if (stderr) process.stderr.write(stderr);
  if (result.status !== 0) {
    console.error(`Stopped at ${stage.name}; real FIRST evidence retained unchanged.`);
    process.exit(result.status || 1);
  }
}
