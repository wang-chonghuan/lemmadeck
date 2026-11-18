import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(root, '../../../../..');
const prep = path.resolve(root, '../d595-source207-first-preparation');
const expectedManifest = 'b7f511b4c1bddb9732c840f60fc171e8c21b3566a98a2b63b0120ced72e0dc81';
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const owned = name => {
  const target = path.resolve(root, name);
  if (!target.startsWith(root + path.sep)) throw new Error('Outside owned root');
  return target;
};
const write = (name, value) => {
  const target = owned(name);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, value);
};
const json = (name, value) => write(name, JSON.stringify(value, null, 2) + '\n');
const read = name => JSON.parse(fs.readFileSync(owned(name), 'utf8'));
function files(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))
    .flatMap(entry => {
      const file = path.join(dir, entry.name);
      if (entry.isSymbolicLink()) throw new Error('Symlink not permitted: ' + file);
      return entry.isDirectory() ? files(file) : [file];
    });
}
const entries = dir => files(dir).map(file => ({
  path: file, bytes: fs.statSync(file).size, sha256: sha(file),
  mode: (fs.statSync(file).mode & 0o777).toString(8).padStart(4, '0'),
}));
const timestamp = () => new Date().toISOString();
const action = process.argv[2];

if (action === 'init') {
  if (fs.existsSync(owned('input-verification.json'))) throw new Error('Already initialized');
  const manifestFile = path.join(prep, 'manifest.json');
  if (sha(manifestFile) !== expectedManifest) throw new Error('Manifest hash mismatch');
  const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
  const originals = entries(prep);
  if (files(path.join(prep, 'source')).length !== 0) throw new Error('Prepared source not empty');
  for (const input of manifest.inputs) {
    const file = path.resolve(repo, input.path);
    if (!file.startsWith(prep + path.sep) || sha(file) !== input.sha256) {
      throw new Error('Input hash mismatch: ' + file);
    }
  }
  for (const name of ['source', 'work']) {
    if (fs.existsSync(owned(name))) throw new Error('Clone destination exists: ' + name);
    fs.cpSync(path.join(prep, name), owned(name), { recursive: true, errorOnExist: true, force: false });
  }
  for (const input of manifest.inputs) {
    const original = path.resolve(repo, input.path);
    const clone = owned(path.relative(prep, original));
    if (sha(clone) !== input.sha256) throw new Error('Clone hash mismatch');
  }
  json('input-verification.json', {
    verifiedAt: timestamp(), manifest: { path: manifestFile, sha256: expectedManifest },
    originalFiles: originals, sourceWasEmpty: true, cloneFiles: entries(owned('work')),
    prepareInvocationsThisAuthor: 0, cloneOnly: ['source', 'work'],
    incomingTailTextOnly: manifest.previousTailTextOnly,
    source206IndependentPending: true,
  });
  json('opens-ledger.json', {
    schema: 'source207-first-author/image-opens@1',
    singleBoundedBatch: true, batchLimit: 8, contextLimit: 24,
    freshContextStart: 0, parentCount: 24, oldContextsCount: 24,
    parentNewImages: 0, oldContextNewImages: 0, oldBudgetReset: false,
    batchCount: 0, contextCount: 0, opens: [],
  });
  console.log(JSON.stringify({ root, manifestVerified: true, cloned: entries(owned('work')) }, null, 2));
} else if (action === 'crop') {
  const [name, ...numbers] = process.argv.slice(3);
  const box = numbers.map(Number);
  if (box.length !== 4 || box.some(value => !Number.isInteger(value))) throw new Error('Invalid crop');
  const target = owned('inspection/' + name + '.png');
  if (fs.existsSync(target)) throw new Error('Crop exists');
  fs.mkdirSync(path.dirname(target), { recursive: true });
  const program = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python');
  const code = 'from PIL import Image; import sys; Image.open(sys.argv[1]).crop(tuple(map(int,sys.argv[3:7]))).save(sys.argv[2])';
  const result = spawnSync(program, ['-B', '-c', code, owned('work/10p/pages/0207/page.png'), target, ...box.map(String)], {
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  });
  if (result.status !== 0) throw new Error(String(result.stderr));
  json('inspection/' + name + '.crop.json', {
    source: { path: owned('work/10p/pages/0207/page.png'), sha256: sha(owned('work/10p/pages/0207/page.png')) },
    boxXYXY: box, resize: false, paddingChange: false, output: { path: target, sha256: sha(target) },
  });
  console.log(target + ' ' + sha(target));
} else if (action === 'preview') {
  const dir = 'native/svg-preview-first';
  if (fs.existsSync(owned(dir))) throw new Error('Preview already rendered');
  const input = owned('work/10p/pages/0207/figures/fig-181.svg');
  const output = owned('inspection/original-svg-first-preview.png');
  const program = process.execPath;
  const args = [path.join(repo, '.claude/skills/ld-s10y-lesson/tools/svg_raster.js'), input, output];
  const result = spawnSync(program, args, { cwd: repo });
  write(dir + '/stdout.bin', result.stdout ?? Buffer.alloc(0));
  write(dir + '/stderr.bin', result.stderr ?? Buffer.alloc(0));
  json(dir + '/status.json', {
    command: [program, ...args], invocations: 1, exitCode: result.status,
    signal: result.signal, error: result.error ? String(result.error) : null,
    input: { path: input, sha256: sha(input), bytes: fs.statSync(input).size },
    output: fs.existsSync(output) ? { path: output, sha256: sha(output), bytes: fs.statSync(output).size } : null,
    stdout: { path: owned(dir + '/stdout.bin'), sha256: sha(owned(dir + '/stdout.bin')) },
    stderr: { path: owned(dir + '/stderr.bin'), sha256: sha(owned(dir + '/stderr.bin')) },
  });
  for (const file of files(owned(dir))) fs.chmodSync(file, 0o444);
  process.stdout.write(result.stdout ?? '');
  process.stderr.write(result.stderr ?? '');
  console.log(JSON.stringify(read(dir + '/status.json'), null, 2));
  process.exitCode = result.status ?? 1;
} else if (action === 'image') {
  const ledger = read('opens-ledger.json');
  if (ledger.batchCount >= 8 || ledger.contextCount >= 24) throw new Error('Image limit');
  const file = owned(process.argv[3]);
  ledger.opens.push({
    ordinal: ledger.opens.length + 1, path: file, sha256: sha(file),
    role: process.argv[4], recordedAt: timestamp(),
    tool: 'functions.view_image', status: 'LOAD-NEXT',
  });
  ledger.batchCount++;
  ledger.contextCount++;
  json('opens-ledger.json', ledger);
  console.log(JSON.stringify(ledger.opens.at(-1)));
} else if (action === 'observed') {
  const ledger = read('opens-ledger.json');
  const entry = ledger.opens.at(-1);
  if (entry.status !== 'LOAD-NEXT') throw new Error('No pending image');
  entry.status = 'OBSERVED';
  entry.observation = process.argv[3];
  json('opens-ledger.json', ledger);
  console.log('Observed image ' + entry.ordinal);
} else if (action === 'seal') {
  const inventory = owned('source-inventory.json');
  const first = owned('firstpage.md');
  const page = owned('source/10p/pages/0207/page.md');
  if (fs.existsSync(owned('pre-native-seal.json'))) throw new Error('Already sealed');
  fs.mkdirSync(path.dirname(page), { recursive: true });
  fs.copyFileSync(first, page, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(first, 0o444);
  fs.chmodSync(inventory, 0o444);
  json('pre-native-seal.json', {
    sealedAt: timestamp(), files: entries(root).filter(entry => [first, inventory].includes(entry.path)),
    nativeInput: { path: page, sha256: sha(page) },
    sealedBeforeNative: true,
  });
  fs.chmodSync(owned('pre-native-seal.json'), 0o444);
  console.log(JSON.stringify(read('pre-native-seal.json'), null, 2));
} else if (action === 'native') {
  const command = process.argv[3];
  if (!['finalize', 'vectorize'].includes(command)) throw new Error('Unsupported native action');
  const dir = 'native/' + command + '-first';
  if (fs.existsSync(owned(dir))) throw new Error('Native first invocation already exists');
  const seal = read('pre-native-seal.json');
  for (const entry of seal.files) {
    if (sha(entry.path) !== entry.sha256 || (fs.statSync(entry.path).mode & 0o777) !== 0o444) {
      throw new Error('Seal changed');
    }
  }
  const program = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python');
  const args = [
    '-B', path.join(repo, '.claude/skills/ld-s10y-lesson/tools/p2c.py'), command,
    '--book', '10p', '--page', '207', '--root', owned('source'), '--work', owned('work'),
  ];
  json(dir + '/before-files.json', { capturedAt: timestamp(), files: entries(owned('source')).concat(entries(owned('work'))) });
  const temp = owned('work/.native-temp');
  fs.mkdirSync(temp, { recursive: true });
  const startedAt = timestamp();
  const result = spawnSync(program, args, {
    cwd: repo, env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1', TMPDIR: temp },
    maxBuffer: 64 * 1024 * 1024,
  });
  write(dir + '/stdout.bin', result.stdout ?? Buffer.alloc(0));
  write(dir + '/stderr.bin', result.stderr ?? Buffer.alloc(0));
  json(dir + '/status.json', {
    command: [program, ...args], invocations: 1, startedAt, endedAt: timestamp(),
    exitCode: result.status, signal: result.signal,
    error: result.error ? String(result.error) : null,
    stdout: { path: owned(dir + '/stdout.bin'), bytes: result.stdout?.length ?? 0, sha256: sha(owned(dir + '/stdout.bin')) },
    stderr: { path: owned(dir + '/stderr.bin'), bytes: result.stderr?.length ?? 0, sha256: sha(owned(dir + '/stderr.bin')) },
    beforeFiles: owned(dir + '/before-files.json'), afterFiles: owned(dir + '/after-files.json'),
  });
  json(dir + '/after-files.json', { capturedAt: timestamp(), files: entries(owned('source')).concat(entries(owned('work'))) });
  for (const file of files(owned(dir))) fs.chmodSync(file, 0o444);
  process.stdout.write(result.stdout ?? '');
  process.stderr.write(result.stderr ?? '');
  console.log(JSON.stringify(read(dir + '/status.json'), null, 2));
  process.exitCode = result.status ?? 1;
} else if (action === 'freeze') {
  if (fs.existsSync(owned('author-freeze.json'))) throw new Error('Already frozen');
  const verified = read('input-verification.json');
  const inventory = read('source-inventory.json');
  const ledger = read('opens-ledger.json');
  const seal = read('pre-native-seal.json');
  const page = read('source/10p/pages/0207/page.json');
  const audit = read('source/10p/pages/0207/audit.json');
  const finalize = read('native/finalize-first/status.json');
  const vectorize = read('native/vectorize-first/status.json');
  const preview = read('native/svg-preview-first/status.json');
  const problems = [];
  for (const entry of verified.originalFiles) {
    if (sha(entry.path) !== entry.sha256) problems.push('Prepared input changed: ' + entry.path);
  }
  if (files(path.join(prep, 'source')).length) problems.push('Prepared source no longer empty');
  if (entries(prep).length !== verified.originalFiles.length) problems.push('Prepared file set changed');
  for (const entry of seal.files) {
    if (sha(entry.path) !== entry.sha256 || (fs.statSync(entry.path).mode & 0o777) !== 0o444) {
      problems.push('Pre-native seal changed: ' + entry.path);
    }
  }
  const beforeFinalize = read('native/finalize-first/before-files.json');
  const finalInput = beforeFinalize.files.find(entry => entry.path === seal.nativeInput.path);
  if (!finalInput || finalInput.sha256 !== sha(owned('firstpage.md'))) problems.push('First native input drift');
  const refs = page.blocks.map((block, index) => ({
    source_refs: ['p0207#' + (index + 1)],
    sourceRefOrdinal1Based: index + 1, jsonArrayIndex0Based: index,
    jsonPointer: '/blocks/' + index, kind: block.kind,
    bodyRows: block.lines.length,
    flags: { open: block.open, cont: block.cont, samerow: block.samerow },
    textSha256: crypto.createHash('sha256').update(block.lines.join('\n')).digest('hex'),
  }));
  for (const row of inventory.rows) {
    const ordinal = Number(row.blockRef.split('#')[1]);
    if (page.blocks[ordinal - 1]?.lines[row.blockRow - 1] !== row.literal) {
      problems.push('Pixel inventory row does not match native page: ' + row.row);
    }
    if (row.sameRowCaption) {
      const captionOrdinal = Number(row.sameRowCaption.blockRef.split('#')[1]);
      if (page.blocks[captionOrdinal - 1]?.lines[0] !== row.sameRowCaption.literal) {
        problems.push('Caption literal changed');
      }
    }
  }
  const math = [];
  for (const [index, block] of page.blocks.entries()) {
    for (const [lineIndex, line] of block.lines.entries()) {
      for (const match of line.matchAll(/\$([^$]+)\$/g)) {
        math.push({
          source_ref: 'p0207#' + (index + 1), jsonPointer: '/blocks/' + index + '/lines/' + lineIndex,
          tex: match[1], display: false,
        });
      }
    }
  }
  if (math.map(item => item.tex).join(',') !== inventory.formulas.inline.map(item => item.literal).join(',')) {
    problems.push('Source/MD math literal mismatch');
  }
  const counts = {
    sourcePage: page.meta.page, printedPage: page.meta.printed_page,
    blocks: page.blocks.length,
    proseBlocks: page.blocks.filter(block => block.kind === 'p').length,
    proseParagraphObjects: inventory.paragraphs.length,
    proseRows: page.blocks.filter(block => block.kind === 'p').reduce((total, block) => total + block.lines.length, 0),
    captionObjects: page.blocks.filter(block => block.kind === 'cap').length,
    captionRows: page.blocks.filter(block => block.kind === 'cap').reduce((total, block) => total + block.lines.length, 0),
    sameRowCaptionRows: page.blocks.filter(block => block.kind === 'cap' && block.samerow).reduce((total, block) => total + block.lines.length, 0),
    footerRows: page.blocks.filter(block => block.kind === 'foot').reduce((total, block) => total + block.lines.length, 0),
    textBodyRows: page.blocks.reduce((total, block) => total + block.lines.length, 0),
    sourcePrintedRows: inventory.countsFromPixels.uniquePrintedRows,
    nativePrintedRows: audit.lines_printed, nativeMdRows: audit.lines_md,
    figures: page.blocks.filter(block => block.kind === 'fig').length,
    numberedUnitHeadings: page.blocks.filter(block => block.kind === 'h3').length,
    chapterOrSectionHeadings: page.blocks.filter(block => ['h1', 'h2'].includes(block.kind)).length,
    inlineBoldSubheadings: inventory.headings.inlineBold.length,
    exerciseHeadings: page.blocks.filter(block => block.kind === 'exhead').length,
    problemObjects: page.blocks.filter(block => block.kind === 'ex').length,
    sourceDisplayFormulas: inventory.formulas.display.length,
    sourceEquations: inventory.formulas.equations.length,
    sourceInlineMathSpans: inventory.formulas.inline.length,
    mdInlineMathSpans: math.length, forcedMathWraps: 0,
    openBlocks: page.blocks.filter(block => block.open).length,
    contBlocks: page.blocks.filter(block => block.cont).length,
    samerowBlocks: page.blocks.filter(block => block.samerow).length,
    incomingContinuationBlocks: 0, pageInternalContinuationBlocks: 1,
    outgoingOpenParagraphs: 1, normalizations: audit.normalizations.length,
    unknownChars: audit.unknown_chars.length, katexWarnings: audit.katex_warnings.length,
    errata: audit.errata, nativeErrors: audit.errors.length,
  };
  if (counts.nativePrintedRows !== counts.nativeMdRows || counts.nativeMdRows !== counts.sourcePrintedRows) {
    problems.push('Row count discrepancy');
  }
  if (counts.sourceInlineMathSpans !== counts.mdInlineMathSpans) problems.push('Math count discrepancy');
  if (finalize.exitCode !== 0 || finalize.invocations !== 1) problems.push('First finalize not a single success');
  if (vectorize.exitCode !== 0 || vectorize.invocations !== 1) problems.push('First vectorize not a single success');
  if (preview.exitCode !== 0 || preview.invocations !== 1) problems.push('SVG preview not a single success');
  if (ledger.batchCount !== 5 || ledger.contextCount !== 5 || ledger.opens.some(entry => entry.status !== 'OBSERVED')) {
    problems.push('Image ledger discrepancy');
  }
  for (const entry of ledger.opens) if (sha(entry.path) !== entry.sha256) problems.push('Observed image changed');
  const beforeVectorize = read('native/vectorize-first/before-files.json');
  const afterVectorize = read('native/vectorize-first/after-files.json');
  const sourceHashes = snapshot => JSON.stringify(snapshot.files.filter(entry => entry.path.startsWith(owned('source') + path.sep)).map(entry => [entry.path, entry.sha256]));
  if (sourceHashes(beforeVectorize) !== sourceHashes(afterVectorize)) problems.push('Source changed during vectorize');
  if (problems.length) throw new Error(problems.join('\n'));
  const artifact = name => {
    const file = owned(name);
    return { path: file, sha256: sha(file), bytes: fs.statSync(file).size };
  };
  const nativeReceipt = (name, result) => ({
    invocations: result.invocations, firstExitCode: result.exitCode,
    firstStatus: 'PASS-MECHANICAL-ONLY', status: artifact('native/' + name + '-first/status.json'),
    stdout: artifact('native/' + name + '-first/stdout.bin'),
    stderr: artifact('native/' + name + '-first/stderr.bin'),
    beforeFiles: artifact('native/' + name + '-first/before-files.json'),
    afterFiles: artifact('native/' + name + '-first/after-files.json'),
    repairInvocations: 0, firstFailure: null, firstEvidenceRetained: true,
  });
  const raw = artifact('work/10p/pages/0207/figures/fig-181.png');
  const svg = artifact('work/10p/pages/0207/figures/fig-181.svg');
  const svgPreview = artifact('inspection/original-svg-first-preview.png');
  const report = {
    schema: 'source207-first-author/report@1',
    ticket: 'STEMROBIN-181', book: '10p', sourcePage: 207, printedPage: 197,
    status: 'FIRST-AUTHORED-NATIVE-FIRST-PASS-FROZEN-SOURCE-INDEPENDENT-PENDING',
    authoredAt: timestamp(), ownedRoot: root,
    boundedRole: { firstSource207Author: true, permanentOrReplacementAD: false, singleBatch: true, finalReturn: 'TEXT-PATHS-FULL-SHA256-STATUSES-ONLY' },
    scope: {
      writesOnlyUnder: root, sourcePagesAuthoredInScratch: 1,
      canonicalSourcePagesAdded: 0, completeCardsAdded: 0,
      prepareInvocations: 0, newWorktrees: 0, newBranches: 0, gitCommands: 0,
      databaseConnections: 0, deployCommands: 0, canonicalEdits: 0,
      oldPagesReopened: 0, paidCalls: 0, semanticRedraws: 0, modernSpecs: 0,
      assembledWholeBook: false, wholeBookChecks: false, wholeCardChecks: false,
      sharedDirtyBytes: 'No outside-root writes performed by this author; concurrent agents remain active. No global dirty-state stability claim.',
    },
    preparation: {
      manifest: verified.manifest, exactHashVerified: true,
      sourceInitiallyEmpty: true, copiedOnly: ['source', 'work'],
      allPreparedFileBytesUnchangedAtFreeze: true,
      sourceStillEmptyInPreparation: true, receipt: artifact('input-verification.json'),
    },
    sealedBeforeFirstNative: {
      inventory: artifact('source-inventory.json'), firstPageMd: artifact('firstpage.md'),
      receipt: artifact('pre-native-seal.json'), mode: '0444',
      originalFirstInputMatches: true, sealedBytesStillMatch: true,
    },
    counts, sourceMdMath: {
      literalMatch: true, mdMath: math,
      nativeMathCheck: 'PASS-MECHANICAL-KATEX-FROM-FIRST-FINALIZE',
      independentMathematicalReview: 'PENDING', contentCorrections: [],
    },
    provenancePointers: {
      source_refsConvention: 'p0207#K with K 1-based block ordinal',
      jsonPointerConvention: '/blocks/I with I 0-based array index',
      pageJson: artifact('source/10p/pages/0207/page.json'),
      mapping: refs, assembledSourceRefsProduced: false,
    },
    flags: {
      p0207_1: { open: true, cont: false, reason: 'New paragraph, split for page-internal illustration wrapping only.' },
      p0207_3: { samerow: true, reason: 'Caption shares physical prose row 6.' },
      p0207_4: { cont: true, open: false, reason: 'Same-page continuation of p0207#1, closes the first paragraph.' },
      p0207_7: { open: true, cont: false, reason: 'Last paragraph demonstrably unfinished at this page edge.' },
      incomingCont: false,
    },
    native: {
      finalize: nativeReceipt('finalize', finalize),
      vectorize: {
        ...nativeReceipt('vectorize', vectorize), pageOnly: 207, figuresTraced: 1,
        mismatchPercentReportedExactText: '0.015%',
        sourceFilesUnchanged: true, bitmapTracingOnly: true,
      },
      totalRepairInvocations: 0, repairStatus: 'NOT-NEEDED-FIRST-PASS',
      env: { PYTHONDONTWRITEBYTECODE: '1', TMPDIR: owned('work/.native-temp') },
    },
    figures: [{
      id: 'fig-181', source_refs: ['p0207#2'], captionSourceRefs: ['p0207#3'],
      coarseBoxXYWH: inventory.figures[0].coarseBoxXYWH,
      exactNativeBoxXYWH: audit.figures[0].box,
      nativeComponents: audit.figures[0].components,
      paddingPx: 12, paddingOverride: false, exclusionOverrides: [],
      raw, svg, preview: svgPreview, dimensions: [489, 367],
      rawBytes: raw.bytes, svgBytes: svg.bytes, previewBytes: svgPreview.bytes,
      rawFirstInspectionOrdinal: 4, svgFirstInspectionOrdinal: 5,
      authorRawObservation: 'COMPLETE-SOURCE-CROP-NO-PROSE-OR-CAPTION-CONTAMINATION',
      authorSvgObservation: 'NONBLANK-COMPLETE-NATIVE-TRACE-FIRST-INSPECTION',
      scanSpecks: 'Small source speck near lower-right retained; no source pixel edits.',
      semanticRedraw: false, modernSpec: false,
      SOURCEIndependent: 'PENDING', independentVisualPassClaim: false,
      svgPreviewReceipt: artifact('native/svg-preview-first/status.json'),
    }],
    imageBudget: {
      parent: { suppliedStart: 24, newLoads: 0, end: 24 },
      oldContexts: { suppliedStart: 24, newLoads: 0, end: 24 },
      author: { start: 0, batchLoads: ledger.batchCount, contextLoads: ledger.contextCount, batchLimit: 8, contextLimit: 24 },
      oldBudgetReset: false, noMoreImages: true, ledger: artifact('opens-ledger.json'),
    },
    boundaries: {
      incoming: inventory.boundaries.incoming,
      outgoing: inventory.boundaries.outgoing,
      currentTarget: inventory.headings.currentTarget,
      actualNextTargetBoundary: inventory.headings.actualNextTargetBoundary,
      fullN78: false, source206Independent: 'PENDING', source207Independent: 'PENDING',
      completeCardsAdded: 0, nextPagePixelsLoaded: 0, guessedContinuation: false,
    },
    sourceArtifacts: {
      pageMd: artifact('source/10p/pages/0207/page.md'),
      pageJson: artifact('source/10p/pages/0207/page.json'),
      audit: artifact('source/10p/pages/0207/audit.json'),
    },
    reconciliation: {
      scope: 'Owned page facts and first native evidence only; no native command repeated.',
      inventoryRowsMatchNativeLiterals: true, sourceMathMatchesMdMath: true,
      firstNativeInputMatchesSealedFirstMd: true, originalPreparedBytesUnchanged: true,
      allObservedImageHashesMatch: true, sourceBytesStableAcrossVectorize: true,
    },
    review: {
      SOURCEIndependent: 'PENDING', source206SelfSigned: false,
      authorObservationsOnly: true, independentPassClaims: false,
      outgoingNextPageDetail: 'HOLD', actualRightBoundary: 'HOLD', fullN78: false,
    },
    freeze: {
      status: 'AUTHOR-FROZEN', allOwnedRegularFilesMode: '0444',
      manifestPath: owned('author-freeze.json'),
      selfHashPolicy: 'Freeze manifest hashes every other owned regular file. Its own SHA-256 is returned externally to avoid a circular self-hash.',
    },
  };
  json('report.json', report);
  for (const file of files(root)) fs.chmodSync(file, 0o444);
  const frozenFiles = entries(root);
  json('author-freeze.json', {
    schema: 'source207-first-author/freeze@1', frozenAt: timestamp(), ownedRoot: root,
    status: 'AUTHOR-FROZEN-SOURCE-INDEPENDENT-PENDING',
    report: artifact('report.json'), files: frozenFiles,
    indexedFileCount: frozenFiles.length, totalRegularFilesIncludingSelf: frozenFiles.length + 1,
    allRegularFilesMode: '0444', directoriesRemainTraversable: true,
    sealedFirstDraftUnchanged: true, imageLoadsFinal: 5,
    SOURCEIndependent: 'PENDING', source206Independent: 'PENDING',
    fullN78: false, nextPageDetail: 'HOLD', canonicalSourcePagesAdded: 0,
    completeCardsAdded: 0, selfEntryOmittedToAvoidCircularHash: true,
  });
  fs.chmodSync(owned('author-freeze.json'), 0o444);
  const freeze = read('author-freeze.json');
  for (const entry of freeze.files) {
    if (sha(entry.path) !== entry.sha256 || (fs.statSync(entry.path).mode & 0o777) !== 0o444) {
      throw new Error('Frozen file mismatch: ' + entry.path);
    }
  }
  if (files(root).some(file => (fs.statSync(file).mode & 0o777) !== 0o444)) throw new Error('Non-readonly file');
  console.log(JSON.stringify({
    status: report.status, counts, totalRegularFiles: files(root).length, allRegularFilesMode: '0444',
    imageLoads: 5, fullN78: false, SOURCEIndependent: 'PENDING', rightBoundary: 'HOLD',
    outputs: [
      'report.json', 'author-freeze.json', 'source-inventory.json', 'firstpage.md', 'opens-ledger.json',
      'source/10p/pages/0207/page.md', 'source/10p/pages/0207/page.json', 'source/10p/pages/0207/audit.json',
      'work/10p/pages/0207/figures/fig-181.png', 'work/10p/pages/0207/figures/fig-181.svg',
      'native/finalize-first/status.json', 'native/vectorize-first/status.json',
    ].map(artifact),
  }, null, 2));
} else {
  throw new Error('Unknown action: ' + action);
}
