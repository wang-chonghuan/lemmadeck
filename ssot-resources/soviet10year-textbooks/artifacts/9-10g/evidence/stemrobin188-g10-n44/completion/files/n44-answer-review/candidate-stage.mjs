import fs from 'node:fs';
import { absolute, choice, answer, read, write, binding, sha, now } from '../n44-choice-review/audit-lib.mjs';

const candidatePath = '.intentfold/tickets/STEMROBIN-188/tmp/n44-answer-author/work/9-10g/modern-us-neutral/lessons/geo910-c2-s1-n44/answer-keys.template.json';
const expectedSha = '079c1a2d9ce935ca02b0e10438eb24f9158787391deaa21459952f2173e77173';
const reviewSeal = read(`${choice}/review.seal.json`);
for (const f of reviewSeal.files) if (sha(fs.readFileSync(f.path)) !== f.sha256) throw new Error('Choice review changed before candidate disclosure');
const candidateBytes = fs.readFileSync(absolute(candidatePath));
const actualSha = sha(candidateBytes);
if (actualSha !== expectedSha) throw new Error(`Candidate SHA mismatch: ${actualSha}`);
write(`${answer}/candidate.raw.json`, candidateBytes.toString('utf8'));
const bookAnswersPath = 'ssot-resources/soviet10year-textbooks/artifacts/9-10g/answers.json';
write(`${answer}/candidate-read-receipt.json`, {
  opened_at: now(), prior_choice_review_seal: binding(`${choice}/review.seal.json`),
  prior_independent_source_seal: binding(`${choice}/FIRST-source.seal.json`),
  candidate: binding(candidatePath), expected_sha256: expectedSha, matches_requested_sha256: true,
  retained_raw_candidate: binding(`${answer}/candidate.raw.json`),
  book_answers: { path: absolute(bookAnswersPath), exists: fs.existsSync(absolute(bookAnswersPath)), contents_read: false },
  scope: 'Only requested NEW current standard candidate; old answers/current core key/history not read. Same FIRST-source reused, not solved from candidate.',
});
console.log(JSON.stringify(JSON.parse(candidateBytes.toString('utf8')), null, 2));
