import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const own = dirname(fileURLToPath(import.meta.url));
const repo = resolve(own, '../../../../..');
const hash = value => createHash('sha256').update(value).digest('hex');
const canonical = value => {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value).replace(/[\u007f-\uffff]/g, char =>
    `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`);
};
const paths = [
  '../geo910-n19-choice-seed.json',
  'source-solutions-frozen.md',
  '../geo910-n19-choice-draft.json',
  'view-projection.json',
  'render-source-images.mjs',
  'fig-75-normal-640.png',
  'fig-76-normal-640.png',
  'snapshot-bindings.mjs'
];
const files = {};
for (const relative of paths) {
  const path = resolve(own, relative);
  const bytes = await readFile(path);
  const metadata = await stat(path);
  files[relative] = {
    path,
    file_sha256: hash(bytes),
    size_bytes: bytes.length,
    birthtime: metadata.birthtime.toISOString(),
    mtime: metadata.mtime.toISOString()
  };
  if (relative.endsWith('.json')) {
    files[relative].canonical_sha256 = hash(canonical(JSON.parse(bytes)));
  }
}
const seed = JSON.parse(await readFile(resolve(own, paths[0])));
const draft = JSON.parse(await readFile(resolve(own, '../geo910-n19-choice-draft.json')));
const projection = JSON.parse(await readFile(resolve(own, 'view-projection.json')));
assert.deepEqual(projection, draft.questions.map(question => question.view));
assert.equal(hash(canonical(seed)), draft.seed_sha256);
assert.equal(files['source-solutions-frozen.md'].file_sha256, '480ff771e1f48b9769fa18e725a0b3281bab674ed6962d6935f1d0189291dcb5');
assert.ok(files['source-solutions-frozen.md'].birthtime < files['../geo910-n19-choice-draft.json'].birthtime);
const tools = {};
for (const relative of [
  '.agents/skills/ld-s10y-choice/SKILL.md',
  '.agents/skills/ld-s10y-choice/references/authoring.md',
  '.agents/skills/ld-s10y-choice/references/contract.md',
  '.agents/skills/ld-s10y-image/SKILL.md',
  '.agents/skills/ld-s10y-choice/scripts/validate.py'
]) {
  tools[relative] = hash(await readFile(resolve(repo, relative)));
}
console.log(JSON.stringify({
  cwd: process.cwd(),
  snapshot_binding_only: true,
  projection_equals_exact_views: true,
  source_solution_freeze_unchanged: true,
  freeze_created_before_draft: true,
  files,
  tools
}, null, 2));
