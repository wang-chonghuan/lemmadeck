import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const folder = path.dirname(import.meta.filename);
const ticketTmp = path.dirname(folder);
const repo = process.cwd();
const card = 'phy10-c1-s4-n35';
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python');
const pipeline = path.join(repo, '.claude/skills/ld-s10y-lesson/tools/p2c.py');
const toc = path.join(repo, 'ssot-resources/soviet10year-textbooks/toc/10p/zh.json');
const save = async (file, data) => {
  const target = path.join(folder, file);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' });
};
const bind = async file => ({
  path: path.resolve(file),
  sha256: crypto.createHash('sha256').update(await fs.readFile(file)).digest('hex'),
});
const copy = async (source, relative) => {
  const target = path.join(folder, relative);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.copyFile(source, target, 1);
  const original = await bind(source);
  const snapshot = await bind(target);
  assert.equal(snapshot.sha256, original.sha256);
  return { original, snapshot };
};
const run = async (name, command, args) => {
  const result = spawnSync(command, args, {
    cwd: repo, encoding: 'utf8', timeout: 180000,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  });
  await save(`${name}.json`, {
    command, args, exitCode: result.status, signal: result.signal,
    stdout: result.stdout, stderr: result.stderr, error: result.error?.message ?? null,
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  console.log(result.stdout.trim());
};

const catalog = JSON.parse(await fs.readFile(toc, 'utf8'));
const cards = catalog.contents.flatMap(chapter =>
  chapter.lessons.flatMap(section => section.topics ?? [section]));
const entry = cards.find(item => item.id === card);
assert.deepEqual(
  { id: entry.id, number: entry.printedNumber, title: entry.title, page: entry.page },
  { id: card, number: 35, title: '电能的输送', page: 89 },
);
assert.equal(cards[cards.indexOf(entry) + 1].printedNumber, 36);
assert.equal(cards[cards.indexOf(entry) + 1].page, 91);
const inputs = [];
for (const page of [99, 100, 101]) {
  const owner = path.join(ticketTmp, page === 99
    ? 'd038-10p-source96-99-author' : 'd039-10p-source100-103-author');
  const number = String(page).padStart(4, '0');
  const audit = JSON.parse(await fs.readFile(
    path.join(owner, `root/10p/pages/${number}/audit.json`), 'utf8'));
  const receipt = JSON.parse(await fs.readFile(path.join(owner, `finalize-${page}.json`), 'utf8'));
  assert.equal(receipt.exitCode, 0);
  assert.deepEqual(audit.errors, []);
  assert.equal(audit.lines_printed, audit.lines_md);
  for (const file of ['page.md', 'page.json', 'audit.json']) {
    inputs.push(await copy(
      path.join(owner, `root/10p/pages/${number}/${file}`),
      `root/10p/pages/${number}/${file}`));
  }
  inputs.push(await copy(path.join(owner, `finalize-${page}.json`),
    `inputs/receipts/finalize-${page}.json`));
}
const sourceCrop = path.join(ticketTmp,
  'd039-10p-source100-103-author/work/10p/pages/0100/figures/fig-63.png');
inputs.push(await copy(sourceCrop, 'work/10p/pages/0100/figures/fig-63.png'));
const review = path.join(ticketTmp, 'd038-10p-source96-99-review.json');
inputs.push(await copy(review, 'inputs/reviews/d038-10p-source96-99-review.json'));
const page99 = JSON.parse(await fs.readFile(review, 'utf8')).pages
  .find(item => item.physicalPage === 99);
assert.equal(page99.sourceFidelity, 'pass');
assert.equal(page99.nativeGate, 'pass-retained-25/25');
assert.equal(page99.pageJsonSha256, (await bind(path.join(folder,
  'root/10p/pages/0099/page.json'))).sha256);
const instructionBindings = [];
for (const file of [
  'AGENTS.md',
  '.claude/skills/ld-s10y-lesson/SKILL.md',
  '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json',
  '.claude/skills/ld-s10y-lesson/references/edition-text-contract.md',
  '.claude/skills/ld-s10y-lesson/tools/p2c.py',
  '.claude/skills/ld-s10y-lesson/tools/assemble.py',
  '.claude/skills/ld-s10y-lesson/tools/edition.py',
  'ssot-resources/soviet10year-textbooks/toc/10p/zh.json',
]) instructionBindings.push(await bind(path.join(repo, file)));
await save('input-freeze.json', {
  schema: 'ld-s10y-lesson/bounded-author-input-freeze@1',
  ticket: 'STEMROBIN-181', card, inputs, instructionBindings,
  sourceReview: { page99: 'PASS', pages100101: 'pending', page96HoldOutOfScope: true },
  imagesOpened: 0, modernFiguresAuthored: 0,
});
await run('assemble', python, [
  '-B', pipeline, 'assemble', '--book', '10p', '--toc', toc,
  '--root', path.join(folder, 'root'), '--work', path.join(folder, 'work'),
]);
await fs.cp(path.join(folder, 'root'), path.join(folder, 'root-en'), {
  recursive: true, errorOnExist: true, force: false,
});
for (const language of ['zh', 'en']) {
  const root = path.join(folder, language === 'zh' ? 'root' : 'root-en');
  const work = path.join(folder, language === 'zh' ? 'work' : 'work-en');
  await run(`adapt-prepare-${language}`, python, [
    '-B', pipeline, 'adapt-prepare', '--book', '10p',
    '--edition', 'modern-us-neutral', '--lesson', card, '--root', root, '--work', work,
  ]);
}
for (const item of inputs) {
  assert.equal((await bind(item.original.path)).sha256, item.original.sha256);
  assert.equal((await bind(item.snapshot.path)).sha256, item.snapshot.sha256);
}
