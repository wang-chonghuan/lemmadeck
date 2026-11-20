import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const cwd = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
if (process.cwd() !== cwd) throw new Error('Wrong cwd');
const root = path.join(cwd, '.intentfold/tickets/STEMROBIN-188/tmp/n47-choice-display-source191192-review-01');
const manifestPath = path.join(cwd, '.intentfold/tickets/STEMROBIN-188/tmp/n47-choice-display-source191192-review-inputs-01/manifest.json');
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const write = (name, value) => {
  const target = path.join(root, name);
  if (fs.existsSync(target)) throw new Error(`Refusing overwrite: ${target}`);
  fs.writeFileSync(target, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
};
const [mode, phase] = process.argv.slice(2);
if (mode === 'bindings') {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const previous = phase === 'after' ? JSON.parse(fs.readFileSync(path.join(root, 'before-bindings.json'), 'utf8')) : null;
  const bindings = manifest.bindings.map(binding => {
    const actual = fs.existsSync(binding.path) ? sha(binding.path) : null;
    return { ...binding, actualSha256: actual, matches: actual === binding.sha256 };
  });
  const manifestSha256 = sha(manifestPath);
  const result = {
    phase, cwd, manifest: { path: manifestPath, sha256: manifestSha256 },
    bindingCount: bindings.length, allMatch: bindings.every(binding => binding.matches),
    unchangedSinceBefore: previous ? manifestSha256 === previous.manifest.sha256 &&
      bindings.every((binding, i) => binding.path === previous.bindings[i]?.path &&
        binding.actualSha256 === previous.bindings[i]?.actualSha256) : null,
    bindings
  };
  write(`${phase}-bindings.json`, result);
  console.log(JSON.stringify({ phase, bindingCount: result.bindingCount, allMatch: result.allMatch,
    unchangedSinceBefore: result.unchangedSinceBefore, manifestSha256,
    failures: bindings.filter(binding => !binding.matches) }, null, 2));
  if (!result.allMatch || (previous && !result.unchangedSinceBefore)) process.exitCode = 1;
} else if (mode === 'supplementary') {
  const base = path.join(cwd, '.intentfold/tickets/STEMROBIN-188/tmp');
  const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
  const main = read(manifestPath);
  const known = new Map(main.bindings.map(binding => [binding.path, binding.sha256]));
  const reviewPath = path.join(base, 'n48-fig26-source185186-review-01/source-review.json');
  const review = read(reviewPath);
  const prior186 = review.pages.find(page => page.page === 186);
  const pairsPath = path.join(base, 'source186-wording-repair-01/before-bindings.json');
  const pairs = read(pairsPath);
  const refs = new Map();
  const add = binding => {
    if (!known.has(binding.path)) refs.set(binding.path, binding);
  };
  add(prior186.sourceInventory);
  for (const pair of pairs) {
    add(pair.original);
    add({ ...pair.copied, sha256: known.get(pair.copied.path) || pair.copied.sha256 });
  }
  for (const suffix of ['before-bindings.json', 'repair-scope.json', 'finalize-once/stdout.txt',
    'finalize-once/stderr.txt', 'finalize-once/started.json']) {
    const file = path.join(base, 'source186-wording-repair-01', suffix);
    add({ path: file, sha256: sha(file), expectation: 'observed-at-supplementary-before' });
  }
  const previous = phase === 'after' ? read(path.join(root, 'supplementary-before-bindings.json')) : null;
  const bindings = [...refs.values()].map(binding => {
    const prior = previous?.bindings.find(item => item.path === binding.path);
    const expected = prior?.sha256 || binding.sha256;
    const actual = sha(binding.path);
    return { ...binding, sha256: expected, actualSha256: actual, matches: actual === expected };
  });
  const result = { phase, cwd, scope: 'source186 affected-only supplemental text and byte bindings; no image payloads',
    bindingCount: bindings.length, allMatch: bindings.every(binding => binding.matches),
    unchangedSinceBefore: previous ? bindings.length === previous.bindings.length &&
      bindings.every(binding => binding.actualSha256 === previous.bindings.find(item => item.path === binding.path)?.actualSha256) : null,
    bindings };
  write(`supplementary-${phase}-bindings.json`, result);
  console.log(JSON.stringify({ phase, supplementaryBindingCount: bindings.length, allMatch: result.allMatch,
    unchangedSinceBefore: result.unchangedSinceBefore, failures: bindings.filter(binding => !binding.matches) }, null, 2));
  if (!result.allMatch || (previous && !result.unchangedSinceBefore)) process.exitCode = 1;
} else if (mode === 'affected186') {
  const base = path.join(cwd, '.intentfold/tickets/STEMROBIN-188/tmp');
  const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
  const oldDir = path.join(base, 'source185186-author/artifacts/9-10g/pages/0186');
  const newDir = path.join(base, 'source186-wording-repair-01/artifacts/9-10g/pages/0186');
  const oldMD = fs.readFileSync(path.join(oldDir, 'page.md'), 'utf8');
  const newMD = fs.readFileSync(path.join(newDir, 'page.md'), 'utf8');
  const oldJSON = read(path.join(oldDir, 'page.json'));
  const newJSON = read(path.join(newDir, 'page.json'));
  const firstPath = path.join(base, 'n48-fig26-source185186-review-01/source186-inventory.FIRST.json');
  const first = read(firstPath);
  const priorReviewPath = path.join(base, 'n48-fig26-source185186-review-01/source-review.json');
  const prior = read(priorReviewPath).pages.find(page => page.page === 186);
  const resultPath = path.join(base, 'source186-wording-repair-01/result.json');
  const receiptPath = path.join(base, 'source186-wording-repair-01/finalize-once/command.json');
  const repair = read(resultPath);
  const receipt = read(receiptPath);
  const audit = read(path.join(newDir, 'audit.json'));
  const before = '如果棱锥的底面是正多边形, 且顶点的射影是这个多';
  const after = '如果棱锥的底面是正多边形, 并且顶点的射影是这个多';
  const oldOccurrenceCount = oldMD.split(before).length - 1;
  const exactOneCharacterMDChange = oldOccurrenceCount === 1 && newMD === oldMD.replace(before, after);
  const changedBlocks = oldJSON.blocks.map((block, i) => JSON.stringify(block) !== JSON.stringify(newJSON.blocks[i]) ? i : null)
    .filter(i => i !== null);
  const expectedJSON = structuredClone(oldJSON);
  expectedJSON.blocks[10].lines[0] = after;
  const exactOneCharacterJSONChange = JSON.stringify(expectedJSON) === JSON.stringify(newJSON);
  const pairs = read(path.join(base, 'source186-wording-repair-01/before-bindings.json'))
    .filter(pair => !['page.md', 'page.json'].includes(path.basename(pair.original.path)))
    .map(pair => ({ original: { path: pair.original.path, sha256: sha(pair.original.path) },
      repaired: { path: pair.copied.path, sha256: sha(pair.copied.path) },
      matchesHistoricalHash: sha(pair.original.path) === pair.original.sha256,
      byteIdentical: sha(pair.original.path) === sha(pair.copied.path) }));
  const ref = file => ({ path: file, sha256: sha(file) });
  const independentWord = first.readingOrder.find(item => item.id === 'regular-pyramid');
  const result = {
    scope: 'p0186#11 only', status: 'pass', originalMD: ref(path.join(oldDir, 'page.md')),
    repairedMD: ref(path.join(newDir, 'page.md')), originalJSON: ref(path.join(oldDir, 'page.json')),
    repairedJSON: ref(path.join(newDir, 'page.json')), priorIndependentFIRST: ref(firstPath),
    priorIndependentReview: ref(priorReviewPath), recordedIndependentPixelWord: independentWord,
    originalReadableContentStatus: prior.readableContentStatus,
    originalAffectedStatus: prior.comparisons.find(item => item.ref === 'p0186#11').status,
    before, after, insertedCharacter: '并', insertedCodePoint: 'U+5E76',
    unicodeCodePointDelta: [...newMD].length - [...oldMD].length,
    utf8ByteDelta: Buffer.byteLength(newMD) - Buffer.byteLength(oldMD),
    exactOneCharacterMDChange, exactOneCharacterJSONChange,
    originalBlockCount: oldJSON.blocks.length, repairedBlockCount: newJSON.blocks.length,
    changedBlockRefs: changedBlocks.map(index => `p0186#${index + 1}`),
    other11BlocksIdentical: changedBlocks.length === 1 && changedBlocks[0] === 10 &&
      oldJSON.blocks.length === newJSON.blocks.length,
    metadataAndSourcesIdentical: JSON.stringify(oldJSON.meta) === JSON.stringify(newJSON.meta),
    unchangedBytePairs: pairs,
    nativeReceipt: ref(receiptPath), nativeExitCode: receipt.exitCode,
    nativeAudit: ref(path.join(newDir, 'audit.json')),
    nativeCountsReused: { printed: audit.lines_printed, md: audit.lines_md, errors: audit.errors, rerun: false },
    repairResult: ref(resultPath), sourceContentRepairBudget: { used: repair.cumulativeSourceContentRepairs, limit: 1 },
    newContentRepairsHere: 0, newImageLoads: 0, source185HoldPreserved: true,
    original186FailPreservedInHistory: true, allInkHoldsPreserved: true, wholePageApproved: false
  };
  const checksPass = exactOneCharacterMDChange && exactOneCharacterJSONChange && result.other11BlocksIdentical &&
    result.metadataAndSourcesIdentical && pairs.every(pair => pair.matchesHistoricalHash && pair.byteIdentical) &&
    independentWord.text.includes('并且顶点的射影') &&
    sha(firstPath) === prior.sourceInventory.sha256 && receipt.exitCode === 0 &&
    audit.lines_printed === 15 && audit.lines_md === 15 && audit.errors.length === 0 &&
    repair.cumulativeSourceContentRepairs === 1;
  result.status = checksPass ? 'pass' : 'blocked';
  write('source186-change-evidence.json', result);
  console.log(JSON.stringify(result, null, 2));
  if (!checksPass) process.exitCode = 1;
} else if (mode === 'index') {
  const collect = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(dir, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Unexpected symlink: ${file}`);
    return entry.isDirectory() ? collect(file) : [file];
  });
  const files = collect(root).filter(file => !['output-index.json', 'output-index.sha256'].includes(path.basename(file)))
    .sort().map(file => ({ path: file, sha256: sha(file), bytes: fs.statSync(file).size }));
  write('output-index.json', { status: 'complete-scoped-review-awaiting-parent-collection', cwd, root,
    excludes: ['output-index.json', 'output-index.sha256'], outputs: files });
  const digest = sha(path.join(root, 'output-index.json'));
  fs.writeFileSync(path.join(root, 'output-index.sha256'), `${digest}  output-index.json\n`, { flag: 'wx' });
  console.log(JSON.stringify({ index: path.join(root, 'output-index.json'), sha256: digest,
    externalSha: path.join(root, 'output-index.sha256'), outputs: files.length }, null, 2));
} else {
  throw new Error('Expected bindings before|after or index');
}
