import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const workspace = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const evidence = path.dirname(import.meta.filename);
const author = path.join(workspace, '.intentfold/tickets/STEMROBIN-181/tmp/d038-10p-source92-95-author');
const expectedFreeze = '04ee34cccb8bff3b62402cae0c99a6d4a550be57ffc393a4182401f08c6a4b65';
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bind = async file => {
  const bytes = await fs.readFile(file);
  return { path: file, sha256: hash(bytes), bytes: bytes.length };
};
const freeze = await bind(path.join(author, 'author-freeze.json'));
assert.equal(freeze.sha256, expectedFreeze);
const frozen = JSON.parse(await fs.readFile(freeze.path, 'utf8'));
const records = [];
const walk = async directory => {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const file = path.join(directory, entry.name);
    assert.equal(entry.isSymbolicLink(), false);
    if (entry.isDirectory()) {
      await walk(file);
    } else {
      assert.equal(entry.isFile(), true);
      const record = await bind(file);
      const snapshot = path.join(evidence, 'snapshots/author', path.relative(author, file));
      await fs.mkdir(path.dirname(snapshot), { recursive: true });
      await fs.copyFile(file, snapshot, fs.constants.COPYFILE_EXCL);
      assert.equal((await bind(snapshot)).sha256, record.sha256);
      records.push({ ...record, snapshot });
    }
  }
};
await walk(author);
const lookup = new Map(records.map(record => [record.path, record]));
let verifiedBindings = 0;
const verify = (record, actualPath = record.path) => {
  assert.equal(lookup.get(actualPath)?.sha256, record.sha256, actualPath);
  verifiedBindings += 1;
};
for (const page of frozen.pages) {
  verify(page.candidate);
  for (const prepared of page.prepared) {
    verify(prepared, path.join(author, 'work/10p/pages', String(page.page).padStart(4, '0'), path.basename(prepared.path)));
  }
}
for (const record of [...frozen.commands, ...frozen.prepareResults.map(item => item.record), frozen.inputFreeze]) {
  verify(record);
}
for (const output of frozen.outputs) {
  for (const record of [...output.files, output.commandRecord, ...output.figures.map(figure => figure.crop)]) {
    verify(record);
  }
}
const supporting = [
  'AGENTS.md',
  '.intentfold/readme.md',
  '.intentfold/project.json',
  '.intentfold/charter/product.md',
  '.intentfold/charter/engineering.md',
  '.intentfold/charter/operations.md',
  '.claude/skills/ld-s10y-lesson/SKILL.md',
  '.agents/skills/ld-s10y-image/SKILL.md',
  'ssot-resources/soviet10year-textbooks/toc/10p/zh.json',
  '.claude/skills/ld-s10y-lesson/profiles/soviet-cn.json',
];
for (const relative of supporting) {
  const file = path.join(workspace, relative);
  const record = await bind(file);
  const snapshot = path.join(evidence, 'snapshots/supporting', relative);
  await fs.mkdir(path.dirname(snapshot), { recursive: true });
  await fs.copyFile(file, snapshot, fs.constants.COPYFILE_EXCL);
  assert.equal((await bind(snapshot)).sha256, record.sha256);
  records.push({ ...record, snapshot });
}
const pdf = await bind(path.join(workspace, 'ssot-resources/soviet10year-textbooks/sources/soviet10years/10p 苏联中学课本 物理 十年级 .pdf'));
assert.equal(pdf.sha256, '7190041b66182e5f6c5a4ef7ae0b04ee3f1afa0df1f5b3ff6317b2c2d1cb8f40');
const result = {
  schema: 'stemrobin-181/source-review-inputs@1',
  ticket: 'STEMROBIN-181',
  capturedAt: new Date().toISOString(),
  authorFreeze: freeze,
  verifiedFrozenBindings: verifiedBindings,
  sourcePdf: pdf,
  snapshots: records,
};
await fs.writeFile(path.join(evidence, 'input-bindings.json'), `${JSON.stringify(result, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({ verifiedFrozenBindings: verifiedBindings, snapshotFiles: records.length, manifest: await bind(path.join(evidence, 'input-bindings.json')) }));
