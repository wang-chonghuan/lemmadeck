import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const own = dirname(fileURLToPath(import.meta.url));
const root = '/Users/yong/.codex/worktrees/a07e/lemmadeck';
const executable = process.execPath;
const args = [join(own, 'investigate.mjs')];
const started = new Date().toISOString();
const result = spawnSync(executable, args, { cwd: root, encoding: null });
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const stdout = result.stdout ?? Buffer.alloc(0);
const stderr = result.stderr ?? Buffer.alloc(0);
writeFileSync(join(own, 'terminal.stdout'), stdout, { flag: 'wx' });
writeFileSync(join(own, 'terminal.stderr'), stderr, { flag: 'wx' });
const seal = {
  terminal: true,
  status: result.status === 0 ? 'SEALED SCRATCH CANDIDATE; STOP' : 'FAILED INVESTIGATION; STOP',
  started_at: started,
  ended_at: new Date().toISOString(),
  outer_command: 'node .intentfold/tickets/STEMROBIN-184/tmp/production-114-expa-erratum/seal.mjs',
  outer_cwd: root,
  outer_streams: 'Tool result: forwards terminal.stdout/terminal.stderr verbatim and adds this seal path/hash on stdout.',
  executable,
  arguments: args,
  cwd: root,
  exit_code: result.status,
  signal: result.signal,
  error: result.error?.message ?? null,
  stdout: { path: 'terminal.stdout', bytes: stdout.length, sha256: sha(stdout) },
  stderr: { path: 'terminal.stderr', bytes: stderr.length, sha256: sha(stderr) },
  manifest: result.status === 0
    ? { path: 'manifest.json', sha256: sha(readFileSync(join(own, 'manifest.json'))) }
    : null,
  restrictions: 'No promotion, no source adoption, no new humanpixel grant. No further writes after this seal.',
};
writeFileSync(join(own, 'terminalseal.json'), `${JSON.stringify(seal, null, 2)}\n`, { flag: 'wx' });
process.stdout.write(stdout);
process.stderr.write(stderr);
process.stdout.write('TERMINALSEAL_PATH: ' + join(own, 'terminalseal.json') + '\n');
process.stdout.write('TERMINALSEAL_HASH: ' + sha(readFileSync(join(own, 'terminalseal.json'))) + '\n');
process.exitCode = result.status ?? 1;
