import fs from 'node:fs';
import { absolute, choice, read, write, binding, now, draftPath, sha } from './audit-lib.mjs';

const firstSeal = read(`${choice}/FIRST-source.seal.json`);
for (const input of firstSeal.files) {
  if (sha(fs.readFileSync(input.path)) !== input.sha256) throw new Error('FIRST evidence changed');
}
const capturedAt = now();
const bytes = fs.readFileSync(absolute(draftPath));
const views = JSON.parse(bytes.toString('utf8')).questions.map(question => question.view);
write(`${choice}/views-only.json`, views);
write(`${choice}/views-read-receipt.json`, {
  captured_at: capturedAt,
  prior_source_seal: binding(`${choice}/FIRST-source.seal.json`),
  draft_byte_binding: { path: absolute(draftPath), sha256: sha(bytes), bytes: bytes.length },
  projection: 'questions[].view only; no IDs/source selectors/intents/keys/rationales/coverage accessed',
  view_projection: binding(`${choice}/views-only.json`),
});
console.log(JSON.stringify(views, null, 2));
