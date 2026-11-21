import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const root = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), root);
const base = path.join(root, '.tmp/stemrobin-184-six/source164165-native-nov21');
const stages = path.join(root, '.tmp/stemrobin-184-six/stages');
const preparation = JSON.parse(fs.readFileSync(path.join(base, 'preparation.json'), 'utf8'));
const missingFolio = 'printed_page 未填（页码承载溯源，不能空）';
const names = [
  'source164-first-native-nov21', 'source164-folio-recovery-native-nov21',
  'source165-first-native-nov21', 'source165-folio-recovery-native-nov21',
];
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
const mode = stat => (stat.mode & 0o777).toString(8).padStart(4, '0');
const read = file => fs.readFileSync(file, 'utf8');
const json = file => JSON.parse(read(file));
function write(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, typeof value === 'string' ? value : JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
}
function record(file) {
  const stat = fs.lstatSync(file);
  if (stat.isSymbolicLink()) {
    return { path: file, kind: 'symlink', target: fs.readlinkSync(file), mode: mode(stat), resolved: record(fs.realpathSync(file)) };
  }
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length, sha256: hash(bytes), mode: mode(stat) };
}
function parts(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n\n([\s\S]*)$/);
  assert(match, 'Expected JSON frontmatter and exact body');
  return { metadata: JSON.parse(match[1]), body: match[2] };
}
function pageSpec(page) {
  const entry = preparation.pages.find(item => item.page === page);
  assert(entry);
  return entry;
}
function audit(page, phase) {
  const stage = `source${page}-${phase === 'first' ? 'first' : 'folio-recovery'}-native-nov21`;
  const receiptPath = path.join(stages, stage + '.receipt.json');
  const receipt = json(receiptPath);
  const directory = path.join(base, phase, 'native/9c/pages', String(page).padStart(4, '0'));
  const auditPath = path.join(directory, 'audit.json');
  const outcome = fs.existsSync(auditPath) ? json(auditPath) : null;
  return {
    stage, receiptPath, receipt, auditPath, audit: outcome,
    stdout: read(path.join(stages, stage + '.stdout')),
    stderr: read(path.join(stages, stage + '.stderr')),
    recoveryAuthorized: phase === 'first' && receipt.exitCode === 1 &&
      receipt.signal === null && receipt.error === null &&
      outcome?.page === page && outcome.errors?.length === 1 &&
      outcome.errors[0] === missingFolio,
  };
}
function ownedFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? ownedFiles(file) : [file];
  });
}
function stageFiles() {
  return names.flatMap(name => ['stdout', 'stderr', 'receipt.json'].map(suffix =>
    path.join(stages, name + '.' + suffix))).filter(file => fs.existsSync(file));
}
const [action, pageText, phase] = process.argv.slice(2);
if (action === 'init') {
  const inputs = [
    path.join(base, 'preparation.json'),
    path.join(root, '.tmp/stemrobin-184-six/run-stage.mjs'),
    ...['p2c.py', 'blocks.py', 'layout.py', 'normalize.py', 'mathcheck.py', 'production.py'].map(name =>
      path.join(root, '.claude/skills/ld-s10y-lesson/tools', name)),
    path.join(root, '.claude/skills/ld-s10y-lesson/profiles/soviet-cn.json'),
    path.join(root, '.claude/skills/ld-s10y-lesson/references/production-resume.md'),
    path.join(root, '.agents/skills/ld-s10y-image/SKILL.md'),
  ];
  for (const entry of preparation.pages) {
    const original = fs.readFileSync(entry.md.path);
    assert.equal(hash(original), entry.md.sha256);
    const parsed = parts(original.toString('utf8'));
    assert.equal(parsed.metadata.printed_page, null);
    assert.equal(parsed.body, read(entry.body.path));
    assert.equal(hash(fs.readFileSync(entry.body.path)), entry.body.sha256);
    assert.deepEqual(parsed.metadata, parts(read(entry.metadata.path)).metadata);
    const snapshot = path.join(base, 'first/inputs', `${entry.page}.page.md`);
    write(snapshot, original.toString('utf8'));
    fs.chmodSync(snapshot, 0o444);
    inputs.push(entry.body.path, entry.metadata.path, entry.source.path,
      path.join(entry.work, '9c/pages', String(entry.page).padStart(4, '0'), 'page.png'));
    const pdf = path.join(root, 'ssot-resources/soviet10year-textbooks/sources');
    const manifestPath = path.join(pdf, 'manifest.json');
    const manifest = json(manifestPath);
    const catalog = manifest.catalogs.find(item => item.book === '9c');
    const pdfRecord = manifest.pdfs.find(item => item.book === catalog.sourcePdf);
    const pdfRoot = path.isAbsolute(manifest.pdfRoot) ? manifest.pdfRoot :
      [path.join(root, manifest.pdfRoot), path.join(pdf, manifest.pdfRoot)].find(file => fs.existsSync(file));
    const pdfPath = path.join(pdfRoot, pdfRecord.file);
    inputs.push(manifestPath, pdfPath);
    assert.equal(hash(fs.readFileSync(pdfPath)), parsed.metadata.source.pdf_sha256);
  }
  write(path.join(base, 'executor-inputs.json'), {
    at: new Date().toISOString(), cwd: root, inputs: [...new Set(inputs)].map(record),
    firstInputCopies: preparation.pages.map(entry => record(path.join(base, 'first/inputs', `${entry.page}.page.md`))),
    instrumentation: 'NONE; exact requested command retained; actual Image.open calls UNKNOWN',
  });
  console.log('Inputs captured without raster loads; original metadata and frozen bodies byte-bound.');
} else if (action === 'assess') {
  const outcome = audit(Number(pageText), phase);
  const nativeDirectory = path.dirname(outcome.auditPath);
  const files = ownedFiles(nativeDirectory).filter(file => !fs.lstatSync(file).isSymbolicLink());
  for (const file of [...files, ...stageFiles().filter(file => path.basename(file).startsWith(outcome.stage + '.'))]) {
    fs.chmodSync(file, 0o444);
  }
  console.log(JSON.stringify({
    stage: outcome.stage, exitCode: outcome.receipt.exitCode, signal: outcome.receipt.signal,
    error: outcome.receipt.error, errors: outcome.audit?.errors ?? null,
    recoveryAuthorized: outcome.recoveryAuthorized, stdout: outcome.stdout, stderr: outcome.stderr,
    outputs: files.map(record),
  }, null, 2));
} else if (action === 'recover') {
  const page = Number(pageText);
  const outcome = audit(page, 'first');
  assert(outcome.recoveryAuthorized, 'Recovery refused: not sole exact missing printed_page error');
  const entry = pageSpec(page);
  const folio = page === 164 ? 157 : 158;
  const freezePath = path.join(root, '.tmp/stemrobin-184-six/source164165-source', `${String(page).padStart(4, '0')}.freeze.json`);
  const freeze = json(freezePath);
  const candidates = [];
  function findFolio(value, keys = []) {
    if (value && typeof value === 'object') {
      for (const [key, item] of Object.entries(value)) findFolio(item, [...keys, key]);
    } else if (keys.some(key => /folio|printed.?page/i.test(key))) {
      candidates.push({ field: keys.join('.'), value });
    }
  }
  findFolio(freeze);
  assert(candidates.some(item => item.value === folio || item.value === String(folio)), 'Frozen folio not found');
  const snapshot = read(path.join(base, 'first/inputs', `${page}.page.md`));
  const original = parts(snapshot);
  assert.equal(original.body, read(entry.body.path));
  const replacement = snapshot.replace(/"printed_page": null/, `"printed_page": ${folio}`);
  const recovered = parts(replacement);
  assert.deepEqual(recovered.metadata, { ...original.metadata, printed_page: folio });
  assert.equal(recovered.body, original.body);
  const input = path.join(base, 'recovery/inputs', `${page}.page.md`);
  const native = path.join(base, 'recovery/native/9c/pages', String(page).padStart(4, '0'), 'page.md');
  const work = path.join(base, 'recovery/work/9c/pages', String(page).padStart(4, '0'), 'page.png');
  write(input, replacement);
  fs.chmodSync(input, 0o444);
  write(native, replacement);
  fs.mkdirSync(path.dirname(work), { recursive: true });
  fs.symlinkSync(entry.source.path, work);
  write(path.join(base, 'recovery', `${page}.metadata-change.json`), {
    page, change: { field: 'printed_page', before: null, after: folio },
    unchangedBody: record(entry.body.path), original: record(path.join(base, 'first/inputs', `${page}.page.md`)),
    recoveryInput: record(input), nativeBeforeExecution: record(native), work: record(work),
    citation: { freeze: record(freezePath), retainedFolioFields: candidates },
    authorization: 'Direct human instruction; sole exact missing printed_page FIRST audit error',
    noContentOrApprovalChange: true,
  });
  console.log(JSON.stringify({ page, native, work, folio, retainedFolioFields: candidates }, null, 2));
} else if (action === 'seal') {
  const captured = json(path.join(base, 'executor-inputs.json'));
  for (const input of captured.inputs) assert.deepEqual(record(input.path), input, `Input changed: ${input.path}`);
  const actual = names.filter(name => fs.existsSync(path.join(stages, name + '.receipt.json')));
  assert(actual.length <= 4);
  const outcomes = actual.map(name => {
    const page = Number(name.match(/^source(\d+)-/)[1]);
    return audit(page, name.includes('folio-recovery') ? 'recovery' : 'first');
  });
  for (let index = 0; index < outcomes.length; index++) {
    const item = outcomes[index];
    const page = Number(item.stage.match(/^source(\d+)-/)[1]);
    const phase = item.stage.includes('folio-recovery') ? 'recovery' : 'first';
    assert.equal(item.receipt.cwd, root);
    assert.equal(item.receipt.command, '.claude/skills/ld-s10y-lesson/.venv/bin/python');
    assert.deepEqual(item.receipt.args, [
      '-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'finalize', '--book', '9c',
      '--page', String(page), '--root', path.join(base, phase, 'native'),
      '--work', path.join(base, phase, 'work'),
    ]);
    for (const stream of ['stdout', 'stderr']) {
      assert.equal(hash(Buffer.from(item[stream])), item.receipt.outputs[stream].sha256);
      assert.equal(Buffer.byteLength(item[stream]), item.receipt.outputs[stream].bytes);
    }
    if (index) assert(outcomes[index - 1].receipt.ended <= item.receipt.started, 'Stages not sequential');
    if (phase === 'recovery') {
      assert(audit(page, 'first').recoveryAuthorized);
      const first = json(path.join(base, 'first/native/9c/pages', String(page).padStart(4, '0'), 'page.json'));
      const recovered = json(path.join(base, 'recovery/native/9c/pages', String(page).padStart(4, '0'), 'page.json'));
      assert.deepEqual(recovered.blocks, first.blocks);
      assert.deepEqual(recovered.meta, { ...first.meta, printed_page: page === 164 ? 157 : 158 });
    }
  }
  const pages = preparation.pages.map(entry => {
    const runs = outcomes.filter(item => item.audit?.page === entry.page ||
      item.stage.startsWith(`source${entry.page}-`));
    return {
      page: entry.page, nativeExecutions: runs.length, actualImageOpenCalls: 'UNKNOWN',
      charge: { initialKnown: 4, executionCharges: runs.length, knownLowerBound: 4 + runs.length,
        actualDecodeTotal: 'UNKNOWN; not instrumented', noChecksOrImageViews: true },
      statuses: runs.map(item => ({ stage: item.stage, exitCode: item.receipt.exitCode, errors: item.audit?.errors ?? null })),
      metadataChange: fs.existsSync(path.join(base, 'recovery', `${entry.page}.metadata-change.json`)) ?
        path.join(base, 'recovery', `${entry.page}.metadata-change.json`) : null,
    };
  });
  const resultPath = path.join(base, 'result.json');
  const manifestPath = path.join(base, 'manifest.json');
  const changedPaths = [...ownedFiles(base).filter(file =>
    path.basename(file).startsWith('executor') ||
    (file.includes('/first/') && !file.includes('/first/work/')) || file.includes('/recovery/')),
    ...stageFiles(), resultPath, manifestPath];
  const result = {
    at: new Date().toISOString(), scope: 'STEMROBIN-184/184-6 technical FIRST native164/165 only',
    executionComplete: true, intake: 'OPEN_PENDING_PARENT_FULL_INTAKE; not closed',
    nativeExecutions: outcomes.length, pages,
    stages: outcomes.map(item => ({
      stage: item.stage, receipt: item.receiptPath, cwd: item.receipt.cwd,
      command: item.receipt.command, args: item.receipt.args,
      exitCode: item.receipt.exitCode, signal: item.receipt.signal, error: item.receipt.error,
      audit: item.auditPath, auditErrorsFullText: item.audit?.errors ?? null,
      stdoutFullText: item.stdout, stderrFullText: item.stderr,
    })),
    budget: {
      newTechnicalExecutionCharge: outcomes.length, max8: outcomes.length <= 8,
      actualImageOpenCalls: 'UNKNOWN; no instrumentation; no additional raster checks',
      currentContextImages: 0, parent: 'PERMANENT24/24; zero executor-returned images',
      historical162163: 'technical4/8; known7/page UNCHANGED',
    },
    original13HoldsPreserved: preparation.originalHolds,
    noSourceMathCourseApproval: true, sourceAuthorPackage: 'ALREADY_FULLY_CONSUMED_CLOSED; not replayed',
    n44: 'NOT_REPLAYED', n45: 'OPEN_NOT_COMPLETE', source166: 'NOT_PREFETCHED',
    seals: 'Owned text originals and execution evidence 0444; source originals unchanged',
    sealDiagnostic: {
      initialAttempts: 'Two text size guards failed before any result/manifest write; no native rerun',
      stderrFullTextPaths: [1, 2].map(attempt => path.join(base, `executor-seal-attempt${attempt}.stderr.txt`)),
      resolution: 'Compact JSON; full absolute changed-file inventory retained once in manifest',
    },
    inputOutputHashesAndModes: manifestPath,
    changedAbsolutePathsManifest: { path: manifestPath, field: 'ownedTextFilesAndSymlinks', selfExcludedManifestAlsoCreated: true },
  };
  const resultText = JSON.stringify(result) + '\n';
  assert(Buffer.byteLength(resultText) <= 12000, 'Result exceeds 12000 bytes');
  write(resultPath, resultText);
  const owned = changedPaths.filter(file => file !== manifestPath);
  for (const file of owned) if (!fs.lstatSync(file).isSymbolicLink()) fs.chmodSync(file, 0o444);
  const additionalInputs = pages.filter(item => item.metadataChange).map(item =>
    json(item.metadataChange).citation.freeze);
  write(manifestPath, {
    at: new Date().toISOString(), selfExcluded: manifestPath, cwd: root,
    inputHashesModesUnchanged: captured.inputs, recoveryFolioFreezeInputs: additionalInputs,
    ownedTextFilesAndSymlinks: owned.map(record),
    firstInputsPreExecution: captured.firstInputCopies,
    preparationFirstInputsPreExecution: preparation.pages.map(entry => entry.md),
    bytesOnlyHashing: true, extraRasterLoads: 0,
  });
  fs.chmodSync(manifestPath, 0o444);
  console.log(resultText);
  console.log(JSON.stringify({ result: record(resultPath), manifest: record(manifestPath) }, null, 2));
} else {
  throw new Error('Use init, assess PAGE first|recovery, recover PAGE, or seal');
}
