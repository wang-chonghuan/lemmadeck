import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/tmp/d1816-d354-source388390-punctuation-repair`;
const root = '.tmp/STEMROBIN-181/d1816-d354/root';
const work = '.tmp/STEMROBIN-181/d1816-d354/source-work';
const bind = file => ({ path: path.resolve(file),
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') });
const pages = [
  { page: 388, stage: 'd319', token: ['绝对的固态：', '绝对的固态.'],
    note: ['末段引文中“绝对的固态”后原像素显示双点冒号，忠实保留。',
      'D349 局部独立复核确认“绝对的固态”后为单个低位句点，修正原先双点冒号注记并忠实保留句点。'] },
  { page: 390, stage: 'd335', token: ['要复杂；', '要复杂：'],
    note: ['局部裁图确认“想像”的末字为“像”；“复杂”和“规律”后的原印刷标点均为分号，保留。',
      '局部裁图确认“想像”的末字为“像”；D349 独立复核确认“复杂”后为冒号，“规律”后为分号，分别忠实保留。'] },
];
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
};
if (process.argv[2] === 'prepare') {
  assert(!fs.existsSync(O));
  for (const { page, stage } of pages) {
    const p = String(page).padStart(4, '0');
    const base = `.tmp/STEMROBIN-181/d1816-${stage}`;
    copy(`${base}/root/10p/pages/${p}/page.md`, `${O}/${p}.before.page.md`);
    copy(`${base}/root/10p/pages/${p}/page.md`, `${root}/10p/pages/${p}/page.md`);
    for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md'])
      copy(`${base}/source-work/10p/pages/${p}/${name}`, `${work}/10p/pages/${p}/${name}`);
  }
} else if (process.argv[2] === 'finalize') {
  assert(!fs.existsSync(`${O}/author-freeze.json`));
  const outputs = [];
  for (const { page, token, note } of pages) {
    const p = String(page).padStart(4, '0');
    const before = fs.readFileSync(`${O}/${p}.before.page.md`, 'utf8');
    const target = `${root}/10p/pages/${p}/page.md`;
    assert.equal(before.split(token[0]).length, 2);
    assert.equal(before.split(note[0]).length, 2);
    assert.equal(fs.readFileSync(target, 'utf8'), before.replace(token[0], token[1]).replace(note[0], note[1]));
    execFileSync('node', [
      `${T}/tmp/d1816-recovery/run-native.mjs`, `d354-source${page}-punctuation-only-finalize`,
      '.claude/skills/ld-s10y-lesson/.venv/bin/python',
      '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'finalize',
      '--book', '10p', '--page', String(page), '--root', root, '--work', work,
    ], { cwd: repo, stdio: 'inherit' });
    copy(target, `${O}/${p}.after.page.md`);
    outputs.push({ page, before: bind(`${O}/${p}.before.page.md`),
      after: bind(`${O}/${p}.after.page.md`), pageJson: bind(`${root}/10p/pages/${p}/page.json`),
      source: bind(`${work}/10p/pages/${p}/page.png`), token, note });
  }
  fs.writeFileSync(`${O}/author-freeze.json`, JSON.stringify({
    stage: 'D354', review: bind(`${T}/tmp/d1816-d349-source390391-affected-review/report.json`),
    root, work, outputs, scope: 'Two confirmed archival punctuation marks and their contradictory notes only.',
    imagesOpened: 0, contentRepairs: 1, affectedReviewPending: true,
    sourcePagesAdded: 0, completeCoursesAdded: 0, paidCalls: 0,
  }, null, 2) + '\n');
} else {
  throw new Error('Expected prepare or finalize');
}
