import assert from 'node:assert/strict';
import { ticket, read, bind, verify, exists, immutableWrite } from './retain-d016-evidence.mjs';

const work = `${ticket}/tmp`;
const manifestPath = `${work}/d019-offline-tiles.json`;
const manifest = await read(manifestPath);
const result = await read(manifest.result.path);
assert.equal(result.status, 'pass');
assert.equal(result.results.length, 12);
assert.equal(manifest.tiles.length, 28);
const observations = [
  'Desktop67 start1: heading and electric-field/strength/point-charge transitions visible; formulas8-11/8-12 complete, no overlapping prose or broken vector marks.',
  'Desktop67 start2: formulas8-13/8-14, both113 panels and114 parallelogram clear. This tile exposed the incorrect old113 observation count, now corrected in affected-only metadata. Diagram/caption/prose spacing intact.',
  'Desktop67 start3: multiple-source vector sum8-15 and all closing model restrictions visible; zero-task footer complete.',
  'Desktop67 end1: short inline subscripts/vector formulas remain readable at the observed scroll end, without line-height or paragraph overlap.',
  'Desktop67 end2: both113 panels/114 caption and full superposition formula sequence remain complete in scroll-end state.',
  'Desktop67 end3: closing vector sum, point-source restrictions and zero-task footer remain visible at scroll end.',
  'Desktop73 start1: two-line scientific qualifications and uniform-field transition readable. Formula8-20 and upper138 geometry visible; tile boundary alone splits the image.',
  'Desktop73 start2:138 lower ends/B/D and139 complete, correct signed open path and staircase. Work-energy chain8-21,8-22 and kinetic-energy qualifications readable; no diagram/prose collision.',
  'Desktop73 start3: closed-path zero formula, zero-reference divider, energy-reference formulas and negative-charge paragraph complete; zero-task footer unobscured.',
  'Desktop73 end1: uniform-field model and formula8-20 readable with vector accents intact;138 upper geometry remains visible after short inline scroll.',
  'Desktop73 end3: reference-zero formula qEd-qEd0 has a readable terminal subscript in the scroll-end state; final restrictions and footer intact.',
  'Desktop74 start1: heading, potential/potential-difference dividers and formulas8-23 through8-25 complete. The unindexed initial EP and indexed final EP2 remain legible.',
  'Desktop74 start2: voltage-order convention and formulas8-26/8-27 complete, historical unit-conversion fractions readable; page ends with the zero-task footer.',
  'Mobile67 start1: title fits390, prose wraps without overflow; vector-force definitions8-11/8-12 and sign statements readable.',
  'Mobile67 start2: point-charge formulas complete;113 two panels, signs/vector heads/panel ordinals and114 components/resultant readable at actual358 media width.',
  'Mobile67 start3: force superposition and multiple-field sum complete; model restrictions wrap normally and footer fits.',
  'Mobile67 end2: short subscript scroll state preserves readable charge identifiers around formulas, both diagrams and their captions.',
  'Mobile67 end3: vector components and closing source restrictions intact after short inline scroll; no clipping at footer.',
  'Mobile73 start1: long heading wraps within390 without overlap, complete scientific qualifications and8-20 visible;138 starts in normal document flow.',
  'Mobile73 start2: complete lower138/139 and path-independence transition readable at358 media width. Long8-21 begins at the left edge inside its bounded horizontal scroll region, not whole-page overflow.',
  'Mobile73 start3: closed-path formula and zero-reference divider readable; qEd-qEd0, gravity analogy and final negative-energy paragraph complete.',
  'Mobile73 end1: inline gravity-vector formula remains readable at its tiny horizontal scroll end; heading, prose and upper138 do not shift.',
  'Mobile73 end2: long8-21 right end visibly includes -(EP2-EP1)=-Delta EP and trailing punctuation. Both diagrams and8-22 remain intact; no whole-page overflow.',
  'Mobile73 end3: terminal d0 in reference formula readable and negative-charge restrictions/footer complete at scroll end.',
  'Mobile74 start1: heading and potential definition fit390;8-23 and8-24 fractions readable and paragraph dividers remain clear.',
  'Mobile74 start2:8-25, Delta U and voltage definitions8-26/8-27 complete, with signed quantities and equation numbering visible; no paragraph overlap.',
  'Mobile74 start3: historical units prose complete and conversion starts at1 volt/Joule-per-Coulomb. Its long fraction chain stays in a bounded horizontal scroll region; footer fits.',
  'Mobile74 end3: conversion right end visibly includes1/300 and the full electrostatic potential-difference unit. Final rounding qualification and footer remain readable.',
];
const tiles = [];
for (let index = 0; index < manifest.tiles.length; index++) {
  const tile = manifest.tiles[index];
  await verify(tile.path, tile.sha256);
  tiles.push({ ...tile, actuallyOpened: true, reviewer: 'Main',
    detail: 'original', openCount: 1, status: 'pass', observation: observations[index] });
}
const reviewPath = `${work}/d019-screenshot-review.json`;
assert.ok(!await exists(reviewPath));
await immutableWrite(reviewPath, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D019', status: 'pass',
  role: 'Actual original-pixel inspection of the single D019 desktop/mobile offline run',
  reviewer: 'Main', batchResult: manifest.result, tileManifest: await bind(manifestPath), tiles,
  surfaces: result.results.filter(surface => surface.surface === 'text').map(surface => ({
    card: surface.id, surface: surface.surface, viewport: surface.viewport.width,
    status: 'pass', reviewer: 'Main',
  })),
  emptySourceDefinedSurfaces: manifest.emptySourceDefinedSurfaces,
  exactPixelReuse: manifest.exactPixelReuse,
  affectedObservationCorrection: await bind(`${work}/9p-n67-observation-correction-1/affected-observation-correction.json`),
  limitations: 'Six source-defined zero-task exercise surfaces mechanically asserted, not invented or claimed as nonempty pixel inspections. Four exactly identical cropped scroll-state pixel sets reuse already-opened tiles. Long formulas were checked at both reachable ends.',
  noRepeatedBrowserOrFullProjectChecks: true,
}, null, 2)}\n`);
const aliases = [
  { originalPath: '.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/phy9-c2-s2-n74/lesson.template.json',
    path: `${work}/9p-n74-before-author-correction/lesson.template.json`,
    sha256: 'fc37b5ba0a87d5f2eddd07124fbe19755f41a2dc990636ac8d501b3d701403d7' },
];
const correction = await read(`${work}/9p-n67-observation-correction-1/affected-observation-correction.json`);
for (const preserved of correction.before) aliases.push({
  originalPath: preserved.original.path, path: preserved.path, sha256: preserved.sha256,
});
aliases.push({
  originalPath: `${ticket}/evidence/reports/9p-n67-figure-review.json`,
  path: `${work}/9p-n67-observation-correction-1/9p-n67-figure-review.json`,
  sha256: '0c323b815c40f94385794d5080ad4fd40eaa3883bb90fd1ea23ef5835bb8c922',
});
for (const alias of aliases) await verify(alias.path, alias.sha256);
const planPath = `${work}/d019-final-approval-plan.json`;
assert.ok(!await exists(planPath));
await immutableWrite(planPath, `${JSON.stringify({
  batch: 'D019', final: true, screensApproved: true,
  cards: [67, 73, 74].map(number => `phy9-c2-s2-n${number}`),
  screens: { result: manifest.result, tiles: await bind(manifestPath), review: await bind(reviewPath) },
  aliases, bindingProofs: [],
  extraEvidence: await Promise.all([
    '9p-n67-observation-correction-1/affected-observation-correction.json',
    '9p-n74-before-author-correction/9p-n74-prose-freeze.json',
    'd019-n73-figures-author-freeze.json', 'd019-native-offline-render.json',
    'review-promote-d019-n73.mjs', 'correct-d019-n67-observation.mjs',
    'record-d019-screens-and-plan.mjs', 'render-d019-batch.mjs', 'crop-d019-pixels.py',
  ].map(name => bind(`${work}/${name}`))),
  sourceScope: '225 finalized pages total; D0199p168-186 and10p60-63page-only.167/187 and future188+ excluded from delivery.',
  noNewSourceTextScienceFigureOrBrowserGateAuthorizedByThisRetentionPlan: true,
}, null, 2)}\n`);
console.log(JSON.stringify({ review: await bind(reviewPath), plan: await bind(planPath), tiles: tiles.length }));
