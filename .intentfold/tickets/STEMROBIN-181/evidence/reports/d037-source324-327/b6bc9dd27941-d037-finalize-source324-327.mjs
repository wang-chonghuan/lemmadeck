import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const base = path.dirname(import.meta.filename);
const author = path.join(base, 'd037-source324-327-author');
const folder = path.join(base, 'd037-source324-327-native');
const reviewPath = path.join(base, 'd037-source324-327-review.json');
const review = JSON.parse(await fs.readFile(reviewPath, 'utf8'));
const bind = async file => ({
  path: path.resolve(file),
  sha256: crypto.createHash('sha256').update(await fs.readFile(file)).digest('hex'),
});
const save = async (file, data) => {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' });
};
const pages = [];
for (const page of [324, 325, 326, 327]) {
  const approved = review.candidateBindings.find(row => row.page === page);
  const stem = String(page).padStart(4, '0');
  const input = path.join(author, `initial/candidates/${stem}.page.md`);
  assert.equal((await bind(input)).sha256, approved.sha256);
  const text = await fs.readFile(input, 'utf8');
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  assert.ok(match);
  const meta = JSON.parse(match[1]);
  if (page !== 326) meta.counting = {
    edge_margin_px: 100,
    reason: 'Independent SOURCE review identified the extra post-footer band as lower-corner scan dirt, with no omitted printed text; counting-only edge mask preserves all source pixels and rows.',
  };
  let body = text.slice(match[0].length);
  const correction = page === 324 ? ['很小时线圈', '很小的线圈']
    : page === 326 ? ['电子象很小的球', '电子不象很小的球'] : null;
  if (correction) {
    assert.equal(body.split(correction[0]).length, 2);
    body = body.replace(...correction);
  }
  const candidate = `---\n${JSON.stringify(meta, null, 2)}\n---\n${body}`;
  const target = path.join(folder, `root/9p/pages/${stem}`);
  const work = path.join(folder, `work/9p/pages/${stem}`);
  await fs.mkdir(target, { recursive: true });
  await fs.mkdir(work, { recursive: true });
  await fs.writeFile(path.join(target, 'page.md'), candidate, { flag: 'wx' });
  assert.equal(candidate.slice(candidate.indexOf('\n---\n') + 5), body);
  for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md'])
    await fs.copyFile(path.join(author, `inputs/pages/${stem}/${name}`), path.join(work, name),
      fs.constants.COPYFILE_EXCL);
  const args = ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'finalize',
    '--book', '9p', '--page', String(page), '--root', path.join(folder, 'root'),
    '--work', path.join(folder, 'work')];
  const result = spawnSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', args,
    { encoding: 'utf8', timeout: 180000 });
  const receipt = path.join(folder, `finalize-${page}.json`);
  await save(receipt, { args, exitCode: result.status, stdout: result.stdout, stderr: result.stderr });
  pages.push({ page, correction, original: await bind(input), command: await bind(receipt),
    exitCode: result.status, outputs: await Promise.all(['page.md', 'page.json', 'audit.json']
      .map(name => bind(path.join(target, name)))) });
}
await save(path.join(folder, 'result.json'), {
  ticket: 'STEMROBIN-181', sourceReview: await bind(reviewPath), pages,
  status: pages.every(row => row.exitCode === 0) ? 'PASS-native-exact-crops-pending' : 'FAIL-preserved',
  originalFailuresPreserved: true, sourceTextChanges: 'Only the two independently observed literal corrections.',
  imageOpens: 0,
});
console.log(JSON.stringify(pages.map(({ page, exitCode }) => ({ page, exitCode }))));
