import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const root = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), root);
const own = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d054-n14-author');
const figdir = path.join(root, '.tmp/STEMROBIN-181/d1816-d054/n14-figure-author');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const failure = JSON.parse(fs.readFileSync(path.join(figdir, 'fig-18.render.json')));
assert.equal(failure.status, 'fail');
assert.equal(failure.collisions.length, 1);
assert.equal(failure.collisions[0].id, 'frequency-label-label');
const changed = [];
for (const id of ['fig-18','fig-19']) {
  for (const extension of ['spec.json','svg','render.json']) {
    const source = path.join(figdir, `${id}.${extension}`);
    if (fs.existsSync(source)) fs.copyFileSync(source, path.join(own, `${id}.before-label-repair.${extension}`), fs.constants.COPYFILE_EXCL);
  }
  const specPath = path.join(figdir, `${id}.spec.json`);
  const before = hash(specPath);
  const spec = JSON.parse(fs.readFileSync(specPath));
  const label = spec.objects.find(x => x.id === 'natural-frequency-label');
  assert.deepEqual(label.at, [370,67]);
  label.at = [370,73];
  fs.writeFileSync(specPath, JSON.stringify(spec, null, 2) + '\n');
  changed.push({id, path: specPath, beforeSha256: before, sha256: hash(specPath)});
}
const mappingPath = path.join(own, 'source-inventory-mapping.json');
const mapping = JSON.parse(fs.readFileSync(mappingPath));
for (const item of mapping.figures) item.spec.sha256 = hash(item.spec.path);
fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2) + '\n');
fs.writeFileSync(path.join(own, 'repair-history.json'), JSON.stringify({
  role: 'AUTHOR', genuineContentRepairs: 1, independentReview: 'pending',
  contractRepair: {count: 1, reason: 'Hidden anchors were incorrectly mapped as visible source objects; omit those mappings. Omit literal none fill so native default produces an unfilled path.', geometryChanged: false},
  executionRepair: {count: 1, reason: 'Missing playwright-core; reuse verified byte-identical existing native runtime, no install.'},
  targetedContentRepair: {count: 1, reason: 'Native frequency caption collision with natural-frequency label.', change: 'Move omega_0 label anchor upward by 6 drawing pixels; all geometry, curves, font sizes and source/complete text remain unchanged.', changed},
  firstNativeFailurePreserved: true, firstRenderedFailurePreserved: true,
  noFurtherContentRedrawAuthorizedByThisAuthor: true,
}, null, 2) + '\n');
