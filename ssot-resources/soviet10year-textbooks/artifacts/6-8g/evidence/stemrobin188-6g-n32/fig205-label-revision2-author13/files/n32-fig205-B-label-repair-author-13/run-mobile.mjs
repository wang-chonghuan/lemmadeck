import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
const revision = Number(process.argv[2]);
assert.ok(revision === 2 || revision === 3);
const stage = `mobile.r${revision}`;
const receipt = path.join(root, `${stage}.call.json`);
assert.ok(!fs.existsSync(receipt), 'Refusing to replay a mobile call.');
const argv = ['node', path.join(root, 'check-mobile.mjs'), String(revision)];
const binding = (file) => ({
  path: file,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),
  bytes: fs.statSync(file).size,
});
const startedAt = new Date().toISOString();
const result = spawnSync(argv[0], argv.slice(1), { cwd: repo, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
const finishedAt = new Date().toISOString();
const stdout = path.join(root, `${stage}.stdout.txt`);
const stderr = path.join(root, `${stage}.stderr.txt`);
fs.writeFileSync(stdout, result.stdout || '');
fs.writeFileSync(stderr, result.stderr || '');
const outputs = [
  `${stage}.json`,
  `fig-205.r${revision}.media300.png`,
  `fig-205.r${revision}.media358.png`,
  `fig-205.r${revision}.media300.html`,
  `fig-205.r${revision}.media358.html`,
].map((name) => path.join(root, name)).filter((file) => fs.existsSync(file));
const record = {
  schema: 'native-figure-call@1',
  stage, figure: 'fig-205', argv, cwd: repo, startedAt, finishedAt,
  exitCode: result.status, signal: result.signal, error: result.error?.message || null,
  status: result.status === 0 && !result.error && !result.signal ? 'completed' : 'failed',
  inputs: [`spec.r${revision}.json`, `fig-205.r${revision}.svg`, `fig-205.r${revision}.render.json`].map((name) => binding(path.join(root, name))),
  tools: [binding(argv[1])],
  streams: { stdout: binding(stdout), stderr: binding(stderr) },
  outputs: outputs.map(binding),
  contentRevision: revision, technicalRecoveries: 0, independentReview: false,
};
fs.writeFileSync(receipt, `${JSON.stringify(record, null, 2)}\n`);
if (result.status !== 0) fs.writeFileSync(path.join(root, `failure.${stage}.json`), `${JSON.stringify({ call: binding(receipt), evidence: record }, null, 2)}\n`);
console.log(JSON.stringify({ stage, exitCode: result.status, receipt: binding(receipt), stdout: result.stdout, stderr: result.stderr }));
process.exitCode = result.status === 0 ? 0 : 2;
