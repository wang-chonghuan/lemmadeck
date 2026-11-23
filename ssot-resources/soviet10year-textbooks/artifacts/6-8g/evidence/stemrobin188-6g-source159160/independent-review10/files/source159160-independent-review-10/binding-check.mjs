import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const own = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(own, '../../../../..');
const inputRoot = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/source159160-independent-inputs-10');
const firstHash = '909a2446357bfb340af1e868841e8f17e1c01ae7efb6ad1c474a02265733e89c';
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const facts = p => {
  const stat = fs.statSync(p);
  return {
    path: p,
    sha256: crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'),
    mode: (stat.mode & 0o7777).toString(8).padStart(4, '0'),
    bytes: stat.size,
  };
};
const inputs = new Map();
function verify(binding, role, expectedMode) {
  if (/source-FIRST|page\.grid\.png/.test(binding.path)) {
    throw new Error('Forbidden FIRST or grid exposure');
  }
  const actual = facts(binding.path);
  const match = actual.sha256 === binding.sha256;
  const modeMatch = expectedMode == null || actual.mode === expectedMode;
  if (!match || !modeMatch) throw new Error(`Binding mismatch: ${binding.path}`);
  const old = inputs.get(binding.path);
  inputs.set(binding.path, {
    ...actual, expectedSha256: binding.sha256, match, modeMatch,
    roles: [...new Set([...(old?.roles ?? []), role])],
  });
  return actual;
}

const sourceBinding = {
  path: path.join(inputRoot, 'source-only.json'),
  sha256: '7c9719c3ef9ab83058cf79c5a04e12a5d7ddaea623c186b63f8e451c87403981',
};
const postBinding = {
  path: path.join(inputRoot, 'post-FIRST.json'),
  sha256: '3c616b345075fcd7083b2496a14e6f5c8fd9ea10e7f0c289d3d1cc971c3df231',
};
verify(sourceBinding, 'source-only-package');
verify(postBinding, 'post-FIRST-package');
const source = read(sourceBinding.path);
const post = read(postBinding.path);
for (const b of source.originalImages) verify(b, 'original-PNG', '0644');
verify(post.authorManifest, 'author-manifest', '0644');
const authorManifest = read(post.authorManifest.path);
const authorIndex = new Map(authorManifest.files.map(f => [f.path, f]));
for (const b of [
  post.authorReport, post.receiverRecord,
  ...post.candidates.flatMap(c => [...c.files, c.receipt]),
  ...post.sourceCrops,
]) verify(b, 'post-FIRST-binding', authorIndex.get(b.path)?.mode ?? '0644');

const author = read(post.authorReport.path);
const receiver = read(post.receiverRecord.path);
if (receiver.report.path !== post.authorReport.path ||
    receiver.report.sha256 !== post.authorReport.sha256) {
  throw new Error('Receiver report binding conflict');
}
verify(author.prepare_receipt, 'existing-prepare-receipt');
const receipts = [];
for (const [page, b] of [
  ['prepare159160', author.prepare_receipt],
  ...post.candidates.map(c => [c.physical, c.receipt]),
]) {
  const r = read(b.path);
  const expectedExit = page === 160 ? 1 : 0;
  if (r.cwd !== repo || r.exitCode !== expectedExit || r.signal != null || r.error != null ||
      !r.startedAt || !r.finishedAt || !Array.isArray(r.argv)) {
    throw new Error(`Execution facts conflict for ${page}`);
  }
  if (page === 'prepare159160') {
    if (!r.argv.includes('prepare-range') || r.argv[r.argv.indexOf('--first') + 1] !== '159' ||
        r.argv[r.argv.indexOf('--last') + 1] !== '160') throw new Error('Prepare scope conflict');
  } else {
    if (!r.argv.includes('finalize') || r.argv[r.argv.indexOf('--page') + 1] !== String(page)) {
      throw new Error('Finalize scope conflict');
    }
    const inputPath = path.join(path.dirname(b.path), 'input.json');
    verify(authorIndex.get(inputPath), 'producer-execution-input', '0644');
    const input = read(inputPath);
    verify(input.typedSnapshot, 'pre-finalize-candidate-hash-only', '0444');
    // The sourceFIRST reference is intentionally neither opened nor hashed.
    const receivedPage = receiver.pages.find(p => p.page === page);
    const authorPage = author.pages.find(p => p.page === page);
    if (!receivedPage || !authorPage ||
        receivedPage.finalize.receipt_sha256 !== b.sha256 ||
        receivedPage.finalize.exitCode !== r.exitCode ||
        authorPage.finalize.receipt_sha256 !== b.sha256 ||
        authorPage.finalize.exitCode !== r.exitCode) throw new Error('Receipt attribution conflict');
    for (const f of post.candidates.find(c => c.physical === page).files) {
      const basename = path.basename(f.path);
      for (const p of [authorPage, receivedPage]) {
        if (!p.outputs.some(o => path.basename(o.path) === basename && o.sha256 === f.sha256)) {
          throw new Error('Candidate output attribution conflict');
        }
      }
    }
  }
  const streams = {};
  for (const name of ['stdout', 'stderr']) {
    const stream = r.streams?.[name];
    if (!stream?.path || !stream.sha256) throw new Error('Missing receipt stream');
    const actual = verify(stream, 'existing-receipt-stream', stream.mode);
    if (stream.bytes != null && stream.bytes !== actual.bytes) throw new Error('Stream byte drift');
    streams[name] = actual;
  }
  receipts.push({
    stage: page === 'prepare159160' ? 'prepare-range' : 'finalize',
    page, receipt: facts(b.path), cwd: r.cwd, argv: r.argv,
    startedAt: r.startedAt, finishedAt: r.finishedAt, exitCode: r.exitCode,
    signal: r.signal, error: r.error, streams,
    disposition: r.exitCode === 0 ? 'EXISTING_EXECUTION_PASS_RECEIVED_NOT_SOURCE_APPROVAL' :
      'EXISTING_EXECUTION_FAIL_RECEIVED_AND_PRESERVED',
    reexecuted: false,
  });
}

for (const relative of [
  '.claude/skills/ld-s10y-lesson/SKILL.md',
  '.claude/skills/ld-s10y-lesson/references/production-resume.md',
  '.agents/skills/ld-s10y-image/SKILL.md',
]) {
  const f = facts(path.join(repo, relative));
  inputs.set(f.path, { ...f, roles: ['post-FIRST-rules-read'] });
}
const first = facts(path.join(own, 'FIRST.md'));
if (first.sha256 !== firstHash || first.mode !== '0444') throw new Error('FIRST lock drift');
const result = {
  schema: 'independent-source-bindings@1',
  status: 'EXACT_BINDINGS_PASS_EXISTING160_FAILURE_PRESERVED',
  own, inputs: [...inputs.values()], receipts,
  firstLock: { ...first, expectedSha256: firstHash, permanentlyUnchanged: true },
  authorFIRSTFilesOpenedOrHashed: false,
  producerReexecutions: 0,
};

if (process.argv[2] === 'manifest') {
  const reportPath = path.join(own, 'report.json');
  read(reportPath);
  const names = fs.readdirSync(own).filter(n => n !== 'manifest.json');
  const outputs = names.map(n => facts(path.join(own, n)));
  const manifest = {
    schema: 'independent-source-review-manifest@1',
    ticket: 'STEMROBIN-188', assignment: 'SAME188-6 continuousOFFLINE finish=review',
    scope: { book: '6-8g', physicalPages: [159, 160], actual33RightBoundaryOnly: true },
    own, inputs: result.inputs, outputs, receiptStreamBindings: receipts,
    firstLock: result.firstLock,
    counters: {
      chargedImages: 7, maxChargedImages: 8, contextImages: 7, maxContextImages: 24,
      originalViews: 2, sourceCropViews: 2, nativeDetailViews: 3, reopens: 0,
      grids: 0, producerReexecutions: 0, sourceEdits: 0, childReviewers: 0,
    },
    execution: { allCallsCompleted: true, activeExecSessions: [] },
    selfBinding: 'manifest.json excluded from its own output hashes; actual SHA256 returned separately',
  };
  fs.writeFileSync(path.join(own, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n', { flag: 'wx' });
  console.log(JSON.stringify({
    manifest: facts(path.join(own, 'manifest.json')),
    report: facts(reportPath), first: result.firstLock,
    verifiedInputCount: result.inputs.length, outputCount: outputs.length,
  }, null, 2));
} else {
  fs.writeFileSync(path.join(own, 'bindings.json'), JSON.stringify(result, null, 2) + '\n', { flag: 'wx' });
  console.log(JSON.stringify({
    bindingRecord: facts(path.join(own, 'bindings.json')),
    verifiedInputCount: result.inputs.length, receipts,
    first: result.firstLock,
  }, null, 2));
}
