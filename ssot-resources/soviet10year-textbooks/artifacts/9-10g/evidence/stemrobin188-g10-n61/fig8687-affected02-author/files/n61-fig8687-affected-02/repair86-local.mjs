import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
const root = path.dirname(fileURLToPath(import.meta.url));
if (process.cwd() !== repo) throw new Error('Wrong authorized checkout');
const read = name => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'));
const write = (name, value) => fs.writeFileSync(path.join(root, name), JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
const bind = name => {
  const p = path.join(root, name);
  const bytes = fs.readFileSync(p);
  return { path: path.relative(repo, p), sha256: crypto.createHash('sha256').update(bytes).digest('hex'), bytes: bytes.length };
};
const report = read('fig-g10-86.repair2.render.json');
assert.equal(report.status, 'fail');
assert.deepEqual(report.collisions, [{ id: 'A1-label', text: 'A\u2081', position: 'W', score: 10000 }]);
const previous = read('fig-g10-86.repair2.spec.json');
const candidate = structuredClone(previous);
const index = candidate.objects.findIndex(object => object.id === 'A1');
assert.deepEqual(candidate.objects[index].labelPlacement, { position: 'W', gap: 40 });
candidate.objects[index].labelPlacement = { position: 'W', gap: 40, offset: [0, -20] };
const reverted = structuredClone(candidate);
reverted.objects[index].labelPlacement = previous.objects[index].labelPlacement;
assert.deepEqual(reverted, previous);
for (const extension of ['spec.json', 'render.json', 'svg', 'snapshot.json', 'widths-480-300.png']) {
  fs.chmodSync(path.join(root, `fig-g10-86.repair2.${extension}`), 0o444);
}
write('fig-g10-86.repair3.spec.json', candidate);
write('fig-g10-86.repair3.changes.json', {
  figure: 'fig-g10-86',
  previous: bind('fig-g10-86.repair2.spec.json'),
  current: bind('fig-g10-86.repair3.spec.json'),
  lifetimeRepairCounter: { before: 2, increment: 1, after: 3, reset: false },
  diagnosis: bind('fig86-repair2-diagnosis.json'),
  changes: [{
    path: `/objects/${index}/labelPlacement`,
    before: previous.objects[index].labelPlacement,
    after: candidate.objects[index].labelPlacement,
  }],
  allOtherFieldsDeepEqual: true,
  sameFailedSpecOrCommandRepeated: false,
});
console.log(JSON.stringify({ spec: bind('fig-g10-86.repair3.spec.json'), lifetimeRepairs: 3 }));
