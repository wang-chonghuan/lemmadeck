import fs from 'node:fs';
import assert from 'node:assert/strict';
import { repo, ticket, read, bind } from './n42-native.mjs';

for (const input of read(`${ticket}/tmp/d1816-recovery/written-pipeline-inputs-d2012.json`)) {
  const source = `${repo}/ssot-resources/soviet10year-textbooks/artifacts/${input.book}/editions/modern-us-neutral/lessons/${input.card}/choice-set/review.json`;
  const review = read(source);
  assert(Array.isArray(review.figure_checks));
  const file = `${ticket}/tmp/d1816-d${input.firstStage + 1}-${input.name}-en-choice-review-inputs/reused-source-figure-observations.json`;
  const previous = `${file.slice(0, -5)}.incomplete-original.json`;
  fs.copyFileSync(file, previous, fs.constants.COPYFILE_EXCL);
  fs.writeFileSync(file, JSON.stringify({
    card: input.card,
    status: 'UNCHANGED_APPROVED_FIGURE_OBSERVATIONS_REUSED_NOT_ENGLISH_APPROVAL',
    source: bind(source),
    observations: review.figure_checks,
    previousIncompleteInput: bind(previous),
    inputRecovery: 'Use the actual s10y-choice-review-v1 figure_checks field; the initial missing-field input was not used for any independent review.',
    freshImageOpens: 0,
    sourceSolutionsAuthorKeysAndOptionReviewsExcluded: true,
  }, null, 2) + '\n');
  const retentionFile = `${ticket}/tmp/d1816-recovery/retain-d${input.firstStage + 6}-${input.name}-config.json`;
  const config = read(retentionFile);
  config.extraEvidence.push({
    path: previous, name: 'english-review/reused-source-figure-observations.incomplete-original.json',
  });
  fs.writeFileSync(retentionFile, JSON.stringify(config, null, 2) + '\n');
}
