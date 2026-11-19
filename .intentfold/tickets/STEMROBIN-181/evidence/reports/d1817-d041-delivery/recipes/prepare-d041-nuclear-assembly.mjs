import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

assert.equal(process.cwd(), '/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck');
const pages = process.argv.slice(2).map(Number);
assert(pages.length && pages.every(page => Number.isInteger(page) && page >= 330 && page <= 420));
assert.equal(new Set(pages).size, pages.length);
const input = '.tmp/STEMROBIN-181/d1817/root/10p';
const output = '.tmp/STEMROBIN-181/d1817/nuclear-root/10p';
const read = file => JSON.parse(fs.readFileSync(file));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({ path: file, sha256: hash(file) });
const records = [];
for (const page of pages) {
  const number = String(page).padStart(4, '0');
  const audit = read(`${input}/pages/${number}/audit.json`);
  assert.deepEqual(audit.errors, [], `Failed page ${page} is not an assembly input`);
  const retained = [];
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    const source = `${input}/pages/${number}/${name}`;
    const target = `${output}/pages/${number}/${name}`;
    fs.mkdirSync(path.dirname(target), { recursive: true });
    if (fs.existsSync(target)) assert.equal(hash(target), hash(source), 'Existing input must remain byte-identical');
    else fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL);
    retained.push({ source: bind(source), target: bind(target) });
  }
  records.push({ page, retained, nativeApprovalOnly: true });
}
const file = `.intentfold/tickets/STEMROBIN-181/tmp/d1814-recovery/d041-nuclear-input-${pages[0]}-${pages.at(-1)}.json`;
assert(!fs.existsSync(file));
fs.writeFileSync(file, JSON.stringify({
  batch: 'D041', input, output, pages, records,
  excluded: 'All atomic pages<=329, especially failed326. No existing n124 raw or modern lesson is rewritten.',
  rootIsIsolatedAssemblyInput: true, sourceCardApproval: false, addedDeliveredCards: 0,
  parentNewImageOpens: 0, paidCalls: 0, databaseWrites: false,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ inputReceipt: bind(file), pages, assemblyRoot: path.dirname(output) }));
