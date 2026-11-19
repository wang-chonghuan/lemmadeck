import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

assert.equal(process.cwd(), '/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck');
const scratch = '.intentfold/tickets/STEMROBIN-181/tmp/d1814-recovery';
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({ path: file, sha256: hash(file) });
const authored = read(`${scratch}/d041-n124-first-author.json`);
const records = [];
const formatter = [
  'import json, sys',
  'sys.path.insert(0, ".claude/skills/ld-s10y-lesson/tools")',
  'import edition',
  'document = json.load(sys.stdin)',
  'for block in document["prose"]:',
  '    block["text"] = edition.normalize_prose_layout(block["text"])',
  'print(json.dumps(document, ensure_ascii=False))',
].join('\n');
for (const record of authored.records) {
  const file = record.template.path;
  assert.equal(hash(file), record.template.sha256);
  const before = `${scratch}/d041-n124-first-format-candidate/${record.edition}/lesson.template.json`;
  fs.mkdirSync(path.dirname(before), { recursive: true });
  fs.copyFileSync(file, before, fs.constants.COPYFILE_EXCL);
  const formatted = JSON.parse(execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python',
    ['-c', formatter], { input: fs.readFileSync(file), encoding: 'utf8' }));
  fs.writeFileSync(file, JSON.stringify(formatted, null, 2) + '\n');
  const label = `d041-${record.edition}-n124-normalized-prose-outline`;
  execFileSync('node', [`${scratch}/run-native.mjs`, label, 'node',
    '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs', '--json', file], { stdio: 'inherit' });
  const outline = read(`${scratch}/native/${label}/stdout.txt`);
  const prefixes = record.edition.endsWith('-en')
    ? ['The difficulty came from', 'In quantum mechanics, an electron']
    : ['困难来自这个理论', '量子力学中的电子'];
  formatted.section_breaks = prefixes.map(prefix => {
    const matching = outline.paragraphs.filter(row => row.text.startsWith(prefix));
    assert.equal(matching.length, 1);
    const after = matching[0];
    const before = outline.paragraphs.find(row => row.index === after.index - 1);
    assert(before);
    return { before: before.text, after: after.text };
  });
  fs.writeFileSync(file, JSON.stringify(formatted, null, 2) + '\n');
  records.push({
    edition: record.edition, before: bind(before), template: bind(file),
    outline: bind(`${scratch}/native/${label}/stdout.txt`),
    paragraphs: outline.paragraphs.length, sectionBreaks: formatted.section_breaks,
  });
}
const output = `${scratch}/d041-n124-format-and-sections.json`;
assert(!fs.existsSync(output));
fs.writeFileSync(output, JSON.stringify({
  batch: 'D041', id: 'phy10-c3-s2-n124', records,
  formatter: 'Existing edition.normalize_prose_layout',
  boundarySelection: 'Unique concept-prefix matches in the actual native prose outline; no hand-counted paragraph indices.',
  sourceUnchanged: true, layoutOnly: true, scientificReview: 'pending',
  parentNewImageOpens: 0, paidCalls: 0, databaseWrites: false,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ output: bind(output), records }));
