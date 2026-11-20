import fs from 'node:fs';
import { absolute, choice, read, write, binding, sha, now, draftPath, seedPath, digest } from './audit-lib.mjs';

const preKeySeal = read(`${choice}/pre-key.seal.json`);
for (const f of preKeySeal.files) if (sha(fs.readFileSync(f.path)) !== f.sha256) throw new Error('Pre-key evidence changed');
const bytes = fs.readFileSync(absolute(draftPath));
const receipt = read(`${choice}/views-read-receipt.json`);
if (sha(bytes) !== receipt.draft_byte_binding.sha256) throw new Error('Draft changed since views-only review');
write(`${choice}/draft.snapshot.json`, bytes.toString('utf8'));
write(`${choice}/seed.snapshot.json`, fs.readFileSync(absolute(seedPath), 'utf8'));
const draft = JSON.parse(bytes.toString('utf8'));
write(`${choice}/internals-read-receipt.json`, {
  opened_at: now(), prior_pre_key_seal: binding(`${choice}/pre-key.seal.json`),
  seed: binding(seedPath), draft: binding(draftPath),
  draft_digest: digest(draft), scope: 'Current new draft only; no author FIRST/private files/prior reports.',
});
console.log(JSON.stringify(draft, null, 2));
