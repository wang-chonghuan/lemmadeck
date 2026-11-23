import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const own = path.dirname(fileURLToPath(import.meta.url));
const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
if (process.cwd() !== repo) throw new Error('exact cwd required');
const now = () => new Date().toISOString();
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const inside = p => {
  const full = path.resolve(p);
  if (!full.startsWith(own + path.sep)) throw new Error('write outside owner');
  return full;
};
const write = (p, data) => {
  p = inside(p);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, data, { flag: 'wx' });
};
const fact = p => {
  const s = fs.statSync(p);
  return {
    path: path.resolve(p), sha256: hash(p), bytes: s.size,
    permissions: (s.mode & 0o777).toString(8).padStart(4, '0'),
    birthtime: s.birthtime.toISOString(), mtime: s.mtime.toISOString(),
    ctime: s.ctime.toISOString(), statObservedAt: now(),
  };
};
const [mode, name, ...args] = process.argv.slice(2);
if (mode === 'run') {
  const start = now();
  const result = spawnSync(args[0], args.slice(1), {
    cwd: repo, env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
    encoding: null, maxBuffer: 32 * 1024 * 1024,
  });
  const prefix = path.join(own, 'receipts', name);
  write(prefix + '.stdout', result.stdout ?? Buffer.alloc(0));
  write(prefix + '.stderr', result.stderr ?? Buffer.alloc(0));
  const receipt = {
    schema: 'same188-6/native-execution@1', cwd: repo, argv: args,
    startedAt: start, finishedAt: now(), exitCode: result.status,
    signal: result.signal, error: result.error?.message ?? null,
    envOverrides: { PYTHONDONTWRITEBYTECODE: '1' },
    streams: { stdout: fact(prefix + '.stdout'), stderr: fact(prefix + '.stderr') },
  };
  write(prefix + '.json', JSON.stringify(receipt, null, 2) + '\n');
  process.stdout.write(result.stdout ?? Buffer.alloc(0));
  process.stderr.write(result.stderr ?? Buffer.alloc(0));
  console.log(JSON.stringify({ receipt: fact(prefix + '.json') }));
  process.exitCode = result.status ?? 1;
} else if (mode === 'seal') {
  const p = inside(name);
  const startedAt = now();
  fs.chmodSync(p, 0o444);
  const evidence = { operation: 'chmod', mode: '0444', startedAt, sealedAt: now(), file: fact(p) };
  write(path.join(own, 'seals', path.basename(p) + '.json'), JSON.stringify(evidence, null, 2) + '\n');
  console.log(JSON.stringify(evidence, null, 2));
} else if (mode === 'snapshot') {
  const input = inside(name), output = inside(args[0]);
  write(output, fs.readFileSync(input));
  fs.chmodSync(output, 0o444);
  const evidence = { operation: 'candidate-prefinalize-snapshot', sealedAt: now(), input: fact(input), file: fact(output) };
  write(path.join(own, 'seals', path.basename(output) + '.json'), JSON.stringify(evidence, null, 2) + '\n');
  console.log(JSON.stringify(evidence, null, 2));
} else if (mode === 'image') {
  const p = path.resolve(args[0]);
  const entry = {
    ordinal: Number(name), tool: 'functions.view_image', charged: 1,
    batch: 'fresh-nonfork-149150', purpose: args[1],
    attemptedAt: now(), source: fact(p),
  };
  if (entry.ordinal < 1 || entry.ordinal > 8) throw new Error('image budget');
  write(path.join(own, 'images', `${name.padStart(2, '0')}.json`), JSON.stringify(entry, null, 2) + '\n');
  console.log(JSON.stringify(entry, null, 2));
} else if (mode === 'facts') {
  console.log(JSON.stringify([name, ...args].map(fact), null, 2));
} else {
  throw new Error('unknown evidence mode');
}
