import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const R = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const O = path.join(R, '.intentfold/tickets/STEMROBIN-181/tmp/d938-n87-first-display-coverage04');
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const read = name => JSON.parse(fs.readFileSync(path.join(O, name), 'utf8'));
assert.equal(process.cwd(), R);
assert.equal(fs.realpathSync(O), O);
const freeze = read('freeze.json');
const report = read('report.json');
const usage = read('usage.json');
assert.equal(hash(path.join(O, 'freeze.json')), report.preinspectionFreeze.sha256);
assert.equal(hash(freeze.materializer.path), freeze.materializer.sha256);
assert.equal(freeze.imageLoadsAtFreeze, 0);
assert.equal(freeze.state, 'FROZEN-BEFORE-FIRST-IMAGE-INSPECTION');
assert.equal(freeze.recipes.length, 8);
assert.deepEqual(report.inputs, freeze.inputs);
assert.deepEqual(report.recipes.map(item => item.recipeId), freeze.recipes.map(item => item.recipeId));
assert.deepEqual(usage.loadEvents.map(item => item.recipeId), freeze.recipes.map(item => item.recipeId));
assert.equal(report.batchId, 'full-coverage-4');
assert.equal(usage.imageLoads, 8);
assert.equal(usage.originalScreenshotImageLoads, 0);
assert.equal(usage.reopens, 0);
assert.equal(usage.extraCrops, 0);
assert.equal(usage.materializedCropCount, 8);
assert.equal(usage.costUsd, null);
assert.equal(usage.totalTokens, null);
for (const item of usage.loadEvents) {
  assert.equal(item.detail, 'original');
  assert.equal(item.loads, 1);
}
for (const input of freeze.inputs) assert.equal(hash(input.path), input.sha256);
for (let index = 0; index < freeze.recipes.length; index++) {
  const frozen = freeze.recipes[index];
  const reviewed = report.recipes[index];
  assert.equal(reviewed.source.path, frozen.source.path);
  assert.equal(reviewed.source.sha256, frozen.source.sha256);
  assert.deepEqual(reviewed.rectangle, frozen.rectangle);
  assert.deepEqual(reviewed.crop, {
    path: frozen.crop.path,
    sha256: frozen.crop.sha256,
  });
  assert.equal(hash(frozen.source.path), frozen.source.sha256);
  assert.equal(hash(frozen.crop.path), frozen.crop.sha256);
  assert.equal(path.dirname(frozen.crop.path), O);
  assert.equal(frozen.nativeScale, 1);
  assert.equal(frozen.resized, false);
  assert.equal(reviewed.fullDISPLAY, false);
  assert.equal(reviewed.completeCard, false);
}
for (const artifact of [freeze, report, usage]) {
  assert.equal(artifact.fullDISPLAY, false);
  assert.equal(artifact.completeCard, false);
}
const pngs = fs.readdirSync(O).filter(name => name.endsWith('.png')).sort();
assert.deepEqual(pngs, freeze.recipes.map(item => path.basename(item.crop.path)).sort());
const names = fs.readdirSync(O).filter(name => name !== 'SHA256SUMS').sort();
for (const name of names) assert.equal(fs.lstatSync(path.join(O, name)).isFile(), true);
const sums = names.map(name => `${hash(path.join(O, name))}  ${name}\n`).join('');
fs.writeFileSync(path.join(O, 'SHA256SUMS'), sums, 'ascii');
for (const name of [...names, 'SHA256SUMS']) fs.chmodSync(path.join(O, name), 0o444);
console.log(JSON.stringify({
  batchId: report.batchId,
  batchVerdict: report.batchVerdict,
  fullDISPLAY: false,
  completeCard: false,
  imageLoads: usage.imageLoads,
  artifacts: ['report.json', 'usage.json', 'freeze.json', 'SHA256SUMS'].map(name => ({
    path: path.join(O, name),
    sha256: hash(path.join(O, name)),
  })),
}, null, 2));
