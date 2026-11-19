import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';

const cwd = '/Users/yong/.codex/worktrees/d9b1/lemmadeck';
assert.equal(process.cwd(),cwd);
const root = '.intentfold/tickets/STEMROBIN-182/tmp/resume182-12/n37-answer-review';
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const read = path => { const bytes=fs.readFileSync(path); return {bytes,json:JSON.parse(bytes),sha256:hash(bytes)}; };
const freeze = read(`${root}/reports/source-first-freeze.json`);
const firstKey = read(`${root}/reports/first-key-open.json`);
const review = read(`${root}/reports/review-results.json`);
assert.equal(freeze.sha256,firstKey.json.freezeSha256);
assert.equal(freeze.sha256,review.json.hashes.sourceFirstFreezeSha256);
assert(new Date(freeze.json.frozenAt)<new Date(firstKey.json.firstOpenedAt));
assert.equal(freeze.json.answerKeyOpened,false);
for(const f of freeze.json.files) assert.equal(hash(fs.readFileSync(f.path)),f.sha256,`Frozen file changed: ${f.path}`);
const source = read(freeze.json.sourcePath);
const key = read(firstKey.json.keyPath);
const independent = read(`${root}/source-solutions/independent-n37-solutions.json`);
assert.equal(source.sha256,freeze.json.sourceSha256);
assert.equal(source.sha256,review.json.hashes.sourceExercisesSha256);
assert.equal(key.sha256,firstKey.json.keySha256);
assert.equal(key.sha256,review.json.hashes.reviewedAnswerKeySha256);
assert.equal(independent.sha256,review.json.hashes.frozenIndependentSolutionsSha256);
assert.equal(key.json.schema,'ld-s10y-answer/lesson-answers@1');
assert.equal(key.json.book,'7a');
assert.equal(key.json.lesson,'alg7-c4-s2-n37');
assert.equal(key.json.edition,'modern-us-neutral');
const ids = Array.from({length:22},(_,i)=>String(777+i));
assert.deepEqual(source.json.exercises.map(e=>e.number),ids);
assert.deepEqual(key.json.answers.map(a=>a.exercise),ids);
assert.deepEqual(independent.json.solutions.map(a=>a.exercise),ids);
assert.deepEqual(review.json.exercises.map(a=>a.exercise),ids);
let subquestions = 0;
for(let i=0;i<22;i++) {
  const sourceExercise=source.json.exercises[i],answer=key.json.answers[i],solution=independent.json.solutions[i],finding=review.json.exercises[i];
  assert.equal(answer.source,'derived');
  assert.equal(answer.grading,'ungraded');
  assert.deepEqual(answer.parts,[]);
  assert(!Object.hasOwn(answer,'bookRaw'));
  assert.equal(sourceExercise.source_number,solution.sourceNumber);
  assert.equal(sourceExercise.source_number,finding.sourceNumber);
  assert.equal(finding.result,'PASS');
  assert.deepEqual(finding.defects,[]);
  assert.equal(finding.comparedSubquestions,solution.answers.length);
  assert(finding.evidence.length>40);
  assert(answer.displayAnswer.length>0);
  assert.equal((sourceExercise.figure_refs||[]).length,0);
  assert.equal((sourceExercise.figures||[]).length,0);
  if(solution.answers.length>1) {
    for(let n=0;n<solution.answers.length;n++) {
      const label=`${String.fromCharCode(97+n)})`;
      assert(sourceExercise.text.includes(label));
      assert(answer.displayAnswer.includes(label));
    }
  }
  subquestions+=solution.answers.length;
}
assert.equal(subquestions,101);
assert.equal(review.json.comparedSubquestionCount,subquestions);
assert.equal(review.json.result,'PASS');
assert.equal(review.json.defectCount,0);
assert.equal(review.json.imagesOpened,0);
assert.equal(review.json.sourceImageCount,0);
const result = {
  schema:'review-evidence-verification@1',verifiedAt:new Date().toISOString(),cwd,result:'PASS',
  sourceFirstOrderVerified:true,frozenFilesUnchanged:true,reviewedSourceUnchanged:true,reviewedKeyUnchanged:true,
  exerciseCount:22,comparedSubquestions:subquestions,allKeysDerived:true,allKeysUngradedWithEmptyParts:true,bookRawCount:0,
  sourceImageCount:0,sourceFigureRefCount:0,imagesOpened:0,
  currentKeyStatus:key.json.status,
  mathematicalDecision:'All 101 source-first manual mathematical comparisons PASS; this script verifies evidence integrity and scope, not mathematical equivalence by itself.',
  hashes:{...review.json.hashes,reviewResultsSha256:review.sha256,firstKeyOpenSha256:firstKey.sha256},
  filesWrittenByThisRun:[`${root}/reports/evidence-verification.json`],
  finalizeRun:false,publishRun:false,suitesRun:false,pipelineRun:false,interactionProductionRun:false
};
fs.writeFileSync(`${root}/reports/evidence-verification.json`,`${JSON.stringify(result,null,2)}\n`,{flag:'wx'});
console.log(JSON.stringify(result,null,2));
