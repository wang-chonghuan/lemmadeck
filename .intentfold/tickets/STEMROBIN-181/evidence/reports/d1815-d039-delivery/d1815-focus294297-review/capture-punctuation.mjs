import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const out = path.dirname(fileURLToPath(import.meta.url));
const sha256 = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const comparisonPath = path.join(out, 'candidate-comparison.json');
const comparisonBytes = fs.readFileSync(comparisonPath);
if (sha256(comparisonBytes) !== '4cf6facc70c2604b290d45584d769f6f858cc8050ac6468183a76121c201275a') {
  throw new Error('Candidate comparison changed');
}
const comparison = JSON.parse(comparisonBytes);
const reportBytes = fs.readFileSync(comparison.prior_report.path);
if (sha256(reportBytes) !== comparison.prior_report.sha256) {
  throw new Error('Prior report changed');
}
const matches = JSON.parse(reportBytes).findings.filter((item) => item.id === 'S297-PUNCT-1');
if (matches.length !== 1) throw new Error('Expected one S297-PUNCT-1');
const existing = comparison.records.find((record) => record.prior_hold.id === 'S297-MATERIAL-HOLD');
const candidate = existing.current_candidate;
const currentBytes = fs.readFileSync(candidate.path);
if (sha256(currentBytes) !== candidate.file_sha256
    || currentBytes.toString('utf8').split('\n')[candidate.page_md_line - 1] !== candidate.literal_row) {
  throw new Error('Current SOURCE297 candidate changed');
}
const result = {
  schema: 'stemrobin-181/affected-punctuation-comparison@1',
  ticket: 'STEMROBIN-181',
  created_at: new Date().toISOString(),
  authorization: 'Direct user text clarification after four-HOLD comparison; no more images.',
  source_observation_ref: {
    path: path.join(out, 'source-only-freeze.json'),
    sha256: '7e972e5e7a6becaa4182b314452ea41fb59f1afee4add491c72838a88991343e',
    observation_id: '297-metal-names',
    literal_visible_segment: '铝和铁的逸出功比锌的大。',
  },
  prior_report: comparison.prior_report,
  prior_finding: matches[0],
  current_candidate: candidate,
  existing_candidate_comparison: {
    path: comparisonPath,
    sha256: sha256(comparisonBytes),
  },
  additional_image_views: 0,
};
const resultPath = path.join(out, 'punctuation-comparison.json');
fs.writeFileSync(resultPath, `${JSON.stringify(result, null, 2)}\n`, { flag: 'wx', mode: 0o444 });
console.log(JSON.stringify({
  path: resultPath,
  sha256: sha256(fs.readFileSync(resultPath)),
  bytes: fs.statSync(resultPath).size,
  current_candidate: candidate,
}, null, 2));
