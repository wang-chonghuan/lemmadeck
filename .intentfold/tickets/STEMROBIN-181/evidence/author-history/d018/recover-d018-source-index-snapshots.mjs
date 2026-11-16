import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const work = '.intentfold/tickets/STEMROBIN-181/tmp';
const folder = `${work}/d018-source-index-archival-recovery`;
const originalPath = 'ssot-resources/soviet10year-textbooks/artifacts/9p/book.json';
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const bind = file => ({ path: file, sha256: hash(fs.readFileSync(path.join(root, file))) });
const versions = [
  {
    range: '0156-0159', prefix: 159, pages: 150, cards: 72,
    expected: '58edd24947d3f5e56fcc1b7a8f3671714dca0e262023030561c6b05f60572900',
  },
  {
    range: '0160-0163', prefix: 163, pages: 154, cards: 74,
    expected: 'ca3beb9a283e3677e473eff24b467dd29c2ef21608092272d20dcaca18d70b24',
  },
];
assert.equal(process.cwd(), root);
assert.equal(fs.existsSync(path.join(root, folder)), false, 'Never overwrite historical recovery.');
const current = fs.readFileSync(path.join(root, originalPath));
const snapshots = versions.map(version => {
  const tracePath = `${work}/source-review-9p-${version.range}-finalization-trace.json`;
  const trace = JSON.parse(fs.readFileSync(path.join(root, tracePath), 'utf8'));
  assert.equal(trace.assembly.book.path, originalPath);
  assert.equal(trace.assembly.book.sha256, version.expected);
  assert.equal(trace.currentSourceIndex.book, '9p');
  assert.equal(trace.currentSourceIndex.pages, version.pages);
  assert.equal(trace.currentSourceIndex.lessons.length, version.cards);
  const data = `${JSON.stringify(trace.currentSourceIndex, null, 2)}\n`;
  assert.equal(hash(data), version.expected, 'Only exact full historical SHA matches may be written.');
  return { ...version, trace: bind(tracePath), data };
});
fs.mkdirSync(path.join(root, folder));
const files = snapshots.map(snapshot => {
  const file = `${folder}/through-${snapshot.prefix}.book.json`;
  fs.writeFileSync(path.join(root, file), snapshot.data, { flag: 'wx' });
  assert.equal(bind(file).sha256, snapshot.expected);
  return {
    ...bind(file), originalPath,
    role: `Exact source book index through PDF${snapshot.prefix}; extracted from the frozen trace's complete currentSourceIndex`,
  };
});
assert.deepEqual(fs.readFileSync(path.join(root, originalPath)), current);
const manifest = {
  status: 'recovered-history-only',
  role: 'Exact historical source indexes, not new assembly or approval',
  files,
  bindings: {
    trace159: snapshots[0].trace,
    trace163: snapshots[1].trace,
    recoveryTool: bind(path.relative(root, fileURLToPath(import.meta.url))),
    nativeSerializerReference: bind('.claude/skills/ld-s10y-lesson/tools/assemble.py'),
  },
  recovery: snapshots.map(snapshot => ({
    source: snapshot.trace, fieldTrail: ['currentSourceIndex'],
    declaredOutputTrail: ['assembly', 'book', 'sha256'],
    prefix: snapshot.prefix, pages: snapshot.pages, cards: snapshot.cards,
    expectedSha256: snapshot.expected, bytes: Buffer.byteLength(snapshot.data),
  })),
  serializer: 'UTF-8, retained field order, two-space JSON indentation and final LF; full bytes match the native declared historical SHA',
  generationTimestamp: 'No timestamp field exists in either retained index or the native source book serializer; none invented',
  currentSourceIndexUntouched: true,
  currentIndexUsedAsHistoricalInput: false,
  pageOrLessonMetadataReconstructed: false,
  nativeAssemblyOrGateCalls: 0,
  approvalClaimed: false,
};
const manifestPath = `${folder}/aliases.json`;
fs.writeFileSync(path.join(root, manifestPath), `${JSON.stringify(manifest, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({ recovery: bind(manifestPath), aliases: files }, null, 2));
