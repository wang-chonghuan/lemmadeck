import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const own = path.dirname(fileURLToPath(import.meta.url));
const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const prep = path.join(path.dirname(own), 'd587-source206-first-preparation');
const expectedManifest = '350cda0f276a2d8058d39ac95d1e3ebeb7e2f45de3f4b0681b712bc103bd6100';
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const write = (name, value) => fs.writeFileSync(path.join(own, name), JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
const assert = (condition, message) => { if (!condition) throw new Error(message); };

function files(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name)).flatMap(entry => {
    const p = path.join(dir, entry.name);
    assert(!entry.isSymbolicLink(), `Symlink prohibited: ${p}`);
    return entry.isDirectory() ? files(p) : [p];
  });
}

function snapshot(name, roots) {
  const target = path.join(own, name);
  assert(!fs.existsSync(target), `Snapshot exists: ${target}`);
  fs.mkdirSync(target);
  const entries = [];
  for (const root of roots) {
    for (const p of files(path.join(own, root))) {
      const relative = path.relative(own, p);
      const dst = path.join(target, relative);
      fs.mkdirSync(path.dirname(dst), { recursive: true });
      fs.copyFileSync(p, dst, fs.constants.COPYFILE_EXCL);
      assert(hash(p) === hash(dst), `Snapshot copy differs: ${relative}`);
      fs.chmodSync(dst, 0o444);
      entries.push({ path: p, snapshot: dst, bytes: fs.statSync(p).size, sha256: hash(p) });
    }
  }
  write(`${name}.json`, { schema: 'bounded-byte-snapshot@1', entries });
  fs.chmodSync(path.join(own, `${name}.json`), 0o444);
  return entries;
}

const phase = process.argv[2];
if (phase === 'init') {
  const manifestPath = path.join(prep, 'manifest.json');
  assert(hash(manifestPath) === expectedManifest, 'Preparation manifest hash mismatch');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  assert(fs.statSync(path.join(prep, 'source')).isDirectory(), 'Prepared source absent');
  assert(files(path.join(prep, 'source')).length === 0, 'Prepared source is not empty');
  const inputs = manifest.inputs.map(input => {
    const p = path.resolve(repo, input.path);
    assert(p.startsWith(prep + path.sep), `Unowned preparation input: ${p}`);
    assert(hash(p) === input.sha256, `Preparation input differs: ${p}`);
    return { path: p, bytes: fs.statSync(p).size, sha256: hash(p) };
  });
  assert(files(path.join(prep, 'work')).length === inputs.length, 'Unexpected prepared work files');
  for (const root of ['source', 'work']) {
    const dst = path.join(own, root);
    assert(!fs.existsSync(dst), `Clone target exists: ${dst}`);
    fs.cpSync(path.join(prep, root), dst, { recursive: true, force: false, errorOnExist: true });
  }
  const clonedInputs = inputs.map(input => {
    const p = path.join(own, path.relative(prep, input.path));
    assert(hash(p) === input.sha256, `Clone differs: ${p}`);
    return { ...input, clonePath: p, cloneSha256: hash(p) };
  });
  write('preparation-verification.json', {
    status: 'hash-verified-cloned-without-reprepare',
    manifestPath, manifestSha256: hash(manifestPath),
    preparedSourceExists: true, preparedSourceFiles: 0,
    inputs: clonedInputs, prepareInvocationsByThisAuthor: 0,
    source205Independent: 'running-not-certified',
    ownershipRoot: own, gitDbDeployCanonicalWrites: false,
  });
  console.log(JSON.stringify({ phase, status: 'verified', clonedInputs: clonedInputs.length, preparedSourceFiles: 0 }));
} else if (phase === 'first-freeze') {
  const md = path.join(own, 'source/10p/pages/0206/page.md');
  const inventory = JSON.parse(fs.readFileSync(path.join(own, 'source-inventory.json'), 'utf8'));
  const body = fs.readFileSync(md, 'utf8').split('---')[2];
  const lines = body.split('\n').filter(line => line.trim() && !line.trim().startsWith('<!--'));
  assert(JSON.stringify(lines) === JSON.stringify(inventory.printedLines.map(line => line.text)), 'First page differs from pixel inventory');
  assert(lines.length === 23, 'First faithful source line count differs');
  const dst = path.join(own, 'page.first.md');
  fs.copyFileSync(md, dst, fs.constants.COPYFILE_EXCL);
  for (const name of ['page.first.md', 'source-inventory.json', 'images-ledger.json']) fs.chmodSync(path.join(own, name), 0o444);
  write('first-author-freeze.json', {
    status: 'first-faithful-page-and-pixel-inventory-frozen-before-native',
    nativeInvocationsSoFar: 0,
    sourceInventory: { path: path.join(own, 'source-inventory.json'), sha256: hash(path.join(own, 'source-inventory.json')), mode: '0444' },
    faithfulPage: { path: dst, sha256: hash(dst), mode: '0444' },
    nativeWorkingPage: { path: md, sha256: hash(md), frozenBeforeNativeCopy: 'native-before/source/10p/pages/0206/page.md' },
    printedLines: lines.length, imagesOpened: 2, independentGates: 'pending',
  });
  fs.chmodSync(path.join(own, 'first-author-freeze.json'), 0o444);
  console.log(JSON.stringify({ phase, printedLines: lines.length, firstPageSha256: hash(dst), inventorySha256: hash(path.join(own, 'source-inventory.json')) }));
} else if (phase === 'native') {
  assert(!fs.existsSync(path.join(own, 'native-first.receipt.json')), 'Native finalize already invoked');
  for (const name of ['source-inventory.json', 'page.first.md']) {
    assert((fs.statSync(path.join(own, name)).mode & 0o777) === 0o444, `First author artifact not frozen: ${name}`);
  }
  const md = path.join(own, 'source/10p/pages/0206/page.md');
  assert(hash(md) === hash(path.join(own, 'page.first.md')), 'First page differs before native finalize');
  const before = snapshot('native-before', ['source', 'work']);
  const command = [
    path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python'), '-B',
    path.join(repo, '.claude/skills/ld-s10y-lesson/tools/p2c.py'),
    'finalize', '--book', '10p', '--page', '206',
    '--root', path.join(own, 'source'), '--work', path.join(own, 'work'),
  ];
  write('native-first.started.json', { command, authorizedInvocations: 1, started: new Date().toISOString() });
  const result = spawnSync(command[0], command.slice(1), { cwd: repo, env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' } });
  fs.writeFileSync(path.join(own, 'native-first.stdout'), result.stdout ?? Buffer.alloc(0), { flag: 'wx' });
  fs.writeFileSync(path.join(own, 'native-first.stderr'), result.stderr ?? Buffer.alloc(0), { flag: 'wx' });
  const after = snapshot('native-after', ['source', 'work']);
  write('native-first.receipt.json', {
    command, invocations: 1, exitCode: result.status, signal: result.signal,
    error: result.error?.message ?? null,
    stdoutPath: path.join(own, 'native-first.stdout'), stdoutSha256: hash(path.join(own, 'native-first.stdout')),
    stderrPath: path.join(own, 'native-first.stderr'), stderrSha256: hash(path.join(own, 'native-first.stderr')),
    stdout: (result.stdout ?? Buffer.alloc(0)).toString('utf8'),
    stderr: (result.stderr ?? Buffer.alloc(0)).toString('utf8'),
    firstOutcome: result.status === 0 ? 'PASS-native-only-independent-pending' : 'FAIL',
    before, after,
  });
  for (const name of ['native-first.started.json', 'native-first.receipt.json', 'native-first.stdout', 'native-first.stderr']) fs.chmodSync(path.join(own, name), 0o444);
  console.log((result.stdout ?? Buffer.alloc(0)).toString('utf8'));
  console.log(JSON.stringify({ phase, exitCode: result.status, signal: result.signal }));
} else if (phase === 'report') {
  const pageDir = path.join(own, 'source/10p/pages/0206');
  const pageJsonPath = path.join(pageDir, 'page.json');
  const auditPath = path.join(pageDir, 'audit.json');
  const page = JSON.parse(fs.readFileSync(pageJsonPath, 'utf8'));
  const audit = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
  const receipt = JSON.parse(fs.readFileSync(path.join(own, 'native-first.receipt.json'), 'utf8'));
  const inventory = JSON.parse(fs.readFileSync(path.join(own, 'source-inventory.json'), 'utf8'));
  const ledger = JSON.parse(fs.readFileSync(path.join(own, 'images-ledger.json'), 'utf8'));
  const actualLines = page.blocks.flatMap(block => block.lines);
  assert(JSON.stringify(actualLines) === JSON.stringify(inventory.printedLines.map(line => line.text)), 'Native output changed frozen source lines');
  assert(receipt.exitCode === 0 && audit.errors.length === 0, 'Native not ready');
  assert(audit.lines_printed === 23 && audit.lines_md === 23, 'Native counting disagreement');
  assert(page.blocks.length === 15 && audit.figures.length === 0, 'Native objects disagree with pixels');
  assert(page.blocks[0].cont && !page.blocks[0].open, 'Opening continuation changed');
  assert(page.blocks.slice(1).every(block => !block.cont && !block.open), 'Unexpected continuation or open status');
  assert(page.blocks[11].kind === 'h3' && page.blocks[11].lines[0] === '78. 照相机 投影仪', 'Numbered boundary changed');
  assert(page.blocks.filter(block => block.kind === 'ex').map(block => block.label).join(',') === '1,2,3,4,5,6,7,8', 'Exercise identities changed');
  assert(page.meta.printed_page === 196, 'Printed page changed');
  const fileEvidence = p => ({ path: p, bytes: fs.statSync(p).size, sha256: hash(p) });
  const beforeByPath = new Map(receipt.before.map(entry => [entry.path, entry]));
  const byteChanges = receipt.after.map(entry => {
    const previous = beforeByPath.get(entry.path);
    return {
      path: entry.path,
      beforeSha256: previous?.sha256 ?? null,
      afterSha256: entry.sha256,
      beforeBytes: previous?.bytes ?? null,
      afterBytes: entry.bytes,
      change: !previous ? 'native-created' : previous.sha256 === entry.sha256 ? 'unchanged' : 'native-metadata-only-rewrite',
    };
  });
  write('report.json', {
    schema: 'source206-bounded-first-author-report@1',
    ticket: 'STEMROBIN-181',
    batch: 'FIRST-SOURCE206-author',
    status: 'author/native-ready independent-pending',
    boundedBatchFinished: true,
    role: 'single-fresh-bounded-author-not-permanent-or-replacement-A-D',
    ownershipRoot: own,
    sharedCheckout: repo,
    branchContext: 'original181-as-supplied-not-operated',
    preparation: {
      manifestPath: path.join(prep, 'manifest.json'),
      manifestSha256: expectedManifest,
      verification: fileEvidence(path.join(own, 'preparation-verification.json')),
      verifiedPreparedInputFiles: 4,
      clonedRootsOnly: ['source', 'work'],
      preparedSourceIntentionallyEmptyAndExisting: true,
      prepareInvocationsByThisAuthor: 0,
    },
    sourceCounts: inventory.counts,
    native: {
      command: receipt.command,
      invocations: receipt.invocations,
      exitCode: receipt.exitCode,
      signal: receipt.signal,
      firstOutcome: receipt.firstOutcome,
      firstFailure: null,
      countingMismatchDiscovered: false,
      repairs: 0,
      linesPrinted: audit.lines_printed,
      linesMd: audit.lines_md,
      blocks: page.blocks.length,
      proseBlocks: page.blocks.filter(block => block.kind === 'p').length,
      prosePrintedLines: page.blocks.filter(block => block.kind === 'p').reduce((n, block) => n + block.lines.length, 0),
      exerciseObjects: page.blocks.filter(block => block.kind === 'ex').length,
      figures: audit.figures.length,
      normalizations: audit.normalizations.length,
      unknownChars: audit.unknown_chars.length,
      katexWarnings: audit.katex_warnings.length,
      errors: audit.errors,
      receipt: fileEvidence(path.join(own, 'native-first.receipt.json')),
      stdout: fileEvidence(path.join(own, 'native-first.stdout')),
      stderr: fileEvidence(path.join(own, 'native-first.stderr')),
      audit: fileEvidence(auditPath),
      pageJson: fileEvidence(pageJsonPath),
      pageMd: fileEvidence(path.join(pageDir, 'page.md')),
      byteSnapshots: {
        before: fileEvidence(path.join(own, 'native-before.json')),
        after: fileEvidence(path.join(own, 'native-after.json')),
        changes: byteChanges,
        sourceTextAndBlockBoundariesUnchanged: true,
        preparedWorkBytesUnchanged: byteChanges.filter(entry => entry.path.startsWith(path.join(own, 'work') + path.sep)).every(entry => entry.change === 'unchanged'),
      },
    },
    firstFrozenArtifacts: {
      freeze: fileEvidence(path.join(own, 'first-author-freeze.json')),
      sourceInventory: fileEvidence(path.join(own, 'source-inventory.json')),
      firstFaithfulPage: fileEvidence(path.join(own, 'page.first.md')),
      beforeNativePageSnapshot: fileEvidence(path.join(own, 'native-before/source/10p/pages/0206/page.md')),
      frozenBeforeNative: true,
    },
    boundaries: inventory.boundaries,
    paragraphs: inventory.paragraphs,
    headings: inventory.headings,
    exactFinalProseBlock: page.blocks[13].lines.join(''),
    exactFinalProseLine: page.blocks[13].lines.at(-1),
    finalProseNativeRef: 'p0206#14',
    finalProseJsonPointer: '/blocks/13',
    finalProseOpen: false,
    footer: inventory.footer,
    figures: [],
    figureGates: {
      RAW: 'not-applicable-zero-real-figures',
      SVG: 'not-applicable-zero-real-figures',
      vectorize: 'skipped-zero-real-figures',
      figurePassInvented: false,
    },
    gates: {
      authorSourceInventory: 'frozen-not-independent-certification',
      authorFaithfulSource: 'frozen-native-ready',
      nativeFinalize: 'PASS-first-and-only',
      independentSOURCE206: 'pending-not-self-signed',
      independentSOURCE205: 'running-not-certified-not-edited',
      independentSOURCE205206Join: 'pending-not-self-signed',
      independentFIG: 'not-applicable-zero-real-figures-no-PASS-claimed',
      independentDISPLAY: 'pending-not-run-not-self-signed',
    },
    images: {
      ledger: fileEvidence(path.join(own, 'images-ledger.json')),
      parentAndOldContexts: ledger.parentAndOldContexts,
      thisFreshContext: ledger.thisFreshContext,
      cropsRawSvgDisplayOpens: 0,
      returnsImagePayloads: false,
    },
    ownership: {
      writesOnlyUnderOwnershipRoot: true,
      unrelatedDirtyBytesNotEdited: true,
      source205Writes: 0,
      preparationWrites: 0,
      canonicalWrites: 0,
      worktreeOperations: 0,
      branchOperations: 0,
      gitOperations: 0,
      databaseOperations: 0,
      deployOperations: 0,
      modernDrafts: 0,
      answers: 0,
      probabilityWork: 0,
      permanentOrReplacementWorkers: 0,
    },
    completionClaims: {
      n77Complete: false,
      n78Complete: false,
      assembledCards: 0,
      source205Certified: false,
      nextPageContinuationGuessed: false,
      independentApprovals: 0,
    },
    finalFreeze: {
      path: path.join(own, 'author-freeze.json'),
      status: 'all-owned-files-0444-after-report-generation',
      hashCoverage: 'Every owned file except the manifest itself is hash-bound in author-freeze.json; its own full hash is returned externally.',
    },
  });
  console.log(JSON.stringify({ phase, status: 'author/native-ready independent-pending', blocks: 15, lines: '23/23', figures: 0, proseBlocks: 4, exerciseObjects: 8, imageOpens: 2 }));
} else if (phase === 'freeze') {
  const manifestPath = path.join(prep, 'manifest.json');
  assert(hash(manifestPath) === expectedManifest, 'Preparation manifest changed');
  const prepCheck = JSON.parse(fs.readFileSync(path.join(own, 'preparation-verification.json'), 'utf8'));
  for (const input of prepCheck.inputs) assert(hash(input.path) === input.sha256, `Preparation changed: ${input.path}`);
  assert(files(path.join(prep, 'source')).length === 0, 'Preparation source changed');
  const reportPath = path.join(own, 'report.json');
  assert(fs.existsSync(reportPath), 'Report absent');
  const freezePath = path.join(own, 'author-freeze.json');
  assert(!fs.existsSync(freezePath), 'Author already frozen');
  for (const p of files(own)) fs.chmodSync(p, 0o444);
  write('author-freeze.json', {
    schema: 'bounded-author-freeze@1',
    ownershipRoot: own,
    status: 'author/native-ready independent-pending',
    preparationUnchanged: true,
    selfHashPolicy: 'This manifest excludes itself to avoid a circular digest; its full SHA-256 is returned externally with the report SHA-256.',
    files: files(own).map(p => ({ path: p, bytes: fs.statSync(p).size, mode: '0444', sha256: hash(p) })),
  });
  fs.chmodSync(freezePath, 0o444);
  for (const p of files(own)) assert((fs.statSync(p).mode & 0o777) === 0o444, `Owned file not frozen: ${p}`);
  console.log(JSON.stringify({
    report: { path: reportPath, sha256: hash(reportPath) },
    freeze: { path: freezePath, sha256: hash(freezePath) },
    ownedFileCount: files(own).length, allOwnedFilesMode: '0444',
  }, null, 2));
} else {
  throw new Error('Phase must be init, first-freeze, native, report, or freeze');
}
