import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const folder = path.dirname(import.meta.filename);
const pages = [88, 89, 90, 91];
const bind = async file => ({
  path: path.resolve(file),
  sha256: crypto.createHash('sha256').update(await fs.readFile(file)).digest('hex'),
});
const save = async (name, value) => fs.writeFile(path.join(folder, name),
  `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
const inputs = [];
for (const page of pages) {
  const stem = String(page).padStart(4, '0');
  const prepared = `.tmp/ld-s10y-lesson/10p/pages/${stem}`;
  const candidate = path.join(folder, `candidates/${stem}.page.md`);
  const destination = path.join(folder, `root/10p/pages/${stem}`);
  const work = path.join(folder, `work/10p/pages/${stem}`);
  await fs.mkdir(destination, { recursive: true });
  await fs.mkdir(work, { recursive: true });
  await fs.copyFile(candidate, path.join(destination, 'page.md'), fs.constants.COPYFILE_EXCL);
  const records = [];
  for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md']) {
    records.push(await bind(`${prepared}/${name}`));
    await fs.copyFile(`${prepared}/${name}`, path.join(work, name), fs.constants.COPYFILE_EXCL);
  }
  inputs.push({ page, candidate: await bind(candidate), prepared: records });
}
await save('input-freeze.json', {
  book: '10p', pages: inputs, sourceApproval: false,
  imageOpens: 4, opened: ['0088/page.png', '0089/page.grid.png',
    '0090/page.grid.png', '0091/page.grid.png'],
  authority: 'Existing lesson finalize; isolated output only. No source, figure or full-card selfapproval.',
});
const results = [];
for (const page of pages) {
  const args = ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'finalize',
    '--book', '10p', '--page', String(page), '--root', path.join(folder, 'root'),
    '--work', path.join(folder, 'work')];
  const result = spawnSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', args,
    { encoding: 'utf8', timeout: 180000 });
  const record = {
    page, args, exitCode: result.status, signal: result.signal,
    stdout: result.stdout, stderr: result.stderr,
  };
  await save(`finalize-${page}.json`, record);
  results.push(record);
  assert.equal(result.error, undefined);
}
await save('author-freeze.json', {
  book: '10p', pages: inputs, nativeResults: results, sourceApproval: false,
  cardBoundaries: {
    n31: 'Actual89 n31 heading through90, closed by actual90 n32 heading; zero tasks/figures.',
    n32: 'Begins90, continues beyond91; fig57 and source back-reference26; not complete.',
    t15: 'Exercise11 ends on88, prior tasks outside this source author scope.',
  },
});
console.log(JSON.stringify(results.map(({ page, exitCode, stdout }) => ({ page, exitCode, stdout }))));
