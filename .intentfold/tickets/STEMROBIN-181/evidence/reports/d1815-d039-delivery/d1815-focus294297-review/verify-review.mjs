import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const out = path.dirname(fileURLToPath(import.meta.url));
const sha256 = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const load = (file) => JSON.parse(fs.readFileSync(file));
const reviewPath = path.join(out, 'review.json');
const review = load(reviewPath);
for (const binding of Object.values(review.bindings)) {
  const file = path.resolve(out, binding.path);
  if (sha256(fs.readFileSync(file)) !== binding.sha256) {
    throw new Error(`Binding changed: ${file}`);
  }
  if (binding.mode && (fs.statSync(file).mode & 0o777).toString(8) !== binding.mode) {
    throw new Error(`Freeze permissions changed: ${file}`);
  }
}
const manifest = load(path.join(out, review.bindings.pixel_manifest.path));
for (const image of manifest.images) {
  if (sha256(fs.readFileSync(image.path)) !== image.sha256) {
    throw new Error(`Source/crop bytes changed: ${image.path}`);
  }
}
const comparison = load(path.join(out, review.bindings.candidate_comparison.path));
const punctuation = load(path.join(out, review.bindings.punctuation_comparison.path));
const observations = load(path.join(out, review.bindings.source_only_freeze.path)).observations;
const ledger = load(path.join(out, review.bindings.image_opens_ledger.path));
if (ledger.context_loads.length !== 7 || ledger.reopens !== 0) {
  throw new Error('Image ledger mismatch');
}
const candidateRecords = [
  ...comparison.records.map((record) => ({
    id: record.prior_hold.id, candidate: record.current_candidate,
  })),
  { id: punctuation.prior_finding.id, candidate: punctuation.current_candidate },
];
for (const record of candidateRecords) {
  const candidate = record.candidate;
  const bytes = fs.readFileSync(candidate.path);
  if (sha256(bytes) !== candidate.file_sha256
      || bytes.toString('utf8').split('\n')[candidate.page_md_line - 1] !== candidate.literal_row) {
    throw new Error(`Candidate changed: ${record.id}`);
  }
  const finding = review.findings.find((item) => item.id === record.id);
  if (!finding || !observations.some((item) => item.id === finding.source_observation_id)) {
    throw new Error(`Missing source-bound finding: ${record.id}`);
  }
  if (finding.location.block !== candidate.block
      || finding.location.line !== candidate.line
      || finding.location.page_md_line !== candidate.page_md_line) {
    throw new Error(`Location drift: ${record.id}`);
  }
}
const byId = Object.fromEntries(review.findings.map((finding) => [finding.id, finding]));
if (byId['S294-QUOTE-HOLD'].judgment !== 'HOLD'
    || byId['S296-TEXT-HOLD'].judgment !== 'PASS'
    || byId['S296-PUNCT-HOLD'].judgment !== 'PASS'
    || byId['S297-MATERIAL-HOLD'].judgment !== 'PASS'
    || byId['S297-PUNCT-1'].judgment !== 'FAIL') {
  throw new Error('Unexpected dispositions');
}
const correction = byId['S297-PUNCT-1'].required_correction;
if (punctuation.current_candidate.literal_row.replace(correction.replace, correction.with)
    !== correction.exact_replacement_row) {
  throw new Error('Correction does not match exact captured row');
}
console.log(JSON.stringify({
  binding_verification: 'PASS',
  source_and_crop_hashes_current: true,
  readonly_freezes_intact: true,
  candidate_hashes_current: true,
  review: { path: reviewPath, sha256: sha256(fs.readFileSync(reviewPath)) },
  dispositions: review.judgments,
  context_image_views: ledger.context_loads.length,
}, null, 2));
