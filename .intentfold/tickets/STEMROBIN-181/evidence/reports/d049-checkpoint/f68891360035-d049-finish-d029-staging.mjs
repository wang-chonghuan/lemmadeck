import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, indexPath, absolute, read, bytes, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const folder = `${ticket}/tmp/d029`;
const manifestPath = `${folder}/manifest.json`;
const manifest = await read(manifestPath);
const { parent, branch } = manifest;
function git(args, binary = false) {
  const result = spawnSync('git', args, {
    cwd: root, encoding: binary ? undefined : 'utf8',
    timeout: 180000, maxBuffer: 128 * 1024 * 1024,
  });
  assert.equal(result.status, 0, String(result.stderr));
  return result.stdout;
}
assert.equal(git(['branch', '--show-current']).trim(), branch);
assert.equal(git(['rev-parse', 'HEAD']).trim(), parent);
assert.equal(await exists(`${folder}/staging.json`), false);
const projections = [];
for (const book of ['9p', '10p']) {
  const raw = `ssot-resources/soviet10year-textbooks/artifacts/${book}`;
  for (const suffix of ['book.json', 'editions/modern-us-neutral/book.json']) {
    projections.push({
      target: `${raw}/${suffix}`, from: `${folder}/projection/${book}/${suffix}`,
      before: await bind(`${raw}/${suffix}`),
    });
  }
}
projections.push({
  target: indexPath, from: `${folder}/projection/evidence-index.json`,
  before: await bind(indexPath),
});
const projectedPaths = new Set(projections.map(row => row.target));
const files = manifest.ownedFiles.filter(row => !projectedPaths.has(row.path));
for (const row of manifest.ownedFiles) await verify(row.path, row.sha256);
for (const row of files)
  assert.deepEqual(git(['show', `:${row.path}`], true), await bytes(row.path));
const unchangedProjections = [];
for (const row of projections) {
  const staged = git(['show', `:${row.target}`], true);
  assert.deepEqual(staged, await bytes(row.from));
  await verify(row.before.path, row.before.sha256);
  if (staged.equals(git(['show', `${parent}:${row.target}`], true)))
    unchangedProjections.push(row.target);
}
assert.deepEqual(unchangedProjections, [
  'ssot-resources/soviet10year-textbooks/artifacts/9p/book.json',
  'ssot-resources/soviet10year-textbooks/artifacts/9p/editions/modern-us-neutral/book.json',
]);
const expected = [...files.map(row => row.path), ...projections
  .filter(row => !unchangedProjections.includes(row.target)).map(row => row.target)].sort();
const actual = git(['diff', '--cached', '--name-only', '-z']).split('\0').filter(Boolean).sort();
assert.deepEqual(actual, expected);
assert.ok(actual.every(file => !file.includes('.env') && !file.startsWith('app/')
  && !file.includes('/charter/') && !file.split('/').includes('tmp')
  && !file.endsWith('/assemble.py')));
const preservation = await read(`${ticket}/tmp/d032-start/preservation.json`);
for (const row of preservation.files.filter(row =>
  row.path !== 'ssot-resources/soviet10year-textbooks/artifacts/10p/book.json')) {
  await verify(row.path, row.sha256);
  assert.equal((await fs.stat(absolute(row.path))).mode & 0o777, row.mode);
}
await verify('.claude/skills/ld-s10y-lesson/tools/assemble.py',
  '4f16b51802a415cebcfec6fb359549027f8b3bd6ba8d62ef0fad5f0187494340');
await verify('.claude/skills/ld-s10y-lesson/tools/edition.py',
  '123886f27b64f0200f3157280b38c86ac9c208c6da1b53895dc93294ffeb2170');
const resolutionPath = `${folder}/staging-assertion-resolution.json`;
await immutableWrite(resolutionPath, `${JSON.stringify({
  status: 'PASS-captured-staging-resolution', parent, branch,
  manifest: await bind(manifestPath), stagedPaths: actual.length,
  unchangedProjections, correctedHelper: await bind(`${ticket}/tmp/d029-batch.mjs`),
  resolver: await bind(process.argv[1]),
  reason: 'Git reports changed paths only; two HEAD-identical 9p projections are not changes.',
  stagingReplayed: false, contentChecksReplayed: false, workingFilesChanged: false,
}, null, 2)}\n`);
await immutableWrite(`${folder}/staging.json`, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D029', parent, branch,
  manifest: await bind(manifestPath), files, projections,
  preservedUnownedFiles: preservation.files.length - 1, sharedWorkingIndicesUnchanged: true,
  assertionResolution: await bind(resolutionPath), unchangedProjections,
}, null, 2)}\n`);
console.log(JSON.stringify({ staged: actual.length, staging: await bind(`${folder}/staging.json`) }));
