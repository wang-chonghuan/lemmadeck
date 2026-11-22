import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save } from './n42-native.mjs';

const history = `${ticket}/evidence/author-history/d020/raw`;
const freezeFile = `${history}/ddc0a9162169-d10bad126a2df0a1-author-freeze.json`;
const freeze = read(freezeFile);
const roots = [history, `${ticket}/evidence/pixels/d020`];
const files = roots.flatMap(root => fs.readdirSync(root).map(name => `${root}/${name}`));
function resolve(record) {
  const candidates = files.filter(file =>
    path.basename(file).includes(`-${record.sha256.slice(0, 16)}-`));
  const matching = candidates.filter(file => bind(file).sha256 === record.sha256);
  assert(matching.length, `Missing exact retained bytes: ${record.path}`);
  return { original: record, retained: bind(matching[0]), aliases: matching.length };
}
const figures = [];
for (const figure of freeze.figures) {
  const outputs = Object.fromEntries(Object.entries(figure.outputs).map(([key, item]) => [key, resolve(item)]));
  const previews = figure.previews.map(preview => ({
    ...preview, image: resolve(preview),
  }));
  const spec = read(outputs['spec.json'].retained.path);
  const native = read(outputs['render.json'].retained.path);
  assert.equal(bind(`${repo}/${figure.bindings.source.path}`).sha256, figure.bindings.source.sha256);
  figures.push({
    id: figure.id, historicalAuthorStatus: figure.status, outputs, previews,
    mode: spec.mode, canvas: spec.canvas, display: spec.display,
    nativeStatus: native.status, nativeErrors: native.errors,
    independentApproval: false, repeatedProducers: 0,
  });
}
const file = `${ticket}/tmp/d1816-d956-n71-retained-figure-inputs/recovered.json`;
save(file, {
  task: 'D956', status: 'EXACT_SIX_HISTORICAL_FIGURE_INPUTS_LOCATED_NO_NEW_PRODUCERS',
  originalAuthorFreeze: bind(freezeFile), figures,
  independentOriginalInventory: bind(`${ticket}/tmp/d1816-d949-n71-first-independent-review/source-inventory.json`),
  figure129: 'HYBRID_PAID_ART_AND_LOCAL_GLYPH_HOLD_NOT_A_DETERMINISTIC_FALLBACK',
  parentImages: 0, paidCalls: 0, databaseWrites: 0, fullCourseApproved: false,
});
console.log(JSON.stringify({
  recovered: bind(file), figures: figures.map(({ id, historicalAuthorStatus, mode, nativeStatus, nativeErrors, display }) =>
    ({ id, historicalAuthorStatus, mode, nativeStatus, nativeErrors, display })),
}));
