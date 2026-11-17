import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const cwd = '/Users/yong/.codex/worktrees/a07e/lemmadeck';
const step = process.argv[2];
if (!['inspect', 'freeze'].includes(step)) throw new Error('Expected inspect or freeze');
const dir = path.join(root, 'commands', step);
fs.mkdirSync(dir, { recursive: true });
if (fs.existsSync(path.join(dir, 'command.json'))) throw new Error('No replay permitted');
const program = path.join(root, `${step}.mjs`);
const argv = [process.execPath, program];
const started = new Date().toISOString();
const result = spawnSync(argv[0], argv.slice(1), {
  cwd, encoding: null, maxBuffer: 16 * 1024 * 1024,
});
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const stdout = result.stdout ?? Buffer.alloc(0);
const stderr = result.stderr ?? Buffer.alloc(0);
for (const [name, bytes] of [['stdout.txt', stdout], ['stderr.txt', stderr]]) {
  fs.writeFileSync(path.join(dir, name), bytes, { flag: 'wx' });
}
const record = {
  argv, cwd, started, ended: new Date().toISOString(),
  status: result.status, signal: result.signal, error: result.error?.message ?? null,
  stdout: { path: path.join(dir, 'stdout.txt'), bytes: stdout.length, sha256: sha(stdout) },
  stderr: { path: path.join(dir, 'stderr.txt'), bytes: stderr.length, sha256: sha(stderr) },
  program: { path: program, bytes: fs.statSync(program).size, sha256: sha(fs.readFileSync(program)) },
  runtime: { executable: process.execPath, node: process.version },
  invocation: [process.execPath, fileURLToPath(import.meta.url), step],
};
fs.writeFileSync(path.join(dir, 'command.json'), `${JSON.stringify(record, null, 2)}\n`, { flag: 'wx' });
process.stdout.write(stdout);
process.stderr.write(stderr);
if (step === 'freeze' && result.status === 0) {
  function inventory(directory) {
    return fs.readdirSync(directory, { withFileTypes: true })
      .sort((a, b) => a.name.localeCompare(b.name))
      .flatMap(entry => {
        const absolute = path.join(directory, entry.name);
        if (entry.isDirectory()) return inventory(absolute);
        if (!entry.isFile()) throw new Error(`Unexpected non-file: ${absolute}`);
        const bytes = fs.readFileSync(absolute);
        return [{ path: absolute, bytes: bytes.length, sha256: sha(bytes) }];
      });
  }
  const outputs = inventory(root);
  const records = ['inspect', 'freeze'].map(name =>
    JSON.parse(fs.readFileSync(path.join(root, 'commands', name, 'command.json'), 'utf8')));
  const manifest = {
    schema: 'STEMROBIN-184/independent-modern-text-review@1',
    status: 'PASS: first independent new modern TEXT semantic review only',
    owned_output_root: root,
    frozen_at: new Date().toISOString(),
    inputs: JSON.parse(fs.readFileSync(path.join(root, 'input-manifest.json'), 'utf8')),
    outputs, commands: records,
    programs: outputs.filter(entry => entry.path.endsWith('.mjs')),
    runtime: {
      path: process.execPath, node: process.version,
      bytes: fs.statSync(process.execPath).size, sha256: sha(fs.readFileSync(process.execPath)),
    },
    command_scope: 'Actual primary evidence commands and raw streams captured. Preliminary read-only sed/rg context navigation and the output-directory absence check are in the chat tool transcript; they were not acceptance passes and were not re-executed for a synthetic transcript.',
    ledger: JSON.parse(fs.readFileSync(path.join(root, 'ledger.json'), 'utf8')),
    unknowns: ['source pixel review', 'repeated independent mathematical proof', 'rendered typography',
      'finalizer', 'publication', 'DB', 'all historical UNKNOWNs'],
    exclusions: ['This manifest excludes its own recursively dependent hash.',
      'Original PDF is input bytes/hash only, not an image or copied visual artifact.'],
    stop: 'One new complete modern text review frozen; no template repair needed; no subsequent pipeline action.',
  };
  const manifestBytes = Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`);
  const manifestPath = path.join(root, 'manifest.json');
  fs.writeFileSync(manifestPath, manifestBytes, { flag: 'wx' });
  console.log(`MANIFEST ${manifestPath}`);
  console.log(`BYTES ${manifestBytes.length}`);
  console.log(`SHA256 ${sha(manifestBytes)}`);
}
process.exitCode = result.status ?? 1;
