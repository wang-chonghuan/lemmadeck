import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

assert.equal(process.cwd(), '/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck');
const scratch = '.intentfold/tickets/STEMROBIN-181/tmp/d1814-recovery';
const work = '.tmp/STEMROBIN-181/d1817/author-work/adapt/10p';
const id = 'phy10-c3-s3-n128';
const read = file => JSON.parse(fs.readFileSync(file));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({ path: file, sha256: hash(file) });
const authored = read(`${scratch}/d041-n128-first-author.json`);
const firstFormat = read(`${scratch}/d041-n128-format-and-sections.json`);
const records = [];
const formatter = [
  'import json, sys',
  'sys.path.insert(0, ".claude/skills/ld-s10y-lesson/tools")',
  'import edition',
  'document = json.load(sys.stdin)',
  'for index in document["affected"]:',
  '    document["prose"][index]["text"] = edition.normalize_prose_layout(document["prose"][index]["text"])',
  'del document["affected"]',
  'print(json.dumps(document, ensure_ascii=False))',
].join('\n');
for (const record of firstFormat.records) {
  const file = `${work}/${record.edition}/lessons/${id}/lesson.template.json`;
  assert.equal(hash(file), record.template.sha256);
  const before = `${scratch}/d041-n128-layout-first-candidate/${record.edition}/lesson.template.json`;
  fs.mkdirSync(path.dirname(before), { recursive: true });
  fs.copyFileSync(file, before, fs.constants.COPYFILE_EXCL);
  const original = read(authored.records.find(row => row.edition === record.edition).template.path);
  const first = read(`${scratch}/d041-n128-first-format-candidate/${record.edition}/lesson.template.json`);
  const document = read(file);
  const zh = record.edition === 'modern-us-neutral';
  const affected = zh ? [1, 5] : [5];
  for (const index of affected) document.prose[index].text = first.prose[index].text;
  if (zh) {
    document.prose[1].text = document.prose[1].text.replace(
      '**这说明铀盐不需要阳光照射，也会自发放出某种射线。**',
      '**这说明铀盐不需要阳光照射，也会自发放出某种射线**。');
    document.prose[5].text = document.prose[5].text.replace('镭的原子序数是 88；在', '镭的原子序数是 88。\n在');
  } else {
    document.prose[5].text = document.prose[5].text.replace('Radium has atomic number 88; before',
      'Radium has atomic number 88.\nBefore');
  }
  document.affected = affected;
  document.section_breaks = [];
  const formatted = JSON.parse(execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python',
    ['-c', formatter], { input: JSON.stringify(document), encoding: 'utf8' }));
  fs.writeFileSync(file, JSON.stringify(formatted, null, 2) + '\n');
  const label = `d041-${record.edition}-n128-affected-layout-outline`;
  execFileSync('node', [`${scratch}/run-native.mjs`, label, 'node',
    '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs', '--json', file], { stdio: 'inherit' });
  const outline = read(`${scratch}/native/${label}/stdout.txt`);
  assert(outline.paragraphs.every(row => !/^\s*\*\*\s*$/.test(row.text)));
  const prefixes = zh ? ['贝克勒尔想知道', '研究者接着', '镭在周期表']
    : ['Becquerel asked', 'Researchers then', 'A periodic-table entry'];
  formatted.section_breaks = prefixes.map(prefix => {
    const matches = outline.paragraphs.filter(row => row.text.startsWith(prefix));
    assert.equal(matches.length, 1);
    const after = matches[0];
    const before = outline.paragraphs.find(row => row.index === after.index - 1);
    assert(before);
    return { before: before.text, after: after.text };
  });
  for (const [index, block] of formatted.prose.entries()) {
    if (!affected.includes(index)) assert.deepEqual(block, original.prose[index]);
  }
  fs.writeFileSync(file, JSON.stringify(formatted, null, 2) + '\n');
  records.push({ edition: record.edition, affected, before: bind(before), template: bind(file),
    outline: bind(`${scratch}/native/${label}/stdout.txt`), paragraphs: outline.paragraphs.length });
}
const output = `${scratch}/d041-n128-affected-layout-recovery.json`;
fs.writeFileSync(output, JSON.stringify({
  batch: 'D041', id, records, layoutRevision: 1,
  observedFailure: 'First Chinese normalized outline split closing bold delimiter into the next paragraph; semicolon split a dependent clause into its own paragraph in both locales.',
  correction: 'Move Chinese sentence stop outside bold; use complete sentences instead of the semicolon. Reformat only affected blocks and derive boundaries from actual new outline.',
  scientificContentChanged: false, numericChanges: [], sourceUnchanged: true,
  firstNativeFinalizationNotYetRun: true, repeatedReviews: 0, parentNewImageOpens: 0,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ recovery: bind(output), paragraphs: records.map(row => row.paragraphs) }));
