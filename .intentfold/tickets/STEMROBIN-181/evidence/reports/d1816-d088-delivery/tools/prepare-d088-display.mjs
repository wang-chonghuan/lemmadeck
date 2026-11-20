import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

assert.equal(process.cwd(), '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck');
const base = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-recovery';
const from = `${base}/check-d054-n14-offline.mjs`, to = `${base}/check-d088-n126-offline.mjs`;
const source = fs.readFileSync(from, 'utf8');
assert(source.includes("const ids = ['fig-18', 'fig-19'];"));
const derived = source.replaceAll('d054', 'd088').replaceAll('D054', 'D088')
  .replaceAll('n14', 'n126').replaceAll('phy10-c1-s2-n126', 'phy9-c2-s6-n126')
  .replace("const root = '.tmp/STEMROBIN-181/d1816-d088/n126-root/10p';",
    "const root = '.tmp/STEMROBIN-181/d1816-d088/root/9p';")
  .replace("const work = '.tmp/STEMROBIN-181/d1816-d088/n126-display';",
    "const work = '.tmp/STEMROBIN-181/d1816-d088/display';")
  .replace("const ids = ['fig-18', 'fig-19'];", "const ids = ['fig-286'];")
  .replace('assert.equal(raw.prose.length, 19);', 'assert.equal(raw.prose.length, 13);')
  .replaceAll('/render/10p/', '/render/9p/').replace('figuresPerSurface: 2', 'figuresPerSurface: 1');
assert(derived.includes("const id = 'phy9-c2-s6-n126';"));
assert(!derived.includes('10p') && !derived.includes('n14'));
fs.writeFileSync(to, derived, { flag: 'wx' });
const bind = p => ({ path: p, sha256: crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex') });
fs.writeFileSync(`${base}/d088-display-script-derivation.json`, JSON.stringify({
  original: bind(from), derived: bind(to),
  changes: ['batch paths', 'lesson id', 'book', 'figure ids', 'source-entry count'],
  browserAssertionsChanged: false,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ status: 'prepared-only', script: to }));
