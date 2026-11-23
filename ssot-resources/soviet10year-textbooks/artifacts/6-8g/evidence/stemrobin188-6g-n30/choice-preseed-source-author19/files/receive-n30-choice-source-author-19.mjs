import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { repo, tmp, read, hash, bind } from './retain-scoped-evidence-02.mjs';
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs';

assert.equal(process.cwd(), repo);
const root = path.join(tmp, 'n30-choice-source-solver-author-19');
const manifestFile = path.join(root, 'MANIFEST.json');
const sourceFile = path.join(root, 'SOURCE-SOLVED.md');
assert.equal(hash(manifestFile), '87b36e0d8d9ab9cc5df080c20aa6aa4caac674d8b7d5a8e84fd70c4b7a37d6c5');
assert.equal(hash(sourceFile), 'f9af22ebf34fb725249cf784df460b33760bdd630e69606784a2026d89cc5c39');
assert.equal(fs.statSync(sourceFile).mode & 0o777, 0o444);
const manifest = read(manifestFile);
assert.equal(manifest.status, 'SOURCE_SOLVED_SEALED_PRESEED_ONLY');
assert.equal(manifest.coverage.length, 8);
assert.equal(manifest.seal.option_work_started, false);
assert.equal(hash(manifest.input.path), manifest.input.sha256);
console.log(JSON.stringify(retainCurrent6g(
  'evidence/stemrobin188-6g-n30/choice-preseed-source-author19',
  [bind(manifestFile), bind(sourceFile), manifest.input,
    bind(path.join(tmp, 'prepare-n30-choice-source-solving-19.mjs')),
    bind(path.join(tmp, 'receive-n30-choice-source-author-19.mjs'))],
  ['evidence/stemrobin188-6g-n30/text-author-first18/retention.json'],
  { status: manifest.status, sourceSolvingAuthorOnly: true, officialSeedPending: true,
    source378QualifiedInterpretationsPreserved: true, counters: manifest.counters,
    numericVerification: 'Manifest and tool history report 89 cases; no separate raw-stream files were returned. Not independently rerun or used as review.',
    existingFIRSTReusedOnMatchingSeed: true, noOptionsOrChoiceReview: true },
)));
