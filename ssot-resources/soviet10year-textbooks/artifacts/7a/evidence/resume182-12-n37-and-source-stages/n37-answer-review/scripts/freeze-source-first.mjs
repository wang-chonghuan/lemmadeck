import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';

const cwd = '/Users/yong/.codex/worktrees/d9b1/lemmadeck';
assert.equal(process.cwd(),cwd);
const base = '.intentfold/tickets/STEMROBIN-182/tmp/resume182-12';
const root = `${base}/n37-answer-review`;
const source = `${base}/n37-source-stage-affected/artifacts/7a/editions/modern-us-neutral/lessons/alg7-c4-s2-n37/exercises.json`;
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const sourceBytes = fs.readFileSync(source);
const sourceJson = JSON.parse(sourceBytes);
const solutions = `${root}/source-solutions/independent-n37-solutions.json`;
const solutionBytes = fs.readFileSync(solutions);
assert.equal(hash(sourceBytes),JSON.parse(solutionBytes).sourceSha256);
assert.equal(sourceJson.exercises.length,22);
const questions = sourceJson.exercises.map(e=>({exercise:e.number,sourceNumber:e.source_number,text:e.text,figureRefsCount:(e.figure_refs||[]).length,figuresCount:(e.figures||[]).length}));
assert(questions.every(e=>e.figureRefsCount===0 && e.figuresCount===0));
assert(questions.every(e=>!/!\[[^\]]*\]\(|<img\b/i.test(e.text)));
const snapshot = `${root}/source-solutions/modern-question-snapshot.json`;
fs.writeFileSync(snapshot,`${JSON.stringify({source,sourceSha256:hash(sourceBytes),questions},null,2)}\n`,{flag:'wx'});
const frozenPaths = [solutions,snapshot,`${root}/reports/independent-arithmetic.json`,`${root}/scripts/independent-arithmetic.mjs`,`${root}/scripts/freeze-source-first.mjs`];
const evidence = {
  schema:'source-first-freeze@1',ticket:'STEMROBIN-182',lesson:'alg7-c4-s2-n37',cwd,
  frozenAt:new Date().toISOString(),sourcePath:source,sourceSha256:hash(sourceBytes),
  answerKeyOpened:false,authorOutputOpened:false,choicesOpened:false,oldAnswersOpened:false,bookScansOpened:false,
  imagesOpened:0,sourceImageCount:0,sourceFigureRefCount:0,
  exerciseCount:22,sourceNumberExceptions:{786:'736',787:'737',788:'738'},
  files:frozenPaths.map(path=>({path,sha256:hash(fs.readFileSync(path))})),
  rule:'All solutions and arithmetic verification completed before opening the current key. Freeze is hash-attested and these files will not be edited during comparison.'
};
fs.writeFileSync(`${root}/reports/source-first-freeze.json`,`${JSON.stringify(evidence,null,2)}\n`,{flag:'wx'});
console.log(JSON.stringify({...evidence,freezeEvidenceSha256:hash(fs.readFileSync(`${root}/reports/source-first-freeze.json`))},null,2));
