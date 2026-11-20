import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
const root = path.dirname(fileURLToPath(import.meta.url));
if (process.cwd() !== repo) throw new Error('Wrong authorized checkout');
const base = '.intentfold/tickets/STEMROBIN-188/tmp';
const oldDirs = { 86: `${base}/n61-fig8586-author`, 87: `${base}/n61-fig8788-author` };
const oldSpecs = {
  86: `${oldDirs[86]}/fig-g10-86.repair1.spec.json`,
  87: `${oldDirs[87]}/fig-g10-87.REPAIR1.spec.json`,
};
const read = p => JSON.parse(fs.readFileSync(path.resolve(repo, p), 'utf8'));
const bind = p => {
  const absolute = path.resolve(repo, p);
  const bytes = fs.readFileSync(absolute);
  return {
    path: path.relative(repo, absolute),
    sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
    bytes: bytes.length,
    mode: (fs.statSync(absolute).mode & 0o777).toString(8).padStart(4, '0'),
  };
};
const write = (name, value) => fs.writeFileSync(path.join(root, name), JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
const protectedPaths = [];
for (const number of [86, 87]) {
  for (const name of fs.readdirSync(path.resolve(repo, oldDirs[number]))) {
    if (name.startsWith(`fig-g10-${number}.`) || name === 'author-result.json') {
      const p = `${oldDirs[number]}/${name}`;
      if (fs.statSync(path.resolve(repo, p)).isFile()) protectedPaths.push(p);
    }
  }
  const notes = path.join(root, `fig-g10-${number}.focused-pixel-notes.json`);
  assert.equal(fs.statSync(notes).mode & 0o777, 0o444);
  const contextPath = `${base}/n61-${number === 86 ? 'fig8586' : 'fig8788'}-author-inputs-01/fig-g10-${number}.context.json`;
  const context = read(contextPath);
  assert.equal(bind(context.sourceImage.path).sha256, context.sourceImage.sha256);
  protectedPaths.push(contextPath, context.sourceImage.path, context.editionLesson.path, context.editionExercises.path);
}
protectedPaths.push(
  `${base}/n61-fig8788-review-01/fig-g10-87-FIRST.json`,
  `${base}/n61-fig8788-review-01/fig-g10-87-current-review.json`,
  `${base}/n61-fig8788-review-01/inherited-state.json`,
  '.agents/skills/ld-s10y-image/SKILL.md',
  '.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
  '.agents/skills/ld-s10y-image/scripts/materialize_arrowheads.mjs',
  '.agents/skills/ld-s10y-image/scripts/validate_spec.py',
  '.agents/skills/ld-s10y-image/assets/figure-spec.schema.json',
  '.claude/skills/ld-s10y-lesson/references/production-resume.md',
);
write('bindings.before.json', [...new Set(protectedPaths)].map(bind));
assert.equal(read(`${oldDirs[86]}/author-result.json`).repairCounts['fig-g10-86'], 1);
assert.equal(read(`${oldDirs[87]}/author-result.json`).repairCounters['fig-g10-87'], 1);

const changes = [];
for (const number of [86, 87]) {
  const original = read(oldSpecs[number]);
  const candidate = structuredClone(original);
  const targetId = number === 86 ? 'A1' : 'G87-O1';
  const target = candidate.objects.find(object => object.id === targetId);
  const before = structuredClone(target.labelPlacement);
  if (number === 86) {
    assert.deepEqual(before, { position: 'NW', gap: 28 });
    target.labelPlacement = { position: 'W', gap: 40 };
  } else {
    assert.deepEqual(before, { position: 'E', gap: 100 });
    assert.deepEqual(target.at, [0, 4]);
    target.labelPlacement = { position: 'SE', gap: 14, offset: [16, 46] };
    candidate.objects.push({
      id: 'G87-O1-association-leader',
      type: 'segment',
      from: 'G87-O1',
      to: [0.4, 3.18],
      stroke: 'muted',
      strokeWidth: 1.5,
      dash: 0,
      description: 'Modern clarification only, absent from source: short label leader from the actual unchanged upper-center anchor toward its nearby O1 label. Not a source edge or spatial measurement.',
    });
    candidate.assertions.push({
      id: 'G87-O1-association-leader-connects',
      type: 'connects',
      arrow: 'G87-O1-association-leader',
      from: 'G87-O1',
      to: [0.4, 3.18],
    });
  }
  const stripped = structuredClone(candidate);
  stripped.objects.find(object => object.id === targetId).labelPlacement = before;
  if (number === 87) {
    stripped.objects.pop();
    stripped.assertions.pop();
  }
  assert.deepEqual(stripped, original, 'Only the explicitly authorized isolated changes may differ');
  write(`fig-g10-${number}.repair2.spec.json`, candidate);
  changes.push({
    figure: `fig-g10-${number}`,
    oldSpec: bind(oldSpecs[number]),
    newSpec: bind(path.join(root, `fig-g10-${number}.repair2.spec.json`)),
    lifetimeRepairCounter: { before: 1, increment: 1, after: 2, reset: false },
    changes: [
      { path: `/objects/${original.objects.findIndex(object => object.id === targetId)}/labelPlacement`, before, after: target.labelPlacement },
      ...(number === 87 ? [
        { path: '/objects/-', added: candidate.objects.at(-1) },
        { path: '/assertions/-', added: candidate.assertions.at(-1) },
      ] : []),
    ],
    modernClarification: number === 87 ? {
      absentFromOriginal: true,
      rationale: 'At unchanged 30px font with 8px label padding, the small oval and solid diagonal leave insufficient clear vertical space for an adjacent O1 label. The center upright and neighboring generators obstruct the upper alternatives. A nearby below-right offset plus a short, distinctly muted leader avoids detaching the label into the B1 column.',
      actualAnchor: 'G87-O1',
      pointCoordinates: [0, 4],
      executableConnects: 'G87-O1-association-leader-connects',
      noNewSourceGeometryOrLetters: true,
    } : null,
    allOtherFieldsDeepEqual: true,
  });
}
write('isolated-changes.json', changes);
console.log(JSON.stringify({ prepared: changes.map(change => ({ figure: change.figure, counter: change.lifetimeRepairCounter, spec: change.newSpec })) }));
