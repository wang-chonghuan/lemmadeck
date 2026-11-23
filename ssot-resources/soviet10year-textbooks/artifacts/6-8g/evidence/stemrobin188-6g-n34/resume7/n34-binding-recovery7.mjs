import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';

const W = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188';
assert.equal(fs.realpathSync(process.cwd()), W);
const B = 'ssot-resources/soviet10year-textbooks/artifacts/6-8g';
const E = `${B}/editions/modern-us-neutral`;
const L = 'geo68-c3-s2-n34';
const R = `${B}/evidence/stemrobin188-6g-n34/resume7`;
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const original = '.intentfold/tickets/STEMROBIN-188/tmp/resume-n34-7.mjs';
fs.copyFileSync(original, `${R}/resume-n34-before-binding-recovery7.mjs`, fs.constants.COPYFILE_EXCL);
fs.writeFileSync(`${R}/answer-binding-first7.failure.json`, `${JSON.stringify({
  cwd: W, command: 'node', argv: [original, 'bind-answers'], exitCode: 1,
  error: "SyntaxError: Unexpected token 'F', \"Full appro\"... is not valid JSON",
  location: `${original}:214:90`,
  answerKeysAlreadyInstalled: 4,
  diagnosis: 'Approved JSON snapshots have one descriptive header line; no content failure.',
}, null, 2)}\n`, { flag: 'wx' });
const projectProse = value => value.prose.map(item => ({
  kind: item.kind, id: item.id, label: item.label, source_refs: item.source_refs,
  text: item.text.replace(/\s/g, ''),
}));
const projectExercises = value => value.exercises.map(item => ({
  number: item.number, pages: item.pages, text: item.text.replace(/\s/g, ''),
}));
const decode = (item, expectedHeader) => {
  const separator = item.text.indexOf('\n');
  assert.ok(separator > 0);
  assert.equal(item.text.slice(0, separator), expectedHeader);
  return JSON.parse(item.text.slice(separator + 1));
};
const lesson = read(`${E}/lessons/${L}/lesson.json`);
const exercises = read(`${E}/lessons/${L}/exercises.json`);
for (const id of ['tbl-p0160-01', 'fig-213']) {
  const spec = read(`${E}/figures/${id}.spec.json`);
  assert.equal(spec.source.authoritativeText.length, 2);
  const boundLesson = decode(spec.source.authoritativeText[0],
    'Full approved immutable lesson snapshot (b5d59fd5138f20eb015e380a0e5e378b5ba1833b003aba0604967fa543a59269):');
  const boundExercises = decode(spec.source.authoritativeText[1],
    'Full supplied exercise and original given-text snapshot (3f269c0542abfcc7dfbd3f4535a20d0ef714c0fff1df744db83eda9efefb670e):');
  assert.deepEqual(projectProse(boundLesson), projectProse(lesson));
  assert.deepEqual(projectExercises(boundExercises), projectExercises(exercises));
}
fs.writeFileSync(`${R}/native-context-binding7.json`, `${JSON.stringify({
  figures: 2, approvedProseEntries: 15, approvedExercises: 4,
  approvedWordsAndMathUnchanged: true, metadataAndWhitespaceOnly: true,
  rendererReplays: 0, independentReviewsRepeated: 0, imagesLoaded: 0,
  answerCandidateSha256: hash(`${B}/evidence/stemrobin188-6g-n34/answers-author7/candidate-answer-keys.json`),
  answerKeysInstalled: 4, answerFinalizationPending: true,
  recovery: 'Decode the declared header then parse the existing JSON snapshot; keys not rewritten.',
  originalFailure: `${R}/answer-binding-first7.failure.json`,
}, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({ binding: 'pass', answerKeysInstalled: 4, contentChanges: 0 }));
