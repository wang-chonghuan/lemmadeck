import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const work = '.intentfold/tickets/STEMROBIN-181/tmp';
const read = async path => JSON.parse(await fs.readFile(path, 'utf8'));
const bind = async path => ({
  path, sha256: crypto.createHash('sha256').update(await fs.readFile(path)).digest('hex'),
});
const viewStage = await read(`${work}/d016-choice-view-review-freeze.json`);
const sourceStage = await read(`${work}/d016-choice-source-review-freeze.json`);
const draftPath = `${work}/9p-t8-choice-draft.json`;
assert.deepEqual(await bind(draftPath), viewStage.draft);
const draft = await read(draftPath);
assert.deepEqual(draft.questions.map(({ id, source_numbers, view }) => ({ id, source_numbers, view })), viewStage.visible);
for (const question of draft.questions) {
  const checked = viewStage.questionReviews.find(review => review.question_id === question.id).mathematics;
  assert.deepEqual([...question.key.correct].sort(), [...checked.correct].sort());
  for (const rationale of question.key.rationales) {
    assert.equal(rationale.truth, checked.option_checks.find(option => option.option_id === rationale.option_id).truth);
  }
}
assert.equal(draft.new_figures.length, 0);
const digest = path => execFileSync('python3', [
  '.agents/skills/ld-s10y-choice/scripts/prepare.py', 'digest', path,
], { encoding: 'utf8' }).trim();
const review = {
  schema: 's10y-choice-review-v1',
  seed_sha256: digest(`${work}/9p-t8-choice-seed.json`),
  draft_sha256: digest(draftPath),
  reviewer: { kind: 'independent_agent', identity: 'Main, independently reviewing Zeno author snapshot' },
  source_reviews: sourceStage.sourceSolutions.map(source => ({
    ...source,
    coverage: {
      verdict: 'pass',
      evidence: `Complete source target retained by${draft.coverage.find(entry => entry.source_number === source.source_number).question_ids.join(',')}; source/view-first evidence:${viewStage.questionReviews[Number(source.source_number) - 1].task_fidelity.evidence} Recognition does not demonstrate independent written production, explicitly retained as a capacity loss while original written task remains.`,
    },
  })),
  figure_checks: sourceStage.figureObservations.map(({ figure_id, asset_path, asset_sha256, observation }) => ({
    figure_id, asset_path, asset_sha256, observation,
  })),
  new_figure_reviews: [],
  question_reviews: viewStage.questionReviews,
  outcome: 'pass',
};
await fs.writeFile(`${work}/9p-t8-choice-review.json`, JSON.stringify(review, null, 2) + '\n', { flag: 'wx' });
await fs.writeFile(`${work}/9p-t8-choice-author-comparison.json`, JSON.stringify({
  ticket: 'STEMROBIN-181', status: 'pass',
  review: await bind(`${work}/9p-t8-choice-review.json`), draft: await bind(draftPath),
  order: 'Original raw independent solutions and complete seed/images first; view-only fidelity/redundancy/leakage and44option true sets frozen before author intent/key/rationales were actually read. Comparison completes that same initial semantic gate.',
  sourceStage: await bind(`${work}/d016-choice-source-review-freeze.json`),
  viewStage: await bind(`${work}/d016-choice-view-review-freeze.json`),
  observations: [
    'All11source mappings and44author rationales actually read; complete correctsets match independent view-first sets. No omission beyond acknowledged written-production capacity loss.',
    'Anisotropy options distinguish preferredpolycrystal texture, isotropy counterexample andstressedamorphous material; glassprocessing rejects both guaranteedfailure andguaranteedsuccess.',
    'Saltcount2factor is used once; eightfactor option actually applies twofactor inthree directions; diagonal option is same-species distance, not the requested unlike-neighbor.',
    'Stress/strength and wire maximum-position alternatives retain bothsource targets. Misused averageheight halves or doubles results; missingg andwrongkmconversion produce printed distractors.',
    'Force optionc author uses incorrectcm2tom2 conversion rather than reviewer wrongdiameterconversion; both independently produce the same100fold incorrectnumericresult.',
    'Modulusoptions explicitly deriveareaunit, extensionunit anddivision errors; no true equivalentdistractor.',
    'Speedoptions independently deriveomittedfusion, mixedtemperatures andmissingkineticfactor2.',
    'Ice-mass options omit one ofthree heatstages each. Closevalues differ at stated displayedprecision; correctrounded.0332kg isnot .0337kg.',
    'Steam candidate explicitly roundsLto2.3e6 and gives17952J, not chapter2.26e6/17688J. Correctregime remains0C with1.6gice; premature1.8e4Jrounding falsely causes exactall-melt and liquidonly branch gives-.23C.',
  ],
  counts: { questions: 11, options: 44 },
  repeatedGate: false,
}, null, 2) + '\n', { flag: 'wx' });
const command = [
  '.agents/skills/ld-s10y-choice/scripts/validate.py', '--repo', '.',
  '--seed', `${work}/9p-t8-choice-seed.json`, '--draft', draftPath,
  '--review', `${work}/9p-t8-choice-review.json`,
];
const output = execFileSync('python3', command, { encoding: 'utf8' });
process.stdout.write(output);
await fs.writeFile(`${work}/9p-t8-choice-review-validation.json`, JSON.stringify({
  command, output, status: 'pass', reviewerValidationRuns: 1,
  scope: 'Structural agreement/freshness check with the completed initial independent semantic review, not a second semantic gate.',
}, null, 2) + '\n', { flag: 'wx' });
