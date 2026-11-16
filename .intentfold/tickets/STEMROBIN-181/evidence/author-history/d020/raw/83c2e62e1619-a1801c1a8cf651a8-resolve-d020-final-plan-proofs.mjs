// Request supplement only. No builder, gate, native tool or retention is invoked.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  ticket, absolute, relative, bytes, hash, read, verify, bind, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

const work = `${ticket}/tmp`;
const missingReport = {
  path: `${work}/d020-main-final-plan-missing-inputs.json`,
  sha256: '93fb5ee6be1f9cebf57403458508d49534f10ce5b5c6b6f68bfada8e3224f44b',
};
const proofDocumentPath = `${work}/d020-final-plan-request-proofs.json`;
const supplementPath = `${work}/d020-final-plan-request-supplement.json`;
const shaPattern = /^[a-f0-9]{64}$/;
const n76Freeze = {
  path: '.tmp/STEMROBIN-181/9p-d020-n76-fig140-141/author-freeze.json',
  sha256: '8f8b7809012fd1b6555714cef9a3da6afdf5ea8b49582d06f193298e9c5ee92c',
};
const n81Start = {
  path: '.tmp/STEMROBIN-181/9p-d020-n81-fig152/native-context-call-start.json',
  sha256: 'c5a0add1746b429aec3431ecf69e6e71a0511318df6c0d928874f62b76961bd5',
};
const sourceAuthorFreeze = {
  path: `${work}/9p-next-source-0200-0203/author-freeze.json`,
  sha256: '9fdc65209158e832f3fb9ec7459c2c78bcdb1155eb951a7cf77984980efe54e1',
};
const n72Geometry = {
  path: '.tmp/STEMROBIN-181/9p-d020-n72-figures/geometry-construction.initial.json',
  sha256: '565d1f01a03ccaf0f4f9ba5a516a83ce2dc3c9c6ce45c81e7165f4ae544c1fa9',
};
const n72RepairPlan = {
  path: '.tmp/STEMROBIN-181/9p-d020-n72-figures/targeted-repair-plan.json',
  sha256: '13f884e0ea926f370d2c0cbfbc99c3fa061d1982441139ccaeff609823df120a',
};
const n76Runtime = {
  path: '.tmp/STEMROBIN-181/9p-d020-n76-fig142-143/runtime-bindings.json',
  sha256: '429aaf2f1864c7c9263d3ef8ea3d37ed09255ed7b9d3cf9cc57d93e3053366fc',
};
const sourceReviewPaths = new Set([
  `${work}/source-review-9p-0200-0203.json`,
  `${work}/9p-next-source-0200-0203-correction-1/before/source-review-9p-0200-0203.json`,
]);
const candidateFolders = [
  '.tmp/STEMROBIN-181/9p-d020-n72-figures',
  '.tmp/STEMROBIN-181/9p-d020-n76-fig140-141',
  '.tmp/STEMROBIN-181/9p-d020-n76-fig142-143',
];
const local = file => {
  const name = relative(file);
  assert.ok(name && !name.startsWith('../') && !path.isAbsolute(name), `Outside workspace: ${file}`);
  return name;
};
const binding = value => {
  assert.ok(value?.path, 'Missing binding path.');
  assert.match(value.sha256 ?? '', shaPattern, `Missing exact byte SHA: ${value.path}`);
  return { path: local(value.path), sha256: value.sha256 };
};
const at = (value, trail) => {
  assert.ok(Array.isArray(trail) && trail.every(field =>
    typeof field === 'string' || Number.isInteger(field)), 'Invalid proof trail.');
  return trail.reduce((owner, field) => {
    assert.ok(owner && Object.hasOwn(owner, field), `Missing field: ${trail.join('.')}`);
    return owner[field];
  }, value);
};
const key = (report, trail) => `${local(report.path)}:${report.sha256}:${JSON.stringify(trail)}`;
const samePath = (a, b) => assert.equal(local(a), local(b), 'Proof must identify the exact requested path.');
const encode = value => Buffer.from(`${JSON.stringify(value, null, 2)}\n`);
const ownOutput = file => {
  file = local(file);
  assert.ok(file.startsWith(`${work}/`) && file.endsWith('.json'), 'Only new own-ticket scratch JSON outputs.');
  return file;
};

// Never follow a candidate symlink or search any broader scratch/resource root.
async function searchSnapshots(wanted) {
  const matches = new Map([...wanted].map(sha256 => [sha256, []]));
  const searched = [];
  const files = [];
  const symlinks = [];
  const visit = async (folder, count) => {
    for (const entry of (await fs.readdir(absolute(folder), { withFileTypes: true }))
      .sort((a, b) => a.name.localeCompare(b.name))) {
      const file = `${folder}/${entry.name}`;
      if (entry.isSymbolicLink()) {
        symlinks.push(file);
      } else if (entry.isDirectory()) {
        await visit(file, count);
      } else {
        assert.ok(entry.isFile(), `Unexpected candidate entry: ${file}`);
        const value = await bind(file);
        count.value++;
        files.push(value);
        matches.get(value.sha256)?.push(value);
      }
    }
  };
  for (const folder of candidateFolders) {
    const count = { value: 0 };
    await visit(folder, count);
    searched.push({ folder, regularFilesHashed: count.value });
  }
  return { matches, searched, files, symlinks };
}

// Returns request.bindingProofs/aliases, deterministic supporting declarations,
// and real blockers. It does not modify a request, report or candidate artifact.
export async function resolveFinalPlanProofs({
  input = missingReport, proofPath = proofDocumentPath,
} = {}) {
  input = binding(input);
  assert.ok(input.path.startsWith(`${work}/`), 'Missing report must be own-ticket scratch.');
  proofPath = ownOutput(proofPath);
  const captured = new Map();
  const documents = new Map();
  const load = async value => {
    value = binding(value);
    await verify(value.path, value.sha256);
    captured.set(`${value.path}:${value.sha256}`, value);
    if (!documents.has(`${value.path}:${value.sha256}`)) {
      documents.set(`${value.path}:${value.sha256}`, await read(value.path));
    }
    return documents.get(`${value.path}:${value.sha256}`);
  };
  const report = await load(input);
  assert.equal(report.status, 'blocked-missing-inputs');
  assert.ok(Array.isArray(report.missingInputs));
  const deferredToMain = [];
  const scoped = [];
  for (const item of report.missingInputs) {
    if (item.trail.includes('command')) deferredToMain.push({
      reason: 'Command process provenance is Main-owned; no artifact proof or exclusion added.', missing: item,
    });
    else if (relative(item.path).startsWith('../')) deferredToMain.push({
      reason: 'External runtime provenance is Main-owned; no external file accessed or excluded.', missing: item,
    });
    else {
      const document = await load(item.report);
      assert.equal(at(document, item.trail), item.path, 'Missing report does not match its pinned raw field.');
      scoped.push(item);
    }
  }
  const n76 = await load(n76Freeze);
  const start = await load(n81Start);
  const sourceFreeze = await load(sourceAuthorFreeze);
  const geometry = await load(n72Geometry);
  const repair = await load(n72RepairPlan);
  const runtime = await load(n76Runtime);
  const oldHelpers = [
    { report: n72Geometry, trail: ['authorHelper'], original: binding(geometry.authorHelper) },
    { report: n76Runtime, trail: ['author'], original: binding(runtime.author) },
  ];
  const search = await searchSnapshots(new Set(oldHelpers.map(item => item.original.sha256)));
  const projectionBindings = [];
  const aliasDeclarations = [];
  const bindingProofs = new Map();
  const resolved = new Map();
  const blockers = [];
  const addProof = (targetReport, trail, proof, proofTrail, declared) => {
    declared = binding(declared);
    const raw = documents.get(`${local(targetReport.path)}:${targetReport.sha256}`);
    assert.ok(raw, 'Proof target must have been loaded from its exact immutable report.');
    samePath(at(raw, trail), declared.path);
    const entry = { report: binding(targetReport), trail, proof: binding(proof), proofTrail };
    const identity = key(targetReport, trail);
    assert.ok(!bindingProofs.has(identity), 'Duplicate proof target.');
    bindingProofs.set(identity, entry);
    resolved.set(identity, { kind: 'exact-binding-proof', ...entry, declared });
  };

  const staging = n76.nativeInputStagingLinks[1];
  const lesson = binding(n76.bindings.frozenInputs.lesson);
  samePath(staging.target, lesson.path);
  assert.equal(staging.sha256, lesson.sha256);
  await verify(lesson.path, lesson.sha256);
  captured.set(`${lesson.path}:${lesson.sha256}`, lesson);
  addProof(n76Freeze, ['nativeInputStagingLinks', 1, 'target'], n76Freeze,
    ['bindings', 'frozenInputs', 'lesson'], lesson);

  const skill = binding(sourceFreeze.lesson_skill);
  assert.equal(skill.sha256, '6096b16b014f8c2c5e55202cd9d04a7115bcbc36897969ccc8e74ddc845e792d',
    'The source author declared the current skill, never the pre185 version.');
  await verify(skill.path, skill.sha256);
  captured.set(`${skill.path}:${skill.sha256}`, skill);
  for (const item of scoped.filter(item => sourceReviewPaths.has(local(item.report.path)) &&
    JSON.stringify(item.trail) === JSON.stringify(['instructions_read', 6]))) {
    const review = await load(item.report);
    assert.equal(review.binding.author_freeze.sha256, sourceAuthorFreeze.sha256);
    samePath(review.binding.author_freeze.path, sourceAuthorFreeze.path);
    samePath(item.path, skill.path);
    addProof(item.report, item.trail, sourceAuthorFreeze, ['lesson_skill'], skill);
  }

  for (const [i, projection] of start.projection.entries()) {
    const candidates = Object.entries(start.bindings).filter(([, value]) =>
      value?.path && local(value.path) === local(projection.target));
    assert.equal(candidates.length, 1, 'Projection target must match one exact start.bindings declaration.');
    const [name, value] = candidates[0];
    const target = binding(value);
    const linkPath = local(projection.path);
    assert.ok((await fs.lstat(absolute(linkPath))).isSymbolicLink(), 'Only the recorded existing projection link.');
    const targetReal = await fs.realpath(absolute(target.path));
    assert.ok(!relative(targetReal).startsWith('../'), 'Never access an external projection target.');
    assert.equal(await fs.realpath(absolute(linkPath)), targetReal, 'Recorded projection target changed.');
    await verify(target.path, target.sha256);
    await verify(linkPath, target.sha256);
    captured.set(`${target.path}:${target.sha256}`, target);
    captured.set(`${linkPath}:${target.sha256}`, { path: linkPath, sha256: target.sha256 });
    projectionBindings.push({
      path: linkPath, sha256: target.sha256,
      basis: { report: n81Start, projectionTrail: ['projection', i],
        bindingTrail: ['bindings', name], target, existingSymlinkTargetAndBytesVerified: true },
    });
    addProof(n81Start, ['projection', i, 'target'], n81Start, ['bindings', name], target);
  }

  for (const helper of oldHelpers) {
    const found = search.matches.get(helper.original.sha256);
    if (!found.length) {
      blockers.push({
        kind: 'missing-exact-historical-helper-bytes', report: helper.report, trail: [...helper.trail, 'path'],
        original: helper.original, searched: search.searched,
        reason: 'No regular file in the explicit candidate folders has the declared SHA. ' +
          'Do not reconstruct unsaved bytes or substitute current/first-failure author versions.',
      });
      continue;
    }
    let snapshot;
    let snapshotProof;
    if (helper.report.path === n72Geometry.path) {
      snapshot = binding(repair.initialAuthorHelperAlias);
      assert.equal(snapshot.sha256, helper.original.sha256);
      assert.ok(found.some(value => value.path === snapshot.path), 'Declared preserved initial helper must exist verbatim.');
      snapshotProof = { report: n72RepairPlan, trail: ['initialAuthorHelperAlias'] };
    } else {
      snapshot = found[0];
      snapshotProof = { kind: 'Exact regular-file byte match in the explicit candidate folders',
        binding: snapshot, searched: search.searched };
    }
    await verify(snapshot.path, helper.original.sha256);
    captured.set(`${snapshot.path}:${snapshot.sha256}`, snapshot);
    aliasDeclarations.push({
      original: helper.original, snapshot,
      basis: { originalProof: { report: helper.report, trail: helper.trail }, snapshotProof,
        role: 'Same-SHA preserved helper bytes, not a new author version or approval' },
    });
  }

  const resolver = await bind(fileURLToPath(import.meta.url));
  captured.set(`${resolver.path}:${resolver.sha256}`, resolver);
  const proofDocument = {
    schema: 'STEMROBIN-181/d020-request-proof@1', ticket: 'STEMROBIN-181', batch: 'D020',
    role: 'Deterministic declaration of existing frozen bindings only; no approval or source/code reconstruction',
    resolver, missingReport: input, projectionBindings, aliases: aliasDeclarations,
  };
  const proofBytes = encode(proofDocument);
  const proofBinding = { path: proofPath, sha256: hash(proofBytes) };
  for (const [i, declared] of projectionBindings.entries()) {
    const trail = ['projection', i, 'path'];
    samePath(at(start, trail), declared.path);
    const entry = { report: n81Start, trail, proof: proofBinding, proofTrail: ['projectionBindings', i] };
    bindingProofs.set(key(n81Start, trail), entry);
    resolved.set(key(n81Start, trail), { kind: 'exact-projection-path-proof', ...entry,
      declared: { path: declared.path, sha256: declared.sha256 } });
  }
  const aliases = aliasDeclarations.map((declaration, i) => {
    const entry = { originalPath: declaration.original.path, ...declaration.snapshot,
      proof: { report: proofBinding, originalTrail: ['aliases', i, 'original'],
        snapshotTrail: ['aliases', i, 'snapshot'] } };
    const source = declaration.basis.originalProof;
    resolved.set(key(source.report, [...source.trail, 'path']), { kind: 'exact-snapshot-alias', ...entry });
    return entry;
  });
  const scopedResolutions = [];
  for (const item of scoped) {
    const value = resolved.get(key(item.report, item.trail));
    if (value) scopedResolutions.push({ missing: item, resolution: value });
    else if (!blockers.some(blocker => key(blocker.report, blocker.trail) === key(item.report, item.trail))) {
      blockers.push({ kind: 'outside-bounded-resolver', missing: item,
        reason: 'No explicit supported raw proof; requires Main or a separately authorized task.' });
    }
  }
  for (const value of captured.values()) await verify(value.path, value.sha256);
  return {
    proofBinding, proofBytes, captured: [...captured.values()],
    supplement: {
      schema: 'STEMROBIN-181/d020-request-supplement@1', ticket: 'STEMROBIN-181', batch: 'D020',
      role: 'Merge only the bindingProofs/aliases/extraEvidence arrays into a new request; first request stays immutable',
      status: blockers.length ? 'partial-supplement-with-real-blockers' : 'bounded-supplement-resolved',
      missingReport: input, bindingProofs: [...bindingProofs.values()], aliases,
      extraEvidence: [proofBinding], blockers, deferredToMain, scopedResolutions,
      search: { folders: search.searched, files: search.files, symlinksNotFollowed: search.symlinks },
      counts: { originalMissingEntries: report.missingInputs.length, scopedEntries: scoped.length,
        resolvedScopedEntries: scopedResolutions.length, blockers: blockers.length,
        deferredToMain: deferredToMain.length, bindingProofs: bindingProofs.size, aliases: aliases.length },
      nativeReviewImageRetentionRebindGitMeterOrBuilderCalls: 0,
    },
  };
}

async function main() {
  const args = process.argv.slice(2);
  if (!args.length || args[0] === '--help') {
    console.log('Supplement only. --freeze writes two new scratch JSON files; never executes the final builder.');
    return;
  }
  assert.deepEqual(args, ['--freeze']);
  for (const file of [proofDocumentPath, supplementPath]) {
    assert.ok(!(await exists(file)), `Do not overwrite an existing supplement artifact: ${file}`);
  }
  const state = await resolveFinalPlanProofs();
  for (const value of state.captured) await verify(value.path, value.sha256);
  await immutableWrite(proofDocumentPath, state.proofBytes);
  await immutableWrite(supplementPath, encode(state.supplement));
  console.log(JSON.stringify({
    status: state.supplement.status, counts: state.supplement.counts,
    supplement: await bind(supplementPath), proofDocument: await bind(proofDocumentPath),
    blockers: state.supplement.blockers,
    nativeReviewImageRetentionRebindGitMeterOrBuilderCalls: 0,
  }, null, 2));
  if (state.supplement.blockers.length) process.exitCode = 2;
}

if (process.argv[1] && absolute(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
