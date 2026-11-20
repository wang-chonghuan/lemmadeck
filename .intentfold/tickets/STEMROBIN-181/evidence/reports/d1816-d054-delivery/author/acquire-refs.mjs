import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const root = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
if (process.cwd() !== root) throw new Error('Wrong cwd');
const out = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d054-n14-author');
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const refs = [
  ['R1-UVA-http', 'http://galileo.phys.virginia.edu/classes/152.mf1i.spring02/Oscillations4.htm'],
  ['R2-UNSW', 'https://www.animations.physics.unsw.edu.au/jw/oscillations.htm'],
];
fs.mkdirSync(path.join(out, 'references'), { recursive: true });
const receiptPath = path.join(out, 'reference-acquisition.json');
const receipts = fs.existsSync(receiptPath) ? JSON.parse(fs.readFileSync(receiptPath)) : [];
for (const [id, url] of refs) {
  const result = spawnSync('cloak-fetch', [url], {
    cwd: root, encoding: 'utf8', timeout: 240000, maxBuffer: 20 * 1024 * 1024,
  });
  const stdout = path.join(out, 'references', `${id}.stdout.txt`);
  const stderr = path.join(out, 'references', `${id}.stderr.txt`);
  fs.writeFileSync(stdout, result.stdout || '');
  fs.writeFileSync(stderr, result.stderr || '');
  receipts.push({
    role: 'AUTHOR', id, url, command: ['cloak-fetch', url], cwd: root,
    exitCode: result.status, error: result.error?.message || null,
    stdout: { path: stdout, sha256: sha(result.stdout || '') },
    stderr: { path: stderr, sha256: sha(result.stderr || '') },
    actualRenderedRead: result.status === 0,
  });
  fs.writeFileSync(path.join(out, 'reference-acquisition.json'), JSON.stringify(receipts, null, 2) + '\n');
  console.log(JSON.stringify(receipts.at(-1)));
}
