import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

assert.equal(process.cwd(), '/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck');
const input = '.tmp/STEMROBIN-181/d1817/root/10p';
const output = '.tmp/STEMROBIN-181/d1817/n128-root/10p';
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const records = [];
for (const page of [335, 336, 337]) {
  const number = String(page).padStart(4, '0');
  assert.deepEqual(JSON.parse(fs.readFileSync(`${input}/pages/${number}/audit.json`)).errors, []);
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    const source = `${input}/pages/${number}/${name}`;
    const target = `${output}/pages/${number}/${name}`;
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL);
    records.push({ source, target, sha256: hash(target) });
  }
}
const file = '.intentfold/tickets/STEMROBIN-181/tmp/d1814-recovery/d041-n128-assembly-input.json';
fs.writeFileSync(file, JSON.stringify({
  batch: 'D041', input, output, records, sourceApproval: false,
  note: 'Isolated335-337 assembly only. Existing reviewed n124 and n126 outputs are not assembly targets.',
  heldAdjacentObjects: ['unit127', 'unit129', 'figure263-left-ray-glyph'],
  parentNewImageOpens: 0, addedDeliveredCards: 0,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ file, sha256: hash(file), assemblyRoot: path.dirname(output) }));
