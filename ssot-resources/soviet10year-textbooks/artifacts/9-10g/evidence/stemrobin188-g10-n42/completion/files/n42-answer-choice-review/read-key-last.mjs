import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
if (process.cwd() !== root) throw new Error('Unexpected cwd');
const out = path.join(root, '.intentfold/tickets/STEMROBIN-188/tmp/n42-answer-choice-review');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const expected = '48ac10746eca71b4dbc1442ac869b9c4ec9e5de583d51585964b79a41019484b';
const candidate = path.join(root, '.intentfold/tickets/STEMROBIN-188/tmp/n42-answer-author/work/9-10g/modern-us-neutral/lessons/geo910-c2-s1-n42/answer-keys.template.json');
const guards = ['FIRST-seal.json', 'PREKEY-seal.json', 'review.json', 'choice-comparison-receipt.json'];
const earlier = guards.map(name => ({
  path: path.join(out, name),
  sha256: hash(fs.readFileSync(path.join(out, name))),
}));
const openedAt = new Date().toISOString();
const bytes = fs.readFileSync(candidate);
if (hash(bytes) !== expected) throw new Error('Candidate hash does not match authorized key-last snapshot');
fs.writeFileSync(path.join(out, 'keys-read-receipt.json'), JSON.stringify({
  schema: 'n42-answer-key-last-read-receipt-v1',
  candidate,
  candidate_sha256: expected,
  opened_at: openedAt,
  earlier,
  chronology: 'FIRST source and PREKEY views/truth were sealed; current choice author comparison and strict review were completed; only then was this answer candidate opened for semantic review.',
  prior_answer_candidate_reads: 0,
  actual_mathlive_finalize_run: false,
}, null, 2) + '\n', { flag: 'wx', mode: 0o444 });
console.log(bytes.toString('utf8'));
