import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = '/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck';
const out = path.dirname(fileURLToPath(import.meta.url));
const sha256 = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const readBinding = (file) => {
  const bytes = fs.readFileSync(file);
  return {
    path: file,
    sha256: sha256(bytes),
    bytes: bytes.length,
    mode: (fs.statSync(file).mode & 0o777).toString(8),
  };
};
const expected = {
  'source-only-freeze.json': '7e972e5e7a6becaa4182b314452ea41fb59f1afee4add491c72838a88991343e',
  'image-opens-ledger.json': 'a33355f85fdaab374fa45b1468a45de46b45ad14d54fcfffdb891a747f0c0f46',
  'pixel-manifest.json': 'bf2ae8194c494aef7cd91d1ab5569b2eed5425044fd8e7021d1780ec0241e604',
};
const freezes = Object.entries(expected).map(([name, digest]) => {
  const binding = readBinding(path.join(out, name));
  if (binding.sha256 !== digest || binding.mode !== '444') {
    throw new Error(`Source freeze changed or writable: ${name}`);
  }
  return binding;
});
const manifest = JSON.parse(fs.readFileSync(path.join(out, 'pixel-manifest.json')));
for (const image of manifest.images) {
  if (readBinding(image.path).sha256 !== image.sha256) {
    throw new Error(`Pixels changed: ${image.path}`);
  }
}
const reportPath = path.join(
  root, '.intentfold/tickets/STEMROBIN-181/tmp/d1815-source294297-review/review.json',
);
const reportBytes = fs.readFileSync(reportPath);
const report = JSON.parse(reportBytes);
const ids = ['S294-QUOTE-HOLD', 'S296-TEXT-HOLD', 'S296-PUNCT-HOLD', 'S297-MATERIAL-HOLD'];
const findings = ids.map((id) => {
  const matches = report.findings.filter((finding) => finding.id === id);
  if (matches.length !== 1 || matches[0].judgment !== 'HOLD') {
    throw new Error(`Expected one prior HOLD: ${id}`);
  }
  return matches[0];
});
const records = findings.map((finding) => {
  if (finding.locations.length !== 1) throw new Error(finding.id);
  const location = finding.locations[0];
  const candidatePath = path.join(root, location.page_md_path);
  const bytes = fs.readFileSync(candidatePath);
  const rows = bytes.toString('utf8').split('\n');
  let block = 0;
  let blockLine = 0;
  let current;
  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];
    if (/^<!-- .* -->$/.test(row)) {
      block += 1;
      blockLine = 0;
    } else if (block > 0 && row.trim() !== '') {
      blockLine += 1;
      if (block === location.block && blockLine === location.line) {
        current = {
          path: candidatePath,
          page_md_line: index + 1,
          canonical_ref: location.canonical_ref,
          block,
          line: blockLine,
          literal_row: row,
          row_utf8_sha256: sha256(Buffer.from(row)),
          file_sha256: sha256(bytes),
          file_bytes: bytes.length,
        };
      }
    }
  }
  if (!current) throw new Error(`Missing candidate row: ${finding.id}`);
  return { prior_hold: finding, current_candidate: current };
});
const result = {
  schema: 'stemrobin-181/frozen-candidate-comparison@1',
  ticket: 'STEMROBIN-181',
  created_at: new Date().toISOString(),
  source_seal_verified_before_first_candidate_read_at: '2026-11-19T14:24:35Z',
  source_freezes: freezes,
  source_pixels: manifest.images,
  prior_report: {
    path: reportPath,
    sha256: sha256(reportBytes),
    bytes: reportBytes.length,
    other_findings_not_adjudicated: true,
  },
  records,
};
const resultPath = path.join(out, 'candidate-comparison.json');
fs.writeFileSync(resultPath, `${JSON.stringify(result, null, 2)}\n`, {
  flag: 'wx', mode: 0o444,
});
console.log(JSON.stringify({
  comparison: readBinding(resultPath),
  records: records.map(({ prior_hold, current_candidate }) => ({
    id: prior_hold.id, current_candidate,
  })),
}, null, 2));
