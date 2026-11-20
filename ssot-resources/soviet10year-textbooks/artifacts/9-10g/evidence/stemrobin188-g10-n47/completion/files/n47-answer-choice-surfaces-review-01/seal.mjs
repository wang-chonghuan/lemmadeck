import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const cwd = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
const root = path.join(cwd, '.intentfold/tickets/STEMROBIN-188/tmp/n47-answer-choice-surfaces-review-01');
if (process.cwd() !== cwd) throw new Error('Wrong cwd');
const phase = process.argv[2];
if (!['1', '2'].includes(phase)) throw new Error('Use 1 or 2');
const name = phase === '1' ? 'source-solutions-FIRST.json' : 'visible-FIRST.json';
const p = path.join(root, name);
const bytes = fs.readFileSync(p);
const value = JSON.parse(bytes);
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
let previous = null;
if (phase === '2') {
  previous = JSON.parse(fs.readFileSync(path.join(root, 'phase1-seal.json'), 'utf8'));
  if (sha(fs.readFileSync(previous.artifact.path)) !== previous.artifact.sha256) throw new Error('Phase1 seal changed');
}
const receipt = {
  phase: Number(phase),
  status: 'sealed',
  artifact: { path: p, sha256: sha(bytes), bytes: bytes.length },
  internal_keys_or_author_reports_interpreted_before_seal: false,
  prior_seal: previous ? { path: path.join(root, 'phase1-seal.json'), sha256: sha(fs.readFileSync(path.join(root, 'phase1-seal.json'))) } : null,
  evidence_count: phase === '1' ? value.exercises.length : value.question_reviews.length,
  image_loads_at_seal: phase === '1' ? 2 : value.image_loads_at_seal
};
fs.writeFileSync(path.join(root, `phase${phase}-seal.json`), JSON.stringify(receipt, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify(receipt, null, 2));
