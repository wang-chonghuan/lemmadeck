import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
const root = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), root);
const own = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d054-n14-author');
const figdir = path.join(root, '.tmp/STEMROBIN-181/d1816-d054/n14-figure-author');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
function call(name, command, inputPath) {
  const receipt = path.join(own, `${name}.receipt.json`);
  assert(!fs.existsSync(receipt), 'Never overwrite first native attempt');
  const r = spawnSync(command[0], command.slice(1), { cwd: root, encoding: 'utf8', timeout: 180000, maxBuffer: 20 * 1024 * 1024 });
  fs.writeFileSync(receipt, JSON.stringify({
    role: 'AUTHOR', command, cwd: root, exitCode: r.status, error: r.error?.message || null,
    input: {path: inputPath, sha256: hash(inputPath)}, stdout: r.stdout, stderr: r.stderr,
    independentReview: 'pending',
  }, null, 2) + '\n', {flag: 'wx'});
  console.log(JSON.stringify({ name, exitCode: r.status, stdout: r.stdout.slice(0,2400), stderr: r.stderr.slice(0,2400) }));
  if (r.status !== 0) throw new Error(`Stop dependent stage at ${name}`);
}
if (!process.argv.includes('--render-only')) {
  for (const id of ['fig-18','fig-19']) {
    const spec = path.join(figdir, `${id}.spec.json`);
    const repaired = process.argv.includes('--label-repair') ? '-label-repair'
      : id === 'fig-18' && process.argv.includes('--contract-repair') ? '-contract-repair' : '';
    call(`${id}-native-draft${repaired}`, ['.claude/skills/ld-s10y-lesson/.venv/bin/python',
      '.agents/skills/ld-s10y-image/scripts/validate_spec.py', spec, '--stage','draft','--json'], spec);
  }
}
let renderer = '.agents/skills/ld-s10y-image/scripts/render_spec.mjs';
if (process.argv.includes('--runtime-reuse')) {
  const priorPath = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d050-n13-author/technical-runtime-reuse.json');
  const prior = JSON.parse(fs.readFileSync(priorPath));
  for (const pair of prior.files) {
    assert.equal(hash(pair.source.path), pair.source.sha256);
    assert.equal(hash(pair.runtime.path), pair.source.sha256);
  }
  renderer = prior.files[0].runtime.path;
  fs.writeFileSync(path.join(own, 'technical-runtime-reuse.json'), JSON.stringify({
    role: 'AUTHOR', reason: 'Standard worktree dependency root absent; reuse existing byte-identical native renderer runtime read-only.',
    prior: {path: priorPath, sha256: hash(priorPath)}, files: prior.files,
    dependencyRoot: prior.dependencyRoot, dependencyInstalls: 0, copiedPackages: 0, rendererEdits: 0,
  }, null, 2) + '\n');
}
for (const id of ['fig-18','fig-19']) {
  const spec = path.join(figdir, `${id}.spec.json`);
  const suffix = id === 'fig-18' && process.argv.includes('--label-repair') ? '-label-repair'
    : id === 'fig-18' && process.argv.includes('--runtime-reuse') ? '-runtime-reuse' : '';
  call(`${id}-native-render${suffix}`, ['node', renderer,
    '--spec',spec,'--svg',path.join(figdir,`${id}.svg`),
    '--png',path.join(figdir,`${id}.native.png`),
    '--report',path.join(figdir,`${id}.render.json`)], spec);
}
