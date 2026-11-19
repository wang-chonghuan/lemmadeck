import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

assert.equal(process.cwd(), '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck');
const source = '/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck';
const root = '.tmp/STEMROBIN-181/d1818/isotope-root/10p';
const bindings = [];
for (const file of [`${root}/book.json`, ...['modern-us-neutral', 'modern-us-neutral-en'].map(edition => `${root}/editions/${edition}/book.json`)]) {
  const bytes = fs.readFileSync(path.join(source, file));
  const target = file;
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, bytes, { flag: 'wx' });
  bindings.push({ path: file, sha256: crypto.createHash('sha256').update(bytes).digest('hex') });
}
fs.writeFileSync('.intentfold/tickets/STEMROBIN-181/tmp/d1816-recovery/display-index-recovery.json',
  JSON.stringify({ source, scope: 'Small isolated D042 indexes for native selected render only.', bindings }, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ indexes: bindings, deliveredCardsAdded: 0 }));
