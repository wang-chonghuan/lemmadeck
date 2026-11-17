import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const folder = path.dirname(import.meta.filename);
const pages = [92, 93, 94, 95];
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
  inputs.push({ page, printedPage: page - 10, candidate: await bind(candidate), prepared: records });
}
const commands = await Promise.all(['prepare.mjs', 'finalize.mjs'].map(name => bind(path.join(folder, name))));
const prepareResults = await Promise.all(pages.map(async page => ({
  record: await bind(path.join(folder, `prepare-${page}.json`)),
  outcome: JSON.parse(await fs.readFile(path.join(folder, `prepare-${page}.json`), 'utf8')),
})));
await save('input-freeze.json', {
  book: '10p', pages: inputs, commands, prepareResults, sourceApproval: false,
  imageOpens: 5, opened: ['0092/page.grid.png', '0093/page.grid.png',
    '0093/page.png', '0094/page.grid.png', '0095/page.grid.png'],
  authority: 'Existing lesson finalize once per new page; isolated native counts/crops only. No source, figure or full-card selfapproval.',
});
const results = [];
const outputs = [];
for (const page of pages) {
  const args = ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'finalize',
    '--book', '10p', '--page', String(page), '--root', path.join(folder, 'root'),
    '--work', path.join(folder, 'work')];
  const result = spawnSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', args,
    { encoding: 'utf8', timeout: 180000 });
  const record = {
    page, args, exitCode: result.status, signal: result.signal,
    stdout: result.stdout, stderr: result.stderr,
    error: result.error?.message ?? null,
  };
  await save(`finalize-${page}.json`, record);
  results.push(record);
  assert.equal(result.error, undefined);
  const stem = String(page).padStart(4, '0');
  const files = await Promise.all(['page.md', 'page.json', 'audit.json'].map(name =>
    bind(path.join(folder, `root/10p/pages/${stem}/${name}`))));
  const audit = JSON.parse(await fs.readFile(path.join(folder, `root/10p/pages/${stem}/audit.json`), 'utf8'));
  const figures = await Promise.all(audit.figures.map(async figure => ({
    ...figure, crop: await bind(path.join(folder, `work/10p/pages/${stem}/figures/${figure.id}.png`)),
    independentSourceReview: 'pending',
  })));
  outputs.push({ page, files, figures, errors: audit.errors,
    commandRecord: await bind(path.join(folder, `finalize-${page}.json`)) });
}
await save('author-freeze.json', {
  book: '10p', pages: inputs, commands, prepareResults, nativeResults: results,
  outputs, inputFreeze: await bind(path.join(folder, 'input-freeze.json')),
  sourceApproval: false, imageOpens: 5,
  cardBoundaries: {
    n32: 'phy10-c1-s4-n32: only PDF92 continuation authored here; closes immediately before literal 33. 变压器 heading on PDF92/printed82. Earlier PDF90-91 and fig57 remain outside ownership; no exercises or new figures in its PDF92 tail.',
    n33: 'phy10-c1-s4-n33: starts at literal 33. 变压器 on PDF92/printed82, continues PDF93-95/printed83-85. No next heading observed; the complete final PDF95 paragraph does not prove the card right boundary. figs58-60 on PDF93; zero exercises in this batch.',
  },
  openContinuations: [
    { incoming: 'PDF91 p open n32', outgoing: 'PDF92 p cont', literal: '紧压在圆环上的不动的' + '板——电刷把转子绕组和外电路联接起来.' },
    { incoming: 'PDF92 final p open n33', outgoing: 'PDF93 first p cont', literal: '同时，电能的实际应用中最经常要求的是不太高的电压' },
    { incoming: 'PDF93 final p open n33', outgoing: 'PDF94 first p cont', literal: '在初级或次级绕组的任一匝中都是相同的' },
    { incoming: 'PDF94 final p open n33', outgoing: 'PDF95 first p cont', literal: '可用电压的有效值 U1 和 U2 的比来代替：' + '(3.7)' },
  ],
  remaining: [
    'All SOURCE semantic approval and independent figure review remain pending; native counts are not SOURCE approval.',
    'n33 next-card boundary is outside authorized PDF92-95; no PDF96 was opened.',
    'Isolated source ink stroke near PDF95 x1235,y1875 recorded in notes, not promoted to text.',
    ...outputs.flatMap(output => output.errors.map(error => `PDF${output.page}: ${error}`)),
  ],
});
console.log(JSON.stringify(results.map(({ page, exitCode, stdout }) => ({ page, exitCode, stdout }))));
