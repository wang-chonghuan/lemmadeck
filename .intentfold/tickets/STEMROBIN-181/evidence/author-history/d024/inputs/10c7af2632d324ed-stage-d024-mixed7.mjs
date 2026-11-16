import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import {
  ticket, tmp, evidence, indexPath, collections, bytes, read, bind, verify, hash, exists,
  immutableWrite, absolute, relative, jsonBytes, targets, finalCards, finalFigures, sourceCards,
  sourcePages, sourceFigureIds, finalizationPath, stagingPath, bookRoot, modernRoot,
  branch, parentPrefix, exactSet,
} from './d024-contract-mixed7.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute'], 'PREPARE ONLY; main authorizes staging later.');
assert.ok(!await exists(stagingPath), 'Staging already consumed.');
const git = (args, options = {}) => execFileSync('git', args, {
  cwd: absolute('.'), encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, ...options,
});
assert.equal(git(['branch', '--show-current']).trim(), branch);
assert.equal(git(['diff', '--cached', '--name-only']).trim(), '', 'Preserve other staged work.');
const parent = git(['rev-parse', 'HEAD']).trim();
assert.ok(parent.startsWith(parentPrefix), 'Expected current parent ab07fc9; do not rebase or change branch.');
const finalization = await read(finalizationPath);
assert.equal(finalization.status, 'pass');
assert.deepEqual(finalization.cards.map(row => row.card), finalCards);
assert.deepEqual(finalization.sourcePages, sourcePages);
assert.deepEqual(finalization.figures, finalFigures);
assert.deepEqual(finalization.sourceFigures, sourceFigureIds);
const allowed = new Set([indexPath, `${ticket}/production-meter.json`, finalizationPath]);
const index = await read(indexPath);
const ownedEvidence = collections.flatMap(name => index[name] ?? []).filter(row => row.batch === 'D-024');
assert.ok(ownedEvidence.length);
for (const row of ownedEvidence) {
  const file = relative(row.path);
  assert.ok(file.startsWith(`${evidence}/`));
  await verify(file, row.sha256);
  allowed.add(file);
}
const carryover = ownedEvidence.filter(row => row.priorBatch === 'D-023');
assert.equal(carryover.length, 4);
const figures = new Set();
for (const page of sourcePages) {
  const folder = `${bookRoot('9p')}/pages/${String(page).padStart(4, '0')}`;
  for (const name of ['page.md', 'page.json', 'audit.json']) allowed.add(`${folder}/${name}`);
  for (const row of (await read(`${folder}/page.json`)).meta.figures) figures.add(row.id);
}
exactSet([...figures], sourceFigureIds, 'approved SOURCE9p figures');
for (const id of sourceFigureIds) {
  for (const suffix of ['png', 'svg']) allowed.add(`${bookRoot('9p')}/figures/${id}.${suffix}`);
}
const pageSet = new Set(sourcePages);
for (const card of sourceCards) {
  const folder = `${bookRoot('9p')}/lessons/${card}`;
  const source = await read(`${folder}/lesson.json`);
  const tasks = await read(`${folder}/exercises.json`);
  const refs = [...source.prose.flatMap(row => row.source_refs ?? []),
    ...tasks.exercises.flatMap(row => row.pages ?? [])];
  assert.ok(refs.some(ref => pageSet.has(Number(/^p(\d+)#/.exec(ref)?.[1]))));
  assert.ok(refs.every(ref => {
    const page = Number(/^p(\d+)#/.exec(ref)?.[1]);
    return !Number.isFinite(page) || page <= 243 && page !== 235;
  }), `Unfinalized SOURCE235/244-251 must not enter owned source card: ${card}`);
  for (const name of ['lesson.json', 'lesson.md', 'exercises.json']) allowed.add(`${folder}/${name}`);
}
for (const target of targets) {
  for (const name of ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']) {
    allowed.add(`${modernRoot(target.book)}/lessons/${target.card}/${name}`);
  }
}
for (const { book, id } of finalFigures) {
  const folder = `${modernRoot(book)}/figures`;
  const spec = await read(`${folder}/${id}.spec.json`);
  assert.ok(['deterministic', 'generated'].includes(spec.mode));
  for (const suffix of ['spec.json', spec.mode === 'generated' ? 'png' : 'svg',
    spec.mode === 'generated' ? 'png.json' : 'render.json', 'independent-review.json', 'review.json']) {
    allowed.add(`${folder}/${id}.${suffix}`);
  }
}

// Every projection starts from HEAD. No shared workbook is ever git-added whole.
const projections = [];
async function projectIndex(file, ownedCards, { source = false, partialIndex = false } = {}) {
  const workspace = await bytes(file);
  const current = JSON.parse(workspace);
  const headBytes = git(['show', `${parent}:${file}`], { encoding: null });
  const base = JSON.parse(headBytes);
  assert.ok(Array.isArray(base.lessons) && Array.isArray(current.lessons));
  assert.equal(new Set(current.lessons.map(row => row.id)).size, current.lessons.length);
  if (!source && file.includes('/9p/')) {
    for (const id of ['phy9-c2-s3-n94', 'phy9-c2-s3-n95', 'phy9-c2-s4-n98']) {
      assert.ok(!current.lessons.some(row => row.id === id), `Excluded modern index row: ${id}`);
    }
    assert.ok(!base.lessons.some(row => ownedCards.includes(row.id)),
      'Only new owned modern9p93/97 rows may enter this batch.');
  }
  const selected = new Map(ownedCards.map(id => {
    const row = current.lessons.find(item => item.id === id);
    assert.ok(row, `Missing owned index row: ${id}`);
    return [id, row];
  }));
  if (partialIndex) {
    assert.deepEqual(ownedCards, [targets[2].card]);
    assert.ok(!base.lessons.some(row => selected.has(row.id)), '10p7 must be the ONLY new owned row.');
  }
  const projected = structuredClone(base);
  projected.lessons = base.lessons.map(row => selected.get(row.id) ?? row);
  for (const row of current.lessons) {
    if (!selected.has(row.id) || base.lessons.some(item => item.id === row.id)) continue;
    const next = current.lessons.slice(current.lessons.indexOf(row) + 1)
      .find(item => projected.lessons.some(existing => existing.id === item.id));
    const position = next ? projected.lessons.findIndex(item => item.id === next.id) : projected.lessons.length;
    projected.lessons.splice(position, 0, row);
  }
  if (source) {
    let added = 0;
    for (const page of sourcePages) {
      const audit = `${bookRoot('9p')}/pages/${String(page).padStart(4, '0')}/audit.json`;
      if (!git(['ls-tree', '-z', parent, '--', audit])) added++;
      else assert.equal(JSON.parse(git(['show', `${parent}:${audit}`])).status, 'pass');
    }
    projected.pages = base.pages + added;
    assert.equal(current.pages, projected.pages, 'Unowned SOURCE page count change.');
    assert.deepEqual(current.audit.errors, []);
    assert.equal(current.audit.exercise_count,
      projected.lessons.reduce((sum, row) => sum + row.exercises, 0));
    const addedFigureNumbers = sourceFigureIds.flatMap(id => {
      const match = /^fig-(\d+)$/.exec(id);
      return match ? [Number(match[1])] : [];
    });
    assert.deepEqual(current.audit.figure_numbers,
      [...new Set([...base.audit.figure_numbers, ...addedFigureNumbers])].sort((a, b) => a - b));
    for (const key of ['exercise_numbering', 'exercise_range', 'katex_warnings']) {
      assert.deepEqual(current.audit[key], base.audit[key], `Unowned source-audit field: ${key}`);
    }
    const assembly = await read(`${tmp}/d025-source236-243-finalization.json`);
    for (const warning of current.audit.warnings) {
      assert.ok(assembly.assembly.output.includes(warning), 'Warning absent from the saved owning assembly.');
    }
    projected.audit = structuredClone(current.audit);
  }
  const headMetadata = { ...base };
  const workingMetadata = { ...current };
  delete headMetadata.lessons;
  delete workingMetadata.lessons;
  if (headMetadata.profile?.path && workingMetadata.profile?.path) {
    assert.equal(relative(headMetadata.profile.path), relative(workingMetadata.profile.path));
    await verify(workingMetadata.profile.path, workingMetadata.profile.sha256);
    headMetadata.profile = { ...headMetadata.profile, path: relative(headMetadata.profile.path) };
    workingMetadata.profile = { ...workingMetadata.profile, path: relative(workingMetadata.profile.path) };
  }
  if (source) {
    delete headMetadata.pages;
    delete workingMetadata.pages;
    delete headMetadata.audit;
    delete workingMetadata.audit;
  }
  assert.deepEqual(workingMetadata, headMetadata, 'Unowned index metadata drift.');
  assert.deepEqual(projected.lessons.filter(row => !selected.has(row.id)),
    base.lessons.filter(row => !selected.has(row.id)), 'Unowned HEAD rows/order changed.');
  exactSet(projected.lessons.filter(row => !base.lessons.some(item => item.id === row.id)).map(row => row.id),
    ownedCards.filter(id => !base.lessons.some(row => row.id === id)), 'only new owned rows');
  const data = jsonBytes(projected);
  assert.notEqual(hash(data), hash(headBytes), `Required explicit index has no owned changes: ${file}`);
  projections.push({ path: file, data, sha256: hash(data), stagedBlobSha256: hash(data),
    workspaceSha256: hash(workspace), workingSha256: hash(workspace), headBlobSha256: hash(headBytes),
    ownedCards, partialIndex, preservesUnrelatedWorkingBytes: true,
    unownedWorkingRowsNotStaged: current.lessons.filter(row => !selected.has(row.id) &&
      JSON.stringify(row) !== JSON.stringify(base.lessons.find(item => item.id === row.id))).map(row => row.id) });
}
await projectIndex(`${bookRoot('9p')}/book.json`, sourceCards, { source: true });
await projectIndex(`${modernRoot('9p')}/book.json`, finalCards.slice(0, 2));
await projectIndex(`${modernRoot('10p')}/book.json`, [targets[2].card], { partialIndex: true });
const helperBytes = await bytes(`${tmp}/stage-d024-mixed7.mjs`);
const helperRow = {
  path: `${evidence}/author-history/d024/inputs/${hash(helperBytes).slice(0, 16)}-stage-d024-mixed7.mjs`,
  originalPath: `${tmp}/stage-d024-mixed7.mjs`, sha256: hash(helperBytes), batch: 'D-024',
};
await immutableWrite(helperRow.path, helperBytes);
if (!index.reports.some(row => row.path === helperRow.path)) {
  index.reports.push(helperRow);
  await fs.writeFile(absolute(indexPath), jsonBytes(index));
}
allowed.add(helperRow.path);
const projectionPaths = new Set(projections.map(row => row.path));
const changed = new Set([
  ...git(['diff', '--name-only', '-z', 'HEAD']).split('\0'),
  ...git(['ls-files', '--others', '--exclude-standard', '-z']).split('\0'),
].filter(Boolean));
const files = [...allowed].filter(file => changed.has(file) && !projectionPaths.has(file)).sort();
assert.ok(files.length);
for (const file of files) {
  assert.ok(!/(^|\/)\.env(?:$|\.)/.test(file) && !file.startsWith('.tmp/') &&
    !file.startsWith(`${tmp}/`) && !file.startsWith('app/'), `Forbidden staging: ${file}`);
  if (file.startsWith(`${evidence}/`)) continue;
  assert.ok(!file.includes('/phy9-c1-s7-t4/') && !/\/fig-10[12]\./.test(file) &&
    !file.includes('/phy9-c2-s2-n65/') && !/\/pages\/(?:0235|024[4-9]|025[01])\//.test(file));
  if (file.includes('/10p/')) {
    assert.ok(file.startsWith(`${modernRoot('10p')}/`) &&
      (file.startsWith(`${modernRoot('10p')}/lessons/${targets[2].card}/`) ||
      targets[2].figures.some(id => file.startsWith(`${modernRoot('10p')}/figures/${id}.`))),
    `Only exact mixed10p7 modern files allowed: ${file}`);
  }
}
const bindings = await Promise.all(files.map(async file => {
  const row = await bind(file);
  return { ...row, stagedBlobSha256: row.sha256, workspaceSha256: row.sha256 };
}));
for (const row of bindings) await verify(row.path, row.workspaceSha256);
for (const row of projections) await verify(row.path, row.workspaceSha256);
assert.equal(git(['rev-parse', 'HEAD']).trim(), parent, 'Concurrent HEAD change.');
assert.equal(git(['diff', '--cached', '--name-only']).trim(), '', 'Concurrent staged work.');
git(['add', '--', ...files]);
for (const row of projections) {
  const oid = git(['hash-object', '-w', '--stdin'], { input: row.data }).trim();
  git(['update-index', '--add', '--cacheinfo', `100644,${oid},${row.path}`]);
  assert.equal(hash(git(['show', `:${row.path}`], { encoding: null })), row.stagedBlobSha256);
  await verify(row.path, row.workspaceSha256);
}
for (const row of bindings) {
  assert.equal(hash(git(['show', `:${row.path}`], { encoding: null })), row.stagedBlobSha256);
}
const allBindings = [...bindings, ...projections.map(({ data, ...row }) => row)]
  .sort((a, b) => a.path.localeCompare(b.path));
exactSet(git(['diff', '--cached', '--name-only', '-z']).split('\0').filter(Boolean),
  allBindings.map(row => row.path), 'exact staged boundary');
await immutableWrite(stagingPath, jsonBytes({
  batch: 'D024', status: 'exact-owned-files-staged', parent, cards: finalCards, files: allBindings,
  sourcePages, sourceCards, sourceFigures: sourceFigureIds, modernFigures: finalFigures,
  bothIndicesExplicit: true, threeIndicesExplicit: true,
  indexProjections: projections.map(({ data, ...row }) => row),
  carryover: carryover.map(row => ({ path: row.path, sha256: row.sha256 })),
  excludedDirty: '10pSOURCE unchanged;10pn5 files/working index row untouched.9pt4/fig101-102,n65,.env unchanged. SOURCE235/244-251 unfinalized;98live modern/portrait never included.',
}));
console.log(JSON.stringify({ staged: allBindings.length, threeIndicesExplicit: true,
  sharedWorkingIndicesUnchanged: true, partial10pIndex: true }));
