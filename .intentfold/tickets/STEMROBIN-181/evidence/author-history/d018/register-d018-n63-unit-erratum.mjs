import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import {
  ticket, book, bytes, read, bind, verify, immutableWrite,
} from './retain-d016-evidence.mjs';

const [phase] = process.argv.slice(2);
assert.ok(['preserve', 'finalize'].includes(phase));
const work = `${ticket}/tmp/d018-n63-unit-erratum`;
const pageFolder = `${book}/pages/0157`;
const sourceFolder = `${book}/lessons/phy9-c2-s2-n63`;
const manifestPath = `${work}/before.json`;
if (phase === 'preserve') {
  const preserved = [];
  for (const [folder, files] of [
    [pageFolder, ['page.md', 'page.json', 'audit.json']],
    [sourceFolder, ['lesson.json', 'exercises.json']],
  ]) {
    for (const name of files) {
      const file = `${folder}/${name}`;
      const copy = `${work}/before/${folder === pageFolder ? 'page' : 'lesson'}/${name}`;
      await immutableWrite(copy, await bytes(file));
      preserved.push({ active: await bind(file), preserved: await bind(copy) });
    }
  }
  await immutableWrite(manifestPath, `${JSON.stringify({
    ticket: 'STEMROBIN-181', status: 'preserved-before-source-metadata-erratum',
    preserved, sourceFinalization: await bind(`${ticket}/tmp/source-review-9p-0156-0159-finalization-trace.json`),
  }, null, 2)}\n`);
} else {
  const manifest = await read(manifestPath);
  const oldText = (await bytes(`${work}/before/page/page.md`)).toString();
  const currentText = (await bytes(`${pageFolder}/page.md`)).toString();
  const parse = text => {
    assert.ok(text.startsWith('---\n'));
    const end = text.indexOf('\n---\n', 4);
    return { meta: JSON.parse(text.slice(4, end)), body: text.slice(end + 5) };
  };
  const before = parse(oldText);
  const after = parse(currentText);
  assert.equal(after.body, before.body, 'Never correct the original printed body');
  assert.equal(after.meta.errata.length, 1);
  const erratum = after.meta.errata[0];
  assert.equal(erratum.id, 'p0157-vacuum-permittivity-unit-square');
  assert.equal(erratum.block, 'p0157#14');
  assert.equal(after.meta.notes.length, before.meta.notes.length + 1);
  const compare = structuredClone(after.meta);
  compare.notes.pop();
  compare.errata = [];
  assert.deepEqual(compare, before.meta, 'Metadata change must be only the note and erratum');
  const operations = [];
  const run = args => {
    const output = execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', args, { encoding: 'utf8' });
    process.stdout.write(output);
    operations.push({ command: args, output });
  };
  run(['.claude/skills/ld-s10y-lesson/tools/p2c.py', 'finalize', '--book', '9p', '--page', '157']);
  const audit = await read(`${pageFolder}/audit.json`);
  assert.deepEqual(audit.errors, []);
  assert.equal(audit.lines_md, 23);
  assert.equal(audit.lines_printed, 23);
  assert.deepEqual((await read(`${pageFolder}/page.json`)).blocks,
    (await read(`${work}/before/page/page.json`)).blocks);
  run(['.claude/skills/ld-s10y-lesson/tools/p2c.py', 'assemble', '--book', '9p',
    '--toc', 'ssot-resources/soviet10year-textbooks/toc/9p/zh.json']);
  for (const name of ['lesson.json', 'exercises.json']) {
    assert.deepEqual(await bytes(`${sourceFolder}/${name}`), await bytes(`${work}/before/lesson/${name}`));
  }
  const code = [
    'import sys,json; from pathlib import Path',
    "sys.path.insert(0,'.claude/skills/ld-s10y-lesson/tools')",
    'import edition',
    `book=Path('${book}'); folder=Path('${sourceFolder}')`,
    "records=edition.source_errata(book,edition.load(folder/'lesson.json'),edition.load(folder/'exercises.json'))",
    "assert len(records)==1 and records[0]['source']['block']=='p0157#14'",
    'print(json.dumps(records,ensure_ascii=False,indent=2))',
  ].join('\n');
  const registered = JSON.parse(execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python',
    ['-c', code], { encoding: 'utf8' }));
  for (const item of manifest.preserved) await verify(item.preserved.path, item.preserved.sha256);
  await immutableWrite(`${work}/registered.json`, `${JSON.stringify(registered, null, 2)}\n`);
  await immutableWrite(`${ticket}/tmp/d018-n63-source-unit-erratum.json`, `${JSON.stringify({
    ticket: 'STEMROBIN-181', status: 'source-metadata-erratum-registered',
    preserved: await bind(manifestPath), registered: await bind(`${work}/registered.json`),
    page: await bind(`${pageFolder}/page.json`), audit: await bind(`${pageFolder}/audit.json`),
    operations, originalBodyBlocksRowsPixelsAndSourceLessonBytesUnchanged: true,
    scientificBasis: 'Printed k unit is N*m^2/C^2 and epsilon0=1/(4*pi*k); both sides must therefore have C^2/(N*m^2). Only the final printed unit lacks the exponent2.',
    approval: 'Registry only. The future modern correction requires n63 unique independent SCI; no new source pixel gate or modern approval here.',
  }, null, 2)}\n`);
}
