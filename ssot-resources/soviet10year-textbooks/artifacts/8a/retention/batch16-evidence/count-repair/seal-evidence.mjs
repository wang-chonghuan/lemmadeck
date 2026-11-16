import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const directory = path.dirname(fileURLToPath(import.meta.url));
const repository = JSON.parse(readFileSync(path.join(directory, 'diagnosis.json'), 'utf8')).repository;
const resultPath = path.join(directory, 'final-evidence.json');
const protectedEvidence = JSON.parse(readFileSync(path.join(directory, 'protected-bytes.json'), 'utf8'));
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const changed = [];
const protectedFiles = Object.entries(protectedEvidence.before).map(([name, expected]) => {
  try {
    const bytes = readFileSync(path.join(repository, name));
    const actual = sha256(bytes);
    if (actual !== expected) changed.push(name);
    return { path: name, expected_sha256: expected, actual_sha256: actual, bytes: bytes.length };
  } catch (error) {
    changed.push(name);
    return { path: name, expected_sha256: expected, error: error.code ?? error.message };
  }
});
const files = readdirSync(directory).filter((name) => name !== 'final-evidence.json').sort().map((name) => {
  const file = path.join(directory, name);
  if (!statSync(file).isFile()) throw new Error(`Unexpected directory in diagnosis evidence: ${name}`);
  const bytes = readFileSync(file);
  return { path: name, bytes: bytes.length, sha256: sha256(bytes) };
});
const result = {
  schema: '8a-count-diagnosis/final-evidence@1',
  executed_at: new Date().toISOString(),
  repository,
  command: {
    executable: 'node',
    args: [path.relative(repository, fileURLToPath(import.meta.url))],
    scope: 'Hash-only preservation comparison and evidence manifest. No geometry or page-gate calls.',
  },
  protected_file_count: protectedFiles.length,
  protected_changed: changed,
  protected_files: protectedFiles,
  evidence_file_count_excluding_this_manifest: files.length,
  crop_png_count: files.filter((file) => file.path.endsWith('.png')).length,
  files,
  raw_ready: false,
};
writeFileSync(resultPath, `${JSON.stringify(result, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({
  path: resultPath,
  sha256: sha256(readFileSync(resultPath)),
  protected_file_count: protectedFiles.length,
  protected_changed: changed,
  evidence_file_count_excluding_this_manifest: files.length,
  crop_png_count: result.crop_png_count,
  diagnosis_sha256: files.find((file) => file.path === 'diagnosis.json').sha256,
}, null, 2));
if (changed.length) process.exitCode = 1;
