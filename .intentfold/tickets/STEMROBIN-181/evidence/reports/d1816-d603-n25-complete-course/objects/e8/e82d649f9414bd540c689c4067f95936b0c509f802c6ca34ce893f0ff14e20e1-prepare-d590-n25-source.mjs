import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const base = '.tmp/STEMROBIN-181/d1816-d590';
const root = `${base}/root`;
const work = `${base}/work`;
const out = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d590-n25-first-source';
assert(!fs.existsSync(base));
fs.mkdirSync(out, { recursive: true });
const bindings = [];
const copy = (source, target) => {
  const bytes = fs.readFileSync(source);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, bytes, { flag: 'wx' });
  bindings.push({ source, target, sha256: crypto.createHash('sha256').update(bytes).digest('hex') });
};
const sources = [
  ['0067', 'ssot-resources/soviet10year-textbooks/artifacts/10p/pages/0067'],
  ['0068', '.tmp/STEMROBIN-181/d1816-d203/root/10p/pages/0068'],
  ['0069', '.tmp/STEMROBIN-181/d1816-d221/root/10p/pages/0069'],
];
for (const [page, source] of sources) {
  for (const file of ['page.json', 'page.md', 'audit.json']) {
    copy(`${source}/${file}`, `${root}/10p/pages/${page}/${file}`);
  }
}
for (const [page, source, figures] of [
  ['0067', `${sources[0][1]}/figures`, ['fig-40', 'fig-41']],
  ['0069', '.tmp/STEMROBIN-181/d1816-d208/source-work/10p/pages/0069/figures', ['fig-42']],
]) {
  for (const figure of figures) {
    for (const extension of ['png', 'svg']) {
      copy(`${source}/${figure}.${extension}`, `${work}/10p/pages/${page}/figures/${figure}.${extension}`);
    }
  }
}
const command = [
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'assemble', '--book', '10p',
  '--toc', 'ssot-resources/soviet10year-textbooks/toc/10p/zh.json',
  '--root', root, '--work', work,
];
const result = spawnSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', command, { encoding: 'utf8', cwd: repo });
fs.writeFileSync(`${out}/assemble.stdout.txt`, result.stdout);
fs.writeFileSync(`${out}/assemble.stderr.txt`, result.stderr);
fs.writeFileSync(`${out}/result.json`, JSON.stringify({
  lesson: 'phy10-c1-s3-n25', command, exitCode: result.status, bindings,
  sourceGlyphHoldsPreserved: ['D209-H1', 'D209-H2', 'D209-H3', 'D209-H4'],
  sourceReviewReplayed: false, canonicalSourceWrites: false, sourcePagesAdded: 0,
  completeCoursesAdded: 0, databaseWrites: false,
}, null, 2) + '\n', { flag: 'wx' });
console.log(result.stdout);
console.log(JSON.stringify({ exitCode: result.status, root, work, out }));
process.exitCode = result.status;
