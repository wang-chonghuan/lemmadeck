import { readFileSync, writeFileSync, readdirSync, statSync, chmodSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isDeepStrictEqual } from 'node:util';

const root = dirname(fileURLToPath(import.meta.url));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const readJson = name => JSON.parse(readFileSync(join(root, name), 'utf8'));
const before = readJson('bindings-before.json');
const after = readJson('bindings-after.json');
if (!before.pass || !after.pass || !isDeepStrictEqual(before.records, after.records)) {
  throw new Error('Input bindings did not remain frozen');
}
const seals = readJson('FIRST-seals.json');
for (const seal of seals.seals) {
  const path = join(root, seal.path);
  const bytes = readFileSync(path);
  if (sha(bytes) !== seal.sha256 || bytes.length !== seal.bytes || (statSync(path).mode & 0o777) !== 0o444) {
    throw new Error(`FIRST seal mismatch: ${seal.path}`);
  }
}
const sourceReview = readJson('source222223-review.json');
const affectedReview = readJson('source220-delimiter-affected-review.json');
const frozenDiff = readJson('source220-one-glyph-frozen-diff.json');
const images = readJson('image-ledger.json');
if (sourceReview.FAIL.length || affectedReview.currentAffectedFAIL.length ||
    !isDeepStrictEqual(affectedReview.acceptedFindingIds, ['F220-CLOSING-PAREN']) ||
    !frozenDiff.pass || images.batchLoaded !== 7 || images.contextLoaded !== 7 ||
    images.source220ImagesAdded !== 0) {
  throw new Error('Receipt consistency mismatch');
}
const excluded = new Set(['output-index.json', 'output-index.sha256']);
const names = readdirSync(root).filter(name => !excluded.has(name)).sort();
const outputs = names.map(path => {
  const full = join(root, path);
  if (!statSync(full).isFile()) throw new Error(`Unexpected non-file owned output: ${path}`);
  const bytes = readFileSync(full);
  if (path.endsWith('.json')) JSON.parse(bytes.toString('utf8'));
  return { path, sha256: sha(bytes), bytes: bytes.length };
});
const report = readJson('report.json');
for (const citation of [
  ...report.separateVerdicts,
  report.FIRSTSeals,
  report.bindings.before,
  report.bindings.after,
  report.images.ledger,
  report.oneGlyphFrozenDiff
]) {
  const match = outputs.find(output => output.path === citation.path);
  if (!match || match.sha256 !== citation.sha256) throw new Error(`Report citation mismatch: ${citation.path}`);
}
const index = {
  schema: 'stemrobin188-independent-output-index@1',
  ticket: 'STEMROBIN-188',
  assignment: 'SAME188-6',
  outputRoot: root,
  scope: 'Source222223 independent FIRST review plus only F220-CLOSING-PAREN affected review',
  parentMustCollectAndCLOSEReviewerBeforeReading: true,
  returnImagePayload: false,
  selfExcluded: [...excluded],
  selfExclusionReason: 'Index self-excluded; its separate digest file also excluded to avoid circular hashing.',
  outputs
};
const indexBytes = Buffer.from(JSON.stringify(index, null, 2) + '\n');
const digest = sha(indexBytes);
writeFileSync(join(root, 'output-index.json'), indexBytes);
writeFileSync(join(root, 'output-index.sha256'), `${digest}  output-index.json\n`);
for (const name of [...names, ...excluded]) chmodSync(join(root, name), 0o444);
for (const output of outputs) {
  const bytes = readFileSync(join(root, output.path));
  if (sha(bytes) !== output.sha256 || bytes.length !== output.bytes) throw new Error(`Output changed: ${output.path}`);
}
if (sha(readFileSync(join(root, 'output-index.json'))) !== digest) throw new Error('External index digest mismatch');
console.log(JSON.stringify({ indexedOutputs: outputs.length, totalOwnedFiles: outputs.length + excluded.size, allOwnedFilesSealed0444: true, externalIndexSha256: digest, parentMustCollectAndCLOSEReviewerBeforeReading: true }, null, 2));
