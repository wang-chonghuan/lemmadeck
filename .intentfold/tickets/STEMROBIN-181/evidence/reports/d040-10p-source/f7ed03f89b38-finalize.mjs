import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const folder = path.dirname(import.meta.filename);
const pages = [96, 97, 98, 99];
const bind = async file => ({
  path: path.resolve(file),
  sha256: crypto.createHash('sha256').update(await fs.readFile(file)).digest('hex'),
});
const save = async (name, value) => fs.writeFile(path.join(folder, name),
  `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
const observations = JSON.parse(await fs.readFile(path.join(folder, 'source-observations.json'), 'utf8'));
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
const bindings = await Promise.all([
  'AGENTS.md', '.intentfold/readme.md', '.intentfold/project.json',
  '.intentfold/charter/engineering.md', '.intentfold/charter/operations.md',
  '.claude/skills/ld-s10y-lesson/SKILL.md', '.agents/skills/ld-s10y-image/SKILL.md',
  '.claude/skills/ld-s10y-lesson/tools/p2c.py',
  '.claude/skills/ld-s10y-lesson/tools/blocks.py',
  '.claude/skills/ld-s10y-lesson/tools/layout.py',
  '.claude/skills/ld-s10y-lesson/tools/normalize.py',
  '.claude/skills/ld-s10y-lesson/tools/mathcheck.py',
  '.claude/skills/ld-s10y-lesson/profiles/soviet-cn.json',
  'ssot-resources/soviet10year-textbooks/sources/manifest.json',
  'ssot-resources/soviet10year-textbooks/toc/10p/zh.json',
  'ssot-resources/soviet10year-textbooks/sources/soviet10years/10p 苏联中学课本 物理 十年级 .pdf',
  '.intentfold/tickets/STEMROBIN-181/tmp/d038-10p-source92-95-author/candidates/0095.page.md',
].map(bind));
const crops = await Promise.all(['0099-name-and-voltage-crop.png', '0096-footnote-crop.png']
  .map(name => bind(path.join(folder, name))));
await save('input-freeze.json', {
  book: '10p', pages: inputs, commands, prepareResults, bindings, crops,
  observations: await bind(path.join(folder, 'source-observations.json')),
  sourceApproval: false, imageOpens: observations.imageOpens, opened: observations.opened,
  authority: 'Existing lesson finalize once per new page; isolated native counts/crops only. Initial FAIL retained without retries. No SOURCE selfapproval.',
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
    stdout: result.stdout, stderr: result.stderr, error: result.error?.message ?? null,
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
  outputs.push({ page, files, figures, linesPrinted: audit.lines_printed,
    linesMd: audit.lines_md, errors: audit.errors,
    commandRecord: await bind(path.join(folder, `finalize-${page}.json`)) });
}
for (const binding of bindings) {
  assert.equal((await bind(binding.path)).sha256, binding.sha256,
    `Read-only binding changed during native finalize: ${binding.path}`);
}
await save('author-freeze.json', {
  book: '10p', pages: inputs, commands, prepareResults, nativeResults: results,
  outputs, inputFreeze: await bind(path.join(folder, 'input-freeze.json')),
  sourceApproval: false, imageOpens: observations.imageOpens,
  cardBoundaries: observations.cardBoundaries, openContinuations: observations.openContinuations,
  remaining: [
    'SOURCE semantic approval and independent figure review remain pending; native results are not SOURCE approval.',
    'PDF99 n35 p open continues into unseen PDF100. No n35 right-boundary claim.',
    'Initial candidates and every first finalize receipt retained unchanged; no retries.',
    ...outputs.flatMap(output => output.errors.map(error => `PDF${output.page}: ${error}`)),
  ],
});
console.log(JSON.stringify(results.map(({ page, exitCode, stdout }) => ({ page, exitCode, stdout }))));
