import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const cwd = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
assert.equal(process.cwd(), cwd);
const tmp = path.join(cwd, '.intentfold/tickets/STEMROBIN-188/tmp');
const own = path.join(tmp, 'n46-number36-identity-repair-01');
const before = path.join(own, 'before');
const pageRel = '9-10g/pages/0165';
const oldHeader = '<!-- ex 36* -->';
const newHeader = '<!-- ex 36 -->';
const toolRoot = path.join(cwd, '.claude/skills/ld-s10y-lesson');
const receiptDir = path.join(own, 'receipts/0165/0001');
const manifestPath = path.join(before, 'bindings.json');
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const readJSON = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const binding = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, sha256: sha(bytes), bytes: bytes.length };
};
function ownPath(file) {
  assert.ok(path.resolve(file).startsWith(`${own}/`), `Write outside own root: ${file}`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  return file;
}
function write(file, value) {
  fs.writeFileSync(ownPath(file), value, { flag: 'wx' });
}
function writeJSON(file, value) {
  write(file, `${JSON.stringify(value, null, 2)}\n`);
}
function clone(source, destination, readonly = false) {
  const original = binding(source);
  fs.copyFileSync(source, ownPath(destination), fs.constants.COPYFILE_EXCL);
  const copied = binding(destination);
  assert.equal(copied.sha256, original.sha256);
  assert.equal(copied.bytes, original.bytes);
  if (readonly) fs.chmodSync(destination, 0o444);
  return { original, copy: copied };
}
function assertBound(expected) {
  assert.deepEqual(binding(expected.path), expected, `Changed input: ${expected.path}`);
}
function freezeDirectory(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const target = path.join(dir, entry.name);
    if (entry.isDirectory()) freezeDirectory(target);
    else fs.chmodSync(target, 0o444);
  }
  fs.chmodSync(dir, 0o555);
}
function diff(left, right, pointer = '') {
  if (Object.is(left, right)) return [];
  if (Array.isArray(left) && Array.isArray(right)) {
    const result = [];
    for (let i = 0; i < Math.max(left.length, right.length); i++) {
      if (i >= left.length) result.push({ pointer: `${pointer}/${i}`, operation: 'add', after: right[i] });
      else if (i >= right.length) result.push({ pointer: `${pointer}/${i}`, operation: 'remove', before: left[i] });
      else result.push(...diff(left[i], right[i], `${pointer}/${i}`));
    }
    return result;
  }
  if (left && right && typeof left === 'object' && typeof right === 'object'
      && !Array.isArray(left) && !Array.isArray(right)) {
    const result = [];
    for (const key of [...new Set([...Object.keys(left), ...Object.keys(right)])].sort()) {
      const escaped = key.replaceAll('~', '~0').replaceAll('/', '~1');
      const child = `${pointer}/${escaped}`;
      if (!Object.hasOwn(left, key)) result.push({ pointer: child, operation: 'add', after: right[key] });
      else if (!Object.hasOwn(right, key)) result.push({ pointer: child, operation: 'remove', before: left[key] });
      else result.push(...diff(left[key], right[key], child));
    }
    return result;
  }
  return [{ pointer, operation: 'replace', before: left, after: right }];
}
function checkInputs(manifest) {
  for (const item of [...manifest.files, ...manifest.support]) {
    assertBound(item.original);
    assertBound(item.immutableBefore);
    assert.equal(fs.statSync(item.immutableBefore.path).mode & 0o222, 0);
  }
  for (const item of manifest.symbolicBindings) assertBound(item);
}
function inputs() {
  const manifest = readJSON(manifestPath);
  checkInputs(manifest);
  return manifest;
}
function pageFile(role, name, base = own) {
  return path.join(base, role, pageRel, name);
}
function exactMarkdown() {
  const original = fs.readFileSync(pageFile('artifacts', 'page.md', before), 'utf8');
  const current = fs.readFileSync(pageFile('artifacts', 'page.md'), 'utf8');
  assert.equal(original.split(oldHeader).length - 1, 1);
  assert.equal(current, original.replace(oldHeader, newHeader));
  assert.equal(current.split(oldHeader).length - 1, 0);
  const recovered = current.replace(newHeader, oldHeader);
  assert.equal(recovered, original);
  return {
    exactSingleHeaderReplacement: true,
    from: oldHeader,
    to: newHeader,
    inverseRecoveredSHA256: sha(Buffer.from(recovered)),
    originalSHA256: sha(Buffer.from(original)),
    originalBytes: Buffer.byteLength(original),
    currentBytes: Buffer.byteLength(current),
    inverseRecoversAllOriginalBytes: true,
    allBodyAndFrontmatterBytesUnchanged: true,
  };
}
function init() {
  assert.deepEqual(fs.readdirSync(own).sort(), ['identity-evidence.mjs']);
  const affectedPath = path.join(tmp, 'source165166-affected-review-01/report.json');
  const affected = readJSON(affectedPath);
  const authorPath = path.join(tmp, 'source165166-repair-01/report.json');
  assertBound(affected.bindings.authorReport);
  assert.equal(affected.bindings.authorReport.path, authorPath);
  const author = readJSON(authorPath);
  const page = affected.pages.find(item => item.physical === 165);
  assert.equal(affected.cumulativeAuthorRepairCountPerPage, 1);
  assert.equal(page.nativeReceipt.cumulativeAuthorRepairCount, 1);
  assert.equal(author.pages.find(item => item.physical === 165).cumulativeAuthorRepairCount, 1);
  assert.equal(affected.originalReviewStatus, 'revise');
  const files = page.files.map(item => {
    const original = item.current;
    assertBound(original);
    assert.equal(original.path, path.join(tmp, 'source165166-repair-01', item.role, pageRel, item.name));
    const frozen = clone(original.path, pageFile(item.role, item.name, before), true);
    const candidate = clone(original.path, pageFile(item.role, item.name));
    return {
      role: item.role, name: item.name, original,
      immutableBefore: frozen.copy, initialOwn: candidate.copy,
    };
  });
  assert.deepEqual(files.map(item => `${item.role}/${item.name}`).sort(),
    ['artifacts/audit.json', 'artifacts/page.json', 'artifacts/page.md', 'work/layout.json', 'work/page.png']);
  for (const role of ['artifacts', 'work']) {
    const expected = files.filter(item => item.role === role).map(item => item.name).sort();
    assert.deepEqual(fs.readdirSync(path.join(tmp, 'source165166-repair-01', role, pageRel)).sort(), expected);
  }
  const support = [
    ['affectedReview', affectedPath],
    ['priorAuthorReport', authorPath],
    ['originalSourceReview', affected.bindings.originalReview.path],
    ['FIRST0165', affected.bindings.originalFIRST.find(item => item.path.endsWith('FIRST-0165.md')).path],
    ['priorFinalize', page.nativeReceipt.path],
  ].map(([role, source]) => {
    const cloned = clone(source, path.join(before, 'evidence', `${role}${path.extname(source)}`), true);
    return { role, original: cloned.original, immutableBefore: cloned.copy };
  });
  assertBound(affected.bindings.originalReview);
  assertBound(affected.bindings.originalFIRST.find(item => item.path.endsWith('FIRST-0165.md')).current);
  assertBound({ path: page.nativeReceipt.path, sha256: page.nativeReceipt.sha256, bytes: page.nativeReceipt.bytes });
  const symbolicBindings = [
    ...['command.json', 'stdout.txt', 'stderr.txt'].map(name => path.join(tmp, 'g10-n46/assemble-source-01', name)),
    ...['p2c.py', 'blocks.py', 'layout.py', 'normalize.py', 'mathcheck.py', 'assemble.py']
      .map(name => path.join(toolRoot, 'tools', name)),
    path.join(toolRoot, 'profiles/soviet-cn.json'),
    path.join(toolRoot, 'SKILL.md'),
    path.join(tmp, 'g10-n41/artifacts/9-10g/pages/0142/page.md'),
    path.join(tmp, 'g10-n41/artifacts/9-10g/pages/0143/page.md'),
  ].map(binding);
  const assembly = readJSON(symbolicBindings[0].path);
  assert.equal(assembly.exitCode, 1);
  assert.ok(fs.readFileSync(symbolicBindings[1].path, 'utf8').includes('[36]'));
  assert.equal(readJSON(pageFile('artifacts', 'page.json')).blocks[7].label, '36*');
  assert.equal(readJSON(pageFile('artifacts', 'page.json')).meta.profile.sha256,
    binding(path.join(toolRoot, 'profiles/soviet-cn.json')).sha256);
  const manifest = {
    schema: 'STEMROBIN-188/n46-number36-identity-inputs@1',
    initializedUTC: new Date().toISOString(), cwd, ownRoot: own,
    files, support, symbolicBindings,
    workPathResolution: {
      suppliedOwnWorkDescription: 'ownwork0165/page.png/layout.json',
      resolvedOriginalWork: path.join(tmp, 'source165166-repair-01/work', pageRel),
      authority: 'Supplied affected independent review current-file bindings; no alternate input package used.',
    },
    counters: {
      priorAuthorRepairCount: 1, deltaAuthorRepairCount: 1,
      cumulativeAuthorRepairCount: 2, authorRepairRound: 2, counterReset: false,
      localFinalizeAttemptsExpected: 1,
      priorObservedFinalizeCalls: page.nativeReceipt.cumulativeObservedFinalizeCallsIncludingThis,
      cumulativeObservedFinalizeCallsExpected: page.nativeReceipt.cumulativeObservedFinalizeCallsIncludingThis + 1,
      unaffectedPhysical166AuthorRepairCount: 1,
    },
    sourceApproval: false,
  };
  writeJSON(manifestPath, manifest);
  freezeDirectory(before);
  checkInputs(manifest);
  console.log(JSON.stringify({ initialized: true, fullPageFilesCopied: files.length, readonlyBefore: true, counters: manifest.counters }));
}
function finalize() {
  const manifest = inputs();
  const markdown = exactMarkdown();
  for (const item of manifest.files.filter(item => item.name !== 'page.md')) assertBound(item.initialOwn);
  const command = path.join(toolRoot, '.venv/bin/python');
  const args = ['-B', path.join(toolRoot, 'tools/p2c.py'), 'finalize',
    '--book', '9-10g', '--page', '165', '--root', path.join(own, 'artifacts'),
    '--work', path.join(own, 'work')];
  const candidate = clone(pageFile('artifacts', 'page.md'), path.join(receiptDir, 'candidate.before-finalize.md'), true);
  const intent = {
    cwd, argv: [command, ...args], startedUTC: new Date().toISOString(),
    localFinalizeAttempt: 1, ...manifest.counters, markdown,
    candidate: candidate.original, candidateSnapshot: candidate.copy,
    automaticRetry: false, sourceApproval: false,
  };
  // Exclusive creation prevents this evidence runner from executing finalize twice.
  writeJSON(path.join(receiptDir, 'intent.json'), intent);
  const result = spawnSync(command, args, { cwd, maxBuffer: 4 * 1024 * 1024 });
  write(path.join(receiptDir, 'stdout.txt'), result.stdout ?? Buffer.alloc(0));
  write(path.join(receiptDir, 'stderr.txt'), result.stderr ?? Buffer.alloc(0));
  const receipt = {
    ...intent, finishedUTC: new Date().toISOString(),
    exitCode: result.status, signal: result.signal, executionError: result.error?.message ?? null,
    stdout: binding(path.join(receiptDir, 'stdout.txt')),
    stderr: binding(path.join(receiptDir, 'stderr.txt')),
    nativeAudit: readJSON(pageFile('artifacts', 'audit.json')),
    outputs: manifest.files.map(item => binding(pageFile(item.role, item.name))),
    nativePNGProcessingCalls: 1, modelImageLoads: 0,
    dependentStagesStop: result.status !== 0,
  };
  writeJSON(path.join(receiptDir, 'result.json'), receipt);
  console.log(JSON.stringify({ exitCode: receipt.exitCode, stdout: result.stdout?.toString(), stderr: result.stderr?.toString(), receipt: binding(path.join(receiptDir, 'result.json')) }));
  assert.equal(result.status, 0);
}
function report() {
  const manifest = inputs();
  const markdown = exactMarkdown();
  const receiptPath = path.join(receiptDir, 'result.json');
  const receipt = readJSON(receiptPath);
  assert.equal(receipt.exitCode, 0);
  assert.equal(receipt.localFinalizeAttempt, 1);
  const oldPage = readJSON(pageFile('artifacts', 'page.json', before));
  const currentPage = readJSON(pageFile('artifacts', 'page.json'));
  const fullObjectDiff = diff(oldPage, currentPage);
  assert.deepEqual(fullObjectDiff, [{ pointer: '/blocks/7/label', operation: 'replace', before: '36*', after: '36' }]);
  assert.deepEqual(oldPage.meta, currentPage.meta);
  assert.deepEqual(oldPage.blocks.map(item => item.lines), currentPage.blocks.map(item => item.lines));
  const audit = readJSON(pageFile('artifacts', 'audit.json'));
  assert.equal(audit.lines_printed, 24);
  assert.equal(audit.lines_md, 24);
  for (const key of ['errors', 'figures', 'normalizations', 'unknown_chars', 'katex_warnings', 'count_exclusions']) assert.deepEqual(audit[key], []);
  const files = manifest.files.map(item => {
    const current = binding(pageFile(item.role, item.name));
    const byteUnchanged = current.sha256 === item.original.sha256;
    if (!['page.md', 'page.json'].includes(item.name)) assert.ok(byteUnchanged);
    return { ...item, current, byteUnchanged, beforeMode: fs.statSync(item.immutableBefore.path).mode & 0o777 };
  });
  const support = Object.fromEntries(manifest.support.map(item => [item.role, item]));
  const affected = readJSON(support.affectedReview.immutableBefore.path);
  const originalReview = readJSON(support.originalSourceReview.immutableBefore.path);
  assert.equal(originalReview.status, 'revise');
  assert.deepEqual(affected.localHolds, originalReview.localHolds);
  const firstText = fs.readFileSync(support.FIRST0165.immutableBefore.path, 'utf8');
  const firstLine = firstText.split('\n').find(line => line.startsWith('15 36*.'));
  assert.ok(firstLine);
  const starNote = currentPage.meta.notes.find(item => item.block === 'p0165#8');
  const printedLine = currentPage.blocks[7].lines[0];
  assert.ok(printedLine.startsWith('36*. '));
  const n41Examples = manifest.symbolicBindings.filter(item => item.path.includes('/g10-n41/')).map(item => {
    const text = fs.readFileSync(item.path, 'utf8');
    const number = item.path.includes('/0142/') ? '395' : '399';
    const excerpt = text.slice(text.indexOf(`<!-- ex ${number} -->`)).split('\n').slice(0, 3).join('\n');
    assert.ok(excerpt.includes('*'));
    return { binding: item, numericHeader: `<!-- ex ${number} -->`, excerpt, excerptSHA256: sha(Buffer.from(excerpt)), symbolicOnly: true };
  });
  const assemblyBindings = manifest.symbolicBindings.filter(item => item.path.includes('/assemble-source-01/'));
  const actualFailedAssembly = {
    receiptBindings: assemblyBindings,
    commandReceipt: readJSON(assemblyBindings.find(item => item.path.endsWith('command.json')).path),
    stdout: fs.readFileSync(assemblyBindings.find(item => item.path.endsWith('stdout.txt')).path, 'utf8'),
    stderr: fs.readFileSync(assemblyBindings.find(item => item.path.endsWith('stderr.txt')).path, 'utf8'),
    originalExitCode: 1, status: 'failed-numeric-continuity',
    expectedExerciseCount: 6, missingNumericIdentity: 36,
    preservedSymbolically: true, assemblyRerunsByThisAuthor: 0,
    hugePackagesCopied: 0, postRepairAssemblyApproval: false,
  };
  const numericBefore = oldPage.blocks.filter(item => item.kind === 'ex').map(item => item.label);
  const numericAfter = currentPage.blocks.filter(item => item.kind === 'ex').map(item => item.label);
  assert.deepEqual(numericAfter, ['34', '35', '36', '37', '38', '39']);
  const counters = {
    ...manifest.counters, localFinalizeAttemptsActual: 1, independentReviewsByThisAuthor: 0,
    cumulativeObservedFinalizeCalls: manifest.counters.cumulativeObservedFinalizeCallsExpected,
    historicalFinalizeCountQualification: 'Two calls already bound by the supplied prior affected review, plus this one native finalize; no claim about uninspected history.',
  };
  const data = {
    schema: 'STEMROBIN-188/n46-number36-identity-author-repair@1',
    ticket: 'STEMROBIN-188', continuation: 'SAME188-6', book: '9-10g', lesson: 'geo910-c2-s1-n46',
    physical: 165, printed: 158, block: 'p0165#8', role: 'metadata-identity-repair-author-only',
    status: 'author-complete-pending-affected-independent-review',
    generatedUTC: new Date().toISOString(), cwd, ownRoot: own,
    ownArtifactRoot: path.join(own, 'artifacts'), ownWorkRoot: path.join(own, 'work'),
    scope: 'One numeric block-header identity only; no literal printed-star removal or source approval.',
    inputManifest: binding(manifestPath), workPathResolution: manifest.workPathResolution,
    files, counters, repairRound: 2, cumulativeAuthorRepairCountPerPage: { '165': 2, '166': 1 },
    counterReset: false, sourceApproval: false, independentReviewPerformed: false,
    wholePage: {
      fullObjectDiff, unexpectedDiffs: [], exactLabelOnly: true, markdown,
      metaUnchanged: true, allBodyLinesUnchanged: true,
      allOtherBlockFieldsUnchanged: true, auditAndWorkByteIdentical: true,
      originalFullObject: oldPage, currentFullObject: currentPage,
      originalExerciseLabels: numericBefore, currentExerciseLabels: numericAfter,
      pageLocalNumericIdentityCheckOnly: true, notAnAssemblyReceipt: true,
    },
    printed36StarSupport: {
      FIRST0165: support.FIRST0165,
      firstPrintedRow15: { text: firstLine, sha256: sha(Buffer.from(firstLine)) },
      originalSourceReview: support.originalSourceReview,
      literalBody: { pointer: '/blocks/7/lines/0', text: printedLine, sha256: sha(Buffer.from(printedLine)), unchanged: true },
      explicitOriginalMetaNote: { pointer: '/meta/notes/4', content: starNote, sha256: sha(Buffer.from(JSON.stringify(starNote))), unchanged: true },
      sourcePNG: files.find(item => item.name === 'page.png'),
      newImageObservation: false,
    },
    stableNumericHeaderSupport: {
      skillBinding: manifest.symbolicBindings.find(item => item.path.endsWith('/SKILL.md')),
      nativeBlocksBinding: manifest.symbolicBindings.find(item => item.path.endsWith('/blocks.py')),
      nativeAssemblyBinding: manifest.symbolicBindings.find(item => item.path.endsWith('/assemble.py')),
      nativeContract: 'blocks.parse retains the full header label; assembly uses that label as source_number and admits only digit-only source_number to numeric continuity. Existing N41 keeps printed stars in bodies with numeric headers.',
      n41Examples, assemblyNotExecuted: true,
    },
    priorRepair: {
      authorReport: support.priorAuthorReport,
      priorNativeFinalize: support.priorFinalize,
      affectedIndependentReview: support.affectedReview,
      priorCumulativeAuthorRepairCount: 1,
      page165ResolvedLiteral: affected.pages.find(item => item.physical === 165).finding,
      page166ResolvedLiteralInheritedOnly: affected.pages.find(item => item.physical === 166).finding,
      currentPage165CommaRepairStillPresent: currentPage.blocks[9].lines[0].includes('$O$，'),
      page166FilesNotCopiedOrModifiedByThisAuthor: true,
    },
    inheritedAffectedReviewExact: {
      status: affected.status, dimensions: affected.dimensions, extent: affected.extent,
      originalReviewStatus: affected.originalReviewStatus,
      originalReviewNotRewritten: affected.originalReviewNotRewritten,
      repairRound: affected.repairRound,
      cumulativeAuthorRepairCountPerPage: affected.cumulativeAuthorRepairCountPerPage,
      counterReset: affected.counterReset,
      inheritedVerdictsExactUnmodified: affected.inheritedVerdictsExactUnmodified,
      localHolds: affected.localHolds, localHoldsPreserved: affected.localHoldsPreserved,
      notApproved: affected.notApproved, originalNotApprovedVerbatim: affected.originalNotApprovedVerbatim,
      inheritanceQualification: affected.inheritanceQualification,
      priorBlockingClauseDisposition: affected.priorBlockingClauseDisposition,
    },
    originalReviewExact: {
      status: originalReview.status, dimensions: originalReview.dimensions,
      localHolds: originalReview.localHolds, findings: originalReview.findings,
      notApproved: originalReview.notApproved,
    },
    inheritanceQualification: 'All inherited PASS/HOLD records are verbatim historical evidence, not rerun or upgraded. Historical p0165#8 label36* is intentionally preserved inside inherited evidence; the sole new delta is /blocks/7/label ->36. Previously resolved literal repairs remain intact. The new candidate has no independent-review verdict.',
    gateReceipts: {
      nativeFinalize: { binding: binding(receiptPath), content: receipt },
      actualFailedAssembly,
      affectedIndependentReview: { status: 'pending', receipt: null, performedByAuthor: false },
      sourceApproval: false, chapterReviewApproval: false, publicationApproval: false,
    },
    zeroImageLedger: {
      modelImageLoads: 0, imageViews: 0, imageToolCalls: 0, screenshots: 0,
      newRenders: 0, newCrops: 0, newSourceInventories: 0,
      byteOnlyPNGCloneAndHashPages: [165],
      nativeFinalizePNGProcessing: { calls: 1, page: 165, disclosure: 'Required unchanged native finalize opens its own copied page.png for an ink mask and row count. No image is loaded into model context or visually reinterpreted.' },
    },
    constraintsObserved: {
      writeOnlyOwnRoot: true, originalsAndReviewsBytePreserved: true,
      manualContentEditOnlyOwnPageMarkdown: true, noCoreEdits: true,
      noDB: true, noEnvReadOrWrite: true, noDependenciesChanged: true,
      noModelServices: true, noGitWrites: true, noSelfApproval: true,
      noIndependentApproval: true, noAssemblyExecution: true, noModernEdits: true,
      noMessagesToOtherChatsOrBackend: true, noNetwork: true,
    },
  };
  assert.ok(data.priorRepair.currentPage165CommaRepairStillPresent);
  writeJSON(path.join(own, 'report.json'), data);
  const lines = [
    '# N46 Number 36 Identity Repair',
    '',
    `Status: **${data.status}**. AUTHOR only; source approval: false.`,
    '',
    '- Only manual content delta: `<!-- ex 36* -->` -> `<!-- ex 36 -->` at `p0165#8`.',
    '- Whole-page structured diff: `/blocks/7/label`, `"36*"` -> `"36"`; no other fields differ.',
    '- Printed body `36*. ...`, all body rows, frontmatter, notes, audit, layout and PNG bytes remain unchanged.',
    '- Native p2c finalize165 ran exactly once: exit 0, 24/24 rows, zero figures, zero normalizations, zero errors.',
    '- Prior author repair 1 + this delta 1 = cumulative 2 on physical165; physical166 remains 1. No reset.',
    '- Prior observed finalize calls 2 + this call 1 = 3; no uninspected-history claim.',
    '- Original source REVISE and all four localHOLDs are inherited exactly. Historical PASS records remain historical.',
    '- Actual g10-n46/assemble-source-01 exit1 receipt is hash-bound symbolically; six exercises but missing numeric36.',
    '- No assembly rerun, package copy, image view, source approval, independent approval or publication.',
    '',
    '## File Bindings',
    '',
    ...files.flatMap(item => [
      `### ${item.role}/${item.name}`,
      `Original: ${item.original.path}`,
      `Original SHA256: ${item.original.sha256} (${item.original.bytes} bytes)`,
      `Read-only before: ${item.immutableBefore.path}`,
      `Current: ${item.current.path}`,
      `Current SHA256: ${item.current.sha256} (${item.current.bytes} bytes)`,
      `Byte unchanged: ${item.byteUnchanged}`,
      '',
    ]),
    '## Printed-Star Support',
    '',
    `FIRST-0165: ${support.FIRST0165.original.path}`,
    `SHA256: ${support.FIRST0165.original.sha256}`,
    `Printed row15: ${firstLine}`,
    `Source46 review: ${support.originalSourceReview.original.path}`,
    `SHA256: ${support.originalSourceReview.original.sha256}`,
    `Original p0165#8 printing-oddity note: ${starNote.text}`,
    `Inverse header replacement recovers original MD SHA256: ${markdown.inverseRecoveredSHA256}`,
    '',
    '## Gate Receipts',
    '',
    `Finalize receipt: ${receiptPath}`,
    `Finalize receipt SHA256: ${binding(receiptPath).sha256}`,
    ...assemblyBindings.map(item => `Failed assembly receipt: ${item.path}\nSHA256: ${item.sha256}`),
    'Affected independent review: pending. No source approval.',
    '',
    '## Inherited Holds',
    '',
    ...affected.localHolds.map(item => `- ${item.id}: ${item.status}. ${item.reason}`),
    '',
    'Full objects, exhaustive diff, counter lineage, inherited exact records, all support bindings and captured gate outputs are in report.json.',
    '',
  ];
  write(path.join(own, 'report.md'), lines.join('\n'));
  writeJSON(path.join(own, 'report-hashes.json'), {
    generatedUTC: new Date().toISOString(),
    reports: ['report.json', 'report.md'].map(name => binding(path.join(own, name))),
    evidenceScript: binding(path.join(own, 'identity-evidence.mjs')),
    inputManifest: binding(manifestPath),
  });
  console.log(JSON.stringify({ status: data.status, fullObjectDiff, rows: [audit.lines_printed, audit.lines_md], counters, reports: ['report.json', 'report.md'].map(name => binding(path.join(own, name))) }));
}
const phase = process.argv[2];
assert.ok(['init', 'finalize', 'report'].includes(phase), 'Expected init, finalize, or report');
({ init, finalize, report })[phase]();
