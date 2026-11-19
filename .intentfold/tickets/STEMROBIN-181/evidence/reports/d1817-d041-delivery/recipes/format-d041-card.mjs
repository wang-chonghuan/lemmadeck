import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

assert.equal(process.cwd(), '/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck');
const [number, prefixesJSON] = process.argv.slice(2);
assert(/^\d+$/.test(number));
const prefixes = JSON.parse(prefixesJSON);
const scratch = '.intentfold/tickets/STEMROBIN-181/tmp/d1814-recovery';
const read = file => JSON.parse(fs.readFileSync(file));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({ path: file, sha256: hash(file) });
const authored = read(`${scratch}/d041-n${number}-first-author.json`);
const formatter = [
  'import json, sys',
  'sys.path.insert(0, ".claude/skills/ld-s10y-lesson/tools")',
  'import edition',
  'document = json.load(sys.stdin)',
  'for block in document["prose"]:',
  '    block["text"] = edition.normalize_prose_layout(block["text"])',
  'print(json.dumps(document, ensure_ascii=False))',
].join('\n');
const records = [];
for (const record of authored.records) {
  const file = record.template.path;
  assert.equal(hash(file), record.template.sha256);
  const snapshot = `${scratch}/d041-n${number}-first-format-candidate/${record.edition}/lesson.template.json`;
  fs.mkdirSync(path.dirname(snapshot), { recursive: true });
  fs.copyFileSync(file, snapshot, fs.constants.COPYFILE_EXCL);
  const formatted = JSON.parse(execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python',
    ['-c', formatter], { input: fs.readFileSync(file), encoding: 'utf8' }));
  fs.writeFileSync(file, JSON.stringify(formatted, null, 2) + '\n');
  const label = `d041-${record.edition}-n${number}-normalized-prose-outline`;
  execFileSync('node', [`${scratch}/run-native.mjs`, label, 'node',
    '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs', '--json', file], { stdio: 'inherit' });
  const outline = read(`${scratch}/native/${label}/stdout.txt`);
  formatted.section_breaks = prefixes[formatted.locale].map(prefix => {
    const matches = outline.paragraphs.filter(row => row.text.startsWith(prefix));
    assert.equal(matches.length, 1, `Concept boundary ${prefix}`);
    const after = matches[0];
    const before = outline.paragraphs.find(row => row.index === after.index - 1);
    assert(before);
    return { before: before.text, after: after.text };
  });
  fs.writeFileSync(file, JSON.stringify(formatted, null, 2) + '\n');
  records.push({ edition: record.edition, before: bind(snapshot), template: bind(file),
    outline: bind(`${scratch}/native/${label}/stdout.txt`),
    paragraphs: outline.paragraphs.length, sectionBreaks: formatted.section_breaks });
}
const output = `${scratch}/d041-n${number}-format-and-sections.json`;
fs.writeFileSync(output, JSON.stringify({
  batch: 'D041', id: authored.id, records, formatter: 'Existing edition.normalize_prose_layout',
  boundarySelection: 'Unique concept-prefix matches in actual native prose outline; no hand-counted indices.',
  sourceUnchanged: true, layoutOnly: true, independentReview: 'pending', parentNewImageOpens: 0,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ output: bind(output), paragraphs: records.map(record => record.paragraphs) }));
