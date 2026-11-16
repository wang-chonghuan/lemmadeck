import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const work = '.intentfold/tickets/STEMROBIN-181/tmp';
const read = async p => JSON.parse(await fs.readFile(p, 'utf8'));
const bind = async path => ({
  path, sha256: crypto.createHash('sha256').update(await fs.readFile(path)).digest('hex'),
});
const freeze = await read(`${work}/9p-t6-answer-freeze.json`);
assert.deepEqual(await bind(freeze.draft.path), freeze.draft);
const draft = await read(freeze.draft.path);
const independent = await read(`${work}/9p-t6-independent-source-solutions.json`);
const findings = [{
  id: 'F1', exercise: '2', field: '/answers/1/displayAnswer',
  severity: 'revise',
  evidence: 'The sample predicts sucrose-water tension increase over an unspecified suitable concentration range; the bounded primary lookup verified bibliography only, not concentration/temperature/data. The named range supplies no falsifiable conditions.',
  correction: 'Remove the unsupported direction claim. Preserve real adult-guided controlled measurement, candidate predictions distinguished from results, actual sigma comparison and honest incomplete status; do not replace experiment by imaginary/supplied observations.',
}];
await fs.writeFile(`${work}/9p-t6-answer-review-initial.json`, JSON.stringify({
  ticket: 'STEMROBIN-181', lesson: 'phy9-c1-s5-t6', status: 'revise',
  reviewer: 'Main, independent of Huygens author',
  order: 'Read all actual written tasks and recorded independent solutions before opening the author draft; then checked every display answer and bookRaw.',
  bindings: { draft: freeze.draft, authorFreeze: await bind(`${work}/9p-t6-answer-freeze.json`),
    independentSolutions: await bind(`${work}/9p-t6-independent-source-solutions.json`),
    modernExercises: freeze.source.modern_exercises },
  exercises: draft.answers.map(a => ({
    exercise: a.exercise, status: a.exercise === '2' ? 'revise' : 'pass',
    independentSolution: independent.solutions[a.exercise],
    evidence: {
      '1': 'Two distinct model examples, wet powder liquid bridges and freely equilibrating molten droplets; conditions and explanation supplied, not personal observations.',
      '2': 'Actual experiment/conditions/incomplete reporting preserved; only unsupported concentration-qualified prediction needs correction.',
      '3': 'Copper/silver/brass exactly match the wetting necessary condition; no sufficient-weld guarantee.',
      '4': 'Liquid-bridge capillary adhesion and possible viscous resistance, not universal vacuum explanation.',
      '5': 'Centre-low/periphery-high gives outward low-to-high-tension surface flow; no gasoline operation.',
      '6': 'Interrupted connected fine pores reduce upward supply to evaporating surface, conditional not universal.',
      '7': 'Density-matched immiscible free-drop sphere minimizes area; historical entity consistently declared.',
      '8': 'Area reduction and isolated equilibrated energy conversion yield rise; faithful bookRaw preserved.',
      '9': 'Two-interface4sigma/R, small-to-large and no equal-radius endpoint; genuine experiment not claimed as performed.',
      '10': 'Correct inverse height ratio146/55 times sigma ratio; no unique800 without matched properties; bookRaw unchanged.',
      '11': 'Conditional two-open-end upper-concave/lower-pinned-convex pressure jumps derive4pi*r*sigma/g; lower pinning is not inferred from wetting, no unique book mass claim.',
    }[a.exercise],
    grading: 'ungraded', parts: [],
  })),
  findings, primaryLookup: await bind(`${work}/9p-t6-sucrose-primary-evidence.json`),
  limits: 'Only answer2 requires affected correction. Ten other answer gates are complete and must not be repeated.',
}, null, 2) + '\n', { flag: 'wx' });
console.log('Initial answer gate:10PASS, t2 reviseF1; preserve exact draft and affected-only correction.');
