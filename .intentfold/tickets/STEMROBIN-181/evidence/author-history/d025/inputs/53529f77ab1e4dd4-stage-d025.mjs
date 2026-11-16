import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

export const root = fileURLToPath(new URL('../../../../', import.meta.url));
export const branch = 'codex/STEMROBIN-181-textbooks';
export const tmp = '.intentfold/tickets/STEMROBIN-181/tmp';
export const stagingPath = `${tmp}/d025-staging-boundary.json`;
export const pushPath = `${tmp}/d025-actual-push-receipt.json`;
export const helperPaths = [
  `${tmp}/stage-d025.mjs`, `${tmp}/record-d025-push.mjs`, `${tmp}/stage-edition-index.mjs`,
];
export const targets = [
  { book: '10p', card: 'phy10-c1-s2-n5' },
  { book: '9p', card: 'phy9-c2-s4-n101' },
  { book: '9p', card: 'phy9-c2-s4-n105' },
];
export const cards = targets.map(row => row.card);
const bookRoot = book => `ssot-resources/soviet10year-textbooks/artifacts/${book}`;
const modernRoot = book => `${bookRoot(book)}/editions/modern-us-neutral`;
export const sourceIndices = ['9p', '10p'].map(book => `${bookRoot(book)}/book.json`);
export const modernIndices = ['9p', '10p'].map(book => `${modernRoot(book)}/book.json`);
const lessonFiles = ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json'];
const requiredLessons = targets.flatMap(({ book, card }) =>
  lessonFiles.map(name => `${modernRoot(book)}/lessons/${card}/${name}`));
export const sha256 = data => createHash('sha256').update(data).digest('hex');
const gitEnv = () => ({
  ...process.env, GIT_OPTIONAL_LOCKS: '0', GIT_LITERAL_PATHSPECS: '1', GIT_NO_REPLACE_OBJECTS: '1',
});
export const git = (args, options = {}) => execFileSync('git', args, {
  cwd: root, env: gitEnv(), encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, ...options,
});
export const exactSet = (actual, expected, label) => {
  assert.equal(new Set(actual).size, actual.length, `Duplicate ${label}`);
  assert.equal(new Set(expected).size, expected.length, `Duplicate expected ${label}`);
  assert.deepEqual([...actual].sort(), [...expected].sort(), label);
};
export function relative(file) {
  assert.ok(typeof file === 'string' && file.length && !/[\0\r\n]/.test(file), 'Invalid file path');
  const result = path.relative(root, path.resolve(root, file));
  assert.ok(result && result !== '..' && !result.startsWith('../') && !path.isAbsolute(result),
    `Path outside this worktree: ${file}`);
  assert.ok(!/(^|\/)\.git(?:\/|$)/.test(result), 'Git internals are not manifest files');
  return result;
}
export async function bytes(file) {
  const absolute = path.resolve(root, relative(file));
  assert.ok((await fs.lstat(absolute)).isFile(), `Expected regular file: ${file}`);
  assert.equal(await fs.realpath(absolute), absolute, `Symlink path forbidden: ${file}`);
  return fs.readFile(absolute);
}
export const bind = async file => ({ path: relative(file), sha256: sha256(await bytes(file)) });
export async function verifyBindings(rows) {
  for (const row of rows) {
    assert.match(row.sha256 ?? '', /^[a-f0-9]{64}$/, `Missing SHA256: ${row.path}`);
    assert.equal(sha256(await bytes(row.path)), row.sha256, `Working bytes changed: ${row.path}`);
  }
}
export async function assertAbsent(file) {
  try {
    await fs.lstat(path.resolve(root, relative(file)));
  } catch (error) {
    if (error.code === 'ENOENT') return;
    throw error;
  }
  assert.fail(`Refusing to overwrite existing receipt: ${file}`);
}
export async function writeReceipt(file, value) {
  await fs.writeFile(path.resolve(root, relative(file)), JSON.stringify(value, null, 2) + '\n',
    { flag: 'wx' });
}
export function assertContext(head) {
  for (const name of ['GIT_INDEX_FILE', 'GIT_DIR', 'GIT_WORK_TREE', 'GIT_COMMON_DIR']) {
    assert.ok(!process.env[name], `Refuse alternate Git environment: ${name}`);
  }
  assert.equal(path.resolve(git(['rev-parse', '--show-toplevel']).trim()), path.resolve(root));
  assert.equal(git(['branch', '--show-current']).trim(), branch);
  const actual = git(['rev-parse', '--verify', 'HEAD']).trim();
  assert.match(actual, /^[a-f0-9]{40}$/);
  if (head) assert.equal(actual, head, 'Concurrent HEAD change');
  return actual;
}
export const stagedPaths = () =>
  git(['diff', '--cached', '--no-renames', '--name-only', '-z']).split('\0').filter(Boolean);
export function treeEntries(revision, files) {
  return new Map(git(['ls-tree', '-r', '-z', revision, '--', ...files]).split('\0')
    .filter(Boolean).map(line => {
      const match = /^(\d{6}) blob ([a-f0-9]{40})\t(.+)$/.exec(line);
      assert.ok(match, 'Expected regular blob in commit tree');
      return [match[3], { mode: match[1], blob: match[2] }];
    }));
}
export function indexEntry(file) {
  const rows = git(['ls-files', '--stage', '-z', '--', file]).split('\0').filter(Boolean);
  assert.equal(rows.length, 1, `Missing or unmerged index entry: ${file}`);
  const match = /^(\d{6}) ([a-f0-9]{40}) 0\t(.+)$/.exec(rows[0]);
  assert.ok(match && match[3] === file, `Invalid index entry: ${file}`);
  assert.ok(['100644', '100755'].includes(match[1]), `Not a regular staged file: ${file}`);
  return { mode: match[1], stagedBlobSha: match[2] };
}
export async function loadFinalization(file) {
  const data = await bytes(file);
  const value = JSON.parse(data);
  assert.equal(value.status, 'pass', 'Main must supply a passed finalization');
  if (value.ticket !== undefined) assert.equal(value.ticket, 'STEMROBIN-181');
  if (value.batch !== undefined) assert.ok(['D025', 'D-025'].includes(value.batch));
  assert.ok(Array.isArray(value.cards));
  exactSet(value.cards.map(row => {
    if (typeof row === 'string') return row;
    assert.ok(row && targets.some(target => target.card === row.card &&
      (row.book === undefined || target.book === row.book)), 'Unexpected D025 target');
    if (row.status !== undefined) assert.equal(row.status, 'pass');
    return row.card;
  }), cards, 'exact three D025 cards; n19 remains held for missing source figures28/29');
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
    const file = relative(row.path);
    assert.match(row.sha256 ?? '', /^[a-f0-9]{64}$/, `Missing owned SHA256: ${file}`);
    assert.ok(!/(^|\/)\.env(?:$|\.)/.test(file) &&
      !file.startsWith('tmp/') && !file.startsWith('.tmp/') &&
      !file.startsWith(`${tmp}/`) && !file.startsWith('app/'),
    `Forbidden manifest path: ${file}`);
    assert.ok(!/\/(?:phy9-c2-s2-n65|phy9-c1-s7-t4)\//.test(file) &&
      !/\/fig-10[12]\./.test(file), `Unrelated older content: ${file}`);
    const modernBook = ['9p', '10p'].find(book => file.startsWith(`${modernRoot(book)}/`));
    const modernLesson = modernBook && /\/lessons\/([^/]+)\//.exec(file);
    if (modernLesson) {
      assert.ok(targets.some(target => modernBook === target.book && modernLesson[1] === target.card &&
        file.startsWith(`${modernRoot(target.book)}/lessons/${target.card}/`)),
      `Unowned modern lesson (including held n19): ${file}`);
    }
    return { path: file, sha256: row.sha256 };
  });
  exactSet(ownedFiles.map(row => row.path), [...new Set(ownedFiles.map(row => row.path))],
    'unique manifest paths');
  for (const file of [...sourceIndices, ...requiredLessons]) {
    assert.ok(ownedFiles.some(row => row.path === file), `Required owned manifest file: ${file}`);
  }
  await verifyBindings(ownedFiles);
  const figureIds = new Map(['9p', '10p'].map(book => [book, new Set()]));
  for (const target of targets) {
    const figures = JSON.parse(await bytes(`${modernRoot(target.book)}/lessons/${target.card}/figures.json`));
    assert.ok(Array.isArray(figures.figures), `Missing finalized figure manifest: ${target.card}`);
    for (const row of figures.figures) {
      assert.match(row.id ?? '', /^[a-zA-Z0-9_-]+$/, 'Invalid finalized figure ID');
      figureIds.get(target.book).add(row.id);
    }
  }
  for (const row of ownedFiles) {
    for (const book of ['9p', '10p']) {
      const prefix = `${modernRoot(book)}/figures/`;
      if (row.path.startsWith(prefix)) {
        assert.ok(figureIds.get(book).has(row.path.slice(prefix.length).split('.')[0]),
          `Modern figure outside the three finalized cards: ${row.path}`);
      }
    }
  }
  return { value, ownedFiles, binding: { path: relative(file), sha256: sha256(data) } };
}

async function prepareIndex(book, parent, ownedFiles) {
  const file = `${modernRoot(book)}/book.json`;
  const workspace = await bytes(file);
  const current = JSON.parse(workspace);
  const headBytes = git(['show', `${parent}:${file}`], { encoding: null });
  const base = JSON.parse(headBytes);
  assert.ok(Array.isArray(current.lessons) && Array.isArray(base.lessons));
  exactSet(current.lessons.map(row => row.id), [...new Set(current.lessons.map(row => row.id))],
    `unique working ${book} rows`);
  const ownedCards = targets.filter(row => row.book === book).map(row => row.card);
  assert.ok(base.lessons.every(row => !ownedCards.includes(row.id)), 'D025 must add new delivered rows');
  const indexed = new Set([
    ...git(['ls-files', '--cached', '-z', '--', `${modernRoot(book)}/lessons`])
      .split('\0').filter(Boolean),
    ...ownedFiles.map(row => row.path),
  ]);
  const projected = structuredClone(current);
  projected.lessons = current.lessons.filter(row =>
    indexed.has(`${modernRoot(book)}/lessons/${row.id}/lesson.json`));
  for (const row of projected.lessons) {
    for (const name of lessonFiles) {
      assert.ok(indexed.has(`${modernRoot(book)}/lessons/${row.id}/${name}`),
        `Stable helper would include incomplete staged lesson: ${row.id}/${name}`);
    }
  }
  exactSet(projected.lessons.filter(row => ownedCards.includes(row.id)).map(row => row.id),
    ownedCards, `required ${book} rows`);
  assert.deepEqual(projected.lessons.filter(row => !ownedCards.includes(row.id)), base.lessons,
    `Unowned ${book} index rows/order changed`);
  const metadata = async index => {
    const { lessons, ...rest } = structuredClone(index);
    if (rest.profile?.path) {
      rest.profile.path = relative(rest.profile.path);
      await verifyBindings([rest.profile]);
    }
    return rest;
  };
  assert.deepEqual(await metadata(current), await metadata(base), `Unowned ${book} metadata drift`);
  const data = Buffer.from(JSON.stringify(projected, null, 2) + '\n');
  assert.notEqual(sha256(data), sha256(headBytes), `Required modern index has no changes: ${file}`);
  return {
    path: file, data, sha256: sha256(data), stagedBlobSha256: sha256(data),
    workspaceSha256: sha256(workspace), workingSha256: sha256(workspace),
    headBlobSha256: sha256(headBytes), book, ownedCards, partialIndex: true,
    workingBytesDifferFromStaged: sha256(data) !== sha256(workspace),
    omittedWorkingCards: current.lessons.filter(row => !projected.lessons.some(item => item.id === row.id))
      .map(row => row.id),
    preservesUnrelatedWorkingBytes: true,
  };
}

export async function stage(finalizationFile) {
  await assertAbsent(stagingPath);
  await assertAbsent(pushPath);
  const parent = assertContext();
  exactSet(stagedPaths(), [], 'Refuse all pre-staged work, including .env; nothing is reset');
  const finalization = await loadFinalization(finalizationFile);
  const helperBindings = await Promise.all(helperPaths.map(bind));
  const projections = [];
  for (const book of ['9p', '10p']) {
    projections.push(await prepareIndex(book, parent, finalization.ownedFiles));
  }
  const projectionPaths = new Set(modernIndices);
  const fullFiles = finalization.ownedFiles.filter(row => !projectionPaths.has(row.path));
  const parentFiles = treeEntries(parent, fullFiles.map(row => row.path));
  const changed = new Set(git(['diff', '--no-renames', '--name-only', '-z', parent, '--',
    ...fullFiles.map(row => row.path)]).split('\0').filter(Boolean));
  const ownedChanged = fullFiles.filter(row => {
    const before = parentFiles.get(row.path);
    return changed.has(row.path) || !before ||
      sha256(git(['cat-file', 'blob', before.blob], { encoding: null })) !== row.sha256;
  });
  for (const file of sourceIndices) {
    assert.ok(ownedChanged.some(row => row.path === file), `SOURCE index must be explicitly changed: ${file}`);
  }
  const preservedWorkspace = [
    ...finalization.ownedFiles, ...projections.map(row => ({ path: row.path, sha256: row.workspaceSha256 })),
    finalization.binding, ...helperBindings,
  ];
  const verifyStage = async rows => {
    assertContext(parent);
    exactSet(stagedPaths(), rows.map(row => row.path), 'exact D025 staged boundary');
    for (const row of rows) {
      indexEntry(row.path);
      assert.equal(sha256(git(['show', `:${row.path}`], { encoding: null })), row.sha256,
        `Staged hash mismatch: ${row.path}`);
    }
    await verifyBindings(preservedWorkspace);
  };
  await verifyBindings(preservedWorkspace);
  assertContext(parent);
  exactSet(stagedPaths(), [], 'Concurrent staging; preserve it and stop');
  git(['add', '--', ...ownedChanged.map(row => row.path)]);
  const expected = [...ownedChanged];
  await verifyStage(expected);
  // Use the existing index writer only after owned lesson files are in the index.
  const indexOperations = [];
  for (const projection of projections) {
    const args = [path.resolve(root, helperPaths[2]), projection.book];
    const output = execFileSync(process.execPath, args, {
      cwd: root, env: gitEnv(), encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
    });
    expected.push(projection);
    await verifyStage(expected);
    indexOperations.push({ book: projection.book, helper: helperBindings[2], output });
  }
  const files = [
    ...ownedChanged.map(row => ({ ...row, stagedBlobSha256: row.sha256,
      workspaceSha256: row.sha256, workingSha256: row.sha256, partialIndex: false,
      sourceIndex: sourceIndices.includes(row.path) })),
    ...projections.map(({ data, ...row }) => row),
  ].map(row => ({ ...row, ...indexEntry(row.path) })).sort((a, b) => a.path.localeCompare(b.path));
  await verifyStage(files);
  await writeReceipt(stagingPath, {
    ticket: 'STEMROBIN-181', batch: 'D025', status: 'exact-owned-files-staged',
    branch, parent, cards, finalization: finalization.binding,
    counts: finalization.value.counts, currentSourceCounts: finalization.value.currentSourceCounts,
    files, unchangedOwnedFiles: fullFiles.filter(row => !ownedChanged.includes(row)),
    preservedWorkspace, helperBindings, indexOperations,
    bothSourceIndicesExplicit: true, bothModernIndicesPartial: true,
    indexProjections: files.filter(row => row.partialIndex),
    sharedWorkingIndicesUnchanged: true,
    limits: 'Staging only. No commit/push, gates, native/display, retention, meter or completion writes.',
  });
  console.log(JSON.stringify({ staged: files.length, boundary: stagingPath,
    bothSourceIndicesExplicit: true, bothModernIndicesPartial: true }));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [execute, file, ...extra] = process.argv.slice(2);
  assert.ok(execute === '--execute' && file && !extra.length,
    'PREPARE ONLY. Usage: node stage-d025.mjs --execute <finalizationJSONpath>');
  await stage(file);
}
