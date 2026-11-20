import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
const root = path.dirname(fileURLToPath(import.meta.url));
if (process.cwd() !== repo || root !== path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/n61-fig8384-author')) throw new Error('Wrong scope');
const id = process.argv[2];
if (!['fig-g10-83', 'fig-g10-84'].includes(id)) throw new Error('Only owned figures may be repaired');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({ path: file, sha256: hash(file), bytes: fs.statSync(file).size });
const write = (file, value) => {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
  fs.chmodSync(file, 0o444);
};
const specPath = path.join(root, `${id}.spec-FIRST.json`);
const spec = read(specPath);
const mapping = read(path.join(root, `${id}.defining-relationship-mapping.json`));
const observed = read(path.join(root, 'visual-observations-FIRST.json')).figures.find(figure => figure.figure === id);
if (observed?.authorVisualStatus !== 'FAIL') throw new Error('No actual observed defect');
const originalSpec = structuredClone(spec);
const prefix = id === 'fig-g10-83' ? '83-cone' : '84-cone';
const points = new Map(spec.objects.filter(object => object.type === 'point').map(object => [object.id, object.at]));
const box = spec.canvas.boundingBox;
const screenInput = at => [at[0] - box[0], box[1] - at[1]].map(value => Number(value.toFixed(12))).join(' ');
const coordinate = letter => screenInput(points.get(`${prefix}-${letter}`));
const rx = mapping.cone.model.radius;
const ry = mapping.cone.verticalRadius;
const replacements = {
  [`${prefix}-front-rim`]: `M ${coordinate('B')} A ${rx} ${ry} 0 0 0 ${coordinate('A')} A ${rx} ${ry} 0 0 0 ${coordinate('C')}`,
  [`${prefix}-rear-rim`]: `M ${coordinate('C')} A ${rx} ${ry} 0 0 0 ${coordinate('B')}`,
};
const changes = [];
for (const object of spec.objects) {
  if (Object.hasOwn(replacements, object.id)) {
    changes.push({ object: object.id, field: 'd', before: object.d, after: replacements[object.id] });
    object.d = replacements[object.id];
  }
}
if (changes.length !== 2) throw new Error('Expected exactly two rim path repairs');
const reverted = structuredClone(spec);
for (const object of reverted.objects) {
  const original = originalSpec.objects.find(item => item.id === object.id);
  if (Object.hasOwn(replacements, object.id)) object.d = original.d;
}
if (JSON.stringify(reverted) !== JSON.stringify(originalSpec)) throw new Error('Repair changed unrelated fields');
const firstFiles = [specPath, ...['FIRST.svg', 'FIRST.render.json', 'FIRST.snapshot.png'].map(suffix => path.join(root, `${id}.${suffix}`))];
for (const file of firstFiles) fs.chmodSync(file, 0o444);
const candidate = path.join(root, `${id}.spec-REPAIR1.json`);
write(candidate, spec);
write(path.join(root, `${id}.repair1.json`), {
  schema: 'bounded-author/targeted-repair@1', figure: id, repairCounter: 1, repairLimit: 1,
  failure: observed.failure, firstVisualObservation: bind(path.join(root, 'visual-observations-FIRST.json')),
  firstFiles: firstFiles.map(bind), candidate: bind(candidate), changes,
  unchanged: ['every point', 'labels', 'solid/dashed distinction', 'assertions', 'inventory', 'cone parameters', 'sector', 'two-panel connectivity', 'display widths', 'layout'],
  diagnosis: 'Source-screen svgPath coordinates must precede the existing raw-layer scale(20 20); no renderer or SVG edited.',
  next: 'One explicit affected-only validate_spec.py and render_spec.mjs call on REPAIR1, then one existing output snapshot opening.',
  noFurtherContentRepair: true, independentReview: 'PENDING',
});
write(path.join(root, `${id}.defining-relationship-mapping-REPAIR1.json`), {
  ...mapping, spec: bind(candidate),
  inheritedMapping: bind(path.join(root, `${id}.defining-relationship-mapping.json`)),
  actualPathCoordinateContract: {
    renderer: '.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
    layerTransform: 'scale(canvas.width/(xmax-xmin), canvas.height/(ymax-ymin))',
    inputTransform: '(user.x-xmin, ymax-user.y)',
    rx: mapping.cone.model.radius, ry: mapping.cone.verticalRadius,
    paths: changes.map(change => ({ object: change.object, d: change.after })),
    geometricParametersAndAllMappedExecutableRelationshipsUnchanged: true,
  },
  review: 'PENDING independent review; no author approval',
});
console.log(`${id}: targeted REPAIR1 changes only two rim path d fields; FIRST failure and all FIRST bytes retained.`);
