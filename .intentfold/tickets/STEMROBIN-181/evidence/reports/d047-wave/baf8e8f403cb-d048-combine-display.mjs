import assert from 'node:assert/strict';
import {
  ticket, read, bytes, bind, verify, immutableWrite,
} from './retain-d016-evidence.mjs';
assert.deepEqual(process.argv.slice(2), ['--execute']);
const initialPath = `${ticket}/tmp/d048-effective-wave-display.json`;
const repairPath = `${ticket}/tmp/d048-numbering-repair/run-03638bf0a82c-2026-11-17T10-36-08-022Z/result.json`;
await verify(initialPath, '4e0d37f0848ae850a5c22adc71a9cd08543653f062315a2a6d3172bfef83196d');
await verify(repairPath, '370fad3342de5d93548cf9e1bb74a2cfa3dbb8f9f38de9a90ebc03bdfef83ffa');
const initial = await read(initialPath), repair = await read(repairPath);
assert.deepEqual(repair.failures, []);
assert.equal(repair.surfaces.length, 8);
assert.equal(repair.execution.browserClosed, true);
const affected = id => id.startsWith('phy10-c1-s5-n39-') && /-(exercises|answers)-/.test(id);
assert.ok(repair.surfaces.every(row => affected(row.id)));
const replacements = new Map(repair.surfaces.map(row => [row.id, row]));
const effective = structuredClone(initial);
effective.surfaces = initial.surfaces.map(row => affected(row.id) ? replacements.get(row.id) : row);
assert.equal(effective.surfaces.length, 40);
assert.ok(effective.surfaces.every(row => row?.status === 'PASS-mechanical'));
const mergeAssets = field => [
  ...initial[field].filter(row => !affected(row.surface)), ...repair[field],
];
effective.screenshots = mergeAssets('screenshots');
effective.tiles = mergeAssets('tiles');
assert.equal(new Set(effective.tiles.map(row => row.path)).size, effective.tiles.length);
for (const row of effective.tiles) await verify(row.path, row.sha256);
effective.nativeResults = repair.nativeResults;
effective.supplementalAssembly = initial.supplementalAssembly.map(row => {
  const updated = repair.supplementalAssembly.find(other => other.language === row.language);
  return {
    ...updated,
    generatedHTML: [
      row.generatedHTML.find(html => html.kind === 'choices'),
      updated.generatedHTML.find(html => html.kind === 'answers'),
    ],
    originalAssembly: row,
    unchangedChoiceHTMLReused: true,
  };
});
const toolVersions = [];
for (const name of ['publish_merge.js', 'render_lesson.js']) {
  const originalPath = `.claude/skills/ld-s10y-lesson/tools/${name}`;
  const snapshotPath = `${ticket}/tmp/d048-numbering-repair/original-tools/${name}`;
  const prior = initial.inputsAfter.find(row => row.path.endsWith(`/${originalPath}`));
  assert.ok(prior);
  await verify(snapshotPath, prior.sha256);
  toolVersions.push({ ...await bind(snapshotPath), originalPath });
}
const rebindVersion = row => {
  const version = toolVersions.find(version => row.path.endsWith(`/${version.originalPath}`)
    && row.sha256 === version.sha256);
  return version ? { ...row, originalPath: row.path, path: version.path,
    retainedVersionSnapshot: true } : row;
};
effective.inputsAfter = [...initial.inputsAfter.map(rebindVersion), ...repair.inputsAfter];
for (const row of effective.inputsAfter) await verify(row.path, row.sha256);
effective.inputHTMLUnchanged = effective.inputsAfter.filter(row => row.role === 'immutable-inputHTML');
effective.execution = {
  ...repair.execution, browserPasses: 2, browserLaunches: 2, isolatedContexts: 2,
  nativeRerenders: 2, repairs: 1,
  initialPass: await bind(initialPath), affectedRepairPass: await bind(repairPath),
  affectedSurfaces: repair.surfaces.map(row => row.id), unaffectedSurfacesReplayed: 0,
  nativeRerenderScope: 'Two affected n39 locale preview commands; text outputs byte-identical and not revisited. No native finalize, figure render, or semantic review replay.',
};
effective.status = 'PASS-mechanical-40-effective-surfaces-independent-display-review-pending';
effective.effectiveDisplayCombination = {
  initial: await bind(initialPath), repair: await bind(repairPath), toolVersions,
  unaffectedSurfaces: 32, affectedSurfaces: 8, newSubstantiveReviews: 0,
  originalFailureNotErased: true,
};
const destination = `${ticket}/tmp/d048-effective-wave-display-final.json`;
await immutableWrite(destination, `${JSON.stringify(effective, null, 2)}\n`);
const reviewBatches = [];
for (let i = 0; i < repair.tiles.length; i += 8)
  reviewBatches.push({ batch: reviewBatches.length + 1, assets: repair.tiles.slice(i, i + 8), maxImageOpens: 8 });
const repairTilesPath = `${ticket}/tmp/d048-repair-display-tiles.json`;
await immutableWrite(repairTilesPath, `${JSON.stringify({
  ticket: 'STEMROBIN-181', repair: await bind(repairPath), reviewBatches,
}, null, 2)}\n`);
const filteredReports = [];
const allowed = new Set(effective.tiles.map(row => `${row.path}:${row.sha256}`));
for (let n = 1; n <= 5; n++) {
  const originalReportPath = `${ticket}/tmp/d048-display-review-${String(n).padStart(2, '0')}.json`;
  const report = await read(originalReportPath);
  const tiles = report.tiles.filter(row => allowed.has(`${row.path}:${row.sha256}`));
  assert.ok(tiles.length <= 8 && tiles.length > 0);
  assert.ok(tiles.every(row => row.actuallyOpened && row.status === 'PASS' && row.defects.length === 0));
  const destination = `${ticket}/tmp/d048-display-retained-${String(n).padStart(2, '0')}.json`;
  await immutableWrite(destination, `${JSON.stringify({
    status: 'PASS', reviewer: report.reviewer, imagesOpened: tiles.length, tiles,
    originalReport: await bind(originalReportPath), originalImagesOpened: report.imagesOpened,
    derivedCoverageOnly: true, imagesReopened: 0,
    scope: 'Exact first-person PASS subset for unchanged final surfaces. Initial n39 numbering-failed or superseded screenshots remain in original reports.',
  }, null, 2)}\n`);
  filteredReports.push(await bind(destination));
}
console.log(JSON.stringify({ display: await bind(destination),
  repairTiles: await bind(repairTilesPath), repairTilesCount: repair.tiles.length,
  repairBatches: reviewBatches.length, filteredReports }));
