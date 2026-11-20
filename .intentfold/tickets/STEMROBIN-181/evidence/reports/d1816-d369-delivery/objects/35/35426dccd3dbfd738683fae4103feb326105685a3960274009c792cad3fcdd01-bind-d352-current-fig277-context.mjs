import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const B = '.tmp/STEMROBIN-181/d1816-d352';
const O = `${T}/tmp/d1816-d352-current-figure-context`;
const id = 'phy10-c3-s4-n149';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => ({ path: path.resolve(file),
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') });
assert(!fs.existsSync(B));
assert(!fs.existsSync(O));
const author = read(`${T}/tmp/d1816-d344-fig277-label-repair/author-freeze.json`);
const text = read(`${T}/tmp/d1816-d343-n149-text-repair/author-freeze.json`);
for (const binding of [author.spec, author.svg, author.render,
  ...text.records.flatMap(row => [row.after, row.working])])
  assert.equal(bind(binding.path).sha256, binding.sha256);
const oldSpec = read(author.spec.path);
const spec = structuredClone(oldSpec);
const current = new Map();
for (const record of text.records) {
  const edition = record.locale === 'zh' ? 'modern-us-neutral' : 'modern-us-neutral-en';
  const template = read(record.after.path);
  for (const field of ['chapter', 'title', 'printed_title'])
    current.set(`${id}/${edition}/${field}`, template[field]);
  for (const [i, block] of template.prose.entries())
    if (block.text) current.set(`${id}/${edition}/prose/${String(i + 1).padStart(3, '0')}`, block.text);
}
const contextChanges = [];
spec.source.authoritativeText = oldSpec.source.authoritativeText.map(row => {
  assert(current.has(row.lesson), row.lesson);
  const text = current.get(row.lesson);
  if (text !== row.text) contextChanges.push({ lesson: row.lesson, before: row.text, after: text });
  return { ...row, text };
});
assert.equal(spec.source.authoritativeText.length, current.size);
const withoutContext = value => {
  const copy = structuredClone(value);
  delete copy.source.authoritativeText;
  return copy;
};
assert.deepEqual(withoutContext(spec), withoutContext(oldSpec));
fs.mkdirSync(B, { recursive: true });
fs.mkdirSync(O, { recursive: true });
const specFile = `${B}/fig-277.spec.json`;
fs.writeFileSync(specFile, JSON.stringify(spec, null, 2) + '\n');
const render = read(author.render.path);
assert.equal(render.status, 'pass');
render.spec = bind(specFile);
const renderFile = `${B}/fig-277.render.json`;
fs.writeFileSync(renderFile, JSON.stringify(render, null, 2) + '\n');
execFileSync('node', [
  `${T}/tmp/d1816-recovery/run-native.mjs`, 'd352-current-context-validate',
  '.claude/skills/ld-s10y-lesson/.venv/bin/python',
  '.agents/skills/ld-s10y-image/scripts/validate_spec.py', specFile,
  '--stage', 'draft', '--json',
], { cwd: repo, stdio: 'inherit' });
fs.writeFileSync(`${O}/context.json`, JSON.stringify({
  stage: 'D352', firstFigureReviewPending: true,
  originalAuthor: bind(`${T}/tmp/d1816-d344-fig277-label-repair/author-freeze.json`),
  repairedText: bind(`${T}/tmp/d1816-d343-n149-text-repair/author-freeze.json`),
  spec: bind(specFile), render: bind(renderFile), svg: author.svg, preview: author.preview,
  source: author.source, contextChanges,
  geometryObjectsAssertionsInventoryAndSVGUnchanged: true,
  nativeRenderReusedFromD344WithContextHashRebinding: true,
  geometryRerenders: 0, imagesOpened: 0, paidCalls: 0,
  sourcePagesAdded: 0, completeCoursesAdded: 0,
  sourceTextApprovalPending: true, independentFigureApproval: false,
}, null, 2) + '\n');
console.log(JSON.stringify({ context: bind(`${O}/context.json`), changedContextEntries: contextChanges.length, geometryRerenders: 0 }));
