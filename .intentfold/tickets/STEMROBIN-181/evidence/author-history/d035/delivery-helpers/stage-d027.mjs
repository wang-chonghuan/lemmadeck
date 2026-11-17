import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import {
  root, branch, tmp, bytes, bind, sha256, git, exactSet, relative, verifyBindings,
  assertAbsent, writeReceipt, assertContext as priorContext, stagedPaths, treeEntries, indexEntry,
} from './stage-d025.mjs';
import { assertPristineStaging, assertN107Untouched } from './stage-d026.mjs';

export {
  root, branch, tmp, bytes, bind, sha256, git, exactSet, relative, verifyBindings,
  assertAbsent, writeReceipt, stagedPaths, treeEntries, indexEntry,
  assertPristineStaging, assertN107Untouched,
};
export const fixedBase = 'ae9769c6402093de057e30ad38e3c007067b6e7e';
export const ticketRoot = '.intentfold/tickets/STEMROBIN-181';
export const evidenceRoot = `${ticketRoot}/evidence`;
export const evidenceIndexPath = `${evidenceRoot}/index.json`;
export const meterPath = `${ticketRoot}/production-meter.json`;
export const preservationPath = `${tmp}/d032-start/preservation.json`;
export const stagingPath = `${tmp}/d027-staging-boundary.json`;
export const pushPath = `${tmp}/d027-actual-push-receipt.json`;
export const finalizationPath = `${evidenceRoot}/reports/d027-finalization-binding.json`;
export const manifestPath = `${tmp}/d027-finalization-manifest.json`;
export const source318Path = `${tmp}/d035-source318-consumed/result.json`;
export const bookRoot = 'ssot-resources/soviet10year-textbooks/artifacts/9p';
export const modernRoot = `${bookRoot}/editions/modern-us-neutral`;
export const sourceIndex = `${bookRoot}/book.json`;
export const modernIndex = `${modernRoot}/book.json`;
export const projectionPaths = [sourceIndex, modernIndex];
export const stagedProjectionPaths = [...projectionPaths, evidenceIndexPath];
export const sharedIndices = [
  ...projectionPaths,
  'ssot-resources/soviet10year-textbooks/artifacts/10p/book.json',
  'ssot-resources/soviet10year-textbooks/artifacts/10p/editions/modern-us-neutral/book.json',
];
export const cards = ['phy9-c2-s6-n124', 'phy9-c2-s6-n127', 'phy9-c2-s6-n130'];
export const rawCards = cards;
export const approvedPages = [307, 312, 318, 319];
export const rawFigures = [283, 294];
export const modernFiles = ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json'];
export const rawFiles = ['lesson.json', 'lesson.md', 'exercises.json'];
export const modernFigureFiles = ['spec.json', 'svg', 'render.json', 'review.json', 'independent-review.json'];
export const counts = {
  newlyCompletedCards: 3, sourceExerciseObjects: 0, workedExamples: 0,
  newUnsolvedWrittenTasks: 0, choiceQuestions: 0, choiceOptions: 0, readOnlyStandardAnswers: 0,
};
export const indexHelper = `${tmp}/stage-edition-index.mjs`;
export const helperPaths = [
  ...['complete-d027.mjs', 'stage-d027.mjs', 'record-d027-push.mjs',
    'complete-d027-post-push.mjs', 'push-d027.mjs', 'complete-d026.mjs', 'stage-d026.mjs',
    'record-d026-push.mjs', 'complete-d026-post-push.mjs', 'stage-d025.mjs',
    'retain-d016-evidence.mjs'].map(name => `${tmp}/${name}`),
  indexHelper,
];
const json = data => JSON.parse(data);
export const headBytes = (parent, file) => git(['show', `${parent}:${file}`], { encoding: null });

export function assertContext(head) {
  const actual = priorContext(head);
  git(['merge-base', '--is-ancestor', fixedBase, actual]);
  return actual;
}

export async function assertTicketContext() {
  const ticket = json(await bytes(`${ticketRoot}/ticket.json`));
  assert.equal(ticket.base, fixedBase, 'Never change the recorded ticket base');
  assert.equal(ticket.branch, branch);
  assert.equal(path.resolve(ticket.worktree), path.resolve(root));
}

export async function bindWorkspace(file) {
  const binding = await bind(file);
  const stat = await fs.lstat(path.resolve(root, binding.path));
  return { ...binding, mode: stat.mode & 0o777, bytes: stat.size };
}

export async function verifyWorkspace(rows) {
  await verifyBindings(rows);
  for (const row of rows) {
    const stat = await fs.lstat(path.resolve(root, relative(row.path)));
    if (row.mode !== undefined) assert.equal(stat.mode & 0o777, row.mode,
      `Unowned working permissions changed: ${row.path}`);
    if (row.bytes !== undefined) assert.equal(stat.size, row.bytes, `Working size changed: ${row.path}`);
  }
}

export async function loadPreservation() {
  const binding = await bind(preservationPath);
  const value = json(await bytes(preservationPath));
  assert.equal(value.fileCount, 103);
  assert.equal(value.files?.length, value.fileCount);
  exactSet(value.files.map(row => relative(row.path)), value.files.map(row => row.path),
    'Canonical preservation paths');
  for (const row of value.files) {
    assert.ok(Number.isSafeInteger(row.mode) && row.mode >= 0 && row.mode <= 0o777);
    assert.ok(Number.isSafeInteger(row.bytes) && row.bytes >= 0);
  }
  await verifyWorkspace([binding, ...value.files]);
  return { binding, files: value.files };
}

export function ownedPath(file) {
  assert.equal(relative(file), file, 'Owned path must be canonical and repository-relative');
  assert.ok(!file.includes('\\') && !file.split('/').some(part =>
    !part || part === '.' || part === '..' || /^(?:\.env|\.tmp)(?:$|\.)/.test(part) ||
    ['tmp', 'app', 'charter'].includes(part)),
  `Forbidden owned path: ${file}`);
  if ([...stagedProjectionPaths, meterPath].includes(file)) return file;
  // Historical evidence may contain other source inputs; it never grants ownership of their product files.
  if (file.startsWith(`${evidenceRoot}/`)) return file;
  if (file.startsWith(`${modernRoot}/lessons/`)) {
    const [card, name, ...extra] = file.slice(`${modernRoot}/lessons/`.length).split('/');
    assert.ok(cards.includes(card) && modernFiles.includes(name) && !extra.length,
      `Unowned modern lesson: ${file}`);
    return file;
  }
  if (file.startsWith(`${bookRoot}/lessons/`)) {
    const [card, name, ...extra] = file.slice(`${bookRoot}/lessons/`.length).split('/');
    assert.ok(cards.includes(card) && rawFiles.includes(name) && !extra.length,
      `Unowned raw lesson: ${file}`);
    return file;
  }
  if (file.startsWith(`${modernRoot}/figures/`)) {
    assert.ok(modernFigureFiles.some(extension => file === `${modernRoot}/figures/fig-283.${extension}`),
      `Only modern figure283 is owned: ${file}`);
    return file;
  }
  if (file.startsWith(`${bookRoot}/figures/`)) {
    assert.ok(rawFigures.some(number => ['png', 'svg'].some(extension =>
      file === `${bookRoot}/figures/fig-${number}.${extension}`)), `Unapproved RAW figure: ${file}`);
    return file;
  }
  if (file.startsWith(`${bookRoot}/pages/`)) {
    assert.ok(approvedPages.some(page => ['page.md', 'page.json', 'audit.json'].some(name =>
      file === `${bookRoot}/pages/${String(page).padStart(4, '0')}/${name}`)),
    `Unapproved page dependency: ${file}`);
    return file;
  }
  assert.fail(`Outside D027 product/evidence allowlist; no app/skill/dependency changes: ${file}`);
}

export const requiredProductFiles = () => [
  ...stagedProjectionPaths, meterPath, finalizationPath,
  ...cards.flatMap(card => [
    ...modernFiles.map(name => `${modernRoot}/lessons/${card}/${name}`),
    ...rawFiles.map(name => `${bookRoot}/lessons/${card}/${name}`),
  ]),
  ...approvedPages.flatMap(page => ['page.md', 'page.json', 'audit.json'].map(name =>
    `${bookRoot}/pages/${String(page).padStart(4, '0')}/${name}`)),
  ...rawFigures.flatMap(number => ['png', 'svg'].map(extension =>
    `${bookRoot}/figures/fig-${number}.${extension}`)),
  ...modernFigureFiles.map(extension => `${modernRoot}/figures/fig-283.${extension}`),
];

export async function verifySource318(file = source318Path) {
  const binding = await bind(file);
  const value = json(await bytes(file));
  assert.equal(value.ticket, 'STEMROBIN-181');
  assert.match(value.status ?? '', /^PASS(?:-|$)/i, 'Canonical SOURCE318 must actually be consumed');
  exactSet(value.physicalPages, [318], 'Only canonical page318 acceptance');
  exactSet(value.rawFigures, ['fig-294'], 'Exact RAW294 acceptance is required');
  assert.ok(value.native && value.raw && value.sourceTextReview && value.reviewRevisionConfirmation,
    'Need native, exact RAW, SOURCE text and frozen revision-confirmation provenance');
  await verifyBindings([binding, value.native, value.raw, value.sourceTextReview,
    value.reviewRevisionConfirmation]);
  assert.equal(value.sourcePageAcceptedForFaithfulPreservation, true);
  assert.equal(value.ambiguousAngledMarkOriginResolved, false);
  assert.equal(value.ambiguousAngledMarkErasedOrReinterpreted, false);
  assert.equal(value.exactRawPixelsApprovedNotCircuitMeaning, true);
  const native = json(await bytes(value.native.path));
  const page = native.pages.find(row => (row.page ?? row.physicalPage) === 318);
  assert.equal(page?.status, 'NATIVE-PASS');
  assert.deepEqual([page.rows.independentSource, page.rows.nativePrinted, page.rows.markdown], [25, 25, 25]);
  assert.deepEqual(page.sourceReview.binding, value.sourceTextReview);
  const pageOutputs = ['pageMarkdown', 'pageJson', 'audit'].map(key => page.outputs[key]);
  const raw = json(await bytes(value.raw.path));
  assert.equal(raw.status, 'PASS');
  assert.equal(raw.rawApproval, true,
    'Text-only SOURCE318 approval cannot stand in for exact RAW294');
  assert.equal(raw.hashBindings.manifest.sha256, value.native.sha256);
  assert.equal(raw.exactRectangleVerification.differingPixels, 0);
  const figure = native.cropReviewTargets.find(row => row.id === 'fig-294');
  assert.ok(figure);
  const crop = raw.hashBindings.crop;
  const svg = raw.hashBindings.svg;
  assert.ok(crop && svg, 'Exact RAW review must bind both actual crop and SVG');
  assert.equal(crop.sha256, figure.crop.sha256);
  assert.equal(svg.sha256, figure.svg.sha256);
  assert.equal(raw.hashBindings.source.sha256, figure.source.sha256);
  assert.deepEqual(figure.actualCropRectangleXYXY, [914, 244, 1303, 563]);
  assert.deepEqual(raw.exactRectangleVerification.sourceRectangleXYWH, [914, 244, 389, 319]);
  await verifyBindings([crop, svg, raw.hashBindings.source, ...pageOutputs, figure.crop, figure.svg]);
  const expected = [
    ...['page.md', 'page.json', 'audit.json'].map(name => `${bookRoot}/pages/0318/${name}`),
    ...['png', 'svg'].map(extension => `${bookRoot}/figures/fig-294.${extension}`),
  ];
  exactSet(value.outputs.map(row => row.path), expected, 'Exactly canonical page318 plus RAW294 outputs');
  await verifyBindings(value.outputs);
  for (const row of value.outputs) {
    const input = [...pageOutputs, figure.crop, figure.svg].find(item =>
      path.basename(item.path) === path.basename(row.path));
    assert.equal(row.sha256, input?.sha256, `Canonical318 differs from accepted native output: ${row.path}`);
  }
  const source = json(await bytes(value.sourceTextReview.path));
  assert.equal(source.sourceApproval, true);
  assert.equal(source.fullPageSourceApproval, false);
  assert.equal(source.effectiveSource318?.status, 'PASS',
    'Retain the actual passed SOURCE318 authority, not only a count');
  const commandBindings = [];
  for (const key of ['finalize', 'vectorize']) {
    const command = native.receipts[key];
    assert.equal(command.exitCode, 0, `Existing SOURCE318 ${key} must have succeeded`);
    for (const field of ['receiptBinding', 'stdin', 'stdout', 'stderr']) {
      assert.ok(command[field], `Missing existing SOURCE318 ${key}/${field} provenance`);
      commandBindings.push(command[field]);
    }
  }
  const provenanceBindings = [
    ...commandBindings, raw.hashBindings.source, crop, svg,
  ];
  await verifyBindings(provenanceBindings);
  return { binding, value, provenanceBindings };
}

export async function evidenceProjection(parent, current, preservation) {
  const parentData = headBytes(parent, evidenceIndexPath);
  const base = json(parentData);
  exactSet(Object.keys(current), Object.keys(base), 'Evidence index fields');
  const collections = Object.keys(base).filter(key => Array.isArray(base[key]));
  const oldPaths = new Set(collections.flatMap(key => base[key].map(row => row.path)));
  const excluded = new Set(preservation.files.map(row => row.path));
  const projected = structuredClone(base);
  const newRows = [];
  const omittedRows = [];
  const seen = new Map();
  for (const key of Object.keys(base)) {
    if (key === 'updatedAt') {
      projected[key] = current[key];
      continue;
    }
    if (!collections.includes(key)) {
      assert.deepEqual(current[key], base[key], `Evidence metadata drift: ${key}`);
      continue;
    }
    assert.ok(Array.isArray(current[key]));
    assert.deepEqual(current[key].filter(row => oldPaths.has(row.path)), base[key],
      `Retained HEAD evidence/order changed: ${key}`);
    for (const row of current[key].filter(item => !oldPaths.has(item.path))) {
      if (excluded.has(row.path)) {
        omittedRows.push({ collection: key, ...row });
        continue;
      }
      assert.ok(row.path.startsWith(`${evidenceRoot}/`), 'Evidence rows must remain durable');
      ownedPath(row.path);
      await verifyBindings([row]);
      if (seen.has(row.path)) assert.equal(seen.get(row.path), row.sha256);
      seen.set(row.path, row.sha256);
      projected[key].push(structuredClone(row));
      newRows.push({ collection: key, ...row });
    }
  }
  return { projected, parentData, newRows, omittedRows,
    newlyIndexedFiles: [...seen].map(([file, hash]) => ({ path: file, sha256: hash })) };
}

export async function loadFinalization(file) {
  const data = await bytes(file);
  const value = json(data);
  assert.equal(value.ticket, 'STEMROBIN-181');
  assert.equal(value.batch, 'D027');
  assert.equal(value.status, 'pass');
  assert.equal(value.branch, branch);
  assert.equal(value.base, fixedBase);
  exactSet(value.cards.map(row => {
    assert.equal(row.book, '9p');
    assert.equal(row.status, 'pass');
    return row.card;
  }), cards, 'Exactly three D027 cards');
  assert.deepEqual(value.counts, counts);
  for (const field of ['pages', 'exerciseObjects']) assert.ok(
    Number.isSafeInteger(value.currentSourceCounts?.[field]) && value.currentSourceCounts[field] >= 0);
  assert.ok(typeof value.sourceCountBasis === 'string' && value.sourceCountBasis.length);
  assert.ok(Array.isArray(value.ownedFiles) && value.ownedFiles.length);
  const ownedFiles = value.ownedFiles.map(row => ({ path: ownedPath(row.path), sha256: row.sha256 }));
  exactSet(ownedFiles.map(row => row.path), [...new Set(ownedFiles.map(row => row.path))], 'Unique owned files');
  const preservation = await loadPreservation();
  assert.deepEqual(value.preservation, preservation.binding);
  const excluded = new Set(preservation.files.map(row => row.path));
  for (const row of ownedFiles) assert.ok(!excluded.has(row.path), `Unowned preservation path: ${row.path}`);
  for (const required of requiredProductFiles())
    assert.ok(ownedFiles.some(row => row.path === required), `Missing explicit D027 dependency: ${required}`);
  await verifyBindings(ownedFiles);
  assert.deepEqual(value.sourceDependencies.pages, approvedPages);
  assert.deepEqual(value.sourceDependencies.rawFigures, rawFigures);
  assert.deepEqual(value.sourceDependencies.modernFigures, [283]);
  const accepted = await verifySource318(value.sourceDependencies.source318.path);
  assert.deepEqual(accepted.binding, value.sourceDependencies.source318);
  for (const card of cards) {
    const raw = json(await bytes(`${bookRoot}/lessons/${card}/exercises.json`));
    const modern = json(await bytes(`${modernRoot}/lessons/${card}/exercises.json`));
    assert.equal(raw.count, 0);
    assert.deepEqual(raw.exercises, []);
    assert.equal(modern.count, 0);
    assert.deepEqual(modern.exercises, []);
    assert.equal(json(await bytes(`${modernRoot}/lessons/${card}/adaptation.audit.json`)).status, 'pass');
    const figures = json(await bytes(`${modernRoot}/lessons/${card}/figures.json`));
    exactSet(figures.figures.map(row => row.id), card === cards[0] ? ['fig-283'] : [],
      `Exact modern figures: ${card}`);
  }
  assert.deepEqual(value.finalization, await bind(finalizationPath));
  const finalized = json(await bytes(finalizationPath));
  assert.equal(finalized.status, 'pass');
  for (const field of ['cards', 'counts', 'currentSourceCounts', 'sourceCountBasis', 'sourceDependencies',
    'preservation', 'helperBindings']) assert.deepEqual(finalized[field], value[field], `Finalization/${field}`);
  return { value, ownedFiles, preservation, sourceCountBasis: value.sourceCountBasis,
    binding: { path: relative(file), sha256: sha256(data) } };
}

const uniqueRows = (rows, label) => {
  assert.ok(Array.isArray(rows), `Missing ${label}`);
  for (const row of rows) assert.match(row.id ?? '', /^[a-zA-Z0-9_-]+$/);
  exactSet(rows.map(row => row.id), [...new Set(rows.map(row => row.id))], `Unique ${label}`);
};

function projection(file, parentData, workspace, projected, details) {
  const data = Buffer.from(JSON.stringify(projected, null, 2) + '\n');
  return { path: file, data, sha256: sha256(data), stagedBlobSha256: sha256(data),
    workspaceSha256: sha256(workspace), workingSha256: sha256(workspace),
    headBlobSha256: sha256(parentData), partialIndex: true,
    workingBytesDifferFromStaged: sha256(data) !== sha256(workspace),
    preservesUnrelatedWorkingBytes: true, ...details };
}

export async function prepareEvidenceIndex(parent, ownedFiles, preservation) {
  const workspace = await bytes(evidenceIndexPath);
  const plan = await evidenceProjection(parent, json(workspace), preservation);
  const manifest = new Map(ownedFiles.map(row => [row.path, row.sha256]));
  exactSet(ownedFiles.filter(row => row.path.startsWith(`${evidenceRoot}/`) &&
    row.path !== evidenceIndexPath).map(row => row.path),
  plan.newlyIndexedFiles.map(row => row.path), 'Evidence ownership is current minus HEAD minus preservation');
  for (const row of plan.newlyIndexedFiles) assert.equal(manifest.get(row.path), row.sha256);
  return projection(evidenceIndexPath, plan.parentData, workspace, plan.projected, {
    evidenceIndex: true, existingRowsAndOrderEqualHead: true,
    newlyIndexedFiles: plan.newlyIndexedFiles, omittedUnownedRows: plan.omittedRows,
    preservation: preservation.binding,
  });
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
      .split('\0').filter(Boolean), ...ownedFiles.map(row => row.path),
  ]);
  const helperDocument = structuredClone(current);
  helperDocument.lessons = current.lessons.filter(row =>
    available.has(`${modernRoot}/lessons/${row.id}/lesson.json`));
  const projected = structuredClone(base);
  assert.ok(base.lessons.every(row => !cards.includes(row.id)), 'D027 modern cards are new deliveries');
  projected.lessons = [
    ...structuredClone(base.lessons),
    ...cards.map(card => {
      const row = current.lessons.find(item => item.id === card);
      assert.ok(row, `Missing owned modern row: ${card}`);
      return structuredClone(row);
    }),
  ];
  exactSet(projected.lessons.filter(row => cards.includes(row.id)).map(row => row.id), cards,
    'Only three owned modern additions');
  for (const row of projected.lessons) for (const name of modernFiles)
    assert.ok(available.has(`${modernRoot}/lessons/${row.id}/${name}`), `Incomplete modern row: ${row.id}`);
  assert.deepEqual(projected.lessons.filter(row => !cards.includes(row.id)), base.lessons,
    'Unowned modern rows/order equal HEAD, not dirty working rows');
  if (base.profile?.path) await verifyBindings([base.profile]);
  const nativeIndexHelperCompatible = JSON.stringify(helperDocument) === JSON.stringify(projected);
  return projection(modernIndex, parentData, workspace, projected, {
    book: '9p', ownedCards: cards, sourceIndex: false, unownedRowsAndOrderEqualHead: true,
    nativeIndexHelperCompatible,
    omittedUnrelatedRows: current.lessons.filter(row => !cards.includes(row.id)).flatMap(row => {
      const saved = base.lessons.find(item => item.id === row.id);
      return JSON.stringify(row) === JSON.stringify(saved) ? [] : [
        { id: row.id, workingRow: row, headRow: saved ?? null },
      ];
    }),
    omittedWorkingCards: current.lessons.filter(row =>
      !projected.lessons.some(item => item.id === row.id)).map(row => row.id),
  });
}

// Native source projection: HEAD rows/documents plus owned cards and explicitly staged page.json only.
export function sourceProjection(base, current, documents, pagePaths) {
  uniqueRows(base.lessons, 'HEAD source rows');
  uniqueRows(current.lessons, 'working source rows');
  const projected = structuredClone(base);
  const ownedRows = new Map();
  for (const card of cards) {
    const row = current.lessons.find(item => item.id === card);
    const { lesson, exercises } = documents.get(card) ?? {};
    assert.ok(row && lesson && exercises, `Missing owned source documents: ${card}`);
    assert.equal(lesson.id, card);
    assert.equal(exercises.lesson, card);
    assert.deepEqual(exercises.exercises, []);
    assert.equal(exercises.count, 0);
    assert.equal(lesson.exercise_count, 0);
    const expected = {
      id: lesson.id, card_id: lesson.card_id, title: lesson.title, number: lesson.number,
      start_printed: lesson.start_printed, prose_blocks: lesson.prose.length,
      exercises: 0, figures: lesson.figures.length,
    };
    for (const [field, value] of Object.entries(expected))
      assert.deepEqual(row[field], value, `Owned source row drift: ${card}/${field}`);
    ownedRows.set(card, structuredClone(row));
  }
  projected.lessons = base.lessons.map(row => ownedRows.get(row.id) ?? structuredClone(row));
  for (const card of cards) if (!base.lessons.some(row => row.id === card))
    projected.lessons.push(ownedRows.get(card));
  assert.deepEqual(projected.lessons.filter(row => !cards.includes(row.id)),
    base.lessons.filter(row => !cards.includes(row.id)), 'Unowned source rows/order equal HEAD');
  exactSet(pagePaths, [...new Set(pagePaths)], 'Unique projected page paths');
  projected.pages = pagePaths.length;
  projected.audit.exercise_count = projected.lessons.reduce((sum, row) => {
    assert.ok(Number.isSafeInteger(row.exercises) && row.exercises >= 0);
    return sum + row.exercises;
  }, 0);
  const figures = new Set();
  for (const row of projected.lessons) {
    const { lesson, exercises } = documents.get(row.id) ?? {};
    assert.ok(lesson && exercises && Array.isArray(lesson.figures) && Array.isArray(exercises.exercises));
    for (const figure of [...lesson.figures,
      ...exercises.exercises.flatMap(exercise => exercise.figures ?? []),
      ...(lesson.prose ?? []).filter(block => block.kind === 'fig')]) {
      const match = /^fig-(\d+)$/.exec(figure.id ?? '');
      if (match) figures.add(Number(match[1]));
    }
  }
  projected.audit.figure_numbers = [...figures].sort((a, b) => a - b);
  const metadata = document => {
    const { lessons, pages, ...rest } = structuredClone(document);
    delete rest.audit.exercise_count;
    delete rest.audit.figure_numbers;
    return rest;
  };
  assert.deepEqual(metadata(projected), metadata(base), 'Preserve HEAD metadata and old warnings');
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
  for (const card of [...new Set([...base.lessons.map(row => row.id), ...cards])]) {
    assert.match(card, /^[a-zA-Z0-9_-]+$/);
    const doc = {};
    for (const [key, name] of [['lesson', 'lesson.json'], ['exercises', 'exercises.json']]) {
      const file = `${bookRoot}/lessons/${card}/${name}`;
      const useWorking = cards.includes(card);
      if (useWorking) assert.ok(owned.has(file), `Source input not explicitly owned: ${file}`);
      const data = useWorking ? await bytes(file) : headBytes(parent, file);
      doc[key] = json(data);
      inputs.push({ path: file, sha256: sha256(data), basis: useWorking ? 'owned-workspace' : 'HEAD' });
    }
    documents.set(card, doc);
  }
  const isPage = file => /^pages\/\d{4}\/page\.json$/.test(file.slice(`${bookRoot}/`.length));
  const headPages = git(['ls-tree', '-r', '--name-only', '-z', parent, '--', `${bookRoot}/pages`])
    .split('\0').filter(isPage);
  const ownedPagePaths = ownedFiles.map(row => row.path).filter(isPage);
  exactSet(ownedPagePaths, approvedPages.map(page =>
    `${bookRoot}/pages/${String(page).padStart(4, '0')}/page.json`), 'Four explicit source pages');
  const newPages = ownedPagePaths.filter(file => !headPages.includes(file));
  const pagePaths = [...headPages, ...newPages].sort();
  const projected = sourceProjection(base, current, documents, pagePaths);
  const omittedUnrelatedRows = current.lessons.filter(row => !cards.includes(row.id)).flatMap(row => {
    const saved = base.lessons.find(item => item.id === row.id);
    return JSON.stringify(row) === JSON.stringify(saved) ? [] : [{
      id: row.id, reason: saved ? 'working-row-drift-kept-HEAD' : 'working-only-row-not-owned',
      workingRow: row, headRow: saved ?? null,
    }];
  });
  const workingPages = git(['ls-files', '--cached', '--others', '--exclude-standard', '-z',
    '--', `${bookRoot}/pages`]).split('\0').filter(isPage);
  return projection(sourceIndex, parentData, workspace, projected, {
    book: '9p', sourceIndex: true, ownedCards: cards, inputs, pagePaths, headPagePaths: headPages,
    explicitlyOwnedPagePaths: ownedPagePaths, explicitlyOwnedNewPagePaths: newPages,
    omittedWorkingPagePaths: [...new Set(workingPages)].filter(file => !pagePaths.includes(file)),
    omittedWorkingCards: current.lessons.filter(row =>
      !projected.lessons.some(item => item.id === row.id)).map(row => row.id),
    omittedUnrelatedRows, headN107Untouched: true, unownedRowsAndOrderEqualHead: true,
    projectedCounts: { pages: projected.pages, exerciseObjects: projected.audit.exercise_count,
      figureNumbers: projected.audit.figure_numbers },
    currentIndexCountsOmitted: { pages: current.pages, exerciseObjects: current.audit?.exercise_count,
      figureNumbers: current.audit?.figure_numbers },
    oldWarningsAndOtherMetadataPreserved: true,
    pageCountBasis: 'HEAD tree page.json plus only explicitly owned/staged page.json, never local meter totals',
  });
}

export async function stage(finalizationFile) {
  await assertAbsent(stagingPath);
  await assertAbsent(pushPath);
  await assertTicketContext();
  const parent = assertContext();
  assertPristineStaging('Require pristine staging; preserve pre-staged work and stop');
  const finalization = await loadFinalization(finalizationFile);
  const helperBindings = await Promise.all(helperPaths.map(bind));
  assert.deepEqual(helperBindings, finalization.value.helperBindings, 'Frozen helper set');
  const preservedWorkingIndices = await Promise.all(sharedIndices.map(bindWorkspace));
  const headN107 = assertN107Untouched(parent);
  const preservedN107 = await Promise.all(headN107.map(row => bindWorkspace(row.path)));
  const projections = [
    await prepareModernIndex(parent, finalization.ownedFiles),
    await prepareSourceIndex(parent, finalization.ownedFiles),
    await prepareEvidenceIndex(parent, finalization.ownedFiles, finalization.preservation),
  ];
  for (const row of projections) assert.notEqual(row.sha256, row.headBlobSha256,
    `Required projected index has no changes: ${row.path}`);
  const fullFiles = finalization.ownedFiles.filter(row => !stagedProjectionPaths.includes(row.path));
  const parentFiles = treeEntries(parent, fullFiles.map(row => row.path));
  const changed = new Set(git(['diff', '--no-ext-diff', '--no-renames', '--name-only', '-z',
    parent, '--', ...fullFiles.map(row => row.path)]).split('\0').filter(Boolean));
  const ownedChanged = fullFiles.filter(row => {
    const before = parentFiles.get(row.path);
    return !before || changed.has(row.path) ||
      sha256(git(['cat-file', 'blob', before.blob], { encoding: null })) !== row.sha256;
  });
  for (const row of ownedChanged) assert.ok(!row.path.startsWith(`${evidenceRoot}/`) ||
    !parentFiles.has(row.path), `Retained evidence must remain immutable: ${row.path}`);
  const preservedWorkspace = [
    ...await Promise.all(finalization.ownedFiles.map(row => bindWorkspace(row.path))),
    ...preservedWorkingIndices, ...preservedN107, ...finalization.preservation.files,
    finalization.preservation.binding, finalization.binding, ...helperBindings,
  ];
  const verifyStage = async rows => {
    await assertTicketContext();
    assertContext(parent);
    exactSet(stagedPaths(), rows.map(row => row.path), 'Exact D027 staging boundary');
    for (const row of rows) {
      indexEntry(row.path);
      assert.equal(sha256(git(['show', `:${row.path}`], { encoding: null })), row.sha256);
    }
    assertN107Untouched(parent);
    await verifyWorkspace(preservedWorkspace);
  };
  await verifyWorkspace(preservedWorkspace);
  assertContext(parent);
  assertPristineStaging('Concurrent staging; nothing is reset');
  assert.ok(ownedChanged.length);
  git(['add', '--', ...ownedChanged.map(row => row.path)]);
  const expected = [...ownedChanged];
  await verifyStage(expected);
  const modern = projections[0];
  const indexOperations = [];
  if (modern.nativeIndexHelperCompatible) {
    const output = execFileSync(process.execPath, [path.resolve(root, indexHelper), '9p'], {
      cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
      env: { ...process.env, GIT_OPTIONAL_LOCKS: '0', GIT_LITERAL_PATHSPECS: '1',
        GIT_NO_REPLACE_OBJECTS: '1' },
    });
    expected.push(modern);
    await verifyStage(expected);
    indexOperations.push({
      path: modernIndex, helper: helperBindings.find(row => row.path === indexHelper), output,
    });
  }
  const source = projections[1];
  exactSet(git(['ls-files', '--cached', '-z', '--', `${bookRoot}/pages`]).split('\0').filter(file =>
    /^pages\/\d{4}\/page\.json$/.test(file.slice(`${bookRoot}/`.length))), source.pagePaths,
  'Source page count derives from HEAD plus explicitly staged pages only');
  for (const input of source.inputs) assert.equal(
    sha256(git(['show', `:${input.path}`], { encoding: null })), input.sha256);
  for (const projected of projections.filter(row => !expected.includes(row))) {
    const object = git(['hash-object', '-w', '--stdin'], { input: projected.data }).trim();
    assert.match(object, /^[a-f0-9]{40}$/);
    const mode = treeEntries(parent, [projected.path]).get(projected.path)?.mode;
    assert.ok(['100644', '100755'].includes(mode));
    git(['update-index', '--cacheinfo', `${mode},${object},${projected.path}`]);
    expected.push(projected);
    await verifyStage(expected);
    indexOperations.push({ path: projected.path, method: 'HEAD-plus-explicit-owned-partial-projection', object });
  }
  const files = [
    ...ownedChanged.map(row => ({ ...row, stagedBlobSha256: row.sha256,
      workspaceSha256: row.sha256, workingSha256: row.sha256, partialIndex: false })),
    ...projections.map(({ data, ...row }) => row),
  ].map(row => ({ ...row, ...indexEntry(row.path) })).sort((a, b) => a.path.localeCompare(b.path));
  await verifyStage(files);
  await writeReceipt(stagingPath, {
    ticket: 'STEMROBIN-181', batch: 'D027', status: 'exact-owned-files-staged',
    branch, base: fixedBase, parent, headBefore: parent, cards, rawCards,
    finalization: finalization.binding, counts: finalization.value.counts,
    currentSourceCounts: finalization.value.currentSourceCounts, sourceCountBasis: finalization.sourceCountBasis,
    sourceDependencies: finalization.value.sourceDependencies,
    files, unchangedOwnedFiles: fullFiles.filter(row => !ownedChanged.includes(row)),
    preservation: finalization.preservation.binding, preservedUnownedFiles: finalization.preservation.files,
    preservedWorkspace, preservedWorkingIndices, preservedN107, headN107, helperBindings,
    indexProjections: files.filter(row => row.partialIndex), indexOperations,
    evidenceIndex: files.find(row => row.evidenceIndex),
    sourceIndexPartial: true, modernIndexPartial: true, evidenceIndexPartial: true,
    sharedWorkingIndicesUnchanged: true, omittedUnrelatedRows: source.omittedUnrelatedRows,
    sourceCurrentIndexOmission: {
      path: sourceIndex, currentWorkspaceSha256: source.workspaceSha256, stagedBlobSha256: source.sha256,
      currentCounts: source.currentIndexCountsOmitted, projectedCounts: source.projectedCounts,
      omittedPagePaths: source.omittedWorkingPagePaths, omittedRows: source.omittedUnrelatedRows,
      wholesaleCurrentIndexNotStaged: true,
    },
    omittedSharedIndices: sharedIndices.filter(file => !projectionPaths.includes(file)),
    limits: 'Staging only after parent authorization. No commit/push/sync/rebase/reset, gate replay, image opens, app/skill/dependency changes, DB or canonical workspace writes.',
  });
  console.log(JSON.stringify({ staged: files.length, boundary: stagingPath, parent,
    deliveredUnchanged: 83, sourceIndexPartial: true, modernIndexPartial: true }));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [execute, file, ...extra] = process.argv.slice(2);
  assert.ok(execute === '--execute' && file && !extra.length,
    'PREPARE ONLY. Usage: node stage-d027.mjs --execute <passedFinalizationJSONpath>');
  await stage(file);
}
