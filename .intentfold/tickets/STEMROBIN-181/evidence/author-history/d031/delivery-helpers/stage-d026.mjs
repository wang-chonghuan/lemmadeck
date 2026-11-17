import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import {
  root, branch, tmp, bytes, bind, sha256, git, exactSet, relative, verifyBindings,
  assertAbsent, writeReceipt, assertContext, stagedPaths, treeEntries, indexEntry,
} from './stage-d025.mjs';

export {
  root, branch, tmp, bytes, bind, sha256, git, exactSet, relative, verifyBindings,
  assertAbsent, writeReceipt, assertContext, stagedPaths, treeEntries, indexEntry,
};
export const stagingPath = `${tmp}/d026-staging-boundary.json`;
export const pushPath = `${tmp}/d026-actual-push-receipt.json`;
export const bookRoot = 'ssot-resources/soviet10year-textbooks/artifacts/9p';
export const modernRoot = `${bookRoot}/editions/modern-us-neutral`;
export const sourceIndex = `${bookRoot}/book.json`;
export const modernIndex = `${modernRoot}/book.json`;
export const projectionPaths = [sourceIndex, modernIndex];
export const sharedIndices = [
  ...projectionPaths,
  'ssot-resources/soviet10year-textbooks/artifacts/10p/book.json',
  'ssot-resources/soviet10year-textbooks/artifacts/10p/editions/modern-us-neutral/book.json',
];
export const cards = ['phy9-c2-s4-n111', 'phy9-c2-s4-n113', 'phy9-c2-s5-n114'];
export const rawCards = [cards[0], cards[1], 'phy9-c2-s4-t18', cards[2]];
export const indexHelper = `${tmp}/stage-edition-index.mjs`;
export const helperPaths = [
  `${tmp}/stage-d026.mjs`, `${tmp}/record-d026-push.mjs`,
  `${tmp}/stage-d025.mjs`, `${tmp}/record-d025-push.mjs`, indexHelper,
];
const ticketRoot = '.intentfold/tickets/STEMROBIN-181';
const evidenceRoot = `${ticketRoot}/evidence`;
const approvedPages = new Set([273, 274, 276, 277, 278, 279, 280, 281, 282, 283]);
const modernFigures = new Set([224, 225, 226, 229, 230, 231, 232, 233, 234, 235, 236, 237]);
const modernFiles = ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json'];
const rawFiles = ['lesson.json', 'exercises.json', 'lesson.md'];
const headBytes = (parent, file) => git(['show', `${parent}:${file}`], { encoding: null });
const json = data => JSON.parse(data);
const uniqueRows = (rows, label) => {
  assert.ok(Array.isArray(rows), `Missing ${label}`);
  for (const row of rows) assert.match(row.id ?? '', /^[a-zA-Z0-9_-]+$/, `Invalid ${label} ID`);
  exactSet(rows.map(row => row.id), [...new Set(rows.map(row => row.id))], `Unique ${label}`);
};

export function ownedPath(file) {
  assert.equal(typeof file, 'string', 'Owned path must be a string');
  assert.ok(!file.includes('\\') && !file.split('/').some(part => !part || part === '.' || part === '..'),
    `Noncanonical owned path: ${file}`);
  assert.equal(relative(file), file, `Owned paths must be repository-relative: ${file}`);
  assert.ok(!file.split('/').some(part =>
    /^(?:\.env|\.tmp(?:$|\.)|tmp$|app$|charter$)/.test(part)),
  `Forbidden manifest path: ${file}`);
  assert.ok(!/(^|[/_.-])(?:10p|n65|t4)(?=$|[/_.-])/i.test(file) &&
    !/(^|[/_.-])fig-10[12](?=$|[/_.-])/i.test(file) &&
    !file.toLowerCase().includes('quarantine'), `Excluded content: ${file}`);
  if (projectionPaths.includes(file) ||
    file === '.claude/skills/ld-s10y-lesson/tools/render_lesson.js' ||
    file === `${ticketRoot}/production-meter.json`) return file;
  if (file.startsWith(`${evidenceRoot}/`)) {
    if (file.startsWith(`${evidenceRoot}/source-pages/`)) {
      const match = /^9p\/(\d{4})\/.+$/.exec(file.slice(`${evidenceRoot}/source-pages/`.length));
      assert.ok(match && approvedPages.has(Number(match[1])), `Unapproved source evidence: ${file}`);
    }
    return file;
  }
  if (file.startsWith(`${modernRoot}/lessons/`)) {
    const [card, name, ...extra] = file.slice(`${modernRoot}/lessons/`.length).split('/');
    assert.ok(cards.includes(card) && modernFiles.includes(name) && !extra.length,
      `Unowned modern lesson: ${file}`);
    return file;
  }
  if (file.startsWith(`${bookRoot}/lessons/`)) {
    const [card, name, ...extra] = file.slice(`${bookRoot}/lessons/`.length).split('/');
    assert.ok(rawCards.includes(card) && rawFiles.includes(name) && !extra.length,
      `Unowned raw lesson: ${file}`);
    return file;
  }
  if (file.startsWith(`${modernRoot}/figures/`)) {
    const match = /^fig-(\d+)\.(?:svg|png|artwork\.png|json|[a-zA-Z0-9_.-]+\.json)$/
      .exec(file.slice(`${modernRoot}/figures/`.length));
    assert.ok(match && match[1] === String(Number(match[1])) && modernFigures.has(Number(match[1])),
      `Unapproved modern figure: ${file}`);
    if (file.endsWith('.artwork.png')) assert.equal(match[1], '229', 'Only fig-229 layered artwork owned');
    return file;
  }
  if (file.startsWith(`${bookRoot}/figures/`)) {
    const match = /^fig-(\d+)\.(?:svg|png)$/.exec(file.slice(`${bookRoot}/figures/`.length));
    assert.ok(match && match[1] === String(Number(match[1])) &&
      Number(match[1]) >= 224 && Number(match[1]) <= 241,
      `Unapproved original figure: ${file}`);
    return file;
  }
  if (file.startsWith(`${bookRoot}/pages/`)) {
    const match = /^(\d{4})\/(?:page\.json|page\.md|audit\.json)$/
      .exec(file.slice(`${bookRoot}/pages/`.length));
    assert.ok(match && approvedPages.has(Number(match[1])), `Unapproved source page: ${file}`);
    return file;
  }
  assert.fail(`Outside explicit D026 product/evidence allowlist: ${file}`);
}

export async function loadFinalization(file) {
  const data = await bytes(file);
  const value = json(data);
  assert.equal(value.status, 'pass', 'Main must supply a passed finalization');
  if (value.ticket !== undefined) assert.equal(value.ticket, 'STEMROBIN-181');
  if (value.batch !== undefined) assert.ok(['D026', 'D-026'].includes(value.batch));
  assert.ok(Array.isArray(value.cards));
  exactSet(value.cards.map(row => {
    if (typeof row === 'string') return row;
    assert.ok(row && (row.book === undefined || row.book === '9p'), 'Only 9p is delivered');
    if (row.status !== undefined) assert.equal(row.status, 'pass');
    return row.card;
  }), cards, 'Exact three D026 modern cards; t18 is source-only');
  for (const field of ['counts', 'currentSourceCounts']) {
    const counts = value[field];
    assert.ok(counts && typeof counts === 'object' && !Array.isArray(counts), `Missing ${field}`);
    const numeric = Object.values(counts).filter(item => typeof item === 'number');
    assert.ok(numeric.length && numeric.every(item => Number.isSafeInteger(item) && item >= 0),
      `Invalid ${field}`);
    if (counts.status !== undefined) assert.equal(counts.status, 'pass');
  }
  assert.ok(Array.isArray(value.ownedFiles) && value.ownedFiles.length, 'Missing explicit ownedFiles');
  const ownedFiles = value.ownedFiles.map(row => {
    const filePath = ownedPath(row.path);
    assert.match(row.sha256 ?? '', /^[a-f0-9]{64}$/, `Missing owned SHA256: ${filePath}`);
    return { path: filePath, sha256: row.sha256 };
  });
  exactSet(ownedFiles.map(row => row.path), [...new Set(ownedFiles.map(row => row.path))],
    'Unique owned paths');
  // Index manifest hashes bind working bytes; staged index bytes are derived, never copied wholesale.
  for (const required of [
    ...projectionPaths,
    ...cards.flatMap(card => modernFiles.map(name => `${modernRoot}/lessons/${card}/${name}`)),
    ...rawCards.flatMap(card => rawFiles.map(name => `${bookRoot}/lessons/${card}/${name}`)),
  ]) assert.ok(ownedFiles.some(row => row.path === required), `Required owned file: ${required}`);
  await verifyBindings(ownedFiles);
  const referencedFigures = new Set();
  for (const card of cards) {
    const figures = json(await bytes(`${modernRoot}/lessons/${card}/figures.json`));
    assert.ok(Array.isArray(figures.figures), `Missing finalized figures: ${card}`);
    for (const row of figures.figures) {
      const match = /^fig-(\d+)$/.exec(row.id ?? '');
      assert.ok(match && modernFigures.has(Number(match[1])), `Unapproved referenced figure: ${card}`);
      referencedFigures.add(row.id);
    }
  }
  for (const row of ownedFiles) {
    if (row.path.startsWith(`${modernRoot}/figures/`)) {
      assert.ok(referencedFigures.has(path.basename(row.path).split('.')[0]),
        `Modern figure not referenced by delivered cards: ${row.path}`);
    }
  }
  let finalized;
  if (value.finalization !== undefined) {
    const report = value.finalization;
    assert.equal(ownedPath(report.path), report.path);
    assert.ok(ownedFiles.some(row => row.path === report.path && row.sha256 === report.sha256),
      'Referenced finalization report must be explicitly owned and hash-bound');
    finalized = json(await bytes(report.path));
    assert.equal(finalized.status, 'pass', 'Bound finalization report must pass');
    assert.deepEqual(finalized.counts, value.counts);
    assert.deepEqual(finalized.currentSourceCounts, value.currentSourceCounts);
  }
  if (value.sourceCountBasis !== undefined && finalized?.sourceCountBasis !== undefined) {
    assert.deepEqual(value.sourceCountBasis, finalized.sourceCountBasis, 'Conflicting source count bases');
  }
  const sourceCountBasis = value.sourceCountBasis ?? finalized?.sourceCountBasis ?? null;
  if (sourceCountBasis !== null) assert.ok(typeof sourceCountBasis === 'string' &&
    sourceCountBasis.trim().length, 'Expected explicit sourceCountBasis prose');
  return { value, ownedFiles, sourceCountBasis,
    binding: { path: relative(file), sha256: sha256(data) } };
}

export function assertPristineStaging(label) {
  exactSet(stagedPaths(), [], label);
  exactSet(git(['diff', '--cached', '--ita-visible-in-index', '--no-renames', '--name-only', '-z'])
    .split('\0').filter(Boolean), [], `${label}; intent-to-add is also pre-staged work`);
  assert.equal(git(['ls-files', '--unmerged', '-z']), '', 'Unmerged index is not pristine');
}

export async function inspectEvidenceIndex(parent, ownedFiles) {
  const file = `${evidenceRoot}/index.json`;
  if (!ownedFiles.some(row => row.path === file)) return null;
  const parentData = headBytes(parent, file);
  const workspace = await bytes(file);
  const base = json(parentData);
  const current = json(workspace);
  exactSet(Object.keys(current), Object.keys(base), 'Ticket evidence index field set');
  const collections = Object.keys(base).filter(key => Array.isArray(base[key]));
  const oldPaths = new Set(collections.flatMap(key => base[key].map(row => row.path)));
  const manifest = new Map(ownedFiles.map(row => [row.path, row.sha256]));
  const newlyIndexed = new Map();
  for (const key of Object.keys(base)) {
    if (key === 'updatedAt') continue;
    if (!collections.includes(key)) {
      assert.deepEqual(current[key], base[key], `Unowned evidence index metadata: ${key}`);
      continue;
    }
    assert.ok(Array.isArray(current[key]), `Missing evidence collection: ${key}`);
    assert.deepEqual(current[key].filter(row => oldPaths.has(row.path)), base[key],
      `Retained evidence rows/order must equal HEAD: ${key}`);
    for (const row of current[key].filter(item => !oldPaths.has(item.path))) {
      assert.equal(ownedPath(row.path), row.path);
      assert.ok(manifest.has(row.path), `New evidence missing from ownedFiles: ${row.path}`);
      assert.match(row.sha256 ?? '', /^[a-f0-9]{64}$/, `Missing new evidence SHA256: ${row.path}`);
      assert.equal(row.sha256, manifest.get(row.path), `New evidence must be manifest-bound: ${row.path}`);
      if (newlyIndexed.has(row.path)) assert.equal(newlyIndexed.get(row.path), row.sha256);
      newlyIndexed.set(row.path, row.sha256);
    }
  }
  return { path: file, headBlobSha256: sha256(parentData), workspaceSha256: sha256(workspace),
    existingRowsAndOrderEqualHead: true, newlyIndexedFiles:
      [...newlyIndexed].map(([filePath, hash]) => ({ path: filePath, sha256: hash })) };
}

function projection(file, parentData, workspace, projected, details) {
  const data = Buffer.from(JSON.stringify(projected, null, 2) + '\n');
  return {
    path: file, data, sha256: sha256(data), stagedBlobSha256: sha256(data),
    workspaceSha256: sha256(workspace), workingSha256: sha256(workspace),
    headBlobSha256: sha256(parentData), book: '9p', partialIndex: true,
    workingBytesDifferFromStaged: sha256(data) !== sha256(workspace),
    preservesUnrelatedWorkingBytes: true, ...details,
  };
}

export async function prepareModernIndex(parent, ownedFiles) {
  const workspace = await bytes(modernIndex);
  const current = json(workspace);
  const parentData = headBytes(parent, modernIndex);
  const base = json(parentData);
  uniqueRows(current.lessons, 'working modern rows');
  uniqueRows(base.lessons, 'HEAD modern rows');
  const available = new Set([
    ...git(['ls-tree', '-r', '--name-only', '-z', parent, '--', `${modernRoot}/lessons`])
      .split('\0').filter(Boolean),
    ...ownedFiles.map(row => row.path),
  ]);
  const projected = structuredClone(current);
  projected.lessons = current.lessons.filter(row =>
    available.has(`${modernRoot}/lessons/${row.id}/lesson.json`));
  exactSet(projected.lessons.filter(row => cards.includes(row.id)).map(row => row.id),
    cards, 'All delivered modern rows');
  for (const row of projected.lessons) {
    for (const name of modernFiles) assert.ok(available.has(`${modernRoot}/lessons/${row.id}/${name}`),
      `Incomplete projected modern lesson: ${row.id}/${name}`);
  }
  assert.deepEqual(projected.lessons.filter(row => !cards.includes(row.id)),
    base.lessons.filter(row => !cards.includes(row.id)), 'Unowned modern rows/order must equal HEAD');
  const metadata = async document => {
    const { lessons, ...rest } = structuredClone(document);
    if (rest.profile?.path) {
      rest.profile.path = relative(rest.profile.path);
      await verifyBindings([rest.profile]);
    }
    return rest;
  };
  assert.deepEqual(await metadata(current), await metadata(base), 'Unowned modern metadata drift');
  return projection(modernIndex, parentData, workspace, projected, {
    ownedCards: cards, sourceIndex: false, omittedWorkingCards:
      current.lessons.filter(row => !projected.lessons.some(item => item.id === row.id)).map(row => row.id),
    unownedRowsAndOrderEqualHead: true,
  });
}

export function sourceProjection(base, current, documents, pagePaths) {
  uniqueRows(base.lessons, 'HEAD source rows');
  uniqueRows(current.lessons, 'working source rows');
  const projected = structuredClone(base);
  const ownedRows = new Map();
  for (const card of rawCards) {
    const row = current.lessons.find(item => item.id === card);
    const { lesson, exercises } = documents.get(card) ?? {};
    assert.ok(row && lesson && exercises, `Missing owned source row/documents: ${card}`);
    assert.equal(lesson.id, card);
    assert.equal(exercises.lesson, card);
    assert.ok(Array.isArray(lesson.prose) && Array.isArray(lesson.figures) &&
      Array.isArray(exercises.exercises), `Malformed source lesson: ${card}`);
    assert.equal(exercises.count, exercises.exercises.length);
    assert.equal(lesson.exercise_count, exercises.count);
    const expected = {
      id: lesson.id, card_id: lesson.card_id, title: lesson.title, number: lesson.number,
      start_printed: lesson.start_printed, prose_blocks: lesson.prose.length,
      exercises: exercises.exercises.length, figures: lesson.figures.length,
    };
    for (const [field, value] of Object.entries(expected)) {
      assert.deepEqual(row[field], value, `Owned source row drift: ${card}/${field}`);
    }
    ownedRows.set(card, structuredClone(row));
  }
  projected.lessons = base.lessons.map(row => ownedRows.get(row.id) ?? structuredClone(row));
  for (const card of rawCards) {
    if (!base.lessons.some(row => row.id === card)) projected.lessons.push(ownedRows.get(card));
  }
  assert.deepEqual(projected.lessons.filter(row => !rawCards.includes(row.id)),
    base.lessons.filter(row => !rawCards.includes(row.id)), 'Unowned source rows/order must equal HEAD');
  exactSet(pagePaths, [...new Set(pagePaths)], 'Unique projected source page paths');
  projected.pages = pagePaths.length;
  assert.ok(projected.audit && typeof projected.audit === 'object');
  projected.audit.exercise_count = projected.lessons.reduce((sum, row) => {
    assert.ok(Number.isSafeInteger(row.exercises) && row.exercises >= 0, `Invalid exercises: ${row.id}`);
    return sum + row.exercises;
  }, 0);
  const figures = new Set();
  for (const row of projected.lessons) {
    const { lesson, exercises } = documents.get(row.id) ?? {};
    assert.ok(lesson && exercises && Array.isArray(lesson.figures) &&
      Array.isArray(exercises.exercises), `Missing projected source bytes: ${row.id}`);
    const actual = [
      ...lesson.figures, ...exercises.exercises.flatMap(exercise => exercise.figures ?? []),
      ...(lesson.prose ?? []).filter(block => block.kind === 'fig'),
    ];
    for (const figure of actual) {
      const match = /^fig-(\d+)$/.exec(figure.id ?? '');
      if (match) figures.add(Number(match[1]));
    }
  }
  projected.audit.figure_numbers = [...figures].sort((a, b) => a - b);
  // All metadata and prior warnings remain HEAD-owned, except these three derived counts.
  const metadata = document => {
    const { lessons, pages, ...rest } = structuredClone(document);
    delete rest.audit.exercise_count;
    delete rest.audit.figure_numbers;
    return rest;
  };
  assert.deepEqual(metadata(projected), metadata(base), 'Source metadata/old warnings changed');
  const n107 = 'phy9-c2-s4-n107';
  assert.ok(base.lessons.some(row => row.id === n107), 'Expected HEAD n107 row');
  assert.deepEqual(projected.lessons.find(row => row.id === n107),
    base.lessons.find(row => row.id === n107), 'HEAD n107 row must remain untouched');
  return projected;
}

export async function prepareSourceIndex(parent, ownedFiles) {
  const workspace = await bytes(sourceIndex);
  const current = json(workspace);
  const parentData = headBytes(parent, sourceIndex);
  const base = json(parentData);
  const owned = new Set(ownedFiles.map(row => row.path));
  const documents = new Map();
  const inputs = [];
  for (const card of [...new Set([...base.lessons.map(row => row.id), ...rawCards])]) {
    assert.match(card, /^[a-zA-Z0-9_-]+$/, 'Invalid source card path');
    const documentsForCard = {};
    for (const [key, name] of [['lesson', 'lesson.json'], ['exercises', 'exercises.json']]) {
      const file = `${bookRoot}/lessons/${card}/${name}`;
      const useWorking = rawCards.includes(card);
      if (useWorking) assert.ok(owned.has(file), `Missing explicit source input: ${file}`);
      const data = useWorking ? await bytes(file) : headBytes(parent, file);
      documentsForCard[key] = json(data);
      inputs.push({ path: file, sha256: sha256(data), basis: useWorking ? 'owned-workspace' : 'HEAD' });
    }
    documents.set(card, documentsForCard);
  }
  const headPages = git(['ls-tree', '-r', '--name-only', '-z', parent, '--', `${bookRoot}/pages`])
    .split('\0').filter(file => /^pages\/\d{4}\/page\.json$/.test(file.slice(`${bookRoot}/`.length)));
  const newPages = ownedFiles.map(row => row.path).filter(file =>
    file.startsWith(`${bookRoot}/pages/`) && file.endsWith('/page.json') && !headPages.includes(file));
  const pagePaths = [...headPages, ...newPages].sort();
  const projected = sourceProjection(base, current, documents, pagePaths);
  const omittedUnrelatedRows = current.lessons.filter(row => !rawCards.includes(row.id)).flatMap(row => {
    const saved = base.lessons.find(item => item.id === row.id);
    return JSON.stringify(row) === JSON.stringify(saved) ? [] : [{
      id: row.id, reason: saved ? 'working-row-drift-kept-HEAD' : 'working-only-row-not-owned',
      workingRow: row, headRow: saved ?? null,
    }];
  });
  const workingPagePaths = git(['ls-files', '--cached', '--others', '--exclude-standard', '-z',
    '--', `${bookRoot}/pages`]).split('\0').filter(file =>
    /^pages\/\d{4}\/page\.json$/.test(file.slice(`${bookRoot}/`.length)));
  return projection(sourceIndex, parentData, workspace, projected, {
    sourceIndex: true, ownedCards: rawCards, inputs, pagePaths, headPagePaths: headPages,
    explicitlyOwnedNewPagePaths: newPages,
    omittedWorkingPagePaths: [...new Set(workingPagePaths)].filter(file => !pagePaths.includes(file)),
    omittedWorkingCards: current.lessons.filter(row =>
      !projected.lessons.some(item => item.id === row.id)).map(row => row.id),
    omittedUnrelatedRows, headN107Untouched: true, unownedRowsAndOrderEqualHead: true,
    projectedCounts: { pages: projected.pages, exerciseObjects: projected.audit.exercise_count,
      figureNumbers: projected.audit.figure_numbers },
    currentIndexCountsOmitted: { pages: current.pages, exerciseObjects: current.audit?.exercise_count,
      figureNumbers: current.audit?.figure_numbers },
    oldWarningsAndOtherMetadataPreserved: true,
    pageCountBasis: 'HEAD tree page.json files plus explicitly owned new page.json paths only',
  });
}

export function assertN107Untouched(parent, revision) {
  const files = treeEntries(parent, [`${bookRoot}/lessons/phy9-c2-s4-n107`]);
  assert.ok(files.size, 'Missing HEAD n107 files');
  const actual = revision ? treeEntries(revision, [...files.keys()]) : null;
  for (const [file, entry] of files) {
    if (revision) assert.deepEqual(actual.get(file), entry, `Unowned n107 tree drift: ${file}`);
    else {
      const staged = indexEntry(file);
      assert.deepEqual({ mode: staged.mode, blob: staged.stagedBlobSha }, entry,
        `Unowned n107 index drift: ${file}`);
    }
  }
  return [...files].map(([file, entry]) => ({
    path: file, ...entry, headBlobSha256: sha256(headBytes(parent, file)),
  }));
}

export async function stage(finalizationFile) {
  await assertAbsent(stagingPath);
  await assertAbsent(pushPath);
  const parent = assertContext();
  assertPristineStaging('Require pristine staging; preserve pre-staged work and stop');
  const finalization = await loadFinalization(finalizationFile);
  const helperBindings = await Promise.all(helperPaths.map(bind));
  const preservedWorkingIndices = await Promise.all(sharedIndices.map(bind));
  const headN107 = assertN107Untouched(parent);
  const preservedN107 = await Promise.all(headN107.map(row => bind(row.path)));
  const projections = [
    await prepareModernIndex(parent, finalization.ownedFiles),
    await prepareSourceIndex(parent, finalization.ownedFiles),
  ];
  const evidenceIndex = await inspectEvidenceIndex(parent, finalization.ownedFiles);
  for (const row of projections) assert.notEqual(row.sha256, row.headBlobSha256,
    `Required delivery index has no byte change: ${row.path}`);
  const fullFiles = finalization.ownedFiles.filter(row => !projectionPaths.includes(row.path));
  const parentFiles = treeEntries(parent, fullFiles.map(row => row.path));
  const modeChanges = new Set(git(['diff', '--no-ext-diff', '--no-renames', '--name-only', '-z',
    parent, '--', ...fullFiles.map(row => row.path)]).split('\0').filter(Boolean));
  const ownedChanged = fullFiles.filter(row => {
    const before = parentFiles.get(row.path);
    return !before || modeChanges.has(row.path) ||
      sha256(git(['cat-file', 'blob', before.blob], { encoding: null })) !== row.sha256;
  });
  for (const row of ownedChanged) {
    assert.ok(!row.path.startsWith(`${evidenceRoot}/`) || row.path === `${evidenceRoot}/index.json` ||
      !parentFiles.has(row.path), `Retained original evidence is immutable: ${row.path}`);
  }
  const preservedWorkspace = [
    ...finalization.ownedFiles, ...preservedWorkingIndices, ...preservedN107,
    finalization.binding, ...helperBindings,
  ];
  const verifyStage = async rows => {
    assertContext(parent);
    exactSet(stagedPaths(), rows.map(row => row.path), 'Exact D026 staged boundary');
    for (const row of rows) {
      indexEntry(row.path);
      assert.equal(sha256(git(['show', `:${row.path}`], { encoding: null })), row.sha256,
        `Staged hash mismatch: ${row.path}`);
    }
    assertN107Untouched(parent);
    await verifyBindings(preservedWorkspace);
  };
  await verifyBindings(preservedWorkspace);
  assertContext(parent);
  assertPristineStaging('Concurrent staging; nothing is reset');
  assert.ok(ownedChanged.length, 'No owned ordinary files to stage');
  git(['add', '--', ...ownedChanged.map(row => row.path)]);
  const expected = [...ownedChanged];
  await verifyStage(expected);
  // The retained writer runs only after every owned modern lesson file is staged.
  const modern = projections[0];
  const output = execFileSync(process.execPath, [path.resolve(root, indexHelper), '9p'], {
    cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
    env: { ...process.env, GIT_OPTIONAL_LOCKS: '0', GIT_LITERAL_PATHSPECS: '1',
      GIT_NO_REPLACE_OBJECTS: '1' },
  });
  expected.push(modern);
  await verifyStage(expected);
  const source = projections[1];
  exactSet(git(['ls-files', '--cached', '-z', '--', `${bookRoot}/pages`]).split('\0').filter(file =>
    /^pages\/\d{4}\/page\.json$/.test(file.slice(`${bookRoot}/`.length))),
  source.pagePaths, 'Source pages must be HEAD plus explicitly staged new pages, not untracked work');
  for (const input of source.inputs) assert.equal(
    sha256(git(['show', `:${input.path}`], { encoding: null })), input.sha256,
    `Projected source input differs from actual staging: ${input.path}`);
  const sourceObject = git(['hash-object', '-w', '--stdin'], { input: source.data }).trim();
  assert.match(sourceObject, /^[a-f0-9]{40}$/);
  const sourceMode = treeEntries(parent, [sourceIndex]).get(sourceIndex)?.mode;
  assert.ok(['100644', '100755'].includes(sourceMode), 'Expected regular HEAD source index');
  git(['update-index', '--cacheinfo', `${sourceMode},${sourceObject},${sourceIndex}`]);
  expected.push(source);
  await verifyStage(expected);
  const files = [
    ...ownedChanged.map(row => ({ ...row, stagedBlobSha256: row.sha256,
      workspaceSha256: row.sha256, workingSha256: row.sha256, partialIndex: false })),
    ...projections.map(({ data, ...row }) => row),
  ].map(row => ({ ...row, ...indexEntry(row.path) })).sort((a, b) => a.path.localeCompare(b.path));
  await verifyStage(files);
  await writeReceipt(stagingPath, {
    ticket: 'STEMROBIN-181', batch: 'D026', status: 'exact-owned-files-staged',
    branch, parent, headBefore: parent, cards, rawCards, finalization: finalization.binding,
    counts: finalization.value.counts, currentSourceCounts: finalization.value.currentSourceCounts,
    sourceCountBasis: finalization.sourceCountBasis, evidenceIndex,
    files, unchangedOwnedFiles: fullFiles.filter(row => !ownedChanged.includes(row)),
    preservedWorkspace, preservedWorkingIndices, preservedN107, headN107, helperBindings,
    indexProjections: files.filter(row => row.partialIndex),
    indexOperations: [
      { path: modernIndex, helper: helperBindings.find(row => row.path === indexHelper), output },
      { path: sourceIndex, method: 'HEAD-source-partial-projection', sourceObject },
    ],
    sourceIndexPartial: true, modernIndexPartial: true, sharedWorkingIndicesUnchanged: true,
    omittedUnrelatedRows: source.omittedUnrelatedRows,
    sourceCurrentIndexOmission: {
      path: sourceIndex, currentWorkspaceSha256: source.workspaceSha256,
      stagedBlobSha256: source.sha256, currentCounts: source.currentIndexCountsOmitted,
      projectedCounts: source.projectedCounts, omittedPagePaths: source.omittedWorkingPagePaths,
      omittedRows: source.omittedUnrelatedRows, wholesaleCurrentIndexNotStaged: true,
    },
    omittedSharedIndices: sharedIndices.filter(file => !projectionPaths.includes(file)),
    limits: 'Staging only. No commit, push, sync, rebase, gate/image/browser jobs, or product workspace writes.',
  });
  console.log(JSON.stringify({ staged: files.length, boundary: stagingPath, parent,
    sourceIndexPartial: true, modernIndexPartial: true }));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [execute, file, ...extra] = process.argv.slice(2);
  assert.ok(execute === '--execute' && file && !extra.length,
    'PREPARE ONLY. Usage: node stage-d026.mjs --execute <passedFinalizationJSONpath>');
  await stage(file);
}
