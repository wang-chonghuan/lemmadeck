import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const [label, executable, ...args] = process.argv.slice(2);
const out = path.dirname(new URL(import.meta.url).pathname);
const target = path.join(out, label);
if (fs.existsSync(`${target}.command.json`)) throw new Error(`Preserved command exists: ${label}`);
const environment = { PYTHONDONTWRITEBYTECODE: '1' };
const result = spawnSync(executable, args, {
  cwd: process.cwd(),
  env: { ...process.env, ...environment },
  encoding: 'utf8',
  maxBuffer: 16 * 1024 * 1024,
});
fs.writeFileSync(`${target}.stdout.txt`, result.stdout || '');
fs.writeFileSync(`${target}.stderr.txt`, result.stderr || '');
fs.writeFileSync(`${target}.command.json`, JSON.stringify({
  argv: [executable, ...args], cwd: process.cwd(),
  environment_overrides: environment, exit_code: result.status,
  error: result.error?.message || null,
}, null, 2) + '\n');
process.stdout.write(result.stdout || '');
process.stderr.write(result.stderr || '');
process.exit(result.status ?? 1);
