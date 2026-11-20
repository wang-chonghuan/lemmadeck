import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const tmp = dirname(root);
const phase = process.argv[2];
if (!['before', 'after'].includes(phase)) throw new Error('Expected before or after');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const readJson = path => JSON.parse(readFileSync(path, 'utf8'));
const intakePath = join(tmp, 'source222223-FIRST-review-inputs-01/blind-intake.json');
const intake = readJson(intakePath);
const manifestPath = intake.afterAllOriginalFIRSTsSealed.path;
const supplementPath = join(tmp, 'source222223-FIRST-review-inputs-01/after-FIRST-source220-affected-supplement.json');
const supplement = readJson(supplementPath);
const groups = [
  { id: 'source222223', path: manifestPath, expectedCount: 33, expectedSha256: intake.afterAllOriginalFIRSTsSealed.sha256 },
  { id: 'supplement220', path: supplementPath, expectedCount: 24 },
  { id: 'affected220', path: supplement.affectedManifest.path, expectedCount: 20, expectedSha256: supplement.affectedManifest.sha256 }
];
const records = groups.map(group => {
  const bytes = readFileSync(group.path);
  const manifest = JSON.parse(bytes.toString('utf8'));
  const checks = manifest.bindings.map(binding => {
    const actual = readFileSync(binding.path);
    const actualSha256 = sha(actual);
    return { path: binding.path, expectedSha256: binding.sha256, actualSha256, bytes: actual.length, pass: actualSha256 === binding.sha256 };
  });
  const manifestSha256 = sha(bytes);
  const manifestBindingPass = group.expectedSha256 ? group.expectedSha256 === manifestSha256 : null;
  return {
    group: group.id,
    manifestPath: group.path,
    manifestSha256,
    expectedManifestSha256: group.expectedSha256 ?? null,
    manifestBindingPass,
    expectedCount: group.expectedCount,
    actualCount: checks.length,
    passingCount: checks.filter(check => check.pass).length,
    pass: checks.length === group.expectedCount && checks.every(check => check.pass) && manifestBindingPass !== false,
    checks
  };
});
const seals = readJson(join(root, 'FIRST-seals.json'));
const firstChecks = seals.seals.map(seal => {
  const path = join(root, seal.path);
  const bytes = readFileSync(path);
  const mode = (statSync(path).mode & 0o777).toString(8).padStart(4, '0');
  const actualSha256 = sha(bytes);
  return { path: seal.path, actualSha256, bytes: bytes.length, mode, pass: actualSha256 === seal.sha256 && bytes.length === seal.bytes && mode === '0444' };
});
const result = {
  schema: 'stemrobin188-independent-bound-input-check@1',
  phase,
  hashOnlyReadsAreNotPixelOpensOrSource220SemanticReReview: true,
  records,
  firstChecks,
  pass: records.every(record => record.pass) && firstChecks.every(check => check.pass)
};
writeFileSync(join(root, `bindings-${phase}.json`), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({ phase, pass: result.pass, groups: records.map(({ group, actualCount, passingCount, pass, manifestSha256 }) => ({ group, actualCount, passingCount, pass, manifestSha256 })), firstChecks }, null, 2));
if (!result.pass) process.exitCode = 1;
