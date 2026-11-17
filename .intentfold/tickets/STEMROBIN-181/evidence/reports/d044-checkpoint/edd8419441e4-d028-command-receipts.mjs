import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, bytes, read, verify, hash, immutableWrite,
} from './retain-d016-evidence.mjs';

const action = process.argv[2];
assert.ok(['--commit', '--push'].includes(action));
const branch = 'codex/STEMROBIN-181-textbooks';
const folder = `${ticket}/tmp/d028`;
const staging = await read(`${folder}/staging.json`);
await verify(`${folder}/manifest.json`, staging.manifest.sha256);
function git(args, binary = false) {
  const result = spawnSync('git', args, {
    cwd: root, encoding: binary ? undefined : 'utf8',
    timeout: 180000, maxBuffer: 128 * 1024 * 1024,
  });
  assert.equal(result.status, 0, result.stderr?.toString());
  return result.stdout;
}
assert.equal(git(['branch', '--show-current']).trim(), branch);
if (action === '--commit') {
  assert.equal(git(['rev-parse', 'HEAD']).trim(), staging.parent);
  const actual = git(['diff', '--cached', '--name-only', '-z']).split('\0').filter(Boolean);
  const expected = [...staging.files.map(row => row.path), ...staging.projections.map(row => row.target)];
  assert.deepEqual(actual.sort(), expected.sort());
  const suspicious = [];
  for (const file of actual) {
    assert.ok(file.startsWith('ssot-resources/soviet10year-textbooks/artifacts/') ||
      file.startsWith(`${ticket}/evidence/`) || file === `${ticket}/production-meter.json`);
    assert.ok(!file.split('/').some(part => part === 'tmp' || part === '.env'));
    const data = git(['show', `:${file}`], true);
    const projected = staging.projections.find(row => row.target === file);
    if (projected) {
      assert.deepEqual(data, await bytes(projected.from));
      await verify(projected.before.path, projected.before.sha256);
    } else {
      const binding = staging.files.find(row => row.path === file);
      assert.equal(hash(data), binding.sha256);
      await verify(file, binding.sha256);
    }
    if (/\.(?:json|md|html|txt|mjs|py|svg)$/.test(file) &&
      /(?:postgres(?:ql)?:\/\/[^ \n"'<>]+|plane_api_[A-Za-z0-9]+|sk-[A-Za-z0-9]{20,}|-----BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY-----)/.test(data.toString())) {
      suspicious.push(file);
    }
  }
  assert.deepEqual(suspicious, [], 'Potential credential in staged content');
  console.log(JSON.stringify({ stagedPaths: actual.length, projectedIndices: staging.projections.length,
    secretScan: 'PASS', scope: 'PASS' }));
}
const args = action === '--commit'
  ? ['commit', '-m', 'STEMROBIN-181: deliver D028 three complete bilingual physics cards']
  : ['push', '--porcelain', 'origin', `HEAD:refs/heads/${branch}`];
if (action === '--push') {
  assert.equal(git(['rev-parse', 'HEAD^']).trim(), staging.parent);
  assert.equal(git(['diff', '--cached', '--name-only']).trim(), '');
}
const startedAt = new Date().toISOString();
const result = spawnSync('git', args, {
  cwd: root, encoding: 'utf8', timeout: 180000, maxBuffer: 32 * 1024 * 1024,
});
const receipt = {
  ticket: 'STEMROBIN-181', batch: 'D028', branch, parent: staging.parent, args,
  startedAt, finishedAt: new Date().toISOString(), exitCode: result.status,
  signal: result.signal, error: result.error?.message ?? null,
  stdout: result.stdout, stderr: result.stderr, actualCommandExecuted: true,
  commit: git(['rev-parse', 'HEAD']).trim(),
};
await immutableWrite(`${folder}/${action === '--commit' ? 'commit' : 'push'}.json`,
  `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt));
assert.equal(result.status, 0);
