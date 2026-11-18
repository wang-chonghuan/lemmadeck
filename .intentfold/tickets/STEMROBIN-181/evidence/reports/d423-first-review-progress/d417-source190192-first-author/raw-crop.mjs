import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const input = path.join(root, 'work/10p/pages/0191/page.png');
const output = path.join(root, 'source-raw-crop-191-fig155.png');
const receiptPath = path.join(root, 'raw-crop.receipt.json');
assert(!fs.existsSync(output) && !fs.existsSync(receiptPath));
const python = '/Users/yong/.codex/worktrees/00b1/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python';
const argv = [python, '-B', '-c',
  'from PIL import Image; import sys; Image.open(sys.argv[1]).crop((970,1415,1330,1860)).save(sys.argv[2])',
  input, output];
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const result = spawnSync(argv[0], argv.slice(1), {
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1', TMPDIR: root },
  encoding: 'utf8',
});
fs.writeFileSync(receiptPath, JSON.stringify({
  argv, command_sha256: crypto.createHash('sha256').update(JSON.stringify(argv)).digest('hex'),
  invocation_count: 1, input: { path: input, sha256: hash(input) },
  output: fs.existsSync(output) ? { path: output, sha256: hash(output) } : null,
  raw_pixel_crop_xyxy: [970, 1415, 1330, 1860], scale: 1, transformations: 'crop-only-no-resize',
  exit_code: result.status, stdout: result.stdout, stderr: result.stderr,
  purpose: 'author-only-source-apparatus-detail-before-candidate; not independent RAW review',
}, null, 2) + '\n', { flag: 'wx' });
assert.equal(result.status, 0);
console.log(JSON.stringify({ path: output, sha256: hash(output) }));
